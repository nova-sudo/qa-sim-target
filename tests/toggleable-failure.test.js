/**
 * Toggleable failure. Lets you simulate a "build is broken / fix
 * incoming" event by flipping an env var on the Jenkins job —
 * no code change required.
 *
 * Toggle:
 *   SIMULATE_BROKEN=1 → this test fails → build goes red
 *   unset / 0          → passes
 *
 * Use case during demo: kick a few green builds, set the flag, kick
 * a few red ones, unset it, kick a green one. The QA Hub's
 * "mean time to green" widget needs exactly this kind of
 * red-then-green sequence to compute a meaningful number.
 */

const BROKEN = process.env.SIMULATE_BROKEN === "1";

describe("toggleable · build-health switch", () => {
  test("passes unless SIMULATE_BROKEN is set", () => {
    if (BROKEN) {
      throw new Error(
        "Simulated regression — SIMULATE_BROKEN=1 is set on this job",
      );
    }
    expect(true).toBe(true);
  });
});
