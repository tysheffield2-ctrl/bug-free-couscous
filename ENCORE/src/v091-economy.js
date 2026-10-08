/* ENCORE 0.9.1 economy clarity pass: complete recap income, visible tax rates and living PULSE growth. */
function V091_num(v){return Number.isFinite(Number(v))?Number(v):0}
function V091_incomeBreakdown(w=s.finance?.week||{}){return {
 wages:V091_num(w.wages),
 live:V091_num(w.live),
 albumSales:V091_num(w.albumSales),
 labelBusiness:V091_num(w.labelBusiness),
 investment:V091_num(w.investment),
 media:V091_num(w.media),
 publishing:V091_num(w.publishing),
 sync:V091_num(w.sync),
 endorsement:V091_num(w.endorsement),
 merch:V091_num(w.merch),
 sponsorship:V091_num(w.sponsorship),
 other:V091_num(w.other)
}}
function V091_incomeTotal(w=s.finance?.week||{}){return Object.values(V091_incomeBreakdown(w)).reduce((n,v)=>n+v,0)}
function V091_marginalTaxRate(profit){const p=Math.max(0,V091_num(profit));return p<=15000?0:p<=50000?.10:p<=150000?.20:p<=500000?.30:p<=1000000?.35:.40}
function V091_pct(n){return (V091_num(n)*100).toFixed(1)+'%'}

recordIncome=function(kind,value){migrateFinance();if(!s.finance.week||typeof s.finance.week!=='object')s.finance.week={wages:0,live:0,expenses:0};s.finance.week[kind]=cents(V091_num(s.finance.week[kind])+V091_num(value))};

closeFinances=function(royalties,rate){
 const f=s.finance,w=f.week,income=V091_incomeBreakdown(w),labelCut=artistLabelCut(royalties),labelPayroll=V091_num(w.labelPayroll),agentBase=royalties+income.live+income.albumSales,agentFee=agentCommission(agentBase),overhead=cents((royalties+income.live+income.albumSales)*rate),revenue=cents(royalties+V091_incomeTotal(w)),expenses=cents(V091_num(w.expenses)+overhead+labelCut+agentFee);
 if(s.expansion.contract)s.expansion.contract.recovered=(s.expansion.contract.recovered||0)+labelCut;
 f.weeks++;f.revenue=cents(f.revenue+revenue);f.expenses=cents(f.expenses+expenses);
 const profit=cents(f.revenue-f.expenses),yearEnd=isAnnualClosing(),annualized=Math.max(0,profit)*52/Math.max(1,f.weeks),target=yearEnd?taxDue(profit):cents(taxDue(annualized)*f.weeks/52),reserveChange=cents(target-f.reserve),effectiveRate=profit>0?clamp(target/profit,0,1):0,marginalRate=V091_marginalTaxRate(yearEnd?profit:annualized);
 f.reserve=target;changeCash(royalties-overhead-reserveChange-labelCut-agentFee);
 const report={week:s.week,revenue,investment:income.investment,media:income.media,publishing:income.publishing,sync:income.sync,endorsement:income.endorsement,merch:income.merch,sponsorship:income.sponsorship,other:income.other,agentFee,royalties,albumSales:income.albumSales,labelBusiness:income.labelBusiness,labelPayroll,labelCut,wages:income.wages,live:income.live,expenses,actionExpenses:V091_num(w.expenses),overhead,rate,taxReserve:reserveChange,taxableProfit:profit,effectiveTaxRate:effectiveRate,marginalTaxRate:marginalRate,net:cents(revenue-expenses-reserveChange),cash:s.cash,yearEnd,settlement:yearEnd?target:0};
 if(yearEnd){f.lastSettlement={year:f.year,profit,tax:target,reconciliation:reserveChange,effectiveTaxRate:profit>0?clamp(target/profit,0,1):0,marginalTaxRate:V091_marginalTaxRate(profit)};f.taxesPaid=cents(f.taxesPaid+target);f.reserve=0;f.year++;f.weeks=0;f.revenue=0;f.expenses=0}
 f.week={wages:0,live:0,expenses:0};f.last=report;return report
};

