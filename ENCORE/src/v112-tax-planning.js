/* ENCORE 0.9.10 — Tax Planning 2.0.
   Turns the Tax Foundation into a player-managed system: reserve strategy,
   Business Manager cash planning, CPA forecasting and explicit advisor cost.
   Strategy changes liquidity only; they never change the tax law or liability. */

const V112_RESERVE_STRATEGIES={
 conservative:{id:'conservative',name:'Conservative',multiplier:1.10,risk:'LOW SHORTFALL RISK',desc:'Hold 110% of ENCORE’s recommended reserve. Less spendable cash now, more cushion for year-end.'},
 recommended:{id:'recommended',name:'Recommended',multiplier:1,risk:'BALANCED',desc:'Hold the full current estimate. This is the default balance between liquidity and year-end coverage.'},
 aggressive:{id:'aggressive',name:'Aggressive',multiplier:.80,risk:'HIGHER CATCH-UP RISK',desc:'Hold 80% of the current estimate. More cash stays available now, but any shortfall is still due at year-end.'}
};

function V112_plan(){
 if(!s.taxPlanning||typeof s.taxPlanning!=='object')s.taxPlanning={reserveStrategy:'recommended',history:[],version:2};
 if(!V112_RESERVE_STRATEGIES[s.taxPlanning.reserveStrategy])s.taxPlanning.reserveStrategy='recommended';
 if(!Array.isArray(s.taxPlanning.history))s.taxPlanning.history=[];
 s.taxPlanning.version=2;
 return s.taxPlanning
}
function V112_strategy(){return V112_RESERVE_STRATEGIES[V112_plan().reserveStrategy]||V112_RESERVE_STRATEGIES.recommended}
function V112_setReserveStrategy(id){
 if(!V112_RESERVE_STRATEGIES[id])return;
 const p=V112_plan(),from=p.reserveStrategy;if(from===id)return;
 p.reserveStrategy=id;p.history.unshift({week:s.week,type:'reserve-strategy',from,to:id});p.history=p.history.slice(0,40);
 queueSave?.();render();toast?.(V112_RESERVE_STRATEGIES[id].name+' tax-reserve strategy will apply at the next week close.')
}

/* Add a genuine tax specialist to Representation. The role changes planning
   precision and costs a weekly retainer; it does not create a hidden tax cut. */
V100_REP_ROLES.cpa={name:'CPA / Tax Advisor',scope:[],purpose:'Tax forecasting, deduction classification, reserve planning and filing readiness.'};
const V112_CPA_CANDIDATES=[
 {id:'maya-chen-cpa',name:'Maya Chen',role:'cpa',skill:79,reputation:76,personality:'Practical',commission:0,months:12,weeklyRetainer:900,specialty:'Independent artist taxes',resume:'Creator-focused CPA who keeps smaller careers organized without burying them in complexity.'},
 {id:'renee-walsh-cpa',name:'Renee Walsh',role:'cpa',skill:91,reputation:90,personality:'Methodical',commission:0,months:18,weeklyRetainer:2500,specialty:'Entertainment tax planning',resume:'Entertainment CPA experienced with touring income, endorsements, royalties and multi-state career cash flow.'},
 {id:'victor-hale-cpa',name:'Victor Hale',role:'cpa',skill:97,reputation:95,personality:'Conservative',commission:0,months:24,weeklyRetainer:7500,specialty:'Complex wealth & business income',resume:'High-net-worth advisor focused on large entertainment companies, business holdings and complicated income mixes.'}
];
for(const c of V112_CPA_CANDIDATES)if(!V100_REP_CANDIDATES.some(x=>x.id===c.id))V100_REP_CANDIDATES.push(c);
if(typeof V108_REP_DETAILS!=='undefined')V108_REP_DETAILS.cpa={headline:'Your tax-planning specialist.',what:'Forecasts tax exposure, reviews deduction classification, watches reserve coverage and prepares the career for year-end filing.',effect:'In ENCORE, CPA skill narrows the uncertainty around the tax forecast and improves the quality of reserve guidance. The CPA does not secretly lower your tax rate or manufacture deductions.',best:'Most valuable once multiple income streams, touring, endorsements, investments or owned businesses make the yearly picture harder to read.'};

function V112_activeRep(role){const c=V100_repTeam()?.team?.[role];return c&&c.ends>s.empire.month?c:null}
function V112_cpa(){return V112_activeRep('cpa')}
function V112_businessManager(){return V112_activeRep('business')}
function V112_cpaWeeklyFee(){return Math.max(0,Number(V112_cpa()?.weeklyRetainer||0))}

