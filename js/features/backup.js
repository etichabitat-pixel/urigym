import { getAll, put, get } from '../db.js';
import { DEFAULT_PROFILE } from '../data/profile.js';

const STORES = ['profile', 'program', 'sessionLog', 'weightLog', 'exerciseWeights'];

const LOG_OPTIONS = [
  { value: 'gym|gym', label: 'Gimnàs' },
  { value: 'gym|casaCurt', label: 'Casa (curt)' },
  { value: 'gym|casaComplet', label: 'Casa (complet)' },
  { value: 'outdoor|walk', label: 'Aire lliure — Caminar' },
  { value: 'outdoor|run', label: 'Aire lliure — Córrer' },
  { value: 'outdoor|calisthenics', label: 'Aire lliure — Calistènia' },
  { value: 'recovery|rowing', label: 'Recuperació — Rem' },
  { value: 'recovery|bike', label: 'Recuperació — Bici' },
  { value: 'recovery|treadmill', label: 'Recuperació — Cinta' },
  { value: 'recovery|elliptical', label: 'Recuperació — El·líptica' },
];

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

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function showBackupPanel() {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.4); display:flex; align-items:flex-start; justify-content:center; z-index:100; overflow-y:auto; padding: 24px 0;';
  overlay.innerHTML = `<div class="card" style="width:85%; max-width:340px; margin: 24px 0;" id="config-panel"></div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
  renderPanelContent(overlay.querySelector('#config-panel'), overlay);
}

async function renderPanelContent(panel, overlay) {
  const profile = (await get('profile', 'main')) ?? DEFAULT_PROFILE;

  panel.innerHTML = `
    <h3>Dades personals</h3>
    <label style="font-size:12px; color:var(--color-text-muted);">Edat</label>
    <input type="number" id="profile-age" value="${profile.age}" style="width:100%; margin-bottom:8px;">
    <label style="font-size:12px; color:var(--color-text-muted);">Alçada (cm)</label>
    <input type="number" id="profile-height" value="${profile.heightCm}" style="width:100%; margin-bottom:8px;">
    <label style="font-size:12px; color:var(--color-text-muted);">Pes (kg)</label>
    <input type="number" step="0.1" id="profile-weight" value="${profile.weightKg}" style="width:100%; margin-bottom:8px;">
    <button class="secondary" id="save-profile-btn" style="margin-bottom:8px;">Desar dades personals</button>
    <p id="profile-status" style="font-size:13px; color:var(--color-accent);"></p>

    <hr>
    <h3>Registrar un dia real</h3>
    <p style="font-size:13px; color:var(--color-text-muted);">Apunta el que vas fer de veritat un dia concret (avui o un dia passat que vas oblidar marcar).</p>
    <label style="font-size:12px; color:var(--color-text-muted);">Data</label>
    <input type="date" id="log-date" value="${todayIso()}" style="width:100%; margin-bottom:8px;">
    <label style="font-size:12px; color:var(--color-text-muted);">Què vas fer</label>
    <select id="log-type" style="width:100%; margin-bottom:8px; background:var(--color-surface-2); color:var(--color-text); border:1px solid var(--color-border); border-radius:8px; padding:10px;">
      ${LOG_OPTIONS.map((o) => `<option value="${o.value}">${o.label}</option>`).join('')}
    </select>
    <button class="secondary" id="save-log-btn" style="margin-bottom:8px;">Marcar com a fet aquell dia</button>
    <p id="log-status" style="font-size:13px; color:var(--color-accent);"></p>

    <hr>
    <h3>Còpia de seguretat</h3>
    <button class="primary" id="export-btn" style="margin-bottom:8px;">Exportar (descarregar JSON)</button>
    <input type="file" id="import-input" accept="application/json" style="margin-bottom:8px;">

    <button class="secondary" id="close-btn">Tancar</button>
  `;

  panel.querySelector('#save-profile-btn').addEventListener('click', async () => {
    const age = parseInt(panel.querySelector('#profile-age').value, 10);
    const heightCm = parseFloat(panel.querySelector('#profile-height').value);
    const weightKg = parseFloat(panel.querySelector('#profile-weight').value);
    if (!age || !heightCm || !weightKg) return;
    await put('profile', { ...profile, age, heightCm, weightKg, updatedAt: new Date().toISOString() });
    panel.querySelector('#profile-status').textContent = 'Desat. Els objectius de dieta es recalcularan tot sol.';
  });

  panel.querySelector('#save-log-btn').addEventListener('click', async () => {
    const date = panel.querySelector('#log-date').value;
    const [type, variant] = panel.querySelector('#log-type').value.split('|');
    if (!date) return;
    // Reuse the existing row's id for that date if there is one, so this
    // corrects/replaces it instead of piling up duplicate log entries.
    const existing = (await getAll('sessionLog')).find((r) => r.date === date);
    await put('sessionLog', { ...(existing ? { id: existing.id } : {}), date, type, variant, completed: true });
    panel.querySelector('#log-status').textContent = `Registrat: ${date}.`;
  });

  panel.querySelector('#export-btn').addEventListener('click', exportBackup);
  panel.querySelector('#import-input').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await importBackup(file);
    alert('Còpia importada correctament.');
    overlay.remove();
  });
  panel.querySelector('#close-btn').addEventListener('click', () => overlay.remove());
}
