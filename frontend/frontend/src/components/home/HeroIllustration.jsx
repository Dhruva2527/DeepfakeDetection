import { motion } from 'framer-motion';
import { ScanLine, ShieldCheck } from 'lucide-react';

   const SAMPLE_SRC = '/images/hero-sample.png';

const CORNER_CLASSES = [
  'left-4 top-4 rounded-tl-lg border-l-2 border-t-2',
  'right-4 top-4 rounded-tr-lg border-r-2 border-t-2',
  'left-4 bottom-4 rounded-bl-lg border-b-2 border-l-2',
  'right-4 bottom-4 rounded-br-lg border-b-2 border-r-2',
];

export default function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <div className="tl-card relative overflow-hidden p-4 shadow-lg shadow-slate-200/70">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-100">
          <img
            src={SAMPLE_SRC}
            alt="Sample portrait being scanned for manipulation artifacts"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
          <div className="tl-scanline absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-blue-500/30 to-transparent" />

          {CORNER_CLASSES.map((corner) => (
            <span key={corner} className={`absolute h-6 w-6 border-white/90 ${corner}`} aria-hidden="true" />
          ))}

          <div className="absolute inset-x-4 bottom-4 flex items-center gap-2 rounded-xl bg-white/92 px-3 py-2 shadow-sm backdrop-blur">
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="tl-pulse-ring absolute inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500" />
            </span>
            <p className="text-xs font-medium text-slate-700">Analyzing visual patterns…</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-1 pb-1 pt-4">
          <div className="min-w-0">
            <p className="truncate font-heading text-sm font-semibold text-slate-900">portrait-sample.jpg</p>
            <p className="text-xs text-slate-500">image/jpeg</p>
          </div>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-100">
            Scanning
          </span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        className="tl-card absolute -bottom-6 -left-3 w-56 p-4 shadow-lg shadow-slate-200/80 sm:-left-8"
      >
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Prediction</p>
        <div className="mt-2 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-green-600" aria-hidden="true" />
          <span className="font-heading text-sm font-semibold text-slate-900">Likely Real</span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" />
        </div>
        <p className="mt-2 text-[11px] leading-snug text-slate-500">
          Confidence shown exactly as the model reports it
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        className="tl-card absolute -right-3 top-12 hidden w-44 p-3.5 shadow-lg shadow-slate-200/80 sm:block"
      >
        <div className="flex items-center gap-2">
          <ScanLine className="h-4 w-4 text-cyan-500" aria-hidden="true" />
          <p className="text-xs font-semibold text-slate-800">Pattern check</p>
        </div>
        <p className="mt-1.5 text-[11px] leading-snug text-slate-500">
          Generative and editing artifacts
        </p>
      </motion.div>
    </div>
  );
}