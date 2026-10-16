/* ENCORE 0.9.9 — Tax Foundation 2.0.
   Gameplay-first progressive taxes, explicit taxable-income movement and a
   planning snapshot. This is a fictionalized game economy, not tax advice. */

const V111_TAX_BRACKETS=[
  {width:25000,rate:0,label:'$0–$25K'},
  {width:75000,rate:.08,label:'$25K–$100K'},
  {width:400000,rate:.15,label:'$100K–$500K'},
  {width:1500000,rate:.22,label:'$500K–$2M'},
  {width:8000000,rate:.27,label:'$2M–$10M'},
  {width:Infinity,rate:.32,label:'$10M+'}
];
const V111_REGIONAL_CAP=.04;
const V111_MARGINAL_CAP=.36;

function V111_num(v){const n=Number(v);return Number.isFinite(n)?n:0}
function V111_baseTax(profit){
 let remaining=Math.max(0,V111_num(profit)),tax=0;
 for(const b of V111_TAX_BRACKETS){const slice=Math.min(remaining,b.width);tax+=slice*b.rate;remaining-=slice;if(remaining<=0)break}
 return cents(tax)
}
function V111_federalMarginalRate(profit){
 let remaining=Math.max(0,V111_num(profit));
 for(const b of V111_TAX_BRACKETS){if(remaining<=b.width)return b.rate;remaining-=b.width}
 return .32
}
function V111_regionalRate(){return clamp(V111_num(V100_cityEconomics()?.taxAdj),0,V111_REGIONAL_CAP)}

/* Replace the old high-rate curve without rewriting the rest of the finance
   engine. Existing year-to-date revenue/expense accounting remains authoritative. */
V100_baseTax=V111_baseTax;
V091_marginalTaxRate=V111_federalMarginalRate;
V100_locationTaxRate=function(base){return clamp(V111_num(base)+V111_regionalRate(),0,V111_MARGINAL_CAP)};
V100_taxQuote=function(profit){
 const p=Math.max(0,V111_num(profit)),rawCity=V100_cityEconomics(),regionalRate=V111_regionalRate(),base=V111_baseTax(p),regional=cents(p*regionalRate),total=cents(Math.max(0,base+regional));
 return {base,regional,total,effective:p?clamp(total/p,0,1):0,marginal:clamp(V111_federalMarginalRate(p)+regionalRate,0,V111_MARGINAL_CAP),city:{...rawCity,rawTaxAdj:rawCity.taxAdj,taxAdj:regionalRate}}
};

function V111_repFees(r){return Array.isArray(r?.representation)?r.representation.reduce((n,x)=>n+Math.max(0,V111_num(x.fee)),0):Math.max(0,V111_num(r?.agentFee))}
function V111_weekTaxBreakdown(r={}){
 const gross=Math.max(0,V111_num(r.revenue)),contractual=Math.max(0,V111_num(r.labelCut))+V111_repFees(r),labelPayroll=Math.max(0,V111_num(r.labelPayroll)),actions=Math.max(0,V111_num(r.actionExpenses)-labelPayroll),operations=Math.max(0,V111_num(r.operatingCost)),explicit=contractual+labelPayroll+actions+operations,deductions=Math.max(explicit,Math.max(0,V111_num(r.expenses))),other=Math.max(0,deductions-explicit),taxable=Math.max(0,cents(gross-deductions));
 return {gross,contractual,labelPayroll,actions,operations,other,deductions,taxable}
}

/* Preserve all existing finance settlement behavior, then attach a readable
   tax basis to the immutable week-close report. */
const V111_closeFinancesBase=closeFinances;
closeFinances=function(royalties,rate){
 const report=V111_closeFinancesBase(royalties,rate),b=V111_weekTaxBreakdown(report);
 report.weekGrossIncome=b.gross;
 report.deductibleExpenses=b.deductions;
 report.deductibleBreakdown={contractual:b.contractual,labelPayroll:b.labelPayroll,actions:b.actions,operations:b.operations,other:b.other};
 report.weekTaxableIncome=b.taxable;
 report.ytdTaxableIncome=Math.max(0,V111_num(report.taxableProfit));
 report.estimatedTaxLiability=V100_taxQuote(report.ytdTaxableIncome).total;
 report.taxModel='ENCORE Tax Foundation 2.0';
 return report
};

