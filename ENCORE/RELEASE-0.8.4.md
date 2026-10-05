# ENCORE 0.8.4-beta.1 — Unique Core Artist Portraits

## Core cast identity

- The 18 starting/core artists now have 18 permanent unique portrait IDs.
- New careers use a canonical 18-person core cast with intentionally matched names, gender presentation, genres, and portrait identities.
- Existing careers keep their current artist names, stats, relationships, catalogs, and history while receiving unique permanent portrait IDs.
- Core artist portraits no longer rotate or reuse one of eight shared faces.
- Artist identity is persistent across Industry, collaborations, profiles, label/business views, and any screen that calls the shared portrait renderer.

## Portrait rendering

- Core portraits render as Safari-safe `<img>` elements.
- Each core portrait is a separate generated SVG image data URL with its own hair, skin tone, background, clothing palette, and accessories.
- Agents/staff can continue using the existing illustrated cast while the role-specific library grows.
- The portrait identity layer is intentionally separated from the art source so licensed PNG/WebP art can replace the current visuals later without changing save IDs.

## Industry presentation

- The Industry core roster now shows the full 18 active artists instead of rotating eight shared portrait slots.
- Genre and tier filters still work.
- The larger discoverable artist directory remains available separately.

## Version and testing

- Game/package version: `0.8.4-beta.1`.
- Added a regression that requires 18 unique IDs, distinct image sources, canonical Mira/Cairo new-career identities, migration behavior, and full 18-artist Industry presentation.
- `LEARNING-BUILD-GUIDE.md` documents the Git, build, test, preview, Wrangler, and deployment workflow for learning purposes.
