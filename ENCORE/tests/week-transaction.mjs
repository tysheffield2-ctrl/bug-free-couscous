import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../engine/week-transaction.js',import.meta.url),'utf8');
const legacy=fs.readFileSync(new URL('../src/weekly-engine.js',import.meta.url),'utf8');
const build=fs.readFileSync(new URL('../build.mjs',import.meta.url),'utf8');
const ctx={console,structuredClone,JSON,Number,Error};ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(source,ctx);
const {run}=ctx.ENCORE_WEEK_TRANSACTION;
{
 const state={week:4,cash:100,order:[]};
 const result=run(state,{isMonthClosing:()=>true,settleMonthEnd:()=>state.order.push('month'),settleWeek:()=>{state.order.push('week');state.week++;state.cash=130},accumulate:({completed,beforeCash})=>{state.order.push('accumulate');state.completed=completed;state.delta=state.cash-beforeCash}});
 assert.equal(result.ok,true);assert.deepEqual(JSON.parse(JSON.stringify(result.state.order)),['month','week','accumulate']);assert.equal(result.completed,4);assert.equal(result.beforeCash,100);assert.equal(result.state.week,5);assert.equal(result.state.completed,4);assert.equal(result.state.delta,30)
}
{
 const state={week:8,cash:500,nested:{value:1},order:[]};
 const result=run(state,{isMonthClosing:()=>false,settleMonthEnd:()=>state.order.push('month'),settleWeek:()=>{state.order.push('week');state.cash=0;state.nested.value=99;throw Error('boom')},accumulate:()=>state.order.push('accumulate')});
 assert.equal(result.ok,false);assert.equal(result.error.message,'boom');assert.equal(result.state.week,8);assert.equal(result.state.cash,500);assert.equal(result.state.nested.value,1);assert.deepEqual(JSON.parse(JSON.stringify(result.state.order)),[])
}
assert.throws(()=>run({week:1},{}),/Missing week-close hook/);
assert.ok(legacy.includes('ENCORE_WEEK_TRANSACTION.run(s'),'legacy week close must use the shared transaction owner');
assert.ok(build.includes("readFileSync('engine/week-transaction.js'"),'shared week transaction must be bundled into both renderers');
console.log('PASS shared Week Transaction owns month-before-week ordering, completed-week context and atomic rollback; legacy ENCORE is bound to it.');