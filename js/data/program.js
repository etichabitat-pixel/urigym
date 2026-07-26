export const PHASES = [
  { name: 'Adaptació', startWeek: 1, endWeek: 4 },
  { name: 'Transformació', startWeek: 5, endWeek: 8 },
  { name: 'Integració', startWeek: 9, endWeek: 12 },
];

// 0=Sun..6=Sat. Change here if the weekly pattern ever needs to move.
// Sat/Sun resolve to 'recovery' or 'rest' depending on the biweekly kids schedule (see isFreeWeekendWeek).
export const WEEKDAY_SCHEDULE = {
  0: 'weekend',
  1: 'gym',
  2: 'outdoor',
  3: 'gym',
  4: 'outdoor',
  5: 'gym',
  6: 'weekend',
};

function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function diffDays(date, startDate) {
  const ms = stripTime(date) - stripTime(startDate);
  return Math.max(0, Math.floor(ms / 86400000));
}

function mondayOf(date) {
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);
  return monday;
}

// Weekend parity is anchored to the real calendar Monday, not the rolling
// weekIndex used for gym A/B — this guarantees Saturday and the following
// Sunday of the same real weekend always get the same parity.
export function isFreeWeekendWeek(date, startDate) {
  const weeksSince = Math.round((stripTime(mondayOf(date)) - stripTime(mondayOf(startDate))) / (7 * 86400000));
  return weeksSince % 2 === 0;
}

export function getExpectedSessionsForWeek(date, startDate) {
  return isFreeWeekendWeek(date, startDate) ? 6 : 5;
}

export function getSessionTypeForDate(date, startDate) {
  const base = WEEKDAY_SCHEDULE[date.getDay()];
  if (base !== 'weekend') return base;
  return isFreeWeekendWeek(date, startDate) ? 'recovery' : 'rest';
}

export function getGymLetterForDate(date, startDate) {
  const weekIndex = Math.floor(diffDays(date, startDate) / 7);
  const isEvenWeek = weekIndex % 2 === 0;
  const evenWeekPattern = { 1: 'A', 3: 'B', 5: 'A' };
  const oddWeekPattern = { 1: 'B', 3: 'A', 5: 'B' };
  const pattern = isEvenWeek ? evenWeekPattern : oddWeekPattern;
  return pattern[date.getDay()] ?? null;
}

export function getProgramStatus(date, startDate) {
  const weekIndex = Math.floor(diffDays(date, startDate) / 7);
  const cycleWeek = (weekIndex % 12) + 1;
  const phase = PHASES.find((p) => cycleWeek >= p.startWeek && cycleWeek <= p.endWeek);
  return { week: cycleWeek, phase: phase.name };
}
