import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeroIllustration from '@/components/home/HeroIllustration';

const TRUST_POINTS = [
  { icon: ShieldCheck, label: 'Self-hosted PyTorch model' },
  { icon: Lock, label: 'No third-party AI APIs' },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="tl-grid pointer-events-none absolute inset-0 opacity-[0.45]" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 top-40 h-72 w-72 rounded-full bg-cyan-100/60 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-5 py-16 lg:grid-cols-2 lg:gap-12 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" aria-hidden="true" />
            Deep learning · PyTorch · Transfer learning
          </span>

          <h1 className="mt-6 font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem]">
            Know What’s Real.
            <br />
            <span className="tl-gradient-text">Detect What’s Artificial.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Analyze digital images for signs of AI generation and manipulation using deep learning.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-xl px-6 shadow-md shadow-blue-200/60">
              <Link to="/analyze">
                Analyze an Image
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl border-slate-200 bg-white px-6">
              <Link to="/how-it-works">
                <Layers className="mr-2 h-4 w-4" aria-hidden="true" />
                Explore How It Works
              </Link>
            </Button>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
            {TRUST_POINTS.map((point) => (
              <li key={point.label} className="flex items-center gap-2 text-sm text-slate-600">
                <point.icon className="h-4 w-4 text-blue-600" aria-hidden="true" />
                {point.label}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
        >
          <HeroIllustration />
        </motion.div>
      </div>
    </section>
  );
}