/* ENCORE 0.9 — creative studio identity layer.
   A deeper creative brief plus song identity. Designed to feel like making a record, not filling out a web form. */
const CREATIVE_MOODS=['Reflective','Hungry','Romantic','Defiant','Celebratory','Dark','Hopeful','Nostalgic'];
const CREATIVE_THEMES=['Personal story','Love & relationships','Ambition','Loss & recovery','Nightlife','Social commentary','Victory lap','Escapism'];
const CREATIVE_TEMPOS=['Slow burn','Mid-tempo','Up-tempo'];
const CREATIVE_INTENTS=['Art first','Balanced','Hit-minded'];
const CREATIVE_TEXTURES=['Raw & intimate','Warm & soulful','Clean & modern','Dark & atmospheric','Live & organic','Left-field'];
const CREATIVE_HOOKS=['Verse-driven','Big chorus','Melodic refrain','Minimal hook','No obvious hook'];

function setCreativeDirection(key,value){
 s.studioIdea={...(s.studioIdea||{}),[key]:value};
}

function creativeProfile(d){
 const p=d?.creative||{}, brief=d?.sessionPlan?.brief||p.brief||'story', intent=p.intent||'Balanced', texture=p.texture||'Warm & soulful', hook=p.hook||'Melodic refrain';
 let writing=level('writing'), recording=level('recording'), producing=level('producing'), charisma=level('charisma'), market=level('marketability'), viral=level('viralAbility');
 let depth=42+writing*.42+(brief==='story'?10:brief==='experiment'?5:-3);
 let production=40+producing*.44+(d?.productionBonus||0)*1.5;
 let performance=40+recording*.34+charisma*.18;
 let catchiness=40+market*.22+viral*.18+(brief==='anthem'?10:0)+(intent==='Hit-minded'?8:0);
 let originality=43+writing*.18+producing*.2+(brief==='experiment'?16:0)+(intent==='Art first'?6:0);
 let commercial=38+market*.34+viral*.2+(intent==='Hit-minded'?14:intent==='Art first'?-8:3)+(brief==='anthem'?7:0);
 if(texture==='Raw & intimate'){depth+=4;performance+=3;production-=2}
 if(texture==='Clean & modern'){production+=5;commercial+=3;originality-=2}
 if(texture==='Dark & atmospheric'){originality+=4;production+=3;commercial-=1}
 if(texture==='Live & organic'){performance+=5;originality+=2;commercial-=2}
 if(texture==='Left-field'){originality+=9;commercial-=5}
 if(hook==='Big chorus'){catchiness+=7;commercial+=5}
 if(hook==='Melodic refrain'){catchiness+=4;commercial+=2}
 if(hook==='Verse-driven'){depth+=4;catchiness-=2}
 if(hook==='Minimal hook'){originality+=3;commercial-=2}
 if(hook==='No obvious hook'){originality+=6;depth+=3;commercial-=6}
 const mood=p.mood||d?.mood||'';
 if(['Dark','Reflective','Nostalgic'].includes(mood)){depth+=4;commercial-=2}
 if(['Celebratory','Hopeful'].includes(mood)){catchiness+=3;commercial+=2}
 const values={depth,production,performance,catchiness,originality,commercial};
 Object.keys(values).forEach(k=>values[k]=Math.round(clamp(values[k])));
 return values;
}

function creativeIdentityMarkup(d){
 const x=creativeProfile(d), rows=[['Lyrical depth',x.depth],['Production',x.production],['Performance',x.performance],['Catchiness',x.catchiness],['Originality',x.originality],['Commercial appeal',x.commercial]];
 const p=d.creative||{};
 return `<section class="card creative-identity"><div class="studio-tape-label"><span>ENCORE STUDIOS</span><small>WORKING MASTER</small></div><div class="eyebrow">SONG IDENTITY</div><h3>${esc(d.title)}</h3><p class="fine">Theme: ${esc(p.theme||'Personal story')} · ${esc(p.tempo||'Mid-tempo')} · ${esc(p.texture||'Warm & soulful')}</p><p class="fine">This describes the record you are shaping. It does not guarantee chart success.</p><div class="identity-grid">${rows.map(([n,v])=>`<div><span>${n}</span><strong>${v}</strong><i style="--score:${v}%"></i></div>`).join('')}</div></section>`;
}

function creativeDirectionMarkup(){
 const idea=s.studioIdea||{};
 const options=(items,current)=>items.map(x=>`<option ${x===current?'selected':''}>${x}</option>`).join('');
 return `<section class="card studio-creative-brief"><div class="studio-tape-label"><span>SESSION 01</span><small>CREATIVE BRIEF</small></div><div class="eyebrow">CREATIVE DIRECTION</div><h3>Decide what this record is trying to be.</h3><p class="fine">There is no universally correct combination. Your choices trade depth, originality, accessibility and commercial upside against each other.</p><div class="creative-grid">
 <label>Theme<select onchange="setCreativeDirection('theme',this.value)">${options(CREATIVE_THEMES,idea.theme||'Personal story')}</select></label>
 <label>Tempo<select onchange="setCreativeDirection('tempo',this.value)">${options(CREATIVE_TEMPOS,idea.tempo||'Mid-tempo')}</select></label>
 <label>Intent<select onchange="setCreativeDirection('intent',this.value)">${options(CREATIVE_INTENTS,idea.intent||'Balanced')}</select></label>
 <label>Texture<select onchange="setCreativeDirection('texture',this.value)">${options(CREATIVE_TEXTURES,idea.texture||'Warm & soulful')}</select></label>
 <label>Hook approach<select onchange="setCreativeDirection('hook',this.value)">${options(CREATIVE_HOOKS,idea.hook||'Melodic refrain')}</select></label>
 </div></section>`;
}

const studioV089=studio;
studio=function(){
 let html=studioV089();
 if(!s.draft){
   const marker='<button class="primary"';
   html=html.replace(marker,creativeDirectionMarkup()+marker);
 }else{
   html=html.replace('<div class="controls">',creativeIdentityMarkup(s.draft)+'<div class="controls">');
 }
 return html;
};

const newSongV089=newSong;
newSong=function(e){
 const idea={...(s.studioIdea||{})};
 newSongV089(e);
 if(s.draft){
   s.draft.creative={
     theme:idea.theme||'Personal story',
     tempo:idea.tempo||'Mid-tempo',
     intent:idea.intent||'Balanced',
     texture:idea.texture||'Warm & soulful',
     hook:idea.hook||'Melodic refrain',
     mood:idea.mood||s.draft.mood,
     brief:idea.brief||s.draft.sessionPlan?.brief||'story'
   };
   s.draft.creativeScores=creativeProfile(s.draft);
   s.studioIdea={};
   queueSave();
 }
};

const performSessionV089=performSession;
performSession=function(id){
 performSessionV089(id);
 if(s.draft){
   s.draft.creativeScores=creativeProfile(s.draft);
   queueSave();
 }
};
