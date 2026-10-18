import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {harness} from './harness.mjs';
const h=harness('/sandbox',121);await h.run('boot()');
h.run('titleVisible=false;render()');
assert.match(h.run('home()'),/NEXT MOVE/);
assert.match(h.run('home()'),/encore-wordmark/);
assert.equal((h.run('navigationBar()').match(/<button /g)||[]).length,5);
assert.match(h.run("tab='Home';navigationBar()"),/nav-home[^]*aria-current="page"/);
const destinations=h.run('ENCORE_ICON_DESTINATIONS.map(x=>x[1])');
assert.equal(destinations.length,13);
for(const id of destinations){
 assert.doesNotThrow(()=>h.run(`encoreOpenIconDestination('${id}')`),id+' opens and renders');
 if(id==='Settings'){assert.ok(h.elements.modal.open);h.run("$('modal').close()");continue}
 assert.ok(String(h.elements.app?.innerHTML||'').length>200,id+' produced a rendered game screen');
 if(id==='Catalog'){
  assert.equal(h.run('tab'),'Career','Catalog route');
  assert.equal(h.run('careerTab'),'Deals','Catalog ownership hub');
  assert.equal(h.run('V109_dealsFocus'),'Catalog','Catalog intelligence focus');
  continue
 }
 const expected=id==='Home'?'Home':id==='Create'?'Create':id==='Industry'?'Industry':'Career';
 assert.equal(h.run('tab'),expected,id+' route');
 if(expected==='Career')assert.equal(h.run('careerTab'),id,id+' section');
}
for(const id of ['Agency','BusinessHQ','LegalAffairs']){
 const registered=id==='BusinessHQ'||h.run(`V096_BUSINESS_IDS.has('${id}')`);
 assert.equal(registered,true,id+' is owned by Business HQ navigation');
 h.run(`encoreOpenIconDestination('${id}')`);
 assert.equal(h.run('tab'),'Career');
 assert.equal(h.run('careerTab'),id);
 assert.ok(String(h.elements.app?.innerHTML||'').length>200,id+' renders through Business HQ');
}
for(const [id,expected] of [['Studio','Create'],['Charts','Industry'],['Home','Home'],['Business','Career'],['More','Menu']]){
 h.run(`V106_navGo('${id}')`);assert.equal(h.run('tab'),expected);assert.equal(h.run(`V106_navActive('${id}')`),true);
 assert.ok(String(h.elements.app?.innerHTML||'').length>200,id+' bottom-navigation destination renders');
}
const fullDirectory=h.run("V103_menuResults('')");
assert.match(fullDirectory,/encore-all-screens/);
assert.match(fullDirectory,/data-destination="CatalogMarket"/,'secondary catalog investment screen remains reachable from More');
assert.match(h.run("V103_menuResults('Stats')"),/data-destination="Stats"/);
assert.match(h.run("V103_menuResults('Legal Affairs')"),/data-destination="LegalAffairs"/);
for(const [label,id] of [['Studio','Create'],['Releases','Releases'],['Charts','Industry'],['PULSE','Social'],['Touring','Touring'],['Representation','Agency'],['Business HQ','BusinessHQ'],['Legal Affairs','LegalAffairs'],['Finance','Finances'],['Awards','Awards'],['Settings','Settings']]){
 const html=h.run(`V103_menuResults(${JSON.stringify(label)})`);
 assert.equal((html.match(new RegExp('data-destination="'+id+'"','g'))||[]).length,1,label+' is not duplicated in More');
}
assert.match(h.run("V103_menuResults('not-a-screen-xyz')"),/No matching destination/);
/* Visibility regression: icon glyphs must use direct currentColor paint, not
   fragment-linked url(#gradient) references that may disappear in iOS/WebKit
   after dynamic innerHTML replacement. */
for(const icon of ['Home','Studio','Charts','Pulse','Touring','Representation','Business','Legal','Catalog','Finance','Awards','Settings','More']){
 const svg=h.run(`encoreIcon('${icon}')`);
 assert.match(svg,/class="encore-icon"/);
 assert.match(svg,/fill="currentColor"/);
 assert.ok(/<(?:path|rect|circle|ellipse)\b/.test(svg),icon+' has a visible vector primitive');
 assert.ok(!/url\(#encore-gold-/.test(svg),icon+' does not depend on a fragment gradient');
}
const css=readFileSync(new URL('../src/icon-system.css',import.meta.url),'utf8');
for(const token of ['--encore-bg:#071119','--encore-gold:#f1cf7a','--encore-blue:#e2bf68','--encore-sage:#caa45a','--encore-lavender:#f0d98f'])assert.ok(css.includes(token),'missing cohesive palette token '+token);
assert.match(css,/\.encore-icon\{[^}]*fill:currentColor/,'icon CSS enforces currentColor paint');
console.log('Gold icon system: all 13 destinations render, icons use iPhone-safe currentColor paint, Business HQ routes stay authoritative, bottom navigation renders, More has no primary duplicates, secondary screens remain reachable, and the cohesive palette passed.');
