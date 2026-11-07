import assert from 'node:assert/strict';
import fs from 'node:fs';
import '../build-raw-playtest.mjs';

const worker=fs.readFileSync('dist/index.html','utf8');
const staticHtml=fs.readFileSync('dist/raw-playtest/index.html','utf8');
for(const [name,markup] of [['Worker',worker],['GitHack',staticHtml]]){
 for(const asset of ['game.js','contract-engine.js','native-shell.js']){
  assert.equal(markup.split(asset+'"').length-1,1,name+' must load '+asset+' exactly once');
 }
 const positions=[markup.indexOf('game.js'),markup.indexOf('contract-engine.js'),markup.indexOf('native-shell.js')];
 assert.ok(positions[0]>=0&&positions[0]<positions[1]&&positions[1]<positions[2],name+' must load scripts in correct order');
}
assert.ok(worker.includes('src="/contract-engine.js"'),'Worker uses root static asset routes');
assert.ok(staticHtml.includes('src="./contract-engine.js"'),'GitHack must use a same-directory script');
assert.ok(!staticHtml.includes('src="/contract-engine.js"'),'GitHack must not use nonexistent root script');
assert.ok(!staticHtml.includes('src="/native-shell.js"'));
assert.ok(!staticHtml.includes('src="/game.js"'));
assert.ok(fs.statSync('dist/raw-playtest/contract-engine.js').size>1000);
assert.ok(fs.statSync('dist/raw-playtest/native-shell.js').size>1000);
const engine=fs.readFileSync('dist/raw-playtest/contract-engine.js','utf8');
const shell=fs.readFileSync('dist/raw-playtest/native-shell.js','utf8');
assert.match(engine,/function V145_state\(/,'Label Boss must be in static engine');
assert.match(engine,/function V144_mount\(/,'Contract signing must be in static engine');
assert.match(shell,/Label Boss/,'Shell must show Label Boss in More');
console.log('PASS GitHack/Worker script paths, single loads, engine ordering and Label Boss availability.');
