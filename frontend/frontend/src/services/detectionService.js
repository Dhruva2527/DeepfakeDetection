/**
 * TruthLens AI — detection backend service.
 *
 * All inference happens on a separate Python backend (Flask or FastAPI) that
 * serves the trained PyTorch model. This module never calls a paid API or a
 * third-party AI inference service, and it holds no secrets.
 *
 * Backend URL is configurable:
 *   VITE_DETECTION_API_URL=http://127.0.0.1:5000
 *
 * Endpoints used:
 *   GET  /api/health        — readiness, model name, video support
 *   POST /api/predict/image — multipart field "file"
 *   POST /api/predict/video — multipart field "file" (only where implemented)
 */

const DEFAULT_BASE_URL = 'http://127.0.0.1:5000';

export const BACKEND_URL = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_DETECTION_API_URL) ||
  DEFAULT_BASE_URL
).replace(/\/+$/, '');

export const ENDPOINTS = {
  health: `${BACKEND_URL}/api/health`,
  image: `${BACKEND_URL}/api/predict/image`,
  video: `${BACKEND_URL}/api/predict/video`,
};

export const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
export const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png'];
export const VIDEO_TYPES = ['video/mp4'];
export const VIDEO_EXTENSIONS = ['mp4'];

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

const HEALTH_TIMEOUT_MS = 6000;
const PREDICT_TIMEOUT_MS = 120000;

export const LIMITATIONS =
  'A prediction is a model output, not proof. Deepfake detectors can be wrong, and confidence scores are not calibrated probabilities of authenticity.';

export class DetectionError extends Error {
  constructor(message, code = 'unknown') {
    super(message);
    this.name = 'DetectionError';
    this.code = code;
  }
}

const mb = (bytes) => `${Math.round(bytes / (1024 * 1024))} MB`;

function extensionOf(name = '') {
  const parts = String(name).toLowerCase().split('.');
  return parts.length > 1 ? parts.pop() : '';
}

/** Validate a candidate file before it is sent anywhere. */
export function validateFile(file, { videoSupported = false } = {}) {
  if (!file) {
    return { ok: false, kind: null, error: 'Choose a file to analyze.' };
  }

  const extension = extensionOf(file.name);
  const isImage = IMAGE_TYPES.includes(file.type) || IMAGE_EXTENSIONS.includes(extension);
  const isVideo = VIDEO_TYPES.includes(file.type) || VIDEO_EXTENSIONS.includes(extension);

  if (isImage) {
    if (file.size <= 0) {
      return { ok: false, kind: 'image', error: 'This image file appears to be empty.' };
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return {
        ok: false,
        kind: 'image',
        error: `Images must be ${mb(MAX_IMAGE_BYTES)} or smaller. This file is ${mb(file.size)}.`,
      };
    }
    return { ok: true, kind: 'image', error: null };
  }

  if (isVideo) {
    if (!videoSupported) {
      return {
        ok: false,
        kind: 'video',
        error:
          'Video analysis is available only when the connected backend reports video inference support. Use an image for now.',
      };
    }
    if (file.size > MAX_VIDEO_BYTES) {
      return {
        ok: false,
        kind: 'video',
        error: `Videos must be ${mb(MAX_VIDEO_BYTES)} or smaller. This file is ${mb(file.size)}.`,
      };
    }
    return { ok: true, kind: 'video', error: null };
  }

  return {
    ok: false,
    kind: null,
    error: 'Unsupported file type. Upload a JPG, JPEG or PNG image — or an MP4 video where video inference is supported.',
  };
}

