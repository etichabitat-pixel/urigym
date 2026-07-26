const DB_NAME = 'urigym';
const DB_VERSION = 2;

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('profile')) {
        db.createObjectStore('profile', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('program')) {
        db.createObjectStore('program', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('sessionLog')) {
        const store = db.createObjectStore('sessionLog', { keyPath: 'id', autoIncrement: true });
        store.createIndex('date', 'date');
      }
      if (!db.objectStoreNames.contains('weightLog')) {
        const store = db.createObjectStore('weightLog', { keyPath: 'id', autoIncrement: true });
        store.createIndex('date', 'date');
      }
      if (!db.objectStoreNames.contains('exerciseWeights')) {
        db.createObjectStore('exerciseWeights', { keyPath: 'exerciseId' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function put(storeName, value) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).put(value);
    tx.oncomplete = () => resolve(value);
    tx.onerror = () => reject(tx.error);
  });
}

export async function get(storeName, key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getAll(storeName) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllByDateRange(storeName, startIso, endIso) {
  const all = await getAll(storeName);
  return all.filter((row) => row.date >= startIso && row.date <= endIso);
}
