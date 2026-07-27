import { get, getAll, put } from '../db.js';
import { getSessionTypeForDate, getGymLetterForDate, getProgramStatus } from '../data/program.js';
import { WORKOUTS, getSetsForPhase, GYM_WARMUP, COOLDOWN_STRETCH } from '../data/workouts.js';
import { getExerciseById } from '../data/exercises.js';
import { OUTDOOR_OPTIONS } from '../data/outdoor.js';
import { RECOVERY_OPTIONS } from '../data/recovery.js';
import { renderExerciseVisual } from './exerciseVisual.js';
import { icon, iconForMuscleGroup } from '../data/icons.js';
import { EXERCISES } from '../data/exercises.js';
import { FOOD_GROUPS } from '../data/foods.js';
import { presetExerciseSearch } from './exerciseLibrary.js';
import { presetFoodGroup } from './diet.js';
import { calculateTargets, DEFAULT_PROFILE } from '../data/profile.js';

// `category` is chosen manually and independent from what the fixed weekly
// schedule says today "should" be — that schedule only picks the initial
// default. This lets Oriol browse or log Gimnàs/Casa/Aire lliure/Recuperació
// on any day, and log what he actually did.
const state = {
  category: null, // 'gym' | 'casa' | 'outdoor' | 'recovery'
  casaVariant: 'casaCurt',
  outdoorOptionId: null,
  recoveryOptionId: null,
  expandedId: null,
  checked: new Set(),
};
let dashboardSearchTerm = '';

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

function defaultCategoryFor(sessionType) {
  if (sessionType === 'gym') return 'gym';
  if (sessionType === 'outdoor') return 'outdoor';
  if (sessionType === 'recovery') return 'recovery';
  return 'gym'; // rest day: still let him browse, starting on Gimnàs
}

function getMarkDonePayload(currentState) {
  if (currentState.category === 'gym') return { type: 'gym', variant: 'gym' };
  if (currentState.category === 'casa') return { type: 'gym', variant: currentState.casaVariant };
  if (currentState.category === 'outdoor') return { type: 'outdoor', variant: currentState.outdoorOptionId };
  return { type: 'recovery', variant: currentState.recoveryOptionId };
}

