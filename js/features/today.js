import { get, getAll, put } from '../db.js';
import { getSessionTypeForDate, getGymLetterForDate, getProgramStatus } from '../data/program.js';
import { WORKOUTS, getSetsForPhase, GYM_WARMUP, COOLDOWN_STRETCH } from '../data/workouts.js';
import { getExerciseById } from '../data/exercises.js';
import { OUTDOOR_OPTIONS, getOutdoorOptionById } from '../data/outdoor.js';
import { RECOVERY_OPTIONS, getRecoveryOptionById } from '../data/recovery.js';
import { renderExerciseVisual } from './exerciseVisual.js';

const state = {
  variant: 'gym',
  outdoorOptionId: null,
  recoveryOptionId: null,
  expandedId: null,
  checked: new Set(),
};

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function getOrCreateProgramStart() {
  const existing = await get('program', 'main');
  if (existing) return new Date(existing.startDate + 'T00:00:00');
  const iso = todayIso();
  await put('program', { id: 'main', startDate: iso });
  return new Date(iso + 'T00:00:00');
}

async function isTodayLogged() {
  const rows = await getAll('sessionLog');
  return rows.some((r) => r.date === todayIso() && r.completed);
}

async function markTodayDone(extra) {
  await put('sessionLog', { date: todayIso(), completed: true, ...extra });
  state.checked = new Set();
}

function daysSinceLastSession(rows, today = new Date()) {
  const completedDates = rows.filter((r) => r.completed).map((r) => r.date);
  if (completedDates.length === 0) return null;
  const lastIso = completedDates.sort().at(-1);
  const [y, m, d] = lastIso.split('-').map(Number);
  const last = new Date(y, m - 1, d);
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.floor((todayMidnight - last) / 86400000);
}

function motivationalBanner(daysSince) {
  if (daysSince === null || daysSince < 2) return '';
  return `
    <div class="card" style="border-left: 4px solid var(--color-primary);">
      <p>💪 Fa ${daysSince} dies que no marques cap sessió com a feta. Avui és un bon dia per tornar-hi!</p>
    </div>
  `;
}

async function exerciseRow(item, phase) {
  const ex = getExerciseById(item.exerciseId);
  const sets = getSetsForPhase(item.baseSets, phase);
  const display = state.variant === 'casaCurt' ? ex.homeShort : state.variant === 'casaComplet' ? ex.homeFull : null;
  const label = display ? `${ex.name} → ${display.name}` : ex.name;
  const checked = state.checked.has(ex.id);
  const expanded = state.expandedId === ex.id;
  return `
    <div class="checkbox-row${checked ? ' done' : ''}">
      <input type="checkbox" data-exercise-id="${ex.id}" ${checked ? 'checked' : ''}>
      <div style="flex:1">
        <div data-expand-id="${ex.id}" style="cursor:pointer">
          <strong>${label}</strong> — ${sets}×${item.reps}
        </div>
        ${expanded ? await renderExerciseDetail(ex, display) : ''}
      </div>
    </div>
  `;
}

async function renderExerciseDetail(ex, homeInfo) {
  const savedWeight = await get('exerciseWeights', ex.id);
  return `
    <div class="card" style="margin-top:8px">
      ${renderExerciseVisual(ex)}
      <div class="weight-field">
        <label for="weight-${ex.id}">Pes que faig servir:</label>
        <input type="number" step="0.5" id="weight-${ex.id}" data-weight-id="${ex.id}" value="${savedWeight ? savedWeight.weight : ''}" placeholder="kg">
      </div>
      <p><strong>Com fer-ho:</strong></p>
      <ul>${ex.cues.map((c) => `<li>${c}</li>`).join('')}</ul>
      <p><strong>Errors comuns:</strong></p>
      <ul>${ex.commonMistakes.map((c) => `<li>${c}</li>`).join('')}</ul>
      ${homeInfo ? `<p><strong>${homeInfo.name}:</strong> ${homeInfo.notes}</p>` : ''}
      ${ex.videoUrl ? `<a class="video-link-secondary" href="${ex.videoUrl}" target="_blank" rel="noopener">▶ Vídeo tutorial complet (opcional)</a>` : ''}
    </div>
  `;
}

function warmupSection() {
  return `
    <div class="card">
      <h3>Escalfament (RAMP)</h3>
      ${GYM_WARMUP.map((w) => `<p><strong>${w.phase}</strong> (${w.duration}): ${w.description}</p>`).join('')}
    </div>
  `;
}

function cooldownSection() {
  return `
    <div class="card">
      <h3>Cooldown</h3>
      <ul>${COOLDOWN_STRETCH.map((s) => `<li>${s}</li>`).join('')}</ul>
    </div>
  `;
}

async function gymDayHtml(letter, status, alreadyDone) {
  const template = WORKOUTS[letter][state.variant];
  const rows = await Promise.all(template.map((item) => exerciseRow(item, status.phase)));
  return `
    <h2>Avui: Sessió ${letter} — ${status.phase} (setmana ${status.week})</h2>
    <div class="segmented">
      <button data-variant="gym" class="${state.variant === 'gym' ? 'selected' : ''}">Gimnàs</button>
      <button data-variant="casaCurt" class="${state.variant === 'casaCurt' ? 'selected' : ''}">Casa curt</button>
      <button data-variant="casaComplet" class="${state.variant === 'casaComplet' ? 'selected' : ''}">Casa complet</button>
    </div>
    ${warmupSection()}
    <div class="card">
      <h3>Exercicis</h3>
      ${rows.join('')}
    </div>
    ${cooldownSection()}
    <button class="primary" id="mark-done" ${alreadyDone ? 'disabled' : ''}>${alreadyDone ? 'Sessió feta ✓' : 'Marcar sessió com a feta'}</button>
  `;
}

