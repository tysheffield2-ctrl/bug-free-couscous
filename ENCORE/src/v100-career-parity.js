/* ENCORE 1.0 Career Parity: one season vocabulary and consequence model for player + NPC careers. */
const V100_CAREER_SEASONS=['Drought','Cooling','Stable','Rising','Hot','Peak','Breakout','Comeback','Legacy'];
function V100_seasonBand(score,{early=false,breakout=false,legacy=false,wasCold=false,momentum=score}={}){
 if(wasCold&&score>=55&&momentum>=52)return 'Comeback';
 if(early&&breakout&&score>=66)return 'Breakout';
 if(legacy&&score<58)return 'Legacy';
 if(score<25)return 'Drought';if(score<43)return 'Cooling';if(score<58)return 'Stable';if(score<70)return 'Rising';if(score<84)return 'Hot';return 'Peak';
}
function V100_seasonOpportunityFactor(state){return {Drought:.68,Cooling:.84,Stable:1,Rising:1.08,Hot:1.18,Peak:1.28,Breakout:1.22,Comeback:1.16,Legacy:.88}[state]||1}
function V100_seasonAudienceFactor(state){return {Drought:.78,Cooling:.9,Stable:1,Rising:1.05,Hot:1.1,Peak:1.14,Breakout:1.12,Comeback:1.09,Legacy:.94}[state]||1}
function V100_qualityDimensions(q,commercial=null){
 q=clamp(Number(q)||50);const appeal=clamp(commercial??q*.72+rand(-12,16)),artistic=clamp(q*.88+rand(-9,12)),audience=clamp(q*.55+appeal*.45+rand(-8,8)),longevity=clamp(q*.48+artistic*.32+audience*.2);
 return {technical:Math.round(q),commercial:Math.round(appeal),artistic:Math.round(artistic),audience:Math.round(audience),longevity:Math.round(longevity)};
}
function V100_playerSeason(){return migrateCareerWorld().state||'Stable'}
function V100_aiSeasonScore(a){
 const c=a.aiCareer||{},peak=Math.max(1,c.peakFans||a.fans||1),ratio=clamp((a.fans||0)/peak*100),weekly=Math.min(100,Math.log10(1+(a.weekly||0))*12),latest=(a.catalog||[]).slice(-4),release=latest.length?latest.reduce((n,x)=>n+clamp((x.factor||1)*50),0)/latest.length:45,activity=s.week-(latest.at(-1)?.week??0)<26?65:30;
 return clamp(ratio*.28+weekly*.31+release*.25+activity*.16);
}
function V100_aiSeason(a){
 const c=a.aiCareer||{},score=V100_aiSeasonScore(a),age=aiCareerAge(a,c),latest=(a.catalog||[]).slice(-6),breakout=latest.some(x=>(x.factor||0)>=1.65),wasCold=['Drought','Cooling'].includes(c.season),legacy=c.status==='retired'||(age>=520&&s.week-(latest.at(-1)?.week??0)>26&&score<58);
 return V100_seasonBand(score,{early:age<156,breakout,legacy,wasCold,momentum:score});
}
function V100_syncAiSeason(a){
 const c=a.aiCareer;if(!c)return;const prior=c.season||'Stable',next=V100_aiSeason(a);c.seasonScore=Math.round(V100_aiSeasonScore(a));c.season=next;c.seasonSince??=s.week;c.seasonHistory??=[];
 if(next!==prior&&s.week-c.seasonSince>=4){c.seasonHistory.push({week:s.week,from:prior,to:next,score:c.seasonScore});c.seasonHistory=c.seasonHistory.slice(-60);c.seasonSince=s.week;if(['Breakout','Comeback','Peak'].includes(next)&&s.week-(c.lastHeadlineWeek||-999)>=13)aiHeadline(a,next+' season',a.name+' has moved from '+prior.toLowerCase()+' into '+next.toLowerCase()+'.',next==='Peak'||next==='Breakout'?'up':'news')}
}
const V100_aiReleaseStageLiftOld=aiReleaseStageLift;
aiReleaseStageLift=function(stage){
 const artist=s.world.find(a=>a.aiCareer?.stage===stage&&a.aiCareer?.status!=='retired'),season=artist?.aiCareer?.season;
 return V100_aiReleaseStageLiftOld(stage)*(season?V100_seasonAudienceFactor(season):1);
};
const V100_aiAfterReleaseOld=aiAfterRelease;
aiAfterRelease=function(a,newItems){
 V100_syncAiSeason(a);const season=V100_seasonAudienceFactor(a.aiCareer.season);for(const x of newItems){x.qualityDimensions=V100_qualityDimensions(clamp((a.skill||50)+(x.factor||1)*12+rand(-14,10)));x.careerSeason=a.aiCareer.season}
 V100_aiAfterReleaseOld(a,newItems);for(const x of newItems){x.streams=Math.max(1,Math.round(x.streams*season));x.total=Math.max(x.streams,Math.round(x.total*season));x.careerSeason=a.aiCareer.season}a.weekly=a.catalog.reduce((n,x)=>n+(x.streams||0),0);V100_syncAiSeason(a);
};
const V100_aiSettleLifecycleOld=aiSettleLifecycle;
aiSettleLifecycle=function(){const z=V100_aiSettleLifecycleOld();for(const a of s.world)V100_syncAiSeason(a);return z};
function V100_playerOpportunityContext(){const w=migrateCareerWorld(),state=w.state,factor=V100_seasonOpportunityFactor(state);return {state,factor,summary:state==='Drought'?'Industry demand is soft. Strong music or a smart collaboration can still trigger a comeback.':state==='Cooling'?'Your leverage is slipping; weaker offers and smaller guarantees are more likely.':state==='Peak'?'Industry demand is at its highest, but weak releases can still break the run.':state==='Breakout'?'The industry is reacting quickly to your rise.':state==='Comeback'?'Attention is returning after a cold period.':'Opportunity flow reflects your current career temperature.'}}
const V100_negotiationMetersParityOld=negotiationMeters;
negotiationMeters=function(o){const n=V100_negotiationMetersParityOld(o);if(!n.v100SeasonAdjusted){const x=V100_playerOpportunityContext();n.interest=Math.round(clamp(n.interest+(x.factor-1)*24,0,100));n.leverage=Math.round(clamp(n.leverage+(x.factor-1)*20,0,100));n.v100SeasonAdjusted=x.state}return n};
function V100_careerConsequences(){
 const x=V100_playerOpportunityContext(),w=migrateCareerWorld();return `<section class="card"><span class="eyebrow">CAREER SEASON · ${esc(x.state.toUpperCase())}</span><h3>${Math.round(w.momentum)}/100 momentum · ${Math.round(w.publicInterest)}/100 public interest</h3><p>${esc(x.summary)}</p>${profileRows([['Industry opportunity multiplier',Math.round(x.factor*100)+'%'],['Tour demand',Math.round(w.tourDemand)+'/100'],['Release form',(w.releaseForm??55)+'/100'],['Drought pressure',(w.droughtPressure??0)+'/100']])}<p class="fine">Fame creates a floor, not guaranteed success. Release quality, current consumption, audience response and career temperature still determine what happens next.</p></section>`}
const V100_careerPulseCardParityOld=careerPulseCard;
careerPulseCard=function(){return V100_careerPulseCardParityOld()+V100_careerConsequences()};
const V100_profileParityOld=profile;
profile=function(id){V100_profileParityOld(id);const a=s.world[id],el=$('modal');if(!a?.aiCareer||!el?.open)return;V100_syncAiSeason(a);el.innerHTML+=`<section class="card"><span class="eyebrow">CAREER SEASON · SHARED ENGINE</span>${profileRows([['Current season',a.aiCareer.season],['Career temperature',a.aiCareer.seasonScore+'/100'],['Peak audience',compact(a.aiCareer.peakFans||a.fans)],['Current audience',compact(a.fans)]])}<p class="fine">NPC careers use the same Drought → Cooling → Stable → Rising → Hot → Peak / Breakout / Comeback / Legacy vocabulary as the player.</p></section>`};
