# ENCORE — full editable project

This export includes the dedicated Training screen, 50-cent stream payouts, six weekly slots, +40 weekly energy, charts, collaborations, albums, and save support. No ChatGPT credentials or player save data are included. You can edit this source without ChatGPT credits.

## Keep it in Files
Download ENCORE-Source.zip and save it to Files. Extract it to see the ENCORE folder. On iPhone, tapping the ZIP in Files normally extracts it. HTML previews in Files may not run games; use a desktop browser or host it to play reliably.

## Two ways to run
1. ENCORE-Standalone.html: single-file edition for a desktop browser. Its save is local to that browser. Some browsers restrict storage for local files; serving it from localhost avoids file URL restrictions. It does not use or retrieve your live website save.
2. Full project: the hosted version uses a Cloudflare Worker and an R2 bucket for guest saves. A secure browser cookie identifies the guest. No ChatGPT login is needed.

## Put the source in GitHub
Create a repository under your own GitHub account (private is a sensible starting point). Extract the ZIP first. In the repository choose Add file → Upload files, then upload the CONTENTS of the ENCORE folder, preserving dist/ and server/. Commit the changes. Uploading only the ZIP stores an archive, not an editable project tree. Folder upload is easier on a computer. Never upload credentials or .env files.

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
This export contains the code, NOT your existing career or other players' data. Moving to another domain or hosting account does not automatically transfer current saves or their guest cookies. The live site's careers continue to belong to its existing storage. A future save export/import feature would be needed for player-controlled transfers. Wait for the saved indicator before closing a game.

## Official references
https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
https://developers.cloudflare.com/r2/reference/wrangler-commands/
https://developers.cloudflare.com/workers/wrangler/configuration/
