import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',123001);await h.run('boot()');
h.run("s.cash=500000000;s.fans=25000000;s.labelBusiness.company={name:'Encore Group'};migrateV092();V123_execState()");
assert.ok(h.run('V123_scale()')>=3,'large careers should unlock major-company executive seats');
assert.equal(h.run("V096_BUSINESS_AREAS.find(x=>x.id==='Agency').name"),'Artist representation');
assert.equal(h.run("V096_BUSINESS_AREAS.find(x=>x.id==='Team').name"),'Executive Office');

const page=h.run('teamPage()');
assert.ok(page.includes('EXECUTIVE OFFICE'));
assert.ok(page.includes('personal manager'));
assert.ok(page.includes('Founder ownership')||page.includes('FOUNDER OWNERSHIP'));

const candidate=h.run("V123_candidates('cfo')[0]");
assert.equal(candidate.role,'cfo');
assert.ok(candidate.salary>0);
assert.ok(candidate.bonusPct>=8);
h.run(`V123_hireExecutive('cfo','${candidate.id}')`);
assert.ok(h.run('Boolean(V123_execState().team.cfo)'));
assert.equal(h.run('V123_execState().team.cfo.authority'),'hands','new executives must never receive automatic authority');

h.run("V123_setAuthority('cfo','full')");
assert.equal(h.run('V123_execState().team.cfo.authority'),'full');
const ownership=h.run('V123_founderOwnership()');
assert.ok(ownership<=100&&ownership>=0);

h.run("V123_changeStrategy('profit')");
assert.equal(h.run('V123_execState().strategy'),'profit');
const baseRate=h.run('V123_operationRateBase()'),managedRate=h.run('operationRate()');
assert.ok(managedRate<=baseRate,'delegated finance leadership plus profitability strategy should not increase career overhead');

const beforeCash=h.run('s.cash'),beforeExpenses=h.run('s.finance.week.expenses');
const payroll=h.run('V123_settleExecutiveWeek(s.week)');
assert.ok(payroll>0);
assert.equal(h.run('s.cash'),beforeCash-payroll);
assert.equal(h.run('s.finance.week.expenses'),beforeExpenses+payroll);
assert.equal(h.run('V123_settleExecutiveWeek(s.week)'),0,'executive payroll must settle once per completed week');

h.run("V123_hiringRole='cmo'");
const cmo=h.run("V123_candidates('cmo')[0]");
h.run(`V123_hireExecutive('cmo','${cmo.id}')`);
h.run("V123_setAuthority('cmo','guardrails')");
const meeting=h.run('V123_generateMeeting(true)');
assert.ok(meeting&&meeting.status==='open');
assert.ok(h.run("V096_businessAreaBadge('Team')")>=1,'open executive decisions should badge the Executive Office');
const meetingId=meeting.id,choice=meeting.options.at(-1).id;
h.run(`V123_resolveMeeting(${meetingId},'${choice}')`);
assert.equal(h.run(`V123_execState().meetings.find(x=>x.id===${meetingId}).status`),'resolved');

const cfoBefore=h.run('V123_execState().team.cfo.trust');
assert.equal(h.run("V123_interact('cfo','check')"),true);
assert.ok(h.run('V123_execState().team.cfo.trust')>cfoBefore);
assert.equal(h.run("V123_interact('cfo','back')"),false,'only one direct interaction per executive should be allowed each week');

const src=fs.readFileSync(new URL('../src/v123-executive-office.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v123-executive-office.css',import.meta.url),'utf8');
const build=fs.readFileSync(new URL('../build.mjs',import.meta.url),'utf8');
assert.ok(src.includes('V123_EXEC_ROLES'));
assert.ok(src.includes('V123_settleExecutiveWeek'));
assert.ok(src.includes('V123_generateMeeting'));
assert.ok(src.includes('Hands-On'));
assert.ok(css.includes('.v123-office-hero'));
assert.ok(build.includes("'v123-executive-office'"));
console.log('PASS Executive Office 1.0: company-scale unlocks, executive hiring/compensation, explicit delegation, strategy, payroll, KPI performance, meetings, decision badges and founder ownership are wired separately from artist representation.');
