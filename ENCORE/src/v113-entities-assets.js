/* ENCORE 0.9.11 — Entities & Assets 1.0.
   Adds fictionalized business structures, business-use asset classification,
   non-cash depreciation and adjusted-basis sale treatment. This is gameplay,
   not a representation of real tax law. */

const V113_ENTITY_TYPES={
 individual:{id:'individual',name:'Individual / Sole Operation',formation:0,weeklyAdmin:0,minFans:0,useCap:.50,assetCap:2,desc:'Simple and cheap. Best for early careers that do not need a large business-asset footprint.'},
 llc:{id:'llc',name:'Career LLC',formation:2500,weeklyAdmin:100,minFans:25000,useCap:.75,assetCap:8,desc:'Adds cleaner separation and room for a small touring or production asset base.'},
 entertainment:{id:'entertainment',name:'Entertainment Company',formation:20000,weeklyAdmin:500,minFans:250000,useCap:.90,assetCap:20,desc:'Built for a serious artist operation with multiple revenue streams and dedicated career assets.'},
 corporation:{id:'corporation',name:'Entertainment Corporation',formation:100000,weeklyAdmin:2500,minFans:2000000,useCap:1,assetCap:100,desc:'High administrative cost, but supports a large documented business-use asset portfolio.'},
 holding:{id:'holding',name:'Holding Company',formation:500000,weeklyAdmin:10000,minFans:20000000,useCap:1,assetCap:500,desc:'Late-game structure for very large ownership stacks. It prepares ENCORE for future multi-company and legacy systems.'}
};

function V113_entityState(){
 const p=V112_plan();
 if(!p.entity||!V113_ENTITY_TYPES[p.entity])p.entity='individual';
 if(!Array.isArray(p.entityHistory))p.entityHistory=[];
 return p
}
function V113_entity(){return V113_ENTITY_TYPES[V113_entityState().entity]||V113_ENTITY_TYPES.individual}
function V113_businessAssets(){migrateEmpire();return (s.empire.assets||[]).filter(a=>Number(a.businessUsePct||0)>0)}
function V113_entityEligible(id){const e=V113_ENTITY_TYPES[id];return !!e&&s.fans>=e.minFans}
function V113_entityAssetCapacity(id=V113_entity().id){const e=V113_ENTITY_TYPES[id]||V113_ENTITY_TYPES.individual;return e.assetCap}
function V113_entityUseCap(id=V113_entity().id){const e=V113_ENTITY_TYPES[id]||V113_ENTITY_TYPES.individual;return e.useCap}
function V113_entityWeeklyAdmin(){return Math.max(0,Number(V113_entity().weeklyAdmin||0))}

function V113_reviewEntity(id){
 const e=V113_ENTITY_TYPES[id];if(!e)return;
 const eligible=V113_entityEligible(id),current=V113_entity();
 modal(`<span class="eyebrow">BUSINESS STRUCTURE · SIMULATED</span><h2>${esc(e.name)}</h2>${profileRows([['Formation / restructure cost',money(e.formation)],['Weekly administration',money(e.weeklyAdmin)],['Documented business-use ceiling',Math.round(e.useCap*100)+'%'],['Business-use asset capacity',String(e.assetCap)],['Career requirement',e.minFans?compact(e.minFans)+' fans':'None'],['Current structure',current.name]])}<p>${esc(e.desc)}</p><p class="fine">ENCORE structures do not change the federal tax brackets. Their current gameplay effects are administration cost, documented business-use limits and asset capacity. These are fictionalized rules, not real entity or tax advice.</p><div class="controls"><button class="primary" ${eligible&&s.cash>=e.formation&&current.id!==id?'':'disabled'} onclick="V113_formEntity('${id}',true)">${current.id===id?'Already active':eligible?s.cash>=e.formation?'Form / restructure':'Insufficient cash':'Career not eligible'}</button><button class="secondary" onclick="$('modal').close()">Cancel</button></div>`)
}
function V113_formEntity(id,confirmed=false){
 const e=V113_ENTITY_TYPES[id],state=V113_entityState(),current=V113_entity();if(!e||current.id===id)return false;
 if(!V113_entityEligible(id)){toast?.('Your career is not large enough for that structure yet.');return false}
 if(s.cash<e.formation){toast?.('You need '+money(e.formation)+' in spendable cash.');return false}
 if(!confirmed){V113_reviewEntity(id);return false}
 if(e.formation){changeCash(-e.formation);moneyEvent?.('Business structure filing · '+e.name,-e.formation)}
 state.entity=id;state.entityHistory.unshift({week:s.week,from:current.id,to:id,cost:e.formation});state.entityHistory=state.entityHistory.slice(0,30);$('modal')?.close?.();queueSave?.();render();toast?.(e.name+' is now your active business structure.');return true
}

