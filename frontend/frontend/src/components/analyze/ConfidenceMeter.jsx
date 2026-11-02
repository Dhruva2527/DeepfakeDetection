import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const BAR_TONES = {
  real: 'bg-gradient-to-r from-green-600 to-green-400',
  manipulated: 'bg-gradient-to-r from-amber-500 to-red-500',
  inconclusive: 'bg-gradient-to-r from-blue-600 to-cyan-500',
};

export default function ConfidenceMeter({ value, verdict }) {
  if (value === null || value === undefined) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-sm font-medium text-slate-700">Confidence not reported</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          The backend did not return a confidence score for this prediction, so none is displayed.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-slate-700">Model confidence</span>
        <span className="font-heading text-2xl font-bold text-slate-900">{value.toFixed(1)}%</span>
      </div>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className={cn('h-full rounded-full', BAR_TONES[verdict] || BAR_TONES.inconclusive)}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(2, Math.min(100, value))}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">
        This is a raw model output, not a calibrated probability of authenticity.
      </p>
    </div>
  );
}