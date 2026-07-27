// Nutritional values are per 100g of the RAW/uncooked ingredient (standard
// reference convention, consistent with USDA FoodData Central / BEDCA
// figures), except where noted. All Mediterranean, Barcelona-market
// staples — no imported "superfoods".

export const FOOD_GROUPS = [
  {
    id: 'proteinaAnimal',
    label: 'Proteïna animal',
    portionGuide: '120-150g cru per àpat principal (mida del palmell de la mà + el gruix dels dits)',
    foods: [
      { name: 'Pit de pollastre', kcal: 165, protein: 31, fat: 3.6, carbs: 0 },
      { name: 'Cuixa de pollastre (sense pell)', kcal: 172, protein: 20, fat: 10, carbs: 0 },
      { name: 'Pit de gall dindi', kcal: 135, protein: 30, fat: 1, carbs: 0 },
      { name: 'Conill', kcal: 173, protein: 21, fat: 8, carbs: 0 },
      { name: 'Llom de porc', kcal: 143, protein: 21, fat: 6, carbs: 0 },
      { name: 'Vedella magra', kcal: 158, protein: 22, fat: 7, carbs: 0 },
      { name: 'Sardines', kcal: 208, protein: 25, fat: 11, carbs: 0 },
      { name: 'Seitó / anxova', kcal: 131, protein: 20, fat: 4.8, carbs: 0 },
      { name: 'Verat', kcal: 205, protein: 19, fat: 13, carbs: 0 },
      { name: 'Tonyina fresca', kcal: 144, protein: 23, fat: 5, carbs: 0 },
      { name: 'Lluç', kcal: 86, protein: 18, fat: 1, carbs: 0 },
      { name: 'Orada', kcal: 121, protein: 20, fat: 4.5, carbs: 0 },
      { name: 'Salmó', kcal: 208, protein: 20, fat: 13, carbs: 0 },
      { name: 'Gambes / llagostins', kcal: 85, protein: 20, fat: 0.5, carbs: 0.9 },
      { name: 'Pop', kcal: 82, protein: 15, fat: 1, carbs: 2.2 },
      { name: 'Ou (100g ≈ 2 unitats)', kcal: 155, protein: 13, fat: 11, carbs: 1.1 },
    ],
  },
  {
    id: 'llegums',
    label: 'Llegums (proteïna + hidrats vegetals)',
    portionGuide: '60-80g secs (150-200g ja cuits) per àpat principal com a base de proteïna vegetal',
    foods: [
      { name: 'Llenties (seques)', kcal: 353, protein: 25, fat: 1, carbs: 60 },
      { name: 'Cigrons (secs)', kcal: 364, protein: 19, fat: 6, carbs: 61 },
      { name: 'Mongetes seques', kcal: 333, protein: 24, fat: 1.5, carbs: 60 },
      { name: 'Mongetes del ganxet (seques)', kcal: 337, protein: 23, fat: 1.2, carbs: 61 },
      { name: 'Faves seques', kcal: 341, protein: 26, fat: 1.5, carbs: 58 },
      { name: 'Pèsols', kcal: 81, protein: 5.4, fat: 0.4, carbs: 14 },
      { name: 'Tofu', kcal: 76, protein: 8, fat: 4.8, carbs: 1.9 },
    ],
  },
  {
    id: 'hidrats',
    label: 'Hidrats de carboni',
    portionGuide: '60-80g crus d\'arròs/pasta (un grapat tancat), o 200-250g de patata, per àpat principal',
    foods: [
      { name: 'Arròs blanc', kcal: 360, protein: 7, fat: 0.6, carbs: 79 },
      { name: 'Arròs integral', kcal: 370, protein: 7.5, fat: 2.7, carbs: 77 },
      { name: 'Pasta blanca', kcal: 371, protein: 13, fat: 1.5, carbs: 75 },
      { name: 'Pasta integral', kcal: 350, protein: 13, fat: 2.5, carbs: 66 },
      { name: 'Cuscús', kcal: 376, protein: 13, fat: 0.6, carbs: 77 },
      { name: 'Quinoa', kcal: 368, protein: 14, fat: 6, carbs: 64 },
      { name: 'Patata', kcal: 77, protein: 2, fat: 0.1, carbs: 17 },
      { name: 'Moniato', kcal: 86, protein: 1.6, fat: 0.1, carbs: 20 },
      { name: 'Pa de pagès', kcal: 265, protein: 9, fat: 1.5, carbs: 53 },
      { name: 'Pa integral', kcal: 247, protein: 10, fat: 2.5, carbs: 41 },
      { name: 'Flocs de civada', kcal: 379, protein: 13, fat: 7, carbs: 67 },
    ],
  },
  {
    id: 'verdura',
    label: 'Verdura',
    portionGuide: 'Mínim 150-200g per àpat principal (mig plat), pràcticament sense límit',
    foods: [
      { name: 'Enciam', kcal: 15, protein: 1.4, fat: 0.2, carbs: 2.9 },
      { name: 'Escarola', kcal: 17, protein: 1.7, fat: 0.2, carbs: 3.4 },
      { name: 'Tomàquet', kcal: 18, protein: 0.9, fat: 0.2, carbs: 3.9 },
      { name: 'Pebrot', kcal: 31, protein: 1, fat: 0.3, carbs: 6 },
      { name: 'Carbassó', kcal: 17, protein: 1.2, fat: 0.3, carbs: 3.1 },
      { name: 'Albergínia', kcal: 25, protein: 1, fat: 0.2, carbs: 6 },
      { name: 'Bledes', kcal: 19, protein: 1.8, fat: 0.2, carbs: 3.7 },
      { name: 'Espinacs', kcal: 23, protein: 2.9, fat: 0.4, carbs: 3.6 },
      { name: 'Pastanaga', kcal: 41, protein: 0.9, fat: 0.2, carbs: 10 },
      { name: 'Ceba', kcal: 40, protein: 1.1, fat: 0.1, carbs: 9.3 },
      { name: 'Porro', kcal: 61, protein: 1.5, fat: 0.3, carbs: 14 },
      { name: 'Bròquil', kcal: 34, protein: 2.8, fat: 0.4, carbs: 6.6 },
      { name: 'Coliflor', kcal: 25, protein: 1.9, fat: 0.3, carbs: 5 },
      { name: 'Mongeta tendra (verda)', kcal: 31, protein: 1.8, fat: 0.2, carbs: 7 },
      { name: 'Carxofa', kcal: 47, protein: 3.3, fat: 0.2, carbs: 10 },
      { name: 'Cogombre', kcal: 15, protein: 0.7, fat: 0.1, carbs: 3.6 },
      { name: 'Bolets (xampinyons)', kcal: 22, protein: 3.1, fat: 0.3, carbs: 3.3 },
    ],
  },
  {
    id: 'fruita',
    label: 'Fruita de temporada',
    portionGuide: '1 peça mitjana (~150g) per àpat o snack',
    foods: [
      { name: 'Poma', kcal: 52, protein: 0.3, fat: 0.2, carbs: 14 },
      { name: 'Pera', kcal: 57, protein: 0.4, fat: 0.1, carbs: 15 },
      { name: 'Plàtan', kcal: 89, protein: 1.1, fat: 0.3, carbs: 23 },
      { name: 'Taronja', kcal: 47, protein: 0.9, fat: 0.1, carbs: 12 },
      { name: 'Mandarina', kcal: 53, protein: 0.8, fat: 0.3, carbs: 13 },
      { name: 'Préssec', kcal: 39, protein: 0.9, fat: 0.3, carbs: 10 },
      { name: 'Nectarina', kcal: 44, protein: 1.1, fat: 0.3, carbs: 11 },
      { name: 'Albercoc', kcal: 48, protein: 1.4, fat: 0.4, carbs: 11 },
      { name: 'Raïm', kcal: 69, protein: 0.7, fat: 0.2, carbs: 18 },
      { name: 'Meló', kcal: 34, protein: 0.8, fat: 0.2, carbs: 8 },
      { name: 'Síndria', kcal: 30, protein: 0.6, fat: 0.2, carbs: 8 },
      { name: 'Maduixes', kcal: 33, protein: 0.7, fat: 0.3, carbs: 7.7 },
      { name: 'Figues', kcal: 74, protein: 0.8, fat: 0.3, carbs: 19 },
      { name: 'Caqui', kcal: 70, protein: 0.6, fat: 0.2, carbs: 18 },
    ],
  },
  {
    id: 'lactics',
    label: 'Làctics',
    portionGuide: '1 iogurt (125g) o 100g de formatge fresc per àpat o snack',
    foods: [
      { name: 'Iogurt natural', kcal: 61, protein: 3.5, fat: 3.3, carbs: 4.7 },
      { name: 'Iogurt grec 0%', kcal: 59, protein: 10, fat: 0.4, carbs: 3.6 },
      { name: 'Formatge fresc de Burgos', kcal: 174, protein: 13, fat: 13, carbs: 3 },
      { name: 'Formatge fresc batut (0%)', kcal: 55, protein: 8, fat: 0.2, carbs: 4 },
      { name: 'Mató', kcal: 98, protein: 12, fat: 5, carbs: 2 },
      { name: 'Formatge curat (tou de porció)', kcal: 380, protein: 25, fat: 30, carbs: 1.5 },
      { name: 'Llet sencera', kcal: 61, protein: 3.2, fat: 3.3, carbs: 4.8 },
      { name: 'Llet semidesnatada', kcal: 46, protein: 3.3, fat: 1.6, carbs: 4.8 },
    ],
  },
  {
    id: 'greixos',
    label: 'Greixos',
    portionGuide: '1 cullerada d\'oli (10-15ml) per àpat principal + opcional 1 grapat petit de fruits secs (20-25g) com a snack',
    foods: [
      { name: 'Oli d\'oliva verge', kcal: 884, protein: 0, fat: 100, carbs: 0 },
      { name: 'Olives', kcal: 115, protein: 0.8, fat: 11, carbs: 6 },
      { name: 'Nous', kcal: 654, protein: 15, fat: 65, carbs: 14 },
      { name: 'Ametlles', kcal: 579, protein: 21, fat: 50, carbs: 22 },
      { name: 'Avellanes', kcal: 628, protein: 15, fat: 61, carbs: 17 },
      { name: 'Festucs', kcal: 560, protein: 20, fat: 45, carbs: 28 },
      { name: 'Llavors de gira-sol', kcal: 584, protein: 21, fat: 51, carbs: 20 },
    ],
  },
];

