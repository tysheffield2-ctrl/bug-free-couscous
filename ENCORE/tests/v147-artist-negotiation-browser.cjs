/* iPhone end-to-end: real Label Boss A&R → conversation → counter → single signed offer. */
const {chromium}=require('playwright');
const fs=require('fs'),http=require('http'),assert=require('node:assert/strict');
const root=process.cwd()+'/dist';
const server=http.createServer((req,res)=>{
 let p=req.url.split('?')[0];if(p==='/'||p.startsWith('/offline'))p='/index.html';
 try{const data=fs.readFileSync(root+p);res.setHeader('Content-Type',p.endsWith('.js')?'text/javascript':p.endsWith('.html')?'text/html':'application/octet-stream');res.end(data)}
 catch{res.statusCode=404;res.end('Not found')}
});
let browser,page;
(async()=>{
 await new Promise(done=>server.listen(8995,done));
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://127.0.0.1:8995/offline?sandbox=1');
 await page.waitForFunction(()=>saveReady&&typeof EUI!=='undefined'&&typeof ENCORE_ROSTER_NEGOTIATION.meet==='function');
 const baseNav=await page.locator('#nav').innerText();
 await page.evaluate(()=>{
  s.started=true;s.cash=5000000;s.energy=200;s.reputation=100;
  s.achievements.popups=false;
  s.labelBusiness.company={name:'Fictional Aster Records',started:s.week,staff:{ar:true,manager:false,marketing:false},contracts:[],receipts:0,last:null,preparedWeek:0,settledWeek:0};
  s.world.forEach(a=>a.relation=70);
  V145_state();s.labelBusiness.company.staffFunded=true;V145_scout();
  clearTimeout(briefingTimer);document.getElementById('modal')?.close();titleVisible=false;renderTitle();go('LabelScouting');
 });
 const prospect=page.locator('.core-row').first();
 assert.match(await prospect.innerText(),/A&R estimates/i,'Scouting UI should display ranges, not hidden exact skill');
 assert.match(await prospect.innerText(),/confidence/i);
 const id=await page.evaluate(()=>V145_read().prospects[0]);
 await prospect.click();
 await page.locator('#v102-negotiation-shell').waitFor();
 assert.match(await page.locator('#v102-negotiation-shell').innerText(),/Ask what matters/);
 const energyBefore=await page.evaluate(()=>s.energy);
 await page.getByRole('button',{name:/Ask what matters/}).click();
 assert.equal(await page.evaluate(()=>s.energy),energyBefore-3);
 assert.equal(await page.evaluate(id=>V100_rosterNegotiation(id).revealed,id),true);
 assert.match(await page.locator('#v102-negotiation-shell').innerText(),/Known priority:/);
 const form=page.locator('#v102-negotiation-shell form');
 await form.locator('select[name="type"]').selectOption('360');
 await form.locator('input[name="share"]').fill('80');
 await form.locator('input[name="weeks"]').fill('104');
 await form.locator('input[name="advance"]').fill('0');
 await form.getByRole('button',{name:'Present offer'}).click();
 const counter=await page.evaluate(id=>V100_rosterNegotiation(id).lastCounter,id);
 assert.ok(counter?.advance>0,'The artist counters unreasonable terms');
 assert.ok(counter.share<.8,'Their counter asks for a fairer share');
 assert.equal(await page.evaluate(()=>s.labelBusiness.company.contracts.length),0,'Counter alone cannot sign an artist');
 await page.getByRole('button',{name:'Review artist counteroffer'}).click();
 assert.equal(Number(await page.locator('#v102-negotiation-shell [name="advance"]').inputValue()),counter.advance);
 assert.equal(await page.evaluate(()=>s.labelBusiness.company.contracts.length),0);
 // Present genuinely competitive terms, but signing is still a separate step.
 const ideal=await page.evaluate(id=>{
  const a=s.world[id],r=rosterTerms(a,'record',.1,26);
  return Math.max(100000,Math.ceil(ENCORE_ROSTER_NEGOTIATION.artistAssessment(s,id,{type:'record',share:.1,weeks:26,advance:r.minimum},r).minimum*6))
 },id);
 await page.locator('#v102-negotiation-shell select[name="type"]').selectOption('record');
 await page.locator('#v102-negotiation-shell input[name="share"]').fill('10');
 await page.locator('#v102-negotiation-shell input[name="weeks"]').fill('26');
 await page.locator('#v102-negotiation-shell input[name="advance"]').fill(String(ideal));
 await page.locator('#v102-negotiation-shell form').getByRole('button',{name:'Present offer'}).click();
 await page.locator('#v101-signature-pad').waitFor({timeout:10000});
 assert.equal(await page.locator('#v144-contract-shell input').count(),0,'Signature still requires no typed name or initials');
 assert.equal(await page.evaluate(()=>s.labelBusiness.company.contracts.length),0,'A verbal acceptance must not execute the recording agreement');
 assert.equal(await page.locator('#nav').innerText(),baseNav,'Original ENCORE navigation must not change');
 assert.deepEqual(errors,[],'No browser errors');
 console.log('PASS iPhone artist scouting and negotiation: uncertainty, meeting, memory, counter, unsigned acceptance, contract signature gate.');
})().catch(async err=>{
 console.error(err);try{fs.writeFileSync('artist-negotiation-browser-failure.txt',String(err.stack||err));if(page)await page.screenshot({path:'artist-negotiation-browser-failure.png',fullPage:true})}catch{}
 process.exitCode=1;
}).finally(async()=>{try{if(browser)await browser.close()}catch{}server.close()});
