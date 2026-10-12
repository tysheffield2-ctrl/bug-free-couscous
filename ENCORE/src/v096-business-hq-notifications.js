/* ENCORE 0.9.5 — chart presentation, Business HQ consolidation and priority opportunities. */
const V096_SCHEMA=1;
const V096_BUSINESS_AREAS=[
  {id:'Offers',group:'Deals & revenue',name:'Offers center',desc:'Label, media, endorsement and partnership offers'},
  {id:'Deals',group:'Deals & revenue',name:'Contracts & rights',desc:'Contracts, ownership, buyouts and catalog rights'},
  {id:'Labels',group:'Company',name:'Label',desc:'Your label, roster, demos and artist development'},
  {id:'League',group:'Company',name:'Label league',desc:'See how your company ranks across the industry'},
  {id:'Agency',group:'Company',name:'Representation',desc:'Agents, leverage, commission and negotiation'},
  {id:'Team',group:'Company',name:'Executive team',desc:'Managers, specialists and operating support'},
  {id:'Creative',group:'Creative & product',name:'Creative network',desc:'Features, production, writing requests and song opportunities'},
  {id:'Commerce',group:'Creative & product',name:'Merchandise',desc:'Products, inventory and commercial launches'},
  {id:'Sports',group:'Ownership',name:'Sports ownership',desc:'Franchise stakes, ownership performance and seasons'},
  {id:'CatalogMarket',group:'Ownership',name:'Catalog market',desc:'Acquire, hold and sell music catalog interests'}
];
const V096_BUSINESS_IDS=new Set(V096_BUSINESS_AREAS.map(x=>x.id));

function V096_priorityRaw(){
  const out=[];
  for(const o of s.v081?.creative?.offers||[]){
    if(o.status!=='open')continue;
    const a=s.world?.[o.artist],artist=a?.name||o.name||'An artist';
    const meta={
      featureInvite:['Feature request',`${artist} wants you on a record.`,5],
      produce:['Production request',`${artist} wants you to produce a record for ${money(o.fee||0)}.`,4],
      ghostwrite:['Writing request',`${artist} wants you to write for ${money(o.fee||0)}.`,3],
      songOffer:['Song opportunity',`${artist} has a finished song opportunity for you.`,2]
    }[o.type]||['Creative opportunity',`${artist} wants to work with you.`,2];
    out.push({key:`creative:${o.id}`,kind:'creative',id:o.id,category:meta[0],title:meta[1],detail:`Estimated creative quality ${Math.round(o.quality||0)}/100.`,priority:meta[2],week:o.createdWeek??s.week,route:'Creative'});
  }
  for(const o of s.touring?.offers||[]){
    if(o.done||o.expires<s.week)continue;
    const a=s.world?.[o.artist],city=careerWorldMarket?.(o.city)?.city||o.city||'a tour stop';
    out.push({key:`tour:${o.id}`,kind:'tour',id:o.id,category:'Tour invitation',title:`${a?.name||'An artist'} wants you on tour.`,detail:`Opening slot in ${city} · ${money(o.fee||0)} guarantee · decision by Week ${o.expires}.`,priority:5,week:o.createdWeek??s.week,route:'Touring'});
  }
  for(const o of s.v080?.commercial?.offers||[]){
    if(o.status!=='open'||o.expires<s.week)continue;
    out.push({key:`commercial:${o.id}`,kind:'commercial',id:o.id,category:V080_offerCategoryName?.(o.category)||'Business offer',title:o.name||'New commercial offer',detail:`${money(o.totalValue||0)} headline value.`,priority:3,week:o.createdWeek??s.week,route:'Offers'});
  }
  for(const o of s.expansion?.opportunities||[]){
    if(o.done||o.expires<s.week)continue;
    out.push({key:`career:${o.id}`,kind:'career',id:o.id,category:o.type||'Career opportunity',title:o.name?`${o.name} reached out.`:'A new career opportunity arrived.',detail:`${o.fee?money(o.fee)+' fee · ':''}Decision due after Week ${o.expires}.`,priority:2,week:o.week??s.week,route:'Opportunities'});
  }
  return out.sort((a,b)=>b.priority-a.priority||b.week-a.week||a.key.localeCompare(b.key));
}

