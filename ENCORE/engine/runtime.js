/* ENCORE Engine Runtime — canonical simulation facade. */
(function(global){
'use strict';
const required=['ENCORE_RELEASES','ENCORE_WEEKLY','ENCORE_AUDIENCE','ENCORE_WEEK_TRANSACTION','ENCORE_STUDIO','ENCORE_CHARTS','ENCORE_FINANCE','ENCORE_ROSTER_NEGOTIATION','ENCORE_SCHEDULER','ENCORE_MIGRATIONS'];
const missing=required.filter(k=>!global[k]);if(missing.length)throw Error('ENCORE engine runtime missing: '+missing.join(', '));
const snap=name=>Object.freeze({...global[name]});
const components=Object.freeze({releases:snap('ENCORE_RELEASES'),weekly:snap('ENCORE_WEEKLY'),audience:snap('ENCORE_AUDIENCE'),transaction:snap('ENCORE_WEEK_TRANSACTION'),studio:snap('ENCORE_STUDIO'),charts:snap('ENCORE_CHARTS'),finance:snap('ENCORE_FINANCE'),roster:snap('ENCORE_ROSTER_NEGOTIATION'),scheduler:snap('ENCORE_SCHEDULER'),migrations:snap('ENCORE_MIGRATIONS')});
function settleWeek(state,hooks={}){if(!state)throw Error('Missing ENCORE career state.');return components.weekly.settle(state,{...hooks,releases:components.releases})}
function transactWeek(state,{isMonthClosing,settleMonthEnd,accumulate,hooks={}}={}){
 let weekResult=null;const tx=components.transaction.run(state,{isMonthClosing,settleMonthEnd,settleWeek:()=>{weekResult=settleWeek(state,hooks);return weekResult},accumulate});return {...tx,weekResult}
}
const applyAudience=(state,source,delta,options={},hooks={})=>components.audience.apply(state,source,delta,options,hooks);
const publishCharts=(state,args={})=>components.charts.publish(state,args);
const trackChart=(state,kind,list,args={})=>components.charts.track(state,kind,list,args);
const chartRecord=(state,kind,key)=>components.charts.record(state,kind,key);
const settleFinance=(state,input={})=>components.finance.settle(state,input);
const migrate=(state,plan={})=>components.migrations.migrate(state,plan);
const health=()=>({version:2,components:Object.fromEntries(Object.entries(components).map(([k,v])=>[k,v.version||1]))});
global.ENCORE_ENGINE=Object.freeze({version:2,components,settleWeek,transactWeek,applyAudience,publishCharts,trackChart,chartRecord,settleFinance,migrate,health,studio:components.studio,roster:components.roster,scheduler:components.scheduler,charts:components.charts,audience:components.audience,finance:components.finance,releases:components.releases});
})(globalThis);
