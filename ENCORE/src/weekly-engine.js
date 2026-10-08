/* Canonical week-close owner. Phase order is part of the save/economy contract.
   Monthly hooks close the outgoing month before weekly royalties, preserving beta accounting.
   Weekly release/chart/audience/finance order lives in core.advanceWeek.
   Annual tax reconciliation is part of that finance close, not a second debit.
   Player actions (studio, PULSE, live shows, offers) are event-driven.
*/
let V083_transitionAdvancing=false;
const MONTH_END_HOOKS=[
 ['industry-life',()=>{migrateIndustryLife();settleIndustryLife()}],
 ['team',()=>settleTeam()],
 ['assets',()=>settleAssets()],['commerce',()=>settleCommerce()],
 ['depth-business',()=>V081_settleMonth(s.lastReport||{})]
];
function isAnnualClosing(week=s.week){return week%52===0}
function V083_isMonthClosing(week=s.week){return calendarMonthAtWeek(week+1)!==calendarMonthAtWeek(week)}
function V083_settleMonthEnd(){for(const [name,settle] of MONTH_END_HOOKS)settle();}
function V083_accumulateWeek(completed,beforeCash){const r=s.lastReport||{},a=s.v083.monthAccumulator;a.streams+=r.streams||0;a.fans+=r.fans||0;a.royalties=cents(a.royalties+(r.royalties||0));a.taxes=cents(a.taxes+(r.finance?.taxReserve||0));a.cashChange=cents(a.cashChange+(s.cash-beforeCash));if(V083_isMonthClosing(completed)){s.empire.lastSettled=completed;s.empire.catalogHistory.unshift({week:s.week,value:catalogValue()});s.empire.catalogHistory=s.empire.catalogHistory.slice(0,36);s.empire.lastMonth={monthIndex:a.monthIndex,start:a.startWeek,end:completed,streams:a.streams,fans:a.fans,royalties:a.royalties,taxes:a.taxes,cashChange:a.cashChange};const next=calendarMonthAtWeek(s.week);s.empire.month=next;s.v083.monthAccumulator={monthIndex:next,startWeek:s.week,streams:0,fans:0,royalties:0,taxes:0,cashChange:0};generateCommercialOffers080?.();rollThreat?.()}else s.empire.month=calendarMonthAtWeek(s.week)}
advance=function(confirmed=false){if(!labelActive()||monthlyAdvancing)return;migrateV083();const closing=V083_isMonthClosing(s.week),risk=typeof V080_offerRiskCount==='function'?V080_offerRiskCount(1):0;if(!confirmed){modal(`<h2>Finish ${esc(V083_weekDate(s.week))}?</h2><p>One chart week will resolve. Your unused ${s.energy}/200 energy will be replaced by 200. Songs, charts, contracts, royalties and weekly label activity update every week.</p><p>${closing?'<strong>This also closes '+esc(careerDate())+'.</strong> Monthly assets, rent, catalogs, commercial payments, sports and industry-life systems will settle once.':''} ${risk?'<strong>'+risk+' reviewed offer'+(risk===1?'':'s')+' may expire after this week.</strong>':'Unreviewed offers remain protected until you open them.'}</p><div class="controls"><button class="secondary" onclick="$('modal').close()">Keep playing</button><button class="primary" onclick="$('modal').close();advance(true)">Advance one week</button></div>`);return}backupCareer(false);const checkpoint=JSON.parse(JSON.stringify(s)),completed=s.week,before=s.cash;V083_transitionAdvancing=true;try{if(closing)V083_settleMonthEnd();advanceWeek(true);V083_accumulateWeek(completed,before);queueSave();render()}catch(error){s=checkpoint;try{$('modal').close()}catch{}toast('The week could not finish. Your career was restored; please report this issue.');console.error(error)}finally{V083_transitionAdvancing=false;if(saveReady&&$('week'))$('week').textContent=V083_weekDate()}};
