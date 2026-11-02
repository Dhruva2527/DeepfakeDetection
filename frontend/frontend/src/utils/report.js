import { LIMITATIONS } from '@/services/detectionService';
import { formatDuration, formatFileSize, formatTimestamp } from '@/utils/format';

/** Plain-text report built only from values the backend actually returned. */
export function buildReportText(result) {
  const processing = result.processingMs
    ? formatDuration(result.processingMs)
    : `not reported by the model (browser round trip: ${formatDuration(result.browserMs)})`;

  return [
    'TruthLens AI — Analysis Report',
    '================================',
    '',
    `Generated:       ${formatTimestamp(new Date())}`,
    `File:            ${result.file.name}`,
    `File type:       ${result.fileTypeLabel}`,
    `File size:       ${formatFileSize(result.file.size)}`,
    `Analyzed at:     ${formatTimestamp(result.analyzedAt)}`,
    '',
    `Prediction:      ${result.label}`,
    `Confidence:      ${result.confidence === null ? 'not reported by the model' : `${result.confidence}%`}`,
    `Model:           ${result.model || 'not reported by the backend'}${
      result.modelVersion ? ` (v${result.modelVersion})` : ''
    }`,
    `Processing time: ${processing}`,
    '',
    'What this means',
    '---------------',
    result.explanation,
    '',
    'Limitations',
    '-----------',
    LIMITATIONS,
    '',
    'This interface does not store your media. The file was sent only to the analysis',
    'backend configured for this deployment, which determines its own retention.',
    '',
  ].join('\n');
}

export function downloadReport(result) {
  const blob = new Blob([buildReportText(result)], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const link = document.createElement('a');
  link.href = url;
  link.download = `truthlens-report-${stamp}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}