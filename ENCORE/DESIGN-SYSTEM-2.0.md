# ENCORE Visual System 2.0

## North star
ENCORE should read at first glance as a deliberately art-directed music-industry simulation, not a generic website, dashboard template, or collection of AI-generated cards.

**Core rule:** Different activity, different experience. Same game, same visual identity.

The interface should make the player's career visible. A player should be able to recognize whether they are creating, negotiating, touring, managing a label, reading media, or reviewing their career before reading a heading.

## Anti-template rules
1. Do not solve every layout with rounded cards.
2. Do not use gradients, glow, glassmorphism, or oversized pills as default decoration.
3. Do not make every screen use the same dashboard grid.
4. Do not use generic generated portraits or synthetic-looking imagery as visual filler.
5. Do not place every statistic in an isolated box. Use tables, editorial layouts, timelines, ledgers, maps, documents, lists, posters, charts, and physical-object metaphors where appropriate.
6. Decorative elements must communicate context, hierarchy, state, history, or interaction.
7. Motion should explain a transition or consequence rather than exist simply because animation is available.
8. Avoid excessive corner radii. Reserve large radii for intentional surfaces, not the entire product.
9. Important screens need recognizable silhouettes and composition, not only different headings.
10. Generated content should be curated through consistent art direction before it reaches the player.

## ENCORE visual language
### Foundation
- Deep neutral/navy shell rather than bright blue everywhere.
- Warm off-white and paper tones for contracts, archives, press and historical material.
- Restrained accent colors tied to meaning: chart movement, warnings, success, live performance, financial loss, rarity.
- Editorial serif display typography paired with highly readable UI sans-serif typography.
- Fine rules, dividers, tabular alignment and deliberate whitespace should replace unnecessary containers.
- Artwork, portraits and photography/illustration should carry more of the visual weight than gradients.

### Shape language
Use a mixed system:
- square/low-radius editorial panels for serious information;
- circular treatment for portraits, records, status markers and controls where semantically appropriate;
- paper/document geometry for legal, press and archival experiences;
- maps and route lines for touring;
- waveform/timeline geometry for studio and release workflows.

Do not round every surface equally.

## Global shell
### Navigation
Target: fewer top-level destinations and stronger contextual navigation.

Primary destinations:
- Career
- Create
- Home
- Industry
- Business HQ

Home remains centered in the mobile bottom navigation. Secondary destinations live inside the appropriate hub rather than competing for permanent navigation space.

### Header
The persistent header should communicate only information useful almost everywhere: current week/date, cash, energy/time and meaningful alerts. Avoid turning it into a dense stats strip.

### Back behavior
Every nested environment must have a predictable visible return path. Dedicated scenes such as Negotiation, Contract Review, Certification Reveal and major presentation moments may temporarily replace the normal shell but must restore it cleanly.

## Screen identities
### Home — Career Command Center
Purpose: answer “What is happening to my career right now?”
- dominant artist identity/artwork
- career season/temperature and why
- current release/tour/business focus
- meaningful alerts and opportunities
- recent movement, not a wall of lifetime statistics
- weekly advance remains obvious

Avoid: equal-sized dashboard tiles for everything.

### Artist File — Career Archive
Purpose: answer “Who has this artist become?”
Presentation should resemble a premium music/sports career dossier.
- large portrait/identity header
- career arc and era timeline
- core attributes
- records, awards, certifications and chart history
- catalog value and career totals
- major relationships and historical milestones

Use tabs/sections like a file, not generic cards.

### Stats — Development Board
Purpose: understand and improve abilities.
Writing, Recording, Producing, Charisma and Marketability remain independent core stats. Stage Presence, Touring and Viral Ability sit under Marketability.
Use a stacked development layout with progress/history and consequences. Make it visually obvious what an improvement affects.

### Create / Studio — Creative Workspace
Purpose: feel like making music rather than filling out a form.
- session/workbench composition
- song title selector/wheel
- collaborators and unfinished work visibly present
- creative direction, budget and quality feedback grouped by creative phase
- artwork and audio-production visual motifs used sparingly

### Charts — Editorial Rankings
Purpose: make chart success feel consequential.
- dense ranking table/list rather than card grid
- artwork thumbnails
- movement arrows
- peak, debut, weeks, certification and trend
- graphical chart history when opening an entry
- major chart moments can trigger presentation sequences

### PULSE / Media — Living Public Conversation
Purpose: show how the world is reacting.
PULSE should look like a believable social/media product, but not copy a real platform exactly.
- feed density
- replies, likes, reposts/comments
- press and fan voices visually distinct
- engagement can exceed 25% and is uncapped where the simulation warrants it
- media consequences link back to releases, beefs, tours, negotiations and career temperature

