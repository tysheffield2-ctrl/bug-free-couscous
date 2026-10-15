# UI2 weekly playtest — 2026-10-15

Entry points: `/ui2` (existing normal career) and `/ui2/sandbox` (separate sandbox career). The page header says “Week engine playtest.” If no career exists, follow the setup link, create/restore the appropriate career, then return to UI2.

## Implemented

- `engine/releases.js` owns player debut and catalog stream settlement.
- `engine/weekly.js` owns the weekly phase sequence. The legacy interface calls the same functions.
- UI2 advances one week through a dedicated Worker, retaining monthly business and annual tax settlement, chart records, audience updates, touring, contracts and AI careers.
- Explicit confirmation, saved recap, 200-energy refill and reload continuity.
- Latest-save read and conditional write; week advancement never retries a 409 automatically. Stale confirmation and duplicate clicks are blocked.
- A best-effort pre-advance recovery copy is stored on the device under `encore-ui2-recovery-career` or `encore-ui2-recovery-sandbox`.
- Fixed repeated DOM mutations in Quick Moves and sandbox identity that could starve the UI event loop.
- Corrected stale Studio/Audience architecture assertions and command test setup. Built inline JavaScript is now syntax-checked, and replacement callbacks preserve literal dollar sequences.

## Architecture boundary

This is a playable weekly-loop candidate, not a declaration that UI2 has replaced every legacy feature. The worker host still includes the existing subsystem definitions, with rendering, timers, storage and network persistence disabled. Several hooks still depend on legacy lexical state. It is a transitional compatibility runtime, not a completed pure engine. The legacy renderer must not be deleted yet. Touring/business management and other UI2 controls that remain informational still require their native command migration.

## Verification

- `npm test`: full regression command, including historical saves, long careers and touring histories.
- `node tests/ui2-week.mjs`: full serialized state equality against the pinned pre-extraction weekly implementation across four historical fixtures and ordinary/month/year closes; mode and invalid-save rejection.
- `ENCORE_JSDOM=/path/to/jsdom/lib/api.js node tests/ui2-dom.mjs`: actual built UI scripts, isolated worker code and server save handler, with in-memory storage; covers normal/sandbox, cancel, conditional save, recap, reload, duplicate click, stale confirmation and 409 without replay.
- `node scripts/test-ui2-browser.mjs`: optional Playwright mobile acceptance test. Requires Playwright and Chromium; `ENCORE_CHROMIUM` can specify an installed executable. Local Chromium execution was blocked by environment process/socket permissions, so a real-browser pass is not claimed.

## Suggested playtest

1. Open sandbox UI2 in the same browser where your sandbox save lives.
2. Work, practice, or create/record/mix/release a song.
3. Home → Advance week → Advance one week.
4. Check the saved recap, then Continue. Verify the week, energy, cash, charts and touring state.
5. Reload and confirm the same progress remains.
