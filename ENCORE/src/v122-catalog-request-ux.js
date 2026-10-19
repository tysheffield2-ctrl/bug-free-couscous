/* ENCORE 0.9.17 — Catalog Valuation + request review UX.
   Catalog valuation is a first-class destination, not a subsection of the deal room.
   Artist-originated requests stay in context: review and decide from the popup instead
   of being bounced to another screen. Existing simulation/economy functions remain
   authoritative; this layer only composes them into clearer destinations. */

function V122_catalogTrackValue(track){
  return cents(Math.max(0,(Number(track?.streams)||0)*.5*52*(1.5+(Number(track?.quality)||0)/100)))
}
function V122_catalogValuationPage(){
  migrateEmpire?.();migrateExpansion?.();
  const c=s.expansion?.contract||null,gross=catalogValue(),owned=catalogOwnedValue(),ownership=gross>0?clamp(owned/gross*100,0,100):100;
  const history=(s.empire?.catalogHistory||[]).slice(0,12);
  const tracks=(s.songs||[]).filter(x=>x.released).map(x=>({track:x,value:V122_catalogTrackValue(x)})).sort((a,b)=>b.value-a.value);
  const currentWeekly=(s.songs||[]).filter(x=>x.released).reduce((n,x)=>n+(Number(x.streams)||0)*.5,0);
  const catalogBuyback=c&&!c.catalogReleased?rightsQuote('catalog'):0,contractBuyout=c?rightsQuote('contract'):0;
  const ownershipText=!c||c.catalogReleased?'100% controlled by you':Math.round(ownership)+'% current economic interest';
  const options=c?`<section class="v122-catalog-options"><div><span class="eyebrow">OWNERSHIP OPTIONS</span><h2>Control the rights attached to the valuation.</h2><p>${c.catalogReleased?'Your recording royalty participation has already been bought back. The remaining contract can still affect other covered income and promotional support until expiry.':'Your label currently participates in recording income for the remaining contract term. A buyback changes who receives that income; it does not manufacture extra catalog value.'}</p></div><div class="v122-option-grid">${!c.catalogReleased?`<button class="v122-option-card" onclick="buyRights('catalog')"><small>CATALOG PARTICIPATION</small><strong>Buy back recording rights</strong><span>${money(catalogBuyback)}</span><em>End the label’s recording royalty participation while preserving the rest of the agreement.</em></button>`:''}<button class="v122-option-card" onclick="buyRights('contract')"><small>FULL AGREEMENT</small><strong>Review contract buyout</strong><span>${money(contractBuyout)}</span><em>End all remaining label shares and promotional support covered by the agreement.</em></button></div></section>`:`<section class="v122-catalog-options v122-owned"><span class="eyebrow">OWNERSHIP</span><h2>You control the catalog.</h2><p>You are independent with full current economic ownership, so there is no catalog buyback to purchase.</p></section>`;
  return head('The value of the music you own','Catalog valuation.',`<span class="pill">${ownershipText}</span>`)+`<div class="v122-catalog-page"><section class="v122-catalog-hero"><span class="eyebrow">ESTIMATED CATALOG VALUE</span><strong>${money(gross)}</strong><p>Estimated market value based on current weekly recording royalties × 52 and each record’s quality multiple. This is an intelligence estimate—not cash, an appraisal guarantee or an automatic sale offer.</p><div class="v122-catalog-metrics"><div><small>YOUR ECONOMIC INTEREST</small><b>${money(owned)}</b></div><div><small>CURRENT OWNERSHIP</small><b>${Math.round(ownership)}%</b></div><div><small>WEEKLY RECORDING BASIS</small><b>${money(currentWeekly)}</b></div><div><small>RIGHTS STATUS</small><b>${c?c.catalogReleased?'Recording rights bought back':esc(c.name):'Independent'}</b></div></div></section>${options}<section class="v122-catalog-section"><div class="sectionhead"><div><span class="eyebrow">VALUE DRIVERS</span><h2>What is carrying your catalog.</h2></div><span class="pill">${tracks.length} released</span></div>${tracks.length?tracks.slice(0,12).map(({track,value},i)=>`<div class="v122-value-row"><span class="v122-rank">${String(i+1).padStart(2,'0')}</span><div><strong>${esc(track.title)}</strong><small>${compact(track.streams||0)} weekly streams · Quality ${Math.round(track.quality||0)}/100</small></div><b>${money(value)}</b></div>`).join(''):'<p class="fine">Release music to begin building a catalog valuation.</p>'}</section><section class="v122-catalog-section"><div class="sectionhead"><div><span class="eyebrow">VALUATION HISTORY</span><h2>How the estimate has moved.</h2></div></div>${history.length?history.map(v=>`<div class="v122-history-row"><span>Through chart week ${v.week-1}</span><strong>${money(v.value)}</strong></div>`).join(''):'<p class="fine">Your first completed monthly cycle starts the valuation history.</p>'}</section><details class="v122-catalog-method"><summary>How ENCORE values your catalog</summary><p>Each released recording contributes its current weekly streaming royalties, annualized across 52 weeks, then adjusted by a quality multiple from 1.5× to 2.5×. Your economic-interest figure then accounts for active label participation. The estimate changes as records rise, fade, recover or move through contract ownership.</p></details></div>`
}

