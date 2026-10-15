import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const js=readFileSync('src/v109-business-navigation.js','utf8');
const css=readFileSync('src/v109-business-navigation.css','utf8');

assert.doesNotThrow(()=>new Function(js),'v109 business navigation source should parse');
assert.match(js,/function V109_businessPage\(/,'focused Business HQ renderer should exist');
assert.match(js,/V109_HQ_GROUPS/,'Business HQ should group departments instead of rendering one long directory');
assert.match(js,/V109_openBusinessDirectory/,'compact full-directory escape hatch should exist');
assert.match(js,/V096_businessSubnav=function\(id\)/,'business child navigation should be reduced to breadcrumb + section menu');
assert.match(js,/function V109_dealsPage\(/,'Contracts & rights should have its own focused hub');
assert.match(js,/\['Overview','Overview'\].*\['Agreements','Agreements'\].*\['Rights','Rights'\].*\['Catalog','Catalog intelligence'\]/s,'deal room should expose focused sections');
assert.match(js,/function V109_openOpportunityAgreement\(/,'career opportunities should open a formal agreement');
assert.match(js,/V108_mountStandardContract/,'opportunity agreements should use the same legal document renderer as artist signings');
assert.match(js,/Rights & Ownership/,'opportunity agreement should explicitly define rights and ownership');
assert.match(js,/acceptOpportunity=function\(id,confirmed=false\)/,'legacy opportunity review should be routed into the full agreement experience');
assert.match(css,/\.v109-hq-tabs/,'focused HQ navigation should be styled');
assert.match(css,/\.v109-deals-tabs/,'focused contracts navigation should be styled');
assert.match(css,/@media\(max-width:760px\)/,'mobile layout should be explicitly handled');

console.log('v109 business navigation checks passed');
