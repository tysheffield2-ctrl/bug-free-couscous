# ENCORE 0.8 — Full Implementation Blueprint

Status: implementation specification
Target version: `0.8.0-beta.1`
Recovered baseline: commit `4188d6da3af605a5d50e982076a39938add31d8a`
Purpose: convert the recovered 0.7.1 work and the full requested change list into one buildable, testable 0.8 release without resetting existing careers.

---

## 1. Product goal

ENCORE 0.8 should feel less like a collection of separate menus and more like a living music-career world. The player should always know where they are, how to go back, where missed information lives, what kind of offer they are looking at, and why their level of fame changes the scale of opportunities available to them.

The release must preserve the systems already delivered in the recovered checkpoint: revised title presentation, permanent guide, per-save optional tour, route history, shared Back controls, themed sections, illustrated fictional cast, merchandise artwork choices, rotating limited collections, world tours, and label-proposed contract structures.

0.8 adds the missing career-management layer around those systems: a proper inbox/briefing hub, separate commercial and label deal categories, awards and career-history presentation, realistic superstar-scale deal ceilings, investable third-party artist catalogs, review-safe offer expiration, deeper visual variety, updated guidance copy, and the technical cleanup needed to keep all of it maintainable.

---

## 2. Non-negotiable player rules

1. Every normal gameplay screen must provide a visible Back control or Back arrow.
2. Every new save must be offered an optional tour exactly once. The Player Guide must remain available forever.
3. A player must never lose an offer merely because a monthly advance happened before they opened it.
4. Achievements, awards, milestones, celebrations, briefings, label offers, and commercial offers must be visually and conceptually separate.
5. A 360 deal is proposed by a label. The player, while acting as an artist, cannot request that the label turn another offer into a 360 deal. The player may offer a 360 deal only when acting as the owner of their own label and negotiating with another artist.
6. Staff and artist portraits must always be person artwork. Never use cars, watches, houses, jewelry, or generic product images as human portraits.
7. Merch and purchasable assets must have images. The player must have meaningful visual choices, not a single repeated image.
8. Fans, followers, engagement, performance, awards, and legacy must materially affect the size of tours, endorsements, commercial offers, and catalog values.
9. Elite careers must be capable of producing billion-dollar-scale opportunities, rare lifetime deals, and multi-billion-dollar live eras. These are top-end outliers, not ordinary outcomes.
10. Existing saves must migrate forward. No 0.7.x career should be intentionally reset.

---

## 3. Versioning and release identity

### Required version changes

- Change `ENCORE/package.json` from `0.7.1-beta.1` to `0.8.0-beta.1`.
- Add `RELEASE-0.8.0.md`.
- Add a short 0.8 section to `README.md`.
- Update any `GAME_VERSION` or title-screen version string so the visible build identifies itself as 0.8 beta.
- Keep migration support for older saves.

### Release identity

Use `ENCORE 0.8` in player-facing copy. Internally use schema/version fields rather than relying on package version strings for migrations.

---

## 4. Title screen

The recovered title screen is the base. Do not throw it away. Refine it into a clearer 0.8 entry point.

### Required layout

- ENCORE logo/title.
- `BETA 0.8` build marker.
- Atmospheric backstage/stage art.
- Primary action: `Continue career` when a save exists, otherwise `Start career`.
- Secondary action: `Player Guide`.
- Secondary action: `What's new in 0.8`.
- Existing `Start a new career` action when applicable.
- Existing beta/feedback access.
- Small persistent note: `New careers are offered an optional guided tour. The Player Guide is always available.`

### Behavior

- Starting a fresh career should complete artist creation first, then offer the tour.
- Declining the tour should mark that save's onboarding as seen.
- A later `Start guided tour` button in the Guide must always replay it.
- The title screen must never depend on a browser-global tour flag to suppress onboarding for a different career.

---

## 5. Navigation: universal Back, Guide, Inbox, Settings

The existing route-trail behavior should remain the base.

### Persistent gameplay header tools

Every screen created with the common page header must expose:

- `← Back`
- section identity
- `Guide`
- `Inbox` with unread count
- `Settings`

Recommended layout:

`← Back     SECTION NAME     Guide   Inbox 3   Settings`

### Back behavior priority

1. If a guided tour is active, Back moves to the previous tour step.
2. If a modal is open, Back closes the modal or returns to the parent modal when one exists.
3. Otherwise Back returns to the previous ENCORE route snapshot.
4. If no prior route exists and the player is not on Home, Back returns Home.
5. If Home has no history, Back returns to the title screen.

### Modal requirements

