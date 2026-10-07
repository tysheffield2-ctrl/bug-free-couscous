# ENCORE — Road to 1.0

_Last updated: October 7, 2026_

This plan is based on `AUDIT-1.0.md`. It does not replace ENCORE’s design vision; it changes the order so future systems are built on stable foundations instead of additional override layers.

## Release philosophy

A release does not need to introduce a completely new button to be meaningful. Many of ENCORE’s future versions should turn prototype systems into their 1.0 forms.

The guiding rule is:

> Preserve player-facing continuity where it helps, replace the underlying system when the current implementation would fight the 1.0 design.

---

# 0.8.8 — Stabilization I

**Goal:** Make the current beta internally consistent before the next major gameplay layer.

### Required

- Temporarily disable all in-game person portraits; use initials tiles everywhere while the cast is reworked.
- Repair portrait/source/test drift so the full test suite represents the final build.
- Remove duplicate Career Pulse rendering from Audience & Markets.
- Replace invalid first-period regional `+100%` growth with `NEW` / first tracked week.
- Correct established-save regional audience migration.
- Define and enforce regional-vs-global audience invariants.
- Fix or explicitly define album certification treatment of pre-album single streams.
- Clean remaining player-facing monthly terminology from the weekly loop.
- Make current release notes, tests and package version describe the same build.

### Architecture

- Document final active implementations for navigation, advancement, audience settlement, touring, marketing, charts, awards and portraits.
- Stop adding new compatibility overlays unless they are temporary migration bridges with a removal plan.

### Exit gate

- Full test suite passes from a clean checkout.
- Existing saves migrate without losing music, money, contracts, regional data or history.
- No known duplicate Career Pulse / routing / portrait presentation bug remains.

---

# 0.8.9 — Stabilization II / Core Consolidation

**Goal:** Give 0.9 a trustworthy simulation foundation.

### Canonical time engine

- One weekly scheduler.
- Explicit weekly, monthly, annual and event-driven settlement hooks.
- Retire runtime string-replacement patches for core time language.

### Audience Engine

- One entry point for fan discovery, conversion, loyalty and churn.
- Streaming, touring, PULSE, showcases, features and city activity submit audience events instead of independently mutating fan totals.
- Regional audience becomes an explainable decomposition/attribution layer of the global audience.

### Long-career testing

Add deterministic simulation tests for:

- 1 year.
- 5 years.
- 10 years.
- 20 years.

Assert sensible ranges for:

- Fans and listeners.
- Weekly/lifetime streams.
- AI artist audiences.
- Cash, taxes and wealth.
- Catalog value.
- Chart cutoffs and turnover.
- Awards.
- Deal values.
- Regional concentration.
- Save size and migration.

### Performance / save budget

- Profile generated `dist/game.js` and Worker bundle.
- Move heavy optional visual payloads out of the gameplay JS path where practical.
- Define a supported save-size budget and compaction rules.

### Progression protection

- Grandfather existing player-owned labels.
- Add executive-readiness gates for founding a new label so the feature functions as an earned late-career system.

---

# 0.9 — Living World + Touring 2.0

**Goal:** Make geography, demand, fame and career momentum change how the player moves through the world.

### Living World

- Permanent Hometown vs strategic Current City.
- Real relocation tradeoffs.
- City-specific producers, artists, studios, media, labels, festivals and brands.
- City scenes rise and fall over long saves.
- Hometown/local loyalty can outlive national cold eras.
- City Status: Unknown → Local Buzz → Hometown Favorite → City Star → City Icon → Cultural Institution.
- AI artists receive hometown/current city/regional identity.
- Regional sentiment can react to major public events and rivalries.

### Touring 2.0

Replace the current tour engines with one canonical system:

- Build routes show-by-show.
- City demand drives venue recommendations.
- Player chooses venue and can deliberately overreach.
- Player-set ticket prices and tiers.
- Local price resistance and sell-through uncertainty.
- Add/remove/upgrade/downgrade/cancel/reschedule shows.
- Real ENCORE artists as openers.
- Player can receive opening-slot offers.
- Crew, security, production, travel and accommodation.
- Owned properties can affect local lodging/privacy.
- Fame Pressure and security risk at high recognition.
- Tour reports with tickets, capacity, gross, expense, net, satisfaction, incidents, PULSE impact and catalog lift.
- Touring can create regional demand, not only consume it.
- Cold-era/comeback tours can rebuild career momentum.

**Core loop:** Regional Demand → Tour Planning → Performance → Satisfaction → PULSE Buzz → Streams → Momentum → Future Demand.

---

# 0.10 — PULSE 2.0 / Influence + Public Life

**Goal:** Turn the existing PULSE foundation into an industry/public-life simulation.

- Verification earned through career progress.
- Influence separate from followers.
- Public figures and celebrity ecosystem.
- Cosigns and public support.
- Social Media Manager integration.
- Strategy/persona choices.
- Virality, crisis management, brand safety and connections.
- Regional/public sentiment where appropriate.
- Automatic staff-supported activity without infinite follower growth.

---

# 0.11 — Relationships + Industry Politics / Feature Requests 2.0

**Goal:** Make ENCORE remember how people treat one another.

