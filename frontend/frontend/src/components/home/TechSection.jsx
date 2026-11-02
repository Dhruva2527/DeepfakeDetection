import { Cpu, Layers, LineChart, Scissors } from 'lucide-react';

const PIPELINE = [
  { icon: Scissors, title: 'Preprocessing', body: 'Decode, resize and normalise the input tensor.' },
  { icon: Layers, title: 'Pretrained backbone', body: 'A CNN backbone trained on a large image dataset.' },
  { icon: Cpu, title: 'Fine-tuned classifier', body: 'Head retrained for authentic vs manipulated media.' },
  { icon: LineChart, title: 'Prediction', body: 'A label, plus a confidence value when reported.' },
];

export default function TechSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-20">
      <div className="tl-card grid gap-10 p-7 sm:p-10 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Technology</span>
          <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            PyTorch and transfer learning, not a black box
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            Training from scratch needs far more data than a single project can gather. TruthLens AI
            instead starts from a convolutional backbone pretrained on a large image dataset and
            fine-tunes it on labelled examples of authentic and manipulated media — so the model learns
            the difference between them rather than learning images from zero.
          </p>
          <p className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-relaxed text-blue-900">
            No accuracy, dataset-size or benchmark figures are published on this site. Model metrics
            appear only once they come from the trained model’s evaluation on unseen test data.
          </p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {PIPELINE.map((step) => (
            <li key={step.title} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <step.icon className="h-4 w-4 text-cyan-600" aria-hidden="true" />
              <p className="mt-3 font-heading text-sm font-semibold text-slate-900">{step.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{step.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}