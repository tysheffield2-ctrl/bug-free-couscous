import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',145001);
await h.run('boot()');
assert.equal(h.run('s.labelBusiness?.company?.boss||null'),null,'new player state must not be added without creating a label');
assert.equal(h.run('V145_read()'),null,'looking up Boss state is non-mutating');

h.run("s.started=true;s.energy=200;s.cash=500000;foundLabel({preventDefault(){},target:{name:'Fictional Sound Collective'}});V145_state()");
assert.equal(h.run('s.labelBusiness.company.name'),'Fictional Sound Collective');
assert.match(h.run('EUI.more()'),/Label Boss/);
assert.match(h.run('EUI.labelBoss()'),/Roster and production/);
assert.match(h.run('EUI.labelBoss()'),/scouting/);
assert.equal(h.run('V145_payroll()'),0);

assert.equal(h.run("V145_reviewHire('producer',1)"),true,'named producer candidate opens a real contract');
const signatureScreen=h.bodyChildren.at(-1).innerHTML;
assert.match(signatureScreen,/ONE SIGNATURE · NO TYPING/);
assert.match(signatureScreen,/Staff producer/);
assert.match(signatureScreen,/v101-signature-pad/);
assert.equal(h.run('V144_execute()'),false,'blank pad cannot execute a hire');
assert.equal(h.run('V145_staff(\'producer\')'),false);
h.run("V101_signatureStrokes=[[{x:.08,y:.5,p:.4},{x:.15,y:.2,p:.5},{x:.28,y:.62,p:.5},{x:.43,y:.25,p:.6},{x:.7,y:.55,p:.6},{x:.9,y:.25,p:.4}]]");
assert.equal(h.run('V144_execute()'),true,'drawn signature completes producer employment');
assert.equal(h.run("V145_staff('producer')"),true);
assert.equal(h.run("V145_read().team.producer.skill"),62);
assert.equal(h.run("s.v144.agreements.filter(a=>a.kind==='label-staff').length"),1);
assert.equal(h.run("V145_reviewHire('producer',0)"),false,'same role cannot be hired twice');
assert.equal(h.run('V145_payroll()'),2200,'producer salary becomes a weekly liability');

// Other roles are established with existing confirmed legacy staff state, as on imported careers.
h.run("s.labelBusiness.company.staff.ar=true;s.labelBusiness.company.staff.marketing=true;V145_read().team.development=V145_candidate('development',0);s.labelBusiness.company.contracts.push({artist:23,type:'record',share:.25,weeks:52,advance:1000,started:s.week,ends:s.week+51,receipts:0,excludedIds:s.world[23].catalog.map(x=>x.uid)});s.world[23].nextRelease=s.week+99;");
assert.equal(h.run('V145_payroll()'),7500,'old staff salaries and new producer/coach salaries reconcile');
assert.equal(h.run('V145_assignProject(23)'),true,'commission a real project for signed roster artist');
assert.equal(h.run("V145_read().projects[0].spent"),4000);
assert.equal(h.run("V145_read().projects[0].stage"),'development');
assert.equal(h.run('V145_assignProject(23)'),false,'no duplicate projects for same roster artist');
assert.equal(h.run("V145_read().projects.filter(x=>x.artist===23).length"),1);

const id=h.run('V145_read().projects[0].id');
const cashAfterProject=h.run('s.cash');
const worldSkill=h.run('s.world[23].skill');
const countBefore=h.run('s.world[23].catalog.length');
for(let i=0;i<5;i++)h.run('s.week++;prepareLabelWeek();worldWeek();settleLabelWeek()');
assert.equal(h.run('V145_read().projects[0].status'),'ready','manual approval keeps a completed recording unreleased');
assert.equal(h.run('V145_read().projects[0].stage'),'ready');
assert.equal(h.run('s.world[23].catalog.filter(x=>x.labelBossProject).length'),0);
assert.ok(h.run('s.world[23].skill')>worldSkill,'development work permanently improves the artist');
assert.equal(h.run("V145_read().statements.length"),5);
assert.equal(h.run('s.labelBusiness.company.last.payroll'),7500);
const cashBeforeDuplicate=h.run('s.cash');
h.run('prepareLabelWeek();settleLabelWeek()');
assert.equal(h.run('s.cash'),cashBeforeDuplicate,'repeated week closure cannot debit or credit again');
assert.equal(h.run('V145_read().statements.length'),5,'no duplicate weekly accounting statement');
assert.equal(h.run('V145_approve('+id+')'),true,'CEO can explicitly authorize a finished recording');
assert.equal(h.run('V145_approve('+id+')'),false,'release cannot be executed twice');
assert.equal(h.run('s.world[23].catalog.filter(x=>x.labelBossProject).length'),1);
assert.ok(h.run('s.world[23].catalog.length')>countBefore);
assert.equal(h.run('V145_read().projects[0].status'),'released');
h.run('s.week++;prepareLabelWeek();worldWeek();settleLabelWeek()');
assert.ok(h.run('s.labelBusiness.company.last.recording')>0,'label royalties include the commissioned master through existing ledger');
assert.ok(h.run("V145_read().statements[0].receipts")>=0);
h.run('validateBundle(saveBundle())');
await h.run('saveNow()');
await h.run('boot()');
assert.equal(h.run('V145_read().projects[0].status'),'released','reload preserves label projects');
assert.equal(h.run('V145_read().statements.length'),6,'reload preserves label statements');
assert.equal(h.run('s.world[23].catalog.filter(x=>x.labelBossProject).length'),1,'reload preserves released master');

