import assert from 'node:assert/strict';
import fs from 'node:fs';

const html=fs.readFileSync(new URL('../ui2/index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../ui2/ui2.css',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('../ui2/ui2.js',import.meta.url),'utf8');
const built=fs.readFileSync(new URL('../dist/ui2.html',import.meta.url),'utf8');
const worker=fs.readFileSync(new URL('../dist/server/index.js',import.meta.url),'utf8');

for(const forbidden of ['class="card','class="panel','project-row','metric-card','offer-card']){
  assert.equal(html.includes(forbidden)||css.includes(forbidden)||js.includes(forbidden),false,`UI2 must not inherit legacy presentation primitive: ${forbidden}`)
}
assert.equal(html.includes('/game.js'),false,'UI2 must not load the legacy game renderer');
assert.ok(js.includes("fetch('/api/save'"),'UI2 reads the existing career save directly');
for(const screen of ['homeScreen()','artistScreen()','businessScreen()'])assert.ok(js.includes(screen),`missing rebuilt ${screen}`);
for(const destination of ['Studio','Charts','Home','Business','More'])assert.ok(js.includes(`'${destination}'`),`missing UI2 nav destination ${destination}`);
assert.ok(css.includes('.ui2-home-hero'));
assert.ok(css.includes('.ui2-artist-hero'));
assert.ok(css.includes('.ui2-business-ledger'));
assert.ok(built.includes('UI2 PREVIEW'));
assert.ok(built.includes('ui2-bottomnav'));
assert.ok(worker.includes("'/ui2'"));
assert.ok(worker.includes("'/preview-ui2'"));
assert.ok(worker.includes('const UI2_HTML='));

console.log('PASS ENCORE UI2 is an independent non-card renderer with Home, Artist File, Business HQ and isolated preview routes.');
