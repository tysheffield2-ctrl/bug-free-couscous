/* Living Platforms 2.0 compatibility bridge.
   Preserve established UI markers and normalize platform-row song ids so strategy
   controls always target a real released song. */
V130_trackOptions=function(id){
 const rows=V114_topTracks(id,20),released=(s.songs||[]).filter(x=>x.released),seen=new Set(),options=[];
 for(const x of rows){
  const songId=Number(x.row?.songId??x.row?.id),track=released.find(t=>Number(t.id)===songId);if(!track||seen.has(songId))continue;
  seen.add(songId);options.push(`<option value="${songId}">${esc(track.title)} · ${compact(x.stats?.thisWeek||track.streams||0)} this week</option>`)
 }
 for(const track of released){const songId=Number(track.id);if(seen.has(songId))continue;seen.add(songId);options.push(`<option value="${songId}">${esc(track.title)} · ${compact(track.streams||0)} this week</option>`);if(options.length>=30)break}
 return options.slice(0,30).join('')
};
const V134_platformPanelCompatBase=V114_platformPanel;
V114_platformPanel=function(id){
 let html=V134_platformPanelCompatBase(id);
 if(id==='vybe')html=html.replace('ALGORITHM BOARD','ALGORITHM PULSE · ENGAGEMENT BOARD');
 if(id==='amp'&&!html.includes('COMMUNITY FEED'))html=html.replace('UNDERGROUND 20','UNDERGROUND 20 · COMMUNITY FEED');
 return html
};