Any modal that leads to another modal or screen must provide an explicit Back or Close action. Do not rely only on tapping outside the dialog.

### iPhone behavior

- Minimum interactive target: 44px.
- Respect safe-area insets.
- Header tools may horizontally scroll on very narrow screens, but Back and Inbox must remain visible first.

---

## 6. Screen themes

Keep a shared layout system, but give major destinations distinct atmospheres through CSS variables rather than one-off hardcoded styles.

### Theme families

- Home / Backstage: warm charcoal, amber, backstage-gold accents.
- Studio / Releases / Touring: violet, indigo, creative neon.
- PULSE / Social / Location: teal, cyan, electric blue.
- Charts / Certifications: amber, cream, ink.
- Business / Labels / Offers: navy, steel, restrained blue.
- Wealth / Assets / Properties: emerald, deep green, black.
- Exchange / Catalog Market: dark teal, market green, cool neutral.
- Awards / Legacy: burgundy, black, gold.
- Inbox / Briefings: dark navy, parchment/cream content panels.
- Guide / Menu / Saves: neutral slate.

### Implementation

Extend `screenFamily()` to include the new destinations. Add new CSS theme classes rather than duplicating component CSS.

New destinations:

- `Inbox` → inbox theme.
- `Awards` / `Legacy` → awards theme.
- `Offers` → business theme.
- `Catalog Market` → exchange/wealth theme.

All content panels must retain readable opaque or high-contrast surfaces. Background art must never reduce text readability.

---

## 7. Permanent guide and optional tour

The recovered guide is the correct base, but all instructions must be audited against 0.8 navigation.

### Guide must cover

- starting a career
- energy and monthly pacing
- studio/song creation
- features/albums
- stats/training
- charts/certifications
- PULSE/social
- locations
- label deals
- commercial offers
- agents/staff
- catalog investing
- market/wealth
- world tours
- merchandise
- properties/assets
- awards/milestones
- inbox/briefings
- saves/recovery
- navigation
- sandbox

### Tour updates

Add tour steps for:

- Inbox
- Offers Center
- Awards/Legacy
- Catalog Market

Remove or rewrite any selector or direction that references an old screen name or old button location.

### Prevent stale instructions

Create one route metadata registry in `navigation.js`, for example:

```js
const destinationMeta = {
  Labels: {section:'Career', tab:'Labels', label:'Career → Labels'},
  Offers: {section:'Career', tab:'Offers', label:'Career → Offers'},
  Inbox: {section:'Career', tab:'Inbox', label:'Career → Inbox'},
  Awards: {section:'Career', tab:'Awards', label:'Career → Awards'},
  CatalogMarket: {section:'Career', tab:'CatalogMarket', label:'Career → Catalog Market'}
};
```

Guide copy, briefing buttons, and tutorial directions should call a helper such as `destinationLabel('Offers')` instead of embedding old route text in dozens of strings.

### Regression test

Render each tour step in the mocked DOM and assert that its target selector exists. Also scan guide/briefing strings for retired route names.

---

## 8. Career Inbox: missed briefings must be easy to recover

Briefings are currently stored under achievements. 0.8 must separate them.

### New state

```js
s.careerHub = {
  version: 1,
  items: [],
  pinned: [],
  lastOpenedWeek: 0
};
```

Each item:

```js
{
  id,
  type,              // briefing | celebration | news | offer | warning
  title,
  body,
  detail,
  week,
  read: false,
  pinned: false,
  route: null,       // optional destination key
  entityId: null     // optional offer/release/etc id
}
```

### Migration

On first 0.8 load:

- Copy existing `s.achievements.briefings` into `s.careerHub.items`.
- Preserve IDs, week, body, detail, and read state.
- Do not delete unlocked achievements.
- After migration, new briefings are written only to `careerHub`.

### Inbox UI

Create `Career → Inbox` with tabs:

- Unread
- All
- Briefings
- Celebrations
- Offers
- News

Each row shows:

- type
- simulated date/week
- title
- NEW badge if unread
- pinned badge if saved
- `Open`

Detail view actions:

- `Go to related screen`
- `Pin / Unpin`
- `Mark read / Mark unread`
- `Close`

### Pop-up behavior

When a new briefing popup appears, give the player:

- `Review now`
- `Later`
- `Mark read`

`Later` keeps the item unread and closes the popup.

### Persistent access

- Add Inbox button with unread badge to the common navigation header.
- Add an Inbox/Briefings card on Home.
- Monthly recap should state how many unread items remain and provide an `Open Inbox` button.

### Retention

Keep at least 250 lightweight items. For very old large reports, archive long body detail while retaining title, date, type, summary, and destination.

