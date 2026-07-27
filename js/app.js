import { renderTodayScreen } from './features/today.js';
import { renderDietScreen } from './features/diet.js';
import { renderExerciseLibraryScreen } from './features/exerciseLibrary.js';
import { renderProgressScreen } from './features/progress.js';
import { showBackupPanel } from './features/backup.js';
import { seedProfileIfMissing } from './data/profile.js';
import { icon } from './data/icons.js';

const RENDERERS = {
  today: renderTodayScreen,
  diet: renderDietScreen,
  exercises: renderExerciseLibraryScreen,
  progress: renderProgressScreen,
};

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.error('SW registration failed', err);
    });
  }
}

async function setActiveTab(tab) {
  document.querySelectorAll('.tab-btn[data-tab]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  const screen = document.getElementById('screen');
  await RENDERERS[tab](screen);
}

async function init() {
  registerServiceWorker();
  document.querySelectorAll('[data-icon]').forEach((el) => {
    el.innerHTML = icon(el.dataset.icon, 20);
  });
  await seedProfileIfMissing();
  document.querySelectorAll('.tab-btn[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
  });
  document.getElementById('settings-btn').addEventListener('click', showBackupPanel);
  await setActiveTab('today');
}

init();