function isMarkDoneDisabled(currentState, alreadyDone) {
  if (alreadyDone) return true;
  if (currentState.category === 'outdoor') return !currentState.outdoorOptionId;
  if (currentState.category === 'recovery') return !currentState.recoveryOptionId;
  return false;
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
    <div class="card" style="border-left: 4px solid var(--color-primary); display:flex; align-items:center; gap:10px;">
      ${icon('bell', 22)}
      <p style="margin:0;">Fa ${daysSince} dies que no marques cap sessió com a feta. Avui és un bon dia per tornar-hi!</p>
    </div>
  `;
}

function categorySelector() {
  const options = [
    { id: 'gym', label: 'Gimnàs', iconName: 'gym' },
    { id: 'casa', label: 'Casa', iconName: 'casa' },
    { id: 'outdoor', label: 'Aire lliure', iconName: 'outdoor' },
    { id: 'recovery', label: 'Recuperació', iconName: 'recovery' },
  ];
  return `
    <div class="segmented" style="flex-wrap: wrap; gap: 6px;">
      ${options.map((o) => `<button data-category="${o.id}" class="${state.category === o.id ? 'selected' : ''}" style="flex: 1 1 45%; display:flex; align-items:center; justify-content:center; gap:6px;">${icon(o.iconName)}${o.label}</button>`).join('')}
    </div>
  `;
}

async function exerciseRow(item, phase, variant) {
  const ex = getExerciseById(item.exerciseId);
  const sets = getSetsForPhase(item.baseSets, phase);
  const display = variant === 'casaCurt' ? ex.homeShort : variant === 'casaComplet' ? ex.homeFull : null;
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
      <h3>Escalfament</h3>
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

async function strengthSessionHtml(letter, status, alreadyDone, variant, extraToggle) {
  const template = WORKOUTS[letter][variant];
  const rows = await Promise.all(template.map((item) => exerciseRow(item, status.phase, variant)));
  return `
    <h2>Sessió ${letter} — ${status.phase} (setmana ${status.week})</h2>
    ${extraToggle}
    ${warmupSection()}
    <div class="card">
      <h3>Exercicis</h3>
      ${rows.join('')}
    </div>
    ${cooldownSection()}
    <button class="primary" id="mark-done" ${alreadyDone ? 'disabled' : ''}>${icon('check')}${alreadyDone ? 'Sessió feta' : 'Marcar sessió com a feta'}</button>
  `;
}

function casaVariantToggle() {
  return `
    <div class="segmented">
      <button data-casa-variant="casaCurt" class="${state.casaVariant === 'casaCurt' ? 'selected' : ''}">Curt (dia de nens)</button>
      <button data-casa-variant="casaComplet" class="${state.casaVariant === 'casaComplet' ? 'selected' : ''}">Complet (vacances)</button>
    </div>
  `;
}

function optionCard(o, selected, nameAttr, dataAttr) {
  return `
    <div class="card">
      <div class="checkbox-row" style="border-bottom:none; padding-bottom:0;">
        <input type="radio" name="${nameAttr}" data-${dataAttr}="${o.id}" ${selected ? 'checked' : ''}>
        <div style="flex:1">
          <strong>${o.name}</strong><br>
          <span style="color:var(--color-text-muted); font-size:13px;">${o.duration} — ${o.intensity}</span>
        </div>
      </div>
      ${selected && (o.warmup || o.circuit || o.cooldown) ? `
        ${o.warmup ? `<p style="margin-top:10px;"><strong>Escalfament:</strong> ${o.warmup}</p>` : ''}
        ${o.circuit ? `<ul>${o.circuit.map((c) => `<li>${c.exercise} — ${c.sets}×${c.reps}</li>`).join('')}</ul>` : ''}
        ${o.cooldown ? `<p><strong>Cooldown:</strong> ${o.cooldown}</p>` : ''}
      ` : ''}
    </div>
  `;
}

function outdoorHtml(alreadyDone) {
  return `
    <h2>Aire lliure</h2>
    ${OUTDOOR_OPTIONS.map((o) => optionCard(o, state.outdoorOptionId === o.id, 'outdoor', 'outdoor')).join('')}
    <button class="primary" id="mark-done" ${isMarkDoneDisabled(state, alreadyDone) ? 'disabled' : ''}>${icon('check')}${alreadyDone ? 'Sessió feta' : 'Marcar sessió com a feta'}</button>
  `;
}

function recoveryHtml(alreadyDone) {
  return `
    <h2>Recuperació activa</h2>
    <p>Màquina de cardio suau al gimnàs — ideal per caps de setmana lliures o dies extra.</p>
    ${RECOVERY_OPTIONS.map((o) => optionCard(o, state.recoveryOptionId === o.id, 'recovery', 'recovery')).join('')}
    <button class="primary" id="mark-done" ${isMarkDoneDisabled(state, alreadyDone) ? 'disabled' : ''}>${icon('check')}${alreadyDone ? 'Sessió feta' : 'Marcar sessió com a feta'}</button>
  `;
}

function searchDashboard(term) {
  if (!term) return [];
  const t = term.toLowerCase();
  const exerciseMatches = EXERCISES
    .filter((ex) => `${ex.name} ${ex.muscleGroup}`.toLowerCase().includes(t))
    .map((ex) => ({ kind: 'exercise', id: ex.id, name: ex.name, label: ex.muscleGroup }));
  const foodMatches = [];
  for (const group of FOOD_GROUPS) {
    for (const food of group.foods) {
      if (food.name.toLowerCase().includes(t)) {
        foodMatches.push({ kind: 'food', groupId: group.id, name: food.name, label: group.label });
      }
    }
  }
  return [...exerciseMatches, ...foodMatches].slice(0, 6);
}

function searchBarHtml(term) {
  return `
    <div class="search-bar">
      ${icon('search')}
      <input type="search" id="dashboard-search" placeholder="Cerca un exercici o un aliment..." value="${term}">
    </div>
  `;
}

function searchResultsHtml(term) {
  if (!term) return '';
  const results = searchDashboard(term);
  if (results.length === 0) {
    return `<div class="card"><p style="margin:0; color:var(--color-text-muted);">Cap resultat.</p></div>`;
  }
  return `
    <div class="card">
      ${results.map((r) => `
        <div class="search-result-row" data-search-kind="${r.kind}" data-search-id="${r.kind === 'exercise' ? r.id : r.groupId}" data-search-name="${r.name}">
          ${r.kind === 'exercise' ? iconForMuscleGroup(r.label, 20) : icon(r.groupId, 20)}
          <div style="flex:1;"><strong>${r.name}</strong><br><span class="badge">${r.label}</span></div>
        </div>
      `).join('')}
    </div>
  `;
}

function categoryIconFor(category) {
  return category === 'casa' ? 'gym' : category;
}

async function todaySummaryCardHtml(currentState, letter, alreadyDone) {
  const profile = (await get('profile', 'main')) ?? DEFAULT_PROFILE;
  const targets = calculateTargets(profile);
  const categoryLabels = {
    gym: `Gimnàs — Sessió ${letter}`,
    casa: `Casa — Sessió ${letter}`,
    outdoor: 'Aire lliure',
    recovery: 'Recuperació',
  };
  const disabled = isMarkDoneDisabled(currentState, alreadyDone);
  return `
    <div class="card">
      <h3>Avui</h3>
      <p style="font-size:16px; font-weight:600; display:flex; align-items:center; gap:8px; margin:6px 0;">
        ${icon(categoryIconFor(currentState.category), 20)}${categoryLabels[currentState.category]}
      </p>
      <p style="color:var(--color-text-muted); font-size:13px; display:flex; align-items:center; gap:6px;">
        ${icon('flame', 16)}${targets.targetKcal} kcal · ${targets.proteinG}g proteïna
      </p>
      <button class="primary" id="dashboard-mark-done" ${disabled ? 'disabled' : ''} style="display:flex; align-items:center; justify-content:center; gap:6px; margin-top:10px;">
        ${icon('check')}${alreadyDone ? 'Sessió feta' : 'Marcar sessió com a feta'}
      </button>
    </div>
  `;
}

function quickNavTilesHtml() {
  const items = [
    { tab: 'diet', label: 'Dieta', iconName: 'diet' },
    { tab: 'exercises', label: 'Exercicis', iconName: 'exercises' },
    { tab: 'progress', label: 'Progrés', iconName: 'progress' },
  ];
  return `
    <div class="quick-nav-grid">
      ${items.map((i) => `
        <button class="quick-nav-tile" data-goto-tab="${i.tab}">
          ${icon(i.iconName, 22)}
          <span>${i.label}</span>
        </button>
      `).join('')}
    </div>
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

  if (state.category === null) {
    state.category = defaultCategoryFor(sessionType);
  }

  // On days the fixed schedule wouldn't naturally assign a gym letter (e.g.
  // browsing "Gimnàs" manually on a Tuesday), default to A.
  const letter = getGymLetterForDate(today, start) ?? 'A';

  let body;
  if (state.category === 'gym') {
    body = await strengthSessionHtml(letter, status, alreadyDone, 'gym', '');
  } else if (state.category === 'casa') {
    body = await strengthSessionHtml(letter, status, alreadyDone, state.casaVariant, casaVariantToggle());
  } else if (state.category === 'outdoor') {
    body = outdoorHtml(alreadyDone);
  } else {
    body = recoveryHtml(alreadyDone);
  }

  const summaryCard = await todaySummaryCardHtml(state, letter, alreadyDone);
  container.innerHTML = `${searchBarHtml(dashboardSearchTerm)}${searchResultsHtml(dashboardSearchTerm)}${summaryCard}${quickNavTilesHtml()}${banner}${categorySelector()}${body}`;
  attachTodayListeners(container);
}

