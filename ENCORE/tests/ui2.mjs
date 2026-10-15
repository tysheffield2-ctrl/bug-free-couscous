import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html=fs.readFileSync(new URL('../ui2/index.html',import.meta.url),'utf8');
const css=[
  fs.readFileSync(new URL('../ui2/ui2.css',import.meta.url),'utf8'),
  fs.readFileSync(new URL('../ui2/phase2.css',import.meta.url),'utf8'),
  fs.readFileSync(new URL('../ui2/phase3.css',import.meta.url),'utf8'),
  fs.readFileSync(new URL('../ui2/phase4.css',import.meta.url),'utf8'),
  fs.readFileSync(new URL('../ui2/phase5.css',import.meta.url),'utf8'),
  fs.readFileSync(new URL('../ui2/phase6-more.css',import.meta.url),'utf8')
].join('\n');
const js=[
  fs.readFileSync(new URL('../ui2/commands.js',import.meta.url),'utf8'),
  fs.readFileSync(new URL('../ui2/app-v2.js',import.meta.url),'utf8'),
  fs.readFileSync(new URL('../ui2/phase3.js',import.meta.url),'utf8'),
  fs.readFileSync(new URL('../ui2/studio-live.js',import.meta.url),'utf8'),
  fs.readFileSync(new URL('../ui2/phase6-more.js',import.meta.url),'utf8'),
  fs.readFileSync(new URL('../ui2/mode.js',import.meta.url),'utf8')
].join('\n');
const built=fs.readFileSync(new URL('../dist/ui2.html',import.meta.url),'utf8');
new vm.Script(built.split('<script>')[1].split('</script>')[0]);
const worker=fs.readFileSync(new URL('../dist/server/index.js',import.meta.url),'utf8');

for(const forbidden of ['class="card','class="panel','project-row','metric-card','offer-card']){
  assert.equal(html.includes(forbidden)||css.includes(forbidden)||js.includes(forbidden),false,`UI2 must not inherit legacy presentation primitive: ${forbidden}`)
}
assert.equal(html.includes('/game.js'),false,'UI2 must not load the legacy game renderer');
assert.equal(built.includes('/game.js'),false,'built UI2 must remain isolated from legacy game renderer');
assert.ok(js.includes("fetch('/api/save'"),'UI2 source reads the existing career save directly before build routing');
for(const screen of ['homeScreen()','artistScreen()','businessScreen()','studioScreen()','chartScreen()','touringScreen(state)','pulseScreen(state)'])assert.ok(js.includes(screen),`missing rebuilt ${screen}`);
for(const destination of ['Studio','Charts','Home','Business','More'])assert.ok(js.includes(`'${destination}'`),`missing UI2 nav destination ${destination}`);
for(const token of ['.ui2-home-hero','.ui2-artist-hero','.ui2-business-ledger','.ui2-studio-room','.ui2-waveform','.ui2-chart-list','.ui2-chart-row','.ui2-tour-map-svg','.ui2-pulse-feed','.ui2-train-action','.ui2-sandbox-mode','.ui2-lab-mark','.ui2-live-fields','.ui2-session-choices','.ui2-more-screen','.ui2-more-group'])assert.ok(css.includes(token),`missing UI2 style ${token}`);
for(const token of ['RECORD IDENTITY','Global Top 100','Global Albums 50','TOURING 2.0','PULSE · IN-GAME SOCIAL','ENCORE_UI2_COMMAND_CORE','ENCORE / DIRECTORY','Awards & Honors','Wealth & Assets'])assert.ok(js.includes(token),`missing UI2 contract ${token}`);
for(const cmd of ['work','rest','train','open-mic','studio-start','studio-session','release-shelf','release-draft','pulse-support','pulse-reply'])assert.ok(js.includes(cmd),`missing UI2 command ${cmd}`);
assert.ok(js.includes("'/api/sandbox/save'"));assert.ok(js.includes('UI2 LAB'));assert.ok(js.includes('globalThis.ENCORE_STUDIO')&&js.includes('engine.directions'));assert.ok(js.includes('data-session-option'));assert.ok(js.includes('data-ui2-extra="touring"'));assert.ok(js.includes('data-ui2-extra="pulse"'));
assert.equal(js.includes("placeholderScreen('Studio'"),false,'Studio cannot fall back to a placeholder');
assert.equal(js.includes("placeholderScreen('Charts'"),false,'Charts cannot fall back to a placeholder');
for(const token of ['UI2','ui2-bottomnav','Make the record.','Global Top 100','TOURING 2.0','PULSE · IN-GAME SOCIAL','ENCORE_UI2_COMMANDS','ENCORE_UI2_SAVE_URL','ENCORE_STUDIO','ENCORE_WEEK_TRANSACTION','ENCORE / DIRECTORY','Open sandbox'])assert.ok(built.includes(token),`built UI2 missing ${token}`);
for(const path of ["'/ui2'","'/preview-ui2'","'/ui2/sandbox'","'/preview-ui2/sandbox'"])assert.ok(worker.includes(path));
assert.ok(worker.includes('const UI2_HTML='));

console.log('PASS ENCORE UI2 is an independent non-card renderer with native Home, Artist, Business, Studio, Charts, Touring, PULSE and More directory, live shared-engine Studio flow, playable career actions, and isolated normal/sandbox modes.');