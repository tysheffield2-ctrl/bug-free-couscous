/* ENCORE 0.9.12 — Music Platform Ecosystem 1.0.
   Restores separate artist profiles for multiple fictional music services, ties
   them to the authoritative stream count, and lets PULSE/video discovery feed
   future catalog performance without duplicating current-week royalties. */

const V114_AUDIO_PLATFORMS={
 vybe:{id:'vybe',name:'VYBE',tag:'PLAYLIST / ALGORITHM',baseShare:.36,desc:'Fast discovery, saves and playlist momentum. Commercial appeal and viral ability matter most.'},
 muse:{id:'muse',name:'MUSE',tag:'ALBUM / LIBRARY',baseShare:.28,desc:'Album listening, library adds and editorial support. Quality, loyalty and complete projects matter most.'},
 amp:{id:'amp',name:'AMP',tag:'COMMUNITY / EARLY DISCOVERY',baseShare:.18,desc:'Follower-heavy discovery and repost culture. Emerging artists and direct fan activity can overperform here.'},
 worldwave:{id:'worldwave',name:'WORLDWAVE',tag:'GLOBAL / RADIO',baseShare:.18,desc:'Global crossover and radio-style reach. Reputation, broad appeal and durable records matter most.'}
};
const V114_PLATFORM_IDS=Object.keys(V114_AUDIO_PLATFORMS);
const V114_VIDEO_FORMATS={
 visualizer:{id:'visualizer',name:'Visualizer',minimum:1500,energy:10,reach:.55,decay:.76},
 performance:{id:'performance',name:'Performance video',minimum:12000,energy:15,reach:.9,decay:.80},
 official:{id:'official',name:'Official music video',minimum:60000,energy:20,reach:1.35,decay:.84},
 cinematic:{id:'cinematic',name:'Cinematic video',minimum:250000,energy:30,reach:2.05,decay:.88}
};
let V114_platformTab='Overview';
let V114_pendingVideo=null;

