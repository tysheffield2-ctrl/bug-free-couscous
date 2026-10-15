/* ENCORE 0.9.8 — Business HQ navigation reset + focused contracts/rights hub.
   Goal: fewer simultaneous destinations, stronger information hierarchy, and
   a full document experience for paid career opportunities. */

let V109_hqFocus='Priority';
let V109_dealsFocus='Overview';

const V109_HQ_GROUPS=[
  {id:'Deals',name:'Deals & legal',desc:'Offers, agreements, rights and executed documents.',areas:['Offers','Deals','ContractVault']},
  {id:'Company',name:'Team & company',desc:'Your label, industry position and representation team.',areas:['Labels','League','Agency','Team']},
  {id:'Creative',name:'Creative & commerce',desc:'Collaborations, paid creative work and merchandise.',areas:['Creative','Commerce']},
  {id:'Ownership',name:'Ownership & assets',desc:'Sports franchises and music-catalog investments.',areas:['Sports','CatalogMarket']}
];

function V109_area(id){return V096_BUSINESS_AREAS?.find?.(x=>x.id===id)||null}
function V109_groupForArea(id){return V109_HQ_GROUPS.find(g=>g.areas.includes(id))||null}
function V109_openHQFocus(id){if(id!=='Priority'&&!V109_HQ_GROUPS.some(g=>g.id===id))return;V109_hqFocus=id;render()}
function V109_areaCount(id){try{return V096_businessAreaBadge(id)||0}catch{return 0}}
function V109_activeCommercial(){return (s.v080?.commercial?.contracts||[]).filter(x=>x.active)}
function V109_openLabelOffers(){V096_openBusinessArea('Offers')}

function V109_businessPriorityItems(){
  const items=[];
  for(const o of s.labelBusiness?.offers||[])if(!o.used&&o.expires>=s.week){
    const d=labelDeals?.[o.label];
    items.push({key:'label:'+o.id,kind:'Label offer',title:d?.name||'Recording offer',detail:(o.source||'A label wants to negotiate.')+' · '+V080_offerDeadlineText(o),priority:6,action:`reviewArtistOffer('${o.id}')`});
  }
  for(const x of (typeof V096_priorityRaw==='function'?V096_priorityRaw():[])){
    if(!['creative','commercial'].includes(x.kind))continue;
    items.push({key:x.key,kind:x.category,title:x.title,detail:x.detail,priority:x.priority||1,action:`V096_openPriority('${x.key}')`});
  }
  return items.sort((a,b)=>b.priority-a.priority).slice(0,6)
}

