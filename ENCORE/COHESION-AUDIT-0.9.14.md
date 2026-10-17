# ENCORE Cohesion Audit — 0.9.14

## North-star rule
Every major player decision should create a visible consequence somewhere else in the simulation. ENCORE should favor fewer, deeper, interconnected systems over a larger number of isolated screens.

For every major mechanic, answer:
1. What causes it?
2. What choices does the player have?
3. What does it cost or risk?
4. What other systems does it affect?
5. How does the player see the result later?

If a mechanic cannot answer most of these, deepen it, merge it into a stronger system, or retire it.

## Save compatibility policy
Legacy save compatibility is no longer a design constraint for the 1.0 cohesion rebuild.

- It is acceptable to introduce a breaking state schema and require a fresh career / fresh sandbox.
- Do not keep duplicate engines, compatibility wrappers, obsolete state or dead UI solely to preserve beta-era saves.
- Before the breaking cutover, keep the currently playable branch recoverable in Git history.
- Sandbox remains the preferred rapid-test path for the new schema.
- Once the new schema becomes authoritative, old imports should fail clearly instead of silently producing partial state.

## Audit findings

### 1. Representation is layered over a separate legacy Agent system — MERGE / RETIRE
The legacy `industry-life.js` agency system still owns separate agent offers, negotiation, commissions, incidents and dismissal. The newer `v100+` Representation stack independently owns Manager, Booking Agent, Business Manager, Attorney, Publicist, A&R, Tour Manager, Social/Marketing and CPA relationships.

Decision:
- Representation becomes the only player-facing representation engine.
- Booking Agent replaces the legacy Agent contract role.
- Useful legacy misconduct concepts become representative conduct / legal-dispute events.
- Remove duplicate legacy commissions, dismissal UI and player-facing agency offers after the new path has parity.

### 2. Contract presentation exists in several generations — CONSOLIDATE
Contract logic currently spans older deal summaries, `v090` rights pages, `v100` document/vault flows and the newer `v108` standard contract reading room.

Decision:
- One authoritative Agreement model.
- One full contract-reading presentation.
- Contract Vault stores immutable executed snapshots.
- All later amendments, terminations, buybacks, settlements and lawsuits reference the executed agreement ID and relevant clause/page.
- Retire older duplicate signing presentations once every formal agreement routes through the standard room.

### 3. Owned-label artists lose too much agency after signing — DEEPEN
Pre-signing roster negotiation already has artist interest, patience, leverage, counteroffers and walk-away behavior. Post-signing contracts are comparatively passive revenue objects until renewal/expiry.

Decision:
Every signed artist receives a continuing label relationship with at least:
- trust
- contract satisfaction
- career momentum
- ownership tension
- leverage
- label support perception

These values must respond to real choices: marketing support, release handling, restrictive rights, royalty split, shelving, denied requests, successful campaigns, missed opportunities and rival interest.

Post-signing actions include:
- renegotiation request
- extension request
- release request
- catalog/master buyback request
- partial-rights purchase
- reversion negotiation
- refusal / counteroffer
- arbitration or lawsuit
- rival-label financed exit / buyout

### 4. Legal consequences are not yet a first-class system — BUILD
Create Legal Affairs / Docket as a permanent consequence engine rather than isolated warning popups.

Each dispute receives a persistent case number and file, e.g. `ENC-CIV-2034-0018`, containing:
- parties
- issue / cause of action
- linked contract and disputed clauses
- filing date
- claim / exposure
- assigned attorney
- legal-strength estimate
- deadlines / procedural stage
- settlement history
- final result

Potential disputes include wrongful termination, unpaid commission, breach of exclusivity, ownership/catalog disputes, missed appearances, defamation/public disputes, licensing/clearance conflicts, label-artist release disputes and contract enforcement.

The docket belongs in Legal Affairs, links into Contract Vault and becomes part of the permanent Artist File / company history.

### 5. Artist competition must remain dangerous at the top — DEEPEN
The world already simulates releases and charts, but player dominance should never turn the industry into a solved state.

Build an authoritative competition layer using:
- breakout velocity
- comeback cycles
- label push
- platform placement
- viral moments
- release-week congestion
- genre shifts
- collaborator effects
- catalog revival
- momentum and audience fatigue

A surprise #1 must be possible at every player tier, but it should remain explainable by underlying signals rather than pure punishment RNG.

