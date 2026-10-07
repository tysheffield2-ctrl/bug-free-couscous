/* Player-facing navigation bridge for the Living Career engine.
   V080 replaces the original navigation destination list after navigation.js loads,
   so this late overlay patches the final list that menuResults actually renders. */
function installCareerWorldNavigation(){
 if(typeof V080_destinations==='undefined'||!Array.isArray(V080_destinations))return;
 const additions=[
  ['Career Pulse','Career','Audience','Momentum, demand and career temperature',2],
  ['Audience & Markets','Career','Audience','Regional fans, streams and hometown status',3]
 ];
 const existing=new Set(V080_destinations.map(d=>d[0]));
 const at=V080_destinations.findIndex(d=>d[2]==='ArtistFile');
 const rows=additions.filter(d=>!existing.has(d[0]));
 if(!rows.length)return;
 V080_destinations.splice(at>=0?at:V080_destinations.length,0,...rows)
}
installCareerWorldNavigation();