function V114_num(v){const n=Number(v);return Number.isFinite(n)?n:0}
function V114_serviceSeed(id,fans){const rate={vybe:.55,muse:.30,amp:.18,worldwave:.14}[id]||.2;return Math.max(0,Math.round(Math.max(0,fans)*rate))}
function V114_emptyService(id,fans=0){return {id,followers:V114_serviceSeed(id,fans),lifetimeStreams:0,currentWeekStreams:0,monthlyListeners:0,saves:0,libraryAdds:0,reposts:0,radioSpins:0,editorialAdds:0,playlistReach:0,weekly:[],placements:[]}}
function V114_trackService(){return {lifetime:0,thisWeek:0,lastWeek:0,saves:0,libraryAdds:0,reposts:0,radioSpins:0}}
function V114_state(state=s){
 if(!state.musicPlatforms||typeof state.musicPlatforms!=='object')state.musicPlatforms={version:1,migratedAtWeek:state.week||1,services:{},tracks:{},video:{subscribers:Math.max(0,Math.round((state.fans||0)*.2)),lifetimeViews:0,currentWeekViews:0,lifetimeRevenue:0,nextId:1,videos:[],weekly:[]},events:[]};
 const p=state.musicPlatforms;p.version=1;p.services=p.services&&typeof p.services==='object'?p.services:{};p.tracks=p.tracks&&typeof p.tracks==='object'?p.tracks:{};p.events=Array.isArray(p.events)?p.events:[];
 for(const id of V114_PLATFORM_IDS){const old=p.services[id]&&typeof p.services[id]==='object'?p.services[id]:V114_emptyService(id,state.fans||0);p.services[id]={...V114_emptyService(id,0),...old,id,weekly:Array.isArray(old.weekly)?old.weekly:[],placements:Array.isArray(old.placements)?old.placements:[]}}
 if(!p.video||typeof p.video!=='object')p.video={subscribers:Math.max(0,Math.round((state.fans||0)*.2)),lifetimeViews:0,currentWeekViews:0,lifetimeRevenue:0,nextId:1,videos:[],weekly:[]};
 p.video.videos=Array.isArray(p.video.videos)?p.video.videos:[];p.video.weekly=Array.isArray(p.video.weekly)?p.video.weekly:[];p.video.nextId=Math.max(1,Math.floor(V114_num(p.video.nextId)||1));
 if(!p.seeded){V114_seedExistingCareer(state,p);p.seeded=true}
 return p
}
function V114_songAlbumSignal(track,state=s){
 const albums=Array.isArray(state.albums)?state.albums:[];
 for(const a of albums){const tracks=Array.isArray(a.tracks)?a.tracks:Array.isArray(a.songs)?a.songs:[];if(tracks.some(x=>Number(x?.id??x)===Number(track.id)))return 1}
 return track.albumBoost?1:0
}
function V114_socialSignal(track){try{return typeof socialSongBoost==='function'?clamp(V114_num(socialSongBoost(track)),0,.2):0}catch{return 0}}
function V114_audioWeights(track,state=s){
 const quality=clamp(V114_num(track.quality||50),0,100)/100,commercial=clamp(V114_num(track.commercial||50),0,100)/100,viral=clamp(typeof level==='function'?V114_num(level('viralAbility')):50,0,100)/100,loyalty=clamp(V114_num(state.loyalty||0),0,100)/100,reputation=clamp(V114_num(state.reputation||0),0,100)/100,album=V114_songAlbumSignal(track,state),social=V114_socialSignal(track),emerging=1-reputation;
 const raw={
  vybe:V114_AUDIO_PLATFORMS.vybe.baseShare*(.75+commercial*.42+viral*.18+social*1.35),
  muse:V114_AUDIO_PLATFORMS.muse.baseShare*(.78+quality*.42+album*.24+loyalty*.13),
  amp:V114_AUDIO_PLATFORMS.amp.baseShare*(.74+quality*.18+emerging*.22+social*.85),
  worldwave:V114_AUDIO_PLATFORMS.worldwave.baseShare*(.76+reputation*.34+commercial*.14+quality*.12)
 };
 const total=Object.values(raw).reduce((n,v)=>n+v,0)||1;for(const id of V114_PLATFORM_IDS)raw[id]/=total;return raw
}
function V114_allocate(total,weights){
 const n=Math.max(0,Math.round(V114_num(total))),out={},ids=[...V114_PLATFORM_IDS];let used=0;
 ids.forEach((id,i)=>{const value=i===ids.length-1?n-used:Math.max(0,Math.floor(n*Math.max(0,V114_num(weights[id]))));out[id]=value;used+=value});return out
}
function V114_trackRow(state,track){
 const p=V114_state(state),key=String(track.id);if(!p.tracks[key])p.tracks[key]={songId:track.id,title:track.title||'Untitled',services:{},weekly:[],lastLift:0};const row=p.tracks[key];row.title=track.title||row.title;row.services=row.services&&typeof row.services==='object'?row.services:{};for(const id of V114_PLATFORM_IDS)row.services[id]={...V114_trackService(),...(row.services[id]||{})};row.weekly=Array.isArray(row.weekly)?row.weekly:[];return row
}
function V114_seedExistingCareer(state,p){
 for(const track of (state.songs||[]).filter(x=>x.released)){
  const row=V114_trackRow(state,track),weights=V114_audioWeights(track,state),life=V114_allocate(Math.max(0,V114_num(track.total)),weights),current=V114_allocate(Math.max(0,V114_num(track.streams)),weights);
  for(const id of V114_PLATFORM_IDS){const svc=p.services[id],ts=row.services[id];ts.lifetime=life[id];ts.thisWeek=current[id];ts.lastWeek=state.week||1;svc.lifetimeStreams+=life[id];svc.currentWeekStreams+=current[id]}
 }
 for(const id of V114_PLATFORM_IDS){const svc=p.services[id],listeners=Math.round(svc.currentWeekStreams/(id==='muse'?2.1:id==='amp'?1.55:1.8));svc.monthlyListeners=Math.max(0,Math.round(listeners*2.4))}
}
function V114_monthlyListeners(service){
 const recent=(service.weekly||[]).slice(-4),sum=recent.reduce((n,x)=>n+V114_num(x.listeners),0),peak=recent.reduce((n,x)=>Math.max(n,V114_num(x.listeners)),0);return Math.max(0,Math.round(peak+(sum-peak)*.56))
}
function V114_addEvent(p,event){p.events.unshift({...event,week:s.week});p.events=p.events.slice(0,80)}
function V114_hasPlacement(service,key){return (service.placements||[]).some(x=>x.key===key&&x.expires>=s.week)}
function V114_place(p,serviceId,track,name,lift,weeks=4){
 const service=p.services[serviceId],key=serviceId+':'+track.id+':'+name;if(V114_hasPlacement(service,key))return 0;
 const item={key,songId:track.id,title:track.title,name,start:s.week,expires:s.week+weeks-1,lift};service.placements.unshift(item);service.placements=service.placements.filter(x=>x.expires>=s.week-8).slice(0,40);V114_addEvent(p,{type:'placement',service:serviceId,songId:track.id,text:`${track.title} entered ${name} on ${V114_AUDIO_PLATFORMS[serviceId].name}.`});return lift
}
function V114_placementLift(p,track,alloc){
 const quality=clamp(V114_num(track.quality||50),0,100),commercial=clamp(V114_num(track.commercial||50),0,100),rep=clamp(V114_num(s.reputation||0),0,100),social=V114_socialSignal(track),newRelease=s.week-V114_num(track.released||s.week)<=4;let lift=0;
 if(commercial>=68&&alloc.vybe>=Math.max(3000,(s.fans||0)*.08))lift+=V114_place(p,'vybe',track,alloc.vybe>=250000?'Top Rotation':'Rising Rotation',alloc.vybe>=250000?.10:.06,4);
 if(quality>=75&&newRelease&&alloc.muse>=1500){p.services.muse.editorialAdds++;lift+=V114_place(p,'muse',track,V114_songAlbumSignal(track)?'Album Spotlight':'Editors’ Table',.05,4)}
 if((social>=.035||rep<35)&&alloc.amp>=1000){p.services.amp.reposts+=Math.max(1,Math.round(Math.sqrt(alloc.amp)/8));lift+=V114_place(p,'amp',track,'Community Repost Network',.04,3)}
 if(rep>=45&&quality>=70&&alloc.worldwave>=5000){p.services.worldwave.radioSpins+=Math.max(1,Math.round(Math.sqrt(alloc.worldwave)/5));lift+=V114_place(p,'worldwave',track,'Global Rotation',.05,5)}
 return clamp(lift,0,.18)
}
function V114_settleAudio(state=s){
 const p=V114_state(state),summary={week:state.week,streams:0,followers:0,placements:0,videoViews:0,videoRevenue:0,top:null};for(const id of V114_PLATFORM_IDS)p.services[id].currentWeekStreams=0;
 let topStreams=-1;
 for(const track of (state.songs||[]).filter(x=>x.released)){
  const total=Math.max(0,Math.round(V114_num(track.streams))),weights=V114_audioWeights(track,state),alloc=V114_allocate(total,weights),row=V114_trackRow(state,track),quality=clamp(V114_num(track.quality||50),0,100)/100,loyalty=clamp(V114_num(state.loyalty||0),0,100)/100,social=V114_socialSignal(track);let lift=0;
  for(const id of V114_PLATFORM_IDS){
   const cfg=V114_AUDIO_PLATFORMS[id],svc=p.services[id],ts=row.services[id],streams=alloc[id],avg=id==='muse'?2.15:id==='amp'?1.5:id==='worldwave'?1.9:1.75,listeners=Math.max(0,Math.round(streams/avg)),conversion={vybe:.006,muse:.0045,amp:.0085,worldwave:.0035}[id],gained=Math.max(0,Math.round(listeners*(conversion+quality*.002+loyalty*.001))),saveRate=.018+quality*.035+loyalty*.012;
   ts.thisWeek=streams;ts.lastWeek=state.week;ts.lifetime=Math.max(0,V114_num(ts.lifetime)+streams);svc.currentWeekStreams+=streams;svc.lifetimeStreams=Math.max(0,V114_num(svc.lifetimeStreams)+streams);svc.followers=Math.max(0,V114_num(svc.followers)+gained);summary.followers+=gained;
   if(id==='vybe'){const saves=Math.round(streams*(saveRate+social*.025));ts.saves+=saves;svc.saves+=saves;svc.playlistReach=Math.max(svc.playlistReach,Math.round(listeners*(1+social*2)))}
   if(id==='muse'){const adds=Math.round(listeners*(.025+quality*.05));ts.libraryAdds+=adds;svc.libraryAdds+=adds}
   if(id==='amp'){const reposts=Math.round(listeners*(.003+social*.03));ts.reposts+=reposts;svc.reposts+=reposts}
   if(id==='worldwave'){const spins=Math.max(0,Math.round(Math.sqrt(streams)*(.03+V114_num(state.reputation||0)/1800)));ts.radioSpins+=spins;svc.radioSpins+=spins}
   svc.weekly.push({week:state.week,streams,listeners,followers:gained});svc.weekly=svc.weekly.slice(-12);svc.monthlyListeners=V114_monthlyListeners(svc)
  }
  lift=V114_placementLift(p,track,alloc);row.lastLift=lift;row.weekly.push({week:state.week,total,allocation:alloc,lift});row.weekly=row.weekly.slice(-12);summary.streams+=total;summary.placements+=lift>0?1:0;if(total>topStreams){topStreams=total;summary.top={songId:track.id,title:track.title,streams:total}}
  track.platformLiftNext=lift
 }
 return summary
}
function V114_videoBudgetFactor(video){return clamp(.75+Math.log10(1+Math.max(0,V114_num(video.budget))/Math.max(1,V114_num(V114_VIDEO_FORMATS[video.format]?.minimum||1)))*.42,.75,1.75)}
function V114_settleVideo(state=s){
 const p=V114_state(state),v=p.video;v.currentWeekViews=0;let revenueTotal=0,totalSubscribers=0,totalLift={};
 for(const video of v.videos){const format=V114_VIDEO_FORMATS[video.format]||V114_VIDEO_FORMATS.performance,track=(state.songs||[]).find(x=>Number(x.id)===Number(video.songId));if(!track)continue;const age=Math.max(0,state.week-video.week),social=V114_socialSignal(track),base=Math.max(120,Math.max(V114_num(track.streams)*.36,V114_num(state.fans)*.055)),decay=Math.pow(format.decay,age),views=Math.max(0,Math.round(base*format.reach*V114_videoBudgetFactor(video)*decay*(1+social*2.4)*(video.quality||1)));video.thisWeekViews=views;video.lifetimeViews=Math.max(0,V114_num(video.lifetimeViews)+views);v.currentWeekViews+=views;v.lifetimeViews=Math.max(0,V114_num(v.lifetimeViews)+views);const subs=Math.max(0,Math.round(views*(.0025+clamp(typeof level==='function'?V114_num(level('charisma')):50,0,100)*.000035)));v.subscribers+=subs;totalSubscribers+=subs;const revenue=cents(views*.003);video.lifetimeRevenue=cents(V114_num(video.lifetimeRevenue)+revenue);v.lifetimeRevenue=cents(V114_num(v.lifetimeRevenue)+revenue);revenueTotal=cents(revenueTotal+revenue);const spill=clamp(views/Math.max(10000,V114_num(track.streams)*22),0,.10);totalLift[track.id]=Math.max(totalLift[track.id]||0,spill)}
 if(revenueTotal>0){changeCash(revenueTotal);const previous=typeof V110_incomeContext!=='undefined'?V110_incomeContext:null;if(typeof V110_incomeContext!=='undefined')V110_incomeContext={family:'platform',category:'video',name:'FRAME',phase:'Creator revenue'};try{recordIncome('media',revenueTotal)}finally{if(typeof V110_incomeContext!=='undefined')V110_incomeContext=previous}moneyEvent?.('FRAME creator revenue',revenueTotal)}
 v.weekly.push({week:state.week,views:v.currentWeekViews,subscribers:totalSubscribers,revenue:revenueTotal});v.weekly=v.weekly.slice(-12);return {views:v.currentWeekViews,subscribers:totalSubscribers,revenue:revenueTotal,lifts:totalLift}
}
function V114_applyNextWeekLift(state,audio,video){
 for(const track of (state.songs||[]).filter(x=>x.released)){
  const audioLift=clamp(V114_num(track.platformLiftNext),0,.18),videoLift=clamp(V114_num(video?.lifts?.[track.id]),0,.10),combined=clamp(audioLift+videoLift,0,.25);track.platformLiftNext=combined;if(combined>0&&Number.isFinite(Number(track.organic)))track.organic=Math.max(8,V114_num(track.organic)*(1+combined));const row=V114_state(state).tracks[String(track.id)];if(row)row.lastLift=combined
 }
}
function V114_settlePlatforms(state=s){const p=V114_state(state),audio=V114_settleAudio(state),video=V114_settleVideo(state);V114_applyNextWeekLift(state,audio,video);const summary={...audio,videoViews:video.views,videoRevenue:video.revenue,videoSubscribers:video.subscribers};p.lastWeek={...summary};V114_addEvent(p,{type:'week',text:`Platform week closed with ${compact(summary.streams)} audio streams and ${compact(summary.videoViews)} video views.`});return summary}

