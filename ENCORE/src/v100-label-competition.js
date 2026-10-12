/* ENCORE 1.0 Label Competition: rivalries, bidding wars, poaching and inbound services. */

function V100_labelCompetition(){
 migrateIndustryLife();migrateLabelBusiness();
 if(!s.labelCompetition)s.labelCompetition={relationships:{},inbound:[],serviceContracts:[],news:[],lastInboundWeek:-99,bids:{}};
 for(let i=0;i<labelDeals.length;i++)if(s.labelCompetition.relationships[i]===undefined)s.labelCompetition.relationships[i]=0;
 return s.labelCompetition;
}
function V100_labelRelationState(v){return v>=45?'Alliance':v>=20?'Friendly':v>-20?'Neutral':v>-45?'Competitive':v>-70?'Rival':'Hostile'}
function V100_labelRelationReason(i){
 const c=V100_labelCompetition(),v=c.relationships[i]||0,events=c.news.filter(x=>x.label===i).slice(0,3);
 if(events.length)return events.map(x=>x.text).join(' ');
 return v<0?'Competition has created tension between your companies.':v>0?'Your companies have built goodwill through recent business.':'No major history yet.';
}
function V100_changeLabelRelation(i,delta,text){
 const c=V100_labelCompetition();c.relationships[i]=clamp((c.relationships[i]||0)+delta,-100,100);
 if(text)c.news.unshift({week:s.week,label:i,text});c.news=c.news.slice(0,40);
}
function V100_playerCompanyName(){return s.labelBusiness?.company?.name||s.name+' Music'}
function V100_biddingWar(id){
 const a=s.world[id],c=V100_labelCompetition();if(!a)return null;
 let b=c.bids[id];
 if(!b||b.expires<s.week){
  const current=s.labelLeague?.contracts?.[id]?.label;
  const candidates=labelDeals.map((d,i)=>i).filter(i=>i!==current).sort(()=>Math.random()-.5).slice(0,Math.max(1,Math.min(3,1+Math.floor((a.fans||0)/5000000))));
  const offers=candidates.map(i=>{
   const rel=c.relationships[i]||0,base=Math.max(2500,Math.round((a.fans||0)*.08+(a.skill||50)*180));
   return {label:i,advance:Math.round(base*rand(.85,1.45)*(1-rel*.002)),share:Math.round(clamp(.12+rand(-.025,.05),.06,.35)*1000)/1000};
  }).sort((x,y)=>y.advance-x.advance);
  b={artist:id,created:s.week,expires:s.week+8,offers,status:'active'};c.bids[id]=b;
 }
 return b;
}
function V100_biddingWarPanel(id){
 const b=V100_biddingWar(id);if(!b||!b.offers.length)return '';
 return '<section class="card"><span class="eyebrow">BIDDING WAR · ACTIVE</span><h3>Other companies are pursuing '+esc(s.world[id].name)+'.</h3><p>Rival bids can raise the artist’s expectations. You can still win with better economics, stronger relationships or greater label reputation.</p>'+b.offers.map(o=>'<div class="project-row"><div><strong>'+esc(labelDeals[o.label].name)+'</strong><small>'+money(o.advance)+' advance · '+Math.round(o.share*100)+'% company share · '+V100_labelRelationState(V100_labelCompetition().relationships[o.label]||0)+'</small></div><span class="tag">RIVAL BID</span></div>').join('')+'</section>';
}
const V100_rosterOfferFormCompetitionOld=rosterOfferForm;
rosterOfferForm=function(id){
 V100_biddingWar(id);
 V100_rosterOfferFormCompetitionOld(id);
 const m=$('modal');if(m?.open&&m.innerHTML&&!m.innerHTML.includes('BIDDING WAR · ACTIVE'))m.innerHTML=m.innerHTML.replace('<h2>Negotiate with',''+V100_biddingWarPanel(id)+'<h2>Negotiate with');
};

