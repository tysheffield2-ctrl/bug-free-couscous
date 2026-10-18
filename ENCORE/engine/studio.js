/* ENCORE shared Studio Engine.
   Renderer-independent source of truth for writing, scoring, session progression
   and finishing/releasing recordings. */
(function(global){
'use strict';
const clamp=(v,l=0,h=100)=>Math.max(l,Math.min(h,Number(v)||0));
const clone=v=>typeof structuredClone==='function'?structuredClone(v):JSON.parse(JSON.stringify(v));
const coreStats=['writing','recording','producing','charisma','marketability'];
const directions=[
 {id:'Personal / storytelling',name:'Storytelling',note:'Writing-led; stronger fan conversion.',weights:[.4,.3,.15,.05,.1],reach:1,fans:.026,decay:[.81,.95],appeal:0,viral:1},
 {id:'Catchy / radio-ready',name:'Radio hook',note:'+20% debut reach; brighter commercial appeal.',weights:[.3,.3,.25,.05,.1],reach:1.2,fans:.016,decay:[.8,.94],appeal:8,viral:1},
 {id:'Raw / experimental',name:'Experimental',note:'Production-led; unpredictable audience reception.',weights:[.25,.25,.35,.05,.1],reach:1,fans:.018,decay:[.8,.94],appeal:0,viral:1.2},
 {id:'Heartbreak / intimate',name:'Heartbreak',note:'Vocals and lyrics; loyal fans, softer debut.',weights:[.35,.4,.1,.05,.1],reach:.9,fans:.029,decay:[.83,.96],appeal:-3,viral:.8},
 {id:'Club / dancefloor',name:'Club anthem',note:'Production and hooks; fast launch, faster fade.',weights:[.2,.25,.35,.05,.15],reach:1.15,fans:.014,decay:[.76,.91],appeal:6,viral:1.4},
 {id:'Acoustic / stripped-back',name:'Stripped back',note:'Writing and delivery; smaller, longer-lived reach.',weights:[.4,.4,.1,.05,.05],reach:.85,fans:.025,decay:[.85,.97],appeal:-4,viral:.7},
 {id:'Anthem / statement',name:'Statement',note:'Writing and charisma; strong audience connection.',weights:[.4,.25,.15,.15,.05],reach:.95,fans:.03,decay:[.82,.95],appeal:0,viral:1.1},
 {id:'Cinematic / atmospheric',name:'Cinematic',note:'Production-led; patient discovery and catalog life.',weights:[.2,.25,.4,.05,.1],reach:.9,fans:.02,decay:[.85,.97],appeal:-2,viral:.9}
];
const packages=[
 {name:'Home studio',fee:0,quality:0},
 {name:'Professional studio',fee:1500,quality:5},
 {name:'Premium production',fee:25000,quality:9}
];
/* Kept for save/API compatibility with older builds. New song creation no longer
   presents these as player choices; direct progression uses baseline stage costs. */
const sessions={
 record:[
  {id:'intimate',name:'Intimate take',energy:15,cost:40,q:3,a:-2,feedback:'The vocal feels close and human. The record gained character more than polish.'},
  {id:'polished',name:'Polished performance',energy:20,cost:80,q:1,a:4,feedback:'The vocal is clean and accessible. It trades a little edge for a wider lane.'},
  {id:'live',name:'Live-room performance',energy:25,cost:120,q:5,a:0,feedback:'The room added movement and performance energy without chasing radio polish.'}
 ],
 mix:[
  {id:'warm',name:'Warm analog mix',energy:15,cost:30,q:3,a:0,feedback:'The mix keeps texture and warmth while tightening the record.'},
  {id:'radio',name:'Radio-forward mix',energy:20,cost:75,q:0,a:5,feedback:'The mix pushes clarity and immediate impact, raising accessibility more than craft.'},
  {id:'leftfield',name:'Left-field mix',energy:25,cost:110,q:5,a:-3,feedback:'The mix made a stronger artistic statement, with more risk and less obvious commercial shape.'}
 ]
};
const progression={
 record:{energy:15,cost:40,feedback:'Recording complete. The performance is captured and ready for the mix.'},
 mix:{energy:15,cost:30,feedback:'Mix complete. The record is mastered and ready for release planning.'}
};
const creativeDefaults={theme:'Personal story',tempo:'Mid-tempo',intent:'Balanced',texture:'Warm & soulful',hook:'Melodic refrain'};
const creativeLists={
 themes:['Personal story','Love & relationships','Ambition','Loss & recovery','Nightlife','Social commentary','Victory lap','Escapism'],
 tempos:['Slow burn','Mid-tempo','Up-tempo'],
 intents:['Art first','Balanced','Hit-minded'],
 textures:['Raw & intimate','Warm & soulful','Clean & modern','Dark & atmospheric','Live & organic','Left-field'],
 hooks:['Verse-driven','Big chorus','Melodic refrain','Minimal hook','No obvious hook']
};
function directionFor(track){return directions.find(x=>x.id===track?.mood)||directions[0]}
function level(snapshot,key){const x=snapshot?.[key];return clamp(typeof x==='object'?(x.level??x.value??0):x)}
function score(d){
 if(!d?.development)throw Error('Recording is missing its development snapshot.');
 const dir=directionFor(d),v=k=>level(d.development,k);
 d.quality=Math.round(clamp(coreStats.reduce((n,k,i)=>n+v(k)*dir.weights[i],0)+(Number(d.variation)||0)+(Number(d.sessionPlan?.q)||0)+Math.min(Number(d.productionBonus)||0,3+v('producing')*.08)));
 d.commercial=Math.round(clamp(d.quality*.55+v('marketability')*.25+v('charisma')*.1+v('viralAbility')*.1+(Number(d.appeal)||0)+(Number(d.sessionPlan?.a)||0)+dir.appeal));
 return d
}
function creativeProfile(d){
 const p=d?.creative||{},brief=d?.sessionPlan?.brief||p.brief||'story',intent=p.intent||'Balanced',texture=p.texture||'Warm & soulful',hook=p.hook||'Melodic refrain';
 const writing=level(d.development,'writing'),recording=level(d.development,'recording'),producing=level(d.development,'producing'),charisma=level(d.development,'charisma'),market=level(d.development,'marketability'),viral=level(d.development,'viralAbility');
 let depth=42+writing*.42+(brief==='story'?10:brief==='experiment'?5:-3),production=40+producing*.44+(Number(d?.productionBonus)||0)*1.5,performance=40+recording*.34+charisma*.18,catchiness=40+market*.22+viral*.18+(brief==='anthem'?10:0)+(intent==='Hit-minded'?8:0),originality=43+writing*.18+producing*.2+(brief==='experiment'?16:0)+(intent==='Art first'?6:0),commercial=38+market*.34+viral*.2+(intent==='Hit-minded'?14:intent==='Art first'?-8:3)+(brief==='anthem'?7:0);
 if(texture==='Raw & intimate'){depth+=4;performance+=3;production-=2}if(texture==='Clean & modern'){production+=5;commercial+=3;originality-=2}if(texture==='Dark & atmospheric'){originality+=4;production+=3;commercial-=1}if(texture==='Live & organic'){performance+=5;originality+=2;commercial-=2}if(texture==='Left-field'){originality+=9;commercial-=5}
 if(hook==='Big chorus'){catchiness+=7;commercial+=5}if(hook==='Melodic refrain'){catchiness+=4;commercial+=2}if(hook==='Verse-driven'){depth+=4;catchiness-=2}if(hook==='Minimal hook'){originality+=3;commercial-=2}if(hook==='No obvious hook'){originality+=6;depth+=3;commercial-=6}
 const mood=p.mood||d?.mood||'';if(['Dark','Reflective','Nostalgic'].includes(mood)){depth+=4;commercial-=2}if(['Celebratory','Hopeful'].includes(mood)){catchiness+=3;commercial+=2}
 return Object.fromEntries(Object.entries({depth,production,performance,catchiness,originality,commercial}).map(([k,v])=>[k,Math.round(clamp(v))]))
}
function ensureFinance(state){state.finance=state.finance&&typeof state.finance==='object'?state.finance:{};state.finance.week=state.finance.week&&typeof state.finance.week==='object'?state.finance.week:{expenses:0};return state.finance.week}
function ensureWallet(state){const cash=Number(state.cash)||0,raw=String(state.walletCents??'');let valid=/^-?\d+$/.test(raw);if(valid){try{valid=Math.abs(Number(BigInt(raw))/100-cash)<.005}catch{valid=false}}if(!valid)state.walletCents=BigInt(Math.round(cash*100)).toString()}
function spend(state,energy,cost){energy=Math.max(0,Math.round(Number(energy)||0));cost=Math.round((Number(cost)||0)*100)/100;if((Number(state.energy)||0)<energy)throw Error('Rest to recover energy first.');if(cost>0&&(Number(state.cash)||0)<cost)throw Error('Not enough cash. Work a shift or save up.');state.started=true;state.energy=(Number(state.energy)||0)-energy;if(cost){ensureWallet(state);state.walletCents=(BigInt(state.walletCents)-BigInt(Math.round(cost*100))).toString();state.cash=Number(BigInt(state.walletCents))/100;const week=ensureFinance(state);week.expenses=Math.round(((Number(week.expenses)||0)+cost)*100)/100}}
function randomBetween(rng,a,b){return a+(b-a)*rng()}
function cleanCreative(input={}){const choose=(value,list,fallback)=>list.includes(value)?value:fallback;return {theme:choose(input.theme,creativeLists.themes,creativeDefaults.theme),tempo:choose(input.tempo,creativeLists.tempos,creativeDefaults.tempo),intent:choose(input.intent,creativeLists.intents,creativeDefaults.intent),texture:choose(input.texture,creativeLists.textures,creativeDefaults.texture),hook:choose(input.hook,creativeLists.hooks,creativeDefaults.hook),mood:input.mood}}
function start(state,input={},options={}){
 if(state.draft)throw Error('Finish or park the current recording first.');if(!state.development)throw Error('Artist development is unavailable.');
 const packageIndex=Math.max(0,Math.min(packages.length-1,Number(input.packageIndex)||0)),production=packages[packageIndex],mood=directionFor({mood:input.mood}).id,brief=['story','anthem','experiment'].includes(input.brief)?input.brief:'story',rng=typeof options.rng==='function'?options.rng:Math.random;
 spend(state,10,production.fee);const id=options.id??(Date.now()+rng()),title=String(input.title||'Untitled').trim().slice(0,70)||'Untitled';
 const draft={id,title,mood,steps:1,quality:0,feature:null,development:clone(state.development),songRules:2,genre:state.genre,productionBudget:production.fee,productionBonus:production.quality,variation:randomBetween(rng,-8,8),appeal:randomBetween(rng,-12,12),sessionPlan:{brief,q:brief==='experiment'?5:brief==='story'?3:-1,a:brief==='anthem'?4:brief==='experiment'?-5:-2}};
 draft.creative={...cleanCreative({...input.creative,mood}),brief};draft.creativeScores=creativeProfile(draft);score(draft);state.draft=draft;state.studioIdea={title:'',mood,package:String(packageIndex),...draft.creative};return draft
}
/* Direct Write → Record → Mix progression. Creative identity is chosen up front;
   recording and mixing are now production stages rather than extra choice menus. */
function progress(state){
 const d=state.draft;if(!d||![1,2].includes(Number(d.steps)))throw Error('That studio stage is not available.');
 const stage=d.steps===1?'record':'mix',step=progression[stage];spend(state,step.energy,step.cost);d.sessionPlan??={brief:'story',q:0,a:0};d.sessionPlan[stage]='standard';d.sessionPlan.feedback=step.feedback;d.steps++;
 const keys=d.steps===2?['recording','charisma']:['producing','marketability','viralAbility'];for(const k of keys)if(state.development?.[k])d.development[k]=clone(state.development[k]);score(d);d.creativeScores=creativeProfile(d);return {draft:d,stage,energy:step.energy,cost:step.cost}
}
/* Compatibility path for old saves/builds that may still submit a historical
   session option. It is intentionally not exposed by current song creation UI. */
function perform(state,optionId){
 const d=state.draft;if(!d||![1,2].includes(Number(d.steps)))throw Error('That recording session is not available.');const stage=d.steps===1?'record':'mix',option=sessions[stage].find(x=>x.id===optionId);if(!option)throw Error('Choose a valid session approach.');spend(state,option.energy,option.cost);d.sessionPlan??={brief:'story',q:0,a:0};d.sessionPlan.q=(Number(d.sessionPlan.q)||0)+option.q;d.sessionPlan.a=(Number(d.sessionPlan.a)||0)+option.a;d.sessionPlan[stage]=option.id;d.sessionPlan.feedback=option.feedback;d.steps++;
 const keys=d.steps===2?['recording','charisma']:['producing','marketability','viralAbility'];for(const k of keys)if(state.development?.[k])d.development[k]=clone(state.development[k]);score(d);d.creativeScores=creativeProfile(d);return {draft:d,stage,option}
}
function finish(state,{release=false}={}){const d=state.draft;if(!d||Number(d.steps)!==3)throw Error('The master is not ready yet.');if(release)spend(state,5,20);const song={...clone(d),released:release?state.week:null,streams:0,total:0,peak:null,album:null};state.songs??=[];state.songs.push(song);state.draft=null;return song}
function releaseShelf(state,id){const x=(state.songs||[]).find(x=>String(x.id)===String(id));if(!x||x.released)throw Error('That master is no longer waiting for release.');spend(state,5,20);x.released=state.week;return x}
global.ENCORE_STUDIO={version:2,coreStats,directions,packages,sessions,progression,creativeLists,creativeDefaults,directionFor,score,creativeProfile,start,progress,perform,finish,releaseShelf};
})(globalThis);
