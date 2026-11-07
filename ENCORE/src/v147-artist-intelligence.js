/* ENCORE artist intelligence. Loaded from the optional contract/label
 * gameplay asset, not the boot-critical core bundle. Uses the same shared
 * roster-negotiation engine in the browser, save replay and week worker. */
(function(global){
'use strict';
const E=global.ENCORE_ROSTER_NEGOTIATION;
if(!E)throw new Error('Roster negotiation engine must load before artist intelligence');
const clamp=(value,lo=0,hi=100)=>Math.max(lo,Math.min(hi,Number(value)||0));
const artist=(state,id)=>(state?.world||[]).find(a=>Number(a?.id)===Number(id))||null;
const terms=E.terms,ensure=E.ensure,open=E.open,pressure=E.pressure;
const biddingWar=E.biddingWar,buyout=E.buyout,normalizeOffer=E.normalizeOffer;

/* Persistent artist negotiating instincts. Values are derived from immutable
 * fictional roster identity, not current wealth or popularity, so their motives
 * don't change unexpectedly as the industry advances. */
function persona(s,id){
 const a=artist(s,id);if(!a)return null;
 const key=String(a.id)+'|'+String(a.name||'')+'|'+String(a.genre||'');
 let seed=2166136261;
 for(let i=0;i<key.length;i++){seed=Math.imul(seed^key.charCodeAt(i),16777619)>>>0}
 const priorities=['advance','ownership','creative control','career reach'];
 const temperaments=['pragmatic','cautious','ambitious','independent'];
 const priority=priorities[seed%priorities.length],temperament=temperaments[(seed>>>5)%temperaments.length];
 const maxShare=priority==='ownership'?.33:priority==='advance'?.60:priority==='creative control'?.44:.51;
 const maxWeeks=priority==='ownership'?52:priority==='creative control'?65:priority==='advance'?104:78;
 return {priority,temperament,maxShare,maxWeeks,dislikes360:priority==='ownership'||priority==='creative control',seed}
}
function scoutReport(s,id,scoutSkill=50,week=s.week){
 const a=artist(s,id),p=persona(s,id);if(!a||!p)return null;
 const quality=clamp(scoutSkill,0,100);
 const confidence=Math.round(clamp(34+quality*.59,34,93));
 const noise=(100-confidence)*.40;
 const phase=((p.seed+Math.floor((Number(week)||0)/4)*67)>>>0)%101/50-1;
 const estimate=Math.round(clamp((Number(a.skill)||40)+phase*noise,0,100));
 const spread=Math.max(3,Math.round((100-confidence)*.42));
 return {artist:Number(id),week:Number(week)||0,confidence,estimated:estimate,
  min:Math.round(clamp(estimate-spread,0,100)),max:Math.round(clamp(estimate+spread,0,100)),
  source:'funded A&R report',uncertainty:confidence>=80?'high':confidence>=60?'moderate':'low'}
}
function artistAssessment(s,id,t,required=terms(s,id,t.type,t.share,t.weeks)){
 const p=persona(s,id);if(!p)return null;
 const premium=p.priority==='advance'?.17:p.priority==='ownership'?.07:p.priority==='creative control'?.05:0;
 const scopePenalty=p.dislikes360&&t.type==='360'?.16:0;
 const minimum=Math.max(required.minimum,Math.ceil(required.minimum*(1+premium+scopePenalty)));
 const shareCeiling=p.maxShare,termCeiling=p.maxWeeks;
 const issues=[];
 if(t.advance<minimum)issues.push('advance');
 if(t.share>shareCeiling+1e-9)issues.push('royalty split');
 if(t.weeks>termCeiling)issues.push('term');
 if(p.dislikes360&&t.type==='360')issues.push('rights scope');
 const revised={...t,advance:Math.max(minimum,Number(t.advance)||0),
  share:Math.min(shareCeiling,Number(t.share)||.1),
  weeks:Math.min(termCeiling,Number(t.weeks)||26),
  type:p.dislikes360&&t.type==='360'?'record':t.type};
 // Counter offers do not change accepted terms without an explicit player action.
 return {priority:p.priority,temperament:p.temperament,minimum,issues,counter:revised}
}
function meet(s,id){
 const a=artist(s,id),n=open(s,id),p=persona(s,id);
 if(!a||!n||!p)return {status:'unavailable'};
 if(n.lastMeetingWeek===Number(s.week))return {status:'already-met',priority:p.priority,temperament:p.temperament,negotiation:n};
 if((Number(s.energy)||0)<3)return {status:'energy'};
 s.energy-=3;n.lastMeetingWeek=Number(s.week);n.revealed=true;
 n.memory??={offers:0,lowballs:0,walkouts:0,meetings:0,trust:0,history:[]};
 n.memory.meetings++;n.memory.trust=clamp((Number(n.memory.trust)||0)+2,-50,50);
 n.memory.history.unshift({week:s.week,type:'meeting',detail:'Discussed priorities and contract expectations'});
 n.memory.history=n.memory.history.slice(0,20);
 n.interest=Math.round(clamp(n.interest+2,0,100));
 n.response=a.name+' prioritizes '+p.priority+'. '+(p.dislikes360?'Broad 360 ownership is a dealbreaker. ':'')+
  (p.priority==='advance'?'Reliable upfront funding matters most.':p.priority==='career reach'?'They value industry connections and a credible release plan.':p.priority==='ownership'?'They want to retain a meaningful share of their rights.':'They care about independence and the duration of control.');
 return {status:'met',priority:p.priority,temperament:p.temperament,negotiation:n}
}

function present(s,id,input,{rng=Math.random}={}){
 const a=artist(s,id),n=open(s,id),t=normalizeOffer(input),r=terms(s,id,t.type,t.share,t.weeks);
 const d=artistAssessment(s,id,t,r),b=biddingWar(s,id,rng),top=b?.offers?.[0];
 n.memory??={offers:0,lowballs:0,walkouts:0,meetings:0,trust:0,history:[]};
 n.memory.offers++;n.memory.lastOffer={...t};n.memory.lastOfferWeek=Number(s.week);
 n.acceptedOffer=null;
 if(top){
  const gap=(Number(top.advance)-t.advance)/Math.max(1,Number(top.advance));
  if(gap>.15){
   n.interest=Math.round(clamp(n.interest-Math.min(12,gap*18),0,100));
   n.response='A rival currently offers a stronger financial package.';
  }else if(t.advance>=Number(top.advance)){
   n.interest=Math.round(clamp(n.interest+6,0,100));n.leverage=Math.round(clamp(n.leverage+3,0,100))
  }
 }
 if((Number(a.relation)||0)<=-40||(Number(s.reputation)||0)<r.reputation){
  n.interest=Math.round(clamp(n.interest-8,0,100));
  n.response='The artist will not sign with your current relationship or company reputation.';
  return {status:'blocked',terms:t,required:r,assessment:d,negotiation:n,bidding:b}
 }
 const p=pressure(s,id,t,r,n);
 const insulting=t.advance<d.minimum*.45||t.share>Math.min(.9,d.counter.share+.22)||
  (d.issues.includes('rights scope')&&t.weeks>78);
 const trust=Number(n.memory.trust)||0;
 n.patience=Math.round(clamp(n.patience-p-(insulting?7:0)+Math.max(-3,Math.min(3,trust*.1)),0,100));
 n.rounds=(Number(n.rounds)||0)+1;
 const value=t.advance/Math.max(1,d.minimum);
 const appeal=(value-1)*24+(1-t.share)*8+(t.type==='distribution'?4:t.type==='360'?-5:0)+
  (d.priority==='career reach'?(Number(s.reputation)||0)*.045:0)+Math.max(-4,Math.min(4,trust*.2));
 n.interest=Math.round(clamp(n.interest+appeal-p*.35-(insulting?6:0),0,100));
 if(insulting){
  n.memory.lowballs++;n.memory.trust=clamp(trust-4,-50,50);
  a.relation=clamp((Number(a.relation)||0)-1,-100,100);
 }
 n.memory.history.unshift({week:s.week,type:insulting?'lowball':'proposal',
  detail:insulting?'Offer treated as exploitative':'Received formal offer',share:t.share,advance:t.advance,weeks:t.weeks});
 n.memory.history=n.memory.history.slice(0,20);
 if(n.patience<=4||n.interest<=7){
  n.status='walked';n.walkedUntil=Number(s.week)+8+
   (n.memory.lowballs>1?Math.min(8,n.memory.lowballs*2):0);
  n.memory.walkouts++;n.memory.trust=clamp((Number(n.memory.trust)||0)-6,-50,50);
  a.relation=clamp((Number(a.relation)||0)-2,-100,100);
  n.response='Talks ended. Repeated low offers damaged trust. The artist will not reopen until Week '+n.walkedUntil+'.';
  return {status:'walked',terms:t,required:r,assessment:d,negotiation:n,bidding:b}
 }
 if(d.issues.length||n.interest<34){
  const ask=Math.max(d.minimum,Math.round(d.minimum*(1+Math.max(0,34-n.interest)*.008)));
  const proposed={...d.counter,advance:Math.max(d.counter.advance,ask)};
  n.lastCounter=proposed;
  const reason=d.issues.length?d.issues.join(', '):'mutual confidence';
  const disclosure=n.revealed?'They value '+d.priority+'. ':'';
  n.response=disclosure+'Their counter addresses '+reason+': $'+proposed.advance.toLocaleString('en-US')+
   ' advance, '+Math.round(proposed.share*100)+'% company share, '+proposed.weeks+
   ' weeks, '+proposed.type+' rights. Patience '+n.patience+'/100.';
  return {status:'counter',counter:proposed,ask:proposed.advance,terms:t,required:r,assessment:d,negotiation:n,bidding:b}
 }
 n.lastCounter=null;n.acceptedOffer={...t};n.memory.trust=clamp((Number(n.memory.trust)||0)+2,-50,50);
 n.response='The artist accepted these business terms. Legal may prepare the signed agreement.';
 return {status:'accepted',terms:{...t,artist:Number(id),buyout:buyout(s,id)},required:r,assessment:d,negotiation:n,bidding:b}
}
Object.assign(E,{persona,scoutReport,artistAssessment,meet,present});
})(globalThis);