function V111_taxBracketLabel(income){
 let remaining=Math.max(0,V111_num(income));
 for(const b of V111_TAX_BRACKETS){if(remaining<=b.width)return `${b.label} · ${Math.round(b.rate*100)}% federal marginal`;remaining-=b.width}
 return '$10M+ · 32% federal marginal'
}
function V111_taxPlanningSnapshot(){
 const f=s.finance||{},gross=Math.max(0,V111_num(f.revenue)),deductions=Math.max(0,V111_num(f.expenses)),taxable=Math.max(0,cents(gross-deductions)),quote=V100_taxQuote(taxable),reserve=Math.max(0,V111_num(f.reserve));
 return {gross,deductions,taxable,quote,reserve,gap:cents(quote.total-reserve)}
}
function V111_taxPlanningCard(){
 const p=V111_taxPlanningSnapshot(),regional=Math.round((p.quote.city?.taxAdj||0)*1000)/10;
 return `<section class="card v111-tax-planning"><span class="eyebrow">TAX PLANNING · SIMULATED</span><h2>What ENCORE is actually taxing.</h2>${profileRows([['Year-to-date gross income',money(p.gross)],['Eligible career deductions','−'+money(p.deductions)],['Estimated taxable income',money(p.taxable)],['Estimated tax liability',money(p.quote.total)],['Tax reserve held',money(p.reserve)],['Current federal bracket',V111_taxBracketLabel(p.taxable)],['Regional addition',regional.toFixed(1)+' pts'],['Current marginal rate',V091_pct(p.quote.marginal)]])}<p>Taxes are calculated on estimated taxable income after recorded career expenses and contractual business deductions — not on every dollar of gross revenue. Regional tax adds 0–4 percentage points, and ENCORE caps the simulated marginal rate at 36%.</p><p class="fine">This is fictionalized gameplay accounting, not a real tax return or tax advice. Deeper entity planning, depreciation, CPA strategy and charitable planning belong to later Tax & Wealth phases.</p></section>`
}

const V111_taxExplainerBase=V100_taxExplainer;
V100_taxExplainer=function(){
 const city=sceneCities.find(c=>c.id===s.scene?.city),e=V100_cityEconomics(),regional=V111_regionalRate();
 return `<section class="card"><span class="eyebrow">LOCATION ECONOMICS · SIMULATED</span><h2>${esc(city?.name||'Austin, Texas')}</h2>${profileRows([['Regional tax addition',Math.round(regional*1000)/10+' pts'],['Cost-of-living index',e.cost+'/100 baseline'],['Industry access',e.access+'/100'],['Maximum simulated marginal rate','36.0%']])}<p>Low-tax locations can have a 0-point regional addition; higher-tax locations add up to 4 points. ENCORE uses fictionalized game economics, not tax advice or a real tax return.</p></section>`
};

const V111_financeScreenBase=financeScreen;
financeScreen=function(){return V111_taxPlanningCard()+V111_financeScreenBase()};

/* Make the full report explain the taxable base without double-counting any
   income or deductions. */
const V111_financeRowsBase=financeRows;
financeRows=function(r,full=false){
 const rows=V111_financeRowsBase(r,full);if(!full)return rows;
 const b=V111_weekTaxBreakdown(r),marker=rows.findIndex(([k])=>k.startsWith('TAX INFO ·'));
 const at=marker<0?rows.length:marker;
 rows.splice(at,0,['TAXABLE · Gross income this week',money(b.gross)],['TAXABLE · Eligible deductions','−'+money(b.deductions)],['TAXABLE · Income subject to tax',money(b.taxable)]);
 return rows
};