---

## 9. Achievements must be separate from career recognition

`Achievements` should represent game-system goals only: unlock conditions, progress bars, and permanent completion records.

Remove the briefing archive from the Achievements screen.

Achievements must not be used as the primary place for:

- awards
- certifications
- chart breakthroughs
- contract milestones
- tour celebrations
- career milestones
- offer notifications

Those belong in Awards/Legacy, Certifications, Inbox, or Offers.

---

## 10. Legacy, Awards, Celebrations, and Milestones

Create a dedicated career-recognition destination separate from Achievements.

### Recommended navigation

`Career → Legacy`

Sub-tabs:

- Awards
- Milestones
- Celebrations

### Milestones

Use the existing `s.expansion.timeline` as the migration base.

Examples:

- first release
- first chart entry
- first certification
- first #1
- first million fans
- first major-label signing
- own-label founding
- first arena/stadium show
- first $100M tour
- first $1B tour
- first award nomination
- first award win
- first catalog acquisition
- first $1B net-worth estimate

Milestones are chronological career history, not challenges.

### Celebrations

Store notable one-time moments separately or tag legacy events as celebration-worthy:

- chart debut
- late chart entry
- certification
- tour completion
- award nomination
- award win
- signature/lifetime deal
- fan-tier breakthrough
- catalog investment milestone

A celebration can appear as a popup and still remain permanently viewable in Legacy.

---

## 11. Awards show system

Replace the current one-category annual award check with a true awards-season system.

### Event name

Use `The ENCORE Honors` as the initial fictional awards brand.

### Categories

At minimum:

1. Record of the Year
2. Song of the Year
3. Album of the Year
4. Artist of the Year
5. Best New Artist
6. Best Collaboration
7. Live Act of the Year
8. Fan Choice

### Season data

```js
s.awards = {
  version: 1,
  seasons: [],
  nominations: 0,
  wins: 0,
  categoryWins: {}
};
```

A season:

```js
{
  year,
  week,
  categories: [
    {
      id,
      name,
      nominees: [{kind, artistId, releaseId, name, artist, score, player}],
      winnerIndex
    }
  ]
}
```

### Scoring principles

Awards must consider different signals depending on category.

Record of the Year:
- recording quality
- chart performance
- total streams
- staying power
- cultural impact proxy

Song of the Year:
- writing quality
- song quality
- chart performance
- listener reach

Album of the Year:
- album cohesion
- aggregate track performance
- average quality
- chart performance
- longevity

Artist of the Year:
- annual streams
- fan growth
- charts
- touring
- awards momentum
- social engagement

Best New Artist:
- early-career status
- breakthrough growth
- first major chart success

Best Collaboration:
- feature count/quality
- collaboration release performance

Live Act:
- tour tickets
- live gross
- stage presence
- tour completion

Fan Choice:
- fans
- followers
- engagement
- recent momentum

### Nominees

Generate a believable field of player and NPC artists. Do not award the player simply because the score threshold was met. The player competes against ranked nominees.

### Awards screen mockup specification

Hero:

`THE ENCORE HONORS · YEAR 4`

Large stage/banner art, gold/burgundy lighting, current season status.

Below hero:

- `Your night`: nominations, wins, performance invite if any.
- category cards with nominee portraits/artwork.
- winner reveal state.
- `Your trophy case` with lifetime totals.
- `Awards history` by year.

### Award-show flow

At year end:

1. Create nominees.
2. Add an Inbox item announcing nominations.
3. Let the player open the Awards screen before or after the reveal.
4. Resolve winners during the awards event.
5. Show winner celebration popup(s).
6. Persist every nomination and win permanently.

### Career effects

Awards may provide moderate boosts to:

- reputation
- marketability XP
- fan growth
- commercial-offer value
- label leverage
- catalog valuation

Do not let award bonuses create uncontrolled exponential growth by themselves.

---

## 12. Offers Center: separate label, media, endorsements, and brands

Create `Career → Offers`.

### Tabs

- Label
- Media
- Endorsements
- Brand Deals
- Partnerships
- Live / Appearances
- Archived

Do not mix a recording contract with a media interview or sneaker-style lifetime partnership.

### Offer lifecycle helper

All offer types should use shared lifecycle semantics:

```js
{
  id,
  category,
  createdWeek,
  createdMonth,
  reviewedWeek: null,
  reviewedMonth: null,
  expiresMonth: null,
  status: 'open', // open | accepted | declined | expired | countered
  pinned: false
}
```

### Critical expiration rule

An unread/unreviewed offer does not expire.

On the first full review:

- set `reviewedWeek` and `reviewedMonth`;
- set `expiresMonth` to at least one full future monthly advance after the current month.

Recommended rule:

```js
expiresMonth = s.empire.month + 2;
```

This guarantees the player can review it now and still has at least the next month to act.

A counteroffer resets or extends the deadline by one month.

### Monthly advance behavior

Before advancing:

- never expire unread offers;
- detect reviewed offers that would expire during this advance;
- show a warning count and direct `Review expiring offers` button;
- allow the player to continue if they choose.

The old warning `some can expire during the month` must be replaced with precise information.

### Labels

Existing label offers remain sourced from label scouting/demo logic, but use the shared lifecycle helpers.

The Labels page remains the deep negotiation destination. The Offers Center provides a categorized overview and routes into the correct negotiation.

---

## 13. Label-deal logic

Keep the recovered 360 correction.

### Artist-side rule

When a label approaches the player:

- label chooses the proposed type: recording, distribution, or 360;
- player may counter advance, split, and duration;
- player cannot change the contract type in the counteroffer form;
- player may accept, counter, save for later, or decline.

### Player-owned-label rule

When the player owns a label and approaches an NPC artist:

- player may choose recording, distribution, or 360 when presenting the offer;
- artist asking price changes based on structure, share, term, relationship, and reputation.

### 360 accounting consistency

Fix the mismatch between UI copy and accounting.

A 360 contract should apply the negotiated label percentage to applicable artist career income:

- streaming/music
- album sales
- touring/live
- merchandise
- media income
- endorsement/brand income when the contract explicitly covers it

Investments must remain excluded:

- stocks
- bonds
- crypto-like fictional instruments
- real-estate gains
- third-party catalog investments

The contract review screen must list the exact income scope before signing.

---

## 14. Commercial deal engine

Create a new module, suggested name: `src/commercial-deals.js`.

### Deal categories

#### Media
Examples:
- interview
- documentary appearance
- streaming special
- host/guest appearance
- performance special
- magazine/editorial feature

#### Endorsements
Examples:
- apparel
- footwear
- beverage
- audio gear
- technology
- gaming
- beauty
- automotive
- luxury

#### Brand deals / partnerships
Examples:
- campaign
- global ambassador
- signature product line
- co-branded collection
- equity-style partnership
- long-term exclusive partnership
- lifetime partnership

All brands must be fictional unless separately licensed; use generated brand names.

### Commercial power score

Create a normalized 0–100 `commercialPower()` driven by:

- 30% fans / true-fan reach
- 20% social followers
- 15% engagement
- 15% recent career performance
- 10% marketability
- 10% legacy / awards / longevity

Use logarithmic normalization for raw audience sizes so growth from 1,000 to 100,000 matters, but 100M does not mathematically dwarf every other factor.

### Recent performance component

Include:

- recent chart peaks
- annual streams
- fan growth
- current era/release momentum
- recent tour performance

### Deal-value tiers

Values are game ranges, not guaranteed real-world equivalents.

- Local/emerging: $10K–$500K
- Breakout: $250K–$5M
- Star: $1M–$50M
- Superstar: $10M–$250M
- Global icon: $50M–$1.5B
- Rare lifetime/icon partnership: $250M–$3B total headline value

Billion-dollar deals must require elite influence and be rare.

### Lifetime deal eligibility

Suggested minimums:

- Global icon tier or near it
- commercialPower >= 92
- very high marketability
- major fan and follower scale
- multiple strong seasons or major awards
- no severe current reputation penalty

Lifetime offers should not occur early in a career because of one viral hit.

### Deal structure

An offer may contain:

- signing payment
- guaranteed total value
- monthly or annual installments
- performance bonuses
- royalty percentage
- exclusivity category
- campaign obligations
- term in months/years or `lifetime`

A billion-dollar headline offer should not necessarily deposit $1B instantly. Use scheduled guarantees and bonuses so career cash flow remains playable.

### Conflict rules

Exclusive deals can block overlapping offers in the same product category. The review screen must say this before signing.

### Income and tax

Only payments actually received should enter taxable income in that period. Do not tax the entire announced value at signing if it has not been paid.

---

## 15. Tour scale: fans and followers must matter at superstar levels

The existing world-tour system already supports 160 stadium shows and multi-billion gross capacity. Preserve that scale but improve demand modeling.

### Demand model goals

- followers are awareness, not guaranteed ticket buyers;
- fans convert better than followers;
- loyalty and stage presence meaningfully change repeat attendance;
- current era momentum matters;
- price still creates elasticity;
- venue capacity remains the hard upper bound.

### Suggested attendance pool

