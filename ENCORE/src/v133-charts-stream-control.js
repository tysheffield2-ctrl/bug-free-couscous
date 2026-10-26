/* ENCORE Charts 2.0 — historical chart storytelling, player-controlled stream focus,
   and restored post-Diamond certification tiers. The shared release engine owns
   stream saturation so every renderer resolves the same career math. */
const V133_CERTS={gold:500000,platinum:1000000,diamond:10000000,onyx:100000000,obsidian:250000000,eternal:500000000};

certificationInfo=function(units){
 units=Math.max(0,Math.floor(Number(units)||0));
 let tier='none',label='Uncertified',milestone=0,next=V133_CERTS.gold;
 if(units>=V133_CERTS.eternal){tier='eternal';label='Eternal';milestone=V133_CERTS.eternal;next=V133_CERTS.eternal}
 else if(units>=V133_CERTS.obsidian){tier='obsidian';label='Obsidian';milestone=V133_CERTS.obsidian;next=V133_CERTS.eternal}
 else if(units>=V133_CERTS.onyx){tier='onyx';label='Onyx';milestone=V133_CERTS.onyx;next=V133_CERTS.obsidian}
 else if(units>=V133_CERTS.diamond){tier='diamond';label='Diamond';milestone=V133_CERTS.diamond;next=V133_CERTS.onyx}
 else if(units>=2000000){tier='multi';milestone=Math.floor(units/1000000)*1000000;next=Math.min(V133_CERTS.diamond,milestone+1000000);label=fmt(Math.floor(units/1000000))+'× Platinum'}
 else if(units>=V133_CERTS.platinum){tier='platinum';label='Platinum';milestone=V133_CERTS.platinum;next=2000000}
 else if(units>=V133_CERTS.gold){tier='gold';label='Gold';milestone=V133_CERTS.gold;next=V133_CERTS.platinum}
 const progress=next===milestone?100:clamp((units-milestone)/Math.max(1,next-milestone)*100,0,100);
 return {milestone,next,tier,label,progress}
};

updateCertifications=function(recovered=false){
 for(const [kind,list] of [['songs',s.songs.filter(x=>x.released)],['albums',s.albums]])for(const item of list){
  const units=certificationUnits(item,kind),info=certificationInfo(units),old=item.certification||null;
  const changed=!old?info.milestone>0:info.tier!==old.tier||info.milestone>(old.milestone||0)||info.label!==old.label;
  if(!changed)continue;
  const historical=!!old&&old.milestone>info.milestone;
  const isRecovered=recovered||historical;
  item.certification={milestone:info.milestone,label:info.label,tier:info.tier,week:isRecovered?null:s.week,recovered:isRecovered,history:[...(old?.history||[]),{label:info.label,week:isRecovered?null:s.week,units}].slice(-30)};
  if(!isRecovered&&info.tier!=='none'){
   addBriefing('cert:'+kind+':'+item.id+':'+info.milestone,'Celebration',info.label+' certified','“'+item.title+'” reached '+fmt(units)+' equivalent units. Your '+(kind==='songs'?'song':'album')+' earned '+info.label+'.','Your award is saved in Career → Certifications.');
   log('“'+item.title+'” earned '+info.label+' '+(kind==='songs'?'song':'album')+' certification.')
  }
 }
};

certificationRules=function(){return `<details class="card cert-rules v133-cert-rules"><summary>How ENCORE certifications work</summary><p>150 song streams = 1 song unit; 1,500 album-track streams = 1 album unit. Gold: 500,000 units. Platinum: 1 million. Multi-Platinum: 2–9 million. Diamond: 10 million.</p><p><strong>Rare legacy tiers:</strong> Onyx at 100 million units, Obsidian at 250 million, and Eternal at 500 million. Once a release reaches Diamond, it advances toward these named legacy tiers instead of stacking absurd Platinum multipliers forever.</p><p>Song Gold requires 75 million streams; album Gold requires 750 million combined track streams. Albums include member tracks’ lifetime streams once per album.</p><p class="fine">ENCORE certifications are worldwide simulated career awards, not official RIAA certifications or Billboard results.</p></details>`};

