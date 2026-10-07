/* ENCORE core cast portrait identity.
   The first 18 artists have permanent portrait IDs backed by individual production WebP files.
   One artist -> one portraitId -> one image file everywhere personPhoto() is used. */
const V085_CORE_CAST=[
 ['Mira Wells','female','Pop','artist-01'],['Cairo Vale','male','R&B','artist-02'],
 ['Amara Sun','female','Afrobeats','artist-03'],['Orion Saint','male','Hip-hop','artist-04'],
 ['Selah Monroe','female','R&B','artist-05'],['Malik Cross','male','Hip-hop','artist-06'],
 ['Zara Voss','female','Electronic','artist-07'],['Leon Rivers','male','Rock','artist-08'],
 ['Nyla Hart','female','Pop','artist-09'],['Theo Knox','male','Country','artist-10'],
 ['Sanaa Rose','female','Gospel','artist-11'],['Nico Lane','male','Indie folk','artist-12'],
 ['Talia North','female','Country','artist-13'],['Jalen Storm','male','R&B','artist-14'],
 ['Lyra Quinn','female','K-pop','artist-15'],['Idris Blue','male','Jazz','artist-16'],
 ['Nova Rey','female','Latin','artist-17'],['Kofi Dawn','male','Afrobeats','artist-18']
].map(([name,gender,genre,portraitId],index)=>({index,name,gender,genre,portraitId}));
const V085_CORE_COUNT=V085_CORE_CAST.length;
const V085_CORE_BY_NAME=new Map(V085_CORE_CAST.map(a=>[a.name,a]));
const V085_CORE_BY_ID=new Map(V085_CORE_CAST.map(a=>[a.portraitId,a]));
const V085_makeWorldBase=makeWorld;
makeWorld=function(){const world=V085_makeWorldBase();for(let i=0;i<V085_CORE_COUNT&&i<world.length;i++){const c=V085_CORE_CAST[i];world[i]={...world[i],name:c.name,genre:c.genre,portraitId:c.portraitId,coreArtist:true}}return world};
function V085_assignPortraits(world=s.world){
 if(!Array.isArray(world))return;
 /* Name is the canonical identity. This also repairs old saves that carried a mismatched
    portraitId from an earlier portrait implementation. */
 for(const a of world){
  const canonical=V085_CORE_BY_NAME.get(a?.name);
  if(canonical){a.portraitId=canonical.portraitId;a.coreArtist=true}
 }
 /* Preserve the fixed first-18 cast on legacy saves whose names predate the core cast. */
 for(let i=0;i<Math.min(V085_CORE_COUNT,world.length);i++){
  const a=world[i],canonical=V085_CORE_CAST[i];
  if(!V085_CORE_BY_NAME.has(a?.name)&&a?.coreArtist){a.portraitId=canonical.portraitId}
 }
}
function migrateV085(){s.v085??={version:2};s.v085.version=2;V085_assignPortraits()}
function V085_portraitSource(id){
 const key=String(id||'');
 return V085_CORE_BY_ID.has(key)?`/portraits/artists/${key}.webp`:null;
}
function V085_artistForPhoto(key,name){
 const canonical=V085_CORE_BY_NAME.get(String(name||''));
 if(canonical){
  const worldArtist=s.world?.find?.(a=>a.name===canonical.name);
  return worldArtist||canonical;
 }
 const m=/^artist-(\d+)$/.exec(String(key||''));
 if(m){
  const a=s.world?.[Number(m[1])];
  if(a&&V085_CORE_BY_ID.has(a.portraitId))return a;
 }
 return s.world?.find?.(a=>a.coreArtist&&V085_CORE_BY_ID.has(a.portraitId))||null;
}
const V085_personPhotoBase=personPhoto;
personPhoto=function(key,name,large=false){
 const a=V085_artistForPhoto(key,name),src=a?V085_portraitSource(a.portraitId):null;
 if(!src)return V085_personPhotoBase(key,name,large);
 return `<img class="person-photo v085-core-portrait ${large?'portrait-large':''}" src="${src}" alt="Portrait of ${esc(name)}" decoding="async" loading="${large?'eager':'lazy'}">`;
};
V084_featuredIndustryRoster=function(world=V084_activeIndustryRoster()){return V084_filteredIndustryRoster(world).slice(0,V085_CORE_COUNT)};
const V085_industryBase=industry;
industry=function(){const html=V085_industryBase();if(industryTab!=='Artists')return html;return html.replace(/(\d+) featured · (\d+) active artists?/,'$2 artists')};
const V085_renderBase=render;
render=function(){migrateV085();return V085_renderBase()};
