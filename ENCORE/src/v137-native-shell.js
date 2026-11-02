/* ENCORE 0.9.25 — Native Shell 3.0.
   Uses the compact, bold mobile hierarchy approved for ENCORE while keeping every
   visible action wired to an existing ENCORE system. No reference-game placeholder
   destinations are allowed in this layer. */

const V137_MUSIC_HUB='V137MusicHub';
const V137_WEALTH_HUB='V137WealthHub';
const V137_ICONS={
 home:'<path d="M3 11.5 12 4l9 7.5V21h-6v-6H9v6H3z"/>',
 artist:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
 career:'<path d="M3 7h7l2 2h9v11H3z"/><path d="M8 14h8M12 11v6"/>',
 wealth:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5c-.8-.8-2-1.2-3.3-1.2-1.8 0-3.2.9-3.2 2.3 0 3.6 6.5 1.7 6.5 5.3 0 1.5-1.4 2.6-3.4 2.6-1.5 0-2.8-.5-3.7-1.4M12 5.5v13"/>',
 more:'<circle cx="12" cy="12" r="8"/><path d="M12 7v10M7 12h10"/>',
 inbox:'<path d="M4 5h16v14H4zM4 14h5l1.5 2h3L15 14h5"/>',
 people:'<circle cx="9" cy="9" r="3"/><circle cx="16.5" cy="10" r="2.5"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M14 16a5 5 0 0 1 7 4"/>',
 pulse:'<path d="M3 13h4l2-7 4 13 2-6h6"/>',
 chart:'<path d="M4 19V9M10 19V5M16 19v-7M22 19V3"/>',
 business:'<path d="M4 8h16v12H4zM8 8V5h8v3M4 12h16"/>',
 studio:'<path d="M6 4h12v16H6zM9 8h6M9 12h6M9 16h4"/>',
 song:'<path d="M10 18V6l9-2v12M10 9l9-2"/><circle cx="7" cy="18" r="3"/><circle cx="16" cy="16" r="3"/>',
 album:'<rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
 contract:'<path d="M6 3h9l4 4v14H6zM15 3v5h5M9 12h7M9 16h5"/>',
 tour:'<path d="M3 15h18v5H3zM5 10h14l2 5H3z"/><circle cx="7" cy="20" r="2"/><circle cx="17" cy="20" r="2"/>',
 award:'<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M12 13v4M8 21h8M9 17h6"/>',
 platform:'<circle cx="12" cy="12" r="9"/><path d="M7 14c3-2 7-2 10 0M8 10c2.5-1.5 5.5-1.5 8 0M10 17c1.5-.7 2.5-.7 4 0"/>',
 market:'<path d="M4 19h16M6 16l4-5 3 2 5-7"/><path d="M15 6h3v3"/>',
 catalog:'<path d="M4 5h16v14H4zM8 9h8M8 13h8M8 17h5"/>',
 property:'<path d="M3 11 12 4l9 7v10H3zM9 21v-6h6v6"/>',
 collection:'<path d="M5 7h14l2 5-9 9-9-9zM5 7l7 14 7-14M3 12h18"/>',
 finance:'<path d="M5 3h14v18H5zM8 7h8M8 11h8M8 15h3M14 15h2"/>',
 marketing:'<path d="M4 13h4l9 5V6l-9 5H4zM8 14v5"/>',
 commerce:'<path d="M5 8h14l-1 12H6zM9 8a3 3 0 0 1 6 0"/>'
};
function V137_icon(name){return `<svg viewBox="0 0 24 24" aria-hidden="true">${V137_ICONS[name]||V137_ICONS.more}</svg>`}
function V137_navAction(action,label,icon,active=false){return `<button class="${active?'active':''}" aria-label="${esc(label)}" title="${esc(label)}" onclick="${action}">${V137_icon(icon)}<span>${esc(label)}</span></button>`}
function V137_navigationBar(){
 const artistActive=tab==='Career'&&careerTab==='ArtistFile',careerActive=tab==='Career'&&careerTab===V137_MUSIC_HUB,wealthActive=tab==='Career'&&careerTab===V137_WEALTH_HUB;
 return `<div class="v137-bottom-nav">${V137_navAction("go('Home')",'Home','home',tab==='Home')}${V137_navAction('openArtistFile()','Artist File','artist',artistActive)}${V137_navAction('V137_openMusicHub()','Career','career',careerActive)}${V137_navAction('V137_openWealthHub()','Wealth','wealth',wealthActive)}${V137_navAction("go('Menu');restoreMenuPosition()",'More','more',tab==='Menu')}</div>`
}
navigationBar=V137_navigationBar;

