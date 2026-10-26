import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',136001);await h.run('boot()');

// Seed a live owned-label agreement so agreement-linked memories can resolve
// back to the artist even when a later legal event only carries the agreement ID.
h.run(`s.labelBusiness.company={name:'Encore Records',started:1,staff:{manager:true,marketing:true,ar:false},staffFunded:true,contracts:[],catalogRights:[],receipts:0,last:{week:s.week,recording:0,other:0,income:0,payroll:0},preparedWeek:0,settledWeek:0}`);
h.run(`s.world[0].relation=50;s.labelBusiness.company.contracts.push({artist:0,type:'record',share:.4,weeks:52,advance:250000,started:s.week,ends:s.week+51,receipts:0,excludedIds:[]})`);
const agreement=h.run(`V118_storeRosterAgreement(s.labelBusiness.company.contracts[0])`);

// A direct decision must become a durable artist memory and alter remembered
// relationship context, not merely append flavor text to a feed.
const before=h.run(`V136_effectiveRelation(s.world[0])`);
const refused=h.run(`V118_event('roster-request-refused','Artist request refused','The label refused a catalog request.',{artistId:0,agreementId:'${agreement}'})`);
assert.ok(refused.id);
assert.equal(h.run(`V136_memories('artist:0',{limit:10}).some(x=>x.id==='${refused.id}')`),true,'artist memory should index consequential events');
assert.ok(h.run(`V136_relation('artist:0','player').grievance`)>=16,'refusal should create remembered grievance');
assert.ok(h.run(`V136_effectiveRelation(s.world[0])`)<before,'remembered grievance should lower effective relationship context');

// A lawsuit filed in the same causal chain should point back to the refusal,
// recover the artist from the linked agreement, and deepen the remembered dispute.
const lawsuit=h.run(`V118_event('lawsuit','Artist v. Encore Records','Catalog ownership dispute.',{agreementId:'${agreement}',caseId:'case-test'})`);
assert.equal(h.run(`V136_findEvent('${lawsuit.id}').causeIds.includes('${refused.id}')`),true,'legal escalation should retain its causal parent');
assert.equal(h.run(`V136_memories('artist:0',{limit:10}).some(x=>x.id==='${lawsuit.id}')`),true,'agreement-linked legal event should resolve back to the artist');
assert.ok(h.run(`V136_relation('artist:0','player').grievance`)>=30,'lawsuit should deepen remembered grievance');

// Positive later history can repair context instead of relations being frozen.
const affinityBeforeRepair=h.run(`V136_relation('artist:0','player').affinity`);
h.run(`V118_event('roster-request-resolved','Artist request accepted','The label reached a new agreement.',{artistId:0,agreementId:'${agreement}'})`);
assert.ok(h.run(`V136_relation('artist:0','player').affinity`)>affinityBeforeRepair,'later choices should be able to repair remembered affinity');

// Collaboration terms use effective remembered history while the raw legacy
// relation remains intact for compatibility with systems not migrated yet.
const raw=h.run(`s.world[0].relation`);
const projected=h.run(`V125_terms(s.world[0],'writer').rel`);
assert.equal(h.run(`s.world[0].relation`),raw,'projection must not mutate legacy relation storage');
assert.equal(projected,h.run(`V136_effectiveRelation(s.world[0])`),'songwriting terms should read remembered relationship context');
h.run(`V092_outgoingFeatureTerms(s.world[0])`);
assert.equal(h.run(`s.world[0].relation`),raw,'feature-term projection must restore legacy relation storage');

// Important memories survive beyond Cohesion Core's 500-event rolling feed.
// Pruning is intentionally batched so a long career does not sort the memory
// graph on every single event once it becomes large.
const defining=h.run(`V136_recordEvent({kind:'award',title:'Defining career win',detail:'A permanent milestone.',entities:['player'],salience:96}).id`);
h.run(`for(let i=0;i<1400;i++)V118_event('noise','Routine update '+i,'Low-salience activity.',{includePlayer:false,entities:['system:test']})`);
assert.equal(h.run(`!!V136_findEvent('${defining}')`),true,'high-salience career memory must outlive the rolling event feed and pruning');
assert.ok(h.run(`V118_state().events.length`)<=500,'legacy activity feed should remain bounded');
assert.ok(h.run(`V136_state().recordCount`)<=h.run(`V136_MEMORY_PRUNE_TRIGGER`),'durable memory store should remain bounded after batched pruning');
assert.equal(h.run(`V136_state().recordCount`),h.run(`Object.keys(V136_state().records).length`),'constant-time record counter must stay synchronized with durable memory storage');

const artistPanel=h.run(`V136_artistMemoryPanel(0)`);
assert.ok(artistPanel.includes('PERSISTENT MEMORY'));
assert.ok(artistPanel.includes('effective relation'));
const careerPanel=h.run(`V136_careerMemoryPanel()`);
assert.ok(careerPanel.includes('CAREER MEMORY'));
assert.ok(careerPanel.includes('Defining career win'));

const src=fs.readFileSync(new URL('../src/v136-living-memory.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v136-living-memory.css',import.meta.url),'utf8');
const build=fs.readFileSync(new URL('../build.mjs',import.meta.url),'utf8');
const pkg=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8'));
assert.ok(src.includes('V136_indexEvent'));
assert.ok(src.includes('V136_causeTrail'));
assert.ok(src.includes('V136_effectiveRelation'));
assert.ok(src.includes('V136_featureTermsBase'));
assert.ok(src.includes('V136_MEMORY_PRUNE_TRIGGER'));
assert.ok(src.includes('recordCount'));
assert.ok(css.includes('.v136-memory'));
assert.ok(build.includes("'v136-living-memory'"));
assert.ok(pkg.scripts['test:regression'].includes('v136-living-memory.mjs'));
console.log('PASS Living Memory foundation: durable entity memory, causal chains, remembered relationship context, collaboration consequences, constant-time event counting, batched pruning, high-salience retention and player-facing history.');
