# ENCORE 0.8.3-beta.1 — Weekly pacing & consistency

ENCORE returns to weekly career progression while keeping the richer business, investment and living-world systems added in 0.8–0.8.2. One Advance now resolves exactly one chart week and restores energy to 200. Monthly systems still settle once at calendar-month rollover, so rent, assets, catalog distributions, commercial installments, sports, touring operations and other monthly accounting are not charged four or five times per month.

## Calendar

The career calendar now uses real month and year names beginning in **January 2026** instead of labels such as Month 1 / Year 2. The existing 4/4/5 chart-week pattern remains underneath the calendar so 52 advances equal one full year. Examples:

- Week 1: January 2026
- Week 5: February 2026
- Week 53: January 2027

Existing careers keep their saved chart week; 0.8.3 derives the visible date from that week rather than resetting progress. A career first opened partway through a calendar month begins its new monthly accumulator from the migration point, so the first post-update month summary may include only the weeks played after migration. Later months contain their full 4/4/5-week periods.

Weekly recaps continue to show the completed chart week and financial breakdown. Calendar-month totals are accumulated from those weekly results and stored when the month closes.

## Sports ownership

Sports investing is now intentionally focused on one fictional league: **ENCORE Pro Basketball**. The market contains ten teams, all playing the same 82-game basketball season:

1. Austin Outlaws
2. Chicago Forge
3. New York Empire
4. Los Angeles Waves
5. Miami Tides
6. Seattle Sound
7. Atlanta Flight
8. Dallas Stampede
9. Las Vegas Neon
10. Boston Foundry

Franchises have deliberately different starting valuations, team ratings, championship histories and historical playoff rates. Monthly simulation advances the common season, records wins/losses and adjusts franchise value using current performance, team strength, market scale and variance. When the 82-game season is complete, a champion is recorded, franchise history updates and the next season begins.

Existing sports holdings using the previous team IDs 0–7 remain attached to the corresponding 0.8.3 basketball franchise ID. Two additional franchises use IDs 8 and 9. This preserves ownership percentages while replacing the old mixed-sport market with one coherent league.

## PULSE

Song links are explicitly optional for normal PULSE posts. The composer now labels the field **Song link (optional)** and includes a clear **No song link** option. Story, Clip, Studio Update and Live Moment posts can be published without attaching music. Release Announcement remains the one format that requires a released track because the post is specifically announcing a release.

PULSE limits and copy are aligned with weekly pacing: up to three posts per playable week, while month-end inactivity logic still evaluates activity across the calendar month.

## Character portrait consistency

Procedural character portraits remain lightweight embedded SVGs, but assignment is now deterministic by character name rather than by whichever screen happens to render the person. The same artist therefore keeps the same portrait across Artist, Catalog, Awards and other screens.

Obvious gendered first names use matching portrait presentation pools. For example, Mira is rendered with a feminine portrait and Cairo with a masculine portrait. Names that are intentionally ambiguous use a neutral presentation pool. This is a fictional presentation rule for ENCORE characters, not an attempt to infer real people's gender from names.

## Pacing implementation

The original one-week simulation engine remains the source of truth for charts, releases, contracts, royalties, label activity and tax-year progression. 0.8.3 removes the player-facing monthly wrapper and adds a calendar boundary layer around that proven weekly engine.

At the final week of a calendar month, monthly systems settle exactly once before the next month starts. An explicit transition guard prevents internal rendering from migrating the calendar before the outgoing month's accumulator has been finalized.

## Validation

`npm test` passes the complete regression suite on the 0.8.3 branch. Coverage includes:

- one-click / one-week advancement and weekly energy refill
- 52 advances = one full career year
- January 2026 through January 2027 rollover
- 104-week / 24-calendar-month save and finance stress
- 4/4/5 monthly accumulation boundaries
- label negotiations, buyouts and 360 accounting
- catalogs, assets, properties, exchange and taxes
- touring and billion-scale live economics
- 10-team single-sport basketball league
- optional PULSE song links
- deterministic gender-aware fictional portraits
- 0.8, 0.8.1 and 0.8.2 migrations and systems
- save/import validation

Automated tests are logic and render-string checks. Physical iPhone Safari touch/layout QA has not been completed for this release and remains a manual test item.

## Deployment note

A GitHub `main` update is not itself proof that Cloudflare has successfully published the same commit. Verify the version shown by the production site after deployment before describing 0.8.3 as live publicly.
