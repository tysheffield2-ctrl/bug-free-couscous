# ENCORE 0.7.0 beta — Living world

This update preserves existing careers and separates normal and sandbox saves.

- Navigation: Studio / PULSE / Home / Stats / Menu. The searchable Menu provides direct destinations grouped into Music, Social, Business, Wealth and Career. Career screens no longer show stacked category navigation.
- Exchange: eight fictional instruments, 20-second active-play quote changes, correlated market movement, headlines, recent price history, fractional market trades, limit orders, cancellation, FIFO realized gains and fees. Also advances during monthly simulation. Pauses while hidden; no real-world prices, money or brokerage connections.
- PULSE: typed posts, typed threaded comments, likes and delayed simulated fan/artist replies. Responses use authored keyword-aware templates, not a generative chatbot or real people. History is bounded. Relationship rewards cannot be farmed through repeated replies.
- Photography: individual generated images for all ten physical asset types, included for offline play.
- Studio: personal-story / anthem / experimental briefs, three vocal approaches and three mixing approaches with visible cost, energy and quality/appeal tradeoffs. Projects still persist across advances.
- Locations: eight US cities, creation selection, local showcases, genre-fit bonuses, local connections and relocation. Place bonuses are fictional game balancing.
- Representation: six agents, negotiable commission and term, reach support, expiry/dismissal, scandals and unauthorized withdrawals with dispute/recovery. Commission is applied to music and live income and shown in transactions.
- Labels: competing offers while signed, explicit existing-contract buyout when switching, simulated rival budgets/rosters, renewals and transfers. Player labels pay buyouts when recruiting contracted artists and can renew active roster contracts near expiry.
- Save validation and new regression tests cover the expansion alongside existing tests.

## Testing and limits

Run `npm test`. Tests exercise game state and rendered markup in a mocked DOM, including save/import, financial accounting and duplicate-action protection. They do not replace hands-on Safari/iPhone playtesting. Browser layout and touch behavior still need device review before calling this a stable release.

Market prices are simulated, not real-time external quotes. The exchange retains 80 price points per symbol, 100 trades/orders and 30 open orders. Physical assets continue monthly valuation. Existing rentals use one combined tenancy per property holding. Label league initially models the 24 established artists; the 2,500+ collaborator directory remains available separately.

## Editing and deploying

Edit `src/` modules and `src/presentation.css`. `npm run build` generates `dist/game.js`, updates CSS in `dist/index.html`, and builds the Cloudflare Worker under `dist/server/index.js`. Preserve your existing Cloudflare R2 and email configuration in `wrangler.jsonc` and `server/worker.mjs`.

New modules: `market.js`, `conversations.js`, `industry-life.js`, `navigation.js`, `studio-life.js`, `asset-photos.js`. Compressed photography is also provided in `assets/`.

Normal gameplay: `/`. Separate sandbox: `/sandbox`. Offline routes remain available. Confirm version **0.7.0-beta.1** in Settings after Cloudflare deployment. GitHub publication alone is not confirmation that Cloudflare has completed deployment.