function outdoorDayHtml(alreadyDone) {
  const opt = state.outdoorOptionId ? getOutdoorOptionById(state.outdoorOptionId) : null;
  return `
    <h2>Avui: dia a l'aire lliure</h2>
    <div class="segmented">
      ${OUTDOOR_OPTIONS.map((o) => `<button data-outdoor="${o.id}" class="${state.outdoorOptionId === o.id ? 'selected' : ''}">${o.name}</button>`).join('')}
    </div>
    ${opt ? `
      <div class="card">
        <p><strong>Durada:</strong> ${opt.duration} — ${opt.intensity}</p>
        <p><strong>Escalfament:</strong> ${opt.warmup}</p>
        ${opt.circuit ? `<ul>${opt.circuit.map((c) => `<li>${c.exercise} — ${c.sets}×${c.reps}</li>`).join('')}</ul>` : ''}
        ${opt.cooldown ? `<p><strong>Cooldown:</strong> ${opt.cooldown}</p>` : ''}
      </div>
      <button class="primary" id="mark-done" ${alreadyDone ? 'disabled' : ''}>${alreadyDone ? 'Sessió feta ✓' : 'Marcar sessió com a feta'}</button>
    ` : '<p>Tria una opció.</p>'}
  `;
}

function restDayHtml() {
  return `<h2>Avui és dia de descans</h2><p>Aprofita per recuperar. Demà toca sessió.</p>`;
}

function recoveryDayHtml(alreadyDone) {
  const opt = state.recoveryOptionId ? getRecoveryOptionById(state.recoveryOptionId) : null;
  return `
    <h2>Avui: cap de setmana lliure — recuperació activa</h2>
    <p>Sense nens aquest cap de setmana. Tria una màquina de cardio suau al gimnàs:</p>
    <div class="segmented">
      ${RECOVERY_OPTIONS.map((o) => `<button data-recovery="${o.id}" class="${state.recoveryOptionId === o.id ? 'selected' : ''}">${o.name}</button>`).join('')}
    </div>
    ${opt ? `
      <div class="card">
        <p><strong>Durada:</strong> ${opt.duration} — ${opt.intensity}</p>
      </div>
      <button class="primary" id="mark-done" ${alreadyDone ? 'disabled' : ''}>${alreadyDone ? 'Sessió feta ✓' : 'Marcar sessió com a feta'}</button>
    ` : '<p>Tria una opció.</p>'}
  `;
}

export async function renderTodayScreen(container) {
  const start = await getOrCreateProgramStart();
  const today = new Date();
  const sessionType = getSessionTypeForDate(today, start);
  const status = getProgramStatus(today, start);
  const alreadyDone = await isTodayLogged();
  const sessionLogRows = await getAll('sessionLog');
  const banner = motivationalBanner(daysSinceLastSession(sessionLogRows, today));

  let body;
  if (sessionType === 'rest') {
    body = restDayHtml();
  } else if (sessionType === 'gym') {
    const letter = getGymLetterForDate(today, start);
    body = await gymDayHtml(letter, status, alreadyDone);
  } else if (sessionType === 'recovery') {
    body = recoveryDayHtml(alreadyDone);
  } else {
    body = outdoorDayHtml(alreadyDone);
  }

  container.innerHTML = banner + body;
  attachTodayListeners(container, sessionType);
}

function attachTodayListeners(container, sessionType) {
  container.querySelectorAll('[data-variant]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.variant = btn.dataset.variant;
      renderTodayScreen(container);
    });
  });
  container.querySelectorAll('[data-outdoor]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.outdoorOptionId = btn.dataset.outdoor;
      renderTodayScreen(container);
    });
  });
  container.querySelectorAll('[data-recovery]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.recoveryOptionId = btn.dataset.recovery;
      renderTodayScreen(container);
    });
  });
  container.querySelectorAll('[data-expand-id]').forEach((el) => {
    el.addEventListener('click', () => {
      state.expandedId = state.expandedId === el.dataset.expandId ? null : el.dataset.expandId;
      renderTodayScreen(container);
    });
  });
  container.querySelectorAll('[data-exercise-id]').forEach((el) => {
    el.addEventListener('change', () => {
      if (el.checked) state.checked.add(el.dataset.exerciseId);
      else state.checked.delete(el.dataset.exerciseId);
    });
  });
  container.querySelectorAll('[data-weight-id]').forEach((el) => {
    el.addEventListener('change', async () => {
      const weight = parseFloat(el.value);
      if (!weight || weight <= 0) return;
      await put('exerciseWeights', { exerciseId: el.dataset.weightId, weight, updatedAt: new Date().toISOString() });
    });
  });
  const markBtn = container.querySelector('#mark-done');
  if (markBtn) {
    markBtn.addEventListener('click', async () => {
      if (sessionType === 'gym') {
        await markTodayDone({ type: 'gym', variant: state.variant });
      } else if (sessionType === 'recovery') {
        await markTodayDone({ type: 'recovery', variant: state.recoveryOptionId });
      } else {
        await markTodayDone({ type: 'outdoor', variant: state.outdoorOptionId });
      }
      renderTodayScreen(container);
    });
  }
}
