import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../ui2/commands.js',import.meta.url),'utf8');
const context={console,structuredClone,BigInt,Math,JSON,Number,String,Array,Object,Error,RegExp};
context.globalThis=context;
vm.createContext(context);
vm.runInContext(source,context);
const {applyCommand}=context.ENCORE_UI2_COMMAND_CORE;

function base(){return {week:8,started:true,cash:650,walletCents:'65000',energy:100,fans:100,loyalty:20,songs:[],world:[{id:4,name:'Mira Vale',relation:0}],history:[],finance:{week:{wages:0,live:0,expenses:0}},development:{writing:{level:0,xp:0},recording:{level:0,xp:0},producing:{level:0,xp:0},charisma:{level:0,xp:0},marketability:{level:0,xp:0},stagePresence:{level:0,xp:0},touring:{level:0,xp:0},viralAbility:{level:0,xp:0}},social:{version:1,sinceWeek:1,followers:100,posts:[{id:3,week:8,comments:20,fans:0,replied:false}],feed:[{artist:4,week:8,text:'New music soon.'}],interactions:[],lastWeek:0,lifetimeViews:0,lifetimeFans:0,weekly:[],nextId:4}}}

{
 const before=base(),{state,message}=applyCommand(before,'work');
 assert.equal(before.cash,650,'commands must not mutate the caller snapshot');
 assert.equal(state.energy,85);assert.equal(state.cash,830);assert.equal(state.walletCents,'83000');assert.equal(state.finance.week.wages,180);assert.match(state.history[0].text,/shift paid \$180/i);assert.match(message,/\+\$180/)
}
{
 const s=base();s.energy=170;const {state}=applyCommand(s,'rest');assert.equal(state.energy,200);assert.equal(state.restWeek,8);assert.throws(()=>applyCommand(state,'rest'),/already rested/i)
}
{
 const s=base();s.energy=4;assert.throws(()=>applyCommand(s,'work'),/recover energy/i);assert.equal(s.cash,650);assert.equal(s.energy,4)
}
{
 const s=base();const {state}=applyCommand(s,'train',{key:'writing',intensity:0});assert.equal(state.energy,95);assert.equal(state.development.writing.xp,20);assert.match(state.history[0].text,/Writing: \+20 XP/)
}
{
 const s=base();s.songs.push({id:91,title:'Finished Master',released:null,streams:0,total:0});const {state}=applyCommand(s,'release-shelf',{songId:91});assert.equal(state.songs[0].released,8);assert.equal(state.energy,95);assert.equal(state.cash,630);assert.equal(state.walletCents,'63000');assert.equal(state.finance.week.expenses,20);assert.match(state.history[0].text,/Finished Master/)
}
{
 const s=base();s.draft={id:92,title:'Ready Record',steps:3,quality:81,commercial:76};const {state}=applyCommand(s,'finish-draft');assert.equal(state.draft,null);assert.equal(state.songs.length,1);assert.equal(state.songs[0].released,null);assert.equal(state.energy,100);assert.equal(state.cash,650)
}
{
 const s=base();s.draft={id:93,title:'Release Tonight',steps:3,quality:88,commercial:84};const {state}=applyCommand(s,'release-draft');assert.equal(state.draft,null);assert.equal(state.songs[0].released,8);assert.equal(state.energy,95);assert.equal(state.cash,630);assert.equal(state.finance.week.expenses,20)
}
{
 const s=base();const {state}=applyCommand(s,'pulse-support',{artistId:4});assert.equal(state.energy,98);assert.equal(state.world[0].relation,1);assert.deepEqual(JSON.parse(JSON.stringify(state.social.interactions)),[{week:8,artist:4}]);assert.throws(()=>applyCommand(state,'pulse-support',{artistId:4}),/already supported/i)
}
{
 const s=base();const {state}=applyCommand(s,'pulse-reply',{postId:3});assert.equal(state.energy,95);assert.equal(state.social.posts[0].replied,true);assert.equal(state.fans,101);assert.equal(state.loyalty,21);assert.equal(state.development.charisma.xp,10);assert.equal(state.social.lifetimeFans,1)
}
assert.equal(source.includes('/game.js'),false,'UI2 command bridge must not import the legacy renderer');
assert.equal(source.includes('advance('),false,'week advancement stays outside the bridge until the weekly engine is extracted');
assert.ok(source.includes("addEventListener('click'"));assert.ok(source.includes(',true);'),'live command interception must run in capture phase before stale preview handlers');
console.log('PASS UI2 command bridge: work/rest/training, Studio release flow, PULSE interactions, exact-cent wallet sync, immutable inputs and no legacy renderer dependency.');