# ENCORE 1.0 Readiness Audit

_Last updated: October 7, 2026_

## Executive verdict

ENCORE already has enough systems to be a substantial music-career simulation. The main risk on the road to 1.0 is no longer missing features; it is fragmentation. Several systems exist in more than one generation, later files override earlier behavior, some monthly-era assumptions are patched into the weekly game at runtime, and a few major systems use different models for the same underlying concept.

The recommended path is **not** to strip ENCORE down and later re-add the same features. Most existing systems should be kept and matured. The exceptions are duplicated, obsolete, misleading, or structurally incompatible pieces that should be consolidated or replaced.

The core sequence should be:

1. Stabilize and consolidate 0.8.x.
2. Build one canonical weekly simulation path.
3. Build one canonical audience model.
4. Make the AI industry capable of rising, falling, aging, and changing independently of the player.
5. Make geography reliable enough to drive Touring 2.0.
6. Continue the feature roadmap on top of those foundations.

The north star remains: **every major system should affect another system, failure should create playable stories, the world should not scale around the player, career tier should remain separate from current heat, geography should matter, and ENCORE should remember.**

---

# Severity key

- **Critical** — can undermine save integrity, the long-term simulation, or the architecture required for 1.0.
- **High** — materially harms balance, progression, consistency, or future system design.
- **Medium** — should be corrected during stabilization or while its surrounding system is rebuilt.
- **Polish** — presentation/readability/quality work that should be complete before the Beta label is removed.

Each system also receives a disposition:

- **KEEP** — foundation is good; polish/balance only.
- **REHAUL** — preserve the system and player-facing concept, but deepen and integrate it.
- **REBUILD** — replace the underlying implementation while preserving save/player continuity where practical.
- **CONSOLIDATE** — multiple generations or code paths should become one canonical implementation.
- **REMOVE / RETIRE** — obsolete or redundant behavior should stop running.

---

# 1. Architecture and build pipeline

## HIGH — layered override architecture

`build.mjs` concatenates the original modules and then a long fixed sequence of version overlays (`v080` through `v088`) before Living Career navigation/routing. Later modules intentionally redefine functions from earlier modules. This accelerated development without breaking old saves, but it now makes final behavior dependent on file order rather than a single authoritative implementation.

Examples include weekly pacing overriding monthly behavior, navigation being replaced and then patched again, marketing wrapping audience settlement more than once, and portrait resolvers being replaced repeatedly.

**Disposition: CONSOLIDATE.**

Do not rewrite the whole game at once. During 0.8.x stabilization, move the most important final behavior back into canonical modules one system at a time and remove the superseded wrapper only after tests prove equivalence.

## HIGH — runtime string-replacement patches

The weekly layer still rewrites older UI copy such as “month” to “week” after older functions render. This works, but it is fragile and can leave inconsistent terminology when new copy is added.

**Disposition: RETIRE.**

The canonical UI should speak weekly pacing directly. Monthly settlement should remain a simulation concept only for systems that truly settle monthly.

## HIGH — automated tests do not protect long careers

The project has a broad subsystem test suite, but there is no dedicated deterministic 1-year / 5-year / 10-year / 20-year simulation test checking numeric sanity, save growth, world evolution, chart behavior, wealth inflation, fan growth, catalog growth, and AI careers.

The current test list is also version-layer heavy. Some portrait tests are stale relative to the latest portrait source, which demonstrates that source and tests can drift when direct commits are made outside a PR/CI path.

**Disposition: ADD / CONSOLIDATE.**

Before 0.9 expands the Living World, add long-run simulation tests and require the full suite for merge/release.

## MEDIUM — bundle weight is concentrated in JavaScript

Large presentation assets are included as JavaScript modules. `asset-photos.js` alone is over 1 MB and `artwork.js` is hundreds of KB before the rest of the game is concatenated. `build.mjs` embeds the generated script in the Worker build as well.

**Disposition: REHAUL before 1.0.**

Move heavy image data to normal static assets where practical, lazy-load optional visual content, and keep the gameplay bundle focused on logic/state.

---

# 2. Weekly simulation and progression

## KEEP — week-close backbone

