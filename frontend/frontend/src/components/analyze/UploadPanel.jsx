import { useRef, useState } from 'react';
import { AlertCircle, Film, Image as ImageIcon, Loader2, Lock, RotateCcw, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MAX_IMAGE_BYTES, MAX_VIDEO_BYTES, validateFile } from '@/services/detectionService';
import { formatFileSize } from '@/utils/format';

const ACCEPT = 'image/jpeg,image/png,video/mp4';

export default function UploadPanel({ file, previewUrl, isVideo, onFileChange, onAnalyze, analyzing, videoSupported }) {
  const inputRef = useRef(null);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);

  const openPicker = () => inputRef.current?.click();

  const accept = (candidate) => {
    if (!candidate) return;
    const validation = validateFile(candidate, { videoSupported });
    if (!validation.ok) {
      setError(validation.error);
      return;
    }
    setError(null);
    onFileChange(candidate);
  };

  const handleInput = (event) => {
    accept(event.target.files && event.target.files[0]);
    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    accept(event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]);
  };

  const clear = () => {
    setError(null);
    onFileChange(null);
  };

  return (
    <section className="tl-card p-5 sm:p-6" aria-labelledby="upload-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="upload-heading" className="font-heading text-lg font-semibold text-slate-900">
            Upload media
          </h2>
          <p className="mt-1 text-sm text-slate-500">Drag a file in, or browse from your device.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          Not stored by this interface
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={handleInput}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />

      {!file ? (
        <div
          role="button"
          tabIndex={0}
          aria-label="Add media to analyze: drop a file here or press Enter to browse"
          onClick={openPicker}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openPicker();
            }
          }}
          onDragEnter={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors',
            dragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-blue-200 bg-blue-50/40 hover:border-blue-400 hover:bg-blue-50/80',
          )}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-inset ring-blue-100">
            <Upload className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mt-4 font-heading text-base font-semibold text-slate-900">Drop your image here</p>
          <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-500">
            JPG, JPEG or PNG up to {formatFileSize(MAX_IMAGE_BYTES)}. MP4 video up to{' '}
            {formatFileSize(MAX_VIDEO_BYTES)} where the backend supports video inference.
          </p>
          <span className="mt-5 inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors group-hover:bg-blue-700">
            Browse files
          </span>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-3">
            {isVideo ? (
              <video src={previewUrl || undefined} controls className="max-h-[360px] w-full rounded-xl bg-slate-200/60">
                Your browser cannot play this video.
              </video>
            ) : (
              <img
                src={previewUrl || ''}
                alt={`Preview of ${file.name}`}
                className="max-h-[360px] w-full rounded-xl object-contain"
              />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                {isVideo ? <Film className="h-5 w-5" aria-hidden="true" /> : <ImageIcon className="h-5 w-5" aria-hidden="true" />}
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-slate-500">
                  {formatFileSize(file.size)} · {isVideo ? 'MP4 video' : file.type || 'image'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={openPicker} disabled={analyzing}>
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                Replace
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-lg text-slate-600 hover:text-red-600"
                onClick={clear}
                disabled={analyzing}
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="button"
        size="lg"
        className="mt-5 w-full rounded-xl shadow-sm"
        onClick={() => onAnalyze(file)}
        disabled={!file || analyzing}
      >
        {analyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Analyzing…
          </>
        ) : (
          'Analyze media'
        )}
      </Button>
      <p className="mt-2 text-center text-xs text-slate-500">
        The result is a model prediction, not proof of authenticity.
      </p>
    </section>
  );
}