import { getMealsForDay } from '../data/mealPlan.js';
import { calculateTargets, DEFAULT_PROFILE } from '../data/profile.js';
import { FOOD_GROUPS, MEAL_TEMPLATES } from '../data/foods.js';
import { get } from '../db.js';
import { renderShoppingList } from './shoppingList.js';

const state = {
  chosen: { breakfast: 0, lunch: 0, dinner: 0 },
  view: 'foods', // 'foods' | 'examples' | 'shopping'
  expandedGroup: null,
};

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

function templatesSection() {
  return `
    <div class="card">
      <h3>Com combinar cada àpat</h3>
      ${MEAL_TEMPLATES.map((t) => `
        <p style="margin-bottom:14px;">
          <strong>${t.meal}:</strong> ${t.template}<br>
          <span style="color:var(--color-text-muted); font-size:13px;">Exemple: ${t.example}</span>
        </p>
      `).join('')}
    </div>
  `;
}

function foodGroupCard(group) {
  const expanded = state.expandedGroup === group.id;
  return `
    <div class="card">
      <div data-expand-group="${group.id}" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
        <h3 style="margin:0;">${group.label}</h3>
        <span class="badge">${group.foods.length}</span>
      </div>
      ${expanded ? `
        <p style="color:var(--color-text-muted); font-size:13px; margin-top:10px;">${group.portionGuide}</p>
        <table style="width:100%; border-collapse:collapse; margin-top:8px; font-size:13px;">
          <thead>
            <tr style="text-align:left; color:var(--color-text-muted);">
              <th style="padding:4px 0;">Aliment (100g)</th><th>Kcal</th><th>Prot</th><th>Greix</th><th>Hidrats</th>
            </tr>
          </thead>
          <tbody>
            ${group.foods.map((f) => `
              <tr style="border-top:1px solid var(--color-border);">
                <td style="padding:6px 0;">${f.name}</td>
                <td>${f.kcal}</td><td>${f.protein}g</td><td>${f.fat}g</td><td>${f.carbs}g</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : ''}
    </div>
  `;
}

function foodsView() {
  return `
    ${templatesSection()}
    <h3 style="margin: 16px 0 4px;">Base de dades d'aliments (toca una categoria)</h3>
    ${FOOD_GROUPS.map(foodGroupCard).join('')}
  `;
}

function examplesView() {
  const dayIndex = new Date().getDay();
  const meals = getMealsForDay(dayIndex);
  const totals = computeDailyTotals(meals);
  return `
    <div class="card">
      <p><strong>Avui (seleccionat):</strong> ${totals.kcal} kcal · ${totals.protein}g proteïna · ${totals.fat}g greix · ${totals.carbs}g hidrats</p>
    </div>
    ${mealSlot('Esmorzar', 'breakfast', meals.breakfast, state.chosen.breakfast)}
    ${mealSlot('Dinar', 'lunch', meals.lunch, state.chosen.lunch)}
    ${mealSlot('Sopar', 'dinner', meals.dinner, state.chosen.dinner)}
    ${snackSlot(meals.snack)}
    <button class="secondary" id="show-shopping-list">Veure llista de la compra</button>
  `;
}

export async function renderDietScreen(container) {
  if (state.view === 'shopping') {
    renderShoppingList(container, () => {
      state.view = 'examples';
      renderDietScreen(container);
    });
    return;
  }

  const profile = (await get('profile', 'main')) ?? DEFAULT_PROFILE;
  const targets = calculateTargets(profile);

  const body = state.view === 'foods' ? foodsView() : examplesView();

  container.innerHTML = `
    <h2>Dieta</h2>
    <div class="card">
      <p><strong>Objectiu diari:</strong> ${targets.targetKcal} kcal · ${targets.proteinG}g proteïna · ${targets.fatG}g greix · ${targets.carbsG}g hidrats</p>
    </div>
    <div class="segmented">
      <button data-view="foods" class="${state.view === 'foods' ? 'selected' : ''}">Aliments i quantitats</button>
      <button data-view="examples" class="${state.view === 'examples' ? 'selected' : ''}">Exemples d'àpats</button>
    </div>
    ${body}
  `;

  container.querySelectorAll('[data-view]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.view = btn.dataset.view;
      renderDietScreen(container);
    });
  });
  container.querySelectorAll('[data-expand-group]').forEach((el) => {
    el.addEventListener('click', () => {
      state.expandedGroup = state.expandedGroup === el.dataset.expandGroup ? null : el.dataset.expandGroup;
      renderDietScreen(container);
    });
  });
  container.querySelectorAll('input[type=radio]').forEach((el) => {
    el.addEventListener('change', () => {
      state.chosen[el.dataset.slot] = Number(el.dataset.index);
      renderDietScreen(container);
    });
  });
  const shoppingBtn = container.querySelector('#show-shopping-list');
  if (shoppingBtn) {
    shoppingBtn.addEventListener('click', () => {
      state.view = 'shopping';
      renderDietScreen(container);
    });
  }
}
