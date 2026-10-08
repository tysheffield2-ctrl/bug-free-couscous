// Manual provenance tool. Tests consume frozen fixtures, never rebuild them with new code.
import {execFileSync} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {harness} from './harness.mjs';
const builds=[['v087','1e7c5fe12edbbbb6cb97a016787fc4d595a25437'],['regional-tour','2b9323182ceb91aa3c7cabb9875404896168934b']];
const folder=new URL('./fixtures/',import.meta.url);mkdirSync(folder,{recursive:true});const manifest=[];
for(const [name,commit] of builds){
 const original=execFileSync('git',['show',commit+':ENCORE/dist/game.js'],{maxBuffer:20000000,encoding:'utf8'}),source=original.replace(/boot\(\);\s*$/,'');
 for(const mode of ['career','sandbox']){
  const h=harness(mode==='sandbox'?'/sandbox':'/',31087,source);await h.run('boot()');
  h.run(`render=()=>{};weekRecap=()=>{};s.started=true;console.error=(...a)=>{throw Error(a.join(' '))}`);
  for(let i=0;i<12;i++){if(i%4===0)h.run(`changeCash(250);s.energy=200;newSong({preventDefault(){},target:{songtitle:'Historical song '+s.week,mood:'Personal / storytelling',package:'0'}});progressSong();progressSong();finishSong(true,true)`);h.run('advance(true)')}
  if(mode==='sandbox')h.run(`reviewWorldTour({preventDefault(){},target:{name:'Historical tour',venue:1,price:65,shows:24}});confirmWorldTour();settleWorldTour()`);
  const json=h.run('JSON.stringify(saveBundle())'),filename=name+'-'+mode+'.json.gz';
  writeFileSync(new URL(filename,folder),gzipSync(json));manifest.push({file:filename,commit,sourceSha256:createHash('sha256').update(original).digest('hex'),saveSha256:createHash('sha256').update(json).digest('hex'),mode,week:h.run('s.week')});
 }
}
writeFileSync(new URL('manifest.json',folder),JSON.stringify(manifest,null,2)+'\n');
console.log('Wrote four frozen fixtures from archived build code; not real player data.');
