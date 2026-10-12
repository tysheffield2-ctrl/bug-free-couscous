# ENCORE — Current Systems & Performance Audit

**Audit date:** October 11, 2026  
**Audited build:** `0.9.4-beta.1`  
**Main head audited:** `5e3b0a29537bba15ce871d6f7c6b46e5e79aabea`  
**Current CI:** Passing on audited head (`ENCORE CI` run 192)

## Executive verdict

ENCORE is no longer short on features. It is a substantial music-career simulation with several genuinely strong systems. The biggest risk to 1.0 is now **maturation and consolidation**: some newer systems are excellent at the player-facing level while still sitting on top of multiple historical implementation layers.

The game currently has four distinct quality bands:

1. **Strong foundations:** weekly simulation, finance/tax accounting, saves/migrations, Touring 2.0, label-contract rights, sandbox tooling.
2. **Strong beta systems needing deeper integration:** Studio/song creation, release hype, Business HQ, PULSE, Living World/geography, UI/Artist File.
3. **Systems that need a major next-generation pass:** persistent AI careers/charts, relationships/representation, career memory/eras/awards.
4. **Engineering/release debt:** stacked version overlays, remaining legacy code paths/copy, large concatenated JS bundle, and incomplete real-device/mobile/offline acceptance.

**Overall product maturity: ~7.7/10.**  
**Feature depth: ~8.4/10.**  
**Simulation integration: ~7.3/10.**  
**Engineering architecture: ~6.2/10.**  
**Automated regression confidence: ~8.6/10.**  
**1.0 release confidence today: ~7.0/10.**

These numbers are directional audit scores, not telemetry benchmarks. They measure how complete, integrated, test-protected and maintainable each system currently appears.

---

## System scorecard

| System | Score | Current state | Decision |
| --- | ---: | --- | --- |
| Weekly simulation / scheduler | 8.6 | Canonical week-close owner, rollback, monthly hooks, annual tax boundary | KEEP + finish consolidation |
| Saves / migrations / recovery | 8.7 | Ordered state migrations, import validation, recovery snapshots, 8 MB budget, historical tests | KEEP + expand real historical fixture coverage |
| Finance / taxes / weekly recap | 8.7 | Exact-cent wallet, named income categories, progressive fictional taxes, visible effective/marginal rates | KEEP + balance |
| Touring 2.0 | 8.6 | City routes, regional demand, standard/premium inventory, venue/price/production/security, travel, lodging, openers, reports, aftermath | KEEP + deepen |
| Labels / contracts / rights | 8.3 | Deal-specific rights, negotiation, advances/splits/terms, buyouts/switching, 360 scope | KEEP + deepen obligations and label behavior |
| Song Creation / Studio | 8.1 | Unified creative brief, persistent project, theme/tempo/intent/texture/hook, skill/budget effects, creative identity | REHAUL forward, do not replace |
| Business HQ / commercial | 8.0 | Executive skills, asset overview, feature economy, merch, sports/catalog shortcuts and business history | KEEP + consolidate under HQ |
| UI / Artist File / Stats / Home | 8.0 | Stronger visual identity, Artist File, audience map, compact Home, graphical stats and wheel controls | KEEP + system-wide visual consistency/mobile pass |
| Release strategy / hype / marketing | 7.9 | Pre/post-release hype, album planning, campaigns, rollout logic, PULSE links | CONSOLIDATE + deepen strategy |
| Sandbox / LAB | 8.5 | Separate save, direct editors, PULSE overrides, regression utility | KEEP + make every major system inspectable |
| Living World / geography | 7.5 | City scenes, regional audience, hometown/current city, demand, fatigue/sentiment, property utility | REHAUL + expand world events |
| Audience / streaming | 7.4 | Shared audience mutation contract and regional/global reconciliation; listener/churn model exists | REHAUL into one fully explicit Audience Engine |
| PULSE / social/public life | 7.3 | Posts, formats, count-backed engagement, replies, follower conversion, label signal, industry feed, tour threads | REHAUL into Public Life 2.0 |
| Wealth / property / market / sports | 7.3 | Substantial secondary systems and ownership gameplay | KEEP secondary; freeze breadth until core music systems mature |
| Awards / legacy / career memory | 6.9 | Honors, milestones, certifications, timeline, briefings | REHAUL into unified career memory / eras |
| Relationships / features / representation | 6.5 | Relationships affect access/cost and features are commercially deep, but relationship state is still mostly one-dimensional | REBUILD relationship model + rehaul representation |
| Charts | 6.2 | Good tracking of debut/movement/peak/weeks/late entries; competition still partly synthetic | REBUILD competition source gradually |
| AI industry / generational careers | 5.9 | Momentum, cooling, hiatus, reinvention and comeback exist; no complete aging/retirement/successor-generation model | MAJOR REBUILD |
| Runtime architecture / maintainability | 6.1 | Broad modular source but final behavior still depends on long ordered overlay stack and wrappers | CONSOLIDATE before 1.0 |
| Mobile / offline / production acceptance | 6.7 | Responsive/offline code and tests exist; real physical-device acceptance remains weaker than automated coverage | VERIFY + harden |

