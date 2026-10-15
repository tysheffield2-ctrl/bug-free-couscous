/* ENCORE UI2 command bridge.
   Pure, renderer-independent career mutations plus a thin browser save adapter.
   This file intentionally does not import or execute the legacy game renderer. */
(function(global){
'use strict';

const roundCents=v=>Math.round((Number(v)||0)*100)/100;
const clamp=(v,l=0,h=100)=>Math.max(l,Math.min(h,Number(v)||0));
const clone=v=>typeof structuredClone==='function'?structuredClone(v):JSON.parse(JSON.stringify(v));
const audienceMarkets=[
 {id:'austin',city:'Austin',state:'Texas',region:'South',genres:['Rock','Country','Indie folk']},
 {id:'atlanta',city:'Atlanta',state:'Georgia',region:'South',genres:['Hip-hop','R&B']},
 {id:'la',city:'Los Angeles',state:'California',region:'West',genres:['Pop','Hip-hop','Electronic']},
 {id:'nyc',city:'New York',state:'New York',region:'Northeast',genres:['Hip-hop','Jazz','Pop']},
 {id:'nashville',city:'Nashville',state:'Tennessee',region:'South',genres:['Country','Rock']},
 {id:'miami',city:'Miami',state:'Florida',region:'South',genres:['Latin','Electronic','Pop']},
 {id:'chicago',city:'Chicago',state:'Illinois',region:'Midwest',genres:['R&B','Jazz','Electronic']},
 {id:'seattle',city:'Seattle',state:'Washington',region:'West',genres:['Rock','Indie folk','Electronic']},
 {id:'houston',city:'Houston',state:'Texas',region:'South',genres:['Hip-hop','R&B']},
 {id:'dallas',city:'Dallas',state:'Texas',region:'South',genres:['Hip-hop','Country','R&B']},
 {id:'detroit',city:'Detroit',state:'Michigan',region:'Midwest',genres:['Hip-hop','R&B','Rock']},
 {id:'neworleans',city:'New Orleans',state:'Louisiana',region:'South',genres:['Hip-hop','R&B','Jazz']}
];
function fail(message,code='invalid'){const e=new Error(message);e.code=code;throw e}
function ensureCoreState(s){
 if(!s||typeof s!=='object'||!Number.isInteger(s.week)||!Array.isArray(s.songs)||!Array.isArray(s.world))fail('This career could not be read.','invalid-save');
 s.history=Array.isArray(s.history)?s.history:[];
 s.finance=s.finance&&typeof s.finance==='object'?s.finance:{};
 s.finance.week=s.finance.week&&typeof s.finance.week==='object'?s.finance.week:{wages:0,live:0,expenses:0};
 s.development=s.development&&typeof s.development==='object'?s.development:{};
 s.scene=s.scene&&typeof s.scene==='object'?s.scene:{city:'austin'};s.scene.city=audienceMarkets.some(x=>x.id===s.scene.city)?s.scene.city:'austin';
 s.careerRecords=s.careerRecords&&typeof s.careerRecords==='object'?s.careerRecords:{sinceWeek:s.week,tours:[],openMics:0,royalties:0,liveGross:0,liveProfit:0};
 s.careerRecords.tours=Array.isArray(s.careerRecords.tours)?s.careerRecords.tours:[];
 for(const k of ['openMics','royalties','liveGross','liveProfit'])s.careerRecords[k]=Number(s.careerRecords[k])||0;
 return s
}
function log(s,text){s.history.unshift({week:s.week,text});s.history=s.history.slice(0,100)}
function ensureWallet(s){
 const cash=Number(s.cash)||0,raw=String(s.walletCents??'');
 let valid=/^-?\d+$/.test(raw);
 if(valid){try{valid=Math.abs(Number(BigInt(raw))/100-cash)<.005}catch{valid=false}}
 if(!valid)s.walletCents=BigInt(Math.round(cash*100)).toString();
}
function changeCash(s,delta){ensureWallet(s);s.walletCents=(BigInt(s.walletCents)+BigInt(Math.round((Number(delta)||0)*100))).toString();s.cash=Number(BigInt(s.walletCents))/100;return s.cash}
function spendEnergy(s,amount){amount=Math.max(0,Math.round(Number(amount)||0));if((Number(s.energy)||0)<amount)fail('Rest to recover energy first.','energy');s.started=true;s.energy=(Number(s.energy)||0)-amount}
function spend(s,energy=0,cost=0){cost=roundCents(cost);if(cost>0&&(Number(s.cash)||0)<cost)fail('Not enough cash. Work a shift or save up.','cash');spendEnergy(s,energy);if(cost){changeCash(s,-cost);s.finance.week.expenses=roundCents((Number(s.finance.week.expenses)||0)+cost)}return true}
function recordIncome(s,kind,value){ensureCoreState(s);s.finance.week[kind]=roundCents((Number(s.finance.week[kind])||0)+(Number(value)||0))}
function xpNeeded(n){n=Number(n)||0;return Math.round(60+n*3+(n>25?(n-25)*3:0)+(n>50?(n-50)*12:0)+(n>70?(n-70)**2*12:0)+(n>85?(n-85)**3*8:0))}
function ensureStat(s,key){const current=s.development[key];if(!current||typeof current!=='object')s.development[key]={level:0,xp:0};s.development[key].level=clamp(Math.round(Number(s.development[key].level)||0),0,100);s.development[key].xp=Math.max(0,Number(s.development[key].xp)||0);return s.development[key]}
function gainXP(s,key,amount){const a=ensureStat(s,key);if(a.level>=100)return;a.xp+=amount;while(a.level<100&&a.xp>=xpNeeded(a.level)){a.xp-=xpNeeded(a.level);a.level++}if(a.level===100)a.xp=0}
function migrateSocial(s){if(!s.social||typeof s.social!=='object')s.social={version:1,sinceWeek:s.week,followers:Math.round(Math.max(60,(Number(s.fans)||0)*.75)),posts:[],feed:[],interactions:[],lastWeek:0,lifetimeViews:0,lifetimeFans:0,weekly:[],nextId:1};s.social.posts=Array.isArray(s.social.posts)?s.social.posts:[];s.social.feed=Array.isArray(s.social.feed)?s.social.feed:[];s.social.interactions=Array.isArray(s.social.interactions)?s.social.interactions:[];return s.social}
function audienceMarketTemplate(m,home){return {id:m.id,city:m.city,state:m.state,region:m.region,streams:0,weeklyStreams:0,previousStreams:0,fans:0,awareness:home?20:0,loyalty:home?30:10,demand:home?18:0,culturalConnection:home?20:0,legacy:0,status:0,growth:0}}
function ensureCareerWorld(s){
 const home=s.scene?.city||'austin';
 if(!s.careerWorld)s.careerWorld={version:1,hometown:home,currentCity:home,momentum:18,publicInterest:12,fanLoyalty:clamp(s.loyalty||20),industryInfluence:clamp((s.reputation||0)*.7),culturalRelevance:8,recognition:clamp(Math.log10(Math.max(1,s.fans||1))*10),tourDemand:10,state:'Stable',stateSince:s.week||1,comeback:false,lastTotalStreams:s.total||0,lastFans:s.fans||0,lastWeek:s.week||1,markets:{},history:[]};
 const w=s.careerWorld;w.version=1;w.hometown=w.hometown||home;w.currentCity=s.scene?.city||w.currentCity||home;w.markets=w.markets&&typeof w.markets==='object'?w.markets:{};w.history=Array.isArray(w.history)?w.history:[];
 for(const m of audienceMarkets)if(!w.markets[m.id])w.markets[m.id]=audienceMarketTemplate(m,m.id===w.hometown);
 reconcileRegionalAudience(s,w);return w
}
function reconcileRegionalAudience(s,w=s.careerWorld){
 if(!w?.markets)return;
 const markets=Object.values(w.markets),target=Math.max(0,Math.floor(s.fans||0)),migrating=w.audienceVersion!==1;
 let weights=markets.map(m=>Math.max(0,Number(m.fans)||0));
 if(migrating){const observed=markets.map(m=>Math.max(0,Number(m.streams)||0));weights=observed.some(Boolean)?observed:markets.map(m=>audienceMarkets.find(x=>x.id===m.id)?.genres.includes(s.genre)?1.35:1);w.audienceAttribution=observed.some(Boolean)?'historical-streams':'estimated-genre-spread'}
 if(!weights.some(Boolean))weights=markets.map(()=>1);
 const sum=weights.reduce((a,b)=>a+b,0),rows=markets.map((m,i)=>{const exact=target*weights[i]/sum;return {m,value:Math.floor(exact),remainder:exact-Math.floor(exact),i}});
 let left=target-rows.reduce((n,r)=>n+r.value,0);rows.sort((a,b)=>b.remainder-a.remainder||a.i-b.i);for(const r of rows)r.m.fans=r.value+(left-->0?1:0);w.audienceVersion=1
}
/* Exact UI-independent copy of ENCORE's canonical audience mutation contract. */
function applyAudienceEvent(s,source,delta,{reach=Number.MAX_SAFE_INTEGER,market=null}={}){
 if(!Number.isFinite(delta)||!Number.isFinite(reach)||reach<0)fail('Invalid audience event','audience');
 const before=Math.max(0,Math.floor(s.fans||0)),requested=Math.round(delta),change=requested>0?Math.min(requested,Math.floor(reach),Number.MAX_SAFE_INTEGER-before):Math.max(-before,requested);
 const w=ensureCareerWorld(s);s.fans=before+change;const a=s.audienceEngine??={version:1,events:[],sources:{}};a.sources=a.sources&&typeof a.sources==='object'?a.sources:{};a.events=Array.isArray(a.events)?a.events:[];a.sources[source]=(a.sources[source]||0)+change;a.events.push({week:s.week,source,delta:change,market});a.events=a.events.slice(-104);
 if(change>0&&w){const markets=Object.values(w.markets);if(market&&w.markets[market])w.markets[market].fans+=change;else if(source==='streaming'){const total=markets.reduce((n,m)=>n+(Number(m.weeklyStreams)||0),0);let remaining=change;if(total>0)markets.forEach((m,i)=>{const n=i===markets.length-1?remaining:Math.floor(change*(Number(m.weeklyStreams)||0)/total);m.fans+=n;remaining-=n})}}
 reconcileRegionalAudience(s,w);return change
}

function applyCommand(input,name,payload={}){
 const s=ensureCoreState(clone(input));
 if(name==='work'){
   spendEnergy(s,15);changeCash(s,180);recordIncome(s,'wages',180);log(s,'A shift paid $180. A little more runway.');
   return {state:s,message:'Shift complete · +$180 · −15 energy'}
 }
 if(name==='rest'){
   const energy=Number(s.energy)||0;if(energy>=200)fail('You are fully rested.','rest-full');if(s.restWeek===s.week)fail('You already rested this week. Advance for 200 energy.','rest-used');
   s.started=true;s.restWeek=s.week;s.energy=Math.min(200,energy+40);log(s,'You recovered up to 40 energy. Rest is available once per week.');
   return {state:s,message:`Recovered ${s.energy-energy} energy`}
 }
 if(name==='open-mic'){
   spendEnergy(s,20);const fans=Math.round(5+ensureStat(s,'stagePresence').level*.16+ensureStat(s,'charisma').level*.04),pay=Math.round(25+ensureStat(s,'marketability').level*.2);changeCash(s,pay);recordIncome(s,'live',pay);const gained=applyAudienceEvent(s,'live',fans,{market:s.scene?.city});s.careerRecords.openMics++;s.careerRecords.liveGross+=pay;s.careerRecords.liveProfit+=pay;gainXP(s,'stagePresence',30);log(s,`Open mic: ${gained} new fans, $${pay} earned, +30 Stage Presence XP.`);return {state:s,message:`Open mic · +${gained} fans · +$${pay} · −20 energy`}
 }
 if(name==='train'){
   const keys=['writing','recording','producing','charisma','marketability','stagePresence','touring','viralAbility'],key=String(payload.key||'');if(!keys.includes(key))fail('Choose a valid skill.');
   const intensity=Math.max(0,Math.min(2,Number(payload.intensity)||0)),cost=[5,10,20][intensity],xp=[20,40,80][intensity],stat=ensureStat(s,key);if(stat.level>=100)fail('That skill has reached maximum mastery.','mastery');
   spendEnergy(s,cost);const before=stat.level;gainXP(s,key,xp);const label=key.replace(/([A-Z])/g,' $1').replace(/^./,c=>c.toUpperCase());log(s,`${label}: +${xp} XP${ensureStat(s,key).level>before?' · Level '+ensureStat(s,key).level:''}.`);
   return {state:s,message:`${label} +${xp} XP · −${cost} energy`}
 }
 if(name==='release-shelf'){
   const id=payload.songId,x=s.songs.find(x=>String(x.id)===String(id));if(!x||x.released)fail('That master is no longer waiting for release.');
   spend(s,5,20);x.released=s.week;log(s,`“${x.title}” is out.`);return {state:s,message:`“${x.title}” released · −$20 · −5 energy`}
 }
 if(name==='release-draft'||name==='finish-draft'){
   const d=s.draft;if(!d||Number(d.steps)!==3)fail('The master is not ready yet.');const release=name==='release-draft';if(release)spend(s,5,20);
   const song={...d,released:release?s.week:null,streams:0,total:0,peak:null,album:null};s.songs.push(song);s.draft=null;log(s,`“${song.title}” ${release?'is out. Results arrive at the end of this week.':'is ready for your album.'}`);
   return {state:s,message:release?`“${song.title}” released · results at week close`:`“${song.title}” saved as a finished master`}
 }
 if(name==='pulse-support'){
   const a=migrateSocial(s),id=Number(payload.artistId);if(!Number.isInteger(id)||!s.world.some(x=>x&&x.id===id))fail('That artist is unavailable.');if(!a.feed.some(p=>p.artist===id))fail('That post is no longer in the feed.');if(a.interactions.some(x=>x.week===s.week&&x.artist===id))fail('You already supported this artist this week.','already');
   spendEnergy(s,2);const artist=s.world.find(x=>x.id===id);artist.relation=clamp((Number(artist.relation)||0)+1,-100,100);a.interactions.push({week:s.week,artist:id});log(s,`You supported ${artist.name}. Relationship +1.`);
   return {state:s,message:`Supported ${artist.name} · relationship +1`}
 }
 if(name==='pulse-reply'){
   const a=migrateSocial(s),id=Number(payload.postId),p=a.posts.find(x=>x.id===id&&x.week===s.week&&!x.replied);if(!p)fail('That post is no longer available for replies.');spendEnergy(s,5);p.replied=true;const fans=Math.min(1000,Math.round((Number(p.comments)||0)*.05)),gained=applyAudienceEvent(s,'pulse',fans);p.fans=(Number(p.fans)||0)+gained;a.lifetimeFans=(Number(a.lifetimeFans)||0)+gained;s.loyalty=clamp((Number(s.loyalty)||0)+1);gainXP(s,'charisma',10);return {state:s,message:`Replies complete · +1 loyalty${gained?' · +'+gained+' fans':''}`}
 }
 fail('That UI2 action has not been migrated yet.','unsupported')
}

global.ENCORE_UI2_COMMAND_CORE={applyCommand,applyAudienceEvent,reconcileRegionalAudience,xpNeeded};
if(typeof document==='undefined'||typeof fetch==='undefined')return;

let busy=false;
function toast(message,error=false){let n=document.getElementById('ui2-command-toast')||document.getElementById('ui2-toast');if(!n){n=document.createElement('div');n.id='ui2-command-toast';n.className='ui2-toast';document.body.appendChild(n)}n.textContent=message;n.classList.toggle('is-error',!!error);n.classList.add('is-visible');setTimeout(()=>n.classList.remove('is-visible'),2600)}
function setBusy(on){busy=on;document.documentElement.classList.toggle('ui2-command-busy',on);document.querySelectorAll('[data-ui2-command]').forEach(b=>b.disabled=on||b.dataset.commandDisabled==='true')}
async function loadLatest(){const r=await fetch('/api/save',{credentials:'same-origin',cache:'no-store'});if(!r.ok)fail(`Career read failed (${r.status}).`,'network');const data=await r.json();if(!data?.save?.state)fail('Start or restore your ENCORE career before using live UI2 actions.','no-save');return data}
async function commit(name,payload={}){
 if(busy)return;setBusy(true);
 try{
   let latest=await loadLatest(),result=applyCommand(latest.save.state,name,payload);
   let response=await fetch('/api/save',{method:'PUT',credentials:'same-origin',headers:{'Content-Type':'application/json',...(latest.etag?{'If-Match':latest.etag}:{'If-None-Match':'*'})},body:JSON.stringify({schemaVersion:1,state:result.state})});
   if(response.status===409){latest=await loadLatest();result=applyCommand(latest.save.state,name,payload);response=await fetch('/api/save',{method:'PUT',credentials:'same-origin',headers:{'Content-Type':'application/json',...(latest.etag?{'If-Match':latest.etag}:{'If-None-Match':'*'})},body:JSON.stringify({schemaVersion:1,state:result.state})})}
   if(!response.ok){let message='Career save failed.';try{message=(await response.json()).error||message}catch{}fail(message,response.status===409?'conflict':'network')}
   toast(result.message);setTimeout(()=>location.reload(),280)
 }catch(e){console.warn('UI2 command failed',e);toast(e.message||'That action could not be completed.',true);setBusy(false)}
}
function wireQuickMoves(){const line=document.querySelector('.ui2-actions-line');if(!line)return;const buttons=line.querySelectorAll('button');if(buttons[0]&&!buttons[0].dataset.ui2Command){buttons[0].removeAttribute('data-toast');buttons[0].dataset.ui2Command='work';buttons[0].textContent='Work a shift · +$180'}if(buttons[1]&&!buttons[1].dataset.ui2Command){buttons[1].removeAttribute('data-toast');buttons[1].disabled=false;buttons[1].removeAttribute('data-command-disabled');buttons[1].dataset.ui2Command='open-mic';buttons[1].textContent='Open mic · 20⚡'}if(buttons[2]&&!buttons[2].dataset.ui2Command){buttons[2].removeAttribute('data-toast');buttons[2].dataset.ui2Command='rest';buttons[2].textContent='Rest · +40 energy'}const small=line.previousElementSibling?.querySelector('small');if(small)small.textContent='Live career actions'}
function wireTraining(){const rows=document.querySelectorAll('.ui2-stat-list .ui2-stat-line');const keys=['writing','recording','producing','charisma','marketability'];rows.forEach((row,i)=>{if(!keys[i]||row.querySelector('[data-ui2-command="train"]'))return;const b=document.createElement('button');b.type='button';b.className='ui2-train-action';b.dataset.ui2Command='train';b.dataset.skill=keys[i];b.textContent='Practice · 5⚡';row.appendChild(b)})}
function wireStudio(){
 document.querySelectorAll('.ui2-master-list .ui2-master-row').forEach((row,index)=>{const b=row.querySelector('button');if(!b||b.dataset.ui2Command)return;b.removeAttribute('data-toast');b.dataset.ui2Command='release-shelf';b.dataset.masterIndex=String(index);b.textContent='Release · $20 · 5⚡'});
 const active=document.querySelector('.ui2-studio-room.active .ui2-session-command');if(active){const primary=active.querySelector('button');if(primary&&/Plan release/i.test(primary.textContent||'')){primary.removeAttribute('data-toast');primary.dataset.ui2Command='release-draft';primary.textContent='Release single · $20 · 5⚡';if(!active.querySelector('[data-ui2-command="finish-draft"]')){const keep=document.createElement('button');keep.type='button';keep.className='ui2-finish-master';keep.dataset.ui2Command='finish-draft';keep.textContent='Save master for album';active.appendChild(keep)}}}
}
function wirePulse(){
 const industry=[...document.querySelectorAll('.ui2-industry-post')];industry.forEach((row,index)=>{const b=row.querySelector('button');if(!b||b.dataset.ui2Command)return;b.removeAttribute('data-ui2-extra-toast');b.dataset.ui2Command='pulse-support';b.dataset.feedIndex=String(index);b.textContent='Support · 2⚡'});
 document.querySelectorAll('.ui2-pulse-post').forEach((post,index)=>{const old=post.querySelector('.ui2-pulse-reply-disabled');if(old)old.remove();if(post.querySelector('[data-ui2-command="pulse-reply"]'))return;const footer=post.querySelector('footer');if(!footer)return;const b=document.createElement('button');b.type='button';b.className='ui2-pulse-reply';b.dataset.ui2Command='pulse-reply';b.dataset.postIndex=String(index);b.textContent='Reply · 5⚡';footer.after(b)})
}
function wire(){wireQuickMoves();wireTraining();wireStudio();wirePulse()}
document.addEventListener('click',async e=>{const b=e.target.closest?.('[data-ui2-command]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();let payload={};if(b.dataset.ui2Command==='train')payload.key=b.dataset.skill;if(b.dataset.ui2Command==='release-shelf'){try{const latest=await loadLatest(),masters=(latest.save.state.songs||[]).filter(x=>!x?.released).slice(-5).reverse(),song=masters[Number(b.dataset.masterIndex)];if(!song)fail('That master is no longer available.');payload.songId=song.id}catch(err){toast(err.message,true);return}}if(b.dataset.ui2Command==='pulse-support'||b.dataset.ui2Command==='pulse-reply'){try{const latest=await loadLatest();if(b.dataset.ui2Command==='pulse-support'){const feed=(latest.save.state.social?.feed||[]).slice().reverse().slice(0,12),p=feed[Number(b.dataset.feedIndex)];if(!p)fail('That industry post is no longer available.');payload.artistId=p.artist}else{const posts=(latest.save.state.social?.posts||[]).slice().reverse().slice(0,14),p=posts[Number(b.dataset.postIndex)];if(!p)fail('That PULSE post is no longer available.');payload.postId=p.id}}catch(err){toast(err.message,true);return}}commit(b.dataset.ui2Command,payload)},true);
new MutationObserver(wire).observe(document.documentElement,{subtree:true,childList:true});wire();
global.ENCORE_UI2_COMMANDS={execute:commit};
})(globalThis);