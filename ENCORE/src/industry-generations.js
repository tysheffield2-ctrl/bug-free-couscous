/* ENCORE AI Industry Generations — persistent careers, turnover and chart-depth replacement.
   Artists keep permanent IDs and catalogs for save/reference safety. Retirement stops new
   releases without deleting history; comebacks reuse the same identity. Synthetic chart
   rows now act only as a shrinking depth floor while persistent careers grow. */
const AI_INDUSTRY_SCHEMA=1;
const AI_ENTRY_CADENCE=13;
const AI_FIRST_ENTRY_WEEK=26;
const AI_WORLD_MAX=180;
const AI_RETIRE_MIN_WEEKS=520;
const AI_CITY_IDS=['austin','atlanta','la','nyc','nashville','miami','chicago','seattle','houston','dallas','detroit','neworleans'];

function aiInitialGenreHeat(){return Object.fromEntries(genres.map(g=>[g,1]))}
function migrateAiIndustry(){
  if(!s.aiIndustry)s.aiIndustry={version:AI_INDUSTRY_SCHEMA,lastSpawnWeek:Math.min(s.week,1),lastLifecycleWeek:Math.min(s.week,1),lastTrendWeek:Math.min(s.week,1),genreHeat:aiInitialGenreHeat(),debuts:[],retirements:[],comebacks:[]};
  const z=s.aiIndustry;z.version=AI_INDUSTRY_SCHEMA;
  z.genreHeat??=aiInitialGenreHeat();for(const g of genres)if(!Number.isFinite(z.genreHeat[g]))z.genreHeat[g]=1;
  z.debuts??=[];z.retirements??=[];z.comebacks??=[];
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
    c.stage=aiCareerStage(a,c);
    if(c.status==='retired')a.nextRelease=Number.MAX_SAFE_INTEGER;
  }
  return z
}
function aiCurrentGeneration(week=s.week){return Math.max(1,Math.floor(Math.max(0,week-1)/260)+1)}
function aiCareerAge(a,c=a.aiCareer||{}){return Math.max(0,s.week-(c.debutWeek??s.week))}
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
  const artist={id,name:aiUniqueArtistName(),genre,fans,skill,reputation,relation:0,lastTalk:0,lastNegotiate:0,discount:0,nextRelease:s.week+Math.round(rand(3,8)),nextCatalogId:1,hometown:city,currentCity:city,catalog:[{uid:0,title:generate('song'),type:'Single',week:s.week,base:Math.round(fans*.8),streams,total:streams,factor}],weekly:streams,aiCareer:{generation,debutWeek:s.week,peakFans:fans,status:'active',stage:'Newcomer',comebacks:0}};
  s.world.push(artist);z.debuts.unshift({artist:id,week:s.week,generation,genre,city});z.debuts=z.debuts.slice(0,240);
  return artist
}
function aiSpawnEntrants(){
  const z=migrateAiIndustry();if(s.week<AI_FIRST_ENTRY_WEEK||s.week-z.lastSpawnWeek<AI_ENTRY_CADENCE||s.world.length>=AI_WORLD_MAX)return [];
  z.lastSpawnWeek=s.week;
  const active=s.world.filter(a=>a.aiCareer?.status!=='retired').length,count=active<32?2:1,out=[];
  for(let i=0;i<count&&s.world.length<AI_WORLD_MAX;i++){const a=aiCreateArtist();if(a)out.push(a)}
  if(out.length&&typeof migrateIndustryLife==='function')migrateIndustryLife();
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
function aiRetirementChance(a){
  const c=a.aiCareer;if(!c||c.status==='retired')return 0;const age=aiCareerAge(a,c);if(age<AI_RETIRE_MIN_WEEKS)return 0;
  const latest=a.catalog?.at(-1),inactive=Math.max(0,s.week-(latest?.week??s.week)),ratio=(a.fans||0)/Math.max(1,c.peakFans||a.fans||1);
  let chance=.004+Math.max(0,age-AI_RETIRE_MIN_WEEKS)/260*.006;
  if(inactive>52)chance+=.018;if(inactive>104)chance+=.025;if(ratio<.35)chance+=.012;if(ratio<.15)chance+=.022;if(age>1040)chance+=.03;
  return clamp(chance,0,.16)
}
function retireIndustryArtist(a,reason='career wind-down'){
  const z=migrateAiIndustry(),c=a?.aiCareer;if(!a||!c||c.status==='retired')return false;
  c.status='retired';c.retiredWeek=s.week;c.stage='Legacy';c.peakFans=Math.max(c.peakFans||0,a.fans||0);c.preRetirementNextRelease=a.nextRelease;a.nextRelease=Number.MAX_SAFE_INTEGER;
  z.retirements.unshift({artist:a.id,week:s.week,peakFans:c.peakFans,generation:c.generation,reason});z.retirements=z.retirements.slice(0,240);return true
}
function comebackIndustryArtist(a){
  const z=migrateAiIndustry(),c=a?.aiCareer;if(!a||!c||c.status!=='retired')return false;
  c.status='comeback';c.comebacks=(c.comebacks||0)+1;c.comebackWeek=s.week;c.stage='Comeback';delete c.retiredWeek;
  a.fans=Math.max(a.fans,Math.round((c.peakFans||a.fans||0)*.04));a.reputation=clamp((a.reputation||0)+3,0,100);a.nextRelease=s.week+Math.round(rand(2,7));
  z.comebacks.unshift({artist:a.id,week:s.week,generation:c.generation,count:c.comebacks});z.comebacks=z.comebacks.slice(0,160);return true
}
function aiSettleLifecycle(){
  const z=migrateAiIndustry();if(s.week-z.lastLifecycleWeek<AI_ENTRY_CADENCE)return;z.lastLifecycleWeek=s.week;aiUpdateGenreHeat();
  for(const a of s.world){const c=a.aiCareer;c.peakFans=Math.max(c.peakFans||0,a.fans||0);
    if(c.status==='retired'){
      a.nextRelease=Number.MAX_SAFE_INTEGER;
      const away=s.week-(c.retiredWeek??s.week),eligible=away>=104&&(c.peakFans||0)>=25000;
      if(eligible&&Math.random()<.006)comebackIndustryArtist(a);
      continue
    }
    if(c.status==='comeback'&&s.week-(c.comebackWeek??s.week)>=26)c.status='active';
    c.stage=aiCareerStage(a,c);
    if(Math.random()<aiRetirementChance(a))retireIndustryArtist(a,c.stage.includes('rebuild')?'audience decline':'career wind-down')
  }
}
function aiPrepareWorldWeek(){
  migrateAiIndustry();
  for(const a of s.world)if(a.aiCareer?.status==='retired')a.nextRelease=Number.MAX_SAFE_INTEGER;
  aiSpawnEntrants()
}
const AI_worldWeekBase=worldWeek;
worldWeek=function(){aiPrepareWorldWeek();AI_worldWeekBase();aiSettleLifecycle();for(const a of s.world){const c=a.aiCareer;if(c){c.peakFans=Math.max(c.peakFans||0,a.fans||0);c.stage=aiCareerStage(a,c)}}};

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

function aiIndustryPanel(){
  const z=migrateAiIndustry(),active=s.world.filter(a=>a.aiCareer?.status!=='retired'),retired=s.world.length-active.length,generation=aiCurrentGeneration(),yearStart=s.week-51,recentDebuts=z.debuts.filter(x=>x.week>=yearStart),hot=genres.map(g=>[g,z.genreHeat[g]||1]).sort((a,b)=>b[1]-a[1]).slice(0,4),newest=z.debuts.slice(0,5),legacy=z.retirements.slice(0,5);
  return `<section class="card ai-industry-generation"><div class="sectionhead"><div><span class="eyebrow">INDUSTRY GENERATIONS</span><h2>The world keeps replacing itself.</h2></div><span class="pill">Generation ${generation}</span></div><p>Artists now debut, develop, age, wind careers down and occasionally return without losing their catalog or history. Synthetic chart entries shrink as persistent careers become deep enough to replace them.</p>${metricRail([['Persistent artists',String(s.world.length)],['Active careers',String(active.length)],['Legacy / retired',String(retired)],['Debuts · last 52 weeks',String(recentDebuts.length)]])}<div class="grid"><div><h3>Genre climate</h3>${hot.map(([g,v])=>`<div class="row"><span>${esc(g)}</span><strong>${v>=1?'↑':'↓'} ${(v*100).toFixed(0)}</strong></div>`).join('')}</div><div><h3>Newest careers</h3>${newest.map(x=>{const a=s.world[x.artist];return a?`<button class="row" onclick="profile(${a.id})"><span>${esc(a.name)} · ${esc(a.genre)}</span><strong>Gen ${x.generation}</strong></button>`:''}).join('')||'<p class="fine">The first new generation begins after the opening months.</p>'}</div></div>${legacy.length?`<details><summary>Recent legacy transitions</summary>${legacy.map(x=>{const a=s.world[x.artist];return `<div class="row"><span>${esc(a?.name||'Artist')} · Week ${x.week}</span><strong>${compact(x.peakFans)} peak fans</strong></div>`}).join('')}</details>`:''}</section>`
}
if(typeof V082_worldPulsePage==='function'){
  const AI_worldPulseBase=V082_worldPulsePage;
  V082_worldPulsePage=function(){return AI_worldPulseBase()+aiIndustryPanel()}
}

function validateAiIndustry(){
  const z=migrateAiIndustry();
  if(z.version!==AI_INDUSTRY_SCHEMA||!Array.isArray(z.debuts)||!Array.isArray(z.retirements)||!Array.isArray(z.comebacks)||!z.genreHeat)throw Error('Invalid AI industry state');
  for(const g of genres)if(!Number.isFinite(z.genreHeat[g])||z.genreHeat[g]<.5||z.genreHeat[g]>1.75)throw Error('Invalid genre climate');
  if(s.world.length>AI_WORLD_MAX)throw Error('AI industry roster exceeds supported size');
  s.world.forEach((a,i)=>{const c=a.aiCareer;if(a.id!==i||!c||!Number.isInteger(c.generation)||!Number.isFinite(c.debutWeek)||!Number.isFinite(c.peakFans)||c.peakFans<0||!['active','retired','comeback'].includes(c.status)||typeof c.stage!=='string')throw Error('Invalid persistent artist career')})
}
const AI_validatePresentationBase=validatePresentationState;
validatePresentationState=function(){AI_validatePresentationBase();validateAiIndustry()};
