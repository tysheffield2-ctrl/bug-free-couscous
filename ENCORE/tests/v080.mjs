import vm from 'node:vm';import fs from 'node:fs';import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8').replace(/boot\(\);\s*$/,'');
function harness(path='/sandbox'){const elements={},storage=new Map(),events={};let stored=null;const c={console,location:{pathname:path},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{getElementById(id){return elements[id]??=({innerHTML:'',textContent:'',hidden:false,open:false,showModal(){this.open=true},close(){this.open=false}})},addEventListener(){},querySelectorAll(){return[]}},window:{scrollTo(){},addEventListener(k,fn){events[k]=fn}},setTimeout(){return 1},clearTimeout(){},fetch:async(u,o={})=>({ok:true,status:200,json:async()=>o.method==='PUT'?(stored=JSON.parse(o.body),{etag:'test'}):({save:stored,etag:stored?'test':null})}),FormData:class{constructor(v){this.v=v}get(k){return this.v[k]??null}getAll(k){return this.v[k]||[]}}};vm.createContext(c);vm.runInContext(source,c);return {run:x=>vm.runInContext(x,c),c,elements}}
const h=harness();await h.run('boot()');
assert.equal(h.run('GAME_VERSION'),'0.8.2-beta.1');
h.run('migrateV080()');assert.equal(h.run('s.v080.version'),1);
assert.ok(h.run("navigationTools().includes('Inbox')"));assert.ok(h.run("menuResults('catalog').includes('Catalog Market')"));assert.ok(h.run("guideResults('offers').includes('Offers Center')"));
// New label offers are protected until first review.
h.run("s.labelBusiness.offers=[];createLabelOffer(0,'Regression test');globalThis.labelOffer=s.labelBusiness.offers[0]");assert.equal(h.run('labelOffer.expires'),Number.MAX_SAFE_INTEGER);assert.equal(h.run('labelOffer.reviewedMonth'),null);h.run("reviewArtistOffer(labelOffer.id)");assert.ok(h.run('labelOffer.expires<Number.MAX_SAFE_INTEGER&&labelOffer.expires>s.week'));
// Commercial scale includes rare lifetime icon deals and starts protected.
h.run('s.fans=80000000;s.reputation=95;s.social.followers=120000000;s.expansion.awardWins=5;s.empire.month=10;s.v080.commercial.lastGeneratedMonth=-1;generateCommercialOffers080()');assert.ok(h.run("s.v080.commercial.offers.some(o=>o.category==='lifetime'&&o.totalValue>=250000000)"));h.run("globalThis.mega=s.v080.commercial.offers.find(o=>o.category==='lifetime')");assert.equal(h.run('mega.expires'),Number.MAX_SAFE_INTEGER);h.run('reviewCommercialOffer080(mega.id)');assert.ok(h.run('mega.expires<Number.MAX_SAFE_INTEGER'));
// Catalog holdings can be bought, pay distributions, change value and be sold.
h.run('s.cash=1e12;s.energy=200;globalThis.cashBefore=s.cash;V080_confirmCatalogPurchase(1,.1)');assert.equal(h.run('s.v080.catalog.holdings.length'),1);assert.ok(h.run('s.cash<cashBefore'));h.run('globalThis.afterBuy=s.cash;settleCatalogHoldings080()');assert.ok(h.run('s.cash>afterBuy'));h.run('globalThis.hid=s.v080.catalog.holdings[0].id;V080_sellCatalog(hid,true)');assert.equal(h.run('s.v080.catalog.holdings.length'),0);
// Six visual merch looks persist and validate.
h.run("s.cash=1e9;s.energy=200;createMerch({preventDefault(){},target:{qty:'10',price:'40',look:'5'}},'tee');confirmMerch()");assert.equal(h.run('s.empire.merch.at(-1).look'),5);h.run('validateBundle(saveBundle())');
// Expanded rotating asset market and procedural people art.
assert.ok(h.run('currentDrops().length>=6'));assert.ok(h.run("personPhoto('artist-99','Test Artist').includes('data:image/svg+xml')"));
// Awards are a distinct annual system and not the Achievement page.
h.run('s.week=52;annualAwards080()');assert.equal(h.run('s.v080.awards.ceremonies.length'),1);assert.ok(h.run("V080_awardsPage().includes('THE ENCORE')"));assert.ok(h.run("V080_achievementsPage().includes('Achievements are game challenges only')"));
// 360 deals include media income but do not touch outside investments.
h.run("s.expansion.contract={type:'360',share:.2,catalogReleased:false};s.finance.week={wages:0,live:0,media:1000,expenses:0,investment:5000,albumSales:0};globalThis.cut=artistLabelCut(0)");assert.equal(h.run('cut'),200);
console.log('PASS ENCORE 0.8 protected offers, commercial scale, catalog ownership, merch looks, rotating assets, awards separation, procedural people art and 360 media accounting.');
