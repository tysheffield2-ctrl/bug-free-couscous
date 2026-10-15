/* ENCORE shared Finance Ledger Engine.
   Renderer-independent week-close cash/reserve/year mutation. Contract and representation
   eligibility can be resolved by other engines and supplied as settlement inputs. */
(function(global){
'use strict';
const cents=v=>Math.round((Number(v)||0)*100)/100,clamp=(v,l=0,h=1)=>Math.max(l,Math.min(h,Number(v)||0));
function ensureWallet(state){const cash=Number(state.cash)||0,raw=String(state.walletCents??'');let valid=/^-?\d+$/.test(raw);if(valid){try{valid=Math.abs(Number(BigInt(raw))/100-cash)<.005}catch{valid=false}}if(!valid)state.walletCents=BigInt(Math.round(cash*100)).toString()}
function changeCash(state,delta){ensureWallet(state);state.walletCents=(BigInt(state.walletCents)+BigInt(Math.round((Number(delta)||0)*100))).toString();state.cash=Number(BigInt(state.walletCents))/100;return state.cash}
function ensureFinance(state){state.finance=state.finance&&typeof state.finance==='object'?state.finance:{year:1,weeks:0,revenue:0,expenses:0,reserve:0,taxesPaid:0,week:{wages:0,live:0,expenses:0}};const f=state.finance;for(const k of ['year','weeks','revenue','expenses','reserve','taxesPaid'])f[k]=Number(f[k])||0;f.year=Math.max(1,Math.round(f.year||1));f.week=f.week&&typeof f.week==='object'?f.week:{wages:0,live:0,expenses:0};return f}
function settle(state,input={}){
 const f=ensureFinance(state),w=f.week,royalties=cents(input.royalties),income=input.income||{},incomeTotal=cents(input.incomeTotal),labelCut=cents(input.labelCut),labelPayroll=cents(input.labelPayroll),representation=Array.isArray(input.representation)?input.representation:[],agentFee=cents(input.agentFee),operations=input.operations||{},operatingCost=cents(input.operatingCost),actionExpenses=cents(input.actionExpenses??w.expenses),yearEnd=!!input.yearEnd;
 const revenue=cents(royalties+incomeTotal),expenses=cents(actionExpenses+operatingCost+labelCut+agentFee);
 f.weeks++;f.revenue=cents(f.revenue+revenue);f.expenses=cents(f.expenses+expenses);
 const profit=cents(f.revenue-f.expenses),annualized=Math.max(0,profit)*52/Math.max(1,f.weeks),quote=typeof input.taxQuote==='function'?input.taxQuote(yearEnd?profit:annualized):(input.taxQuote||{total:0,marginal:0,city:{taxAdj:0}}),target=yearEnd?cents(quote.total):cents((Number(quote.total)||0)*f.weeks/52),reserveChange=cents(target-f.reserve),effectiveRate=profit>0?clamp(target/profit):0;
 f.reserve=target;changeCash(state,royalties-operatingCost-reserveChange-labelCut-agentFee);
 if(state.expansion?.contract)state.expansion.contract.recovered=(Number(state.expansion.contract.recovered)||0)+labelCut;
 const report={week:state.week,revenue,investment:cents(income.investment),media:cents(income.media),publishing:cents(income.publishing),sync:cents(income.sync),endorsement:cents(income.endorsement),merch:cents(income.merch),sponsorship:cents(income.sponsorship),other:cents(income.other),agentFee,representation,royalties,albumSales:cents(income.albumSales),labelBusiness:cents(income.labelBusiness),labelPayroll,labelCut,wages:cents(income.wages),live:cents(income.live),expenses,actionExpenses,overhead:0,rate:0,operations,operatingCost,taxReserve:reserveChange,taxableProfit:profit,effectiveTaxRate:effectiveRate,marginalTaxRate:Number(quote.marginal)||0,regionalTaxAdjustment:Number(quote.city?.taxAdj)||0,net:cents(revenue-expenses-reserveChange),cash:state.cash,yearEnd,settlement:yearEnd?target:0};
 if(yearEnd){f.lastSettlement={year:f.year,profit,tax:target,reconciliation:reserveChange,effectiveTaxRate:profit>0?clamp(target/profit):0,marginalTaxRate:Number(quote.marginal)||0,regionalTaxAdjustment:Number(quote.city?.taxAdj)||0};f.taxesPaid=cents(f.taxesPaid+target);f.reserve=0;f.year++;f.weeks=0;f.revenue=0;f.expenses=0}
 f.week={wages:0,live:0,expenses:0};f.last=report;return report
}
global.ENCORE_FINANCE={version:1,cents,ensureWallet,changeCash,ensureFinance,settle};
})(globalThis);
