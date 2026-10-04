 {id:'jacket',name:'Limited Artist Jacket',price:325,cost:105,energy:15,conversion:.00028,detail:'Prestige merch with lower volume and high margin.'},
 {id:'cap',name:'Embroidered Cap',price:55,cost:16,energy:8,conversion:.0012,detail:'Easy add-on item that travels well on tour.'},
 {id:'poster',name:'Numbered Tour Poster',price:35,cost:7,energy:7,conversion:.00145,detail:'Low-cost collectible that sells well around tour dates.'},
 {id:'jersey',name:'Artist Jersey',price:145,cost:47,energy:12,conversion:.00072,detail:'Premium apparel with strong visual branding and healthy margin.'},
 {id:'boxset',name:'Deluxe Collector Box',price:225,cost:82,energy:16,conversion:.00038,detail:'Music, booklet, signed insert and limited collectibles for core fans.'},
 {id:'photo',name:'Signed Photo Set',price:65,cost:9,energy:9,conversion:.0009,detail:'High-margin signed collectible with limited production capacity.'},
 {id:'fragrance',name:'Artist Fragrance',price:135,cost:38,energy:18,conversion:.00034,detail:'Lifestyle extension with stronger brand upside and higher inventory risk.'},
 {id:'chain',name:'Tour Jewelry Capsule',price:240,cost:88,energy:18,conversion:.00022,detail:'Small jewelry collection aimed at high-spend fans.'},
 {id:'sneaker',name:'Limited Sneaker Collab',price:275,cost:112,energy:20,conversion:.0002,detail:'Scarce fashion drop with high prestige, cost and sell-out potential.'},
 {id:'membership',name:'Annual Fan Membership',price:95,cost:12,energy:12,conversion:.00085,detail:'Digital membership bundle with exclusives, presales and recurring fan value.'}
];
function migrateEmpire(){
 if(!s.empire)s.empire={version:1,createdWeek:s.week,social:{},offers:[],assets:[],staff:[],catalogRights:{},taxLedger:[],artistViews:{},universeRelations:{},universePage:0,wealthHistory:[],lastTick:0,ancillaryWeek:{merch:0,media:0,brand:0}};
 const e=s.empire;
 if(!e.social)e.social={};
 for(const p of empirePlatforms)if(!e.social[p.id])e.social[p.id]={followers:Math.max(25,Math.round(s.fans*(.35+p.base*.08))),engagement:+(3.5+p.base*1.4).toFixed(1),sentiment:72,lastPostWeek:0,posts:0,lastGrowth:0,history:[]};
 e.offers??=[];e.assets??=[];e.staff??=[];e.catalogRights??={};e.taxLedger??=[];e.artistViews??={};e.universeRelations??={};e.wealthHistory??=[];e.ancillaryWeek??={merch:0,media:0,brand:0};
 for(const t of s.songs||[])if(t.released)ensureCatalogRight(t);
}
function empireStaff(role){migrateEmpire();const ids=new Set(s.empire.staff.map(x=>x.id));return empireStaffPool.filter(x=>ids.has(x.id)&&(role?x.role===role:true));}
function empireStaffBonus(role){const people=empireStaff(role);return people.length?Math.max(...people.map(x=>x.skill))/100:0;}
function socialInfluence(){migrateEmpire();const vals=empirePlatforms.map(p=>{const a=s.empire.social[p.id];return a.followers*(.35+a.engagement/20)*(a.sentiment/100)*p.base});return Math.round(vals.reduce((n,x)=>n+x,0));}
function socialFollowers(){migrateEmpire();return empirePlatforms.reduce((n,p)=>n+s.empire.social[p.id].followers,0);}
function featureGuests(track){const raw=Array.isArray(track?.features)&&track.features.length?track.features:(track?.feature?[track.feature]:[]);return raw.slice(0,6).map(g=>{const world=Number.isInteger(g.id)?s.world[g.id]:null;return world?{...g,name:world.name,fans:world.fans,genre:world.genre,relation:world.relation}:g}).filter(Boolean);}
function featureCreditText(track){const guests=featureGuests(track);return guests.length?'feat. '+guests.map(x=>esc(x.name)).join(', ')+' · ':'';}
function ensureCatalogRight(track){migrateEmpireBare();const key='song:'+track.id;if(s.empire.catalogRights[key])return s.empire.catalogRights[key];let contract=null;const all=[...(s.expansion?.contractHistory||[])];if(s.expansion?.contract)all.push(s.expansion.contract);contract=all.find(c=>track.released>=c.started&&track.released<=c.ends)||null;const labelPct=contract?clamp(contract.mastersLabelPct??(contract.type==='distribution'?10:contract.type==='360'?75:65),0,100):0;return s.empire.catalogRights[key]={kind:'song',id:track.id,title:track.title,artistPct:100-labelPct,labelPct,label:contract?.name||null,invested:contract?Math.round((contract.marketingBudget||0)/Math.max(1,contract.albumCommitment||1)):0,lastValue:0,history:[]};}
function migrateEmpireBare(){if(!s.empire)s.empire={version:1,createdWeek:s.week,social:{},offers:[],assets:[],staff:[],catalogRights:{},taxLedger:[],artistViews:{},universeRelations:{},universePage:0,wealthHistory:[],lastTick:0,ancillaryWeek:{merch:0,media:0,brand:0}};s.empire.catalogRights??={};}
function catalogTrackValue(track){const age=Math.max(1,s.week-(track.released||s.week)+1),weekly=track.streams||0,total=track.total||0,base=weekly*52*.5*4+total*.035;const peak=track.peak?1+Math.max(0,101-track.peak)/100*.55:1;const cert=track.certification?.milestone?1+Math.min(.65,track.certification.milestone/10000000*.65):1;const legacy=age>52?1.12:1;const momentum=weekly>0&&track.debutStreams?clamp(weekly/Math.max(1,track.debutStreams),.55,2.5):1;return Math.max(500,Math.round(base*peak*cert*legacy*(.8+momentum*.2)));}
function totalCatalogValue(){migrateEmpire();let n=0;for(const t of s.songs.filter(x=>x.released)){const r=ensureCatalogRight(t);r.lastValue=catalogTrackValue(t);n+=r.lastValue*r.artistPct/100}return Math.round(n);}
function assetValue(asset){return Math.max(0,Math.round(asset.value??asset.purchasePrice??0));}
function totalAssetValue(){migrateEmpire();return s.empire.assets.reduce((n,a)=>n+assetValue(a),0);}
function empireNetWorth(){return Math.round(s.cash+(s.finance?.reserve||0)+totalCatalogValue()+totalAssetValue());}
function empireRecordTax(kind,amount,detail){if(amount<=0)return;amount=cents(amount);s.empire.taxLedger.unshift({week:s.week,kind,amount,detail});s.empire.taxLedger=s.empire.taxLedger.slice(0,120);s.finance.taxesPaid=cents((s.finance.taxesPaid||0)+amount);}
function publishSocial(platformId,type='post'){migrateEmpire();const p=empirePlatforms.find(x=>x.id===platformId),a=s.empire.social[platformId];if(!p||!a||a.lastPostWeek===s.week)return;const energy=type==='livestream'?15:10;if(!spend(energy))return;const mgr=empireStaffBonus('Social Manager'),viral=level('viralAbility')/100,market=level('marketability')/100;let reach=Math.round((s.fans+250)*(p.base)*(1+mgr*.35)*(1+viral*.4)*rand(.55,1.6));let gained=Math.max(5,Math.round(reach*(.012+market*.022+a.engagement/1000)));if(type==='livestream')gained=Math.round(gained*1.35);a.followers+=gained;a.lastGrowth=gained;a.lastPostWeek=s.week;a.posts++;a.engagement=+clamp(a.engagement+rand(-.4,.8)+mgr*.3,1,25).toFixed(1);a.sentiment=Math.round(clamp(a.sentiment+rand(-2,3),30,100));log(p.name+': '+type+' gained '+compact(gained)+' followers.');render();toast(p.name+' +'+compact(gained)+' followers');}
function seededEmpire(slot,salt=0){let x=(slot+1)*2654435761+salt*1013904223;x^=x>>>16;x=Math.imul(x,2246822519);x^=x>>>13;return ((x>>>0)%1000000)/1000000;}
