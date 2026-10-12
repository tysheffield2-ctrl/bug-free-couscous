import vm from 'node:vm';import fs from 'node:fs';import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8').replace(/boot\(\);\s*$/,'');
function harness(){const elements={},storage=new Map();const c={console,location:{pathname:'/sandbox'},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{getElementById(id){return elements[id]??={innerHTML:'',textContent:'',hidden:false,showModal(){this.open=true},close(){this.open=false}}},addEventListener(){}},window:{scrollTo(){},addEventListener(){}},setTimeout(){return 1},clearTimeout(){},fetch:async()=>({ok:true,status:200,json:async()=>({save:null,etag:null})}),FormData:class{constructor(v){this.v=v}get(k){return this.v[k]??null}getAll(k){return this.v[k]||[]}}};vm.createContext(c);vm.runInContext(source,c);return x=>vm.runInContext(x,c)}
const run=harness();await run('boot()');
assert.equal(run('liveVenues.length'),12);
assert.deepEqual(Array.from(run('liveVenues.slice(0,4).map(v=>v.seats)')),[500,2500,18000,65000]);
assert.ok(run("careerWorldState(90,'Hot',migrateCareerWorld())")==='Peak');
run("const w=migrateCareerWorld();w.state='Drought';w.momentum=60;w.publicInterest=60;w.culturalRelevance=60");
assert.ok(['Comeback','Rising','Hot','Peak'].includes(run("careerWorldState(65,'Drought',migrateCareerWorld())")));
run("createLabelOffer(0,'Foundation test');globalThis.offer=s.labelBusiness.offers.find(o=>!o.used);globalThis.m=negotiationMeters(offer)");
assert.ok(run("m.interest>=0&&m.interest<=100&&m.patience>=0&&m.patience<=100&&m.leverage>=0&&m.leverage<=100"));
const patience=run('m.patience');
run("globalThis.pressure=negotiationPressure({...offer.proposal},{...offer.proposal,advance:offer.proposal.advance*2+1000000,share:Math.max(.01,offer.proposal.share-.05)},offer)");
assert.ok(run('pressure>0'));assert.equal(run('m.patience'),patience);
assert.ok(run("negotiationPanel(offer).includes('Interest')&&negotiationPanel(offer).includes('Patience')&&negotiationPanel(offer).includes('Your leverage')"));
console.log('PASS ENCORE 1.0 foundations: career seasons, negotiation meters, and expanded Touring 2.1 venue ladder.');
