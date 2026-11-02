import re
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

NAME = "mild-rgb/eli5-human-vs-ai-detector"

# Download (first time only) and load the detector
tok = AutoTokenizer.from_pretrained(NAME)
model = AutoModelForSequenceClassification.from_pretrained(NAME).eval()

def check_text(text):
    text = re.sub(r"\s+", " ", text).strip()   # same preprocessing as training
    n = len(text.split())
    if n < 100:
        return {"verdict": "too_short", "words": n}
    enc = tok(text, truncation=True, max_length=2048, return_tensors="pt")
    with torch.no_grad():
        p_ai = model(**enc).logits.softmax(-1)[0, 1].item()
    return {
        "verdict": "ai" if p_ai >= 0.5 else "human",
        "ai_probability": round(p_ai, 4),
        "words": n,
    }