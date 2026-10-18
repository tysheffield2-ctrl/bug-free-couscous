/* ENCORE v1.06 — Showcase fidelity + mobile shell reliability.
   Uses the approved ENCORE management showcase as the presentation target while
   preserving the current simulation, saves and authoritative business systems. */

/* --------------------------------------------------------------------------
   Bottom navigation — match the approved five-destination mobile shell.
   Studio / Charts / Home / Business / More keeps Home centered while preserving
   access to every existing screen through More.
---------------------------------------------------------------------------- */
function V106_businessActive(){
  return tab==='Career'&&(careerTab==='BusinessHQ'||(typeof V096_BUSINESS_IDS!=='undefined'&&V096_BUSINESS_IDS.has(careerTab)));
}
function V106_navActive(id){
  if(id==='Studio')return tab==='Create';
  if(id==='Charts')return tab==='Industry'&&industryTab==='Charts';
  if(id==='Home')return tab==='Home';
  if(id==='Business')return V106_businessActive();
  if(id==='More')return tab==='Menu'||tab==='ArtistFile'||tab==='Stats'||(tab==='Career'&&!V106_businessActive())||(tab==='Industry'&&industryTab!=='Charts');
  return false;
}
function V106_navGo(id){
  if(id==='Studio'){go('Create');return}
  if(id==='Charts'){industryTab='Charts';go('Industry');return}
  if(id==='Home'){go('Home');return}
  if(id==='Business'){V096_openBusinessArea('BusinessHQ');return}
  if(id==='More'){go('Menu');return}
}
navigationBar=function(){
  return ['Studio','Charts','Home','Business','More'].map(id=>`<button class="v106-nav-${id.toLowerCase()} ${V106_navActive(id)?'active':''} ${id==='Home'?'nav-home':''}" ${V106_navActive(id)?'aria-current="page"':''} onclick="V106_navGo('${id}')"><span class="encore-nav-icon">${encoreIcon(id)}</span><span>${id}</span></button>`).join('')
};

/* --------------------------------------------------------------------------
   Use the real core-cast portraits that already ship with ENCORE.
   Non-core / generated artists keep unique initials rather than reusing a face.
---------------------------------------------------------------------------- */
const V106_personPhotoBase=personPhoto;
personPhoto=function(key,name,large=false){
  const cast=typeof V085_CORE_CAST!=='undefined'?V085_CORE_CAST.find(x=>x.name===name):null;
  if(cast){
    const file=String(cast.portraitId).replace('artist-','');
    return `<img class="person-photo v106-cast-portrait ${large?'portrait-large':''}" src="/portraits/artists/artist-${file}.webp" alt="Portrait of ${esc(name)}" loading="lazy">`;
  }
  return V106_personPhotoBase(key,name,large)
};

/* --------------------------------------------------------------------------
   Label accounting presentation.
   Existing saves keep co.receipts internally for compatibility, but the player-facing
   vocabulary is Revenue / Artist Share / Operating Profit — never "receipts".
---------------------------------------------------------------------------- */
function V106_labelSnapshot(co=s.labelBusiness?.company){
  const last=co?.last||null;
  const revenue=Number(last?.income||0),payroll=Number(last?.payroll||0);
  return {
    lifetimeRevenue:Number(co?.receipts||0),
    revenue,
    payroll,
    profit:cents(revenue-payroll),
    tracked:!!last?.v106Financials,
    gross:Number(last?.grossRoster||0),
    artistShare:Number(last?.artistShare||0),
    master:Number(last?.recordingRevenue??last?.recording??0),
    distribution:Number(last?.distributionRevenue||0),
    other:Number(last?.touringMerchRevenue??last?.other??0)
  }
}

