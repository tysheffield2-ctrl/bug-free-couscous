import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',137001);await h.run('boot()');
h.run(`
s.started=true;s.cash=24500000;s.energy=164;s.fans=3200000;s.reputation=72;s.total=6800000000;
s.songs=[
 {id:1371,title:'Night Architecture',released:1,streams:1200000,total:4100000000,quality:91,commercial:86,features:[]},
 {id:1372,title:'Window Seat',released:2,streams:650000,total:1800000000,quality:88,commercial:77,features:[]}
];
s.albums=[{id:1371,title:'After the Skyline',week:2,tracks:[1371,1372],cohesion:92}];
migrateExpansion();migrateEmpire();migrateCareerWorld();V114_state();
`);

const home=h.run(`V137_home()`);
assert.match(home,/FAME \|/);
assert.match(home,/Inbox/);
assert.match(home,/Relationships &amp; Network|Relationships & Network/);
assert.match(home,/PULSE/);
assert.match(home,/Trends &amp; Charts|Trends & Charts/);
assert.match(home,/Business HQ/);

const music=h.run(`V137_musicHub()`);
for(const token of ['TOTAL STREAMS','NEW PROJECT','CHARTS','PLATFORMS','Studio','Songs &amp; Catalog','Contracts &amp; Rights','Marketing','Touring','Awards &amp; Achievements','Music Platforms','Merch &amp; Media'])assert.ok(music.includes(token),`music hub missing ${token}`);
assert.ok(!/SONGBOARD|FIND A JOB/.test(music),'reference-game placeholder actions must not leak into ENCORE');

const wealth=h.run(`V137_wealthHub()`);
for(const token of ['NET WORTH','CATALOG','VIEW CATALOG','VIEW FINANCES','Balance Sheet &amp; Taxes','Investments','Catalog &amp; Rights','Collection','Property','Business HQ'])assert.ok(wealth.includes(token),`wealth hub missing ${token}`);
assert.ok(!/FIND A JOB/.test(wealth),'catalog value must use a contextual ENCORE action, never Find a Job');

const nav=h.run(`navigationBar()`);
for(const token of ['Home','Artist File','Career','Wealth','More'])assert.ok(nav.includes(token),`bottom navigation missing ${token}`);
assert.ok(nav.includes('V137_openMusicHub()')&&nav.includes('V137_openWealthHub()'));

h.run(`V137_openMusicHub()`);assert.equal(h.run(`careerTab`),'V137MusicHub');
h.run(`V137_openWealthHub()`);assert.equal(h.run(`careerTab`),'V137WealthHub');

const src=fs.readFileSync(new URL('../src/v137-native-shell.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v137-native-shell.css',import.meta.url),'utf8');
const build=fs.readFileSync(new URL('../build.mjs',import.meta.url),'utf8');
assert.ok(src.includes("V137_openCatalog()")&&src.includes("VIEW CATALOG")&&src.includes("VIEW FINANCES"));
assert.ok(src.includes("V137_openContracts('Catalog')"));
assert.ok(css.includes('.v137-bottom-nav')&&css.includes('.v137-menu-row')&&css.includes('@media(max-width:720px)'));
assert.ok(build.includes("'v137-native-shell'"));
console.log('PASS Native Shell 3.0: approved mobile hierarchy with ENCORE-only destinations, contextual catalog/finance actions, real career/wealth hubs and responsive bottom navigation.');