Competition should affect release timing, marketing, features, tour demand, award races, label pressure, artist satisfaction and public conversation.

### 6. Business HQ has accumulated multiple wrapper generations — CONSOLIDATE
Business navigation has evolved across several versions. The current focused-lane design is directionally correct, but older directory/wrapper implementations remain under it.

Decision:
- Keep one Business HQ information architecture.
- Legal Affairs, Contracts & Rights, Representation, Finance/Tax and Owned Label become deep departments beneath it.
- Remove obsolete duplicate directory surfaces after routing parity.

### 7. Finance/tax logic contains legacy layers under newer systems — CONSOLIDATE CAREFULLY
Tax Foundation 2.0, attribution and planning are stronger than the earlier tax/finance presentation, but older functions still exist underneath or are overridden later.

Decision:
- Preserve one authoritative money ledger and one tax calculator.
- Keep source-attribution metadata separate from authoritative totals.
- Remove superseded tax-rate implementations after regression parity.
- Legal settlements, catalog buybacks, rep termination costs and label disputes must post through the same ledger.

### 8. Save migrations and historical-compatibility tests are expensive architecture baggage — RETIRE AT BREAKING CUTOVER
The current save layer migrates old state through multiple generations and the regression suite spends substantial time validating historical fixtures and 10–20 year migrated careers.

Decision:
- During the cohesion rebuild, define a new authoritative state schema.
- Fresh career / fresh sandbox become required at cutover.
- Replace broad historical migration tests with new-schema persistence, corruption rejection, long-career integrity and deterministic subsystem tests.
- Keep old code in Git history rather than carrying migration branches forever.

### 9. Two presentation generations remain in the build — DECIDE / CONSOLIDATE
The normal game and explicit UI2 preview routes are both packaged.

Decision:
- Choose one renderer as the 1.0 product surface.
- Do not keep two full presentation stacks indefinitely.
- Any retained renderer must meet interaction parity before the other is removed.

### 10. Weekly/monthly terminology and legacy assumptions need one calendar authority — CONSOLIDATE
Several older systems still use month-oriented language/state while the core loop is weekly.

Decision:
- Week is the authoritative simulation tick.
- Months/years are derived calendar periods, not parallel gameplay clocks.
- Cooldowns and settlements should store week/date references consistently.

## Target 1.0 architecture

### A. Career Event Ledger
Every meaningful action emits a durable event with IDs and links to affected entities.
Examples: signing, firing, release, refusal, renegotiation, lawsuit, settlement, buyback, chart win, rivalry event, team dispute, award, tour cancellation.

### B. Relationship Engine
One relationship framework with context-specific dimensions for:
- artists
- representatives
- signed roster artists
- labels / counterparties

Relationships should retain history and react to events rather than only manual "talk" buttons.

### C. Agreement & Ownership Engine
One source of truth for:
- contracts
- rights
- ownership percentages
- term
- options
- amendments
- buyouts
- catalog value
- reversion / repurchase

### D. Legal / Docket Engine
Disputes reference real agreements and events. Outcomes write back to cash, reputation, ownership, relationships and history.

### E. Living Industry / Competition Engine
AI artists, labels, platforms, charts and public attention create pressure on the player and each other.

### F. Finance Ledger
Every payment, cost, settlement, commission, buyback and judgment enters one authoritative ledger and then feeds recap/tax reporting.

## Immediate implementation order
1. Stabilize 0.9.14 regression suite.
2. Freeze beta-era compatibility as a non-goal for the 1.0 cohesion branch/path.
3. Merge legacy Agent behavior into Representation and retire duplicate player-facing agency mechanics.
4. Define the new Agreement / Ownership data model.
5. Add signed-artist satisfaction, leverage and post-signing negotiation lifecycle.
6. Add Legal Affairs + persistent court docket linked to Contract Vault.
7. Add catalog buyback / partial-rights / release-from-deal negotiations.
8. Upgrade living competition so surprise breakouts and #1 challenges remain credible at every career tier.
9. Consolidate Business HQ, finance/tax wrappers and presentation layers.
10. Cut to the new save schema and remove obsolete migrations/tests.

## Non-negotiable design standard
A feature is not finished because the button works. It is finished when the player's choice changes the world, the world can push back, the consequences can surface later, and the player can understand why it happened.
