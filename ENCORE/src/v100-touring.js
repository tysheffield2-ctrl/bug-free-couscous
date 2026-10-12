/* ENCORE 1.0 Touring 2.1: venue identity, promoter confidence and city availability. */
const V100_VENUE_CLASSES={
 4:{className:'DIY / Bar',crew:.55,production:.45,security:.45,logistics:.55,prestige:4,risk:.9,access:0,availability:1},
 0:{className:'Small Club',crew:.7,production:.65,security:.55,logistics:.65,prestige:8,risk:.92,access:0,availability:1},
 5:{className:'Large Club',crew:.82,production:.78,security:.65,logistics:.75,prestige:13,risk:.95,access:5,availability:.98},
 1:{className:'Small Theater',crew:.95,production:.95,security:.78,logistics:.9,prestige:20,risk:1,access:12,availability:.94},
 6:{className:'Music Hall',crew:1.05,production:1.08,security:.88,logistics:1,prestige:28,risk:1.03,access:18,availability:.9},
 7:{className:'Amphitheater',crew:1.16,production:1.18,security:1.02,logistics:1.15,prestige:38,risk:1.12,access:28,availability:.78},
 8:{className:'Small Arena',crew:1.28,production:1.35,security:1.2,logistics:1.3,prestige:48,risk:1.08,access:36,availability:.72},
 2:{className:'Major Arena',crew:1.45,production:1.55,security:1.38,logistics:1.5,prestige:60,risk:1.1,access:48,availability:.65},
 9:{className:'Small Stadium',crew:1.7,production:1.9,security:1.65,logistics:1.8,prestige:72,risk:1.18,access:62,availability:.5},
 3:{className:'Major Stadium',crew:1.95,production:2.2,security:1.9,logistics:2.1,prestige:84,risk:1.22,access:76,availability:.38},
 10:{className:'Major Stadium+',crew:2.15,production:2.5,security:2.1,logistics:2.35,prestige:91,risk:1.28,access:86,availability:.3},
 11:{className:'Mega Stadium',crew:2.5,production:3,security:2.45,logistics:2.75,prestige:100,risk:1.35,access:94,availability:.18}
};
function V100_venueProfile(index){return V100_VENUE_CLASSES[index]||V100_VENUE_CLASSES[0]}
function V100_promoterConfidence(r){
 const p=V100_venueProfile(r.venue),m=careerWorldMarket(r.city),w=s.careerWorld||{};
 const regional=Math.min(30,Math.log10(1+Math.max(0,m.fans||0))*5),career=Math.min(28,(w.tourDemand||0)*.22),recognition=Math.min(22,(w.recognition||0)*.22),history=Math.min(14,(s.careerRecords?.tours?.length||0)*2),loyalty=Number.isFinite(Number(m.loyalty))?Number(m.loyalty):50,relation=Math.max(-8,Math.min(8,(loyalty-50)*.16)),scalePenalty=p.access*.45;
 /* Access is a difficulty curve, not a second 0–100 score to subtract outright. The old subtraction made Mega Stadium mathematically impossible even for a maxed global career. */
 return Math.round(clamp(regional+career+recognition+history+relation-scalePenalty,0,100));
}
function V100_venueAvailable(r){
 const p=V100_venueProfile(r.venue),confidence=V100_promoterConfidence(r),m=careerWorldMarket(r.city),heat=(m.sceneHeat??50)/100;
 if(r.venue===11&&confidence<22)return {available:false,confidence,reason:'Mega-stadium promoters will not currently underwrite this booking. Build tour demand, recognition and regional audience first.'};
 if(p.access>=62&&confidence<10)return {available:false,confidence,reason:'Local promoters will not currently approve this stadium-scale booking.'};
 const citySupply=clamp(p.availability+heat*.18,0,1);return {available:true,confidence,reason:confidence>=55?'Promoters view this as a strong booking.':confidence>=25?'Promoters see meaningful risk but will book it.':'Promoters consider this a speculative booking. You carry the downside.',citySupply};
}
function V100_venueIdentity(index){
 const p=V100_venueProfile(index),v=liveVenues[index];return `${p.className} · ${fmt(v.seats)} seats · prestige ${p.prestige}/100 · promoter threshold ${p.access}/100`;
}
const V100_tourStopEstimateOld=tourStopEstimate;
tourStopEstimate=function(r,route=tourRoute()){
 const n=V100_tourStopEstimateOld(r,route),p=V100_venueProfile(r.venue),booking=V100_venueAvailable(r),v=liveVenues[r.venue];
 const baseCrew=n.crew,baseProduction=n.production,baseSecurity=n.security,baseTravel=n.travel,baseLodging=n.lodging;
 n.crew=cents(baseCrew*p.crew);n.production=cents(baseProduction*p.production);n.security=cents(baseSecurity*p.security);n.travel=cents(baseTravel*p.logistics);n.lodging=cents(baseLodging*(.8+p.logistics*.2));
 n.fixed=cents(n.crew+n.production+n.security+n.travel+n.lodging+n.openerFee);n.cost=cents(n.fixed+n.variable);n.net=cents(n.gross-n.cost);
 const scale=Math.log10(Math.max(10,v.seats))/5,underwrite=(100-booking.confidence)/100;
 n.incidentRisk=clamp(n.incidentRisk*p.risk+scale*.018+underwrite*.025,.005,.32);n.promoterConfidence=booking.confidence;n.bookingReason=booking.reason;n.venuePrestige=p.prestige;n.venueClass=p.className;n.citySupply=booking.citySupply??0;n.available=booking.available;
 n.overreach=n.overreach||booking.confidence<20;return n;
};
function V100_venueForecast(r,route=tourRoute()){
 const n=tourStopEstimate(r,route);return `<section class="card"><span class="eyebrow">TOURING 2.1 · VENUE REALITY</span><h3>${esc(V100_venueIdentity(r.venue))}</h3>${profileRows([['Promoter confidence',n.promoterConfidence+'/100'],['Venue prestige',n.venuePrestige+'/100'],['Projected sell-through',Math.round(n.tickets/Math.max(1,n.capacity)*100)+'%'],['Incident exposure',Math.round(n.incidentRisk*1000)/10+'%'],['Crew',money(n.crew)],['Production',money(n.production)],['Security',money(n.security)],['Travel / logistics',money(n.travel)]])}<p>${esc(n.bookingReason)}</p></section>`;
}
const V100_editTourStopOld=editTourStop;
editTourStop=function(id=null){V100_editTourStopOld(id);const route=tourRoute(),r=route.find(x=>x.id===id);if(id!==null&&r&&$('modal')?.open)$('modal').innerHTML+=V100_venueForecast(r,route)};
const V100_saveTourStopOld=saveTourStop;
saveTourStop=function(e,id=null){
 const f=new FormData(e.target),r={id:id??s.touring.nextStop,city:String(f.get('city')),week:Number(f.get('week')),venue:Number(f.get('venue')),price:Number(f.get('price')),vip:Number(f.get('vip')),production:Number(f.get('production')),security:Number(f.get('security')),opener:f.get('opener')===''||f.get('opener')===null?null:Number(f.get('opener')),status:'scheduled'},booking=V100_venueAvailable(r),activeEdit=id!==null&&s.liveTour&&!s.liveTour.cancelled&&!s.liveTour.finished;
 /* Active-tour edits must still pass through the legacy upgrade confirmation/payment flow. Promoter gating applies to new draft bookings; it must not silently bypass a paid-tour confirmation path. */
 if(!booking.available&&!activeEdit){e.preventDefault();toast(booking.reason);return}
 if(!booking.available&&activeEdit)r.promoterWarning=booking.reason;
 return V100_saveTourStopOld(e,id)
};
const V100_tourRouteCardsOld=tourRouteCards;
tourRouteCards=function(route){return V100_tourRouteCardsOld(route).replace(/<section class="card"><span class="eyebrow">WEEK ([\s\S]*?)<\/section>/g,m=>m)};
const V100_tourPageOld=tourPage;
tourPage=function(){return V100_tourPageOld().replace('Regional fans, recent streams, local loyalty, city heat, ticket resistance and repeat visits shape demand.','Regional fans, recent streams, local loyalty, city heat, ticket resistance and repeat visits shape demand. Venue class now also changes promoter confidence, crew, production, security, logistics, prestige and incident exposure.')};
