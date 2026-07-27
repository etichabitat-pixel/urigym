import { renderTodayScreen } from './features/today.js';
import { renderDietScreen } from './features/diet.js';
import { renderExerciseLibraryScreen } from './features/exerciseLibrary.js';
import { renderProgressScreen } from './features/progress.js';
import { renderStartScreen } from './features/start.js';
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
  document.getElementById('tabbar').style.display = 'flex';
  document.querySelectorAll('.tab-btn[data-tab]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  const screen = document.getElementById('screen');
  await RENDERERS[tab](screen);
}

// The header logo always brings you back here — the app opens on this
// picker instead of jumping straight into Gimnàs, so choosing a section is
// always an explicit step.
async function showStartScreen() {
  document.querySelectorAll('.tab-btn[data-tab]').forEach((btn) => btn.classList.remove('active'));
  document.getElementById('tabbar').style.display = 'none';
  const screen = document.getElementById('screen');
  await renderStartScreen(screen);
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
  document.querySelector('.app-header').addEventListener('click', showStartScreen);
  await showStartScreen();
}

init();
