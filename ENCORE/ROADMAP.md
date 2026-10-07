# ENCORE Development Roadmap

> **North star:** Build a living, evolving music-industry simulation where every major system affects another system, failure creates new stories instead of dead ends, the world evolves without waiting for the player, and **ENCORE remembers** what happened, when it happened, who was involved, and what changed because of it.

## Development principles

- **Every system should affect another system.** Features should feed the simulation instead of existing as isolated buttons.
- **Failure should be playable.** Flops, bad contracts, weak tours, cold eras, beef losses, and career declines should create comeback paths and new decisions.
- **The world does not scale around the player.** AI artists, cities, trends, labels, and careers keep moving while the player rises, falls, or disappears.
- **Career tier is not current heat.** A legendary artist can remain a Superstar while commercially cold; a viral newcomer can be hot without long-term influence.
- **Geography matters.** Who wants the artist, where they want them, and how much they want them right now should drive touring, marketing, opportunities, and cultural identity.
- **ENCORE remembers.** Relationships, awards, rivalries, releases, tours, city bonds, career eras, contracts, and major moments should become persistent career history.
- **Player choices create outcomes; players do not choose success.** The game forecasts uncertainty and the simulated market responds.

---

## Current beta foundation — 0.8.x

### Shipped / working

- Weekly career loop, energy, music creation, albums, charts, certifications, finances, saves/backups, labels, negotiations, PULSE, investments/assets, commerce, career guidance, achievements, sandbox, and broader industry systems.
- Intentional arcade streaming economy at **$0.50 per stream**.
- Recurring catalog marketing and expanded album rollout campaigns.
- Career-tier-aware commercial opportunities and deal scaling.
- First chart-appearance notifications.
- Living Career foundation:
  - Career temperature states: Slump → Cold → Cooling → Stable → Hot → Dominant.
  - Momentum.
  - Public Interest.
  - Fan Loyalty.
  - Industry Influence.
  - Cultural Relevance.
  - Public Recognition.
  - Tour Demand.
- Regional Audience foundation with initial U.S. markets, regional streams, fans, demand, genre affinity, growth, hometown weighting, and city status.
- Player-facing **Career Pulse** and **Audience & Markets** screens.

### Foundation still to deepen

- Separate permanent **Hometown** from changeable **Current City** more meaningfully.
- Relocation decisions, travel/access costs, and city-specific opportunity pools.
- Active city relationship events instead of only passive growth.
- City-status progression: Unknown → Local Buzz → Hometown Favorite → City Star → City Icon → Cultural Institution.
- Country/region rollups for eventual national cultural identity.
- More robust career-state hysteresis and long-save testing.
- Public Recognition / Fame Pressure hooks for later touring, privacy, and security systems.

---

# Planned release path

## 0.9 — Living World + Touring 2.0

**Goal:** Make geography, demand, fame, and career momentum change how the player tours and moves through the world.

### Living World completion

- Hometown vs Current City.
- Relocation with real tradeoffs; no universally best city.
- Local producers, artists, studios, media, labels, festivals, and brand opportunities.
- Regional/city scenes that can strengthen or weaken over long saves.
- City cultural relationship and hometown legacy.
- Local loyalty that can survive national cold eras.
- AI artists receive hometown, current base, regional strength, and city identity.
- Regional sentiment for major rivalries and public events.

### Touring 2.0