function V109_departmentButton(id){
  const a=V109_area(id);if(!a)return '';
  const count=V109_areaCount(id);
  return `<button class="v109-dept-button" onclick="V096_openBusinessArea('${id}')"><span><small>${esc(a.group)}</small><strong>${esc(a.name)}</strong><em>${esc(a.desc)}</em></span><b>${count?count+' active':'Open'} →</b></button>`
}
function V109_hqTabs(){
  const tabs=[['Priority','Needs attention'],...V109_HQ_GROUPS.map(g=>[g.id,g.name])];
  return `<nav class="v109-hq-tabs" aria-label="Business HQ sections">${tabs.map(([id,name])=>`<button class="${V109_hqFocus===id?'selected':''}" onclick="V109_openHQFocus('${id}')">${esc(name)}${id==='Priority'&&V109_businessPriorityItems().length?` <b>${V109_businessPriorityItems().length}</b>`:''}</button>`).join('')}<button onclick="V109_openBusinessDirectory()">All sections ☰</button></nav>`
}
function V109_hqFocusPanel(){
  if(V109_hqFocus==='Priority'){
    const items=V109_businessPriorityItems();
    return `<section class="v109-hq-focus"><header><div><span class="eyebrow">DECISION DESK</span><h2>${items.length?'Handle what matters first.':'Nothing needs your signature right now.'}</h2></div><small>${items.length} item${items.length===1?'':'s'} waiting</small></header>${items.length?`<div class="v109-priority-list">${items.map(x=>`<button onclick="${x.action}"><span><small>${esc(x.kind)}</small><strong>${esc(x.title)}</strong><em>${esc(x.detail)}</em></span><b>Review →</b></button>`).join('')}</div>`:`<div class="v109-empty-desk"><strong>Desk clear.</strong><p>Use the category tabs above to manage contracts, your company, creative business or ownership.</p></div>`}</section>`
  }
  const group=V109_HQ_GROUPS.find(g=>g.id===V109_hqFocus)||V109_HQ_GROUPS[0];
  return `<section class="v109-hq-focus"><header><div><span class="eyebrow">${esc(group.name.toUpperCase())}</span><h2>${esc(group.desc)}</h2></div><button class="secondary" onclick="V109_openHQFocus('Priority')">Back to desk</button></header><div class="v109-dept-grid">${group.areas.map(V109_departmentButton).join('')}</div></section>`
}
function V109_openBusinessDirectory(current=''){
  const groups=V109_HQ_GROUPS.map(g=>`<section class="v109-directory-group"><span class="eyebrow">${esc(g.name.toUpperCase())}</span>${g.areas.map(id=>{const a=V109_area(id);if(!a)return '';const count=V109_areaCount(id);return `<button class="${id===current?'selected':''}" onclick="$('modal').close();V096_openBusinessArea('${id}')"><span><strong>${esc(a.name)}</strong><small>${esc(a.desc)}</small></span><b>${count?count:'→'}</b></button>`}).join('')}</section>`).join('');
  modal(`<article class="v109-directory"><span class="eyebrow">BUSINESS HQ</span><h2>Jump to a department</h2><p>Everything is still here — it is just grouped so you do not have to scan the entire company every time.</p>${groups}<button class="secondary" onclick="$('modal').close()">Close menu</button></article>`,'v109-directory-dialog')
}

function V109_businessPage(){
  migrateV096?.();
  const co=s.labelBusiness?.company,value=V092_businessValue(),commercial=V109_activeCommercial().length,roster=typeof ownerContracts==='function'?ownerContracts().length:0,open=V109_businessPriorityItems().length;
  return `<article class="v109-hq"><header class="v109-hq-hero"><div><span class="eyebrow">BUSINESS HQ / EXECUTIVE OFFICE</span><h1>${co?esc(co.name):esc(s.name)+' Enterprises'}</h1><p>One decision desk, four business lanes. Pick the lane you need instead of scrolling through the entire company.</p></div><div class="v109-hq-value"><small>BUSINESS ASSETS</small><strong>${money(value)}</strong><span>Tracked holdings, inventory and ownership value.</span></div></header><section class="v109-hq-metrics">${[['DECISIONS',open],['ACTIVE DEALS',commercial],['ROSTER',roster],['CASH',money(s.cash)]].map(([k,v])=>`<div><small>${k}</small><strong>${v}</strong></div>`).join('')}</section>${V109_hqTabs()}${V109_hqFocusPanel()}<footer class="v109-hq-footer"><div><span class="eyebrow">QUICK RULE</span><strong>Opening a department never accepts an offer or spends money.</strong></div><button class="secondary" onclick="V109_openBusinessDirectory()">Open full directory</button></footer></article>`
}

/* Replace the oversized child-screen chip strip with a compact breadcrumb + menu. */
V096_businessSubnav=function(id){
  const current=V109_area(id);if(!current)return '';
  const group=V109_groupForArea(id);
  return `<section class="business-inside v109-business-inside"><button class="business-home-button" onclick="V096_openBusinessArea('BusinessHQ')">← Business HQ</button><div><small>${group?esc(group.name.toUpperCase()):'BUSINESS HQ'}</small><strong>${esc(current.name)}</strong></div><button class="v109-section-menu" onclick="V109_openBusinessDirectory('${id}')">Sections ☰</button></section>`
};

