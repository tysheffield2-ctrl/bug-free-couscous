/* Browser-level iPhone contract test: real pointer strokes, no keyboard signing. */
const {chromium}=require('playwright');
const fs=require('fs'),http=require('http'),assert=require('node:assert/strict');
const root=process.cwd()+'/dist';
const server=http.createServer((req,res)=>{
 let path=req.url.split('?')[0];if(path==='/'||path.startsWith('/offline'))path='/index.html';
 try{const content=fs.readFileSync(root+path);res.setHeader('Content-Type',path.endsWith('.js')?'text/javascript':path.endsWith('.html')?'text/html':'application/octet-stream');res.end(content)}
 catch{res.statusCode=404;res.end()}
});
let browser,page;
(async()=>{
 await new Promise(resolve=>server.listen(8994,resolve));
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:8994/offline');
 await page.waitForFunction(()=>typeof V144_mount==='function'&&saveReady);
 await page.evaluate(()=>{
  s.started=true;s.name='Fictional Performer';s.achievements.popups=false;s.cash=100000;
  clearTimeout(briefingTimer);document.getElementById('modal')?.close();titleVisible=false;renderTitle();
  globalThis.__contractExec=0;
  V108_mountStandardContract({kind:'commercial',counterparty:'Fictional Sponsor',documentTitle:'Fictional Sponsored Performance',summaryHtml:'<p>Guaranteed $2,000</p>',pages:[
   {title:'Fee',body:'A guaranteed fee is owed for the performance.'},
   {title:'Legal remedies',body:'A missed guaranteed payment can create a breach claim.'}
  ],amount:2000,payer:'counterparty',payee:'player',basis:'one guaranteed performance',execute:()=>{__contractExec++;return true}})
 });
 assert.equal(await page.locator('#v101-signature-pad').count(),1);
 assert.equal(await page.locator('#v144-contract-shell input').count(),0,'No typed initials, names or checkboxes');
 assert.match(await page.locator('#v144-contract-shell').innerText(),/missed guaranteed payment/i);
 for(const width of [320,375,390,430]){
  await page.setViewportSize({width,height:844});
  const box=await page.locator('#v144-contract-shell').evaluate(el=>{
   const r=el.getBoundingClientRect(),paper=el.querySelector('.v144-sheet').getBoundingClientRect();
   return {viewport:innerWidth,shellLeft:r.left,shellRight:r.right,paperRight:paper.right};
  });
  assert.ok(box.shellLeft>=-1&&box.shellRight<=box.viewport+1&&box.paperRight<=box.viewport+1,'Contract overflow at '+width+': '+JSON.stringify(box));
 }
 await page.setViewportSize({width:390,height:844});
 await page.locator('#v144-execute').click();
 assert.equal(await page.evaluate(()=>__contractExec),0,'Empty pad must not sign');
 const canvas=page.locator('#v101-signature-pad');
 await canvas.scrollIntoViewIfNeeded();const rect=await canvas.boundingBox();
 await page.mouse.move(rect.x+20,rect.y+rect.height*.55);await page.mouse.down();
 for(let i=1;i<=8;i++)await page.mouse.move(rect.x+20+(rect.width-40)*i/8,rect.y+rect.height*(i%2?.25:.65),{steps:4});
 await page.mouse.up();
 assert.equal(await page.evaluate(()=>V101_signatureHasInk()),true,'Pointer stroke should be recognized on iPhone-sized canvas');
 await page.screenshot({path:'encore-contract-signature.png'});
 await page.locator('#v144-execute').click();
 assert.equal(await page.evaluate(()=>__contractExec),1);
 assert.equal(await page.evaluate(()=>s.v144.agreements.length),1);
 assert.equal(await page.evaluate(()=>s.v144.agreements[0].signature.kind),'drawn');
 assert.equal(await page.locator('#v144-contract-shell').count(),0,'Signed contract closes only after successful transaction');
 assert.deepEqual(errors,[],'Unexpected browser errors');
 console.log('PASS contract browser: one canvas, no typed fields, no overflow at 320–430px, real pointer signature, single execution and saved proof.');
})().catch(async error=>{
 console.error(error);try{fs.writeFileSync('contract-signature-failure.txt',String(error.stack||error));if(page)await page.screenshot({path:'contract-signature-failure.png',fullPage:true})}catch{}
 process.exitCode=1;
}).finally(async()=>{try{if(browser)await browser.close()}catch{}server.close()});
