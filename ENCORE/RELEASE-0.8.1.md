# ENCORE 0.8.1-beta.1 — Industry Depth & Investment Intelligence

## Release goal

0.8.1 deepens the systems introduced in 0.8 instead of simply adding more menus. The focus is making negotiations readable, player-owned labels meaningful, artists feel active between releases, collaborations more social, wealth decisions more informative, and monthly recaps useful again.

## Delivered

### Contract negotiation interest and risk
- Player-owned label negotiations now expose a live artist-interest score from 0–100.
- Interest responds to advance, royalty share, contract duration, contract type, artist relationship, player reputation and label infrastructure.
- Negotiation screens also show an estimated walk-away risk so the player can judge how aggressively to push terms.
- The indicator is intentionally a risk signal rather than a guaranteed outcome.

### Player-owned label infrastructure
- Added permanent label-wide upgrade tracks for:
  - Studio equipment
  - Marketing
  - Operations & logistics
  - Touring infrastructure
  - Merchandise infrastructure
- Upgrades apply across the active roster rather than to one release only.
- Equipment and marketing strengthen newly released roster material.
- Logistics reduces payroll drag and contributes to artist development.
- Touring and merch infrastructure create additional simulated 360-label income from qualifying artists.

### Roster artist development and project visibility
- Active label artists now receive a roster-intelligence view.
- The label owner can see current project type, project stage and projected release timing.
- Some simulated projects identify collaborations/features instead of every artist appearing to work alone.
- Project titles and collaborators are deterministic within the same project window so the UI does not randomly change every render.
- Signed artists now have development profiles for Writing, Recording, Producing, Charisma, Marketability, Stage, Touring and Viral ability.
- Skills improve organically over time and can also be trained with direct label investment.
- Development affects future work rather than retroactively changing old releases.

### Creative work beyond the player's own records
- Added a Creative Network screen.
- Other artists can request paid ghostwriting sessions.
- Other artists can request paid production sessions.
- Artists can offer the player songs they believe fit the player's career.
- Close relationships can result in gifted songs; otherwise the song can carry an acquisition cost.
- Accepted songs enter Finished Recordings so they can be used as singles or album tracks.
- Added a written-song marketplace with rotating songs that show quality, commercial potential, genre, writer and purchase price.

### Direct messages and collaboration conversations
- Added persistent in-game artist message threads.
- Players can message artists to check in, discuss collaborations, ask about songs/writing, or talk business.
- Artists generate simulated contextual replies based partly on relationship and collaboration access.
- Strong conversations can lead into collaboration opportunities.
- Threads persist in the save and can be reopened from the Creative Network or artist profiles.

### Feature directory and relationship pricing
- Collaboration discovery now separates `Available` artists from `Locked` artists.
- Locked artists display career/reputation/relationship requirements rather than disappearing from discovery.
- Genre filtering and search remain available.
- Inner-circle relationships no longer make a feature literally free by default.
- Very close artists use a small symbolic courtesy price.
- When the relationship qualifies, the player can instead make a simulated donation to a cause supported by the artist.

### Other artists' careers and wealth
- Artist profiles now show a simulated estimated net worth.
- Profiles show current project stage and projected release timing.
- Artists display the kinds of assets/investments they favor.
- Added short simulated wealth perspectives from artists based on those holdings.
- These are fictional gameplay estimates and character dialogue, not real financial advice.

### Album rollout redesign
- Added 8-, 12- and 16-week album-rollout options.
- Removed the obsolete four-week rollout card from the 0.8.1 presentation.
- Players choose campaign name, lead single, duration and campaign scale.
- Longer campaigns move through visible era phases such as announcement, lead-single push, press/content, tour/event tie-ins and album countdown.
- Rollout budget and duration determine sustained reach support; no rollout guarantees a hit.

### Tour take-home forecasting
- World-tour planning now shows more than ticket gross and production cost.
- Forecast includes:
  - Estimated ticket gross
  - Production/show costs
  - Agent commission estimate
  - Label share estimate
  - Career overhead estimate
  - Tax-reserve estimate
  - Projected take-home amount
- Forecasts remain estimates because attendance, contract status and later costs can move before settlement.

### Monthly recap financial breakdown
- Restored a detailed financial section to the monthly Career Report.
- Recap now surfaces royalties, live income, media/commercial income, label-business income, investment income, career expenses, tax reserve, net cash movement and spendable cash.
- Also shows unrealized physical/market assets, outside-catalog positions and sports ownership values separately from cash.

### Physical asset investment intelligence
Cars, watches, jewelry, art and property now expose a clearer purchase profile:
- Purchase price
- Purchase tax
- All-in cost
- Availability
- Simulated annual appreciation/depreciation range
- Trend midpoint
- Volatility/risk classification
- Rental/distribution income where applicable
- Owned assets keep monthly value history for trend display.
- Forecast ranges are not guarantees and values can finish outside the displayed range.