financeRows=function(r,full=false){
 const rows=[];
 if(full)rows.push(['Total taxable revenue',money(r.revenue||0)]);
 if(r.royalties)rows.push(['Streaming royalties',money(r.royalties)]);
 if(r.albumSales)rows.push(['Album downloads',money(r.albumSales)]);
 if(r.live)rows.push(['Live, merch & appearance income',money(r.live)]);
 if(r.media)rows.push(['Commercial deals & endorsements',money(r.media)]);
 if(r.publishing)rows.push(['Publishing income',money(r.publishing)]);
 if(r.sync)rows.push(['Sync licensing',money(r.sync)]);
 if(r.endorsement)rows.push(['Endorsements',money(r.endorsement)]);
 if(r.merch)rows.push(['Merchandise income',money(r.merch)]);
 if(r.sponsorship)rows.push(['Sponsorship income',money(r.sponsorship)]);
 if(r.wages)rows.push(['Work & label advances',money(r.wages)]);
 if(r.labelBusiness)rows.push(['Label-business receipts',money(r.labelBusiness)]);
 if(r.investment)rows.push(['Investments, distributions & rent',money(r.investment)]);
 if(r.other)rows.push(['Other career income',money(r.other)]);
 if(r.labelPayroll)rows.push(['Label payroll','−'+money(r.labelPayroll)]);
 if(r.labelCut)rows.push(['Your label contract share','−'+money(r.labelCut)]);
 if(r.agentFee)rows.push(['Agent commission','−'+money(r.agentFee)]);
 if(r.actionExpenses)rows.push(['Career/action expenses','−'+money(Math.max(0,r.actionExpenses-(r.labelPayroll||0)))]);
 if(r.overhead)rows.push(['Career overhead ('+Math.round((r.rate||0)*100)+'%)','−'+money(r.overhead)]);
 rows.push(['Effective income tax rate',V091_pct(r.effectiveTaxRate||0)]);
 rows.push(['Current top tax bracket',V091_pct(r.marginalTaxRate||0)]);
 rows.push([r.taxReserve<0?'Tax reserve returned':'Tax reserve set aside ('+V091_pct(r.effectiveTaxRate||0)+' effective)',(r.taxReserve<0?'+':'−')+money(Math.abs(r.taxReserve||0))]);
 rows.push([full?'Net for the whole week':'Week-close net',money(r.net||0)]);
 rows.push(['Spendable cash',money(r.cash||0)]);
 return rows
};

weekRecap=function(completed,count,added,debut,financial,earned=[]){
 const label=V083_weekDate(completed),next=V083_weekDate(completed+1),pulse=s.social?.weekly?.find(x=>x.week===completed),pulseText=pulse?`${pulse.net>=0?'+':''}${compact(pulse.net)} followers`:'No PULSE change tracked';
 modal(memoFrame('Weekly recap',label+' · Your career report',`<div class="memo-headline"><span>Streams this week</span><strong>${compact(count)}</strong><small>${added>=0?'+':''}${compact(added)} net fans · PULSE ${esc(pulseText)}</small></div><div class="memo-finances">${financeRows(financial,true).map(([k,v])=>`<div><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join('')}</div>${earned.length?`<p class="memo-note">${earned.length} new achievements filed.</p>`:''}${financial.yearEnd?`<p class="memo-note">Tax year settled: ${money(financial.settlement)} paid from your reserve · ${V091_pct(financial.effectiveTaxRate||0)} effective rate.</p>`:''}<p class="memo-note">Energy restored to 200. ${s.feed.filter(x=>x.week===completed).length} industry projects released.</p>`,`<button class="memo-primary" onclick="$('modal').close()">Continue · ${esc(next)}</button><button class="memo-secondary" onclick="$('modal').close();careerTab='Finances';go('Career')">Full financial report</button>`,completed),'memo-dialog');queueSave()
};

function V091_organicPulseFollowers(){
 migrateSocial();const a=s.social;if(a.v091OrganicWeek===s.week)return 0;
 const recentStreams=Math.max(0,V091_num(s.streams)),momentum=V091_num(s.careerWorld?.momentum),market=level('marketability'),viral=level('viralAbility'),charting=(s.songs||[]).filter(x=>x.released&&x.peak&&x.peak<=100&&s.week-(x.released||0)<12).length,releases=(s.songs||[]).filter(x=>x.released===s.week).length,tourActive=s.liveTour&&s.liveTour.completed<s.liveTour.shows?1:0;
 const discovery=Math.log10(1+recentStreams)*4+momentum*.16+market*.08+viral*.1+charting*2.5+releases*8+tourActive*3;
 if(discovery<5){a.v091OrganicWeek=s.week;return 0}
 const rate=clamp(.0015+discovery/12000,0,.022),floor=Math.max(0,Math.round(discovery-8)),gain=Math.min(Math.round(a.followers*.03+250000),Math.max(floor,Math.round(a.followers*rate)));
 a.followers+=gain;a.v091OrganicWeek=s.week;return gain
}
const V091_finishSocialWeek=finishSocialWeek;
finishSocialWeek=function(){
 migrateSocial();const week=s.week;V091_finishSocialWeek();const gain=V091_organicPulseFollowers();if(gain){const row=s.social.weekly.find(x=>x.week===week);if(row)row.net=(row.net||0)+gain;log('PULSE organic discovery: +'+compact(gain)+' followers from career momentum.')}return gain
};
