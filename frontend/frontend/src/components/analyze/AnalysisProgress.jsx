import { CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ANALYSIS_STAGES } from '@/hooks/useDetection';

export default function AnalysisProgress({ stage }) {
  return (
    <section className="tl-card p-5 sm:p-6" aria-live="polite">
      <h2 className="font-heading text-lg font-semibold text-slate-900">Analyzing media</h2>
      <p className="mt-1 text-sm leading-relaxed text-slate-500">
        Stages advance as the request moves through the pipeline. No estimated completion is shown
        while the model is working.
      </p>

      <ol className="mt-5 space-y-3">
        {ANALYSIS_STAGES.map((item, index) => {
          const done = index < stage;
          const active = index === stage;
          return (
            <li
              key={item.key}
              className={cn(
                'flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors',
                active
                  ? 'border-blue-200 bg-blue-50'
                  : done
                    ? 'border-slate-200 bg-white'
                    : 'border-slate-100 bg-slate-50/60',
              )}
            >
              <span
                className={cn(
                  'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
                  active
                    ? 'bg-blue-600 text-white'
                    : done
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-200 text-slate-500',
                )}
              >
                {done ? (
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                ) : active ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </span>
              <div>
                <p className={cn('text-sm font-medium', active || done ? 'text-slate-900' : 'text-slate-500')}>
                  {item.label}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{item.description}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div
        className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-label="Analysis in progress"
      >
        <div className="tl-indeterminate h-full w-1/3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" />
      </div>
    </section>
  );
}