import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',134001);await h.run('boot()');
h.run(`
s.started=true;s.cash=10000000;s.energy=200;s.fans=5000000;s.reputation=78;s.loyalty=82;s.genre='Hip-hop';
s.songs=[
 {id:134,title:'Signal Theory',released:s.week-3,streams:2500000,total:3000000000,organic:2200000,quality:92,commercial:90,mood:'Focused',songRules:2,features:[]},
 {id:135,title:'Deep Cut City',released:s.week-3,streams:900000,total:900000000,organic:800000,quality:96,commercial:68,mood:'Raw',songRules:2,features:[]},
 {id:136,title:'Late Night Glass',released:s.week-3,streams:650000,total:650000000,organic:560000,quality:88,commercial:72,mood:'Intimate',songRules:2,features:[]}
];
s.albums=[{id:134,title:'The Long Way Home',week:s.week-3,tracks:[134,135,136],cohesion:94}];
migrateCareerWorld();V114_state();
`);

const before=h.run(`s.songs.reduce((n,x)=>n+x.streams,0)`);
h.run(`globalThis.platformSummary=V114_settlePlatforms(s)`);
assert.equal(h.run(`V114_PLATFORM_IDS.reduce((sum,id)=>sum+Object.values(V114_state().tracks).reduce((n,row)=>n+(row.services[id]?.thisWeek||0),0),0)`),before,'platform allocations must conserve authoritative streams');

assert.ok(h.run(`V134_service('vybe').v2.current.saveRate>0`));
assert.ok(h.run(`V134_service('vybe').v2.current.skipRate>0`));
assert.ok(h.run(`V134_service('vybe').v2.current.algorithmShare>0`));
assert.ok(h.run(`V134_service('muse').v2.current.completionRate>.3`));
assert.ok(h.run(`V134_service('muse').v2.projects.length===1`));
assert.ok(h.run(`V134_service('amp').v2.undergroundChart.length>=1`));
assert.ok(h.run(`V134_service('amp').v2.current.communityHeat>0`));
assert.ok(h.run(`Object.keys(V134_service('worldwave').v2.regions).length===6`));
assert.equal(h.run(`V134_service('worldwave').v2.countries.reduce((n,x)=>n+x.listeners,0)`),h.run(`V134_service('worldwave').monthlyListeners`),'WORLDWAVE country attribution must conserve the service listener total');

for(const [id,token] of [['vybe','ALGORITHM HEALTH'],['muse','PROJECT HEALTH'],['amp','UNDERGROUND 20'],['worldwave','TOP COUNTRIES']]){
 const html=h.run(`V114_platformPanel('${id}')`);assert.ok(html.includes(token),`${id} should expose its own Platforms 2.0 behavior surface`);
}
const overview=h.run(`V114_overview()`);assert.match(overview,/PLATFORMS 2\.0/);assert.match(overview,/CROSS-PLATFORM LOOP/);

h.run(`globalThis.energyBefore=s.energy;globalThis.cashBefore=s.cash;globalThis.moveResult=V134_runPlatformMove('vybe','playlist',134)`);
assert.equal(h.run('moveResult'),true);
assert.ok(h.run('s.energy<energyBefore'));
assert.ok(h.run('s.cash<cashBefore'));
assert.equal(h.run(`V134_service('vybe').strategy.focusSongId`),134);

h.run(`s.finance=initialFinance(s.week);V114_state().video.videos.push({id:134,songId:134,title:'Signal Theory',format:'official',budget:150000,totalCost:175000,quality:1.12,concept:'narrative',director:'indie',week:s.week,thisWeekViews:0,lifetimeViews:12000000,lifetimeRevenue:0});globalThis.frameResult=V114_settleVideo(s)`);
assert.ok(h.run(`V114_state().video.v2.current.completionRate>0`));
assert.ok(h.run(`V114_state().video.videos.find(x=>x.id===134).v2.current.likes>0`));
assert.ok(h.run(`V114_state().video.v2.awards.some(x=>x.name==='Breakthrough Visual')`));
const frame=h.run(`V114_videoPage()`);assert.match(frame,/TRENDING/);assert.match(frame,/Visual awards/);
h.run(`V114_openVideoStudio()`);const studio=h.run(`document.getElementById('modal').innerHTML`);assert.match(studio,/>Concept</);assert.match(studio,/>Director</);

h.run(`s.chartBook={version:1,sinceWeek:1,issuedWeek:s.week,songs:{previous:[],current:[{key:'you:s:134',id:134,title:'Signal Theory',artist:s.name,you:true,streams:2500000,rank:4,last:8,peak:2,weeks:9,debutRank:12,movement:'UP'}],records:{'you:s:134':{title:'Signal Theory',artist:s.name,you:true,id:134,peak:2,weeks:9,numberOneWeeks:0,longest:0,debutRank:12,lastRank:4,lastSeen:s.week,history:[{week:s.week-1,rank:8},{week:s.week,rank:4}]}}},albums:{previous:[],current:[],records:{}}};chartKind='Songs';chartMine=false;chart=()=>s.chartBook.songs.current;albumChart=()=>[];`);
const chartHtml=h.run(`chartHub()`);assert.match(chartHtml,/v134-chart-badges/);assert.match(chartHtml,/VYBE|MUSE|AMP|WORLDWAVE/);

const signal=h.run(`V134_worldwaveTourSignal('austin')`);assert.ok(signal.multiplier>=.94&&signal.multiplier<=1.15);assert.equal(signal.region,'North America');
h.run(`globalThis.route=[{id:134,city:'austin',week:s.week+1,venue:0,price:35,vip:0,production:1,security:1,opener:null,status:'scheduled'}];globalThis.tourEstimate=tourStopEstimate(route[0],route)`);
assert.ok(h.run(`tourEstimate.worldwave&&tourEstimate.worldwave.strength>=0`));

h.run(`s.songs[0].total=75000000000`);
const cert=h.run(`certificationCard(s.songs[0],'songs')`);assert.match(cert,/TROPHY ROOM/);assert.match(cert,/ETERNAL/);assert.match(cert,/Onyx/);assert.match(cert,/Obsidian/);assert.match(cert,/v130-plaque-eternal/);

const src=fs.readFileSync(new URL('../src/v134-platforms-living.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v134-platforms-living.css',import.meta.url),'utf8');
assert.ok(src.includes('V134_PLATFORM_MOVES')&&src.includes('V134_worldwaveTourSignal')&&src.includes('V134_awardTimeline'));
assert.ok(css.includes('.v134-platform')&&css.includes('.v134-award-timeline')&&css.includes('@media(max-width:760px)'));
console.log('PASS Living Platforms 2.0: distinct engagement models, exact listener/stream attribution, FRAME culture, trophy-room rare plaques, chart context and WORLDWAVE touring integration.');
