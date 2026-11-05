import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',144051);await h.run('boot()');
h.run(`s.started=true;s.cash=1000000;s.energy=200;s.fans=100000;s.studioIdea={title:'',mood:directions[0].id,package:'0'};`);
const shell=fs.readFileSync(new URL('../dist/native-shell.js',import.meta.url),'utf8');
h.run(shell);h.run('V137_installShell()');

assert.match(h.run('studio()'),/v143-song-create/);
assert.ok(!h.run('studio().includes("Start your next record")'));
const art=h.run("V143_serviceOptions('artistry')"),writers=h.run("V143_serviceOptions('writing')");
for(const choices of [art,writers])for(let i=1;i<choices.length;i++){
 assert.ok(choices[i].cost>=choices[i-1].cost,'higher-quality provider must not become cheaper');
 assert.ok(choices[i].quality>=choices[i-1].quality,'provider quality must grow');
}
h.run("V143_remember('title','Unsent Record');V143_cycleValue('artistryIndex',5,1);V143_cycleValue('writingIndex',5,2);V143_toggleExplicit()");
assert.equal(h.run('s.studioIdea.title'),'Unsent Record');
assert.equal(h.run('Number(s.studioIdea.artistryIndex)'),1);
assert.equal(h.run('Number(s.studioIdea.writingIndex)'),2);
assert.equal(h.run('!!s.studioIdea.explicit'),true);
assert.ok(h.run('V143_total()')>=4000);
h.run('V143_back()');
assert.equal(h.run('s.studioIdea.title'),'Unsent Record','navigation may not discard the writing idea');
assert.match(h.run('studio()'),/Unsent Record/);
h.run(`V143_submitSong({preventDefault(){},target:{songtitle:'Unsent Record',mood:directions[0].id,brief:'story',package:'0'}})`);
assert.equal(h.run('s.draft.title'),'Unsent Record');
assert.equal(h.run('s.draft.explicit'),true);
assert.ok(h.run("s.draft.sessionPlan.artistryProvider.includes('Session')"));
assert.ok(h.run("s.draft.sessionPlan.writingProvider.includes('Professional')"));
assert.match(h.run('studio()'),/v103-session/);
assert.match(h.run('studio()'),/Save for album shelf/);
assert.match(h.run('studio()'),/V140_openFeaturePicker/);
h.run('s.draft.steps=3;finishSong(false)');
assert.equal(h.run('s.draft===null'),true);
assert.equal(h.run('s.songs.some(t=>t.title==="Unsent Record"&&!t.released)'),true);
assert.match(h.run('V142_catalogPage()'),/v144-recording-shelf/);
assert.match(h.run('V142_catalogPage()'),/Unsent Record/);
assert.match(h.run('V142_catalogPage()'),/BUILD ALBUM/);
assert.match(h.run('tourPage()'),/v144-tour/);
assert.match(h.run('tourPage()'),/ADD A SHOW/);
h.run(`migrateTouring();saveTourStop({preventDefault(){},target:{city:'austin',week:s.week,venue:0,price:35,vip:10,production:1,security:1,opener:''}})`);
assert.match(h.run('tourPage()'),/v144-tour-stop/);
assert.match(h.run('tourPage()'),/REVIEW &amp; LAUNCH|REVIEW & LAUNCH/);
const css=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
assert.ok(css.indexOf('v144-tour')>css.indexOf('.v143-song-create{'),'phone flow theme must load after earlier Studio rules');
assert.ok(css.includes('grid-template-columns:24px minmax(0,1fr) 14px'),'Home icon layout must use compact rows');
console.log('PASS phone-first Studio state, provider costs, feature navigation, album shelf, touring route and final CSS contract.');
