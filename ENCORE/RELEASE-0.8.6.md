# ENCORE 0.8.6 Beta — Commercial Scale

This update makes endorsements, brand deals and long-term partnerships behave more like a career market instead of a flat offer generator.

## Career-gated deal classes

Commercial opportunities now use hard audience and music-success gates. A high marketability score can improve an offer, but it cannot skip an entire career class.

- **Local buzz** — 750 fans + 25K lifetime streams: media opportunities.
- **Emerging** — 10K fans + 250K lifetime streams: endorsements unlock.
- **Breakout** — 100K fans + 5M lifetime streams: true brand campaigns unlock.
- **Star** — 1M fans + 50M lifetime streams + 250K followers: major partnerships unlock.
- **Superstar** — 10M fans + 500M lifetime streams + 2M followers: signature-line, global-ambassador and long-term partnership scale.
- **Global icon** — 50M fans + 2B lifetime streams + 10M followers + at least one ENCORE Honors win + 52 career weeks: rare lifetime / legacy partnerships unlock.

## Deal values now scale inside each level

The game now uses fans, lifetime streams, recent monthly streams, followers, marketability, reputation, awards and longevity to determine commercial power and value. Two artists in the same commercial level can receive very different offers.

Reference headline-value ranges include:

- Emerging endorsements: roughly $25K–$750K.
- Breakout brand campaigns: roughly $500K–$12M.
- Star partnerships: roughly $10M–$150M.
- Superstar partnerships: roughly $50M–$750M.
- Global-icon partnerships: roughly $150M–$1.5B.
- Rare global-icon lifetime deals: roughly $250M–$3B.

Headline value is still not instant cash. Guarantees, signing payments, installments and performance upside continue to determine when money reaches the player.

## Offers Center

The Offers Center now includes a **Commercial Market Value** ladder showing:

- Current commercial level and power score.
- Fans.
- Lifetime streams.
- Recent monthly streams.
- PULSE followers.
- Award wins.
- Each commercial level and its requirements.
- Which classes are unlocked versus still locked.

Commercial offer details also preserve the career snapshot used when the offer arrived, so players can see the scale that qualified them for the deal.

## Generation behavior

- Lower-career artists no longer receive major brand or global partnership offers early.
- Lifetime partnerships are intentionally rare even after Global Icon qualification.
- Existing unreviewed-offer protection remains unchanged.
- Existing commercial contracts and older saves remain compatible.

## Validation

0.8.6 adds regression coverage for:

- No commercial offers before entry-level qualification.
- Media-only access at Local Buzz.
- Endorsement unlock at Emerging.
- Brand-deal unlock at Breakout.
- Partnership unlock at Star.
- No lifetime deals at Superstar.
- Lifetime-deal eligibility at Global Icon.
- Larger values as fans/streams rise inside one tier.
- Offers Center eligibility-ladder visibility.