/* Seed the system before the authoritative release engine mutates lifetime totals,
   then allocate that week's already-computed streams afterward. */
const V114_releaseSettleBase=globalThis.ENCORE_RELEASES?.settle;
if(V114_releaseSettleBase)globalThis.ENCORE_RELEASES.settle=function(state,h){V114_state(state);const result=V114_releaseSettleBase(state,h);V114_settlePlatforms(state);return result};
const V114_weeklySettleBase=globalThis.ENCORE_WEEKLY?.settle;
if(V114_weeklySettleBase)globalThis.ENCORE_WEEKLY.settle=function(state,h){const out=V114_weeklySettleBase(state,h);if(state.lastReport)state.lastReport.platforms=V114_state(state).lastWeek||null;return out};

function V114_topTracks(serviceId,limit=8){
 const p=V114_state();return Object.values(p.tracks).map(row=>({row,stats:row.services?.[serviceId]||V114_trackService()})).filter(x=>x.stats.lifetime>0||x.stats.thisWeek>0).sort((a,b)=>b.stats.thisWeek-a.stats.thisWeek||b.stats.lifetime-a.stats.lifetime).slice(0,limit)
}
function V114_activePlacements(serviceId){return (V114_state().services[serviceId].placements||[]).filter(x=>x.expires>=s.week).sort((a,b)=>b.lift-a.lift)}
function V114_platformMetricRows(id,svc){
 if(id==='vybe')return [['Monthly listeners',compact(svc.monthlyListeners)],['Followers',compact(svc.followers)],['Saves',compact(svc.saves)],['Playlist reach',compact(svc.playlistReach)]];
 if(id==='muse')return [['Monthly listeners',compact(svc.monthlyListeners)],['Followers',compact(svc.followers)],['Library adds',compact(svc.libraryAdds)],['Editorial placements',String(svc.editorialAdds)]];
 if(id==='amp')return [['Monthly listeners',compact(svc.monthlyListeners)],['Followers',compact(svc.followers)],['Reposts',compact(svc.reposts)],['Current-week streams',compact(svc.currentWeekStreams)]];
 return [['Monthly listeners',compact(svc.monthlyListeners)],['Followers',compact(svc.followers)],['Radio spins',compact(svc.radioSpins)],['Current-week streams',compact(svc.currentWeekStreams)]]
}
function V114_platformPanel(id){
 const p=V114_state(),cfg=V114_AUDIO_PLATFORMS[id],svc=p.services[id],tracks=V114_topTracks(id),placements=V114_activePlacements(id);return `<section class="v114-profile" data-platform="${id}"><header><div><span class="eyebrow">${esc(cfg.tag)}</span><h2>${esc(cfg.name)}</h2><p>${esc(cfg.desc)}</p></div><div class="v114-profile-week"><small>THIS WEEK</small><strong>${compact(svc.currentWeekStreams)}</strong><span>streams allocated from your existing ENCORE total</span></div></header><div class="v114-metrics">${V114_platformMetricRows(id,svc).map(([k,v])=>`<div><small>${esc(k)}</small><strong>${esc(v)}</strong></div>`).join('')}</div><div class="v114-profile-grid"><section><span class="eyebrow">TOP TRACKS · THIS WEEK</span>${tracks.length?tracks.map((x,i)=>`<div class="v114-track-row"><b>${i+1}</b><span><strong>${esc(x.row.title)}</strong><small>${compact(x.stats.thisWeek)} this week · ${compact(x.stats.lifetime)} on ${esc(cfg.name)}</small></span></div>`).join(''):'<p>No released music has activity on this profile yet.</p>'}</section><aside><span class="eyebrow">ACTIVE DISCOVERY</span>${placements.length?placements.map(x=>`<article><strong>${esc(x.name)}</strong><span>${esc(x.title)}</span><small>Through Week ${x.expires} · +${Math.round(x.lift*100)}% discovery signal</small></article>`).join(''):'<p>No active placement. Strong records can earn discovery organically.</p>'}</aside></div></section>`
}
function V114_totalFollowers(){const p=V114_state();return V114_PLATFORM_IDS.reduce((n,id)=>n+V114_num(p.services[id].followers),0)+V114_num(p.video.subscribers)}
function V114_overview(){
 const p=V114_state(),released=(s.songs||[]).filter(x=>x.released),last=p.lastWeek||{},top=last.top,events=p.events.filter(x=>x.type==='placement').slice(0,5);return `<section class="v114-overview"><header><div><span class="eyebrow">MUSIC PLATFORM ECOSYSTEM 1.0</span><h2>One career. Different audiences.</h2><p>Your authoritative ENCORE stream total is split across four platform profiles. The split changes by record, career position and fan behavior; the system never duplicates a stream just to make the profiles look bigger.</p></div><div class="v114-overview-total"><small>COMBINED PLATFORM FOLLOWING</small><strong>${compact(V114_totalFollowers())}</strong><span>audio followers + FRAME subscribers</span></div></header><div class="v114-overview-metrics">${[['AUDIO STREAMS · LAST WEEK',compact(last.streams||s.streams||0)],['VIDEO VIEWS · LAST WEEK',compact(last.videoViews||0)],['ACTIVE RELEASES',String(released.length)],['NEXT-WEEK DISCOVERY',top?esc(top.title):'No active leader']].map(([k,v])=>`<div><small>${k}</small><strong>${v}</strong></div>`).join('')}</div><div class="v114-service-overview">${V114_PLATFORM_IDS.map(id=>{const cfg=V114_AUDIO_PLATFORMS[id],svc=p.services[id];return `<button data-platform="${id}" onclick="V114_setTab('${id}')"><span>${esc(cfg.tag)}</span><strong>${esc(cfg.name)}</strong><b>${compact(svc.monthlyListeners)}</b><small>monthly listeners</small></button>`}).join('')}<button data-platform="frame" onclick="V114_setTab('frame')"><span>VIDEO / VISUALS</span><strong>FRAME</strong><b>${compact(p.video.subscribers)}</b><small>subscribers</small></button></div><section class="v114-system-loop"><span class="eyebrow">WHY THE PROFILES MATTER</span><div><article><b>01</b><strong>PULSE creates attention.</strong><p>Linked posts increase discovery weight for the song instead of adding fake streams.</p></article><article><b>02</b><strong>Each service reacts differently.</strong><p>Commercial appeal can dominate VYBE while quality, albums or early fan activity win elsewhere.</p></article><article><b>03</b><strong>Placements create future lift.</strong><p>Editorial, repost and radio support can improve the song’s next-week organic stream base.</p></article><article><b>04</b><strong>FRAME can revive catalog.</strong><p>Video views earn media revenue and create a bounded spillover into future song discovery.</p></article></div></section>${events.length?`<section class="v114-recent"><span class="eyebrow">RECENT PLATFORM MOMENTS</span>${events.map(e=>`<p><strong>Week ${e.week}</strong> · ${esc(e.text)}</p>`).join('')}</section>`:''}<section class="v114-pulse-link"><div><span class="eyebrow">PULSE CONNECTION</span><strong>${compact(s.social?.followers||0)} followers</strong><p>Social followers are not music-platform listeners. PULSE is an attention source that can push a specific song into platform discovery when you link it.</p></div><button class="secondary" onclick="openDestination('Social')">Open PULSE →</button></section></section>`
}
function V114_videoPage(){
 const p=V114_state(),v=p.video,videos=v.videos.slice().sort((a,b)=>b.week-a.week);return `<section class="v114-profile v114-frame" data-platform="frame"><header><div><span class="eyebrow">VIDEO / VISUALS</span><h2>FRAME</h2><p>Videos are separate career assets. Production costs real cash and energy, videos can earn creator revenue, and strong viewing can push listeners back toward the linked song.</p></div><div class="v114-profile-week"><small>THIS WEEK</small><strong>${compact(v.currentWeekViews||0)}</strong><span>video views</span></div></header><div class="v114-metrics">${[['Subscribers',compact(v.subscribers)],['Lifetime views',compact(v.lifetimeViews)],['Creator revenue',money(v.lifetimeRevenue)],['Published videos',String(videos.length)]].map(([k,val])=>`<div><small>${k}</small><strong>${val}</strong></div>`).join('')}</div><div class="v114-video-actions"><button class="primary" ${(s.songs||[]).some(x=>x.released)?'':'disabled'} onclick="V114_openVideoStudio()">Plan a video</button><p>Budget improves reach, but a weak song is still a weak foundation. Video revenue is recorded as media income and video production as a career expense.</p></div><div class="v114-video-list">${videos.length?videos.map(x=>{const song=(s.songs||[]).find(y=>Number(y.id)===Number(x.songId));return `<article><div><span>${esc(V114_VIDEO_FORMATS[x.format]?.name||'Video')}</span><strong>${esc(song?.title||x.title||'Catalog video')}</strong><small>Released Week ${x.week} · Budget ${money(x.budget)}</small></div><div><b>${compact(x.thisWeekViews||0)}</b><small>this week</small><b>${compact(x.lifetimeViews||0)}</b><small>lifetime views</small></div></article>`}).join(''):'<p>No videos yet. Release a song, then build its visual campaign here.</p>'}</div></section>`
}
function V114_setTab(id){if(!['Overview',...V114_PLATFORM_IDS,'frame'].includes(id))return;V114_platformTab=id;render()}
function V114_tabs(){return `<nav class="v114-tabs" aria-label="Music platform profiles">${[['Overview','Overview'],...V114_PLATFORM_IDS.map(id=>[id,V114_AUDIO_PLATFORMS[id].name]),['frame','FRAME']].map(([id,name])=>`<button class="${V114_platformTab===id?'selected':''}" onclick="V114_setTab('${id}')">${esc(name)}</button>`).join('')}</nav>`}
function V114_platformPage(){V114_state();const body=V114_platformTab==='Overview'?V114_overview():V114_platformTab==='frame'?V114_videoPage():V114_platformPanel(V114_platformTab);return head('Every platform tells a different story.','Music platforms.',`<span class="pill">${compact(V114_totalFollowers())} combined follows</span>`)+V114_tabs()+body}

