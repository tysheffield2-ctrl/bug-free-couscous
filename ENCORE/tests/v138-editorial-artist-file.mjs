import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',138001);await h.run('boot()');
const shell=fs.readFileSync(new URL('../dist/native-shell.js',import.meta.url),'utf8');
h.run(shell);h.run('V137_installShell()');
h.run(`
s.started=true;s.name='Lyric Cole';s.genre='Hip-Hop';s.week=313;s.cash=42000000;s.fans=5400000;s.total=8300000000;s.reputation=88;
s.labelBusiness.company={name:'Meridian Records'};
s.songs=[
 {id:1381,title:'Glass City',released:12,total:4200000000,peak:1,chartWeeks:142,longestNumberOne:11,numberOneWeeks:23,quality:94,features:[]},
 {id:1382,title:'Midnight Static',released:70,total:2600000000,peak:3,chartWeeks:81,longestNumberOne:0,numberOneWeeks:0,quality:89,features:[]}
];
s.albums=[{id:1381,title:'Northbound',week:20,tracks:[1381,1382],cohesion:91}];
s.expansion.awardWins=9;s.expansion.featureAppearances=14;
s.careerRecords.liveGross=667012500;s.careerRecords.tours=[{id:1,week:180,title:'Northbound World Tour',gross:667012500,profit:410000000,tickets:27118807,fans:800000,review:94}];
migrateEmpire();s.empire.merch=[{id:1,item:'tee',name:'Northbound Tour Tee',stock:0,sold:750000,price:45,value:0}];
ENCORE_CHARTS.ensure(s);s.chartBook.songs.records={a:{you:true,title:'Glass City',peak:1,weeks:142,longest:11},b:{you:true,title:'Midnight Static',peak:3,weeks:81,longest:0}};
`);
const file=h.run('artistFilePage()');
for(const token of ['ENCORE','PROFILE','Lyric Cole','Musician and Founder, Meridian Records','Real Time Net Worth','Personal Stats','Career Year','Source of Wealth','Legacy Score','Lifetime Streams','Song (Most Popular)','Album (Most Popular)','Chart Hits (#1s)','Tour (Highest Grossing)','Tour (Most Seats Sold)','# Merch Released','Music Catalog Value','Estimated Net Worth'])assert.ok(file.includes(token),`editorial Artist File missing ${token}`);
assert.ok(!file.includes('Forbes'),'reference-brand wording must never ship in ENCORE');
assert.match(file,/v138-artist-file/);
assert.match(file,/Northbound World Tour/);
assert.match(file,/Meridian Records/);
assert.match(file,/Open Stats 2\.0/);
assert.match(file,/Edit appearance/);

const css=fs.readFileSync(new URL('../src/v138-editorial-artist-file.css',import.meta.url),'utf8');
const src=fs.readFileSync(new URL('../src/v138-editorial-artist-file.js',import.meta.url),'utf8');
const build=fs.readFileSync(new URL('../build.mjs',import.meta.url),'utf8');
assert.ok(css.includes('.v138-masthead')&&css.includes('.v138-profile-row')&&css.includes('@media(max-width:430px)'));
assert.ok(css.includes('body:has(.v138-artist-file)>header')&&css.includes('body:has(.v138-artist-file) nav'),'Artist File must become an immersive full-screen editorial profile');
assert.ok(src.includes('V138_chartProfile')&&src.includes('V138_tourProfile')&&src.includes('V138_merchProfile'));
assert.ok(build.includes("'v138-editorial-artist-file'"),'editorial Artist File must load in the split presentation shell and CSS bundle');
assert.ok(fs.statSync(new URL('../dist/game.js',import.meta.url)).size<1_500_000,'core simulation bundle must stay within deployment budget');
console.log('PASS Editorial Artist File: ENCORE-branded profile masthead, live net worth, real career stats, charts/touring/merch/business data, immersive mobile layout and no reference-brand leakage.');
