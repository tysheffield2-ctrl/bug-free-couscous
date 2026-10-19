import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {harness} from './harness.mjs';

const source=readFileSync(new URL('../src/v122-catalog-request-ux.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/v122-catalog-request-ux.css',import.meta.url),'utf8');
const build=readFileSync(new URL('../build.mjs',import.meta.url),'utf8');
const h=harness('/sandbox',122);await h.run('boot()');h.run('titleVisible=false;render()');

/* Catalog is now a dedicated first-class destination, while Catalog Market stays
   separate for buying other artists' interests. */
assert.equal(h.run("ENCORE_ICON_DESTINATIONS.find(x=>x[3]==='Catalog')[0]"),'Catalog Valuation');
assert.equal(h.run("ENCORE_ICON_DESTINATIONS.find(x=>x[3]==='Catalog')[1]"),'CatalogValuation');
h.run("encoreOpenIconDestination('CatalogValuation')");
assert.equal(h.run('tab'),'Career');
assert.equal(h.run('careerTab'),'CatalogValuation');
const catalog=h.run('V122_catalogValuationPage()');
assert.match(catalog,/Catalog valuation/i);
assert.match(catalog,/ESTIMATED CATALOG VALUE/);
assert.match(catalog,/YOUR ECONOMIC INTEREST/);
assert.match(catalog,/VALUATION HISTORY/);
assert.match(catalog,/VALUE DRIVERS/);
assert.doesNotMatch(catalog,/Incoming label offers/i,'valuation screen must not mix label offers into catalog intelligence');
assert.match(h.run("V103_menuResults('Catalog Valuation')"),/data-destination="CatalogValuation"/);
assert.match(h.run("V103_menuResults('Catalog Market')"),/data-destination="CatalogMarket"/,'external catalog investing remains separate');
h.run("V109_setDealsFocus('Catalog')");
assert.equal(h.run('careerTab'),'CatalogValuation','legacy Business HQ catalog link redirects to dedicated valuation screen');

/* Exact Artist Relations service briefings can be decided in the popup. */
h.run(`migrateLabelBusiness();s.labelBusiness.company={name:'Test House',started:s.week,staff:{manager:false,marketing:false,ar:false},contracts:[],receipts:0,last:null,preparedWeek:0,settledWeek:0};const lc=V100_labelCompetition();lc.inbound=[{id:'service-test',type:'distribution',name:'Distribution services',detail:'Release administration and distribution support',artist:0,fee:73878,weeks:13,share:.12,expires:s.week+6,status:'open'}]`);
h.run("V122_openLabelServiceRequest('service-test')");
let modal=String(h.elements.modal.innerHTML||'');
assert.match(modal,/Distribution services/);assert.match(modal,/\$73,878/);assert.match(modal,/Review the full request here/);assert.match(modal,/Decline/);assert.match(modal,/Accept Distribution services/);
const serviceBriefingButton=h.run("offerBriefingButton({id:'label-service:service-test'})");
assert.match(serviceBriefingButton,/V122_openLabelServiceRequest/);assert.doesNotMatch(serviceBriefingButton,/go\('Career'\)|openDestination\(/);
h.run("$('modal').close()");

/* Creative and tour priority requests stay in modal context instead of navigating. */
h.run(`migrateV081();s.v081.creative.offers=[{id:321,type:'produce',artist:0,name:s.world[0].name,quality:78,fee:4200,status:'open',createdWeek:s.week}]`);
h.run("V096_openPriority('creative:321')");
modal=String(h.elements.modal.innerHTML||'');assert.match(modal,/ARTIST REQUEST/);assert.match(modal,/Production request/);assert.match(modal,/Everything needed to decide is kept in this popup/);assert.equal(h.run('careerTab')==='Creative',false,'reviewing a creative request does not transfer to Creative Network');
h.run("$('modal').close();migrateTouring();s.touring.offers=[{id:654,artist:0,city:regionalMarkets[0].id,fee:9000,reach:12000,expires:s.week+5,done:false,createdWeek:s.week}]");
h.run("V096_openPriority('tour:654')");
modal=String(h.elements.modal.innerHTML||'');assert.match(modal,/TOUR INVITATION/);assert.match(modal,/Guaranteed fee/);assert.match(modal,/Review the invitation here/);assert.equal(h.run('careerTab')==='Touring',false,'reviewing a tour request does not transfer to Touring');

/* The legal-reading sheet must never fall back to bright paper. */
assert.match(css,/\.legal-sheet\{[^}]*background:#07090b!important/);
assert.match(css,/\.legal-sheet\{[^}]*color:#e5c976!important/);
assert.match(css,/\.legal-counsel-note\{[^}]*background:#15120b!important/);
assert.ok(build.includes("'v122-catalog-request-ux'"),'new UX module is included in build');
assert.ok(build.includes("'v122-catalog-request-ux'").toString());
assert.ok(source.includes("b?.id?.startsWith('label-service:')"));
assert.ok(source.includes("item.kind==='creative'||item.kind==='tour'"));
console.log('PASS Catalog Valuation is dedicated and icon-routed, artist service/creative/tour requests review in-place, and legal documents use black/gold surfaces.');