const V133_plaquePaletteBase=V130_plaquePalette;
V130_plaquePalette=function(tier){
 if(tier==='onyx')return {metal:'#cbd0d6',edge:'#252a31',disc:'#14181e',ink:'#f8fafc',accent:'#eef2f7'};
 if(tier==='obsidian')return {metal:'#9d8cff',edge:'#241842',disc:'#100b1b',ink:'#faf7ff',accent:'#c8b9ff'};
 if(tier==='eternal')return {metal:'#fff3c4',edge:'#a47827',disc:'#f9fbff',ink:'#17140d',accent:'#fff7dc'};
 return V133_plaquePaletteBase(tier)
};

function V133_state(){return s.v133&&typeof s.v133==='object'?s.v133:{}}
const V133_STREAM_MODES={
 core:{name:'Mobilize core fans',energy:8,cost:0,detail:'Turn loyalty into repeat listening. Best when your fanbase is deep, not just large.'},
 algorithm:{name:'Algorithm campaign',energy:12,cost:5000,detail:'Push discovery with marketability and viral ability. Strongest on commercial records.'},
 catalog:{name:'Catalog revival',energy:15,cost:10000,detail:'Give an older or high-quality record another moment instead of relying on launch-week heat.'}
};
function V133_focusTargets(kind){return kind==='albums'?[...(s.albums||[])].sort((a,b)=>albumStreams(b,true)-albumStreams(a,true)):(s.songs||[]).filter(x=>x.released).sort((a,b)=>(b.streams||0)-(a.streams||0))}
function V133_focusLift(kind,target,mode){
 const cfg=V133_STREAM_MODES[mode];if(!cfg||!target)return 0;
 const loyalty=clamp(Number(s.loyalty)||0,0,100),market=typeof level==='function'?level('marketability'):0,viral=typeof level==='function'?level('viralAbility'):0;
 const quality=clamp(Number(kind==='albums'?(target.criticalReception??target.cohesion??70):(target.quality??70)),0,100);
 const age=Math.max(0,s.week-Number(kind==='albums'?target.week:target.released||s.week));
 if(mode==='core')return clamp(.10+loyalty*.0008,.10,.18);
 if(mode==='algorithm')return clamp(.10+market*.0006+viral*.0006,.10,.22);
 return clamp(.08+quality*.0007+Math.min(.08,age*.004),.08,.23)
}
function V133_applyStreamFocus(kind){
 const state=V133_state();if(state.streamFocus?.week===s.week){toast?.('You already chose this week’s stream focus.');return false}
 const id=Number(document.getElementById('v133-stream-target')?.value),mode=document.getElementById('v133-stream-mode')?.value||'core',target=V133_focusTargets(kind).find(x=>Number(x.id)===id),cfg=V133_STREAM_MODES[mode];
 if(!target||!cfg)return false;if(!spend(cfg.energy,cfg.cost))return false;
 s.v133=s.v133&&typeof s.v133==='object'?s.v133:{};const lift=V133_focusLift(kind,target,mode);
 s.v133.streamFocus={week:s.week,kind,id:target.id,mode,lift,title:target.title};
 s.v133.streamFocusHistory=Array.isArray(s.v133.streamFocusHistory)?s.v133.streamFocusHistory:[];
 s.v133.streamFocusHistory.unshift({...s.v133.streamFocus});s.v133.streamFocusHistory=s.v133.streamFocusHistory.slice(0,40);
 log(`${cfg.name}: “${target.title}” is this week’s stream focus (+${Math.round(lift*100)}% raw demand before audience saturation).`);
 queueSave?.();render();toast?.(`${target.title} · ${cfg.name}`);return true
}
function V133_streamStrategyCard(kind){
 const targets=V133_focusTargets(kind),state=V133_state(),focus=state.streamFocus?.week===s.week?state.streamFocus:null;
 return `<section class="v133-stream-room"><div><span class="eyebrow">STREAM STRATEGY</span><h2>Influence demand. Don’t manufacture listeners.</h2><p>Choose one release to focus each week. Your move raises demand, while audience saturation keeps giant sandbox fan counts from turning into impossible stream totals.</p></div>${targets.length?`<div class="v133-stream-controls"><label>Focus release<select id="v133-stream-target">${targets.slice(0,40).map(x=>`<option value="${x.id}" ${focus&&Number(focus.id)===Number(x.id)?'selected':''}>${esc(x.title)}</option>`).join('')}</select></label><label>Campaign<select id="v133-stream-mode">${Object.entries(V133_STREAM_MODES).map(([id,c])=>`<option value="${id}" ${focus?.mode===id?'selected':''}>${esc(c.name)}${c.cost?' · '+money(c.cost):' · Free'}</option>`).join('')}</select></label><button class="primary" ${focus?'disabled':''} onclick="V133_applyStreamFocus('${kind}')">${focus?'Focus locked · '+esc(focus.title):'Set this week’s focus'}</button></div><div class="v133-stream-modes">${Object.values(V133_STREAM_MODES).map(c=>`<article><strong>${esc(c.name)}</strong><span>⚡ ${c.energy}${c.cost?' · '+money(c.cost):' · Free'}</span><p>${esc(c.detail)}</p></article>`).join('')}</div>${focus?`<p class="v133-focus-live"><b>LIVE:</b> ${esc(focus.title)} · ${esc(V133_STREAM_MODES[focus.mode]?.name||focus.mode)} · +${Math.round((focus.lift||0)*100)}% raw demand</p>`:''}`:'<p class="fine">Release music before setting a weekly stream focus.</p>'}</section>`
}

