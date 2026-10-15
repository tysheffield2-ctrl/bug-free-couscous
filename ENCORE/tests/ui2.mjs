import assert from 'node:assert/strict';
import fs from 'node:fs';

const html=fs.readFileSync(new URL('../ui2/index.html',import.meta.url),'utf8');
const css=[
  fs.readFileSync(new URL('../ui2/ui2.css',import.meta.url),'utf8'),
  fs.readFileSync(new URL('../ui2/phase2.css',import.meta.url),'utf8'),
  fs.readFileSync(new URL('../ui2/phase3.css',import.meta.url),'utf8'),
  fs.readFileSync(new URL('../ui2/phase4.css',import.meta.url),'utf8')
].join('\n');
const js=[
  fs.readFileSync(new URL('../ui2/commands.js',import.meta.url),'utf8'),
  fs.readFileSync(new URL('../ui2/app-v2.js',import.meta.url),'utf8'),
  fs.readFileSync(new URL('../ui2/phase3.js',import.meta.url),'utf8'),
  fs.readFileSync(new URL('../ui2/mode.js',import.meta.url),'utf8')
].join('\n');
const built=fs.readFileSync(new URL('../dist/ui2.html',import.meta.url),'utf8');
const worker=fs.readFileSync(new URL('../dist/server/index.js',import.meta.url),'utf8');

for(const forbidden of ['class="card','class="panel','project-row','metric-card','offer-card']){
  assert.equal(html.includes(forbidden)||css.includes(forbidden)||js.includes(forbidden),false,`UI2 must not inherit legacy presentation primitive: ${forbidden}`)
}
assert.equal(html.includes('/game.js'),false,'UI2 must not load the legacy game renderer');
assert.equal(built.includes('/game.js'),false,'built UI2 must remain isolated from legacy game renderer');
assert.ok(js.includes("fetch('/api/save'"),'UI2 source reads the existing career save directly before build routing');
for(const screen of ['homeScreen()','artistScreen()','businessScreen()','studioScreen()','chartScreen()','touringScreen(state)','pulseScreen(state)'])assert.ok(js.includes(screen),`missing rebuilt ${screen}`);
for(const destination of ['Studio','Charts','Home','Business','More'])assert.ok(js.includes(`'${destination}'`),`missing UI2 nav destination ${destination}`);
assert.ok(css.includes('.ui2-home-hero'));
assert.ok(css.includes('.ui2-artist-hero'));
assert.ok(css.includes('.ui2-business-ledger'));
assert.ok(css.includes('.ui2-studio-room'));
assert.ok(css.includes('.ui2-waveform'));
assert.ok(css.includes('.ui2-chart-list'));
assert.ok(css.includes('.ui2-chart-row'));
assert.ok(css.includes('.ui2-tour-map-svg'));
assert.ok(css.includes('.ui2-pulse-feed'));
assert.ok(css.includes('.ui2-train-action'));
assert.ok(css.includes('.ui2-sandbox-mode'));
assert.ok(css.includes('.ui2-lab-mark'));
assert.ok(js.includes('RECORD IDENTITY'));
assert.ok(js.includes('Global Top 100'));
assert.ok(js.includes('Global Albums 50'));
assert.ok(js.includes('TOURING 2.0'));
assert.ok(js.includes('PULSE · IN-GAME SOCIAL'));
assert.ok(js.includes('ENCORE_UI2_COMMAND_CORE'));
assert.ok(js.includes("dataset.ui2Command='work'"));
assert.ok(js.includes("dataset.ui2Command='rest'"));
assert.ok(js.includes("dataset.ui2Command='train'"));
assert.ok(js.includes("dataset.ui2Command='release-shelf'"));
assert.ok(js.includes("dataset.ui2Command='release-draft'"));
assert.ok(js.includes("'/api/sandbox/save'"));
assert.ok(js.includes('UI2 LAB'));
assert.equal(js.includes("placeholderScreen('Studio'"),false,'Studio cannot fall back to a placeholder');
assert.equal(js.includes("placeholderScreen('Charts'"),false,'Charts cannot fall back to a placeholder');
assert.ok(built.includes('UI2'));
assert.ok(built.includes('ui2-bottomnav'));
assert.ok(built.includes('Make the record.'));
assert.ok(built.includes('Global Top 100'));
assert.ok(built.includes('TOURING 2.0'));
assert.ok(built.includes('PULSE · IN-GAME SOCIAL'));
assert.ok(built.includes('ENCORE_UI2_COMMANDS'));
assert.ok(built.includes('ENCORE_UI2_SAVE_URL'));
assert.ok(worker.includes("'/ui2'"));
assert.ok(worker.includes("'/preview-ui2'"));
assert.ok(worker.includes("'/ui2/sandbox'"));
assert.ok(worker.includes("'/preview-ui2/sandbox'"));
assert.ok(worker.includes('const UI2_HTML='));

console.log('PASS ENCORE UI2 is an independent non-card renderer with seven native screens, playable safe actions, Studio releases, and isolated normal/sandbox career modes.');