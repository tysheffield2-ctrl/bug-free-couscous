import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../engine/studio.js',import.meta.url),'utf8');
const adapter=fs.readFileSync(new URL('../src/engine-adapter.js',import.meta.url),'utf8');
const runtime=fs.readFileSync(new URL('../engine/runtime.js',import.meta.url),'utf8');
const studioLife=fs.readFileSync(new URL('../src/studio-life.js',import.meta.url),'utf8');
const studioUi=fs.readFileSync(new URL('../src/v103-studio.js',import.meta.url),'utf8');
const studioFlow=fs.readFileSync(new URL('../src/v121-studio-flow.js',import.meta.url),'utf8');
const studioScaleUi=fs.readFileSync(new URL('../src/v122-studio-scale.js',import.meta.url),'utf8');
const commands=fs.readFileSync(new URL('../ui2/commands.js',import.meta.url),'utf8');
const live=fs.readFileSync(new URL('../ui2/studio-live.js',import.meta.url),'utf8');
const build=fs.readFileSync(new URL('../build.mjs',import.meta.url),'utf8');
const ctx={console,structuredClone,BigInt,Math,JSON,Number,String,Array,Object,Error,Date};ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(source,ctx);const E=ctx.ENCORE_STUDIO;
function state(){return {week:6,genre:'Hip-hop',cash:50000,walletCents:'5000000',energy:200,songs:[],finance:{weeks:0,revenue:0,week:{expenses:0}},development:{writing:{level:60,xp:0},recording:{level:55,xp:0},producing:{level:50,xp:0},charisma:{level:45,xp:0},marketability:{level:40,xp:0},stagePresence:{level:30,xp:0},touring:{level:20,xp:0},viralAbility:{level:35,xp:0}}}}
assert.equal(E.version,3);assert.equal(E.directions.length,8);assert.equal(E.directions[0].id,'Personal / storytelling');assert.deepEqual(JSON.parse(JSON.stringify(E.directions[0].weights)),[.4,.3,.15,.05,.1]);assert.equal(E.packages[2].fee,25000);assert.equal(E.progression.record.energy,15);assert.equal(E.progression.record.cost,40);assert.equal(E.progression.mix.energy,15);assert.equal(E.progression.mix.cost,30);assert.equal(E.studioScaleBands.length,7);
{
 const s=state(),rngs=[.5,.5];let i=0;const d=E.start(s,{title:'Pressure Test',mood:'Catchy / radio-ready',packageIndex:1,brief:'anthem',creative:{theme:'Ambition',tempo:'Up-tempo',intent:'Hit-minded',texture:'Clean & modern',hook:'Big chorus'}},{rng:()=>rngs[i++]??.5,id:77});
 assert.equal(s.draft,d);assert.equal(d.id,77);assert.equal(d.steps,1);assert.equal(d.productionBudget,1500);assert.equal(d.productionBonus,5);assert.equal(d.sessionPlan.brief,'anthem');assert.equal(d.sessionPlan.q,-1);assert.equal(d.sessionPlan.a,4);assert.equal(s.energy,190);assert.equal(s.cash,48500);assert.equal(s.walletCents,'4850000');assert.equal(s.finance.week.expenses,1500);assert.equal(d.development.writing.level,60);assert.ok(Number.isInteger(d.quality));assert.ok(Number.isInteger(d.commercial));assert.ok(d.creativeScores.catchiness>d.creativeScores.depth);
 assert.equal(E.studioScale(s).name,'Independent room');assert.equal(E.stageQuote(s,'record').cost,40);
 s.development.recording.level=90;s.development.charisma.level=80;const r=E.progress(s);assert.equal(r.stage,'record');assert.equal(r.cost,40);assert.equal(d.steps,2);assert.equal(d.sessionPlan.record,'standard');assert.equal(d.sessionPlan.recordRoom,'Independent room');assert.equal(d.sessionPlan.q,-1);assert.equal(d.sessionPlan.a,4);assert.equal(d.development.recording.level,90);assert.equal(d.development.charisma.level,80);assert.equal(s.energy,175);assert.equal(s.cash,48460);assert.equal(s.finance.week.expenses,1540);
 s.development.producing.level=85;s.development.marketability.level=75;s.development.viralAbility.level=70;const m=E.progress(s);assert.equal(m.stage,'mix');assert.equal(m.cost,30);assert.equal(d.steps,3);assert.equal(d.sessionPlan.mix,'standard');assert.equal(d.sessionPlan.mixRoom,'Independent room');assert.equal(d.sessionPlan.q,-1);assert.equal(d.sessionPlan.a,4);assert.equal(d.development.producing.level,85);assert.equal(d.development.marketability.level,75);assert.equal(d.development.viralAbility.level,70);assert.equal(s.energy,160);assert.equal(s.cash,48430);assert.equal(s.finance.week.expenses,1570);
 const song=E.finish(s,{release:true});assert.equal(s.draft,null);assert.equal(song.released,6);assert.equal(s.songs.length,1);assert.equal(s.energy,155);assert.equal(s.cash,48410);assert.equal(s.finance.week.expenses,1590)
}
{
 const s=state();s.finance.weeks=26;s.finance.revenue=1500000;const scale=E.studioScale(s);assert.equal(scale.name,'Premier room');assert.equal(scale.recordCost,750);assert.equal(scale.mixCost,500);assert.equal(scale.qualityBonus,2);assert.equal(scale.revenueRunRate,3000000);
 const d=E.start(s,{title:'Arena Record',packageIndex:0,brief:'story'},{rng:()=>.5,id:99});const q0=d.sessionPlan.q;const r=E.perform(s,'standard');assert.equal(r.cost,750);assert.equal(d.sessionPlan.q,q0+2);assert.equal(d.sessionPlan.recordRoom,'Premier room');const m=E.perform(s,'standard');assert.equal(m.cost,500);assert.equal(d.sessionPlan.q,q0+4);assert.equal(d.sessionPlan.mixRoom,'Premier room');assert.equal(s.finance.week.expenses,1250)
}
{
 const s=state();E.start(s,{title:'Compatibility',packageIndex:0},{rng:()=>.5,id:88});const r=E.perform(s,'polished');assert.equal(r.option.id,'polished');assert.equal(s.draft.steps,2)
}
{
 const s=state();s.songs.push({id:5,title:'Shelf',released:null});const x=E.releaseShelf(s,5);assert.equal(x.released,6);assert.equal(s.energy,195);assert.equal(s.cash,49980);assert.equal(s.finance.week.expenses,20);assert.throws(()=>E.releaseShelf(s,5),/no longer waiting/i)
}
{
 const s=state();s.energy=9;assert.throws(()=>E.start(s,{title:'Nope'}),/recover energy/i);assert.equal(s.draft,undefined);assert.equal(s.cash,50000)
}
assert.ok(adapter.includes('ENCORE_ENGINE.studio.start'));assert.ok(adapter.includes('ENCORE_ENGINE.studio.progress'));assert.ok(adapter.includes('ENCORE_ENGINE.studio.finish'));assert.ok(runtime.includes("studio:snap('ENCORE_STUDIO')"));assert.equal(fs.existsSync(new URL('../src/studio-engine-bridge.js',import.meta.url)),false);
assert.equal(studioLife.includes('sessionOptions='),false,'legacy session choice catalog is removed from song creation');assert.equal(studioLife.includes("replace('onclick=\"progressSong()\"'"),false,'legacy progression button is no longer replaced by a choice modal');
assert.equal(studioUi.includes('Open session choices'),false);assert.equal(studioUi.includes('onclick="sessionChoices()"'),false);assert.ok(studioUi.includes('onclick="progressSong()"'));assert.ok(studioUi.includes('onclick="finishSong(true)"'));
assert.equal(live.includes('ui2-session-choices'),false,'UI2 choice tray removed');assert.equal(live.includes('engine.sessions['),false,'UI2 does not enumerate session choices');assert.ok(live.includes("dataset.sessionOption='standard'"));assert.ok(live.includes('engine.studioScale'));
assert.ok(studioFlow.includes("title='Finish the record'"));assert.ok(studioScaleUi.includes('V122_studioScale'));assert.ok(studioScaleUi.includes('revenue'));assert.ok(build.includes("'v121-studio-flow'"));assert.ok(build.includes("'v122-studio-scale'"));
assert.ok(commands.includes("studio().perform"),'compatibility command path remains available for UI2 standard stage button');assert.equal(commands.includes("const directions=["),false,'UI2 must not duplicate Studio direction rules');assert.ok(build.includes("readFileSync('engine/studio.js'"));
console.log('PASS Studio Engine owns Write → Record → Mix mutations and the current renderer routes those actions through the single ENCORE Engine adapter.');