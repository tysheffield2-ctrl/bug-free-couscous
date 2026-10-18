/* ENCORE 0.9.16 — Living Industry / Competition 2.0.
   The industry can create breakouts, sleepers, comeback shocks and major-label
   pushes that materially change chart competition. Rival pressure is persistent,
   explained to the player and recorded in the same career-history direction as
   Cohesion Core instead of acting like invisible random chart noise. */

const V119_SCHEMA=1;
function V119_state(){
 if(!s.livingIndustry2||typeof s.livingIndustry2!=='object')s.livingIndustry2={version:V119_SCHEMA,lastWeek:0,events:[],rivals:{},pressure:0,congestion:0,leader:null,lastNumberOneKey:null,lastNumberOneWeek:0};
 const z=s.livingIndustry2;z.version=V119_SCHEMA;if(!Array.isArray(z.events))z.events=[];if(!z.rivals||typeof z.rivals!=='object')z.rivals={};return z
}
function V119_hash(...parts){let h=2166136261>>>0;for(const ch of parts.join('|')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0}return h>>>0}
function V119_roll(...parts){return (V119_hash(...parts)%100000)/100000}
function V119_event(type,a,track,headline,detail,extra={}){
 const z=V119_state(),e={id:`li-${s.week}-${a?.id??'world'}-${track?.uid??track?.id??z.events.length}-${type}`,week:s.week,type,artist:a?.id??null,track:track?.uid??track?.id??null,title:track?.title||null,headline,detail,...extra};
 if(!z.events.some(x=>x.id===e.id)){z.events.unshift(e);z.events=z.events.slice(0,160);if(typeof V118_event==='function')V118_event('industry-'+type,headline,detail,{artistId:e.artist,trackId:e.track});}
 return e
}
function V119_applySurge(a,track,type,multiplier,reason){
 if(!a||!track||track.v119Week===s.week)return 0;const before=Math.max(0,Math.round(Number(track.streams)||0)),m=clamp(Number(multiplier)||1,1,4),delta=Math.max(0,Math.round(before*(m-1)));if(!delta)return 0;
 track.streams=before+delta;track.total=Math.max(track.streams,Math.round(Number(track.total)||0)+delta);track.v119Week=s.week;track.v119Type=type;track.v119Lift=m;a.weekly=Math.max(0,Math.round(Number(a.weekly)||0)+delta);const fanGain=Math.round(delta*.006/(1+(a.fans||0)/120000000));if(fanGain>0)a.fans=Math.max(0,Math.round((a.fans||0)+fanGain));
 const labels={breakout:'Breakout shock',sleeper:'Sleeper surge',comeback:'Comeback shock',label:'Major-label push',revival:'Catalog revival'},headline=(labels[type]||'Industry surge')+': '+a.name,detail=`“${track.title}” gained ${compact(delta)} additional weekly streams. ${reason}`;V119_event(type,a,track,headline,detail,{delta,multiplier:m});
 if(typeof aiHeadline==='function'&&m>=1.45)aiHeadline(a,labels[type]||'Industry surge',reason,'up');if(m>=1.65)addBriefing?.('living-industry:'+type+':'+a.id+':'+s.week,'Industry',headline,detail);return delta
}
function V119_releaseFactor(track){return clamp(Number(track?.factor)||1,.4,3)}
function V119_releaseCandidates(a){return (a.catalog||[]).filter(x=>['Single','Album'].includes(x.type))}
function V119_tryArtistShock(a){
 const c=a?.aiCareer;if(!a||!c||c.status==='retired')return null;aiSyncLabelState?.(a);const heat=clamp(migrateAiIndustry?.().genreHeat?.[a.genre]||1,.65,1.5),newReleases=V119_releaseCandidates(a).filter(x=>x.week===s.week),stage=String(c.stage||''),signed=c.labelMode==='signed';let event=null;
 for(const x of newReleases){
  const factor=V119_releaseFactor(x),roll=V119_roll('new',s.week,a.id,x.uid??x.title),young=/Newcomer|Rising|Breakout/.test(stage)||(a.fans||0)<2000000;
  if(c.status==='comeback'&&roll<.62){const m=1.25+V119_roll('come',s.week,a.id,x.uid??0)*.75;V119_applySurge(a,x,'comeback',m,'A returning audience, press attention and dormant catalog interest converged around the release.');event='comeback';break}
  const breakoutChance=clamp(.045+(young?.055:0)+Math.max(0,factor-1)*.07+Math.max(0,heat-1)*.08+(signed?.025:0),.03,.24);
  if(roll<breakoutChance){const m=1.55+V119_roll('break',a.id,s.week,x.uid??0)*1.65;V119_applySurge(a,x,'breakout',m,'The record dramatically outperformed the artist’s existing audience and broke through faster than expected.');event='breakout';break}
  if(signed&&roll<breakoutChance+.10){const m=1.12+V119_roll('label',a.id,s.week,x.uid??0)*.30;V119_applySurge(a,x,'label',m,'A coordinated label push, placement support and release-week attention increased competitive reach.');event='label';break}
 }
 if(event)return event;
 const sleepers=V119_releaseCandidates(a).filter(x=>{const age=s.week-(Number(x.week)||0);return x.type==='Single'&&age>=4&&age<=30&&(x.streams||0)>=1500&&!x.v119Type}).sort((x,y)=>(y.factor||1)-(x.factor||1));
 const sleeper=sleepers[0];if(sleeper){const age=s.week-sleeper.week,chance=clamp(.012+Math.max(0,V119_releaseFactor(sleeper)-1)*.025+Math.max(0,heat-1)*.025,.008,.07);if(V119_roll('sleep',s.week,a.id,sleeper.uid??sleeper.title)<chance){const m=1.45+V119_roll('sleeper-m',s.week,a.id,sleeper.uid??0)*1.05;V119_applySurge(a,sleeper,'sleeper',m,`A ${age}-week-old record found a second life through discovery, sharing and renewed listener activity.`);return 'sleeper'}}
 const revivals=V119_releaseCandidates(a).filter(x=>x.type==='Single'&&s.week-(x.week||0)>=52&&(x.streams||0)>=500).sort((x,y)=>(y.total||0)-(x.total||0));const old=revivals[0];if(old&&V119_roll('revival',s.week,a.id,old.uid??old.title)<.0045){const m=1.30+V119_roll('revival-m',s.week,a.id,old.uid??0)*.70;V119_applySurge(a,old,'revival',m,'An older catalog record suddenly re-entered the conversation and began pulling meaningful weekly traffic again.');return 'revival'}return null
}
function V119_updatePressure(){
 const z=V119_state(),active=(s.world||[]).filter(a=>a.aiCareer?.status!=='retired').sort((a,b)=>(b.weekly||0)-(a.weekly||0)),player=Math.max(1,Number(s.streams)||0),top=active[0]||null,releases=(s.world||[]).reduce((n,a)=>n+(a.catalog||[]).filter(x=>x.week===s.week&&['Single','Album'].includes(x.type)).length,0),ratio=(top?.weekly||0)/player;
 z.congestion=releases;z.pressure=clamp(Math.round(20+Math.log10(1+ratio)*32+Math.min(25,releases*2.5)),0,100);z.leader=top?{artist:top.id,name:top.name,weekly:Math.round(top.weekly||0)}:null;
 const contenders=active.slice(0,8);for(const a of contenders){const r=(a.weekly||0)/player,close=r>=.25&&r<=4;if(!close&&a!==top)continue;const key=String(a.id),row=z.rivals[key]??={artist:a.id,weeks:0,heat:0,lastWeek:0,peakWeekly:0,numberOnes:0};row.weeks++;row.lastWeek=s.week;row.peakWeekly=Math.max(row.peakWeekly||0,a.weekly||0);row.heat=clamp(Math.round((row.heat||0)*.72+(close?28:14)+Math.max(0,25-Math.abs(Math.log10(Math.max(.01,r)))*28)),0,100);z.rivals[key]=row}
 for(const [k,r] of Object.entries(z.rivals))if(s.week-(r.lastWeek||0)>26)delete z.rivals[k];return z
}
function V119_settleCompetition(){const z=V119_state();if(z.lastWeek===s.week)return z;z.lastWeek=s.week;for(const a of s.world||[])V119_tryArtistShock(a);V119_updatePressure();return z}
const V119_worldWeekBase=worldWeek;
worldWeek=function(){const result=V119_worldWeekBase();V119_settleCompetition();return result};

