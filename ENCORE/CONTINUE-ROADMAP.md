# ENCORE — resume here

## Saved milestone

Candidate: **0.9.1-beta.1**, Touring 2.0 + living city foundation.

This work continues the Studio branch and foundation work, including remote regional-tour commits `4a6ec78` and `2b93231`. It preserves their earlier route records when migrating. It is not completion of the full 1.0 roadmap.

### What now works

- Menu → Touring opens one route builder. Add up to 160 city shows, at most two scheduled per week.
- Each show has a week, venue, standard price, premium seat percentage, production level, security level and optional opening artist.
- Regional fans, local loyalty, recent streams, city scene heat, career momentum, price resistance and repeated visits affect demand.
- Itemized forecasts cover crew, production, security, travel, lodging and opener fees. They are estimates, not promises.
- Launch requires 40 energy and a nonrefundable setup deposit. Upgrading an active route to a larger venue requires confirming and funding the additional setup cost.
- Up to two due shows settle each week before music and finance. Unfunded shows pause without creating revenue; players can fund, resize, reschedule or cancel them.
- Completed reports retain tickets, gross, expense breakdown, net before shares/tax, satisfaction, incidents, local fans and PULSE reach. Completed tour archives retain their show reports.
- Performances change local loyalty/demand/fatigue, career momentum, opener relationships and temporary catalog lift. Weekly briefings summarize show outcomes.
- Opening-slot invitations offer guaranteed fees and regional discovery, with duplicate acceptance protection.
- Permanent hometown stays separate from current city. City scenes rise and cool; NPC artists have persistent geographic identities.
- New properties record their purchase city; an unoccupied property in the show city lowers lodging costs. Older properties are not silently given invented locations.
- Old tour money/completed-show totals survive migration. If recorded city routes exist, those destinations and raw prior route history survive too. Otherwise future routes are explicitly estimated and editable.
- Career state schema is now 2; transport schema stays 1 for the existing Cloudflare save API.

### Canonical source ownership

| System | Files / functions |
| --- | --- |
| Touring implementation and UI | `src/world-tours.js`: `migrateTouring`, `tourStopEstimate`, `saveTourStop`, `reviewWorldTour`, `confirmWorldTour`, `settleWorldTour`, `validateWorldTour` |
| Weekly integration | `src/core.js::advanceWeek`, `src/weekly-engine.js` — touring removed from monthly hooks |
| Tour aftermath / streaming | `src/career-systems.js::adjustReleaseStreams`, common audience event engine |
| Geographic identity and city cycles | `src/career-world.js::migrateLivingWorld/settleLivingWorld` |
| Relocation | `src/industry-life.js::relocateArtist/locationPage` |
| Property city assignment | `src/wealth.js::confirmAssetBuy` |
| Ordered migrations | `src/save-tools.js::CAREER_MIGRATIONS/migrateSaveState` |
| Retired overlapping behavior | Removed v080 tour settlement and v081 tour-review overrides; old `bookRun` redirects to canonical Touring |
| Release notes | `RELEASE-0.9.1.md` |
| Tests | `tests/touring-2.mjs`, `tests/touring-career.mjs`, `tests/long-career.mjs`, existing regression suite |

### Commands

Run from `ENCORE/`:

```sh
npm test
npm run build
npm run dev
npm run deploy
```

`npm run deploy` requires the owner's authenticated Cloudflare account. Preserve `wrangler.jsonc` and its R2 bucket and email bindings. Do not create a replacement bucket or reset career saves.

### Verification and remaining release gates

The existing full regression suite plus Touring 2.0 tests passed locally, including the three 20-year baseline scenarios. An additional 20-year annual-tour fixture verifies saved show archives and repeated settlements. See CI for the authoritative result on the published commit.

No physical iPhone acceptance result is claimed. Browser sign-in reached the Cloudflare login page, which reported a verification error; publishing code is not proof of a successful Cloudflare deployment. Verify the public game's version and `Touring 2.0` screen before calling it live.

Before production:

1. Confirm all CI checks pass on this exact commit.
2. Export existing careers, test one actual older save in sandbox/offline mode, and check migrated active routes and financial totals.
3. At phone width, add/edit/cancel a show, review deposit/upgrade confirmations, advance a week, inspect the show report, export and reload.
4. Deploy through the existing Cloudflare application with the existing bucket; verify Settings shows `0.9.1-beta.1`.
5. Verify `/art/` images and offline cache after a fresh load. Keep the previous deployment available for rollback, but do not load schema-2 saves in older clients.

## Next work, in order

1. **Release acceptance:** historical-save fixtures from real released builds, mobile UI, deployed offline behavior and error/recovery checks. These cannot be replaced by VM tests.
2. **Touring refinement:** richer travel distances, opener availability/negotiation, ticket-sales pacing, multi-tier inventory, festivals and opening runs, staff/security incidents, public PULSE conversations, and more varied venue/city content. Current premium-seat pricing uses an aggregate average; PULSE aftermath currently updates reach/followers and briefings rather than generating reply threads.
3. **Audience model maturity:** cross-source listener deduplication and conversion/loyalty/churn calibration. The common mutation engine and regional invariant exist; the complete audience product model is not finished.
4. **AI generations and charts:** aging, retirement, new generations and persistent artists behind chart filler. Keep the current NPC cooling/hiatus/comeback mechanics and growth damping.
5. **Relationships / representation:** multidimensional relationships and shared history, deeper agents and inner circle. Tour openers currently use the compatible relation score.
6. **Music/PULSE/awards/legacy roadmap:** finish the planned 2.0 systems on the existing Studio and save foundation, using shared history rather than parallel logs.
7. **Architecture cleanup:** consolidate remaining navigation, finance, contract and presentation overlays one subsystem at a time, with behavior tests. Do not append another version override to fix a canonical owner.

Balance constants live in `world-tours.js` (`liveVenues`, `tourProduction`, demand/cost formulas). Tune from scenarios instead of changing expectations in tests merely to get green results. Preserve player song history, contract rights, cash and tour records throughout migration work.
