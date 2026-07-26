import { getAll, put } from '../db.js';

const STORES = ['profile', 'program', 'sessionLog', 'weightLog'];

export async function exportBackup() {
  const data = {};
  for (const store of STORES) {
    data[store] = await getAll(store);
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `urigym-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function importBackup(file) {
  const text = await file.text();
  const data = JSON.parse(text);
  for (const store of STORES) {
    const rows = data[store] ?? [];
    for (const row of rows) {
      await put(store, row);
    }
  }
}

export function showBackupPanel() {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; z-index:100;';
  overlay.innerHTML = `
    <div class="card" style="width:85%; max-width:340px;">
      <h3>Còpia de seguretat</h3>
      <button class="primary" id="export-btn" style="margin-bottom:8px;">Exportar (descarregar JSON)</button>
      <input type="file" id="import-input" accept="application/json" style="margin-bottom:8px;">
      <button class="secondary" id="close-btn">Tancar</button>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#export-btn').addEventListener('click', exportBackup);
  overlay.querySelector('#import-input').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await importBackup(file);
    alert('Còpia importada correctament.');
    overlay.remove();
  });
  overlay.querySelector('#close-btn').addEventListener('click', () => overlay.remove());
}