/* Career-specific physical assets. They use the existing Wealth market and
   remain real cash purchases; only the documented business-use portion enters
   depreciation over time. */
const V113_NEW_ASSETS=[
 {id:'tourvan',name:'Touring Sprinter',kind:'Cars',price:95000,drift:-.01,vol:.02,icon:'car',businessEligible:true,usefulLifeWeeks:260,desc:'A dedicated touring van for regional routing, equipment and crew movement.'},
 {id:'tourcoach',name:'Tour Coach',kind:'Cars',price:850000,drift:-.008,vol:.025,icon:'car',businessEligible:true,usefulLifeWeeks:364,desc:'A full touring coach for large routing schedules and road operations.'},
 {id:'studio-loft',name:'Recording Studio Loft',kind:'Property',price:1800000,drift:.0018,vol:.02,icon:'house',rent:0,businessEligible:true,usefulLifeWeeks:1040,desc:'A dedicated recording and production property. Business-use classification can create non-cash depreciation.'},
 {id:'creative-hq',name:'Creative Headquarters',kind:'Property',price:8000000,drift:.0015,vol:.025,icon:'house',rent:0,businessEligible:true,usefulLifeWeeks:1040,desc:'A large office, rehearsal and production campus for an established entertainment operation.'}
];
for(const x of V113_NEW_ASSETS)if(!wealthItems.some(a=>a.id===x.id))wealthItems.push(x);

function V113_assetUseLabel(a){const p=Math.round(Number(a?.businessUsePct||0)*100);return p<=0?'Personal':p>=100?'Business':`Mixed use · ${p}% business`}
function V113_assetBusinessCap(x){return x?.businessEligible?V113_entityUseCap():0}
function V113_businessAssetSlotsRemaining(){return Math.max(0,V113_entityAssetCapacity()-V113_businessAssets().length)}
function V113_depreciableBasis(a){return Math.max(0,cents(Number(a?.basis||0)*clamp(Number(a?.businessUsePct||0),0,1)))}
function V113_adjustedBasis(a){return Math.max(0,cents(Number(a?.basis||0)-Number(a?.depreciationClaimed||0)))}

const V113_assetDetailBase=assetDetail;
assetDetail=function(id){
 if(marketInstrument(id)){tradeForm(id);return}
 const x=wealthItems.find(a=>a.id===id);if(!x?.businessEligible)return V113_assetDetailBase(id);
 const tax=x.kind==='Property'?.02:.08,cap=V113_assetBusinessCap(x),slots=V113_businessAssetSlotsRemaining();
 modal(`${assetPhoto(x)}<span class="eyebrow">BUSINESS-USE ELIGIBLE · ${esc(V113_entity().name.toUpperCase())}</span><h2>${esc(x.name)}</h2><p>${esc(x.desc)}</p>${profileRows([['Price per unit',money(x.price)],['Purchase tax',tax*100+'%'],['Current structure',V113_entity().name],['Maximum documented business use',Math.round(cap*100)+'%'],['Business-asset slots remaining',String(slots)],['Depreciation period',Math.round((x.usefulLifeWeeks||260)/52)+' years']])}<form class="form" onsubmit="V113_reviewBusinessAssetBuy(event,'${id}')"><label>Quantity<input name="qty" type="number" min="1" max="100" step="1" value="1" required></label><label>Use classification<select name="use"><option value="personal">Personal · no depreciation</option><option value="mixed">Mixed use</option><option value="business">Business use</option></select></label><label>Documented business use %<input name="pct" type="number" min="0" max="${Math.round(cap*100)}" step="5" value="${Math.round(Math.min(.5,cap)*100)}"></label><button class="primary">Review purchase</button></form><p class="fine">A business classification does not make the purchase price immediately deductible. ENCORE depreciates the documented business-use basis over the asset’s simulated useful life.</p>`)
};

