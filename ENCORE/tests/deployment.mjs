import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import handler from '../dist/server/index.js';
const version=JSON.parse(readFileSync('package.json')).version;
for(const path of ['/','/sandbox','/offline','/offline/sandbox']){const r=await handler.fetch(new Request('https://encore.test'+path),{});assert.equal(r.status,200);assert.ok(r.headers.get('Content-Type').startsWith('text/html'))}
const identity=await handler.fetch(new Request('https://encore.test/api/version'),{});assert.deepEqual(await identity.json(),{version});assert.equal(identity.headers.get('Cache-Control'),'no-store');
const unavailable=await handler.fetch(new Request('https://encore.test/api/save'),{});assert.equal(unavailable.status,503);
const established='a'.repeat(64),stored={schemaVersion:1,state:{week:12,sandbox:false,songs:[],world:[]}};
let reads=[];const bucket={get:async key=>{reads.push(key);return {json:async()=>stored,httpEtag:'revision'}}};
const restored=await handler.fetch(new Request('https://encore.test/api/save',{headers:{Cookie:'encore_guest='+established}}),{BUCKET:bucket});assert.deepEqual((await restored.json()).save,stored);assert.deepEqual(reads,['careers/'+established]);
const denied=await handler.fetch(new Request('https://encore.test/api/save',{method:'PUT',headers:{Cookie:'encore_guest='+established,Origin:'https://other.test','Content-Type':'application/json'},body:JSON.stringify(stored)}),{BUCKET:bucket});assert.equal(denied.status,403);
execFileSync(process.execPath,['build-pages.mjs']);assert.equal(readFileSync('dist/pages/_worker.js','utf8'),readFileSync('dist/server/index.js','utf8'));
assert.deepEqual(JSON.parse(readFileSync('dist/pages/_routes.json')),{version:1,include:['/*'],exclude:['/art/*','/portraits/*']});
assert.ok(readFileSync('dist/pages/portraits/core-atlas.webp').length>0);
console.log('PASS release identity, public routes, existing save-key continuity, origin protection and Pages advanced-mode packaging.');
