import assert from 'node:assert/strict';
import {harness} from './harness.mjs';

const h=harness('/',88421);await h.run('boot()');
h.run(`render=()=>{};weekRecap=()=>{};s.started=true;console.error=(...args)=>{throw Error(args.join(' '))}`);
h.run('migrateAiIndustry();migrateIndustryLife()');

const strategies=h.run(`s.world.map(a=>a.aiCareer.strategy)`);
assert.ok(strategies.every(x=>['steady','prolific','perfectionist','collaborative','era-builder'].includes(x)),'every persistent artist should have a career strategy');
assert.ok(new Set(strategies).size>=3,'the starting industry should contain multiple career strategies');

h.run(`(()=>{const a=s.world[0];a.genre='Hip-hop';s.aiIndustry.genreHeat['Hip-hop']=1.5;a.aiCareer.strategy='perfectionist';a.aiCareer.status='active';a.nextRelease=s.week;return true})()`);
const beforeCount=h.run('s.world[0].catalog.length');
h.run('worldWeek()');
const release=h.run(`(()=>{const a=s.world[0],x=a.catalog.slice(${beforeCount})[0];return {strategy:x?.aiStrategy,heat:x?.genreClimate,stage:x?.careerStage,next:a.nextRelease,week:s.week}})()`);
assert.equal(release.strategy,'perfectionist','new releases should record the artist strategy');
assert.ok(release.heat>=1.49,'genre climate should be captured on the release');
assert.ok(release.next>release.week+5,'perfectionist strategy should schedule a longer release gap');

const label=h.run(`(()=>{const a=s.world[1];a.fans=1000000;a.reputation=75;a.aiCareer.status='active';delete s.labelLeague.contracts[a.id];a.aiCareer.labelMode='independent';const signed=aiMaybeSignLabel(a,true),deal=s.labelLeague.contracts[a.id];return {signed,label:a.aiCareer.labelId,deal:!!deal,ends:deal?.ends,week:s.week}})()`);
assert.equal(label.signed,true,'eligible AI artists should be able to sign into the existing label league');
assert.equal(label.deal,true);assert.ok(Number.isInteger(label.label));assert.ok(label.ends>label.week);

const network=h.run(`(()=>{const a=s.world[2],b=s.world[3];aiRecordCollaboration(a,b);aiRecordCollaboration(a,b);return {a:a.aiCareer.connections.find(x=>x.artist===b.id),b:b.aiCareer.connections.find(x=>x.artist===a.id)}})()`);
assert.equal(network.a.collaborations,2,'collaboration history should accumulate');
assert.equal(network.b.collaborations,2,'collaboration history should be reciprocal');

const retired=h.run(`(()=>{const a=s.world[1];a.catalog.push({uid:a.nextCatalogId++,title:'Legacy Test',type:'Single',week:s.week,base:1000000,streams:1000000,total:5000000,factor:1.4});const ok=retireIndustryArtist(a,'test legacy');return {ok,status:a.aiCareer.status,legacy:a.aiCareer.legacy,label:!!s.labelLeague.contracts[a.id],event:s.aiIndustry.retirements[0]}})()`);
assert.equal(retired.ok,true);assert.equal(retired.status,'retired');assert.equal(retired.label,false,'retirement should close the active AI label contract');
assert.ok(retired.legacy.totalStreams>=5000000,'retirement should preserve a career legacy summary');
assert.ok(retired.legacy.releases>=1);assert.equal(retired.event.artist,1);

const comeback=h.run(`(()=>{const a=s.world[1];a.aiCareer.retiredWeek=s.week-120;const ok=comebackIndustryArtist(a);return {ok,status:a.aiCareer.status,labelMode:a.aiCareer.labelMode,legacy:!!a.aiCareer.legacy}})()`);
assert.equal(comeback.ok,true);assert.equal(comeback.status,'comeback');assert.equal(comeback.labelMode,'independent');assert.equal(comeback.legacy,true,'comeback should retain the pre-retirement legacy record');

h.run('validateAiIndustry();validateBundle(saveBundle())');
assert.ok(h.run('s.aiIndustry.events.length')>0,'major AI career transitions should create persistent industry stories');
assert.ok(h.run('JSON.stringify(saveBundle()).length')<8000000,'strategy and legacy history should remain under the save budget');
console.log('PASS AI career strategies, genre response, label integration, collaboration history, legacy and comeback continuity.');
