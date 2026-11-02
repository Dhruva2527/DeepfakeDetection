import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DetectionError,
  checkHealth,
  predictImage,
  predictVideo,
  validateFile,
} from '@/services/detectionService';

/** Interface stages only — no invented percentages or completion estimates. */
export const ANALYSIS_STAGES = [
  {
    key: 'preparing',
    label: 'Preparing media',
    description: 'Checking the file and building the request.',
  },
  {
    key: 'analyzing',
    label: 'Analyzing visual patterns',
    description: 'The trained model is scoring the uploaded media.',
  },
  {
    key: 'predicting',
    label: 'Generating prediction',
    description: 'Reading and interpreting the model output.',
  },
];

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));

export function useBackendHealth() {
  const [health, setHealth] = useState({ status: 'checking', data: null, error: null });
  const mounted = useRef(true);

  const check = useCallback(async () => {
    setHealth({ status: 'checking', data: null, error: null });
    try {
      const data = await checkHealth();
      if (!mounted.current) return;
      setHealth(
        data.online
          ? { status: 'online', data, error: null }
          : {
              status: 'offline',
              data,
              error: new DetectionError(
                'The backend is reachable but reports that the model is not ready.',
                'not_ready',
              ),
            },
      );
    } catch (error) {
      if (!mounted.current) return;
      setHealth({ status: 'offline', data: null, error });
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    check();
    return () => {
      mounted.current = false;
    };
  }, [check]);

  return { ...health, recheck: check, videoSupported: Boolean(health.data && health.data.videoSupported) };
}

export function useAnalysis() {
  const [state, setState] = useState('idle');
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const mounted = useRef(true);

  useEffect(() => () => {
    mounted.current = false;
  }, []);

  const run = useCallback(async (file, { videoSupported = false } = {}) => {
    const validation = validateFile(file, { videoSupported });
    if (!validation.ok) {
      setAttempt(null);
      setResult(null);
      setError(validation.error);
      setState('error');
      return;
    }

    setAttempt({ file, videoSupported });
    setResult(null);
    setError(null);
    setStage(0);
    setState('analyzing');

    try {
      await nextFrame();
      if (!mounted.current) return;
      setStage(1);

      const { result: normalized } =
        validation.kind === 'video' ? await predictVideo(file) : await predictImage(file);

      if (!mounted.current) return;
      setStage(2);
      await nextFrame();
      if (!mounted.current) return;

      setResult(normalized);
      setState('done');
    } catch (err) {
      if (!mounted.current) return;
      setError(
        err instanceof DetectionError
          ? err.message
          : 'Something went wrong while analyzing this file. Please try again.',
      );
      setState('error');
    }
  }, []);

  const retry = useCallback(() => {
    if (attempt) run(attempt.file, { videoSupported: attempt.videoSupported });
  }, [attempt, run]);

  const reset = useCallback(() => {
    setState('idle');
    setStage(0);
    setResult(null);
    setError(null);
  }, []);

  return { state, stage, result, error, canRetry: Boolean(attempt), analyze: run, retry, reset };
}