import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const FOOTER_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Analyze Media', to: '/analyze' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'About', to: '/about' },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="font-heading text-base font-bold text-slate-900">TruthLens AI</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
            An academic deepfake and image-manipulation detection project. Media is analyzed by a
            self-hosted PyTorch model — no paid APIs and no third-party AI inference services.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-heading text-sm font-semibold text-slate-900">Explore</h2>
          <ul className="mt-4 space-y-2.5">
            {FOOTER_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-slate-600 transition-colors hover:text-blue-600">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-heading text-sm font-semibold text-slate-900">Responsible use</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Results are model predictions, not proof of authenticity or manipulation. Never use them
            as sole evidence in legal, journalistic or disciplinary decisions.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} TruthLens AI — academic project.</p>
          <p>Model inference runs on the analysis backend you configure.</p>
        </div>
      </div>
    </footer>
  );
}