function V096_consolidateDestinations(){
  if(!Array.isArray(V080_destinations))return;
  for(let i=V080_destinations.length-1;i>=0;i--)if(V096_BUSINESS_IDS.has(V080_destinations[i][2]))V080_destinations.splice(i,1);
  let hq=V080_destinations.find(d=>d[2]==='BusinessHQ');
  if(!hq){hq=['Business HQ','Business','BusinessHQ','All deals, companies, creative work, merchandise and ownership',4];V080_destinations.splice(Math.min(11,V080_destinations.length),0,hq)}
  hq[0]='Business HQ';hq[1]='Business';hq[3]='All deals, companies, creative work, merchandise and ownership';hq[4]=4;
}

function migrateV096(){
  migrateV092?.();migrateV081?.();migrateTouring?.();
  if(!s.v096){
    s.v096={version:V096_SCHEMA,seenPriority:V096_priorityRaw().map(x=>x.key).slice(-200)};
  }
  s.v096.version=V096_SCHEMA;
  if(!Array.isArray(s.v096.seenPriority))s.v096.seenPriority=[];
  s.v096.seenPriority=[...new Set(s.v096.seenPriority.map(String))].slice(-300);
  V096_consolidateDestinations();
}

const V096_addCreativeOffer095=V081_addCreativeOffer;
V081_addCreativeOffer=function(type,a){
  const before=s.v081?.creative?.nextId;
  const result=V096_addCreativeOffer095(type,a);
  const o=s.v081?.creative?.offers?.find(x=>x.id===before);
  if(o&&o.createdWeek===undefined)o.createdWeek=s.week;
  return result;
};

const V096_generateOpeningSlots095=generateOpeningSlots;
generateOpeningSlots=function(){
  const before=new Set((s.touring?.offers||[]).map(x=>x.id));
  const result=V096_generateOpeningSlots095();
  for(const o of s.touring?.offers||[])if(!before.has(o.id)&&o.createdWeek===undefined)o.createdWeek=s.week;
  return result;
};

function V096_preparePriority(){
  if(!saveReady||!s.started||monthlyAdvancing)return;
  migrateV096();
  V081_generateCreativeOffers?.();
  generateOpeningSlots?.();
}
function V096_markSeen(keys){
  migrateV096();
  for(const key of keys)if(!s.v096.seenPriority.includes(key))s.v096.seenPriority.push(key);
  s.v096.seenPriority=s.v096.seenPriority.slice(-300);queueSave?.();
}
function V096_unseenPriority(){
  migrateV096();const seen=new Set(s.v096.seenPriority);return V096_priorityRaw().filter(x=>!seen.has(x.key));
}
function V096_openPriority(key){
  const item=V096_priorityRaw().find(x=>x.key===key);if(!item)return;
  V096_markSeen([key]);if($('modal')?.open)$('modal').close();
  if(item.kind==='creative'){V081_creativeTab='Opportunities';V096_openBusinessArea('Creative');return}
  if(item.kind==='tour'){careerTab='Touring';go('Career');return}
  if(item.kind==='commercial'){V096_openBusinessArea('Offers');return}
  if(item.kind==='career'){careerTab='Opportunities';go('Career');return}
}
function V096_priorityPopup(){
  if(!saveReady||!s.started||titleVisible||monthlyAdvancing||$('modal')?.open)return;
  V096_preparePriority();const items=V096_unseenPriority().slice(0,6);if(!items.length)return;
  V096_markSeen(items.map(x=>x.key));
  const cards=items.map(x=>`<button class="priority-request" onclick="V096_openPriority('${x.key}')"><span class="priority-icon" aria-hidden="true">${x.kind==='tour'?'♬':x.kind==='creative'?'✦':x.kind==='commercial'?'$':'!'}</span><span><small>${esc(x.category)} · NEW</small><strong>${esc(x.title)}</strong><em>${esc(x.detail)}</em></span><b>Review →</b></button>`).join('');
  modal(`<article class="priority-opportunity"><div class="priority-opportunity-head"><span class="eyebrow">IMPORTANT · ACTION AVAILABLE</span><h2>${items.length===1?'New opportunity':'New opportunities'}</h2><p>These requests affect your career. Nothing is accepted automatically, and anything you leave for later stays in its normal screen until it expires.</p></div><div class="priority-request-stack">${cards}</div><div class="priority-opportunity-actions"><button class="secondary" onclick="$('modal').close()">Later</button><button class="primary" onclick="$('modal').close();V096_openBusinessArea('BusinessHQ')">Open Business HQ</button></div></article>`,'priority-opportunity-dialog');
}

