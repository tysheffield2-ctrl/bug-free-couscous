/* ENCORE 0.9.24 — Living Memory / Causality Foundation.
   Turns Cohesion Core's durable event ledger into entity memory and cause/effect
   history. Important events survive the rolling activity feed, NPCs retain
   relationship context, and existing collaboration economics can react to that
   history instead of reading only a flat relationship number. */

const V136_MEMORY_SCHEMA=1;
const V136_MEMORY_LIMIT=1200;
const V136_MEMORY_PRUNE_TRIGGER=1320;
const V136_MEMORY_PRUNE_TARGET=1080;
const V136_ENTITY_LIMIT=140;
function V136_state(){
 const root=typeof V118_state==='function'?V118_state():(s.cohesion??={events:[]});
 if(!root.memory||typeof root.memory!=='object')root.memory={version:V136_MEMORY_SCHEMA,records:{},entities:{},relationships:{},lastSweepWeek:0,backfilled:false};
 const m=root.memory;m.version=V136_MEMORY_SCHEMA;
 if(!m.records||typeof m.records!=='object'||Array.isArray(m.records))m.records={};
 if(!m.entities||typeof m.entities!=='object'||Array.isArray(m.entities))m.entities={};
 if(!m.relationships||typeof m.relationships!=='object'||Array.isArray(m.relationships))m.relationships={};
 if(!Number.isFinite(Number(m.lastSweepWeek)))m.lastSweepWeek=0;
 return m
}
function V136_ref(type,id){return `${String(type||'entity')}:${String(id)}`}
function V136_artistRef(id){return V136_ref('artist',id)}
function V136_pairKey(a,b){return [String(a),String(b)].sort().join('|')}
function V136_relation(a,b='player'){
 const m=V136_state(),key=V136_pairKey(a,b);
 return m.relationships[key]??=( {a:String(a),b:String(b),affinity:0,respect:0,rivalry:0,grievance:0,lastWeek:0,history:[]} )
}
function V136_eventSalience(kind,title=''){
 const k=String(kind||'').toLowerCase(),t=String(title||'').toLowerCase();
 if(/death|retire|lawsuit|legal-resolution|signing|champion|award|number-one/.test(k+' '+t))return 92;
 if(/breakout|comeback|roster-request|contract|tour|album|release|catalog/.test(k+' '+t))return 78;
 if(/relationship|management|collab|feature|industry/.test(k+' '+t))return 62;
 return 42
}
function V136_entityRefs(kind,links={}){
 const refs=new Set();
 const add=x=>{if(x!==null&&x!==undefined&&String(x).trim())refs.add(String(x))};
 for(const x of links.entities||[])add(typeof x==='string'?x:x?.ref);
 if(links.artistId!==undefined&&links.artistId!==null)add(V136_artistRef(links.artistId));
 if(links.actorArtistId!==undefined&&links.actorArtistId!==null)add(V136_artistRef(links.actorArtistId));
 if(links.targetArtistId!==undefined&&links.targetArtistId!==null)add(V136_artistRef(links.targetArtistId));
 if(links.agreementId){add(V136_ref('agreement',links.agreementId));const c=s.labelBusiness?.company?.contracts?.find?.(x=>x.agreementId===links.agreementId);if(c?.artist!==undefined&&c?.artist!==null)add(V136_artistRef(c.artist));}
 if(links.caseId){add(V136_ref('case',links.caseId));const c=typeof V118_legalCases==='function'?V118_legalCases().find?.(x=>x.id===links.caseId):null;if(c?.collaboratorId!==undefined&&c?.collaboratorId!==null)add(V136_artistRef(c.collaboratorId));}
 if(links.requestId)add(V136_ref('request',links.requestId));
 if(links.trackId)add(V136_ref('track',links.trackId));
 if(links.platformId)add(V136_ref('platform',links.platformId));
 if(links.labelId!==undefined&&links.labelId!==null)add(V136_ref('label',links.labelId));
 if(links.includePlayer!==false&&(/roster|legal|lawsuit|contract|collab|feature|management|release|tour|number-one/.test(String(kind||''))||links.playerInvolved))add('player');
 return [...refs]
}
function V136_inferCauseIds(kind,links={},entities=[]){
 const explicit=[...(links.causeEventIds||[]),...(links.causes||[])];if(links.causeEventId)explicit.push(links.causeEventId);if(explicit.length)return [...new Set(explicit.map(String))];
 const k=String(kind||''),events=V118_state().events||[],shares=e=>{const es=e.entities||V136_entityRefs(e.kind,e.links||{});return entities.some(x=>x!=='player'&&es.includes(x))};
 if(/lawsuit/.test(k)){const p=events.find(e=>e.week===s.week&&/roster-request-(refused|counter)/.test(e.kind||'')&&shares(e));if(p)return [p.id]}
 if(/legal-(defense|resolution)/.test(k)){const p=events.find(e=>e.week<=s.week&&/lawsuit|legal-defense/.test(e.kind||'')&&shares(e));if(p)return [p.id]}
 if(/industry-number-one/.test(k)){const p=events.find(e=>e.week===s.week&&/industry-(breakout|sleeper|comeback|label|revival)/.test(e.kind||'')&&shares(e));if(p)return [p.id]}
 return []
}
function V136_relationshipDelta(kind,title=''){
 const k=String(kind||'').toLowerCase(),t=String(title||'').toLowerCase();
 if(k==='roster-request-resolved')return {affinity:12,respect:5,rivalry:-2,grievance:-10};
 if(k==='roster-request-refused')return {affinity:-14,respect:-3,rivalry:5,grievance:16};
 if(k==='roster-request-counter')return {affinity:-2,respect:3,rivalry:2,grievance:3};
 if(k==='roster-management'){
  if(/checkin|check-in/.test(t))return {affinity:5,respect:2,grievance:-2};
  if(/support/.test(t))return {affinity:8,respect:5,grievance:-3};
  if(/autonomy/.test(t))return {affinity:7,respect:4,grievance:-4};
  if(/pressure|challenge/.test(t))return {affinity:-6,respect:1,rivalry:2,grievance:6};
 }
 if(/lawsuit/.test(k))return {affinity:-18,respect:-3,rivalry:8,grievance:22};
 if(k==='legal-resolution')return {grievance:-5,respect:2};
 if(k==='industry-number-one')return {respect:4,rivalry:5};
 if(/industry-(breakout|comeback)/.test(k))return {respect:2};
 if(/collab|feature/.test(k)&&/accepted|agreed|completed/.test(t))return {affinity:4,respect:4,grievance:-2};
 return null
}
function V136_applyRelationshipContext(e){
 const artists=(e.entities||[]).filter(x=>x.startsWith('artist:')),delta=V136_relationshipDelta(e.kind,e.title);if(!delta||!artists.length||!(e.entities||[]).includes('player'))return [];
 const effects=[];for(const ref of artists){const r=V136_relation(ref,'player');for(const [key,val] of Object.entries(delta)){if(!Number.isFinite(Number(val)))continue;const lo=key==='rivalry'||key==='grievance'?0:-100,hi=100;r[key]=clamp((Number(r[key])||0)+Number(val),lo,hi)}r.lastWeek=s.week;r.history.unshift(e.id);r.history=[...new Set(r.history)].slice(0,60);effects.push({type:'relationship-context',entity:ref,...delta})}return effects
}
function V136_compactEvent(e){return {id:e.id,week:e.week,kind:e.kind,title:e.title,detail:e.detail,entities:[...(e.entities||[])],causeIds:[...(e.causeIds||[])],effects:[...(e.effects||[])],salience:e.salience,tags:[...(e.tags||[])]}}
function V136_trimMemory(){
 const m=V136_state(),ids=Object.keys(m.records);if(ids.length<=V136_MEMORY_PRUNE_TRIGGER)return;
 const protectedIds=new Set();for(const row of Object.values(m.entities))for(const id of (row?.eventIds||[]).slice(0,6))protectedIds.add(id);
 const removable=ids.map(id=>m.records[id]).filter(Boolean).sort((a,b)=>(a.salience||0)-(b.salience||0)||(a.week||0)-(b.week||0));
 const deleted=new Set();let remaining=ids.length;
 for(const e of removable){if(remaining<=V136_MEMORY_PRUNE_TARGET)break;if((e.salience||0)>=90||protectedIds.has(e.id))continue;delete m.records[e.id];deleted.add(e.id);remaining--}
 if(remaining>V136_MEMORY_LIMIT){for(const e of removable){if(remaining<=V136_MEMORY_LIMIT)break;if((e.salience||0)>=90||deleted.has(e.id))continue;delete m.records[e.id];deleted.add(e.id);remaining--}}
 if(deleted.size)for(const row of Object.values(m.entities))if(Array.isArray(row.eventIds))row.eventIds=row.eventIds.filter(id=>!deleted.has(id))
}
function V136_indexEvent(e,{apply=true}={}){
 if(!e?.id)return e;const m=V136_state();e.links=e.links&&typeof e.links==='object'?e.links:{};e.entities=Array.isArray(e.entities)&&e.entities.length?e.entities:V136_entityRefs(e.kind,e.links);e.causeIds=Array.isArray(e.causeIds)?e.causeIds:V136_inferCauseIds(e.kind,e.links,e.entities);e.salience=Number.isFinite(Number(e.salience))?clamp(Math.round(e.salience),1,100):V136_eventSalience(e.kind,e.title);e.tags=Array.isArray(e.tags)?e.tags:[];e.effects=Array.isArray(e.effects)?e.effects:[];
 if(apply&&!e.v136Applied){e.effects.push(...V136_applyRelationshipContext(e));e.v136Applied=true}
 m.records[e.id]=V136_compactEvent(e);
 for(const ref of e.entities){const row=m.entities[ref]??=( {eventIds:[],lastWeek:0} );row.eventIds=[e.id,...row.eventIds.filter(id=>id!==e.id)].slice(0,V136_ENTITY_LIMIT);row.lastWeek=Math.max(row.lastWeek||0,e.week||0)}
 V136_trimMemory();return e
}
function V136_backfill(){
 const m=V136_state();if(m.backfilled)return m;for(const e of [...(V118_state().events||[])].reverse())V136_indexEvent(e,{apply:false});m.backfilled=true;return m
}
function V136_memories(ref,{limit=12,minSalience=0,kind=null}={}){
 V136_backfill();const m=V136_state(),ids=m.entities[String(ref)]?.eventIds||[];return ids.map(id=>m.records[id]).filter(e=>e&&(e.salience||0)>=minSalience&&(!kind||String(e.kind).includes(kind))).sort((a,b)=>(b.week||0)-(a.week||0)||(b.salience||0)-(a.salience||0)).slice(0,limit)
}
function V136_findEvent(id){V136_backfill();return V136_state().records[String(id)]||null}
function V136_effectiveRelation(a){
 if(!a)return 0;const base=Number(a.relation)||0,r=V136_relation(V136_artistRef(a.id),'player'),memory=r.affinity*.32+r.respect*.12-r.grievance*.18-r.rivalry*.05;return clamp(Math.round(base+memory),-100,100)
}
function V136_causeTrail(id,limit=6){
 const out=[],seen=new Set();let cur=V136_findEvent(id);while(cur&&out.length<limit&&!seen.has(cur.id)){out.push(cur);seen.add(cur.id);cur=cur.causeIds?.length?V136_findEvent(cur.causeIds[0]):null}return out
}
function V136_recordEvent(spec={}){
 const links={...(spec.links||{}),entities:spec.entities||spec.links?.entities||[],causeEventIds:spec.causeIds||spec.links?.causeEventIds||[],playerInvolved:spec.playerInvolved};const e=V118_event(spec.kind||'world-event',spec.title||'World event',spec.detail||'',links);if(spec.salience!==undefined)e.salience=spec.salience;if(spec.tags)e.tags=[...spec.tags];if(spec.effects)e.effects=[...(e.effects||[]),...spec.effects];return V136_indexEvent(e)
}
const V136_eventBase=V118_event;
V118_event=function(kind,title,detail,links={}){const e=V136_eventBase(kind,title,detail,links);return V136_indexEvent(e)};