- Friendship, Respect, Trust, Rivalry, Jealousy and Chemistry/Competitive Tension.
- Persistent shared history.
- Alliances, camps and industry politics.
- Agent insight into political consequences.
- Relationships affect features, tours, contracts, cosigns, rivalries and opportunities.

### Incoming Feature Requests 2.0

- Song/project context.
- Genre/creative fit.
- Projected quality, streams and chart potential.
- Rollout budget and release date.
- Fee and royalty split.
- Audience overlap.
- Reputation/career consequences.
- Other features.
- Accept / Counter / Decline.
- Agent advice.

---

# 0.12 — Rivalries, Beef + Media Heat

**Goal:** Let competitive relationships become long-running stories instead of one-button relationship penalties.

- Rivalries emerge from comparisons, charts, awards, rejected features, posts, labels, interviews and history.
- Escalation ladder: ignore, social, interview, subliminal, diss, major diss, private resolution, PR de-escalation.
- Diss tracks are real Studio releases.
- AI artists can respond, ignore, escalate or resolve.
- Consequences affect streams, followers, relationships, brands, regional sentiment and momentum.
- Media Heat determines when chatter becomes a broader ENCORE News event.

---

# 0.13 — Music + Release Strategy 2.0

**Goal:** Make records meaningfully different before the stream number appears.

- Genre/subgenre, mood, theme and target audience.
- Commercial vs experimental intent.
- Explicit/clean.
- Producers/songwriters.
- Recording quality, samples, originality/trend-chasing and collaboration chemistry.
- Albums, EPs, mixtapes and collaborations.
- Project concepts, budgets, rollout strategy and cohesion.
- Fan, critic and industry reception separated.
- Sleeper hits, viral revivals and catalog resurgence.
- Release-date competition with persistent AI artists.

---

# 0.14 — Representation + Inner Circle

**Goal:** Evolve the existing Agent and Team systems into people who unlock options and create stories.

- Agent specialties, network, negotiation, career fit, commission, recommendations and poaching.
- Manager, publicist, lawyer, business manager, tour manager, security and social manager.
- Salaries/commissions, loyalty, personalities, specialties and reputation.
- Staff improve, renegotiate, leave or get poached.
- Young/inexpensive representatives can grow with the artist.

---

# 0.15 — Money, Ownership + Power

**Goal:** Give wealth strategic career utility rather than simply adding more purchasable things.

- Endorsement depth and exclusivity.
- Catalog valuation responds to performance, longevity, trends and cultural relevance.
- Buybacks/masters ownership.
- Asset-backed borrowing and debt risk.
- Properties/transportation have touring/privacy/security utility.
- Business ownership opportunities.
- Prepare the executive path for label ownership rather than exposing it as an early-game shortcut.

Freeze unrelated wealth expansion until these integrations are stronger.

---

# 0.16 — Awards Show 2.0 + Career Memory

**Goal:** Make each year feel like a season finale.

- Category-specific award logic using commercial, critical, cultural, touring, momentum, chart and fan data.
- Performances, rehearsals and stage outcomes.
- Rival/media interactions.
- Winner/loser reactions and speech choices.
- Annual recap identifies breakouts, falls, comebacks, defining records, tours and rivalries.
- Career history begins naming eras and major chapters.

---

# 0.17 — Legacy / Executive Endgame

**Goal:** Let the save continue meaningfully after Global Icon status.

- Generational change.
- Mentors/protégés.
- Executive production and cosigns.
- Fully mature player-owned label path.
- Sign/develop artists, negotiate masters, hire staff, fund projects and compete with majors.
- Roster stars can demand changes, flop, leave or succeed elsewhere.
- Artist career can transition naturally into executive gameplay.

Existing beta label owners remain supported; the system is matured rather than deleted and reintroduced.

---

# 0.18 — 1.0 Candidate: Balance + Content

**Goal:** Stop inventing major systems and make the game durable.

- Economy and progression tuning.
- Exploit pass.
- Content repetition pass.
- AI variety.
- Long-save balancing.
- Tutorial/guide accuracy.
- Accessibility.
- Mobile UX.
- Performance and save-size work.

---

# 0.19 — 1.0 Candidate: Release Hardening

**Goal:** Prove ENCORE can leave Beta.

- Clean-install testing.
- Old-save migration matrix.
- 20-year automated careers.
- Primary-flow mobile acceptance.
- Error/recovery testing.
- Offline/online save checks.
- Release notes and version consistency.
- No known Critical issues.
- No unfinished prototype system required to understand the core career loop.

Feature freeze except for fixes required to satisfy the 1.0 exit criteria.

---

# ENCORE 1.0

The Beta badge comes off when the game is cohesive, stable and deep enough to stand as a complete music-career simulation.

1.0 does **not** mean every possible idea has shipped.

It means:

- The simulation survives decades.
- The world changes without waiting for the player.
- Failure creates stories.
- Geography matters.
- Careers have heat, eras, decline and comeback.
- Major systems affect one another.
- Saves migrate safely.
- Mobile play is comfortable.
- The player understands why outcomes happened without being shown every hidden formula.
- ENCORE remembers the career it created with the player.

After 1.0, versions 1.1, 1.2 and beyond can continue adding countries, deeper executive play, new career paths and other expansions without the foundation moving underneath them.
