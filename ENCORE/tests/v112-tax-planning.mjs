import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const recommended=harness('/sandbox',112001);await recommended.run('boot()');
recommended.run("s.scene.city='austin';s.finance=initialFinance(s.week);recordIncome('media',1000000);globalThis.r=closeFinances(0,0)");
assert.equal(recommended.run("r.reserveStrategy"),'recommended');
assert.equal(recommended.run('r.actualTaxReserve'),recommended.run('r.recommendedTaxReserve'));

const aggressive=harness('/sandbox',112001);await aggressive.run('boot()');
aggressive.run("V112_setReserveStrategy('aggressive');s.scene.city='austin';s.finance=initialFinance(s.week);recordIncome('media',1000000);globalThis.r=closeFinances(0,0)");
assert.equal(aggressive.run("r.reserveStrategy"),'aggressive');
assert.ok(aggressive.run('r.actualTaxReserve<r.recommendedTaxReserve'));
assert.ok(aggressive.run('r.projectedReserveShortfall>0'));
assert.ok(aggressive.run('s.cash')>recommended.run('s.cash'));
assert.equal(aggressive.run('r.estimatedTaxLiability'),recommended.run('r.estimatedTaxLiability'));

const advisors=harness('/sandbox',112002);await advisors.run('boot()');
advisors.run('globalThis.baseConfidence=V112_forecastConfidence()');
assert.ok(advisors.run("V100_REP_ROLES.cpa.name.includes('CPA')"));
assert.ok(advisors.run("V100_REP_CANDIDATES.filter(x=>x.role==='cpa').length>=3"));
advisors.run("V100_hireRep('maya-chen-cpa');globalThis.cpaConfidence=V112_forecastConfidence()");
assert.ok(advisors.run('cpaConfidence>baseConfidence'));
assert.equal(advisors.run('V100_repTeam().team.cpa.weeklyRetainer'),900);
advisors.run("V100_hireRep('elena');globalThis.fullConfidence=V112_forecastConfidence()");
assert.ok(advisors.run('fullConfidence>cpaConfidence'));

advisors.run("s.cash=100000;s.finance=initialFinance(s.week);recordIncome('media',100000);globalThis.r=closeFinances(0,0)");
assert.equal(advisors.run('r.taxAdvisorFee'),900);
assert.ok(advisors.run('r.deductibleExpenses>=900'));
assert.ok(advisors.run("financeRows(r,true).some(x=>x[0]==='CAREER EXPENSE · CPA / tax advisor'&&x[1].includes('$900'))"));
assert.ok(advisors.run("financeRows(r,true).some(x=>x[0]==='TAX PLAN · Reserve strategy')"));
assert.ok(advisors.run("financeScreen().includes('Choose liquidity. The bill does not disappear.')"));
assert.ok(advisors.run("V100_repAdviceFor('cpa').includes('estimated tax liability')"));

const source=fs.readFileSync(new URL('../src/v112-tax-planning.js',import.meta.url),'utf8');
assert.ok(source.includes("documentTitle:'CPA / Tax Advisor Services Agreement'"));
assert.ok(source.includes('V108_mountStandardContract'));
assert.ok(source.includes('Aggressive does not reduce taxes.'));

console.log('PASS ENCORE Tax Planning 2.0: reserve strategies change liquidity not liability, CPA/Business Manager improve forecast precision, CPA retainer is deductible and the full contract experience is used.');