function V114_openVideoStudio(){
 const released=(s.songs||[]).filter(x=>x.released);if(!released.length){toast?.('Release a song before planning a video.');return}
 modal(`<span class="eyebrow">FRAME · VIDEO STUDIO</span><h2>Build a visual around a record.</h2><form class="form" onsubmit="V114_reviewVideo(event)"><label>Song<select name="song">${released.slice().sort((a,b)=>(b.streams||0)-(a.streams||0)).map(x=>`<option value="${x.id}">${esc(x.title)} · ${compact(x.streams||0)} current weekly streams</option>`).join('')}</select></label><label>Format<select name="format">${Object.values(V114_VIDEO_FORMATS).map(x=>`<option value="${x.id}">${esc(x.name)} · minimum ${money(x.minimum)} · ${x.energy} energy</option>`).join('')}</select></label><label>Production budget<input name="budget" type="number" min="1500" max="50000000" step="500" value="60000" required></label><p class="fine">The selected format sets a minimum viable budget. Spending above it improves reach with diminishing returns; it does not guarantee virality.</p><button class="primary">Review production</button></form>`)
}
function V114_reviewVideo(event){
 event.preventDefault();const f=new FormData(event.target),track=(s.songs||[]).find(x=>Number(x.id)===Number(f.get('song'))&&x.released),format=V114_VIDEO_FORMATS[String(f.get('format'))],budget=Math.max(0,Math.round(Number(f.get('budget'))||0));if(!track||!format)return;if(budget<format.minimum){toast?.(format.name+' needs at least '+money(format.minimum)+'.');return}const factor=V114_videoBudgetFactor({format:format.id,budget}),base=Math.max(120,Math.max(V114_num(track.streams)*.36,V114_num(s.fans)*.055)),projected=Math.round(base*format.reach*factor),low=Math.round(projected*.65),high=Math.round(projected*1.35);V114_pendingVideo={songId:track.id,title:track.title,format:format.id,budget,energy:format.energy,quality:clamp(.85+V114_num(track.quality||50)/400,.85,1.1)};modal(`<span class="eyebrow">FRAME · PRODUCTION REVIEW</span><h2>${esc(format.name)} · ${esc(track.title)}</h2>${profileRows([['Production budget',money(budget)],['Energy',format.energy],['Projected first-week views',compact(low)+' – '+compact(high)],['Current song streams',compact(track.streams||0)],['Potential catalog effect','Up to +10% next-week discovery from video spillover']])}<p>The view range is a forecast, not a guarantee. PULSE activity, song demand and production level still affect the actual result.</p><div class="controls"><button class="primary" onclick="V114_publishVideo()">Fund & publish</button><button class="secondary" onclick="V114_openVideoStudio()">Change plan</button></div>`)
}
function V114_publishVideo(){
 const plan=V114_pendingVideo;if(!plan)return false;if(s.cash<plan.budget){toast?.('You need '+money(plan.budget)+' in spendable cash.');return false}if(!spend(plan.energy))return false;migrateFinance?.();if(!s.finance.week||typeof s.finance.week!=='object')s.finance.week={wages:0,live:0,expenses:0};changeCash(-plan.budget);s.finance.week.expenses=cents(V114_num(s.finance.week.expenses)+plan.budget);moneyEvent?.('FRAME video production · '+plan.title,-plan.budget);const v=V114_state().video;v.videos.push({id:v.nextId++,songId:plan.songId,title:plan.title,format:plan.format,budget:plan.budget,quality:plan.quality,week:s.week,thisWeekViews:0,lifetimeViews:0,lifetimeRevenue:0});v.videos=v.videos.slice(-60);V114_addEvent(V114_state(),{type:'video',songId:plan.songId,text:`${V114_VIDEO_FORMATS[plan.format].name} for ${plan.title} published on FRAME.`});V114_pendingVideo=null;$('modal')?.close?.();queueSave?.();render();toast?.('Video published. Performance resolves at week close.');return true
}

