/* ENCORE 0.9.15 — Cohesion Core 1.0.
   First implementation pass from the 1.0 cohesion audit: one durable event
   ledger, continuing agency for signed roster artists, persistent legal dockets,
   catalog-right consequences and retirement of the duplicate legacy Agent UI. */

/* Fix a 0.9.14 sign error: relational representatives should dislike being
   challenged less, not gain relationship from it. */
V117_actionDelta=function(c,kind){
 const style=V117_styleText(c),relational=/relationship|community|grassroots|artist developer|calm|advocate/.test(style),assertive=/deal closer|growth|scale|maximalist|viral|hit-focused|aggressive/.test(style),strict=/exacting|compliance|risk|cash controller|conservative/.test(style);
 if(kind==='checkin')return 7+(relational?2:0);
 if(kind==='trust')return 6+(assertive?3:relational?1:0);
 if(kind==='appreciate')return 9+(relational?2:0);
 if(kind==='challenge')return strict?-9:relational?-4:-6;
 if(kind==='repair')return 15+(relational?3:0);
 return 0
};

const V118_SCHEMA=1;
function V118_state(){
 if(!s.cohesion||typeof s.cohesion!=='object')s.cohesion={version:V118_SCHEMA,events:[],legal:{next:1,cases:[]},rosterRequests:[]};
 s.cohesion.version=V118_SCHEMA;
 if(!Array.isArray(s.cohesion.events))s.cohesion.events=[];
 if(!s.cohesion.legal||typeof s.cohesion.legal!=='object')s.cohesion.legal={next:1,cases:[]};
 if(!Array.isArray(s.cohesion.legal.cases))s.cohesion.legal.cases=[];
 if(!Number.isFinite(Number(s.cohesion.legal.next)))s.cohesion.legal.next=1;
 if(!Array.isArray(s.cohesion.rosterRequests))s.cohesion.rosterRequests=[];
 return s.cohesion
}
function V118_event(kind,title,detail,links={}){
 const st=V118_state(),e={id:`evt-${s.week}-${Date.now()}-${st.events.length}`,week:s.week,kind,title,detail,links};st.events.unshift(e);st.events=st.events.slice(0,500);return e
}
function V118_gameYear(week=s.week){return 2026+Math.floor((Math.max(1,Number(week)||1)-1)/52)}
function V118_caseNumber(){const l=V118_state().legal,n=Math.max(1,Math.round(l.next++));return `ENC-CIV-${V118_gameYear()}-${String(n).padStart(4,'0')}`}
function V118_legalCases(){return V118_state().legal.cases}
function V118_openCases(){return V118_legalCases().filter(x=>x.status==='open')}
function V118_fileCase(spec={}){
 const cases=V118_legalCases(),number=V118_caseNumber(),attorney=V100_repTeam?.().team?.attorney||null;
 const c={id:'case-'+number,number,week:s.week,title:spec.title||'Contract dispute',issue:spec.issue||'Contract enforcement',plaintiff:spec.plaintiff||'Counterparty',defendant:spec.defendant||s.labelBusiness?.company?.name||s.name,claim:cents(Math.max(0,Number(spec.claim)||0)),agreementId:spec.agreementId||null,clauses:[...(spec.clauses||[])],plaintiffStrength:clamp(Math.round(Number(spec.strength)||55),5,95),assignedAttorney:attorney?.name||null,attorneySkill:attorney?(typeof V117_effectiveSkill==='function'?V117_effectiveSkill(attorney):attorney.skill||70):0,status:'open',stage:'FILED',deadlineWeek:s.week+4,filedWeek:s.week,history:[{week:s.week,text:'Case filed.'}],outcome:null};
 cases.unshift(c);cases.splice(100);V118_event('lawsuit','Legal case filed: '+number,c.title,{caseId:c.id,agreementId:c.agreementId});addBriefing?.('legal:'+c.id,'Legal',c.title,number+' was filed. Review the docket before Week '+c.deadlineWeek+'.');return c
}
function V118_caseRoll(c){let h=0;for(const ch of String(c.number))h=(h*31+ch.charCodeAt(0))%10007;return (h%41)-20}
function V118_caseSettlement(c){return cents(c.claim*clamp(.44+c.plaintiffStrength*.003,0.45,.78))}
function V118_caseDefenseCost(c){return cents(clamp(c.claim*.04,1000,250000))}
function V118_closeCase(c,outcome,cash=0,repDelta=0){
 if(!c||c.status!=='open')return false;c.status='resolved';c.stage='RESOLVED';c.outcome=outcome;c.resolvedWeek=s.week;c.history.unshift({week:s.week,text:outcome+(cash?` · ${money(Math.abs(cash))}`:'')});if(cash)changeCash(cash);if(repDelta)s.reputation=clamp(s.reputation+repDelta);V118_event('legal-resolution',c.number+' resolved',outcome,{caseId:c.id,agreementId:c.agreementId});queueSave?.();return true
}
function V118_caseAction(id,action){
 const c=V118_legalCases().find(x=>x.id===id&&x.status==='open');if(!c)return false;
 if(action==='settle'){
  const amount=V118_caseSettlement(c);if(s.cash<amount){toast?.('You need '+money(amount)+' to fund the settlement.');return false}changeCash(-amount);if(s.finance?.week)s.finance.week.expenses=cents((s.finance.week.expenses||0)+amount);c.history.unshift({week:s.week,text:'Settlement paid: '+money(amount)});V118_closeCase(c,'Settled before judgment',0,-1);toast?.(c.number+' settled.');render();return true
 }
 if(action==='contest'){
  const cost=V118_caseDefenseCost(c);if(!spend(10,cost))return false;c.stage='DEFENSE FILED';c.defenseFiledWeek=s.week;c.reviewWeek=s.week+4;c.history.unshift({week:s.week,text:'Defense filed. Legal spend '+money(cost)+'.'});V118_event('legal-defense','Defense filed: '+c.number,'The case will be reviewed after Week '+c.reviewWeek,{caseId:c.id});$('modal')?.close?.();render();toast?.('Defense filed. The case remains active.');return true
 }
 return false
}
function V118_advanceLegal(completedWeek=s.week){
 for(const c of V118_openCases()){
  if(c.stage==='FILED'&&completedWeek>=c.deadlineWeek){const amount=c.claim;changeCash(-amount);if(s.finance?.week)s.finance.week.expenses=cents((s.finance.week.expenses||0)+amount);V118_closeCase(c,'Default judgment for plaintiff',0,-3);addBriefing?.('legal-default:'+c.id,'Legal',c.number+' · default judgment','You did not answer the filing before its deadline. '+money(amount)+' was charged.');continue}
  if(c.stage==='DEFENSE FILED'&&completedWeek>=c.reviewWeek){const defense=25+(c.attorneySkill||0)*.55+s.reputation*.2,score=defense-c.plaintiffStrength+V118_caseRoll(c);if(score>=0){V118_closeCase(c,'Defense prevailed',0,1);addBriefing?.('legal-win:'+c.id,'Legal',c.number+' · defense prevailed','The dispute resolved in your favor.')}else{const award=cents(c.claim*clamp(.62+(c.plaintiffStrength-defense)*.004,.55,1));changeCash(-award);if(s.finance?.week)s.finance.week.expenses=cents((s.finance.week.expenses||0)+award);V118_closeCase(c,'Plaintiff prevailed',0,-2);addBriefing?.('legal-loss:'+c.id,'Legal',c.number+' · adverse judgment',money(award)+' was awarded to the plaintiff.')}
  }
 }
}

