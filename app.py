import os, tempfile

import time
from io import BytesIO
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from detector import predict_image, predict_video, device

app = FastAPI(title="AI Content Detector")

# Allow the React dev server (another port) to call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_methods=["*"],
    allow_headers=["*"],
)

IMAGE_EXTS = {".jpg", ".jpeg", ".png"}   # the frontend only sends these
MODEL_NAME = "EfficientNet-B0 AI-vs-real detector"

# The frontend calls this to show "Backend online"
@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "model_name": MODEL_NAME,
        "model_version": "3",
        "framework": "PyTorch",
        "device": device,
        "video_supported": True,   # we'll switch this on when we add video
    }

# The frontend uploads the image here
@app.post("/api/predict/image")
async def predict_image_route(file: UploadFile = File(...)):
    ext = Path(file.filename or "").suffix.lower()
    if ext not in IMAGE_EXTS:
        raise HTTPException(415, "Upload a JPG or PNG image.")

    data = await file.read()
    try:
        img = Image.open(BytesIO(data))
    except Exception:
        raise HTTPException(422, "Could not read this image.")

    start = time.time()
    p_ai = predict_image(img)["ai_probability"]

    # The frontend wants a label plus the confidence in THAT label
    if p_ai >= 0.6:
        prediction, confidence = "fake", p_ai
    elif p_ai <= 0.4:
        prediction, confidence = "real", 1 - p_ai
    else:
        prediction, confidence = "uncertain", max(p_ai, 1 - p_ai)

    return {
        "prediction": prediction,
        "confidence": round(confidence, 4),
        "model_name": MODEL_NAME,
        "model_version": "3",
        "processing_time_ms": int((time.time() - start) * 1000),
    }
    
    # Same label rules as images, in one place
def to_label(p_ai):
    if p_ai >= 0.6:
        return "fake", p_ai
    if p_ai <= 0.4:
        return "real", 1 - p_ai
    return "uncertain", max(p_ai, 1 - p_ai)

@app.post("/api/predict/video")
async def predict_video_route(file: UploadFile = File(...)):
    ext = Path(file.filename or "").suffix.lower()
    if ext != ".mp4":
        raise HTTPException(415, "Upload an MP4 video.")

    data = await file.read()
    if len(data) > 50 * 1024 * 1024:
        raise HTTPException(413, "Video must be 50 MB or smaller.")

    # OpenCV needs a real file on disk, so save a temporary copy
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
        tmp.write(data)
        tmp_path = tmp.name

    start = time.time()
    try:
        result = predict_video(tmp_path)
    except ValueError as e:
        raise HTTPException(422, str(e))
    finally:
        os.remove(tmp_path)   # always delete the temporary copy

    prediction, confidence = to_label(result["ai_probability"])
    return {
        "prediction": prediction,
        "confidence": round(confidence, 4),
        "model_name": MODEL_NAME,
        "model_version": "3",
        "processing_time_ms": int((time.time() - start) * 1000),
        "frames_checked": result["frames_checked"],
    }