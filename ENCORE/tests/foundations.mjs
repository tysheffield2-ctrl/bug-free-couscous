import assert from 'node:assert/strict';
import {harness} from './harness.mjs';
const h=harness();await h.run('boot()');
h.run(`migrateCareerWorld();s.fans=12001;delete s.careerWorld.audienceVersion;for(const m of Object.values(s.careerWorld.markets)){m.streams=0;m.fans=0}migrateCareerWorld()`);
assert.equal(h.run('Object.values(s.careerWorld.markets).reduce((n,m)=>n+m.fans,0)'),12001);
assert.ok(h.run('Math.max(...Object.values(s.careerWorld.markets).map(m=>m.fans))<s.fans*.2'));
for(let fans=0;fans<30;fans++){h.run(`s.fans=${fans};reconcileRegionalAudience()`);assert.equal(h.run('Object.values(s.careerWorld.markets).reduce((n,m)=>n+m.fans,0)'),fans)}
h.run(`applyAudienceEvent('test',100,{reach:15,market:'austin'})`);assert.equal(h.run('s.audienceEngine.events.at(-1).delta'),15);
h.run(`applyAudienceEvent('test',-10000)`);assert.equal(h.run('s.fans'),0);assert.equal(h.run('Object.values(s.careerWorld.markets).reduce((n,m)=>n+m.fans,0)'),0);
assert.throws(()=>h.run(`applyAudienceEvent('bad',NaN)`));
h.run(`recordRegionalStreams(null,1);updateRegionalMarkets()`);assert.ok(h.run(`regionalAudiencePage().includes('NEW · First tracked week')`));assert.equal(h.run(`regionalAudiencePage().includes('CAREER PULSE')`),false);
h.run(`globalThis.legacy=JSON.parse(JSON.stringify(s));delete legacy.stateSchemaVersion;globalThis.old=JSON.stringify(legacy);globalThis.migrated=migrateSaveState(legacy)`);
assert.equal(h.run('JSON.stringify(legacy)'),h.run('old'));assert.equal(h.run('migrated.stateSchemaVersion'),2);
assert.equal(h.run('JSON.stringify(migrateSaveState(migrated))'),h.run('JSON.stringify(migrated)'));
assert.throws(()=>h.run('migrateSaveState({...s,stateSchemaVersion:999})'));
// Marketing boosts enter the same listener-constrained settlement once.
h.run(`s.fans=0;s.loyalty=0;s.songs=[{released:s.week}];s.expansion.albumRollout={until:s.week+1,fanBoost:.2};V086_campaignFanBoost=()=>.25;settleAudience(1000000,100)`);
assert.equal(h.run('s.expansion.lastAudience.acquired'),150);
// Full historical carry-in is an explicit existing rule, counted once per track.
h.run(`s.songs=[{id:1,released:1,total:1500000},{id:2,released:1,total:3000000}];globalThis.album={tracks:[1,2,2],sales:10}`);
assert.equal(h.run(`certificationUnits(album,'albums')`),3010);
const n=harness('/');await n.run('boot()');assert.equal(n.run('executiveReadiness().ready'),false);
n.run(`s.week=261;s.fans=250000;s.reputation=60;s.cash=250000;s.walletCents='25000000';s.songs=Array.from({length:12},()=>({released:1}));`);assert.equal(n.run('executiveReadiness().ready'),true);
n.run(`s.labelBusiness.company={name:'Existing'};s.cash=0;s.fans=0;s.week=1`);assert.equal(n.run('executiveReadiness().ready'),true);
// Advance rollback restores monthly charges and weekly state when any phase fails.
const r=harness();await r.run('boot()');r.run(`migrateV083();s.week=4;migrateV083();globalThis.before=JSON.stringify(s);advanceWeek=()=>{throw Error('injected failure')};console.error=()=>{};advance(true)`);assert.equal(r.run('JSON.stringify(s)'),r.run('before'));
console.log('PASS regional conservation/migration, audience bounds, growth UI, ordered saves, campaign settlement, certification policy, executive gates and rollback.');