function V119_artistIdFromChartRow(row){const m=String(row?.key||'').match(/^npc:s:(\d+):/);return m?Number(m[1]):null}
function V119_afterChartIssue(result,state=s){
 if(!result?.published||!result.songs?.length)return result;const z=V119_state(),leader=result.songs[0],key=leader.key;if(z.lastNumberOneKey===key&&z.lastNumberOneWeek===s.week)return result;z.lastNumberOneKey=key;z.lastNumberOneWeek=s.week;
 if(!leader.you){const id=V119_artistIdFromChartRow(leader),a=Number.isInteger(id)?s.world?.[id]:null,surprise=['NEW','ENTRY','RE'].includes(leader.movement)||((a?.fans||0)<3000000);const row=z.rivals[String(id)];if(row)row.numberOnes=(row.numberOnes||0)+1;const headline=surprise?'A surprise #1 just changed the week':(a?.name||leader.artist)+' owns the #1 spot',detail=`${leader.artist} reached #1 with “${leader.title}” at ${compact(leader.streams||0)} weekly streams${surprise?' despite entering the week without established chart control':''}.`;V119_event('number-one',a,{uid:leader.key,title:leader.title},headline,detail,{rank:1,surprise});if(surprise)addBriefing?.('surprise-no1:'+s.week+':'+leader.key,'Charts',headline,detail)}return result
}
if(globalThis.ENCORE_CHARTS?.publish){const V119_chartPublishBase=globalThis.ENCORE_CHARTS.publish;globalThis.ENCORE_CHARTS.publish=function(state,args){const result=V119_chartPublishBase(state,args);if(state===s)V119_afterChartIssue(result,state);return result}}

