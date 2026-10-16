import assert from 'node:assert/strict';
import {harness} from './harness.mjs';

const h=harness('/sandbox',111222);await h.run('boot()');

assert.equal(h.run('V111_baseTax(25000)'),0);
assert.equal(h.run('V111_baseTax(100000)'),6000);
assert.equal(h.run('V111_baseTax(500000)'),66000);
assert.equal(h.run('V111_federalMarginalRate(10000000)'),.27);
assert.equal(h.run('V111_federalMarginalRate(10000001)'),.32);

h.run("s.scene.city='austin';globalThis.austin=V100_taxQuote(20000000);s.scene.city='la';globalThis.la=V100_taxQuote(20000000)");
assert.equal(h.run('austin.city.taxAdj'),0);
assert.equal(h.run('la.city.taxAdj'),.04);
assert.ok(h.run('la.total>austin.total'));
assert.equal(h.run('austin.marginal'),.32);
assert.equal(h.run('la.marginal'),.36);
assert.ok(h.run('la.marginal<=.36'));

h.run("s.scene.city='austin';s.finance=initialFinance(s.week);s.finance.week.expenses=10000;recordIncome('media',100000);recordIncome('wages',25000);globalThis.r=closeFinances(25000,0)");
assert.equal(h.run('r.revenue'),150000);
assert.ok(h.run('r.deductibleExpenses>=10000'));
assert.equal(h.run('r.weekTaxableIncome'),h.run('Math.max(0,r.revenue-r.expenses)'));
assert.equal(h.run("r.taxModel"),'ENCORE Tax Foundation 2.0');
assert.ok(h.run("financeRows(r,true).some(x=>x[0]==='TAXABLE · Income subject to tax')"));
assert.ok(h.run("V111_taxPlanningCard().includes('What ENCORE is actually taxing.')"));

h.run("globalThis.modalHtml='';modal=(html)=>{globalThis.modalHtml=html};queueSave=()=>{};V111_weekRecap(s.week,100000,500,false,r,[])");
assert.ok(h.run("modalHtml.includes('04 / TAXABLE INCOME MOVEMENT')"));
assert.ok(h.run("modalHtml.includes('05 / TAX RESERVE')"));
assert.ok(h.run("modalHtml.includes('06 / YOU KEPT')"));
assert.ok(h.run("modalHtml.includes('TAXABLE INCOME')"));

console.log('PASS ENCORE Tax Foundation 2.0: lower progressive brackets, 0–4 point regional tax, 36% marginal cap, deductible taxable-income basis, planning snapshot and upgraded weekly recap.');
