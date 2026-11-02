import { AlertCircle, CheckCircle2, Download, Info, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ConfidenceMeter from '@/components/analyze/ConfidenceMeter';
import { LIMITATIONS } from '@/services/detectionService';
import { formatDuration, formatFileSize, formatTimestamp } from '@/utils/format';
import { downloadReport } from '@/utils/report';

const VERDICT_STYLES = {
  real: { chip: 'bg-green-50 text-green-700 ring-green-100', Icon: CheckCircle2 },
  manipulated: { chip: 'bg-amber-50 text-amber-700 ring-amber-100', Icon: AlertCircle },
  inconclusive: { chip: 'bg-blue-50 text-blue-700 ring-blue-100', Icon: Info },
};

export default function ResultCard({ result, previewUrl, isVideo, onReset }) {
  const style = VERDICT_STYLES[result.verdict] || VERDICT_STYLES.inconclusive;
  const { Icon } = style;

  const modelValue = result.model
    ? `${result.model}${result.modelVersion ? ` v${result.modelVersion}` : ''}`
    : 'Not reported by the backend';

  const rows = [
    { label: 'File', value: result.file.name },
    { label: 'File type', value: result.fileTypeLabel },
    { label: 'File size', value: formatFileSize(result.file.size) },
    { label: 'Analyzed at', value: formatTimestamp(result.analyzedAt) },
    { label: 'Model', value: modelValue },
    {
      label: result.processingMs ? 'Model processing time' : 'Round-trip time (browser)',
      value: result.processingMs ? formatDuration(result.processingMs) : formatDuration(result.browserMs),
    },
  ];

  return (
    <section className="tl-card overflow-hidden" aria-labelledby="result-heading">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/70 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset', style.chip)}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Prediction</p>
            <h2 id="result-heading" className="font-heading text-lg font-bold text-slate-900">
              {result.label}
            </h2>
          </div>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
          {result.kind === 'video' ? 'Video analysis' : 'Image analysis'}
        </span>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-2">
            {isVideo ? (
              <video src={previewUrl || undefined} controls className="max-h-56 w-full rounded-xl bg-slate-200/60" />
            ) : (
              <img
                src={previewUrl || ''}
                alt={`Analyzed media: ${result.file.name}`}
                className="max-h-56 w-full rounded-xl object-contain"
              />
            )}
          </div>
          <ConfidenceMeter value={result.confidence} verdict={result.verdict} />
        </div>

        <div className="space-y-5">
          <div>
            <h3 className="font-heading text-sm font-semibold text-slate-900">What this means</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{result.explanation}</p>
          </div>

          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {rows.map((row) => (
              <div key={row.label} className="min-w-0">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{row.label}</dt>
                <dd className="mt-0.5 truncate text-sm text-slate-800" title={row.value}>
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-amber-900">{LIMITATIONS}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" className="rounded-xl" onClick={onReset}>
              <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
              Analyze another file
            </Button>
            <Button type="button" className="rounded-xl" onClick={() => downloadReport(result)}>
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              Download report
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}