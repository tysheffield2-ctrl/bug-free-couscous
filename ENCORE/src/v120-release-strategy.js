/* ENCORE 0.9.17 — Release Strategy / Calendar Intelligence 1.0.
   Finished music can be scheduled instead of auto-dropped. Forecasted release
   congestion, rival pressure and the player's chosen launch posture all feed
   the debut. Plans can be moved, but late changes leave a measurable scar. */

const V120_SCHEMA=1;
const V120_APPROACHES={
 clear:{id:'clear',name:'Protect the lane',desc:'Prioritize preparation and quieter weeks. Best when the calendar is open; less effective if you force it into a brutal week.'},
 balanced:{id:'balanced',name:'Balanced rollout',desc:'No special posture. Preparation helps, while crowded weeks still reduce discovery.'},
 challenge:{id:'challenge',name:'Head-to-head challenge',desc:'Lean into a major competitive week. More attention is available, but the outcome carries extra variance and creates rivalry history.'}
};
function V120_state(){
 if(!s.releaseStrategy||typeof s.releaseStrategy!=='object')s.releaseStrategy={version:V120_SCHEMA,history:[],lastForecastWeek:0};
 const z=s.releaseStrategy;z.version=V120_SCHEMA;if(!Array.isArray(z.history))z.history=[];return z
}
function V120_date(week){return typeof V081_releaseDateForWeek==='function'?V081_releaseDateForWeek(week):'Week '+week}
function V120_repIntel(){
 let skill=0;try{const t=V100_repTeam?.().team||{};for(const c of [t.manager,t.publicist,t.social])if(c)skill=Math.max(skill,typeof V117_effectiveSkill==='function'?V117_effectiveSkill(c):Number(c.skill)||0)}catch{}
 return clamp(Math.round(45+skill*.5),45,95)
}
function V120_artistThreat(a){
 if(!a||a.aiCareer?.status==='retired')return 0;const audience=clamp(Math.log10(1+Math.max(0,a.fans||0))*13,0,100),rep=clamp(Number(a.reputation)||0),stage=/Prime|Comeback|Breakout/.test(String(a.aiCareer?.stage||''))?10:/Rising|Veteran/.test(String(a.aiCareer?.stage||''))?5:0,label=a.aiCareer?.labelMode==='signed'?7:0;return clamp(Math.round(audience*.48+rep*.32+stage+label),0,100)
}
function V120_forecastWeek(week){
 const w=Math.max(s.week,Math.round(Number(week)||s.week)),known=(s.world||[]).filter(a=>a.aiCareer?.status!=='retired'&&Number.isFinite(Number(a.nextRelease))&&Math.abs(Number(a.nextRelease)-w)<=1).map(a=>({artist:a.id,name:a.name,genre:a.genre,week:a.nextRelease,threat:V120_artistThreat(a),signed:a.aiCareer?.labelMode==='signed'})).sort((a,b)=>b.threat-a.threat),direct=known.filter(x=>x.week===w),near=known.length-direct.length,top=known[0]||null,current=typeof V119_state==='function'?V119_state().pressure||0:0;
 const score=clamp(Math.round(12+direct.length*8+near*3+(top?.threat||0)*.52+current*.10),0,100),confidence=V120_repIntel();
 return {week:w,score,confidence,releases:direct.length,nearby:near,top,known:known.slice(0,5),label:score>=80?'Brutal':score>=62?'Heavy':score>=44?'Competitive':score>=27?'Open':'Quiet'}
}
function V120_challengeSwing(song,week){const r=typeof V119_roll==='function'?V119_roll('player-challenge',song.id,week):.5;return -.08+r*.18}
function V120_launchMultiplier(song,plan){
 const f=V120_forecastWeek(plan.week),lead=Math.max(0,plan.week-plan.createdWeek),prep=Math.min(.08,lead*.012),pressure=f.score*.0012;let posture=0;
 if(plan.approach==='clear')posture=f.score<40?.06:f.score>70?-.04:.02;
 if(plan.approach==='challenge')posture=(f.score>=55?.08:-.02)+V120_challengeSwing(song,plan.week);
 const late=Math.max(0,Number(plan.lateMovePenalty)||0),m=clamp(1+prep-pressure+posture-late,.78,1.22);plan.forecastAtLaunch=f;plan.launchMultiplier=m;return m
}
function V120_planFor(song){return song?.releasePlan&&song.releasePlan.status!=='cancelled'?song.releasePlan:null}
function V120_record(kind,song,detail){const z=V120_state(),e={week:s.week,kind,songId:song?.id??null,title:song?.title||'Untitled',detail};z.history.unshift(e);z.history=z.history.slice(0,120);if(typeof V118_event==='function')V118_event('release-'+kind,e.title,detail,{songId:e.songId});return e}
function V120_schedule(id,week,approach='balanced'){
 const song=s.songs.find(x=>Number(x.id)===Number(id));if(!song||song.released)return false;week=Math.max(s.week,Math.round(Number(week)||s.week));if(week>s.week+12){toast?.('Schedule within the next 12 weeks.');return false}if(!V120_APPROACHES[approach])approach='balanced';
 let plan=V120_planFor(song),reschedule=!!plan;if(!song.releaseCommitFeePaid){if(!spend(5,20))return false;song.releaseCommitFeePaid=true}
 if(!plan){plan=song.releasePlan={status:'scheduled',createdWeek:s.week,week,approach,moves:0,lateMovePenalty:0,history:[]}}else{const old=plan.week;if(old!==week||plan.approach!==approach){plan.moves=(plan.moves||0)+1;if(old-s.week<=1||week-s.week<=1)plan.lateMovePenalty=clamp((plan.lateMovePenalty||0)+.04,0,.16);plan.history??=[];plan.history.unshift({week:s.week,from:old,to:week,approach});V120_record('reschedule',song,`Moved from Week ${old} to Week ${week}. Late-change penalty ${Math.round((plan.lateMovePenalty||0)*100)}%.`)}}
 plan.status='scheduled';plan.week=week;plan.approach=approach;plan.forecastBooked=V120_forecastWeek(week);song.scheduledRelease=week;
 if(week===s.week){song.released=s.week;song.scheduledRelease=null;plan.status='released';plan.actualWeek=s.week;song.releaseStrategyLift=V120_launchMultiplier(song,plan);V120_record('launch',song,`${V120_APPROACHES[approach].name} · ${plan.forecastAtLaunch.label} pressure · ${Math.round(song.releaseStrategyLift*100)}% launch multiplier.`);log?.(`“${song.title}” is out under a ${V120_APPROACHES[approach].name.toLowerCase()} plan.`)}else V120_record(reschedule?'reschedule-confirmed':'scheduled',song,`Scheduled for ${V120_date(week)} using ${V120_APPROACHES[approach].name}. Current forecast: ${plan.forecastBooked.label} (${plan.forecastBooked.score}/100).`);
 $('modal')?.close?.();queueSave?.();render();toast?.(week===s.week?'Single released. Results arrive at week close.':'Release scheduled for '+V120_date(week)+'.');return true
}
function V120_cancelSchedule(id){const song=s.songs.find(x=>Number(x.id)===Number(id)),plan=V120_planFor(song);if(!song||!plan||song.released)return false;const late=plan.week-s.week<=1;if(late){s.reputation=clamp((s.reputation||0)-1);plan.lateCancellation=true}plan.status='cancelled';song.scheduledRelease=null;V120_record('cancelled',song,late?'The release was pulled inside the final week. Reputation -1.':'The release was pulled before the final-week window.');queueSave?.();render();toast?.('Release removed from the calendar.');return true}
function V120_activateScheduled(state=s){
 if(state!==s)return 0;let n=0;for(const song of s.songs||[]){const plan=V120_planFor(song);if(song.released||!plan||!song.scheduledRelease||song.scheduledRelease>s.week)continue;song.released=s.week;song.scheduledRelease=null;plan.status='released';plan.actualWeek=s.week;song.releaseStrategyLift=V120_launchMultiplier(song,plan);V120_record('launch',song,`${V120_APPROACHES[plan.approach]?.name||'Balanced rollout'} · ${plan.forecastAtLaunch.label} pressure · ${Math.round(song.releaseStrategyLift*100)}% launch multiplier.`);log?.(`“${song.title}” released from the calendar.`);n++}return n
}
function V120_forecastCard(f,selected=false){const top=f.top?`${esc(f.top.name)} · ${f.top.threat}/100`:'No known headliner';return `<article class="v120-week ${selected?'selected':''}" data-pressure="${f.label.toLowerCase()}"><header><span>${esc(V120_date(f.week))}</span><b>${f.label}</b></header><strong>${f.score}/100 pressure</strong><small>${f.releases} known release${f.releases===1?'':'s'} · intel ${f.confidence}%</small><p>${top}</p></article>`}
function V120_planRelease(id){
 const song=s.songs.find(x=>Number(x.id)===Number(id));if(!song||song.released)return false;const plan=V120_planFor(song),weeks=Array.from({length:8},(_,i)=>s.week+i),forecasts=weeks.map(V120_forecastWeek);
 modal(`<section class="v120-planner"><span class="eyebrow">RELEASE STRATEGY / CALENDAR INTELLIGENCE</span><h2>${esc(song.title)}</h2><p>Pick the week and the posture. Forecasts are current intelligence, not guarantees: surprise breakouts, sleepers and comeback shocks can still change the field.</p>${plan?`<div class="v120-current">Currently scheduled: <strong>${esc(V120_date(plan.week))}</strong> · ${esc(V120_APPROACHES[plan.approach]?.name||'Balanced rollout')} · moves ${plan.moves||0}${plan.lateMovePenalty?` · late-change penalty ${Math.round(plan.lateMovePenalty*100)}%`:''}</div>`:''}<div class="v120-calendar">${forecasts.map(f=>V120_forecastCard(f,plan?.week===f.week)).join('')}</div><div class="v120-approaches">${Object.values(V120_APPROACHES).map(a=>`<section><h3>${esc(a.name)}</h3><p>${esc(a.desc)}</p><div class="v120-week-actions">${weeks.map(w=>`<button class="secondary" onclick="V120_schedule(${JSON.stringify(song.id)},${w},'${a.id}')">${w===s.week?'This week':'W'+w}</button>`).join('')}</div></section>`).join('')}</div>${plan?`<button class="text-button" onclick="V120_cancelSchedule(${JSON.stringify(song.id)})">Pull from calendar</button>`:''}<p class="fine">Scheduling commits the normal $20 release fee and 5 energy once. Moving a plan is free, but a change inside the final week adds a launch penalty. Pulling a release inside that window also costs reputation.</p></section>`);return true
}
function V120_strategyPage(){
 V120_state();const shelf=(s.songs||[]).filter(x=>!x.released),scheduled=shelf.filter(x=>V120_planFor(x)&&x.scheduledRelease),ready=shelf.filter(x=>!x.scheduledRelease),weeks=Array.from({length:8},(_,i)=>V120_forecastWeek(s.week+i));
 return head('Timing is part of the record','Release strategy.')+`<section class="v120-hero"><div><span class="eyebrow">CALENDAR INTELLIGENCE · ${V120_repIntel()}% CONFIDENCE</span><h2>Choose when to enter the fight.</h2><p>Known releases, star power, label backing and current industry pressure shape each week. Hidden shocks can still appear.</p></div>${metricRail([['Scheduled',String(scheduled.length)],['Ready masters',String(ready.length)],['Current pressure',(typeof V119_state==='function'?V119_state().pressure:0)+'/100'],['Intel',V120_repIntel()+'%']])}</section><section class="card"><h2>Next 8 weeks</h2><div class="v120-calendar">${weeks.map(V120_forecastCard).join('')}</div></section><section class="card"><h2>Scheduled releases</h2>${scheduled.map(x=>{const p=V120_planFor(x),f=V120_forecastWeek(p.week);return `<div class="project-row v120-scheduled"><div><strong>${esc(x.title)}</strong><small>${esc(V120_date(p.week))} · ${esc(V120_APPROACHES[p.approach]?.name||'Balanced rollout')} · ${f.label} ${f.score}/100</small></div><button class="secondary" onclick="V120_planRelease(${JSON.stringify(x.id)})">Review / move →</button></div>`}).join('')||'<p class="fine">Nothing is on the calendar yet.</p>'}</section><section class="card"><h2>Finished masters</h2>${ready.map(x=>`<div class="project-row"><div><strong>${esc(x.title)}</strong><small>Quality ${Math.round(x.quality||0)}/100 · commercial ${Math.round(x.commercial||0)}/100</small></div><button class="primary" onclick="V120_planRelease(${JSON.stringify(x.id)})">Plan release →</button></div>`).join('')||'<p class="fine">Finish a track without releasing it to build your schedule.</p>'}</section>`
}

