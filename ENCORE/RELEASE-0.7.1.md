# ENCORE 0.7.1-beta.1 — changes and audit

## Delivered
- Revised title screen with clear create/connect/build themes and a permanent Player Guide.
- Searchable gameplay handbook, replayable tour and practice release. Tour consent is per save: every new career gets its own optional invitation. Existing saves are not repeatedly interrupted.
- Shared Back, Guide and Settings controls across gameplay screens. Back follows visited screens; dialogs close to the underlying screen. Home with no history returns to the title. Browser swipe history and nested dialog history are not implemented.
- Cohesive section palettes for studio, social, charts, business, wealth, exchange and library screens, including light-theme corrections.
- Eight illustrated fictional character portraits assigned consistently to artists, agents and staff. The directory reuses these portraits; 2,500 artists do not have 2,500 unique illustrations.
- Eight merch categories, each with three selectable artwork looks: 24 previews. Selected looks persist on inventory and saves. Artwork choices are cosmetic, not hidden demand modifiers.
- Three additional physical assets: roadster, penthouse and sapphire jewelry. Six limited edition offers rotate each simulated month. Purchases are protected against duplicates and expired confirmations. Purchased assets remain owned after offers expire. Editions reuse the base product image and carry edition metadata and a premium; the resale estimate clearly separates the premium from normal asset value.
- Multi-month world tours: 8–160 shows, clubs through stadiums, custom $10–$600 average tickets, eight shows per month. Fan count, loyalty, performance and engaged social reach affect demand. A 160-show stadium campaign has 10.4 million seats; at $225, capacity is $2.34 billion and the maximum-skill/loyalty example forecasts $2.223 billion before attendance variation.
- Touring tracks production costs, launch deposits, ticket gross and completed shows. Insufficient production funding pauses shows. Cancellation requires confirmation and preserves completed results without refunding paid costs. Gross is not spendable profit: label/agent shares, overhead and game taxes still apply.
- Labels propose the contract structure. Artists can counter advances, shares and duration, accept or decline. Artists cannot switch an offer into a requested 360 deal. Player-owned labels can still propose 360 contracts to their artists.

## Audit findings and fixes
| Finding | Fix | Evidence |
|---|---|---|
| Browser-wide tour flag suppressed help on new careers | Per-save onboarding state with old-save migration | New-save and replay tests |
| Tour targets/cost descriptions lagged the newer studio | Revised selectors and current costs | Full tour traversal without spending resources |
| Navigation and help varied between screens | Shared controls, route history, searchable guide | Back/title/guide path tests and markup inspection |
| Financial adviser no longer affected exchange volatility | Restored reduction to instrument volatility; market-wide shocks remain | Code inspection plus existing exchange regression suite |
| Monthly posts could still receive hidden-week inactivity losses | Evaluate inactivity only at month close against that month's posts | Monthly social regression |
| Paid promotion applied to one week of a monthly turn | Match campaign activity across the calendar month | Month-boundary campaign regression |
| Limited offers could become stale while a dialog stayed open | Validate current month, ownership and price source at confirmation | Expired/duplicate offer tests |
| New visual/tour state needed save validation | Added validation for artwork, collection and tour fields | Valid save roundtrips and invalid import rejection |
| Artist-side contract UI offered an inappropriate 360 request | Label-proposed structure locked; financial counters remain editable | Counter rejection without energy charge; own-label options retained |

## Validation performed
Seven Node/VM test suites pass after rebuilding. Coverage includes sandbox editing, save/reload, imports, naming diversity, keyboard title dial, contracts and payroll, energy, monthly calendar, six features, social conversations, fractional trades/FIFO gains, limit orders, agency negotiation, assets/rentals, chart alerts, onboarding, collection rotation and world tours. A 24-month sandbox simulation validates finance/save state after every month and reaches internal week 105. Tests use a mocked DOM, not a browser layout engine.

The generated character and product images were visually inspected. Physical iPhone Safari, screen-reader behavior, on-screen keyboard layout, animation smoothness and real network timings have NOT been verified here. Cloudflare deployment must be checked independently after GitHub receives this build.

## Remaining issues and priorities
1. **Beta device check:** use a fresh normal career and an existing imported career on iPhone Safari. Test title/continue, optional tour, every Back control, dialogs with keyboard open, offline recovery and a monthly advance. Export a backup first.
2. **Economy calibration:** $0.50 per stream remains the requested arcade payout. It produces wealth far faster than a real industry model. Tour forecasts can reach billions at exceptional fan scales, but gross and retained income must remain visibly distinct. Run player balance sessions before changing payout rates.
3. **Tour realism:** this is an aggregate demand model, not city-by-city ticket inventory. Travel/rest logistics, refunds, regional saturation and individual venue bookings are future improvements. Tours currently run eight shows each simulated month.
4. **Art variety and delivery:** eight shared portraits are a first cohesive cast. Limited editions currently reuse base asset artwork. Expand both libraries next. Embedded art enables the standalone build but increases initial download size; the game script is about 2.93 MB uncompressed. Separate cacheable art would improve online loading, with an offline bundling path retained.
5. **Simulation depth:** PULSE replies are authored simulated responses, not open-ended AI conversations. Large properties use aggregate tenancy. Financial/tax/advance models are simplified game rules, not real-world accounting. The large artist directory is broader than the initially active NPC release population.
6. **Maintainability:** shared mutable state, HTML strings and global handlers make cross-system regressions easier. Gradually separate state transitions, UI rendering and persistence; preserve migration tests while doing so.
7. **Accessibility and usability:** actual assistive-technology and touch testing is still needed. After a small beta, prioritize the screens players struggle to find before adding more systems.

This is a source and simulation audit with regression fixes, not a penetration test or a claim of complete device QA. No existing career is intentionally reset by this release.
