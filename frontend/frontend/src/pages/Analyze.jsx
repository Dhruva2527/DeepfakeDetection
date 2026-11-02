import { useState } from 'react';
import UploadPanel from '@/components/analyze/UploadPanel';
import InfoPanel from '@/components/analyze/InfoPanel';
import AnalysisProgress from '@/components/analyze/AnalysisProgress';
import ErrorCard from '@/components/analyze/ErrorCard';
import ResultCard from '@/components/analyze/ResultCard';
import { useAnalysis, useBackendHealth } from '@/hooks/useDetection';
import useMediaPreview from '@/hooks/useMediaPreview';

export default function Analyze() {
  const [file, setFile] = useState(null);
  const previewUrl = useMediaPreview(file);
  const health = useBackendHealth();
  const { state, stage, result, error, canRetry, analyze, retry, reset } = useAnalysis();

  const isVideo = Boolean(file) && (file.type === 'video/mp4' || /\.mp4$/i.test(file.name));

  const handleFileChange = (next) => {
    setFile(next);
    reset();
  };

  const handleReset = () => {
    reset();
    setFile(null);
  };

  return (
    <div>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:py-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Analysis workspace
          </span>
          <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Analyze media
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Upload one image — or an MP4 video where your backend supports it — and TruthLens AI returns
            the model’s prediction together with its limits. A result is a signal, never a verdict.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
          <div className="space-y-6">
            <UploadPanel
              file={file}
              previewUrl={previewUrl}
              isVideo={isVideo}
              onFileChange={handleFileChange}
              onAnalyze={() => analyze(file, { videoSupported: health.videoSupported })}
              analyzing={state === 'analyzing'}
              videoSupported={health.videoSupported}
            />

            {state === 'analyzing' && <AnalysisProgress stage={stage} />}

            {state === 'error' && <ErrorCard message={error} onRetry={retry} canRetry={canRetry} />}

            {state === 'done' && result && (
              <ResultCard result={result} previewUrl={previewUrl} isVideo={isVideo} onReset={handleReset} />
            )}
          </div>

          <InfoPanel health={health} />
        </div>
      </div>
    </div>
  );
}