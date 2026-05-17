# qa-sim-target

Test target for the [eSpace Dev Hub](https://github.com/nova-sudo/eSpaceDev) QA
Hub simulation. A small Jest suite with deliberately mixed pass / fail /
flake / slow behaviour so Jenkins, GitHub Actions, and the QA Hub
widgets all see realistic, varied data.

This repo is **not production code**. Every file exists to make the
metrics dashboards look like they're plugged into a real team.

## What's in here

```
src/
  cart.js              tiny domain module under test
  pricing.js           same — split into two so test count > 1
tests/
  cart.basic.test.js        5 deterministic-pass tests
  cart.errors.test.js       4 deterministic-pass tests
  pricing.test.js           6 deterministic-pass tests
  flaky.test.js             1 test that fails ~20% of runs (load-bearing!)
  slow.test.js              1 test that sleeps ~2s (suite-duration spike)
  toggleable-failure.test.js 1 test gated on env var SIMULATE_BROKEN
Jenkinsfile           declarative pipeline → JUnit publish
.github/workflows/ci.yml  Actions workflow → JUnit artifact upload
```

## Run locally

```bash
npm install
npm test                      # full suite (~2.5s)
FAST_SUITE=1 npm test         # skip the slow test (~0.5s)
SIMULATE_BROKEN=1 npm test    # forces a red build
FLAKY_FAIL_RATE=0 npm test    # makes the flaky test always pass
```

## Wire-up to eSpace Dev Hub

The QA Hub's BuildPassRate tile reads from Jenkins' `/api/json` build
history. Once Jenkins is configured to build this repo, the tile will
show:

- Pass rate over the last 30 days
- Counts (passed / failed / unstable / aborted)
- Last 5 builds as coloured pills

See the [eSpace Dev Hub QA Hub docs](https://github.com/nova-sudo/eSpaceDev/tree/main/docs)
for the full integration setup.

## Two trigger paths (the simulation's core)

| Path | How it fires |
|---|---|
| **A** GitHub Actions → Jenkins | `.github/workflows/trigger-jenkins.yml` (next PR) hits Jenkins' remote-trigger URL on every PR |
| **B** GitHub webhook → Jenkins  | Repo webhook ↘ Jenkins `/github-webhook/` endpoint ↘ Jenkins picks up the push + builds |

Both require Jenkins to be reachable from the public internet. The
quickest path for local dev: `ngrok http 8080` to expose
`http://localhost:8080`.

## Simulating data

After the trigger paths are wired, run `scripts/sim-qa.mjs` from the
eSpace Dev Hub repo to:

1. Create N Jira tickets in the configured project
2. Open M GitHub PRs against this repo (each branched off `main`)
3. Trigger K Jenkins builds with mixed env vars

Refills the QA Hub with realistic data on demand.

## License

Internal use only. Not for redistribution.
