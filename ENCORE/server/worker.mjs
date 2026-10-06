// __ASSETS__
const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
const json=(data,status=200,extra={})=>new Response(JSON.stringify(data),{status,headers:{...headers,'Content-Type':'application/json',...extra}});
const text=(value,max)=>String(value??'').trim().slice(0,max);

export default {
  async fetch(request,env){
    const url=new URL(request.url);
    const offlineAsset=offlineAssets(url.pathname);
    if(offlineAsset&&['GET','HEAD'].includes(request.method))return new Response(request.method==='HEAD'?null:offlineAsset.body,{headers:{...headers,'Content-Type':offlineAsset.type,...(url.pathname==='/sw.js'?{'Service-Worker-Allowed':'/'}:{})}});

    if(url.pathname==='/api/feedback'){
      if(request.method!=='POST')return json({error:'Method not allowed'},405);
      if(request.headers.get('Origin')!==url.origin)return json({error:'Origin not allowed'},403);
      if(!request.headers.get('Content-Type')?.includes('application/json'))return json({error:'JSON required'},415);
      try{
        if(!env.BUCKET)return json({error:'Feedback temporarily unavailable'},503);
        const raw=await request.text();
        if(raw.length>20000)return json({error:'Feedback too large'},413);
        let input;try{input=JSON.parse(raw)}catch{return json({error:'Invalid JSON'},400)}
        const summary=text(input.summary,2000);
        if(!summary)return json({error:'Tell us what happened first'},400);
        const now=new Date();
        const id=crypto.randomUUID();
        const record={
          id,
          receivedAt:now.toISOString(),
          version:text(input.version,60)||'unknown',
          kind:text(input.kind,60)||'Feedback',
          summary,
          steps:text(input.steps,2000),
          expected:text(input.expected,1000),
          contact:text(input.contact,254),
          mode:text(input.mode,80),
          week:text(input.week,40),
          screen:text(input.screen,120),
          saveStatus:text(input.saveStatus,80),
          device:text(input.device,500)
        };
        const key=`feedback/${now.toISOString().slice(0,10)}/${now.getTime()}-${id}.json`;
        await env.BUCKET.put(key,JSON.stringify(record),{httpMetadata:{contentType:'application/json'}});
        let emailed=false;
        if(env.EMAIL){
          try{
            const lines=[
              'ENCORE BETA FEEDBACK',
              `ID: ${record.id}`,
              `Received: ${record.receivedAt}`,
              `Version: ${record.version}`,
              `Type: ${record.kind}`,
              `Mode: ${record.mode||'Not provided'}`,
              `Week: ${record.week||'Not provided'}`,
              `Screen: ${record.screen||'Not provided'}`,
              `Save: ${record.saveStatus||'Not provided'}`,
              `Contact: ${record.contact||'Not provided'}`,
              `Device/browser: ${record.device||'Not provided'}`,
              '',
              'What happened:',
              record.summary,
              '',
              'Steps to reproduce:',
              record.steps||'Not provided',
              '',
              'Expected:',
              record.expected||'Not provided'
            ];
            await env.EMAIL.send({
              to:env.FEEDBACK_TO||undefined,
              from:env.FEEDBACK_FROM||'feedback@encoremusicsim.com',
              subject:`ENCORE Beta Feedback — ${record.kind}`,
              text:lines.join('\n'),
              replyTo:record.contact||undefined
            });
            emailed=true;
          }catch(error){
            console.error('Feedback email failed',error?.code||'',error?.message||error);
          }
        }
        return json({ok:true,id,emailed});
      }catch(error){
        console.error('Feedback request failed',error);
        return json({error:'Feedback temporarily unavailable'},503);
      }
    }

    if(url.pathname==='/api/save'||url.pathname==='/api/sandbox/save'){
      const lab=url.pathname==='/api/sandbox/save',cookieName=lab?'encore_lab':'encore_guest',prefix=lab?'sandbox/':'careers/';
      try{
        if(!env.BUCKET)return json({error:'Saving temporarily unavailable'},503);
        let id=request.headers.get('Cookie')?.match(new RegExp('(?:^|; )'+cookieName+'=([a-f0-9]{64})(?:;|$)'))?.[1];
        if(request.method==='GET'){
          if(!id){
            id=Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');
            return json({save:null,etag:null},200,{'Set-Cookie':`${cookieName}=${id}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`})
          }
          const object=await env.BUCKET.get(prefix+id);
          return json({save:object?await object.json():null,etag:object?.httpEtag??null})
        }
        if(request.method!=='PUT')return json({error:'Method not allowed'},405);
        if(!id)return json({error:'Open the game first'},401);
        if(request.headers.get('Origin')!==url.origin)return json({error:'Origin not allowed'},403);
        if(!request.headers.get('Content-Type')?.includes('application/json'))return json({error:'JSON required'},415);
        const raw=await request.text();
        if(raw.length>8500000)return json({error:'Save too large'},413);
        let save;try{save=JSON.parse(raw)}catch{return json({error:'Invalid JSON'},400)}
        if(save.schemaVersion!==1||!save.state||!Number.isInteger(save.state.week)||!Array.isArray(save.state.songs)||!Array.isArray(save.state.world))return json({error:'Invalid career'},400);
        if(!!save.state.sandbox!==lab)return json({error:'Wrong game mode'},400);
        const conditions=new Headers();
        if(request.headers.has('If-Match'))conditions.set('If-Match',request.headers.get('If-Match'));
        else if(request.headers.get('If-None-Match')==='*')conditions.set('If-None-Match','*');
        else return json({error:'Save revision required'},428);
        save.savedAt=new Date().toISOString();
        const saved=await env.BUCKET.put(prefix+id,JSON.stringify(save),{onlyIf:conditions,httpMetadata:{contentType:'application/json'}});
        if(!saved)return json({error:'Another tab updated this career'},409);
        return json({etag:saved.httpEtag,savedAt:save.savedAt})
      }catch(error){
        console.error('Career save request failed',error);
        return json({error:'Save service temporarily unavailable'},503)
      }
    }

    if(request.method!=='GET'&&request.method!=='HEAD')return new Response('Method not allowed',{status:405});
    const asset=url.pathname==='/game.js'?SCRIPT:url.pathname==='/'||url.pathname==='/index.html'||url.pathname==='/sandbox'||url.pathname==='/sandbox/'||['/offline','/offline/','/offline/sandbox','/offline/sandbox/'].includes(url.pathname)?HTML:null;
    if(asset===null)return new Response('Not found',{status:404});
    return new Response(request.method==='HEAD'?null:asset,{headers:{...headers,'Content-Type':url.pathname==='/game.js'?'text/javascript; charset=utf-8':'text/html; charset=utf-8'}})
  }
};

