import assert from 'node:assert/strict';import {harness} from './harness.mjs';
const h=harness('/sandbox',515151);await h.run('boot()');
h.run("s.started=true;foundLabel({preventDefault(){},target:{name:'Encore House'}})");
assert.equal(h.run("s.labelBusiness.company.name"),'Encore House');
assert.ok(h.run("V096_BUSINESS_IDS.has('ContractVault')"));
h.run("tab='Career';careerTab='ContractVault'");
assert.ok(h.run("career().includes('Contract Vault')"));

h.run("globalThis.comp=V100_labelCompetition()");
assert.equal(h.run("V100_labelRelationState(comp.relationships[0])"),'Neutral');
h.run("V100_changeLabelRelation(0,-50,'Test rivalry event')");
assert.equal(h.run("V100_labelRelationState(V100_labelCompetition().relationships[0])"),'Rival');

h.run("globalThis.artist=s.world[0];globalThis.bid=V100_biddingWar(artist.id)");
assert.ok(h.run("bid.offers.length>=1"));
assert.ok(h.run("V100_biddingWarPanel(artist.id).includes('BIDDING WAR')"));

h.run("s.labelLeague.contracts[artist.id]={label:0,ends:s.week+40,share:.2,advance:50000}");
assert.ok(h.run("npcBuyout(artist.id)>0"));
assert.ok(h.run("V100_rivalTalentPanel().includes('Approach artist')"));

h.run("globalThis.c=V100_labelCompetition();c.inbound=[{id:'service-test',type:'marketing',name:'Marketing campaign',detail:'Test campaign',artist:artist.id,fee:25000,weeks:8,share:0,expires:s.week+6,status:'open'}];globalThis.cashBefore=s.cash;globalThis.labelIncomeBefore=s.finance.week.labelBusiness||0;V100_acceptInbound('service-test')");
assert.equal(h.run("V100_labelCompetition().inbound[0].status"),'accepted');
assert.equal(h.run("s.cash-cashBefore"),25000);
assert.equal(h.run("(s.finance.week.labelBusiness||0)-labelIncomeBefore"),25000);
assert.ok(h.run("V100_labelRivalryPanel().includes('LABEL RELATIONSHIPS')"));
assert.ok(h.run("labelLeaguePage().includes('COMPETITIVE TALENT MARKET')"));
console.log('PASS ENCORE 1.0 Contract Vault routing, label rivalries, bidding wars, poaching market and inbound label services.');