The weekly path is conceptually strong: releases resolve, regional streams are recorded, albums/world/labels update, charts publish, audience changes settle, career-state metrics update, finances close, achievements/news run, and then the week advances. The weekly wrapper takes a checkpoint and restores the state if week advancement throws.

This is worth preserving as ENCORE’s canonical simulation spine.

## HIGH — two time models still coexist

Several systems were originally built around monthly advancement while the player now advances one week at a time. The weekly overlay handles month-end settlement for staff, assets, world tours, rentals, commerce, sports, and other systems.

**Disposition: CONSOLIDATE.**

Keep weekly player control, but explicitly classify every subsystem as weekly, monthly, annual, or event-driven in one scheduler instead of relying on wrappers and copy replacement.

## HIGH — progression needs long-save validation

Skill XP curves, fan tiers, wealth, catalog value, marketing scale, commercial deals, and AI growth have individually reasonable formulas, but they have not been validated as one 20-year economy.

**Disposition: TEST + BALANCE.**

No major 0.9 balance assumptions should be considered final until automated long-career scenarios exist.

---

# 3. Music creation, streaming, charts, and certifications

## KEEP / REHAUL — music creation

Song quality and commercial potential already use captured development stats, production budget, creative direction, random execution, and appeal. Finished songs preserve the skills used when they were made, which is a strong design choice.

The future Music + Release Strategy 2.0 should evolve this foundation rather than replace it.

## HIGH — chart world is partly synthetic

The player and persistent NPC artists compete with generated background song and album entries. This solved the early “300 streams charts in the Top 30” problem, but it means a meaningful portion of the chart is not produced by persistent careers that can be followed, befriended, rivaled, toured with, or remembered.

**Disposition: REBUILD gradually.**

As AI career intelligence improves, replace synthetic chart filler with persistent world artists/new generations. Temporary background entries can remain only as an emergency depth floor until the persistent world is large enough.

## HIGH — AI careers mostly trend upward

The core NPC world decays individual songs over time, but new releases add fans and the primary world loop does not have an equivalent career-level audience decline, inactivity loss, retirement, comeback, era, or generational replacement system.

**Disposition: REBUILD as AI Career Intelligence.**

This is one of the most important prerequisites for the “world does not wait for the player” promise.

## HIGH — album certification can inherit pre-album lifetime streams

Album certification uses the lifetime streams of tracks assigned to the album. Previously released singles can later be placed on an album, meaning historical streams generated before the album existed can immediately count toward that album’s equivalent units.

**Disposition: FIX before 0.9.**

Track album-era units from the album release date, or explicitly store pre-album carry-in rules if ENCORE intentionally wants partial credit. The current behavior should not be accidental.

## MEDIUM — hit/flop language is useful but narrow

The factor model correctly treats success relative to expected reach, but future career eras should distinguish commercial underperformance, critical reception, fan reception, cultural impact, sleeper growth, and long-term catalog behavior.

**Disposition: KEEP + EXPAND in Music 2.0.**

---

# 4. Audience, fame, and Living Career

## CRITICAL FOUNDATION — audience changes use multiple models

Streaming acquisition/churn runs through the audience settlement function, while touring, showcases, open mics, PULSE/staff effects and other systems can add fans directly. Those additions do not all pass through the same listener/availability/churn constraints.

**Disposition: REBUILD into one Audience Engine before or during early 0.9.**

Systems should submit audience events (discovery, conversion, loyalty, churn, regional transfer) to a common engine instead of independently changing `s.fans`.

## HIGH — regional migration can distort established careers

An established save can initialize a very large portion of its global fans into the hometown market while other markets begin near zero. This creates regional history that never actually occurred and can become especially damaging once Touring 2.0 uses city demand.

**Disposition: FIX before Touring 2.0.**

Use a migration strategy based on historical releases, genre affinity, existing stream distribution, current scene, and/or a neutral spread rather than assigning an oversized hometown share.

## MEDIUM — first observed regional growth displays as +100%

Markets with no prior observed period and positive streams are displayed as +100%, even though no real comparison exists.

**Disposition: FIX.** Display `NEW` / `First tracked week` until a valid comparison exists.

## MEDIUM — Career Pulse is duplicated on Audience & Markets

The Audience page explicitly renders the full Career Pulse card before the market map.