// Unfunded payroll suspends every department together, without paying partial wages.
const q=harness('/sandbox',145002);await q.run('boot()');
q.run("s.started=true;s.cash=200000;s.energy=200;foundLabel({preventDefault(){},target:{name:'Fictional Haven Music'}});V145_state();s.labelBusiness.company.staff.ar=true;V145_state().team.development=V145_candidate('development',0);s.labelBusiness.company.contracts.push({artist:23,type:'record',share:.2,weeks:52,advance:1000,started:s.week,ends:s.week+51,receipts:0,excludedIds:[]});V145_assignProject(23);s.cash=0;s.walletCents='0';s.week++;prepareLabelWeek();");
assert.equal(q.run('s.labelBusiness.company.staffFunded'),false);
assert.equal(q.run('s.labelBusiness.company.payrollThisWeek'),0);
q.run('V145_advanceProjects()');
assert.equal(q.run('V145_read().projects[0].progress'),0,'unfunded staff must not advance a recording');
assert.ok(q.run('V145_read().unfundedWeeks')>=1);
q.run('prepareLabelWeek()');
assert.equal(q.run('s.cash'),0,'unfunded payroll is idempotent');

// Delegated releases use the same one-time release and save economics.
const d=harness('/sandbox',145003);await d.run('boot()');
d.run("s.started=true;s.cash=200000;s.energy=200;foundLabel({preventDefault(){},target:{name:'Fictional Echo Records'}});V145_state();s.labelBusiness.company.staff.marketing=true;s.labelBusiness.company.staff.ar=true;V145_state().team.development=V145_candidate('development',2);V145_state().team.producer=V145_candidate('producer',2);s.labelBusiness.company.contracts.push({artist:23,type:'record',share:.2,weeks:52,advance:1000,started:s.week,ends:s.week+51,receipts:0,excludedIds:s.world[23].catalog.map(x=>x.uid)});s.world[23].nextRelease=s.week+99;V145_setApproval('delegated');V145_assignProject(23)");
for(let i=0;i<4;i++)d.run('s.week++;prepareLabelWeek();worldWeek();settleLabelWeek()');
assert.equal(d.run("V145_read().projects[0].status"),'released','delegated approval releases completed masters');
assert.equal(d.run('s.world[23].catalog.filter(x=>x.labelBossProject).length'),1);
d.run('settleLabelWeek()');
assert.equal(d.run('s.world[23].catalog.filter(x=>x.labelBossProject).length'),1,'double settlement cannot release twice');

const main=fs.readFileSync(new URL('../src/core-ui.js',import.meta.url),'utf8');
const src=fs.readFileSync(new URL('../src/v145-label-boss.js',import.meta.url),'utf8');
const ui=fs.readFileSync(new URL('../src/core-label-boss.js',import.meta.url),'utf8');
const build=fs.readFileSync(new URL('../dist/contract-engine.js',import.meta.url),'utf8');
assert.match(main,/LabelBoss:EUI.labelBoss/);
assert.ok(build.includes('V145_advanceProjects'));
assert.doesNotMatch(ui,/core-premium|body\.core-ui|style=/i,'no global UI redesign in this expansion');
assert.ok(src.includes('V144_mount'),'staff agreements require the unified signature engine');
console.log('PASS Label Boss expansion: signed hires, A&R, development, recording, campaigns, manual/delegated releases, weekly finances, payroll pause, repeat guards, and reload fidelity.');
