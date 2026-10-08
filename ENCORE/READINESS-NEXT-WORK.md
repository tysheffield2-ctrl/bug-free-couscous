# ENCORE readiness review and implementation report

## October 8 continuation — 0.9.1-beta.1

The current candidate is saved in PR #14, `feature/touring-2-living-world`. It includes the earlier Studio and foundation work plus weekly Touring 2.0 and living-city mechanics. The original foundation review below remains a historical record; this section supersedes its candidate version and touring status. This is not a completed 1.0 release.

### Current launch blockers

| Priority | Exact files / systems | Why it blocks launch | Current evidence / work remaining |
| --- | --- | --- | --- |
| 1 | Production acceptance: `wrangler.jsonc`, `server/worker.mjs`, `public/art/`, `src/save-tools.js`, `src/navigation.js`, `src/v090.css` | A build passing VM tests does not establish working cloud saves, mobile controls, offline recovery or a live release. | Cloudflare dashboard still reports a sign-in verification error after one reload. No deployment is claimed. Physical-phone acceptance and deployed offline/art checks remain. |
| 2 | Historical-save compatibility: `src/save-tools.js::migrateSaveState/CAREER_MIGRATIONS`, `src/world-tours.js::migrateTouring`, `tests/foundations.mjs`, `tests/touring-2.mjs` | Career money, rights and history must survive upgrades. | Ordered schema-2 migration, repeatability, portable round trips, prior tour totals and recorded regional routes are covered. Actual historical released-save fixtures remain necessary; simulated legacy objects are not that fixture matrix. |
| 3 | Canonical subsystem ownership: `build.mjs`, `src/core.js`, `src/weekly-engine.js`, `src/v080*.js` through `src/v090*.js` | Later overrides can silently replace fixes and recreate double settlement. | Audience marketing and calendar ownership consolidated. Touring now has one weekly owner; old monthly settlement and v080/v081 tour overrides are removed. Navigation, finance, contracts and presentation layers still require staged consolidation before 1.0. |
| 4 | Audience and longevity balance: `src/career-systems.js::applyAudienceEvent/settleAudience`, `src/career-world.js`, `src/core.js::worldWeek`, `tests/long-career.mjs`, `tests/touring-career.mjs` | Progression must remain numerically valid and playable over decades. | Regional conservation, common mutations, AI growth damping and three 20-year baseline scenarios pass locally. A fourth 20-year touring scenario retains all 120 show reports in an approximately 870K-character save. Wider seeds, strategies, listener deduplication and exploit review remain. |

### High-value improvements

| Priority | Exact files / systems | Why this tier | Current status |
| --- | --- | --- | --- |
| 1 | Touring 2.0: `src/world-tours.js`, `src/core.js::advanceWeek`, `src/career-systems.js::adjustReleaseStreams`, `tests/touring-2.mjs`, `tests/touring-career.mjs` | Tours should be strategic regional careers with transparent costs and durable consequences. | Implemented editable city routes, two shows per week, pricing/premium mix, production/security/openers, cost forecasts, deposits/upgrades, funding pauses, reports, cancellation, regional aftermath, catalog buzz, opening invitations and archived shows. Remaining: ticket-sales pacing, richer inventory, travel distances, opener negotiation/availability, festivals and deeper incidents. |
| 2 | Living cities: `src/career-world.js::migrateLivingWorld/settleLivingWorld`, `src/industry-life.js::relocateArtist`, `src/wealth.js::confirmAssetBuy` | Geography should affect decisions and identity. | Implemented city scene cycles, fatigue/sentiment, NPC home/current cities, permanent player hometown and property lodging benefits. Remaining: broader city content and deeper cross-system world events. |
| 3 | Audience product model: `src/career-systems.js`, `src/career-world.js`, `src/social.js`, `src/v086-marketing.js` | Conserved totals alone do not explain discovery, conversion, loyalty and churn. | Shared mutation infrastructure delivered. Cross-source listener deduplication and conversion calibration remain. |
| 4 | Generational AI / meaningful charts: `src/core.js::worldWeek/widerIndustry/compileSongs`, `src/v082-polish.js`, `src/directory.js` | The world must develop rivals and successors across long careers. | Existing cooling/hiatus/comeback mechanics and new damping retained. Aging, retirement, replacement generations and persistent identities behind filler chart entries remain. |
| 5 | Relationships and representation: `src/industry-life.js`, `src/negotiations.js`, `src/label-business.js`, `src/world-tours.js` | Managers, agents and collaborators need shared history and distinct consequences. | Executive gates delivered; touring uses compatible relation scores and paid openers. Multidimensional relationships, inner circle and richer negotiation remain. |

### Later polish

