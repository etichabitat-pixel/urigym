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

const SESSION_LABELS = {
  gym: 'Gimnàs',
  casaCurt: 'Casa (curt)',
  casaComplet: 'Casa (complet)',
};

export function getWorkoutUsagesForExercise(exerciseId) {
  const usages = [];
  for (const letter of Object.keys(WORKOUTS)) {
    for (const variant of Object.keys(WORKOUTS[letter])) {
      const item = WORKOUTS[letter][variant].find((i) => i.exerciseId === exerciseId);
      if (item) {
        usages.push({ letter, variant, label: SESSION_LABELS[variant], baseSets: item.baseSets, reps: item.reps });
      }
    }
  }
  return usages;
}

export const GYM_WARMUP = [
  {
    phase: 'Pujada de pulsacions',
    duration: '3-5 min',
    description: 'Bici estàtica o cinta suau per pujar les pulsacions.',
    steps: [
      "Comença suau i vés augmentant el ritme a poc a poc",
      "Has d'acabar una mica escalfat i respirant més fort, no esgotat",
      "Sense bici o cinta: camina ràpid o puja escales el mateix temps",
    ],
  },
  {
    phase: 'Activació i mobilitat',
    duration: '3 min',
    description: "Mobilitat dinàmica de malucs i espatlles, esquats amb pes corporal, postura del gat-camell.",
    steps: [
      "Cercles de malucs i d'espatlles, 10 repeticions cada sentit",
      "Esquats a pes corporal, 10-15 repeticions lentes i controlades",
      "Postura del gat-camell (a quatre grapes, arqueja i arrodoneix l'esquena), 8-10 repeticions",
      "L'objectiu és moure les articulacions que faràs servir avui, no cansar-te",
    ],
  },
  {
    phase: 'Potenciació',
    duration: '2 min',
    description: "1-2 sèries d'aproximació del primer exercici, pujant de pes fins al pes de treball.",
    steps: [
      "Fes 1-2 sèries del primer exercici de la sessió amb menys pes del habitual",
      "Puja de pes a cada sèrie fins arribar al pes real de la primera sèrie de treball",
      "Serveix per preparar l'articulació i el sistema nerviós, no per fatigar-te",
    ],
  },
];

export const COOLDOWN_STRETCH = [
  {
    name: 'Estirament de quàdriceps i isquiotibials',
    duration: '30s per cama',
    description: 'Estira la part davantera i posterior de la cuixa.',
    icon: 'cames',
    steps: [
      "Quàdriceps: dret, agafa't el turmell darrere teu i porta el taló cap al glutis, genolls junts",
      "Isquiotibials: assegut o dret amb la cama estesa, inclina't cap endavant des dels malucs sense arrodonir l'esquena",
      "Nota estirament suau, no dolor; no facis rebots",
    ],
  },
  {
    name: 'Estirament de pit i espatlles',
    duration: '30s',
    description: 'Amb els braços a la paret.',
    icon: 'pit',
    steps: [
      "Braç a l'alçada de l'espatlla contra una paret o marc de porta, palmell pla",
      "Gira lentament el cos cap al costat contrari fins notar estirament al pit",
      "Repeteix amb l'altre braç",
    ],
  },
  {
    name: "Estirament de la part baixa de l'esquena",
    duration: '30-45s',
    description: 'Postura del nen.',
    icon: 'esquena',
    steps: [
      "De genolls, asseu-te sobre els talons i estira els braços endavant al terra",
      "Deixa caure el pit cap a terra, relaxant l'esquena baixa",
      "Respira profund i mantén la posició sense forçar",
    ],
  },
];
