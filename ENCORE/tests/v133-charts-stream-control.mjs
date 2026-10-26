import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',133001);await h.run('boot()');
h.run(`s.started=true;s.week=80;s.cash=50000000;s.energy=200;s.fans=1000000000000000;s.reputation=100;s.loyalty=100;s.expansion.listeners=1000000000000;s.songs=[{id:133,title:'Scale Test',mood:'Focused',released:60,streams:1000000,total:5000000000,quality:100,commercial:100,songRules:2,features:[]}];s.albums=[];delete s.v133;`);

assert.equal(h.run(`certificationInfo(499999).tier`),'none');
assert.equal(h.run(`certificationInfo(500000).tier`),'gold');
assert.equal(h.run(`certificationInfo(10000000).tier`),'diamond');
assert.equal(h.run(`certificationInfo(100000000).tier`),'onyx');
assert.equal(h.run(`certificationInfo(250000000).tier`),'obsidian');
assert.equal(h.run(`certificationInfo(500000000).tier`),'eternal');
assert.equal(h.run(`certificationInfo(1000000000).label`),'Eternal','extreme totals should stop stacking Platinum multipliers');

const capped=h.run(`(()=>{const t={id:133,released:60,quality:100,commercial:100};return ENCORE_RELEASES.normalizeStreams(s,t,1e15)})()`);
assert.ok(capped<=400000000,`sandbox-scale weekly streams should resolve beneath the 400M per-song ceiling, got ${capped}`);
assert.ok(h.run(`(()=>{const t={id:133,released:60,quality:100,commercial:100};ENCORE_RELEASES.normalizeStreams(s,t,1e15);return t.streamModel.saturated})()`),'extreme demand should report diminishing reach');

h.run(`s.fans=10000000;s.expansion.listeners=0;s.v133={streamFocus:{week:s.week,kind:'songs',id:133,mode:'algorithm',lift:.2,title:'Scale Test'}}`);
const focused=h.run(`(()=>{const t={id:133,released:60,quality:90,commercial:90};return ENCORE_RELEASES.normalizeStreams(s,t,5000000)})()`);
h.run(`delete s.v133`);
const baseline=h.run(`(()=>{const t={id:133,released:60,quality:90,commercial:90};return ENCORE_RELEASES.normalizeStreams(s,t,5000000)})()`);
assert.ok(focused>baseline,'a weekly stream focus should materially raise non-saturated demand');

h.run(`s.chartBook={version:1,sinceWeek:1,issuedWeek:80,songs:{previous:[],current:[{key:'you:s:133',id:133,title:'Scale Test',artist:'Tester',you:true,streams:12000000,rank:3,last:7,peak:1,weeks:14,debutRank:9,movement:'UP'}],records:{'you:s:133':{title:'Scale Test',artist:'Tester',you:true,id:133,peak:1,weeks:14,numberOneWeeks:2,longest:2,debutRank:9,debutWeek:66,lastRank:3,lastSeen:80,history:Array.from({length:14},(_,i)=>({week:67+i,rank:Math.max(1,16-i)}))}}},albums:{previous:[],current:[],records:{}}};chartKind='Songs';chartMine=false;chart=()=>s.chartBook.songs.current;albumChart=()=>[];`);
const chartHtml=h.run('chartHub()');
for(const token of ['CHARTS 2.0','YOUR CHART STORY','STREAM STRATEGY','BEST PEAK','20-WEEK PATH','BIGGEST MOVES'])assert.ok(chartHtml.includes(token),`Charts 2.0 should render ${token}`);
assert.match(chartHtml,/v133-chart-line/);

const rules=h.run('certificationRules()');
for(const tier of ['Onyx','Obsidian','Eternal'])assert.ok(rules.includes(tier));

const js=fs.readFileSync(new URL('../src/v133-charts-stream-control.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v133-charts-stream-control.css',import.meta.url),'utf8');
const releases=fs.readFileSync(new URL('../engine/releases.js',import.meta.url),'utf8');
const build=fs.readFileSync(new URL('../build.mjs',import.meta.url),'utf8');
assert.ok(js.includes('V133_STREAM_MODES')&&js.includes('V133_historyLine')&&js.includes("eternal:500000000"));
assert.ok(css.includes('.v133-charts')&&css.includes('.cert-badge.cert-eternal')&&css.includes('@media(max-width:760px)'));
assert.ok(releases.includes('normalizeStreams')&&releases.includes('streamCeiling')&&releases.includes('400000000'));
assert.ok(build.includes("'v133-charts-stream-control'"),'Charts 2.0 JavaScript must be bundled');
assert.ok(build.includes("'v133-charts-stream-control'").toString(),'Charts 2.0 asset should be referenced by the build');
console.log('PASS Charts 2.0 history, weekly stream strategy, shared diminishing-reach scale, and Diamond → Onyx → Obsidian → Eternal certification ladder.');