function attachTodayListeners(container) {
  container.querySelectorAll('[data-category]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.category = btn.dataset.category;
      renderTodayScreen(container);
    });
  });
  const searchInput = container.querySelector('#dashboard-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      dashboardSearchTerm = e.target.value;
      const cursorPos = e.target.selectionStart;
      renderTodayScreen(container).then(() => {
        const newInput = container.querySelector('#dashboard-search');
        newInput.focus();
        newInput.setSelectionRange(cursorPos, cursorPos);
      });
    });
  }
  container.querySelectorAll('[data-search-kind]').forEach((el) => {
    el.addEventListener('click', () => {
      if (el.dataset.searchKind === 'exercise') {
        presetExerciseSearch(el.dataset.searchId, el.dataset.searchName);
        document.querySelector('.tab-btn[data-tab="exercises"]').click();
      } else {
        presetFoodGroup(el.dataset.searchId);
        document.querySelector('.tab-btn[data-tab="diet"]').click();
      }
    });
  });
  container.querySelectorAll('[data-goto-tab]').forEach((el) => {
    el.addEventListener('click', () => {
      document.querySelector(`.tab-btn[data-tab="${el.dataset.gotoTab}"]`).click();
    });
  });
  const dashboardMarkBtn = container.querySelector('#dashboard-mark-done');
  if (dashboardMarkBtn) {
    dashboardMarkBtn.addEventListener('click', async () => {
      await markTodayDone(getMarkDonePayload(state));
      renderTodayScreen(container);
    });
  }
  container.querySelectorAll('[data-casa-variant]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.casaVariant = btn.dataset.casaVariant;
      renderTodayScreen(container);
    });
  });
  container.querySelectorAll('[data-outdoor]').forEach((el) => {
    el.addEventListener('change', () => {
      state.outdoorOptionId = el.dataset.outdoor;
      renderTodayScreen(container);
    });
  });
  container.querySelectorAll('[data-recovery]').forEach((el) => {
    el.addEventListener('change', () => {
      state.recoveryOptionId = el.dataset.recovery;
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
      await markTodayDone(getMarkDonePayload(state));
      renderTodayScreen(container);
    });
  }
}