| Work / files | Why it can follow the foundation |
| --- | --- |
| More city/venue descriptions, tour report presentation and richer PULSE reply threads: `src/world-tours.js`, `src/social.js`, styles | Adds variety and feedback after route mechanics, saves and finance are reliable. Current aftermath already updates reach/followers and weekly briefings. |
| Portrait and visual consistency: `src/v08*-portraits*`, `src/v090.css`, `public/art/` | Cosmetic consistency is valuable but cannot substitute for save safety and release acceptance. Static-art extraction already reduces bundles. |
| Broader awards/legacy storytelling and optional presentation refinements in their owning modules | Extend career texture after the shared history and canonical engine are stable. Any rewards affecting progression still need balance tests before release. |

See `CONTINUE-ROADMAP.md` for supported behaviors, exact source owners, verification commands and remaining implementation work. All source and continuation notes are saved in GitHub. No email was sent.

---


Reviewed October 7–8, 2026. This is a beta foundation change, not a declaration of 1.0 readiness or public deployment.

## Evidence and current state

- Audit: `0e769d48d7b44444fb277c57cca82cd4339092fd`, `ENCORE/AUDIT-1.0.md` (read in full).
- Roadmap: `899392a3d01f4f20f9020ded6dc754b7662f4cf1`, `ENCORE/ROAD-TO-1.0.md` (read in full).
- Default branch reviewed: `1e7c5fe12edbbbb6cb97a016787fc4d595a25437`, version `0.8.7-beta.1`.
- Latest implementation reviewed: PR #12, `feature/v090-studio-overhaul`, head `98c038d5852d3d1a80e8b9282541ceacab5f2235`, version `0.9.0-beta.1`. Its description cites older head `a946a0e`; that older green CI claim does not prove the newest head passes.
- This change starts from that latest Studio head, preserving its creative process, design, contract rights and navigation work. Candidate version: `0.9.0-beta.2`.
- The newest branch initially failed `npm test` in `tests/lab-editor.mjs`: `MutationObserver is not defined` from `src/v090-contracts.js`. The failure was reproduced locally.
- The 0.9 version number is ahead of the roadmap's stabilization sequence; it does not establish completion of 0.8.8, 0.8.9, Living World or Touring 2.0.

Two audit qualifications matter. `core.js::certificationRules()` already explicitly grants full pre-album single carry-in, so that behavior is a published rule rather than an undocumented accident. Also, `v082-polish.js` already implements limited cooling, hiatus, reinvention and comeback events. It does not yet provide a complete generational artist world.

All paths below are relative to `ENCORE/` unless otherwise stated.

## Prioritized next-work list

### Launch blockers

These must be resolved before claiming a reliable foundation release or 1.0. “Implemented” means code and stated automated checks exist in this candidate, not that it is live.

| Order | Work and exact files/systems | Why this tier | Candidate status / remaining gate |
| --- | --- | --- | --- |
| 1 | Restore authoritative build/test/release identity: `src/v090-contracts.js`, `package.json`, `RELEASE-0.9.0.md`, `build.mjs`, `tests/*` | Latest development head failed evaluation. A prior green commit cannot certify later commits. | Implemented capability checks for browser APIs, beta.2 metadata and current tests. Full local suite passes. Remote CI and deployment still require verification. |
| 2 | One audience mutation contract and regional conservation: `src/career-systems.js::applyAudienceEvent/settleAudience`, `src/core.js`, `src/social.js`, `src/commerce.js`, `src/industry-life.js`, `src/world-tours.js`, `src/career-world.js`, `src/v086-marketing.js` | Parallel fan populations undermine progression and regional tour demand. | Implemented shared gameplay mutation entry point, bounded deltas/reach, source totals, bounded event history, canonical marketing settlement, historical/estimated regional migration and exact integer regional/global reconciliation. Initialization and deliberate sandbox editing remain explicit exceptions. Source-specific reach formulas still need calibration; a full discovery/conversion/loyalty/churn product model is not complete. |
| 3 | Deterministic save evolution: `src/save-tools.js::migrateSaveState`, online/offline load/save paths in `src/core.js`, `tests/foundations.mjs` | An incompatible migration can destroy years of career progress. | Implemented ordered career-state schema migration on a clone, future-version rejection, idempotence tests and portable-save round trips. The transport envelope stays schema 1 for server compatibility. Existing subsystem migrations remain; the full historical released-save fixture matrix is still outstanding. |
| 4 | Calendar settlement ownership and rollback: `src/weekly-engine.js`, `src/core.js::advanceWeek/closeFinances`, `src/v083-weekly.js`, `build.mjs` | Duplicate or skipped monthly charges and weekly results corrupt finances and progression. | Moved the active advance owner into a canonical weekly engine with an ordered month-end hook registry; removed the superseded transition wrapper file; centralized annual tax boundary; retained checkpoint rollback. Existing weekly subsystem hooks and annual awards still live in their owning modules. Full scheduler consolidation remains incomplete. |
| 5 | Long-career numeric and growth validation: `tests/long-career.mjs`, `tests/harness.mjs`, `src/core.js::worldWeek`, `src/v082-polish.js` | Short tests missed AI audiences growing beyond five billion. | Added seeded 1/5/10/20-year scenarios, save round trips, numeric and size bounds; added active/inactive NPC audience decay and diminishing acquisition. Tested largest AI audience falls from 5.06–6.18 billion to 473–492 million at year 20. Broader seeds, strategies, actual historical saves and exploit-focused balance work are still needed. |
| 6 | Real mobile, recovery and offline release acceptance: `dist/index.html`, `src/v090.css`, `src/navigation.js`, `src/save-tools.js`, `server/worker.mjs`, `wrangler.jsonc` | VM regression tests cannot demonstrate usable iPhone controls, service-worker behavior or deployed save safety. | NOT completed. Playwright is installed but no browser executable was present; browser download failed with 502/truncated archive responses. No device pass, Cloudflare preview, public release or deployed-version verification is claimed. |
| 7 | Retire conflicting active generations before 1.0: `build.mjs`, `src/core.js`, `src/career-systems.js`, `src/world-tours.js`, `src/v080*.js` through `src/v090*.js` | Fixes can still be overridden by later layers; touring still has multiple generations. | Partial consolidation delivered for advance ownership and audience marketing. Remaining navigation, touring, portraits, contracts and other overlay ownership require staged equivalence-tested refactors. This candidate does not satisfy the audit's “no multiple active generations” exit criterion. |