function V111_weekRecap(completed,count,added,debut,financial,earned=[]){
 const label=V083_weekDate(completed),next=V083_weekDate(completed+1),rows=V103_recapRows(financial),gross=Math.max(0,financial.revenue||0),contractual=rows.contractual.reduce((n,x)=>n+Math.abs(x[1]||0),0),expenses=rows.expenses.reduce((n,x)=>n+Math.abs(x[1]||0),0),tax=Math.abs(financial.taxReserve||0),kept=financial.net||0,b=V111_weekTaxBreakdown(financial),parts=[['CONTRACTS',contractual],['CAREER COSTS',expenses],['TAX RESERVE',tax],['YOU KEPT',Math.max(0,kept)]],den=Math.max(1,gross),feedCount=s.feed.filter(x=>x.week===completed).length,regional=Math.round((financial.regionalTaxAdjustment||0)*1000)/10;
 modal(`<article class="v103-recap"><header class="v103-recap-cover"><span>ENCORE / WEEKLY CAREER REPORT</span><small>${esc(label)}</small><h1>${compact(count)} streams.</h1><p class="${added>=0?'up':'down'}">${added>=0?'+':''}${compact(added)} net fans this week</p></header><section class="v103-recap-score">${[['GROSS INCOME',money(gross)],['TAXABLE INCOME',money(b.taxable)],['YOU KEPT',money(kept)],['SPENDABLE CASH',money(financial.cash||0)]].map(([k,v])=>`<div><span>${k}</span><strong>${v}</strong></div>`).join('')}</section><div class="v103-recap-grid"><main>${V103_recapSection('01 / GROSS INCOME',rows.income)}${V103_recapSection('02 / CONTRACTUAL DISTRIBUTION',rows.contractual,true)}${V103_recapSection('03 / CAREER EXPENSES',rows.expenses,true)}<section class="v103-recap-ledger"><header>04 / TAXABLE INCOME MOVEMENT</header><div><span>Gross income</span><strong>${money(b.gross)}</strong></div><div><span>Eligible contractual + career deductions</span><strong>−${money(b.deductions)}</strong></div><div><span>Income subject to tax this week</span><strong>${money(b.taxable)}</strong></div><p>ENCORE taxes estimated taxable income after recorded deductible career costs rather than taxing gross income directly.</p></section><section class="v103-recap-ledger tax"><header>05 / TAX RESERVE</header><div><span>${financial.taxReserve<0?'Reserve returned':'Reserve change this week'}</span><strong>${financial.taxReserve<0?'+':'−'}${money(tax)}</strong></div><div><span>Estimated effective rate</span><strong>${V091_pct(financial.effectiveTaxRate||0)}</strong></div><div><span>Current marginal rate</span><strong>${V091_pct(financial.marginalTaxRate||0)}</strong></div><div><span>Regional addition</span><strong>${regional.toFixed(1)} pts</strong></div>${financial.yearEnd?`<p>Tax year settled: ${money(financial.settlement)} paid from the accumulated reserve.</p>`:''}</section><section class="v103-recap-kept"><span>06 / YOU KEPT</span><strong>${money(kept)}</strong><p>Week-close net after contractual distributions, deductible career expenses and the tax-reserve change above.</p></section></main><aside><section class="v103-dollar"><span>WHERE EVERY $1 WENT</span>${parts.map(([k,v])=>{const pct=Math.max(0,v/den*100);return `<div><header><small>${k}</small><b>${pct.toFixed(1)}¢</b></header><i><b style="width:${Math.min(100,pct)}%"></b></i></div>`}).join('')}<p>Shown as cents per $1 of gross income. Taxable income is a tax-calculation base, not another cash outflow, so it is not included in this chart.</p></section><section class="v103-recap-career"><span>CAREER MOVEMENT</span><div><small>Net fans</small><strong>${added>=0?'+':''}${compact(added)}</strong></div><div><small>Industry releases</small><strong>${feedCount}</strong></div><div><small>Achievements filed</small><strong>${earned.length}</strong></div><p>Charts, audience and industry systems resolve before this report closes the week.</p></section></aside></div><footer><button onclick="$('modal').close();careerTab='Finances';go('Career')">FULL FINANCIAL REPORT</button><button class="primary" onclick="$('modal').close()">CONTINUE · ${esc(next)}</button></footer></article>`,'memo-dialog v103-recap-dialog');queueSave()
}
weekRecap=V111_weekRecap;
