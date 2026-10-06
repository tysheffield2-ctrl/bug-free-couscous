/* ENCORE 0.8.7 release experience.
   First-chart celebrations, build-driven release notes, and the production core-artist portrait atlas. */

const V088_CORE_ATLAS='/portraits/core-atlas.webp';
const V088_ATLAS_COLUMNS=6;
const V088_ATLAS_ROWS=3;

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

function V088_portraitAtlasPosition(id){
 const m=/^artist-(\d{2})$/.exec(String(id||''));if(!m)return null;
 const index=Number(m[1])-1;if(index<0||index>=V085_CORE_COUNT)return null;
 return {index,col:index%V088_ATLAS_COLUMNS,row:Math.floor(index/V088_ATLAS_COLUMNS)}
}
function V088_portraitFallback(img,id){
 const fallback=typeof V085_portraitSource==='function'?V085_portraitSource(id):null;if(!fallback||!img)return;
 img.onerror=null;img.removeAttribute?.('style');img.style.width='100%';img.style.height='100%';img.style.maxWidth='100%';img.style.position='absolute';img.style.inset='0';img.style.objectFit='cover';img.src=fallback
}
const V088_personPhotoBase=personPhoto;
personPhoto=function(key,name,large=false){
 const artist=typeof V085_artistForPhoto==='function'?V085_artistForPhoto(key,name):null,pos=artist?V088_portraitAtlasPosition(artist.portraitId):null;
 if(!artist||!pos)return V088_personPhotoBase(key,name,large);
 return `<span class="person-photo v088-core-portrait ${large?'portrait-large':''}" role="img" aria-label="Portrait of fictional artist ${esc(name)}"><img class="v088-atlas-image" src="${V088_CORE_ATLAS}" alt="" decoding="async" loading="${large?'eager':'lazy'}" onerror="V088_portraitFallback(this,'${artist.portraitId}')" style="width:${V088_ATLAS_COLUMNS*100}%;height:${V088_ATLAS_ROWS*100}%;max-width:none;position:absolute;left:-${pos.col*100}%;top:-${pos.row*100}%"></span>`
};
