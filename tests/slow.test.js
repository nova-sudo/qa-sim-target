/**
 * Deliberately slow test. Sleeps ~2 seconds so suite duration trends
 * (and the "slowest tests" widget) have a clear "expensive" outlier.
 *
 * Skipped when FAST_SUITE=1 — useful in dev to run the rest quickly.
 */

const FAST = process.env.FAST_SUITE === "1";
const SLEEP_MS = Number(process.env.SLOW_TEST_MS ?? "2000");

(FAST ? describe.skip : describe)("slow · end-to-end smoke", () => {
  test("waits for the imaginary downstream service", async () => {
    await new Promise((resolve) => setTimeout(resolve, SLEEP_MS));
    expect(true).toBe(true);
  });
});
