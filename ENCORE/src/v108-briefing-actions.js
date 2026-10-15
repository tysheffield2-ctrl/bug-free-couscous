/* ENCORE v1.08 — actionable career briefings.
   Briefings that describe a decision or report should never dead-end in the archive.
   The memo keeps the generic Continue/Archive controls, but now adds a contextual
   action that opens the exact offer review or the system that owns the report. */

function V108_openTourBriefing(){
  if($('modal')?.open)$('modal').close();
  careerTab='Touring';
  go('Career');
  window.setTimeout?.(()=>{
    const target=document.querySelector?.('.tour-active,.touring-active,.tour-route,.tour-ledger,.tour-history');
    target?.scrollIntoView?.({behavior:'smooth',block:'start'});
  },0);
}

function V108_opportunityForBriefing(b){
  if(!b?.id?.startsWith('offer:'))return null;
  const week=Number(String(b.id).split(':')[1]);
  const list=s.expansion?.opportunities||[];
  return list.find(o=>o.id===`offer-${week}`)||list.find(o=>Number(o.week)===week)||null;
}

function V108_reviewOpportunityBriefing(id){
  const b=s.achievements?.briefings?.find(x=>x.id===id);
  const o=V108_opportunityForBriefing(b);
  if($('modal')?.open)$('modal').close();
  if(o&&typeof V080_markReviewed==='function')V080_markReviewed(o);
  if(o&&!o.done&&o.expires>=s.week&&typeof acceptOpportunity==='function'){
    acceptOpportunity(o.id);
    return;
  }
  careerTab='Opportunities';
  go('Career');
  if(o?.done)toast?.('That opportunity has already been resolved.');
  else if(o&&o.expires<s.week)toast?.('That opportunity has expired.');
}

const V108_offerBriefingButtonBase=offerBriefingButton;
offerBriefingButton=function(b){
  const id=String(b?.id||'');
  if(id.startsWith('tour-week:')){
    return `<button class="memo-primary" onclick="V108_openTourBriefing()">Review tour report</button>`;
  }
  if(id.startsWith('tour-complete:')){
    return `<button class="memo-primary" onclick="V108_openTourBriefing()">Open Touring</button>`;
  }
  if(id.startsWith('offer:')){
    const label=/interview/i.test(String(b?.title||''))?'Review interview offer':'Review opportunity';
    return `<button class="memo-primary" onclick="V108_reviewOpportunityBriefing('${esc(id)}')">${label}</button>`;
  }
  return V108_offerBriefingButtonBase(b);
};