const V112_repCandidateCardBase=V100_repCandidateCard;
V100_repCandidateCard=function(c){
 if(c.role!=='cpa')return V112_repCandidateCardBase(c);
 const d=typeof V108_repDetail==='function'?V108_repDetail('cpa'):null;
 return `<section class="card v112-cpa-candidate">${typeof personPhoto==='function'?personPhoto('rep-'+c.id,c.name):''}<span class="eyebrow">CPA / TAX ADVISOR · AVAILABLE</span><h2>${esc(c.name)}</h2><p>${esc(d?.headline||'Tax forecasting and planning.')}</p>${profileRows([['Tax skill',c.skill+'/100'],['Industry reputation',c.reputation+'/100'],['Specialty',c.specialty],['Weekly retainer',money(c.weeklyRetainer)],['Income commission','0%'],['Term',c.months+' months']])}<p>${esc(c.resume)}</p><button class="primary" onclick="V100_reviewRep('${c.id}')">Review role & contract</button></section>`
};

const V112_reviewRepBase=V100_reviewRep;
V100_reviewRep=function(id){
 const c=V100_REP_CANDIDATES.find(x=>x.id===id);if(!c||c.role!=='cpa')return V112_reviewRepBase(id);
 modal(`<span class="eyebrow">TAX TEAM · ROLE REVIEW</span><h2>${esc(c.name)} · CPA / Tax Advisor</h2>${typeof V108_repExplanation==='function'?V108_repExplanation('cpa'):''}${profileRows([['Weekly retainer',money(c.weeklyRetainer)],['Income commission','0%'],['Term',c.months+' months'],['Skill',c.skill+'/100'],['Reputation',c.reputation+'/100']])}<p>${esc(c.resume)}</p><p class="fine">The retainer is recorded as a career accounting expense while the agreement is active. CPA skill improves forecast precision and guidance; it does not alter ENCORE’s tax brackets.</p><div class="controls"><button class="primary" onclick="V112_openCpaContract('${c.id}')">Review full contract →</button><button class="secondary" onclick="$('modal').close()">Keep looking</button></div>`)
};

function V112_openCpaContract(id){
 const c=V100_REP_CANDIDATES.find(x=>x.id===id&&x.role==='cpa');if(!c)return false;
 return V108_mountStandardContract({kind:'representation',counterparty:c.name,documentTitle:'CPA / Tax Advisor Services Agreement',summaryTitle:'Tax advisory terms',summaryHtml:profileRows([['Role','CPA / Tax Advisor'],['Weekly retainer',money(c.weeklyRetainer)],['Income commission','0%'],['Term',c.months+' months'],['Specialty',c.specialty]]),explainer:'This engagement improves tax forecast precision, reserve guidance and deduction review. It does not change statutory game rates or guarantee a lower tax bill.',executionNote:'The weekly retainer becomes a recorded career accounting expense while this agreement remains active.',pages:[
  {title:'1 · Appointment',body:`${c.name} is retained as CPA / Tax Advisor for ${c.months} months to provide simulated tax forecasting and career-accounting guidance.`},
  {title:'2 · Scope of Services',body:'Services include tax-liability forecasting, reserve coverage review, deduction classification review and year-end filing readiness. The advisor does not accept deals or control career cash.'},
  {title:'3 · Compensation',body:`The Artist pays a weekly retainer of ${money(c.weeklyRetainer)}. No percentage of royalties, touring, endorsements, catalog sales, investments or other income is owed.`,rows:[['WEEKLY RETAINER',money(c.weeklyRetainer)],['INCOME COMMISSION','0%'],['TERM',c.months+' months']]},
  {title:'4 · Forecasting Standard',body:`Forecast precision is influenced by advisor skill (${c.skill}/100) and the quality of the underlying career records. Forecasts remain estimates until the tax year closes.`},
  {title:'5 · Tax Authority',body:'The advisor may recommend reserve and classification choices but cannot alter ENCORE tax brackets, fabricate deductions, hide income or execute tax-planning decisions automatically.'},
  {title:'6 · Coordination',body:'When a Business Manager is also retained, tax forecasts include stronger cash-flow and reserve context. Each specialist still has a separate role and authority limit.'},
  {title:'7 · Execution',body:'Signing activates the advisory relationship, weekly retainer and planning benefits described above.'}
 ],execute:()=>{V100_hireRep(id);return V100_repTeam()?.team?.cpa?.id===id}})
}

const V112_hireRepBase=V100_hireRep;
V100_hireRep=function(id){
 const c=V100_REP_CANDIDATES.find(x=>x.id===id),result=V112_hireRepBase(id);
 if(c?.role==='cpa'&&V100_repTeam()?.team?.cpa?.id===id)V100_repTeam().team.cpa.weeklyRetainer=Math.max(0,Number(c.weeklyRetainer||0));
 return result
};