/* Dedicated route. Keep Catalog Market separate: it is for buying other artists'
   catalog interests, while Catalog Valuation is strictly the player's own music. */
const V122_openDestinationBase=openDestination;
openDestination=function(id){
  if(id==='CatalogValuation'){careerTab='CatalogValuation';go('Career');return}
  return V122_openDestinationBase(id)
};
const V122_careerBase=career;
career=function(){
  if(tab==='Career'&&careerTab==='CatalogValuation')return careerMenu()+V122_catalogValuationPage();
  return V122_careerBase()
};
const V122_screenFamilyBase=screenFamily;
screenFamily=function(){if(tab==='Career'&&careerTab==='CatalogValuation')return 'wealth';return V122_screenFamilyBase()};

/* Reassign the existing Catalog medallion to the dedicated valuation screen. */
const V122_catalogIconRow=typeof ENCORE_ICON_DESTINATIONS!=='undefined'?ENCORE_ICON_DESTINATIONS.find(x=>x[0]==='Catalog'||x[1]==='Catalog'):null;
if(V122_catalogIconRow){V122_catalogIconRow[0]='Catalog Valuation';V122_catalogIconRow[1]='CatalogValuation';V122_catalogIconRow[2]='Value your music';V122_catalogIconRow[3]='Catalog'}
if(typeof ENCORE_ICON_COVERED_ROUTE_IDS!=='undefined')ENCORE_ICON_COVERED_ROUTE_IDS.add('CatalogValuation');

/* Old Business HQ links/cached state still resolve, but Catalog no longer lives as
   a mixed Deals subsection. This prevents duplicate valuation surfaces. */
if(typeof V109_setDealsFocus==='function'){
  const V122_setDealsFocusBase=V109_setDealsFocus;
  V109_setDealsFocus=function(id){if(id==='Catalog'){openDestination('CatalogValuation');return}return V122_setDealsFocusBase(id)}
}
if(typeof V109_dealsTabs==='function'){
  const V122_dealsTabsBase=V109_dealsTabs;
  V109_dealsTabs=function(){return V122_dealsTabsBase().replace(/<button[^>]*onclick="V109_setDealsFocus\('Catalog'\)"[^>]*>[\s\S]*?<\/button>/,'')}
}
if(typeof V109_contractOverview==='function'){
  const V122_contractOverviewBase=V109_contractOverview;
  V109_contractOverview=function(){return V122_contractOverviewBase().replaceAll("V109_setDealsFocus('Catalog')","openDestination('CatalogValuation')")}
}

