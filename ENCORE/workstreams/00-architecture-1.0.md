# ENCORE — Architecture & Road to 1.0

## Audit score
**6.1/10 architecture health** · **7.0/10 current 1.0 release confidence**

## Current state
The player-facing game is more mature than the implementation architecture. `build.mjs` still concatenates canonical modules followed by a long ordered stack of `v080` through `v095` overlays. Later files wrap or redefine older functions. The canonical weekly engine and save schema are major improvements, but navigation, presentation, marketing, contracts and other systems still rely on historical layering.

Current regression CI passes on `0.9.4-beta.1`.

## Canonical goal
One authoritative owner per major system, one scheduler contract, one audience contract, ordered save migrations, and no player-facing behavior whose correctness depends on a superseded version wrapper.

## Highest-priority backlog
- Consolidate one major subsystem at a time; never do a big-bang rewrite.
- Remove superseded wrappers only after equivalence tests pass.
- Retire remaining monthly-language/build string patches.
- Track generated JS/Worker size and establish a release budget.
- Make AI Industry + Charts and Audience Engine foundation work 1.0 gates.
- Require real iPhone/mobile/offline acceptance before Beta removal.
- Make every major failure state recoverable rather than restart-only.

## Dependencies
Coordinates every other workstream when a change crosses ownership boundaries.

## Done / protected
- Canonical weekly transition wrapper with rollback.
- Ordered top-level career state migrations.
- Long-career automated scenarios.
- Static artwork extraction from the heaviest embedded data-image modules.

## Do not drift
Do not add another `v096-*` layer for a system that can be cleanly moved into its canonical owner without first considering consolidation.