# FINAL CUT — Entertainment Empire Simulator

This is the isolated FINAL CUT v0.3 playable browser game. It is hosted in its own GitHub branch to avoid changing ENCORE's production source or deployment.

## Cloudflare Pages Git integration

In Cloudflare Dashboard → Workers & Pages → Create application → Pages → Connect to Git:

- GitHub repository: `tysheffield2-ctrl/bug-free-couscous`
- Project name: `final-cut-entertainment` (or any available unique name)
- Production branch: `final-cut-cloudflare` (NOT `main`)
- Framework preset: None
- Root directory: `FINAL-CUT`
- Build command: blank, or `exit 0`
- Build output directory: `public`

All game assets are in `FINAL-CUT/public/index.html` and do not require an external build. Once the user authorizes this new Pages project in Cloudflare, updates pushed to `final-cut-cloudflare` will deploy automatically. Browser saves persist in local storage per domain; export backups before moving domains.

ENCORE remains in `main/ENCORE` and is not modified by this branch. Cloudflare connection and new Pages project creation still require the Cloudflare account owner's explicit action.
