import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const modules=['core','career-systems','save-tools','beta'];
const js=modules.map(name=>readFileSync('src/'+name+'.js','utf8')).join('\n')+'\nboot();\n';writeFileSync('dist/game.js',js);
const html=readFileSync('dist/index.html','utf8');let worker=readFileSync('server/worker.mjs','utf8').replace('// __ASSETS__',()=> 'const HTML='+JSON.stringify(html)+';\nconst SCRIPT='+JSON.stringify(js)+';');worker=worker.replaceAll('__OFFLINE_VERSION__',createHash('sha256').update(html+js+worker).digest('hex').slice(0,12));mkdirSync('dist/server',{recursive:true});writeFileSync('dist/server/index.js',worker);