function V122_artistRequestProfile(a){
  if(!a)return '';
  return `<div class="v122-request-artist">${personPhoto('artist-'+(a.directoryKey??a.id),a.name)}<div><small>${esc(a.genre||'Artist')} · ${tierNames[tier(a.fans||0)]}</small><strong>${esc(a.name)}</strong><span>${compact(a.fans||0)} fans · Reputation ${Math.round(a.reputation||0)} · Relationship ${Math.round(a.relation||0)}</span></div></div>`
}
function V122_openLabelServiceRequest(id){
  const c=V100_labelCompetition(),o=c.inbound.find(x=>x.id===id&&x.status==='open'&&x.expires>=s.week);if(!o)return;
  const a=s.world?.[o.artist];
  modal(`<article class="v122-request-review"><span class="eyebrow">ARTIST REQUEST · INBOUND SERVICES</span><h2>${esc(a?.name||'Artist')} wants ${esc(o.name)}.</h2>${V122_artistRequestProfile(a)}${profileRows([['Service',o.name],['Scope',o.detail],['Company fee',money(o.fee)],['Term',o.weeks+' weeks'],['Service participation',o.share?Math.round(o.share*100)+'%':'None'],['Decision deadline','Week '+o.expires]])}<p class="v122-request-note">Review the full request here. You do not need to leave this popup or hunt through another department.</p><div class="v122-request-actions"><button class="secondary" onclick="$('modal').close();V100_declineInbound('${id}')">Decline</button><button class="primary" onclick="$('modal').close();V100_acceptInbound('${id}')">Accept ${esc(o.name)}</button></div></article>`,'v122-request-dialog')
}
function V122_openCreativeRequest(id){
  migrateV081?.();const o=s.v081?.creative?.offers?.find(x=>x.id===id&&x.status==='open'),a=o&&s.world?.[o.artist];if(!o||!a)return;
  const type={ghostwrite:'Ghostwriting request',produce:'Production request',songOffer:'Song offered to you',featureInvite:'Feature / collaboration request'}[o.type]||'Artist request';
  const fee=(o.type==='ghostwrite'||o.type==='produce')?money(o.fee||0):o.type==='songOffer'?money(Math.round((o.fee||0)*.75)):'Deal terms shown on review';
  const accept=o.type==='featureInvite'&&typeof V092_reviewIncomingFeature==='function'?`<button class="primary" onclick="V092_reviewIncomingFeature(${id})">Review feature terms</button>`:`<button class="primary" onclick="$('modal').close();V081_acceptCreative(${id})">${o.type==='songOffer'?'Accept / acquire song':'Accept request'}</button>`;
  modal(`<article class="v122-request-review"><span class="eyebrow">ARTIST REQUEST · ${esc(type.toUpperCase())}</span><h2>${esc(a.name)} reached out.</h2>${V122_artistRequestProfile(a)}${profileRows([['Request',type],['Estimated creative quality',Math.round(o.quality||0)+'/100'],['Value / terms',fee]])}<p class="v122-request-note">Everything needed to decide is kept in this popup. Opening the request does not move you to Creative Network.</p><div class="v122-request-actions"><button class="secondary" onclick="$('modal').close();V081_declineCreative(${id})">Decline</button>${accept}</div></article>`,'v122-request-dialog')
}
function V122_openTourRequest(id){
  migrateTouring?.();const o=s.touring?.offers?.find(x=>x.id===id&&!x.done&&x.expires>=s.week);if(!o)return;
  const a=s.world?.[o.artist],city=careerWorldMarket?.(o.city)?.city||o.city||'Tour stop';
  modal(`<article class="v122-request-review"><span class="eyebrow">ARTIST REQUEST · TOUR INVITATION</span><h2>${esc(a?.name||'Artist')} wants you on the bill.</h2>${V122_artistRequestProfile(a)}${profileRows([['Role','Opening slot'],['City',city],['Guaranteed fee',money(o.fee||0)],['Audience reach',compact(o.reach||0)],['Energy','25'],['Decision deadline','Week '+o.expires]])}<p class="v122-request-note">Review the invitation here. Accepting still uses the existing Touring simulation and shared live-history systems.</p><div class="v122-request-actions"><button class="secondary" onclick="$('modal').close()">Later</button><button class="primary" onclick="acceptOpeningSlot(${id})">Review & accept</button></div></article>`,'v122-request-dialog')
}

/* Priority requests now open in-place. Commercial/company opportunities keep their
   existing departmental route because they are not artist-to-player requests. */
if(typeof V096_openPriority==='function'){
  const V122_openPriorityBase=V096_openPriority;
  V096_openPriority=function(key){
    const item=V096_priorityRaw().find(x=>x.key===key);if(!item)return;
    if(item.kind==='creative'||item.kind==='tour'){
      V096_markSeen([key]);if($('modal')?.open)$('modal').close();
      return item.kind==='creative'?V122_openCreativeRequest(item.id):V122_openTourRequest(item.id)
    }
    return V122_openPriorityBase(key)
  }
}

/* The exact Artist Relations briefing shown for inbound label services can be
   reviewed directly without leaving the briefing flow. */
const V122_offerBriefingButtonBase=offerBriefingButton;
offerBriefingButton=function(b){
  if(b?.id?.startsWith('label-service:')){
    const id=b.id.slice('label-service:'.length);
    return `<button class="memo-primary" onclick="V122_openLabelServiceRequest('${id}')">Review artist request here</button>`
  }
  return V122_offerBriefingButtonBase(b)
};
