import { renderAnimatedPoseSvg, getPoseFrames } from '../data/poses.js';
import { icon } from '../data/icons.js';

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

// Small at-a-glance thumbnail for collapsed rows, so you can see what an
// exercise is without expanding it or opening the video. Uses the same
// consistent icon set (js/data/icons.js) as the rest of the app instead of
// photos, so all 14 exercises share one visual style. When `isHome` is true,
// a small house badge overlays the icon so the home variant is visually
// distinguishable from the gym one at a glance, not just by its label text.
export function renderExerciseThumb(ex, size = 44, isHome = false) {
  return `
    <div style="position:relative; width:${size}px; height:${size}px; flex-shrink:0;">
      <div style="width:100%; height:100%; background:var(--color-surface-2); border-radius:8px; display:flex; align-items:center; justify-content:center; color:var(--color-primary);">
        ${icon(ex.id, size - 18)}
      </div>
      ${isHome ? `
        <div style="position:absolute; bottom:-4px; right:-4px; width:18px; height:18px; background:var(--color-accent); border-radius:50%; display:flex; align-items:center; justify-content:center; color:#0a0b10; border:2px solid var(--color-bg);">
          ${icon('casa', 10)}
        </div>
      ` : ''}
    </div>
  `;
}
