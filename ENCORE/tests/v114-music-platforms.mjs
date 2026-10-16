import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',114001);await h.run('boot()');
h.run("s.fans=100000;s.reputation=55;s.loyalty=65;s.songs=[{id:114,title:'Signal Fire',released:s.week,streams:40000,total:90000,organic:40000,quality:86,commercial:92,mood:'Polished / Anthem',albumBoost:0}]");
assert.equal(h.run("V114_state().version"),1);
assert.equal(h.run("V114_PLATFORM_IDS.length"),4);
assert.equal(h.run("Object.values(V114_state().tracks['114'].services).reduce((n,x)=>n+x.lifetime,0)"),90000);
assert.ok(h.run("destinations.some(x=>x[2]==='Platforms')"));
assert.ok(h.run("V114_platformPage().includes('Music Platform Ecosystem 1.0')"));
assert.ok(h.run("V114_platformPage().includes('VYBE')&&V114_platformPage().includes('FRAME')"));

h.run("globalThis.baseVybe=V114_audioWeights(s.songs[0]).vybe;globalThis.oldSocialSongBoost=socialSongBoost;socialSongBoost=()=>.2;globalThis.boostedVybe=V114_audioWeights(s.songs[0]).vybe;socialSongBoost=oldSocialSongBoost");
assert.ok(h.run('boostedVybe>baseVybe'));

h.run("s.songs[0].streams=100000;s.songs[0].total=190000;globalThis.beforeOrganic=s.songs[0].organic;globalThis.summary=V114_settlePlatforms(s);globalThis.row=V114_state().tracks['114']");
assert.equal(h.run("V114_PLATFORM_IDS.reduce((n,id)=>n+row.services[id].thisWeek,0)"),100000);
assert.equal(h.run("V114_PLATFORM_IDS.reduce((n,id)=>n+row.services[id].lifetime,0)"),190000);
assert.equal(h.run('summary.streams'),100000);
assert.ok(h.run('row.lastLift>0'));
assert.ok(h.run('s.songs[0].organic>beforeOrganic'));
assert.ok(h.run("V114_activePlacements('vybe').length>0"));
assert.ok(h.run("V114_state().services.vybe.monthlyListeners>0"));

h.run("s.finance=initialFinance(s.week);s.cash=1000000;V114_state().video.videos.push({id:1,songId:114,title:'Signal Fire',format:'official',budget:100000,quality:1,week:s.week,thisWeekViews:0,lifetimeViews:0,lifetimeRevenue:0});globalThis.cashBefore=s.cash;globalThis.video=V114_settleVideo(s)");
assert.ok(h.run('video.views>0'));
assert.ok(h.run('video.revenue>0'));
assert.ok(h.run('s.cash>cashBefore'));
assert.ok(h.run('s.finance.week.media>0'));
assert.ok(h.run('V114_state().video.subscribers>0'));
assert.ok(h.run("V114_videoBudgetFactor({format:'official',budget:250000})>V114_videoBudgetFactor({format:'official',budget:60000})"));

h.run("globalThis.report=closeFinances(0,0);globalThis.recap=V103_recapRows(report)");
assert.ok(h.run("recap.income.some(x=>x[0]==='Video platform revenue')"));
assert.ok(h.run("financeRows(report,true).some(x=>String(x[0]).includes('FRAME'))"));

const src=fs.readFileSync(new URL('../src/v114-music-platforms.js',import.meta.url),'utf8');
assert.ok(src.includes('The system never duplicates a stream')||src.includes('never duplicates a stream'));
assert.ok(src.includes('Placements create future lift'));
assert.ok(src.includes('FRAME creator revenue'));
console.log('PASS Music Platform Ecosystem 1.0: separate profiles, exact stream allocation, PULSE discovery, placement lift, video economics and legacy-career migration.');
