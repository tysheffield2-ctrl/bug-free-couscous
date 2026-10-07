/* ENCORE 0.8.7 release experience.
   First-chart celebrations, build-driven release notes, and a temporary initials-only
   people presentation while the visual cast is reworked. */

function V088_releaseItems(){
 const items=typeof ENCORE_RELEASE_NOTES!=='undefined'?ENCORE_RELEASE_NOTES.items:null;
 return Array.isArray(items)&&items.length?items:['Latest gameplay, presentation and stability improvements.'];
}
function V088_openWhatsNew(){
 const items=V088_releaseItems().slice(0,10);
 modal(`<span class="eyebrow">ENCORE · ${esc(GAME_VERSION)}</span><h2>What’s new.</h2><ul class="release-whats-new">${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><button class="primary" onclick="$('modal').close()">Back to ENCORE</button>`)
}

/* Every genuine first player chart entry gets surfaced, whether it happens on release week or later.
   RE-ENTRY and recovered historical ENTRY rows are intentionally excluded. */
lateChartAlerts=function(){
 for(const kind of ['songs','albums'])for(const row of s.chartBook?.[kind]?.current||[]){
  if(!row.you||row.movement!=='NEW')continue;
  const item=chartOwner(kind,row.id);if(!item)continue;
  const isSong=kind==='songs',chartName=isSong?'Global Top 100':'Global Albums 50',type=isSong?'song':'album';
  const id=`first-chart:${kind}:${item.id}`;
  addBriefing(id,'Celebration',`First chart entry · #${row.rank}`,`“${item.title}” entered the ${chartName} at #${row.rank}. This is the first recorded chart appearance for your ${type}.`,`Open Industry → Charts to see its movement, peak and weeks charted.`);
  log(`“${item.title}” made its first ${type} chart entry at #${row.rank} on the ${chartName}.`);
  if(typeof milestone==='function')milestone(`first-chart-${kind}-${item.id}`,`${item.title} charted`,`${chartName} debut #${row.rank}`)
 }
};

const V088_offerBriefingButtonBase=offerBriefingButton;
offerBriefingButton=function(b){
 if(b?.id?.startsWith('first-chart:'))return `<button class="memo-primary" onclick="$('modal').close();industryTab='Charts';go('Industry')">View charts</button>`;
 return V088_offerBriefingButtonBase(b)
};

/* Keep exactly one update surface on the title screen. Older 0.8.x wrappers created
   their own button; normalize that button to the current build instead of stacking panels. */
const V088_renderTitleBase=renderTitle;
renderTitle=function(){
 V088_renderTitleBase();
 const el=$('title-screen');
 if(!el||el.hidden||!el.innerHTML)return;
 let html=el.innerHTML.replace(/<details class="intro-whats-new"[\s\S]*?<\/details>/gi,'');
 const update=`<button class="intro-secondary" onclick="V088_openWhatsNew()">What’s new in ${esc(GAME_VERSION)}</button>`;
 const legacy=/<button\b[^>]*>What(?:’|')s new in [^<]*<\/button>/i;
 if(legacy.test(html))html=html.replace(legacy,update);
 else html=html.replace('<button class="intro-secondary" onclick="betaInfo()">Beta info & feedback</button>',update+'<button class="intro-secondary" onclick="betaInfo()">Beta info & feedback</button>');
 el.innerHTML=html
};

/* Beta Info is for testing, backup and feedback. Release notes live in one place only:
   the current-version What’s New button on the title screen. */
const V088_betaInfoBase=betaInfo;
betaInfo=function(){
 V088_betaInfoBase();
 const el=$('modal');if(!el?.innerHTML)return;
 el.innerHTML=el.innerHTML.replace(/<details><summary>What(?:’|')s new ·[\s\S]*?<\/details>/i,'')
};

/* Portraits are intentionally disabled during the current visual-cast rework. Every
   fictional person uses the same initials-tile treatment so old portrait layers cannot
   leak back into artist, staff, agent, catalog, offer, or directory surfaces. The source
   image assets remain in the repository for future visual work. */
function V088_initials(name){
 const parts=String(name||'?').trim().split(/\s+/).filter(Boolean);
 return (parts.slice(0,2).map(p=>p[0]).join('')||'?').toUpperCase()
}
function V088_initialPhoto(name,large=false){
 const initials=esc(V088_initials(name)),label=esc(`Initials for ${name}`);
 return `<span class="person-photo v085-initial-portrait ${large?'portrait-large':''}" role="img" aria-label="${label}" style="display:grid;place-items:center;font-weight:900;letter-spacing:.04em;background:linear-gradient(145deg,#172536,#2a4057);color:#f4f7fb;border:1px solid rgba(255,255,255,.12)"><span style="font-size:${large?'2.2rem':'1rem'}">${initials}</span></span>`
}
personPhoto=function(key,name,large=false){return V088_initialPhoto(name,large)};