/* Release-room integration: finishing a master now offers timing instead of
   forcing the player to publish immediately. */
const V120_finishSongBase=finishSong;
finishSong=function(release,confirmed=false){
 const d=s.draft;if(release&&!confirmed&&d&&d.steps===3){modal(`<article class="v103-release-room v120-release-choice"><header><span>ENCORE / RELEASE DECISION</span><h2>What happens to “${esc(d.title)}”?</h2><p>The recording is finished. You can release into this week or archive the master and choose a future competitive window.</p></header><div class="v120-decision-grid"><button class="primary" onclick="V120_finishDraft('now')">Release this week →</button><button class="secondary" onclick="V120_finishDraft('plan')">Open calendar intelligence →</button><button class="secondary" onclick="V120_finishDraft('shelf')">Save master without a date</button></div><p class="fine">Future scheduling lets the industry calendar matter. Surprise competition is still possible.</p></article>`);return}return V120_finishSongBase(release,confirmed)
};
function V120_finishDraft(mode){const id=s.draft?.id;if(id===undefined)return false;$('modal')?.close?.();V120_finishSongBase(false);const song=s.songs.find(x=>Number(x.id)===Number(id));if(!song)return false;if(mode==='now')return V120_schedule(song.id,s.week,'balanced');if(mode==='plan')return V120_planRelease(song.id);return true}
const V120_releaseShelfBase=releaseShelf;
releaseShelf=function(id,confirmed=false){const x=s.songs.find(x=>Number(x.id)===Number(id));if(x&&!x.released&&!confirmed)return V120_planRelease(id);if(x&&!x.released&&confirmed)return V120_schedule(id,s.week,'balanced');return V120_releaseShelfBase(id,confirmed)};
const V120_releaseAlbumBase=releaseAlbum;
releaseAlbum=function(e,confirmed=false){const result=V120_releaseAlbumBase(e,confirmed);if(confirmed)for(const x of s.songs||[])if(x.released&&x.scheduledRelease){x.scheduledRelease=null;if(x.releasePlan&&x.releasePlan.status==='scheduled'){x.releasePlan.status='superseded-by-album';x.releasePlan.actualWeek=s.week;V120_record('album-supersede',x,'Album release superseded the planned single date.')}}return result};

