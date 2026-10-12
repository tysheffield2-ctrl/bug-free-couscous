/* ENCORE AI Industry — persistent generations, strategy, career turnover and chart depth.
   Artists keep permanent IDs and catalogs for save/reference safety. Retirement stops new
   releases without deleting history; comebacks reuse the same identity. Synthetic chart
   rows are a shrinking depth floor while persistent careers become the actual competition. */
const AI_INDUSTRY_SCHEMA=2;
const AI_ENTRY_CADENCE=13;
const AI_FIRST_ENTRY_WEEK=26;
const AI_WORLD_MAX=180;
const AI_RETIRE_MIN_WEEKS=520;
const AI_CITY_IDS=['austin','atlanta','la','nyc','nashville','miami','chicago','seattle','houston','dallas','detroit','neworleans'];
const AI_STRATEGIES=[
 {id:'steady',name:'Steady builder',cadence:[5,9],releaseLift:1,collab:.06,description:'Consistent releases with measured risk.'},
 {id:'prolific',name:'Prolific',cadence:[3,6],releaseLift:.96,collab:.10,description:'Releases often, accepting more uneven results.'},
 {id:'perfectionist',name:'Perfectionist',cadence:[8,14],releaseLift:1.10,collab:.035,description:'Longer gaps in exchange for stronger execution.'},
 {id:'collaborative',name:'Connector',cadence:[4,8],releaseLift:1.02,collab:.24,description:'Builds eras through features and scene relationships.'},
 {id:'era-builder',name:'Era builder',cadence:[6,11],releaseLift:1.06,collab:.09,description:'Slower campaigns built around bigger chapters.'}
];

