import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ErrorCard({ message, onRetry, canRetry }) {
  return (
    <section className="tl-card border-red-100 p-5 sm:p-6" role="alert">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="font-heading text-lg font-semibold text-slate-900">
            We couldn’t complete the analysis
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{message}</p>
          {canRetry && (
            <Button type="button" className="mt-4 rounded-xl" onClick={onRetry}>
              <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
              Retry analysis
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}