/* Add clearer settlement detail going forward without changing the money actually paid. */
const V106_settleLabelWeekBase=settleLabelWeek;
settleLabelWeek=function(){
  const result=V106_settleLabelWeekBase();
  const co=s.labelBusiness?.company;
  if(!co?.last||co.last.week!==s.week||co.last.v106Financials)return result;
  let grossMusic=0,grossOther=0,recordingRevenue=0,distributionRevenue=0,touringMerchRevenue=0;
  for(const c of ownerContracts()){
    const a=s.world[c.artist];if(!a)continue;
    let streams=0;
    for(const x of a.catalog||[]){
      if(x.week<c.started||(c.excludedIds||[]).includes(x.uid))continue;
      streams+=Number(x.streams||0)
    }
    const gross=cents(streams*.5),labelMusic=cents(gross*c.share);
    grossMusic=cents(grossMusic+gross);
    if(c.type==='distribution')distributionRevenue=cents(distributionRevenue+labelMusic);
    else recordingRevenue=cents(recordingRevenue+labelMusic);
    if(c.type==='360'&&(s.week-c.started+1)%4===0){
      const liveGross=cents((a.fans||0)*.02*(.5+(a.skill||0)/100));
      grossOther=cents(grossOther+liveGross);
      touringMerchRevenue=cents(touringMerchRevenue+liveGross*c.share)
    }
  }
  const labelRevenue=cents(recordingRevenue+distributionRevenue+touringMerchRevenue);
  co.last.grossRoster=cents(grossMusic+grossOther);
  co.last.artistShare=cents(Math.max(0,co.last.grossRoster-labelRevenue));
  co.last.recordingRevenue=recordingRevenue;
  co.last.distributionRevenue=distributionRevenue;
  co.last.touringMerchRevenue=touringMerchRevenue;
  co.last.operatingProfit=cents((co.last.income||labelRevenue)-(co.last.payroll||0));
  co.last.v106Financials=true;
  queueSave?.();
  return result
};

const V106_companyPageBase=companyPage;
companyPage=function(){
  const co=s.labelBusiness?.company;
  if(!co)return V106_companyPageBase();
  const f=V106_labelSnapshot(co),contracts=ownerContracts();
  const detail=f.tracked
    ? profileRows([
        ['Roster gross generated',money(f.gross)],
        ['Artist royalty / participation share',money(f.artistShare)],
        ['Master recording revenue',money(f.master)],
        ['Distribution fees / share',money(f.distribution)],
        ['360 touring & merchandise revenue',money(f.other)],
        ['Staff & payroll costs',money(f.payroll)],
        ['Label operating profit',money(f.profit)]
      ])
    : profileRows([
        ['Master / recording revenue',money(co.last?.recording||0)],
        ['360 touring & merchandise revenue',money(co.last?.other||0)],
        ['Staff & payroll costs',money(f.payroll)],
        ['Label operating profit',money(f.profit)]
      ])+`<p class="fine">Gross roster sales and artist-share detail begin tracking with the next weekly settlement; older saves keep their existing totals without inventing historical splits.</p>`;
  return `<section class="v106-label-console card"><header class="v106-label-head"><div><span class="eyebrow">YOUR RECORD COMPANY</span><h2>${esc(co.name)}</h2><p>Run the roster like a company: revenue, artist participation, payroll and operating profit are separated clearly.</p></div><button class="secondary" onclick="V096_openBusinessArea('BusinessHQ')">Business HQ</button></header><div class="v106-label-kpis">${[
      ['Active artists',contracts.length+' / '+labelCapacity()],
      ['Total label revenue',money(f.lifetimeRevenue)],
      ['Last week revenue',money(f.revenue)],
      ['Last week operating profit',money(f.profit)]
    ].map(([k,v])=>`<div><small>${esc(k)}</small><strong>${esc(v)}</strong></div>`).join('')}</div><section class="v106-label-statement"><div class="sectionhead"><div><span class="eyebrow">OWNED LABEL — ROSTER REVENUE</span><h3>${co.last?'Week '+co.last.week+' operating statement':'Waiting for first settlement'}</h3></div></div>${co.last?detail:'<p class="fine">Advance a week after signing artists to generate the first company statement.</p>'}</section><details class="v106-label-staff"><summary>Staff & recurring costs</summary>${Object.entries(labelStaff).map(([k,v])=>`<div class="project-row"><div><strong>${esc(v.name)} · ${money(v.salary)}/week</strong><small>${esc(v.detail)}</small></div><button class="secondary" onclick="toggleLabelStaff('${k}')">${co.staff[k]?'Dismiss':'Hire'}</button></div>`).join('')}</details></section><section class="v106-roster card"><div class="sectionhead"><div><span class="eyebrow">ROSTER</span><h2>Your signed artists</h2></div><span class="pill">${contracts.length}/${labelCapacity()}</span></div>${contracts.map(c=>{const a=s.world[c.artist];return `<div class="project-row v106-roster-row">${personPhoto('artist-'+(a?.directoryKey??a?.id),a?.name||'Artist')}<div><strong>${esc(a?.name||'Artist')}</strong><small>${c.type==='360'?'360':c.type==='distribution'?'Distribution':'Recording'} · Label ${Math.round(c.share*100)}% / Artist ${Math.round((1-c.share)*100)}% · through Week ${c.ends}</small><small>Advance ${money(c.advance)} · Label revenue to date ${money(c.receipts)}</small></div>${c.ends-s.week<=8&&c.weeks+26<=104?`<button class="secondary" onclick="renewRoster(${c.artist})">Renew</button>`:''}</div>`}).join('')||'<p>No artists signed yet.</p>'}<details><summary>Scout & negotiate</summary>${s.world.filter(a=>!contracts.some(c=>c.artist===a.id)).map(a=>`<div class="project-row">${personPhoto('artist-'+(a.directoryKey??a.id),a.name)}<div><strong>${esc(a.name)}</strong><small>${esc(a.genre)} · ${compact(a.fans)} fans · Relationship ${a.relation}</small></div><button class="secondary" ${contracts.length>=labelCapacity()?'disabled':''} onclick="rosterOfferForm(${a.id})">Negotiate</button></div>`).join('')}</details></section>`
};

