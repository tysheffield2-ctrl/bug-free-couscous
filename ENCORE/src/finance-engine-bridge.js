/* Bind legacy ENCORE week-close accounting to engine/finance.js. */
closeFinances=function(royalties,rate){
 const f=s.finance,w=f.week,income=V091_incomeBreakdown(w),labelCut=artistLabelCut(royalties),labelPayroll=V091_num(w.labelPayroll),repIncome={royalties,albumSales:income.albumSales,live:income.live,media:income.media,publishing:income.publishing,sync:income.sync,endorsement:income.endorsement,merch:income.merch,sponsorship:income.sponsorship},representation=V100_repSettlements(repIncome),agentFee=V100_repTotal(representation),operations=V100_operatingCosts(),operatingCost=V100_operatingTotal(operations);
 if(agentFee)moneyEvent('Representation commissions',-agentFee);
 return ENCORE_FINANCE.settle(s,{royalties,income,incomeTotal:V091_incomeTotal(w),labelCut,labelPayroll,representation,agentFee,operations,operatingCost,actionExpenses:V091_num(w.expenses),yearEnd:isAnnualClosing(),taxQuote:V100_taxQuote});
};
