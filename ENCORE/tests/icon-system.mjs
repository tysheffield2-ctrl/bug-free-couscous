import assert from 'node:assert/strict';
import {harness} from './harness.mjs';
const h=harness('/sandbox',121);await h.run('boot()');
h.run('titleVisible=false;render()');
assert.match(h.run('home()'),/NEXT MOVE/);
assert.match(h.run('home()'),/encore-wordmark/);
assert.equal((h.run('navigationBar()').match(/<button /g)||[]).length,5);
assert.match(h.run("tab='Home';navigationBar()"),/nav-home[^]*aria-current="page"/);
const destinations=h.run('ENCORE_ICON_DESTINATIONS.map(x=>x[1])');
for(const id of destinations){
 assert.doesNotThrow(()=>h.run(`encoreOpenIconDestination('${id}')`),id+' opens');
 if(id==='Settings'){assert.ok(h.elements.modal.open);h.run("$('modal').close()");continue}
 const expected=id==='Home'?'Home':id==='Create'?'Create':id==='Industry'?'Industry':'Career';
 assert.equal(h.run('tab'),expected,id+' route');
 if(expected==='Career')assert.equal(h.run('careerTab'),id,id+' section');
}
for(const [id,expected] of [['Studio','Create'],['Charts','Industry'],['Home','Home'],['Business','Career'],['More','Menu']]){
 h.run(`V106_navGo('${id}')`);assert.equal(h.run('tab'),expected);assert.equal(h.run(`V106_navActive('${id}')`),true);
}
assert.match(h.run("V103_menuResults('Stats')"),/data-destination="Stats"/);
assert.match(h.run("V103_menuResults('Legal Affairs')"),/data-destination="LegalAffairs"/);
assert.match(h.run("V103_menuResults('not-a-screen-xyz')"),/No matching destination/);
const icons=h.run("encoreIcon('Home')+encoreIcon('Home')");
const ids=[...icons.matchAll(/id="(encore-gold-\d+)"/g)].map(x=>x[1]);assert.equal(new Set(ids).size,2);
console.log('Gold icon system: all 13 destinations, bottom navigation, search, and Home passed.');
