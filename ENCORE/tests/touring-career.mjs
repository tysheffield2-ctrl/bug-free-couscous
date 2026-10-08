import assert from 'node:assert/strict';
import {harness} from './harness.mjs';
const h=harness('/sandbox',71503);await h.run('boot()');
h.run(`render=()=>{};weekRecap=()=>{};migrateTouring();console.error=(...a)=>{throw Error(a.join(' '))}`);
for(let completed=0;completed<1040;completed++){
 if(completed%52===0){
  h.run(`s.touring.draft.name='Annual route '+Math.floor(s.week/52);for(let i=0;i<6;i++)saveTourStop({preventDefault(){},target:{city:regionalMarkets[i].id,week:s.week+Math.floor(i/2),venue:1,price:65,vip:10,production:1,security:2,opener:i===0?'0':''}});reviewWorldTour();confirmWorldTour()`);
  assert.equal(h.run('s.liveTour.route.length'),6);
 }
 h.run('advance(true)');assert.equal(h.run('s.week'),completed+2);
 if([51,259,519,1039].includes(completed)){
  h.run('validateBundle(saveBundle())');
  assert.equal(h.run('s.liveTour.played'),6);assert.equal(h.run('s.touring.archive.length'),Math.floor(completed/52));
  assert.equal(h.run('s.careerRecords.tours.reduce((n,t)=>n+t.tickets,0)'),h.run('s.touring.archive.reduce((n,t)=>n+t.route.reduce((a,r)=>a+r.report.tickets,0),0)+s.liveTour.tickets'));
  assert.ok(h.run('JSON.stringify(saveBundle()).length<8000000'));
  console.log(JSON.stringify({tourYears:(completed+1)/52,shows:h.run('s.careerRecords.tours.length*6'),saveCharacters:h.run('JSON.stringify(saveBundle()).length')}));
 }
}
console.log('PASS 20 annual tours, weekly settlement, preserved show archives and save round trips through 20 years.');
