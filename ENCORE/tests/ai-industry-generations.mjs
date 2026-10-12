import assert from 'node:assert/strict';
import {harness} from './harness.mjs';

const h=harness('/',77123);await h.run('boot()');
h.run(`render=()=>{};weekRecap=()=>{};s.started=true;console.error=(...args)=>{throw Error(args.join(' '))}`);

h.run('migrateAiIndustry()');
assert.equal(h.run('s.world.length'),24,'existing roster should migrate without duplication');
assert.equal(h.run('s.world.every((a,i)=>a.id===i&&a.aiCareer&&a.aiCareer.status==="active")'),true,'existing artists need persistent career identities');
assert.equal(h.run('Object.keys(s.aiIndustry.genreHeat).length'),h.run('genres.length'),'every genre should have a climate value');

for(let i=0;i<160;i++)h.run('advance(true)');
const evolved=h.run(`({world:s.world.length,debuts:s.aiIndustry.debuts.length,newGeneration:s.world.filter(a=>a.aiCareer.generation>0).length,ids:s.world.every((a,i)=>a.id===i),maxGeneration:Math.max(...s.world.map(a=>a.aiCareer.generation)),active:s.world.filter(a=>a.aiCareer.status!=='retired').length})`);
assert.ok(evolved.world>24,'new persistent artists should enter the industry');
assert.ok(evolved.debuts>0&&evolved.newGeneration>0,'new debuts should be recorded');
assert.equal(evolved.ids,true,'artist IDs must remain stable contiguous references');
assert.ok(evolved.maxGeneration>=1,'new artists should belong to a later generation');
assert.ok(evolved.active>0,'the industry must retain active careers');

const beforeFiller=h.run('widerIndustry().length');
h.run(`for(let i=0;i<110;i++){const a=s.world[i%s.world.length];a.catalog.push({uid:a.nextCatalogId++,title:'Persistent chart record '+i,type:'Single',week:s.week,base:2000000,streams:2000000+i,total:2000000+i,factor:1})}`);
const afterFiller=h.run('widerIndustry().length');
assert.ok(afterFiller<beforeFiller,'synthetic song depth should shrink as persistent records fill the chart');
assert.equal(afterFiller,0,'100+ qualifying persistent songs should eliminate synthetic song filler');

h.run(`for(let i=0;i<55;i++){const a=s.world[i%s.world.length];a.catalog.push({uid:a.nextCatalogId++,title:'Persistent album '+i,type:'Album',week:s.week,base:3500000,streams:3500000+i,total:3500000+i,factor:1})}`);
const albumDepth=h.run(`({count:compileAlbums().length,background:compileAlbums().filter(x=>x.background).length})`);
assert.equal(albumDepth.count,50,'album chart should still publish a Top 50');
assert.equal(albumDepth.background,0,'50+ qualifying persistent albums should eliminate synthetic album filler');

const retire=h.run(`(()=>{const a=s.world[0];a.aiCareer.peakFans=Math.max(a.aiCareer.peakFans,1000000);const ok=retireIndustryArtist(a,'test transition');return {ok,status:a.aiCareer.status,next:a.nextRelease,logged:s.aiIndustry.retirements[0]?.artist===a.id}})()`);
assert.equal(retire.ok,true);assert.equal(retire.status,'retired');assert.equal(retire.next,Number.MAX_SAFE_INTEGER);assert.equal(retire.logged,true);
const comeback=h.run(`(()=>{const a=s.world[0];a.aiCareer.retiredWeek=s.week-120;const ok=comebackIndustryArtist(a);return {ok,status:a.aiCareer.status,next:a.nextRelease,logged:s.aiIndustry.comebacks[0]?.artist===a.id}})()`);
assert.equal(comeback.ok,true);assert.equal(comeback.status,'comeback');assert.ok(comeback.next>h.run('s.week'));assert.equal(comeback.logged,true);

h.run('validateAiIndustry();validateBundle(saveBundle())');
assert.ok(h.run('JSON.stringify(saveBundle()).length')<8000000,'generation state should stay under the save budget');
console.log('PASS persistent AI generations, retirement/comeback continuity, and shrinking synthetic chart depth.');