/* Activate due songs immediately before authoritative stream settlement. */
if(globalThis.ENCORE_RELEASES?.settle){const V120_releaseSettleBase=globalThis.ENCORE_RELEASES.settle;globalThis.ENCORE_RELEASES.settle=function(state,h){if(state===s)V120_activateScheduled(state);return V120_releaseSettleBase(state,h)}}

function V120_afterChartIssue(result){
 if(!result?.published||!result.songs?.length)return result;for(const song of s.songs||[]){const p=song.releasePlan;if(!p||p.actualWeek!==s.week||p.resultRank!==undefined)continue;const row=result.songs.find(x=>x.you&&Number(x.id)===Number(song.id));if(!row)continue;p.resultRank=row.rank;p.resultWeek=s.week;const topNpc=result.songs.find(x=>!x.you);if(p.approach==='challenge'){
   if(row.rank===1){s.reputation=clamp((s.reputation||0)+2);V120_record('challenge-win',song,'Head-to-head release won the #1 spot. Reputation +2.');addBriefing?.('release-challenge-win:'+song.id+':'+s.week,'Charts','You won the release-week fight',`“${song.title}” debuted at #1 after a deliberate head-to-head release.`)}
   else if(row.rank<=10){s.reputation=clamp((s.reputation||0)+1);V120_record('challenge-top10',song,`Head-to-head release debuted #${row.rank}. Reputation +1.`)}
   else V120_record('challenge-miss',song,`Head-to-head release debuted #${row.rank}; the attention did not convert into chart control.`);
   const id=typeof V119_artistIdFromChartRow==='function'?V119_artistIdFromChartRow(topNpc):null;if(Number.isInteger(id)&&typeof V119_state==='function'){const z=V119_state(),r=z.rivals[String(id)]??={artist:id,weeks:0,heat:0,lastWeek:0,peakWeekly:0,numberOnes:0};r.heat=clamp((r.heat||0)+18,0,100);r.lastWeek=s.week;z.rivals[String(id)]=r}
  }
 }queueSave?.();return result
}
if(globalThis.ENCORE_CHARTS?.publish){const V120_chartPublishBase=globalThis.ENCORE_CHARTS.publish;globalThis.ENCORE_CHARTS.publish=function(state,args){const result=V120_chartPublishBase(state,args);if(state===s)V120_afterChartIssue(result);return result}}

