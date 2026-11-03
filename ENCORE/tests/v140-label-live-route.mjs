import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',140002);await h.run('boot()');
const shell=fs.readFileSync(new URL('../dist/native-shell.js',import.meta.url),'utf8');h.run(shell);h.run('V137_installShell()');
h.run(`s.started=true;s.labelBusiness={offers:[],auditions:{},lastScouted:0,company:{name:'Northline Records',started:1,staff:{manager:true,marketing:true,ar:true},contracts:[],receipts:250000,last:null,preparedWeek:0,settledWeek:0}};careerTab='Labels';tab='Career';`);
const html=h.run('career()');
assert.match(html,/v140-label-suite/,'live Career → Labels route must contain the new record-company suite');
assert.ok(!html.includes('Your artist deal'),'owned Label HQ must not prepend the legacy label-deal card above the new suite');
assert.ok(!html.includes('Pitch a label'),'owned Label HQ must not expose the pre-ownership pitch UI');
console.log('PASS v140 live Label HQ route is the cohesive record-company suite without the legacy wrapper.');