- Build tours show-by-show instead of using a three-show abstraction.
- Market demand by city with suggested venue and uncertainty.
- Venue choice from local rooms through stadiums.
- Player-set ticket prices and ticket tiers: upper/lower/floor/VIP/meet-and-greet where appropriate.
- Price resistance and sell-through forecasting.
- Ability to intentionally gamble on oversized venues.
- Add, remove, upgrade, downgrade, cancel, and reschedule shows.
- Real ENCORE artists as openers with guarantees or revenue splits.
- Player can receive opening-slot offers from larger artists.
- Tour crew: Tour Manager, DJ/band, dancers, choreographer, security, production, wardrobe/stylist, lighting, audio, transportation.
- Travel progression: van → bus/commercial travel → premium travel → private aviation.
- Hotels/accommodations with cost, comfort, privacy, security, prestige, and location tradeoffs.
- Owned properties can reduce lodging costs and improve privacy in a market.
- Fame Pressure at high recognition: crowds, paparazzi, leaked locations, protesters/haters, privacy requirements, crowd-control issues.
- Security monitors risk and recommends prevention rather than acting as a flat stat boost.
- Distinguish Fan Loyalty, Obsessive Attention, and actual Security Risk.
- Tour reports: tickets sold, capacity, gross, expenses, net, show quality, satisfaction, PULSE buzz, catalog streams, incidents.
- Touring creates demand as well as monetizing it.
- Cold-era comeback tours can rebuild local demand and national momentum.

**Core loop:** Regional Demand → Tour Planning → Performance → Fan Satisfaction → PULSE Buzz → Streams → Momentum → Career Era → Future Demand.

---

## 0.10 — PULSE, Influence + Public Life

**Goal:** Turn social media into an industry system rather than a follower counter.

- PULSE verification earned through career progress and public recognition.
- Influence separate from follower count.
- Social hierarchy: fans, creators/influencers, verified public figures, verified artists, elite celebrities.
- Celebrity ecosystem: actors, athletes, streamers, influencers, producers, executives, fashion figures.
- Celebrity cosigns, song usage, concert attendance, and public support can affect discovery and demand.
- Player can eventually cosign emerging artists and influence their careers.
- Social Media Manager staff role.
- Manager ratings: Growth, Engagement, Virality, Crisis Management, Brand Safety, Industry Connections.
- Social strategies/personas: professional, fan-focused, viral/chaotic, luxury/brand-friendly, mysterious/minimal, etc.
- Automatic posting/engagement support without creating infinite followers.
- Trend identification, campaign coordination, influencer collaboration, and crisis response at higher staff quality.
- Public sentiment by market where appropriate.

---

## 0.11 — Relationships + Industry Politics

**Goal:** Make the industry remember how people treat one another.

- Replace single-dimensional important relationships with dimensions such as Friendship, Respect, Trust, Rivalry, Jealousy, and Chemistry/Competitive Tension.
- Persistent shared history: first feature, tour support, public defense, rejected features, betrayals, disses, comeback help, contract conflicts.
- Artists, labels, executives, agents, producers, brands, and media can have relationships with one another.
- Alliances, camps, and industry politics.
- Agent insights explain political consequences naturally rather than exposing a giant relationship graph.
- Feature access, cosigns, tours, contracts, beefs, and opportunities consume relationship history.

### Incoming Feature Requests 2.0

- Song title and artist.
- Genre and creative fit.
- Song quality / projected quality.
- Projected streams and chart potential.
- Marketing/rollout budget.
- Release date.
- Feature fee and royalty split.
- Audience overlap.
- Reputation and career implications.
- Other featured artists.
- Accept / Counter / Decline.
- Agent advice and negotiation.

---

## 0.12 — Rivalries, Beef + Media Heat

**Goal:** Allow competitive relationships to develop over years and become major industry events organically.

- Rivalries can emerge from comparisons, charts, awards, rejected features, posts, interviews, labels, jealousy, or old history.
- Long-simmering competitive tension before open conflict.
- Player responses: ignore, social response, interview response, subliminal, diss track, major diss record, private resolution, PR de-escalation.
- No universally correct response; answering a much smaller artist can amplify them.
- Diss tracks are actual Studio releases with title, production, quality, marketing, streams, charts, and release timing.
- Diss Effectiveness based on writing, song quality, opponent reputation, sentiment, timing, and response strength.
- AI artists can post, interview, release music, ignore, escalate, or resolve conflict.
- Consequences affect streams, followers, reputation, relationships, brands, regional sentiment, and momentum.
- Persistent rivalry history and public consensus.

### Media Heat + ENCORE News framework

