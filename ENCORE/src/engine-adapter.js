/* ENCORE legacy presentation adapter.
   This is the only simulation adapter allowed to bridge the current renderer to ENCORE_ENGINE.
   Presentation may remain legacy while gameplay mutations stay owned by the canonical engine. */

function ENCORE_engineHooks(){
 return {tickMarket,beginCareerWeek,settleLivingWorld,generateOpeningSlots,settleWorldTour,operationRate,settleAlbumSales,worldWeek,settleLabelWeek,albumStreams,compileSongs,updateChartRecords,settleAudience,applyAudienceEvent,updateCareerWorld,closeFinances,clamp,finishCareerWeek,scanAchievements,catalogReport,weeklyNews,log,compact,fmt,money,reach,reception,directionFor,rand,outcome,adjustReleaseStreams,recordRegionalStreams,level};
}

/* Charts */
initialChartBook=function(){return ENCORE_ENGINE.charts.initial(1)};
trackChartIssue=function(kind,list,baseline=false){return ENCORE_ENGINE.trackChart(s,kind,list,{baseline,owner:(_state,k,id)=>chartOwner(k,id)})};
updateChartRecords=function(rankings){
 const result=ENCORE_ENGINE.publishCharts(s,{songs:rankings,albums:compileAlbums(),owner:(_state,k,id)=>chartOwner(k,id)});
 if(typeof V119_afterChartIssue==='function')V119_afterChartIssue(result,s);
 if(!result.published)return;
 updateCertifications();lateChartAlerts();
};
chartRecord=function(kind,key){return ENCORE_ENGINE.chartRecord(s,kind,key)};

/* Audience */
applyAudienceEvent=function(source,delta,options={}){
 return ENCORE_ENGINE.applyAudience(s,source,delta,options,{ensureWorld:()=>migrateCareerWorld(),reconcile:()=>reconcileRegionalAudience()});
};

/* Finance */
closeFinances=function(royalties,rate){
 const f=s.finance,w=f.week,income=V091_incomeBreakdown(w),labelCut=artistLabelCut(royalties),labelPayroll=V091_num(w.labelPayroll),repIncome={royalties,albumSales:income.albumSales,live:income.live,media:income.media,publishing:income.publishing,sync:income.sync,endorsement:income.endorsement,merch:income.merch,sponsorship:income.sponsorship},representation=V100_repSettlements(repIncome),agentFee=V100_repTotal(representation),operations=V100_operatingCosts(),operatingCost=V100_operatingTotal(operations);
 if(agentFee)moneyEvent('Representation commissions',-agentFee);
 return ENCORE_ENGINE.settleFinance(s,{royalties,income,incomeTotal:V091_incomeTotal(w),labelCut,labelPayroll,representation,agentFee,operations,operatingCost,actionExpenses:V091_num(w.expenses),yearEnd:isAnnualClosing(),taxQuote:V100_taxQuote});
};

