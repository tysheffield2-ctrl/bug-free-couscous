/* ENCORE 0.9 — creative studio identity layer.
   Adds a richer creative brief and six-dimensional song identity without turning ENCORE into a DAW. */
const CREATIVE_MOODS=['Reflective','Hungry','Romantic','Defiant','Celebratory','Dark','Hopeful','Nostalgic'];
const CREATIVE_THEMES=['Personal story','Love & relationships','Ambition','Loss & recovery','Nightlife','Social commentary','Victory lap','Escapism'];
const CREATIVE_TEMPOS=['Slow burn','Mid-tempo','Up-tempo'];
const CREATIVE_INTENTS=['Art first','Balanced','Hit-minded'];
function creativeProfile(d){
 const p=d?.creative||{}, brief=d?.sessionPlan?.brief||'story', intent=p.intent||'Balanced';
 let writing=level('writing'), recording=level('recording'), producing=level('producing'), charisma=level('charisma'), market=level('marketability'), viral=level('viralAbility');
 let depth=42+writing*.42+(brief==='story'?10:brief==='experiment'?5:-3);
 let production=40+producing*.44+(d?.productionBonus||0)*1.5;
 let performance=40+recording*.34+charisma*.18;
 let catchiness=40+market*.22+viral*.18+(brief==='anthem'?10:0)+(intent==='Hit-minded'?8:0);
 let originality=43+writing*.18+producing*.2+(brief==='experiment'?16:0)+(intent==='Art first'?6:0);
 let commercial=38+market*.34+viral*.2+(intent==='Hit-minded'?14:intent==='Art first'?-8:3)+(brief==='anthem'?7:0);
 const mood=p.mood||d?.mood||'';if(['Dark','Reflective','Nostalgic'].includes(mood)){depth+=4;commercial-=2}if(['Celebratory','Hopeful'].includes(mood)){catchiness+=3;commercial+=2}
 const values={depth,production,performance,catchiness,originality,commercial};Object.keys(values).forEach(k=>values[k]=Math.round(clamp(values[k])));return values;
}
function creativeIdentityMarkup(d){const x=creativeProfile(d), rows=[['Lyrical depth',x.depth],['Production',x.production],['Performance',x.performance],['Catchiness',x.catchiness],['Originality',x.originality],['Commercial appeal',x.commercial]];return `<section class="card creative-identity"><div class="eyebrow">SONG IDENTITY</div><h3>${esc(d.title)}</h3><p class="fine">This is the record you are shaping — not a promise of chart success.</p><div class="identity-grid">${rows.map(([n,v])=>`<div><span>${n}</span><strong>${v}</strong><i style="--score:${v}%"></i></div>`).join('')}</div></section>`}
function captureCreativeBrief(form){if(!form)return;const f=new FormData(form);s.studioIdea={...(s.studioIdea||{}),mood:f.get('mood')||'',theme:f.get('theme')||'',tempo:f.get('tempo')||'',intent:f.get('intent')||'',brief:f.get('brief')||'story'};}
const studioV089=studio;
studio=function(){let html=studioV089();if(!s.draft){
 const marker='<button class="primary"';
 const creative=`<section class="card studio-creative-brief"><div class="eyebrow">CREATIVE DIRECTION</div><h3>Give the record an identity.</h3><p class="fine">These choices shape the song's strengths and audience fit. There is no universally correct combination.</p><div class="creative-grid"><label>Theme<select name="theme" onchange="captureCreativeBrief(this.form)">${CREATIVE_THEMES.map(x=>`<option>${x}</option>`).join('')}</select></label><label>Tempo<select name="tempo" onchange="captureCreativeBrief(this.form)">${CREATIVE_TEMPOS.map(x=>`<option>${x}</option>`).join('')}</select></label><label>Intent<select name="intent" onchange="captureCreativeBrief(this.form)">${CREATIVE_INTENTS.map(x=>`<option>${x}</option>`).join('')}</select></label></div></section>`;
 html=html.replace(marker,creative+marker);
 }else html=html.replace('<div class="controls">',creativeIdentityMarkup(s.draft)+'<div class="controls">');return html;
}
const newSongV089=newSong;
newSong=function(e){captureCreativeBrief(e.target);const idea={...(s.studioIdea||{})};newSongV089(e);if(s.draft){s.draft.creative={theme:idea.theme||'Personal story',tempo:idea.tempo||'Mid-tempo',intent:idea.intent||'Balanced',mood:idea.mood||s.draft.mood};s.draft.creativeScores=creativeProfile(s.draft);queueSave();}}
const performSessionV089=performSession;
performSession=function(id){performSessionV089(id);if(s.draft){s.draft.creativeScores=creativeProfile(s.draft);queueSave();}}
