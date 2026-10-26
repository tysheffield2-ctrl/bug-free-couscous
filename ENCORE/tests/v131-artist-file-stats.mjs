import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',131001);await h.run('boot()');
h.run(`s.started=true;s.week=130;s.cash=2500000;s.fans=850000;s.reputation=72;s.total=2100000000;s.streams=4200000;s.social.followers=1200000;s.expansion.awardWins=3;s.expansion.featureAppearances=6;s.careerRecords.liveGross=18000000;s.careerRecords.tours=[{week:40,title:'Breakthrough Run',gross:7000000,profit:4200000,fans:90000,review:84},{week:96,title:'Arena Run',gross:11000000,profit:6500000,fans:180000,review:91}];s.songs=[{id:131,title:'Legacy Record',mood:'Focused',released:18,streams:3000000,total:1500000000,peak:1,quality:96,features:[]},{id:132,title:'Second Wind',mood:'Reflective',released:72,streams:900000,total:350000000,peak:4,quality:88,features:[]}];s.activity=['Signed the biggest deal of the era.','Sold out a major run.'];delete s.v131;`);

h.run('migrateV131()');
assert.equal(h.run('s.v131.skillSnapshots.length'),1,'Stats 2.0 should seed one real current snapshot');
h.run('s.week=131;s.development.writing.level=Math.min(100,s.development.writing.level+4);V131_captureSnapshot()');
assert.equal(h.run('s.v131.skillSnapshots.length'),2,'a later week should append a history snapshot');
assert.ok(h.run('s.v131.skillSnapshots[1].stats.writing>=s.v131.skillSnapshots[0].stats.writing'));

const legacy=h.run('V131_legacy()');
assert.ok(legacy.score>=0&&legacy.score<=100);
assert.ok(typeof legacy.tier==='string'&&legacy.tier.length>0);
assert.ok(legacy.ones>=1);
assert.ok(legacy.certs>=1);

const file=h.run('artistFilePage()');
for(const token of ['ARTIST FILE 2.0','LEGACY PROFILE','02 / ERAS','03 / CAREER HIGHS','INDUSTRY FOOTPRINT','CAREER ARCHIVE','Open Stats 2.0'])assert.ok(file.includes(token),`Artist File 2.0 should include ${token}`);
assert.match(file,/v131-ring/);
assert.match(file,/v130-plaque/,'Artist File 2.0 should preserve the visual plaque wall');
assert.match(file,/Edit appearance/,'appearance editing must remain reachable after the redesign');

const stats=h.run('training()');
for(const token of ['STATS 2.0','CAREER ANALYTICS','ABILITY DEVELOPMENT','v131-radar','TOP RECORD SCALE'])assert.ok(stats.includes(token),`Stats 2.0 should include ${token}`);
assert.match(stats,/v131-spark/,'two tracked weeks should render real skill-history sparklines');
assert.match(stats,/Writing/);
assert.match(stats,/Viral/);

h.run('validateBundle(saveBundle())');
const src=fs.readFileSync(new URL('../src/v131-artist-file-stats.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v131-artist-file-stats.css',import.meta.url),'utf8');
assert.ok(src.includes('V131_captureSnapshot')&&src.includes('V131_legacy')&&src.includes('V131_eraStrip'));
assert.ok(css.includes('.v131-file')&&css.includes('.v131-stats')&&css.includes('@media(max-width:760px)'));
console.log('PASS Artist File + Stats 2.0 legacy score, era history, career highs, plaque wall continuity, real weekly stat snapshots, radar analytics and mobile presentation.');
