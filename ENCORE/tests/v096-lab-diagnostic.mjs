import vm from 'node:vm';import fs from 'node:fs';
const source=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8').replace(/boot\(\);\s*$/,'');
function harness(path='/'){const elements={},storage=new Map(),events={};let stored=null;const c={console,location:{pathname:path},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{getElementById(id){return elements[id]??=({innerHTML:'',textContent:'',hidden:false,showModal(){this.open=true},close(){this.open=false}})},addEventListener(){}},window:{scrollTo(){},addEventListener(k,fn){events[k]=fn}},setTimeout(){return 1},clearTimeout(){},fetch:async(u,o={})=>({ok:true,status:200,json:async()=>o.method==='PUT'?(stored=JSON.parse(o.body),{etag:'test'}):({save:stored,etag:stored?'test':null})}),FormData:class{constructor(v){this.v=v}get(k){return this.v[k]??null}getAll(k){return this.v[k]||[]}}};vm.createContext(c);vm.runInContext(source,c);return {run:x=>vm.runInContext(x,c),c,elements}}
const h=harness('/sandbox');
await h.run('boot()');
console.log('DIAG after boot',h.run('JSON.stringify({started:s.started,walletCents:s.walletCents,cash:s.cash,saveReady,modal:$(`modal`).open,lab:$(`lab-error`).textContent})'));
h.run('sandboxEditor()');
console.log('DIAG after editor',h.run('JSON.stringify({started:s.started,walletCents:s.walletCents,cash:s.cash,modal:$(`modal`).open,lab:$(`lab-error`).textContent})'));
h.run(`globalThis.form={cash:'1234567890123456789.12',fans:'5000000',energy:'99',ap:'5',reputation:'80',loyalty:'75'};Object.keys(developmentInfo).forEach(k=>form['stat_'+k]='37');s.world.forEach(a=>form['relation_'+a.id]=String(a.id%2?100:-100))`);
try{h.run('applySandboxEdits({preventDefault(){},target:form})')}catch(e){console.log('DIAG apply threw',e?.stack||e)}
console.log('DIAG after apply',h.run('JSON.stringify({started:s.started,walletCents:s.walletCents,cash:s.cash,modal:$(`modal`).open,lab:$(`lab-error`).textContent,social:!!s.social,v096:!!s.v096})'));
