import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {harness} from './harness.mjs';

const code=fs.readFileSync(new URL('../engine/roster-negotiation.js',import.meta.url),'utf8')+'\n'+fs.readFileSync(new URL('../src/v147-artist-intelligence.js',import.meta.url),'utf8');
const sandbox={console,Math,BigInt,structuredClone};
sandbox.globalThis=sandbox;vm.createContext(sandbox);vm.runInContext(code,sandbox);
const E=sandbox.ENCORE_ROSTER_NEGOTIATION;
const artist=(id,extra={})=>({id,name:'Fictional Performer '+id,genre:id%2?'R&B':'Hip-Hop',skill:64+id%20,fans:50000+id*5000,relation:12,reputation:65,catalog:[],...extra});
const career=()=>({
 name:'Fictional CEO',week:25,reputation:80,energy:200,cash:1000000,walletCents:'100000000',
 history:[],finance:{week:{expenses:0}},
 world:Array.from({length:20},(_,i)=>artist(i)),
 labelBusiness:{company:{name:'Fictional Harbor Music',staff:{manager:false,ar:true,marketing:true},contracts:[]},rosterNegotiations:{}},
 labelLeague:{labels:Array.from({length:8},(_,id)=>({id,budget:1e6})),contracts:{}},
 labelCompetition:{relationships:{},inbound:[],news:[],bids:{}}
});
{
 const s=career(),first=E.persona(s,0);
 assert.ok(['advance','ownership','creative control','career reach'].includes(first.priority));
 const previous=JSON.stringify(first);s.world[0].fans=50000000;s.world[0].skill=99;s.week+=104;
 assert.equal(JSON.stringify(E.persona(s,0)),previous,'artist priorities cannot randomly change with career success');
 const junior=E.scoutReport(s,0,20,25),expert=E.scoutReport(s,0,95,25);
 assert.ok(junior&&expert);
 assert.ok(expert.confidence>junior.confidence,'experienced scouts produce more reliable reports');
 assert.ok(expert.max-expert.min<junior.max-junior.min,'experienced scouts narrow uncertainty');
 assert.equal(JSON.stringify(expert),JSON.stringify(E.scoutReport(s,0,95,25)),'reports must be deterministic during the same window');
 assert.equal(E.scoutReport(s,0,95,25).source,'funded A&R report');
 assert.equal(s.world[0].skill,99,'scouting does not modify actual artist ability');
}
{
 const s=career(),n=E.ensure(s,1),before=s.energy;
 const result=E.meet(s,1);assert.equal(result.status,'met');
 assert.equal(s.energy,before-3);
 assert.equal(n.revealed,true);
 assert.equal(n.memory.meetings,1);
 assert.ok(n.response.includes(E.persona(s,1).priority),'artist reveals stable personal goals');
 assert.equal(E.meet(s,1).status,'already-met','repeat conversation in same week is free and inert');
 assert.equal(n.memory.meetings,1);
 s.week++;
 assert.equal(E.meet(s,1).status,'met');
 assert.equal(n.memory.meetings,2,'negotiation memory persists across week changes');
 const restored=structuredClone(s);
 assert.equal(E.ensure(restored,1).memory.meetings,2,'negotiation memories survive serialization');
 assert.equal(E.ensure(restored,1).revealed,true);
}
{
 const s=career(),r=E.terms(s,2,'360',.82,104),p=E.persona(s,2);
 const lowball=E.present(s,2,{type:'360',share:.82,weeks:104,advance:0},{rng:()=>.5});
 assert.equal(lowball.status,'counter');
 assert.ok(lowball.counter.advance>0);
 assert.ok(lowball.counter.weeks<=104);
 assert.ok(lowball.counter.share<=p.maxShare+1e-9);
 assert.ok(lowball.negotiation.memory.lowballs>=1);
 assert.ok(s.world[2].relation<12,'insulting proposals affect persistent relationships');
 const firstMemory=lowball.negotiation.memory.lowballs;
 let last;for(let i=0;i<9;i++){last=E.present(s,2,{type:'360',share:.82,weeks:104,advance:0},{rng:()=>.5});if(last.status==='walked')break}
 assert.equal(last.status,'walked','repeated unreasonable proposals exhaust patience');
 assert.ok(last.negotiation.walkedUntil>s.week+8,'repeat lowballs extend the cooling-off period');
 assert.ok(last.negotiation.memory.lowballs>firstMemory);
 assert.throws(()=>E.open(s,2),/not ready to reopen/);
 const saved=structuredClone(s);
 saved.week=last.negotiation.walkedUntil;
 assert.equal(E.open(saved,2).status,'active','negotiations can resume after cooling off');
 assert.ok(E.ensure(saved,2).memory.lowballs>0,'cooldown does not erase the artist’s memory');
}
{
 const s=career();
 const owner=s.world.find(a=>E.persona(s,a.id).priority==='ownership');
 assert.ok(owner,'fixture should contain ownership-oriented artists');
 const bad={type:'360',share:.60,weeks:104,advance:500000};
 const review=E.artistAssessment(s,owner.id,bad);
 assert.ok(review.issues.includes('rights scope'));
 assert.equal(review.counter.type,'record','ownership-focused artist counters with narrower rights');
 assert.ok(review.counter.share<bad.share);
 assert.ok(review.counter.weeks<bad.weeks);
 const first=E.present(s,owner.id,bad,{rng:()=>.5});
 assert.equal(first.status,'counter','money alone cannot override hard ownership objections');
 assert.equal(first.counter.type,'record');
 assert.equal(E.ensure(s,owner.id).lastCounter.type,'record');
}
{
 const s=career(),id=5,n=E.ensure(s,id),offer={type:'record',share:.1,weeks:26,advance:Math.ceil(E.terms(s,id,'record',.1,26).minimum*5)};
 const p=E.present(s,id,offer,{rng:()=>.5});
 assert.equal(p.status,'accepted','fair terms can be accepted despite varied artist motives');
 assert.equal(n.memory.lowballs,0);
 assert.equal(n.memory.trust,2);
 assert.equal(n.acceptedOffer.advance,offer.advance);
 const money=s.cash,energy=s.energy,sign=E.sign(s,id,p.terms);
 assert.equal(s.cash,money-offer.advance,'signed artist advance charged exactly once');
 assert.equal(s.energy,energy-10);
 assert.equal(s.labelBusiness.company.contracts.length,1);
 assert.throws(()=>E.sign(s,id,p.terms),/already signed/,'never duplicate signed terms');
 assert.ok(sign.contract);
}
{
 const h=harness('/sandbox',147001);await h.run('boot()');
 h.c.document.documentElement.classList={add(){},remove(){}};
 h.run("s.started=true;s.cash=500000;s.energy=200;foundLabel({preventDefault(){},target:{name:'Fictional Summit Records'}});");
 const id=23;
 assert.equal(h.run('V102_openRosterNegotiation('+id+')'),true,'original negotiation entry opens');
 let html=h.bodyChildren.at(-1).innerHTML;
 assert.match(html,/Ask what matters/);
 assert.equal(h.run('V102_askPriorities('+id+')'),true);
 html=h.bodyChildren.at(-1).innerHTML;assert.match(html,/Known priority/);
 assert.match(html,/Trust affects future talks/);
 const request=h.run('rosterTerms(s.world[23],"record",.1,26).minimum');
 const proposal={type:'record',share:'10',weeks:'26',advance:String(request*6)};
 const accepted=h.run('V102_submitRosterOffer({preventDefault(){},target:'+JSON.stringify(proposal)+'},'+id+')');
 assert.equal(accepted,true);
 assert.equal(h.run('pendingRosterOffer.artist'),id);
 assert.equal(h.run("V100_rosterNegotiation("+id+").memory.meetings"),1);
 assert.equal(h.run("V100_rosterNegotiation("+id+").acceptedOffer.advance"),Number(proposal.advance));
 await h.run('saveNow()');await h.run('boot()');
 assert.equal(h.run("V100_rosterNegotiation("+id+").memory.meetings"),1,'live room histories persist through save/reload');
 assert.equal(h.run("V100_rosterNegotiation("+id+").revealed"),true);
}
{
 const h=harness('/sandbox',147002);await h.run('boot()');
 h.run("s.started=true;s.cash=500000;s.energy=200;foundLabel({preventDefault(){},target:{name:'Fictional North Records'}});V145_state();s.labelBusiness.company.staff.ar=true;");
 h.run('s.labelBusiness.company.staffFunded=true;V145_scout()');
 assert.ok(h.run('V145_read().prospects.length')>0);
 const scout=h.run('V145_read().scoutingReports[V145_read().prospects[0]]');
 assert.ok(scout.min<=scout.estimated&&scout.estimated<=scout.max);
 assert.ok(scout.confidence<100,'scouting never reveals exact internal potential');
 assert.equal(h.run('V145_scout()'),false,'cannot reroll reports for free in the same week');
 h.run('s.week+=4;V145_scout()');
 assert.equal(h.run('V145_read().scoutedWeek'),h.run('s.week'));
 await h.run('saveNow()');await h.run('boot()');
 assert.ok(h.run('V145_read().scoutingReports[V145_read().prospects[0]]'),'scouting knowledge survives saves');
}
const room=fs.readFileSync(new URL('../src/v102-negotiation-room.js',import.meta.url),'utf8');
const scoutUI=fs.readFileSync(new URL('../src/core-label-boss.js',import.meta.url),'utf8');
assert.match(room,/ENCORE_ROSTER_NEGOTIATION\.present\(/,'live negotiations use same engine as tests and worker');
assert.match(scoutUI,/A&R estimates/,'existing white rows display imperfect scouting estimates');
console.log('PASS persistent artist priorities, scouting uncertainty, relationship trust, meaningful counters, cooling-off, live signing and save parity.');
