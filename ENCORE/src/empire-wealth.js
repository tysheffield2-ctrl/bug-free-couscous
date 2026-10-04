/* ENCORE Empire · wealth, investments, assets, appreciation and taxable gains */
const empireAssetCatalog=[
{id:'car-apex',category:'Cars',name:'Apex R12',price:428000,annualCost:31000,mean:-.09,vol:.14,prestige:12,icon:'car',description:'Limited-production supercar. Huge image boost, steep early depreciation.'},
{id:'car-vanta',category:'Cars',name:'Vanta Executive GT',price:186000,annualCost:15000,mean:-.07,vol:.08,prestige:7,icon:'car',description:'Executive grand tourer with understated status and lower carrying costs.'},
{id:'car-heritage',category:'Cars',name:'Heritage 88',price:780000,annualCost:22000,mean:.035,vol:.12,prestige:15,icon:'car',description:'Collector coupe with a thin resale market. Scarcity can make it appreciate.'},
{id:'jewel-ice',category:'Jewelry',name:'Icefall Diamond Chain',price:165000,annualCost:1800,mean:.015,vol:.08,prestige:9,icon:'diamond',description:'High-jewelry statement piece. Holds value better than ordinary retail jewelry.'},
{id:'jewel-watch',category:'Jewelry',name:'Crown Perpetual Tourbillon',price:295000,annualCost:2400,mean:.025,vol:.07,prestige:11,icon:'watch',description:'Complicated collector watch with prestige and long-term scarcity potential.'},
{id:'jewel-ring',category:'Jewelry',name:'Aurora Pink Diamond',price:1250000,annualCost:6000,mean:.045,vol:.1,prestige:18,icon:'diamond',description:'Investment-grade colored diamond with high insurance costs and limited supply.'},
{id:'home-hills',category:'Homes',name:'Hollywood Hills Modern',price:6800000,annualCost:188000,mean:.038,vol:.09,prestige:16,icon:'home',description:'Architectural hillside estate with privacy, views, taxes and maintenance.'},
{id:'home-malibu',category:'Homes',name:'Malibu Ocean Estate',price:14800000,annualCost:430000,mean:.045,vol:.1,prestige:22,icon:'home',description:'Oceanfront trophy property. Rare land supports value while carrying costs stay brutal.'},
{id:'home-penthouse',category:'Homes',name:'Manhattan Sky Penthouse',price:22500000,annualCost:690000,mean:.035,vol:.08,prestige:25,icon:'home',description:'Full-floor penthouse built for celebrity visibility and global-city scarcity.'},
{id:'art-no17',category:'Art',name:'Untitled No. 17',price:860000,annualCost:7000,mean:.06,vol:.2,prestige:10,icon:'art',description:'Contemporary canvas from a rising fictional artist. Illiquid and capable of huge swings.'},
{id:'art-blue',category:'Art',name:'Blue Room, 1998',price:3400000,annualCost:19000,mean:.055,vol:.15,prestige:15,icon:'art',description:'Museum-grade modern work with stronger provenance and a deeper collector market.'},
{id:'art-master',category:'Art',name:'The Last Summer',price:12200000,annualCost:55000,mean:.04,vol:.11,prestige:24,icon:'art',description:'Blue-chip masterpiece. Lower volatility than emerging art, but buyers are rare.'},
{id:'stock-index',category:'Stocks',name:'US Broad Market Fund',price:1000,annualCost:0,mean:.08,vol:.17,yield:.014,liquid:true,icon:'stocks',description:'Diversified fictional equity fund. Market-priced, liquid and volatile.'},
{id:'stock-tech',category:'Stocks',name:'Future Systems Basket',price:1000,annualCost:0,mean:.11,vol:.29,yield:.004,liquid:true,icon:'stocks',description:'High-growth technology basket with stronger upside and much larger drawdowns.'},
{id:'bond-treasury',category:'Bonds',name:'Treasury Ladder',price:1000,annualCost:0,mean:.025,vol:.035,yield:.042,liquid:true,icon:'bonds',description:'Low-volatility government bond ladder generating dependable interest.'},
{id:'bond-corp',category:'Bonds',name:'Investment Grade Credit',price:1000,annualCost:0,mean:.035,vol:.07,yield:.055,liquid:true,icon:'bonds',description:'Corporate bond portfolio. More income and risk than government debt.'},
{id:'crypto-bit',category:'Crypto',name:'BitCore',price:1000,annualCost:0,mean:.12,vol:.72,yield:0,liquid:true,icon:'crypto',description:'Highly volatile fictional crypto asset. Price can move violently in either direction.'},
{id:'crypto-ether',category:'Crypto',name:'EtherGrid',price:1000,annualCost:0,mean:.1,vol:.8,yield:.012,liquid:true,icon:'crypto',description:'Programmable-network token with extreme volatility and modest staking yield.'},
{id:'re-multifamily',category:'Real Estate',name:'Sunbelt Multifamily Fund',price:1000,annualCost:0,mean:.055,vol:.1,yield:.052,liquid:true,icon:'building',description:'Fractional apartment portfolio producing rental income and property appreciation.'},
{id:'re-commercial',category:'Real Estate',name:'Prime Commercial Fund',price:1000,annualCost:0,mean:.045,vol:.14,yield:.061,liquid:true,icon:'building',description:'Office, retail and logistics portfolio with higher cash yield and economic sensitivity.'}
];
function empireNormal(r){return (r()+r()+r()+r()+r()+r()-3)/1.225}
function empireAsset(id){return empireAssetCatalog.find(x=>x.id===id)}
function empirePortfolioValue(){migrateEmpire();return s.empire.holdings.reduce((n,h)=>n+(h.value||0),0)}
function empireNetWorth(){migrateEmpire();return Math.round(s.cash+(s.finance?.reserve||0)+empirePortfolioValue()+(typeof empireCatalogValue==='function'?empireCatalogValue(true):0))}
function empireBuyAsset(id,amount){
 migrateEmpire();const a=empireAsset(id);if(!a)return false;const invest=a.liquid?Math.max(100,Math.floor(Number(amount)||0)):a.price;
 if(!a.liquid&&s.empire.holdings.some(h=>h.assetId===id)){toast('You already own this item.');return false}
 if(!Number.isFinite(invest)||invest<=0||s.cash<invest){toast('Not enough cash for that purchase.');return false}
 changeCash(-invest);s.empire.holdings.push({id:id+'-'+Date.now(),assetId:id,basis:invest,value:invest,boughtWeek:s.week,units:a.liquid?invest/a.price:1,lastValue:invest});log('Purchased '+a.name+' for '+money(invest)+'.');render();return true
}
function empireSellHolding(id){
 migrateEmpire();const i=s.empire.holdings.findIndex(h=>h.id===id);if(i<0)return;const h=s.empire.holdings[i],a=empireAsset(h.assetId),proceeds=Math.max(0,Math.round(h.value*100)/100),gain=Math.max(0,proceeds-h.basis);
 s.empire.holdings.splice(i,1);changeCash(proceeds);if(gain){recordIncome('wages',gain);s.empire.realizedGains=cents((s.empire.realizedGains||0)+gain)}log('Sold '+a.name+' for '+money(proceeds)+(gain?' with '+money(gain)+' taxable gain.':'.'));render()
}
function empireMarketWeek(){
 migrateEmpire();const e=s.empire;if(e.lastMarketWeek===s.week)return;e.lastMarketWeek=s.week;let income=0,costs=0;
 for(const h of e.holdings){const a=empireAsset(h.assetId);if(!a)continue;h.lastValue=h.value;const r=empireRandom(empireHash(h.id+'-'+s.week)),move=clamp(1+(a.mean||0)/52+empireNormal(r)*(a.vol||0)/Math.sqrt(52),.55,1.7);h.value=Math.max(1,Math.round(h.value*move*100)/100);if(a.yield)income=cents(income+h.value*a.yield/52);if(a.annualCost)costs=cents(costs+a.annualCost/52)}
 if(income){changeCash(income);recordIncome('wages',income)}
 if(costs){changeCash(-costs);s.finance.week.expenses=cents(s.finance.week.expenses+costs)}
 e.lastAssetCashflow={week:s.week,income,carrying:costs}
}
function empireInvestmentAmount(id){
 const a=empireAsset(id);if(!a)return;modal('<div class="eyebrow">'+esc(a.category)+'</div><h2>'+esc(a.name)+'</h2><p>'+esc(a.description)+'</p><form class="form" onsubmit="empireConfirmInvestment(event,\''+a.id+'\')"><label>Amount to invest ($)<input name="amount" type="number" min="100" step="100" max="'+Math.max(100,Math.floor(s.cash))+'" value="'+Math.min(10000,Math.max(100,Math.floor(s.cash)))+'" required></label><p class="fine">Market value can rise or fall. Dividends, bond interest and rental distributions are taxable income when paid.</p><button class="primary">Invest</button></form>')
}
function empireConfirmInvestment(e,id){e.preventDefault();const amount=Number(new FormData(e.target).get('amount'));if(empireBuyAsset(id,amount))$('modal').close()}