---

# Detailed findings

## 1. Weekly simulation and scheduler — **8.6/10**

### What is working
- One canonical week-close wrapper now owns transition/rollback.
- Month-end systems are explicit hooks instead of every subsystem charging itself whenever it wants.
- Annual tax close belongs to finance rather than a second annual debit.
- Player actions remain event-driven while release/chart/audience/finance sequencing remains deterministic.
- The week is checkpointed and restored if advancement throws.

### Remaining weakness
The scheduler is improved, but ENCORE still contains older monthly-era assumptions and historical wrappers elsewhere. The canonical timing contract should eventually declare every system as weekly, monthly, annual or event-driven in one place.

### Priority
**High engineering priority; low feature priority.** Do not redesign the week loop. Finish moving legacy timing behavior into it.

---

## 2. Save integrity and long-career stability — **8.7/10**

### What is working
- Top-level career state schema exists with ordered migrations.
- Future-version saves are rejected instead of silently damaged.
- Imports validate structure, ranges, IDs, relationships between objects, world roster and major subsystems before replacing the active career.
- Recovery snapshots occur before week advancement.
- Portable JSON saves and isolated sandbox/normal saves exist.
- 1/5/10/20-year automated scenarios and touring long-career coverage now exist.

### Remaining weakness
- Full fixture coverage from every actually released historical build is still less mature than synthetic migration coverage.
- A long touring career can retain significant route/report history; save compaction needs a deliberate archival policy that never destroys expected career memory.

### Priority
**Keep as a 1.0 gate.** Every new 2.0 system must add migration + long-career assertions at implementation time.

---

## 3. Song Creation / Studio — **8.1/10**

### What is working
- The duplicate start-song flow was consolidated into one active creative interface.
- Creative choices now include theme, tempo, intent, texture, hook, mood and writing approach.
- Creative identity exposes lyrical depth, production, performance, catchiness, originality and commercial appeal.
- Skills, production budget and choices trade off artistic/commercial outcomes rather than using a single generic quality number.
- Projects persist across weeks and preserve development context.
- Title wheels/natural title pools are improved and preserve the creative brief when shuffled.

### What still keeps it from elite status
The creative process is still more **configuration + resolution** than a full creative simulation. Recording, writing, production, revision and collaborator decisions can become more iterative. Songs should be able to develop recognizable identity, strengths, flaws and production history over several decisions rather than mostly calculating a finished profile from selected inputs.

### Next-generation target
**Studio / Song Creation 2.0:** iterative writing → demo → production → recording → revision → mix/master, with optional shortcuts for players who prefer speed.

---

## 4. Release Strategy / Hype / Marketing — **7.9/10**

### What is working
- Songs can build pre-release hype, retain buildup into launch and continue post-release promotion.
- Album eras can be planned before the album exists and transfer hype when the release matches.
- Hype is bounded, decays and cannot guarantee success.
- Existing campaign/rollout/PULSE/marketing systems influence reach.

### Current problem
There are now **multiple generations of promotion logic**: original boosts/album rollout, marketing overlays, social boosts and the newer 0.9.4 hype layer. They produce useful gameplay, but they should become one release-strategy model rather than separate multipliers stacked across files.

### Next-generation target
One release plan with objectives, budget, channels, audience, timing, fatigue, press/playlists/creators, rollout calendar, hype, conversion and post-release legs.

---

## 5. Audience / streaming — **7.4/10**

### What is working
- Common `applyAudienceEvent` infrastructure prevents many systems from mutating fan totals arbitrarily.
- Regional fan totals are now presented as attribution of the global true-fan total rather than a second population.
- Listener acquisition/churn exists.
- Regional stream records and demand now power meaningful touring decisions.

### Remaining weaknesses
- Listener deduplication across streaming, social, touring and other discovery sources is still not a fully explicit product model.
- Conversion, loyalty and churn need calibration across more play styles and seeds.
- Marketing, PULSE and touring can still feel like separate fan-generation formulas instead of events entering one audience funnel.

### Next-generation target
A canonical **Audience Engine:** exposure → listener → follower → casual fan → true fan → loyal fan, with source attribution, regional identity, saturation and churn.

---

## 6. Charts — **6.2/10**

### What is working
- Chart floors stop tiny releases from unrealistically charting.
- Debut, movement, re-entry, peak, weeks charted, #1 streaks and late-entry notifications are tracked.
- Player songs compete with persistent NPC releases.

