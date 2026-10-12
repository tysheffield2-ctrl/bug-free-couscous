# ENCORE — Charts & AI Industry

## Audit score
**Pre-pass:** Charts 6.2/10 · AI Industry 5.9/10

**Current implementation target:** Charts ~7.2/10 · AI Industry ~7.0/10, pending CI and long-career validation.

## Current state
Charts already track floors, debut, movement, re-entry, peak, weeks, #1 streaks and late entries. NPCs already had momentum, cooling, hiatus, reinvention, collaboration and comeback behavior.

The first 0.9.6 generations pass adds a persistent long-career layer on top of that foundation:
- New artists enter the world on a recurring cadence.
- Every AI artist now has durable generation, debut, peak-audience, stage and status metadata.
- Artists can age through newcomer, rising/breakout, prime, rebuild, veteran and legacy stages.
- Older careers can retire without deleting artist IDs, catalogs, relationships or history.
- Eligible legacy artists can return as the same persistent identity.
- Genre climate moves over time and influences which genres produce new entrants.
- Synthetic Top 100 song entries now shrink as persistent releases become numerous enough to replace them.
- Synthetic album-chart depth follows the same rule.
- World Pulse surfaces generation count, active/legacy careers, recent debuts and current genre climate.

## Canonical goal
A persistent music industry that exists independently of the player: artists emerge, develop, peak, slump, retire, return, leave legacies and are replaced by new generations. Chart entries should overwhelmingly belong to persistent careers.

## Completed in first generations pass
- [x] New-artist generation pipeline.
- [x] Career age/stage metadata.
- [x] Retirement without destructive roster deletion.
- [x] Persistent comeback continuity.
- [x] Genre-climate foundation.
- [x] Shrinking synthetic song-chart filler.
- [x] Shrinking synthetic album-chart filler.
- [x] Dedicated regression coverage for persistent generations and chart depth.

## Highest-priority next backlog
- Give AI artists actual release strategy rather than one shared release cadence.
- Make genre climate affect release reception, label strategy, collaborations and city scenes — not only new-artist generation.
- Add AI touring careers and feed tour success/failure back into audience, momentum and charts.
- Add AI label movement: signing, dropping, switching, independent eras and executive priorities.
- Expand collaboration logic into durable co-signs, feature chains, beef and scene networks.
- Preserve deeper legacy summaries when careers retire: #1s, awards, biggest release, tours and era history.
- Add new-generation discovery storytelling instead of silent roster growth.
- Reduce synthetic chart depth further only when long-career distribution proves the persistent world can support realistic thresholds.
- Validate #1 thresholds, chart longevity, world audiences, retirement rates and generation size across more 20+ year seeds.

## Guardrails
- Never renumber or remove historical artist IDs just to make room for a new generation.
- Retirement must not erase catalogs, relationships, chart history or shared live history.
- Do not solve chart realism by generating more anonymous rows.
- Persistent careers should replace synthetic entries through simulation depth, not through weaker chart standards.
- New AI systems should eventually share Touring, Audience, Labels, PULSE and Relationship engines rather than invent parallel stat changes.

## Why this remains Tier A
This is still the largest lever for making ENCORE feel like a world instead of a player-centric career calculator. The first pass establishes generational continuity; the next passes must make those careers strategically intelligent and deeply interconnected.
