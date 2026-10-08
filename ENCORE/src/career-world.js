/* ENCORE living career foundation: current heat, geography and regional audience. */
const careerStates=['Slump','Cold','Cooling','Stable','Hot','Dominant'];
const cityStatusNames=['Unknown','Local Buzz','Hometown Favorite','City Star','City Icon','Cultural Institution'];
const regionalMarkets=[
{id:'austin',city:'Austin',state:'Texas',region:'South',genres:['Rock','Country','Indie folk']},
{id:'atlanta',city:'Atlanta',state:'Georgia',region:'South',genres:['Hip-hop','R&B']},
{id:'la',city:'Los Angeles',state:'California',region:'West',genres:['Pop','Hip-hop','Electronic']},
{id:'nyc',city:'New York',state:'New York',region:'Northeast',genres:['Hip-hop','Jazz','Pop']},
{id:'nashville',city:'Nashville',state:'Tennessee',region:'South',genres:['Country','Rock']},
{id:'miami',city:'Miami',state:'Florida',region:'South',genres:['Latin','Electronic','Pop']},
{id:'chicago',city:'Chicago',state:'Illinois',region:'Midwest',genres:['R&B','Jazz','Electronic']},
{id:'seattle',city:'Seattle',state:'Washington',region:'West',genres:['Rock','Indie folk','Electronic']},
{id:'houston',city:'Houston',state:'Texas',region:'South',genres:['Hip-hop','R&B']},
{id:'dallas',city:'Dallas',state:'Texas',region:'South',genres:['Hip-hop','Country','R&B']},
{id:'detroit',city:'Detroit',state:'Michigan',region:'Midwest',genres:['Hip-hop','R&B','Rock']},
{id:'neworleans',city:'New Orleans',state:'Louisiana',region:'South',genres:['Hip-hop','R&B','Jazz']}
];
function marketTemplate(m,home){const homeBoost=home?18:0;return {id:m.id,city:m.city,state:m.state,region:m.region,streams:0,weeklyStreams:0,previousStreams:0,fans:0,awareness:home?20:0,loyalty:home?30:10,demand:home?18:0,culturalConnection:home?20:0,legacy:0,status:0,growth:0}}
function migrateCareerWorld(){migrateIndustryLife?.();const home=s.scene?.city||'austin';if(!s.careerWorld){s.careerWorld={version:1,hometown:home,currentCity:home,momentum:18,publicInterest:12,fanLoyalty:clamp(s.loyalty||20),industryInfluence:clamp((s.reputation||0)*.7),culturalRelevance:8,recognition:clamp(Math.log10(Math.max(1,s.fans||1))*10),tourDemand:10,state:'Stable',stateSince:s.week||1,comeback:false,lastTotalStreams:s.total||0,lastFans:s.fans||0,lastWeek:s.week||1,markets:{},history:[]}}const w=s.careerWorld;w.version=1;w.hometown=w.hometown||home;w.currentCity=s.scene?.city||w.currentCity||home;for(const m of regionalMarkets)if(!w.markets[m.id])w.markets[m.id]=marketTemplate(m,m.id===w.hometown);for(const key of ['momentum','publicInterest','fanLoyalty','industryInfluence','culturalRelevance','recognition','tourDemand'])w[key]=clamp(Number.isFinite(w[key])?w[key]:0);w.history=Array.isArray(w.history)?w.history:[];reconcileRegionalAudience(w);return w}
function careerWorldMarket(id){const w=migrateCareerWorld();return w.markets[id]||w.markets[w.currentCity]||Object.values(w.markets)[0]}
function careerWorldState(score,previous){const bands=[['Slump',0,22],['Cold',22,36],['Cooling',36,49],['Stable',49,65],['Hot',65,83],['Dominant',83,101]];let next=bands.find(x=>score>=x[1]&&score<x[2])?.[0]||'Stable';if(previous&&next!==previous){const pi=careerStates.indexOf(previous),ni=careerStates.indexOf(next);if(Math.abs(pi-ni)>1)next=careerStates[pi+(ni>pi?1:-1)]}return next}
function regionalWeights(track){const w=migrateCareerWorld(),genre=track?.genre||s.genre,totalFans=Math.max(1,Object.values(w.markets).reduce((n,m)=>n+m.fans,0));let weights=regionalMarkets.map(m=>{const x=w.markets[m.id],genreFit=m.genres.includes(genre)?1.35:1,home=m.id===w.hometown?1.65:1,base=.25+x.awareness/55+x.fans/totalFans*4+x.culturalConnection/100;return {id:m.id,weight:Math.max(.05,base*genreFit*home)}});const sum=weights.reduce((n,x)=>n+x.weight,0);return weights.map(x=>({...x,share:x.weight/sum}))}
function recordRegionalStreams(track,streams){if(!streams||streams<1)return;const w=migrateCareerWorld(),weights=regionalWeights(track);let assigned=0;for(let i=0;i<weights.length;i++){const x=weights[i],m=w.markets[x.id],n=i===weights.length-1?Math.max(0,streams-assigned):Math.max(0,Math.floor(streams*x.share));assigned+=n;m.weeklyStreams+=n;m.streams+=n;if(track){track.regionalStreams=track.regionalStreams||{};track.regionalStreams[x.id]=(track.regionalStreams[x.id]||0)+n}}}
function updateRegionalMarkets(){const w=migrateCareerWorld(),weeklyTotal=Object.values(w.markets).reduce((n,m)=>n+m.weeklyStreams,0);for(const m of Object.values(w.markets)){const share=weeklyTotal?m.weeklyStreams/weeklyTotal:0;m.growth=m.previousStreams?Math.round((m.weeklyStreams-m.previousStreams)/Math.max(1,m.previousStreams)*100):m.weeklyStreams?null:0;m.awareness=clamp(m.awareness+Math.min(4,Math.log10(1+m.weeklyStreams)*.45)-(m.weeklyStreams?0:.12));m.loyalty=clamp(m.loyalty+(m.weeklyStreams>m.previousStreams?0.25:-0.05)+(m.id===w.hometown?.08:0));m.demand=clamp(m.awareness*.34+m.loyalty*.22+Math.min(44,Math.log10(1+m.weeklyStreams)*7));if(m.id===w.hometown){m.culturalConnection=clamp(m.culturalConnection+.04+(m.weeklyStreams?Math.min(.3,m.weeklyStreams/500000):0));m.legacy=clamp(m.legacy+Math.min(.12,(s.week||1)/5200)+Math.min(.2,m.streams/2e9))}const cityScore=m.awareness*.25+m.loyalty*.2+m.culturalConnection*.3+m.legacy*.25;m.status=cityScore>=85?5:cityScore>=70?4:cityScore>=53?3:cityScore>=36?2:cityScore>=18?1:0;m.previousStreams=m.weeklyStreams;m.weeklyStreams=0}}
function updateCareerWorld(){const w=migrateCareerWorld(),recent=s.songs.filter(x=>x.released&&s.week-x.released<8),streamGain=Math.max(0,(s.total||0)-(w.lastTotalStreams||0)),fanGain=(s.fans||0)-(w.lastFans||0),recentScore=Math.min(100,Math.log10(1+streamGain)*13),chartScore=Math.min(100,recent.reduce((n,x)=>n+(x.peak?Math.max(0,101-x.peak):0),0)/Math.max(1,recent.length)),activity=recent.length?70:Math.max(0,55-Math.max(0,s.week-(Math.max(0,...s.songs.filter(x=>x.released).map(x=>x.released))||0))*2);const targetMomentum=clamp(recentScore*.42+chartScore*.22+activity*.18+Math.min(18,Math.max(0,fanGain)/Math.max(1,s.fans)*900));w.momentum=clamp(w.momentum*.78+targetMomentum*.22);w.publicInterest=clamp(w.publicInterest*.82+(w.momentum*.55+Math.min(100,Math.log10(1+s.fans)*13)*.45)*.18);w.fanLoyalty=clamp((s.loyalty||20)*.65+w.fanLoyalty*.35);w.industryInfluence=clamp((s.reputation||0)*.45+Math.min(100,tier(s.fans)*15)*.35+w.culturalRelevance*.2);w.culturalRelevance=clamp(w.culturalRelevance*.88+(w.momentum*.45+w.industryInfluence*.3+chartScore*.25)*.12);w.recognition=clamp(Math.max(w.recognition*.995,Math.log10(1+s.fans)*14+Math.min(16,tier(s.fans)*2)));const regionalDemand=Object.values(w.markets).reduce((n,m)=>n+m.demand,0)/Object.keys(w.markets).length;w.tourDemand=clamp(w.momentum*.35+w.publicInterest*.25+w.fanLoyalty*.15+regionalDemand*.25);const heat=w.momentum*.45+w.publicInterest*.3+w.culturalRelevance*.25,next=careerWorldState(heat,w.state);if(next!==w.state&&s.week-(w.stateSince||0)>=4){w.history.push({week:s.week,from:w.state,to:next,heat:Math.round(heat)});w.history=w.history.slice(-100);w.comeback=['Cold','Slump'].includes(w.state)&&['Cooling','Stable','Hot'].includes(next);w.state=next;w.stateSince=s.week}updateRegionalMarkets();w.currentCity=s.scene?.city||w.currentCity;w.lastTotalStreams=s.total||0;w.lastFans=s.fans||0;w.lastWeek=s.week}
function careerPulseCard(){const w=migrateCareerWorld(),markets=Object.values(w.markets),strong=[...markets].sort((a,b)=>b.demand-a.demand).slice(0,3),growing=[...markets].sort((a,b)=>b.growth-a.growth)[0],home=w.markets[w.hometown];return `<section class="card career-pulse"><span class="eyebrow">CAREER PULSE</span><h2>${tierNames[tier(s.fans)]} · ${esc(w.state)}${w.state==='Hot'||w.state==='Dominant'?' 🔥':w.state==='Cold'||w.state==='Slump'?' 🧊':''}</h2>${profileRows([['Momentum',Math.round(w.momentum)+'/100'],['Public interest',Math.round(w.publicInterest)+'/100'],['Cultural relevance',Math.round(w.culturalRelevance)+'/100'],['Industry influence',Math.round(w.industryInfluence)+'/100'],['Recognition',Math.round(w.recognition)+'/100'],['Tour demand',Math.round(w.tourDemand)+'/100']])}<h3>Strongest markets</h3>${strong.map((m,i)=>`<p><strong>${i+1}. ${esc(m.city)}, ${esc(m.state)}</strong> · Demand ${Math.round(m.demand)} · ${compact(m.streams)} career streams</p>`).join('')}<p><strong>Fastest growing:</strong> ${esc(growing.city)} ${regionalGrowthLabel(growing)}</p><p><strong>Hometown:</strong> ${esc(home.city)} · ${cityStatusNames[home.status]} · Connection ${Math.round(home.culturalConnection)}/100</p></section>`}
function regionalAudiencePage(){const w=migrateCareerWorld(),rows=Object.values(w.markets).sort((a,b)=>b.streams-a.streams);return head('See where your career lives','Regional audience.')+`<section class="card"><h2>Market map</h2><p>Regional fans sum to your global audience. Older careers use historical stream shares where available, otherwise an estimated genre spread. Your hometown gets an early cultural advantage, but every market has to be earned.</p>${rows.map(m=>`<div class="row"><div><strong>${esc(m.city)}, ${esc(m.state)}</strong><small>${esc(m.region)} · ${m.id===w.hometown?'Hometown · ':''}${cityStatusNames[m.status]}</small></div><div class="right"><strong>${compact(m.streams)}</strong><small>${compact(m.fans)} fans · Demand ${Math.round(m.demand)} · ${regionalGrowthLabel(m)}</small></div></div>`).join('')}</section>`}