/* --------------------------------------------------------------------------
   Negotiation Room — keep the authoritative negotiation logic, but present it like
   the approved face-to-face room: portrait, dialogue, leverage bars, then terms.
---------------------------------------------------------------------------- */
V102_renderNegotiation=function(id,terms){
  if(!V102_canRender())return false;
  const a=s.world[id],n=V100_rosterNegotiation(id);if(!a||!n||!s.labelBusiness?.company)return false;
  globalThis.V102_activeNegotiation={artist:id,terms:{...terms}};
  document.querySelector?.('#v102-negotiation-shell')?.remove?.();
  try{$('modal')?.close?.()}catch{}
  document.documentElement.classList.add('negotiation-reading');document.body.classList.add('negotiation-reading');
  const shell=document.createElement('section');shell.id='v102-negotiation-shell';shell.className='negotiation-room-shell v106-negotiation';
  const fields=contractFields(terms).replace(/Company share/g,'Label share');
  shell.innerHTML=`<div class="negotiation-room-bg"></div><div class="negotiation-room"><header class="negotiation-room-header"><div><span class="negotiation-room-kicker">PRIVATE NEGOTIATION · ROUND ${Math.max(1,(n.rounds||0)+1)}</span><h1>${esc(a.name)}</h1><p>${esc(s.labelBusiness.company.name)} · Artist acquisition meeting</p></div><button class="negotiation-room-close" type="button" onclick="V102_closeNegotiation()" aria-label="Leave negotiations"><span>×</span><small>EXIT</small></button></header><main class="negotiation-table"><section class="v106-negotiation-scene">${personPhoto('artist-'+(a.directoryKey??a.id),a.name,true)}<div class="v106-negotiation-caption"><small>ACROSS THE TABLE</small><strong>${esc(a.name)}</strong><span>${esc(a.genre)} · ${tierNames[tier(a.fans)]}</span></div><blockquote>${esc(n.response||'I’m listening. Show me why this is the right deal.')}</blockquote></section><section class="negotiation-room-meters">${negotiationBar('Interest',n.interest,'How strongly the artist currently wants to join your company.')}${negotiationBar('Patience',n.patience,'How much more bargaining they will tolerate before ending talks.')}${negotiationBar('Your leverage',n.leverage,'Your label reputation, staff support and relationship advantage.')}</section><section class="negotiation-offer-sheet"><div class="negotiation-offer-heading"><span class="negotiation-room-kicker">YOUR PROPOSAL</span><h2>Put the deal on the table.</h2><p>Rights, label share and term change the advance the artist expects.</p></div><form class="form" oninput="previewRosterTerms(this,${id})" onsubmit="V102_submitRosterOffer(event,${id})">${fields}<div class="negotiation-preview" id="roster-preview">Requested advance ${money(terms.advance)} · Reputation ${s.reputation}/${rosterTerms(a,terms.type,terms.share,terms.weeks).reputation}</div><div class="negotiation-room-actions"><button class="secondary" type="button" onclick="V102_closeNegotiation()">Walk away</button><button class="primary">Present offer</button></div></form></section></main></div>`;
  document.body.appendChild(shell);const enter=()=>shell.classList.add('negotiation-entered');if(typeof requestAnimationFrame==='function')requestAnimationFrame(enter);else enter();return true
};