/* Existing collaboration economics now read the remembered relationship context.
   We temporarily project the effective relation into the already-authoritative
   negotiation functions, then restore the raw relationship score. */
let V136_relationProjectionDepth=0;
function V136_withEffectiveRelation(a,fn){if(!a||V136_relationProjectionDepth>0)return fn();const raw=a.relation;a.relation=V136_effectiveRelation(a);V136_relationProjectionDepth++;try{return fn()}finally{V136_relationProjectionDepth--;a.relation=raw}}
if(typeof V125_terms==='function'){const V136_termsBase=V125_terms;V125_terms=function(a,role){return V136_withEffectiveRelation(a,()=>V136_termsBase(a,role))}}
if(typeof V125_acceptChance==='function'){const V136_acceptBase=V125_acceptChance;V125_acceptChance=function(a,role,fee,share){return V136_withEffectiveRelation(a,()=>V136_acceptBase(a,role,fee,share))}}
if(typeof V092_outgoingFeatureTerms==='function'){const V136_featureTermsBase=V092_outgoingFeatureTerms;V092_outgoingFeatureTerms=function(a){return V136_withEffectiveRelation(a,()=>V136_featureTermsBase(a))}}

function V136_relationshipLabel(r){const n=r.affinity-r.grievance*.45;return n>=35?'Trusted history':n>=10?'Warm history':n<=-35?'Hostile history':n<=-10?'Fractured history':r.rivalry>=35?'Competitive history':'Developing history'}
function V136_artistMemoryPanel(id){
 const a=s.world?.[id];if(!a)return '';const ref=V136_artistRef(id),r=V136_relation(ref,'player'),mem=V136_memories(ref,{limit:6,minSalience:55});return `<section class="card v136-memory"><div class="sectionhead"><div><span class="eyebrow">PERSISTENT MEMORY</span><h3>${esc(V136_relationshipLabel(r))}</h3></div><span class="pill">effective relation ${V136_effectiveRelation(a)}</span></div><p>${esc(a.name)} remembers consequential history instead of resetting to one relationship number. This context now influences collaboration negotiations.</p><div class="v136-memory-meters">${profileRows([['Affinity',String(Math.round(r.affinity))],['Respect',String(Math.round(r.respect))],['Rivalry',String(Math.round(r.rivalry))],['Grievance',String(Math.round(r.grievance))]])}</div>${mem.map(e=>`<div class="v136-memory-row"><span><b>${esc(e.title)}</b><small>Week ${e.week} · ${esc(String(e.kind).replaceAll('-',' '))}</small></span><em>${e.salience}/100</em></div>`).join('')||'<p class="fine">No defining shared history yet. Important choices will accumulate here.</p>'}</section>`
}
function V136_careerMemoryPanel(){
 const mem=V136_memories('player',{limit:8,minSalience:70});return `<section class="card v136-career-memory"><span class="eyebrow">CAREER MEMORY · CAUSE & EFFECT</span><h2>Your career is becoming history.</h2><p>Defining events are retained beyond the rolling activity feed and can remain linked to the decisions that caused them.</p>${mem.map(e=>`<div class="v136-career-row"><div><strong>${esc(e.title)}</strong><small>Week ${e.week} · ${esc(String(e.kind).replaceAll('-',' '))}${e.causeIds?.length?' · caused by '+e.causeIds.length+' earlier event'+(e.causeIds.length===1?'':'s'):''}</small></div><b>${e.salience}</b></div>`).join('')||'<p class="fine">No defining career memories yet.</p>'}</section>`
}
if(typeof profile==='function'){const V136_profileBase=profile;profile=function(id){const result=V136_profileBase(id),el=$('modal');if(el?.open&&s.world?.[id])el.innerHTML+=V136_artistMemoryPanel(id);return result}}
if(typeof artistFilePage==='function'){const V136_artistFileBase=artistFilePage;artistFilePage=function(){return V136_artistFileBase()+V136_careerMemoryPanel()}}

