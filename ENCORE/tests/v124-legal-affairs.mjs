import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',124001);await h.run('boot()');
h.run(`
 s.cash=500000000;s.fans=25000000;s.reputation=72;s.started=true;
 s.songs=Array.from({length:12},(_,i)=>({id:i,title:'Record '+i,released:Math.max(1,s.week-i),features:i%3===0?[1,2]:[]}));
 migrateEmpire();s.empire.merch=[{id:1,item:'tee',name:'Tour tee',stock:100,sold:12000,price:35},{id:2,item:'hoodie',name:'Hoodie',stock:40,sold:4200,price:80}];
 s.empire.media=[{id:1,name:'Brand campaign',used:true,expires:s.week+2},{id:2,name:'Sync',used:true,expires:s.week+2}];
 s.empire.assets=[{id:1,kind:'Property',name:'Creative HQ',item:'creative-hq',value:8000000}];
 migrateV083();s.v081.sports.holdings=[{id:9001,team:0,share:.01,basis:18500000,payouts:0,history:[]}];
 migrateSocial();s.social.feed=Array.from({length:12},(_,i)=>({artist:0,week:s.week-i,text:'Post '+i}));
 migrateTouring();s.touring.archive=[{route:Array.from({length:8},(_,i)=>({status:'played',report:{incident:i===0}}))}];
 s.labelBusiness.company={name:'Encore Group',contracts:[{artist:0,started:s.week-10,ends:s.week+30,advance:250000,share:.5,type:'record',excludedIds:[]},{artist:1,started:s.week-8,ends:s.week+24,advance:100000,share:.4,type:'record',excludedIds:[]}]};
 V113_entityState().entity='corporation';V123_execState();
`);

assert.equal(Object.keys(h.run('V124_LEGAL_TYPES')).length,15,'Legal Affairs 2.0 should ship fifteen distinct matter families');
const ctx=h.run('V124_ctx()');
assert.ok(ctx.songs>=12&&ctx.played>=8&&ctx.merchSold>=16000&&ctx.properties>=1&&ctx.sports>=1,'authoritative sports holdings and mature-career activity should enter legal exposure');
const scores=h.run('V124_scores()');
for(const type of ['copyright','credit','producer','venue','injury','merch','sponsor','trademark','defamation','property','label','tax','sports'])assert.ok(scores[type]>0,`${type} should be an active exposure in the mature test career`);

const legalCandidate=h.run("V123_candidates('legal')[0]");
h.run(`V123_hireExecutive('legal','${legalCandidate.id}')`);
h.run("V123_setAuthority('legal','full')");
assert.ok(h.run('V124_prevention()')>.2,'General Counsel should materially reduce modeled filing pressure');

const generated=h.run("V124_generateMatter('copyright',true)");
assert.equal(generated.matterType,'copyright');
assert.equal(generated.category,'Music IP');
assert.ok(generated.claim>=25000);
assert.equal(generated.counselType,'General Counsel');
assert.equal(generated.assignedAttorney,h.run('V123_execState().team.legal.name'));
assert.ok(generated.triggerDetail.includes('songs'));
assert.ok(h.run('V118_openCases().length')>=1);
assert.equal(h.run(`s.achievements.briefings.some(b=>b.id==='legal:${generated.id}')`),false,'cause-based filings should not create a duplicate generic legal briefing');
assert.equal(h.run(`s.achievements.briefings.some(b=>b.id==='legal-risk:${generated.id}')`),true,'cause-based filings should keep the detailed legal-risk briefing');
assert.ok(h.run(`offerBriefingButton({id:'legal-risk:${generated.id}',title:'Copyright dispute',body:'Review the docket.'})`).includes('Review legal case'));
assert.ok(h.run("offerBriefingButton({id:'roster-request:req-demo',title:'Artist wants to revisit the deal',body:'Current economics no longer fit.'})").includes('Review artist request'));
assert.ok(h.run("offerBriefingButton({id:'staff-risk:1',title:'Your team needs attention',body:'Review this hire in Team.'})").includes('Review Team'));
const immersionButton=h.run("offerBriefingButton({id:'industry-breakout:1',title:'Breakout shock: Lyra Vega',body:'The record dramatically outperformed expectations.'})");
assert.ok(!immersionButton.includes('Review Team')&&!immersionButton.includes('Review legal case')&&!immersionButton.includes('Review artist request'),'immersion-only world events should stay narrative instead of pretending to require action');