function V119_pressureLabel(n){return n>=80?'Brutal':n>=60?'Heavy':n>=40?'Competitive':n>=20?'Open':'Quiet'}
function V119_competitionPanel(){
 const z=V119_state(),rivals=Object.values(z.rivals).sort((a,b)=>(b.heat||0)-(a.heat||0)).slice(0,5),events=z.events.slice(0,6);return `<section class="card v119-competition"><div class="sectionhead"><div><span class="eyebrow">LIVING INDUSTRY / COMPETITION 2.0</span><h2>You are never entitled to the top.</h2></div><span class="pill">${V119_pressureLabel(z.pressure)} pressure</span></div><p>Breakouts, sleepers, comeback records, label pushes and catalog revivals can materially change the chart. The system records why the pressure moved instead of hiding it behind random numbers.</p><div class="v119-pressure"><div><span>Industry pressure</span><strong>${z.pressure}/100</strong></div><i><b style="width:${z.pressure}%"></b></i></div>${metricRail([['Release congestion',String(z.congestion)+' projects'],['Current industry leader',z.leader?.name||'—'],['Leader weekly activity',z.leader?compact(z.leader.weekly):'—'],['Tracked rivals',String(rivals.length)]])}<div class="v119-columns"><div><h3>Closest pressure</h3>${rivals.map(r=>{const a=s.world?.[r.artist];return a?`<button class="v119-rival" onclick="profile(${a.id})"><span><strong>${esc(a.name)}</strong><small>${esc(a.genre)} · ${esc(a.aiCareer?.stage||'Active')}</small></span><b>${r.heat}/100</b></button>`:''}).join('')||'<p class="fine">No persistent rival has formed yet. That can change quickly.</p>'}</div><div><h3>Recent shocks</h3>${events.map(e=>`<div class="v119-event"><span>${esc(e.headline)}</span><small>Week ${e.week}${e.title?' · “'+esc(e.title)+'”':''}</small></div>`).join('')||'<p class="fine">The industry is quiet right now. It will not stay that way forever.</p>'}</div></div></section>`
}
if(typeof V082_worldPulsePage==='function'){const V119_worldPulseBase=V082_worldPulsePage;V082_worldPulsePage=function(){return V119_worldPulseBase()+V119_competitionPanel()}}
const V119_profileBase=profile;
profile=function(id){V119_profileBase(id);const a=s.world?.[id],el=$('modal'),r=V119_state().rivals?.[String(id)];if(!a||!el?.open||!r)return;el.innerHTML+=`<section class="card v119-profile-rival"><span class="eyebrow">COMPETITIVE HISTORY</span><h3>${r.heat>=70?'Active rival pressure':r.heat>=40?'Competitive overlap':'Industry overlap'}</h3>${profileRows([['Rival heat',r.heat+'/100'],['Competitive weeks',String(r.weeks||0)],['Peak weekly activity',compact(r.peakWeekly||0)],['#1 weeks witnessed',String(r.numberOnes||0)]])}<p class="fine">This is persistent competitive history, not a temporary chart modifier. Their career can cool off, surge again or cross yours repeatedly over time.</p></section>`};

function V119_validate(){const z=V119_state();if(z.version!==V119_SCHEMA||!Array.isArray(z.events)||!z.rivals||!Number.isFinite(z.pressure)||z.pressure<0||z.pressure>100)throw Error('Invalid Living Industry state')}
const V119_validateBase=validatePresentationState;
validatePresentationState=function(){V119_validateBase();V119_validate()};
V119_state();