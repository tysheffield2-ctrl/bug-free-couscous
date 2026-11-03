/* ENCORE Native Shell 3.2.1 compatibility + simplification contracts.
   Keep established Home/onboarding/accessibility hooks while removing redundant
   navigation and deep-linking Home platform buttons to their real profiles. */
const V137_openPlatformsBase=V137_openPlatforms;
V137_openPlatforms=function(id=''){
 const key=String(id||'').toLowerCase();
 if(['vybe','muse','amp','worldwave','frame'].includes(key)){
  if(typeof V128_openPlatform==='function'){V128_openPlatform(key);return}
  if(typeof V114_setTab==='function'){V114_setTab(key);careerTab='Platforms';tab='Career';render();window.scrollTo?.({top:0,behavior:'instant'});return}
 }
 return V137_openPlatformsBase()
};

const V137_nativeHomeBase=V137_home;
V137_home=function(){
 let html=V137_nativeHomeBase();
 ['vybe','muse','amp'].forEach((id,i)=>{html=html.replace(`class="p${i+1}" onclick="V137_openPlatforms()"`,`class="p${i+1}" onclick="V137_openPlatforms('${id}')"`)});
 return html
};
home=function(){
 let html=V137_home();
 html=html.replace('<article class="v137-shell v137-home">','<article class="v137-shell v137-home v103-home home-dashboard"><span class="encore-wordmark v137-compat-marker" aria-hidden="true"></span>');
 const desk='<div class="v137-desk-label v103-desk">CAREER DESK</div>';
 if(!html.includes('CAREER DESK'))html=html.replace('<section class="v137-menu-stack">',desk+'<section class="v137-menu-stack">');
 return html
};

const V137_nativeNavigationBase=navigationBar;
navigationBar=function(){
 let html=V137_nativeNavigationBase();
 html=html.replace(/<button class="([^"]*)" aria-label="Home"/,(_,classes)=>`<button class="${classes} nav-home"${tab==='Home'?' aria-current="page"':''} aria-label="Home"`);
 return html
};

function V137_moreHub(){
 return `<article class="v137-shell v137-more">${V137_topbar()}<section class="v137-more-intro"><span>MORE</span><h1>Career & utilities</h1><p>Secondary systems without another directory wall.</p></section><section class="v137-menu-stack">${V137_menuRow('people','Representation','Managers, agents, attorneys and your professional team',"encoreOpenIconDestination('Agency')")}${V137_menuRow('contract','Legal Affairs','Disputes, counsel, exposure and legal matters',"encoreOpenIconDestination('LegalAffairs')")}${V137_menuRow('business','Label HQ','Operate and grow your owned label',"encoreOpenIconDestination('Labels')")}${V137_menuRow('finance','Finance','Income, expenses, taxes and detailed accounting',"encoreOpenIconDestination('Finances')")}${V137_menuRow('more','Settings','Game, accessibility and career preferences',"encoreOpenIconDestination('Settings')")}</section></article>`
}
/* `go('Menu')` renders menuPage(), not menu(). Keep both aliases so any legacy
   caller and the live route resolve to the same simplified More hub. */
menuPage=V137_moreHub;
menu=V137_moreHub;

const V137_nativeWealthHubBase=V137_wealthHub;
V137_wealthHub=function(){return V137_nativeWealthHubBase().replace(/<section class="v137-context-actions wealth-actions">[\s\S]*?<\/section>/,'')};

if(typeof gameplayTour!=='undefined'){
 const closeWeek=gameplayTour.find(x=>x.page==='Home'&&x.target==='.weekbar');
 if(closeWeek)closeWeek.target='.v137-end-week';
}

/* Platform Experiences 3.0 — MUSE + VYBE.
   The simulation remains authoritative in V114/V134; this is a product-specific
   presentation layer over those real service states. */
