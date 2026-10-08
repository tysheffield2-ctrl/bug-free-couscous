// Pages advanced-mode package. Source uses the same server and bindings as Workers.
import {mkdirSync,copyFileSync,cpSync,writeFileSync,readFileSync} from 'node:fs';
mkdirSync('dist/pages',{recursive:true});
copyFileSync('dist/server/index.js','dist/pages/_worker.js');
cpSync('public','dist/pages',{recursive:true});
writeFileSync('dist/pages/_routes.json',JSON.stringify({version:1,include:['/*'],exclude:['/art/*','/portraits/*']},null,2)+'\n');
const pkg=JSON.parse(readFileSync('package.json'));
console.log('Pages package ready: dist/pages — '+pkg.version+'. Preserve the existing BUCKET binding.');