function V136_sweep(){
 const m=V136_state();if(m.lastSweepWeek===s.week)return;m.lastSweepWeek=s.week;
 for(const r of Object.values(m.relationships)){if(!r)continue;const idle=Math.max(0,s.week-(r.lastWeek||s.week));if(idle>=26&&s.week%13===0){r.rivalry=clamp((r.rivalry||0)-1,0,100);r.grievance=clamp((r.grievance||0)-1,0,100)}}
 V136_trimMemory()
}
if(typeof worldWeek==='function'){const V136_worldWeekBase=worldWeek;worldWeek=function(){const result=V136_worldWeekBase();V136_sweep();return result}}
function V136_validate(){const m=V136_state();if(m.version!==V136_MEMORY_SCHEMA||!m.records||!m.entities||!m.relationships)throw Error('Invalid Living Memory state');for(const r of Object.values(m.relationships)){for(const k of ['affinity','respect'])if(!Number.isFinite(Number(r[k]))||r[k]<-100||r[k]>100)throw Error('Invalid memory relationship '+k);for(const k of ['rivalry','grievance'])if(!Number.isFinite(Number(r[k]))||r[k]<0||r[k]>100)throw Error('Invalid memory relationship '+k)}}
if(typeof validatePresentationState==='function'){const V136_validateBase=validatePresentationState;validatePresentationState=function(){V136_validateBase();V136_validate()}}
V136_backfill();