**Disposition: FIX.** Career Pulse should own career health; Audience & Markets should own geography.

## HIGH — regional fan totals can diverge from global fan totals

Regional markets maintain their own fan counts while global fans are updated separately. Without a reconciliation contract, regional totals can become a parallel audience model rather than an explainable decomposition of the global audience.

**Disposition: resolve as part of the Audience Engine.**

## MEDIUM — regional formulas need long-run damping

Awareness is sticky, first-observation growth is inflated, hometown legacy compounds repeatedly, and market concentration can feed back into future market weight. These mechanics may work over dozens of weeks but must be tested across decades.

**Disposition: BALANCE during 0.8.9 / 0.9 foundation work.**

---

# 5. Touring

## REBUILD + CONSOLIDATE

ENCORE currently contains multiple generations of touring: local/three-show runs and the later multi-month world-tour model. The newer model adds ticket price, venue scale, production, pausing, cancellation, and multi-show progress, but its demand is still primarily global rather than truly city-driven.

Touring 2.0 should replace the underlying tour engine, not add another wrapper.

Keep existing touring playable until the replacement is ready, then migrate active/complete tour records where practical.

The new canonical loop should be:

**Regional Demand → Route/Venue/Price → Performance → Satisfaction → Local + PULSE Buzz → Streams/Fans → Momentum → Future Demand.**

---

# 6. PULSE, relationships, features, agents, and staff

## REHAUL — PULSE

PULSE already has posts, engagement, song links, replies, label discovery, leverage, and simulated conversation threads. It is therefore not a future feature that should be removed.

Its next version should convert it from a follower/views layer into a public-life system with influence, verification, public sentiment, celebrity ecosystems, staff strategy, crisis response, cosigns and regional effects.

## REBUILD/REHAUL — relationships

The current relationship model is mostly a single `relation` score. It already affects feature access, price, negotiation and beef, which is useful, but it cannot support the planned multi-year political world by itself.

Migrate important relationships toward Friendship, Respect, Trust, Rivalry, Jealousy and persistent shared history while keeping a compatibility score for older mechanics during transition.

## REHAUL — feature requests

Outgoing features already use access requirements, relationship pricing, negotiation and up to six guests. Incoming opportunities are much simpler.

Incoming Feature Requests 2.0 should use the existing artist world and relationship data, not become a separate mini-game.

## REHAUL — agents

Discovery, negotiation, commission, reach, misconduct, incidents and dismissal already exist. The foundation is worth preserving.

Representation 2.0 should add specialties, network, career-stage fit, recommendations, poaching, relationship/loyalty, reputation and richer negotiation consequences.

## REHAUL — staff

The Team system currently provides fixed candidates and passive percentage effects plus risk incidents. It should evolve into the Inner Circle system rather than be removed.

---

# 7. Labels, contracts, commercial opportunities, ownership

## KEEP / BALANCE — artist label contracts

Contract type, term, advance, split, negotiation, switching/buyout, catalog participation, and 360 scope are already meaningful and connected to finances.

Future work should deepen clauses, leverage, obligations, label behavior and relationship consequences rather than replace the system.

## KEEP / EXPAND — commercial opportunity scaling

The current commercial ladder uses hard fan/stream/follower/award/career-time gates and then scales offer values inside the unlocked class. This is a good pattern because momentum can change value without skipping entire career stages.

## HIGH — own-label endgame is available too early

A player can currently found a record label for $25,000 as long as they are independent. There is no major career-history, reputation, wealth, influence or executive-readiness gate, despite label ownership being planned as a legacy/endgame system.

**Disposition: REHAUL / GATE, not delete.**

Existing saves that already own a label should be grandfathered. New careers should eventually need meaningful executive readiness before founding a label. This protects the feature while restoring progression and making the endgame feel earned.

## REHAUL — label league / AI labels

Labels have budgets, rosters, transfers and renewals, which is a useful base. Their strategy is still mostly formulaic and should later react to artist heat, genres, city scenes, relationships, contract performance and organizational priorities.

---

# 8. Finance, wealth, assets, commerce

## KEEP — finance core

Exact-cent wallet handling, progressive fictional tax brackets, reserves, label shares, agent commission, overhead, annual reconciliation and income categories form a strong finance foundation.

