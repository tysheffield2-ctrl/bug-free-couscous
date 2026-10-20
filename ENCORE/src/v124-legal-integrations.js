/* ENCORE 0.9.20 — Legal Affairs 2.0 integration + action-routing pass.
   Keep exposure accounting attached to authoritative game systems that live
   outside the physical-asset ledger, make legal playtesting immediate in Sandbox,
   and keep label operations separate from the general Business HQ. */
const V124_ctxCore=V124_ctx;
V124_ctx=function(){
 const ctx=V124_ctxCore();
 const sportsHoldings=Array.isArray(s.v081?.sports?.holdings)?s.v081.sports.holdings.length:0;
 ctx.sports+=sportsHoldings;
 return ctx
};

function V124_sandboxMatter(type=''){
 if(!(SANDBOX||s.sandbox))return false;
 if(V118_openCases().length>=5){toast?.('Resolve an open legal matter before generating another test case.');return false}
 const c=V124_generateMatter(type||null,true);if(!c){toast?.('Build more career exposure before generating a risk-weighted matter.');return false}
 queueSave?.();render();V118_openDocketCase(c.id);return true
}
const V124_legalAffairsPageCore=V118_legalAffairsPage;
V118_legalAffairsPage=function(){
 const html=V124_legalAffairsPageCore();if(!(SANDBOX||s.sandbox))return html;
 const options=Object.entries(V124_LEGAL_TYPES).map(([id,x])=>`<option value="${id}">${esc(x.name)} · ${esc(x.category)}</option>`).join('');
 const lab=`<section class="card v124-sandbox-legal"><span class="eyebrow">SANDBOX · LEGAL PLAYTEST</span><h2>Put the legal system on the table.</h2><p>Generate a simulated filing immediately so you can test counsel, mediation, settlement, defense, deadlines and docket history without waiting for the weekly risk roll.</p><label>Matter to generate<select id="v124-sandbox-type"><option value="">Risk-weighted random matter</option>${options}</select></label><button class="primary" onclick="V124_sandboxMatter($('v124-sandbox-type').value)">Generate test legal matter</button><p class="fine">Sandbox-only. This never creates a case in your normal career.</p></section>`;
 return html.replace('<section class="card"><h2>Active docket',lab+'<section class="card"><h2>Active docket')
};

/* Cause-based legal filings already create a detailed risk briefing after V118_fileCase.
   Remove the older generic duplicate so one lawsuit produces one player-facing alert. */
const V124_fileCaseIntegrated=V118_fileCase;
V118_fileCase=function(spec={}){
 const c=V124_fileCaseIntegrated(spec);
 if(c&&spec.generatedBy==='legal-risk'&&Array.isArray(s.achievements?.briefings)){
  s.achievements.briefings=s.achievements.briefings.filter(b=>b.id!=='legal:'+c.id)
 }
 return c
};

function V124_caseIdFromBriefing(id=''){return String(id).replace(/^legal(?:-risk)?:/,'')}
function V124_openLegalBriefing(id){
 const caseId=V124_caseIdFromBriefing(id),c=V118_legalCases().find(x=>x.id===caseId);
 $('modal')?.close?.();careerTab='LegalAffairs';go('Career');
 if(c)setTimeout(()=>V118_openDocketCase(caseId),0)
}
function V124_openRosterBriefing(id){
 const requestId=String(id).replace(/^roster-request:/,'');
 $('modal')?.close?.();careerTab='Labels';go('Career');
 setTimeout(()=>V118_reviewRosterRequest?.(requestId),0)
}
function V124_openTeamBriefing(){
 $('modal')?.close?.();careerTab='Team';go('Career')
}

/* Briefings that tell the player to do something now take them directly to the
   decision surface. Pure world/immersion stories (for example breakout shocks)
   deliberately remain read-only and keep their narrative feel. */
const V124_offerBriefingButtonCore=offerBriefingButton;
offerBriefingButton=function(b){
 const id=String(b?.id||''),text=`${b?.title||''} ${b?.body||''} ${b?.detail||''}`.toLowerCase();
 if(/^legal(?:-risk)?:/.test(id))return `<button class="memo-primary v124-briefing-action" onclick="V124_openLegalBriefing('${esc(id)}')">Review legal case →</button>`;
 if(id.startsWith('roster-request:'))return `<button class="memo-primary v124-briefing-action" onclick="V124_openRosterBriefing('${esc(id)}')">Review artist request →</button>`;
 if(text.includes('review this hire in team')||text.includes('team needs attention'))return `<button class="memo-primary v124-briefing-action" onclick="V124_openTeamBriefing()">Review Team →</button>`;
 return V124_offerBriefingButtonCore(b)
};

