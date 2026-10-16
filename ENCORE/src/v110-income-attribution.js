/* ENCORE 0.9.8 — deal-income attribution.
   Preserve the authoritative finance totals while showing where commercial
   money actually came from in the weekly recap and full financial report. */

let V110_incomeContext=null;

const V110_COMMERCIAL_LABELS={
 media:'Media appearances',
 endorsement:'Endorsements',
 brand:'Brand deals',
 partnership:'Brand partnerships',
 lifetime:'Lifetime partnerships',
 live:'Live partnerships'
};

function V110_moneyNumber(v){const n=Number(v);return Number.isFinite(n)?n:0}
function V110_detailList(report){return Array.isArray(report?.dealIncomeDetails)?report.dealIncomeDetails:[]}
function V110_commercialDetails(report){return V110_detailList(report).filter(x=>x.family==='commercial'&&V110_moneyNumber(x.amount)>0)}
function V110_commercialRollup(report){
 const out={};
 for(const x of V110_commercialDetails(report))out[x.category]=(out[x.category]||0)+V110_moneyNumber(x.amount);
 return out
}
function V110_commercialDetailTotal(report){return V110_commercialDetails(report).reduce((n,x)=>n+V110_moneyNumber(x.amount),0)}
function V110_commercialRows(report){
 const roll=V110_commercialRollup(report),rows=[];
 /* Older systems already write some endorsement revenue to its own finance
    field. Fold that amount into the same display category instead of showing
    two separate Endorsements rows. */
 roll.endorsement=(roll.endorsement||0)+V110_moneyNumber(report?.endorsement);
 for(const key of ['media','endorsement','brand','partnership','lifetime','live'])if(roll[key])rows.push([V110_COMMERCIAL_LABELS[key]||'Commercial income',roll[key]]);
 const residual=Math.max(0,V110_moneyNumber(report?.media)-V110_commercialDetailTotal(report));
 if(residual)rows.unshift(['Other media & commercial',residual]);
 return rows
}

function V110_activeContractIncomeContext(kind){
 const spec=globalThis.V108_activeAgreement;
 if(!spec)return null;
 if(kind==='media'&&spec.kind==='commercial'){
  const offers=s.v080?.commercial?.offers||[];
  const o=offers.slice().reverse().find(x=>x.brand===spec.counterparty||x.name===spec.counterparty);
  if(o)return {family:'commercial',category:o.category||'media',name:o.name||o.brand||spec.counterparty,phase:'Signing payment',offerId:o.id}
 }
 if(kind==='live'&&spec.kind==='opportunity'){
  const offers=s.expansion?.opportunities||[];
  const o=offers.slice().reverse().find(x=>x.name===spec.counterparty);
  if(o)return {family:'opportunity',category:o.type||'Appearance',name:o.name||spec.counterparty,phase:o.type||'Career appearance',offerId:o.id}
 }
 return null
}
function V110_storeIncomeDetail(context,value){
 if(!context||V110_moneyNumber(value)<=0)return;
 migrateFinance?.();
 if(!s.finance.week||typeof s.finance.week!=='object')s.finance.week={wages:0,live:0,expenses:0};
 if(!Array.isArray(s.finance.week.dealIncomeDetails))s.finance.week.dealIncomeDetails=[];
 s.finance.week.dealIncomeDetails.push({family:context.family||'commercial',category:context.category||'media',name:String(context.name||'Commercial agreement').slice(0,120),phase:String(context.phase||'Payment').slice(0,80),offerId:context.offerId??null,amount:cents(V110_moneyNumber(value))});
 s.finance.week.dealIncomeDetails=s.finance.week.dealIncomeDetails.slice(-80)
}

const V110_recordIncomeBase=recordIncome;
recordIncome=function(kind,value){
 const context=V110_incomeContext||V110_activeContractIncomeContext(kind);
 const result=V110_recordIncomeBase(kind,value);
 if(context)V110_storeIncomeDetail(context,value);
 return result
};