function V137_openMusicHub(){careerTab=V137_MUSIC_HUB;go('Career')}
function V137_openWealthHub(){careerTab=V137_WEALTH_HUB;go('Career')}
function V137_openPlatforms(){careerTab='Platforms';go('Career')}
function V137_openCatalog(){careerTab='Releases';go('Career')}
function V137_openFinances(){careerTab='Finances';go('Career')}
function V137_openMarket(){careerTab='Market';go('Career')}
function V137_openCollection(){careerTab='Wealth';go('Career')}
function V137_openProperties(){careerTab='Properties';go('Career')}
function V137_openContracts(focus='Overview'){if(typeof V109_setDealsFocus==='function')V109_dealsFocus=focus;careerTab='Deals';go('Career')}
function V137_openCharts(){industryTab='Charts';go('Industry')}
function V137_openArtists(){industryTab='Artists';go('Industry')}
function V137_openMarketing(){careerTab='Campaigns';go('Career')}
function V137_openTouring(){careerTab='Touring';go('Career')}
function V137_openAchievements(){careerTab='Achievements';go('Career')}
function V137_openCommerce(){careerTab='Commerce';go('Career')}
function V137_openBusiness(){go('BusinessHQ')}
function V137_openLabel(){if(s.labelBusiness?.company)V137_openBusiness();else{careerTab='Labels';go('Career')}}

