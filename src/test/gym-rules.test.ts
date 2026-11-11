import { describe, expect, it } from "vitest";
import { repsForSet, volumeKg, groupExercises } from "@/lib/workout";
import { addMonths, streak, trainedDaysThisWeek, type HistoryEntry } from "@/lib/store";
import { getWorkout } from "@/lib/gym-data";

const h = (iso: string): HistoryEntry => ({ id: iso, workoutId: "a", date: iso, durationSec: 60, done: 1, total: 1, volumeKg: 0 });

describe("workout rules", () => {
  it("reads planned reps per set, repeating the last value", () => {
    expect(repsForSet("12/10/8", 0)).toBe(12);
    expect(repsForSet("12/10/8", 2)).toBe(8);
    expect(repsForSet("12", 3)).toBe(12);
    expect(repsForSet("40s", 0)).toBe(0);
  });

  it("sums volume only for sets marked done", () => {
    const a = getWorkout("a")!;
    // Agachamento: 40kg x 12 reps on set 1 only
    expect(volumeKg(a.exercises, { a1: [true, false, false, false] })).toBe(480);
  });

  it("groups bi-set exercises of Treino C into one block", () => {
    const blocks = groupExercises(getWorkout("c")!.exercises);
    expect(blocks.at(-1)!.items.map((e) => e.id)).toEqual(["c4", "c5"]);
  });
});

describe("week and plan rules", () => {
  it("marks trained weekdays of the current week only", () => {
    const now = new Date(2026, 10, 11, 12); // Wed
    const days = trainedDaysThisWeek([h(new Date(2026, 10, 9, 8).toISOString()), h(new Date(2026, 10, 6, 8).toISOString())], now);
    expect([...days]).toEqual([1]);
  });

  it("counts a streak ending yesterday", () => {
    const now = new Date(2026, 10, 11, 12);
    expect(streak([h(new Date(2026, 10, 10, 8).toISOString()), h(new Date(2026, 10, 9, 8).toISOString())], now)).toBe(2);
  });

  it("renewal adds the plan's months to the due date", () => {
    expect(addMonths("2026-11-11", 3)).toBe("2027-02-11");
  });
});
