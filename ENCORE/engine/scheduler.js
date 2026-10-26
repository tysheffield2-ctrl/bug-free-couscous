/* ENCORE Scheduler Engine.
   Owns weekly/monthly/annual timing decisions and month accumulation.
   Rendering, persistence and subsystem implementations stay outside this module. */
(function(global){
'use strict';
function requireFn(fn,name){if(typeof fn!=='function')throw Error('Missing scheduler hook: '+name);return fn}
function annualClosing(week){return Number.isInteger(Number(week))&&Number(week)>0&&Number(week)%52===0}
function monthClosing(week,calendarMonthAtWeek){requireFn(calendarMonthAtWeek,'calendarMonthAtWeek');const w=Number(week);return calendarMonthAtWeek(w+1)!==calendarMonthAtWeek(w)}
function runMonthEnd(hooks=[]){for(const item of hooks){const name=Array.isArray(item)?item[0]:'month-end',fn=Array.isArray(item)?item[1]:item;requireFn(fn,name)()}}
function accumulate(state,{completed,beforeCash}={},hooks={}){
 if(!state?.v083?.monthAccumulator)throw Error('Monthly accumulator is unavailable.');
 const cents=requireFn(hooks.cents,'cents'),calendarMonthAtWeek=requireFn(hooks.calendarMonthAtWeek,'calendarMonthAtWeek'),catalogValue=requireFn(hooks.catalogValue,'catalogValue');
 const r=state.lastReport||{},a=state.v083.monthAccumulator;
 a.streams+=(Number(r.streams)||0);a.fans+=(Number(r.fans)||0);a.royalties=cents(a.royalties+(Number(r.royalties)||0));a.taxes=cents(a.taxes+(Number(r.finance?.taxReserve)||0));a.cashChange=cents(a.cashChange+((Number(state.cash)||0)-(Number(beforeCash)||0)));
 if(monthClosing(completed,calendarMonthAtWeek)){
  state.empire.lastSettled=completed;
  state.empire.catalogHistory.unshift({week:state.week,value:catalogValue()});state.empire.catalogHistory=state.empire.catalogHistory.slice(0,36);
  state.empire.lastMonth={monthIndex:a.monthIndex,start:a.startWeek,end:completed,streams:a.streams,fans:a.fans,royalties:a.royalties,taxes:a.taxes,cashChange:a.cashChange};
  const next=calendarMonthAtWeek(state.week);state.empire.month=next;state.v083.monthAccumulator={monthIndex:next,startWeek:state.week,streams:0,fans:0,royalties:0,taxes:0,cashChange:0};
  hooks.generateCommercialOffers?.();hooks.rollThreat?.();
 }else state.empire.month=calendarMonthAtWeek(state.week);
 hooks.captureSnapshot?.();
 return state.v083.monthAccumulator
}
global.ENCORE_SCHEDULER=Object.freeze({version:1,annualClosing,monthClosing,runMonthEnd,accumulate});
})(globalThis);