function V137_fame(){
 const i=tier(s.fans),low=thresholds[i]||0,high=thresholds[i+1]||Math.max(low+1,s.fans||1),pct=i>=thresholds.length-1?100:clamp(((s.fans-low)/(high-low))*100,3,100),w=typeof migrateCareerWorld==='function'?migrateCareerWorld():null;
 return {label:tierNames[i]||'Unknown',pct,state:w?.state||'Building'}
}
function V137_topbar(){
 const fame=V137_fame();
 return `<header class="v137-topbar"><div class="v137-brand"><span class="v137-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span><strong>ENCORE</strong></div><div class="v137-command"><button onclick="statDetail('cash')"><small>CASH</small><b>${money(s.cash)}</b></button><button onclick="statDetail('energy')"><small>ENERGY</small><b>${Math.round(s.energy)}<em>/200</em></b></button><div class="v137-date"><small>${esc(fame.state)}</small><b>${esc(careerDate())}</b></div><button class="v137-end-week" onclick="advance()">END WEEK</button></div></header>`
}
function V137_menuRow(icon,title,detail,action,tone=''){return `<button class="v137-menu-row ${tone}" onclick="${action}">${V137_icon(icon)}<span><strong>${esc(title)}</strong>${detail?`<small>${esc(detail)}</small>`:''}</span><b aria-hidden="true">›</b></button>`}
function V137_actionPill(title,action,tone=''){return `<button class="v137-action-pill ${tone}" onclick="${action}">${esc(title)}</button>`}
function V137_platformData(){
 if(typeof V114_state!=='function')return [];
 try{const p=V114_state();return ['vybe','muse','amp'].map(id=>{const svc=p.services?.[id]||{},cfg=V114_AUDIO_PLATFORMS?.[id]||{};return {id,name:cfg.name||id.toUpperCase(),listeners:Number(svc.monthlyListeners)||0,followers:Number(svc.followers)||0}})}catch{return []}
}
function V137_listenerSeries(){
 if(typeof V114_state!=='function')return [];
 try{const p=V114_state(),weeks=new Map();for(const id of (typeof V114_PLATFORM_IDS!=='undefined'?V114_PLATFORM_IDS:Object.keys(p.services||{}))){for(const row of (p.services?.[id]?.weekly||[]).slice(-12)){const w=Number(row.week)||0;if(!w)continue;weeks.set(w,(weeks.get(w)||0)+(Number(row.listeners)||0))}}return [...weeks.entries()].sort((a,b)=>a[0]-b[0]).slice(-10).map(([week,value])=>({week,value}))}catch{return []}
}
function V137_sparkline(rows){
 const values=rows.map(x=>Number(x.value)||0);if(values.length<2)return `<div class="v137-chart-empty">Advance weeks to build your listener history.</div>`;
 const w=720,h=210,pad=18,min=Math.min(...values),max=Math.max(...values),span=Math.max(1,max-min),pts=values.map((v,i)=>[pad+i*(w-pad*2)/Math.max(1,values.length-1),h-pad-(v-min)/span*(h-pad*2)]),path=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
 return `<svg class="v137-chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Recent listener trend"><path class="grid" d="M${pad} ${h/2}H${w-pad}"/><path class="line" d="${path}"/>${pts.map(p=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4"/>`).join('')}</svg>`
}
function V137_home(){
 const fame=V137_fame(),platforms=V137_platformData(),series=V137_listenerSeries(),current=platforms.reduce((n,x)=>n+x.listeners,0),last=series.at(-1)?.value||current,prior=series.at(-2)?.value||last,delta=last-prior,unread=s.achievements?.briefings?.filter(x=>!x.read&&!String(x.id||'').startsWith('cert:')).length||0,company=s.labelBusiness?.company?.name;
 return `<article class="v137-shell v137-home">${V137_topbar()}<section class="v137-fame"><div><strong>FAME | ${esc(fame.label.toUpperCase())}</strong><small>${esc(fame.state)}</small></div><i><b style="width:${fame.pct.toFixed(1)}%"></b></i></section><section class="v137-platform-strip">${platforms.length?platforms.map((x,i)=>`<button class="p${i+1}" onclick="V137_openPlatforms()"><span>${esc(x.name.slice(0,1))}</span><strong>${esc(x.name)}</strong><small>${compact(x.listeners)} listeners</small></button>`).join(''):`<button class="p1" onclick="V137_openPlatforms()"><span>V</span><strong>PLATFORMS</strong><small>Open listener desk</small></button>`}</section><section class="v137-listener-panel"><div class="v137-stat-heading"><strong class="${delta<0?'down':''}">${delta>=0?'+':''}${compact(delta)}</strong><h1>Listeners</h1></div><span>RECENT WEEKS · ${compact(current)} CURRENT MONTHLY LISTENERS</span>${V137_sparkline(series)}</section><section class="v137-menu-stack">${V137_menuRow('inbox',`Inbox${unread?' ('+unread+')':''}`,unread?'Career decisions waiting':'Career desk',"openDestination('Inbox')")}${V137_menuRow('people','Relationships & Network','Artists, collaborators and industry ties','V137_openArtists()')}${V137_menuRow('pulse','PULSE','Posts, replies and fan conversation',"openDestination('Social')")}${V137_menuRow('chart','Trends & Charts','Industry movement and chart competition','V137_openCharts()')}${V137_menuRow('business',company||'Business HQ',company?'Your company and executive desk':'Labels, ownership and business','V137_openLabel()','accent')}</section></article>`
}
home=V137_home;

function V137_topSongs(){return [...(s.songs||[])].filter(x=>x.released).sort((a,b)=>(Number(b.total)||0)-(Number(a.total)||0)).slice(0,3)}
function V137_albumValue(a){try{return typeof albumStreams==='function'?Number(albumStreams(a,true))||0:Number(a.streams||a.total)||0}catch{return Number(a.streams||a.total)||0}}
function V137_topAlbums(){return [...(s.albums||[])].map(a=>({a,value:V137_albumValue(a)})).sort((x,y)=>y.value-x.value).slice(0,3)}
function V137_rankList(rows,empty){return rows.length?`<ol>${rows.map((x,i)=>`<li><b>${i+1}</b><strong>${esc(x.title)}</strong><span>${compact(x.value)}</span></li>`).join('')}</ol>`:`<p class="v137-empty">${esc(empty)}</p>`}
function V137_musicHub(){
 const songs=V137_topSongs(),albums=V137_topAlbums(),total=Math.max(Number(s.total)||0,(s.songs||[]).reduce((n,x)=>n+(Number(x.total)||0),0)),songRows=songs.map(x=>({title:x.title,value:Number(x.total)||0})),albumRows=albums.map(x=>({title:x.a.title,value:x.value}));
 return `<article class="v137-shell v137-career">${V137_topbar()}<section class="v137-big-number"><strong>${compact(total)}</strong><h1>TOTAL STREAMS</h1><small>Your released catalog · lifetime</small></section><section class="v137-rank-grid"><div><span>TOP SONGS · ALL TIME</span>${V137_rankList(songRows,'Release your first song to start the list.')}</div><div><span>MOST POPULAR ALBUMS</span>${V137_rankList(albumRows,'Your album eras will appear here.')}</div></section><section class="v137-context-actions">${V137_actionPill('NEW PROJECT',"go('Create')",'orange')}${V137_actionPill('CHARTS','V137_openCharts()','blue')}${V137_actionPill('PLATFORMS','V137_openPlatforms()','green')}</section><section class="v137-menu-stack">${V137_menuRow('studio','Studio','Write, record, produce and finish music',"go('Create')")}${V137_menuRow('song','Songs & Catalog','Released music and release detail','V137_openCatalog()')}${V137_menuRow('album','Albums & Releases','Projects, eras and catalog performance','V137_openCatalog()')}${V137_menuRow('people','Artists & Collaborations','Discover artists and build relationships','V137_openArtists()')}${V137_menuRow('contract','Contracts & Rights','Offers, agreements, ownership and catalog leverage',"V137_openContracts('Overview')")}${V137_menuRow('marketing','Marketing','Campaigns, rollout strategy and promotion','V137_openMarketing()')}${V137_menuRow('tour','Touring','Routes, venues, demand and live economics','V137_openTouring()')}${V137_menuRow('award','Awards & Achievements','Career milestones, awards and certifications','V137_openAchievements()')}${V137_menuRow('platform','Music Platforms','VYBE, MUSE, AMP, WORLDWAVE and FRAME','V137_openPlatforms()')}${V137_menuRow('commerce','Merch & Media','Commerce, merchandise and media opportunities','V137_openCommerce()')}</section></article>`
}
function V137_estimatedWealth(){
 if(typeof migrateEmpire==='function')migrateEmpire();const assets=(s.empire?.assets||[]).reduce((n,a)=>n+(Number(a.value)||0),0),catalog=typeof catalogValue==='function'?Number(catalogValue())||0:0,owned=typeof catalogOwnedValue==='function'?Number(catalogOwnedValue())||0:0;return {assets,catalog,owned,total:(Number(s.cash)||0)+assets+catalog+owned}
}
function V137_wealthHub(){
 const w=V137_estimatedWealth(),f=typeof ENCORE_FINANCE!=='undefined'?ENCORE_FINANCE.ensureFinance(s):(s.finance||{}),yearRevenue=Number(f.revenue)||0,lastWeek=Number(f.last?.revenue)||0,taxReserve=Number(f.reserve)||0,physical=(s.empire?.assets||[]).filter(a=>!['Stocks','Bonds','Crypto'].includes(a.kind)).length,investments=(s.empire?.assets||[]).filter(a=>['Stocks','Bonds','Crypto'].includes(a.kind)).length;
 return `<article class="v137-shell v137-wealth">${V137_topbar()}<section class="v137-big-number wealth"><strong>${money(w.total)}</strong><h1>NET WORTH</h1><small>Cash + personal assets + music catalog + owned catalog interests</small></section><section class="v137-wealth-block"><div><span>CATALOG</span><p>Your music catalog is currently estimated at <strong>${money(w.catalog)}</strong> and is included in this screen's estimated net worth.</p></div>${V137_actionPill('VIEW CATALOG','V137_openCatalog()','blue')}</section><section class="v137-wealth-block earnings"><div><span>YEAR ${Number(f.year)||1} EARNINGS</span><h2>${money(yearRevenue)}</h2><p>${money(lastWeek)} last week · ${money(taxReserve)} currently reserved for taxes.</p></div>${V137_actionPill('VIEW FINANCES','V137_openFinances()','coral')}</section><section class="v137-context-actions wealth-actions">${V137_actionPill('CATALOG RIGHTS',"V137_openContracts('Catalog')",'purple')}${V137_actionPill('BUSINESS HQ','V137_openBusiness()','gold')}</section><section class="v137-menu-stack">${V137_menuRow('finance','Balance Sheet & Taxes','Income, expenses, reserve and tax planning','V137_openFinances()')}${V137_menuRow('market','Investments',`${investments} market holding${investments===1?'':'s'} · simulated exchange`,'V137_openMarket()')}${V137_menuRow('catalog','Catalog & Rights','Valuation, agreements, rights and buyout leverage',"V137_openContracts('Catalog')")}${V137_menuRow('collection','Collection',`${physical} physical asset${physical===1?'':'s'} · cars, jewelry, art and more`,'V137_openCollection()')}${V137_menuRow('property','Property','Buy, lease, renovate and manage real estate','V137_openProperties()')}${V137_menuRow('business','Business HQ',s.labelBusiness?.company?`${s.labelBusiness.company.name} · executive office`:'Deals, labels, ownership and company building','V137_openBusiness()','accent')}</section></article>`
}

const V137_careerBase=career;
career=function(){if(careerTab===V137_MUSIC_HUB)return V137_musicHub();if(careerTab===V137_WEALTH_HUB)return V137_wealthHub();return V137_careerBase()};
