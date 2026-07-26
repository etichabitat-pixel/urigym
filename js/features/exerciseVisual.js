import { renderAnimatedPoseSvg, getPoseFrames } from '../data/poses.js';

// Prefers a real reference photo (CC-BY-SA, from wger.de) when curated; falls
// back to our own animated pose diagram for the exercises we couldn't find
// a properly licensed photo for.
export function renderExerciseVisual(ex) {
  if (ex.referenceImage) {
    const img = ex.referenceImage;
    return `
      <div class="pose-wrap" style="flex-direction:column;">
        <img src="${img.url}" alt="${ex.name}" style="max-width:100%; max-height:220px; border-radius:8px;">
        <p style="font-size:11px; color:var(--color-text-muted); margin:6px 0 0;">
          Imatge: ${img.author} · <a href="${img.licenseUrl}" target="_blank" rel="noopener">${img.license}</a> · ${img.source}
        </p>
      </div>
    `;
  }
  const [frameA, frameB] = getPoseFrames(ex.pose);
  return `<div class="pose-wrap">${renderAnimatedPoseSvg(frameA, frameB)}</div>`;
}
