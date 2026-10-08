# Deploy ENCORE 0.9.1-beta.2

This guide is for the existing Cloudflare application serving encoremusicsim.com. Source publication and a green GitHub check do not themselves publish the game. The current release work is in PR #14 on `feature/touring-2-living-world`.

## Before deploying

1. Export your normal career and sandbox from the current game’s Saves screen. Keep those files.
2. In GitHub, open PR #14 and confirm ENCORE CI passes on its latest commit. Prepare the hosting settings below before merging into `main`, so an automatic deployment uses the correct output. Do not merge the older Studio/foundation PRs separately; this branch includes their work.
3. In Cloudflare → Workers & Pages, open the existing ENCORE application attached to your domain. Check whether its type is **Pages** or **Worker**, then use the corresponding instructions below. Do not create a replacement application or change the domain.
4. Preserve the production R2 binding: variable **BUCKET**, bucket **encore-saves**. Existing saves use this bucket and the existing domain’s guest cookies. Keep existing feedback/email bindings and environment variables.

## If the existing application is Pages with GitHub connected

In the application’s build settings, use:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | None |
| Root directory | `ENCORE` |
| Build command | `npm run build:pages` |
| Build output directory | `dist/pages` |

The output contains `_worker.js` plus art and portrait assets. It serves the game, save API, offline routes and version endpoint through Pages advanced mode. Uploading only HTML/game.js omits the save server.

Under Settings → Bindings, confirm an R2 binding named `BUCKET` points to the existing `encore-saves` bucket in production. If the binding was changed, redeploy for it to take effect. Preserve existing bindings; do not provision an empty replacement bucket.

Save the build settings first. Then merge PR #14 into `main` and let the Git integration deploy, or create the production deployment from that merged commit. Check its commit matches this release and wait for Cloudflare to report success. Do not retry an old deployment commit expecting new code.

If Cloudflare was already building automatically when you merged, its first attempt may have used the old settings. Redeploy after saving the settings above.

## If the existing Pages application uses manual folder uploads

On your Mac, open the repository’s `ENCORE` folder in Terminal. Get the finished source before building:

```sh
git fetch origin
git switch feature/touring-2-living-world
git pull --ff-only origin feature/touring-2-living-world
npm install
npm run build:pages
```

In the existing Pages project, choose **Create deployment**, choose **Production**, and upload the **contents of `ENCORE/dist/pages`**, with `_worker.js` at the upload root. The folder also includes `_routes.json`, `art`, and `portraits`. Keep the production `BUCKET` binding. This advanced-mode worker file is supported by Cloudflare’s dashboard upload; a separate `functions` directory would require a different deployment path.

Alternatively, from `ENCORE`, log into Cloudflare with `npx wrangler login`, then deploy the generated directory using the Pages CLI and your existing project name. Do not run the Worker deploy script for a Pages project.

## If the existing application is a Worker

The repository’s `wrangler.jsonc` is a Workers configuration. Its configured Worker name is `encore-artist-sim`. Verify that this is the Worker serving your existing domain before deploying; use the existing name if it differs.

From the updated repository’s `ENCORE` directory:

```sh
npm install
npx wrangler login
npm run deploy
```

This builds `dist/server/index.js` and deploys it with `public/` assets. Preserve `BUCKET → encore-saves`, feedback variables, email binding and the existing custom domain. Do not substitute `dist/pages` into the Workers assets setting.

## Verify that deployment worked

1. Open `https://encoremusicsim.com/api/version`. The response must be `{"version":"0.9.1-beta.2"}`.
2. Reload the normal game and check Settings shows the same version. Confirm the title screen, Studio and Touring open. A 404 on `/api/version` means you are still on an older build or serving the wrong output.
3. On your phone, use **sandbox** to add/edit a tour stop, review the deposit, perform a show, open its expense report and PULSE reaction, export the save and reload. Confirm the sandbox remains separate from your normal career.
4. Restore your existing normal career and check its artist, week, songs, cash and active tour before advancing. Do not reset a career to troubleshoot a deployment.
5. Check `/offline` and `/offline/sandbox` online first, then let the offline install/update complete and test without a connection. Confirm art loads. Reopen the offline app after updates; a running old tab can retain an earlier build.
6. If saving says unavailable, check the production R2 binding first. The `/api/version` endpoint is read-only and does not verify the storage binding.

A previous Cloudflare deployment can restore old code, but it does not undo changes already written to R2. Keep pre-update exports and avoid opening schema-2 saves in an older client.

## Scope of this release

This is a beta release of the Studio, readiness foundation, living-city and Touring 2.0 work. It is not the entire 1.0 roadmap. Festivals, advanced ticket-sales pacing, generational AI careers and the later relationship/awards/legacy overhauls remain documented in CONTINUE-ROADMAP.md.

Official deployment references, checked October 8, 2026:

- https://developers.cloudflare.com/pages/functions/advanced-mode/
- https://developers.cloudflare.com/pages/functions/bindings/
- https://developers.cloudflare.com/pages/get-started/direct-upload/
- https://developers.cloudflare.com/workers/wrangler/commands/workers/
