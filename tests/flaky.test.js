/**
 * Intentionally flaky test. Random fails ~20% of runs so the QA Hub
 * has real flake-rate data to chart. DO NOT "fix" this — it's load-
 * bearing simulation behaviour.
 *
 * In real life, flake = "passes sometimes, fails sometimes on the same
 * code." That's what we model here with Math.random.
 *
 * Override via env var FLAKY_FAIL_RATE (default 0.2). Set FLAKY_FAIL_RATE=0
 * to make CI deterministic when you're debugging non-flake issues.
 */

const FAIL_RATE = Number(process.env.FLAKY_FAIL_RATE ?? "0.2");

describe("flaky · session timeout simulator", () => {
  test("retries on network blip (sometimes)", () => {
    const roll = Math.random();
    // Pass when the dice are kind.
    expect(roll).toBeGreaterThanOrEqual(FAIL_RATE);
  });
});