### Touring — Geographic Operations
Purpose: make scale and routing visible.
- actual graphical map as the primary canvas
- route lines and city nodes
- venue tier and capacity visible spatially
- forecast, promoter confidence and demand alongside the route
- tour economics in a tour ledger, not generic cards

### Business HQ — Executive Suite
Purpose: consolidate business ownership and management.
All business-related systems enter through Business HQ.
Subareas may include:
- Label
- Roster
- Staff / Representation
- Finance
- Investments / Assets
- Contracts / Vault
- Opportunities / Requests

The HQ should use an executive/operational visual language: roster tables, financial ledgers, inboxes, deal pipelines and company reports.

### Negotiation Room — Human Interaction
Current fullscreen architecture is correct; presentation should evolve beyond a web form.
Target composition:
- stronger counterparty portrait/presence
- dialogue/reaction area
- terms displayed as a deal sheet
- Interest, Patience and Leverage integrated into the scene
- counteroffers visibly alter the document/terms
- clear rounds and consequences
- restrained office/meeting-room environmental cues

Avoid turning the entire screen into blue rounded boxes.

### Contract Review — Legal Reading Room
Keep the dedicated fullscreen paper environment.
Next polish:
- stronger body-text contrast
- denser/authentic legal typography
- per-page initials
- drawn/electronic signature interaction
- executed stamp
- attorney warning tied to exact clause
- exact executed-document snapshot stored in Contract Vault

### Weekly Recap — Career Report
Purpose: make advancing a week feel like receiving a meaningful report.
Sections:
1. Gross Income
2. Contractual Distribution
3. Career Expenses
4. Taxes
5. You Kept
6. Charts / Audience movement
7. Career events and consequences
8. “Where every $1 went” visualization

Should feel closer to an editorial/financial report than a popup full of tiles.

### Certifications / Trophy Room
Certification milestones should be presentation moments rather than toast messages. Post-Diamond certifications use package/letter/plaque reveal sequences and then live permanently in the Career Museum/Trophy Room.

## Menu format strategy
Use the menu format that matches the task:
- Lists for browsing many comparable items.
- Tables for rankings and financial/roster comparison.
- Maps for geographic decisions.
- Documents for legal material.
- Timelines for career history.
- Feeds for media/social activity.
- Workspaces for creation.
- Ledgers for money.
- Dossiers for people/artists.
- Fullscreen scenes for high-stakes interactions and presentation moments.

A card grid is a fallback, not the default.

## Human-art-direction test
Before a redesigned screen is accepted, ask:
1. Could this screen belong to an unrelated SaaS product if the ENCORE name were removed?
2. Does it rely on rounded cards/gradients to create visual interest?
3. Does the imagery look generic, synthetic or stylistically inconsistent?
4. Is there a clear reason for every decorative element?
5. Does the layout communicate the activity before the text is read?
6. Does it look intentionally composed on mobile, rather than merely responsive?
7. Does it share ENCORE typography, spacing, navigation and interaction rules?

If 1–3 are yes or 4–7 are no, redesign before shipping.

## Rollout order
### Phase 1 — Foundation
- global tokens: type, spacing, radii, surfaces, borders, motion
- navigation hierarchy
- global header/status treatment
- reusable editorial primitives
- accessibility/contrast baseline

### Phase 2 — Player identity
- Home
- Artist File
- Stats

### Phase 3 — Core career loop
- Studio / Song Creation
- Release flow
- Charts
- Weekly Recap

### Phase 4 — Industry world
- PULSE / Media
- Touring map
- Industry / artist browsing
- notifications/opportunities

### Phase 5 — Business
- Business HQ
- Label/Roster
- Representation
- Finance
- Investments/assets

### Phase 6 — High-stakes scenes
- Negotiation visual refinement
- Contract interaction refinement
- certification/award reveals
- major career presentation moments

## Implementation guardrails
- Preserve save compatibility while redesigning presentation.
- Avoid broad gameplay rewrites in visual-only PRs unless a visual design exposes a genuine mechanics defect.
- Ship in coherent screen groups rather than one giant CSS override.
- Remove superseded presentation layers where safe instead of endlessly stacking compatibility CSS.
- Every redesigned screen must be tested on narrow mobile widths first, then desktop.
- Reduced-motion behavior remains supported.
- Explainability remains mandatory: no unexplained metric, percentage, eligibility rule, modifier or deduction.