function aiInitialGenreHeat(){return Object.fromEntries(genres.map(g=>[g,1]))}
function aiStrategyFor(a){
 const c=a.aiCareer||{},found=AI_STRATEGIES.find(x=>x.id===c.strategy);if(found)return found;
 const pick=AI_STRATEGIES[Math.abs((a.id*7+(c.generation||0)*3))%AI_STRATEGIES.length];c.strategy=pick.id;return pick
}
function aiCareerStage(a,c=a.aiCareer||{}){
  if(c.status==='retired')return 'Legacy';
  if(c.status==='comeback')return 'Comeback';
  const age=aiCareerAge(a,c),peak=Math.max(1,c.peakFans||a.fans||1),ratio=(a.fans||0)/peak;
  if(age<52)return 'Newcomer';
  if(age<156)return (a.fans||0)>=250000?'Breakout':'Rising';
  if(age<520)return ratio<.3?'Rebuild':'Prime';
  if(age<780)return ratio<.2?'Late-career rebuild':'Veteran';
  return ratio<.15?'Legacy transition':'Legacy run'
}
function migrateAiIndustry(){
  if(!s.aiIndustry)s.aiIndustry={version:AI_INDUSTRY_SCHEMA,lastSpawnWeek:Math.min(s.week,1),lastLifecycleWeek:Math.min(s.week,1),lastTrendWeek:Math.min(s.week,1),genreHeat:aiInitialGenreHeat(),debuts:[],retirements:[],comebacks:[],signings:[],events:[]};
  const z=s.aiIndustry;z.version=AI_INDUSTRY_SCHEMA;
  z.genreHeat??=aiInitialGenreHeat();for(const g of genres)if(!Number.isFinite(z.genreHeat[g]))z.genreHeat[g]=1;
  for(const key of ['debuts','retirements','comebacks','signings','events'])if(!Array.isArray(z[key]))z[key]=[];
  z.lastSpawnWeek=Number.isFinite(z.lastSpawnWeek)?z.lastSpawnWeek:1;
  z.lastLifecycleWeek=Number.isFinite(z.lastLifecycleWeek)?z.lastLifecycleWeek:1;
  z.lastTrendWeek=Number.isFinite(z.lastTrendWeek)?z.lastTrendWeek:1;
  for(const a of s.world){
    a.aiCareer??={};const c=a.aiCareer;
    c.generation=Number.isInteger(c.generation)?c.generation:0;
    c.debutWeek=Number.isFinite(c.debutWeek)?c.debutWeek:Math.min(1,a.catalog?.[0]?.week??1);
    c.peakFans=Math.max(Number(c.peakFans)||0,Number(a.fans)||0);
    c.status=['active','retired','comeback'].includes(c.status)?c.status:'active';
    c.comebacks=Math.max(0,Math.round(Number(c.comebacks)||0));
    c.connections=Array.isArray(c.connections)?c.connections.filter(x=>x&&Number.isInteger(x.artist)&&x.artist!==a.id).slice(-20):[];
    c.strategy=AI_STRATEGIES.some(x=>x.id===c.strategy)?c.strategy:AI_STRATEGIES[Math.abs((a.id*7+c.generation*3))%AI_STRATEGIES.length].id;
    c.stage=aiCareerStage(a,c);c.lastStage??=c.stage;c.lastHeadlineWeek=Number.isFinite(c.lastHeadlineWeek)?c.lastHeadlineWeek:-999;
    if(c.status==='retired')a.nextRelease=Number.MAX_SAFE_INTEGER;
  }
  return z
}
function aiCurrentGeneration(week=s.week){return Math.max(1,Math.floor(Math.max(0,week-1)/260)+1)}
function aiCareerAge(a,c=a.aiCareer||{}){return Math.max(0,s.week-(c.debutWeek??s.week))}
function aiHeadline(a,title,body,tone='news'){
  const z=migrateAiIndustry(),c=a?.aiCareer;if(!a||!c)return;
  z.events.unshift({artist:a.id,week:s.week,title,body,tone});z.events=z.events.slice(0,180);c.lastHeadlineWeek=s.week;
  if(typeof V082_pushHeadline==='function')V082_pushHeadline(a,title,body,tone)
}
function aiUniqueArtistName(){
  const used=new Set(s.world.map(a=>String(a.name).toLowerCase()));let name='';
  for(let i=0;i<12;i++){name=generate('artist');if(!used.has(String(name).toLowerCase()))return name}
  return `${name||'New Artist'} ${s.world.length+1}`
}
function aiWeightedGenre(){
  const z=migrateAiIndustry(),weights=genres.map(g=>Math.max(.2,z.genreHeat[g]||1)),total=weights.reduce((n,x)=>n+x,0);let roll=Math.random()*total;
  for(let i=0;i<genres.length;i++){roll-=weights[i];if(roll<=0)return genres[i]}
  return genres.at(-1)
}
function aiCreateArtist(){
  const z=migrateAiIndustry();if(s.world.length>=AI_WORLD_MAX)return null;
  const id=s.world.length,genre=aiWeightedGenre(),heat=clamp(z.genreHeat[genre]||1,.65,1.5),generation=aiCurrentGeneration();
  const fans=Math.max(40,Math.round(Math.pow(10,rand(1.7,4.25))*Math.pow(heat,.8)));
  const skill=Math.round(clamp(rand(34,63)+Math.log10(1+fans)*2+Math.max(0,heat-1)*8,20,82));
  const reputation=Math.round(clamp(rand(6,18)+Math.log10(1+fans)*2.2,3,35));
  const city=AI_CITY_IDS[(id+generation*3)%AI_CITY_IDS.length],factor=reception(skill)*(.9+Math.max(-.12,heat-1)*.35),streams=Math.max(100,Math.round(fans*rand(.55,1.2)*factor));
  const strategy=AI_STRATEGIES[Math.abs((id*7+generation*3))%AI_STRATEGIES.length].id;
  const artist={id,name:aiUniqueArtistName(),genre,fans,skill,reputation,relation:0,lastTalk:0,lastNegotiate:0,discount:0,nextRelease:s.week+Math.round(rand(3,8)),nextCatalogId:1,hometown:city,currentCity:city,catalog:[{uid:0,title:generate('song'),type:'Single',week:s.week,base:Math.round(fans*.8),streams,total:streams,factor,aiStrategy:strategy,genreClimate:heat}],weekly:streams,aiCareer:{generation,debutWeek:s.week,peakFans:fans,status:'active',stage:'Newcomer',lastStage:'Newcomer',comebacks:0,strategy,connections:[],lastHeadlineWeek:-999}};
  s.world.push(artist);z.debuts.unshift({artist:id,week:s.week,generation,genre,city,strategy});z.debuts=z.debuts.slice(0,240);
  aiHeadline(artist,'A new career enters the scene',artist.name+' is emerging from '+(careerWorldMarket?.(city)?.city||city)+' with a '+aiStrategyFor(artist).name.toLowerCase()+' approach.','up');
  return artist
}
function aiSpawnEntrants(){
  const z=migrateAiIndustry();if(s.week<AI_FIRST_ENTRY_WEEK||s.week-z.lastSpawnWeek<AI_ENTRY_CADENCE||s.world.length>=AI_WORLD_MAX)return [];
  z.lastSpawnWeek=s.week;
  const active=s.world.filter(a=>a.aiCareer?.status!=='retired').length,count=active<32?2:1,out=[];
  for(let i=0;i<count&&s.world.length<AI_WORLD_MAX;i++){const a=aiCreateArtist();if(a)out.push(a)}
  if(out.length&&typeof migrateIndustryLife==='function'){migrateIndustryLife();for(const a of out)aiMaybeSignLabel(a)}
  return out
}
function aiUpdateGenreHeat(force=false){
  const z=migrateAiIndustry();if(!force&&s.week-z.lastTrendWeek<AI_ENTRY_CADENCE)return z.genreHeat;z.lastTrendWeek=s.week;
  const next={};
  for(const g of genres){
    const artists=s.world.filter(a=>a.genre===g&&a.aiCareer?.status!=='retired'),weekly=artists.reduce((n,a)=>n+(a.weekly||0),0),active=artists.filter(a=>s.week-(a.catalog?.at(-1)?.week??-999)<26).length;
    const signal=.9+Math.min(.28,Math.log10(1+weekly)/38)+Math.min(.12,active/120),prior=z.genreHeat[g]||1;
    next[g]=clamp(prior*.76+signal*.24+rand(-.055,.055),.65,1.5)
  }
  const mean=genres.reduce((n,g)=>n+next[g],0)/genres.length;
  for(const g of genres)z.genreHeat[g]=clamp(next[g]/Math.max(.01,mean),.65,1.5);
  return z.genreHeat
}
function aiLabelFit(a,i){const d=labelDeals?.[i];if(!d)return 0;let score=1+(d.genres?.includes(a.genre)?1.5:!d.genres?.length?.6:-.15);score+=(a.reputation||0)/180;score+=Math.log10(1+(a.fans||0))/12;return score}
function aiSyncLabelState(a){
  const c=a.aiCareer;if(!c)return;
  if(typeof ownerContracts==='function'&&ownerContracts().some(x=>x.artist===a.id)){c.labelMode='player-label';c.labelId=null;return}
  const deal=s.labelLeague?.contracts?.[a.id];if(deal){c.labelMode='signed';c.labelId=deal.label}else{c.labelMode='independent';c.labelId=null}
}
function aiMaybeSignLabel(a,force=false){
  if(!a?.aiCareer||a.aiCareer.status==='retired'||typeof migrateIndustryLife!=='function')return false;migrateIndustryLife();aiSyncLabelState(a);
  const c=a.aiCareer;if(c.labelMode!=='independent')return false;
  const leverage=Math.log10(1+(a.fans||0))*8+(a.reputation||0)*.45+(c.stage==='Breakout'?12:c.stage==='Prime'?8:0);
  if(!force&&Math.random()>clamp((leverage-20)/180,.015,.28))return false;
  const candidates=(s.labelLeague?.labels||[]).map((l,i)=>({i,l,fit:aiLabelFit(a,i)})).filter(x=>x.l.budget>=1000).sort((x,y)=>y.fit-x.fit);
  if(!candidates.length)return false;const top=candidates.slice(0,Math.min(3,candidates.length)),choice=top[Math.floor(Math.random()*top.length)],advance=Math.max(1000,Math.round((a.fans||0)*.04*(1+(a.reputation||0)/100)));
  if(choice.l.budget<advance)return false;choice.l.budget-=advance;s.labelLeague.contracts[a.id]={label:choice.i,ends:s.week+52,share:.2,advance,aiGenerated:true};c.labelMode='signed';c.labelId=choice.i;
  const z=migrateAiIndustry();z.signings.unshift({artist:a.id,label:choice.i,week:s.week,advance});z.signings=z.signings.slice(0,180);s.labelLeague.news?.unshift(a.name+' signed with '+labelDeals[choice.i].name+'.');if(s.labelLeague.news)s.labelLeague.news=s.labelLeague.news.slice(0,30);
  aiHeadline(a,'A label joins the next chapter',a.name+' signed with '+labelDeals[choice.i].name+' as the career moves into '+c.stage.toLowerCase()+'.','news');return true
}
function aiRecordCollaboration(a,b){
  if(!a?.aiCareer||!b?.aiCareer||a.id===b.id)return;for(const [left,right] of [[a,b],[b,a]]){const list=left.aiCareer.connections,found=list.find(x=>x.artist===right.id);if(found){found.collaborations++;found.lastWeek=s.week}else{list.push({artist:right.id,collaborations:1,lastWeek:s.week});left.aiCareer.connections=list.slice(-20)}}
}
function aiCollabCandidate(a,spec){
  if(Math.random()>=spec.collab)return null;const pool=s.world.filter(x=>x.id!==a.id&&x.aiCareer?.status!=='retired'&&(x.genre===a.genre||Math.abs(Math.log10(1+x.fans)-Math.log10(1+a.fans))<1.2));if(!pool.length)return null;return pool[Math.floor(Math.random()*pool.length)]
}
function aiReleaseStageLift(stage){return stage==='Breakout'?1.08:stage==='Prime'?1.05:stage==='Comeback'?1.09:stage.includes('Rebuild')?.92:stage.includes('Legacy')?.95:stage==='Veteran'?.97:1}
function aiAfterRelease(a,newItems){
  const c=a.aiCareer,spec=aiStrategyFor(a),heat=clamp(migrateAiIndustry().genreHeat[a.genre]||1,.65,1.5),climate=.88+heat*.12,stageLift=aiReleaseStageLift(c.stage),collab=aiCollabCandidate(a,spec),collabLift=collab?1+clamp(Math.log10(1+collab.fans)/75,.035,.15):1;
  const multiplier=clamp(spec.releaseLift*climate*stageLift*collabLift,.68,1.45);let deltaStreams=0;
  for(const x of newItems){const before=x.streams||0,after=Math.max(1,Math.round(before*multiplier));x.streams=after;x.total=Math.max(after,Math.round((x.total||before)*multiplier));x.factor=(x.factor||1)*multiplier;x.aiStrategy=spec.id;x.genreClimate=heat;x.careerStage=c.stage;if(collab){x.collaborator=collab.id;x.collaboratorName=collab.name}deltaStreams+=after-before}
  if(deltaStreams){const fanDelta=Math.round(deltaStreams*.009/(1+(a.fans||0)/250000000));a.fans=Math.max(0,a.fans+fanDelta)}
  if(collab)aiRecordCollaboration(a,collab);a.weekly=a.catalog.reduce((n,x)=>n+(x.streams||0),0);
  const [lo,hi]=spec.cadence;a.nextRelease=s.week+Math.round(rand(lo,hi));c.peakFans=Math.max(c.peakFans||0,a.fans||0);
  const primary=newItems.find(x=>x.type==='Album')||newItems[0];if(primary&&primary.factor>=1.65&&s.week-c.lastHeadlineWeek>=13)aiHeadline(a,'A release breaks through',a.name+' is outperforming expectations with “'+primary.title+'”'+(collab?' alongside '+collab.name:'')+'.','up')
}
function aiLegacySummary(a){
  const c=a.aiCareer,records=Object.entries(s.chartBook?.songs?.records||{}).filter(([k])=>k.startsWith('npc:s:'+a.id+':')).map(([,r])=>r),biggest=(a.catalog||[]).reduce((best,x)=>!best||(x.total||0)>(best.total||0)?x:best,null);
  return {peakFans:Math.max(c.peakFans||0,a.fans||0),totalStreams:(a.catalog||[]).reduce((n,x)=>n+(x.total||0),0),biggestTitle:biggest?.title||null,biggestStreams:biggest?.total||0,bestPeak:records.length?Math.min(...records.map(r=>r.peak||999).filter(Number.isFinite)):null,numberOneWeeks:records.reduce((n,r)=>n+(r.numberOneWeeks||0),0),releases:(a.catalog||[]).filter(x=>['Single','Album'].includes(x.type)).length,careerWeeks:Math.max(0,s.week-(c.debutWeek||1)),retiredWeek:s.week}
}
function aiRetirementChance(a){
  const c=a.aiCareer;if(!c||c.status==='retired')return 0;const age=aiCareerAge(a,c);if(age<AI_RETIRE_MIN_WEEKS)return 0;
  const latest=a.catalog?.at(-1),inactive=Math.max(0,s.week-(latest?.week??s.week)),ratio=(a.fans||0)/Math.max(1,c.peakFans||a.fans||1);
  let chance=.004+Math.max(0,age-AI_RETIRE_MIN_WEEKS)/260*.006;
  if(inactive>52)chance+=.018;if(inactive>104)chance+=.025;if(ratio<.35)chance+=.012;if(ratio<.15)chance+=.022;if(age>1040)chance+=.03;
  return clamp(chance,0,.16)
}
function retireIndustryArtist(a,reason='career wind-down'){
  const z=migrateAiIndustry(),c=a?.aiCareer;if(!a||!c||c.status==='retired')return false;
  c.legacy=aiLegacySummary(a);c.status='retired';c.retiredWeek=s.week;c.stage='Legacy';c.peakFans=Math.max(c.peakFans||0,a.fans||0);c.preRetirementNextRelease=a.nextRelease;a.nextRelease=Number.MAX_SAFE_INTEGER;
  if(s.labelLeague?.contracts?.[a.id]){c.lastLabelId=s.labelLeague.contracts[a.id].label;delete s.labelLeague.contracts[a.id]}c.labelMode='retired';c.labelId=null;
  z.retirements.unshift({artist:a.id,week:s.week,peakFans:c.peakFans,generation:c.generation,reason,legacy:c.legacy});z.retirements=z.retirements.slice(0,240);
  aiHeadline(a,'A career enters its legacy chapter',a.name+' stepped away after '+c.legacy.releases+' releases, '+compact(c.legacy.totalStreams)+' catalog streams and a peak audience of '+compact(c.legacy.peakFans)+'.','quiet');return true
}
function comebackIndustryArtist(a){
  const z=migrateAiIndustry(),c=a?.aiCareer;if(!a||!c||c.status!=='retired')return false;
  c.status='comeback';c.comebacks=(c.comebacks||0)+1;c.comebackWeek=s.week;c.stage='Comeback';c.labelMode='independent';delete c.retiredWeek;
  a.fans=Math.max(a.fans,Math.round((c.peakFans||a.fans||0)*.04));a.reputation=clamp((a.reputation||0)+3,0,100);a.nextRelease=s.week+Math.round(rand(2,7));
  z.comebacks.unshift({artist:a.id,week:s.week,generation:c.generation,count:c.comebacks});z.comebacks=z.comebacks.slice(0,160);aiHeadline(a,'A comeback is underway',a.name+' is returning to the active industry with the same catalog, history and identity.','up');return true
}
function aiSettleLifecycle(){
  const z=migrateAiIndustry();if(s.week-z.lastLifecycleWeek<AI_ENTRY_CADENCE)return;z.lastLifecycleWeek=s.week;aiUpdateGenreHeat();
  for(const a of s.world){const c=a.aiCareer;c.peakFans=Math.max(c.peakFans||0,a.fans||0);aiSyncLabelState(a);
    if(c.status==='retired'){
      a.nextRelease=Number.MAX_SAFE_INTEGER;const away=s.week-(c.retiredWeek??s.week),eligible=away>=104&&(c.peakFans||0)>=25000;if(eligible&&Math.random()<.006)comebackIndustryArtist(a);continue
    }
    if(c.status==='comeback'&&s.week-(c.comebackWeek??s.week)>=26)c.status='active';
    const prior=c.stage;c.stage=aiCareerStage(a,c);if(prior!==c.stage){c.lastStage=prior;if(['Breakout','Prime','Veteran'].includes(c.stage)&&s.week-c.lastHeadlineWeek>=13)aiHeadline(a,c.stage+' chapter',a.name+' has moved from '+prior.toLowerCase()+' into '+c.stage.toLowerCase()+'.',c.stage==='Breakout'?'up':'news')}
    if(c.labelMode==='independent')aiMaybeSignLabel(a);
    if(Math.random()<aiRetirementChance(a))retireIndustryArtist(a,c.stage.includes('rebuild')?'audience decline':'career wind-down')
  }
}
function aiPrepareWorldWeek(){migrateAiIndustry();for(const a of s.world)if(a.aiCareer?.status==='retired')a.nextRelease=Number.MAX_SAFE_INTEGER;aiSpawnEntrants()}
const AI_worldWeekBase=worldWeek;
worldWeek=function(){
  aiPrepareWorldWeek();const before=new Map(s.world.map(a=>[a.id,a.catalog.length]));AI_worldWeekBase();
  for(const a of s.world){const c=a.aiCareer;if(!c)continue;const prior=before.get(a.id);if(Number.isInteger(prior)&&a.catalog.length>prior)aiAfterRelease(a,a.catalog.slice(prior));c.peakFans=Math.max(c.peakFans||0,a.fans||0);c.stage=aiCareerStage(a,c)}
  aiSettleLifecycle()
};