function V096_businessAreaBadge(id){
  if(id==='Offers')return (s.labelBusiness?.offers||[]).filter(o=>!o.used&&o.expires>=s.week).length+(s.v080?.commercial?.offers||[]).filter(o=>o.status==='open'&&o.expires>=s.week).length;
  if(id==='Deals')return (s.v080?.commercial?.contracts||[]).filter(x=>x.active).length+(s.expansion?.contract?1:0);
  if(id==='Creative')return (s.v081?.creative?.offers||[]).filter(o=>o.status==='open').length;
  if(id==='Commerce')return (s.empire?.merch||[]).length;
  if(id==='Sports')return (s.v081?.sports?.holdings||[]).length;
  if(id==='CatalogMarket')return (s.v080?.catalog?.holdings||[]).length;
  return 0;
}
function V096_openBusinessArea(id){
  migrateV096();
  if(id!=='BusinessHQ'&&!V096_BUSINESS_IDS.has(id))return;
  careerTab=id;go('Career');
}
function V096_businessAreaGrid(){
  const groups=[...new Set(V096_BUSINESS_AREAS.map(x=>x.group))];
  return groups.map(group=>`<div class="business-area-group"><div class="business-area-label">${esc(group)}</div><div class="business-area-grid">${V096_BUSINESS_AREAS.filter(x=>x.group===group).map(x=>{const badge=V096_businessAreaBadge(x.id);return `<button class="business-area-card" onclick="V096_openBusinessArea('${x.id}')"><span><small>${esc(group)}</small><strong>${esc(x.name)}</strong><em>${esc(x.desc)}</em></span><b>${badge?badge+' active':'Open'} →</b></button>`}).join('')}</div></div>`).join('');
}
function V096_businessPriorityDesk(){
  const items=V096_priorityRaw().filter(x=>['creative','commercial'].includes(x.kind)).slice(0,4);
  return `<div class="business-priority-desk"><div class="sectionhead"><div><span class="eyebrow">PRIORITY DESK</span><h3>Requests that need a decision</h3></div><span class="pill">${items.length} visible</span></div>${items.length?items.map(x=>`<button onclick="V096_openPriority('${x.key}')"><span><small>${esc(x.category)}</small><strong>${esc(x.title)}</strong></span><b>Review →</b></button>`).join(''):'<p class="fine">No feature, production or commercial request needs action right now.</p>'}</div>`;
}
const V096_businessPage092=V092_businessPage;
V092_businessPage=function(){
  migrateV096();const base=V096_businessPage092(),co=s.labelBusiness?.company,contracts=(s.v080?.commercial?.contracts||[]).filter(x=>x.active).length,sportsTeams=new Set((s.v081?.sports?.holdings||[]).map(h=>h.team)).size,creative=V096_businessAreaBadge('Creative');
  const command=`<section class="business-command v096-business-command"><div class="business-command-copy"><span class="eyebrow">EXECUTIVE COMMAND CENTER</span><h2>${co?esc(co.name):esc(s.name)+' Enterprises'}</h2><p>Business HQ is the single front door for every business system. Pick a department below, make the decision, then return here.</p></div>${metricRail([['Business assets',money(V092_businessValue())],['Active commercial deals',String(contracts)],['Creative requests',String(creative)],['Sports franchises',String(sportsTeams)]])}${V096_businessPriorityDesk()}<div class="business-directory">${V096_businessAreaGrid()}</div></section>`;
  const start=base.indexOf('<section class="business-command">');if(start<0)return base;
  const end=base.indexOf('</section>',start);if(end<0)return base;
  return base.slice(0,start)+command+base.slice(end+10);
};
function V096_businessSubnav(id){
  const current=V096_BUSINESS_AREAS.find(x=>x.id===id);if(!current)return '';
  return `<section class="business-inside"><button class="business-home-button" onclick="V096_openBusinessArea('BusinessHQ')">← Business HQ</button><div><small>BUSINESS HQ / ${esc(current.group).toUpperCase()}</small><strong>${esc(current.name)}</strong></div><div class="business-inside-links">${V096_BUSINESS_AREAS.map(x=>`<button class="${x.id===id?'selected':''}" onclick="V096_openBusinessArea('${x.id}')">${esc(x.name)}${V096_businessAreaBadge(x.id)?` <b>${V096_businessAreaBadge(x.id)}</b>`:''}</button>`).join('')}</div></section>`;
}
const V096_career095=career;
career=function(){
  migrateV096();const html=V096_career095();
  return tab==='Career'&&V096_BUSINESS_IDS.has(careerTab)?V096_businessSubnav(careerTab)+html:html;
};
const V096_screenFamily095=screenFamily;
screenFamily=function(){if(tab==='Career'&&(careerTab==='BusinessHQ'||V096_BUSINESS_IDS.has(careerTab)))return 'business';return V096_screenFamily095()};

