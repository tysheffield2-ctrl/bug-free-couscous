/* ENCORE 0.9.21 — Label renewals and legal entity attribution.
   Renewals are negotiated as new terms, not silent extensions. Label-originated
   claims name the company that controlled the release; legacy saves remain valid. */
function V126_renewalContract(id){
 const co=s.labelBusiness?.company,c=co?.contracts?.find(x=>x.artist===id&&x.ends>=s.week-52),a=s.world?.[id];
 if(!co||!c||!a){toast('No eligible label contract found.');return}
 if(c.ends-s.week>8){toast('Renewal talks open during the final eight weeks of the deal.');return}
 const defaults={type:c.type,share:Number(c.share)||.1,weeks:Math.min(104,Math.max(4,Number(c.weeks)||26)),advance:Math.max(0,Math.round((Number(c.advance)||0)*(.35+(Number(a.fans)||0)/Math.max(1,(Number(a.fans)||0)+1000000))))};
 V126_renewalForm(id,defaults,'');
}
function V126_renewalForm(id,t,message){
 const a=s.world?.[id],c=s.labelBusiness?.company?.contracts?.find(x=>x.artist===id&&x.ends>=s.week-52);if(!a||!c)return;
 modal('<span class="eyebrow">LABEL HQ · CONTRACT RENEWAL</span><h2>Renegotiate '+esc(a.name)+'</h2><p>The current deal ends after Week '+c.ends+'. These terms replace the old economics for the renewal period; they do not rewrite the old contract or its accounting history.</p>'+ (message?'<p class="highlightbox">'+esc(message)+'</p>':'')+
 '<form class="form" onsubmit="V126_submitRenewal(event,'+id+')"><label>Deal structure<select name="type"><option value="record" '+(t.type==='record'?'selected':'')+'>Recording</option><option value="distribution" '+(t.type==='distribution'?'selected':'')+'>Distribution</option><option value="360" '+(t.type==='360'?'selected':'')+'>360 deal</option></select></label><label>Label share (%)<input name="share" type="number" min="1" max="90" step="1" value="'+Math.round(t.share*100)+'" required></label><label>Renewal term (weeks)<input name="weeks" type="number" min="4" max="104" step="1" value="'+t.weeks+'" required></label><label>New advance ($)<input name="advance" type="number" min="0" max="100000000" step="1000" value="'+Math.round(t.advance)+'" required></label><p class="fine">Higher advances and shorter terms can help secure a renewal. High label shares and broad 360 rights may push the artist toward rival offers. The advance is paid only if the renewal is accepted.</p><button class="primary">Submit renewal offer</button></form><button class="secondary" onclick="V126_letContractExpire('+id+')">Decline renewal · let deal expire</button>');
}
function V126_submitRenewal(e,id){
 e.preventDefault();const co=s.labelBusiness?.company,c=co?.contracts?.find(x=>x.artist===id&&x.ends>=s.week-52),a=s.world?.[id];if(!co||!c||!a)return;
 const f=new FormData(e.target),type=String(f.get('type')),share=Number(f.get('share'))/100,weeks=Number(f.get('weeks')),advance=Math.round(Number(f.get('advance')));
 if(!['record','distribution','360'].includes(type)||!Number.isFinite(share)||share<.01||share>.9||!Number.isInteger(weeks)||weeks<4||weeks>104||!Number.isSafeInteger(advance)||advance<0){toast('Check the renewal terms and try again.');return}
 const baseline=rosterTerms(a,type,share,weeks),relationship=Number(a.relation)||0,success=clamp(.72+relationship*.002+(s.reputation-50)*.0015+(advance>=baseline.minimum?.08:-.16)-(share>.45?.16:share<.15?.06:0)-(type==='360'?.08:0)+(weeks<=26?.05:weeks>=78?-.06:0),.08,.94);
 const roll=typeof V124_roll==='function'?V124_roll('renewal:'+id+':'+c.ends+':'+Math.round(share*100)+':'+weeks+':'+advance):Math.random();
 if(advance<baseline.minimum||roll>success){
  const counter={type,share:Math.max(.05,Math.min(.75,share-.05)),weeks:Math.max(4,Math.min(52,weeks-13)),advance:Math.max(baseline.minimum,Math.round(advance*1.25))};
  c.renewalTalks={week:s.week,lastOffer:{type,share,weeks,advance},counter,accepted:false};
  V126_renewalForm(id,counter,a.name+' countered your offer. They want a '+Math.round(counter.share*100)+'% label share, '+counter.weeks+' weeks and '+money(counter.advance)+' advance. You can revise and resubmit, or let the deal expire.');
  return
 }
 if(!spend(5,advance))return;
 c.previousTerms??=[];c.previousTerms.push({type:c.type,share:c.share,weeks:c.weeks,advance:c.advance,started:c.started,ends:c.ends,renewedWeek:s.week});
 c.type=type;c.share=share;c.weeks=weeks;c.advance=advance;c.started=s.week;c.ends=s.week+weeks-1;c.receipts=Number(c.receipts)||0;c.renewalTalks={week:s.week,lastOffer:{type,share,weeks,advance},accepted:true};
 a.relation=clamp(relationship+4,-100,100);log(a.name+' renewed with '+co.name+' through Week '+c.ends+' on revised terms.');queueSave?.();$('modal')?.close?.();render();toast('Renewal accepted. New contract terms are now active.');
}
function V126_letContractExpire(id){
 const c=s.labelBusiness?.company?.contracts?.find(x=>x.artist===id&&x.ends>=s.week-52);if(!c)return;
 c.renewalTalks={week:s.week,accepted:false,expiredByChoice:true};c.ends=s.week-1;
 log(s.world?.[id]?.name+' left '+s.labelBusiness.company.name+' after renewal talks failed.');queueSave?.();$('modal')?.close?.();render();toast('Renewal declined. The artist is no longer under contract.');
}
const V126_companyPageBase=companyPage;
companyPage=function(){
 let h=V126_companyPageBase();
 return h.replace(/onclick="renewRoster\((\d+)\)"/g,'onclick="V126_renewalContract($1)"')
 .replace('Deals cover new recordings released during their term; earlier catalog is excluded. Weekly accounting runs automatically.','Deals cover new recordings released during their term; earlier catalog is excluded. Renewals are negotiated and signed on new terms; earlier accounting remains attached to the old term.');
};
function V126_legalDefendant(){
 const label=s.labelBusiness?.company;
 if(label)return {name:label.name,type:'record-label',id:'label:'+String(label.started||'legacy')};
 let entity=null;try{entity=typeof V113_entity==='function'?V113_entity():null}catch{}
 return {name:entity?.name||s.name||'Player',type:entity?.id||'individual',id:entity?.id||'player'};
}
const V126_generateMatterBase=V124_generateMatter;
V124_generateMatter=function(type=null,forced=false){
 const c=V126_generateMatterBase(type,forced);if(!c)return c;
 const defendant=V126_legalDefendant();
 c.defendantEntity??=defendant;
 c.plaintiffEntity??={name:c.plaintiff||'Counterparty',type:'counterparty'};
 c.title=(c.plaintiff||'Counterparty')+' v. '+defendant.name;
 c.history??=[];c.history.unshift({week:s.week,text:'Defendant recorded as '+defendant.name+' ('+defendant.type+').'});
 return c
};
const V126_fileCaseBase=V118_fileCase;
V118_fileCase=function(data={}){
 const defendant=V126_legalDefendant();
 const d={...data,defendantEntity:data.defendantEntity||defendant};
 if(!d.title||/ v\. (undefined|Player)$/.test(d.title))d.title=(d.plaintiff||'Counterparty')+' v. '+defendant.name;
 const c=V126_fileCaseBase(d);if(c){c.defendantEntity??=defendant;c.plaintiffEntity??={name:c.plaintiff||'Counterparty',type:'counterparty'};c.title=(c.plaintiff||'Counterparty')+' v. '+c.defendantEntity.name}
 return c
};
