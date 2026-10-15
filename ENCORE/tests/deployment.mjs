import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import handler from '../dist/server/index.js';
const version=JSON.parse(readFileSync('package.json')).version;
const interactiveRoutes=['/','/sandbox','/legacy','/legacy/sandbox','/offline','/offline/sandbox'];
const ui2Routes=['/ui2','/preview-ui2','/ui2/sandbox','/preview-ui2/sandbox'];
for(const path of [...interactiveRoutes,...ui2Routes]){
 const r=await handler.fetch(new Request('https://encore.test'+path),{});
 assert.equal(r.status,200);
 assert.ok(r.headers.get('Content-Type').startsWith('text/html'));
 const body=await r.text();
 if(ui2Routes.includes(path)){
  assert.ok(body.includes('ui2-bottomnav'));
  assert.ok(body.includes('Make the record.'));
  assert.ok(body.includes('Global Top 100'));
  assert.ok(body.includes('ENCORE_UI2_SAVE_URL'));
  assert.ok(body.includes('/api/sandbox/save'));
  assert.equal(body.includes('/game.js'),false);
 }else{
  assert.ok(body.includes('/game.js')||body.includes('id="app"'),'normal, sandbox and fallback routes must keep the fully interactive ENCORE renderer until UI2 interaction parity is proven');
  assert.equal(body.includes('ui2-bottomnav'),false,'interactive routes must not silently switch to the incomplete UI2 renderer');
 }
}
const identity=await handler.fetch(new Request('https://encore.test/api/version'),{});assert.deepEqual(await identity.json(),{version});assert.equal(identity.headers.get('Cache-Control'),'no-store');
const unavailable=await handler.fetch(new Request('https://encore.test/api/save'),{});assert.equal(unavailable.status,503);
const established='a'.repeat(64),stored={schemaVersion:1,state:{week:12,sandbox:false,songs:[],world:[]}};
let reads=[];const bucket={get:async key=>{reads.push(key);return {json:async()=>stored,httpEtag:'revision'}}};
const restored=await handler.fetch(new Request('https://encore.test/api/save',{headers:{Cookie:'encore_guest='+established}}),{BUCKET:bucket});assert.deepEqual((await restored.json()).save,stored);assert.deepEqual(reads,['careers/'+established]);
const denied=await handler.fetch(new Request('https://encore.test/api/save',{method:'PUT',headers:{Cookie:'encore_guest='+established,Origin:'https://other.test','Content-Type':'application/json'},body:JSON.stringify(stored)}),{BUCKET:bucket});assert.equal(denied.status,403);
execFileSync(process.execPath,['build-pages.mjs']);assert.equal(readFileSync('dist/pages/_worker.js','utf8'),readFileSync('dist/server/index.js','utf8'));
assert.deepEqual(JSON.parse(readFileSync('dist/pages/_routes.json')),{version:1,include:['/*'],exclude:['/art/*','/portraits/*']});
assert.ok(readFileSync('dist/pages/portraits/core-atlas.webp').length>0);
console.log('PASS fully interactive ENCORE remains the normal/sandbox default, UI2 stays available on explicit preview routes, save continuity is preserved, origin protection remains active, and Pages advanced-mode packaging matches production.');