## MEDIUM — career overhead explanation conflicts with named staff costs

The game describes tier-based overhead as covering management/staff/security while named staff are also billed separately.

**Disposition: CLARIFY / REBALANCE.**

Define overhead as general career operations (administration, travel coordination, insurance, legal/accounting retainers, etc.) and keep named staff as separate premium personnel, or remove overlapping language/costs.

## KEEP / REHAUL — wealth, market, property

Property, rentals, cost basis, realized gains, securities and the fictional exchange are deeper than a placeholder. They should remain, but 1.0 should prioritize gameplay utility and music-career interactions over adding more finance complexity.

## MEDIUM — optional wealth systems risk feature sprawl

Sports ownership, market trading, property, outside catalog investment and collectibles can become a second game beside the music simulation.

**Disposition: KEEP as secondary systems, freeze major expansion until core music/world systems are mature.**

Every future addition should answer: what does this change about the artist’s career, risk, mobility, privacy, leverage, legacy, or cash-flow decisions?

## KEEP / REHAUL — merchandise

Merch already supports product type, visual choice, inventory, production cost, sale price and 360 sharing. Future work should connect demand to eras, tours, city markets, fan loyalty and brand strength.

---

# 9. Awards, milestones, achievements, career memory

## REHAUL — ENCORE Honors

The current annual award system already produces multiple categories and competes the player against AI artists. That is a legitimate foundation.

Awards Show 2.0 should replace static score formulas with year-specific releases, critical/fan/cultural reception, touring, momentum, longevity and event presentation. The ceremony should become an annual narrative climax, not simply a ranking calculation.

## KEEP / EXPAND — milestones and briefings

The game already records career firsts, achievements, certifications, chart breakthroughs and briefings. This is the beginning of **ENCORE remembers**.

The 1.0 path should unify this history into named eras, rivalries, tours, contracts, city bonds, award seasons and comeback/slump chapters rather than create another parallel history log.

---

# 10. Save integrity and long-career scale

## KEEP — save protection

Portable JSON export, local recovery snapshots, structural validation, import review, schema checks, multi-tab conflict handling and checkpoint rollback are all strong foundations.

## CRITICAL — 1.0 needs explicit save migrations and long-run budget tests

Future systems will add regional history, relationships, AI generations, tours, staff histories and career memory. Relying on dozens of independent `migrateX()` calls indefinitely will become difficult to reason about.

**Disposition: CONSOLIDATE.**

Introduce a top-level save schema version with ordered migrations. Keep subsystem versions internally when useful, but every released build should have a deterministic migration path from supported older schemas.

Long-run tests should enforce a save-size budget and verify that compaction never destroys information that the player expects ENCORE to remember.

---

# 11. UI / UX / mobile

## KEEP — five-button bottom navigation + searchable Menu

The bottom navigation is appropriately small while the Menu acts as the full directory. This is a good answer to a system-rich game.

## HIGH — too many destinations can still feel fragmented

The current final destination map contains more than thirty screens across Career, Music, Social, Business, Wealth and Legacy. Search helps, but several systems are split across pages that could be grouped more naturally.

**Disposition: CONSOLIDATE during stabilization and each 2.0 rehaul.**

Examples: Career Pulse vs Audience should have clear ownership; Deals/Offers/Labels should share a consistent business mental model; Awards/Milestones/Celebrations/Achievements should feel like one Legacy area even if they remain separate views.

## MEDIUM — mobile is considered but not fully proven

There are explicit responsive breakpoints and mobile grid fallbacks, which is positive. However, source-level responsive CSS is not the same as device validation. 1.0 should have an explicit iPhone-sized acceptance pass for every primary flow: creation, studio, release, weekly advance, charts, offers, PULSE, touring, markets, saves and long lists.

## MEDIUM — terminology should become canonical

Some old functions still say month while later layers rewrite them to week. Similar legacy phrases remain in guidance and UI internals.

**Disposition: FIX during stabilization.** No player-facing screen in the final build should rely on string replacement for core time terminology.

---

# 12. Portrait / visual identity track

The portrait experiment should not block simulation work. For the stabilization period, all in-game people can safely use consistent initials tiles while the visual cast is redesigned.

**Disposition: TEMPORARILY DISABLE PERSON PORTRAITS.**

