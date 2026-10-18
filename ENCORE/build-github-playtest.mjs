import './build.mjs';
import {mkdirSync,cpSync,copyFileSync,readFileSync,writeFileSync} from 'node:fs';

const out='dist/github-playtest';
const base='/bug-free-couscous/';
mkdirSync(out,{recursive:true});
cpSync('public',out,{recursive:true});

const shim=`<script>(function(){
const nativeFetch=window.fetch.bind(window);
const mode=location.pathname.includes('/sandbox')?'sandbox':'career';
const saveKey='encore-gh-playtest-save-v1-'+mode;
const etagKey='encore-gh-playtest-etag-v1-'+mode;
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
      const etag='ghpt-'+Date.now()+'-'+Math.random().toString(36).slice(2);
      localStorage.setItem(saveKey,JSON.stringify(payload));localStorage.setItem(etagKey,etag);
      return json({etag});
    }
  }
  if(url.origin===location.origin&&url.pathname.startsWith('/api/feedback'))return json({ok:true,playtest:true});
  return nativeFetch(input,init);
};
window.ENCORE_PLAYTEST_BUILD=true;
})();</script>`;

let html=readFileSync('dist/index.html','utf8');
html=html.replace('</head>',shim+'</head>');
html=html.replaceAll('href="/','href="'+base).replaceAll("href='/","href='"+base).replaceAll('src="/','src="'+base).replaceAll("src='/","src='"+base);
writeFileSync(out+'/index.html',html);

let game=readFileSync('dist/game.js','utf8');
game=game.replace("const SANDBOX=/^\\/(?:offline\\/)?sandbox(?:\\/|$)/.test(globalThis.location?.pathname||'');","const SANDBOX=/(?:^|\\/)(?:offline\\/)?sandbox(?:\\/|$)/.test(globalThis.location?.pathname||'');");
game=game.replace("const OFFLINE=/^\\/offline(?:\\/|$)/.test(globalThis.location?.pathname||'');","const OFFLINE=/(?:^|\\/)offline(?:\\/|$)/.test(globalThis.location?.pathname||'');");
for(const p of ['art','portraits']){
  game=game.replaceAll('"/'+p+'/','"'+base+p+'/').replaceAll("'/"+p+"/","'"+base+p+'/');
}
writeFileSync(out+'/game.js',game);

for(const route of ['sandbox','legacy','offline']){
  mkdirSync(out+'/'+route,{recursive:true});
  copyFileSync(out+'/index.html',out+'/'+route+'/index.html');
}
writeFileSync(out+'/.nojekyll','');
writeFileSync(out+'/PLAYTEST.txt','ENCORE GitHub Pages playtest. Saves are isolated to this browser via localStorage.\n');
console.log('GitHub Pages playtest ready: '+out);