### Securities / exchange intelligence
Fictional stocks, funds, bonds and crypto now show more decision context:
- Sector
- Current price
- Latest percentage change
- Tracked-period percentage change
- Volatility level
- Dividend/distribution information
- Availability/trading status
- Monthly simulated price-history chart
- Existing live tick chart and order mechanics remain intact.

### Catalog investment intelligence
- Catalog Marketplace cards now show annual simulated value range before the player opens the listing.
- Listings show estimated royalty yield separately from resale-value movement.
- Availability reflects how much economic interest remains after the player's existing holdings.
- Purchase review continues to show value forecast, current streams and ownership position.
- Holdings keep payout and valuation history.

### Sports ownership
- Added a fictional Sports Ownership market.
- Eight fictional franchises span basketball, football, baseball and soccer.
- Teams automatically play games every simulated month and progress through full seasons.
- Team rating and season performance affect franchise valuation.
- Players can buy small ownership stakes subject to a 10% maximum allocation in a single team.
- Stake screens show franchise value, record, rating, simulated annual value range and valuation history.
- Holdings receive small simulated distributions and can later be sold for a gain or loss.

### Celebration effects
- Added a lightweight celebration overlay for major milestones and player-owned label signings.
- Confetti-style particles and a milestone label appear without blocking gameplay.
- The effect respects `prefers-reduced-motion`; particle animation is disabled for players requesting reduced motion.

## Validation

0.8.1 extends the existing ENCORE regression suite with `tests/v081.mjs`.

New automated coverage includes:
- 0.8.1 version/build wiring
- physical asset all-in cost and annual value range
- stock sector/volatility/trend intelligence
- Catalog Market annual range and royalty-yield display
- label negotiation interest vs. walk-away risk
- label infrastructure upgrades
- roster artist development
- deterministic roster project information
- artist wealth-tip generation
- creative opportunity generation
- written-song marketplace generation
- Available/Locked collaboration filters
- sports stake purchase and season simulation
- 8/12/16-week rollout availability
- removal of the obsolete four-week rollout card
- tour projected take-home calculation
- celebration-effect safe fallback in non-browser test environments
- save validation after the new state is present

The pre-existing regression suites remain in the same run, including the 24-month save/finance stress test, label/360 tests, Empire systems, exchange, social systems, onboarding, catalogs and world-tour accounting.

## Overall game audit after 0.8.1

### Current strengths
- ENCORE now has a genuine multi-loop career structure rather than a single release-clicker loop: create music, develop skills, build relationships, negotiate contracts, run a label, tour, invest, manage wealth and build legacy.
- Monthly pacing now fits the management layer much better because offers are protected, recaps carry financial context, long projects span multiple months and outside investments evolve while the music career continues.
- The player-owned label has materially more purpose because roster artists can develop, release work, negotiate, message and benefit from infrastructure.
- Wealth systems now communicate risk and return instead of asking the player to buy opaque assets.
- The Career Inbox, Offers Center, Awards/Milestones split and Creative Network reduce the amount of important gameplay hidden behind one-off popups.

### Playability assessment
- The core career is playable as a browser beta and supports long-running saves through automated stress coverage.
- The simulation now has enough independent systems to support multiple play styles: independent artist, superstar performer, label owner, catalog investor, collector/real-estate owner or broader entertainment mogul.
- Decision readability is substantially better than 0.8 because contract risk, tour take-home, asset forecasts and financial recaps expose more of the consequences before the player commits.

### Remaining beta risks / priorities
1. **Physical-device QA remains the largest release risk.** Automated tests use a mocked DOM and are not a substitute for iPhone Safari touch, keyboard, viewport, screen-reader or animation testing.
2. **UI density is increasing.** The game has enough systems that future work should prioritize information hierarchy, search, shortcuts and progressive disclosure before simply adding more tabs.
3. **Economic balance needs long-horizon tuning.** The intentionally arcade-scale $0.50-per-stream economy, billion-dollar deals, catalog ownership, sports stakes and mega-tours can compound into extreme wealth; that is fun, but should be balanced with meaningful costs and diminishing returns.
4. **Several industry systems are aggregates.** Tours are not city-by-city, sports are not possession/play-by-play simulations, catalog ownership abstracts legal master/publishing structures, and NPC projects use simulated stages rather than full independent studio sessions.
5. **Conversation depth is authored simulation, not generative AI.** DMs are useful for gameplay but currently use controlled response logic.
6. **Maintainability debt is growing.** 0.8 and 0.8.1 use compatibility layers to protect saves. Future architecture work should move state transitions, rendering and persistence into clearer modules rather than continue stacking overrides indefinitely.
7. **The standalone bundle remains large** because significant art is embedded for offline use. Online builds would benefit from cacheable external image assets while keeping an offline package available.

## Version

`0.8.1-beta.1`
