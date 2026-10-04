# Current build: 0.7.0-beta.1

See [RELEASE-0.7.0.md](RELEASE-0.7.0.md) for the living-world update, editable modules and test limits. Run `npm test` before deployment.

# ENCORE 0.6.1-beta.1 — Backstage & Private Office

Backstage is now the home and title-screen art direction: original photographic concert scenery, live cash/fans/energy controls, a compact hero and direct action rows for recording, offers and latest releases. Private Office gives Wealth, Properties and Artist File forest-green surfaces, champagne accents, a photographic property hero and readable portfolio controls. Both screen types use real HTML controls over decorative imagery, not flattened mockups. Existing light-mode preference remains available; first-time default is dark.

Month and Year share a calendar counter on the title, main header, home, wealth, artist file and monthly recap. A 4/4/5 chart-week cycle remains underneath; Month 12 Year 1 advances to Month 1 Year 2. The recap labels the completed month, while Continue identifies the new month. Old careers derive their starting month from their saved chart week once without resetting skills, cash, projects or contracts. Weekly labels remain for weekly chart/history records.

Original photographic assets are compressed WebP images embedded by src/artwork.js so offline play has no external image dependency. Editable screen markup is src/presentation.js; styles are src/presentation.css. The build injects one stylesheet block idempotently. assets/ contains the compressed image originals. Asset generation notes are in ASSET-NOTES.md.

Validation: npm test passes all existing regression checks plus calendar migration, completed-month recap and year rollover. Browser screenshot/physical iPhone checks were not completed: browser installation failed in the build environment. Confirm 0.6.1-beta.1 in Settings after Cloudflare deploys, then inspect sandbox on a real phone. Hosting completion is separate from the GitHub push.

# ENCORE 0.6.0-beta.1 — The Empire expansion

This version adds connected social, ownership and wealth gameplay while preserving existing careers. The sections below this release note document older builds; this section supersedes their pacing and feature limits.

## Play and test

- Normal career: https://encoremusicsim.com/
- Separate sandbox: https://encoremusicsim.com/sandbox
- Offline normal/sandbox: /offline and /offline/sandbox (open online first to install/cache).
- These links show the new version after Cloudflare successfully deploys this commit. Check Settings for 0.6.0-beta.1. GitHub source publication is not itself proof of successful deployment.
- Export a save before testing a large update. Normal and sandbox saves remain isolated.

## Monthly progression

Advance month resolves 4, 4, then 5 chart weeks, repeating: 12 advances equal 52 weeks. Chart movement, history, label terms and annual income-tax settlement retain their original weekly clock for save compatibility. Each monthly advance restores 200 energy; no time slots. Rest restores 40 once per playable month. Saved unfinished songs persist. Existing careers start the new cadence from their saved week; no time is skipped during migration. The new recap aggregates all chart weeks and cash changes. If an internal settlement throws, the monthly operation restores its starting state.

## Social and deals

PULSE has five post formats, captions, linked-song promotion, discovery surges, replies, industry-post support, followers distinct from true fans, engagement analytics and label scouting thresholds. Recent engaged reach affects advance capacity and minimum label shares. Up to three posts per playable month; posting alone does not guarantee discovery. The recent signal uses an eight-chart-week window. Label offers last nine chart weeks to remain actionable after a monthly advance. Notification buttons open negotiations; review, counter, sign or decline.

Deal room adds live catalog estimates, monthly valuation history, catalog-participation buybacks and full contract buyouts. Estimates use current weekly streaming royalties times 52 times a quality multiplier of 1.5–2.5. They are neither cash nor guaranteed sale quotes. A buyout combines remaining credited label investment and discounted remaining-term expected royalties. Previous label receipts and buyback payments reduce investment still priced in. Catalog participation is term-limited, including existing contracts: no new permanent ownership is imposed on old saves. Catalog buyback removes recording/download shares and halves support; a 360 share still applies to non-recording career income. Full buyout ends all future shares and support. Payments are capitalized, not immediately deducted; advances retain their prior non-recoupable taxable treatment.

## Wealth and properties