/* Studio */
scoreSong=function(d){return ENCORE_ENGINE.studio.score(d)};
newSong=function(e){
 e?.preventDefault?.();if(!saveReady||saveConflict||s.draft)return;
 const f=new FormData(e.target),idea=typeof ensureStudioIdeaSchema==='function'?ensureStudioIdeaSchema():s.studioIdea||{};
 try{
  const d=ENCORE_ENGINE.studio.start(s,{title:String(f.get('songtitle')||'').trim()||generate('song'),mood:String(f.get('mood')||idea.mood||ENCORE_ENGINE.studio.directions[0].id),packageIndex:Number(f.get('package')||idea.package||0),brief:String(f.get('brief')||idea.brief||'story'),creative:{theme:idea.theme,tempo:idea.tempo,intent:idea.intent,texture:idea.texture,hook:idea.hook}});
  log('Started writing “'+d.title+'”.');queueSave();render();
 }catch(error){toast(error.message||'The writing session could not start.')}
};
progressSong=function(){
 if(!saveReady||saveConflict)return;
 try{const result=ENCORE_ENGINE.studio.progress(s);log((result.stage==='record'?'Recording':'Mixing')+' complete for “'+result.draft.title+'”.');queueSave();render()}
 catch(error){toast(error.message||'That studio stage could not be completed.')}
};
performSession=function(id){
 if(!saveReady||saveConflict)return;
 try{const result=id?ENCORE_ENGINE.studio.perform(s,id):ENCORE_ENGINE.studio.progress(s);log((result.stage==='record'?'Recording':'Mixing')+' complete.');queueSave();render()}
 catch(error){toast(error.message||'That studio stage could not be completed.')}
};
finishSong=function(release,confirmed=false){
 const d=s.draft;if(!d||d.steps!==3||!saveReady||saveConflict)return;
 if(release&&!confirmed){modal(`<h2>Publish this single?</h2><p>“${esc(d.title)}” will enter your released catalog. You cannot edit the finished recording afterward. Results arrive when you advance the week.</p><p>$20 · 5 energy</p><div class="controls"><button class="secondary" onclick="$(${JSON.stringify('modal')}).close()">Keep in studio</button><button class="primary" onclick="$(${JSON.stringify('modal')}).close();finishSong(true,true)">Release single</button></div>`);return}
 try{const song=ENCORE_ENGINE.studio.finish(s,{release:!!release});log('“'+song.title+'” '+(release?'is out. Results arrive at the end of this week.':'is ready for your album.'));queueSave();render();toast(release?'Single released. Advance the week for results.':'Finished track saved.')}
 catch(error){toast(error.message||'The master could not be finished.')}
};
releaseShelf=function(id,confirmed=false){
 const x=s.songs.find(x=>x.id===id);if(!x||x.released||!saveReady||saveConflict)return;
 if(!confirmed){modal(`<h2>Release “${esc(x.title)}”?</h2><p>This publishes the finished recording. Pay $20 and 5 energy. Results arrive at week close.</p><button class="primary" onclick="releaseShelf(${JSON.stringify(id)},true)">Publish single</button>`);return}
 try{$('modal').close();const song=ENCORE_ENGINE.studio.releaseShelf(s,id);log('“'+song.title+'” is out.');queueSave();render()}
 catch(error){toast(error.message||'The master could not be released.')}
};

/* Owned-label roster negotiations */
rosterTerms=function(a,type,share,weeks){return ENCORE_ENGINE.roster.terms(s,a.id,type,share,weeks)};
V100_rosterNegotiation=function(id){return ENCORE_ENGINE.roster.ensure(s,id)};
V100_rosterOfferPressure=function(a,t,r,n){return ENCORE_ENGINE.roster.pressure(s,a.id,t,r,n)};
V100_biddingWar=function(id){return ENCORE_ENGINE.roster.biddingWar(s,id,Math.random)};
npcBuyout=function(id){return ENCORE_ENGINE.roster.buyout(s,id)};

/* Ordered save migrations */
migrateSaveState=function(state){return ENCORE_ENGINE.migrate(state,{schema:CAREER_STATE_SCHEMA,migrations:CAREER_MIGRATIONS,getActive:()=>s,setActive:value=>{s=value}})};

