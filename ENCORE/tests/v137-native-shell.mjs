import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',137001);await h.run('boot()');
const shell=fs.readFileSync(new URL('../dist/native-shell.js',import.meta.url),'utf8');
h.run(shell);h.run('V137_installShell()');
h.run(`
s.started=true;s.cash=24500000;s.energy=164;s.fans=3200000;s.reputation=72;s.total=6800000000;
s.songs=[
 {id:1371,title:'Night Architecture',released:1,streams:1200000,total:4100000000,quality:91,commercial:86,features:[]},
 {id:1372,title:'Window Seat',released:2,streams:650000,total:1800000000,quality:88,commercial:77,features:[]}
];
s.albums=[{id:1371,title:'After the Skyline',week:2,tracks:[1371,1372],cohesion:92}];
migrateExpansion();migrateEmpire();migrateCareerWorld();V114_state();
`);

const home=h.run(`home()`);
assert.match(home,/FAME \|/);
assert.match(home,/Inbox/);
assert.match(home,/Relationships &amp; Network|Relationships & Network/);
assert.match(home,/PULSE/);
assert.match(home,/Trends &amp; Charts|Trends & Charts/);
assert.match(home,/Business HQ/);
assert.match(home,/CAREER DESK/);
assert.match(home,/v103-home/);
assert.match(home,/v103-desk/);
assert.match(home,/encore-wordmark/);
assert.ok(!/NEXT MOVE|Where do you want to focus/i.test(home),'Home must not re-inject the retired Next Move block');
for(const id of ['vybe','muse','amp'])assert.ok(home.includes(`V137_openPlatforms('${id}')`),`Home must deep-link ${id.toUpperCase()} to its own profile`);

const music=h.run(`V137_musicHub()`);
for(const token of ['TOTAL STREAMS','NEW PROJECT','CHARTS','PLATFORMS','Studio','Songs &amp; Catalog','Contracts &amp; Rights','Marketing','Touring','Awards &amp; Achievements','Music Platforms','Merch &amp; Media'])assert.ok(music.includes(token),`music hub missing ${token}`);
assert.ok(!/SONGBOARD|FIND A JOB/.test(music),'reference-game placeholder actions must not leak into ENCORE');

const wealth=h.run(`V137_wealthHub()`);
for(const token of ['NET WORTH','CATALOG','VIEW CATALOG','VIEW FINANCES','Balance Sheet &amp; Taxes','Investments','Catalog &amp; Rights','Collection','Property','Business HQ'])assert.ok(wealth.includes(token),`wealth hub missing ${token}`);
assert.ok(!/FIND A JOB/.test(wealth),'catalog value must use a contextual ENCORE action, never Find a Job');
assert.ok(!wealth.includes('wealth-actions'),'redundant Catalog Rights / Business HQ quick-pill block must be removed');

/* Critical: go('Menu') renders menuPage(). Testing menu() alone can pass while the
   live route still serves the retired directory, so both must resolve identically. */
const more=h.run(`menuPage()`);
const legacyMoreAlias=h.run(`menu()`);
for(const token of ['Career &amp; utilities','Representation','Legal Affairs','Label HQ','Finance','Settings'])assert.ok(more.includes(token)||more.includes(token.replace('&amp;','&')),`More hub missing ${token}`);
assert.ok(!/Where do you want to go|encore-icon-directory|MUSIC PLATFORMS[\s\S]*SEPARATE PROFILES/.test(more),'Live More renderer must no longer render the old icon directory wall');
assert.equal(more,legacyMoreAlias,'menuPage() and legacy menu() must resolve to the same More hub');

const nav=h.run(`navigationBar()`);
for(const token of ['Home','Artist File','Career','Wealth','More'])assert.ok(nav.includes(token),`bottom navigation missing ${token}`);
assert.ok(nav.includes('V137_openMusicHub()')&&nav.includes('V137_openWealthHub()'));
assert.ok(nav.includes('nav-home')&&nav.includes('aria-current="page"'));

h.run(`V137_openMusicHub()`);assert.equal(h.run(`careerTab`),'V137MusicHub');
h.run(`V137_openWealthHub()`);assert.equal(h.run(`careerTab`),'V137WealthHub');

const src=fs.readFileSync(new URL('../src/v137-native-shell.js',import.meta.url),'utf8');
const compat=fs.readFileSync(new URL('../src/v137-native-shell-compat.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v137-native-shell.css',import.meta.url),'utf8');
const compatCss=fs.readFileSync(new URL('../src/v137-native-shell-compat.css',import.meta.url),'utf8');
const build=fs.readFileSync(new URL('../build.mjs',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
assert.ok(src.includes("V137_openCatalog()")&&src.includes("VIEW CATALOG")&&src.includes("VIEW FINANCES"));
assert.ok(src.includes("V137_openContracts('Catalog')"));
assert.ok(compat.includes("V128_openPlatform")&&compat.includes("V137_openPlatforms=function(id='')"),'Home platform shortcuts must use the authoritative profile router');
assert.ok(compat.includes('menuPage=V137_moreHub')&&compat.includes('menu=V137_moreHub'),'Live and legacy Menu renderers must both use the simplified More hub');
assert.ok(css.includes('.v137-bottom-nav')&&css.includes('.v137-menu-row')&&css.includes('@media(max-width:720px)'));
assert.ok(compatCss.includes('Native Shell 3.2 polish'));
assert.ok(compatCss.includes('.v137-command .v137-end-week{position:static'),'End Week must participate in layout instead of floating over stats');
assert.ok(compatCss.includes("grid-template-areas:'cash energy' 'date end'"),'compact command header must use a non-overlapping two-row grid');
assert.ok(compatCss.includes('.v137-menu-row strong{color:#14212a!important}'),'light action rows must force readable primary text');
assert.ok(compatCss.includes('.v137-bottom-nav button.active:after'),'active navigation needs a persistent visual indicator');
assert.ok(compatCss.includes('.v131-file{max-width:900px'),'Artist File must share the Native Shell width and surface family');
assert.ok(compatCss.includes('.v131-cover,.v131-resume,.v131-spread,.v131-section'),'Artist File dossier sections must use the unified surface treatment');
assert.ok(build.includes("const shellModules=['v137-native-shell','v137-native-shell-compat','v138-editorial-artist-file','v140-cohesive-career-ui']"),'Native Shell must load v140 after the editorial Artist File');
assert.ok(html.includes('/native-shell.js'),'interactive document must load the split Native Shell asset');
assert.ok(fs.statSync(new URL('../dist/native-shell.js',import.meta.url)).size>1000,'split Native Shell asset should be emitted');
assert.ok(fs.statSync(new URL('../dist/game.js',import.meta.url)).size<1_480_000,'core simulation bundle must stay within deployment budget');
console.log('PASS Native Shell 3.2.1: live Menu route uses the simplified More hub, platform-specific Home deep-links persist, mobile command layout stays safe, Wealth stays simplified and Artist File remains intact.');
