import { EXERCISES } from '../data/exercises.js';
import { getWorkoutUsagesForExercise } from '../data/workouts.js';
import { renderExerciseVisual } from './exerciseVisual.js';
import { get, put } from '../db.js';

let searchTerm = '';
let expandedId = null;

function matchesSearch(ex) {
  if (!searchTerm) return true;
  const haystack = `${ex.name} ${ex.muscleGroup}`.toLowerCase();
  return haystack.includes(searchTerm.toLowerCase());
}

function usageBlock(ex) {
  const usages = getWorkoutUsagesForExercise(ex.id);
  if (usages.length === 0) return '';
  return `
    <p><strong>Sèries i repeticions:</strong></p>
    <ul>${usages.map((u) => `<li>${u.label}: ${u.baseSets}×${u.reps}</li>`).join('')}</ul>
  `;
}

async function weightFieldBlock(ex) {
  const saved = await get('exerciseWeights', ex.id);
  const value = saved ? saved.weight : '';
  return `
    <div class="weight-field">
      <label for="weight-${ex.id}">Pes que faig servir:</label>
      <input type="number" step="0.5" id="weight-${ex.id}" data-weight-id="${ex.id}" value="${value}" placeholder="kg">
    </div>
  `;
}

async function detailBlock(ex) {
  return `
    <div class="card" style="margin-top:8px">
      ${renderExerciseVisual(ex)}
      ${usageBlock(ex)}
      ${await weightFieldBlock(ex)}
      <p><strong>Com fer-ho:</strong></p>
      <ul>${ex.cues.map((c) => `<li>${c}</li>`).join('')}</ul>
      <p><strong>Errors comuns:</strong></p>
      <ul>${ex.commonMistakes.map((c) => `<li>${c}</li>`).join('')}</ul>
      <p><strong>${ex.homeShort.name}</strong> (dia de nens): ${ex.homeShort.notes}</p>
      <p><strong>${ex.homeFull.name}</strong> (vacances): ${ex.homeFull.notes}</p>
      ${ex.videoUrl ? `<a class="video-link-secondary" href="${ex.videoUrl}" target="_blank" rel="noopener">▶ Vídeo tutorial complet (opcional)</a>` : ''}
    </div>
  `;
}

async function exerciseCard(ex) {
  const expanded = expandedId === ex.id;
  return `
    <div class="card">
      <div data-expand-id="${ex.id}" style="cursor:pointer">
        <strong>${ex.name}</strong> <span class="badge">${ex.muscleGroup}</span>
      </div>
      ${expanded ? await detailBlock(ex) : ''}
    </div>
  `;
}

export async function renderExerciseLibraryScreen(container) {
  const filtered = EXERCISES.filter(matchesSearch);
  const cards = await Promise.all(filtered.map(exerciseCard));
  container.innerHTML = `
    <h2>Exercicis</h2>
    <input type="search" id="exercise-search" placeholder="Cerca per nom o grup muscular..." value="${searchTerm}" style="width:100%; margin-bottom:12px;">
    ${filtered.length === 0 ? '<p>Cap exercici coincideix amb la cerca.</p>' : cards.join('')}
  `;
  const searchInput = container.querySelector('#exercise-search');
  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    const cursorPos = e.target.selectionStart;
    renderExerciseLibraryScreen(container).then(() => {
      const newInput = container.querySelector('#exercise-search');
      newInput.focus();
      newInput.setSelectionRange(cursorPos, cursorPos);
    });
  });
  container.querySelectorAll('[data-expand-id]').forEach((el) => {
    el.addEventListener('click', () => {
      expandedId = expandedId === el.dataset.expandId ? null : el.dataset.expandId;
      renderExerciseLibraryScreen(container);
    });
  });
  container.querySelectorAll('[data-weight-id]').forEach((el) => {
    el.addEventListener('change', async () => {
      const weight = parseFloat(el.value);
      if (!weight || weight <= 0) return;
      await put('exerciseWeights', { exerciseId: el.dataset.weightId, weight, updatedAt: new Date().toISOString() });
    });
  });
}
