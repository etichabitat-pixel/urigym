import { getAll, put, get } from '../db.js';
import { getProgramStatus, getExpectedSessionsForWeek } from '../data/program.js';
import { icon } from '../data/icons.js';

function isoDate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function startOfWeekDate(date) {
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

async function getWeekCompletion(startDate) {
  const rows = await getAll('sessionLog');
  const today = new Date();
  const weekStart = isoDate(startOfWeekDate(today));
  const expected = getExpectedSessionsForWeek(today, startDate);
  const doneThisWeek = rows.filter((r) => r.date >= weekStart && r.completed).length;
  const streak = getWeekStreak(rows, startDate, today);
  return { doneThisWeek, expected, streak };
}

function getWeekStreak(rows, startDate, today = new Date()) {
  const completedDates = new Set(rows.filter((r) => r.completed).map((r) => r.date));
  let streak = 0;
  const weekStart = startOfWeekDate(today);
  weekStart.setDate(weekStart.getDate() - 7); // start from the most recent FULLY elapsed week, not the in-progress one
  for (let i = 0; i < 52; i++) {
    let count = 0;
    for (let d = 0; d < 7; d++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + d);
      if (completedDates.has(isoDate(day))) count += 1;
    }
    const expectedThisWeek = getExpectedSessionsForWeek(weekStart, startDate);
    if (count < expectedThisWeek) break;
    streak += 1;
    weekStart.setDate(weekStart.getDate() - 7);
  }
  return streak;
}

function weightSparkline(entries) {
  if (entries.length < 2) return '<p>Afegeix almenys 2 pesades per veure la gràfica.</p>';
  const weights = entries.map((e) => e.weight);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = max - min || 1;
  const points = entries.map((e, i) => {
    const x = (i / (entries.length - 1)) * 280 + 10;
    const y = 90 - ((e.weight - min) / range) * 80;
    return `${x},${y}`;
  }).join(' ');
  return `<svg viewBox="0 0 300 100" width="100%"><polyline points="${points}" fill="none" stroke="#8a9a5b" stroke-width="3"/></svg>`;
}

function progressBar(current, total) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return `<div class="progress-bar"><div class="progress-bar-fill" style="width:${pct}%"></div></div>`;
}

export async function renderProgressScreen(container) {
  const programRow = await get('program', 'main');
  const start = programRow ? new Date(programRow.startDate + 'T00:00:00') : new Date();
  const status = getProgramStatus(new Date(), start);
  const { doneThisWeek, expected, streak } = await getWeekCompletion(start);
  const weightRows = (await getAll('weightLog')).sort((a, b) => a.date.localeCompare(b.date));

  const goalMet = doneThisWeek >= expected;
  container.innerHTML = `
    <h2>Progrés</h2>
    <div class="stat-row">
      <div class="card">
        <div class="stat-number" style="display:flex; align-items:center; justify-content:center; gap:6px;">${goalMet ? icon('target', 22) : ''}${doneThisWeek}/${expected}</div>
        <div class="stat-label">Sessions aquesta setmana</div>
      </div>
      <div class="card">
        <div class="stat-number" style="display:flex; align-items:center; justify-content:center; gap:6px;">${streak > 0 ? icon('flame', 22) : ''}${streak}</div>
        <div class="stat-label">${streak === 1 ? 'Setmana completa seguida' : 'Setmanes completes seguides'}</div>
      </div>
    </div>
    <div class="card">
      <h3>Aquesta setmana</h3>
      ${progressBar(doneThisWeek, expected)}
      <h3 style="margin-top:16px;">Fase ${status.phase} — setmana ${status.week} de 12</h3>
      ${progressBar(status.week, 12)}
    </div>
    <div class="card">
      <h3>Pes corporal</h3>
      ${weightSparkline(weightRows)}
      <div style="display:flex; gap:8px; margin-top:12px;">
        <input type="number" step="0.1" id="weight-input" placeholder="kg" style="flex:1;">
        <button class="secondary" id="add-weight" style="display:flex; align-items:center; gap:6px;">${icon('plus', 16)}Afegir</button>
      </div>
    </div>
  `;

  container.querySelector('#add-weight').addEventListener('click', async () => {
    const input = container.querySelector('#weight-input');
    const weight = parseFloat(input.value);
    if (!weight || weight <= 0) return;
    await put('weightLog', { date: isoDate(), weight });
    renderProgressScreen(container);
  });
}