Dedicated Wealth, Properties, Team and Commerce screens have original inline SVG category art, descriptions and cost reviews. Fourteen assets cover cars, jewelry, art, homes/rental buildings, stocks, bonds and fictional crypto. All can appreciate or depreciate monthly, and physical condition affects value. Bulk maintenance restores condition; bulk renovation has three tiers, adds 5% property value and 8% future asking rent, and leaves current lease rent intact. Purchases add tax to basis rather than career expenses; sales charge 2% and only gains/losses enter taxable revenue. Distributions and rent are taxable. Fictional purchase taxes: goods 8%, property 2%, securities 0%; property tax 1% annually collected monthly. Unrealized gains are untaxed. This is a simplified game model, not a complete real-world tax implementation.

Rental management includes custom asking rent (up to three times market), 1–24-month leases, three screened applicants, reliability, projected occupancy, missed rent, arrears recovery, expiry/vacancy, upkeep and property taxes. Excessive rent reduces occupancy quadratically. Multi-unit buildings and quantity purchases currently use one aggregate tenant profile, not individual households. Renovations are capitalized in basis; rented-property operating costs are deductible. Personal property upkeep is not.

## Team, commerce and collaborations

Eleven selectable specialists cover artist managers, accountants, financial advisers, social managers and security. Competence, monthly salary and incident risk are visible before hiring. Unfunded roles pause; funded roles have explicit benefits and can suffer disclosed handling losses. Security incidents offer report, ignore or pay decisions. This is a fictional event system, not a criminal simulation.

Eight merchandise products accept custom quantity and price, incur production cost upfront, retain unsold inventory, and sell monthly according to audience and price-sensitive demand. Five rotating media-offer categories support counteroffers, acceptance and decline. Active 360 contracts share touring, merchandise and media gross, excluding investments/rents. Artist staff is monthly; existing owned-label staff still settles its disclosed weekly payroll within the monthly advance.

Songs support six distinct featured artists, with separate fees, relationships and diminishing incremental audience reach. A searchable, paginated directory provides 2,500 uniquely named additional artists across 14 genres and all seven fame tiers. Artists join the ongoing release simulation when contacted; the full directory is not simulated eagerly. Existing single-guest songs migrate through a backward-compatible guest list. Released songs display all featured names. Album assembly offers Select all/Clear for more than five eligible recordings.

Artist File is a dedicated screen with current estimated wealth and career statistics, comparing fans, cash, streams and wealth with the last visit. New chart entries after release week generate a deduplicated celebration and chart shortcut.

## Development and validation

Source modules are in src/. Run npm run build to regenerate dist/game.js and dist/server/index.js. The existing Cloudflare Worker, R2 save bindings and email-feedback integration are preserved; the save size limit grows to accommodate expanded rosters. Do not place secrets in source.

Run npm test for sandbox/name/label regression checks plus monthly year/energy preservation, new screen rendering, live Artist File, 2,500 unique directory names, six guests and save/reload, social limits/leverage, cost basis and sale-gain accounting, rentals/renovation, buyouts, merchandise/media, team payroll, delayed chart alerts, and malformed-save rejection. These are automated logic/render-string checks; physical iPhone interaction and screenshot review have not been performed. Cloudflare production deployment must be checked separately after pushing.

# ENCORE 0.5.0-beta.1 — Custom negotiations & 200 energy

All action-slot limits are removed. A new career and each new week start with 200 energy. Rest restores up to 40 once per week. Existing careers receive a one-time 200-energy migration; save/reload after that preserves remaining energy. Song creation still costs 45 total energy; feature booking costs 5, staff changes 5, counteroffers 5, and artist contract signing 10. Recurring operations remain automatic. Menus, previews and sandbox editing are free.

Contracts accept typed advances ($0 through the safe whole-dollar limit), label shares (1–90%) and durations (4–104 weeks). Artist and owned-label roster contracts offer recording, distribution and 360 types. Distribution covers recordings and album downloads with reduced support; 360 also covers live income (roster live/merch follows the model below). Each label may restrict its supported contract types.

Eight labels: Boutique, Major, Afterhours Records, Neon Circuit, Open Road Music, Atlas Worldwide, Ironlight Audio, Independent Exchange. Each has its own fan/reputation requirements, demo target, budget, baseline royalty share, reach support and preferred starting term. Several have genre interests that improve negotiation leverage. Offers vary in advance, percentage, duration and type.

