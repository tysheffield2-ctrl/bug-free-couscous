/* ENCORE 0.8.4 roster + weekly-label polish.
   Keep 18 discoverable artists in the starting industry view, but only render one card per
   illustrated portrait at a time so the screen never shows duplicate faces. The featured
   selection rotates with the career week. Also keep the persistent advance control synced
   with the weekly pacing engine. */
const V084_DISCOVERABLE_ARTISTS=18;
function V084_activeIndustryRoster(world=s.world){return (Array.isArray(world)?world:[]).slice(0,V084_DISCOVERABLE_ARTISTS)}
function V084_filteredIndustryRoster(world=V084_activeIndustryRoster()){
  return world.filter(a=>(filter==='All'||tierNames[tier(a.fans)]===filter)&&(genreFilter==='All'||a.genre===genreFilter));
}
function V084_featuredIndustryRoster(world=V084_activeIndustryRoster()){
  const eligible=V084_filteredIndustryRoster(world);if(!eligible.length)return [];
  const offset=(Math.max(1,s.week)-1)%eligible.length,rotated=eligible.slice(offset).concat(eligible.slice(0,offset));
  const used=new Set(),featured=[];
  for(const a of rotated){const index=V084_portraitIndex('artist-'+(a.directoryKey??a.id),a.name);if(used.has(index))continue;used.add(index);featured.push(a);if(featured.length>=8)break}
  return featured;
}
function V084_syncAdvanceControl(){
  const button=document.querySelector?.('.weekbar button.primary');
  if(button){button.textContent='Advance week';button.setAttribute?.('aria-label','Advance one week')}
}
const V084_industryBase=industry;
industry=function(){
  if(industryTab!=='Artists')return V084_industryBase();
  const original=s.world,active=V084_activeIndustryRoster(original),eligible=V084_filteredIndustryRoster(active),featured=V084_featuredIndustryRoster(active);
  try{
    s.world=featured;
    let html=V084_industryBase();
    const old=`${featured.length} artists · Tap to meet`;
    const label=`${featured.length} featured · ${eligible.length} active artist${eligible.length===1?'':'s'} · Tap to meet`;
    return html.replace(old,label).replace('Explore 2,500+ artists','Explore the full artist directory');
  }finally{s.world=original}
};
const V084_renderRosterBase=render;
render=function(){const result=V084_renderRosterBase();V084_syncAdvanceControl();return result};
const V084_renderTitleRosterBase=renderTitle;
renderTitle=function(){const result=V084_renderTitleRosterBase();V084_syncAdvanceControl();return result};
V084_syncAdvanceControl();
