import { icon } from '../data/icons.js';
import { presetCategory } from './today.js';

const CHOICES = [
  { label: 'Gimnàs', iconName: 'gym', tab: 'today', category: 'gym' },
  { label: 'Casa', iconName: 'casa', tab: 'today', category: 'casa' },
  { label: 'Aire lliure', iconName: 'outdoor', tab: 'today', category: 'outdoor' },
  { label: 'Recuperació', iconName: 'recovery', tab: 'today', category: 'recovery' },
  { label: 'Dieta', iconName: 'diet', tab: 'diet', category: null },
  { label: 'Progrés', iconName: 'progress', tab: 'progress', category: null },
];

export async function renderStartScreen(container) {
  container.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; padding-top:16px;">
      <img src="icons/icon-192.png" alt="UriGym" style="width:112px; height:112px; border-radius:16px; margin-bottom:20px;">
      <h2 style="margin-bottom:18px;">Què vols fer avui?</h2>
      <div class="start-grid">
        ${CHOICES.map((c) => `
          <button class="start-tile" data-start-tab="${c.tab}" ${c.category ? `data-start-category="${c.category}"` : ''}>
            ${icon(c.iconName, 30)}
            <span>${c.label}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
  container.querySelectorAll('[data-start-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.startCategory) presetCategory(btn.dataset.startCategory);
      document.querySelector(`.tab-btn[data-tab="${btn.dataset.startTab}"]`).click();
    });
  });
}
