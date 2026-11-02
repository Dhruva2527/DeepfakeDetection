import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Cpu, Database, Eye, Image as ImageIcon, Layers, Scissors, Upload } from 'lucide-react';
import PanelCard from '@/components/PanelCard';
import { Button } from '@/components/ui/button';

const STEPS = [
  {
    icon: Upload,
    title: 'Upload your image',
    body: 'Choose one JPG, JPEG or PNG file — or an MP4 video where the backend supports video inference. The file is validated before anything is sent.',
  },
  {
    icon: Brain,
    title: 'The trained model examines visual patterns',
    body: 'Preprocessing turns the file into a tensor, and the fine-tuned network scores the patterns that tend to appear in generated or edited media.',
  },
  {
    icon: Eye,
    title: 'Review the prediction and its limitations',
    body: 'You get a label, the model’s confidence when it returns one, and a plain-language note about what the result can and cannot tell you.',
  },
];

const TECH = [
  {
    icon: Cpu,
    title: 'PyTorch',
    body: 'The model is defined, trained and evaluated with PyTorch, the open-source deep learning framework.',
  },
  {
    icon: Layers,
    title: 'Transfer learning',
    body: 'Training starts from a backbone pretrained on a large image dataset and fine-tunes it on labelled authentic and manipulated examples.',
  },
  {
    icon: Scissors,
    title: 'Image preprocessing',
    body: 'Files are decoded, resized and normalised into the exact tensor shape the model expects.',
  },
  {
    icon: Database,
    title: 'Model inference',
    body: 'The trained weights score one file at a time on your own backend — no external AI service is involved.',
  },
  {
    icon: ImageIcon,
    title: 'Evaluation on unseen test data',
    body: 'Once training is complete, performance is measured on a held-out split the model never saw. Metrics are published only after that run.',
  },
];

export default function HowItWorks() {
  return (
    <div>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:py-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">How it works</span>
          <h1 className="mt-3 max-w-3xl font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            From an upload to a prediction, in three steps
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Nothing here is a magic box. A trained neural network produces a probability-like score, and
            the interface shows you exactly what came back from it.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 py-12">
        <ol className="grid gap-5 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="tl-card p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-heading text-3xl font-extrabold text-slate-100">{index + 1}</span>
              </div>
              <h2 className="mt-5 font-heading text-base font-semibold text-slate-900">{step.title}</h2>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-start">
          <PanelCard icon={Cpu} title="Technical overview">
            <dl className="space-y-5">
              {TECH.map((item) => (
                <div key={item.title} className="flex gap-3.5">
                  <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" aria-hidden="true" />
                  <div>
                    <dt className="font-heading text-sm font-semibold text-slate-900">{item.title}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-slate-600">{item.body}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </PanelCard>

          <div className="space-y-5">
            <PanelCard title="What the result does not say">
              <ul className="space-y-2.5">
                <li>A “Likely Real” label is not a certificate of authenticity.</li>
                <li>A “Potentially Manipulated” label is not proof that someone altered the file.</li>
                <li>A confidence value is a raw model output, not a calibrated probability.</li>
                <li>Compression, filters and resizing can all shift a prediction.</li>
              </ul>
            </PanelCard>

            <div className="tl-card tl-gradient p-6 text-white">
              <h2 className="font-heading text-lg font-bold">Ready to try it on a file?</h2>
              <p className="mt-2 text-sm leading-relaxed text-blue-50">
                The workspace is live — analysis works as soon as the model backend is running.
              </p>
              <Button asChild variant="secondary" className="mt-4 rounded-xl bg-white text-blue-700 hover:bg-blue-50">
                <Link to="/analyze">
                  Analyze an Image
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}