Both scouted offers and successful demos open the same negotiation form. Enter terms and submit a counter; the label either accepts or sends a counter with its minimum acceptable share and affordable advance. Charisma, reputation, genre fit and marketability affect those terms. Further counters remain possible while the offer is valid and you have energy. Sign only after a separate confirmation showing the current proposal and full income scope. Existing signed contracts retain their original terms.

Validation: node tests/negotiations.mjs, node tests/label-business.mjs and node tests/lab-editor.mjs. Checks include >6 actions in a week, recovery limits, migration, save/reload, input validation, arbitrary percentages and durations, counteroffers, no premature signing, duplicate-signing prevention, distribution scope, roster accounting and expiry. Physical iPhone UI testing has not been performed here.

# ENCORE 0.4.0-beta.1 — Labels & direct features

Career → Business → Labels now supports incoming offers and demo submissions. Offers can be standard recording deals, a negotiated lower share with a smaller advance, or a 360 deal with a larger advance. Recording deals cover streaming and album downloads; 360 adds live income. Existing contracts retain their previous streaming-only scope. Deals expire without renewal.

Independent players can found a label for $25,000, 1 slot and 10 energy. Negotiate recording/360 rights, 10–80% label shares, 26/52-week terms and non-recoupable advances. Higher shares, longer terms and 360 rights raise the requested advance; relationships, reputation and A&R staff matter. Review and confirm before payment. Artists can belong to only one active player-owned contract. Maximum roster: 3, or 6 with a manager.

Staff: manager $1,500/week, marketing $2,500/week, A&R $1,000/week. Unfunded payroll pauses staff without charging that week. Marketing adds 15% to new roster-release streams while funded. A&R reduces requested advances by 15% while hired. Hiring/dismissal requires confirmation; no action slot. Weekly settlements are automatic.

Roster recording receipts use $0.50 times eligible weekly streams times the negotiated share. Pre-signing catalog is excluded, including same-week releases already present at signing. 360 live/merch gross is a simplified modeled amount every fourth contract week: fans × 0.02 × (0.5 + skill/100), then the negotiated share. 360 deals at 60%+ label share reduce the relationship by one each week. Receipts, payroll and tax accounting are tracked separately; no income is collected after expiry. Signing advances are deductible costs, not recoverable loans in this version.

Create → active song → Choose a featured artist opens genre filters, prices, access requirements, talk/negotiation and confirmed booking without leaving the project. Booking consumes no additional slot; social actions still use 1 slot and 5 energy. Weekly slots remain six while routine label work is automatic.

Implementation: src/label-business.js. Build: npm run build. Validation: node tests/label-business.mjs and node tests/lab-editor.mjs. Automated checks cover formation, confirmation, payroll, duplicate protections, revenue, expiry, import/reload, feature booking, pre-signing exclusions and insufficient payroll. Physical iPhone UI testing was not performed in this environment.

# ENCORE 0.3.3-beta.1 — Sandbox editor & title dial

Sandbox banner → Edit sandbox opens the editor for eight skills, cash, fans, energy, time slots, reputation, loyalty and every artist relationship. Save changes explicitly; normal-mode functions reject these edits. Changing a skill resets that skill’s XP. Test money is not earned revenue. Existing recordings retain their original quality.

Song and album name fields now offer a draggable rotary record dial with 40 suggestions per batch, previous/next controls, mouse wheel and arrow-key support. Custom typed names and Shuffle remain available.

The expanded generator combines thousands of names and title patterns, tracks the last 500 suggestions per category, and avoids names/titles already used in the current world and catalog. Existing artists keep their identity; new games generate a fresh cast.

Edit src/name-generator.js for vocabulary and src/lab-editor.js for sandbox/dial behavior. Version and build use the existing GitHub/Cloudflare pipeline.

# ENCORE — Studio & Career update · 0.3.2-beta.1

This update is based on the GitHub/Cloudflare build and preserves the existing R2 save bucket and feedback email binding.