function V118_metric(n){return clamp(Math.round(Number(n)||0),0,100)}
function V118_rosterState(c){
 if(!c)return null;const a=s.world?.[c.artist];
 if(!c.relationshipState||typeof c.relationshipState!=='object')c.relationshipState={
  trust:V118_metric(52+(a?.relation||0)*.22),
  satisfaction:V118_metric(76-(c.share||0)*42-(c.type==='360'?8:0)),
  momentum:V118_metric(35+tier(a?.fans||0)*8+(a?.reputation||0)*.18),
  ownershipTension:V118_metric(['record','360'].includes(c.type)?18+tier(a?.fans||0)*7+(c.share||0)*28:5),
  leverage:V118_metric(22+tier(a?.fans||0)*10+(a?.reputation||0)*.34),
  support:50,lastManagedWeek:0,lastRequestWeek:0,history:[]
 };
 for(const k of ['trust','satisfaction','momentum','ownershipTension','leverage','support'])c.relationshipState[k]=V118_metric(c.relationshipState[k]);
 if(!Array.isArray(c.relationshipState.history))c.relationshipState.history=[];return c.relationshipState
}
function V118_rosterHistory(c,text){const r=V118_rosterState(c);r.history.unshift({week:s.week,text});r.history=r.history.slice(0,20)}
function V118_rosterChange(c,delta={},reason='Relationship changed'){
 const r=V118_rosterState(c);for(const [k,v] of Object.entries(delta))if(k in r&&Number.isFinite(Number(v)))r[k]=V118_metric(r[k]+Number(v));V118_rosterHistory(c,reason);return r
}
function V118_agreementId(c){return c?.agreementId||null}
function V118_storeRosterAgreement(c){
 if(!c)return null;const a=s.world?.[c.artist],vault=V100_contractVault?.()||[];
 if(c.agreementId&&vault.some(x=>x.id===c.agreementId))return c.agreementId;
 const id=`roster-${s.week}-${c.artist}-${Date.now()}`;c.agreementId=id;
 const rights=typeof V090_contractRights==='function'?V090_contractRights(c.type):{};
 vault.unshift({id,kind:'roster',week:s.week,label:s.labelBusiness?.company?.name||'Owned label',counterparty:a?.name||'Roster artist',artistId:c.artist,type:c.type,weeks:c.weeks,started:c.started,ends:c.ends,share:c.share,advance:c.advance,rights,clauses:typeof V100_contractClauses==='function'?V100_contractClauses({...c,rights}):{},signedBy:s.labelBusiness?.company?.name||s.name,counterpartySignedBy:a?.name||'Roster artist',signedAt:new Date().toISOString()});
 c.catalogRightId=null;V118_event('roster-signing',(a?.name||'Artist')+' signed to '+(s.labelBusiness?.company?.name||'your label'),'Agreement '+id+' executed.',{agreementId:id,artistId:c.artist});return id
}
function V118_catalogRights(){const co=s.labelBusiness?.company;if(!co)return [];if(!Array.isArray(co.catalogRights))co.catalogRights=[];return co.catalogRights}
function V118_ensureCatalogRight(c){
 if(!c||!['record','360'].includes(c.type))return null;const rights=V118_catalogRights();let x=rights.find(r=>r.agreementId===V118_agreementId(c));if(x)return x;
 x={id:'catalog-right-'+(c.agreementId||`${c.artist}-${c.started}`),agreementId:V118_agreementId(c),artist:c.artist,share:Number(c.share)||0,started:c.started,contractEnd:c.ends,excludedIds:[...(c.excludedIds||[])],artistOwnedPct:0,receipts:0,lastSettledWeek:0};rights.push(x);c.catalogRightId=x.id;return x
}
function V118_catalogValue(c){
 const a=s.world?.[c.artist];if(!a)return 0;const excluded=new Set(c.excludedIds||[]),eligible=(a.catalog||[]).filter(x=>x.week>=c.started&&!excluded.has(x.uid));const weekly=eligible.reduce((n,x)=>n+Math.max(0,Number(x.streams)||0),0),life=eligible.reduce((n,x)=>n+Math.max(0,Number(x.total)||0),0),share=Math.max(.01,Number(c.share)||0);return cents(Math.max(c.advance||0,weekly*.5*52*share*3,life*.5*share*.35))
}
function V118_coveredWeeklyStreams(ref){const a=s.world?.[ref.artist];if(!a)return 0;const excluded=new Set(ref.excludedIds||[]);return (a.catalog||[]).filter(x=>x.week>=ref.started&&!excluded.has(x.uid)).reduce((n,x)=>n+Math.max(0,Number(x.streams)||0),0)}
function V118_applyActiveCatalogReversion(c){
 const pct=clamp(Number(c.catalogArtistOwnedPct)||0,0,1);if(!pct)return 0;const co=s.labelBusiness?.company;if(!co||!co.last||c.ends<s.week)return 0;const refund=cents(V118_coveredWeeklyStreams(c)*.5*(Number(c.share)||0)*pct);if(!refund)return 0;changeCash(-refund);co.receipts=cents(Math.max(0,(co.receipts||0)-refund));c.receipts=cents(Math.max(0,(c.receipts||0)-refund));co.last.recording=cents(Math.max(0,(co.last.recording||0)-refund));co.last.income=cents(Math.max(0,(co.last.income||0)-refund));if(s.finance?.week)s.finance.week.labelBusiness=cents(Math.max(0,(s.finance.week.labelBusiness||0)-refund));return refund
}
function V118_settleCatalogTails(){
 const co=s.labelBusiness?.company;if(!co)return 0;let total=0;for(const r of V118_catalogRights()){if(r.lastSettledWeek===s.week||r.contractEnd>=s.week||r.artistOwnedPct>=1)continue;const income=cents(V118_coveredWeeklyStreams(r)*.5*(Number(r.share)||0)*(1-(Number(r.artistOwnedPct)||0)));r.lastSettledWeek=s.week;if(!income)continue;r.receipts=cents((r.receipts||0)+income);co.receipts=cents((co.receipts||0)+income);if(co.last){co.last.recording=cents((co.last.recording||0)+income);co.last.income=cents((co.last.income||0)+income)}changeCash(income);if(s.finance?.week)s.finance.week.labelBusiness=cents((s.finance.week.labelBusiness||0)+income);total+=income}return cents(total)
}
function V118_requestForAgreement(id){return V118_state().rosterRequests.find(x=>x.agreementId===id&&x.status==='open')||null}
function V118_createRosterRequest(c,type,reason){
 const st=V118_state(),a=s.world?.[c.artist],r=V118_rosterState(c),value=V118_catalogValue(c),req={id:`req-${s.week}-${c.artist}-${type}`,week:s.week,artist:c.artist,agreementId:c.agreementId,type,status:'open',reason,ask:type==='catalog-buyback'?cents(value*.8):type==='release'?cents(Math.max(0,value*.04)):0,value,leverage:r.leverage};st.rosterRequests.unshift(req);r.lastRequestWeek=s.week;V118_rosterHistory(c,'Artist opened a '+type.replaceAll('-',' ')+' request.');V118_event('roster-request',(a?.name||'Artist')+' requested '+type.replaceAll('-',' '),reason,{artistId:c.artist,agreementId:c.agreementId,requestId:req.id});addBriefing?.('roster-request:'+req.id,'Label',a?.name+' wants to revisit the deal',reason);return req
}
function V118_maybeRequest(c){
 const r=V118_rosterState(c);if(V118_requestForAgreement(c.agreementId)||s.week-r.lastRequestWeek<8)return null;
 if(r.satisfaction<=20&&r.trust<=35)return V118_createRosterRequest(c,'release','Contract satisfaction and trust have fallen far enough that the artist wants out early.');
 if(r.ownershipTension>=70&&r.leverage>=60)return V118_createRosterRequest(c,'catalog-buyback','The artist has enough leverage to pursue ownership of the masters created under this deal.');
 if(r.satisfaction<=42&&r.leverage>=50)return V118_createRosterRequest(c,'renegotiate','The artist believes their current economics no longer reflect their career leverage.');
 return null
}
function V118_settleRosterLifecycle(){
 const co=s.labelBusiness?.company;if(!co||V118_state().lastRosterWeek===s.week)return;V118_state().lastRosterWeek=s.week;
 for(const c of co.contracts||[]){if(c.ends<s.week)continue;V118_storeRosterAgreement(c);V118_ensureCatalogRight(c);const a=s.world?.[c.artist],r=V118_rosterState(c),eligible=(a?.catalog||[]).filter(x=>x.week>=c.started&&!(c.excludedIds||[]).includes(x.uid)),lastRelease=Math.max(c.started,...eligible.map(x=>Number(x.week)||0)),weeksQuiet=Math.max(0,s.week-lastRelease),recent=weeksQuiet<=4,priority=(c.prioritySupportUntil||0)>=s.week;
  r.momentum=V118_metric(28+Math.log10(Math.max(1,a?.weekly||0)+1)*8+tier(a?.fans||0)*5);
  r.leverage=V118_metric(18+tier(a?.fans||0)*11+(a?.reputation||0)*.32+r.momentum*.18);
  let sat=0,support=0,trust=0,tension=0;if(priority){support+=3;sat+=2}if(co.staff?.marketing&&co.staffFunded&&recent){support+=2;sat+=1}if(weeksQuiet>=12&&s.week%4===0){support-=3;sat-=3}if((c.share||0)>=.45&&s.week%4===0)sat-=1;if(c.type==='360'&&(c.share||0)>=.5&&s.week%4===0){sat-=1;tension+=2}if(['record','360'].includes(c.type)&&V118_catalogValue(c)>Math.max(1,c.advance||0)*2&&s.week%4===0)tension+=2;if((a?.relation||0)>=60&&s.week%4===0)trust+=1;if((a?.relation||0)<0&&s.week%4===0)trust-=1;
  if(sat||support||trust||tension)V118_rosterChange(c,{satisfaction:sat,support,trust,ownershipTension:tension},'Weekly deal relationship moved with support, performance and contract pressure.');V118_maybeRequest(c);V118_applyActiveCatalogReversion(c)
 }
 V118_settleCatalogTails()
}
function V118_rosterStatusLabel(r){return r.satisfaction<25?'At risk':r.satisfaction<45?'Uneasy':r.satisfaction<70?'Stable':'Strong'}
function V118_relationBar(label,value){return `<div class="v118-meter"><div><span>${esc(label)}</span><strong>${Math.round(value)}/100</strong></div><i><b style="width:${clamp(value,0,100)}%"></b></i></div>`}
function V118_supportCost(c){const a=s.world?.[c.artist];return [500,2500,10000,50000,250000,1000000,5000000][clamp(tier(a?.fans||0),0,6)]||10000}
function V118_rosterManage(artistId){
 const c=(s.labelBusiness?.company?.contracts||[]).find(x=>x.artist===artistId&&x.ends>=s.week);if(!c)return false;const a=s.world?.[artistId],r=V118_rosterState(c),request=V118_requestForAgreement(c.agreementId),used=r.lastManagedWeek===s.week,cost=V118_supportCost(c),value=V118_catalogValue(c);
 modal(`<section class="v118-roster-sheet">${personPhoto?.('artist-'+(a?.directoryKey??a?.id),a?.name||'Artist',true)||''}<span class="eyebrow">OWNED LABEL · ARTIST RELATIONSHIP</span><h2>${esc(a?.name||'Artist')}</h2><p>${esc(c.type==='360'?'360 agreement':c.type==='distribution'?'Distribution agreement':'Recording agreement')} · through Week ${c.ends} · label share ${Math.round((c.share||0)*100)}%</p><div class="v118-meter-grid">${V118_relationBar('Trust',r.trust)}${V118_relationBar('Contract satisfaction',r.satisfaction)}${V118_relationBar('Career momentum',r.momentum)}${V118_relationBar('Ownership tension',r.ownershipTension)}${V118_relationBar('Artist leverage',r.leverage)}${V118_relationBar('Label support',r.support)}</div>${profileRows([['Relationship status',V118_rosterStatusLabel(r)],['Estimated covered catalog value',money(value)],['Executed agreement',c.agreementId||'Pending archive'],['Covered-catalog ownership bought back',Math.round((c.catalogArtistOwnedPct||0)*100)+'%']])}${request?`<button class="primary" onclick="V118_reviewRosterRequest('${request.id}')">Review active artist request →</button>`:''}<div class="v118-roster-actions"><button class="secondary" ${used?'disabled':''} onclick="V118_rosterAction(${artistId},'checkin')">Executive check-in · 5 energy</button><button class="secondary" ${used?'disabled':''} onclick="V118_rosterAction(${artistId},'support')">Fund priority support · ${money(cost)}</button><button class="secondary" ${used?'disabled':''} onclick="V118_rosterAction(${artistId},'autonomy')">Grant creative autonomy · 5 energy</button><button class="secondary" ${used?'disabled':''} onclick="V118_rosterAction(${artistId},'pressure')">Challenge performance · 5 energy</button></div><p class="fine">One direct label-management action per artist per week. Contract satisfaction can move without manual interaction because release handling, economics, ownership and support continue to matter.</p><hr><h3>Recent history</h3>${r.history.slice(0,6).map(x=>`<p class="fine"><strong>Week ${x.week}</strong> · ${esc(x.text)}</p>`).join('')||'<p class="fine">No relationship history yet.</p>'}</section>`);return true
}
function V118_rosterAction(artistId,kind){
 const c=(s.labelBusiness?.company?.contracts||[]).find(x=>x.artist===artistId&&x.ends>=s.week);if(!c)return false;const r=V118_rosterState(c);if(r.lastManagedWeek===s.week){toast?.('You already made a direct management move with this artist this week.');return false}const cost=kind==='support'?V118_supportCost(c):0,energy=kind==='support'?5:5;if(!spend(energy,cost))return false;r.lastManagedWeek=s.week;
 if(kind==='checkin')V118_rosterChange(c,{trust:6,satisfaction:3},'You held an executive check-in and heard the artist out.');
 if(kind==='support'){c.prioritySupportUntil=s.week+4;V118_rosterChange(c,{support:16,satisfaction:8,trust:3},'You funded a four-week priority-support window.');}
 if(kind==='autonomy')V118_rosterChange(c,{trust:5,satisfaction:6,ownershipTension:-3},'You gave the artist more creative autonomy.');
 if(kind==='pressure')V118_rosterChange(c,{trust:-4,satisfaction:-5,support:-2},'You challenged the artist on performance and expectations.');
 V118_event('roster-management',(s.world?.[artistId]?.name||'Artist')+' · '+kind,'Direct label-management decision.',{artistId,agreementId:c.agreementId});queueSave?.();render();V118_rosterManage(artistId);return true
}
function V118_reviewRosterRequest(id){
 const req=V118_state().rosterRequests.find(x=>x.id===id&&x.status==='open'),c=req&&(s.labelBusiness?.company?.contracts||[]).find(x=>x.agreementId===req.agreementId);if(!req||!c)return false;const a=s.world?.[req.artist],r=V118_rosterState(c),name=req.type==='catalog-buyback'?'Catalog / master repurchase':req.type==='release'?'Release from deal':'Contract renegotiation';
 const accept=req.type==='catalog-buyback'?`Sell covered masters · ${money(req.ask)}`:req.type==='release'?'Grant early release':`Improve split by 5 points`;const counter=req.type==='catalog-buyback'?'Counter at '+money(req.ask*1.25):req.type==='release'?'Offer paid exit':'Improve split by 2.5 points';
 modal(`<section class="v118-request"><span class="eyebrow">ARTIST REQUEST · ${esc(name.toUpperCase())}</span><h2>${esc(a?.name||'Artist')}</h2><p>${esc(req.reason)}</p>${profileRows([['Artist leverage',r.leverage+'/100'],['Contract satisfaction',r.satisfaction+'/100'],['Trust',r.trust+'/100'],['Ownership tension',r.ownershipTension+'/100'],['Covered catalog value',money(req.value||0)],['Linked agreement',req.agreementId||'—']])}<div class="v118-request-actions"><button class="primary" onclick="V118_resolveRosterRequest('${id}','accept')">${esc(accept)}</button><button class="secondary" onclick="V118_resolveRosterRequest('${id}','counter')">${esc(counter)}</button><button class="secondary" onclick="V118_resolveRosterRequest('${id}','refuse')">Refuse request</button></div><p class="fine">This is not a flavor event. Your answer changes contract economics, ownership, artist trust and—if the dispute escalates—your legal file.</p></section>`);return true
}
function V118_applyBuyback(c,pct,price){
 const co=s.labelBusiness?.company,right=V118_ensureCatalogRight(c),owned=clamp((right?.artistOwnedPct||0)+pct,0,1),delta=owned-(right?.artistOwnedPct||0);if(delta<=0)return false;right.artistOwnedPct=owned;c.catalogArtistOwnedPct=owned;if(price>0){changeCash(price);co.receipts=cents((co.receipts||0)+price);if(s.finance?.week)s.finance.week.labelBusiness=cents((s.finance.week.labelBusiness||0)+price)}return true
}
function V118_escalateRosterDispute(c,req){
 const a=s.world?.[req.artist],r=V118_rosterState(c);if(req.type==='renegotiate'||r.leverage<70)return null;const issue=req.type==='catalog-buyback'?'Master ownership / catalog repurchase dispute':'Release-from-contract dispute',claim=cents(Math.max(req.value*.18,c.advance||0,50000));return V118_fileCase({title:`${a?.name||'Artist'} v. ${s.labelBusiness?.company?.name||'Label'}`,issue,plaintiff:a?.name||'Roster artist',defendant:s.labelBusiness?.company?.name||s.name,claim,agreementId:c.agreementId,clauses:req.type==='catalog-buyback'?['Masters & Catalog','Rights']:['Term','Early Termination'],strength:clamp(45+r.leverage*.35+(100-r.satisfaction)*.2,35,92)})
}
function V118_resolveRosterRequest(id,action){
 const req=V118_state().rosterRequests.find(x=>x.id===id&&x.status==='open'),c=req&&(s.labelBusiness?.company?.contracts||[]).find(x=>x.agreementId===req.agreementId);if(!req||!c)return false;const a=s.world?.[req.artist],r=V118_rosterState(c),right=V118_ensureCatalogRight(c);
 if(action==='accept'){
  if(req.type==='renegotiate'){const bonus=cents(Math.max(1000,(req.value||V118_catalogValue(c))*.02));if(!spend(5,bonus))return false;c.share=Math.max(.05,c.share-.05);if(right)right.share=c.share;V118_rosterChange(c,{satisfaction:18,trust:12,ownershipTension:-8},'You accepted a meaningful renegotiation and improved the artist economics.');}
  if(req.type==='release'){c.ends=s.week-1;if(right)right.contractEnd=c.ends;V118_rosterChange(c,{satisfaction:12,trust:8,ownershipTension:-4},'You granted an early release. Existing covered-catalog rights remain governed by the executed agreement.');}
  if(req.type==='catalog-buyback'){V118_applyBuyback(c,1,req.ask);V118_rosterChange(c,{satisfaction:16,trust:12,ownershipTension:-60},'You sold the covered catalog/master participation back to the artist.');}
  req.status='accepted';req.resolvedWeek=s.week;V118_event('roster-request-resolved',(a?.name||'Artist')+' request accepted',req.type,{artistId:req.artist,agreementId:req.agreementId});
 }
 if(action==='counter'){
  if(req.type==='renegotiate'){const bonus=cents(Math.max(500,(req.value||V118_catalogValue(c))*.01));if(!spend(5,bonus))return false;c.share=Math.max(.05,c.share-.025);if(right)right.share=c.share;V118_rosterChange(c,{satisfaction:10,trust:6,ownershipTension:-4},'You reached a smaller compromise on the artist economics.');req.status='countered-accepted';}
  if(req.type==='release'){const fee=cents(Math.max(1000,(req.value||0)*.03)),accept=r.leverage<80||r.trust>=55;if(accept){changeCash(fee);if(s.finance?.week)s.finance.week.labelBusiness=cents((s.finance.week.labelBusiness||0)+fee);c.ends=s.week-1;if(right)right.contractEnd=c.ends;V118_rosterChange(c,{satisfaction:6,trust:2},'The artist accepted a paid early-exit compromise.');req.status='countered-accepted'}else{V118_rosterChange(c,{satisfaction:-7,trust:-6},'The artist rejected your paid-exit counteroffer.');req.status='countered-declined';V118_escalateRosterDispute(c,req)}}
  if(req.type==='catalog-buyback'){const counter=cents(req.ask*1.25),accept=(r.trust+r.satisfaction)>=125;if(accept){V118_applyBuyback(c,1,counter);V118_rosterChange(c,{satisfaction:9,trust:5,ownershipTension:-55},'The artist accepted your higher catalog repurchase price.');req.status='countered-accepted'}else{V118_rosterChange(c,{satisfaction:-6,trust:-5,ownershipTension:8},'The artist rejected your catalog counterprice.');req.status='countered-declined';V118_escalateRosterDispute(c,req)}}req.resolvedWeek=s.week;V118_event('roster-request-counter',(a?.name||'Artist')+' request countered',req.type,{artistId:req.artist,agreementId:req.agreementId});
 }
 if(action==='refuse'){
  req.status='refused';req.resolvedWeek=s.week;V118_rosterChange(c,{trust:-10,satisfaction:-12,ownershipTension:10},'You refused the artist request without changing the agreement.');V118_event('roster-request-refused',(a?.name||'Artist')+' request refused',req.type,{artistId:req.artist,agreementId:req.agreementId});V118_escalateRosterDispute(c,req)
 }
 $('modal')?.close?.();queueSave?.();render();toast?.('Decision recorded.');return true
}
function V118_rosterPanel(){
 const co=s.labelBusiness?.company;if(!co)return '';const active=(co.contracts||[]).filter(c=>c.ends>=s.week);return `<section class="card v118-roster-panel"><span class="eyebrow">ROSTER RELATIONSHIPS · LIVE CONTRACTS</span><h2>Signing is the beginning of the relationship.</h2><p>Trust, satisfaction, leverage, ownership pressure and label support keep moving after the signature.</p>${active.map(c=>{V118_storeRosterAgreement(c);V118_ensureCatalogRight(c);const a=s.world?.[c.artist],r=V118_rosterState(c),req=V118_requestForAgreement(c.agreementId);return `<div class="project-row v118-roster-row"><div><strong>${esc(a?.name||'Artist')}</strong><small>${V118_rosterStatusLabel(r)} · satisfaction ${r.satisfaction}/100 · leverage ${r.leverage}/100 · ownership tension ${r.ownershipTension}/100</small>${req?`<p class="bad">Active request: ${esc(req.type.replaceAll('-',' '))}</p>`:'<p class="fine">No formal request pending.</p>'}</div><button class="secondary" onclick="V118_rosterManage(${c.artist})">Manage relationship →</button></div>`}).join('')||'<p>No active roster agreements.</p>'}</section>`
}