Use attendance opportunities rather than assuming every fan attends exactly once.

Conceptually:

```js
fanAttendanceRate = 0.06 + loyalty * 0.003 + stagePresence * 0.0015;
engagedFollowerAttendanceRate = 0.005 + engagementScore * 0.0008;
repeatAttendance = 1 + loyalty/250 + touringSkill/300;
rawDemand = (fans * fanAttendanceRate + engagedFollowers * engagedFollowerAttendanceRate) * repeatAttendance;
```

Then apply:

- ticket-price elasticity
- era/release momentum
- award momentum
- marketability
- show-count saturation
- random variance

Finally cap at total seats.

### Scale target

A true global icon with approximately 100M+ fans, elite loyalty, strong performance skills, massive engaged social reach, a hot era, stadium scale, and a large show count should be capable of approximately $1B–$2B+ ticket gross when capacity and price support it.

That should be earned through audience scale and demand, not manually forced by a revenue multiplier.

### Milestones

Add live milestones for:

- $100M tour gross
- $500M tour gross
- $1B tour gross
- $2B tour gross
- 1M tickets
- 5M tickets
- 10M tickets

### Revenue clarity

Every tour screen must distinguish:

- ticket gross
- production
- promoter/venue overhead if modeled
- agent commission
- label/360 share
- tax reserve
- estimated retained income

Never label gross as profit.

---

## 16. Artist and staff portraits

The recovered build uses an illustrated cast atlas. Expand it.

### Art direction

Use a clearly stylized fictional aesthetic, for example:

- hand-painted editorial illustration
- graphic novel portrait
- tasteful pixel-art portrait
- cel-shaded music-magazine art

Do not use hyper-real generated human photography as the default. The goal is a deliberate game-art identity, not a fake photo database.

### Variety target

Increase from the small shared cast to at least 24–32 fictional character portraits in 0.8.

### Assignment

Use stable deterministic assignment by artist/staff identity so portraits do not change between sessions.

Specific named staff may have explicit portrait IDs; everyone else uses a stable hash.

### Hard rule

Every person component calls `personPhoto()` or a successor. Asset/product image helpers must never be used by person cards.

### Roles

Portraits should be used for:

- artists
- agents
- label staff
- managers
- A&R staff
- advisors
- commercial brand contacts where shown
- award nominees

---

## 17. Merchandise visual system

The recovered build has 8 categories × 3 looks. Expand it.

### 0.8 target

- Keep the 8 merchandise product categories.
- Increase to at least 6 permanent visual designs per product where asset size permits.
- Add rotating seasonal/limited visual editions.
- A release screen should show image thumbnails, not just names.

Potential design families:

- black/gold soundwave
- ivory/cobalt geometry
- burgundy botanical
- monochrome tour typography
- neon/night-city
- vintage washed graphic
- limited seasonal visual

### Important image rule

Generated image artwork should not be relied on for readable product text. Product name, price, edition, rarity, and release information are rendered by the UI.

### Gameplay

Visual selection is cosmetic unless a future system explicitly labels a collection as premium/limited. Do not secretly alter demand because the player happened to select a particular colorway.

### Persistence

Store selected visual ID on each merch batch so old inventory does not visually change when new art rotates in.

---

## 18. Asset marketplace and rotating limited drops

Expand the current monthly limited collection.

### Inventory target

Build a larger visual library across:

- cars
- jewelry
- watches
- homes
- condos/penthouses
- art
- collectibles
- luxury travel/transport items if supported
- income-producing property

Every purchasable physical asset must have a proper image.

### Rotation

Each simulated month:

- show 8–12 rotating standard opportunities;
- show 2–4 limited or collector editions;
- clearly mark expiration at next month advance;
- owned items remain owned forever unless sold.

### Variety

Avoid showing the same exact six products in a predictable loop. Seed rotation from month + career identity + item pool, while keeping deterministic results for save/reload.

### Limited editions

Limited editions may:

- cost a premium
- have unique edition metadata
- have different resale volatility

They must not guarantee appreciation.

---

## 19. Third-party artist catalog marketplace

Create a new module: suggested `src/catalog-market.js`.

The player should be able to buy, hold, collect royalties from, and sell economic interests in other artists' music catalogs.

### New state

```js
s.catalogMarket = {
  version: 1,
  holdings: [],
  listings: [],
  history: [],
  nextId: 1,
  lastRefreshMonth: -1
};
```

### Holding

```js
{
  id,
  artistId,
  share,              // 0.10, 0.25, 0.50, or 1.00
  acquiredWeek,
  basis,
  currentValue,
  cumulativePayouts,
  lastPayoutWeek,
  history: []
}
```

