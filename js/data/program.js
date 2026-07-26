export const PHASES = [
  { name: 'Adaptació', startWeek: 1, endWeek: 4 },
  { name: 'Transformació', startWeek: 5, endWeek: 8 },
  { name: 'Integració', startWeek: 9, endWeek: 12 },
];

// 0=Sun..6=Sat. Change here if the weekly pattern ever needs to move.
export const WEEKDAY_SCHEDULE = {
  0: 'rest',
  1: 'gym',
  2: 'outdoor',
  3: 'gym',
  4: 'outdoor',
  5: 'gym',
  6: 'rest',
};

function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function diffDays(date, startDate) {
  const ms = stripTime(date) - stripTime(startDate);
  return Math.max(0, Math.floor(ms / 86400000));
}

export function getSessionTypeForDate(date) {
  return WEEKDAY_SCHEDULE[date.getDay()];
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
