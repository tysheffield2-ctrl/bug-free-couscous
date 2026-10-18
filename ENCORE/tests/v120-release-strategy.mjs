import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',120001);await h.run('boot()');
h.run(`migrateAiIndustry();s.started=true;s.cash=100000;s.energy=200;globalThis.song={id:120001,title:'Pressure Date',quality:84,commercial:88,mood:'Reflective',songRules:2,released:null,streams:0,total:0};s.songs.push(song);s.world[0].nextRelease=s.week+2;s.world[0].fans=150000000;s.world[0].reputation=92;s.world[0].aiCareer.status='active';s.world[0].aiCareer.stage='Prime';s.world[0].aiCareer.labelMode='signed'`);

const forecast=h.run(`V120_forecastWeek(s.week+2)`);
assert.ok(forecast.score>0);
assert.equal(forecast.top.artist,0);
assert.ok(forecast.confidence>=45&&forecast.confidence<=95);

const cash=h.run('s.cash'),energy=h.run('s.energy');
assert.equal(h.run(`V120_schedule(song.id,s.week+2,'challenge')`),true);
assert.equal(h.run('song.released'),null);
assert.equal(h.run('song.scheduledRelease'),h.run('s.week+2'));
assert.equal(h.run('s.cash'),cash-20);
assert.equal(h.run('s.energy'),energy-5);
assert.equal(h.run(`song.releasePlan.approach`),'challenge');

h.run(`V120_schedule(song.id,s.week+1,'clear')`);
assert.equal(h.run(`song.releasePlan.moves`),1);
assert.ok(h.run(`song.releasePlan.lateMovePenalty`)>.0,'late rescheduling should leave a measurable launch penalty');
assert.equal(h.run('s.cash'),cash-20,'rescheduling must not charge a second release fee');

h.run(`s.week=120; song.scheduledRelease=120; song.releasePlan.week=120; song.releasePlan.approach='balanced'; V120_activateScheduled()`);
assert.equal(h.run('song.released'),120);
assert.equal(h.run('song.scheduledRelease'),null);
assert.ok(h.run('song.releaseStrategyLift')>=.78&&h.run('song.releaseStrategyLift')<=1.22);

const repBefore=h.run('s.reputation');
h.run(`song.releasePlan.actualWeek=s.week;song.releasePlan.approach='challenge';delete song.releasePlan.resultRank;V120_afterChartIssue({published:true,songs:[{key:'you:s:'+song.id,id:song.id,title:song.title,artist:s.name,you:true,rank:1,movement:'NEW',streams:1000000},{key:'npc:s:0:abc',id:'abc',title:'Rival',artist:s.world[0].name,you:false,rank:2,movement:'NEW',streams:900000}],albums:[]})`);
assert.equal(h.run('song.releasePlan.resultRank'),1);
assert.ok(h.run('s.reputation')>repBefore,'winning a deliberate head-to-head release should build reputation');
assert.ok(h.run(`Object.keys(V119_state().rivals).length`)>=1,'head-to-head release should deepen rival history');

const page=h.run(`V120_strategyPage()`);
assert.ok(page.includes('Release strategy.'));
assert.ok(page.includes('Next 8 weeks'));
assert.ok(page.includes('Calendar intelligence'));
assert.equal(h.run(`V080_destinations.some(x=>x[2]==='ReleaseStrategy')`),true);

const src=fs.readFileSync(new URL('../src/v120-release-strategy.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v120-release-strategy.css',import.meta.url),'utf8');
const engine=fs.readFileSync(new URL('../engine/releases.js',import.meta.url),'utf8');
const build=fs.readFileSync(new URL('../build.mjs',import.meta.url),'utf8');
assert.ok(src.includes('V120_forecastWeek'));
assert.ok(src.includes('V120_activateScheduled'));
assert.ok(src.includes('Head-to-head challenge'));
assert.ok(css.includes('.v120-calendar'));
assert.ok(engine.includes('releaseStrategyLift'));
assert.ok(build.includes("'v120-release-strategy'"));
console.log('PASS Release Strategy 1.0: future scheduling, calendar intelligence, meaningful rescheduling, pressure-aware launch multipliers and head-to-head rivalry consequences.');