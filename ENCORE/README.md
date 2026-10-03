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

