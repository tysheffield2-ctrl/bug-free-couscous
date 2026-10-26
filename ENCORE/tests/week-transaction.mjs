import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../engine/week-transaction.js',import.meta.url),'utf8');
const adapter=fs.readFileSync(new URL('../src/engine-adapter.js',import.meta.url),'utf8');
const runtime=fs.readFileSync(new URL('../engine/runtime.js',import.meta.url),'utf8');
const worker=fs.readFileSync(new URL('../engine/worker-entry.js',import.meta.url),'utf8');
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
assert.ok(runtime.includes('components.transaction.run'),'runtime must own the shared transaction entry');
assert.ok(adapter.includes('ENCORE_ENGINE.transactWeek'),'full renderer must enter week close through ENCORE_ENGINE');
assert.ok(worker.includes('ENCORE_ENGINE.transactWeek'),'worker must enter week close through the same ENCORE_ENGINE path');
assert.equal(fs.existsSync(new URL('../src/weekly-engine.js',import.meta.url)),false,'retired weekly wrapper must stay deleted');
assert.ok(build.includes("readFileSync('engine/week-transaction.js'"),'shared week transaction must be bundled into both renderers');
console.log('PASS Week Transaction owns month-before-week ordering and atomic rollback; full renderer and worker both enter it through ENCORE_ENGINE.');