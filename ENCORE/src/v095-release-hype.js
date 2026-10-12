/* ENCORE 0.9.4 — release hype, sandbox PULSE controls and Artist File redesign. */
const V095_SCHEMA=1;
const V095_HYPE_ACTIONS=[
 {id:'tease',name:'Tease the era',energy:5,cost:0,gain:8,note:'A low-cost hint that starts conversation without oversaturating the audience.'},
 {id:'snippet',name:'Preview / snippet',energy:8,cost:100,gain:14,note:'Give fans a real taste of the record and turn curiosity into anticipation.'},
 {id:'pulse',name:'PULSE push',energy:10,cost:500,gain:20,note:'Coordinate social posts, fan replies and creator chatter around this release.'},
 {id:'moment',name:'Major media moment',energy:15,cost:5000,gain:30,note:'Spend for a high-visibility moment designed to move a release toward maximum hype.'}
];
function migrateV095(){
 if(!s.v095)s.v095={version:V095_SCHEMA,hype:{},albumPlan:null};
 s.v095.version=V095_SCHEMA;s.v095.hype??={};s.v095.albumPlan??=null;
 migrateSocial?.()
}
function V095_hypeKey(kind,id){return kind+':'+id}
function V095_hypeState(kind,id){migrateV095();const key=V095_hypeKey(kind,id);if(!s.v095.hype[key])s.v095.hype[key]={value:0,peak:0,preReleasePeak:0,lastActionWeek:0,actionsThisWeek:0,totalSpent:0};const h=s.v095.hype[key];if(h.lastActionWeek!==s.week){h.lastActionWeek=s.week;h.actionsThisWeek=0}h.value=clamp(Number(h.value)||0,0,100);h.peak=clamp(Number(h.peak)||0,0,100);h.preReleasePeak=clamp(Number(h.preReleasePeak)||0,0,100);return h}
function V095_target(kind,id){
 if(kind==='songs')return s.songs.find(x=>x.id===Number(id));
 if(kind==='draft')return s.draft&&String(s.draft.id)===String(id)?s.draft:null;
 if(kind==='albums')return s.albums.find(x=>x.id===Number(id));
 if(kind==='albumPlan')return s.v095?.albumPlan&&String(s.v095.albumPlan.id)===String(id)?s.v095.albumPlan:null;
 return null
}
function V095_isReleased(kind,target){return kind==='songs'?!!target?.released:kind==='albums'?true:false}
function V095_hypeLabel(value){return value>=100?'MAX HYPE':value>=80?'Fever pitch':value>=60?'Hot':value>=35?'Building':value>0?'Early buzz':'Quiet'}
function V095_hypeMeter(kind,id,compactMode=false){
 const target=V095_target(kind,id);if(!target)return '';
 const h=V095_hypeState(kind,id),released=V095_isReleased(kind,target);
 return `<div class="hype-meter-v095 ${compactMode?'compact':''}"><div class="sectionhead"><span>${released?'Current hype':'Pre-release hype'}</span><strong>${Math.round(h.value)}/100 · ${V095_hypeLabel(h.value)}</strong></div><div class="bar"><i style="width:${h.value}%"></i></div>${compactMode?'':`<p class="fine">Peak ${Math.round(h.peak)}/100${released&&h.preReleasePeak?` · Launch buildup peaked at ${Math.round(h.preReleasePeak)}/100`:''}. Hype boosts attention; music quality, audience fit and timing still decide the result.</p>`}</div>`
}
function V095_hypeActions(kind,id){
 const target=V095_target(kind,id);if(!target)return '';
 const h=V095_hypeState(kind,id),released=V095_isReleased(kind,target),locked=h.actionsThisWeek>=3||h.value>=100;
 return `<div class="hype-actions-v095">${V095_HYPE_ACTIONS.map(a=>`<button type="button" class="hype-action-v095" ${locked?'disabled':''} onclick="V095_applyHype('${kind}','${id}','${a.id}')"><strong>${esc(a.name)}</strong><span>+${a.gain} hype · ⚡ ${a.energy}${a.cost?' · '+money(a.cost):' · Free'}</span><small>${esc(a.note)}</small></button>`).join('')}</div><p class="fine">${h.value>=100?'Maximum hype reached. Release timing matters now.':h.actionsThisWeek>=3?'Three hype moves used on this release this week. Advance the week to push again.':released?'Post-release hype can revive discovery and extend a run.':'Build over multiple weeks, then release near your peak for the strongest launch.'}</p>`
}
function V095_applyHype(kind,id,actionId){
 const target=V095_target(kind,id),a=V095_HYPE_ACTIONS.find(x=>x.id===actionId);if(!target||!a)return;
 const h=V095_hypeState(kind,id);if(h.value>=100){toast('This release is already at maximum hype.');return}if(h.actionsThisWeek>=3){toast('You already made three hype moves for this release this week.');return}
 if(!spend(a.energy,a.cost))return;
 const repeated=Math.max(0,h.actionsThisWeek-1),gain=Math.max(4,Math.round(a.gain*(1-repeated*.08))),before=h.value;
 h.value=clamp(h.value+gain,0,100);h.peak=Math.max(h.peak,h.value);h.actionsThisWeek++;h.totalSpent=cents((h.totalSpent||0)+a.cost);
 if(!V095_isReleased(kind,target))h.preReleasePeak=Math.max(h.preReleasePeak,h.value);
 log(`${a.name}: “${target.title||target.name||'Upcoming release'}” hype rose from ${Math.round(before)} to ${Math.round(h.value)}/100.`);
 render();toast((target.title||target.name||'Release')+' · '+Math.round(h.value)+'/100 hype')
}
function V095_transferHype(fromKind,fromId,toKind,toId){
 const from=V095_hypeState(fromKind,fromId),to=V095_hypeState(toKind,toId);
 to.value=Math.max(to.value,from.value);to.peak=Math.max(to.peak,from.peak);to.preReleasePeak=Math.max(to.preReleasePeak,from.preReleasePeak,from.value);to.totalSpent=cents((to.totalSpent||0)+(from.totalSpent||0));
 delete s.v095.hype[V095_hypeKey(fromKind,fromId)]
}
function V095_decayHype(){
 migrateV095();
 for(const [key,h] of Object.entries(s.v095.hype)){
  const [kind,id]=key.split(':'),target=V095_target(kind,id);if(!target)continue;
  const released=V095_isReleased(kind,target),decay=released?10:4;
  h.value=Math.max(0,(Number(h.value)||0)-decay);h.actionsThisWeek=0;h.lastActionWeek=s.week+1
 }
 if(s.v095.albumPlan){const h=V095_hypeState('albumPlan',s.v095.albumPlan.id);s.v095.albumPlan.hype=h.value}
}
const V095_finishCareerWeekBase=finishCareerWeek;
finishCareerWeek=function(){V095_finishCareerWeekBase();V095_decayHype()};