- Swipeable radio selectors for creative direction, production budget and album pricing; keyboard access remains available.
- Eight creative directions affect craft weights, debut reach, fan conversion, discovery and longevity.
- Active drafts, parked projects and unstarted song ideas persist between weeks. Resume projects from Create → Project library. A same-revision local checkpoint can recover a change interrupted before its server save; it never overrides a conflicting server revision.
- Six targeted marketing channels, up to two different channels per week. Review costs, target and expected reach before booking. Existing campaign budgets and four-week rollouts remain.
- Album downloads priced at $5, $10, $15 or $20. Prices change future demand; downloads enter cash, taxes, overhead, album chart units and certifications. Streaming payout remains $0.50. Historical sales are not invented.
- Settings in the persistent header. Career grouped into Overview, Business, Legacy and Manage. Navy, teal and gold Career edition.
- Weekly recap omits already-paid action expenses; full weekly accounting remains in Finances.

Validation: automated checks cover all three draft stages across week advance and save/reload; parked project swaps; pending idea recovery and conflicting saves; campaign targeting/limits; import validation; paid album units and no duplicate income; normal and sandbox modes. Physical iPhone layout has not been verified in this environment.

Editable gameplay/UI extension: `src/experience.js`. Main simulation: `src/core.js`. Styles: `dist/index.html`. Build with `npm run build`; do not edit generated `dist/game.js` or `dist/server/index.js` directly.

# ENCORE — full editable project

This beta export includes version labels, known issues, tester checklist, player-controlled report sharing, backup reminders, and a title screen shown at every launch, portable career export/import, recovery snapshots, optional isolated practice, five tour venue tiers, three recording budgets, multi-week album campaigns, incoming career offers, 26-week label contracts, annual ENCORE Record Awards, audience churn, release lifecycle/genre fit, career milestones, and optional replayable tutorial, light/dark mode, condensed Home, and background-based starting skills and fans, 100 starting energy, six starting time slots, achievement collection and memo briefings, weekly song and album chart history, automatic song/album certifications, redesigned career profile, large-number denominations through decillion, installable offline edition at /offline, income taxes, career overhead, NO living-cost charges, separate sandbox, live career profile, dedicated Stats tab, independent abilities, progressive energy-based XP training, song quality and commercial potential, local touring, 50-cent stream payouts, six weekly slots, +40 weekly energy, charts, collaborations, albums, and save support. No ChatGPT credentials or player save data are included. You can edit this source without ChatGPT credits.

## Update your existing Codespaces project
Back up or commit your own edits first. Extract this ZIP, then replace the matching files inside your existing ENCORE folder. Keep your own wrangler.jsonc if you already configured hosting, and preserve your package-lock.json and local .wrangler storage. Stop the running preview with Ctrl+C, then run npm run dev inside ENCORE again. Commit the updated files to GitHub when ready. This does not automatically change your hosted website.

## Charts and certifications
Chart issues publish when you advance the week. Song Top 100 ranks weekly streams; Album Top 50 ranks stream-equivalent units (1,500 streams per unit). Stable release IDs preserve movement, re-entry, debut, peak and weeks charted. Older saves retain known peaks and counts but never invent missing history. Player chart paths retain 52 chart events; NPC paths retain 12. Inactive NPC chart detail is archived after 26 weeks. Aggregate player counts persist. NPC catalogs keep their most recent 60 projects; player releases are retained.

Game certifications: 150 song streams per unit, 1,500 album track streams per unit. Gold 500,000 units, Platinum 1 million, further Platinum multiples every million, Diamond 10 million. These are worldwide game achievements, not official RIAA awards. Album totals include member tracks' pre-album streams but do not add duplicate career streams or royalties.

## Quick editing map
- Player starting money and fans: baseFresh() in src/core.js. Edit src/core.js, src/career-systems.js, and src/save-tools.js, and src/beta.js; dist/game.js is generated by npm run build.
- Sandbox starting values and example songs: fresh().
- Streaming payout: royalties calculation in advance().
- Income-tax brackets: taxDue(). These remain simplified fictional game rules.
- Career overhead percentages: operationRate().
- Weekly accounting and annual tax settlement: closeFinances().
- Skill progression: xpNeeded(), trainStat(), scoreSong().
- Career profile and finance screens: careerProfile(), financeScreen().