const V118_confirmRosterOfferBase=confirmRosterOffer;
confirmRosterOffer=function(){
 const co=s.labelBusiness?.company,before=new Set((co?.contracts||[]).map(c=>`${c.artist}:${c.started}:${c.ends}:${c.advance}`)),result=V118_confirmRosterOfferBase();
 for(const c of co?.contracts||[]){const key=`${c.artist}:${c.started}:${c.ends}:${c.advance}`;if(!before.has(key)){V118_storeRosterAgreement(c);V118_rosterState(c);V118_ensureCatalogRight(c)}}return result
};
const V118_settleLabelWeekBase=settleLabelWeek;
settleLabelWeek=function(){const result=V118_settleLabelWeekBase();V118_settleRosterLifecycle();return result};
const V118_companyPageBase=companyPage;
companyPage=function(){const base=V118_companyPageBase();return s.labelBusiness?.company?base+V118_rosterPanel():base};

/* Representation is now the only player-facing representation screen. The old
   Agent page remains in code temporarily for compatibility while 1.0 cleanup
   removes it, but it no longer renders alongside Representation. */
agencyPage=function(){V100_repTeam();return V100_repTeamPanel()};
const V118_agencyArea=V096_BUSINESS_AREAS?.find?.(x=>x.id==='Agency');if(V118_agencyArea){V118_agencyArea.name='Representation';V118_agencyArea.desc='Managers, booking agents, advisors, chemistry and agreements'}

