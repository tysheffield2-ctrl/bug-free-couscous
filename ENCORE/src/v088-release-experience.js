/* ENCORE 0.8.7 release experience.
   First-chart celebrations, build-driven release notes, and unified production artist portraits. */

const V088_CORE_ATLAS='/portraits/core-atlas.webp';
const V088_ATLAS_COLUMNS=6;
const V088_ATLAS_ROWS=3;
const V088_LEGACY_COLUMNS=4;
const V088_LEGACY_ROWS=2;
const V088_LEGACY_COUNT=8;
const V088_PHOTO_POOL_SIZE=V085_CORE_COUNT+V088_LEGACY_COUNT;

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

function V088_nameHash(value){let h=2166136261;for(const c of String(value||''))h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return h}
function V088_artistNumber(key){const m=/^artist-(\d+)$/.exec(String(key||''));return m?Number(m[1]):null}
function V088_worldArtistForPhoto(key,name){
 const world=Array.isArray(s?.world)?s.world:[],n=V088_artistNumber(key),target=String(name||'');
 if(Number.isInteger(n)){
  const byId=world.find(a=>a?.id===n&&a?.name===target);if(byId)return byId;
  const byDirectory=world.find(a=>a?.directoryKey===n&&a?.name===target);if(byDirectory)return byDirectory
 }
 return world.find(a=>a?.name===target)||null
}
function V088_portraitSlot(key,name){
 const artist=V088_worldArtistForPhoto(key,name),n=V088_artistNumber(key);
 if(artist){
  const core=/^artist-(\d{2})$/.exec(String(artist.portraitId||''));
  if(core){const i=Number(core[1])-1;if(i>=0&&i<V085_CORE_COUNT)return i}
  if(Number.isInteger(artist.directoryKey))return ((artist.directoryKey%V088_PHOTO_POOL_SIZE)+V088_PHOTO_POOL_SIZE)%V088_PHOTO_POOL_SIZE;
  if(Number.isInteger(artist.id))return ((artist.id%V088_PHOTO_POOL_SIZE)+V088_PHOTO_POOL_SIZE)%V088_PHOTO_POOL_SIZE
 }
 if(Number.isInteger(n))return ((n%V088_PHOTO_POOL_SIZE)+V088_PHOTO_POOL_SIZE)%V088_PHOTO_POOL_SIZE;
 return V088_nameHash(name||key)%V088_PHOTO_POOL_SIZE
}
function V088_legacyPosition(index){const i=((Number(index)||0)%V088_LEGACY_COUNT+V088_LEGACY_COUNT)%V088_LEGACY_COUNT;return {index:i,col:i%V088_LEGACY_COLUMNS,row:Math.floor(i/V088_LEGACY_COLUMNS)}}
function V088_applyLegacyFallback(img,slot){
 if(!img||typeof CAST_ART==='undefined')return;
 const p=V088_legacyPosition(slot);img.onerror=null;img.src=CAST_ART;img.style.width=V088_LEGACY_COLUMNS*100+'%';img.style.height=V088_LEGACY_ROWS*100+'%';img.style.maxWidth='none';img.style.position='absolute';img.style.left=-(p.col*100)+'%';img.style.top=-(p.row*100)+'%';img.style.objectFit='fill'
}
function V088_portraitMarkup(slot,name,large=false){
 const label=`Portrait of fictional artist ${esc(name)}`;
 if(slot<V085_CORE_COUNT){
  const col=slot%V088_ATLAS_COLUMNS,row=Math.floor(slot/V088_ATLAS_COLUMNS);
  return `<span class="person-photo v088-core-portrait ${large?'portrait-large':''}" data-portrait-slot="${slot}" role="img" aria-label="${label}"><img class="v088-atlas-image" src="${V088_CORE_ATLAS}" alt="" decoding="async" loading="${large?'eager':'lazy'}" onerror="V088_applyLegacyFallback(this,${slot})" style="width:${V088_ATLAS_COLUMNS*100}%;height:${V088_ATLAS_ROWS*100}%;max-width:none;position:absolute;left:-${col*100}%;top:-${row*100}%"></span>`
 }
 const p=V088_legacyPosition(slot-V085_CORE_COUNT);
 return `<span class="person-photo v088-core-portrait ${large?'portrait-large':''}" data-portrait-slot="${slot}" role="img" aria-label="${label}"><img class="v088-atlas-image" src="${CAST_ART}" alt="" decoding="async" loading="${large?'eager':'lazy'}" style="width:${V088_LEGACY_COLUMNS*100}%;height:${V088_LEGACY_ROWS*100}%;max-width:none;position:absolute;left:-${p.col*100}%;top:-${p.row*100}%;object-fit:fill"></span>`
}

/* One portrait resolver now powers every artist surface. Existing-world artists keep the
   18 permanent production identities when available. Directory-only artists are assigned
   deterministically across a 26-face pool, so a 20-row directory page cannot repeat a face. */
const V088_personPhotoBase=personPhoto;
personPhoto=function(key,name,large=false){
 const artist=V088_worldArtistForPhoto(key,name),artistKey=V088_artistNumber(key);
 if(!artist&&!Number.isInteger(artistKey))return V088_personPhotoBase(key,name,large);
 return V088_portraitMarkup(V088_portraitSlot(key,name),name,large)
};