### Major weakness
The chart is still partly synthetic. Song charts prepend `widerIndustry()` entries and album charts explicitly generate background albums. Those entries create realistic chart density, but many are not persistent careers the player can follow, know, rival, collaborate with or remember.

### Next-generation target
Replace filler gradually with persistent artists and successor generations. Synthetic entries should become an emergency depth floor, not the primary source of world scale.

---

## 7. AI Industry / generational world — **5.9/10**

### What is working
- NPCs have momentum, phases and era labels.
- They can cool, surge, take hiatuses, reinvent, collaborate and return.
- Inactive careers decay and runaway audience growth has been damped.

### Major weakness
This is still a career-arc layer on top of a mostly fixed founding roster. ENCORE does not yet have a complete music-history simulation in which artists age, peak, decline, retire, die off the active competitive layer, get replaced by new generations and leave a durable legacy behind.

### Why this matters
This is probably the **single biggest simulation gap between current ENCORE and the game’s long-term ambition**. A 20-year career should not feel like the same 24 artists continually changing states.

### Next-generation target
AI Career Intelligence + Generational Industry.

---

## 8. Touring 2.0 — **8.6/10**

### What is working
- One active city/route engine settles tours weekly.
- City demand uses regional fans, loyalty, streams, scene heat, career momentum, price resistance, local tour fatigue and opener draw.
- Standard/premium ticket inventories are separately reconciled.
- Venues, production level, security, price, opener and route timing matter.
- Travel uses approximate city distance; lodging can benefit from owned property.
- Show reports preserve tickets, gross, costs, net, satisfaction, fan impact and incidents.
- Openers have readiness constraints and shared live history.
- The player can receive opening-slot opportunities.
- Cancellation preserves history and has local consequences.
- Route/report validation is unusually strong.

### Remaining depth
Dynamic onsale pacing, presales, promoter/venue relationships, richer opener negotiation, festivals, international routing, tour crew, merch integration, routing logistics, injuries/cancellations and deeper incident systems.

### Verdict
**One of ENCORE’s best systems.** This should be deepened, not rebuilt again.

---

## 9. Living World / geography — **7.5/10**

The graphical audience map, scene heat, awareness, loyalty, demand, hometown/current city, tour fatigue/sentiment and property utility finally make location a meaningful career signal. The next step is not more pins; it is more **city-specific consequences**: scenes changing genres, promoters, venues, local press, regional rivals, festivals, migrations, economic differences and world events.

---

## 10. PULSE / social — **7.3/10**

### Strong pieces
- Multiple post formats and linked releases.
- Views, likes, comments and shares are saved as counts.
- PULSE can create followers/true fans and label interest.
- Replies affect loyalty/fans.
- NPC industry feed and relationship interactions exist.
- Touring can create show-specific social threads.
- Organic follower growth responds to career momentum.

### Concern
The 25% engagement floor and intentionally uncapped engagement creates the energetic feeling requested, but it needs balance monitoring because PULSE can become numerically detached from plausible reach and disproportionately dominate discovery.

### Next-generation target
Public Life / PULSE 2.0: sentiment, reputation, verification, fan communities, celebrity ecosystem, public controversies, staff strategy, crisis response, cosigns, regional virality and platform trends.

---

## 11. Relationships / collaborations / representation — **6.5/10**

Feature economics are now much deeper than the relationship model that feeds them. Cash, royalty and hybrid feature structures are strong; up to six guests and incoming/outgoing opportunities create actual commerce. But most artist relationships still collapse to a single `relation` score.

### Next-generation target
Friendship, trust, respect, rivalry, jealousy, professional history and public relationship state, with a compatibility score retained for old mechanics during migration. Agents/managers/staff should also have loyalty, specialties, reputation and career-stage fit.

---

## 12. Labels / contracts / negotiations — **8.3/10**

The contract architecture is strong: recording, distribution, publishing and 360 structures have explicit rights; locked clauses make deal types distinct; signing summaries clarify what the player gives and keeps. Offers, countering, buyouts, switching and label ownership give this system real strategy.

Next depth should come from obligations, options, recoupment, release commitments, label priorities, A&R relationships, renegotiation, disputes, catalog rights and AI label strategy—not from adding more screens.

---

## 13. Business HQ / merch / commercial — **8.0/10**

Business HQ is the correct direction: the business side should increasingly feel like one command center instead of unrelated Career tabs. Executive skills, business asset value, feature pricing, merch, sports/catalog ownership and recent decisions form a solid shell.

### Main issue
Some of the systems linked from HQ still live as old Career destinations underneath. The player-facing navigation should consolidate them under Business HQ even before the underlying code is fully refactored.

### Target
**Business HQ becomes the sole front door for business systems.** Contracts, label operations, merch, endorsements/media, catalog investing, sports/ownership, team and business finances should be subareas inside it.

---

## 14. Finance / economy / taxes — **8.7/10**

