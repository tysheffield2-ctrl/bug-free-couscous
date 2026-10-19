# ENCORE 0.9.18-beta.1

- Hardened the gold SVG icon system for iPhone Safari so filled icon pieces cannot disappear after dynamic screen rebuilds.
- Externalized embedded people/cast artwork from the JavaScript runtime bundle while preserving byte-identical offline/static assets.
- Removed duplicate copies of the full game and week engine from the Cloudflare Worker bundle; generated runtime JavaScript now uses the existing static asset binding.
- Added production bundle budgets to stop future JavaScript and Worker size regressions.
- Improved iPhone safe-area handling, tap behavior, horizontal scrolling and reduced-motion accessibility.
- Fixed the stale UI2 Studio regression assertion around live session option wiring.
- Tightened 20-year career and touring save-growth budgets from 8 MB to 4 MB without removing permanent career history.
- Split long-career validation into parallel CI scenarios and moved CI to Node 24 for faster, cleaner release verification.
- Removed the redundant automatic Wrangler workflow that was producing false deployment failures; Cloudflare's connected production build remains the automatic path and the Wrangler workflow remains as a manual fallback.
- Preserved Sandbox as a separate save, preserved historical save migrations, and kept the fully interactive renderer as the production default while UI2 remains behind explicit preview routes.
