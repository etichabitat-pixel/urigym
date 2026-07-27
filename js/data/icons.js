const ICONS = {
  home: '<path d="M4 11L12 4l8 7"/><path d="M6 10v9h12v-9"/>',
  diet: '<path d="M4 11h16"/><path d="M5 11a7 7 0 0014 0"/><path d="M9 11V7"/><path d="M12 11V6"/><path d="M15 11V7"/>',
  exercises: '<path d="M4 5c2-1 5-1 8 1 3-2 6-2 8-1v14c-2-1-5-1-8 1-3-2-6-2-8-1V5z"/><path d="M12 6v14"/>',
  progress: '<path d="M4 19h16"/><path d="M7 15l3-4 3 2 5-7"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  gym: '<path d="M6 8v8M18 8v8M9 12h6"/><rect x="3" y="9" width="3" height="6" rx="1"/><rect x="18" y="9" width="3" height="6" rx="1"/>',
  casa: '<path d="M4 10l8-6 8 6v9a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1v-9z"/>',
  outdoor: '<path d="M12 3l5 7h-3l4 6h-4v5h-4v-5H6l4-6H7z"/>',
  recovery: '<path d="M3 12h4l2-5 3 10 2-7 2 2h5"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
  close: '<path d="M5 5l14 14M19 5L5 19"/>',
  check: '<path d="M4 12l5 5L20 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  flame: '<path d="M12 3c1 3-3 4-3 7a3 3 0 006 0c0-1-1-2-1-3 2 1 3 3 3 5a5 5 0 01-10 0c0-4 3-5 5-9z"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5"/>',
  bell: '<path d="M6 16v-5a6 6 0 0112 0v5l2 2H4l2-2z"/><path d="M10 20a2 2 0 004 0"/>',
  info: '<circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="7.5" r="0.6" fill="currentColor" stroke="none"/>',
  cames: '<path d="M9 3v8l-2 10M15 3v8l2 10"/>',
  glutis: '<path d="M7 4h10v6a5 5 0 01-10 0V4z"/><path d="M12 4v6"/>',
  pit: '<path d="M4 8a4 4 0 018 0 4 4 0 018 0v3a6 6 0 01-8 6 6 6 0 01-8-6V8z"/>',
  esquena: '<path d="M8 21V9a4 4 0 118 0v12"/><path d="M8 14h8"/>',
  espatlles: '<path d="M4 9a4 4 0 018 0M12 9a4 4 0 018 0"/><path d="M4 9v3M20 9v3"/>',
  core: '<rect x="7" y="6" width="10" height="12" rx="3"/><path d="M7 12h10"/>',
  cadenaPosterior: '<path d="M6 4c0 6 2 8 2 12s-1 4-1 4M18 4c0 6-2 8-2 12s1 4 1 4"/>',
  agafament: '<path d="M5 12h14"/><path d="M5 12a2 2 0 100-4 2 2 0 000 4zM19 12a2 2 0 100-4 2 2 0 000 4z"/>',
  proteinaAnimal: '<path d="M3 12c4-4 12-4 16 0-4 4-12 4-16 0z"/><circle cx="16" cy="12" r="0.6"/><path d="M19 12l3-3v6l-3-3z"/>',
  llegums: '<path d="M6 4c-3 4-3 12 0 16 6-1 12-1 12-8S12 3 6 4z"/><circle cx="10" cy="10" r="1.2"/><circle cx="13" cy="14" r="1.2"/>',
  hidrats: '<path d="M4 14a8 4 0 0116 0c0 2-4 4-8 4s-8-2-8-4z"/><path d="M6 14V9M12 14V7M18 14V9"/>',
  verdura: '<circle cx="9" cy="8" r="3"/><circle cx="14" cy="7" r="2.5"/><circle cx="12" cy="10" r="2.5"/><path d="M12 12v9"/>',
  fruita: '<path d="M12 8a5 5 0 015 5c0 4-3 7-5 7s-5-3-5-7a5 5 0 015-5z"/><path d="M12 8V5M12 5c1-1 2-1 3-1"/>',
  lactics: '<path d="M8 3h8l-1 4H9L8 3z"/><path d="M8 7h8l-1 13H9L8 7z"/>',
  greixos: '<path d="M12 3c3 5 6 8 6 11a6 6 0 01-12 0c0-3 3-6 6-11z"/>',
  squat: '<circle cx="4" cy="12" r="2"/><circle cx="20" cy="12" r="2"/><path d="M6 12h12"/><path d="M9 12v4l-2 6M15 12v4l2 6"/>',
  benchPress: '<path d="M4 18h16"/><circle cx="7" cy="6" r="2"/><circle cx="17" cy="6" r="2"/><path d="M9 6h6"/><path d="M9 6v8M15 6v8"/>',
  seatedCableRow: '<circle cx="19" cy="5" r="2"/><path d="M19 7L9 15"/><path d="M9 15h-3"/><path d="M6 15v6M6 21h6"/>',
  dbOverheadPress: '<circle cx="7" cy="4" r="2"/><circle cx="17" cy="4" r="2"/><path d="M7 6v4M17 6v4"/><path d="M7 10l5 4 5-4"/><path d="M12 14v6"/>',
  hipThrust: '<path d="M3 16h5v5"/><path d="M8 16c3-6 9-6 12 0"/><path d="M20 16v5"/>',
  plank: '<path d="M2 18l6-4h8l6 4"/><path d="M4 21h16"/>',
  deadlift: '<circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 19h10"/><path d="M12 19l3-13"/><path d="M15 6l4 2"/>',
  latPulldownOrAssistedPullup: '<circle cx="12" cy="4" r="2"/><path d="M12 6v3"/><path d="M6 9h12"/><path d="M6 9v4M18 9v4"/><path d="M9 20v-4M15 20v-4"/>',
  inclineDbPress: '<path d="M4 20l10-14"/><circle cx="9" cy="4" r="2"/><circle cx="17" cy="8" r="2"/><path d="M9 6v3M17 10v3"/>',
  reverseLunge: '<path d="M12 3v10"/><ellipse cx="8" cy="19" rx="3" ry="1.5"/><ellipse cx="16" cy="15" rx="3" ry="1.5"/>',
  lateralRaise: '<path d="M12 4v10"/><path d="M2 9h20"/><circle cx="2" cy="9" r="2"/><circle cx="22" cy="9" r="2"/>',
  facePull: '<circle cx="12" cy="4" r="2"/><path d="M12 6v3"/><path d="M6 20l6-11 6 11"/>',
  deadBug: '<path d="M2 16h20"/><path d="M12 16l-6-10"/><path d="M12 16l6 6"/>',
  farmerCarry: '<rect x="2" y="8" width="4" height="10" rx="1"/><rect x="18" y="8" width="4" height="10" rx="1"/><path d="M12 6v9"/><path d="M9 19l3-4 3 4"/>',
};

const MUSCLE_KEYWORD_ORDER = [
  ['cames', 'cames'],
  ['glutis', 'glutis'],
  ['pit', 'pit'],
  ['esquena', 'esquena'],
  ['espatll', 'espatlles'],
  ['core', 'core'],
  ['cadena', 'cadenaPosterior'],
  ['agafament', 'agafament'],
];

export function icon(name, size = 18) {
  const body = ICONS[name];
  if (!body) return '';
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

export function iconForMuscleGroup(muscleGroup, size = 18) {
  const text = muscleGroup.toLowerCase();
  for (const [keyword, iconName] of MUSCLE_KEYWORD_ORDER) {
    if (text.includes(keyword)) return icon(iconName, size);
  }
  return '';
}