- Hidden Media Heat scale for determining when a story becomes industry news.
- PULSE chatter → industry story → breaking-news sequence → industry-wide event.
- Reusable ENCORE News presentation framework using portraits, headlines, PULSE posts, charts, cover art, and later narration/animation.
- Celebrity/artist sides can shift sentiment and relationships.

---

## 0.13 — Music + Release Strategy 2.0

**Goal:** Make records feel meaningfully different before the stream number appears.

### Songs

- Genre/subgenre.
- Mood.
- Lyrical theme.
- Target audience.
- Commercial vs experimental intent.
- Explicit/clean.
- Producer.
- Recording quality.
- Sample usage.
- Trend-chasing vs originality.
- Collaboration chemistry.

### Albums / projects

- Album, EP, mixtape, collaborative project.
- Concept and visual direction.
- Track count and budget.
- Lead/second singles.
- Features and producers.
- Rollout length.
- Deluxe/remix strategy.
- Cohesion vs individual hit potential.
- Separate critic, fan, and industry reception.
- Classics can emerge over time rather than only at debut.

### Release strategy

- Surprise drops, snippets, videos, pre-orders, radio pushes, playlist campaigns, release delays, remixes, deluxe editions.
- Competing release dates with AI artists.
- Songs can become sleeper hits, tour favorites, viral revivals, or celebrity-driven catalog resurgences months/years later.
- Genre and trend cycles evolve while the save continues.

---

## 0.14 — Representation + Inner Circle

**Goal:** Make staff unlock possibilities and create stories instead of providing passive percentage bonuses.

- Agent specialties, reputation, network, negotiation, commission, relationship, career-stage fit, recommendations, poaching, misconduct, and bad-agent outcomes.
- Manager.
- Publicist.
- Lawyer.
- Business Manager.
- Tour Manager.
- Security.
- Social Media Manager integration from 0.10.
- Staff salaries/commissions, loyalty, personalities, specialties, and reputations.
- Staff can improve, renegotiate, leave, or be poached.
- Young inexpensive representatives can grow alongside the artist.

---

## 0.15 — Money, Ownership + Power

**Goal:** Give successful artists strategic reasons to care about wealth and ownership.

- Deeper endorsement contracts: exclusivity, competing brands, reputation clauses, signature products, equity, renewals.
- Catalog valuation that responds to performance, longevity, trends, and cultural relevance.
- Catalog purchases/buybacks and master ownership.
- Asset-backed borrowing against catalog, real estate, investments, businesses, luxury assets, or future royalties where appropriate.
- Loan-to-value, interest, debt service, collateral risk, creditworthiness, overleveraging, and forced-sale risk.
- Properties and transportation have gameplay utility, not only resale value.
- Business/ownership opportunities.
- Long-term path toward founding a record label.

---

## 0.16 — Awards Show 2.0 + Career Memory

**Goal:** Make the end of each year feel like a season finale that reflects the save the player actually experienced.

- Award eligibility and scoring consider commercial performance, critical reception, cultural impact, touring, momentum, longevity, charts, and fan reception according to category.
- Album, Song, Record, Best New Artist, Artist, Tour, Producer, Songwriter, and genre awards.
- Performance invitations depend on current relevance rather than historical tier alone.
- Rehearsal/production/stage skill determine awards-show performance outcomes.
- Rival interactions and Media Heat at the ceremony.
- Winner/loser reaction choices.
- Acceptance speech choices with consequences.
- Annual recap identifies breakouts, falls, comebacks, defining albums, tours, and rivalries.
- Career history preserves named eras such as a comeback year or rivalry year.

---

## 0.17+ — Legacy / Executive Endgame

**Goal:** Let a save meaningfully continue after the player has already become a global icon.

