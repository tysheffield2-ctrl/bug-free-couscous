import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const retired=[
 'charts-engine-bridge.js','audience-engine-bridge.js','finance-engine-bridge.js',
 'studio-engine-bridge.js','roster-negotiation-engine-bridge.js','weekly-engine.js',
 'v131-shared-week-history.js'
];
for(const name of retired)assert.equal(fs.existsSync(new URL('../src/'+name,import.meta.url)),false,`${name} must stay retired; use src/engine-adapter.js`);

const build=fs.readFileSync(new URL('../build.mjs',import.meta.url),'utf8');
for(const token of ["engine/scheduler.js","engine/migrations.js","engine/runtime.js","'engine-adapter'"])assert.ok(build.includes(token),`build must include ${token}`);
for(const name of retired)assert.equal(build.includes("'"+name.replace(/\.js$/,'')+"'"),false,`${name} must not return to the module chain`);

const v107=fs.readFileSync(new URL('../src/v107-week-hotfix.js',import.meta.url),'utf8');
assert.equal(v107.includes('advanceWeek=function'),false,'v107 must never own a second weekly simulator again');
const worker=fs.readFileSync(new URL('../engine/worker-entry.js',import.meta.url),'utf8');
assert.ok(worker.includes('ENCORE_ENGINE.transactWeek'),'worker must run the same canonical transaction as the full renderer');
assert.equal(worker.includes('ENCORE_WEEK_TRANSACTION.run'),false,'worker must not bypass ENCORE_ENGINE');

const h=harness('/sandbox',136001);await h.run('boot()');
assert.equal(h.run('ENCORE_ENGINE.version'),2);
assert.equal(h.run('ENCORE_ENGINE.health().components.weekly'),2);
assert.ok(h.run("advanceWeek.toString().includes('ENCORE_ENGINE.settleWeek')"),'direct compatibility advance must call canonical engine');
assert.ok(h.run("advance.toString().includes('ENCORE_ENGINE.transactWeek')"),'normal advance must use canonical transaction');
assert.ok(h.run("migrateSaveState.toString().includes('ENCORE_ENGINE.migrate')"),'save migration must use canonical migration engine');
assert.ok(h.run("updateChartRecords.toString().includes('ENCORE_ENGINE.publishCharts')"),'chart publication must use canonical engine');
assert.ok(h.run("closeFinances.toString().includes('ENCORE_ENGINE.settleFinance')"),'finance close must use canonical engine');
assert.ok(h.run("newSong.toString().includes('ENCORE_ENGINE.studio')"),'studio mutation must use canonical engine');
assert.ok(h.run("V100_rosterNegotiation.toString().includes('ENCORE_ENGINE.roster')"),'roster negotiation must use canonical engine');

console.log('PASS ENCORE has one canonical simulation runtime, one presentation adapter, one week transaction, and no retired bridge/week bypasses.');