function V113_reviewBusinessAssetBuy(event,id){
 event.preventDefault();const x=wealthItems.find(a=>a.id===id&&a.businessEligible),f=new FormData(event.target),qty=Number(f.get('qty')),use=String(f.get('use')||'personal');if(!labelActive()||!x||!Number.isInteger(qty)||qty<1||qty>100)return;
 let pct=use==='personal'?0:clamp(Number(f.get('pct')||0)/100,0,V113_assetBusinessCap(x));if(use==='business')pct=V113_assetBusinessCap(x);
 if(pct>0&&V113_businessAssetSlotsRemaining()<qty){toast?.('Your current business structure does not have enough business-asset capacity.');return}
 const subtotal=x.price*qty,tax=subtotal*(x.kind==='Property'?.02:.08);pendingAsset={id,qty,subtotal,tax,total:cents(subtotal+tax),taxUse:pct<=0?'personal':pct>=.999?'business':'mixed',businessUsePct:pct,usefulLifeWeeks:x.usefulLifeWeeks||260};
 modal(`<span class="eyebrow">ASSET ACQUISITION · CLASSIFICATION REVIEW</span><h2>${qty} × ${esc(x.name)}</h2>${profileRows([['Purchase',money(subtotal)],['Purchase tax',money(tax)],['Total cash required',money(subtotal+tax)],['Use classification',pct<=0?'Personal':pct>=.999?'Business':`Mixed · ${Math.round(pct*100)}% business`],['Initial depreciable basis',money((subtotal+tax)*pct)],['Useful life',Math.round((x.usefulLifeWeeks||260)/52)+' years']])}<p>5 energy. The purchase itself is not an immediate career deduction. Only simulated depreciation on the documented business-use basis is deducted over time.</p><button class="primary" onclick="confirmAssetBuy()">Pay & acquire</button><button class="secondary" onclick="$('modal').close()">Cancel</button>`)
}

const V113_confirmAssetBuyBase=confirmAssetBuy;
confirmAssetBuy=function(){
 const p=pendingAsset;if(!p||p.businessUsePct===undefined)return V113_confirmAssetBuyBase();if(!labelActive())return;if(s.cash<p.total){toast('Not enough spendable cash.');return}if(!spend(5))return;
 const x=wealthItems.find(a=>a.id===p.id);if(!x)return;changeCash(-p.total);s.empire.assets.push({id:s.empire.nextId++,item:p.id,name:x.name,kind:x.kind,city:x.kind==='Property'?s.scene.city:null,qty:p.qty,basis:p.total,value:p.subtotal,condition:['Stocks','Bonds','Crypto'].includes(x.kind)?null:100,tenant:null,rent:(x.rent||0)*p.qty,arrears:0,renovated:0,taxUse:p.taxUse,businessUsePct:p.businessUsePct,usefulLifeWeeks:p.usefulLifeWeeks,depreciationClaimed:0});moneyEvent('Purchased '+x.name,-p.total);pendingAsset=null;$('modal').close();render()
};

function V113_weeklyDepreciation(){
 let total=0;
 for(const a of V113_businessAssets()){
  const max=V113_depreciableBasis(a),life=Math.max(52,Number(a.usefulLifeWeeks||260)),claimed=Math.max(0,Number(a.depreciationClaimed||0)),remaining=Math.max(0,max-claimed),weekly=Math.min(remaining,cents(max/life));
  if(weekly>0){a.depreciationClaimed=cents(claimed+weekly);total+=weekly}
 }
 return cents(total)
}
function V113_entityAdminFee(){return V113_entity().id==='individual'?0:V113_entityWeeklyAdmin()}

