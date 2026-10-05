/* ENCORE 0.8.4 portrait quality hotfix.
   Keep Safari-safe real <img> rendering, but use ENCORE's illustrated WebP cast sheet
   instead of the temporary procedural SVG faces. The sheet is 4 columns x 2 rows. */
function V084_portraitIndex(key,name){
  const fixed=typeof V083_CAST!=='undefined'?V083_CAST[key]:undefined;
  if(fixed!==undefined)return fixed;
  const gender=V083_nameGender(name);
  const pool=gender==='female'?V083_FEMALE_PORTRAITS:gender==='male'?V083_MALE_PORTRAITS:V083_NEUTRAL_PORTRAITS;
  return pool[V083_nameHash(name)%pool.length];
}
function V084_portraitData(key,name){
  const index=V084_portraitIndex(key,name),col=index%4,row=index<4?0:1,gender=V083_nameGender(name);
  return {index,col,row,gender};
}
personPhoto=function(key,name,large=false){
  const p=V084_portraitData(key,name);
  const left=-(p.col*100),top=-(p.row*100);
  const label=`Illustrated fictional ${p.gender==='neutral'?'person':p.gender} portrait of ${esc(name)}`;
  return `<span class="person-photo v084-person ${large?'portrait-large':''}" role="img" aria-label="${label}" style="overflow:hidden;position:relative;background:#24384b"><img class="v084-person-img" src="${CAST_ART}" alt="" aria-hidden="true" decoding="async" style="position:absolute;display:block;max-width:none;width:400%;height:200%;left:${left}%;top:${top}%;object-fit:fill"></span>`;
};
