// Optional DOM integration test: npm install jsdom, or set ENCORE_JSDOM to its module path.
import fs from 'node:fs';import vm from 'node:vm';import {gunzipSync} from 'node:zlib';import assert from 'node:assert/strict';
import handler from '../dist/server/index.js';
const {JSDOM,VirtualConsole}=await import(process.env.ENCORE_JSDOM||'jsdom');
const html=fs.readFileSync(new URL('../dist/ui2.html',import.meta.url),'utf8');
const workerSource=fs.readFileSync(new URL('../dist/week-engine.js',import.meta.url),'utf8');
const until=async check=>{for(let i=0;i<100;i++){if(check())return;await new Promise(r=>setTimeout(r,20))}throw Error('DOM condition timed out')};
for(const lab of [false,true]){
 let stored=JSON.parse(gunzipSync(fs.readFileSync(new URL('../tests/fixtures/'+(lab?'v087-sandbox':'v087-career')+'.json.gz',import.meta.url))));
 const first=stored.state.week;let revision=1,writes=0,conflict=false,workerCalls=0;
 const errors=[];const virtualConsole=new VirtualConsole();virtualConsole.on('jsdomError',e=>{if(!e.message.includes('navigation'))errors.push(e.message)});
 const bucket={get:async()=>({json:async()=>structuredClone(stored),httpEtag:'"'+revision+'"'}),put:async(key,raw,options)=>{writes++;assert.equal(key.startsWith('sandbox/'),lab);if(conflict||options.onlyIf.get('If-Match')!=='"'+revision+'"')return null;stored=JSON.parse(raw);revision++;return {httpEtag:'"'+revision+'"'}}};
 const options={url:'https://encore.test'+(lab?'/ui2/sandbox':'/ui2'),runScripts:'dangerously',virtualConsole,beforeParse(w){
  w.scrollTo=()=>{};
  w.fetch=async(url,opts={})=>handler.fetch(new Request(new URL(url,w.location.href),{...opts,headers:{...opts.headers,Origin:'https://encore.test',Cookie:(lab?'encore_lab':'encore_guest')+'='+'a'.repeat(64)}}),{BUCKET:bucket});
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false};
  w.Worker=class{constructor(path){this.path=path}terminate(){}postMessage(data){workerCalls++;setTimeout(()=>{try{const ctx={console,location:{pathname:this.path},postMessage:data=>this.onmessage({data})};vm.createContext(ctx);vm.runInContext(workerSource,ctx);ctx.onmessage({data})}catch(e){this.onerror(e)}},0)}};
 }};
 let dom=new JSDOM(html,options);
 const d=dom.window.document;await until(()=>d.querySelector('[data-ui2-advance]')).catch(e=>{console.log(errors,d.querySelector('#ui2-root')?.textContent);throw e});
 d.querySelector('[data-ui2-advance]').click();await until(()=>d.querySelector('dialog')?.open);
 const button=text=>[...d.querySelectorAll('button')].find(b=>b.textContent===text);
 button('Keep playing').click();assert.equal(writes,0);assert.equal(workerCalls,0);
 d.querySelector('[data-ui2-advance]').click();await until(()=>d.querySelector('dialog')?.open);button('Advance one week').click();
 await until(()=>d.querySelector('dialog h2')?.textContent==='Week '+first+' complete');
 assert.equal(stored.state.week,first+1);assert.equal(stored.state.energy,200);assert.equal(writes,1);assert.equal(workerCalls,1);assert.deepEqual(errors,[]);
 assert.match(d.querySelector('dialog').textContent,/Saved successfully/);
 // Unlock the page by loading the stored career into a fresh DOM below in the browser suite;
 // the command API itself remains blocked until recap reloads, preventing a second click.
 await dom.window.ENCORE_UI2_COMMANDS.execute('advance-week',{expectedWeek:first});assert.equal(writes,1);
 console.log('PASS '+(lab?'sandbox':'normal')+' UI2 DOM: live render, cancel, worker, conditional save, recap, duplicate-click guard');
 dom.window.close();
 dom=new JSDOM(html,options);await until(()=>dom.window.document.querySelector('[data-ui2-advance]'));
 assert.match(dom.window.document.querySelector('.ui2-topmeta').textContent,new RegExp('Week '+(first+1)));
 conflict=true;await dom.window.ENCORE_UI2_COMMANDS.execute('advance-week',{expectedWeek:first+1});
 assert.equal(writes,2);assert.equal(workerCalls,2);assert.equal(stored.state.week,first+1);
 assert.match(dom.window.document.querySelector('.ui2-toast').textContent,/changed elsewhere/);
 conflict=false;const priorWrites=writes;
 await dom.window.ENCORE_UI2_COMMANDS.execute('advance-week',{expectedWeek:first});
 assert.equal(writes,priorWrites);assert.equal(workerCalls,2);
 console.log('PASS reload reads persisted week; conflicting save is not replayed; stale confirmation cannot advance');
 dom.window.close();
}