- Career generations change across decades.
- Younger artists cite the player as an influence.
- Mentors and protégés.
- Player can cosign, develop, tour with, and executive-produce younger artists.
- Protégés can surpass the player.
- Found and operate a record label.
- Sign/develop artists, fund projects, negotiate masters, hire staff, build a roster, and compete with majors.
- Signed artists can demand better terms, leave, flop, or become stars elsewhere after being dropped.
- Artist career can transition naturally into executive/legacy gameplay.

---

# Cross-version systems

These should be designed into the releases above instead of being isolated late-game add-ons.

### Starting age / youth careers

- Allow careers to begin as early as age 14.
- Ages 14–17 can release music and build audiences with age-appropriate contract, touring, finance, guardian/representative, and scheduling constraints.
- Young starts trade independence/resources for potential longevity; older starts trade longevity for developed skills and negotiating independence.

### AI career intelligence

- AI artists release, tour, collaborate, feud, break out, decline, change cities, experience eras, and compete for attention.
- The world continues evolving while the player is inactive or cold.
- New generations and regional scenes emerge over long saves.

### Personal relationships — light touch

- Friendships, family, mentors, protégés, and public romantic relationships may affect career/public-interest systems where appropriate.
- Keep this career-simulation focused rather than turning ENCORE into a full life/dating simulator.

### International expansion

- Regional U.S. architecture should eventually roll into countries and international markets.
- Country-level cultural bonds can create national-icon relationships in the same way city legacy works locally.

---

# Visual / portrait track

Portrait work is a parallel presentation track and should not block gameplay development.

## Portrait integration objective

**One person → one portrait identity → one image file → the same face everywhere.**

- Use the 18 existing generated portrait originals already uploaded for the project; do not regenerate them by default.
- Normalize originals to `src/portrait-originals/artist-01.png` through `artist-18.png`.
- Build individual optimized WebP files at `public/portraits/artists/artist-01.webp` through `artist-18.webp`.
- Avoid the old atlas approach.
- Remove procedural SVG/cartoon fallback for mapped core artists once direct-file validation succeeds.
- Use one shared portrait resolver for directory cards, featured artist cards, relationships, features, staff/news surfaces, and future ENCORE News.
- Verify identity consistency by named artist across multiple screens before declaring portrait integration complete.
- Keep source originals out of production payload where appropriate; commit optimized runtime assets.

### Core 18 portrait mapping

| # | Artist | Presentation | Genre | File |
|---|---|---|---|---|
| 01 | Mira Wells | Female | Pop | artist-01 |
| 02 | Cairo Vale | Male | R&B | artist-02 |
| 03 | Amara Sun | Female | Afrobeats | artist-03 |
| 04 | Orion Saint | Male | Hip-hop | artist-04 |
| 05 | Selah Monroe | Female | R&B | artist-05 |
| 06 | Malik Cross | Male | Hip-hop | artist-06 |
| 07 | Zara Voss | Female | Electronic | artist-07 |
| 08 | Leon Rivers | Male | Rock | artist-08 |
| 09 | Nyla Hart | Female | Pop | artist-09 |
| 10 | Theo Knox | Male | Country | artist-10 |
| 11 | Sanaa Rose | Female | Gospel | artist-11 |
| 12 | Nico Lane | Male | Indie folk | artist-12 |
| 13 | Talia North | Female | Country | artist-13 |
| 14 | Jalen Storm | Male | R&B | artist-14 |
| 15 | Lyra Quinn | Female | K-pop | artist-15 |
| 16 | Idris Blue | Male | Jazz | artist-16 |
| 17 | Nova Rey | Female | Latin | artist-17 |
| 18 | Kofi Dawn | Male | Afrobeats | artist-18 |

---

# Immediate next queue

1. **Portrait pipeline retry** — preserve the existing originals, produce 18 direct WebP assets, wire one resolver, and verify multiple named artists across screens.
2. **Living World completion** — deepen hometown/current-city and city-relationship mechanics needed by Touring 2.0.
3. **Touring 2.0** — first major gameplay release built on the Living Career and Regional Audience foundation.
4. Continue through the versioned roadmap above, updating this file as scope ships or changes.

---

_Last updated: October 7, 2026._
