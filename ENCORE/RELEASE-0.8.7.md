# ENCORE 0.8.7-beta.1

## Release experience and artist presentation

- Songs now trigger a celebration and Career Inbox briefing the first time they enter the Global Top 100, including release-week debuts.
- Albums now trigger the same first-entry celebration when they enter the Global Albums 50.
- Re-entries do not repeat the first-chart celebration, and recovered historical chart records do not create false new alerts.
- The title screen now shows a current **What’s new** panel generated from the release notes for the version being built.
- Beta Info uses the same release metadata, replacing the stale hard-coded update copy.
- The 18 core artists now use the production portrait artwork created for ENCORE, packed into one optimized WebP atlas with permanent 1:1 artist identities.
- Core portraits use Safari-safe real `<img>` rendering with the existing generated SVG portrait as an emergency fallback.
- The portrait atlas is delivered as a Cloudflare static asset and included in ENCORE’s offline cache.
- Existing careers, artist identities, chart histories, commercial deals, marketing campaigns and save data remain compatible.
