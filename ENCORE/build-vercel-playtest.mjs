import './build.mjs';
import {mkdirSync,cpSync,copyFileSync,readFileSync,writeFileSync} from 'node:fs';

const out='dist/vercel-playtest';
mkdirSync(out,{recursive:true});
cpSync('public',out,{recursive:true});
copyFileSync('dist/game.js',out+'/game.js');

const shim=`<script>(function(){
const nativeFetch=window.fetch.bind(window);
const mode=location.pathname.includes('/sandbox')?'sandbox':'career';
const saveKey='encore-playtest-save-v1-'+mode;
const etagKey='encore-playtest-etag-v1-'+mode;
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
      let current=localStorage.getItem(etagKey),headers=new Headers(init.headers||{});
      const match=headers.get('If-Match'),none=headers.get('If-None-Match');
      if((match&&current&&match!==current)||(none==='*'&&current))return json({error:'conflict'},409);
      let payload;try{payload=JSON.parse(init.body||'{}')}catch{return json({error:'bad json'},400)}
      const etag='pt-'+Date.now()+'-'+Math.random().toString(36).slice(2);
      localStorage.setItem(saveKey,JSON.stringify(payload));localStorage.setItem(etagKey,etag);
      return json({etag});
    }
  }
  if(url.origin===location.origin&&url.pathname.startsWith('/api/feedback')){
    if(String(init.method||'GET').toUpperCase()==='POST'){
      try{const log=JSON.parse(localStorage.getItem('encore-playtest-feedback')||'[]');log.push({at:new Date().toISOString(),body:init.body||null});localStorage.setItem('encore-playtest-feedback',JSON.stringify(log.slice(-50)))}catch{}
      return json({ok:true,playtest:true});
    }
  }
  return nativeFetch(input,init);
};
window.ENCORE_PLAYTEST_BUILD=true;
})();</script>`;

let html=readFileSync('dist/index.html','utf8');
html=html.replace('</head>',shim+'</head>');
writeFileSync(out+'/index.html',html);

// Preserve normal, sandbox and explicit preview routes on a static host.
for(const route of ['sandbox','legacy','offline','ui2','preview-ui2']){
  mkdirSync(out+'/'+route,{recursive:true});
  copyFileSync(out+'/index.html',out+'/'+route+'/index.html');
}

writeFileSync(out+'/PLAYTEST.txt','ENCORE playtest build. Saves are isolated to this browser via localStorage.\n');
console.log('Vercel playtest ready: '+out);