/* Old saves can contain both the generic filing memo and the detailed risk memo.
   Opening either marks its sibling read so the same lawsuit never interrupts twice. */
const V124_showBriefingCore=showBriefing;
showBriefing=function(id){
 const key=String(id||'');
 if(/^legal(?:-risk)?:/.test(key)&&Array.isArray(s.achievements?.briefings)){
  const caseId=V124_caseIdFromBriefing(key);
  for(const b of s.achievements.briefings)if(V124_caseIdFromBriefing(b.id)===caseId&&/^legal(?:-risk)?:/.test(String(b.id||'')))b.read=true
 }
 return V124_showBriefingCore(id)
};

/* ---------- LABEL HQ ----------
   Record-company gameplay is its own pillar now. Business HQ remains for general
   commerce, representation, executive operations, ownership and non-label deals. */
function V124_rewireLabelNavigation(){
 if(typeof V096_BUSINESS_AREAS!=='undefined'){
  for(let i=V096_BUSINESS_AREAS.length-1;i>=0;i--)if(['Labels','League'].includes(V096_BUSINESS_AREAS[i].id))V096_BUSINESS_AREAS.splice(i,1)
 }
 V096_BUSINESS_IDS?.delete?.('Labels');V096_BUSINESS_IDS?.delete?.('League');
 if(typeof V109_HQ_GROUPS!=='undefined'){
  for(const group of V109_HQ_GROUPS)group.areas=group.areas.filter(id=>!['Labels','League'].includes(id));
  const company=V109_HQ_GROUPS.find(g=>g.id==='Company');
  if(company){company.name='Representation & team';company.desc='Representation, executives and operating staff outside your record label.'}
 }
 if(typeof V080_destinations!=='undefined'){
  for(let i=V080_destinations.length-1;i>=0;i--)if(['Labels','League','LabelHQ'].includes(V080_destinations[i][2]))V080_destinations.splice(i,1);
  const businessIndex=V080_destinations.findIndex(x=>x[2]==='BusinessHQ');
  V080_destinations.splice(businessIndex>=0?businessIndex+1:Math.min(12,V080_destinations.length),0,['Label HQ','Label','LabelHQ','Artist deals, roster, requests and label competition',4])
 }
 if(typeof careerGroups!=='undefined'&&Array.isArray(careerGroups)){
  for(const g of careerGroups)g.tabs=g.tabs.filter(id=>!['Labels','League','LabelHQ'].includes(id));
  if(!careerGroups.some(g=>g.name==='Label')){
   const legacyIndex=careerGroups.findIndex(g=>g.name==='Legacy'),at=legacyIndex>=0?legacyIndex:careerGroups.length;
   careerGroups.splice(at,0,{name:'Label',tabs:['LabelHQ','Labels','League']})
  }
 }
}
V124_rewireLabelNavigation();

const V124_businessPriorityItemsCore=typeof V109_businessPriorityItems==='function'?V109_businessPriorityItems:null;
if(V124_businessPriorityItemsCore)V109_businessPriorityItems=function(){return V124_businessPriorityItemsCore().filter(x=>x.kind!=='Label offer')};

/* Business HQ should not borrow the label company's name or use roster count as
   a company KPI now that label operations have their own office. */
if(typeof V109_businessPage==='function'){
 V109_businessPage=function(){
  const value=V092_businessValue(),commercial=V109_activeCommercial().length,open=V109_businessPriorityItems().length,executives=typeof V123_execState==='function'?Object.keys(V123_execState().team||{}).length:0;
  return `<article class="v109-hq"><header class="v109-hq-hero"><div><span class="eyebrow">BUSINESS HQ / EXECUTIVE OFFICE</span><h1>${esc(s.name)} Enterprises</h1><p>One decision desk, four business lanes. General business operations live here; record-label operations, roster decisions and label competition have moved to Label HQ.</p></div><div class="v109-hq-value"><small>BUSINESS ASSETS</small><strong>${money(value)}</strong><span>Tracked holdings, inventory and ownership value outside artist-label operations.</span></div></header><section class="v109-hq-metrics">${[['DECISIONS',open],['ACTIVE DEALS',commercial],['EXECUTIVES',executives],['CASH',money(s.cash)]].map(([k,v])=>`<div><small>${k}</small><strong>${v}</strong></div>`).join('')}</section>${V109_hqTabs()}${V109_hqFocusPanel()}<footer class="v109-hq-footer"><div><span class="eyebrow">QUICK RULE</span><strong>Opening a department never accepts an offer or spends money.</strong></div><button class="secondary" onclick="V109_openBusinessDirectory()">Open full directory</button></footer></article>`
 };
 V092_businessPage=V109_businessPage
}

