import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../src/v108-action-contract-standard.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v108-action-contract-standard.css',import.meta.url),'utf8');
const build=fs.readFileSync(new URL('../build.mjs',import.meta.url),'utf8');
const built=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');

for(const contract of [
  'V108_mountStandardContract',
  'V108_openRepContract',
  'acceptCommercialOffer080=function(id){return V108_openCommercialContract(id)}',
  'signAgent=function(id,confirmed=false)',
  'signLabel=function(i,confirmed=false)',
  'renewRoster=function(id,confirmed=false)'
]) assert.ok(js.includes(contract),`missing unified contract route: ${contract}`);

for(const action of [
  'Review now',
  'Open Opportunities',
  'Review interview offer',
  'Review city report',
  'Open Touring',
  'Open Career Inbox'
]) assert.ok(js.includes(action),`missing direct opportunity action: ${action}`);

for(const explanation of [
  'WHAT THIS REPRESENTATIVE ACTUALLY DOES',
  'Authority limit',
  'There are no mystery bonuses here.',
  'No representative can accept offers or spend money automatically.'
]) assert.ok(js.includes(explanation),`missing representative clarity copy: ${explanation}`);

assert.ok(build.includes("'v108-action-contract-standard'"),'build must load v108 action/contract module');
assert.ok(css.includes('.memo-action-pair'),'missing two-choice briefing layout');
assert.ok(css.includes('.v108-role-explainer'),'missing representative explanation layout');
assert.ok(css.includes('.v108-contract-room'),'missing unified contract-room styling hook');
assert.ok(built.includes('V108_mountStandardContract'),'dist game must contain unified contract runtime');
assert.ok(html.includes('.v108-priority-actions'),'dist HTML must contain action/contract CSS');

console.log('PASS ENCORE v1.08: opportunities can review in place or open their exact screen, representative roles are explicit, and formal signing flows share the artist-contract reading room.');
