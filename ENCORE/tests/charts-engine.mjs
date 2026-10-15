import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../engine/charts.js',import.meta.url),'utf8'),bridge=fs.readFileSync(new URL('../src/charts-engine-bridge.js',import.meta.url),'utf8'),build=fs.readFileSync(new URL('../build.mjs',import.meta.url),'utf8');
const ctx={console,structuredClone,JSON,Number,String,Array,Object,Error,Map,Set};ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(source,ctx);const E=ctx.ENCORE_CHARTS;
function state(){return {week:10,chartWeek:10,songs:[{id:1,title:'Mine',peak:null,chartWeeks:0,numberOneWeeks:0,numberOneStreak:0,longestNumberOne:0}],albums:[],chartBook:E.initial(1)}}
{
 const s=state(),songs=[{key:'you:s:1',id:1,title:'Mine',artist:'Me',you:true,streams:1000,releaseWeek:10},{key:'npc:s:2',title:'Other',artist:'NPC',streams:900,releaseWeek:9}],albums=[];const p=E.publish(s,{songs,albums});assert.equal(p.published,true);assert.equal(s.chartBook.issuedWeek,10);assert.equal(s.chartBook.songs.current[0].movement,'NEW');assert.equal(s.songs[0].peak,1);assert.equal(s.songs[0].chartWeeks,1);assert.equal(s.songs[0].numberOneWeeks,1);assert.equal(s.songs[0].numberOneStreak,1);assert.equal(s.songs[0].longestNumberOne,1);assert.equal(E.publish(s,{songs,albums}).published,false)
 s.chartWeek=11;const moved=[songs[1],songs[0]];E.publish(s,{songs:moved,albums});assert.equal(s.chartBook.songs.current[0].movement,'UP');assert.equal(s.chartBook.songs.current[1].movement,'DOWN');assert.equal(s.songs[0].peak,1);assert.equal(s.songs[0].chartWeeks,2);assert.equal(s.songs[0].numberOneStreak,0)
 s.chartWeek=12;E.publish(s,{songs:[songs[1]],albums});assert.equal(s.chartBook.songs.records['you:s:1'].lastRank,null);assert.equal(s.chartBook.songs.records['you:s:1'].history.at(-1).rank,null)
 s.chartWeek=13;E.publish(s,{songs:[songs[0],songs[1]],albums});assert.equal(s.chartBook.songs.current[0].movement,'RE');assert.equal(s.songs[0].chartWeeks,3)
}
{
 const s=state();s.chartBook=E.initial(8);s.chartWeek=10;E.track(s,'songs',[{key:'npc:s:old',title:'Old',artist:'NPC',streams:100,releaseWeek:4}],{baseline:true});assert.equal(s.chartBook.songs.current[0].movement,'BASE');assert.equal(s.chartBook.songs.records['npc:s:old'].partial,true);assert.equal(s.chartBook.songs.records['npc:s:old'].debutRank,null)
}
assert.ok(bridge.includes('ENCORE_CHARTS.publish'));assert.ok(bridge.includes('ENCORE_CHARTS.track'));assert.ok(build.includes("readFileSync('engine/charts.js'"));
console.log('PASS shared Chart Ledger owns issue publication, movement, re-entry, peak, longevity and #1 streak state for legacy ENCORE and UI2.');