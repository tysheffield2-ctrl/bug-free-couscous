import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',148011);
await h.run('boot()');
h.c.document.documentElement.classList={add(){},remove(){}};
h.run("s.started=true;s.cash=1000000;s.energy=200;foundLabel({preventDefault(){},target:{name:'Fictional Cassette Records'}})");
for(const type of ['record','distribution','360']){
 assert.equal(h.run("V102_renderNegotiation(23,{type:'"+type+"',share:.1,weeks:26,advance:20000})"),true);
 const markup=h.bodyChildren.at(-1).innerHTML;
 assert.match(markup,/name="share" min="5" max="100"/,'Label Boss share bounds must be 5–100%');
 assert.doesNotMatch(markup,/name="share" min="1" max="90"/);
 assert.doesNotMatch(markup,/class="contract-clause"><input[^>]*name="right_masters"/,'Base master rights must not appear as a checkbox');
 assert.doesNotMatch(markup,/class="contract-clause"><input[^>]*name="right_distribution"/,'Base distribution rights must not appear as a checkbox');
 assert.doesNotMatch(markup,/>Master recording revenue<|>Distribution & release services</,'Base rights labels should disappear from the roster choices');
 assert.match(markup,/name="right_merch"/,'Other royalty participation choices must stay');
 assert.match(markup,/name="right_touring"/,'Touring choice must stay');
 assert.match(markup,/name="right_syncMaster"/,'Sync choice must stay');
 assert.match(markup,/name="weeks" min="4" max="104"/,'Term controls must stay unchanged');
 assert.match(markup,/name="advance"/,'Advance stays unchanged');
 assert.match(markup,/Ask what matters · 3 energy/,'Existing negotiation actions stay unchanged');
 if(type!=='distribution')assert.match(markup,/name="right_masters" value="on"/,'Implied masters participation retained');
 assert.match(markup,/name="right_distribution" value="on"/,'Implied distribution participation retained');
}

function form(type,share,rights={}){
 return {type,share:String(share),weeks:'26',advance:'25000',
  right_masters:type==='distribution'?null:'on',right_distribution:'on',...rights};
}
for(const type of ['record','distribution','360']){
 const low=h.run("readRosterTerms("+JSON.stringify(form(type,5))+")");
 assert.equal(low.share,.05,'Minimum inclusive, '+type);
 const max=h.run("readRosterTerms("+JSON.stringify(form(type,100))+")");
 assert.equal(max.share,1,'Maximum inclusive, '+type);
 assert.equal(max.rights.masters,type!=='distribution','Base master status stays automatic, '+type);
 assert.equal(max.rights.distribution,true,'Base distribution status stays automatic, '+type);
 for(const invalid of [0,4.9,100.1,101]){
  assert.throws(()=>h.run("readRosterTerms("+JSON.stringify(form(type,invalid))+")"),/5–100%/,'Reject out of range '+invalid);
 }
}
const share=h.run("contractFields({type:'record',share:.1,weeks:26,advance:20000})");
assert.match(share,/name="share" min="1" max="90"/,'Other recording offers are not redesigned or repriced');
assert.match(share,/name="right_masters"/,'Other contract screens still show their old terms');

const engine=h.run('ENCORE_ROSTER_NEGOTIATION');
assert.ok(engine);
for(const share of [.05,1])assert.ok(h.run("ENCORE_ROSTER_NEGOTIATION.terms(s,23,'record',"+share+",26).minimum")>0);
for(const share of [.049,1.001])assert.throws(()=>h.run("ENCORE_ROSTER_NEGOTIATION.terms(s,23,'record',"+share+",26)"),/valid contract structure/);
const rounds=h.run("V100_rosterNegotiation(23).rounds");
const response=h.run("V102_submitRosterOffer({preventDefault(){},target:"+JSON.stringify(form('record',100))+"},23)");
assert.equal(typeof response,'boolean');
assert.equal(h.run("V100_rosterNegotiation(23).rounds"),rounds+1,'100% share reaches actual negotiation logic instead of failing validation');
assert.equal(h.run('s.labelBusiness.company.contracts.length'),0,'Presenting terms does not silently sign');
await h.run('saveNow()');await h.run('boot()');
assert.equal(h.run("V100_rosterNegotiation(23).rounds"),rounds+1,'Negotiation persists on reload');

const screen=fs.readFileSync(new URL('../src/v106-showcase-fidelity.js',import.meta.url),'utf8');
assert.ok(screen.includes('name="share" min="5" max="100"'));
console.log('PASS minimal Label Boss roster controls: 5–100% inclusive, implicit base rights hidden, unchanged controls and saved negotiations.');
