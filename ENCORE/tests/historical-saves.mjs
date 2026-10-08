import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {harness} from './harness.mjs';
const folder=new URL('./fixtures/',import.meta.url),manifest=JSON.parse(readFileSync(new URL('manifest.json',folder)));
for(const item of manifest){
 const json=gunzipSync(readFileSync(new URL(item.file,folder))).toString();assert.equal(createHash('sha256').update(json).digest('hex'),item.saveSha256);
 const fixture=JSON.parse(json),h=harness(item.mode==='sandbox'?'/sandbox':'/');await h.run('boot()');h.c.fixture=fixture;
 const protectedState=x=>JSON.stringify({week:x.week,cash:x.cash,wallet:x.walletCents,songs:x.songs,albums:x.albums,contract:x.expansion.contract,tours:x.careerRecords.tours,masters:x.expansion.contractHistory});
 const before=protectedState(fixture.state),unchanged=JSON.stringify(fixture);
 h.run('s=validateBundle(fixture)');assert.equal(protectedState(h.run('s')),before,item.file+' lost protected career data');assert.equal(JSON.stringify(fixture),unchanged);
 assert.equal(h.run('s.stateSchemaVersion'),2);assert.equal(h.run('Object.values(s.careerWorld.markets).reduce((n,m)=>n+m.fans,0)'),h.run('s.fans'));
 if(fixture.state.liveTour){assert.equal(h.run('s.liveTour.gross'),fixture.state.liveTour.gross);assert.equal(h.run('s.liveTour.production'),fixture.state.liveTour.production);assert.equal(h.run('s.liveTour.legacyCompleted'),fixture.state.liveTour.completed)}
 const migrated=h.run('JSON.stringify(s)');h.run('s=migrateSaveState(s)');assert.equal(h.run('JSON.stringify(s)'),migrated);
 h.run('s=validateBundle(JSON.parse(JSON.stringify(saveBundle())));render=()=>{};weekRecap=()=>{};advance(true)');assert.equal(h.run('s.week'),fixture.state.week+1);h.run('validateBundle(saveBundle())');
 console.log('PASS historical fixture '+item.file+' migration, preservation, reload and weekly continuation.');
}