### High-value improvements

These materially improve progression, trust or the next roadmap milestone, but should not displace unresolved save and release gates.

| Order | Work and files/systems | Why this tier | Status |
| --- | --- | --- | --- |
| 1 | Audience page ownership and honest growth labels: `src/career-world.js::regionalAudiencePage/regionalGrowthLabel` | Duplicate Career Pulse and fictitious +100% growth mislead the player. | Implemented: dedicated geography screen, NEW / First tracked week, estimated-migration explanation, conserved stream allocation. |
| 2 | Earned executive progression: `src/label-business.js::executiveReadiness/foundLabel` | $25,000 alone made the intended endgame available too early. | Implemented new normal-career gate: five completed years, 250,000 fans, 60 reputation, 12 released songs, $250,000 cash runway and independence. Formation still costs $25,000. Existing owners are grandfathered; sandbox remains unrestricted. These are tunable game-design defaults, not user-approved final balance targets. |
| 3 | Bundle weight and offline artwork: `build.mjs`, `server/worker.mjs`, `public/art/*`, `tests/static-art.mjs` | Embedded image strings inflate JavaScript parsing and the Worker bundle. | Implemented 12 content-addressed static assets in both Worker and static-site output, matching Worker routes and offline manifest. Source artwork is preserved. Byte-identity, routing and manifest tests pass; real-browser offline installation remains unverified. |
| 4 | Explicit certification policy and finance wording: `src/core.js::certificationRules/financeScreen`, `src/save-tools.js`, `tests/foundations.mjs` | Players should understand awards and separate staff costs. | Kept and tested published full-lifetime single carry-in without retroactively revoking awards. Added migration policy metadata. Clarified general overhead versus separately billed staff/agents. |
| 5 | Persistent AI world and chart competition: `src/core.js::worldWeek/widerIndustry/compileSongs`, `src/v082-polish.js`, `src/directory.js` | Existing arcs and damping do not supply retirement, replacement generations or persistent careers behind every chart entry. | Remaining: generational identities, durable history, chart-filler replacement and world-wide balancing. This is a 1.0 vision gate, not completed by numeric damping. |
| 6 | Living World and Touring 2.0: `src/career-world.js`, `src/industry-life.js`, `src/world-tours.js`, `src/career-systems.js`, `src/v081-depth.js` | City demand should drive routes, pricing, risk and aftermath; building it on inconsistent fan totals would amplify errors. | Remaining: one route/show model, demand-based sell-through, openers, rescheduling, local satisfaction, security/logistics, property utility and active-tour migration. Foundation fixes make this the next major system build; existing touring remains playable. |
| 7 | Mature the existing creative/social/business systems: `src/v090-studio.js`, `src/studio-life.js`, `src/social.js`, `src/conversations.js`, `src/negotiations.js`, `src/v090-contracts.js`, `src/label-business.js` | Studio work already exists and should be preserved. Deeper interactions should share audience, time and history contracts. | Preserved latest branch work. Full Music 2.0, PULSE 2.0, multidimensional relationships, richer representation and negotiations remain future roadmap work. |

### Later polish