Normal game: /. Sandbox: /sandbox, with its own cookie and save storage. Standalone uses ?sandbox=1 with a separate local save. Removing living costs stops future charges; historical balances and reports are retained.

## Offline on iPhone
Open your hosted /offline page in Safari while connected. Wait for Ready for offline play, then Share → Add to Home Screen. Open the saved web app while connected once and wait for Ready for offline play before using airplane mode. The offline edition starts a separate device-local career and does not sync to your online save. Clearing site data removes it. Keep regular browser mode; storage and installation support depend on your browser. Updates download while connected and activate after old tabs close. Normal offline and sandbox saves remain separate.

Large balances use K, M, B, T, Qa, Qi, Sx, Sp, Oc, No and Dc (thousand through decillion). Cash details spell out the denomination. Cash transactions use a string-backed integer cents ledger, preserving small purchases at huge balances. Stream counts and calculated earnings still use approximate JavaScript numbers at extreme scales.

## Keep it in Files
Download ENCORE-Source.zip and save it to Files. Extract it to see the ENCORE folder. On iPhone, tapping the ZIP in Files normally extracts it. HTML previews in Files may not run games; use a desktop browser or host it to play reliably.

## Two ways to run
1. ENCORE-Standalone.html: single-file edition for a desktop browser. Its save is local to that browser. Some browsers restrict storage for local files; serving it from localhost avoids file URL restrictions. It does not use or retrieve your live website save.
2. Full project: the hosted version uses a Cloudflare Worker and an R2 bucket for guest saves. A secure browser cookie identifies the guest. No ChatGPT login is needed.

## Put the source in GitHub
Create a repository under your own GitHub account (private is a sensible starting point). Extract the ZIP first. In the repository choose Add file → Upload files, then upload the CONTENTS of the ENCORE folder, preserving src/, dist/ and server/. Commit the changes. Uploading only the ZIP stores an archive, not an editable project tree. Folder upload is easier on a computer. Never upload credentials or .env files.

GitHub stores your source; it does not automatically run the save server. The full project cannot run on GitHub Pages unchanged because Pages does not run this Worker API. You can host the standalone edition as a static index.html, but it uses device-local saves rather than server saves.

## Edit these files
- dist/game.js: gameplay rules, stat improvements, screens and text.
- dist/index.html: layout, styling and the shell.
- server/worker.mjs: server saving and guest cookie handling.
- build.mjs: embeds the HTML and game script into the Worker.
- dist/server/index.js: generated output; rebuild instead of editing it.

The dist folder currently contains editable frontend source. Do not delete it as disposable build output.

## Run locally on a computer
Install a current Node.js LTS release. Open a terminal inside ENCORE:

    npm install
    npm run dev

Open the address printed by Wrangler. The dev environment uses local emulated storage; it does not include live players' saves. A generated package-lock.json should be committed to your GitHub repository after installation.

## Deploy on your own Cloudflare account
You need a Cloudflare account and R2 enabled. Check your account's current pricing and billing requirements before enabling services. No hosting plan or permanent free usage is promised here.

    npm install
    npx wrangler login
    npx wrangler r2 bucket create encore-saves
    npm run deploy

If you already created that bucket, skip the create command. If you choose another bucket name, update wrangler.jsonc. The BUCKET binding must remain BUCKET unless you also change the server code. The deployment command prints your new site address.

For future changes: edit the source, test with npm run dev, then npm run deploy. Keep the same bucket so stored careers remain. Save data uses schemaVersion 1; incompatible future changes require a migration rather than wiping player data.

## Save limitations
This export contains the code, NOT your existing career or other players' data. Moving to another domain or hosting account does not automatically transfer current saves or their guest cookies. The live site's careers continue to belong to its existing storage. Use Career → Saves → Export career on the old site, then Import save on the new one. Preview the artist, week and mode before replacement. Normal and sandbox transfers must match modes. One device-local recovery snapshot is saved before replacement or week advance; keep downloaded backups too. Wait for the saved indicator before closing a game.

## Official references
https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
https://developers.cloudflare.com/r2/reference/wrangler-commands/
https://developers.cloudflare.com/workers/wrangler/configuration/