const V095_adjustReleaseStreamsBase=adjustReleaseStreams;
adjustReleaseStreams=function(track,n){
 let out=V095_adjustReleaseStreamsBase(track,n);migrateV095();
 const song=V095_hypeState('songs',track.id),age=Math.max(0,s.week-track.released);
 const songLift=(song.value/100)*(age===0?1.25:age<4?.8:age<12?.5:.25);
 const album=s.albums.find(a=>a.id===track.album),albumHype=album?V095_hypeState('albums',album.id):null;
 const albumAge=album?Math.max(0,s.week-album.week):99,albumLift=albumHype?(albumHype.value/100)*(albumAge===0?.9:albumAge<4?.55:.2):0;
 const lift=Math.min(2,songLift+albumLift);
 if(lift>0){out=Math.round(out*(1+lift));track.hypeLift=Math.round(lift*100)}
 return out
};

function V095_unreleasedHypeCard(){
 migrateV095();const finished=s.songs.filter(x=>!x.released&&!x.album);
 if(!finished.length)return '';
 return `<section class="card hype-studio-v095"><span class="eyebrow">PRE-RELEASE HYPE</span><h2>Make the release feel like an event.</h2><p>Finished records can build anticipation before you publish them. Maximum hype is 100; you can make up to three hype moves per release each week.</p>${finished.map(x=>`<div class="hype-release-row-v095"><div><strong>${esc(x.title)}</strong>${V095_hypeMeter('songs',x.id,true)}</div><button class="secondary" onclick="V095_openHype('songs','${x.id}')">Build hype</button></div>`).join('')}</section>`
}
function V095_draftHypeCard(){
 const d=s.draft;if(!d||d.steps!==3)return '';
 return `<section class="card hype-studio-v095"><span class="eyebrow">BEFORE YOU DROP IT</span><h2>Build anticipation for “${esc(d.title)}”.</h2>${V095_hypeMeter('draft',d.id)}<button class="secondary" onclick="V095_openHype('draft','${d.id}')">Build pre-release hype</button></section>`
}
function V095_openHype(kind,id){
 const target=V095_target(kind,id);if(!target)return;
 const released=V095_isReleased(kind,target);
 modal(`<span class="eyebrow">${released?'POST-RELEASE MOMENTUM':'PRE-RELEASE BUILDUP'}</span><h2>${esc(target.title||target.name||'Upcoming release')}</h2>${V095_hypeMeter(kind,id)}${V095_hypeActions(kind,id)}`)
}
const V095_studioBase=studio;
studio=function(){const html=V095_studioBase();return html+(s.draft?V095_draftHypeCard():V095_unreleasedHypeCard())};

