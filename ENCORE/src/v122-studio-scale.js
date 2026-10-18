/* ENCORE 0.9.17 — Studio operating scale.
   The creative flow stays simple, but the room/engineer level now grows with
   the artist's actual revenue scale instead of charging every career $40/$30. */
function V122_studioScale(){return globalThis.ENCORE_STUDIO?.studioScale?.(s)||{name:'Independent room',recordCost:40,mixCost:30,revenueRunRate:0,qualityBonus:0}}
const V122_studioBase=studio;
studio=function(){
 let html=V122_studioBase(),d=s.draft;if(!d||![1,2].includes(Number(d.steps)))return html;
 const scale=V122_studioScale(),record=money(scale.recordCost),mix=money(scale.mixCost),room=esc(scale.name);
 html=html.replace('Record song · $40 · 15 energy →',`Record song · ${record} · 15 energy →`).replace('Mix song · $30 · 15 energy →',`Mix song · ${mix} · 15 energy →`);
 html=html.replace('<span>SESSION ENERGY</span>',`<span>SESSION ENERGY · ${room.toUpperCase()}</span>`);
 html=html.replace('Audience response and career context still decide what happens after release.',`Audience response and career context still decide what happens after release. Current production service: ${room}.`);
 return html
};
if(Array.isArray(gameplayTour)){
 const step=gameplayTour.find(x=>x?.page==='Create'&&x?.title==='Finish the record');
 if(step)step.text=()=>{const q=V122_studioScale();return `After writing, recording and mixing use the studio service level your career can support. Your current ${q.name.toLowerCase()} costs ${money(q.recordCost)} to record and ${money(q.mixCost)} to mix, plus 15 energy each. Rates rise gradually with artist revenue, and stronger rooms provide only a modest craft bonus.`}
}
