const CACHE_NAME = 'urigym-shell-v2';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/app.js',
  './js/db.js',
  './js/data/icons.js',
  './js/data/profile.js',
  './js/data/program.js',
  './js/data/exercises.js',
  './js/data/workouts.js',
  './js/data/outdoor.js',
  './js/data/recovery.js',
  './js/data/mealPlan.js',
  './js/data/foods.js',
  './js/data/poses.js',
  './js/features/today.js',
  './js/features/start.js',
  './js/features/exerciseVisual.js',
  './js/features/diet.js',
  './js/features/shoppingList.js',
  './js/features/exerciseLibrary.js',
  './js/features/progress.js',
  './js/features/backup.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
