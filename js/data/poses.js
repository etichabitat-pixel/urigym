const DOT = (x, y) => `<circle cx="${x}" cy="${y}" r="5" fill="var(--pose-color, #ff6a3d)"/>`;

export const POSES = {
  standing: `
    <circle cx="60" cy="24" r="13" fill="var(--pose-color, #ff6a3d)"/>
    <line x1="60" y1="37" x2="60" y2="95"/>
    <line x1="60" y1="45" x2="42" y2="70"/>
    <line x1="60" y1="45" x2="78" y2="70"/>
    <line x1="60" y1="95" x2="45" y2="150"/>
    <line x1="60" y1="95" x2="75" y2="150"/>
    ${DOT(42, 70)}${DOT(78, 70)}${DOT(45, 150)}${DOT(75, 150)}
  `,
  bent: `
    <circle cx="70" cy="45" r="13" fill="var(--pose-color, #ff6a3d)"/>
    <line x1="70" y1="58" x2="55" y2="90"/>
    <line x1="60" y1="65" x2="35" y2="55"/>
    <line x1="60" y1="65" x2="85" y2="55"/>
    <line x1="55" y1="90" x2="30" y2="100"/>
    <line x1="30" y1="100" x2="35" y2="150"/>
    <line x1="55" y1="90" x2="80" y2="105"/>
    <line x1="80" y1="105" x2="72" y2="150"/>
    ${DOT(35, 55)}${DOT(85, 55)}${DOT(35, 150)}${DOT(72, 150)}
  `,
  pushPosition: `
    <circle cx="25" cy="95" r="13" fill="var(--pose-color, #ff6a3d)"/>
    <line x1="38" y1="95" x2="95" y2="95"/>
    <line x1="55" y1="95" x2="55" y2="65"/>
    <line x1="55" y1="65" x2="78" y2="78"/>
    <line x1="95" y1="95" x2="105" y2="70"/>
    <line x1="105" y1="70" x2="100" y2="130"/>
    ${DOT(78, 78)}${DOT(100, 130)}
  `,
  overhead: `
    <circle cx="60" cy="24" r="13" fill="var(--pose-color, #ff6a3d)"/>
    <line x1="60" y1="37" x2="60" y2="95"/>
    <line x1="60" y1="40" x2="42" y2="10"/>
    <line x1="60" y1="40" x2="78" y2="10"/>
    <line x1="60" y1="95" x2="45" y2="150"/>
    <line x1="60" y1="95" x2="75" y2="150"/>
    ${DOT(42, 10)}${DOT(78, 10)}${DOT(45, 150)}${DOT(75, 150)}
  `,
  armsOut: `
    <circle cx="60" cy="24" r="13" fill="var(--pose-color, #ff6a3d)"/>
    <line x1="60" y1="37" x2="60" y2="95"/>
    <line x1="60" y1="42" x2="15" y2="42"/>
    <line x1="60" y1="42" x2="105" y2="42"/>
    <line x1="60" y1="95" x2="45" y2="150"/>
    <line x1="60" y1="95" x2="75" y2="150"/>
    ${DOT(15, 42)}${DOT(105, 42)}${DOT(45, 150)}${DOT(75, 150)}
  `,
  pullPosition: `
    <circle cx="85" cy="40" r="13" fill="var(--pose-color, #ff6a3d)"/>
    <line x1="85" y1="53" x2="85" y2="100"/>
    <line x1="80" y1="60" x2="40" y2="55"/>
    <line x1="80" y1="65" x2="45" y2="80"/>
    <line x1="85" y1="100" x2="70" y2="145"/>
    <line x1="85" y1="100" x2="100" y2="145"/>
    ${DOT(40, 55)}${DOT(45, 80)}${DOT(70, 145)}${DOT(100, 145)}
  `,
  plankPosition: `
    <circle cx="20" cy="85" r="13" fill="var(--pose-color, #ff6a3d)"/>
    <line x1="33" y1="85" x2="100" y2="85"/>
    <line x1="45" y1="85" x2="45" y2="110"/>
    <line x1="100" y1="85" x2="100" y2="130"/>
    ${DOT(45, 110)}${DOT(100, 130)}
  `,
  hangPosition: `
    <line x1="60" y1="10" x2="60" y2="20"/>
    <circle cx="60" cy="33" r="13" fill="var(--pose-color, #ff6a3d)"/>
    <line x1="60" y1="46" x2="45" y2="15"/>
    <line x1="60" y1="46" x2="75" y2="15"/>
    <line x1="60" y1="46" x2="60" y2="105"/>
    <line x1="60" y1="105" x2="50" y2="150"/>
    <line x1="60" y1="105" x2="70" y2="150"/>
    ${DOT(45, 15)}${DOT(75, 15)}${DOT(50, 150)}${DOT(70, 150)}
  `,
};

const SVG_OPEN = '<svg viewBox="0 0 120 160" fill="none" stroke="var(--pose-color, #ff6a3d)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">';

export function renderPoseSvg(poseId) {
  const inner = POSES[poseId] ?? POSES.standing;
  return `${SVG_OPEN}${inner}</svg>`;
}

// Floor holds have no sensible "standing" antecedent frame - keep them static.
const STATIC_POSES = new Set(['plankPosition']);

export function getPoseFrames(poseId) {
  return STATIC_POSES.has(poseId) ? [poseId, null] : ['standing', poseId];
}

// Crossfades between two named poses to suggest the exercise's movement
// (e.g. standing -> bent for a squat). Pass the same id twice, or omit
// poseIdB, for holds/isometric exercises where there's no second position.
export function renderAnimatedPoseSvg(poseIdA, poseIdB) {
  if (!poseIdB || poseIdA === poseIdB) return renderPoseSvg(poseIdA);
  const a = POSES[poseIdA] ?? POSES.standing;
  const b = POSES[poseIdB] ?? POSES.standing;
  return `
    ${SVG_OPEN}
      <g class="pose-frame pose-frame-a">${a}</g>
      <g class="pose-frame pose-frame-b">${b}</g>
    </svg>
  `;
}
