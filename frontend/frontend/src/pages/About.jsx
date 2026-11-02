import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Database, Layers, Server, ShieldAlert, Target } from 'lucide-react';
import PanelCard from '@/components/PanelCard';
import { Button } from '@/components/ui/button';
import { useBackendHealth } from '@/hooks/useDetection';
import { BACKEND_URL } from '@/services/detectionService';

const STACK = [
  { label: 'Frontend', value: 'React with Vite, JavaScript, Tailwind CSS, Framer Motion, Lucide icons' },
  { label: 'Model', value: 'PyTorch, trained with transfer learning in Google Colab' },
  { label: 'Serving', value: 'Flask or FastAPI exposing /api/health, /api/predict/image, /api/predict/video' },
];

export default function About() {
  const { status, data } = useBackendHealth();

  const configuration = [
    {
      label: 'Backend status',
      value: status === 'online' ? 'Online' : status === 'checking' ? 'Checking…' : 'Unreachable',
    },
    { label: 'Endpoint', value: BACKEND_URL },
    { label: 'Model name', value: data && data.modelName ? data.modelName : 'Not reported' },
    { label: 'Model version', value: data && data.modelVersion ? data.modelVersion : 'Not reported' },
    { label: 'Framework', value: data && data.framework ? data.framework : 'Not reported' },
    { label: 'Video inference', value: data ? (data.videoSupported ? 'Supported' : 'Not supported') : 'Unknown' },
  ];

  return (
    <div>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:py-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">About</span>
          <h1 className="mt-3 max-w-3xl font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            An academic project about what detectors can and cannot prove
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            TruthLens AI is a deepfake and image-manipulation detection platform built to be honest about
            its own uncertainty.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 py-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-start">
          <div className="space-y-6">
            <PanelCard icon={Target} title="Project overview">
              <p>
                Generative models can now produce photorealistic images in seconds, which makes it harder
                for people to judge what they are looking at. This project explores how far a single
                convolutional classifier can go in flagging AI-generated or edited media — and how the
                result should be communicated without overstating it.
              </p>
              <p className="mt-3">
                The interface is deliberately plain about the model: the prediction shown is exactly what
                the backend returned, and no figure appears anywhere unless the model produced it.
              </p>
            </PanelCard>

            <PanelCard icon={Cpu} title="Model and configuration">
              <p>
                The classifier starts from a convolutional backbone pretrained on a large image dataset
                and is fine-tuned for a binary decision — authentic versus manipulated. These values are
                read live from the backend’s own health endpoint, so nothing here is guessed or hard-coded.
              </p>
              <dl className="mt-4 divide-y divide-slate-100">
                {configuration.map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4 py-2.5">
                    <dt className="text-slate-500">{row.label}</dt>
                    <dd className="max-w-[60%] truncate text-right text-slate-800" title={row.value}>
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </PanelCard>

            <PanelCard icon={Database} title="Dataset">
              <p>
                The training set combines authentic and manipulated images with a held-out test split used
                only for evaluation. Dataset name, size and class balance will be listed here once they are
                finalised and verified — no dataset figures or benchmark results are published before that
                point.
              </p>
            </PanelCard>

            <PanelCard icon={Layers} title="Technology stack">
              <dl className="divide-y divide-slate-100">
                {STACK.map((row) => (
                  <div key={row.label} className="py-2.5">
                    <dt className="font-heading text-sm font-semibold text-slate-900">{row.label}</dt>
                    <dd className="mt-1 leading-relaxed">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </PanelCard>
          </div>

          <div className="space-y-5">
            <PanelCard
              icon={ShieldAlert}
              title="Responsible use"
              className="border-amber-100 bg-amber-50/40"
            >
              <ul className="space-y-2.5 text-amber-900">
                <li>Never present a prediction as evidence that media is genuine or fake.</li>
                <li>Do not use results as sole grounds for legal, journalistic or disciplinary decisions.</li>
                <li>Detectors are trained on specific data and degrade on material unlike it.</li>
                <li>Always pair a result with human review and the original source of the file.</li>
              </ul>
            </PanelCard>

            <PanelCard icon={Server} title="Honest limits">
              <ul className="space-y-2.5">
                <li>No accuracy, recall or benchmark figures are claimed on this site.</li>
                <li>Confidence values are model outputs, not calibrated probabilities.</li>
                <li>Video analysis exists only where the backend implements it.</li>
                <li>With no backend running, the site stays readable but cannot predict.</li>
              </ul>
            </PanelCard>

            <div className="tl-card p-6">
              <h2 className="font-heading text-base font-semibold text-slate-900">Try it yourself</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Open the workspace and analyze a file with your own backend connected.
              </p>
              <Button asChild className="mt-4 rounded-xl">
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
