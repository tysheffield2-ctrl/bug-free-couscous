/* ENCORE shared roster-negotiation engine.
   Renderer-independent source of truth for artist acquisition economics and bargaining. */
(function(global){
'use strict';
const clamp=(v,l=0,h=100)=>Math.max(l,Math.min(h,Number(v)||0));
const cents=v=>Math.round((Number(v)||0)*100)/100;
function fail(message,code='invalid'){const e=new Error(message);e.code=code;throw e}
function company(s){return s?.labelBusiness?.company||null}
function activeContracts(s){return (company(s)?.contracts||[]).filter(c=>Number(c.ends)>=Number(s.week))}
function capacity(s){return company(s)?.staff?.manager?6:3}
function artist(s,id){return (s?.world||[]).find(a=>Number(a?.id)===Number(id))||null}
function terms(s,id,type='record',share=.1,weeks=26){const a=artist(s,id),co=company(s);if(!a||!co)fail('Artist or company is unavailable.');share=Number(share);weeks=Number(weeks);if(!['record','distribution','360'].includes(type)||!Number.isFinite(share)||share<.01||share>.9||!Number.isInteger(weeks)||weeks<4||weeks>104)fail('Enter a valid contract structure.');const base=Math.max(1000,Math.round((Number(a.fans)||0)*.12+(Number(a.skill)||0)*100));return {minimum:Math.round(base*(1+(share-.1)*3+(type==='360'?.8:type==='distribution'?-.25:0))*Math.pow(weeks/26,.4)*(1-Math.max(-50,Number(a.relation)||0)*.003)*(co.staff?.ar?.85:1)),reputation:Math.max(0,Math.round(Number(a.reputation)||0)-25)}}
function book(s){s.labelBusiness??={offers:[],auditions:{},lastScouted:0,company:null};s.labelBusiness.rosterNegotiations??={};return s.labelBusiness.rosterNegotiations}
function ensure(s,id){const a=artist(s,id),b=book(s);if(!a)return null;if(!b[id]||b[id].status==='expired'){const rival=!!s.labelLeague?.contracts?.[id],relation=Number(a.relation||0);b[id]={interest:Math.round(clamp(48+relation*.28+(Number(s.reputation)||0)*.22-(rival?8:0),12,94)),patience:Math.round(clamp(66+relation*.12+(company(s)?.staff?.ar?6:0),24,92)),leverage:Math.round(clamp(30+(Number(s.reputation)||0)*.35+(company(s)?.staff?.ar?8:0),8,95)),rounds:0,status:'active',response:rival?'This artist is under contract elsewhere. A buyout and strong terms may be required.':'The artist is willing to hear an offer.'}}return b[id]}
function open(s,id){const a=artist(s,id),n=ensure(s,id);if(!a||!company(s))fail('This negotiation is unavailable.');if(activeContracts(s).some(c=>Number(c.artist)===Number(id)))fail('This artist is already on your roster.','signed');if(activeContracts(s).length>=capacity(s))fail('Your roster is at capacity.','capacity');if(n.status==='walked'&&Number(s.week)<Number(n.walkedUntil||0))fail(`${a.name} is not ready to reopen talks until Week ${n.walkedUntil}.`,'walked');if(n.status==='walked'){n.status='active';n.patience=Math.max(35,n.patience);n.interest=Math.max(30,n.interest)}return n}
function pressure(s,id,t,r,n=ensure(s,id)){const a=artist(s,id);if(!a||!n)fail('Negotiation is unavailable.');const shortfall=Math.max(0,r.minimum-Number(t.advance))/Math.max(1,r.minimum),rights=t.type==='360'?10:t.type==='distribution'?-2:3,share=Math.max(0,Number(t.share)-.15)*55,term=Math.max(0,Number(t.weeks)-26)/104*18;return clamp(4+shortfall*30+rights+share+term-(Number(n.leverage)||0)*.06,2,32)}
function competition(s){s.labelCompetition??={relationships:{},inbound:[],serviceContracts:[],news:[],lastInboundWeek:-99,bids:{}};s.labelCompetition.relationships??={};s.labelCompetition.news??=[];s.labelCompetition.bids??={};const count=Math.max(1,s.labelLeague?.labels?.length||8);for(let i=0;i<count;i++)if(s.labelCompetition.relationships[i]===undefined)s.labelCompetition.relationships[i]=0;return s.labelCompetition}
function biddingWar(s,id,rng=Math.random){const a=artist(s,id);if(!a)return null;const c=competition(s);let b=c.bids[id];if(!b||Number(b.expires)<Number(s.week)){const current=s.labelLeague?.contracts?.[id]?.label,count=Math.max(1,s.labelLeague?.labels?.length||8),candidates=Array.from({length:count},(_,i)=>i).filter(i=>i!==current).sort(()=>rng()-.5).slice(0,Math.max(1,Math.min(3,1+Math.floor((Number(a.fans)||0)/5000000))));const offers=candidates.map(i=>{const rel=Number(c.relationships[i])||0,base=Math.max(2500,Math.round((Number(a.fans)||0)*.08+(Number(a.skill)||50)*180));return {label:i,advance:Math.round(base*(.85+rng()*.6)*(1-rel*.002)),share:Math.round(clamp(.12+(-.025+rng()*.075),.06,.35)*1000)/1000}}).sort((x,y)=>y.advance-x.advance);b={artist:Number(id),created:Number(s.week),expires:Number(s.week)+8,offers,status:'active'};c.bids[id]=b}return b}
function buyout(s,id){const c=s.labelLeague?.contracts?.[id];return c&&Number(c.ends)>=Number(s.week)?Math.round((Number(c.advance)||0)*Math.max(.15,(Number(c.ends)-Number(s.week)+1)/52)):0}
function normalizeOffer(t){const type=String(t?.type||''),share=Number(t?.share),weeks=Number(t?.weeks),advance=Number(t?.advance);if(!['record','distribution','360'].includes(type)||!Number.isFinite(share)||share<.01||share>.9||!Number.isInteger(weeks)||weeks<4||weeks>104||!Number.isSafeInteger(advance)||advance<0)fail('Enter an advance of $0 or more, a company share of 1–90%, and a term of 4–104 whole weeks.');return {type,share,weeks,advance}}
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
function ensureWallet(s){const cash=Number(s.cash)||0,raw=String(s.walletCents??'');let valid=/^-?\d+$/.test(raw);if(valid){try{valid=Math.abs(Number(BigInt(raw))/100-cash)<.005}catch{valid=false}}if(!valid)s.walletCents=BigInt(Math.round(cash*100)).toString()}
function changeCash(s,delta){ensureWallet(s);s.walletCents=(BigInt(s.walletCents)+BigInt(Math.round((Number(delta)||0)*100))).toString();s.cash=Number(BigInt(s.walletCents))/100;return s.cash}
function changeRelation(c,label,delta,text,week){if(label===undefined||label===null)return;c.relationships[label]=clamp((Number(c.relationships[label])||0)+delta,-100,100);if(text)c.news.unshift({week,label,text});c.news=c.news.slice(0,40)}
function sign(s,id,input){const a=artist(s,id),co=company(s),n=ensure(s,id),t=normalizeOffer(input);if(!a||!co||!n)fail('This agreement is unavailable.');if(activeContracts(s).some(c=>Number(c.artist)===Number(id)))fail('This artist is already signed.','signed');if(activeContracts(s).length>=capacity(s))fail('Your roster is at capacity.','capacity');const r=terms(s,id,t.type,t.share,t.weeks);if((Number(a.relation)||0)<=-40||(Number(s.reputation)||0)<r.reputation||t.advance<r.minimum||n.interest<34)fail('The current terms are not accepted. Return to negotiations.','terms');const fee=buyout(s,id),cost=t.advance+fee;if((Number(s.energy)||0)<10)fail('Rest to recover energy first.','energy');if((Number(s.cash)||0)<cost)fail('You need enough cash for the advance and any current-label buyout.','cash');const current=s.labelLeague?.contracts?.[id]?{...s.labelLeague.contracts[id]}:null,b=competition(s).bids?.[id];s.started=true;s.energy=Number(s.energy)-10;changeCash(s,-cost);s.finance??={};s.finance.week??={};s.finance.week.expenses=cents((Number(s.finance.week.expenses)||0)+cost);if(current){const label=s.labelLeague?.labels?.[current.label];if(label)label.budget=(Number(label.budget)||0)+fee;delete s.labelLeague.contracts[id]}co.contracts??=[];co.contracts.push({...t,artist:Number(id),started:Number(s.week),ends:Number(s.week)+t.weeks-1,receipts:0,excludedIds:(a.catalog||[]).map(x=>x.uid)});a.relation=clamp((Number(a.relation)||0)+5,-100,100);n.status='signed';n.interest=100;n.response=`Signed to ${co.name}.`;const c=competition(s);if(b)b.status='won';const playerName=co.name||`${s.name||'Artist'} Music`;if(current)changeRelation(c,current.label,-18,`${playerName} bought ${a.name} out of rival company ${current.label}.`,Number(s.week));for(const o of b?.offers||[])changeRelation(c,o.label,-5,`${playerName} won the bidding war for ${a.name}.`,Number(s.week));c.news.unshift({week:Number(s.week),label:null,text:`${playerName} signed ${a.name} after a competitive market.`});c.news=c.news.slice(0,40);s.history=Array.isArray(s.history)?s.history:[];s.history.unshift({week:Number(s.week),text:`Signed ${a.name} to ${co.name}.`});s.history=s.history.slice(0,100);return {artist:a,contract:co.contracts.at(-1),buyout:fee,totalCost:cost,negotiation:n}}
global.ENCORE_ROSTER_NEGOTIATION={terms,ensure,open,pressure,biddingWar,buyout,present,sign,normalizeOffer,activeContracts,capacity,persona,scoutReport,artistAssessment,meet};
})(globalThis);