/* Separate platform-generated media revenue from vague commercial income in the
   recap while preserving the authoritative media total and tax math. */
function V114_platformIncomeDetails(r){return (Array.isArray(r?.dealIncomeDetails)?r.dealIncomeDetails:[]).filter(x=>x.family==='platform'&&V114_num(x.amount)>0)}
const V114_recapRowsBase=V103_recapRows;
V103_recapRows=function(r){const out=V114_recapRowsBase(r),details=V114_platformIncomeDetails(r),video=details.reduce((n,x)=>n+V114_num(x.amount),0);if(!video)return out;const generic=out.income.findIndex(([k])=>k==='Other media & commercial'||k==='Media & commercial');if(generic>=0){const left=Math.max(0,V114_num(out.income[generic][1])-video);if(left)out.income[generic][1]=left;else out.income.splice(generic,1)}out.income.push(['Video platform revenue',video]);return out};
const V114_financeRowsBase=financeRows;
financeRows=function(r,full=false){let rows=V114_financeRowsBase(r,full),details=V114_platformIncomeDetails(r);if(full&&details.length){let at=rows.findIndex(([k])=>String(k).includes('media')||String(k).includes('Media'));if(at<0)at=1;for(const x of details)rows.splice(++at,0,[`↳ ${x.name} · ${x.phase}`,money(x.amount)])}return rows};

/* Late routing keeps the new ecosystem out of the already crowded Business HQ. */
if(typeof destinations!=='undefined'&&!destinations.some(x=>x[2]==='Platforms'))destinations.splice(Math.max(0,destinations.findIndex(x=>x[2]==='Campaigns')),0,['Music platforms','Music','Platforms','Separate streaming and video artist profiles',3]);
const V114_openDestinationBase=openDestination;
openDestination=function(id){if(id==='Platforms'){careerTab='Platforms';tab='Career';render();window.scrollTo?.(0,0);return}return V114_openDestinationBase(id)};
const V114_careerBase=career;
career=function(){if(careerTab==='Platforms')return V114_platformPage();return V114_careerBase()};
