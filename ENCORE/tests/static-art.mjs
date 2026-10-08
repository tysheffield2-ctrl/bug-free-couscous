import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
const built=readFileSync('dist/game.js','utf8'),worker=readFileSync('dist/server/index.js','utf8');
let count=0;
for(const file of ['artwork','asset-photos']){
 for(const [,type,data] of readFileSync('src/'+file+'.js','utf8').matchAll(/data:image\/(webp|png|jpeg);base64,([A-Za-z0-9+/=]+)/g)){
  const bytes=Buffer.from(data,'base64'),path='/art/'+createHash('sha256').update(bytes).digest('hex').slice(0,16)+'.'+type;
  assert.ok(existsSync('public'+path));assert.deepEqual(readFileSync('public'+path),bytes);assert.deepEqual(readFileSync('dist'+path),bytes);assert.ok(built.includes(path));assert.ok(worker.includes(path));assert.equal(built.includes(data),false);count++;
 }
}
assert.equal(count,12);assert.equal(worker.includes('__STATIC_ART_ASSETS__'),false);
const {default:handler}=await import('../dist/server/index.js');
const response=await handler.fetch(new Request('https://encore.test/art/example.webp'),{ASSETS:{fetch:()=>new Response('asset')}});
assert.equal(await response.text(),'asset');
const sw=await handler.fetch(new Request('https://encore.test/sw.js'),{});assert.ok((await sw.text()).includes('/art/'));
console.log(`PASS ${count} byte-identical external artwork assets, Worker routing and offline cache manifest.`);