/* Advisor quality affects uncertainty and advice — not the underlying tax. */
function V112_forecastUncertainty(){
 const bm=V112_businessManager(),cpa=V112_cpa();
 let spread=.18;
 if(bm)spread-=clamp(Number(bm.skill||70),0,100)/100*.04;
 if(cpa)spread-=clamp(Number(cpa.skill||70),0,100)/100*.08;
 return clamp(spread,.04,.18)
}
function V112_forecastConfidence(){return Math.round((1-V112_forecastUncertainty())*100)}
function V112_cashFloor(){
 const last=s.finance?.last,weekly=Math.max(0,Number(last?.expenses||0))+Math.max(0,Number(last?.taxReserve||0));
 const base=weekly||Math.max(500,V100_operatingTotal?.(V100_operatingCosts?.()||{})||0);
 return cents(base*(V112_businessManager()?8:4))
}
function V112_taxForecast(){
 const p=V111_taxPlanningSnapshot(),spread=V112_forecastUncertainty(),estimate=Math.max(0,p.quote.total),low=cents(estimate*(1-spread)),high=cents(estimate*(1+spread)),strategy=V112_strategy(),recommended=Math.max(0,p.reserve),target=cents(recommended*strategy.multiplier),shortfall=Math.max(0,cents(estimate-target));
 return {...p,spread,low,high,confidence:V112_forecastConfidence(),strategy,target,shortfall,cashFloor:V112_cashFloor()}
}

const V112_repAdviceForBase=V100_repAdviceFor;
V100_repAdviceFor=function(role){
 if(role==='business'){
  const x=V112_taxForecast();return `Reserve strategy: ${x.strategy.name}. Keep enough liquidity for a ${V112_businessManager()?'roughly eight':'basic four'}-week operating buffer (${money(x.cashFloor)}) before treating the remaining cash as truly discretionary.`
 }
 if(role==='cpa'){
  const x=V112_taxForecast();return `Current estimated tax liability is ${money(x.quote.total)} with a ${x.confidence}/100 forecast-confidence score. ${x.shortfall>0?'Your current strategy leaves about '+money(x.shortfall)+' of estimated exposure outside the target reserve.':'Current reserve coverage is at or above the selected target.'}`
 }
 return V112_repAdviceForBase(role)
};

/* Charge the CPA as a real weekly career expense before taxes are calculated.
   The base finance engine already treats action expenses as paid when incurred,
   so cash is reduced once after close while the expense participates in the
   current taxable-income calculation. */
const V112_closeFinancesBase=closeFinances;
closeFinances=function(royalties,rate){
 const plan=V112_plan(),cpa=V112_cpa(),advisorFee=cpa?V112_cpaWeeklyFee():0;
 if(advisorFee){migrateFinance?.();if(!s.finance.week||typeof s.finance.week!=='object')s.finance.week={wages:0,live:0,expenses:0};s.finance.week.expenses=cents((Number(s.finance.week.expenses)||0)+advisorFee)}
 const report=V112_closeFinancesBase(royalties,rate);
 if(advisorFee){changeCash(-advisorFee);report.taxAdvisorFee=advisorFee;report.cash=s.cash;moneyEvent?.((cpa?.name||'CPA')+' tax-advisory retainer',-advisorFee)}
 report.reserveStrategy=plan.reserveStrategy;
 report.reserveStrategyName=V112_strategy().name;
 if(!report.yearEnd){
  const recommended=Math.max(0,Number(s.finance.reserve)||0),strategy=V112_strategy(),rawTarget=cents(recommended*strategy.multiplier);let adjustment=cents(rawTarget-recommended);
  if(adjustment>0)adjustment=Math.min(adjustment,Math.max(0,Number(s.cash)||0));
  if(adjustment){changeCash(-adjustment);s.finance.reserve=cents(recommended+adjustment);report.taxReserve=cents((Number(report.taxReserve)||0)+adjustment);report.net=cents((Number(report.net)||0)-adjustment);report.cash=s.cash}
  report.recommendedTaxReserve=recommended;report.actualTaxReserve=Math.max(0,Number(s.finance.reserve)||0);report.reserveCoverage=recommended?report.actualTaxReserve/recommended:1;report.projectedReserveShortfall=Math.max(0,cents(recommended-report.actualTaxReserve))
 }else{
  report.recommendedTaxReserve=Math.max(0,Number(report.settlement)||0);report.actualTaxReserve=report.recommendedTaxReserve;report.reserveCoverage=1;report.projectedReserveShortfall=0
 }
 report.taxForecastConfidence=V112_forecastConfidence();
 return report
};

/* Keep advisor fees readable instead of hiding the CPA inside Actions & Projects. */
const V112_recapRowsBase=V103_recapRows;
V103_recapRows=function(r){
 const out=V112_recapRowsBase(r),fee=Math.max(0,Number(r?.taxAdvisorFee||0));if(!fee)return out;
 const i=out.expenses.findIndex(([k])=>k==='Actions & projects');
 if(i>=0){const remaining=Math.max(0,Number(out.expenses[i][1]||0)-fee);if(remaining)out.expenses[i][1]=remaining;else out.expenses.splice(i,1)}
 out.expenses.push(['CPA / tax advisor retainer',fee]);return out
};