/* Scheduled commercial installments need a source context because they settle
   outside the contract-reading room. The accounting remains in the existing
   media bucket so commissions/taxes/economy behavior do not change. */
settleCommercialContracts080=function(){
 migrateV080();
 for(const c of s.v080.commercial.contracts.filter(x=>x.active)){
  const months=Math.max(1,c.durationMonths||120),installment=c.monthsPaid>=months?0:cents(c.remaining/Math.max(1,months-c.monthsPaid));
  if(installment>0){
   c.monthsPaid++;c.remaining=cents(Math.max(0,c.remaining-installment));c.paid=cents((c.paid||0)+installment);changeCash(installment);
   const previous=V110_incomeContext;
   V110_incomeContext={family:'commercial',category:c.category||'media',name:c.name||c.brand||'Commercial agreement',phase:'Guaranteed installment',offerId:c.id};
   try{recordIncome('media',installment)}finally{V110_incomeContext=previous}
   moneyEvent(c.name+' guaranteed installment',installment)
  }
  if(c.monthsPaid>=months&&c.remaining<=0){if(!c.lifetime)c.active=false;else c.guaranteeComplete=true}
 }
};

/* Carry the source ledger into the immutable week-close report before the
   finance engine resets s.finance.week for the next week. */
const V110_closeFinancesBase=closeFinances;
closeFinances=function(royalties,rate){
 const details=Array.isArray(s.finance?.week?.dealIncomeDetails)?s.finance.week.dealIncomeDetails.map(x=>({...x})):[];
 const report=V110_closeFinancesBase(royalties,rate);
 report.dealIncomeDetails=details;
 report.dealIncomeRollup=V110_commercialRollup(report);
 return report
};

/* Weekly recap: replace the vague all-in commercial line with the actual
   commercial categories that paid the player that week. */
const V110_recapRowsBase=V103_recapRows;
V103_recapRows=function(r){
 const out=V110_recapRowsBase(r),split=V110_commercialRows(r);
 if(!split.length)return out;
 let index=out.income.findIndex(([k])=>k==='Media & commercial');
 if(index<0)index=out.income.findIndex(([k])=>k==='Endorsements');
 if(index<0)index=Math.max(0,out.income.findIndex(([k])=>k==='Live & appearances')+1);
 out.income=out.income.filter(([k])=>!['Media & commercial','Endorsements'].includes(k));
 out.income.splice(index,0,...split);
 return out
};

/* Full financial report: category totals plus the deal/appearance names that
   generated those dollars. Detail rows are explanatory children of the total,
   not additional revenue. */
const V110_financeRowsBase=financeRows;
financeRows=function(r,full=false){
 let rows=V110_financeRowsBase(r,full),commercial=V110_commercialRows(r),details=V110_detailList(r);
 if(commercial.length){
  let index=rows.findIndex(([k])=>k==='Media & commercial income');
  if(index<0)index=rows.findIndex(([k])=>k==='Endorsements');
  if(index<0)index=Math.max(1,rows.findIndex(([k])=>k==='Live & appearance income')+1);
  rows=rows.filter(([k])=>!['Media & commercial income','Endorsements'].includes(k));
  rows.splice(index,0,...commercial.map(([k,v])=>[k,money(v)]));
  if(full){
   let insert=index+commercial.length;
   for(const x of details.filter(d=>d.family==='commercial'&&V110_moneyNumber(d.amount)>0))rows.splice(insert++,0,[`↳ ${x.name} · ${x.phase}`,money(x.amount)])
  }
 }
 if(full){
  const appearances=details.filter(d=>d.family==='opportunity'&&V110_moneyNumber(d.amount)>0);
  if(appearances.length){
   let index=rows.findIndex(([k])=>k==='Live & appearance income');if(index<0)index=0;index++;
   for(const x of appearances)rows.splice(index++,0,[`↳ ${x.phase} · ${x.name}`,money(x.amount)])
  }
 }
 return rows
};
