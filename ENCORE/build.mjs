import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const html=readFileSync('dist/index.html','utf8'),js=readFileSync('dist/game.js','utf8');let worker=readFileSync('server/worker.mjs','utf8').replace('// __ASSETS__',()=> 'const HTML='+JSON.stringify(html)+';\nconst SCRIPT='+JSON.stringify(js)+';');mkdirSync('dist/server',{recursive:true});writeFileSync('dist/server/index.js',worker);
