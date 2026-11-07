# FINAL CUT v0.3 — Cloudflare Workers (separate from ENCORE)

The standalone game is at `FINAL-CUT/public/index.html`. Cloudflare Workers static assets configuration is `FINAL-CUT/wrangler.jsonc`, with Worker name `final-cut-entertainment`.

## Git-connected Cloudflare Worker

Use the existing GitHub repository `tysheffield2-ctrl/bug-free-couscous`, but set up a **new Worker project** named `final-cut-entertainment`.

For the Worker setup screen:
- Project name: `final-cut-entertainment`
- Build command: leave blank (no compilation required)
- Deploy command: `npx wrangler deploy --config FINAL-CUT/wrangler.jsonc`
- Preview command: `npx wrangler preview --config FINAL-CUT/wrangler.jsonc`
- Preview builds: leave disabled until production deployment works

CRITICAL: Set this Worker's production branch to `final-cut-cloudflare` in **Settings → Build → Branch control**. Cloudflare may initially default to the GitHub repository's `main` branch; that does not contain the FINAL CUT Worker config and cannot deploy FINAL CUT. After changing the production branch, run the deployment from the new branch (for example by committing a safe documentation update). Do not deploy FINAL CUT's Worker as ENCORE or change ENCORE's existing Worker project.

The two games have separate Cloudflare Worker names and independent deployment branches. This branch contains copies of ENCORE from main because it is a Git branch, but the FINAL CUT deploy command points only to `FINAL-CUT/wrangler.jsonc`.

Game saves persist in local storage per domain. Export a backup before changing game domains.
