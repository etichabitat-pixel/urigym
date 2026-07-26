import { getMealsForDay } from '../data/mealPlan.js';
import { calculateTargets, DEFAULT_PROFILE } from '../data/profile.js';
import { get } from '../db.js';
import { renderShoppingList } from './shoppingList.js';

const state = { chosen: { breakfast: 0, lunch: 0, dinner: 0 }, view: 'meals' };

function computeDailyTotals(meals) {
  const items = [
    meals.breakfast[state.chosen.breakfast],
    meals.lunch[state.chosen.lunch],
    meals.dinner[state.chosen.dinner],
    ...meals.snack,
  ];
  return items.reduce(
    (acc, o) => ({ kcal: acc.kcal + o.kcal, protein: acc.protein + o.protein, fat: acc.fat + o.fat, carbs: acc.carbs + o.carbs }),
    { kcal: 0, protein: 0, fat: 0, carbs: 0 }
  );
}

function mealSlot(label, key, options, chosenIndex) {
  return `
    <div class="card">
      <h3>${label}</h3>
      ${options.map((opt, i) => `
        <div class="checkbox-row">
          <input type="radio" name="${key}" data-slot="${key}" data-index="${i}" ${i === chosenIndex ? 'checked' : ''}>
          <div>
            <strong>${opt.name}</strong><br>
            <small>${opt.kcal} kcal · ${opt.protein}g prot · ${opt.fat}g greix · ${opt.carbs}g hidrats</small>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function snackSlot(snacks) {
  return `
    <div class="card">
      <h3>Snacks</h3>
      ${snacks.map((s) => `<p><strong>${s.name}</strong> — ${s.kcal} kcal · ${s.protein}g prot</p>`).join('')}
    </div>
  `;
}

export async function renderDietScreen(container) {
  if (state.view === 'shopping') {
    renderShoppingList(container, () => {
      state.view = 'meals';
      renderDietScreen(container);
    });
    return;
  }
  const profile = (await get('profile', 'main')) ?? DEFAULT_PROFILE;
  const targets = calculateTargets(profile);
  const dayIndex = new Date().getDay();
  const meals = getMealsForDay(dayIndex);
  const totals = computeDailyTotals(meals);

  container.innerHTML = `
    <h2>Dieta d'avui</h2>
    <div class="card">
      <p><strong>Objectiu:</strong> ${targets.targetKcal} kcal · ${targets.proteinG}g proteïna</p>
      <p><strong>Avui (seleccionat):</strong> ${totals.kcal} kcal · ${totals.protein}g proteïna · ${totals.fat}g greix · ${totals.carbs}g hidrats</p>
    </div>
    ${mealSlot('Esmorzar', 'breakfast', meals.breakfast, state.chosen.breakfast)}
    ${mealSlot('Dinar', 'lunch', meals.lunch, state.chosen.lunch)}
    ${mealSlot('Sopar', 'dinner', meals.dinner, state.chosen.dinner)}
    ${snackSlot(meals.snack)}
    <button class="secondary" id="show-shopping-list">Veure llista de la compra</button>
  `;

  container.querySelectorAll('input[type=radio]').forEach((el) => {
    el.addEventListener('change', () => {
      state.chosen[el.dataset.slot] = Number(el.dataset.index);
      renderDietScreen(container);
    });
  });
  container.querySelector('#show-shopping-list').addEventListener('click', () => {
    state.view = 'shopping';
    renderDietScreen(container);
  });
}
