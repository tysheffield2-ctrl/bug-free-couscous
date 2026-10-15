/* ENCORE shared Audience Engine.
   Renderer-independent source of truth for global/regional true-fan mutations.
   Both legacy ENCORE and UI2 call this module. */
(function(global){
'use strict';
const clamp=(v,l=0,h=100)=>Math.max(l,Math.min(h,Number(v)||0));
const markets=[
 {id:'austin',city:'Austin',state:'Texas',region:'South',genres:['Rock','Country','Indie folk']},
 {id:'atlanta',city:'Atlanta',state:'Georgia',region:'South',genres:['Hip-hop','R&B']},
 {id:'la',city:'Los Angeles',state:'California',region:'West',genres:['Pop','Hip-hop','Electronic']},
 {id:'nyc',city:'New York',state:'New York',region:'Northeast',genres:['Hip-hop','Jazz','Pop']},
 {id:'nashville',city:'Nashville',state:'Tennessee',region:'South',genres:['Country','Rock']},
 {id:'miami',city:'Miami',state:'Florida',region:'South',genres:['Latin','Electronic','Pop']},
 {id:'chicago',city:'Chicago',state:'Illinois',region:'Midwest',genres:['R&B','Jazz','Electronic']},
 {id:'seattle',city:'Seattle',state:'Washington',region:'West',genres:['Rock','Indie folk','Electronic']},
 {id:'houston',city:'Houston',state:'Texas',region:'South',genres:['Hip-hop','R&B']},
 {id:'dallas',city:'Dallas',state:'Texas',region:'South',genres:['Hip-hop','Country','R&B']},
 {id:'detroit',city:'Detroit',state:'Michigan',region:'Midwest',genres:['Hip-hop','R&B','Rock']},
 {id:'neworleans',city:'New Orleans',state:'Louisiana',region:'South',genres:['Hip-hop','R&B','Jazz']}
];
const marketTemplate=(m,home)=>({id:m.id,city:m.city,state:m.state,region:m.region,streams:0,weeklyStreams:0,previousStreams:0,fans:0,awareness:home?20:0,loyalty:home?30:10,demand:home?18:0,culturalConnection:home?20:0,legacy:0,status:0,growth:0});
function reconcile(state,world=state?.careerWorld){
 if(!state||!world?.markets)return;
 const list=Object.values(world.markets),target=Math.max(0,Math.floor(state.fans||0)),migrating=world.audienceVersion!==1;
 let weights=list.map(m=>Math.max(0,Number(m.fans)||0));
 if(migrating){const observed=list.map(m=>Math.max(0,Number(m.streams)||0));weights=observed.some(Boolean)?observed:list.map(m=>markets.find(x=>x.id===m.id)?.genres.includes(state.genre)?1.35:1);world.audienceAttribution=observed.some(Boolean)?'historical-streams':'estimated-genre-spread'}
 if(!weights.some(Boolean))weights=list.map(()=>1);
 const sum=weights.reduce((a,b)=>a+b,0),rows=list.map((m,i)=>{const exact=target*weights[i]/sum;return {m,value:Math.floor(exact),remainder:exact-Math.floor(exact),i}});
 let left=target-rows.reduce((n,r)=>n+r.value,0);rows.sort((a,b)=>b.remainder-a.remainder||a.i-b.i);for(const r of rows)r.m.fans=r.value+(left-->0?1:0);world.audienceVersion=1
}
function ensureWorld(state){
 state.scene=state.scene&&typeof state.scene==='object'?state.scene:{city:'austin'};state.scene.city=markets.some(x=>x.id===state.scene.city)?state.scene.city:'austin';const home=state.scene.city;
 if(!state.careerWorld)state.careerWorld={version:1,hometown:home,currentCity:home,momentum:18,publicInterest:12,fanLoyalty:clamp(state.loyalty||20),industryInfluence:clamp((state.reputation||0)*.7),culturalRelevance:8,recognition:clamp(Math.log10(Math.max(1,state.fans||1))*10),tourDemand:10,state:'Stable',stateSince:state.week||1,comeback:false,lastTotalStreams:state.total||0,lastFans:state.fans||0,lastWeek:state.week||1,markets:{},history:[]};
 const w=state.careerWorld;w.version=1;w.hometown=w.hometown||home;w.currentCity=state.scene.city||w.currentCity||home;w.markets=w.markets&&typeof w.markets==='object'?w.markets:{};w.history=Array.isArray(w.history)?w.history:[];for(const m of markets)if(!w.markets[m.id])w.markets[m.id]=marketTemplate(m,m.id===w.hometown);reconcile(state,w);return w
}
function apply(state,source,delta,{reach=Number.MAX_SAFE_INTEGER,market=null}={},hooks={}){
 if(!state||!Number.isFinite(delta)||!Number.isFinite(reach)||reach<0)throw Error('Invalid audience event');
 const before=Math.max(0,Math.floor(state.fans||0)),requested=Math.round(delta),change=requested>0?Math.min(requested,Math.floor(reach),Number.MAX_SAFE_INTEGER-before):Math.max(-before,requested);
 const world=hooks.ensureWorld?hooks.ensureWorld(state):ensureWorld(state);state.fans=before+change;
 const a=state.audienceEngine??={version:1,events:[],sources:{}};a.sources=a.sources&&typeof a.sources==='object'?a.sources:{};a.events=Array.isArray(a.events)?a.events:[];a.sources[source]=(a.sources[source]||0)+change;a.events.push({week:state.week,source,delta:change,market});a.events=a.events.slice(-104);
 if(change>0&&world){const list=Object.values(world.markets||{});if(market&&world.markets?.[market])world.markets[market].fans+=change;else if(source==='streaming'){const total=list.reduce((n,m)=>n+(Number(m.weeklyStreams)||0),0);let remaining=change;if(total>0)list.forEach((m,i)=>{const n=i===list.length-1?remaining:Math.floor(change*(Number(m.weeklyStreams)||0)/total);m.fans+=n;remaining-=n})}}
 if(hooks.reconcile)hooks.reconcile(state,world);else reconcile(state,world);return change
}
global.ENCORE_AUDIENCE={version:1,markets,ensureWorld,reconcile,apply};
})(globalThis);
