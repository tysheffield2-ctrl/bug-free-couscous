import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';
const h=harness('/sandbox',621);await h.run('boot()');
h.run(`s.started=true;titleVisible=false;foundLabel({preventDefault(){},target:{name:'Northlight Records'}});LB_state()`);
assert.equal(h.run('LB_state().authority'),'review');
assert.equal(h.run("LB_hire('producer',0)"),false,'signature required');
for(const role of ['ar','manager','producer','development','marketing']){
 h.run(`V101_signatureStrokes=[[{x:.1,y:.1,p:.5},{x:.2,y:.2,p:.5},{x:.3,y:.1,p:.5}]]`);
 assert.equal(h.run(`LB_hire('${role}',0)`),true);
 assert.equal(h.run(`LB_hire('${role}',0)`),false,'no duplicate hire');
}
assert.equal(h.run('labelPayroll()'),8200);
h.run(`reviewRosterOffer({preventDefault(){},target:{type:'record',share:'10',weeks:'52',advance:String(rosterTerms(s.world[23],'record',.1,52).minimum)}},23);confirmRosterOffer()`);
assert.equal(h.run('ownerContracts().length'),1);
const cash=h.run('s.cash');assert.equal(h.run("LB_startProject(23,'Glass Horizon',5000)"),true);
assert.equal(h.run('s.cash'),cash-5000);
assert.equal(h.run("LB_startProject(23,'Duplicate',5000)"),false);
assert.equal(h.run("LB_startProject(23,'Bad budget',NaN)"),false);
h.run('prepareLabelWeek()');assert.ok(h.run('LB_state().shortlist.length')>0);
const after=h.run('s.cash'),progress=h.run('LB_state().projects[0].progress');
h.run('prepareLabelWeek()');assert.equal(h.run('s.cash'),after);assert.equal(h.run('LB_state().projects[0].progress'),progress,'weekly idempotency');
for(let i=0;i<16&&h.run('LB_state().projects[0].status')!=='ready';i++)h.run('advance(true)');
assert.equal(h.run('LB_state().projects[0].status'),'ready');
assert.equal(h.run("s.world[23].catalog.filter(x=>x.title==='Glass Horizon').length"),0,'manual approval holds release');
assert.equal(h.run('LB_release(1)'),true);assert.equal(h.run('LB_release(1)'),false);
h.run('advance(true)');assert.equal(h.run('LB_state().projects[0].status'),'released');
assert.equal(h.run("s.world[23].catalog.filter(x=>x.title==='Glass Horizon').length"),1);
assert.ok(h.run('s.labelBusiness.company.last.income')>0,'existing contract earns release income');
const saved=h.run('JSON.stringify(saveBundle())');h.run(`s=validateBundle(JSON.parse(${JSON.stringify(saved)}))`);
assert.equal(h.run('LB_state().team.producer.name'),'Sage Bennett');
assert.equal(h.run('LB_state().projects[0].status'),'released');
h.run('s.energy=200');assert.equal(h.run("LB_startProject(23,'Second Light',4000)"),true);
const beforeRefund=h.run('s.cash');assert.equal(h.run('LB_cancelProject(2)'),true);assert.equal(h.run('s.cash'),beforeRefund+4000);assert.equal(h.run('LB_cancelProject(2)'),false);
assert.equal(h.run("LB_policy('delegated',10000)"),true);
assert.equal(h.run("LB_startProject(23,'Open Water',3000)"),true);
h.run('s.cash=0;s.walletCents="0";advance(true)');assert.equal(h.run('LB_state().projects[2].progress'),0,'unfunded staff cannot work');
h.run('changeCash(10000000)');
for(let i=0;i<16&&h.run('LB_state().projects[2].status')!=='released';i++)h.run('advance(true)');
assert.equal(h.run('LB_state().projects[2].status'),'released','delegated completion releases without approval');
h.run('s.energy=200');assert.equal(h.run("LB_startProject(23,'Final Window',2000)"),true);
h.run('s.labelBusiness.company.contracts[0].ends=s.week-1;prepareLabelWeek()');assert.equal(h.run('LB_state().projects[3].status'),'cancelled','expiry cancels and refunds pending work');
// Each new route renders through the same focused shell; no UI redesign.
h.run(fs.readFileSync('dist/native-shell.js','utf8'));h.run('V137_installShell()');
for(const route of ['LabelBoss','LabelStaff','LabelRoster','LabelProjects','LabelScouting','LabelSettings']){h.run(`go('${route}')`);assert.match(h.elements.app.innerHTML,/core-content/)}
const normal=harness('/');await normal.run('boot()');normal.run('s.started=true;titleVisible=false;foundLabel({preventDefault(){},target:{name:"Too Early"}})');assert.equal(normal.run('s.labelBusiness.company'),null);
normal.run(fs.readFileSync('dist/native-shell.js','utf8'));normal.run('V137_installShell();go("LabelBoss")');assert.match(normal.elements.app.innerHTML,/Optional career expansion/);
console.log('PASS Label Boss: unlock, signature hiring, payroll, scouting, projects, manual/delegated release, royalties, refunds, expiry, saves and six routes.');

// Signature execution in the live shell, including cancellation and duplicate submit.
const ui=harness('/sandbox',881);await ui.run('boot()');ui.run('s.started=true;titleVisible=false;foundLabel({preventDefault(){},target:{name:"Juniper Audio"}})');
ui.run(fs.readFileSync('dist/native-shell.js','utf8'));ui.run('V137_installShell();go("LabelScouting")');
ui.run("Object.assign($('v101-signature-pad'),{dataset:{},addEventListener(){}})");
ui.run(`pendingRosterOffer={artist:23,type:'record',share:.1,weeks:26,advance:rosterTerms(s.world[23],'record',.1,26).minimum,buyout:npcBuyout(23)};V101_openRosterContract()`);
assert.match(ui.elements.modal.innerHTML,/v101-signature-pad/);
assert.equal(ui.run('LB_executeRoster()'),false);
ui.run('V101_signatureStrokes=[[{x:.1,y:.1,p:.5},{x:.2,y:.2,p:.5},{x:.3,y:.1,p:.5}]]');
assert.equal(ui.run('LB_executeRoster()'),true);assert.equal(ui.run('ownerContracts().length'),1);
assert.ok(ui.run('ownerContracts()[0].ceoSignature.strokes.length')>0);
assert.equal(ui.run('LB_executeRoster()'),false);
console.log('PASS live shell: one drawn roster signature, no typed initials, saved signature, duplicate execution blocked.');
// The isolated week worker includes Label Boss and advances staff work from a saved career.
const vm=await import('node:vm');
ui.run(`s.energy=200;s.labelBusiness.company.staff.development=true;LB_state();LB_startProject(23,'Worker Session',2000)`);
const input=JSON.parse(ui.run('JSON.stringify(s)'));let workerResult;
const workerContext={console,location:{pathname:'/sandbox/week-engine.js'},postMessage:r=>workerResult=r};
vm.createContext(workerContext);vm.runInContext(fs.readFileSync('dist/week-engine.js','utf8'),workerContext);
workerContext.onmessage({data:{type:'advance-week',state:input}});
assert.equal(workerResult.ok,true,workerResult.error);
assert.equal(workerResult.state.week,input.week+1);
assert.ok(workerResult.state.labelBusiness.company.boss.projects[0].progress>0);
assert.equal(input.labelBusiness.company.boss.projects[0].progress,0,'worker must not mutate supplied state');
console.log('PASS isolated week worker advances Label Boss projects without mutating its input.');