let V139_museView='artist',V139_museRange=1,V139_vybeView='music',V139_recapSlide=0;
function V139_num(v){const n=Number(v);return Number.isFinite(n)?n:0}
function V139_hue(text){let n=0;for(const ch of String(text||'ENCORE'))n=(n*31+ch.charCodeAt(0))%360;return n}
function V139_albumTracks(album){const ids=Array.isArray(album?.tracks)?album.tracks:Array.isArray(album?.songs)?album.songs:Array.isArray(album?.songIds)?album.songIds:[];return ids.map(x=>typeof x==='object'?x.id:x).map(id=>(s.songs||[]).find(t=>Number(t.id)===Number(id))).filter(Boolean)}
function V139_albumServiceLifetime(album,id){return V139_albumTracks(album).reduce((n,t)=>n+V139_num(V114_trackRow(s,t).services[id]?.lifetime),0)}
function V139_albumServiceWeek(album,id){return V139_albumTracks(album).reduce((n,t)=>n+V139_num(V114_trackRow(s,t).services[id]?.thisWeek),0)}
function V139_cover(title,kind='album'){const h=V139_hue(title);return `<span class="v139-cover ${kind}" style="--cover-hue:${h}" aria-hidden="true"><i></i><b>${esc(String(title||'E').slice(0,1).toUpperCase())}</b></span>`}
function V139_platformBack(){return `<button class="v139-back" onclick="V114_setTab('Overview')" aria-label="Back to all music platforms">⌄</button>`}
function V139_songObject(row){return (s.songs||[]).find(x=>Number(x.id)===Number(row.songId))||null}
function V139_latestAlbum(){return [...(s.albums||[])].sort((a,b)=>V139_num(b.week)-V139_num(a.week))[0]||null}
function V139_setMuseView(view){V139_museView=view==='analytics'?'analytics':'artist';render();window.scrollTo?.({top:0,behavior:'instant'})}
function V139_setMuseRange(weeks){V139_museRange=[1,4,12].includes(Number(weeks))?Number(weeks):1;render()}
function V139_setVybeView(view){V139_vybeView=['music','events','recap'].includes(view)?view:'music';if(view==='recap')V139_recapSlide=0;render();window.scrollTo?.({top:0,behavior:'instant'})}
function V139_setRecapSlide(index){V139_recapSlide=Math.max(0,Math.min(4,Number(index)||0));render();window.scrollTo?.({top:0,behavior:'instant'})}
function V139_museTopRows(range=1,limit=10){const p=V114_state();return Object.values(p.tracks).map(row=>{const stats=row.services?.muse||V114_trackService(),song=V139_songObject(row),hist=song?V134_trackState(song,'muse').v2?.history||[]:[],value=range===1?V139_num(stats.thisWeek):hist.slice(-range).reduce((n,x)=>n+V139_num(x.streams),0);return {row,stats,song,value}}).filter(x=>x.value>0||x.stats.lifetime>0).sort((a,b)=>b.value-a.value||b.stats.lifetime-a.stats.lifetime).slice(0,limit)}
function V139_museHero(){return `<section class="v139-muse-hero" style="--hero:url('${ENCORE_ART.backstage}')">${V139_platformBack()}<button class="v139-hero-action" onclick="V139_setMuseView('${V139_museView==='artist'?'analytics':'artist'}')">${V139_museView==='artist'?'Analytics':'Artist view'} ↗</button><h1>${esc(s.name||'Artist')}</h1></section>`}
function V139_museArtist(){const svc=V134_service('muse'),projects=svc.v2.projects||[],latest=V139_latestAlbum(),featured=latest||((s.albums||[]).find(a=>Number(a.id)===Number(projects[0]?.id))),top=V139_museTopRows(1,5),albums=[...(s.albums||[])].sort((a,b)=>V139_albumServiceLifetime(b,'muse')-V139_albumServiceLifetime(a,'muse')||V139_num(b.week)-V139_num(a.week)).slice(0,10);return `<article class="v139-platform v139-muse"><div class="v139-muse-page">${V139_museHero()}<section class="v139-muse-body">${featured?`<button class="v139-muse-featured" onclick="releaseDetails('albums',${featured.id})">${V139_cover(featured.title)}<span><small>FEATURED ALBUM</small><strong>${esc(featured.title)}</strong><em>${typeof V083_weekDate==='function'?esc(V083_weekDate(featured.week||s.week)):featured.week?'Week '+featured.week:'MUSE release'}</em><b>See album view</b></span></button>`:''}<section class="v139-muse-list"><header><h2>Top Songs</h2><button onclick="V139_setMuseView('analytics')">›</button></header>${top.length?top.map((x,i)=>`<button onclick="releaseDetails('songs',${x.row.songId})"><span><strong>${esc(x.row.title)}</strong><small>${compact(x.stats.lifetime)} MUSE plays${x.song?.features?.length?' · featured collaboration':''}</small></span><b>${i+1}</b></button>`).join(''):'<p>Your MUSE top songs will appear after released music finds listeners.</p>'}</section><section class="v139-muse-albums"><h2>Albums</h2><div>${albums.length?albums.map(a=>`<button onclick="releaseDetails('albums',${a.id})">${V139_cover(a.title)}<strong>${esc(a.title)}</strong><span>${compact(V139_albumServiceLifetime(a,'muse'))} MUSE plays</span></button>`).join(''):'<p>Album eras will appear here.</p>'}</div></section><div class="v139-muse-footer"><button onclick="V139_setMuseView('analytics')">Open MUSE analytics</button><small>Project Health ${Math.round(V139_num(svc.v2.current?.score))}/100 · ${compact(svc.libraryAdds)} library adds</small></div></section></div></article>`}
function V139_serviceRange(svc,weeks){if(weeks===1)return V139_num(svc.currentWeekStreams);return (svc.weekly||[]).slice(-weeks).reduce((n,x)=>n+V139_num(x.streams),0)}
function V139_museAnalytics(){const svc=V134_service('muse'),c=svc.v2.current||{},top=V139_museTopRows(V139_museRange,10),rangeLabel=V139_museRange===1?'Last Week':`Last ${V139_museRange} Weeks`,plays=V139_serviceRange(svc,V139_museRange);return `<article class="v139-platform v139-muse"><div class="v139-muse-page analytics">${V139_museHero()}<section class="v139-muse-body"><div class="v139-muse-overline"><strong>Overview</strong><button onclick="V139_setMuseView('artist')">Artist View</button></div><section class="v139-muse-cards">${[['PLAYS',compact(plays),'listens attributed to MUSE in this period.'],['LIBRARY ADDS',compact(svc.libraryAdds),'career library keeps on MUSE.'],['COMPLETION',V134_pct(c.completionRate,1),'project listening completion this week.']].map(([k,v,n])=>`<article><span>${k}</span><strong>${v}</strong><p>${n}</p></article>`).join('')}</section><nav class="v139-muse-range">${[[1,'Last Week'],[4,'Last 4 Weeks'],[12,'Last 12 Weeks']].map(([n,label])=>`<button class="${V139_museRange===n?'selected':''}" onclick="V139_setMuseRange(${n})">${label}</button>`).join('')}</nav><section class="v139-muse-ranking"><h2>Top Songs</h2><small>${rangeLabel}</small>${top.length?top.map((x,i)=>`<button onclick="releaseDetails('songs',${x.row.songId})"><b>${i+1}</b><span>${esc(x.row.title)}</span><strong>${compact(x.value)}</strong></button>`).join(''):'<p>No MUSE listening activity in this period yet.</p>'}</section><section class="v139-muse-quality"><div><span>PROJECT HEALTH</span><strong>${Math.round(V139_num(c.score))}/100</strong></div><div><span>REPEAT RATE</span><strong>${V134_pct(c.repeatRate,1)}</strong></div><div><span>DEEP-CUT SHARE</span><strong>${V134_pct(c.deepCutShare,1)}</strong></div><div><span>EDITORIAL SUPPORT</span><strong>${compact(svc.editorialAdds)}</strong></div></section></section></div></article>`}
function V139_musePanel(){return V139_museView==='analytics'?V139_museAnalytics():V139_museArtist()}
function V139_vybeTracks(limit=7){return V114_topTracks('vybe',limit)}
function V139_vybeAlbums(){return [...(s.albums||[])].map(a=>({album:a,streams:V139_albumServiceLifetime(a,'vybe'),week:V139_albumServiceWeek(a,'vybe')})).sort((a,b)=>b.streams-a.streams||V139_num(b.album.week)-V139_num(a.album.week)).slice(0,8)}
function V139_vybeHero(){const svc=V134_service('vybe'),c=svc.v2.current||{};return `<section class="v139-vybe-hero" style="--hero:url('${ENCORE_ART.backstage}')">${V139_platformBack()}<div><h1>${esc(s.name||'Artist')}</h1><span>${compact(svc.monthlyListeners)} monthly listeners</span></div><button class="v139-vybe-health" onclick="V139_setVybeView('events')"><small>ALGORITHM HEALTH</small><strong>${Math.round(V139_num(c.score))}</strong></button></section>`}
function V139_vybeNav(){return `<nav class="v139-vybe-tabs">${[['music','Music'],['events','Events'],['recap','Recap']].map(([id,label])=>`<button class="${V139_vybeView===id?'selected':''}" onclick="V139_setVybeView('${id}')">${label}</button>`).join('')}</nav>`}
function V139_vybeMusic(){const svc=V134_service('vybe'),tracks=V139_vybeTracks(7),albums=V139_vybeAlbums(),top=tracks[0];return `<section class="v139-vybe-content"><div class="v139-vybe-actions"><span><b>${compact(svc.followers)}</b> followers</span><button class="follow" disabled>Artist profile</button><button class="shuffle" onclick="${top?`releaseDetails('songs',${top.row.songId})`:'void 0'}">⇄</button><button class="play" onclick="${top?`releaseDetails('songs',${top.row.songId})`:'void 0'}">▶</button></div>${V139_vybeNav()}<section class="v139-vybe-popular"><h2>Popular</h2>${tracks.length?tracks.map((x,i)=>`<button onclick="releaseDetails('songs',${x.row.songId})"><b>${i+1}</b>${V139_cover(x.row.title,'song')}<span><strong>${esc(x.row.title)}</strong><small>${compact(x.stats.lifetime)} VYBE streams</small></span><em>•••</em></button>`).join(''):'<p>Popular tracks will appear after your releases find VYBE listeners.</p>'}</section><section class="v139-vybe-releases"><h2>Popular Releases</h2>${albums.length?albums.map(x=>`<button onclick="releaseDetails('albums',${x.album.id})">${V139_cover(x.album.title)}<span><strong>${esc(x.album.title)}</strong><small>${compact(x.streams)} VYBE streams · ${typeof V083_weekDate==='function'?esc(V083_weekDate(x.album.week||s.week)):''}</small></span></button>`).join(''):'<p>Release an album to build your VYBE catalog.</p>'}</section></section>`}
function V139_vybeEvents(){const svc=V134_service('vybe'),placements=V114_activePlacements('vybe'),history=svc.strategy?.history||[],c=svc.v2.current||{};return `<section class="v139-vybe-content">${V139_vybeNav()}<section class="v139-vybe-event-head"><span>VYBE MOMENTUM</span><strong>${Math.round(V139_num(c.score))}/100</strong><p>Discovery changes with saves, skips, repeat listening and active platform pushes.</p></section><section class="v139-vybe-event-list"><h2>Active Discovery</h2>${placements.length?placements.map(x=>`<article><span>${esc(x.name)}</span><strong>${esc(x.title)}</strong><small>Active through Week ${x.expires} · +${Math.round(V139_num(x.lift)*100)}% discovery signal</small></article>`).join(''):'<p>No active VYBE placements right now.</p>'}<h2>Recent Platform Moves</h2>${history.length?history.slice(0,8).map(x=>`<article><span>WEEK ${x.week}</span><strong>${esc(x.action)}</strong><small>${esc(x.title)}${x.cost?' · '+money(x.cost):''}</small></article>`).join(''):'<p>No VYBE strategy moves have been run yet.</p>'}</section><section class="v139-vybe-signal-grid">${[['SAVE RATE',V134_pct(c.saveRate,1)],['SKIP RATE',V134_pct(c.skipRate,1)],['REPEAT RATE',V134_pct(c.repeatRate,1)],['ALGORITHM SHARE',V134_pct(c.algorithmShare,1)]].map(([k,v])=>`<div><span>${k}</span><strong>${v}</strong></div>`).join('')}</section></section>`}
function V139_vybeRecap(){const svc=V134_service('vybe'),c=svc.v2.current||{},top=V139_vybeTracks(1)[0],history=svc.v2.history||[],biggest=history.reduce((best,x)=>V139_num(x.streams)>V139_num(best?.streams)?x:best,null),slides=[{k:'YOUR VYBE RECAP',h:'Your recap is here.',p:'Tap through the moments your VYBE audience created.',big:''},{k:'THE SOUND TRAVELED',h:`${compact(svc.lifetimeStreams)} streams`,p:'Your lifetime listening on VYBE.',big:'STREAMS'},{k:'YOUR AUDIENCE',h:`${compact(svc.monthlyListeners)} monthly listeners`,p:`${compact(svc.followers)} people currently follow your VYBE artist profile.`,big:'LISTENERS'},{k:'THE RECORD THEY RAN BACK',h:top?esc(top.row.title):'Your next release',p:top?`${compact(top.stats.lifetime)} lifetime VYBE streams.`:'Release music to create a top-song story.',big:top?'#1':''},{k:'THE ALGORITHM READ YOU',h:`${Math.round(V139_num(c.score))}/100 health`,p:`${V134_pct(c.saveRate,1)} save rate · ${V134_pct(c.repeatRate,1)} repeat rate${biggest?` · ${compact(biggest.streams)} biggest tracked week`:''}.`,big:'VYBE'}],slide=slides[V139_recapSlide];return `<section class="v139-vybe-recap slide-${V139_recapSlide}"><button class="v139-recap-back" onclick="V139_setVybeView('music')">‹</button><div class="v139-recap-title">RECAP</div><article><span>${slide.k}</span>${slide.big?`<b>${slide.big}</b>`:''}<h2>${slide.h}</h2><p>${slide.p}</p></article><div class="v139-recap-dots">${slides.map((_,i)=>`<button class="${i===V139_recapSlide?'selected':''}" onclick="V139_setRecapSlide(${i})" aria-label="Recap slide ${i+1}"></button>`).join('')}</div><footer><button ${V139_recapSlide===0?'disabled':''} onclick="V139_setRecapSlide(${V139_recapSlide-1})">‹</button><span>${V139_recapSlide+1} / ${slides.length}</span><button ${V139_recapSlide===slides.length-1?'disabled':''} onclick="V139_setRecapSlide(${V139_recapSlide+1})">›</button></footer></section>`}
function V139_vybePanel(){return `<article class="v139-platform v139-vybe">${V139_vybeHero()}${V139_vybeView==='recap'?V139_vybeRecap():V139_vybeView==='events'?V139_vybeEvents():V139_vybeMusic()}</article>`}
const V139_platformPanelBase=V114_platformPanel;
V114_platformPanel=function(id){if(id==='muse')return V139_musePanel();if(id==='vybe')return V139_vybePanel();return V139_platformPanelBase(id)};
const V139_platformPageBase=V114_platformPage;
V114_platformPage=function(){V114_state();if(V114_platformTab==='muse'||V114_platformTab==='vybe')return V114_platformPanel(V114_platformTab);return V139_platformPageBase()};
Object.assign(globalThis,{V139_setMuseView,V139_setMuseRange,V139_setVybeView,V139_setRecapSlide});