### Listings

Offer economic shares of NPC artist catalogs, not ownership of the NPC themselves.

Recommended share sizes:

- 10%
- 25%
- 50%
- 100%

A listing card shows:

- artist portrait
- artist name/genre
- audience tier
- catalog size
- trailing simulated streams
- estimated annual royalties
- asking price
- share offered
- volatility/risk descriptor
- recent trend

### Base valuation

Use the game's internal royalty rate consistently.

Concept:

```js
annualRoyaltyRunRate = trailingWeeklyStreams * PAY_PER_STREAM * 52;
qualityLegacyMultiple = 1.5 to 4.0;
baseCatalogValue = annualRoyaltyRunRate * qualityLegacyMultiple;
```

Adjust multiple for:

- artist skill
- catalog age
- catalog depth
- chart/legacy strength
- volatility
- recent trend
- award momentum

### Monthly revaluation

Catalog values can rise or fall.

Inputs:

- actual NPC stream trend
- artist fan trend
- new releases
- viral/chart resurgence
- awards
- inactivity
- market sentiment shock
- long-run legacy drift

The model may have a mild positive long-run drift for established catalogs, but there is no guaranteed appreciation.

### Royalties while holding

At each monthly advance:

- calculate the owned share of actual simulated catalog royalties;
- deposit the payout into player cash;
- record it as investment/catalog income;
- add it to cumulative payouts;
- show it in the monthly financial recap.

### Selling

Player may sell a holding at the current market bid.

- Show current value.
- Show basis.
- Show unrealized gain/loss.
- Show expected sale proceeds after fee.
- On sale, record realized gain/loss for tax rules.

### Taxes and 360 deals

Third-party catalog investment income is investment income and is excluded from the player's 360 label share.

### Risk events

Possible catalog movements:

- viral resurgence
- new album boosts back catalog
- award/cultural moment
- long inactivity
- reputation issue
- genre revival
- market-wide rights repricing

Events should affect value and payouts through actual model variables, not arbitrary giant cash bonuses.

### UI navigation

`Career → Catalog Market`

Tabs:

- Marketplace
- My Holdings
- Payout History
- Valuation History

---

## 20. Financial scale and number presentation

The game already supports compact billion/trillion labels. Preserve that.

### Rules

- Use full currency in confirmations where precision matters.
- Use compact labels in dashboards.
- Show headline deal value separately from cash paid today.
- Show gross separately from retained income.
- Use BigInt-backed wallet behavior for cash where already supported.
- Validate that all new deal values remain within safe integer/cents handling.

### Superstar economy

Do not artificially cap a successful global career at small-business numbers. Top-end careers can generate:

- billion-dollar tour gross
- nine-figure annual royalties
- nine-figure catalog valuations
- nine-figure endorsements
- rare billion-dollar/lifetime commercial relationships

The difficulty should come from becoming that influential, not from a hard-coded ceiling that ignores scale.

---

## 21. Monthly advance: safer and clearer

Rewrite the month-close confirmation.

### Before closing

Show:

- number of chart weeks being resolved
- energy reset warning
- active tour status
- unread Inbox count
- unread Offers count
- reviewed offers that will actually expire during the advance

Buttons:

- `Keep playing`
- `Review Inbox`
- `Review expiring offers` when relevant
- `Advance month`

### After closing

Monthly recap should include:

- streams
- fan change
- cash change
- royalties
- live income
- merchandise
- label income/cuts
- commercial deal payments
- catalog-investment payouts
- asset/property income
- tax reserve
- major milestones
- awards/celebrations
- unread Inbox count

---

## 22. Deep analysis findings that should be fixed as part of 0.8

### A. Information architecture is too mixed

Current briefings live under Achievements and label/business opportunities live in multiple locations. 0.8 fixes this with Inbox, Offers, Legacy, and Catalog Market destinations.

### B. Offer expiration is incompatible with monthly pacing

Several systems still use week-based expiration. 0.8 moves player-facing offers to review-based month deadlines.

### C. Hardcoded navigation copy becomes stale

Centralize route labels and use them across guide, tour, briefings, and buttons.

### D. Art is too heavily embedded in JS

Large base64 image payloads increase game script size and make iteration harder.

0.8 delivery recommendation:

- keep source WebP assets in `/assets/`;
- reference files by path in browser builds;
- cache them for offline support through the worker/service-worker layer;
- lazy-load portraits/product art where practical;
- retain a standalone/offline bundling path if required.

### E. Shared mutable global state increases regression risk

New 0.8 systems should be modular:

- `commercial-deals.js`
- `catalog-market.js`
- `awards.js`
- `career-hub.js`

