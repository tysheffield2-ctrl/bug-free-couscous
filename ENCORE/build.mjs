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
const audienceEngine=readFileSync('engine/audience.js','utf8');
const weekTransaction=readFileSync('engine/week-transaction.js','utf8');
const studioEngine=readFileSync('engine/studio.js','utf8');
const chartEngine=readFileSync('engine/charts.js','utf8');
const financeEngine=readFileSync('engine/finance.js','utf8');
const releasesEngine=readFileSync('engine/releases.js','utf8');
const weeklyEngine=readFileSync('engine/weekly.js','utf8');
const rosterNegotiationEngine=readFileSync('engine/roster-negotiation.js','utf8');
const sharedEngines=[releasesEngine,weeklyEngine,audienceEngine,weekTransaction,studioEngine,chartEngine,financeEngine,rosterNegotiationEngine].join('\n');

const modules=['artwork','name-generator','core','charts-engine-bridge','career-systems','save-tools','beta','experience','lab-editor','label-business','negotiations','social','wealth','commerce','empire','directory','presentation','asset-photos','market','conversations','industry-life','navigation','studio-life','guidance','collections','people-products','world-tours','v080','v080-polish','v080-fixes','v081-depth','v081-polish','v082-polish','industry-generations','v083-weekly','v083-fixes','weekly-engine','v084-portraits','v084-roster-weeklabel','v085-unique-portraits','v086-marketing','v086-fixes','v087-commercial-scale','v088-release-experience','career-world','audience-engine-bridge','career-world-navigation','career-world-routing','v090-studio','v090-contracts','v091-economy','v092-business-career','v092-fixes','v093-visual','v094-career-ui','v095-release-hype','v095-artist-file','v095-fixes','v096-business-hq-notifications','v096-fixes','v100-industry','v100-representation','v100-finance-contracts','finance-engine-bridge','v100-deals-labels','v100-label-competition','v100-touring','v100-career-parity','v100-sandbox-entry','v101-contract-document','roster-negotiation-engine-bridge','v102-roster-contract-gate','v102-negotiation-room','studio-engine-bridge','v103-home-shell','v103-artist-stats','v103-studio','v103-release-charts','v103-world','v103-business-recap','v103-shell-industry','v104-mobile-polish','v105-ui-compat','v106-showcase-fidelity','v106-portraits','v106-economy-ui'];
const staticArt=[];
function moduleSource(name){
 let source=readFileSync('src/'+name+'.js','utf8');
 if(['artwork','asset-photos'].includes(name))source=source.replace(/data:image\/(webp|png|jpeg);base64,([A-Za-z0-9+/=]+)/g,(_,type,data)=>{
  const bytes=Buffer.from(data,'base64'),file='/art/'+createHash('sha256').update(bytes).digest('hex').slice(0,16)+'.'+type;
  mkdirSync('public/art',{recursive:true});mkdirSync('dist/art',{recursive:true});writeFileSync('public'+file,bytes);writeFileSync('dist'+file,bytes);staticArt.push(file);return file;
 });
 return source;
}
let js='const ENCORE_RELEASE_NOTES='+JSON.stringify(releaseMeta)+';\n'+sharedEngines+'\n'+modules.map(moduleSource).join('\n')+'\nboot();\n';
js=js.replace("const GAME_VERSION='0.7.1-beta.1'",'const GAME_VERSION='+JSON.stringify(gameVersion));
writeFileSync('dist/game.js',js);
const weekWorker='(function(){\n'+readFileSync('engine/worker-host.js','utf8')+'\n'+js.replace(/boot\(\);\s*$/,'')+'\n'+readFileSync('engine/worker-entry.js','utf8')+'\n})();';
writeFileSync('dist/week-engine.js',weekWorker);

let html=readFileSync('dist/index.html','utf8');
html=html.replace(/<style id="encore-presentation">[\s\S]*?<\/style>/,'');
html=html.replace('<button class="primary" onclick="advance()">Advance month</button>','<button class="primary" onclick="advance()">Advance week</button>');
const css=['presentation','v080','v081','v082','v088','v090','v092','v093','v094','v095','v096','v100','v102','v103','v103-studio','v103-release-charts','v103-world','v103-business-recap','v103-shell-industry','v104-mobile-polish','v104-artist-dossier','v104-scene-polish','v106-showcase-fidelity','v106-portraits'].map(name=>readFileSync('src/'+name+'.css','utf8')).join('\n');
html=html.replace('</head>','<style id="encore-presentation">'+css+'</style></head>');
writeFileSync('dist/index.html',html);

const ui2Css=[readFileSync('ui2/ui2.css','utf8'),readFileSync('ui2/phase2.css','utf8'),readFileSync('ui2/phase3.css','utf8'),readFileSync('ui2/phase4.css','utf8'),readFileSync('ui2/phase5.css','utf8'),readFileSync('ui2/phase6-more.css','utf8'),readFileSync('ui2/phase7-polish.css','utf8'),readFileSync('ui2/phase8-career.css','utf8'),readFileSync('ui2/phase9-negotiation.css','utf8'),readFileSync('ui2/phase10-legacy.css','utf8')].join('\n');
const ui2Raw=[readFileSync('ui2/commands.js','utf8'),readFileSync('ui2/app-v2.js','utf8'),readFileSync('ui2/phase3.js','utf8'),readFileSync('ui2/studio-live.js','utf8'),readFileSync('ui2/phase6-more.js','utf8'),readFileSync('ui2/mode.js','utf8'),readFileSync('ui2/phase7-polish.js','utf8'),readFileSync('ui2/phase8-career.js','utf8'),readFileSync('ui2/phase9-negotiation.js','utf8'),readFileSync('ui2/phase10-legacy.js','utf8')].join('\n');
const ui2Bootstrap="globalThis.ENCORE_UI2_SAVE_URL=/\\/sandbox\\/?$/.test(location.pathname)?'/api/sandbox/save':'/api/save';\n";
const ui2Js=sharedEngines+'\n'+ui2Bootstrap+ui2Raw.replaceAll("fetch('/api/save'","fetch(globalThis.ENCORE_UI2_SAVE_URL||'/api/save'");
let ui2Html=readFileSync('ui2/index.html','utf8');
ui2Html=ui2Html.replace('/* __UI2_CSS__ */',()=>ui2Css).replace('/* __UI2_JS__ */',()=>ui2Js);
writeFileSync('dist/ui2.html',ui2Html);

let worker=readFileSync('server/worker.mjs','utf8').replaceAll('__STATIC_ART_ASSETS__',JSON.stringify([...new Set(staticArt)])).replace('// __ASSETS__',()=> 'const RELEASE='+JSON.stringify({version:gameVersion})+';\nconst HTML='+JSON.stringify(html)+';\nconst WEEK_WORKER='+JSON.stringify(weekWorker)+';\nconst SCRIPT='+JSON.stringify(js)+';\nconst UI2_HTML='+JSON.stringify(ui2Html)+';');
worker=worker.replaceAll('__OFFLINE_VERSION__',createHash('sha256').update(html+js+ui2Html+worker).digest('hex').slice(0,12));
mkdirSync('dist/server',{recursive:true});
writeFileSync('dist/server/index.js',worker);