// Regions attribute one global audience; they never mint a second population.
// Largest-remainder allocation conserves every fan, including small audiences.
function reconcileRegionalAudience(w=s.careerWorld){
 if(!w?.markets)return;
 const markets=Object.values(w.markets),target=Math.max(0,Math.floor(s.fans||0));
 const migrating=w.audienceVersion!==1;
 let weights=markets.map(m=>Math.max(0,Number(m.fans)||0));
 if(migrating){
  const observed=markets.map(m=>Math.max(0,Number(m.streams)||0));
  weights=observed.some(Boolean)?observed:markets.map(m=>regionalMarkets.find(x=>x.id===m.id)?.genres.includes(s.genre)?1.35:1);
  w.audienceAttribution=observed.some(Boolean)?'historical-streams':'estimated-genre-spread';
 }
 if(!weights.some(Boolean))weights=markets.map(()=>1);
 const sum=weights.reduce((a,b)=>a+b,0),rows=markets.map((m,i)=>{const exact=target*weights[i]/sum;return {m,value:Math.floor(exact),remainder:exact-Math.floor(exact),i}});
 let left=target-rows.reduce((n,r)=>n+r.value,0);
 rows.sort((a,b)=>b.remainder-a.remainder||a.i-b.i);
 for(const r of rows){r.m.fans=r.value+(left-->0?1:0)}
 w.audienceVersion=1;
}
function regionalGrowthLabel(m){return m.growth===null?'NEW · First tracked week':(m.growth>=0?'+':'')+m.growth+'%'}

/* Persistent geographic identities and slow scene cycles. No invented past events. */
function migrateLivingWorld(){
 const w=migrateCareerWorld();
 for(const m of Object.values(w.markets)){m.sceneHeat??=50;m.sentiment??=50;m.tourFatigue??=0}
 for(const a of s.world){a.hometown??=regionalMarkets[a.id%regionalMarkets.length].id;a.currentCity??=a.hometown}
 w.sceneLastWeek??=s.week-1;
 return w;
}
function settleLivingWorld(){
 const w=migrateLivingWorld();if(w.sceneLastWeek===s.week)return;w.sceneLastWeek=s.week;
 for(const [i,m] of Object.values(w.markets).entries()){
  const cycle=50+25*Math.sin((s.week+i*19)/52),releases=s.world.filter(a=>a.currentCity===m.id).reduce((n,a)=>n+a.catalog.filter(t=>t.week>=s.week-4).length,0);
  m.sceneHeat=clamp(m.sceneHeat*.96+(cycle+Math.min(15,releases*2))*.04);
  m.tourFatigue=Math.max(0,m.tourFatigue-2);
  m.sentiment=clamp(m.sentiment*.99+(m.loyalty*.6+20)*.01);
 }
}
