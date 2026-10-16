import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',113001);await h.run('boot()');
assert.equal(h.run('V113_entity().id'),'individual');
assert.equal(h.run('V113_entityUseCap()'),.5);
assert.ok(h.run("wealthItems.some(x=>x.id==='tourcoach'&&x.businessEligible)"));
assert.ok(h.run("wealthItems.some(x=>x.id==='studio-loft'&&x.businessEligible)"));

h.run("s.cash=1000000;s.fans=1000000;globalThis.before=s.cash;globalThis.formed=V113_formEntity('llc',true)");
assert.equal(h.run('formed'),true);
assert.equal(h.run('V113_entity().id'),'llc');
assert.equal(h.run('V113_entityUseCap()'),.75);
assert.equal(h.run('before-s.cash'),2500);

h.run("migrateEmpire();s.empire.assets.push({id:999,item:'tourcoach',name:'Tour Coach',kind:'Cars',qty:1,basis:850000,value:800000,condition:100,tenant:null,businessUsePct:.75,usefulLifeWeeks:364,depreciationClaimed:0});globalThis.originalBasis=V113_adjustedBasis(s.empire.assets.at(-1));s.finance=initialFinance(s.week);recordIncome('media',500000);globalThis.r=closeFinances(0,0)");
assert.ok(h.run('r.depreciationDeduction>0'));
assert.equal(h.run('r.entityAdminFee'),100);
assert.equal(h.run("r.entityStructure"),'Career LLC');
assert.ok(h.run('s.empire.assets.at(-1).depreciationClaimed>0'));
assert.ok(h.run('V113_adjustedBasis(s.empire.assets.at(-1))<originalBasis'));
assert.ok(h.run("financeRows(r,true).some(x=>x[0]==='TAX DEDUCTION · Non-cash depreciation')"));
assert.ok(h.run("financeRows(r,true).some(x=>x[0]==='CAREER EXPENSE · Entity administration')"));
assert.ok(h.run("V103_recapRows(r).expenses.some(x=>x[0]==='Non-cash depreciation')"));
assert.ok(h.run("financeScreen().includes('ENTITY & ASSET PLANNING')"));
assert.ok(h.run("wealthInventory().includes('BUSINESS ASSETS')"));

const src=fs.readFileSync(new URL('../src/v113-entities-assets.js',import.meta.url),'utf8');
assert.ok(src.includes('Depreciation claimed'));
assert.ok(src.includes('Adjusted tax basis'));
assert.ok(src.includes('Structures do not change ENCORE’s tax brackets.'));

console.log('PASS ENCORE Entities & Assets 1.0: structure tradeoffs, business-use classification, non-cash depreciation, explicit admin costs and adjusted-basis sale treatment.');
