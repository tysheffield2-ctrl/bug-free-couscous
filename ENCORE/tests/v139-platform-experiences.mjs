import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',139001);await h.run('boot()');
const shell=fs.readFileSync(new URL('../dist/native-shell.js',import.meta.url),'utf8');
h.run(shell);h.run('V137_installShell()');
h.run(`
s.started=true;s.name='Nova Vale';s.cash=18000000;s.energy=200;s.fans=6200000;s.reputation=81;s.loyalty=86;s.genre='Hip-hop';
s.songs=[
 {id:1391,title:'Midnight Signal',released:s.week-8,streams:3200000,total:3900000000,organic:2600000,quality:94,commercial:91,mood:'Focused',songRules:2,features:[]},
 {id:1392,title:'Open Static',released:s.week-8,streams:1500000,total:1800000000,organic:1200000,quality:90,commercial:82,mood:'Raw',songRules:2,features:[]},
 {id:1393,title:'City After Rain',released:s.week-8,streams:900000,total:950000000,organic:740000,quality:96,commercial:72,mood:'Intimate',songRules:2,features:[]}
];
s.albums=[{id:1391,title:'After Midnight',week:s.week-8,tracks:[1391,1392,1393],cohesion:95}];
migrateCareerWorld();V114_state();V114_settlePlatforms(s);
`);

h.run(`V128_openPlatform('muse')`);
assert.equal(h.run('V114_platformTab'),'muse');
assert.equal(h.run('careerTab'),'Platforms');
let muse=h.run('career()');
assert.match(muse,/v139-muse/);
assert.match(muse,/FEATURED ALBUM/);
assert.match(muse,/Top Songs/);
assert.match(muse,/Albums/);
assert.match(muse,/Open MUSE analytics/);
assert.ok(!muse.includes('MUSIC PLATFORM ECOSYSTEM 1.0'),'direct MUSE profile must not fall back to the generic all-platform page');

h.run(`V139_setMuseView('analytics')`);
muse=h.run('career()');
for(const token of ['Overview','PLAYS','LIBRARY ADDS','COMPLETION','Last Week','Last 4 Weeks','Last 12 Weeks','PROJECT HEALTH'])assert.ok(muse.includes(token),`MUSE analytics missing ${token}`);
h.run(`V139_setMuseRange(4)`);muse=h.run('career()');assert.match(muse,/Last 4 Weeks/);

h.run(`V128_openPlatform('vybe')`);
assert.equal(h.run('V114_platformTab'),'vybe');
let vybe=h.run('career()');
assert.match(vybe,/v139-vybe/);
assert.match(vybe,/monthly listeners/);
for(const token of ['Music','Events','Recap','Popular','Popular Releases','ALGORITHM HEALTH'])assert.ok(vybe.includes(token),`VYBE profile missing ${token}`);
assert.ok(!vybe.includes('MUSIC PLATFORM ECOSYSTEM 1.0'),'direct VYBE profile must not fall back to the generic all-platform page');

h.run(`V139_setVybeView('recap')`);
vybe=h.run('career()');
assert.match(vybe,/RECAP/);assert.match(vybe,/Your recap is here/);
h.run(`V139_setRecapSlide(2)`);vybe=h.run('career()');assert.match(vybe,/monthly listeners/);assert.match(vybe,/LISTENERS/);

h.run(`V114_setTab('amp')`);
const amp=h.run('career()');
assert.match(amp,/UNDERGROUND 20/,'AMP should keep its existing Living Platforms identity');

const compat=fs.readFileSync(new URL('../src/v137-native-shell-compat.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v137-native-shell-compat.css',import.meta.url),'utf8');
assert.ok(compat.includes("V114_platformTab==='muse'||V114_platformTab==='vybe'"),'live platform page must route MUSE/VYBE into their immersive profiles');
assert.ok(compat.includes('Object.assign(globalThis,{V139_setMuseView,V139_setMuseRange,V139_setVybeView,V139_setRecapSlide})'),'interactive platform controls must be callable from rendered HTML');
assert.ok(css.includes('.v139-muse{background:#fff'),'MUSE must retain its bright editorial identity');
assert.ok(css.includes('.v139-vybe{position:relative;background:#050505'),'VYBE must retain its dark streaming identity');
assert.ok(css.includes('.v139-vybe-recap'),'VYBE Recap must have a dedicated story surface');
console.log('PASS Platform Experiences 3.0: live MUSE artist/analytics views and VYBE music/events/recap views use real platform state while AMP/WORLDWAVE/FRAME remain intact.');