/* Synthetic song entries shrink as persistent careers become capable of filling the chart. */
const AI_widerIndustryBase=widerIndustry;
widerIndustry=function(){
  migrateAiIndustry();
  const persistent=s.world.reduce((n,a)=>n+a.catalog.filter(x=>x.type==='Single'&&x.streams>=CHART_FLOOR).length,0)+s.songs.filter(x=>x.released&&x.streams>=CHART_FLOOR).length;
  const needed=Math.max(0,CHART_SIZE-persistent);if(!needed)return [];
  return AI_widerIndustryBase().filter(x=>x.streams>=CHART_FLOOR).slice(0,needed)
};

/* Albums use the same rule: background records are only a depth floor, not the permanent world. */
compileAlbums=function(){
  const week=s.chartWeek??1;
  const persistent=s.world.flatMap(a=>a.catalog.map((x,i)=>({...x,key:'npc:a:'+a.id+':'+(x.uid??i),artist:a.name,releaseWeek:x.week,streams:x.streams+a.catalog.filter(t=>t.albumIndex===i).reduce((n,t)=>n+t.streams,0)})).filter(x=>x.type==='Album'))
    .concat(s.albums.filter(a=>a.week<=week&&(albumStreams(a)>0||a.weeklySales>0)).map(a=>({...a,key:'you:a:'+a.id,artist:s.name,releaseWeek:a.week,streams:albumStreams(a),total:albumStreams(a,true),type:'Album',you:true})))
    .map(x=>({...x,units:Math.floor(x.streams/1500)+(x.you?(x.weeklySales||0):0)})).filter(x=>x.units>=1000);
  const needed=Math.max(0,50-persistent.length),backdrop=Array.from({length:Math.min(80,needed)},(_,i)=>{let era=Math.floor((week+i%16)/16);return {key:'bg:a:'+i+':'+era,title:titles.album[0][(i+era)%10]+' '+titles.album[1][(Math.floor(i/10)+era)%10],artist:seeds[i%seeds.length][0],releaseWeek:era*16-i%16,background:true,streams:Math.round((1200000+180000000*Math.pow(1-i/80,3))*(.8+.2*Math.sin(week*.4+i))),type:'Album'}}).map(x=>({...x,units:Math.floor(x.streams/1500)}));
  return backdrop.concat(persistent).sort((a,b)=>b.units-a.units||a.key.localeCompare(b.key)).slice(0,50)
};

