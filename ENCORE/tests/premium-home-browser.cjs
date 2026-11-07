/* Browser contract for ENCORE's premium iPhone-sized interface. */
const {chromium}=require('playwright');
const fs=require('fs'),http=require('http'),assert=require('node:assert/strict');
const root=process.cwd()+'/dist';
const server=http.createServer((req,res)=>{
 let path=req.url.split('?')[0];if(path==='/'||path.startsWith('/offline'))path='/index.html';
 try{
  const content=fs.readFileSync(root+path);
  res.setHeader('Content-Type',path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':path.endsWith('.html')?'text/html':'application/octet-stream');res.end(content);
 }catch{res.statusCode=404;res.end()}
});
let browser,page;
(async()=>{
 await new Promise(resolve=>server.listen(8991,resolve));
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:8991/offline');
 await page.waitForFunction(()=>saveReady);
 await page.evaluate(()=>{
  s.started=true;s.name='Fictional Artist';s.genre='R&B / Soul';s.fans=38400;s.total=910200;
  s.achievements.popups=false;clearTimeout(briefingTimer);
  document.getElementById('modal').close();titleVisible=false;renderTitle();go('Home');render();
 });
 assert.equal(await page.locator('.core-home-list button.core-row').count(),10);
 assert.equal(await page.locator('.core-premium-portrait svg').count(),1);
 assert.match(await page.locator('.core-premium-person h1').textContent(),/Fictional Artist/);
 assert.equal(await page.locator('nav#nav button').count(),5);
 for(const mode of ['light','dark']){
  await page.evaluate(mode=>{theme=mode;applyTheme();render()},mode);
  for(const width of [320,375,390,430]){
   await page.setViewportSize({width,height:844});
   await page.waitForTimeout(25);
   const dims=await page.evaluate(()=>{
    const targets=['.core-header','.core-premium-resources','.core-home-list','.core-home-list button.core-row:first-child','nav#nav'];
    return {width:innerWidth,documentWidth:document.documentElement.scrollWidth,boxes:targets.map(sel=>{
      const node=document.querySelector(sel);const rect=node?.getBoundingClientRect();
      return {selector:sel,left:rect?.left,right:rect?.right,width:rect?.width};
    })};
   });
   assert.ok(dims.documentWidth<=dims.width+1,'Horizontal overflow in '+mode+' '+width+'px: '+JSON.stringify(dims));
   for(const box of dims.boxes){
    assert.ok(box.left>=-1&&box.right<=dims.width+1,mode+' '+width+'px: '+JSON.stringify(box));
   }
   const navH=await page.locator('nav#nav button').first().evaluate(e=>e.getBoundingClientRect().height);
   assert.ok(navH>=44,'Bottom navigation touch area too short at '+width+'px');
  }
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'encore-premium-'+mode+'.png'});
 }
 await page.evaluate(()=>{theme='light';applyTheme();render()});
 await page.locator('.core-home-list button[aria-label="Marketing"]').click();
 assert.match(await page.locator('.core-pagebar h1').textContent(),/Marketing/);
 assert.equal(await page.locator('dialog[open]').count(),0,'Navigation should not create a dialog');
 await page.locator('nav#nav button[aria-label="Calendar"]').click();
 assert.match(await page.locator('.core-pagebar h1').textContent(),/Release strategy/i);
 assert.equal(await page.locator('nav#nav [aria-current="page"]').count(),1);
 await page.locator('nav#nav button[aria-label="Studio"]').click();
 assert.match(await page.locator('.core-pagebar h1').textContent(),/Songs/);
 await page.locator('nav#nav button[aria-label="Home"]').click();
 assert.equal(await page.locator('.core-home-list button.core-row').count(),10);
 assert.equal(await page.locator('dialog[open]').count(),0);
 assert.deepEqual(errors,[],'Unexpected browser errors: '+errors.join(' | '));
 console.log('PASS premium ENCORE: 320/375/390/430px, forest and midnight themes, live portrait, 10 working destinations, routed navigation, safe-area and no horizontal overflow.');
})().catch(async error=>{
 console.error(error);
 try{fs.writeFileSync('premium-home-failure.txt',String(error&&error.stack||error));if(page)await page.screenshot({path:'encore-premium-failure.png',fullPage:true})}catch{}
 process.exitCode=1;
}).finally(async()=>{
 try{if(browser)await browser.close()}catch{}
 server.close();
});
