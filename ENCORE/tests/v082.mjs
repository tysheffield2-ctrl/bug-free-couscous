import vm from 'node:vm';import fs from 'node:fs';import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8').replace(/boot\(\);\s*$/,'');
function harness(path='/sandbox'){const elements={},storage=new Map(),events={};let stored=null;const bodyChildren=[];const c={console,location:{pathname:path},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{documentElement:{dataset:{}},body:{classList:{add(){},remove(){},toggle(){}},appendChild(x){bodyChildren.push(x)}},getElementById(id){return elements[id]??=({innerHTML:'',textContent:'',hidden:false,open:false,className:'',style:{},showModal(){this.open=true},close(){this.open=false},querySelectorAll(){return[]},querySelector(){return null}})},addEventListener(){},querySelectorAll(){return[]},querySelector(){return null},createElement(tag){return {tagName:tag,className:'',dataset:{},textContent:'',children:[],style:{setProperty(){}},appendChild(x){this.children.push(x)},setAttribute(){},before(){},remove(){}}},visibilityState:'visible'},window:{scrollTo(){},addEventListener(k,fn){events[k]=fn}},setTimeout(){return 1},clearTimeout(){},setInterval(){return 1},clearInterval(){},fetch:async(u,o={})=>({ok:true,status:200,json:async()=>o.method==='PUT'?(stored=JSON.parse(o.body),{etag:'test'}):({save:stored,etag:stored?'test':null})}),FormData:class{constructor(v){this.v=v}get(k){return this.v?.[k]??null}getAll(k){return this.v?.[k]||[]}}};vm.createContext(c);vm.runInContext(source,c);return {run:x=>vm.runInContext(x,c),c,elements,bodyChildren}}
const h=harness();await h.run('boot()');
assert.equal(h.run('GAME_VERSION'),'0.8.5-beta.1');
h.run('migrateV082()');assert.equal(h.run('s.v082.version'),1);
// Creative Brief is gone from the visible studio and no longer adds hidden bonuses to new songs.
assert.equal(h.run("studio().includes('Creative brief')"),false);
h.run("s.cash=1e6;s.energy=200;newSong({preventDefault(){},target:{songtitle:'No Brief',mood:directions[0].id,package:'0'}})");assert.equal(h.run('s.draft.sessionPlan.q'),0);assert.equal(h.run('s.draft.sessionPlan.a'),0);assert.equal(h.run("'brief' in s.draft.sessionPlan"),false);
h.run("s.draft.steps=1;s.draft.sessionPlan={brief:'anthem',q:-1,a:4};migrateV082()");assert.equal(h.run('s.draft.sessionPlan.q'),0);assert.equal(h.run('s.draft.sessionPlan.a'),0);
assert.equal(h.run("V080_GUIDE_TOPICS.find(x=>x[0]==='Make a song')[2].toLowerCase().includes('creative brief')"),false);
// Home surfaces an executive decision brief.
assert.ok(h.run("V082_attentionCard().includes('RIGHT NOW')"));assert.ok(h.run("home().includes('executive-brief')"));
// NPC career state is persisted for the active industry and can produce living-world headlines.
h.run("globalThis.a=s.world[0];globalThis.st=V082_npcState(a,true);st.momentum=80;globalThis.oldRandom=Math.random;Math.random=()=>0.1;V082_npcEvent(a,st);Math.random=oldRandom");assert.ok(h.run('s.v082.headlines.length>=1'));assert.ok(h.run("['Prime','Ascending','Steady','Rebuild','Quiet era','Hiatus','Comeback'].includes(V082_phaseFor(st))"));
h.run("industryTab='World pulse';globalThis.pulseHTML=industry()");assert.ok(h.run("pulseHTML.includes('World Pulse')&&pulseHTML.includes('The scene has its own momentum')"));
h.run('profile(0)');assert.ok(h.run("$('modal').innerHTML.includes('CAREER PULSE')"));
// Monthly NPC settlement moves skill/career state without breaking saves.
h.run("s.v082.lastSettledMonth=-1;globalThis.skillBefore=s.world[1].skill;V082_settleNpcLife()");assert.ok(h.run('Number.isFinite(s.world[1].skill)&&s.world[1].skill>=10&&s.world[1].skill<=99'));assert.equal(h.run('s.v082.lastSettledMonth'),h.run('s.empire.month'));
h.run('validateBundle(saveBundle())');
console.log('PASS ENCORE 0.8.2 Creative Brief removal, executive home brief, NPC career arcs, World Pulse, profile immersion and save compatibility.');