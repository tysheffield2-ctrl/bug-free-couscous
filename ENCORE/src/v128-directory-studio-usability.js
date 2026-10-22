/* ENCORE directory + studio usability pass. Keep routing and song mechanics authoritative. */
const V128_PLATFORM_LINKS=[
 {id:'vybe',name:'VYBE',desc:'Playlists & algorithm',icon:'◉',accent:'#a5dfbd'},
 {id:'muse',name:'MUSE',desc:'Albums & library',icon:'◉',accent:'#d9b9f3'},
 {id:'amp',name:'AMP',desc:'Community discovery',icon:'◉',accent:'#e4c58c'},
 {id:'worldwave',name:'WORLDWAVE',desc:'Global & radio',icon:'◉',accent:'#9dcbea'},
 {id:'frame',name:'FRAME',desc:'Video & visuals',icon:'▣',accent:'#e3a9a9'}
];
function V128_openPlatform(id){V114_setTab(id);careerTab='Platforms';tab='Career';render();window.scrollTo?.({top:0,behavior:'instant'})}
const V128_iconDirectoryBase=encoreIconDirectory;
const V128_menuResultsBase=V103_menuResults;
V103_menuResults=function(query=''){
 const q=String(query).trim().toLowerCase();
 if(q){
  const rows=typeof V080_destinations!=='undefined'?V080_destinations:destinations;
  const legacy=rows.filter(d=>d.join(' ').toLowerCase().includes(q));
  const platformMatches=V128_PLATFORM_LINKS.filter(p=>(p.name+' '+p.desc+' music platform').toLowerCase().includes(q));
  const normal=V128_menuResultsBase(query);
  const extra=legacy.filter(([,g,id])=>!normal.includes('data-destination=\"'+id+'\"')).map(([name,g,id,desc])=>`<button class="v128-search-result" data-destination="${id}" onclick="openDestination('${id}')"><strong>${esc(name)}</strong><small>${esc(desc)}</small></button>`).join('');
  const plats=platformMatches.map(p=>`<button class="v128-search-result" onclick="V128_openPlatform('${p.id}')"><strong>${p.name}</strong><small>${p.desc}</small></button>`).join('');
  return normal+extra+plats||'<section class="v103-menu-empty"><strong>No matching destination.</strong><span>Try a broader term.</span></section>';
 }
 return V128_menuResultsBase(query);
};

encoreIconDirectory=function(query=''){
 const q=String(query).trim().toLowerCase(),main=ENCORE_ICON_DESTINATIONS.filter(row=>row.join(' ').toLowerCase().includes(q));
 const groups=[
  {name:'MAKE & RELEASE',ids:['Studio','Releases','Charts']},
  {name:'AUDIENCE & LIVE',ids:['PULSE','Touring']},
  {name:'BUSINESS & RIGHTS',ids:['Representation','Business HQ','Label HQ','Legal Affairs','Catalog','Finance']},
  {name:'CAREER & SETTINGS',ids:['Home','Awards','Settings']}
 ];
 const sections=groups.map(g=>{const rows=main.filter(x=>g.ids.includes(x[0]));return rows.length?`<section class="v128-icon-group"><header><span>${g.name}</span><i></i></header><div class="encore-icon-directory">${rows.map(([name,id,desc,icon])=>`<button class="encore-destination" data-destination="${id}" onclick="encoreOpenIconDestination('${id}')"><span class="encore-medallion">${encoreIcon(icon)}</span><strong>${name}</strong><small>${desc}</small></button>`).join('')}</div></section>`:''}).join('');
 const platforms=V128_PLATFORM_LINKS.filter(x=>(x.name+' '+x.desc+' music platform').toLowerCase().includes(q));
 const platformSection=platforms.length?`<section class="v128-icon-group v128-platform-group"><header><span>MUSIC PLATFORMS</span><i></i><small>SEPARATE PROFILES</small></header><div class="v128-platform-grid">${platforms.map(p=>`<button type="button" class="v128-platform-tile" style="--v128-platform-accent:${p.accent}" onclick="V128_openPlatform('${p.id}')"><span class="v128-platform-mark">${p.icon}</span><strong>${p.name}</strong><small>${p.desc}</small><b>Open profile ↗</b></button>`).join('')}</div></section>`: '';
 return sections+platformSection;
};
/* Simplify song creation: one calm, scrollable column, clear title area and native controls.
   Keep the existing unified form as the single source of truth for validated song options. */
const V128_studioBase=V103_studio;
V103_studio=function(){
 if(s.draft)return V128_studioBase();
 const html=V128_studioBase();
 return html.replace('<section class="v103-console">','<section class="v103-console v128-studio-simple">')
 .replace('<div class="v103-console-left">','<div class="v103-console-left v128-studio-intro">')
 .replace('<div class="v103-console-right">','<div class="v103-console-right v128-studio-options">')
 .replace('<div class="v103-studio-form">','<div class="v103-studio-form v128-form-simple"><div class="v128-form-heading"><span>BUILD YOUR SONG</span><small>Choose each option, then start the session.</small></div>')
 .replace('</div></div></section><footer class="v103-studio-footer">','</div></div></div></section><footer class="v103-studio-footer">');
};
studio=V103_studio;