Each module should own migration, rendering helpers, settlement hooks, and validation rather than expanding `core.js` further.

### F. Accessibility/touch QA is still required

Test on real iPhone Safari for:

- sticky header tools
- safe-area spacing
- modal keyboard behavior
- horizontal chips/tabs
- tour overlays
- Back behavior
- large currency labels
- image loading

### G. Monthly settlement order must be explicit

Recommended order:

1. preflight backup
2. reviewed-offer deadline warning
3. asset/property settlement
4. catalog-investment payout/revaluation
5. active commercial-deal payments
6. live-tour settlement
7. merchandise/commerce settlement
8. chart weeks / music income
9. label shares
10. tax reserve
11. awards/year-end events when applicable
12. milestone/briefing creation
13. save validation
14. recap

Document the exact implemented order in code comments/tests so new systems do not double-count income.

---

## 23. Recommended file-level changes

### Existing files

`package.json`
- version → `0.8.0-beta.1`
- add new test suites.

`build.mjs`
- include new modules in dependency-safe order.

`src/guidance.js`
- Inbox button in shared tools.
- new screen families.
- updated guide topics.
- updated tour steps.
- remove stale directions.

`src/navigation.js`
- destination registry.
- new routes: Inbox, Offers, Awards/Legacy, Catalog Market.
- searchable menu entries.

`src/presentation.css`
- theme families for inbox/awards/catalog/offers.
- notification badge.
- awards stage layout.
- catalog cards.
- offer tabs/cards.
- mobile safe-area fixes.

`src/core.js`
- stop storing new briefings under achievements.
- update monthly recap hooks.
- keep Achievements challenge-only.
- route certification/chart celebration items to Career Hub.

`src/career-systems.js`
- migrate simple annual award logic to `awards.js`.
- route milestone storage/display to Legacy.
- update opportunity lifecycle to review-safe expiration.

`src/negotiations.js`
- convert label offer deadline checks to shared lifecycle helpers.
- retain label-controlled contract type.
- add `Save for later`/review state.

`src/label-business.js`
- update offer display/deadline semantics.
- label-specific overview remains here.
- ensure 360 scope matches actual accounting.

`src/empire.js`
- update Deal Room so label offers do not duplicate commercial categories.
- add Catalog Market navigation.
- update monthly advance warning and settlement hooks.
- keep player's own catalog valuation history.

`src/world-tours.js`
- revised demand model.
- add top-end tour milestones.
- clearer gross/retained breakdown.

`src/collections.js`
- expanded rotating pool.
- deterministic but less repetitive monthly rotation.
- expanded merch visual IDs.

`src/people-products.js`
- expanded cast artwork mapping.
- consider static asset references rather than giant embedded base64 blobs.

`src/wealth.js`
- include catalog holdings in wealth summary.
- distinguish owned personal catalog from third-party catalog investments.

`src/save-tools.js`
- validate all new state.
- migrate 0.7.x saves.
- never reject a legitimate older save solely because 0.8 fields are absent.

### New files

`src/career-hub.js`
- Inbox storage/migration/rendering.
- read/unread/pin.
- briefing route actions.

`src/commercial-deals.js`
- commercial-power score.
- offer generation.
- media/endorsement/brand/partnership contracts.
- scheduled payments.
- expiration lifecycle.

`src/awards.js`
- nominations.
- winner resolution.
- Awards screen.
- trophy case.
- annual event.

`src/catalog-market.js`
- listings.
- holdings.
- valuation.
- royalties.
- sales.
- taxes/history.

---

## 24. Save migration and validation

Add explicit migrations rather than assuming new objects exist.

### Required migrations

- `migrateCareerHub()`
- `migrateAwards08()`
- `migrateOffers08()`
- `migrateCatalogMarket()`
- existing guidance/collection/energy migrations still run.

### Validation

Reject corrupted input, not normal older saves.

Validate:

- offer status enums
- month/week deadlines
- catalog shares 0 < share <= 1
- nonnegative basis/value/payout values
- awards nominee indexes
- unique IDs
- portrait/art IDs in allowed ranges
- merch visual IDs
- Inbox item size/count

### Roundtrip test

A migrated 0.7.1 career must export and re-import as 0.8 with no loss of songs, albums, charts, contracts, assets, staff, label company, world artists, achievements, briefings, or finances.

---

## 25. Testing requirements

Do not call 0.8 complete until these pass.

### Navigation

- every registered destination renders a Back control;
- Back returns to the correct prior screen;
- modal Back/Close works;
- Guide is accessible everywhere;
- Inbox unread badge updates.