const V100_reviewRosterOfferCompetitionOld=reviewRosterOffer;
reviewRosterOffer=function(e,id){
 const a=s.world[id],b=V100_biddingWar(id),n=V100_rosterNegotiation(id);
 try{
  const t=readRosterTerms(e.target),top=b?.offers?.[0];
  if(top&&n){
   const marketGap=(top.advance-t.advance)/Math.max(1,top.advance);
   if(marketGap>.15){n.interest=Math.round(clamp(n.interest-Math.min(12,marketGap*18),0,100));n.response='A rival currently has the stronger financial bid. Improve the economics or lean on relationship and label reputation.'}
   else if(t.advance>=top.advance){n.interest=Math.round(clamp(n.interest+6,0,100));n.leverage=Math.round(clamp(n.leverage+3,0,100))}
  }
 }catch{}
 return V100_reviewRosterOfferCompetitionOld(e,id);
};

const V100_confirmRosterCompetitionOld=confirmRosterOffer;
confirmRosterOffer=function(){
 const t=pendingRosterOffer,b=t?V100_biddingWar(t.artist):null,current=t?s.labelLeague?.contracts?.[t.artist]:null,before=ownerContracts().length;
 V100_confirmRosterCompetitionOld();
 if(t&&ownerContracts().length>before){
  const c=V100_labelCompetition();if(b)b.status='won';
  if(current){V100_changeLabelRelation(current.label,-18,V100_playerCompanyName()+' bought '+s.world[t.artist].name+' out of '+labelDeals[current.label].name+'.')}
  for(const o of b?.offers||[])V100_changeLabelRelation(o.label,-5,V100_playerCompanyName()+' won the bidding war for '+s.world[t.artist].name+'.');
  c.news.unshift({week:s.week,label:null,text:V100_playerCompanyName()+' signed '+s.world[t.artist].name+' after a competitive market.'});
 }
};

function V100_inboundType(){
 return pick([
  {type:'distribution',name:'Distribution services',detail:'Release administration and distribution support',base:18000},
  {type:'publishing',name:'Publishing administration',detail:'Publishing collection and administration',base:24000},
  {type:'marketing',name:'Marketing campaign',detail:'A time-limited release marketing campaign',base:15000},
  {type:'catalog',name:'Catalog administration',detail:'Catalog administration and licensing support',base:30000}
 ]);
}
function V100_generateInbound(){
 const co=s.labelBusiness?.company,c=V100_labelCompetition();if(!co||s.week-c.lastInboundWeek<4)return;
 c.lastInboundWeek=s.week;
 const chance=clamp(.18+s.reputation*.004+ownerContracts().length*.05+(co.staff?.ar?.04:0)+(co.staff?.marketing?.04:0),.15,.72);
 if(Math.random()>chance)return;
 const pool=s.world.filter(a=>!ownerContracts().some(x=>x.artist===a.id));
 if(!pool.length)return;
 const a=pick(pool),svc=V100_inboundType(),scale=clamp(.6+(a.fans||0)/5000000,.6,4),fee=Math.round(svc.base*scale*rand(.8,1.25)),share=svc.type==='distribution'?rand(.08,.18):svc.type==='publishing'?rand(.1,.22):0;
 const o={id:'service-'+s.week+'-'+a.id,type:svc.type,name:svc.name,detail:svc.detail,artist:a.id,fee,weeks:pick([8,13,26]),share:Math.round(share*1000)/1000,expires:s.week+6,status:'open'};
 c.inbound.unshift(o);c.inbound=c.inbound.slice(0,24);
 addBriefing('label-service:'+o.id,'Opportunity',a.name+' wants '+svc.name,'Your company can review an inbound '+svc.name.toLowerCase()+' request worth '+money(fee)+'.');
}
function V100_acceptInbound(id){
 const c=V100_labelCompetition(),o=c.inbound.find(x=>x.id===id&&x.status==='open'&&x.expires>=s.week);if(!o||!s.labelBusiness?.company)return;
 o.status='accepted';o.started=s.week;o.ends=s.week+o.weeks-1;c.serviceContracts.unshift({...o});changeCash(o.fee);s.finance.week.labelBusiness=cents((s.finance.week.labelBusiness||0)+o.fee);
 const a=s.world[o.artist];if(a)a.relation=clamp((a.relation||0)+6,-100,100);
 log(V100_playerCompanyName()+' accepted '+o.name.toLowerCase()+' work for '+(a?.name||'an artist')+'.');render();toast('Service agreement accepted · '+money(o.fee));
}
function V100_declineInbound(id){
 const c=V100_labelCompetition(),o=c.inbound.find(x=>x.id===id&&x.status==='open');if(!o)return;o.status='declined';
 const a=s.world[o.artist];if(a)a.relation=clamp((a.relation||0)-2,-100,100);render();
}
function V100_inboundPanel(){
 const c=V100_labelCompetition();V100_generateInbound();
 const open=c.inbound.filter(x=>x.status==='open'&&x.expires>=s.week);
 return '<section class="card"><span class="eyebrow">INBOUND BUSINESS</span><h2>Artists can hire your company.</h2><p>Your label can now earn money from services without signing every artist to a recording contract.</p>'+(open.map(o=>{const a=s.world[o.artist];return '<div class="project-row"><div><strong>'+esc(a?.name||'Artist')+' · '+esc(o.name)+'</strong><small>'+esc(o.detail)+' · '+money(o.fee)+' fee · '+o.weeks+' weeks'+(o.share?' · '+Math.round(o.share*100)+'% service participation':'')+' · expires Week '+o.expires+'</small></div><div class="controls"><button class="secondary" onclick="V100_declineInbound(\''+o.id+'\')">Decline</button><button class="primary" onclick="V100_acceptInbound(\''+o.id+'\')">Accept</button></div></div>'}).join('')||'<p>No inbound service requests right now. Stronger reputation, staff and roster success increase deal flow.</p>')+'</section>';
}

