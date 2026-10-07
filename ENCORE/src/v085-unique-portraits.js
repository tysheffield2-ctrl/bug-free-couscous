/* ENCORE artist identity presentation.
   Portrait assets remain available for future use, but the Industry artist directory and
   featured cards intentionally use initials for every artist until the visual cast is ready.
   Never reuse another artist's face as a fallback. */
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
const V085_FEATURED_COUNT=5;
const V085_makeWorldBase=makeWorld;
makeWorld=function(){
 const world=V085_makeWorldBase();
 for(let i=0;i<V085_CORE_COUNT&&i<world.length;i++){
  const c=V085_CORE_CAST[i];
  world[i]={...world[i],name:c.name,genre:c.genre,coreArtist:true};
  delete world[i].portraitId;
 }
 return world
};
function V085_assignPortraits(world=s.world){
 if(!Array.isArray(world))return;
 for(const a of world){
  /* Clear legacy core portrait IDs so old saves cannot leak portrait images into the
     directory. The production files stay in the repo for a future visual-cast pass. */
  if(/^artist-(?:0[1-9]|1[0-8])$/.test(String(a?.portraitId||'')))delete a.portraitId;
 }
}
function migrateV085(){s.v085??={version:4};s.v085.version=4;V085_assignPortraits()}
function V085_initials(name){
 const parts=String(name||'?').trim().split(/\s+/).filter(Boolean);
 return (parts.slice(0,2).map(p=>p[0]).join('')||'?').toUpperCase();
}
function V085_initialPhoto(name,large=false){
 const initials=esc(V085_initials(name)),label=esc(`Initials for ${name}`);
 return `<span class="person-photo v085-initial-portrait ${large?'portrait-large':''}" role="img" aria-label="${label}" style="display:grid;place-items:center;font-weight:900;letter-spacing:.04em;background:linear-gradient(145deg,#172536,#2a4057);color:#f4f7fb;border:1px solid rgba(255,255,255,.12)"><span style="font-size:${large?'2.2rem':'1rem'}">${initials}</span></span>`;
}
const V085_personPhotoBase=personPhoto;
personPhoto=function(key,name,large=false){
 /* All known artists use initials for now, including the five featured cards. Staff and
    non-artist people keep their existing presentation until their own visual pass. */
 if(/^artist-/.test(String(key||''))||s.world?.some?.(x=>x.name===name))return V085_initialPhoto(name,large);
 return V085_personPhotoBase(key,name,large);
};
V084_featuredIndustryRoster=function(world=V084_activeIndustryRoster()){
 const active=V084_filteredIndustryRoster(world);
 return active.slice(0,V085_FEATURED_COUNT)
};
const V085_industryBase=industry;
industry=function(){const html=V085_industryBase();if(industryTab!=='Artists')return html;return html.replace(/(\d+) featured · (\d+) active artists?/,'$1 featured · $2 active artists')};
const V085_renderBase=render;
render=function(){migrateV085();return V085_renderBase()};
