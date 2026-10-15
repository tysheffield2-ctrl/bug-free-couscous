import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../engine/roster-negotiation.js',import.meta.url),'utf8');
const context={console,Math,BigInt,structuredClone};context.globalThis=context;vm.createContext(context);vm.runInContext(source,context);
const E=context.ENCORE_ROSTER_NEGOTIATION;assert.ok(E);
const fresh=()=>({
 name:'Solace',week:20,reputation:70,energy:200,cash:500000,walletCents:'50000000',history:[],finance:{week:{expenses:0}},
 labelBusiness:{company:{name:'Coulda Been Records',staff:{manager:false,marketing:false,ar:true},contracts:[]},rosterNegotiations:{}},
 world:[{id:0,name:'Mira Wells',genre:'R&B',fans:500000,skill:74,reputation:68,relation:10,catalog:[{uid:11},{uid:12}]}],
 labelLeague:{labels:Array.from({length:8},(_,id)=>({id,budget:1000000,score:0})),contracts:{0:{label:2,ends:40,advance:80000}}},
 labelCompetition:{relationships:{},inbound:[],serviceContracts:[],news:[],lastInboundWeek:-99,bids:{}}
});

{
 const s=fresh(),r=E.terms(s,0,'record',.1,26),base=Math.max(1000,Math.round(500000*.12+74*100)),expected=Math.round(base*(1+(0))*1*(1-10*.003)*.85);
 assert.equal(r.minimum,expected);assert.equal(r.reputation,43);
 const n=E.ensure(s,0);assert.equal(n.interest,Math.round(Math.max(12,Math.min(94,48+10*.28+70*.22-8))));assert.equal(n.patience,Math.round(Math.max(24,Math.min(92,66+10*.12+6))));assert.equal(n.leverage,Math.round(Math.max(8,Math.min(95,30+70*.35+8))));
 assert.equal(E.buyout(s,0),Math.round(80000*Math.max(.15,(40-20+1)/52)));
}

{
 const s=fresh(),req=E.terms(s,0,'record',.1,26),result=E.present(s,0,{type:'record',share:.1,weeks:26,advance:req.minimum*4|0},{rng:()=>.5});
 assert.equal(result.status,'accepted');assert.ok(result.negotiation.rounds===1);assert.ok(s.labelCompetition.bids[0].offers.length>=1);
 const beforeCash=s.cash,beforeEnergy=s.energy,buyout=E.buyout(s,0),signed=E.sign(s,0,result.terms);
 assert.equal(s.energy,beforeEnergy-10);assert.equal(s.cash,beforeCash-result.terms.advance-buyout);assert.equal(s.finance.week.expenses,result.terms.advance+buyout);assert.equal(s.labelBusiness.company.contracts.length,1);assert.equal(s.labelBusiness.company.contracts[0].artist,0);assert.equal(s.labelBusiness.company.contracts[0].ends,s.week+25);assert.deepEqual(s.labelBusiness.company.contracts[0].excludedIds,[11,12]);assert.equal(s.labelLeague.contracts[0],undefined);assert.equal(s.world[0].relation,15);assert.equal(E.ensure(s,0).status,'signed');assert.equal(signed.totalCost,result.terms.advance+buyout);assert.ok(s.history[0].text.includes('Signed Mira Wells'));
}

{
 const s=fresh(),req=E.terms(s,0,'360',.8,104);let outcome;for(let i=0;i<8;i++){outcome=E.present(s,0,{type:'360',share:.8,weeks:104,advance:0},{rng:()=>.5});if(outcome.status==='walked')break}assert.equal(outcome.status,'walked');assert.equal(E.ensure(s,0).status,'walked');assert.throws(()=>E.open(s,0),/not ready to reopen talks/);s.week=E.ensure(s,0).walkedUntil;assert.equal(E.open(s,0).status,'active');
}

console.log('PASS shared roster negotiation pricing, meters, rival bids, counters/walkaways, buyouts, signing economics and reopen cooldown.');
