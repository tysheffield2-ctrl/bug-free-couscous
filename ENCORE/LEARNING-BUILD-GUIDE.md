# ENCORE Build & Coding Guide — Portrait Pass

This report explains the commands used to update ENCORE and what each one does.

## 1. Repo layout

- `ENCORE/src/` — editable gameplay and UI JavaScript modules.
- `ENCORE/tests/` — regression tests.
- `ENCORE/build.mjs` — combines the source modules into the browser build.
- `ENCORE/dist/` — generated output. Avoid hand-editing generated files when a source file exists.
- `ENCORE/server/worker.mjs` — Cloudflare Worker source.
- `ENCORE/wrangler.jsonc` — Cloudflare Worker configuration.

## 2. Core terminal commands

```bash
cd /workspaces/bug-free-couscous/ENCORE
```
Moves the terminal into the ENCORE project folder.

```bash
git status
```
Shows your current branch and any changed files.

```bash
git pull origin main
```
Downloads the newest `main` branch from GitHub into your Codespace.

```bash
npm test
```
Runs the build and every ENCORE regression test. Do this before deployment.

```bash
npm run build
```
Runs `node build.mjs`. ENCORE concatenates its source modules in the order listed inside `build.mjs`, writes `dist/game.js`, rebuilds the HTML styles, and rebuilds `dist/server/index.js` for Cloudflare.

```bash
npm run dev
```
Builds ENCORE and starts Wrangler's local development server.

```bash
npm run deploy
```
Builds ENCORE and deploys the generated Worker to Cloudflare.

## 3. Safe Git workflow for your own changes

Start from an up-to-date `main`:

```bash
git pull origin main
git checkout -b my-change
```

Make your edit, then:

```bash
git add .
git commit -m "Describe what I changed"
git push -u origin my-change
```

- `git add .` stages your edits.
- `git commit` creates a saved checkpoint in Git history.
- `git push` sends that branch to GitHub.

Run `npm test` before merging the branch into `main`.

## 4. How ENCORE modules work

ENCORE is not yet using ES module imports for most gameplay code. `build.mjs` reads the files in a specific order and concatenates them into one browser script. A module loaded later can extend or replace behavior defined earlier.

The unique-portrait system lives in `src/v085-unique-portraits.js`. It loads after the older portrait compatibility layers, which lets it become the final portrait renderer for the 18 core artists without rewriting older saves.

## 5. The permanent portrait rule

The core cast contains 18 artists. Each has one permanent `portraitId`:

- `artist-01`
- `artist-02`
- ...
- `artist-18`

New careers also use a canonical 18-person cast so obvious names, gender presentation, genre, and portrait identity stay matched. Existing careers keep their current NPC names, relationships, catalog history, and stats; migration only adds stable unique portrait IDs.

The portrait ID is saved on the artist object and reused anywhere that artist appears.

## 6. How the current portrait art works

For this build, the 18 core portraits are generated as 18 distinct SVG image data URLs inside `v085-unique-portraits.js`. They are rendered with normal `<img>` elements because Safari previously failed to display large CSS-background portrait data URLs reliably.

This is intentionally separated from the identity system: later, you can replace the visual source with licensed PNG/WebP artwork while keeping the same `portraitId` values and all save data.

## 7. Replacing the portraits with an art pack later

The easiest long-term upgrade is:

1. Buy/download a portrait pack that allows commercial game use.
2. Choose 18 portraits with a consistent style.
3. Crop them to the same square aspect ratio.
4. Name them consistently, such as `artist-01.webp` through `artist-18.webp`.
5. Put them in an `assets/portraits/` folder.
6. Update `v085-unique-portraits.js` or `build.mjs` so each `portraitId` resolves to the matching file.
7. Run:

```bash
npm test
npm run deploy
```

Keep the IDs the same and you will not need to rewrite careers or relationships.

## 8. A good first coding exercise

Try changing one core artist in `src/v085-unique-portraits.js`:

- change the display name;
- change the genre;
- change one portrait accent/background value.

Then run:

```bash
npm test
npm run dev
```

That lets you see the full edit → build → test → preview loop without touching financial or save logic.

## 9. Cloudflare login from Codespaces

If normal Wrangler login times out inside Codespaces, use:

```bash
npx wrangler login --device
```

After approval:

```bash
npm run deploy
```

## 10. Art licensing checklist

Before adding third-party portrait art, confirm:

- commercial game use is allowed;
- cropping/resizing/editing is allowed;
- whether attribution is required;
- the images may be distributed as part of the finished game;
- you are not allowed to redistribute the original pack separately;
- keep the license/readme and purchase receipt with your project records.

Do not commit the seller's original ZIP file into a public GitHub repository when the license prohibits redistribution.