function aiLabelName(a){aiSyncLabelState(a);const c=a.aiCareer;if(c.labelMode==='player-label')return s.labelBusiness?.company?.name||'Your label';if(Number.isInteger(c.labelId)&&labelDeals[c.labelId])return labelDeals[c.labelId].name;return c.status==='retired'?'Legacy / inactive':'Independent'}
function aiIndustryPanel(){
  const z=migrateAiIndustry(),active=s.world.filter(a=>a.aiCareer?.status!=='retired'),retired=s.world.length-active.length,generation=aiCurrentGeneration(),yearStart=s.week-51,recentDebuts=z.debuts.filter(x=>x.week>=yearStart),hot=genres.map(g=>[g,z.genreHeat[g]||1]).sort((a,b)=>b[1]-a[1]).slice(0,4),newest=z.debuts.slice(0,5),legacy=z.retirements.slice(0,5);
  return `<section class="card ai-industry-generation"><div class="sectionhead"><div><span class="eyebrow">INDUSTRY GENERATIONS</span><h2>The world keeps replacing itself.</h2></div><span class="pill">Generation ${generation}</span></div><p>Artists debut with distinct career strategies, react to genre climate, sign and move through the label economy, age into legacy careers and can return without losing their history. Synthetic chart entries shrink as persistent careers become deep enough to replace them.</p>${metricRail([['Persistent artists',String(s.world.length)],['Active careers',String(active.length)],['Legacy / retired',String(retired)],['Debuts · last 52 weeks',String(recentDebuts.length)]])}<div class="grid"><div><h3>Genre climate</h3>${hot.map(([g,v])=>`<div class="row"><span>${esc(g)}</span><strong>${v>=1?'↑':'↓'} ${(v*100).toFixed(0)}</strong></div>`).join('')}</div><div><h3>Newest careers</h3>${newest.map(x=>{const a=s.world[x.artist];return a?`<button class="row" onclick="profile(${a.id})"><span>${esc(a.name)} · ${esc(a.genre)}</span><strong>${esc(aiStrategyFor(a).name)}</strong></button>`:''}).join('')||'<p class="fine">The first new generation begins after the opening months.</p>'}</div></div>${legacy.length?`<details><summary>Recent legacy transitions</summary>${legacy.map(x=>{const a=s.world[x.artist];return `<div class="row"><span>${esc(a?.name||'Artist')} · Week ${x.week}</span><strong>${compact(x.legacy?.totalStreams||0)} catalog streams</strong></div>`}).join('')}</details>`:''}</section>`
}
if(typeof V082_worldPulsePage==='function'){
  const AI_worldPulseBase=V082_worldPulsePage;
  V082_worldPulsePage=function(){return AI_worldPulseBase()+aiIndustryPanel()}
}

