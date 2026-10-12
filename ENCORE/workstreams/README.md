# ENCORE System Workstreams

These workstreams keep future development conversations narrow. Each ChatGPT conversation should focus on **one** file/system unless a cross-system dependency must be coordinated through `00-architecture-1.0.md`.

> ChatGPT cannot create separate chat tabs automatically. Open a new chat for each workstream using the suggested title below; the matching repo file is the persistent source of truth for that system.

## Workstream chats

| # | Suggested chat title | Persistent workstream file |
| --- | --- | --- |
| 00 | `ENCORE — Architecture & Road to 1.0` | `00-architecture-1.0.md` |
| 01 | `ENCORE — UI / UX & Navigation` | `01-ui-ux-navigation.md` |
| 02 | `ENCORE — Song Creation / Studio 2.0` | `02-song-creation-studio.md` |
| 03 | `ENCORE — Release Strategy / Hype / Marketing` | `03-release-strategy.md` |
| 04 | `ENCORE — Audience & Streaming Engine` | `04-audience-streaming.md` |
| 05 | `ENCORE — Charts & AI Industry` | `05-charts-ai-industry.md` |
| 06 | `ENCORE — Touring 2.0` | `06-touring-2.md` |
| 07 | `ENCORE — Living World & Geography` | `07-living-world-geography.md` |
| 08 | `ENCORE — PULSE / Social / Public Life` | `08-pulse-public-life.md` |
| 09 | `ENCORE — Relationships / Features / Representation` | `09-relationships-features-representation.md` |
| 10 | `ENCORE — Labels / Contracts / Negotiations` | `10-labels-contracts-negotiations.md` |
| 11 | `ENCORE — Business HQ / Merch / Commercial` | `11-business-hq-commerce.md` |
| 12 | `ENCORE — Finance / Economy / Wealth` | `12-finance-economy-wealth.md` |
| 13 | `ENCORE — Awards / Legacy / Career Memory` | `13-awards-legacy-memory.md` |
| 14 | `ENCORE — Saves / Performance / Deployment` | `14-saves-performance-deployment.md` |
| 15 | `ENCORE — Sandbox / Testing` | `15-sandbox-testing.md` |

## How to start each chat

Use this short prompt, replacing the workstream name:

> **Continue ENCORE — [WORKSTREAM]. Use `ENCORE/workstreams/[FILE].md` and the current main branch as the source of truth. Stay inside this system unless a dependency absolutely requires coordination with another workstream. Audit the current implementation before changing it, preserve saves, add/update regression coverage, and update the workstream file when we make decisions.**

## Rules shared by every workstream

1. Preserve normal and sandbox saves unless an explicit migration is supplied.
2. Never create another parallel generation of a major system; consolidate or extend the canonical owner.
3. Any new balance logic needs long-career or targeted regression coverage.
4. Cross-system changes must state what other system they affect and why.
5. Player-facing design should be evaluated on iPhone-sized layouts, not desktop alone.
6. Update the workstream’s **Current state**, **Decisions**, **Backlog**, and **Done** sections as work progresses.
7. `CURRENT-SYSTEM-AUDIT-2026-10-11.md` is the baseline audit; newer workstream notes supersede it for that specific system.
