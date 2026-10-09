import assert from 'node:assert/strict';
import {harness} from './harness.mjs';

const h=harness('/sandbox',90210);await h.run('boot()');h.run('migrateV092()');
assert.equal(h.run("(studio().match(/Start your next record/g)||[]).length"),1);
assert.equal(h.run("(studio().match(/SESSION 01/g)||[]).length"),1);
assert.ok(h.run("studio().includes('Production budget')"));
assert.ok(h.run("V090_readableNumber('12.5',true).includes('$12.5')"));

h.run('globalThis.market=V092_featureMarketValue();globalThis.c1=V092_featureBookingChance(market);globalThis.c2=V092_featureBookingChance(market*100)');
assert.ok(h.run('c1>c2'));
h.run("s.cash=1000000000;s.energy=200;s.fans=1000000;s.reputation=100;s.world[0].fans=1000;s.world[0].reputation=20;s.world[0].relation=100;s.draft={title:'Split Test',features:[],feature:null};Math.random=()=>0;V092_bookFeatureDeal(0,'royalty')");
assert.equal(h.run('s.draft.features.length'),1);
assert.equal(h.run("s.draft.features[0].dealType"),'royalty');
assert.ok(h.run('s.draft.features[0].royaltyRate>0'));

h.run("s.cash=1000000000;s.energy=200;createMerch({preventDefault(){},target:{mode:'ondemand',look:'0',qty:'',price:'45'}},'tee');confirmMerch()");
assert.equal(h.run('s.empire.merch.at(-1).mode'),'ondemand');
assert.equal(h.run('s.empire.merch.at(-1).stock'),0);
assert.ok(h.run("V092_merchDemand('tee',30).mid>V092_merchDemand('tee',3000).mid"));

h.run("migrateLabelBusiness();globalThis.o={label:1};globalThis.base={type:'360',share:.35,weeks:52,advance:1000000,rights:V090_contractRights('360')};globalThis.artistFriendly={...base,rights:{...base.rights,touring:false,merch:false,endorsements:false,media:false}};globalThis.i1=V092_contractInterest(o,base);globalThis.i2=V092_contractInterest(o,artistFriendly)");
assert.ok(h.run('i1>i2'));
assert.ok(h.run("V090_rightsChecklist('360',base.rights,true).includes('onchange=')"));

h.run("s.cash=10000000000000;s.energy=200;migrateV092();globalThis.team=s.v081.sports.teams[0];V092_buySports(team.id,.55,true)");
assert.ok(Math.abs(h.run('V092_teamShare(team)')-.55)<1e-6);
assert.ok(h.run('s.v081.sports.holdings.filter(x=>x.team===team.id).every(x=>x.share<=.1)'));
h.run("V092_saveTeamPlan({preventDefault(){},target:{strategy:'contend',ticket:'premium',capital:'1000000'}},team.id)");
assert.equal(h.run('s.v081.sports.teams.find(x=>x.id===team.id).management.strategy'),'contend');
assert.ok(h.run('s.v081.sports.teams.find(x=>x.id===team.id).management.capital>=1000000'));

h.run("s.songs.push({id:991,title:'Crown Record',released:20,quality:99,total:100000000,peak:1,feature:null,features:[]});migrateV080();s.v080.awards.ceremonies=[{year:1,week:52,wins:1,nominations:1,results:[{category:'Song of the Year',winner:s.name,won:true,nominated:true,score:100,nominees:[{name:s.name,score:100,you:true},{name:s.world[0].name,score:80,you:false}]}]}];V092_backfillAwards();globalThis.aw=s.v080.awards.ceremonies[0].results[0]");
assert.equal(h.run('aw.winningWork'),'Crown Record');
assert.equal(h.run('aw.nominees.reduce((n,x)=>n+x.votes,0)'),1000);
assert.equal(h.run('aw.categoryCareerWin'),1);

h.run('validateBundle(saveBundle())');
console.log('PASS unified Studio creation UI, feature pricing/splits, merch demand/on-demand mode, responsive contract clauses, uncapped sports ownership/control, and richer Honors metadata.');