function offlineAssets(path){
  if(path==='/manifest.webmanifest')return {type:'application/manifest+json',body:JSON.stringify({id:'/offline',name:'ENCORE Offline',short_name:'ENCORE',start_url:'/offline',scope:'/',display:'standalone',background_color:'#101114',theme_color:'#101114',icons:[{src:'/offline-icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any'}]})};
  if(path==='/offline-icon.svg')return {type:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" rx="36" fill="#101114"/><text x="96" y="140" text-anchor="middle" font-family="Georgia,serif" font-size="140" font-weight="bold" fill="#d5fb70">E</text></svg>'};
  if(path==='/sw.js')return {type:'text/javascript; charset=utf-8',body:`const CACHE='encore-offline-__OFFLINE_VERSION__';const ASSETS=['/offline','/offline/','/offline/sandbox','/offline/sandbox/','/game.js','/manifest.webmanifest','/offline-icon.svg','/portraits/core-atlas.webp'];self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('encore-offline-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin||!ASSETS.includes(u.pathname))return;e.respondWith(caches.open(CACHE).then(async c=>{const hit=await c.match(u.pathname);return hit||fetch(e.request)}))});self.addEventListener('message',e=>{if(e.data?.type==='CHECK_OFFLINE')e.waitUntil(caches.open(CACHE).then(async c=>{const files=await Promise.all(ASSETS.map(p=>c.match(p)));e.ports[0]?.postMessage({ready:files.every(Boolean)})}))});`};
  return null
}

