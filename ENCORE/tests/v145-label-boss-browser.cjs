const {chromium}=require('playwright');
const fs=require('fs'),http=require('http'),assert=require('node:assert/strict');
const root=process.cwd()+'/dist';
const server=http.createServer((req,res)=>{
 let p=req.url.split('?')[0];if(p==='/'||p.startsWith('/offline'))p='/index.html';
 try{const data=fs.readFileSync(root+p);res.setHeader('Content-Type',p.endsWith('.js')?'text/javascript':p.endsWith('.html')?'text/html':'application/octet-stream');res.end(data)}
 catch{res.statusCode=404;res.end()}
});
let browser,page;
(async()=>{
 await new Promise(done=>server.listen(8997,done));
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://localhost:8997/offline');
 await page.waitForFunction(()=>saveReady&&typeof EUI!=='undefined'&&typeof V145_state==='function');
 await page.evaluate(()=>{
  s.started=true;s.cash=300000;s.energy=200;s.achievements.popups=false;
  s.labelBusiness.company={name:'Fictional Mirror Records',started:s.week,staff:{manager:false,marketing:false,ar:false},contracts:[],receipts:0,last:null,preparedWeek:0,settledWeek:0};
  V145_state();clearTimeout(briefingTimer);
  document.getElementById('modal')?.close();titleVisible=false;renderTitle();go('Home');
 });
 const originalNav=await page.locator('#nav').innerText();
 assert.match(originalNav,/Home/);assert.match(originalNav,/Songs/);assert.match(originalNav,/Artist File/);
 await page.getByRole('button',{name:'More options'}).click();
 await page.locator('.core-row').filter({hasText:'Label Boss'}).click();
 assert.match(await page.locator('.core-pagebar h1').innerText(),/Label Boss/);
 assert.equal(await page.locator('.core-row').count(),4,'Exactly four new Label Boss destinations');
 assert.equal(await page.locator('#nav').innerText(),originalNav,'Existing bottom navigation must not change');
 await page.locator('.core-row').filter({hasText:'Staff and payroll'}).click();
 assert.match(await page.locator('.core-pagebar h1').innerText(),/Label staff/);
 const candidate=await page.evaluate(()=>V145_candidate('producer',1).name);
 await page.locator('.core-row').filter({hasText:candidate}).click();
 assert.equal(await page.locator('#v101-signature-pad').count(),1,'One contract signature pad');
 assert.equal(await page.locator('#v144-contract-shell input').count(),0,'No typed signature or initials');
 for(const width of [320,375,390,430]){
  await page.setViewportSize({width,height:844});
  const info=await page.evaluate(()=>({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,containerRight:document.querySelector('#v144-contract-shell').getBoundingClientRect().right}));
  assert.ok(info.scrollWidth<=width+1&&info.containerRight<=width+1,'Signing overflows at '+width+': '+JSON.stringify(info));
 }
 await page.setViewportSize({width:390,height:844});
 const canvas=page.locator('#v101-signature-pad');await canvas.scrollIntoViewIfNeeded();const r=await canvas.boundingBox();
 await page.mouse.move(r.x+20,r.y+r.height*.7);await page.mouse.down();
 for(let i=1;i<=8;i++)await page.mouse.move(r.x+20+(r.width-40)*i/8,r.y+r.height*(i%2?.3:.7),{steps:3});
 await page.mouse.up();
 assert.equal(await page.evaluate(()=>V101_signatureHasInk()),true);
 await page.locator('#v144-execute').click();
 assert.equal(await page.evaluate(()=>V145_staff('producer')),true,'signed hire must become a real staffed role');
 assert.equal(await page.evaluate(()=>s.v144.agreements.filter(a=>a.kind==='label-staff').length),1);
 assert.equal(await page.locator('#v144-contract-shell').count(),0,'successful hire closes signing room');
 await page.locator('#nav button').first().click();
 assert.match(await page.locator('.core-summary h1').innerText(),/./,'Artist Home still available');
 assert.equal(await page.locator('#nav').innerText(),originalNav,'No bottom nav redesign');
 assert.deepEqual(errors,[]);
 console.log('PASS Label Boss iPhone browser: More route, unchanged navigation, functional staff contract, finger signature and 320–430px fit.');
})().catch(async err=>{
 console.error(err);
 try{fs.writeFileSync('label-boss-browser-failure.txt',String(err.stack||err));if(page)await page.screenshot({path:'label-boss-browser-failure.png',fullPage:true})}catch{}
 process.exitCode=1;
}).finally(async()=>{try{if(browser)await browser.close()}catch{}server.close()});
