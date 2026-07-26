import { get, getAll, put } from '../db.js';
import { getSessionTypeForDate, getGymLetterForDate, getProgramStatus } from '../data/program.js';
import { WORKOUTS, getSetsForPhase, GYM_WARMUP, COOLDOWN_STRETCH } from '../data/workouts.js';
import { getExerciseById } from '../data/exercises.js';
import { OUTDOOR_OPTIONS, getOutdoorOptionById } from '../data/outdoor.js';
import { renderPoseSvg } from '../data/poses.js';

const state = {
  variant: 'gym',
  outdoorOptionId: null,
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
    <div class="card" style="border-left: 4px solid var(--color-navy);">
      <p>💪 Fa ${daysSince} dies que no marques cap sessió com a feta. Avui és un bon dia per tornar-hi!</p>
    </div>
  `;
}

function exerciseRow(item, phase) {
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
        ${expanded ? renderExerciseDetail(ex, display) : ''}
      </div>
    </div>
  `;
}

function renderExerciseDetail(ex, homeInfo) {
  return `
    <div class="card" style="margin-top:8px">
      <div style="width:80px">${renderPoseSvg(ex.pose)}</div>
      <p><strong>Com fer-ho:</strong></p>
      <ul>${ex.cues.map((c) => `<li>${c}</li>`).join('')}</ul>
      <p><strong>Errors comuns:</strong></p>
      <ul>${ex.commonMistakes.map((c) => `<li>${c}</li>`).join('')}</ul>
      ${homeInfo ? `<p><strong>${homeInfo.name}:</strong> ${homeInfo.notes}</p>` : ''}
      ${ex.videoUrl ? `<a href="${ex.videoUrl}" target="_blank" rel="noopener">Veure vídeo</a>` : '<p><em>Vídeo pendent — es veu igualment el diagrama i els consells.</em></p>'}
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

function gymDayHtml(letter, status, alreadyDone) {
  const template = WORKOUTS[letter][state.variant];
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
      ${template.map((item) => exerciseRow(item, status.phase)).join('')}
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

export async function renderTodayScreen(container) {
  const start = await getOrCreateProgramStart();
  const today = new Date();
  const sessionType = getSessionTypeForDate(today);
  const status = getProgramStatus(today, start);
  const alreadyDone = await isTodayLogged();
  const sessionLogRows = await getAll('sessionLog');
  const banner = motivationalBanner(daysSinceLastSession(sessionLogRows, today));

  let body;
  if (sessionType === 'rest') {
    body = restDayHtml();
  } else if (sessionType === 'gym') {
    const letter = getGymLetterForDate(today, start);
    body = gymDayHtml(letter, status, alreadyDone);
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
  const markBtn = container.querySelector('#mark-done');
  if (markBtn) {
    markBtn.addEventListener('click', async () => {
      if (sessionType === 'gym') {
        await markTodayDone({ type: 'gym', variant: state.variant });
      } else {
        await markTodayDone({ type: 'outdoor', variant: state.outdoorOptionId });
      }
      renderTodayScreen(container);
    });
  }
}
