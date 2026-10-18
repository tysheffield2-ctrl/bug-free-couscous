import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',119001);await h.run('boot()');
h.run(`migrateAiIndustry();s.started=true;s.streams=120000;globalThis.a=s.world[0];a.aiCareer.status='active';a.aiCareer.stage='Rising';a.weekly=100000;globalThis.shock={uid:99119,title:'Out of Nowhere',type:'Single',week:s.week,streams:100000,total:100000,factor:1.6};a.catalog.push(shock)`);
const before=h.run('shock.streams');
const delta=h.run(`V119_applySurge(a,shock,'breakout',2,'Test breakout pressure.')`);
assert.equal(delta,before);
assert.equal(h.run('shock.streams'),before*2);
assert.equal(h.run('shock.total'),before*2);
assert.equal(h.run(`V119_state().events[0].type`),'breakout');

h.run(`V119_updatePressure()`);
assert.ok(h.run(`V119_state().pressure`)>0,'industry pressure should become visible');
assert.ok(h.run(`Object.keys(V119_state().rivals).length`)>0,'close competitors should form persistent rival rows');

h.run(`V119_afterChartIssue({published:true,songs:[{key:'npc:s:0:99119',title:'Out of Nowhere',artist:a.name,you:false,rank:1,movement:'NEW',streams:shock.streams}],albums:[]},s)`);
assert.ok(h.run(`V119_state().events.some(x=>x.type==='number-one'&&x.surprise===true)`),'a new NPC #1 should be recorded as a surprise shock');
assert.ok(h.run(`V119_state().rivals['0'].numberOnes`)>=1,'rival history should remember #1 control');

const panel=h.run(`V119_competitionPanel()`);
assert.ok(panel.includes('LIVING INDUSTRY / COMPETITION 2.0'));
assert.ok(panel.includes('Industry pressure'));
assert.ok(panel.includes('Recent shocks'));

const src=fs.readFileSync(new URL('../src/v119-living-industry.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v119-living-industry.css',import.meta.url),'utf8');
const build=fs.readFileSync(new URL('../build.mjs',import.meta.url),'utf8');
assert.ok(src.includes('V119_applySurge'));
assert.ok(src.includes('A surprise #1 just changed the week'));
assert.ok(src.includes('V119_afterChartIssue'));
assert.ok(src.includes('sleeper'));
assert.ok(src.includes('comeback'));
assert.ok(css.includes('.v119-competition'));
assert.ok(build.includes("'v119-living-industry'"));
console.log('PASS Living Industry / Competition 2.0: persistent pressure, deterministic surge mechanics, surprise #1 history, rival tracking and player-facing industry explanations.');