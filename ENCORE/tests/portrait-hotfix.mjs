import vm from 'node:vm';import fs from 'node:fs';import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8').replace(/boot\(\);\s*$/,'');
function harness(path='/sandbox'){const elements={},storage=new Map(),events={};let stored=null;const bodyChildren=[];const c={console,location:{pathname:path},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{documentElement:{dataset:{}},body:{classList:{add(){},remove(){},toggle(){}},appendChild(x){bodyChildren.push(x)}},getElementById(id){return elements[id]??=({innerHTML:'',textContent:'',hidden:false,open:false,className:'',style:{},showModal(){this.open=true},close(){this.open=false},querySelectorAll(){return[]},querySelector(){return null}})},addEventListener(){},querySelectorAll(){return[]},querySelector(){return null},createElement(tag){return {tagName:tag,className:'',dataset:{},textContent:'',children:[],style:{setProperty(){}},appendChild(x){this.children.push(x)},setAttribute(){},before(){},remove(){}}},visibilityState:'visible'},window:{scrollTo(){},addEventListener(k,fn){events[k]=fn}},setTimeout(){return 1},clearTimeout(){},setInterval(){return 1},clearInterval(){},fetch:async(u,o={})=>({ok:true,status:200,json:async()=>o.method==='PUT'?(stored=JSON.parse(o.body),{etag:'test'}):({save:stored,etag:stored?'test':null})}),FormData:class{constructor(v){this.v=v}get(k){return this.v?.[k]??null}getAll(k){return this.v?.[k]||[]}}};vm.createContext(c);vm.runInContext(source,c);return {run:x=>vm.runInContext(x,c),c,elements}}
const h=harness();await h.run('boot()');
const mira=h.run("personPhoto('artist-mira','Mira Wells',true)");const cairo=h.run("personPhoto('artist-cairo','Cairo Stone',true)");
assert.ok(mira.includes('<img class="v084-person-img"'));assert.ok(cairo.includes('<img class="v084-person-img"'));
assert.ok(mira.includes('data:image/webp;base64,'));assert.ok(cairo.includes('data:image/webp;base64,'));
assert.equal(mira.includes('data:image/svg+xml'),false);assert.equal(cairo.includes('data:image/svg+xml'),false);
assert.ok(mira.includes('female portrait'));assert.ok(cairo.includes('male portrait'));
assert.equal(mira.includes('background-image'),false);assert.equal(cairo.includes('background-image'),false);
assert.ok(mira.includes('width:400%'));assert.ok(mira.includes('height:200%'));
assert.equal(h.run("personPhoto('artist-mira','Mira Wells',true)"),h.run("personPhoto('catalog-mira','Mira Wells',true)"));
const maya=h.run("personPhoto('agent-maya','Maya Ellis')");assert.ok(maya.includes('<img class="v084-person-img"'));assert.ok(maya.includes('data:image/webp;base64,'));
assert.equal(h.run("V084_portraitIndex('agent-maya','Maya Ellis')"),0);
console.log('PASS Safari-safe illustrated WebP portrait rendering and cross-screen portrait consistency.');