export const MEAL_TEMPLATES = [
  {
    meal: 'Esmorzar',
    template: '1 font làctia o ou + 1 font d\'hidrats + fruita',
    example: 'Iogurt grec + flocs de civada + poma, o 2 ous + pa de pagès + taronja.',
  },
  {
    meal: 'Dinar',
    template: '1 porció de proteïna (animal o llegum) + 1 porció d\'hidrats + verdura abundant + oli d\'oliva',
    example: 'Pit de pollastre + arròs + amanida + oli, o llenties guisades amb verdures (el llegum ja aporta proteïna i hidrats alhora).',
  },
  {
    meal: 'Sopar',
    template: 'Igual que el dinar però amb una porció d\'hidrats una mica més petita, per repartir millor els hidrats al llarg del dia',
    example: 'Peix blau + verdura saltada + una porció petita de patata o pa.',
  },
  {
    meal: 'Snack',
    template: 'Proteïna petita + fruita o fruits secs',
    example: 'Iogurt natural + nous, o formatge fresc + fruita.',
  },
];

export const COOKING_TIPS = [
  {
    title: 'Cuina per lots (batch cooking)',
    text: 'Cuina 2-3 racions de llegums, arròs o cereal integral d\'un cop i reparteix-les en envasos individuals a la nevera (3-4 dies) o congelador (fins a 3 mesos). Estalvia temps entre setmana sense dependre de plats preparats.',
  },
  {
    title: 'Remull intel·ligent dels llegums',
    text: 'Deixa els llegums secs en remull 8-12h (amb un raig de vinagre o suc de llimona a l\'aigua) abans de coure\'ls. Redueix el temps de cocció, millora la digestió i redueix la flatulència.',
  },
  {
    title: 'Congelar bé',
    text: 'Reparteix el menjar cuinat en bosses o envasos plans (no alts) abans de congelar: es descongelen més ràpid i uniformement. Etiqueta amb la data — prioritza consumir en 2-3 mesos.',
  },
  {
    title: 'Verdura sempre a mà',
    text: 'Renta i talla la verdura just en comprar-la (amanida, carbassó, pebrot) i guarda-la en un envàs a la nevera. Tenir-la ja preparada fa molt més fàcil afegir-ne a qualsevol àpat.',
  },
];

export function getFoodGroupById(id) {
  return FOOD_GROUPS.find((g) => g.id === id) ?? null;
}