| Order | Work and files/systems | Why later |
| --- | --- | --- |
| 1 | Fictional portrait cast: `src/v085-unique-portraits.js`, `src/v088-release-experience.js`, `public/portraits/*` | Initials already provide a stable presentation and the development branch already repairs portrait tests. New artwork cannot fix simulation integrity. Keep one identity per person when portraits return. |
| 2 | Group related destinations and refine visual hierarchy: `src/navigation.js`, `src/career-world-navigation.js`, `src/career-world-routing.js`, `src/v090.css` | Reduce navigation friction after system ownership stabilizes. Accessibility defects that block play belong in launch blockers, not this cosmetic tier. |
| 3 | Rich awards presentation, named eras and unified legacy history: `src/career-systems.js`, `src/core.js` chart/achievement records, `src/career-world.js`, `src/v082-polish.js` | Valuable narrative depth, but it must reuse durable history rather than create another parallel log. Basic data preservation is already a launch concern. |
| 4 | More optional wealth, sports and collectible variety: `src/wealth.js`, `src/market.js`, `src/commerce.js`, `src/v081-depth.js` | Existing breadth is sufficient. Freeze expansion until assets have clear music-career utility and the core roadmap is stable. |

## Verification actually performed

`npm test` completed successfully: the 18 existing suites plus foundation, static-art and long-career suites (21 total). `git diff --check` passed.

New targeted checks cover zero/small-audience conservation, estimated migration, bounded audience events, invalid numbers, NEW growth labels, duplicate-page removal, idempotent state migration, future schemas, marketing boost applied once, certification carry-in, new/existing label gates and injected advance failure rollback. The static-art test checks all 12 extracted files against their exact source bytes, Worker routing and generated offline asset manifest.

The long-career suite uses a fixed random seed and deterministic record IDs. It exercises an inactive normal career, a normal career releasing every eight weeks with an explicit $250 test funding injection for each release, and a sandbox career migrated from an unversioned state. Funding injections are test fixtures, not organic earning claims. Each scenario passes 52, 260, 520 and 1,040 advances with save import validation at each milestone.

| Scenario, year 20 | Player fans | Largest AI audience | Serialized save characters | Career streams |
| --- | ---: | ---: | ---: | ---: |
| Inactive normal | 42 | 492,298,167 | 750,104 | 0 |
| Funded release scenario | 572 | 472,599,625 | 961,255 | 606,959 |
| Migrated sandbox | 148,350,563 | 477,042,578 | 811,447 | 20,780,600,607 |

The save-size assertion uses the application's existing 8,000,000-character import budget, not a proof of a browser's storage quota. Fixtures remain under one million characters. Player cash, taxes, catalog value, chart size and regional totals are checked. These scenarios are numeric regression evidence, not proof that every deal, chart-turnover pattern, tour strategy, failure state or historical save is balanced.

Build sizes: generated `dist/game.js` is 1,582,895 bytes and `dist/server/index.js` is 1,711,794 bytes. Twelve embedded images contributed 1,590,028 base64 characters before extraction. The tracked predecessor bundles were 2,931,156 and 3,037,110 bytes respectively, but those tracked bundles lagged some Studio source changes; that comparison is not an isolated asset-only benchmark.

## Active implementation ownership after this change

- Advance orchestration: `weekly-engine.js::advance`; weekly simulation phases: `core.js::advanceWeek`.
- Monthly phase order: `weekly-engine.js::MONTH_END_HOOKS`; annual tax reconciliation: `core.js::closeFinances` using `isAnnualClosing`.
- Audience settlement/mutation: `career-systems.js::settleAudience/applyAudienceEvent`; regional attribution: `career-world.js::reconcileRegionalAudience`.
- Save state versioning: `save-tools.js::migrateSaveState`; transport envelope remains schema 1.
- Marketing: `v086-marketing.js` campaign configuration/billing plus canonical settlement in `career-systems.js`.
- Charts/certifications: `core.js`, with late-entry experience in `v088-release-experience.js`.
- Touring: existing `world-tours.js` and legacy paths in `core.js`/`career-systems.js`; consolidation remains open.
- Awards: career-system and v080-era logic; no new ceremony system claimed.
- Person presentation: final initials resolver in `v088-release-experience.js`.
- Navigation: `navigation.js`, v080 navigation and `career-world-navigation.js`/`career-world-routing.js`; no claim of full navigation consolidation.

## Delivery boundary

This implementation addresses the concrete foundation defects above and preserves the latest Studio branch. It does **not** implement every later roadmap system, complete all launch blockers, merge PR #12, remove Beta, or deploy to production. Calling the full Road to 1.0 complete would be inaccurate. The next release decision should follow remote CI, actual historical-save/device acceptance and preview verification; the next large feature build is the canonical Living World/Touring system on this foundation.
