import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';

const pkg=JSON.parse(readFileSync('package.json','utf8'));
const gameVersion=pkg.version;
const releaseTag=(gameVersion.match(/^\d+\.\d+\.\d+/)||[gameVersion])[0];
let releaseItems=[];
try{
 const md=readFileSync(`RELEASE-${releaseTag}.md`,'utf8');
 releaseItems=md.split(/\r?\n/).filter(line=>/^\s*[-*]\s+/.test(line)).map(line=>line.replace(/^\s*[-*]\s+/,'').trim()).filter(Boolean).slice(0,10)
}catch{}
if(!releaseItems.length)releaseItems=['Gameplay, presentation and stability improvements for this build.'];
const releaseMeta={version:gameVersion,items:releaseItems};

const modules=['artwork','name-generator','core','career-systems','save-tools','beta','experience','lab-editor','label-business','negotiations','social','wealth','commerce','empire','directory','presentation','asset-photos','market','conversations','industry-life','navigation','studio-life','guidance','collections','people-products','world-tours','v080','v080-polish','v080-fixes','v081-depth','v081-polish','v082-polish','v083-weekly','v083-fixes','weekly-engine','v084-portraits','v084-roster-weeklabel','v085-unique-portraits','v086-marketing','v086-fixes','v087-commercial-scale','v088-release-experience','career-world','career-world-navigation','career-world-routing','v090-studio','v090-contracts','v091-economy','v092-collabs','v092-merch-contracts','v092-awards-sports','v092-business','v092-fixes','v092-compat'];
const staticArt=[];
function moduleSource(name){
 let source=readFileSync('src/'+name+'.js','utf8');
 if(['artwork','asset-photos'].includes(name))source=source.replace(/data:image\/(webp|png|jpeg);base64,([A-Za-z0-9+/=]+)/g,(_,type,data)=>{
  const bytes=Buffer.from(data,'base64'),file='/art/'+createHash('sha256').update(bytes).digest('hex').slice(0,16)+'.'+type;
  mkdirSync('public/art',{recursive:true});mkdirSync('dist/art',{recursive:true});writeFileSync('public'+file,bytes);writeFileSync('dist'+file,bytes);staticArt.push(file);return file;
 });
 return source;
}
let js='const ENCORE_RELEASE_NOTES='+JSON.stringify(releaseMeta)+';\n'+modules.map(moduleSource).join('\n')+'\nboot();\n';
js=js.replace("const GAME_VERSION='0.7.1-beta.1'",'const GAME_VERSION='+JSON.stringify(gameVersion));
writeFileSync('dist/game.js',js);

let html=readFileSync('dist/index.html','utf8');
html=html.replace(/<style id="encore-presentation">[\s\S]*?<\/style>/,'');
html=html.replace('<button class="primary" onclick="advance()">Advance month</button>','<button class="primary" onclick="advance()">Advance week</button>');
const css=['presentation','v080','v081','v082','v088','v090','v092'].map(name=>readFileSync('src/'+name+'.css','utf8')).join('\n');
html=html.replace('</head>','<style id="encore-presentation">'+css+'</style></head>');
writeFileSync('dist/index.html',html);

let worker=readFileSync('server/worker.mjs','utf8').replaceAll('__STATIC_ART_ASSETS__',JSON.stringify([...new Set(staticArt)])).replace('// __ASSETS__',()=> 'const RELEASE='+JSON.stringify({version:gameVersion})+';\nconst HTML='+JSON.stringify(html)+';\nconst SCRIPT='+JSON.stringify(js)+';');
worker=worker.replaceAll('__OFFLINE_VERSION__',createHash('sha256').update(html+js+worker).digest('hex').slice(0,12));
mkdirSync('dist/server',{recursive:true});
writeFileSync('dist/server/index.js',worker);
