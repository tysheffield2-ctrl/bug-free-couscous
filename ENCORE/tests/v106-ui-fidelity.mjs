import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const css=fs.readFileSync(new URL('../src/v106-showcase-fidelity.css',import.meta.url),'utf8');
assert.match(css,/z-index:10000!important/);
assert.match(css,/body nav:before\{display:none!important/);
assert.match(css,/v106-negotiation-scene/);
assert.match(css,/v106-label-kpis/);

const h=harness('/sandbox',424242);await h.run('boot()');
const nav=h.run('navigationBar()');
for(const label of ['Studio','Charts','Home','Business','More'])assert.ok(nav.includes('>'+label+'</span>'),`missing ${label} bottom-nav destination`);
assert.equal(nav.includes('ALL ACCESS'),false);

assert.ok(h.run("personPhoto('artist-0','Mira Wells',true).includes('/portraits/artists/artist-01.webp')"));

h.run("migrateLabelBusiness();s.labelBusiness.company={name:'Coulda Been Records',started:s.week,staff:{manager:false,marketing:false,ar:false},contracts:[],receipts:525430000,last:{week:s.week-1,recording:17690000,other:0,income:17690000,payroll:4000},preparedWeek:0,settledWeek:0}");
const company=h.run('companyPage()');
assert.ok(company.includes('Total label revenue'));
assert.ok(company.includes('Last week operating profit'));
assert.ok(company.includes('OWNED LABEL — ROSTER REVENUE'));
assert.equal(company.includes('Total label receipts'),false);
assert.equal(company.includes('Last week receipts'),false);

h.run('render()');
assert.equal(h.elements['weekly-cost'].textContent,'Explicit operating costs · taxes tracked');

const finances=h.run('financeScreen()');
assert.ok(finances.includes('Weekly operating costs'));
assert.equal(finances.includes('Career overhead'),false);

console.log('PASS ENCORE v1.06 mockup navigation, mobile stacking contract, real core portrait, revenue terminology and stale-overhead UI cleanup.');
