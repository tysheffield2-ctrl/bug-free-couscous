import assert from 'node:assert/strict';
import {harness} from './harness.mjs';
for(const scenario of ['inactive','releasing','legacy-sandbox']){
 const h=harness(scenario==='legacy-sandbox'?'/sandbox':'/',94812);await h.run('boot()');
 h.run(`render=()=>{};weekRecap=()=>{};s.started=true;console.error=(...args)=>{throw Error(args.join(' '))}`);
 if(scenario==='legacy-sandbox')h.run(`delete s.stateSchemaVersion;s=migrateSaveState(s)`);
 const milestones=new Set([52,260,520,1040]);
 for(let completed=1;completed<=1040;completed++){
  if(scenario==='releasing'&&completed%8===1){h.run(`changeCash(250);s.energy=200;newSong({preventDefault(){},target:{songtitle:'Record '+s.week,mood:'Personal / storytelling',package:'0'}});progressSong();progressSong();finishSong(true,true)`)}
  h.run('advance(true)');assert.equal(h.run('s.week'),completed+1,`${scenario} stalled`);
  if(!milestones.has(completed))continue;
  const data=h.run(`({fans:s.fans,streams:s.total,cash:s.cash,taxes:s.finance.taxesPaid,ai:Math.max(...s.world.map(a=>a.fans)),catalog:catalogValue(),regional:Object.values(s.careerWorld.markets).reduce((n,m)=>n+m.fans,0),bytes:JSON.stringify(saveBundle()).length,charts:s.chartBook.songs.current.length,awards:s.expansion.awards.length,offers:s.empire.offers?.length||0})`);
  for(const [key,value] of Object.entries(data))assert.ok(Number.isFinite(value),`${scenario} ${completed} invalid ${key}`);
  assert.ok(data.fans>=0&&data.fans<8e9);assert.ok(data.ai>=0&&data.ai<1e9,`AI exceeds world audience: ${data.ai}`);
  assert.ok(data.streams>=0&&data.streams<Number.MAX_SAFE_INTEGER);assert.ok(data.taxes>=0);assert.ok(data.catalog>=0);assert.equal(data.regional,data.fans);assert.ok(data.charts<=100);assert.ok(data.bytes<8000000,`Save over budget: ${data.bytes}`);
  h.run('validateBundle(saveBundle())');
  console.log(JSON.stringify({scenario,years:completed/52,...data}));
 }
}
console.log('PASS seeded 1/5/10/20-year inactive, releasing and migrated sandbox careers.');
