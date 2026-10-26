# ENCORE 1.0 Architecture Contract

## One simulation runtime

ENCORE has one canonical gameplay runtime: `ENCORE_ENGINE` in `engine/runtime.js`.

The renderer may change. The presentation may still contain historical screen modules while they are redesigned. Those layers are not allowed to own a second implementation of simulation rules.

`src/engine-adapter.js` is the only compatibility adapter between the current full renderer and the canonical engine. UI2 can call the renderer-independent engine modules directly while it is still a preview surface, but it must not implement alternative simulation math.

## Canonical ownership

| System | Canonical owner |
| --- | --- |
| Week phase order | `engine/weekly.js` through `ENCORE_ENGINE.settleWeek` |
| Atomic weekly/monthly transaction | `engine/week-transaction.js` through `ENCORE_ENGINE.transactWeek` |
| Release stream settlement | `engine/releases.js` |
| Audience mutation / regional attribution | `engine/audience.js` |
| Chart ledger / movement / history | `engine/charts.js` |
| Finance ledger / wallet / reserves | `engine/finance.js` |
| Studio state mutation | `engine/studio.js` |
| Owned-label roster negotiation math | `engine/roster-negotiation.js` |
| Week/month/year scheduling | `engine/scheduler.js` |
| Top-level save schema progression | `engine/migrations.js` |
| Current renderer integration | `src/engine-adapter.js` |

## Retired architecture

The following bridge/shim files were removed during consolidation because their responsibilities now belong to `src/engine-adapter.js` and `ENCORE_ENGINE`:

- `src/charts-engine-bridge.js`
- `src/audience-engine-bridge.js`
- `src/finance-engine-bridge.js`
- `src/studio-engine-bridge.js`
- `src/roster-negotiation-engine-bridge.js`
- `src/weekly-engine.js`
- `src/v131-shared-week-history.js`

The direct legacy week simulator previously embedded in `src/v107-week-hotfix.js` is also retired. `v107` now contains presentation-only briefing helpers.

## Rules for future work

1. Do not add another full `advanceWeek` simulation loop.
2. Do not create a new versioned bridge for a subsystem that already has a canonical engine owner.
3. Do not change global fan totals outside the Audience Engine for migrated systems.
4. Do not duplicate chart history, finance settlement, stream settlement, studio mutation, roster-negotiation math, scheduling, or migration logic in a screen module.
5. New gameplay rules belong in an engine module or in a clearly named transitional hook called by the canonical weekly runtime.
6. Presentation modules may format engine state, open dialogs, navigate, and collect user input. They do not own authoritative economy/simulation math.
7. Save migrations are ordered and forward-only through `ENCORE_MIGRATIONS`.
8. Mature-save parity, sandbox longevity, active/inactive 20-year careers, touring longevity, and browser gates must stay green before deleting another compatibility layer.

## Transitional hook debt still to extract

The engine now owns the runtime and transaction boundaries, but several mature subsystems are still injected into the canonical week as hooks because their implementation remains intertwined with historical presentation/state modules. They are not alternate week engines; they are dependencies of the one engine path.

Priority extraction list:

1. AI industry `worldWeek` / career lifecycle.
2. Touring settlement and opening-slot generation.
3. Living-world settlement.
4. Owned-label weekly settlement.
5. Album sales and chart candidate compilation.
6. Career-world/momentum updates.
7. Achievement/news/report generation.
8. Remaining finance input preparation (representation, operating costs, tax quote).

Each extraction should move state mutation into `engine/` while leaving a thin presentation adapter, then remove the corresponding wrapper/override. Do not append another version override to accomplish the move.

## Definition of “new engine only”

For ENCORE 1.0, “new engine only” means every authoritative gameplay transaction enters through `ENCORE_ENGINE`; there is no second legacy simulation loop capable of producing a different save. Historical renderer files may remain temporarily for UI presentation, but they cannot bypass the engine runtime.