This is a surprisingly mature system. ENCORE tracks a large set of income categories, named expenses, agent/label cuts, overhead, progressive fictional tax reserves, annual reconciliation, effective/marginal rates and exact-cent cash storage. Weekly recaps expose the money rather than silently changing the balance.

Main remaining work is economic balancing across 20-year saves and making sure every new system uses the same ledger rather than bypassing finance.

---

## 15. Wealth / ownership / sports / market — **7.3/10**

These systems are deeper than placeholders and can create endgame goals. They should remain. However, they are **not where ENCORE should spend most 1.0 development time**. Every new wealth feature should answer how it affects artist leverage, risk, cash flow, mobility, privacy, influence or legacy.

---

## 16. Awards / legacy / career memory — **6.9/10**

Honors, milestones, certifications, timeline entries, career firsts and briefings provide a foundation. The missing layer is a single memory model that understands eras, rivalries, major tours, contracts, slumps, comeback chapters, city bonds and award seasons as connected history.

**ENCORE remembers** should become a system, not a collection of logs.

---

## 17. UI / UX / presentation — **8.0/10 player-facing; 6.7/10 device confidence**

### What improved materially
- Artist File now has a clear dossier hierarchy.
- Home is more focused.
- Stats separate ability from XP progress and allow quick training.
- Audience is a graphical map rather than a numbers-only table.
- Wheel selectors are compact and touch-aware.
- System themes/presentation are more intentional.

### Remaining weaknesses
- System-rich navigation still exposes too many peer destinations.
- Business should be more consolidated under Business HQ.
- Visual quality is uneven between newly rebuilt and older screens.
- Physical iPhone acceptance is still less proven than VM/regression testing.
- Some guidance strings still reveal historical monthly language or older system descriptions.

---

## 18. Sandbox / LAB — **8.5/10**

ENCORE LAB is one of the right long-term design decisions. It has a separate career, stat/economy editing and newer PULSE overrides. The goal should be **complete inspectability**: every major simulation system should have safe test controls, event forcing and diagnostics without contaminating normal careers.

---

## 19. Architecture / runtime performance — **6.1/10**

This is the clearest engineering debt.

The build still concatenates canonical modules followed by a long ordered series of `v080` → `v095` overlays. Later files wrap or redefine earlier functions. That made rapid beta development possible and preserved compatibility, but now the final behavior depends too much on build order.

The build still performs at least one player-facing runtime-era string correction (`Advance month` → `Advance week`) during build. The generated JS bundle remains large and is embedded into the Worker package, though moving image payloads to static `/art/` files was a meaningful improvement.

### 1.0 rule
No major player-facing system should have multiple active generations of ownership. Consolidate one system at a time, protected by equivalence/regression tests. Do **not** attempt a big-bang rewrite.

---

# Priority order from this audit

## Tier A — 1.0 foundation / highest leverage
1. **AI Industry + Charts 2.0** — persistent generations, retirement/replacement, real careers behind chart entries.
2. **Audience Engine 2.0** — one discovery/conversion/loyalty/churn contract for every source.
3. **Architecture consolidation** — remove superseded wrappers system by system.
4. **Real mobile/offline/deployment acceptance** — prove the actual player experience on iPhone-sized hardware.
5. **Relationships / representation 2.0** — shared history and multi-dimensional relationships.

## Tier B — deepen the strongest player loops
6. **Song Creation / Studio 2.0**
7. **Release Strategy 2.0**
8. **Touring 2.1 / Touring expansion**
9. **PULSE / Public Life 2.0**
10. **Business HQ consolidation**

## Tier C — narrative and endgame maturation
11. **Living World expansion**
12. **Awards / Legacy / Career Memory 2.0**
13. **Labels / Representation depth**
14. **Wealth/ownership integration**, not breadth
15. **Visual consistency pass** after each system rehaul rather than one giant cosmetic rewrite

---

# What not to do

- Do not add another parallel Touring, Studio, Audience, Awards or Contract system on top of the existing one.
- Do not solve AI chart depth by generating even more anonymous filler.
- Do not make Business HQ another extra tab while leaving every business destination equally prominent elsewhere.
- Do not expand optional wealth systems faster than the music career/world simulation.
- Do not use a giant rewrite as the architecture fix. Consolidate one ownership boundary at a time with tests.
- Do not call 1.0 complete until real-device acceptance and long-career world evolution are proven.

---

# Bottom line

ENCORE is **closer to a serious 1.0 than it was even a few versions ago**, but the path is no longer “add everything we can think of.” The path is now:

> **Make the world persistent, make every major system talk to the same underlying models, consolidate duplicate implementation layers, deepen the best loops, and prove the game over years—not just a few weeks.**

Touring 2.0 is already the model for what the rest of ENCORE should become: strategic, geographically grounded, connected to money/audience/social systems, persistent in history, and validated aggressively.