/* ENCORE shared Week Transaction.
   Renderer-independent owner of week-close ordering + atomic rollback.
   Individual simulation phases are injected as hooks until each subsystem is extracted. */
(function(global){
'use strict';
const clone=v=>typeof structuredClone==='function'?structuredClone(v):JSON.parse(JSON.stringify(v));
function run(state,hooks={}){
 if(!state||!Number.isInteger(state.week))throw Error('Invalid week-close state');
 for(const name of ['isMonthClosing','settleMonthEnd','settleWeek','accumulate'])if(typeof hooks[name]!=='function')throw Error('Missing week-close hook: '+name);
 const checkpoint=clone(state),completed=state.week,beforeCash=Number(state.cash)||0,closing=!!hooks.isMonthClosing(completed);
 try{
  if(closing)hooks.settleMonthEnd({state,completed,beforeCash,closing});
  hooks.settleWeek({state,completed,beforeCash,closing});
  hooks.accumulate({state,completed,beforeCash,closing});
  return {ok:true,state,completed,beforeCash,closing,error:null};
 }catch(error){
  return {ok:false,state:checkpoint,completed,beforeCash,closing,error};
 }
}
global.ENCORE_WEEK_TRANSACTION={version:1,run};
})(globalThis);
