import cv2
import torch
import torch.nn as nn
from PIL import Image
from torchvision import models, transforms

MODEL_PATH = "models/detector_v3_e3.pt"
device = "cuda" if torch.cuda.is_available() else "cpu"

# Prepare images exactly the way we did in Colab
tf = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

# Rebuild the same model shape, then load your trained weights into it
def load_model():
    m = models.efficientnet_b0(weights=None)
    m.classifier[1] = nn.Linear(m.classifier[1].in_features, 2)
    ckpt = torch.load(MODEL_PATH, map_location=device)
    m.load_state_dict(ckpt["state_dict"])
    return m.to(device).eval()

model = load_model()

# Turn the probability into a sentence a person can read
def verdict(p_ai):
    if p_ai >= 0.6:
        return "Likely AI-generated"
    if p_ai <= 0.4:
        return "Likely real"
    return "Uncertain"

# Judge one image. Class 0 = fake (AI), class 1 = real.
def predict_image(img):
    x = tf(img.convert("RGB")).unsqueeze(0).to(device)
    with torch.no_grad():
        probs = torch.softmax(model(x), dim=1)[0]
    p_ai = probs[0].item()
    return {"ai_probability": round(p_ai, 4), "verdict": verdict(p_ai)}

# Judge a video: sample 16 frames, score each one, average the results
def predict_video(path, n_frames=16):
    cap = cv2.VideoCapture(path)
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if total <= 0:
        cap.release()
        raise ValueError("Could not read this video.")

    # Pick evenly spaced frame numbers across the whole video
    idxs = sorted(set(int(i * (total - 1) / (n_frames - 1)) for i in range(n_frames)))

    frames = []
    for i in idxs:
        cap.set(cv2.CAP_PROP_POS_FRAMES, i)
        ok, frame = cap.read()
        if ok:
            # OpenCV gives colors in BGR order; our model expects RGB
            frames.append(Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)))
    cap.release()

    if not frames:
        raise ValueError("No frames could be read from this video.")

    probs = [predict_image(im)["ai_probability"] for im in frames]
    mean_p = sum(probs) / len(probs)
    return {
        "ai_probability": round(mean_p, 4),
        "frames_checked": len(probs),
        "per_frame": [round(p, 3) for p in probs],
    }