/* ---------------- Contracts & Rights hub ---------------- */
const V109_legacyDealsPage=dealsPage;
function V109_setDealsFocus(id){if(!['Overview','Agreements','Rights','Catalog'].includes(id))return;V109_dealsFocus=id;render()}
function V109_dealsTabs(){return `<nav class="v109-deals-tabs">${[['Overview','Overview'],['Agreements','Agreements'],['Rights','Rights'],['Catalog','Catalog intelligence']].map(([id,n])=>`<button class="${V109_dealsFocus===id?'selected':''}" onclick="V109_setDealsFocus('${id}')">${n}</button>`).join('')}</nav>`}
function V109_artistContract(){return s.expansion?.contract||null}
function V109_contractTypeName(c){if(!c)return 'Independent';const t=String(c.type||'record');return V090_CONTRACT_TYPES?.[t]?.name||t.replace(/^./,x=>x.toUpperCase())}
function V109_playerRights(){
  const c=V109_artistContract();
  if(!c)return {give:[],keep:Object.values(V090_RIGHT_LABELS||{}),label:'Independent · full rights'};
  const rights=V090_contractRights(c.type||'record',c.rights),give=[],keep=[];
  for(const [k,n] of Object.entries(V090_RIGHT_LABELS))(rights[k]?give:keep).push(n);
  return {give,keep,label:V109_contractTypeName(c)+' · '+esc(c.name||'active agreement')}
}
function V109_contractOverview(){
  const artist=V109_artistContract(),commercial=V109_activeCommercial(),vault=typeof V100_contractVault==='function'?V100_contractVault():[],labelOffers=(s.labelBusiness?.offers||[]).filter(o=>!o.used&&o.expires>=s.week),commercialOffers=(s.v080?.commercial?.offers||[]).filter(o=>o.status==='open'&&o.expires>=s.week);
  return `<section class="v109-contract-summary"><div><span class="eyebrow">YOUR ARTIST AGREEMENT</span><h2>${artist?esc(artist.name||V109_contractTypeName(artist)):'Independent'}</h2><p>${artist?`${esc(V109_contractTypeName(artist))} · ${Math.round((artist.share||0)*100)}% company share · through Week ${artist.ends}`:'No active label agreement. You currently control the rights not separately granted elsewhere.'}</p><button class="secondary" onclick="V109_setDealsFocus('${artist?'Rights':'Agreements'}')">${artist?'Review rights':'View agreements'}</button></div><div><span class="eyebrow">LEGAL SNAPSHOT</span>${profileRows([['Active commercial agreements',String(commercial.length)],['Open formal offers',String(labelOffers.length+commercialOffers.length)],['Executed documents',String(vault.length)]])}<button class="primary" onclick="V096_openBusinessArea('ContractVault')">Open Contract Vault →</button></div></section><section class="v109-contract-actions"><button onclick="V096_openBusinessArea('Offers')"><span>OPEN OFFERS</span><strong>${labelOffers.length+commercialOffers.length}</strong><small>Review and negotiate</small></button><button onclick="V109_setDealsFocus('Agreements')"><span>ACTIVE AGREEMENTS</span><strong>${commercial.length+(artist?1:0)}</strong><small>See what is in force</small></button><button onclick="V109_setDealsFocus('Rights')"><span>RIGHTS POSITION</span><strong>${artist?'Review':'Full'}</strong><small>What you gave vs. kept</small></button><button onclick="V109_setDealsFocus('Catalog')"><span>CATALOG VALUE</span><strong>Open</strong><small>Valuation and leverage</small></button></section>`
}
function V109_agreementsPanel(){
  const artist=V109_artistContract(),commercial=V109_activeCommercial(),roster=typeof ownerContracts==='function'?ownerContracts():[];
  return `<section class="v109-agreement-list"><header><span class="eyebrow">AGREEMENTS IN FORCE</span><h2>Only active obligations.</h2><p>Executed history lives in Contract Vault; this page is for what currently affects your career or company.</p></header>${artist?`<article><div><small>ARTIST / LABEL</small><strong>${esc(artist.name||V109_contractTypeName(artist))}</strong><span>${esc(V109_contractTypeName(artist))}</span></div>${profileRows([['Company share',Math.round((artist.share||0)*100)+'%'],['Ends after Week',String(artist.ends)],['Advance',money(artist.advance||0)]])}<button class="secondary" onclick="V109_setDealsFocus('Rights')">Review rights</button></article>`:`<article class="empty"><div><small>ARTIST / LABEL</small><strong>Independent</strong><span>No active artist recording agreement.</span></div></article>`}${commercial.map(c=>`<article><div><small>${esc(V080_offerCategoryName(c.category).toUpperCase())}</small><strong>${esc(c.name)}</strong><span>${c.lifetime?'Lifetime relationship':(c.durationMonths||0)+'-month agreement'}</span></div>${profileRows([['Headline value',money(c.totalValue||0)],['Paid to date',money(c.paid||0)],['Guaranteed remaining',money(c.remaining||0)]])}<button class="secondary" onclick="V096_openBusinessArea('Offers')">Commercial details</button></article>`).join('')}${roster.length?`<header class="v109-subhead"><span class="eyebrow">YOUR LABEL ROSTER</span><h3>${roster.length} artist agreement${roster.length===1?'':'s'}</h3></header>${roster.map(c=>`<article><div><small>ROSTER CONTRACT</small><strong>${esc(s.world?.[c.artist]?.name||'Artist')}</strong><span>${esc(V109_contractTypeName(c))}</span></div>${profileRows([['Your label share',Math.round((c.share||0)*100)+'%'],['Ends after Week',String(c.ends)],['Advance paid',money(c.advance||0)]])}<button class="secondary" onclick="V096_openBusinessArea('Labels')">Open roster</button></article>`).join('')}`:''}</section>`
}
function V109_rightsPanel(){
  const c=V109_artistContract(),r=V109_playerRights();
  return `<section class="v109-rights-hero"><header><span class="eyebrow">CURRENT RIGHTS POSITION</span><h2>${c?esc(c.name||V109_contractTypeName(c)):'Independent · full control'}</h2><p>${c?'This is the active artist agreement affecting your music and related revenue categories.':'No active artist label agreement is taking a share of your music rights.'}</p></header><div class="v109-rights-columns"><div><span>COUNTERPARTY PARTICIPATES</span>${r.give.length?r.give.map(x=>`<p>✓ ${esc(x)}</p>`).join(''):'<p>None through an active artist label agreement.</p>'}</div><div><span>YOU RETAIN</span>${r.keep.length?r.keep.map(x=>`<p>✓ ${esc(x)}</p>`).join(''):'<p>Review the executed agreement for retained-right exceptions.</p>'}</div></div>${c?`<div class="v109-rights-note">${profileRows([['Deal type',V109_contractTypeName(c)],['Company share',Math.round((c.share||0)*100)+'%'],['Term through',`Week ${c.ends}`]])}<button class="primary" onclick="V096_openBusinessArea('ContractVault')">Read executed contract →</button></div>`:`<div class="v109-rights-note"><strong>You are independent.</strong><p>Commercial endorsements, representation agreements and investments can still carry separate obligations, but they do not automatically transfer your recording rights.</p></div>`}</section>`
}
function V109_catalogPanel(){
  /* The legacy page contains the deep valuation model. It is intentionally
     moved behind this explicit tab instead of occupying the main deal room. */
  return `<section class="v109-catalog-intro"><span class="eyebrow">CATALOG INTELLIGENCE</span><h2>Valuation is a deep-dive now.</h2><p>This keeps valuation history, label-offer context and leverage available without forcing it into every contract visit.</p></section><div class="v109-legacy-deals">${V109_legacyDealsPage()}</div>`
}
function V109_dealsPage(){
  const body=V109_dealsFocus==='Overview'?V109_contractOverview():V109_dealsFocus==='Agreements'?V109_agreementsPanel():V109_dealsFocus==='Rights'?V109_rightsPanel():V109_catalogPanel();
  return head('Agreements without the clutter','Contracts & rights.')+`<section class="v109-deals-shell"><header class="v109-deals-head"><div><span class="eyebrow">DEAL ROOM</span><h2>Know what is active, what you own, and what needs a signature.</h2></div><button class="secondary" onclick="V096_openBusinessArea('ContractVault')">Contract Vault</button></header>${V109_dealsTabs()}${body}</section>`
}
dealsPage=V109_dealsPage;