function V096_chartSpark(kind,row){
  const rec=chartRecord(kind,row.key),hist=(rec?.history||[]).slice(-12).filter(x=>Number.isFinite(x.rank));
  if(hist.length<2)return `<div class="chart-spark-empty">Chart path builds week by week</div>`;
  const cap=kind==='songs'?100:50,pts=hist.map((p,i)=>`${(i/Math.max(1,hist.length-1)*100).toFixed(1)},${(8+(Math.max(1,Math.min(cap,p.rank))-1)/(cap-1)*34).toFixed(1)}`).join(' ');
  return `<svg class="chart-spark" viewBox="0 0 100 50" preserveAspectRatio="none" role="img" aria-label="Recent chart path"><path d="M0 42H100M0 25H100M0 8H100"/><polyline points="${pts}" fill="none" vector-effect="non-scaling-stroke"/></svg>`;
}
function V096_chartMovementClass(x){return x.movement==='UP'?'up':x.movement==='DOWN'?'down':['NEW','RE','ENTRY'].includes(x.movement)?'new':'hold'}
function V096_chartLeader(kind,x,ready){
  const metric=kind==='songs'?x.streams:x.units;
  return `<article class="chart-podium-card rank-${x.rank||0} ${x.you?'chart-you':''}"><div class="chart-podium-rank"><span>#</span>${x.rank}</div><span class="movement movement-${x.movement||'BASE'}">${ready?movementLabel(x):'—'}</span><button class="release-link" onclick="chartDetails('${kind}','${x.key}')">${esc(x.title)}</button><p>${esc(x.artist)}${x.you?' · YOU':''}</p><strong>${compact(metric)}</strong><small>${kind==='songs'?'weekly streams':'weekly album units'}</small>${V096_chartSpark(kind,x)}</article>`;
}
function V096_chartRow(kind,x,list,ready,topMetric){
  const metric=kind==='songs'?x.streams:x.units,pct=Math.max(2,Math.min(100,Math.round(metric/Math.max(1,topMetric)*100))),maxRank=kind==='songs'?100:50,position=Math.max(3,100-Math.round(((x.rank||maxRank)-1)/Math.max(1,maxRank-1)*97));
  return `<article class="chart-entry v096-chart-entry ${x.you?'chart-you':''}"><div class="chart-place"><span class="rank-prefix">#</span>${x.rank??list.indexOf(x)+1}<span class="movement movement-${x.movement||'BASE'} ${V096_chartMovementClass(x)}">${ready?movementLabel(x):'—'}</span></div><div class="chart-release"><div class="chart-title-row"><button class="release-link" onclick="chartDetails('${kind}','${x.key}')">${esc(x.title)}</button>${x.you?'<span class="you-chip">YOU</span>':''}</div><p>${esc(x.artist)}</p>${x.you&&certificationUnits(chartOwner(kind,x.id),kind)>=500000?certBadge(chartOwner(kind,x.id),kind):''}<div class="chart-facts"><span>Last <b>${x.last?'#'+x.last:'—'}</b></span><span>Peak <b>${x.peak?'#'+x.peak:'—'}</b></span><span>Weeks <b>${x.weeks??'—'}${x.partial?'+':''}</b></span><span>Debut <b>${x.debutRank?'#'+x.debutRank:'—'}</b></span></div><div class="chart-rank-meter" title="Relative chart position"><i style="width:${position}%"></i></div></div><div class="chart-volume"><strong>${compact(metric)}</strong><span>${kind==='songs'?'streams':'units'}</span><div class="chart-volume-meter"><i style="width:${pct}%"></i></div>${V096_chartSpark(kind,x)}</div></article>`;
}
chartHub=function(){
  const kind=chartKind==='Albums'?'albums':'songs',list=kind==='songs'?chart():albumChart(),book=s.chartBook,board=book?.[kind],ready=book?.issuedWeek!==null&&book?.issuedWeek!==undefined,visible=chartMine?list.filter(x=>x.you):list,dropouts=ready?board.previous.filter(x=>!board.current.some(y=>y.key===x.key)):[],leaders=visible.slice(0,3),topMetric=Math.max(1,...list.map(x=>kind==='songs'?x.streams:x.units)),climber=list.filter(x=>x.movement==='UP'&&x.last).sort((a,b)=>(b.last-b.rank)-(a.last-a.rank))[0],yourBest=list.filter(x=>x.you).sort((a,b)=>a.rank-b.rank)[0];
  return head('The weekly issue',kind==='songs'?'Global Top 100.':'Global Albums 50.',`<span class="pill">${ready?'Week '+book.issuedWeek:'Preview'}</span>`)+`<section class="chart-hero"><div class="chart-hero-copy"><span class="eyebrow">${kind==='songs'?'GLOBAL SONGS':'GLOBAL ALBUMS'} · LIVE BOARD</span><h2>${chartMine?'Your chart story':'The race for #1'}</h2><p>${ready?'Movement, peaks and weekly volume update every completed chart issue.':'Advance a week to publish the first official issue.'}</p></div><div class="chart-summary"><div><span>Entries</span><strong>${list.length}</strong></div><div><span>New entries</span><strong>${list.filter(x=>x.movement==='NEW').length}</strong></div><div><span>Your entries</span><strong>${list.filter(x=>x.you).length}</strong></div><div><span>Your best</span><strong>${yourBest?'#'+yourBest.rank:'—'}</strong></div><div><span>Biggest climb</span><strong>${climber?'+'+(climber.last-climber.rank):'—'}</strong></div></div></section><div class="chart-toolbar"><div class="chips">${['Songs','Albums'].map(t=>`<button class="${chartKind===t?'selected':''}" onclick="chartKind='${t}';render()">${t}</button>`).join('')}</div><button class="secondary" aria-pressed="${chartMine}" onclick="chartMine=!chartMine;render()">${chartMine?'Show all artists':'My releases'}</button></div>${leaders.length?`<section class="chart-podium"><div class="sectionhead"><div><span class="eyebrow">${chartMine?'YOUR HIGHEST POSITIONS':'TOP OF THE CHART'}</span><h2>${leaders.length===1?'Highest entry':'Top '+leaders.length}</h2></div><span class="pill">${kind==='songs'?'Streams':'Units'}</span></div><div class="chart-podium-grid">${leaders.map(x=>V096_chartLeader(kind,x,ready)).join('')}</div></section>`:''}<section class="chart-board"><div class="chart-board-head"><div><span class="eyebrow">FULL RANKING</span><h2>${chartMine?'Your active entries':kind==='songs'?'Global Top 100':'Global Albums 50'}</h2></div><div><span>Entry cutoff</span><strong>${compact(list.at(-1)?.[kind==='songs'?'streams':'units']??(kind==='songs'?CHART_FLOOR:1000))}</strong></div></div><p class="fine">${kind==='songs'?'Weekly streams · Minimum 250,000 plays, plus a Top 100 rank.':'Weekly album units · 1,500 track streams = 1 unit. Minimum 1,000 units, plus a Top 50 rank.'} Bars visualize relative weekly volume and chart position; they do not change the ranking math.</p><div class="chart-list">${visible.map(x=>V096_chartRow(kind,x,list,ready,topMetric)).join('')||'<section class="card empty"><h2>No chart entries yet.</h2><p>Your releases need enough weekly activity to beat the competition.</p></section>'}</div></section>${dropouts.length?`<details class="card chart-dropouts"><summary>Dropped out this week · ${dropouts.length}</summary>${dropouts.filter(x=>!chartMine||x.you).map(x=>`<div class="row"><button class="release-link" onclick="chartDetails('${kind}','${x.key}')">${esc(x.title)} · ${esc(x.artist)}</button><span class="fine">Last #${x.rank}</span></div>`).join('')||'<p>No releases of yours dropped out.</p>'}</details>`:''}<p class="fine">NEW = first chart entry. RE-ENTRY = returns after dropping out. ENTRY = first observed during tracking. + = partial historical week count. Prior issue, debut and movement remain unavailable when older saves never recorded them.</p>`;
};

const V096_render095=render;
render=function(){
  if(saveReady&&!monthlyAdvancing){migrateV096();V096_preparePriority()}
  const result=V096_render095();
  if(saveReady&&!monthlyAdvancing)requestAnimationFrame(()=>V096_priorityPopup());
  return result;
};

const V096_validate095=validatePresentationState;
validatePresentationState=function(){
  V096_validate095();if(!s.v096)return;
  if(s.v096.version!==V096_SCHEMA||!Array.isArray(s.v096.seenPriority)||s.v096.seenPriority.length>300||s.v096.seenPriority.some(x=>typeof x!=='string'))throw Error('Invalid 0.9.5 notification state');
};
