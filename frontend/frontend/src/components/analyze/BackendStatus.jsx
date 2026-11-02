import { AlertTriangle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BACKEND_URL } from '@/services/detectionService';

const TONES = {
  online: {
    wrap: 'border-green-100 bg-green-50',
    dot: 'bg-green-600',
    icon: 'text-green-700',
    title: 'Backend online',
    label: 'text-green-800',
  },
  checking: {
    wrap: 'border-slate-200 bg-slate-50',
    dot: 'bg-slate-400',
    icon: 'text-slate-500',
    title: 'Checking backend…',
    label: 'text-slate-700',
  },
  offline: {
    wrap: 'border-amber-100 bg-amber-50',
    dot: 'bg-amber-500',
    icon: 'text-amber-700',
    title: 'Backend unavailable',
    label: 'text-amber-900',
  },
};

export default function BackendStatus({ health }) {
  const { status, data, error, recheck } = health;
  const tone = TONES[status] || TONES.checking;

  return (
    <section className="tl-card p-5" aria-live="polite">
      <h2 className="font-heading text-base font-semibold text-slate-900">Model status</h2>

      <div className={cn('mt-4 rounded-xl border px-4 py-3', tone.wrap)}>
        <div className="flex items-center gap-2">
          <span className={cn('h-2.5 w-2.5 rounded-full', tone.dot)} aria-hidden="true" />
          <p className={cn('text-sm font-semibold', tone.label)}>{tone.title}</p>
          {status === 'checking' && <Loader2 className={cn('h-3.5 w-3.5 animate-spin', tone.icon)} aria-hidden="true" />}
          {status === 'online' && <CheckCircle2 className={cn('h-3.5 w-3.5', tone.icon)} aria-hidden="true" />}
          {status === 'offline' && <AlertTriangle className={cn('h-3.5 w-3.5', tone.icon)} aria-hidden="true" />}
        </div>
        {status === 'offline' && (
          <p className="mt-2 text-xs leading-relaxed text-amber-900">
            {error && error.message
              ? error.message
              : 'The analysis backend is not responding, so predictions cannot be generated right now.'}
          </p>
        )}
      </div>

      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex items-start justify-between gap-4">
          <dt className="text-slate-500">Endpoint</dt>
          <dd className="max-w-[62%] truncate text-right font-mono text-xs text-slate-700" title={BACKEND_URL}>
            {BACKEND_URL}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="text-slate-500">Model</dt>
          <dd className="max-w-[62%] text-right text-slate-700">
            {data && data.modelName ? data.modelName : 'Not reported'}
            {data && data.modelVersion ? <span className="text-slate-500"> v{data.modelVersion}</span> : null}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="text-slate-500">Video inference</dt>
          <dd className="text-right text-slate-700">{health.videoSupported ? 'Supported' : 'Not supported'}</dd>
        </div>
      </dl>

      <Button type="button" variant="outline" size="sm" className="mt-4 w-full rounded-xl" onClick={recheck}>
        <RefreshCw className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
        Check again
      </Button>
    </section>
  );
}