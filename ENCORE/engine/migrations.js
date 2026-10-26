/* ENCORE Save Migration Engine.
   Provides one deterministic top-level schema runner. Individual migration steps
   can still call compatibility helpers while they are extracted subsystem by subsystem. */
(function(global){
'use strict';
const clone=v=>typeof structuredClone==='function'?structuredClone(v):JSON.parse(JSON.stringify(v));
function migrate(state,{schema,migrations,getActive,setActive}={}){
 const target=Number(schema),version=Number(state?.stateSchemaVersion??0);
 if(!state||!Number.isInteger(target)||target<0||!Array.isArray(migrations))throw Error('Invalid migration plan.');
 if(!Number.isInteger(version)||version<0||version>target)throw Error('This career needs a newer game version.');
 if(version===target)return state;
 if(typeof getActive!=='function'||typeof setActive!=='function')throw Error('Migration state adapter is unavailable.');
 const active=getActive(),candidate=clone(state);
 try{
  setActive(candidate);
  for(let v=version;v<target;v++){
   const step=migrations[v];if(typeof step!=='function')throw Error('Missing career migration '+v+' → '+(v+1)+'.');
   step();candidate.stateSchemaVersion=v+1;
  }
  return candidate
 }finally{setActive(active)}
}
global.ENCORE_MIGRATIONS=Object.freeze({version:1,migrate});
})(globalThis);
