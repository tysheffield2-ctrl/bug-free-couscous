import assert from 'node:assert/strict';
import fs from 'node:fs';

const html=fs.readFileSync(new URL('../ui2/index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../ui2/ui2.css',import.meta.url),'utf8')+'\n'+fs.readFileSync(new URL('../ui2/phase2.css',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('../ui2/app-v2.js',import.meta.url),'utf8');
const built=fs.readFileSync(new URL('../dist/ui2.html',import.meta.url),'utf8');
const worker=fs.readFileSync(new URL('../dist/server/index.js',import.meta.url),'utf8');

for(const forbidden of ['class="card','class="panel','project-row','metric-card','offer-card']){
  assert.equal(html.includes(forbidden)||css.includes(forbidden)||js.includes(forbidden),false,`UI2 must not inherit legacy presentation primitive: ${forbidden}`)
}
assert.equal(html.includes('/game.js'),false,'UI2 must not load the legacy game renderer');
assert.equal(built.includes('/game.js'),false,'built UI2 must remain isolated from legacy game renderer');
assert.ok(js.includes("fetch('/api/save'"),'UI2 reads the existing career save directly');
for(const screen of ['homeScreen()','artistScreen()','businessScreen()','studioScreen()','chartScreen()'])assert.ok(js.includes(screen),`missing rebuilt ${screen}`);
for(const destination of ['Studio','Charts','Home','Business','More'])assert.ok(js.includes(`'${destination}'`),`missing UI2 nav destination ${destination}`);
assert.ok(css.includes('.ui2-home-hero'));
assert.ok(css.includes('.ui2-artist-hero'));
assert.ok(css.includes('.ui2-business-ledger'));
assert.ok(css.includes('.ui2-studio-room'));
assert.ok(css.includes('.ui2-waveform'));
assert.ok(css.includes('.ui2-chart-list'));
assert.ok(css.includes('.ui2-chart-row'));
assert.ok(js.includes('RECORD IDENTITY'));
assert.ok(js.includes('Global Top 100'));
assert.ok(js.includes('Global Albums 50'));
assert.equal(js.includes("placeholderScreen('Studio'"),false,'Studio cannot fall back to a placeholder');
assert.equal(js.includes("placeholderScreen('Charts'"),false,'Charts cannot fall back to a placeholder');
assert.ok(built.includes('UI2'));
assert.ok(built.includes('ui2-bottomnav'));
assert.ok(built.includes('Make the record.'));
assert.ok(built.includes('Global Top 100'));
assert.ok(worker.includes("'/ui2'"));
assert.ok(worker.includes("'/preview-ui2'"));
assert.ok(worker.includes('const UI2_HTML='));

console.log('PASS ENCORE UI2 is an independent non-card renderer with native Home, Artist File, Business HQ, Studio and Charts screens.');