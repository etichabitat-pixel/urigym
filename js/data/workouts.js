export const WORKOUTS = {
  A: {
    gym: [
      { exerciseId: 'squat', baseSets: 3, reps: '8-12' },
      { exerciseId: 'benchPress', baseSets: 3, reps: '8-12' },
      { exerciseId: 'seatedCableRow', baseSets: 3, reps: '8-12' },
      { exerciseId: 'dbOverheadPress', baseSets: 2, reps: '10-12' },
      { exerciseId: 'hipThrust', baseSets: 3, reps: '8-12' },
      { exerciseId: 'plank', baseSets: 2, reps: '30-45s' },
    ],
    casaCurt: [
      { exerciseId: 'squat', baseSets: 2, reps: '12-15' },
      { exerciseId: 'benchPress', baseSets: 2, reps: '12-15' },
      { exerciseId: 'hipThrust', baseSets: 2, reps: '12-15' },
      { exerciseId: 'plank', baseSets: 2, reps: '20-30s' },
    ],
    casaComplet: [
      { exerciseId: 'squat', baseSets: 3, reps: '10-15' },
      { exerciseId: 'benchPress', baseSets: 3, reps: '10-15' },
      { exerciseId: 'seatedCableRow', baseSets: 3, reps: '10-15' },
      { exerciseId: 'dbOverheadPress', baseSets: 3, reps: '10-15' },
      { exerciseId: 'hipThrust', baseSets: 3, reps: '10-15' },
      { exerciseId: 'plank', baseSets: 3, reps: '30-45s' },
    ],
  },
  B: {
    gym: [
      { exerciseId: 'deadlift', baseSets: 3, reps: '6-10' },
      { exerciseId: 'latPulldownOrAssistedPullup', baseSets: 3, reps: '8-12' },
      { exerciseId: 'inclineDbPress', baseSets: 3, reps: '8-12' },
      { exerciseId: 'reverseLunge', baseSets: 3, reps: '8-12' },
      { exerciseId: 'lateralRaise', baseSets: 2, reps: '12-15' },
      { exerciseId: 'facePull', baseSets: 2, reps: '12-15' },
      { exerciseId: 'deadBug', baseSets: 2, reps: '10-12' },
      { exerciseId: 'farmerCarry', baseSets: 2, reps: '20-30m' },
    ],
    casaCurt: [
      { exerciseId: 'deadlift', baseSets: 2, reps: '10-12' },
      { exerciseId: 'latPulldownOrAssistedPullup', baseSets: 2, reps: '10-12' },
      { exerciseId: 'reverseLunge', baseSets: 2, reps: '10-12' },
      { exerciseId: 'deadBug', baseSets: 2, reps: '10-12' },
    ],
    casaComplet: [
      { exerciseId: 'deadlift', baseSets: 3, reps: '10-15' },
      { exerciseId: 'latPulldownOrAssistedPullup', baseSets: 3, reps: '8-12' },
      { exerciseId: 'inclineDbPress', baseSets: 3, reps: '10-15' },
      { exerciseId: 'reverseLunge', baseSets: 3, reps: '10-15' },
      { exerciseId: 'lateralRaise', baseSets: 3, reps: '12-15' },
      { exerciseId: 'facePull', baseSets: 2, reps: '12-15' },
      { exerciseId: 'deadBug', baseSets: 2, reps: '10-12' },
      { exerciseId: 'farmerCarry', baseSets: 2, reps: '20-30m' },
    ],
  },
};

export function getSetsForPhase(baseSets, phase) {
  if (phase === 'Adaptació') return Math.max(2, baseSets - 1);
  if (phase === 'Integració') return baseSets + 1;
  return baseSets; // Transformació = base, matches the spec's 3-4 sets
}

export const GYM_WARMUP = [
  { phase: 'Raise', duration: '3-5 min', description: 'Bici estàtica o cinta suau per pujar les pulsacions.' },
  { phase: 'Activate/Mobilize', duration: '3 min', description: "Mobilitat dinàmica de malucs i espatlles, squats amb pes corporal, cat-cow." },
  { phase: 'Potentiate', duration: '2 min', description: "1-2 sèries d'aproximació del primer exercici, pujant de pes fins al pes de treball." },
];

export const COOLDOWN_STRETCH = [
  'Estirament de quàdriceps i isquiotibials, 30s per cama',
  'Estirament de pit i espatlles amb els braços a la paret, 30s',
  "Estirament de la part baixa de l'esquena (postura del nen), 30-45s",
];
