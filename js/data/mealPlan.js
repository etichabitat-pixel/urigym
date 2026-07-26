export const BREAKFAST_OPTIONS = [
  { name: 'Iogurt natural amb nous i fruita de temporada', kcal: 320, protein: 18, fat: 14, carbs: 32, ingredients: ['iogurt natural', 'nous', 'fruita de temporada'] },
  { name: 'Torrades de pa de pagès amb tomàquet, oli i pernil salat', kcal: 380, protein: 20, fat: 16, carbs: 38, ingredients: ['pa de pagès', 'tomàquet', "oli d'oliva", 'pernil salat'] },
  { name: 'Truita de 2 ous amb espinacs i una llesca de pa', kcal: 350, protein: 22, fat: 20, carbs: 22, ingredients: ['ous', 'espinacs', 'pa de pagès', "oli d'oliva"] },
  { name: 'Formatge fresc amb mel i festuc', kcal: 300, protein: 20, fat: 12, carbs: 28, ingredients: ['formatge fresc de Burgos', 'mel', 'festucs'] },
  { name: 'Porridge de civada amb llet i canyella', kcal: 340, protein: 16, fat: 8, carbs: 55, ingredients: ['flocs de civada', 'llet', 'canyella', 'fruita de temporada'] },
  { name: 'Entrepà de pa de pagès amb truita francesa de 3 ous', kcal: 420, protein: 26, fat: 20, carbs: 36, ingredients: ['pa de pagès', 'ous'] },
  { name: 'Iogurt grec amb galetes maria i plàtan', kcal: 330, protein: 18, fat: 10, carbs: 45, ingredients: ['iogurt grec', 'galetes maria', 'plàtan'] },
  { name: 'Torrades amb formatge fresc i pernil dolç', kcal: 360, protein: 24, fat: 14, carbs: 32, ingredients: ['pa de pagès', 'formatge fresc', 'pernil dolç'] },
];

export const MAIN_OPTIONS = [
  { name: 'Llenties guisades amb verdures i arròs', kcal: 650, protein: 32, fat: 14, carbs: 95, ingredients: ['llenties', 'ceba', 'pastanaga', 'tomàquet', 'arròs', "oli d'oliva"] },
  { name: 'Sardines a la planxa amb amanida i patata bullida', kcal: 620, protein: 40, fat: 26, carbs: 40, ingredients: ['sardines', 'enciam', 'tomàquet', 'patata', "oli d'oliva"] },
  { name: 'Pollastre a la planxa amb arròs i verdures saltades', kcal: 700, protein: 50, fat: 16, carbs: 75, ingredients: ['pit de pollastre', 'arròs', 'pebrot', 'carbassó', "oli d'oliva"] },
  { name: 'Cigrons amb espinacs i ou dur', kcal: 630, protein: 30, fat: 22, carbs: 68, ingredients: ['cigrons', 'espinacs', 'ou', 'all', "oli d'oliva"] },
  { name: 'Verat al forn amb patata i amanida', kcal: 610, protein: 38, fat: 26, carbs: 38, ingredients: ['verat', 'patata', 'enciam', 'tomàquet', "oli d'oliva"] },
  { name: 'Mongetes seques amb botifarra a la planxa i escalivada', kcal: 680, protein: 34, fat: 28, carbs: 60, ingredients: ['mongetes seques', 'botifarra', 'albergínia', 'pebrot', 'ceba'] },
  { name: 'Amanida de tonyina, cigrons, ou i verdures', kcal: 600, protein: 40, fat: 22, carbs: 42, ingredients: ['tonyina', 'cigrons', 'ou', 'enciam', 'tomàquet', "oli d'oliva"] },
  { name: 'Arròs a la cassola amb conill i verdures', kcal: 660, protein: 34, fat: 18, carbs: 78, ingredients: ['conill', 'arròs', 'pebrot', 'tomàquet', "oli d'oliva"] },
  { name: 'Seitó marinat amb amanida i pa de pagès', kcal: 580, protein: 32, fat: 20, carbs: 48, ingredients: ['seitó', 'enciam', 'tomàquet', 'pa de pagès', "oli d'oliva"] },
  { name: 'Mongetes amb llom i verdures de temporada', kcal: 640, protein: 32, fat: 20, carbs: 62, ingredients: ['mongetes', 'llom', 'bledes', 'pastanaga', "oli d'oliva"] },
];

export const SNACK_OPTIONS = [
  { name: 'Iogurt natural', kcal: 100, protein: 8, fat: 3, carbs: 10, ingredients: ['iogurt natural'] },
  { name: 'Grapat de nous', kcal: 180, protein: 5, fat: 16, carbs: 4, ingredients: ['nous'] },
  { name: 'Formatge fresc amb tomàquets cherry', kcal: 150, protein: 14, fat: 8, carbs: 6, ingredients: ['formatge fresc', 'tomàquets cherry'] },
  { name: 'Fruita de temporada', kcal: 90, protein: 1, fat: 0, carbs: 22, ingredients: ['fruita de temporada'] },
];

export const PROTEIN_SNACK_OPTIONS = [
  { name: "Tres ous durs amb un grapat d'ametlles", kcal: 270, protein: 24, fat: 19, carbs: 4, ingredients: ['ous', 'ametlles'] },
  { name: 'Iogurt grec 0% amb nous i llavors de cànem', kcal: 240, protein: 24, fat: 12, carbs: 9, ingredients: ['iogurt grec 0%', 'nous', 'llavors de cànem'] },
  { name: 'Llesca de pa de pagès amb tonyina i ou', kcal: 280, protein: 27, fat: 10, carbs: 23, ingredients: ['pa de pagès', 'tonyina', 'ou'] },
  { name: 'Formatge fresc de Burgos amb pernil dolç i nous', kcal: 260, protein: 26, fat: 14, carbs: 7, ingredients: ['formatge fresc de Burgos', 'pernil dolç', 'nous'] },
];

function scaleForDinner(option) {
  return {
    ...option,
    kcal: Math.round(option.kcal * 0.8),
    protein: Math.round(option.protein * 0.8),
    fat: Math.round(option.fat * 0.8),
    carbs: Math.round(option.carbs * 0.8),
  };
}

export function getMealsForDay(dayIndex) {
  const b = BREAKFAST_OPTIONS;
  const m = MAIN_OPTIONS;
  const s = SNACK_OPTIONS;
  const p = PROTEIN_SNACK_OPTIONS;
  return {
    breakfast: [b[dayIndex % b.length], b[(dayIndex + 4) % b.length]],
    lunch: [m[dayIndex % m.length], m[(dayIndex + 5) % m.length]],
    dinner: [m[(dayIndex + 2) % m.length], m[(dayIndex + 7) % m.length]].map(scaleForDinner),
    snack: [s[dayIndex % s.length], p[dayIndex % p.length]],
  };
}

export function generateShoppingList() {
  const counts = {};
  for (let day = 0; day < 7; day++) {
    const meals = getMealsForDay(day);
    const allOptions = [...meals.breakfast, ...meals.lunch, ...meals.dinner, ...meals.snack];
    for (const option of allOptions) {
      for (const ingredient of option.ingredients) {
        counts[ingredient] = (counts[ingredient] || 0) + 1;
      }
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([ingredient, count]) => ({ ingredient, count }));
}
