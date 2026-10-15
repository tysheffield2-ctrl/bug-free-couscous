import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {gunzipSync} from 'node:zlib';
import {harness} from './harness.mjs';
const source=fs.readFileSync(new URL('../dist/week-engine.js',import.meta.url),'utf8');
const legacySource=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8').replace(/boot\(\);\s*$/,'');
const oldAdvance=fs.readFileSync(new URL('./fixtures/legacy-week-reference.txt',import.meta.url),'utf8').trim();
const originalSource=legacySource.replace(/^function advanceWeek\([^\n]+/m,oldAdvance);
function worker(path,seed=12345){let result;let tick=1700000000000;const math=Object.create(Math);math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};const ctx={console,location:{pathname:path},Math:math,Date:class extends Date{static now(){return ++tick}},postMessage:v=>result=v};vm.createContext(ctx);vm.runInContext(source,ctx);return state=>{ctx.onmessage({data:{type:'advance-week',state}});return result}}
const manifest=JSON.parse(fs.readFileSync(new URL('./fixtures/manifest.json',import.meta.url)));
for(const item of manifest){
 const fixture=JSON.parse(gunzipSync(fs.readFileSync(new URL('./fixtures/'+item.file,import.meta.url))));
 for(const week of [fixture.state.week,Math.ceil(fixture.state.week/52)*52+4,Math.ceil(fixture.state.week/52)*52]){
  const input=structuredClone(fixture.state);input.week=week;
  const mode=item.mode==='sandbox',path=mode?'/sandbox':'/';
  const h=harness(path,12345,originalSource);h.c.input=structuredClone(input);
  h.run(`s=validateBundle({format:'encore-career',schemaVersion:1,mode:${JSON.stringify(item.mode)},state:input});saveReady=true;saveConflict=false;render=()=>{};weekRecap=()=>{};queueSave=()=>{};backupCareer=()=>true;advance(true)`);
  const before=JSON.stringify(input),result=worker(mode?'/sandbox/week-engine.js':'/week-engine.js')(input);
  assert.equal(result.ok,true,result.error);assert.equal(result.state.week,week+1);assert.equal(JSON.stringify(input),before);
  assert.deepEqual(JSON.parse(JSON.stringify(result.state)),JSON.parse(h.run('JSON.stringify(s)')),item.file+' week '+week+' save parity');
 }
 console.log('PASS UI2 worker full-save parity with pre-extraction legacy: '+item.file+' including month/year close');
}
const bad=worker('/week-engine.js')({week:1,sandbox:true});assert.equal(bad.ok,false);assert.match(bad.error,/mode mismatch/i);
const invalid=worker('/week-engine.js')({week:1,sandbox:false});assert.equal(invalid.ok,false);
console.log('PASS isolated week worker rejects mismatched/invalid saves without persistence');
