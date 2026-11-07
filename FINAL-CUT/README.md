# FINAL CUT — Cloudflare deployment

This is a standalone FINAL CUT v0.3 project. It is intentionally isolated from ENCORE.

- Source: `FINAL-CUT/public/index.html` (complete, self-contained game).
- Worker: `final-cut-entertainment` (does not overwrite `encore-artist-sim`).
- Configuration: `FINAL-CUT/wrangler.jsonc`.
- Deployment: `.github/workflows/final-cut-cloudflare.yml` on changes to the `final-cut-cloudflare` branch.

The workflow uses existing repository Cloudflare credentials stored as GitHub Actions secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. Their values must never be committed.

If the configured token cannot create this new Worker, the GitHub action will fail; a Cloudflare account owner will need to grant that token access to Workers scripts for this account. No existing ENCORE production Worker is changed by this workflow.