const V095_finishSongBase=finishSong;
finishSong=function(release,confirmed=false){
 const draft=s.draft,fromId=draft?.id,before=s.songs.length;
 V095_finishSongBase(release,confirmed);
 if(fromId&&s.songs.length>before){const created=s.songs.at(-1);if(s.v095?.hype?.[V095_hypeKey('draft',fromId)])V095_transferHype('draft',fromId,'songs',created.id);render()}
};

function V095_planAlbum(e){
 e.preventDefault();migrateV095();const f=new FormData(e.target),title=String(f.get('albumPlanTitle')||'').trim().slice(0,55);if(!title)return;
 if(s.v095.albumPlan&&s.v095.albumPlan.title!==title){delete s.v095.hype[V095_hypeKey('albumPlan',s.v095.albumPlan.id)]}
 const existing=s.v095.albumPlan?.title===title?s.v095.albumPlan:null;
 s.v095.albumPlan=existing||{id:Date.now(),title,createdWeek:s.week};V095_hypeState('albumPlan',s.v095.albumPlan.id);
 render();toast('Album era planned · '+title)
}
function V095_clearAlbumPlan(){migrateV095();if(!s.v095.albumPlan)return;delete s.v095.hype[V095_hypeKey('albumPlan',s.v095.albumPlan.id)];s.v095.albumPlan=null;render()}
function V095_albumPlanCard(){
 migrateV095();const p=s.v095.albumPlan;
 if(!p)return `<section class="card album-hype-v095"><span class="eyebrow">ALBUM ANTICIPATION</span><h2>Build hype before the album exists in your catalog.</h2><p>Name the upcoming era now. The hype you build transfers to the album when you release an album with the same title.</p><form class="form" onsubmit="V095_planAlbum(event)"><label>Upcoming album title<input name="albumPlanTitle" maxlength="55" required placeholder="Name the era"></label><button class="primary">Start album hype plan</button></form></section>`;
 return `<section class="card album-hype-v095"><span class="eyebrow">UPCOMING ALBUM</span><div class="sectionhead"><div><h2>${esc(p.title)}</h2><p>Release an album with this title to carry the full buildup into launch week.</p></div><button class="text-button" onclick="V095_clearAlbumPlan()">Cancel plan</button></div>${V095_hypeMeter('albumPlan',p.id)}<button class="secondary" onclick="V095_openHype('albumPlan','${p.id}')">Build album hype</button></section>`
}
const V095_marketingPageBase=marketingPage;
marketingPage=function(){return V095_marketingPageBase()+V095_albumPlanCard()};

