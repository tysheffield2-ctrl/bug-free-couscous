/* Reproduces actual GitHack repository subpath. Root-relative JS files MUST 404. */
const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),assert=require('node:assert/strict');
const root=process.cwd()+'/dist/raw-playtest';
const prefix='/tysheffield2-ctrl/bug-free-couscous/playtest-static/';
const server=http.createServer((req,res)=>{
 const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(!path.startsWith(prefix)){res.writeHead(404);res.end('No root assets');return}
 let local=path.slice(prefix.length);if(!local||local.endsWith('/'))local+='index.html';
 if(local.includes('..')){res.writeHead(403);res.end();return}
 try{const bytes=fs.readFileSync(root+'/'+local);const ext=local.split('.').at(-1);
 res.setHeader('Content-Type',({js:'text/javascript',html:'text/html',css:'text/css',webmanifest:'application/manifest+json'}[ext]||'application/octet-stream'));res.end(bytes)}
 catch{res.writeHead(404);res.end('Not found')}
});
let browser,page;
(async()=>{
 await new Promise(resolve=>server.listen(8999,resolve));
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 const js404=[],errors=[];
 page.on('response',r=>{if(r.status()===404&&/\.js(?:$|\?)/.test(r.url()))js404.push(r.url())});
 page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://127.0.0.1:8999'+prefix+'index.html?sandbox=1');
 await page.waitForFunction(()=>typeof V145_state==='function'&&typeof EUI==='object'&&saveReady,{timeout:30000});
 assert.deepEqual(js404,[],'No JavaScript resource may resolve to the host root');
 await page.evaluate(()=>{
  s.started=true;s.cash=200000;s.energy=200;
  s.labelBusiness.company={name:'Fictional Venture Music',started:s.week,staff:{manager:false,marketing:false,ar:false},contracts:[],receipts:0,last:null,preparedWeek:0,settledWeek:0};
  V145_state();document.getElementById('modal')?.close();titleVisible=false;renderTitle();go('Home');
 });
 await page.getByRole('button',{name:'More options'}).click();
 await page.locator('.core-row').filter({hasText:'Label Boss'}).click();
 assert.match(await page.locator('.core-pagebar h1').innerText(),/Label Boss/);
 assert.match(await page.locator('.core-summary h1').innerText(),/Fictional Venture Music/);
 await page.locator('.core-row').filter({hasText:'Staff and payroll'}).click();
 assert.match(await page.locator('.core-pagebar h1').innerText(),/Label staff/);
 assert.equal(await page.locator('#nav button').count(),5,'Existing navigation remains untouched');
 assert.deepEqual(errors,[],'Page must not emit uncaught JavaScript errors');
 console.log('PASS nested GitHack URL serves game, contract engine and Label Boss; real iPhone navigation opens staff.');
})().catch(async err=>{
 console.error(err);try{fs.writeFileSync('static-playtest-failure.txt',String(err.stack||err));if(page)await page.screenshot({path:'static-playtest-failure.png',fullPage:true})}catch{}
 process.exitCode=1;
}).finally(async()=>{try{if(browser)await browser.close()}catch{}server.close()});