const AI_profileBase=profile;
profile=function(id){
  AI_profileBase(id);const a=s.world[id],el=$('modal');if(!a?.aiCareer||!el?.open)return;const c=a.aiCareer,spec=aiStrategyFor(a),legacy=c.legacy;
  el.innerHTML+=`<section class="card"><span class="eyebrow">PERSISTENT CAREER · GENERATION ${c.generation}</span><h3>${esc(c.stage)}</h3>${profileRows([['Career strategy',spec.name],['Industry status',c.status==='retired'?'Legacy / retired':c.status==='comeback'?'Comeback active':'Active'],['Label',aiLabelName(a)],['Peak audience',compact(c.peakFans||a.fans)],['Career age',Math.floor(aiCareerAge(a,c)/52)+' years'],['Known collaborators',String(c.connections.length)]])}<p class="fine">${esc(spec.description)} This identity, catalog and shared history persist even if the artist retires or later returns.</p>${legacy?`<details><summary>Legacy record</summary>${profileRows([['Career releases',String(legacy.releases)],['Catalog streams',compact(legacy.totalStreams)],['Biggest release',legacy.biggestTitle||'—'],['Best song-chart peak',legacy.bestPeak&&legacy.bestPeak<999?'#'+legacy.bestPeak:'—'],['#1 weeks',String(legacy.numberOneWeeks)]])}</details>`:''}</section>`
};

