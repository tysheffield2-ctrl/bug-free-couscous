import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',140002);await h.run('boot()');
const shell=fs.readFileSync(new URL('../dist/native-shell.js',import.meta.url),'utf8');h.run(shell);h.run('V137_installShell()');
h.run(`s.started=true;s.labelBusiness={offers:[],auditions:{},lastScouted:0,company:{name:'Northline Records',started:1,staff:{manager:true,marketing:true,ar:true},contracts:[],receipts:250000,last:null,preparedWeek:0,settledWeek:0}};careerTab='Labels';tab='Career';`);
const html=h.run('career()');
assert.match(html,/v140-label-suite/,'live Career → Labels route must contain the new record-company suite');
console.log('PASS v140 live Label HQ route reaches the cohesive record-company suite.');