function V100_rivalTalentPanel(){
 const targets=Object.entries(s.labelLeague?.contracts||{}).filter(([id])=>!ownerContracts().some(c=>c.artist===Number(id))).map(([id,c])=>({a:s.world[Number(id)],c,id:Number(id)})).filter(x=>x.a).sort((x,y)=>(y.a.fans||0)-(x.a.fans||0)).slice(0,8);
 return '<section class="card"><span class="eyebrow">COMPETITIVE TALENT MARKET</span><h2>Poaching is possible—but companies remember it.</h2><p>Buying out a rival contract can improve your roster while worsening your relationship with that company. Rival labels may also bid against you.</p>'+targets.map(x=>'<div class="project-row"><div><strong>'+esc(x.a.name)+'</strong><small>'+esc(labelDeals[x.c.label].name)+' · '+compact(x.a.fans)+' fans · buyout '+money(npcBuyout(x.id))+' · '+V100_labelRelationState(V100_labelCompetition().relationships[x.c.label]||0)+'</small></div><button class="secondary" '+(ownerContracts().length>=labelCapacity()?'disabled':'')+' onclick="rosterOfferForm('+x.id+')">Approach artist</button></div>').join('')+'</section>';
}

const V100_labelPageCompetitionOld=labelPage;
labelPage=function(){V100_generateInbound();return V100_labelPageCompetitionOld()+V100_inboundPanel()+V100_rivalTalentPanel()};

function V100_labelRivalryPanel(){
 const c=V100_labelCompetition();
 return '<section class="card"><span class="eyebrow">LABEL RELATIONSHIPS</span><h2>Your company has a reputation with other companies.</h2><p>Poaching, bidding wars and future business can change these relationships.</p>'+labelDeals.map((d,i)=>'<div class="project-row"><div><strong>'+esc(d.name)+'</strong><small>'+V100_labelRelationState(c.relationships[i]||0)+' · '+esc(V100_labelRelationReason(i))+'</small></div><span class="tag">'+(c.relationships[i]||0)+'</span></div>').join('')+'</section>';
}
const V100_labelLeagueCompetitionOld=labelLeaguePage;
labelLeaguePage=function(){return V100_labelLeagueCompetitionOld()+V100_labelRivalryPanel()+V100_rivalTalentPanel()};

const V100_settleIndustryCompetitionOld=settleIndustryLife;
settleIndustryLife=function(){
 const result=V100_settleIndustryCompetitionOld();V100_generateInbound();
 const c=V100_labelCompetition();
 for(const o of c.inbound)if(o.status==='open'&&o.expires<s.week)o.status='expired';
 for(const k of Object.keys(c.bids))if(c.bids[k].expires<s.week&&c.bids[k].status==='active')c.bids[k].status='expired';
 return result;
};
