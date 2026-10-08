/* Touring 2.0: one city/route engine, settled once per week before music/finance.
   Money enters the existing live-income/expense ledger; label/agent/tax settlement
   remains owned by finance. Historical tour aggregates are never reconstructed. */
const liveVenues=[{name:'Club',seats:500,fans:1000,fixed:3500,setup:5000,reference:35},{name:'Theater',seats:2500,fans:50000,fixed:22000,setup:100000,reference:65},{name:'Arena',seats:18000,fans:1000000,fixed:140000,setup:1500000,reference:120},{name:'Stadium',seats:65000,fans:10000000,fixed:500000,setup:10000000,reference:225}];
const tourProduction=[{name:'Lean',cost:.8,quality:-8},{name:'Standard',cost:1,quality:0},{name:'Spectacle',cost:1.4,quality:12}];
let pendingWorldTour=null,pendingTourStop=null;
function migrateTouring(){
 migrateCareerWorld();
 s.touring??={version:2,nextStop:1,draft:{name:s.name+' · On the road',route:[]},archive:[],offers:[],lastOfferWeek:0,buzz:null};
 const z=s.touring;z.version=2;z.archive??=[];z.offers??=[];z.nextStop??=1;z.draft??={name:s.name+' · On the road',route:[]};
 const t=s.liveTour;
 if(t&&t.version!==2){
  const cities=regionalMarkets.map(m=>m.id),remaining=Math.max(0,t.shows-t.completed),previousRoute=Array.isArray(t.route)?JSON.parse(JSON.stringify(t.route)):null;const planned=previousRoute?.filter(r=>r.status!=='completed'&&r.status!=='played'&&r.status!=='cancelled')||[];if(previousRoute)t.legacyRoute=previousRoute;
  t.version=2;t.setupPaid=liveVenues[t.venue].setup;t.legacyCompleted=t.completed;t.played=t.completed;t.lastSettledWeek=0;t.route=[];t.migrationNote=previousRoute?'Earlier route records and earnings are preserved. Remaining cities retain recorded destinations; review the new weekly dates.':'Earlier show earnings are preserved as a historical total. Remaining cities are an estimated route; review before advancing.';
  for(let i=0;i<remaining;i++)t.route.push({id:z.nextStop++,city:cities.includes(planned[i]?.marketId)?planned[i].marketId:cities[i%cities.length],week:s.week+Math.floor(i/2),venue:t.venue,price:t.price,vip:0,production:1,security:1,opener:null,status:'scheduled'});
  if(t.cancelled)t.route.forEach(r=>r.status='cancelled');
 }
 return z;
}
function activeTour(){return s.liveTour?.version===2&&s.liveTour.route.some(r=>r.status==='scheduled')?s.liveTour:null}
function tourRoute(){migrateTouring();return activeTour()?.route||s.touring.draft.route}
function tourHasLodging(city){return (s.empire?.assets||[]).some(a=>a.kind==='Property'&&!a.tenant&&a.city===city&&a.condition>=50)}
function tourOpener(id){return id===null||id===undefined?null:s.world.find(a=>a.id===id)}
function tourStopEstimate(r,route=tourRoute()){
 const m=careerWorldMarket(r.city),v=liveVenues[r.venue],p=tourProduction[r.production],w=s.careerWorld;
 const near=route.filter(x=>x!==r&&x.city===r.city&&x.status!=='cancelled'&&Math.abs(x.week-r.week)<8).length;
 const opener=tourOpener(r.opener),openerFit=opener?(opener.hometown===r.city?1.6:1)*(opener.genre===s.genre?1.25:.8):0;
 const openerReach=opener?Math.min(v.seats*.3,Math.sqrt(Math.max(0,opener.fans))*openerFit):0;
 const eligible=m.fans*(.025+m.loyalty*.001)+Math.sqrt(Math.max(0,m.previousStreams||0))*(.8+m.awareness/100)+openerReach;
 const scene=.8+(m.sceneHeat??50)/250,heat=.65+w.momentum/200,priceResistance=Math.pow(v.reference/r.price,.8);
 const demand=Math.max(0,eligible*scene*heat*priceResistance/(1+near*.5+(m.tourFatigue||0)/50));
 const tickets=Math.min(v.seats,Math.round(demand)),averagePrice=r.price*(1+r.vip*.01*.75),gross=cents(tickets*averagePrice);
 const crew=cents(v.fixed*.18*p.cost),production=cents(v.fixed*.55*p.cost),security=cents(v.fixed*(.06+.06*r.security));
 const index=route.indexOf(r),previous=route.slice(0,index).filter(x=>x.status!=='cancelled').at(-1),home=w.currentCity;
 const origin=regionalMarkets.find(x=>x.id===(previous?.city||home)),destination=regionalMarkets.find(x=>x.id===r.city);
 const travel=cents(v.fixed*(origin?.id===r.city? .03:origin?.region===destination?.region? .09:.18));
 const lodging=cents(v.fixed*(tourHasLodging(r.city)?.015:.08));
 const openerFee=opener?cents(Math.max(100,Math.sqrt(opener.fans)*8)*(1-Math.max(-50,opener.relation||0)/200)):0;
 const fixed=cents(crew+production+security+travel+lodging+openerFee),variable=cents(gross*.18);
 const incidentRisk=clamp((w.recognition||0)/100*.18+.03-r.security*.055,.005,.22);
 return {tickets,gross,averagePrice,fixed,variable,cost:cents(fixed+variable),net:cents(gross-fixed-variable),crew,production,security,travel,lodging,openerFee,incidentRisk,capacity:v.seats,overreach:demand<v.seats*.45};
}
// Compatibility forecast for existing guide cards; routes use tourStopEstimate.
function tourDemand(v,price,shows){const venue=liveVenues.indexOf(v);if(venue<0||price<=0)return 0;migrateTouring();const route=Array.from({length:shows},(_,i)=>({city:regionalMarkets[i%regionalMarkets.length].id,week:s.week+Math.floor(i/2),venue,price,vip:0,production:1,security:1,opener:null,status:'scheduled'}));return route.reduce((n,r)=>n+tourStopEstimate(r,route).tickets,0)}
function tourStopValid(r){return r&&Number.isInteger(r.id)&&regionalMarkets.some(m=>m.id===r.city)&&Number.isInteger(r.week)&&r.week>=1&&r.week<=100000&&Number.isInteger(r.venue)&&!!liveVenues[r.venue]&&Number.isInteger(r.price)&&r.price>=10&&r.price<=5000&&Number.isInteger(r.vip)&&r.vip>=0&&r.vip<=30&&Number.isInteger(r.production)&&!!tourProduction[r.production]&&Number.isInteger(r.security)&&r.security>=0&&r.security<=2&&(r.opener===null||Number.isInteger(r.opener)&&!!s.world[r.opener])&&['scheduled','played','cancelled'].includes(r.status)}
function editTourStop(id=null){
 if(!labelActive())return;const route=tourRoute(),r=route.find(x=>x.id===id)||{city:s.careerWorld.currentCity,week:Math.max(s.week,...route.map(x=>x.week)),venue:0,price:35,vip:0,production:1,security:1,opener:null};
 if(r.status&&r.status!=='scheduled')return;
 modal(`<h2>${id===null?'Add a show':'Edit this show'}</h2><p>Choose a venue deliberately—even if demand is weak. You carry the financial risk. At most two shows may be scheduled per week.</p><form class="form" onsubmit="saveTourStop(event,${id===null?'null':id})"><label>City<select name="city">${regionalMarkets.map(m=>`<option value="${m.id}" ${m.id===r.city?'selected':''}>${esc(m.city)} · ${compact(s.careerWorld.markets[m.id].fans)} regional fans</option>`).join('')}</select></label><label>Career week<input name="week" type="number" min="${s.week}" max="${s.week+520}" value="${r.week}" required></label><label>Venue<select name="venue">${liveVenues.map((v,i)=>`<option value="${i}" ${i===r.venue?'selected':''}>${v.name} · ${fmt(v.seats)} seats</option>`).join('')}</select></label><label>Standard ticket ($)<input name="price" type="number" min="10" max="5000" value="${r.price}" required></label><label>Premium seats (%; priced at 1.75× standard)<input name="vip" type="number" min="0" max="30" value="${r.vip}" required></label><label>Production<select name="production">${tourProduction.map((p,i)=>`<option value="${i}" ${i===r.production?'selected':''}>${p.name}</option>`).join('')}</select></label><label>Security<select name="security">${['Basic','Professional','Enhanced'].map((n,i)=>`<option value="${i}" ${i===r.security?'selected':''}>${n}</option>`).join('')}</select></label><label>Opening artist<select name="opener"><option value="">No opener</option>${s.world.slice(0,24).map(a=>`<option value="${a.id}" ${a.id===r.opener?'selected':''}>${esc(a.name)} · ${compact(a.fans)} fans</option>`).join('')}</select></label><button class="primary">Save show & review forecast</button></form>`);
}
function saveTourStop(e,id=null){
 e.preventDefault();if(!labelActive())return;const route=tourRoute(),old=route.find(x=>x.id===id),f=new FormData(e.target);
 if(id!==null&&(!old||old.status!=='scheduled'))return;
 const r={id:old?.id||s.touring.nextStop,city:String(f.get('city')),week:Number(f.get('week')),venue:Number(f.get('venue')),price:Number(f.get('price')),vip:Number(f.get('vip')),production:Number(f.get('production')),security:Number(f.get('security')),opener:f.get('opener')===''||f.get('opener')===null?null:Number(f.get('opener')),status:'scheduled'};
 if(!tourStopValid(r)||r.week<s.week||r.week>s.week+520||(!old&&route.length>=160)){toast('Choose valid show details. Routes support up to 160 shows.');return}
 if(route.filter(x=>x.id!==id&&x.status==='scheduled'&&x.week===r.week).length>=2){toast('Two shows are already scheduled that week.');return}
 const active=activeTour(),extra=active?Math.max(0,liveVenues[r.venue].setup-(active.setupPaid||0)):0;
 if(extra>0){pendingTourStop={r,id,tour:active.id};modal(`<h2>Upgrade the tour production?</h2><p>This venue requires ${money(extra)} additional nonrefundable setup funding. Review the show forecast after saving.</p><button class="primary" onclick="confirmTourStopUpgrade()">Pay setup difference & save show</button>`);return}
 commitTourStop(r,id);

}
function commitTourStop(r,id){
 const route=tourRoute(),old=route.find(x=>x.id===id);
 if(old)Object.assign(old,r);else{route.push(r);s.touring.nextStop++}
 route.sort((a,b)=>a.week-b.week||a.id-b.id);if(activeTour())updateTourTotals(s.liveTour);
 $('modal').close();render();queueSave();
}
function confirmTourStopUpgrade(){
 const p=pendingTourStop,t=activeTour();if(!labelActive()||!p||!t||t.id!==p.tour||!tourStopValid(p.r)||p.r.week<s.week)return;
 const old=t.route.find(x=>x.id===p.id);if(p.id!==null&&(!old||old.status!=='scheduled'))return;
 if(t.route.filter(x=>x.id!==p.id&&x.status==='scheduled'&&x.week===p.r.week).length>=2)return;
 const extra=Math.max(0,liveVenues[p.r.venue].setup-(t.setupPaid||0));if(!spend(0,extra))return;
 t.setupPaid=(t.setupPaid||0)+extra;t.production+=extra;s.careerRecords.liveProfit-=extra;
 const record=s.careerRecords.tours.find(x=>x.id===t.id);if(record)record.profit-=extra;
 pendingTourStop=null;commitTourStop(p.r,p.id);
}
function removeTourStop(id,confirmed=false){
 if(!labelActive())return;const route=tourRoute(),r=route.find(x=>x.id===id);if(!r||r.status!=='scheduled')return;
 if(activeTour()&&!confirmed){modal(`<h2>Cancel the ${esc(careerWorldMarket(r.city).city)} show?</h2><p>No future show expense or ticket income will be charged. The tour launch deposit remains nonrefundable. Local demand and loyalty fall slightly.</p><button class="primary" onclick="removeTourStop(${id},true)">Cancel this show</button>`);return}
 if(activeTour()){r.status='cancelled';const m=careerWorldMarket(r.city);m.loyalty=clamp(m.loyalty-2);m.demand=clamp(m.demand-3);updateTourTotals(s.liveTour)}else route.splice(route.indexOf(r),1);
 $('modal').close();render();queueSave();
}
function updateTourTotals(t){t.played=(t.legacyCompleted||0)+t.route.filter(r=>r.status==='played').length;t.completed=(t.legacyCompleted||0)+t.route.filter(r=>r.status!=='scheduled').length;t.shows=(t.legacyCompleted||0)+t.route.length}
function tourRouteCards(route){return route.map(r=>{const m=careerWorldMarket(r.city),v=liveVenues[r.venue],n=r.report||tourStopEstimate(r,route);return `<section class="card"><span class="eyebrow">WEEK ${r.week} · ${esc(r.status.toUpperCase())}</span><h3>${esc(m.city)} · ${v.name}</h3><p>${money(r.price)} standard · ${r.vip}% premium seats · ${tourProduction[r.production].name} production${r.opener!==null?' · '+esc(tourOpener(r.opener)?.name||'Artist')+' opens':''}</p>${profileRows([['Tickets / capacity',fmt(n.tickets)+' / '+fmt(v.seats)],['Ticket gross',money(n.gross)],['Show expenses',money(n.cost)],['Show net before shares and tax',money(n.net)],...(r.report?[['Satisfaction',r.report.satisfaction+'/100'],['New local fans',fmt(r.report.fans)],['PULSE reach',compact(r.report.pulse)],['Incident',r.report.incident||'None']]:[['Demand signal',n.overreach?'High overreach risk':'Within projected reach'],['Crew / production',money(n.crew)+' / '+money(n.production)],['Security / travel / lodging',money(n.security)+' / '+money(n.travel)+' / '+money(n.lodging)],['Opener fee',money(n.openerFee)]])])}${r.status==='scheduled'?`<div class="controls"><button class="secondary" onclick="editTourStop(${r.id})">Edit / reschedule</button><button class="secondary" onclick="removeTourStop(${r.id})">${activeTour()?'Cancel':'Remove'}</button></div>`:''}</section>`}).join('')}
function tourPage(){
 const z=migrateTouring(),t=activeTour(),route=t?.route||z.draft.route;
 const past=s.liveTour&&!t?s.liveTour:null;
 return head('Each city is a different crowd','Touring 2.0.')+`<section class="card"><h2>${t?esc(t.name):'Build your route'}</h2><p>Regional fans, recent streams, local loyalty, city heat, ticket resistance and repeat visits shape demand. Shows resolve weekly, up to two per week. Estimates are uncertain; production can lose money.</p>${t?`${profileRows([['Shows played / planned',t.played+' / '+t.shows],['Ticket gross',money(t.gross)],['Production paid, including launch',money(t.production)],['Net before shares and tax',money(t.gross-t.production)],['Status',t.paused?'Paused · add funds or reschedule':'On the road']])}${t.migrationNote?'<p>'+esc(t.migrationNote)+'</p>':''}<button class="secondary" onclick="cancelWorldTour()">Cancel remaining route</button>`:`<label>Tour name<input maxlength="60" value="${esc(z.draft.name)}" onchange="s.touring.draft.name=this.value.slice(0,60);queueSave()"></label>`}<div class="controls"><button class="primary" onclick="editTourStop()">Add a city / show</button>${!t&&route.length?'<button class="primary" onclick="reviewWorldTour()">Review & launch route</button>':''}</div><p class="fine">Lodging discounts require an unoccupied property in that exact city. Gross is not take-home: finance separately settles contract shares, agent commission, overhead and tax.</p></section>${tourRouteCards(route)}${tourOpeningOffers()}${past?`<details class="card"><summary>Last tour · ${esc(past.name)}</summary>${profileRows([['Gross / production',money(past.gross)+' / '+money(past.production)],['Shows performed',String(past.played)],['Status',past.cancelled?'Cancelled':'Completed']])}${tourRouteCards(past.route)}</details>`:''}${z.archive.length?`<details class="card"><summary>Earlier tours · ${z.archive.length}</summary>${z.archive.map(a=>`<details><summary>${esc(a.name)} · ${a.played} shows · ${money(a.gross)} gross</summary>${a.route?tourRouteCards(a.route):'<p>Historical aggregate only.</p>'}</details>`).join('')}</details>`:''}`;
}
function reviewWorldTour(e){
 e?.preventDefault();if(!labelActive())return;migrateTouring();if(activeTour())return;
 const d=s.touring.draft,route=d.route;if(!route.length){toast('Add at least one city to your route.');return}
 if(route.some(r=>!tourStopValid(r)||r.week<s.week)){toast('Reschedule past or invalid shows before launching.');return}
 const deposit=Math.max(...route.map(r=>liveVenues[r.venue].setup)),name=String(d.name||'New Era').trim().slice(0,60),estimates=route.map(r=>tourStopEstimate(r,route));
 pendingWorldTour={name,route:JSON.parse(JSON.stringify(route)),deposit};
 modal(`<h2>${esc(name)} · confirm route</h2>${profileRows([['Shows',route.length],['Estimated tickets',fmt(estimates.reduce((n,r)=>n+r.tickets,0))],['Projected ticket gross',money(estimates.reduce((n,r)=>n+r.gross,0))],['Projected show costs + launch',money(deposit+estimates.reduce((n,r)=>n+r.cost,0))],['Upfront launch deposit',money(deposit)]])}<p>40 energy. The launch deposit is nonrefundable. Forecasts are not guarantees. Remaining show costs settle weekly, and insufficient cash pauses unplayed shows. You can resize, reprice, reschedule or cancel remaining shows.</p><button class="primary" onclick="confirmWorldTour()">Pay deposit & launch</button>`);
}
function confirmWorldTour(){
 const p=pendingWorldTour;if(!labelActive()||!p||activeTour())return;
 if(p.route.some(r=>!tourStopValid(r)||r.week<s.week))return;
 if(!spend(40,p.deposit))return;
 if(s.liveTour)s.touring.archive.push({id:s.liveTour.id,name:s.liveTour.name,played:s.liveTour.played,gross:s.liveTour.gross,production:s.liveTour.production,ended:s.week,route:s.liveTour.route,legacyRoute:s.liveTour.legacyRoute});
 const id=Date.now()+Math.random();s.liveTour={version:2,id,name:p.name,route:p.route,legacyCompleted:0,played:0,completed:0,shows:p.route.length,venue:p.route[0].venue,price:p.route[0].price,tickets:0,gross:0,production:p.deposit,setupPaid:p.deposit,paused:false,lastSettledWeek:0};
 s.careerRecords.liveProfit-=p.deposit;s.careerRecords.tours.push({id,week:s.week,title:p.name,gross:0,profit:-p.deposit,fans:0,review:0,tickets:0});
 s.touring.draft={name:s.name+' · Next chapter',route:[]};pendingWorldTour=null;$('modal').close();render();queueSave();
}
function settleWorldTour(){
 migrateTouring();const t=activeTour();if(!t||t.lastSettledWeek===s.week)return;t.lastSettledWeek=s.week;t.paused=false;
 const before=t.gross,due=t.route.filter(r=>r.status==='scheduled'&&r.week<=s.week).slice(0,2);
 for(const r of due){
  const n=tourStopEstimate(r,t.route);if(s.cash<n.fixed){t.paused=true;log(t.name+' paused: '+money(n.fixed)+' needed for '+careerWorldMarket(r.city).city+'.');break}
  const m=careerWorldMarket(r.city),incident=Math.random()<n.incidentRisk,tickets=Math.min(n.capacity,Math.max(0,Math.round(n.tickets*rand(.75,1.2)*(incident?.8:1))));
  const satisfaction=Math.round(clamp(level('stagePresence')*.48+level('charisma')*.17+30+tourProduction[r.production].quality-r.vip*.12-(incident?25:0)+rand(-12,12)));
  const gross=cents(tickets*n.averagePrice),cost=cents(n.fixed+gross*.18),net=cents(gross-cost),fans=applyAudienceEvent('tour-show',Math.round(tickets*(.003+satisfaction*.00012)),{reach:tickets,market:r.city});
  changeCash(net);recordIncome('live',gross);s.finance.week.expenses=cents(s.finance.week.expenses+cost);
  const pulse=Math.round(tickets*(.5+satisfaction/40));if(s.social){s.social.followers+=Math.round(pulse*.025);s.social.lifetimeViews+=pulse}
  m.loyalty=clamp(m.loyalty+(satisfaction-50)/20);m.awareness=clamp(m.awareness+Math.min(5,Math.log10(1+tickets)));m.demand=clamp(m.demand+(satisfaction-50)/12);m.tourFatigue=clamp((m.tourFatigue||0)+15);m.culturalConnection=clamp(m.culturalConnection+(satisfaction>=65?1:.2));
  s.careerWorld.momentum=clamp(s.careerWorld.momentum+(satisfaction-45)/12);s.touring.buzz={until:s.week+4,lift:Math.min(.25,(s.touring.buzz?.until>=s.week?s.touring.buzz.lift:0)+satisfaction/2000)};
  const opener=tourOpener(r.opener);if(opener)opener.relation=clamp(opener.relation+(satisfaction>=60?2:-1),-100,100);
  r.status='played';r.report={week:s.week,tickets,gross,cost,net,fans,satisfaction,pulse,incident:incident?'Crowd disruption reduced attendance and satisfaction.':null,expenses:{crew:n.crew,production:n.production,security:n.security,travel:n.travel,lodging:n.lodging,opener:n.openerFee,variable:cents(gross*.18)}};
  t.tickets+=tickets;t.gross=cents(t.gross+gross);t.production=cents(t.production+cost);s.careerRecords.liveGross+=gross;s.careerRecords.liveProfit+=net;
  const record=s.careerRecords.tours.find(x=>x.id===t.id);if(record){record.gross=t.gross;record.profit=cents(t.gross-t.production);record.tickets=t.tickets;record.fans+=fans;record.review=satisfaction}
  gainXP('touring',30);gainXP('stagePresence',20);log(t.name+' · '+m.city+': '+fmt(tickets)+' tickets, '+money(net)+' before shares and tax.');
 }
 const played=t.route.filter(r=>r.report?.week===s.week);if(played.length)addBriefing('tour-week:'+t.id+':'+s.week,'News',t.name+' · weekly tour report',played.map(r=>careerWorldMarket(r.city).city+': '+fmt(r.report.tickets)+' tickets, '+r.report.satisfaction+'/100 satisfaction').join(' · '),'Review city-by-city income and expenses in Touring.');
 updateTourTotals(t);
 for(const [amount,label] of [[1e8,'$100 million'],[5e8,'$500 million'],[1e9,'$1 billion'],[2e9,'$2 billion']])if(before<amount&&t.gross>=amount)milestone('tour-gross-'+t.id+'-'+amount,label+' tour',t.name+' passed '+money(amount)+' gross.');
 if(!activeTour()&&!t.notified){t.notified=true;addBriefing('tour-complete:'+t.id,'Celebration',t.name+' completed',fmt(t.tickets)+' tickets · '+money(t.gross)+' gross · '+money(t.production)+' production. Shares and taxes settle separately.');}
}
function cancelWorldTour(confirmed=false){const t=activeTour();if(!labelActive()||!t)return;if(!confirmed){modal('<h2>Cancel remaining shows?</h2><p>Completed earnings and history remain. The launch deposit is not refunded. Future shows generate no charges or ticket revenue, and cancelled markets lose some loyalty.</p><button class="primary" onclick="cancelWorldTour(true)">Cancel route</button>');return}for(const r of t.route)if(r.status==='scheduled'){r.status='cancelled';const m=careerWorldMarket(r.city);m.loyalty=clamp(m.loyalty-2)}t.cancelled=true;updateTourTotals(t);$('modal').close();render();queueSave()}
function tourOpeningOffers(){const z=s.touring;return `<section class="card"><h2>Opening-slot offers</h2><p>Build your craft and industry relationships to be invited onto another artist’s bill.</p>${z.offers.filter(o=>!o.done&&o.expires>=s.week).map(o=>`<div class="project-row"><div><strong>${esc(s.world[o.artist]?.name||'Artist')} · ${esc(careerWorldMarket(o.city).city)}</strong><small>${money(o.fee)} guarantee · 25 energy · expires after Week ${o.expires}</small></div><button class="secondary" onclick="acceptOpeningSlot(${o.id})">Review</button></div>`).join('')||'<p>No current offers. Check back after future weekly advances.</p>'}</section>`}
function generateOpeningSlots(){const z=migrateTouring();if(s.week-z.lastOfferWeek<8)return;z.lastOfferWeek=s.week;z.offers=z.offers.filter(o=>!o.done&&o.expires>=s.week).slice(-5);const candidates=s.world.slice(0,24).filter(a=>a.fans>s.fans&&a.relation>=0&&(a.genre===s.genre||a.relation>=30));if(level('stagePresence')<20||!candidates.length)return;const a=candidates[Math.floor(Math.random()*candidates.length)];z.offers.push({id:z.nextStop++,artist:a.id,city:a.currentCity||a.hometown||regionalMarkets[a.id%regionalMarkets.length].id,fee:Math.round(100+Math.sqrt(a.fans)*2),reach:Math.round(Math.min(20000,Math.sqrt(a.fans)*3)),expires:s.week+8,done:false})}
function acceptOpeningSlot(id,confirmed=false){if(!labelActive())return;const o=s.touring?.offers.find(x=>x.id===id&&!x.done&&x.expires>=s.week);if(!o)return;if(!confirmed){modal(`<h2>Open for ${esc(s.world[o.artist].name)}?</h2><p>25 energy · ${money(o.fee)} guaranteed fee. Perform in ${esc(careerWorldMarket(o.city).city)} and build a shared live history.</p><button class="primary" onclick="acceptOpeningSlot(${id},true)">Accept & perform</button>`);return}if(!spend(25))return;o.done=true;o.performed=s.week;changeCash(o.fee);recordIncome('live',o.fee);const fans=applyAudienceEvent('opening-slot',Math.round(o.reach*(.004+level('stagePresence')*.0001)),{reach:o.reach,market:o.city});s.world[o.artist].relation=clamp(s.world[o.artist].relation+3,-100,100);s.careerRecords.liveGross+=o.fee;s.careerRecords.liveProfit+=o.fee;milestone('opening-'+id,'Opened for '+s.world[o.artist].name,careerWorldMarket(o.city).city+' · '+fans+' local fans');$('modal').close();render();queueSave()}
function validateWorldTour(){
 const t=s.liveTour;if(t&&t.version!==2){if(!liveVenues[t.venue]||!Number.isInteger(t.shows)||t.shows<0||t.shows>160||!Number.isInteger(t.completed)||t.completed<0||t.completed>t.shows||!Number.isInteger(t.price)||t.price<10||t.price>600||typeof t.name!=='string'||![t.tickets,t.gross,t.production,t.id].every(n=>Number.isFinite(n)&&n>=0))throw Error('Invalid legacy tour');return}
 if(t&&(!Array.isArray(t.route)||t.route.length>160||t.route.some(r=>!tourStopValid(r))||new Set(t.route.map(r=>r.id)).size!==t.route.length||![t.id,t.gross,t.production,t.tickets,t.completed,t.shows].every(n=>Number.isFinite(n)&&n>=0)||t.completed>t.shows))throw Error('Invalid tour route');
 const z=s.touring;if(z&&(!Array.isArray(z.draft?.route)||z.draft.route.length>160||z.draft.route.some(r=>!tourStopValid(r))||!Array.isArray(z.archive)||!Array.isArray(z.offers)||z.offers.some(o=>!s.world[o.artist]||!regionalMarkets.some(m=>m.id===o.city)||![o.id,o.fee,o.reach,o.expires].every(n=>Number.isFinite(n)&&n>=0))))throw Error('Invalid touring state');
}
