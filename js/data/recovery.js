export const RECOVERY_OPTIONS = [
  { id: 'rowing', name: 'Rem (erg)', duration: '20-30 min', intensity: 'Ritme suau, conversacional' },
  { id: 'bike', name: 'Bici estàtica', duration: '30-40 min', intensity: 'Ritme suau, conversacional' },
  { id: 'treadmill', name: 'Cinta', duration: '30-40 min', intensity: 'Caminar ràpid o trote suau' },
  { id: 'elliptical', name: 'El·líptica', duration: '30-40 min', intensity: 'Ritme suau, conversacional' },
];

export function getRecoveryOptionById(id) {
  return RECOVERY_OPTIONS.find((o) => o.id === id) ?? null;
}
