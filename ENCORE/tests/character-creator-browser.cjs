const {chromium}=require('playwright');
const fs=require('fs'),http=require('http'),assert=require('assert/strict');
const root=process.cwd()+'/dist';
const server=http.createServer((req,res)=>{let path=req.url.split('?')[0];if(path==='/'||path.startsWith('/offline'))path='/index.html';try{const content=fs.readFileSync(root+path);res.setHeader('Content-Type',path.endsWith('.js')?'text/javascript':path.endsWith('.html')?'text/html':'application/octet-stream');res.end(content)}catch{res.statusCode=404;res.end()}}).listen(8879);
(async()=>{const browser=await chromium.launch({headless:true,args:['--no-sandbox']});const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const mode of ['offline','online']){
 let stored=null;
 if(mode==='online')await page.route('**/api/save',async route=>{if(route.request().method()==='PUT')stored=route.request().postDataJSON();await route.fulfill({json:route.request().method()==='PUT'?{etag:'test'}:{save:stored,etag:stored?'test':null}})});
 await page.goto('http://localhost:8879/'+(mode==='offline'?'offline':''));await page.waitForFunction(()=>saveReady);
 await page.evaluate(()=>{s.started=true;s.name='Creator Test';titleVisible=false;renderTitle();openArtistFile()});
 await page.getByRole('button',{name:'Edit appearance',exact:true}).click();
 await page.getByRole('button',{name:'Skin tone 7',exact:true}).click();
 assert.equal(await page.getByRole('button',{name:'Skin tone 7',exact:true}).getAttribute('aria-pressed'),'true');
 await page.locator('select[name=style]').selectOption('3');await page.locator('select[name=eyes]').selectOption('3');await page.getByRole('checkbox').check();
 await page.getByRole('button',{name:'Save appearance',exact:true}).click();await page.waitForFunction(()=>lastSaved===JSON.stringify(s));
 await page.reload();await page.waitForFunction(()=>saveReady);assert.equal(await page.evaluate(()=>s.appearance.skin),6);assert.equal(await page.evaluate(()=>s.appearance.style),3);
 await page.evaluate(()=>{titleVisible=false;renderTitle();openArtistFile()});assert.equal(await page.locator('.v129-portrait svg').count(),1);
 await page.getByRole('button',{name:'Edit appearance',exact:true}).click();await page.getByRole('button',{name:'Reset appearance',exact:true}).click();await page.getByRole('button',{name:'Close',exact:true}).click();assert.equal(await page.evaluate(()=>s.appearance.skin),6);
 await page.getByRole('button',{name:'Edit appearance',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Skin tone 7',exact:true}).getAttribute('aria-pressed'),'true');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 if(mode==='online')await page.screenshot({path:'creator-mobile.png'});
 await page.getByRole('button',{name:'Reset appearance',exact:true}).click();await page.getByRole('button',{name:'Save appearance',exact:true}).click();await page.waitForFunction(()=>lastSaved===JSON.stringify(s));await page.reload();await page.waitForFunction(()=>saveReady);assert.equal(await page.evaluate(()=>s.appearance.skin),2);
 console.log(mode+': entry, controls, save, reload, portrait, cancel, reset passed');
}
assert.deepEqual(errors,[]);await browser.close();server.close();})().catch(e=>{console.error(e);server.close();process.exit(1)});
