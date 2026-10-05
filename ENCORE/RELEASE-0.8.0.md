# ENCORE 0.8.0-beta.1 — Career World Expansion

## Release goal

0.8 turns ENCORE’s recovered 0.7.1 systems into a more coherent career-management experience. The update keeps the existing studio, charts, PULSE, labels, wealth and touring foundations while adding stronger navigation, protected opportunities, commercial career scale, awards presentation and outside catalog ownership.

## Delivered

### Navigation, title and guidance
- Retained the revised title presentation and per-save optional onboarding tour.
- Player Guide remains permanently accessible and the tour can be replayed.
- Added persistent Career Inbox access beside Back, Guide and Settings.
- Updated the walkthrough to the current screen structure, including Inbox, Offers Center, Catalog Market and Awards.
- Updated guide topics so old layout directions no longer teach removed or relocated controls.
- Added a player-facing “What’s new in 0.8” entry from the title screen on full browser DOMs.
- Added distinct Inbox and Awards visual themes while preserving the existing section-theme system.

### Career Inbox and missed information
- Added a dedicated Career Inbox for briefings, celebrations and active opportunities.
- Inbox shows unread state and supports pinning.
- Existing achievement briefings remain compatible but are no longer conceptually treated as Achievements.
- Home briefing shortcut now routes to Inbox.
- Monthly recap includes unread Inbox and open-offer counts.

### Offer protection and Offers Center
- Added a dedicated Offers Center with separate categories for labels, media, endorsements, brand deals, partnerships and lifetime partnerships.
- New label offers are protected until the player reviews them.
- Existing active label offers migrate into the protected state.
- Career opportunities and legacy media opportunities remain available until reviewed.
- Once reviewed, an offer receives a real decision window; counteroffers extend that window.
- Monthly advance now warns specifically about reviewed offers that can expire during the upcoming advance.
- Legacy media generation is retained for save/test compatibility but is displayed through Offers Center rather than Merchandise.

### Label and 360 logic
- Preserved label-proposed recording/distribution/360 structures.
- Artist-side negotiations can counter advance, royalty share and term but cannot request a different contract type.
- Player-owned labels can still offer recording, distribution or 360 contracts to roster artists.
- 360 accounting now includes commercial/media income when the negotiated scope is 360.
- Investments, rental income and outside catalog holdings remain excluded from artist-label 360 shares.

### Commercial career scale
- Added a commercial leverage model using true fans, social followers, reputation, Marketability, Charisma, loyalty and awards.
- Added fictional commercial partners for media appearances, endorsements, signature brand campaigns, global partnerships and rare lifetime partnerships.
- Deal ceilings scale from early-career opportunities to elite icon-level headline values:
  - Media: up to $25M
  - Endorsements: up to $350M
  - Brand deals: up to $800M
  - Partnerships: up to $1.5B
  - Rare lifetime partnerships: $250M–$3B
- Large headline deals do not pay the full number instantly. They use signing compensation plus monthly guaranteed installments and potential upside.
- Lifetime offers require exceptional leverage, very large audiences and meaningful awards success.

### ENCORE Honors, milestones and celebrations
- Replaced the single simplified annual award concept with the ENCORE Honors presentation layer.
- Eight annual categories:
  - Record of the Year
  - Song of the Year
  - Album of the Year
  - Artist of the Year
  - Best New Artist
  - Best Collaboration
  - Live Act of the Year
  - Fan Choice
- Player entries compete against artists in the simulated world rather than only crossing a fixed threshold.
- Added dedicated Awards page with yearly ceremony results, nominees and winner history.
- Added dedicated Milestones and Celebrations pages.
- Achievements remain unlockable game challenges and are visually/conceptually separate from industry awards and career history.

### Catalog Market
- Added a rotating marketplace for other artists’ catalogs.
- Buy 10%, 25%, 50% or 100% economic interests, subject to remaining available ownership.
- Holdings receive simulated monthly royalty distributions.
- Catalog values respond to current streams, artist strength, audience tier, long-run career growth and cyclical market variation.
- Values can rise or fall; long careers can still create long-term appreciation.
- Holdings track basis, current value, unrealized gain/loss and cumulative distributions.
- Holdings can be sold at current simulated value with a transaction spread.
- Positive realized gains enter the existing game tax model.
- Outside catalog investments are excluded from label 360 shares.