function V124_labelOpenRequests(){return (V118_state?.().rosterRequests||[]).filter(x=>x.status==='open')}
function V124_openFirstLabelRequest(){const req=V124_labelOpenRequests()[0];if(req)V118_reviewRosterRequest?.(req.id);else toast?.('No roster request needs a decision right now.')}
function V124_labelHQPage(){
 migrateLabelBusiness?.();
 const co=s.labelBusiness?.company,roster=typeof ownerContracts==='function'?ownerContracts():[],requests=V124_labelOpenRequests(),offers=(s.labelBusiness?.offers||[]).filter(o=>!o.used&&o.expires>=s.week),artistDeal=s.expansion?.contract;
 return head('A record company deserves its own room','Label HQ.')+`<article class="v124-label-hq"><header class="v124-label-hero"><div><span class="eyebrow">LABEL HQ · ARTIST + EXECUTIVE SIDE</span><h1>${co?esc(co.name):'Your label career'}</h1><p>Label offers, your artist agreement, roster management, artist requests and industry competition live here now. Business HQ no longer doubles as the label office.</p></div><div class="v124-label-status"><small>YOUR POSITION</small><strong>${co?'Founder / owner':artistDeal?'Signed artist':'Independent artist'}</strong><span>${co?roster.length+' active roster artist'+(roster.length===1?'':'s'):artistDeal?esc(artistDeal.name||'Active label agreement'):'No active label agreement'}</span></div></header>${metricRail([['Open label offers',String(offers.length)],['Roster artists',String(roster.length)],['Artist requests',String(requests.length)],['Label receipts',money(co?.receipts||0)]])}<section class="v124-label-lanes"><button onclick="careerTab='Labels';render()"><small>OPERATIONS</small><strong>Label operations</strong><span>Artist deal, incoming offers, demos, your company, staff, scouting and roster contracts.</span><b>Open →</b></button><button onclick="careerTab='League';render()"><small>COMPETITION</small><strong>Label League</strong><span>See rival companies, market position and how your label compares.</span><b>Open →</b></button>${requests.length?`<button class="attention" onclick="V124_openFirstLabelRequest()"><small>DECISION REQUIRED</small><strong>${requests.length} artist request${requests.length===1?'':'s'} waiting</strong><span>Renegotiations, release requests and catalog ownership requests should be handled here.</span><b>Review →</b></button>`:''}</section></article>`
}
function V124_labelSectionNav(active){return `<section class="v124-label-nav"><button onclick="careerTab='LabelHQ';render()">← Label HQ</button><div><small>LABEL HQ</small><strong>${active==='Labels'?'Operations':'Label League'}</strong></div><nav><button class="${active==='Labels'?'selected':''}" onclick="careerTab='Labels';render()">Operations</button><button class="${active==='League'?'selected':''}" onclick="careerTab='League';render()">League</button></nav></section>`}

const V124_careerCore=career;
career=function(){
 if(tab==='Career'&&careerTab==='LabelHQ')return careerMenu()+V124_labelHQPage();
 if(tab==='Career'&&careerTab==='Labels')return careerMenu()+V124_labelSectionNav('Labels')+labelPage();
 if(tab==='Career'&&careerTab==='League')return careerMenu()+V124_labelSectionNav('League')+labelLeaguePage();
 return V124_careerCore()
};
const V124_openDestinationCore=openDestination;
openDestination=function(id){if(id==='LabelHQ'){careerTab='LabelHQ';go('Career');return}return V124_openDestinationCore(id)};
const V124_screenFamilyCore=screenFamily;
screenFamily=function(){if(tab==='Career'&&['LabelHQ','Labels','League'].includes(careerTab))return 'label';return V124_screenFamilyCore()};