/* ---------------- Paid opportunity agreements ---------------- */
const V109_acceptOpportunityBase=acceptOpportunity;
function V109_opportunityEffect(o){
  if(o.type==='Feature invitation')return 'Completing the appearance adds a featured credit, improves the relationship by +5 and can expose you to the other artist’s audience.';
  if(o.type==='Opening slot')return 'Completing the engagement builds live visibility, improves the relationship by +5 and adds audience exposure based on Charisma.';
  if(o.type==='Festival set')return 'Completing the engagement builds public visibility, improves the relationship by +5 and adds audience exposure based on Charisma.';
  return 'Completing the engagement adds audience exposure based on Charisma and improves your relationship with the counterparty by +5.'
}
function V109_openOpportunityAgreement(id){
  const o=s.expansion?.opportunities?.find(x=>x.id===id&&!x.done&&x.expires>=s.week);if(!o)return false;
  V080_markReviewed?.(o);
  const title=o.type==='Interview'?'Interview Appearance Agreement':o.type==='Opening slot'?'Live Support Appearance Agreement':o.type==='Feature invitation'?'Featured Artist Appearance Agreement':o.type==='Festival set'?'Festival Performance Agreement':'Career Opportunity Agreement';
  const counterparty=o.name||'Industry Partner',effect=V109_opportunityEffect(o);
  if(typeof V108_mountStandardContract!=='function'){return V109_acceptOpportunityBase(id,false)}
  return V108_mountStandardContract({kind:'opportunity',counterparty,documentTitle:title,summaryTitle:'Opportunity terms',summaryHtml:profileRows([['Engagement',o.type],['Guaranteed fee',money(o.fee||0)],['Energy required','15'],['Relationship effect','+5'],['Decision window',V080_offerDeadlineText(o)]]),explainer:effect,executionNote:'This agreement completes immediately when signed. It does not transfer ownership of your existing masters, publishing or catalog.',pages:[
    {title:'1 · Engagement',body:`${counterparty} engages ${s.name} for the following career appearance: ${o.type}.`},
    {title:'2 · Compensation',body:`Guaranteed compensation is ${money(o.fee||0)}. The payment is recorded in this week’s finances when the engagement is completed.`,rows:[['GUARANTEE',money(o.fee||0)],['UPFRONT COST','$0'],['ENERGY','15']]},
    {title:'3 · Services',body:`The Artist agrees to complete the ${o.type.toLowerCase()} as a one-time engagement. ENCORE resolves the appearance immediately after execution.`},
    {title:'4 · Career Effect',body:effect,note:'Exposure is a gameplay outcome, not a guaranteed fan total.'},
    {title:'5 · Rights & Ownership',body:'No ownership of the Artist’s pre-existing masters, publishing, catalog, merchandise, touring business or unrelated endorsements transfers under this one-time opportunity. The counterparty receives only the simulated participation necessary to complete this appearance.'},
    {title:'6 · Term & Expiration',body:`This offer remains available under its current decision window: ${V080_offerDeadlineText(o)}. Once completed, the engagement is finished and does not create an ongoing representation or recording relationship.`},
    {title:'7 · Execution',body:'Electronic execution confirms the fee, energy cost, one-time services and limited scope above. Signing immediately completes the opportunity.'}
  ],execute:()=>{V109_acceptOpportunityBase(id,true);return !!o.done}})
}
acceptOpportunity=function(id,confirmed=false){
  const o=s.expansion?.opportunities?.find(x=>x.id===id&&!x.done&&x.expires>=s.week);if(!o)return;
  if(confirmed)return V109_acceptOpportunityBase(id,true);
  return V109_openOpportunityAgreement(id)
};

/* Force the current Business HQ and deal room to use the focused layouts even
   through older career wrapper layers. */
V092_businessPage=V109_businessPage;