### Touring scale
- Retained 8–160-show multi-month world tours.
- Added career celebrations/milestones for tour gross crossing $100M, $500M, $1B and $2B.
- Global-icon careers can reach Eras-scale multi-billion-dollar gross only through sufficient audience demand, pricing and capacity.
- Ticket gross remains separate from production, agent/label participation, overhead and taxes.

### Character and product visuals
- Replaced repeated object/mismatched portrait fallback behavior with deterministic stylized fictional person portraits.
- Procedural illustrated portraits vary skin tone, hairstyle, hair color, clothing and background while remaining cohesive and non-photorealistic.
- Staff and artist cards now resolve to people artwork instead of watches/cars/property imagery.
- Expanded merchandise from three to six visual editions per product while preserving old inventory selections.
- Expanded monthly asset rotation to as many as ten image-backed opportunities; the first four are designated limited monthly collector editions.

### Commerce and finances
- Merchandise remains separate from commercial offers.
- Media/commercial income is tracked separately in the finance ledger.
- Finance reporting now exposes commercial/media income and the applicable 360 share.
- Catalog distributions flow through investment income.

### Save compatibility
- Existing 0.7.x saves migrate forward rather than reset.
- Added `v080` career state for Inbox/commercial/catalog/awards data.
- Updated validation to understand protected-until-reviewed label offers and six merch artwork choices.
- Preserved the existing save schema wrapper so old exported careers remain importable through migrations.

## Deep audit findings addressed

1. **Briefings were buried inside Achievements.** Fixed with Career Inbox and dedicated career-history screens.
2. **Monthly pacing could make offer deadlines easy to miss.** Fixed with protected-until-reviewed state and advance warnings.
3. **Label and commercial opportunities were mixed conceptually.** Fixed with Offers Center categories and Merchandise cleanup.
4. **Award recognition was too thin for a superstar career sim.** Expanded to an annual competitive awards presentation.
5. **Career wealth stopped mostly at the player’s own catalog/assets.** Added third-party catalog ownership and distributions.
6. **Human cards had too little portrait variety and could visually mismatch their subject.** Added deterministic stylized people art.
7. **Merchandise visual choice was shallow.** Expanded to six looks while preserving persistence.
8. **Tour scale could mathematically reach very high grosses but lacked career recognition for that achievement.** Added explicit mega-tour milestones through $2B.
9. **Commercial deal values did not match the top end of real superstar branding economics.** Added rare nine- and ten-figure multi-year/lifetime deal tiers tied to actual leverage.
10. **Tutorial guidance drifted behind the UI.** Rebuilt the tour map around the current navigation.
11. **0.7 validators encoded old expiration assumptions.** Updated validation while keeping compatibility tests intact.

## Automated validation

GitHub Actions runs `npm test` on the 0.8 implementation branch and on main after merge. The suite builds the game and executes the pre-existing regression tests plus `tests/v080.mjs`.

Coverage includes:
- sandbox editing and save/reload
- naming/title controls
- player-owned label formation, staff and roster accounting
- label counteroffers, 360 scope and contract expiry
- energy-only pacing
- Empire/commerce compatibility
- market/living-world systems
- onboarding, guide/back navigation and monthly stress testing
- world-tour accounting
- 0.8 protected offer behavior
- icon-level lifetime commercial scale
- catalog buying, distributions and selling
- six-look merchandise persistence
- rotating assets
- ENCORE Honors separation from Achievements
- stylized human portrait generation
- 360 commercial/media accounting

The regression job passed after correcting two compatibility issues found by CI: the legacy label-offer save validator and legacy media-offer generation.

## Remaining beta QA / known limitations

- Automated tests use a mocked DOM and simulation logic; they are not a physical iPhone Safari layout engine.
- Physical touch targets, browser back gestures, on-screen keyboard overlap, screen-reader navigation and animation smoothness still need device testing.
- Commercial deal values are intentionally game-scale approximations, not copies of specific real contracts.
- ENCORE Honors scoring is deterministic enough for simulation but remains a simplified awards model.
- Catalog ownership represents economic participation, not detailed publishing/master legal structures.
- Procedural portraits prioritize cohesive fictional illustration and variety over bespoke hand-authored portraits for every one of thousands of directory artists.
- Public deployment is separate from source merge. A successful GitHub commit is not proof that the Cloudflare production site has deployed the same commit.

## Version

`0.8.0-beta.1`
