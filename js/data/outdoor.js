export const OUTDOOR_OPTIONS = [
  {
    id: 'walk',
    name: 'Caminar',
    duration: '30-45 min',
    intensity: 'Ritme "puc parlar però em costa una mica"',
    warmup: 'No cal escalfament específic, els primers 5 min ja fan de rampa suau.',
    cooldown: null,
  },
  {
    id: 'run',
    name: 'Córrer',
    duration: '20-30 min',
    intensity: 'Ritme conversacional',
    warmup: '5 min caminant + mobilitat dinàmica de turmell i maluc.',
    cooldown: 'Estirament de bessons, quàdriceps i isquiotibials, 30s cadascun.',
  },
  {
    id: 'calisthenics',
    name: 'Calistènia de parc',
    duration: '20-30 min',
    intensity: 'Circuit',
    warmup: "Escalfament articular 5 min (rotacions d'espatlla, maluc, turmell).",
    circuit: [
      { exercise: 'Dominades (o progressió NachoGST — vegeu latPulldownOrAssistedPullup)', sets: 3, reps: '3-8' },
      { exercise: 'Fondos en paral·leles', sets: 3, reps: '5-10' },
      { exercise: 'Elevacions de cames penjat', sets: 3, reps: '8-12' },
      { exercise: "Sentadilles a una cama / step-ups a un banc", sets: 3, reps: '8-10 per cama' },
    ],
    cooldown: 'Estiraments de braços, espatlles i cames, 5 min.',
  },
];

export function getOutdoorOptionById(id) {
  return OUTDOOR_OPTIONS.find((o) => o.id === id) ?? null;
}