const V095_albumFormBase=albumForm;
albumForm=function(){
 V095_albumFormBase();migrateV095();
 const p=s.v095.albumPlan,input=$('albumtitle');
 if(p&&input&&!input.value){input.value=p.title}
 const form=input?.closest('form');if(form&&p){form.insertAdjacentHTML('afterbegin',`<div class="album-plan-callout-v095"><strong>Planned era · ${esc(p.title)}</strong><span>${Math.round(V095_hypeState('albumPlan',p.id).value)}/100 pre-release hype ready to transfer if the title matches.</span></div>`)}
};
const V095_releaseAlbumBase=releaseAlbum;
releaseAlbum=function(e,confirmed=false){
 const before=s.albums.length,plan=s.v095?.albumPlan?{...s.v095.albumPlan}:null;
 V095_releaseAlbumBase(e,confirmed);
 if(s.albums.length>before){const album=s.albums.at(-1);if(plan&&album.title.trim().toLowerCase()===plan.title.trim().toLowerCase()){V095_transferHype('albumPlan',plan.id,'albums',album.id);s.v095.albumPlan=null;log('The pre-release hype for “'+album.title+'” carried into launch week.')}render()}
};

const V095_releaseDetailsBase=releaseDetails;
releaseDetails=function(kind,id){
 V095_releaseDetailsBase(kind,id);const item=chartOwner(kind,id),el=$('modal');if(!item||!el?.open)return;
 el.innerHTML+=`<section class="release-hype-detail-v095"><span class="eyebrow">RELEASE HYPE</span>${V095_hypeMeter(kind,id)}<button class="primary" onclick="$('modal').close();V095_openHype('${kind}','${id}')">Hype this ${kind==='songs'?'song':'album'}</button>${item.hypeLift?`<p class="fine">Current stream lift from active release hype: +${item.hypeLift}% before other weekly outcomes.</p>`:''}</section>`
};

/* Sandbox-only PULSE controls. Normal career UI never exposes these fields. */
const V095_socialAnalyticsBase=socialAnalytics;
socialAnalytics=function(){
 const base=V095_socialAnalyticsBase();migrateSocial();
 if(!SANDBOX||!Number.isFinite(s.social.sandboxEngagementRate))return base;
 const rate=Math.max(0,s.social.sandboxEngagementRate),engagements=Math.round(base.views*rate),engagedReach=base.posts.length?base.views*rate/base.posts.length:0;
 const signal=base.posts.length?Math.round(clamp(Math.log10(1+engagedReach)*13+Math.min(20,rate*200)+Math.min(10,base.posts.length*2))):0;
 return {...base,engagements,rate,engagedReach,signal}
};
const V095_sandboxEditorBase=sandboxEditor;
sandboxEditor=function(){
 if(!SANDBOX)return;V095_sandboxEditorBase();migrateSocial();
 const el=$('modal');if(!el?.open)return;
 const rate=Number.isFinite(s.social.sandboxEngagementRate)?s.social.sandboxEngagementRate*100:V095_socialAnalyticsBase().rate*100;
 el.innerHTML=el.innerHTML.replace('<h3>Artist skills · 0–100</h3>',`<h3>PULSE sandbox controls</h3><p class="fine">These fields exist only in ENCORE LAB. They never appear in a normal career.</p><label>PULSE followers<input name="pulseFollowers" type="number" min="0" max="9007199254740991" step="1" value="${Math.round(s.social.followers)}" required></label><label>PULSE engagement rate (%)<input name="pulseEngagement" type="number" min="0" max="10000" step="0.1" value="${rate.toFixed(1)}" required></label><p class="fine">Engagement may exceed 100% because a viewer can like, comment and share the same post.</p><h3>Artist skills · 0–100</h3>`)
};
const V095_applySandboxEditsBase=applySandboxEdits;
applySandboxEdits=function(event){
 if(!SANDBOX)return;const f=new FormData(event.target),followers=Number(f.get('pulseFollowers')),engagement=Number(f.get('pulseEngagement'));
 if(!Number.isSafeInteger(followers)||followers<0||followers>Number.MAX_SAFE_INTEGER){$('lab-error').textContent='Enter a whole-number PULSE follower count.';event.preventDefault();return}
 if(!Number.isFinite(engagement)||engagement<0||engagement>10000){$('lab-error').textContent='Enter PULSE engagement from 0% to 10,000%.';event.preventDefault();return}
 V095_applySandboxEditsBase(event);if($('modal').open)return;
 migrateSocial();s.social.followers=followers;s.social.sandboxEngagementRate=engagement/100;log('Sandbox PULSE followers and engagement rate updated.');queueSave();render();toast('Sandbox PULSE settings applied.')
};
