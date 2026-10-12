# ENCORE — Saves / Performance / Deployment

## Audit score
**Saves: 8.7/10** · **Runtime architecture/performance: 6.1/10** · **mobile/offline acceptance: 6.7/10**

## Current state
ENCORE has ordered state migrations, strict import validation, local recovery, portable saves, conflict handling, checkpoint rollback and long-career tests. Static artwork extraction reduced embedded image payloads. The final game bundle is still a large concatenated script/Worker payload, and real-device/mobile/offline acceptance is not as strong as automated coverage.

## Canonical goal
A player can carry a career for decades across releases without corruption, unacceptable save growth, broken mobile flows or deployment surprises.

## Highest-priority backlog
- Maintain a fixture matrix for actual released save versions.
- Add per-system save-size budgets and archive policies.
- Profile generated JS/Worker payload and startup/render hotspots.
- Reduce overlay ownership/code duplication before pursuing aggressive code splitting.
- Run explicit iPhone-sized acceptance for every primary flow.
- Verify offline install/recovery on real devices.
- Verify deployed `/api/version`, save API behavior and normal/sandbox separation after releases.
- Add deployment acceptance checklist that is distinct from unit/regression CI.

## Protected decisions
Save migrations must be deterministic, ordered and non-destructive. Import validation must complete before active career replacement.

## Do not drift
A passing VM regression suite is necessary but not sufficient evidence that a release is production-ready.