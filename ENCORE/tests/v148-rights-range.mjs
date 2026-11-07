import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',148001);
await h.run('boot()');
const markup=h.run("contractFields({type:'360',share:.1,weeks:26,advance:10000})");
assert.match(markup,/name="share" min="5" max="100"/,'Label share must be 5–100%');
assert.doesNotMatch(markup,/name="right_masters"/,'Do not show duplicated master/base rights');
assert.doesNotMatch(markup,/name="right_distribution"/,'Do not show duplicated distribution/base rights');
assert.match(markup,/name="right_touring"/);
assert.match(markup,/name="right_merch"/);
assert.match(markup,/name="rate_touring"[^>]*min="5" max="100"/);
assert.match(markup,/name="rate_merch"[^>]*min="5" max="100"/);
assert.match(markup,/name="weeks" min="4" max="104"/,'Length control stays unchanged');
assert.match(markup,/name="advance"/,'Advance control stays unchanged');
assert.match(markup,/name="right_endorsements"/,'Other rights remain available');

for(const n of ['5','100']){
 assert.equal(h.run("contractInputTerms({type:'360',share:'"+n+"',weeks:'26',advance:'10000'}).share"),Number(n)/100);
 assert.equal(h.run("ENCORE_ROSTER_NEGOTIATION.normalizeOffer({type:'360',share:"+Number(n)/100+",weeks:26,advance:10000}).share"),Number(n)/100);
}
for(const n of ['4','101']) {
 assert.throws(()=>h.run("contractInputTerms({type:'360',share:'"+n+"',weeks:'26',advance:'10000'})"),/5–100%/);
 assert.throws(()=>h.run("ENCORE_ROSTER_NEGOTIATION.normalizeOffer({type:'360',share:"+Number(n)/100+",weeks:26,advance:10000})"),/5–100%/);
}
const form="({right_touring:'on',rate_touring:'5',right_merch:'on',rate_merch:'100',right_syncMaster:'on'})";
const rights=h.run("V090_rightsInput("+form+",'360')");
assert.equal(rights.masters,true,'Structural rights remain even when not visible');
assert.equal(rights.distribution,true,'Distribution stays set by deal structure');
assert.equal(rights.touring,true);assert.equal(rights.merch,true);
assert.equal(rights.rates.touring,.05);assert.equal(rights.rates.merch,1);
assert.throws(()=>h.run("V090_rightsInput({right_touring:'on',rate_touring:'4'},'360')"),/5% and 100%/);
assert.throws(()=>h.run("V090_rightsInput({right_merch:'on',rate_merch:'101'},'360')"),/5% and 100%/);
assert.match(h.run("V090_contractScope({type:'360',rights:V090_rightsInput("+form+",'360')})"),/Touring income \(5% company participation\)/);
assert.match(h.run("V090_contractScope({type:'360',rights:V090_rightsInput("+form+",'360')})"),/Merchandise income \(100% company participation\)/);
const plain=h.run("V090_rightsInput({},'record')");
assert.equal(plain.masters,true,'Hidden base rights are never turned off by lack of checkbox');
assert.equal(plain.distribution,true);

// An accepted real-world-artist negotiation must carry these rates into the
// signed label contract, not silently revert to Label Share for live income.
h.run("s.started=true;s.cash=100000000;s.energy=200;s.reputation=100;foundLabel({preventDefault(){},target:{name:'Fictional Meridian Records'}});s.world[23].relation=85;");
const min=h.run("ENCORE_ROSTER_NEGOTIATION.terms(s,23,'record',.1,26).minimum");
const request="({type:'record',share:'10',weeks:'26',advance:'"+(min*9)+"',right_touring:'on',rate_touring:'15',right_merch:'on',rate_merch:'10'})";
assert.equal(h.run("V102_submitRosterOffer({preventDefault(){},target:"+request+"},23)"),true,'Valid proposal should reach contract review');
assert.equal(h.run('pendingRosterOffer.rights.rates.touring'),.15);
assert.equal(h.run('pendingRosterOffer.rights.rates.merch'),.1);
h.run("confirmRosterOffer()");
const c=h.run("ownerContracts()[0]");
assert.equal(c.rights.masters,true);
assert.equal(c.rights.rates.touring,.15);
assert.equal(c.rights.rates.merch,.1);
assert.equal(c.share,.1,'Base recording share stays distinct from live and merch rates');
assert.equal(c.type,'record');
const started=c.started;
h.run("s.week="+(started+3)+";s.labelBusiness.company.settledWeek=-1;settleLabelWeek()");
const expected=h.run("cents(s.world[23].fans*.02*(.5+s.world[23].skill/100)*(.75*.15+.25*.1))");
assert.equal(h.run('s.labelBusiness.company.last.other'),expected,'Live/merch income uses the separately negotiated rates');
const before=h.run('s.cash');h.run('settleLabelWeek()');
assert.equal(h.run('s.cash'),before,'Same-week settlement never duplicates a payment');

// Legacy saves with no negotiated category rates retain their previous
// recurring 360-company-share calculation.
h.run("s.labelBusiness.company.contracts[0].type='360';delete s.labelBusiness.company.contracts[0].rights;s.week++;s.labelBusiness.company.settledWeek=-1");
h.run("s.week="+(started+7)+";settleLabelWeek()");
const oldRate=h.run("cents(s.world[23].fans*.02*(.5+s.world[23].skill/100)*.1)");
assert.equal(h.run('s.labelBusiness.company.last.other'),oldRate,'Historical 360 contract settlements remain stable');
h.run('validateBundle(saveBundle())');
await h.run('saveNow()');await h.run('boot()');
assert.equal(h.run('ownerContracts()[0].share'),.1,'Career reload retains recording share');
const currentCss=fs.readFileSync(new URL('../src/v106-showcase-fidelity.css',import.meta.url),'utf8');
assert.ok(currentCss.includes('negotiation-offer-sheet'),'No need to change negotiation layout styling');
console.log('PASS ENCORE contract controls: 5–100% participation, no duplicated base rights, unchanged length and layout, signed rates, settlement, legacy saves.');
