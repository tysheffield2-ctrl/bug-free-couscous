# FINAL CUT — Entertainment Empire Simulator
Version 0.4.0 — Acting Career Expansion

This is an original playable browser game. The published release is self-contained at `FINAL-CUT/public/index.html`; it keeps the existing `finalcut.save.v3` browser save key so users retain earlier career progress.

## v0.4 features
- Casting-call self-tape preparation (12 energy; one per week), and fictional applicants competing for roles
- Natural/Bold/Precise callback choices; competition and studio trust influence selection
- A new contractual counteroffer for extra residual periods, subject to negotiation risk
- Filming choices: support crew, focus with director, or attempt risky improvisation
- Occasional limited production delays and career-long studio relationship memory
- Strong contacts may recommend you for new auditions
- New Industry Relationships screen, compact navigation, existing dark palette and white rows
- Existing film investment, studio production, TV renewals, finances, guild system and sandbox mode retained

## Deployment
Cloudflare Worker name: `final-cut-entertainment`.
GitHub repository: `tysheffield2-ctrl/bug-free-couscous`, production branch `main`.
Build command: blank. Deploy command: `npx wrangler deploy --config FINAL-CUT/wrangler.jsonc`.
The Worker static assets point to `FINAL-CUT/public`, so ENCORE files are not served from this Worker.

## Save and testing
Keep browser-local saves and export a backup before changing devices. v0.2 and v0.3 save migration remains intact. Regression coverage: core engine + v0.3 career + v0.4 career, and iPhone viewport smoke tests at 320, 375, 390 and 430 CSS pixels. Game figures and union requirements are fictional and intentionally simplified.
