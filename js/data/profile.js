import { get, put } from '../db.js';

export function calculateBMR({ weightKg, heightCm, age }) {
  return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
}

export function calculateTargets({ weightKg, heightCm, age, activityMultiplier = 1.375, deficitKcal = 300 }) {
  const bmr = calculateBMR({ weightKg, heightCm, age });
  const maintenance = bmr * activityMultiplier;
  const targetKcal = Math.round(maintenance - deficitKcal);
  const proteinG = Math.round(weightKg * 1.9);
  const proteinKcal = proteinG * 4;
  const fatG = Math.round((targetKcal * 0.25) / 9);
  const fatKcal = fatG * 9;
  const carbsG = Math.max(Math.round((targetKcal - proteinKcal - fatKcal) / 4), 0);
  return {
    bmr: Math.round(bmr),
    maintenanceKcal: Math.round(maintenance),
    targetKcal,
    proteinG,
    fatG,
    carbsG,
  };
}

export const DEFAULT_PROFILE = {
  id: 'main',
  age: 47,
  heightCm: 171,
  weightKg: 78,
  activityMultiplier: 1.375,
};

export async function seedProfileIfMissing() {
  const existing = await get('profile', 'main');
  if (existing) return existing;
  const seeded = { ...DEFAULT_PROFILE, updatedAt: new Date().toISOString() };
  await put('profile', seeded);
  return seeded;
}
