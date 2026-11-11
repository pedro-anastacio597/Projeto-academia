import type { Exercise } from "./gym-data";

/** Reps planned for a given set index ("12/10/8" -> set 2 = 8). Non-numeric (e.g. "40s") -> 0. */
export function repsForSet(reps: string, setIndex: number) {
  const parts = reps.split("/");
  const n = parseInt(parts[Math.min(setIndex, parts.length - 1)] ?? "", 10);
  return Number.isFinite(n) ? n : 0;
}

/** Total load moved (kg) over the sets marked as done. */
export function volumeKg(exercises: Exercise[], setsDone: Record<string, boolean[]>) {
  let total = 0;
  for (const e of exercises) {
    const done = setsDone[e.id] ?? [];
    for (let i = 0; i < e.sets; i++) {
      if (done[i]) total += (e.weights[i] ?? 0) * repsForSet(e.reps, i);
    }
  }
  return total;
}

export function formatClock(totalSec: number) {
  const s = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Group consecutive exercises sharing a bisetId into one block. */
export function groupExercises(exercises: Exercise[]) {
  const blocks: { bisetId?: string; items: Exercise[] }[] = [];
  for (const e of exercises) {
    const last = blocks[blocks.length - 1];
    if (e.bisetId && last?.bisetId === e.bisetId) last.items.push(e);
    else blocks.push({ bisetId: e.bisetId, items: [e] });
  }
  return blocks;
}
