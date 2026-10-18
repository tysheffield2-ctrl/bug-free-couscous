/* Shared vector icons: presentation only, with existing authoritative routes. */
const ENCORE_ICON_SHAPES={
 Home:'<path d="M2 11 12 2l10 9h-4v11h-5v-7h-3v7H5V11z"/>',
 Studio:'<path d="M5 3v18M12 3v18M19 3v18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="5" cy="14" r="2.5"/><circle cx="12" cy="17" r="2.5"/><circle cx="19" cy="8" r="2.5"/>',
 Releases:'<path fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m0 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6"/><path d="M4.5 10A8 8 0 0 1 10 4.5M6.5 10A6 6 0 0 1 10 6.5M14 17.5a6 6 0 0 0 3.5-3.5M14 19.5a8 8 0 0 0 5.5-5.5" fill="none" stroke="#071119" stroke-width=".8"/>',
 Charts:'<rect x="3" y="13" width="5" height="9" rx="1"/><rect x="10" y="8" width="5" height="14" rx="1"/><rect x="17" y="3" width="5" height="19" rx="1"/>',
 Pulse:'<path d="M2 13h5l3-9 4 17 3-12 2 4h3" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>',
 Touring:'<path d="M2 10 13 4l7 1q2 0 2 3v11H2z"/><path d="m4 10 3-1.6V13H4zm4-2 3-1.5V13H8zm5-2 6 1v7h-6z" fill="#071119"/><circle cx="6" cy="19" r="2.2" fill="#071119"/><circle cx="18" cy="19" r="2.2" fill="#071119"/><circle cx="6" cy="19" r="1.2"/><circle cx="18" cy="19" r="1.2"/>',
 Representation:'<circle cx="12" cy="6" r="3.2"/><circle cx="4" cy="9" r="2.4"/><circle cx="20" cy="9" r="2.4"/><path d="M7 21v-5a5 5 0 0 1 10 0v5zM1 20v-5a3 3 0 0 1 5-2v7zm17 0v-7a3 3 0 0 1 5 2v5z"/>',
 Business:'<path d="M2 22V12l4-3v13zm6 0V6l4-3 3 2v17zm9 0V9l5 3v10z"/><path d="M12 1v4M19 5v5" stroke="currentColor"/><path d="M10 8h2v3h-2zm0 5h2v3h-2zm0 5h2v4h-2zM3 14h1v3H3z" fill="#071119"/>',
 Legal:'<path d="M5 2h11l4 4v16H5z"/><path d="M16 2v5h4" fill="#b98636"/><path d="M8 7h6M8 10h9M8 13h7M8 19q3-7 2 0 3-5 3-1l4-1" fill="none" stroke="#071119" stroke-width="1.3" stroke-linecap="round"/>',
 Catalog:'<path d="M8 3h12q2 0 2 2v12h-2V6H8zM5 7h12q2 0 2 2v11h-2V10H5zM2 11h12q2 0 2 2v9H2z"/>',
 Finance:'<path d="M12 6v12c0 5 10 5 10 0V6zM2 14v5c0 4 9 4 9 0v-5z"/><ellipse cx="17" cy="5" rx="5" ry="3"/><ellipse cx="6.5" cy="13" rx="4.5" ry="2.5"/><path d="M12 9q5 4 10 0m-10 4q5 4 10 0m-10 4q5 4 10 0M2 17q4.5 3 9 0" fill="none" stroke="#071119" stroke-width=".8"/>',
 Awards:'<path d="M6 3h12v7c0 4-2 6-5 7v3h4v2H7v-2h4v-3c-3-1-5-3-5-7z"/><path d="M6 5H3q0 9 5 9m10-9h3q0 9-5 9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m12 6 1.1 2.3 2.6.4-1.9 1.8.4 2.6-2.2-1.2-2.2 1.2.4-2.6-1.9-1.8 2.6-.4z" fill="#071119"/>',
 Settings:'<path fill-rule="evenodd" d="m9 1 6 0 .7 3 2 .9 2.6-1.2 3 5-2.3 2.1v2.4l2.3 2.1-3 5-2.6-1.2-2 .9-.7 3H9l-.7-3-2-.9-2.6 1.2-3-5L3 13.2v-2.4L.7 8.7l3-5 2.6 1.2 2-.9zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10"/>',
 More:'<circle cx="4" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="20" cy="12" r="2"/>'
};
let encoreIconSequence=0;
function encoreIcon(name){
 const id='encore-gold-'+(++encoreIconSequence);
 return `<svg class="encore-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff5c2"/><stop offset=".38" stop-color="#f5d77d"/><stop offset=".7" stop-color="#d7a348"/><stop offset="1" stop-color="#ffe8a1"/></linearGradient></defs><g fill="url(#${id})">${ENCORE_ICON_SHAPES[name]||ENCORE_ICON_SHAPES.More}</g></svg>`;
}
const ENCORE_ICON_DESTINATIONS=[
 ['Home','Home','Your world','Home'],['Studio','Create','Make music','Studio'],
 ['Releases','Releases','Drop music','Releases'],['Charts','Industry','See the impact','Charts'],
 ['PULSE','Social','Fans & culture','Pulse'],['Touring','Touring','Hit the road','Touring'],
 ['Representation','Agency','Your team','Representation'],['Business HQ','BusinessHQ','Expand empire','Business'],
 ['Legal Affairs','LegalAffairs','Protect yourself','Legal'],['Catalog','Catalog','Your legacy','Catalog'],
 ['Finance','Finances','Manage wealth','Finance'],['Awards','Awards','Earn recognition','Awards'],
 ['Settings','Settings','Customize game','Settings']
];
const ENCORE_ICON_COVERED_ROUTE_IDS=new Set(['Create','Releases','Industry','Social','Touring','Agency','BusinessHQ','LegalAffairs','Finances','Awards','Settings']);
function encoreOpenIconDestination(id){
 if(id==='Home'){go('Home');return}
 if(id==='Catalog'){
  if(typeof V109_dealsFocus!=='undefined')V109_dealsFocus='Catalog';
  if(typeof V096_openBusinessArea==='function'){V096_openBusinessArea('Deals');return}
  careerTab='Deals';go('Career');return
 }
 openDestination(id)
}
function encoreIconDirectory(query=''){
 const q=String(query).trim().toLowerCase(),items=ENCORE_ICON_DESTINATIONS.filter(row=>row.join(' ').toLowerCase().includes(q));
 return items.length?`<section class="encore-icon-directory" aria-label="Key destinations">${items.map(([name,id,desc,icon])=>`<button class="encore-destination" data-destination="${id}" onclick="encoreOpenIconDestination('${id}')"><span class="encore-medallion">${encoreIcon(icon)}</span><strong>${name}</strong><small>${desc}</small></button>`).join('')}</section>`:'';
}
function encoreNextMove(){return `<section class="encore-next-move" aria-labelledby="encore-next-title"><header><h2 id="encore-next-title">NEXT MOVE</h2><p>Where do you want to focus?</p></header><div class="encore-next-actions">${[
 ['Studio','Create','Record','Studio'],['Charts','Industry','Track progress','Charts'],['Touring','Touring','Plan a show','Touring'],['Business HQ','BusinessHQ','Grow bigger','Business']
 ].map(([name,id,desc,icon],i)=>`<button class="encore-next-action ${i===0?'encore-next-primary':''}" onclick="encoreOpenIconDestination('${id}')">${encoreIcon(icon)}<strong>${name}</strong><small>${desc}</small></button>`).join('')}</div></section>`}

