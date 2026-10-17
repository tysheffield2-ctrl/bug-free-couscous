import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',116001);await h.run('boot()');
for(const role of ['manager','booking','business','attorney','publicist','creative','tour','social','cpa']){
 assert.ok(h.run(`V116_rolePool('${role}').length>=8`),role+' needs a deep candidate pool');
 assert.equal(h.run(`V116_roleCandidates('${role}').length`),4,role+' should show four candidates at a time')
}
const first=h.run("V116_roleCandidates('manager').map(x=>x.id).join(',')");
assert.ok(first.includes('imani')&&first.includes('marcus'),'week-one manager search should preserve the original anchor candidates');
h.run("V116_marketState().roles.manager.refresh++");
const second=h.run("V116_roleCandidates('manager').map(x=>x.id).join(',')");
assert.notEqual(second,first,'refresh must change the visible search set');
assert.ok(h.run("V116_roleCandidates('manager').some(x=>x.marketStyle&&x.approach&&x.tradeoff)"));
assert.ok(h.run("V116_rolePool('cpa').some(x=>String(x.id).startsWith('v116-cpa-')&&x.weeklyRetainer>0)"));

h.run("V116_marketState().roles.manager.refresh=0;V115_openRoleMarket('manager')");
assert.ok(h.elements.modal.open);
assert.ok(h.elements.modal.innerHTML.includes('Refresh search'));
assert.ok(h.elements.modal.innerHTML.includes('4 TOTAL CANDIDATES')===false);
assert.ok(h.elements.modal.innerHTML.includes('Approach:'));
assert.ok(h.elements.modal.innerHTML.includes('Trade-off:'));
assert.ok(h.elements.modal.innerHTML.includes('Review role & contract'));

const panel=h.run('V100_repTeamPanel()');
assert.ok(panel.includes('4 candidates at a time'));
assert.ok(panel.includes('market rotates automatically'));
assert.ok(!panel.includes('<span class="tag">OPEN</span>'));

const dynamic=h.run("V116_rolePool('manager').find(x=>String(x.id).startsWith('v116-manager-')).id");
h.run(`V100_hireRep('${dynamic}')`);
assert.equal(h.run('V100_repTeam().team.manager.id'),dynamic);
assert.ok(h.run('V100_repTeam().team.manager.marketStyle.length>0'));
assert.ok(h.run("V100_repAdviceFor('manager').includes('Working style')"));

const src=fs.readFileSync(new URL('../src/v116-representation-market.js',import.meta.url),'utf8');
assert.ok(src.includes('V116_STYLE_BANK'));
assert.ok(src.includes('Refresh search'));
assert.ok(src.includes('rotates automatically each week'));
console.log('PASS Representation Market 2.0: deep role pools, four-candidate search sets, refresh rotation, distinct working styles and persistent hired style.');
