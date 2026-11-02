import { Gauge, Lock, ScanLine } from 'lucide-react';

const FEATURES = [
  {
    icon: ScanLine,
    accent: 'bg-blue-50 text-blue-600',
    title: 'AI-powered visual analysis',
    body: 'A convolutional neural network trained on labelled authentic and manipulated media inspects each image for generative and editing artifacts.',
  },
  {
    icon: Gauge,
    accent: 'bg-cyan-50 text-cyan-600',
    title: 'Simple, accessible results',
    body: 'One clear prediction, the model’s own confidence value when it returns one, and a plain-language note on what the result does and does not mean.',
  },
  {
    icon: Lock,
    accent: 'bg-slate-100 text-slate-700',
    title: 'Privacy-conscious processing',
    body: 'Your file goes straight from the browser to the analysis backend you configure — no paid AI APIs and no third-party inference services.',
  },
];

export default function FeatureCards() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-4">
      <div className="grid gap-5 md:grid-cols-3">
        {FEATURES.map((feature) => (
          <article
            key={feature.title}
            className="tl-card group p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.accent}`}
            >
              <feature.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-5 font-heading text-base font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{feature.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}