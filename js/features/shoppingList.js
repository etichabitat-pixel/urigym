import { generateShoppingList } from '../data/mealPlan.js';

export function renderShoppingList(container, onBack) {
  const list = generateShoppingList();
  container.innerHTML = `
    <h2>Llista de la compra (setmana)</h2>
    <button class="secondary" id="back-to-meals">← Tornar als àpats</button>
    <div class="card">
      <ul>${list.map((row) => `<li>${row.ingredient} <span class="badge">${row.count}x</span></li>`).join('')}</ul>
    </div>
  `;
  container.querySelector('#back-to-meals').addEventListener('click', onBack);
}