if(typeof destinations!=='undefined'&&!destinations.some(x=>x[2]==='ReleaseStrategy'))destinations.splice(Math.max(0,destinations.findIndex(x=>x[2]==='Releases')+1),0,['Release strategy','Music','ReleaseStrategy','Calendar intelligence, timing and competitive launch plans',3]);
if(typeof V080_destinations!=='undefined'&&!V080_destinations.some(x=>x[2]==='ReleaseStrategy'))V080_destinations.splice(Math.max(0,V080_destinations.findIndex(x=>x[2]==='Releases')+1),0,['Release strategy','Music','ReleaseStrategy','Calendar intelligence, timing and competitive launch plans',3]);
const V120_careerBase=career;
career=function(){if(careerTab==='ReleaseStrategy')return V120_strategyPage();return V120_careerBase()};
const V120_screenFamilyBase=screenFamily;
screenFamily=function(){if(tab==='Career'&&careerTab==='ReleaseStrategy')return 'studio';return V120_screenFamilyBase()};
if(typeof V082_attentionItems==='function'){const V120_attentionBase=V082_attentionItems;V082_attentionItems=function(){const items=V120_attentionBase(),next=(s.songs||[]).filter(x=>!x.released&&x.scheduledRelease).sort((a,b)=>a.scheduledRelease-b.scheduledRelease)[0];if(next&&next.scheduledRelease-s.week<=1)items.unshift({k:'Release',v:next.title,d:next.scheduledRelease===s.week?'Scheduled for this week':'Scheduled next week',go:"openDestination('ReleaseStrategy')"});return items.slice(0,4)}}
V120_state();