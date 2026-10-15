// Optional browser acceptance test: NODE_PATH/runtime bundle supplies Playwright.
import http from 'node:http';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import handler from '../dist/server/index.js';
const require=createRequire(import.meta.url);
const {chromium}=require(require.resolve('playwright',{paths:[process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES||process.cwd()]}));
const normal=JSON.parse(gunzipSync(fs.readFileSync(new URL('../tests/fixtures/v087-career.json.gz',import.meta.url))));
const sandbox=JSON.parse(gunzipSync(fs.readFileSync(new URL('../tests/fixtures/v087-sandbox.json.gz',import.meta.url))));
let revision=1,puts=0,conflict=false;
const data=new Map();
const bucket={async get(key){if(!data.has(key))data.set(key,{raw:JSON.stringify(key.startsWith('sandbox/')?sandbox:normal),etag:'"initial"'});const v=data.get(key);return {json:async()=>JSON.parse(v.raw),httpEtag:v.etag}},async put(key,raw,{onlyIf}){puts++;const old=data.get(key);if(conflict||onlyIf.get('If-Match')!==old?.etag)return null;const value={raw,etag:'"'+(++revision)+'"'};data.set(key,value);return {httpEtag:value.etag}}};
const server=http.createServer(async(req,res)=>{try{const chunks=[];for await(const c of req)chunks.push(c);const request=new Request('http://127.0.0.1:'+server.address().port+req.url,{method:req.method,headers:req.headers,...(req.method==='PUT'?{body:Buffer.concat(chunks),duplex:'half'}:{})});const result=await handler.fetch(request,{BUCKET:bucket});res.writeHead(result.status,Object.fromEntries(result.headers));res.end(Buffer.from(await result.arrayBuffer()))}catch(e){res.writeHead(500);res.end(e.message)}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({...(process.env.ENCORE_CHROMIUM?{executablePath:process.env.ENCORE_CHROMIUM}:{}),headless:true,args:['--no-sandbox']});
try{
 for(const lab of [false,true]){
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await context.addCookies([{name:lab?'encore_lab':'encore_guest',value:(lab?'b':'a').repeat(64),url:origin}]);
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+(lab?'/ui2/sandbox':'/ui2'));
  await page.locator('[data-ui2-advance]').waitFor();
  const api=lab?'/api/sandbox/save':'/api/save';
  let state=await page.evaluate(async api=>(await(await fetch(api)).json()).save.state,api);
  const week=state.week;
  await page.locator('[data-ui2-advance]').click();
  await page.getByRole('button',{name:'Keep playing',exact:true}).click();
  assert.equal(puts,lab?1:0,'cancel must not save');
  await page.locator('[data-ui2-advance]').click();
  await page.getByRole('button',{name:'Advance one week',exact:true}).click();
  await page.getByRole('heading',{name:'Week '+week+' complete',exact:true}).waitFor({timeout:30000});
  await page.screenshot({path:'/tmp/encore-ui2-'+(lab?'sandbox':'career')+'.png',fullPage:true});
  await page.getByRole('button',{name:'Continue',exact:true}).click();
  await page.waitForLoadState();
  state=await page.evaluate(async api=>(await(await fetch(api)).json()).save.state,api);
  assert.equal(state.week,week+1);assert.equal(state.energy,200);assert.equal(!!state.sandbox,lab);assert.deepEqual(errors,[]);
  console.log('PASS mobile '+(lab?'sandbox':'career')+': confirm/cancel → worker → actual save handler → recap → reload, no page errors');
  if(lab){
   conflict=true;const before=puts;
   await page.locator('[data-ui2-advance]').click();await page.getByRole('button',{name:'Advance one week',exact:true}).click();
   await page.locator('.ui2-toast').filter({hasText:'changed elsewhere'}).waitFor();
   assert.equal(puts,before+1,'conflicting week must not be retried');
   const after=await page.evaluate(async api=>(await(await fetch(api)).json()).save.state,api);assert.equal(after.week,week+1);
   console.log('PASS save conflict: one rejected write, no replay, no saved week change');
  }
  await context.close();
 }
}finally{await browser.close();server.close()}