/* Scheduler and one canonical week transaction. */
if(typeof V131_beginCareerWeekBase==='function')beginCareerWeek=V131_beginCareerWeekBase;
let V083_transitionAdvancing=false;
const ENCORE_MONTH_END_HOOKS=[
 ['industry-life',()=>{migrateIndustryLife();settleIndustryLife()}],
 ['team',()=>settleTeam()],
 ['assets',()=>settleAssets()],
 ['commerce',()=>settleCommerce()],
 ['depth-business',()=>V081_settleMonth(s.lastReport||{})]
];
isAnnualClosing=function(week=s.week){return ENCORE_ENGINE.scheduler.annualClosing(week)};
V083_isMonthClosing=function(week=s.week){return ENCORE_ENGINE.scheduler.monthClosing(week,calendarMonthAtWeek)};
V083_settleMonthEnd=function(){return ENCORE_ENGINE.scheduler.runMonthEnd(ENCORE_MONTH_END_HOOKS)};
V083_accumulateWeek=function(completed,beforeCash){
 if(typeof V117_settleRepRelationships==='function')V117_settleRepRelationships(completed);
 return ENCORE_ENGINE.scheduler.accumulate(s,{completed,beforeCash},{cents,calendarMonthAtWeek,catalogValue,generateCommercialOffers:()=>{if(typeof generateCommercialOffers080==='function')generateCommercialOffers080()},rollThreat:()=>{if(typeof rollThreat==='function')rollThreat()},captureSnapshot:()=>{if(typeof V131_captureSnapshot==='function')V131_captureSnapshot()}})
};

advanceWeek=function(confirmed=false){
 if(!saveReady||saveConflict)return;
 if(!confirmed){modal(`<h2>Finish the week?</h2><p>You have ${s.energy}/200 energy left. Advancing refills it to 200; unused energy does not stack. Songs, charts, contracts, touring, audience and finances resolve through the ENCORE Engine.</p><div class="controls"><button class="secondary" onclick="$(${JSON.stringify('modal')}).close()">Keep playing</button><button class="primary" onclick="$(${JSON.stringify('modal')}).close();advance(true)">Finish week</button></div>`);return}
 const result=ENCORE_ENGINE.settleWeek(s,ENCORE_engineHooks());
 if(!monthlyAdvancing){render();weekRecap(result.completed,result.count,result.added,result.debut,result.financial,result.earned)}
 return result
};

advance=function(confirmed=false){
 if(!labelActive()||monthlyAdvancing)return;
 migrateV083();
 const closing=V083_isMonthClosing(s.week),risk=typeof V080_offerRiskCount==='function'?V080_offerRiskCount(1):0;
 if(!confirmed){modal(`<h2>Finish ${esc(V083_weekDate(s.week))}?</h2><p>One chart week will resolve through the ENCORE Engine. Your unused ${s.energy}/200 energy will be replaced by 200. Songs, charts, contracts, royalties and weekly label activity update every week.</p><p>${closing?'<strong>This also closes '+esc(careerDate())+'.</strong> Monthly assets, rent, catalogs, commercial payments, sports and industry-life systems will settle once.':''} ${risk?'<strong>'+risk+' reviewed offer'+(risk===1?'':'s')+' may expire after this week.</strong>':'Unreviewed offers remain protected until you open them.'}</p><div class="controls"><button class="secondary" onclick="$(${JSON.stringify('modal')}).close()">Keep playing</button><button class="primary" onclick="$(${JSON.stringify('modal')}).close();advance(true)">Advance one week</button></div>`);return}
 backupCareer(false);V083_transitionAdvancing=true;let tx=null,recap=null;
 try{
  tx=ENCORE_ENGINE.transactWeek(s,{isMonthClosing:()=>closing,settleMonthEnd:()=>V083_settleMonthEnd(),accumulate:({completed,beforeCash})=>V083_accumulateWeek(completed,beforeCash),hooks:ENCORE_engineHooks()});
  if(!tx.ok){s=tx.state;throw tx.error}recap=tx.weekResult;queueSave();
 }catch(error){
  if(tx?.state&&tx.ok===false)s=tx.state;try{$('modal').close()}catch{}toast('The week could not finish. Your career was restored; please report this issue.');console.error(error)
 }finally{
  V083_transitionAdvancing=false;if(saveReady&&$('week'))$('week').textContent=V083_weekDate()
 }
 if(tx?.ok){render();if(recap)weekRecap(recap.completed,recap.count,recap.added,recap.debut,recap.financial,recap.earned)}
 return tx
};