/* Depreciation is a non-cash deduction. Entity administration is a real cash
   expense. Both flow through the existing taxable-income foundation. */
const V113_closeFinancesBase=closeFinances;
closeFinances=function(royalties,rate){
 migrateFinance?.();const depreciation=V113_weeklyDepreciation(),admin=V113_entityAdminFee();if(!s.finance.week||typeof s.finance.week!=='object')s.finance.week={wages:0,live:0,expenses:0};
 if(depreciation||admin)s.finance.week.expenses=cents((Number(s.finance.week.expenses)||0)+depreciation+admin);
 const report=V113_closeFinancesBase(royalties,rate);
 if(admin){changeCash(-admin);report.entityAdminFee=admin;report.cash=s.cash;moneyEvent?.(V113_entity().name+' administration',-admin)}
 report.depreciationDeduction=depreciation;report.entityStructure=V113_entity().name;report.businessAssetCount=V113_businessAssets().length;
 if(report.deductibleBreakdown){const cpa=Math.max(0,Number(report.taxAdvisorFee||0));report.deductibleBreakdown.depreciation=depreciation;report.deductibleBreakdown.entityAdministration=admin;report.deductibleBreakdown.taxAdvisor=cpa;report.deductibleBreakdown.actions=Math.max(0,Number(report.deductibleBreakdown.actions||0)-depreciation-admin-cpa)}
 return report
};

/* Depreciation lowers adjusted basis, so selling a depreciated business-use
   asset can create a larger taxable gain. */
const V113_sellAssetBase=sellAsset;
sellAsset=function(id,confirmed=false){
 const a=s.empire.assets.find(x=>x.id===id);if(!a||!Number(a.depreciationClaimed||0))return V113_sellAssetBase(id,confirmed);if(!labelActive()||a.tenant)return;if(marketInstrument(a.item)){tradeForm(a.item,'sell');return}
 const proceeds=cents(a.value*.98),adjusted=V113_adjustedBasis(a),gain=cents(proceeds-adjusted);
 if(!confirmed){modal(`<span class="eyebrow">BUSINESS ASSET SALE · TAX BASIS</span><h2>Sell ${esc(a.name)}?</h2>${profileRows([['Proceeds after 2% fee',money(proceeds)],['Original cost basis',money(a.basis)],['Depreciation claimed','−'+money(a.depreciationClaimed||0)],['Adjusted tax basis',money(adjusted)],['Taxable gain / loss',money(gain)]])}<p>5 energy. Depreciation already reduced taxable income during ownership, so claimed depreciation also reduces the basis used to calculate the sale gain.</p><button class="primary" onclick="sellAsset(${id},true)">Confirm sale</button>`);return}
 if(!spend(5))return;changeCash(proceeds);s.finance.week.investment=cents((s.finance.week.investment||0)+gain);s.empire.assets=s.empire.assets.filter(x=>x.id!==id);moneyEvent('Sold '+a.name,proceeds);$('modal').close();render()
};

const V113_recapRowsBase=V103_recapRows;
V103_recapRows=function(r){
 const out=V113_recapRowsBase(r),dep=Math.max(0,Number(r?.depreciationDeduction||0)),admin=Math.max(0,Number(r?.entityAdminFee||0));if(!dep&&!admin)return out;
 const i=out.expenses.findIndex(([k])=>k==='Actions & projects');if(i>=0){const remaining=Math.max(0,Number(out.expenses[i][1]||0)-dep-admin);if(remaining)out.expenses[i][1]=remaining;else out.expenses.splice(i,1)}
 if(admin)out.expenses.push(['Business structure administration',admin]);if(dep)out.expenses.push(['Non-cash depreciation',dep]);return out
};