### Onboarding

- fresh save receives one optional tour invitation;
- Skip prevents repeat interruption;
- new separate save gets its own invitation;
- guide can replay tour;
- every tour selector exists.

### Inbox

- `Later` keeps unread;
- read/unread toggles persist;
- pinned survives save/load;
- migrated 0.7.1 briefings remain accessible.

### Offers

- unread label offer survives multiple monthly advances;
- unread commercial offer survives monthly advance;
- reviewing starts a deadline;
- countering extends deadline;
- reviewed expired offer archives correctly;
- month-close warning catches only offers that can actually expire.

### 360

- artist cannot change label-proposed type;
- player-owned label can offer 360;
- applicable media/brand income is shared under 360;
- investments/catalog holdings are not shared.

### Awards

- season builds nominees;
- player can lose despite eligibility;
- nominations/wins persist;
- trophy case counts match history;
- award effects occur once only.

### Catalog market

- buy 10/25/50/100% share;
- cash basis recorded;
- monthly payout matches simulated underlying royalties;
- valuation can rise and fall;
- sale realizes gain/loss once;
- holding survives save/load;
- 360 does not take catalog investment income.

### Tour scale

Test low, medium, superstar, and global-icon careers.

- low audience cannot fill stadiums;
- superstar audience can support arenas/stadiums;
- global-icon scenario can exceed $1B gross under plausible show/price/capacity settings;
- top-end scenario can approach/exceed $2B gross without violating seat capacity;
- gross, costs, and retained income remain distinct.

### Art

- every staff/artist card resolves a person portrait;
- no human card renders an asset/product image;
- merch batches retain selected art;
- limited asset image remains attached after purchase.

### Mobile

Manual real-device pass on iPhone Safari:

- title
- tour
- keyboard/modal forms
- Back
- Inbox
- Offers
- Awards
- Catalog Market
- monthly recap
- offline recovery

---

## 26. Release notes requirements

`RELEASE-0.8.0.md` should clearly distinguish:

- implemented features
- migrated systems
- economy changes
- UX changes
- known limitations
- automated validation performed
- manual/device checks still required

Do not claim Cloudflare/public deployment succeeded merely because the GitHub source was committed.

---

## 27. Definition of done

ENCORE 0.8 is ready for beta deployment only when all of the following are true:

- visible build version is 0.8 beta;
- title screen reflects 0.8;
- guide is always accessible;
- fresh careers get an optional tour;
- Back is present across screens;
- all major tabs have cohesive distinct themes;
- outdated tutorial directions are removed;
- people cards use stylized person art;
- merch has substantial visual choice;
- rotating/limited assets have images;
- tour scale responds strongly to elite fans/followers and supports legitimate billion-dollar gross outcomes;
- 360 structures originate from labels on artist-side deals;
- label offers are separated from media/endorsement/brand offers;
- top-end commercial values support rare billion-dollar and lifetime relationships;
- Inbox makes missed briefings easy to recover;
- Awards/Legacy is distinct from Achievements;
- the awards show has multiple categories, nominees, winners, and history;
- third-party artist catalogs can be bought, held, paid out, revalued, and sold;
- unread offers do not expire;
- reviewed offers have clear monthly deadlines;
- all new state migrates and validates;
- regression tests pass;
- real-device beta QA is documented;
- GitHub source and public deployment are verified separately.

---

## 28. Implementation order

Use this order to reduce regressions:

1. Version/schema migrations and destination registry.
2. Career Hub / Inbox and shared offer lifecycle helpers.
3. Navigation/header updates and stale-copy cleanup.
4. Offers Center and label-offer migration.
5. Commercial deal engine and 360 accounting integration.
6. Awards/Legacy system.
7. Catalog Market.
8. Tour demand/scale refinement.
9. Portrait, merch, and asset library expansion.
10. Theme/CSS polish.
11. Monthly recap/financial integration.
12. Full regression tests.
13. Real-device QA.
14. `RELEASE-0.8.0.md` and version bump confirmation.
15. Deploy only after source tests are green; then verify the live public build independently.

---

## 29. Core design principle

ENCORE should not make the player feel rich or famous because a menu decided they are. The systems should make the scale feel earned.

A player with a tiny fanbase should see small opportunities. A breakout artist should feel the industry opening up. A superstar should begin receiving genuinely large negotiations. A global icon with tens or hundreds of millions of fans, massive followers, major chart history, elite live demand, awards, and years of relevance should operate in a completely different economic universe: stadium eras, nine-figure rights values, global partnerships, catalog empire decisions, and rare billion-dollar or lifetime deals.

That progression is the point of 0.8.