(function V118_wireLegalAffairs(){
 if(typeof V096_BUSINESS_AREAS==='undefined'||typeof V096_BUSINESS_IDS==='undefined')return;
 if(!V096_BUSINESS_IDS.has('LegalAffairs')){const item={id:'LegalAffairs',group:'Deals & revenue',name:'Legal affairs',desc:'Court docket, disputes, claims, settlements and judgments'};V096_BUSINESS_AREAS.splice(3,0,item);V096_BUSINESS_IDS.add('LegalAffairs')}
 const deals=V109_HQ_GROUPS?.find?.(x=>x.id==='Deals');if(deals&&!deals.areas.includes('LegalAffairs'))deals.areas.push('LegalAffairs')
})();
const V118_badgeBase=V096_businessAreaBadge;
V096_businessAreaBadge=function(id){if(id==='LegalAffairs')return V118_openCases().length;return V118_badgeBase(id)};
function V118_docketCard(c){return `<button class="v118-docket-card" onclick="V118_openDocketCase('${c.id}')"><span><small>${esc(c.number)} · ${esc(c.stage)}</small><strong>${esc(c.title)}</strong><em>${esc(c.issue)} · exposure ${money(c.claim)}</em></span><b>${c.status==='open'?'OPEN':'RESOLVED'} →</b></button>`}
function V118_legalAffairsPage(){const cases=V118_legalCases(),open=cases.filter(x=>x.status==='open'),resolved=cases.filter(x=>x.status==='resolved');return head('Consequences have a paper trail','Legal affairs.')+`<section class="v118-docket-hero"><div><span class="eyebrow">ENCORE CIVIL DOCKET</span><h2>${open.length?'Active matters require attention.':'No active legal matter.'}</h2><p>Every dispute keeps its own case number, agreement link, claim, deadlines and resolution history.</p></div>${metricRail([['Open cases',String(open.length)],['Resolved',String(resolved.length)],['Exposure',money(open.reduce((n,x)=>n+x.claim,0))],['Counsel',V100_repTeam?.().team?.attorney?.name||'None']])}</section><section class="card"><h2>Active docket</h2>${open.map(V118_docketCard).join('')||'<p class="fine">No case is currently filed against your career or company.</p>'}</section><section class="card"><h2>Resolved matters</h2>${resolved.slice(0,20).map(V118_docketCard).join('')||'<p class="fine">Resolved disputes will remain in the permanent file.</p>'}</section>`}
function V118_openDocketCase(id){const c=V118_legalCases().find(x=>x.id===id);if(!c)return false;const settlement=V118_caseSettlement(c),defense=V118_caseDefenseCost(c);modal(`<article class="v118-docket-paper"><header><span>ENCORE CIVIL DOCKET</span><b>${esc(c.number)}</b></header><div class="v118-docket-stamp">${esc(c.status==='open'?c.stage:'RESOLVED')}</div><h2>${esc(c.title)}</h2>${profileRows([['Cause / issue',c.issue],['Plaintiff',c.plaintiff],['Defendant',c.defendant],['Filed',`Week ${c.filedWeek}`],['Claim / exposure',money(c.claim)],['Linked agreement',c.agreementId||'None'],['Clauses in dispute',c.clauses.join(' · ')||'General contract enforcement'],['Assigned attorney',c.assignedAttorney||'No counsel retained'],['Response deadline',c.status==='open'&&c.stage==='FILED'?`Week ${c.deadlineWeek}`:'—']])}<section class="v118-case-history"><h3>Docket history</h3>${c.history.map(x=>`<p><strong>Week ${x.week}</strong> · ${esc(x.text)}</p>`).join('')}</section>${c.status==='open'?`<div class="v118-request-actions"><button class="primary" onclick="V118_caseAction('${c.id}','contest')">File defense · ${money(defense)} + 10 energy</button><button class="secondary" onclick="V118_caseAction('${c.id}','settle')">Settle now · ${money(settlement)}</button></div>`:`<div class="v118-case-result"><strong>${esc(c.outcome||'Resolved')}</strong><span>Week ${c.resolvedWeek||s.week}</span></div>`}<p class="fine">Ignoring a filed case through its response deadline can create a default judgment. Legal outcomes post back into cash, reputation and permanent history.</p></article>`);return true}
const V118_careerBase=career;
career=function(){if(tab==='Career'&&careerTab==='LegalAffairs')return V096_businessSubnav('LegalAffairs')+V118_legalAffairsPage();return V118_careerBase()};
const V118_screenFamilyBase=screenFamily;
screenFamily=function(){if(tab==='Career'&&careerTab==='LegalAffairs')return 'business';return V118_screenFamilyBase()};

const V118_accumulateWeekBase=V083_accumulateWeek;
V083_accumulateWeek=function(completed,beforeCash){V118_advanceLegal(completed);return V118_accumulateWeekBase(completed,beforeCash)};

const V118_artistFileBase=artistFilePage;
artistFilePage=function(){const html=V118_artistFileBase(),cases=V118_legalCases(),legal=`<section class="af-section-v095 v118-file-legal"><div class="af-section-title-v095"><span>05</span><div><small>LEGAL / BUSINESS RECORD</small><h2>The decisions that followed you.</h2></div></div><div class="af-legacy-grid-v095"><div><span>Legal cases</span><strong>${cases.length}</strong></div><div><span>Open matters</span><strong>${V118_openCases().length}</strong></div><div><span>Career events</span><strong>${V118_state().events.length}</strong></div></div><div class="af-inline-actions-v095"><button class="secondary" onclick="careerTab='LegalAffairs';go('Career')">Open legal docket</button><button class="secondary" onclick="V096_openBusinessArea('ContractVault')">Contract Vault</button></div></section>`;return html.replace('<footer class="af-footer-v095">',legal+'<footer class="af-footer-v095">')};

V118_state();
