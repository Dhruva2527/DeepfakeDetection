# TruthLens AI — deepfake & media-manipulation detection frontend

A light-themed React + Vite frontend for an AI deepfake detection platform. It uploads images
(or MP4 video where supported) to a **separate Python backend** that serves a trained PyTorch
model, and renders the prediction that backend actually returns.

No paid APIs. No third-party AI inference services. No secrets in frontend code.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Landing page — hero, feature cards, technology section |
| `/analyze` | Analysis workspace — upload, live processing stages, results |
| `/how-it-works` | Three-step walkthrough plus a plain-language technical overview |
| `/about` | Project overview, live model configuration, dataset, responsible use |

## Getting started

```bash
npm install
npm run dev
```

## Backend configuration

The backend URL is configurable through an environment variable (see `.env.example`):

```bash
VITE_DETECTION_API_URL=http://127.0.0.1:5000
```

Defaults to `http://127.0.0.1:5000` when unset.

### Expected endpoints

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/api/health` | Readiness, model name/version, `video_supported` |
| `POST` | `/api/predict/image` | `multipart/form-data`, field `file` |
| `POST` | `/api/predict/video` | Optional — only when video inference is implemented |

Example response the frontend understands:

```json
{
  "prediction": "fake",
  "confidence": 0.92,
  "model_name": "truthlens-classifier",
  "model_version": "0.1",
  "processing_time_ms": 640,
  "explanation": "Optional human-readable note."
}
```

`prediction` is mapped to a verdict: labels containing *real / authentic / genuine* →
**Likely Real**, labels containing *fake / manipulated / generated / synthetic* →
**Potentially Manipulated**, anything else → **Unable to Determine**. `confidence` is accepted
either as a `0–1` fraction or a `0–100` percentage, and is only displayed when the backend sends it.

## Project structure

```
src/
  components/        reusable UI (nav, footer, home sections, workspace panels)
  pages/             Landing, Analyze, HowItWorks, About
  services/          detectionService.js — backend URL, validation, prediction, health
  hooks/             useDetection.js (health + analysis state), useMediaPreview.js
  utils/             formatting helpers and plain-text report builder
```

## Privacy notes

- Media is sent only to the backend endpoint configured above; this interface stores no copy.
- Object URLs for previews are revoked when a file is replaced or the page unmounts.
- Analysis results live in browser state for the current session only.
- Retention behaviour on the backend itself must be verified independently before relying on it.

## Limitations

Results are model predictions, not proof. Confidence values are raw model outputs, not calibrated
probabilities. No accuracy, dataset-size or benchmark figures are claimed anywhere in this app —
those are published only once they come from evaluation on unseen test data.