function V133_record(kind,key){return s.chartBook?.[kind]?.records?.[key]||null}
function V133_historyLine(kind,key,large=false){
 const rec=V133_record(kind,key),history=(rec?.history||[]).slice(-20),maxRank=kind==='songs'?100:50,w=large?360:150,h=large?96:50,pad=6;
 const pts=history.map((p,i)=>p.rank?{x:history.length===1?w/2:pad+i*(w-pad*2)/Math.max(1,history.length-1),y:pad+(p.rank-1)/Math.max(1,maxRank-1)*(h-pad*2),rank:p.rank,week:p.week}:null);
 const segments=[];let current=[];for(const p of pts){if(p)current.push(p);else if(current.length){segments.push(current);current=[]}}if(current.length)segments.push(current);
 if(!segments.length)return `<span class="v133-no-path">NO PATH YET</span>`;
 return `<svg class="v133-chart-line ${large?'large':''}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Recent chart history">${[.25,.5,.75].map(q=>`<line x1="${pad}" x2="${w-pad}" y1="${Math.round(h*q)}" y2="${Math.round(h*q)}"/>`).join('')}${segments.map(seg=>`<polyline points="${seg.map(p=>p.x.toFixed(1)+','+p.y.toFixed(1)).join(' ')}"/>`).join('')}${segments.flat().map(p=>`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${large?3:2}"><title>Week ${p.week}: #${p.rank}</title></circle>`).join('')}</svg>`
}
function V133_playerRecords(kind){return Object.entries(s.chartBook?.[kind]?.records||{}).filter(([,r])=>r.you).map(([key,r])=>({key,...r}))}
function V133_careerChartStats(kind){
 const rows=V133_playerRecords(kind),best=rows.slice().sort((a,b)=>(a.peak??999)-(b.peak??999))[0]||null,longest=rows.slice().sort((a,b)=>(b.weeks||0)-(a.weeks||0))[0]||null,ones=rows.reduce((n,r)=>n+(r.numberOneWeeks||0),0),bestDebut=rows.filter(r=>r.debutRank).sort((a,b)=>a.debutRank-b.debutRank)[0]||null;
 return {rows,best,longest,ones,bestDebut}
}
function V133_recordsStrip(kind){const a=V133_careerChartStats(kind);return `<section class="v133-record-strip"><div><span>BEST PEAK</span><strong>${a.best?.peak?'#'+a.best.peak:'—'}</strong><small>${a.best?esc(a.best.title):'No entry yet'}</small></div><div><span>#1 WEEKS</span><strong>${a.ones}</strong><small>career total</small></div><div><span>LONGEST RUN</span><strong>${a.longest?.weeks||0}</strong><small>${a.longest?esc(a.longest.title):'weeks charted'}</small></div><div><span>BEST DEBUT</span><strong>${a.bestDebut?.debutRank?'#'+a.bestDebut.debutRank:'—'}</strong><small>${a.bestDebut?esc(a.bestDebut.title):'not recorded yet'}</small></div></section>`}
function V133_story(kind){const rows=V133_playerRecords(kind).filter(r=>r.history?.length).sort((a,b)=>(a.peak??999)-(b.peak??999)||(b.weeks||0)-(a.weeks||0)).slice(0,3);if(!rows.length)return '';return `<section class="v133-story"><div class="v133-section-title"><span class="eyebrow">YOUR CHART STORY</span><h2>Runs, not just rankings.</h2><p>Every issue becomes part of the release history—debuts, peaks, dropouts and comebacks included.</p></div><div class="v133-story-grid">${rows.map(r=>`<button onclick="chartDetails('${kind}','${r.key}')"><div><strong>${esc(r.title)}</strong><span>Peak ${r.peak?'#'+r.peak:'—'} · ${r.weeks||0} weeks · ${r.numberOneWeeks||0} at #1</span></div>${V133_historyLine(kind,r.key,true)}</button>`).join('')}</div></section>`}
function V133_movers(list){return list.filter(x=>x.last&&x.rank&&x.last!==x.rank).sort((a,b)=>Math.abs((b.last||b.rank)-b.rank)-Math.abs((a.last||a.rank)-a.rank)).slice(0,3)}
function V133_moverStrip(list){const rows=V133_movers(list);if(!rows.length)return '';return `<section class="v133-movers"><span class="eyebrow">BIGGEST MOVES</span>${rows.map(x=>`<button onclick="chartDetails('${chartKind==='Albums'?'albums':'songs'}','${x.key}')"><b>${x.movement==='UP'?'↑':'↓'} ${Math.abs(x.last-x.rank)}</b><span>${esc(x.title)}</span><small>#${x.last} → #${x.rank}</small></button>`).join('')}</section>`}
function V133_chartRow(kind,x,metric,ready){const owner=x.you?chartOwner(kind,x.id):null;return `<button class="v133-chart-row ${x.you?'you':''}" onclick="chartDetails('${kind}','${x.key}')"><span class="v133-rank"><strong>${x.rank}</strong><small class="movement-${x.movement||'BASE'}">${ready?movementLabel(x):'—'}</small></span><span class="v133-release"><strong>${esc(x.title)}</strong><small>${esc(x.artist)}${x.you?' · YOU':''}</small><em>Peak ${x.peak?'#'+x.peak:'—'} · ${x.weeks||0} weeks · Debut ${x.debutRank?'#'+x.debutRank:'—'}${owner&&certificationUnits(owner,kind)>=500000?' · '+esc(certificationInfo(certificationUnits(owner,kind)).label):''}</em></span><span class="v133-path">${V133_historyLine(kind,x.key)}</span><span class="v133-volume"><strong>${compact(x[metric]||0)}</strong><small>${metric}</small></span></button>`}
function V133_chartHub(){
 const kind=chartKind==='Albums'?'albums':'songs',list=kind==='songs'?chart():albumChart(),book=s.chartBook,board=book?.[kind],ready=book?.issuedWeek!==null&&book?.issuedWeek!==undefined,visible=chartMine?list.filter(x=>x.you):list,mine=list.filter(x=>x.you),best=mine[0]||null,metric=kind==='songs'?'streams':'units',dropouts=ready?(board?.previous||[]).filter(x=>!(board?.current||[]).some(y=>y.key===x.key)):[];
 return `<article class="v133-charts"><header class="v133-chart-head"><div><span class="eyebrow">CHARTS 2.0 · ${ready?'WEEK '+book.issuedWeek:'PREVIEW'}</span><h1>${kind==='songs'?'Global Top 100':'Global Albums 50'}</h1><p>${kind==='songs'?'Weekly demand, momentum and competition decide the issue. A 250,000-stream floor only makes you eligible—it never guarantees a rank.':'Weekly album units determine the issue. 1,500 track streams equal one album unit.'}</p></div><div class="v133-chart-switch">${['Songs','Albums'].map(t=>`<button class="${chartKind===t?'active':''}" onclick="chartKind='${t}';render()">${t}</button>`).join('')}</div></header><section class="v133-chart-cover"><div><span>YOUR BEST THIS WEEK</span><strong>${best?'#'+best.rank:'—'}</strong><small>${best?esc(best.title):'No current entry'}</small></div><div><span>YOUR ENTRIES</span><strong>${mine.length}</strong><small>${mine.length?'records on this issue':'nothing charting yet'}</small></div><div><span>NEW / RE-ENTRY</span><strong>${list.filter(x=>x.movement==='NEW'||x.movement==='RE').length}</strong><small>movement events this week</small></div><div><span>ENTRY CUT</span><strong>${compact(list.at(-1)?.[metric]??(kind==='songs'?CHART_FLOOR:1000))}</strong><small>${metric}</small></div></section>${V133_recordsStrip(kind)}${V133_moverStrip(list)}${V133_story(kind)}${V133_streamStrategyCard(kind)}<div class="v133-chart-toolbar"><button aria-pressed="${chartMine}" onclick="chartMine=!chartMine;render()">${chartMine?'SHOW FULL CHART':'SHOW MY RELEASES'}</button><span>${ready?'Movement compares the previous completed issue. Tap any release for its full run.':'Advance a week to publish the first issue.'}</span></div><section class="v133-chart-table"><div class="v133-chart-columns"><span>RANK</span><span>RELEASE</span><span>20-WEEK PATH</span><span>${metric.toUpperCase()}</span></div>${visible.map(x=>V133_chartRow(kind,x,metric,ready)).join('')||'<div class="v133-empty"><strong>No chart entries yet.</strong><span>Your releases still have to beat the field after clearing the entry floor.</span></div>'}</section>${dropouts.length?`<details class="v133-drop"><summary>DROPPED OUT THIS WEEK · ${dropouts.length}</summary>${dropouts.filter(x=>!chartMine||x.you).map(x=>`<button onclick="chartDetails('${kind}','${x.key}')"><span>${esc(x.title)} · ${esc(x.artist)}</span><b>Last #${x.rank}</b></button>`).join('')||'<p>No releases of yours dropped out.</p>'}</details>`:''}<footer class="v133-chart-key"><span>NEW = debut</span><span>RE-ENTRY = returned after leaving</span><span>↑ / ↓ = movement</span><span>History keeps up to 104 issues</span></footer></article>`
}
chartHub=V133_chartHub;

const V133_releaseDetailsBase=releaseDetails;
releaseDetails=function(kind,id){V133_releaseDetailsBase(kind,id);const item=chartOwner(kind,id),el=$('modal');if(!item||!el?.open)return;const key='you:'+(kind==='songs'?'s':'a')+':'+id,rec=V133_record(kind,key),model=kind==='songs'?item.streamModel:null;el.innerHTML+=`<section class="v133-release-history"><span class="eyebrow">CHARTS 2.0</span><h3>Release history</h3>${rec?V133_historyLine(kind,key,true):'<p class="fine">No chart run recorded yet.</p>'}${rec?`<div class="v133-release-facts"><span>Peak <b>${rec.peak?'#'+rec.peak:'—'}</b></span><span>Weeks <b>${rec.weeks||0}</b></span><span>Debut <b>${rec.debutRank?'#'+rec.debutRank:'—'}</b></span><span>#1 weeks <b>${rec.numberOneWeeks||0}</b></span></div>`:''}${model?`<div class="v133-stream-readout"><strong>Latest stream model</strong><span>${compact(model.raw||0)} raw demand → ${compact(model.final||0)} resolved streams</span><small>Audience ceiling ${compact(model.ceiling||0)}${model.focusLift?' · focus +'+Math.round(model.focusLift*100)+'%':''}${model.saturated?' · diminishing reach active':''}</small></div>`:''}</section>`};