const V112_financeRowsBase=financeRows;
financeRows=function(r,full=false){
 let rows=V112_financeRowsBase(r,full),fee=Math.max(0,Number(r?.taxAdvisorFee||0));
 if(fee){
  const i=rows.findIndex(([k])=>k==='CAREER EXPENSE · Actions & projects');
  const remaining=Math.max(0,Number(r.actionExpenses||0)-Number(r.labelPayroll||0)-fee);
  if(i>=0){if(remaining)rows[i]=['CAREER EXPENSE · Actions & projects','−'+money(remaining)];else rows.splice(i,1)}
  const at=rows.findIndex(([k])=>k.startsWith('TAXABLE ·'));rows.splice(at<0?rows.length:at,0,['CAREER EXPENSE · CPA / tax advisor','−'+money(fee)])
 }
 if(full){
  const at=rows.findIndex(([k])=>k.startsWith('TAX INFO ·'));
  rows.splice(at<0?rows.length:at,0,['TAX PLAN · Reserve strategy',r.reserveStrategyName||V112_strategy().name],['TAX PLAN · Reserve coverage',Math.round((Number(r.reserveCoverage)||0)*1000)/10+'%'],['TAX PLAN · Forecast confidence',(r.taxForecastConfidence||V112_forecastConfidence())+'/100'])
 }
 return rows
};

function V112_teamStatus(){
 const bm=V112_businessManager(),cpa=V112_cpa();
 return `<div class="v112-advisor-grid"><article><span>BUSINESS MANAGER</span><strong>${bm?esc(bm.name):'Not retained'}</strong><p>${bm?'Cash-flow context and operating-buffer guidance are active.':'Hire one for stronger liquidity and reserve context.'}</p>${bm?`<small>${bm.skill}/100 skill</small>`:'<button onclick="V096_openBusinessArea(\'Agency\')">Review candidates →</button>'}</article><article><span>CPA / TAX ADVISOR</span><strong>${cpa?esc(cpa.name):'Not retained'}</strong><p>${cpa?`Forecast precision active · ${money(V112_cpaWeeklyFee())}/week.`:'Hire one to narrow forecast uncertainty and review tax classification.'}</p>${cpa?`<small>${cpa.skill}/100 tax skill</small>`:'<button onclick="V096_openBusinessArea(\'Agency\')">Review candidates →</button>'}</article></div>`
}
function V112_taxPlanningDesk(){
 const x=V112_taxForecast(),plan=V112_plan();
 return `<section class="card v112-tax-desk"><header><div><span class="eyebrow">TAX PLANNING 2.0 · FINANCE DESK</span><h2>Choose liquidity. The bill does not disappear.</h2><p>Your reserve strategy controls how much cash ENCORE sets aside between now and year-end. It never changes the underlying estimated liability.</p></div><div class="v112-tax-confidence"><small>FORECAST CONFIDENCE</small><strong>${x.confidence}/100</strong><span>Estimated range ${money(x.low)}–${money(x.high)}</span></div></header><div class="v112-tax-metrics">${[['EST. TAX LIABILITY',money(x.quote.total)],['RESERVE HELD',money(x.reserve)],['EST. TAXABLE INCOME',money(x.taxable)],['OPERATING BUFFER',money(x.cashFloor)]].map(([k,v])=>`<div><small>${k}</small><strong>${v}</strong></div>`).join('')}</div><div class="v112-strategy-grid">${Object.values(V112_RESERVE_STRATEGIES).map(o=>`<button class="${plan.reserveStrategy===o.id?'selected':''}" onclick="V112_setReserveStrategy('${o.id}')"><span>${esc(o.name.toUpperCase())}</span><strong>${Math.round(o.multiplier*100)}% reserve target</strong><p>${esc(o.desc)}</p><small>${esc(o.risk)}</small></button>`).join('')}</div><div class="v112-tax-warning"><strong>${x.strategy.name} strategy</strong><p>${x.strategy.id==='aggressive'?'Aggressive does not reduce taxes. It keeps more cash available now and can create a larger year-end catch-up payment.':x.strategy.id==='conservative'?'The extra cushion is still your money; it is simply unavailable as spendable cash while held in the tax reserve.':'The recommended strategy targets the current ENCORE estimate without an added cushion.'}</p></div>${V112_teamStatus()}</section>`
}

const V112_financeScreenBase=financeScreen;
financeScreen=function(){V112_plan();return V112_taxPlanningDesk()+V112_financeScreenBase()};
