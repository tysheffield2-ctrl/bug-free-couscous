/* ENCORE focused-system restoration: Charts and PULSE. No legacy renderer or extra overlay. */
EUI.chartKind='songs';EUI.chartMine=false;EUI.chartKey='';EUI.pulseCompose=false;
EUI.charts=function coreChartsPage(){
 const kind=EUI.chartKind==='albums'?'albums':'songs',isSong=kind==='songs';
 const issued=s.chartBook?.issuedWeek;
 const ready=issued!==null&&issued!==undefined;
 const list=isSong?chart():albumChart();
 const mine=list.filter(x=>x.you);
 const metric=isSong?'streams':'units',count=isSong?100:50;
 const shown=list.map((x,index)=>({x,index})).filter(r=>!EUI.chartMine||r.x.you).slice(0,EUI.chartMine?50:25);
 const entries=mine.length,highest=mine[0];
 return `<section class="core-summary"><span>${ready?'Week '+issued+' · Official issue':'Preview · First issue pending'}</span><h2>Global ${isSong?'Top 100':'Albums 50'}</h2><p>${isSong?'Weekly streams determine song rankings. At least 250,000 streams are required to be eligible, not guaranteed a spot.':'Album rankings depend on weekly equivalent units. At least 1,000 units are required to qualify.'}</p></section>
 <div class="core-tabstrip" role="group" aria-label="Chart type">
 <button type="button" aria-pressed="${isSong}" onclick="EUI.chartKind='songs';render()">Songs</button>
 <button type="button" aria-pressed="${!isSong}" onclick="EUI.chartKind='albums';render()">Albums</button></div>
 <div class="core-metric-strip"><div><small>My entries</small><strong>${entries}</strong></div><div><small>My best rank</small><strong>${highest?'#'+(highest.rank||list.indexOf(highest)+1):'—'}</strong></div><div><small>Charted</small><strong>${list.length}/${count}</strong></div></div>
 <div class="core-tabstrip core-chart-filter" role="group" aria-label="Chart visibility">
 <button type="button" aria-pressed="${!EUI.chartMine}" onclick="EUI.chartMine=false;render()">Top 25</button>
 <button type="button" aria-pressed="${EUI.chartMine}" onclick="EUI.chartMine=true;render()">My releases</button></div>
 <div class="core-list">${shown.map(({x,index})=>EUI.row(isSong?'song':'album','#'+(x.rank||index+1)+' '+x.title,`${x.artist}${x.you?' · You':''} · ${compact(x[metric]||0)} ${metric} · ${ready?movementLabel(x):'Preview'}`,`EUI.openChartRow(${index})`)).join('')||EUI.empty(EUI.chartMine?'None of your releases are charting. Keep building real weekly demand.':'No eligible releases yet. Results are decided when you end the week.')}</div>
 <p class="core-note">${EUI.chartMine?'Only your current chart entries are shown. Historical peaks stay on your Artist File.':'The Top 25 is shown for comfortable phone browsing. Switch to My releases for your own entries beyond the Top 25.'} Charts are fictional and reflect the ENCORE simulation.</p>`;
};
EUI.openChartRow=function coreOpenChartRow(index){
 const kind=EUI.chartKind==='albums'?'albums':'songs';
 const list=kind==='songs'?chart():albumChart();
 const row=list[index];
 if(!row)return;
 if(row.you&&Number.isInteger(Number(row.id)))return EUI.detail(kind,Number(row.id));
 EUI.remember();
 EUI.chartKey=String(row.key||'');
 tab='ChartRecord';render();
 window.scrollTo?.(0,0);
};
EUI.chartRecordPage=function coreChartRecordPage(){
 const kind=EUI.chartKind==='albums'?'albums':'songs';
 const data=chartRecord(kind,EUI.chartKey);
 const row=s.chartBook?.[kind]?.current?.find(x=>x.key===EUI.chartKey);
 if(!data)return EUI.empty('This issue is a preview. Advance a week to begin a verified chart history.');
 const events=(data.history||[]).slice(-12).reverse();
 return `<section class="core-summary"><span>${kind==='songs'?'Song chart':'Album chart'} · ${row?'On the chart':'Previous entry'}</span><h1>${esc(data.title)}</h1><p>${esc(data.artist)}</p></section>
 ${profileRows([['Current position',row?'#'+row.rank:'Off chart'],['Best position',data.peak?'#'+data.peak:'—'],['Chart debut',data.debutRank?'#'+data.debutRank+' · Week '+data.debutWeek:'Older than tracking'],['Weeks charted',data.weeks||0],['Weeks at #1',data.numberOneWeeks||0]])}
 <h2>Chart history</h2><ol class="core-chart-history">${events.map(x=>`<li><span>Week ${x.week}</span><strong>${x.rank?'#'+x.rank:'Off chart'}</strong></li>`).join('')||'<li>No issue history recorded yet.</li>'}</ol>
 <p class="core-note">Peak and career totals are retained. This view shows the twelve most recent chart events.</p>`;
};
EUI.pulse=function corePulsePage(){
 migrateSocial();
 const social=s.social,stats=socialAnalytics(),weekPosts=social.posts.filter(p=>p.week===s.week).length;
 const draft=s.corePulseDraft&&typeof s.corePulseDraft==='object'?s.corePulseDraft:{format:'clip',caption:'',song:''};
 const released=s.songs.filter(x=>x.released);
 const eligible=labelDeals.filter(deal=>socialLabelReadiness(deal).ready).length;
 return `<section class="core-summary"><span>Fictional social network · Week ${s.week}</span><h2>@${esc(s.name.toLowerCase().replace(/[^a-z0-9]/g,'')||'artist')}</h2><p>Build an audience, amplify releases and connect with other artists.</p></section>
 <div class="core-metric-strip"><div><small>Followers</small><strong>${compact(social.followers)}</strong></div><div><small>Recent views</small><strong>${compact(stats.views)}</strong></div><div><small>Engagement</small><strong>${(stats.rate*100).toFixed(1)}%</strong></div></div>
 <p class="core-note">True fans and followers are different. Your recent engagement and consistency can attract label attention.</p>
 <button class="core-primary" type="button" ${weekPosts>=3?'disabled':''} onclick="EUI.pulseCompose=!EUI.pulseCompose;render()">${weekPosts>=3?'3 posts published this week':EUI.pulseCompose?'Hide composer':'Write a PULSE post · '+weekPosts+'/3 this week'}</button>
 ${EUI.pulseCompose&&weekPosts<3?`<form class="core-form core-pulse-compose" oninput="EUI.capturePulse(this)" onchange="EUI.capturePulse(this)" onsubmit="EUI.submitPulse(event)">
 <label>Post format<select name="format">${pulseFormats.map(f=>`<option value="${f.id}" ${f.id===draft.format?'selected':''}>${esc(f.name)} · ${f.energy} energy</option>`).join('')}</select></label>
 <label>Caption<textarea name="caption" maxlength="220" rows="4" placeholder="Share a moment from your music career..." required>${esc(String(draft.caption||'').slice(0,220))}</textarea></label>
 <label>Link a released song<select name="song"><option value="">No song linked</option>${released.map(x=>`<option value="${x.id}" ${String(draft.song)===String(x.id)?'selected':''}>${esc(x.title)}</option>`).join('')}</select></label>
 <p class="core-note">Performance, stories and release announcements reach different audiences. A linked song can gain additional weekly discovery. Captions are saved while you edit.</p>
 <button class="core-primary" type="submit">Publish post</button></form>`:''}
 <h2>Your posts <small>${social.posts.length}</small></h2>
 <div class="core-social-feed">${social.posts.slice(-12).reverse().map(p=>`<article class="core-social-post"><div class="core-social-head"><strong>${esc(pulseFormats.find(f=>f.id===p.format)?.name||'Post')}</strong><small>Week ${p.week}${p.viral?' · Viral':''}</small></div><p>${esc(p.caption)}</p>${p.song?`<p class="core-note">♪ ${esc(s.songs.find(x=>x.id===p.song)?.title||'Catalog track')}</p>`:''}<p class="core-social-counts">${compact(p.views)} views · ${compact(p.likes)} likes · ${compact(p.comments)} comments · ${compact(p.shares)} shares</p><p class="core-note">+${compact(p.followers)} followers · +${compact(p.fans)} true fans</p><p class="core-social-reaction">“${esc(p.reaction)}”</p><button class="core-secondary" type="button" ${p.replied||p.week!==s.week||s.energy<5?'disabled':''} onclick="replyPulse(${p.id})">${p.replied?'Replied':'Reply to fans · 5 energy'}</button></article>`).join('')||EUI.empty('Write your first post to begin building a public presence.')}</div>
 <h2>Industry feed</h2><p class="core-note">Supporting another artist costs 2 energy and improves the relationship once per artist per week.</p>
 <div class="core-list">${social.feed.slice(-12).reverse().filter(p=>s.world[p.artist]).map(p=>{const a=s.world[p.artist],done=social.interactions.some(x=>x.week===s.week&&x.artist===p.artist);return EUI.row('people',a.name,`${p.text} · ${done?'Supported':'Support · 2 energy'}`,`EUI.supportFromFeed(${p.artist})`)}).join('')||EUI.empty('Industry posts arrive as the weeks advance.')}</div>
 <h2>Label radar</h2><div class="core-metric-strip"><div><small>Discovery signal</small><strong>${stats.signal}/100</strong></div><div><small>Potentially eligible</small><strong>${eligible}</strong></div></div>
 <p class="core-note">Scouting also depends on reputation, followers and a released song. Existing label checks continue to run at their normal intervals.</p>`;
};
EUI.capturePulse=function coreCapturePulse(form){
 const f=new FormData(form);
 s.corePulseDraft={format:String(f.get('format')||'clip'),caption:String(f.get('caption')||'').slice(0,220),song:String(f.get('song')||'')};
 queueSave();
};
EUI.submitPulse=function coreSubmitPulse(event){
 event.preventDefault();
 EUI.capturePulse(event.target);
 migrateSocial();
 const before=s.social.posts.length;
 publishPulse(event);
 if(s.social.posts.length>before){
  s.corePulseDraft={format:'clip',caption:'',song:''};
  EUI.pulseCompose=false;
  queueSave();render();
 }
};
EUI.supportFromFeed=function coreSupportFromFeed(id){
 const a=s.world[id],old=a?.relation;
 supportPulse(id);
 if(a&&a.relation===old)toast('Already supported this artist this week, or not enough energy.');
};
