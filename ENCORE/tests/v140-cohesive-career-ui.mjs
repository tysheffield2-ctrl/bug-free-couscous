import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',140001);await h.run('boot()');
const shell=fs.readFileSync(new URL('../dist/native-shell.js',import.meta.url),'utf8');
h.run(shell);h.run('V137_installShell()');

h.run(`s.started=true;s.name='Nova Vale';s.genre='Hip-hop';s.cash=2500000;s.energy=200;s.draft=null;`);
let studio=h.run('studio()');
for(const token of ['v140-song-create','NEW SONG','SONG NAME','ASSIGN ALBUM','ARTISTRY','WRITING','STUDIO','TOTAL COST','CREATE 10','CASH AVAILABLE'])assert.ok(studio.includes(token),`Studio creation missing ${token}`);
assert.ok(!studio.includes('creative-grid'),'new Studio creation should not fall back to the legacy multi-field web form');

h.run('V140_openGenre()');
studio=h.run('studio()');
for(const token of ['v140-genre','GENRE','CURRENT GENRE','CHANGE GENRE','SAVE'])assert.ok(studio.includes(token),`Genre screen missing ${token}`);
h.run('V140_closeGenre()');

h.run(`
s.draft={id:1401,title:'Night Signal',mood:'Focused',steps:1,quality:50,features:[],creative:{theme:'Personal story'},sessionPlan:{brief:'story'}};
`);
studio=h.run('studio()');
assert.match(studio,/FEATURED ARTISTS · 0\/6/,'active song session should expose the dedicated feature roster');

h.run(`
s.draft=null;
s.labelBusiness={offers:[],auditions:{},lastScouted:0,company:{name:'Northline Records',started:1,staff:{manager:true,marketing:true,ar:true},contracts:[{artist:0,type:'record',share:.2,weeks:52,started:1,ends:52,advance:100000,receipts:250000,excludedIds:[]}],receipts:250000,last:null,preparedWeek:0,settledWeek:0}};
`);
let label=h.run('companyPage()');
for(const token of ['v140-label-suite','Northline Records','ARTIST MANAGEMENT','ARTISTS (SIGNED)','ARTIST ROI','DEPARTMENTS','THE OFFICE'])assert.ok(label.includes(token),`Label overview missing ${token}`);
h.run(`V140_labelSetView('artists')`);label=h.run('companyPage()');assert.match(label,/v140-label-artists/);assert.match(label,/WEEKS LEFT/);
h.run(`V140_labelSetView('roi')`);label=h.run('companyPage()');for(const token of ['v140-label-roi','TOTAL SPENT SINCE LAUNCH','TOTAL EARNINGS','NET EARNINGS','ROYALTIES:'])assert.ok(label.includes(token),`Label ROI missing ${token}`);
h.run(`V140_labelSetView('artist',0)`);label=h.run('companyPage()');for(const token of ['v140-label-artist','Traits','Popular Songs','Popular Albums'])assert.ok(label.includes(token),`Signed artist detail missing ${token}`);

const css=fs.readFileSync(new URL('../src/v140-cohesive-career-ui.css',import.meta.url),'utf8');
assert.ok(css.includes('.v140-song-create'),'new song layout must have a dedicated mobile presentation');
assert.ok(css.includes('.v140-feature-picker'),'feature selection must have its own ranked roster presentation');
assert.ok(css.includes('.v140-label-suite'),'owned-label management must share the cohesive record-company presentation');
assert.ok(css.includes('body:has(.v138-artist-file),body:has(.v138-artist-file) main,.v138-artist-file'),'Artist File must hard-force the editorial white surface');
assert.ok(css.includes('background:#fff!important;color:#000!important'),'Artist File must be true white paper with black ink');

console.log('PASS Cohesive Career UI 0.9.28: Studio creation, genre, features, label overview/roster/ROI/artist detail and white Artist File presentation are live.');
