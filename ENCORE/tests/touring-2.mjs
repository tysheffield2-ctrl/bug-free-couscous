import assert from 'node:assert/strict';
import {harness} from './harness.mjs';
const h=harness();await h.run('boot()');
h.run(`migrateTouring();globalThis.add=(city,week,venue=0,price=35)=>saveTourStop({preventDefault(){},target:{city,week,venue,price,vip:10,production:1,security:2,opener:''}});add('austin',1);add('atlanta',1);add('la',1)`);
assert.equal(h.run('s.touring.draft.route.length'),2,'third weekly show rejected');
h.run(`reviewWorldTour();confirmWorldTour();globalThis.launched=s.cash;confirmWorldTour()`);assert.equal(h.run('s.cash'),h.run('launched'),'deposit cannot duplicate');
h.run(`settleWorldTour();globalThis.afterShow=s.cash;settleWorldTour()`);assert.equal(h.run('s.cash'),h.run('afterShow'));assert.equal(h.run('s.liveTour.played'),2);
assert.ok(h.run('s.liveTour.route.every(r=>r.report&&r.report.tickets<=500&&r.report.cost>0)'));
assert.ok(h.run('s.finance.week.live===s.liveTour.gross'));assert.ok(h.run('s.touring.buzz.lift>0'));
h.run('validateBundle(saveBundle())');
// Price resistance, venue overreach, local demand and repeated visits are actual inputs.
h.run(`globalThis.r={id:99,city:'austin',week:10,venue:3,price:225,vip:0,production:1,security:1,opener:null,status:'scheduled'};s.careerWorld.markets.austin.fans=1000;globalThis.low=tourStopEstimate(r,[r]);r.price=450;globalThis.high=tourStopEstimate(r,[r])`);assert.ok(h.run('high.tickets<low.tickets'));assert.ok(h.run('low.overreach'));
h.run(`r.price=225;globalThis.repeat={...r,id:100,week:11};globalThis.repeated=tourStopEstimate(r,[r,repeat])`);assert.ok(h.run('repeated.tickets<low.tickets'));
h.run(`s.empire.assets.push({kind:'Property',city:'austin',condition:100,tenant:null});globalThis.lodging=tourStopEstimate(r,[r]).lodging`);assert.ok(h.run('lodging<low.lodging'));
// Existing hometown survives relocation and NPC city identities are stable.
h.run(`migrateLivingWorld();globalThis.savedHome=s.careerWorld.hometown;globalThis.npc=s.world[0].hometown;relocateArtist('atlanta',true);migrateLivingWorld()`);assert.equal(h.run('s.careerWorld.hometown'),h.run('savedHome'));assert.equal(h.run('s.world[0].hometown'),h.run('npc'));
// An active venue upgrade requires setup funding and explicit confirmation.
const u=harness();await u.run('boot()');u.run(`migrateTouring();saveTourStop({preventDefault(){},target:{city:'austin',week:3,venue:0,price:35,vip:0,production:1,security:1,opener:''}});reviewWorldTour();confirmWorldTour();globalThis.stop=s.liveTour.route[0];globalThis.cash=s.cash;saveTourStop({preventDefault(){},target:{city:'austin',week:3,venue:3,price:225,vip:0,production:1,security:1,opener:''}},stop.id)`);assert.equal(u.run('stop.venue'),0);u.run('confirmTourStopUpgrade()');assert.equal(u.run('stop.venue'),3);assert.equal(u.run('cash-s.cash'),9995000);
u.run(`changeCash(-s.cash);s.week=3;settleWorldTour()`);assert.equal(u.run('s.liveTour.paused'),true);assert.equal(u.run('s.liveTour.played'),0);
u.run(`cancelWorldTour(true);globalThis.cash=s.cash;s.week++;settleWorldTour()`);assert.equal(u.run('s.cash'),u.run('cash'));assert.equal(u.run('s.liveTour.cancelled'),true);
// Legacy migration preserves paid costs, completed shows and past earnings exactly.
const l=harness();await l.run('boot()');l.run(`s.liveTour={id:44,name:'Legacy',venue:1,price:65,shows:24,completed:8,tickets:12000,gross:780000,production:350000,paused:false};migrateTouring()`);assert.equal(l.run('s.liveTour.route.length'),16);assert.equal(l.run('s.liveTour.gross'),780000);assert.equal(l.run('s.liveTour.production'),350000);assert.equal(l.run('s.liveTour.legacyCompleted'),8);l.run('validateBundle(saveBundle())');
l.run(`delete s.liveTour.version;s.liveTour.shows=2;s.liveTour.completed=1;s.liveTour.route=[{marketId:'houston',city:'Houston',status:'completed',gross:500},{marketId:'miami',city:'Miami',status:'scheduled'}];migrateTouring()`);assert.equal(l.run('s.liveTour.route[0].city'),'miami');assert.equal(l.run('s.liveTour.legacyRoute[0].gross'),500);
assert.throws(()=>l.run(`s.liveTour.route[0].price=-1;validateWorldTour()`));
// Opening gigs pay once and feed regional/global conservation.
const o=harness();await o.run('boot()');o.run(`migrateTouring();s.touring.offers=[{id:1,artist:0,city:'austin',fee:500,reach:1000,expires:5,done:false}];globalThis.cash=s.cash;acceptOpeningSlot(1,true);acceptOpeningSlot(1,true)`);assert.equal(o.run('s.cash-cash'),500);assert.equal(o.run('Object.values(s.careerWorld.markets).reduce((n,m)=>n+m.fans,0)'),o.run('s.fans'));
console.log('PASS Touring 2.0 route limits, deposits, weekly idempotence, costs, price/local demand, fatigue, lodging, relocation, upgrades, funding pause, cancellation, legacy migration, offers and save validation.');
