# ENCORE Visual System 2.0 — Wave 2 Live Mobile Audit

This pass is based on the October 13 live mobile screenshots after Visual System 2.0 Wave 1 merged.

## What is working

- ENCORE now has a recognizable editorial/music-industry visual identity.
- Home, Artist File, Studio, Industry and Business HQ feel like parts of the same game.
- Studio is currently the strongest activity-specific composition.
- Artist File has a useful dossier/archive structure.
- Industry communicates that the world moves independently.
- Business HQ gives the business layer a real home instead of scattering it across unrelated menus.

## P0 — defects / trust breakers

1. **Home latest-release source-code leak**
   - Live screenshot showed JavaScript source text after the lifetime-stream count.
   - Root cause: Home referenced `chart` without defining the local chart position; browser resolved the global `chart` function and interpolated its source.
   - Wave 2 fix: define a local `chartPosition` result before rendering and regression-test that Home never contains `function chart`.

2. **Mobile shell feels duplicated**
   - The persistent product header, contextual ENCORE shell, page masthead and bottom navigation can create three or four stacked navigation bands.
   - Wave 2 direction: contextual shell becomes compact utility chrome on narrow screens. Page identity belongs to the page itself.

## P1 — mobile density

- Industry roster text is too small and too many columns compete on narrow screens.
- Business HQ is information-rich but overly compressed.
- Home has excessive dead vertical space after the main content on some viewport heights.
- Artist File should keep its editorial breathing room while avoiding oversized blank areas.
- Horizontal filter controls must scroll instead of clipping tier names.

Wave 2 introduces narrow-screen rules that:
- hide redundant cash/energy inside the contextual shell because persistent game chrome already exposes state;
- compress Back / context / Guide / menu into a smaller shell;
- collapse Industry roster secondary numeric columns on phones;
- make tier filters horizontally scrollable;
- improve Home release wrapping and scoreboard behavior;
- increase usable information density without turning the game back into a dashboard.

## P2 — remaining browser-app seams

### Artist identity
Initials are acceptable fallback identity, not the final visual destination. Player and NPC presentation needs a curated character-art system with a consistent human-made visual language.

### Artist profile interaction
The current artist profile opens as a large rounded modal over the Industry list. Replace it with an Artist Dossier scene: portrait, career state, relationship history, catalog highlights, public narrative and relationship actions.

### Label negotiation
The label screen still exposes a long form inside a modal. Move deal-making toward the Negotiation Room language: counterparty presence, deal sheet, changed-term highlights, leverage, patience and clear consequences.

### Touring
The map must be the primary decision surface rather than decoration around numbers. Cities, route, venue scale, demand, promoter confidence and projected economics should be spatially legible.

### Contracts
Continue the legal reading-room direction with stronger body contrast, required initials/signature moments, executed stamp and immutable executed snapshot in the Vault.

### Certifications
High certifications should become presentation events: package arrival → letter → plaque reveal → permanent Trophy Room object.

## Acceptance test

For every Wave 2 screen:

- Does the activity read before the user reads the heading?
- Is any navigation or state repeated unnecessarily?
- Can normal phone text be read without zooming?
- Are long lists dense enough to browse but large enough to tap?
- Does the layout use the right metaphor (dossier, map, document, feed, ledger, scene) instead of defaulting to cards?
- Does any dynamic value accidentally stringify a function, object, undefined value or implementation detail?
- Would the screen still look intentionally ENCORE if all gradients and rounded cards disappeared?
