export const POSES = {
  standing: `
    <circle cx="60" cy="24" r="10" fill="#1a5fa8"/>
    <line x1="60" y1="34" x2="60" y2="95"/>
    <line x1="60" y1="45" x2="42" y2="70"/>
    <line x1="60" y1="45" x2="78" y2="70"/>
    <line x1="60" y1="95" x2="45" y2="150"/>
    <line x1="60" y1="95" x2="75" y2="150"/>
  `,
  bent: `
    <circle cx="70" cy="45" r="10" fill="#1a5fa8"/>
    <line x1="70" y1="55" x2="55" y2="90"/>
    <line x1="60" y1="65" x2="35" y2="55"/>
    <line x1="60" y1="65" x2="85" y2="55"/>
    <line x1="55" y1="90" x2="30" y2="100"/>
    <line x1="30" y1="100" x2="35" y2="150"/>
    <line x1="55" y1="90" x2="80" y2="105"/>
    <line x1="80" y1="105" x2="72" y2="150"/>
  `,
  pushPosition: `
    <circle cx="25" cy="95" r="10" fill="#1a5fa8"/>
    <line x1="35" y1="95" x2="95" y2="95"/>
    <line x1="55" y1="95" x2="55" y2="65"/>
    <line x1="55" y1="65" x2="78" y2="78"/>
    <line x1="95" y1="95" x2="105" y2="70"/>
    <line x1="105" y1="70" x2="100" y2="130"/>
  `,
  overhead: `
    <circle cx="60" cy="24" r="10" fill="#1a5fa8"/>
    <line x1="60" y1="34" x2="60" y2="95"/>
    <line x1="60" y1="40" x2="42" y2="10"/>
    <line x1="60" y1="40" x2="78" y2="10"/>
    <line x1="60" y1="95" x2="45" y2="150"/>
    <line x1="60" y1="95" x2="75" y2="150"/>
  `,
  armsOut: `
    <circle cx="60" cy="24" r="10" fill="#1a5fa8"/>
    <line x1="60" y1="34" x2="60" y2="95"/>
    <line x1="60" y1="42" x2="15" y2="42"/>
    <line x1="60" y1="42" x2="105" y2="42"/>
    <line x1="60" y1="95" x2="45" y2="150"/>
    <line x1="60" y1="95" x2="75" y2="150"/>
  `,
  pullPosition: `
    <circle cx="85" cy="40" r="10" fill="#1a5fa8"/>
    <line x1="85" y1="50" x2="85" y2="100"/>
    <line x1="80" y1="60" x2="40" y2="55"/>
    <line x1="80" y1="65" x2="45" y2="80"/>
    <line x1="85" y1="100" x2="70" y2="145"/>
    <line x1="85" y1="100" x2="100" y2="145"/>
  `,
  plankPosition: `
    <circle cx="20" cy="85" r="10" fill="#1a5fa8"/>
    <line x1="30" y1="85" x2="100" y2="85"/>
    <line x1="45" y1="85" x2="45" y2="110"/>
    <line x1="100" y1="85" x2="100" y2="130"/>
  `,
  hangPosition: `
    <line x1="60" y1="10" x2="60" y2="20"/>
    <circle cx="60" cy="32" r="10" fill="#1a5fa8"/>
    <line x1="60" y1="42" x2="45" y2="15"/>
    <line x1="60" y1="42" x2="75" y2="15"/>
    <line x1="60" y1="42" x2="60" y2="105"/>
    <line x1="60" y1="105" x2="50" y2="150"/>
    <line x1="60" y1="105" x2="70" y2="150"/>
  `,
};

export function renderPoseSvg(poseId) {
  const inner = POSES[poseId] ?? POSES.standing;
  return `<svg viewBox="0 0 120 160" fill="none" stroke="#1a5fa8" stroke-width="5" stroke-linecap="round">${inner}</svg>`;
}
