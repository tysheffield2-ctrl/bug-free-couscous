import './build.mjs';
import {mkdirSync,cpSync,readFileSync,writeFileSync} from 'node:fs';

const out='dist/raw-playtest';
const version=JSON.parse(readFileSync('package.json','utf8')).version;
mkdirSync(out,{recursive:true});
cpSync('public',out,{recursive:true});

const shim=`<script>(function(){
const nativeFetch=window.fetch.bind(window);
const isSandbox=new URLSearchParams(location.search).get('sandbox')==='1';
const mode=isSandbox?'sandbox':'career';
const saveKey='encore-raw-playtest-save-v1-'+mode;
const etagKey='encore-raw-playtest-etag-v1-'+mode;
function json(body,status=200,headers={}){return new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json',...headers}})}
window.fetch=async function(input,init={}){
  const raw=typeof input==='string'?input:(input&&input.url)||'';
  let url;try{url=new URL(raw,location.href)}catch{return nativeFetch(input,init)}
  if(url.origin===location.origin&&(url.pathname==='/api/save'||url.pathname==='/api/sandbox/save')){
    const method=String(init.method||'GET').toUpperCase();
    if(method==='GET'){
      let save=null;try{const x=localStorage.getItem(saveKey);save=x?JSON.parse(x):null}catch{}
      return json({save,etag:localStorage.getItem(etagKey)||null});
    }
    if(method==='PUT'){
      const current=localStorage.getItem(etagKey),headers=new Headers(init.headers||{});
      const match=headers.get('If-Match'),none=headers.get('If-None-Match');
      if((match&&current&&match!==current)||(none==='*'&&current))return json({error:'conflict'},409);
      let payload;try{payload=JSON.parse(init.body||'{}')}catch{return json({error:'bad json'},400)}
      const etag='pt-'+Date.now()+'-'+Math.random().toString(36).slice(2);
      localStorage.setItem(saveKey,JSON.stringify(payload));localStorage.setItem(etagKey,etag);
      return json({etag});
    }
  }
  if(url.origin===location.origin&&url.pathname.startsWith('/api/feedback'))return json({ok:true,playtest:true});
  return nativeFetch(input,init);
};
window.ENCORE_PLAYTEST_BUILD=true;
window.ENCORE_PLAYTEST_SANDBOX=isSandbox;
})();</script>`;

let html=readFileSync('dist/index.html','utf8');
html=html.replace('</head>',shim+'</head>');
html=html.replaceAll('src="/game.js"','src="./game.js"');
html=html.replaceAll("src='/game.js'","src='./game.js'");
html=html.replaceAll('href="/','href="./').replaceAll("href='/","href='./");
writeFileSync(out+'/index.html',html);

let game=readFileSync('dist/game.js','utf8');
game=game.replace("const SANDBOX=/^\\/(?:offline\\/)?sandbox(?:\\/|$)/.test(globalThis.location?.pathname||'');","const SANDBOX=(new URLSearchParams(globalThis.location?.search||'').get('sandbox')==='1')||/^\\/(?:offline\\/)?sandbox(?:\\/|$)/.test(globalThis.location?.pathname||'');");
game=game.replaceAll('"/art/','"./art/').replaceAll("'/art/","'./art/");
game=game.replaceAll('"/portraits/','"./portraits/').replaceAll("'/portraits/","'./portraits/");
writeFileSync(out+'/game.js',game);
writeFileSync(out+'/.nojekyll','');
writeFileSync(out+'/PLAYTEST.txt',[
  `ENCORE ${version} playtest`,
  'Career: https://raw.githack.com/tysheffield2-ctrl/bug-free-couscous/playtest-static/index.html',
  'Sandbox: https://raw.githack.com/tysheffield2-ctrl/bug-free-couscous/playtest-static/index.html?sandbox=1',
  'Saves stay in this browser and career/sandbox saves are isolated.',
  ''
].join('\n'));
console.log('Raw playtest ready: '+out+' · '+version);