function validateAiIndustry(){
  const z=migrateAiIndustry();
  if(z.version!==AI_INDUSTRY_SCHEMA||!Array.isArray(z.debuts)||!Array.isArray(z.retirements)||!Array.isArray(z.comebacks)||!Array.isArray(z.signings)||!Array.isArray(z.events)||!z.genreHeat)throw Error('Invalid AI industry state');
  for(const g of genres)if(!Number.isFinite(z.genreHeat[g])||z.genreHeat[g]<.5||z.genreHeat[g]>1.75)throw Error('Invalid genre climate');
  if(s.world.length>AI_WORLD_MAX)throw Error('AI industry roster exceeds supported size');
  s.world.forEach((a,i)=>{const c=a.aiCareer;if(a.id!==i||!c||!Number.isInteger(c.generation)||!Number.isFinite(c.debutWeek)||!Number.isFinite(c.peakFans)||c.peakFans<0||!['active','retired','comeback'].includes(c.status)||typeof c.stage!=='string'||!AI_STRATEGIES.some(x=>x.id===c.strategy)||!Array.isArray(c.connections)||c.connections.length>20)throw Error('Invalid persistent artist career');for(const x of c.connections)if(!s.world[x.artist]||!Number.isInteger(x.collaborations)||x.collaborations<1||!Number.isFinite(x.lastWeek))throw Error('Invalid AI collaboration history')})
}
const AI_validatePresentationBase=validatePresentationState;
validatePresentationState=function(){AI_validatePresentationBase();validateAiIndustry()};