const V113_financeRowsBase=financeRows;
financeRows=function(r,full=false){
 let rows=V113_financeRowsBase(r,full),dep=Math.max(0,Number(r?.depreciationDeduction||0)),admin=Math.max(0,Number(r?.entityAdminFee||0));
 if(dep||admin){
  const i=rows.findIndex(([k])=>k==='CAREER EXPENSE · Actions & projects'),remaining=Math.max(0,Number(r.actionExpenses||0)-Number(r.labelPayroll||0)-Number(r.taxAdvisorFee||0)-dep-admin);
  if(i>=0){if(remaining)rows[i]=['CAREER EXPENSE · Actions & projects','−'+money(remaining)];else rows.splice(i,1)}
  const at=rows.findIndex(([k])=>k.startsWith('TAXABLE ·')),add=[];if(admin)add.push(['CAREER EXPENSE · Entity administration','−'+money(admin)]);if(dep)add.push(['TAX DEDUCTION · Non-cash depreciation','−'+money(dep)]);rows.splice(at<0?rows.length:at,0,...add)
 }
 if(full){const at=rows.findIndex(([k])=>k.startsWith('TAX PLAN ·'));rows.splice(at<0?rows.length:at,0,['BUSINESS STRUCTURE',r.entityStructure||V113_entity().name],['BUSINESS-USE ASSETS',String(r.businessAssetCount??V113_businessAssets().length)])}
 return rows
};

function V113_entityCard(){
 const current=V113_entity(),assets=V113_businessAssets(),claimed=assets.reduce((n,a)=>n+Math.max(0,Number(a.depreciationClaimed||0)),0);
 return `<section class="card v113-entity-card"><header><div><span class="eyebrow">ENTITY & ASSET PLANNING · SIMULATED</span><h2>${esc(current.name)}</h2><p>${esc(current.desc)}</p></div><div><small>BUSINESS-USE ASSETS</small><strong>${assets.length} / ${current.assetCap}</strong><span>${money(claimed)} depreciation claimed to date</span></div></header><div class="v113-entity-grid">${Object.values(V113_ENTITY_TYPES).map(e=>`<button class="${current.id===e.id?'selected':''}" onclick="V113_reviewEntity('${e.id}')"><span>${esc(e.name)}</span><strong>${money(e.weeklyAdmin)}/wk admin</strong><small>${Math.round(e.useCap*100)}% use ceiling · ${e.assetCap} assets${e.minFans?' · '+compact(e.minFans)+' fans':''}</small></button>`).join('')}</div><p class="fine">Structures do not change ENCORE’s tax brackets. Business-use depreciation only applies to eligible assets and lowers adjusted basis for a later sale.</p></section>`
}
function V113_businessAssetPanel(){
 const assets=V113_businessAssets();if(!assets.length)return `<section class="card v113-business-assets"><span class="eyebrow">BUSINESS ASSETS</span><h2>No depreciable career assets yet.</h2><p>Touring vehicles and dedicated studio / headquarters properties can be classified for personal, mixed or business use when purchased.</p></section>`;
 return `<section class="card v113-business-assets"><span class="eyebrow">BUSINESS ASSETS · TAX BASIS</span><h2>${assets.length} documented asset${assets.length===1?'':'s'}</h2>${assets.map(a=>`<div class="project-row"><div><strong>${esc(a.name)}</strong><small>${esc(V113_assetUseLabel(a))} · Basis ${money(a.basis)} · Claimed ${money(a.depreciationClaimed||0)} · Adjusted ${money(V113_adjustedBasis(a))}</small></div><button class="secondary" onclick="holdingDetail(${a.id})">Manage</button></div>`).join('')}</section>`
}

const V113_financeScreenBase=financeScreen;
financeScreen=function(){V113_entityState();return V113_entityCard()+V113_financeScreenBase()};
const V113_wealthInventoryBase=wealthInventory;
wealthInventory=function(){V113_entityState();return V113_businessAssetPanel()+V113_wealthInventoryBase()};
