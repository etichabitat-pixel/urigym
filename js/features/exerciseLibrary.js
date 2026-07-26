import { EXERCISES } from '../data/exercises.js';
import { renderPoseSvg } from '../data/poses.js';

let searchTerm = '';
let expandedId = null;

function matchesSearch(ex) {
  if (!searchTerm) return true;
  const haystack = `${ex.name} ${ex.muscleGroup}`.toLowerCase();
  return haystack.includes(searchTerm.toLowerCase());
}

function detailBlock(ex) {
  return `
    <div class="card" style="margin-top:8px">
      <div style="width:80px">${renderPoseSvg(ex.pose)}</div>
      <p><strong>Com fer-ho:</strong></p>
      <ul>${ex.cues.map((c) => `<li>${c}</li>`).join('')}</ul>
      <p><strong>Errors comuns:</strong></p>
      <ul>${ex.commonMistakes.map((c) => `<li>${c}</li>`).join('')}</ul>
      <p><strong>${ex.homeShort.name}</strong> (dia de nens): ${ex.homeShort.notes}</p>
      <p><strong>${ex.homeFull.name}</strong> (vacances): ${ex.homeFull.notes}</p>
      ${ex.videoUrl ? `<a href="${ex.videoUrl}" target="_blank" rel="noopener">Veure vídeo</a>` : '<p><em>Vídeo pendent de curar — es veu igualment el diagrama i els consells.</em></p>'}
    </div>
  `;
}

function exerciseCard(ex) {
  const expanded = expandedId === ex.id;
  return `
    <div class="card">
      <div data-expand-id="${ex.id}" style="cursor:pointer">
        <strong>${ex.name}</strong> <span class="badge">${ex.muscleGroup}</span>
      </div>
      ${expanded ? detailBlock(ex) : ''}
    </div>
  `;
}

export function renderExerciseLibraryScreen(container) {
  const filtered = EXERCISES.filter(matchesSearch);
  container.innerHTML = `
    <h2>Exercicis</h2>
    <input type="search" id="exercise-search" placeholder="Cerca per nom o grup muscular..." value="${searchTerm}" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ccc; margin-bottom:12px;">
    ${filtered.length === 0 ? '<p>Cap exercici coincideix amb la cerca.</p>' : filtered.map(exerciseCard).join('')}
  `;
  const searchInput = container.querySelector('#exercise-search');
  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    const cursorPos = e.target.selectionStart;
    renderExerciseLibraryScreen(container);
    const newInput = container.querySelector('#exercise-search');
    newInput.focus();
    newInput.setSelectionRange(cursorPos, cursorPos);
  });
  container.querySelectorAll('[data-expand-id]').forEach((el) => {
    el.addEventListener('click', () => {
      expandedId = expandedId === el.dataset.expandId ? null : el.dataset.expandId;
      renderExerciseLibraryScreen(container);
    });
  });
}