Keep source assets in the repository for future reference unless there is a separate cleanup decision. The final active `personPhoto()` resolver should return initials for artists, featured artists, staff, agents and any other person surface so no old portrait layer leaks back in through build order.

Portrait work can return later under one rule:

> One fictional person → one persistent identity → one source asset → the same presentation everywhere.

---

# Keep / Rehaul / Rebuild summary

| System | Decision before 1.0 |
| --- | --- |
| Weekly simulation spine | KEEP + consolidate scheduler |
| Music creation | KEEP + REHAUL |
| Streaming model | KEEP + balance |
| Charts | REBUILD background competition into persistent world |
| Certifications | KEEP + fix album historical-stream rule |
| Global audience | REBUILD into common Audience Engine |
| Regional audience | REHAUL before Touring 2.0 |
| Career Pulse / eras | REHAUL |
| Touring | REBUILD + CONSOLIDATE |
| PULSE | REHAUL |
| Relationships | REBUILD data model, preserve continuity |
| Features | REHAUL |
| Agents | REHAUL |
| Staff | REHAUL |
| Artist contracts | KEEP + deepen |
| Commercial deals | KEEP + balance |
| Label league | REHAUL |
| Player-owned label | KEEP but gate as earned endgame |
| Finance/taxes | KEEP + clarify overhead |
| Wealth/property/exchange | KEEP; pause major expansion |
| Merch | KEEP + integrate |
| Awards | REHAUL |
| Milestones/briefings | KEEP + unify into career memory |
| Saves | KEEP + top-level migration architecture |
| Navigation | KEEP + simplify ownership of screens |
| Portraits | DISABLE temporarily; initials only |

---

# Mandatory stabilization before 0.9

The following should be considered the **0.8.8 / 0.8.9 stabilization gate**:

1. Remove all active person portraits from the game and use initials tiles while the cast is reworked.
2. Repair portrait/test drift and make the full test suite authoritative again.
3. Remove the Career Pulse duplication from Audience & Markets.
4. Replace first-observation `+100%` regional growth with `NEW`.
5. Correct regional migration for established careers.
6. Define whether regional fans are a decomposition of global fans and enforce that invariant.
7. Fix/define pre-album stream credit for album certifications.
8. Create one explicit weekly/monthly/annual scheduler and reduce runtime copy patches.
9. Add 1-year, 5-year, 10-year and 20-year simulation tests.
10. Add numeric sanity assertions for fans, streams, cash, taxes, AI audience, charts, catalog value, offers and save size.
11. Gate new-career label ownership behind an earned executive/endgame requirement while grandfathering existing labels.
12. Profile bundle/save size and move heavy optional image payloads out of the core JS path where practical.

Only after this gate should Touring 2.0 depend heavily on regional demand.

---

# 1.0 exit criteria

ENCORE should leave Beta when all of the following are true:

- A new career and a migrated older career can both run for 20 simulated years without corrupting, exploding numerically, or exceeding the supported save budget.
- AI artists can rise, peak, cool, decline, return, change generations and meaningfully compete without mirroring the player.
- Career tier and current heat are separate and visible.
- Regional audience data is trustworthy enough to drive tour routing and local opportunity decisions.
- Touring, PULSE, relationships, music, labels, staff, awards and finance affect one another through documented simulation contracts instead of isolated stat changes.
- No major player-facing system has multiple active generations of implementation.
- No primary UI flow depends on runtime string replacement for core terminology.
- Mobile acceptance tests cover every primary screen and confirmation flow.
- Save migration is deterministic and tested.
- The tutorial/guide explains the current game rather than historical versions of it.
- Every major failure state has a continuation path rather than forcing a restart.
- The Beta label can be removed without a giant “now the game is finally complete” feature dump; the game has matured into 1.0 continuously.

---

# Final audit conclusion

ENCORE is not suffering from a lack of ideas. It has the opposite problem: a large amount of promising functionality arrived faster than the architecture could be consolidated.

That is a good problem to solve.

The path to 1.0 should be **maturation, not reinvention**: preserve the systems that already create interesting careers, replace the duplicated or structurally weak foundations, connect isolated mechanics, prove the simulation over decades, and use each version to make the same game feel more alive rather than simply larger.
