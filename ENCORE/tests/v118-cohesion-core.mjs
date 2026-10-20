import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',118001);await h.run('boot()');

// v117 regression: challenging a representative must create friction, never a gain.
assert.ok(h.run("V117_actionDelta({marketStyle:'Relationship builder'},'challenge')")<0);
assert.ok(h.run("V117_actionDelta({marketStyle:'Risk litigator'},'challenge')")<0);

// Seed a player-owned label and a live roster deal so the test isolates the new
// post-signing lifecycle instead of repeating formation/readiness coverage.
h.run(`s.labelBusiness.company={name:'Encore Records',started:1,staff:{manager:true,marketing:true,ar:false},staffFunded:true,contracts:[],catalogRights:[],receipts:0,last:{week:s.week,recording:0,other:0,income:0,payroll:0},preparedWeek:0,settledWeek:0}`);
h.run(`s.world[0].catalog.push({uid:88001,title:'Pressure Point',type:'Single',week:s.week,base:100000,streams:800000,total:3200000,factor:1.7})`);
h.run(`s.world[0].weekly=800000;s.world[0].fans=5000000;s.world[0].reputation=84`);
h.run(`s.labelBusiness.company.contracts.push({artist:0,type:'record',share:.4,weeks:52,advance:250000,started:s.week,ends:s.week+51,receipts:0,excludedIds:[]})`);

const agreement=h.run(`V118_storeRosterAgreement(s.labelBusiness.company.contracts[0])`);
assert.ok(String(agreement).startsWith('roster-'));
assert.equal(h.run(`V100_contractVault().some(x=>x.id==='${agreement}'&&x.kind==='roster')`),true,'roster signing must become an immutable contract-vault record');
assert.equal(h.run(`V118_catalogRights().length`),0);
h.run(`V118_ensureCatalogRight(s.labelBusiness.company.contracts[0])`);
assert.equal(h.run(`V118_catalogRights().length`),1);

const state=h.run(`V118_rosterState(s.labelBusiness.company.contracts[0])`);
for(const key of ['trust','satisfaction','momentum','ownershipTension','leverage','support'])assert.ok(Number.isFinite(state[key]),key+' must exist on signed-artist relationship state');

const trustBefore=h.run(`V118_rosterState(s.labelBusiness.company.contracts[0]).trust`);
assert.equal(h.run(`V118_rosterAction(0,'checkin')`),true);
assert.ok(h.run(`V118_rosterState(s.labelBusiness.company.contracts[0]).trust`)>trustBefore,'executive check-in should change trust');
assert.equal(h.run(`V118_rosterAction(0,'autonomy')`),false,'only one direct label-management action per artist per week');

// Formal artist requests are linked back to the executed agreement.
h.run(`s.week+=1;const rr=V118_rosterState(s.labelBusiness.company.contracts[0]);rr.leverage=92;rr.ownershipTension=88;rr.satisfaction=28;rr.trust=30`);
const reqId=h.run(`V118_createRosterRequest(s.labelBusiness.company.contracts[0],'catalog-buyback','Artist wants control of the covered masters.').id`);
assert.equal(h.run(`V118_requestForAgreement('${agreement}').id`),reqId);
assert.equal(h.run(`V118_reviewRosterRequest('${reqId}')`),true);
assert.ok(h.elements.modal.innerHTML.includes('CATALOG / MASTER REPURCHASE'));
h.run(`V118_resolveRosterRequest('${reqId}','refuse')`);
assert.ok(h.run(`V118_legalCases().length>=1`),'high-leverage refusal should be able to create a legal dispute');
const caseNo=h.run(`V118_legalCases()[0].number`);
assert.ok(/^ENC-CIV-\d{4}-\d{4}$/.test(caseNo),'legal matters need durable court-style case numbers');
assert.equal(h.run(`V118_legalCases()[0].agreementId`),agreement,'lawsuit must link to the executed agreement');

// The docket is player-facing and permanent.
const legal=h.run(`V118_legalAffairsPage()`);
assert.ok(legal.includes('ENCORE LEGAL AFFAIRS'));
assert.ok(legal.includes(caseNo));
h.run(`V118_openDocketCase(V118_legalCases()[0].id)`);
assert.ok(h.elements.modal.innerHTML.includes('Cause / issue'));
assert.ok(h.elements.modal.innerHTML.includes('File defense'));

const file=h.run(`artistFilePage()`);
assert.ok(file.includes('LEGAL / BUSINESS RECORD'),'Artist File should surface the permanent legal/business record');
assert.ok(file.includes('Open legal docket'));

// The modern Representation engine is now the only player-facing agency page.
const agency=h.run(`agencyPage()`);
assert.ok(agency.includes('REPRESENTATION 3.0'));
assert.ok(!agency.includes('V100_repAgencyPageOld'),'legacy agent UI must not be appended to Representation');

const src=fs.readFileSync(new URL('../src/v118-cohesion-core.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v118-cohesion-core.css',import.meta.url),'utf8');
const build=fs.readFileSync(new URL('../build.mjs',import.meta.url),'utf8');
assert.ok(src.includes('V118_fileCase'));
assert.ok(src.includes('V118_rosterState'));
assert.ok(src.includes('V118_catalogRights'));
assert.ok(src.includes("agencyPage=function(){V100_repTeam();return V100_repTeamPanel()}"));
assert.ok(css.includes('.v118-docket-paper'));
assert.ok(build.includes("'v118-cohesion-core'"));
console.log('PASS Cohesion Core 1.0: representative friction fix, roster agency after signing, agreement-linked catalog rights, persistent legal dockets, permanent Artist File history and single player-facing Representation UI.');