async function readPayload(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function request(url, { method = 'GET', body, timeout = PREDICT_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  let response;
  try {
    response = await fetch(url, {
      method,
      body,
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
  } catch (error) {
    if (error && error.name === 'AbortError') {
      throw new DetectionError(
        'The analysis backend did not respond in time. Check that it is running, then retry.',
        'timeout',
      );
    }
    throw new DetectionError(
      `Could not reach the analysis backend at ${BACKEND_URL}. Start the backend or update the configured URL, then retry.`,
      'offline',
    );
  } finally {
    clearTimeout(timer);
  }

  const payload = await readPayload(response);

  if (!response.ok) {
    const detail = payload && (payload.error || payload.detail || payload.message);
    if (response.status === 404) {
      throw new DetectionError('This endpoint is not implemented on the running backend yet.', 'unsupported');
    }
    if (response.status === 413) {
      throw new DetectionError('The backend rejected the file as too large.', 'too_large');
    }
    if (response.status === 415) {
      throw new DetectionError('The backend does not accept this file format.', 'invalid_format');
    }
    throw new DetectionError(
      detail || `The backend returned an error (status ${response.status}).`,
      'server',
    );
  }

  if (!payload || typeof payload !== 'object') {
    throw new DetectionError('The backend returned a response this interface could not read.', 'invalid_response');
  }

  return payload;
}

const VERDICTS = {
  real: {
    key: 'real',
    label: 'Likely Real',
    tone: 'success',
    explanation:
      'The model’s output leans toward this media being authentic. That is a statistical indication drawn from the visual patterns it was trained on, not a guarantee.',
  },
  manipulated: {
    key: 'manipulated',
    label: 'Potentially Manipulated',
    tone: 'warning',
    explanation:
      'The model detected visual patterns associated with AI generation or manipulation. Treat this as a signal to look closer — it is not proof that the media was altered.',
  },
  inconclusive: {
    key: 'inconclusive',
    label: 'Unable to Determine',
    tone: 'info',
    explanation:
      'The model’s output was not decisive for this file. No reliable conclusion about authenticity can be drawn from this result.',
  },
};

function verdictFor(rawLabel) {
  const value = String(rawLabel ?? '').toLowerCase().trim();
  if (!value) return null;
  if (/(unreal|fake|manipulat|deepfake|synthetic|artificial|generated|forged|tamper)/.test(value)) {
    return 'manipulated';
  }
  if (/(real|authentic|genuine|bonafide|bona fide|original|natural)/.test(value)) {
    return 'real';
  }
  if (/(uncertain|unknown|inconclusive|undetermined|undecided|n\/a)/.test(value)) {
    return 'inconclusive';
  }
  return null;
}

function toPercent(value) {
  if (value === null || value === undefined || value === '') return null;
  const numeric = typeof value === 'string' ? Number.parseFloat(value.replace('%', '')) : Number(value);
  if (!Number.isFinite(numeric)) return null;
  const percent = numeric >= 0 && numeric <= 1 ? numeric * 100 : numeric;
  if (percent < 0 || percent > 100) return null;
  return Math.round(percent * 10) / 10;
}

function normalizeResult(payload, { file, kind, elapsedMs }) {
  const nested = payload.result && typeof payload.result === 'object' ? payload.result : null;
  const source = nested ? { ...payload, ...nested } : payload;

  const verdictKey = verdictFor(source.prediction ?? source.label ?? source.class ?? source.verdict) ?? 'inconclusive';
  const verdict = VERDICTS[verdictKey];

  const confidence = toPercent(
    source.confidence ?? source.confidence_percent ?? source.probability ?? source.score ?? null,
  );

  const modelName =
    (source.model && typeof source.model === 'object' ? source.model.name : source.model) ??
    source.model_name ??
    null;
  const modelVersion =
    (source.model && typeof source.model === 'object' ? source.model.version : null) ??
    source.model_version ??
    null;

  const rawMs = Number(source.processing_time_ms);
  const processingMs = Number.isFinite(rawMs) && rawMs >= 0 ? Math.round(rawMs) : null;

  return {
    verdict: verdict.key,
    label: verdict.label,
    tone: verdict.tone,
    explanation: source.explanation || source.details || verdict.explanation,
    confidence,
    model: modelName,
    modelVersion,
    processingMs,
    browserMs: elapsedMs,
    kind,
    file: { name: file.name, size: file.size, type: file.type || '' },
    fileTypeLabel: file.type || (kind === 'video' ? 'video/mp4' : 'image'),
    analyzedAt: new Date().toISOString(),
    raw: payload,
  };
}

async function predict(file, endpoint, kind) {
  const started = Date.now();
  const form = new FormData();
  form.append('file', file, file.name);

  const payload = await request(endpoint, { method: 'POST', body: form });
  return { result: normalizeResult(payload, { file, kind, elapsedMs: Date.now() - started }), raw: payload };
}

export function predictImage(file) {
  return predict(file, ENDPOINTS.image, 'image');
}

export function predictVideo(file) {
  return predict(file, ENDPOINTS.video, 'video');
}

/** Reads the backend health endpoint. Throws DetectionError when unreachable. */
export async function checkHealth() {
  const payload = await request(ENDPOINTS.health, { timeout: HEALTH_TIMEOUT_MS });
  const data = payload.result && typeof payload.result === 'object' ? payload.result : payload;

  const rawStatus = String(data.status ?? data.state ?? 'ok').toLowerCase();
  const online = !/(down|error|unavailable|offline|starting|loading)/.test(rawStatus);

  const modelName =
    (data.model && typeof data.model === 'object' ? data.model.name : data.model) ?? data.model_name ?? null;
  const modelVersion =
    (data.model && typeof data.model === 'object' ? data.model.version : null) ?? data.model_version ?? null;

  return {
    online,
    status: rawStatus,
    modelName,
    modelVersion,
    framework:
      (data.framework && typeof data.framework === 'object' ? data.framework.name : data.framework) ??
      data.framework_name ??
      null,
    device: data.device ?? null,
    videoSupported: Boolean(data.video_supported ?? data.supports_video ?? false),
    raw: payload,
  };
}