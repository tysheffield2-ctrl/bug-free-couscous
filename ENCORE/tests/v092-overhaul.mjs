import assert from 'node:assert/strict';
import {harness} from './harness.mjs';

const h=harness('/sandbox',9202);await h.run('boot()');
assert.equal(h.run('GAME_VERSION'),'0.9.2-beta.1');
assert.equal(h.run("V090_readableNumber('12.5',false)"),'12.5');
assert.equal(h.run("V090_readableNumber('12.5',true)"),'$12.5');

h.run('V092_migrateCollabs();s.v081.creative.featurePrice=999999999');
assert.equal(h.run('s.v081.creative.featurePrice'),999999999);
h.run("s.v081.creative.offers.push({id:999,type:'featureInvite',artist:0,name:s.world[0].name,status:'open'});globalThis.low=V092_featureTermScore(s.v081.creative.offers.at(-1),0,0).score;globalThis.high=V092_featureTermScore(s.v081.creative.offers.at(-1),999999999,0).score");
assert.ok(h.run('high>low'));
assert.ok(h.run("V092_merchEstimate('tee',30,'inventory').units>V092_merchEstimate('tee',300,'inventory').units"));
assert.ok(h.run("V090_rightsChecklist('360',{},true).includes('V092_contractClauseChanged')"));
assert.ok(h.run("String(V081_rosterInterest).includes('rightsPressure')"));

h.run('s.cash=1000000000000;V092_migrateSports();V081_buySports(0,.25,true)');
assert.ok(Math.abs(h.run('V092_sportsHeldShare(s.v081.sports.teams[0])')-.25)<1e-9);
h.run('V081_buySports(0,.30,true)');
assert.ok(h.run('V092_sportsHeldShare(s.v081.sports.teams[0])>=.55'));
assert.ok(h.run("V081_sportsPage().includes('Front office')"));

h.run("s.week=52;s.songs.push({id:991,title:'Test Anthem',released:10,quality:100,total:1000000000,streams:10000000,peak:1,feature:null,features:[],genre:s.genre});annualAwards()");
assert.ok(h.run('s.v080.awards.ceremonies.at(-1).results.every(r=>r.nominees.reduce((n,x)=>n+(x.votes||0),0)===1000)'));
assert.ok(h.run('s.v080.awards.ceremonies.at(-1).results.every(r=>typeof r.winnerWork==="string"&&r.winnerWork.length>0)'));
assert.ok(h.run("V080_awardsPage().includes('Your career wins in this category')"));

h.run('s.draft=null');
assert.ok(h.run("studio().includes('studio-creative-brief')"));
assert.equal(h.run("(studio().match(/>Creative direction<\\/h/g)||[]).length"),0);
assert.ok(h.run("V080_destinations.some(d=>d[2]==='BusinessHQ')"));
h.run('validateBundle(saveBundle())');
console.log('PASS 0.9.2 feature pricing/splits, merch demand, contract UX, sports control, Honors detail, Studio cleanup, Business HQ and save compatibility.');
