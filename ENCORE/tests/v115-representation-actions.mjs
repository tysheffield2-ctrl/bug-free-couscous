import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',115001);await h.run('boot()');
h.run("careerTab='Agency';tab='Career'");
const html=h.run('V100_repTeamPanel()');
assert.ok(html.includes("V115_openRoleMarket('manager')"));
assert.ok(html.includes('Browse candidates →'));
assert.ok(!html.includes('<span class="tag">OPEN</span>'));
assert.equal(h.run("typeof V115_openRoleMarket"),'function');
assert.equal(h.run("V115_roleCandidates('manager').length"),2);
assert.equal(h.run("V115_roleCandidates('cpa').length"),3);
assert.equal(h.run("V115_openRoleMarket('manager')"),true);
assert.ok(h.elements.modal.open);
assert.ok(h.elements.modal.innerHTML.includes('Imani Cross'));
assert.ok(h.elements.modal.innerHTML.includes('Marcus Reed'));
assert.ok(h.elements.modal.innerHTML.includes("V115_reviewCandidate('imani')"));
h.run("V115_reviewCandidate('imani')");
assert.ok(h.elements.modal.open);
assert.ok(h.elements.modal.innerHTML.includes('REPRESENTATION · ROLE REVIEW'));
assert.ok(h.elements.modal.innerHTML.includes('Review full contract'));

const src=fs.readFileSync(new URL('../src/v115-representation-actions.js',import.meta.url),'utf8');
assert.ok(src.includes('Browse candidates →'));
assert.ok(src.includes('V115_openRoleMarket'));
assert.ok(src.includes('V115_reviewCandidate'));
console.log('PASS representation role rows are actionable and open focused candidate/contract review flows.');