/* Keep the approved icon destinations primary without losing deep screens. */
function encoreClassicDirectory(query=''){
 const rows=typeof V080_destinations!=='undefined'?V080_destinations:destinations;
 const q=String(query).trim().toLowerCase();
 const matches=rows.filter(d=>d.join(' ').toLowerCase().includes(q)&&!ENCORE_ICON_COVERED_ROUTE_IDS.has(d[2]));
 const groups=[...new Set(matches.map(x=>x[1]))];
 if(!groups.length)return q?'<section class="v103-menu-empty"><strong>No matching destination.</strong><span>Try a broader term.</span></section>':'';
 return groups.map(group=>`<section class="v103-menu-group"><header><i>${V103_menuGroupIcon(group)}</i><span>${esc(group).toUpperCase()}</span><small>${matches.filter(x=>x[1]===group).length}</small></header>${matches.filter(x=>x[1]===group).map(([name,g,id,desc])=>`<button data-destination="${id}" onclick="openDestination('${id}')"><span><strong>${esc(name)}</strong><small>${esc(desc)}</small></span><b>↗</b></button>`).join('')}</section>`).join('')
}
V103_menuResults=function(query=''){
 const q=String(query).trim();
 const icons=encoreIconDirectory(q),classic=encoreClassicDirectory(q);
 if(q)return icons+classic||'<section class="v103-menu-empty"><strong>No matching destination.</strong><span>Try a broader term.</span></section>';
 return `${icons}<details class="encore-all-screens"><summary>All career screens & utilities</summary><div class="encore-all-screen-groups">${classic}</div></details>`
};
menuResults=V103_menuResults;
