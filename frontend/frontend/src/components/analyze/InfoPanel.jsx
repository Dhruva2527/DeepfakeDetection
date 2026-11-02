import { Image as ImageIcon, Info, Lock, ShieldCheck } from 'lucide-react';
import PanelCard from '@/components/PanelCard';
import BackendStatus from '@/components/analyze/BackendStatus';
import { MAX_IMAGE_BYTES, MAX_VIDEO_BYTES } from '@/services/detectionService';
import { formatFileSize } from '@/utils/format';

export default function InfoPanel({ health }) {
  return (
    <div className="space-y-5">
      <BackendStatus health={health} />

      <PanelCard icon={ShieldCheck} title="How the analysis works">
        <ol className="space-y-3">
          {[
            'Your file is sent to the analysis backend over a single request.',
            'The trained model scores the image for artifacts left by generation or editing.',
            'The prediction comes back with a label and, when the backend provides one, a confidence value.',
          ].map((line, index) => (
            <li key={line} className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-semibold text-blue-700">
                {index + 1}
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ol>
      </PanelCard>

      <PanelCard icon={ImageIcon} title="Supported files">
        <ul className="space-y-2.5">
          <li className="flex items-start justify-between gap-4">
            <span>JPG, JPEG, PNG</span>
            <span className="shrink-0 text-xs text-slate-500">up to {formatFileSize(MAX_IMAGE_BYTES)}</span>
          </li>
          <li className="flex items-start justify-between gap-4">
            <span>MP4 video</span>
            <span className="shrink-0 text-xs text-slate-500">up to {formatFileSize(MAX_VIDEO_BYTES)}</span>
          </li>
        </ul>
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-500">
          Video analysis is offered only when the connected backend reports that it supports video
          inference. Everything else is validated again on the backend.
        </p>
      </PanelCard>

      <PanelCard icon={Lock} title="Privacy">
        <ul className="space-y-2.5">
          <li>No paid APIs and no third-party AI inference services are used.</li>
          <li>Your media is sent only to the backend endpoint configured for this deployment.</li>
          <li>This interface keeps no copy on disk — results live in your browser tab only.</li>
          <li>
            Retention on the backend itself has not been verified here, so do not rely on it for
            confidential material until it has been confirmed.
          </li>
        </ul>
      </PanelCard>

      <PanelCard icon={Info} title="First time here?">
        <ol className="space-y-2.5">
          <li>Check the model status above — analysis needs a running backend.</li>
          <li>Add one JPG, JPEG or PNG image (MP4 where supported).</li>
          <li>Select “Analyze media” and read the prediction with its limitations.</li>
        </ol>
      </PanelCard>
    </div>
  );
}