const direct=h.run("V118_fileCase({title:'Vendor v. Encore',issue:'Vendor breach',plaintiff:'Vendor',claim:100000,strength:55,matterType:'merch',category:'Commerce'})");
assert.equal(direct.counselType,'General Counsel','legacy and directly filed cases should prefer corporate General Counsel');
const beforeSkill=h.run(`V118_legalCases().find(x=>x.id==='${direct.id}').attorneySkill`),beforeCash=h.run('s.cash');
assert.equal(h.run(`V124_retainOutsideCounsel('${direct.id}')`),true);
assert.ok(h.run(`V118_legalCases().find(x=>x.id==='${direct.id}').attorneySkill`)>=beforeSkill);
assert.ok(h.run('s.cash')<beforeCash);

const page=h.run('V118_legalAffairsPage()');
assert.ok(page.includes('LEGAL RISK MONITOR'));
assert.ok(page.includes('Weekly filing risk'));
assert.ok(page.includes('Copyright / sample dispute'));
assert.ok(page.includes('General Counsel')||page.includes(h.run('V123_execState().team.legal.name')));
assert.ok(page.includes('SANDBOX · LEGAL PLAYTEST'),'Sandbox should expose an immediate legal-matter playtest control');
const casesBefore=h.run('V118_legalCases().length');
assert.equal(h.run("V124_sandboxMatter('venue')"),true);
assert.equal(h.run('V118_legalCases().length'),casesBefore+1);
assert.equal(h.run('V118_legalCases()[0].matterType'),'venue');

assert.equal(h.run("V096_BUSINESS_AREAS.some(x=>['Labels','League'].includes(x.id))"),false,'label operations should no longer be Business HQ departments');
assert.equal(h.run("V096_BUSINESS_IDS.has('Labels')||V096_BUSINESS_IDS.has('League')"),false,'Business HQ routing should release label screens');
assert.equal(h.run("V080_destinations.some(x=>x[0]==='Label HQ'&&x[1]==='Label'&&x[2]==='Labels')"),true,'Menu should expose Label HQ as its own non-Business destination');
assert.equal(h.run("V080_destinations.some(x=>x[0]==='Label League'&&x[1]==='Label'&&x[2]==='League')"),true,'Label competition should live beside Label HQ rather than inside Business HQ');
const businessHQ=h.run('V109_businessPage()');
assert.ok(!businessHQ.includes('<small>ROSTER</small>'),'Business HQ KPI rail should no longer use roster count');
assert.ok(!businessHQ.includes('<h1>Encore Group</h1>'),'Business HQ should not borrow the owned-label company identity');

const src=fs.readFileSync(new URL('../src/v124-legal-affairs.js',import.meta.url),'utf8');
const integrations=fs.readFileSync(new URL('../src/v124-legal-integrations.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v124-legal-affairs.css',import.meta.url),'utf8');
const build=fs.readFileSync(new URL('../build.mjs',import.meta.url),'utf8');
assert.ok(src.includes('V124_legalRiskWeek'));
assert.ok(src.includes('V124_generateMatter'));
assert.ok(src.includes('V124_assignGeneralCounsel'));
assert.ok(src.includes('V124_mediateCase'));
assert.ok(integrations.includes('s.v081?.sports?.holdings'));
assert.ok(integrations.includes('V124_sandboxMatter'));
assert.ok(integrations.includes('V124_brief'));
assert.ok(css.includes('.v124-risk-card'));
assert.ok(css.includes('background:linear-gradient(180deg,#111821 0%,#0b1118 100%)'));
assert.ok(build.includes("'v124-legal-affairs'"));
assert.ok(build.includes("'v124-legal-integrations'"));
console.log('PASS Legal Affairs 2.0: fifteen cause-based legal matter families, dark high-contrast dockets, actionable legal/roster/team briefings, preserved immersion-only world events, separate Label navigation, Sandbox playtest, General Counsel, sports exposure, outside counsel and mediation are wired into the career simulation.');