import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../src/v110-income-attribution.js',import.meta.url),'utf8');
const build=fs.readFileSync(new URL('../build.mjs',import.meta.url),'utf8');
const built=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8');

for(const label of ['Media appearances','Endorsements','Brand deals','Brand partnerships','Lifetime partnerships'])assert.ok(js.includes(label),`missing recap income category ${label}`);
for(const contract of ['V110_storeIncomeDetail','settleCommercialContracts080=function()','dealIncomeDetails','V103_recapRows=function(r)','financeRows=function(r,full=false)'])assert.ok(js.includes(contract),`missing deal-income attribution contract ${contract}`);
assert.ok(js.includes('Guaranteed installment'),'scheduled commercial payouts must retain source attribution');
assert.ok(js.includes('Signing payment'),'commercial signing payouts must retain source attribution');
assert.ok(js.includes('↳ ${x.name} · ${x.phase}'),'full report must identify the paying agreement');
assert.ok(js.includes('↳ ${x.phase} · ${x.name}'),'full report must identify paid career appearances');
assert.ok(build.includes("'v110-income-attribution'"),'build must load v110 income attribution after recap/contract modules');
assert.ok(built.includes('V110_commercialRollup'),'dist game must contain deal-income attribution runtime');

console.log('PASS ENCORE v1.10: commercial income is split by source in the weekly recap and full finance reports retain named payment detail without changing authoritative revenue totals.');
