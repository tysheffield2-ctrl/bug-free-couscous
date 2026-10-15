/* ENCORE v1.07 emergency compatibility — keep the mature legacy career loop on the
   proven direct weekly settlement while UI2 continues exercising the shared engine.
   Remove this shim only after mature-save parity is covered and green. */
advanceWeek=function(confirmed=false){if(!saveReady||saveConflict)return;if(!confirmed){modal('<h2>Finish this week?</h2><p>Weekly royalties, streams, charts and energy will resolve before the next week starts.</p><div class="controls"><button onclick="$(\'modal\').close()">Stay here</button><button class="primary" onclick="$(\'modal\').close();advanceWeek(true)">Finish week</button></div>');return}
tickMarket();beginCareerWeek();settleLivingWorld();generateOpeningSlots();settleWorldTour();const overheadRate=operationRate();let count=0,added=0,debut=[];s.songs.filter(x=>x.released).forEach(x=>{let n;if(x.factor===undefined){let guest=x.feature?s.world[x.feature.id]:null;let featureReach=guest?x.feature.fans*(guest.relation<=-40?.004:.018):0;x.base=reach(x);x.factor=reception(x.quality)*(x.songRules===2?(.55+x.commercial*.009):1)*(x.mood.startsWith('Raw')?rand(.65,1.4):directionFor(x).reach)*(1+s.boost)*(x.albumBoost===s.week?1.15:1);x.launchFans=s.fans;n=Math.round(x.base*x.factor);x.debutStreams=n;x.organic=n/(1+s.boost)/(x.albumBoost===s.week?1.15:1);x.breakdown='Expected reach '+compact(x.base)+'; quality '+x.quality+'/100'+(x.songRules===2?'; commercial potential '+x.commercial+'/100':'')+'; '+x.mood.split(' /')[0].toLowerCase()+' direction'+(guest?'; guest '+guest.name:'')+'; promotion '+Math.round(s.boost*100)+'%. Audience reception helped determine the final '+x.factor.toFixed(2)+'× debut. '+(x.factor<.65?'Try improving your craft before your next recording.':x.factor>=1.5?'This release outperformed its expected audience.':'This release performed within the expected range.');s.reputation=clamp(s.reputation+(x.quality>=60?1:0)+(x.factor>=1.5?2:0));debut.push(x);log('“'+x.title+'” debuted with '+compact(n)+' streams: '+outcome(x.factor).toLowerCase()+'.')}else{let guest=x.feature?s.world[x.feature.id]:null;let conflict=guest&&guest.relation<=-40?.8:1;x.organic=Math.max(8,(x.organic??x.streams)*rand(...directionFor(x).decay)+s.fans*.002/Math.sqrt(Math.max(1,s.songs.filter(x=>x.released).length)));n=Math.round(x.organic*(1+s.boost)*conflict*(x.albumBoost===s.week?1.15:1));if(x.songRules===2&&Math.random()<(.005+level('viralAbility')*.00045)*directionFor(x).viral){n=Math.round(n*rand(1.8,3.5));log('“'+x.title+'” caught a viral discovery wave.')}}n=adjustReleaseStreams(x,n);recordRegionalStreams(x,n);if(x.released===s.week){x.debutStreams=n;x.breakdown+=' Genre fit '+x.marketFit+'%; release spacing '+Math.round(x.rolloutFactor*100)+'%.'}x.streams=n;x.total+=n;count+=n;added+=Math.round(n*directionFor(x).fans*(1+s.loyalty/200)*(x.songRules===2?.75+level('charisma')*.005:1))});settleAlbumSales();worldWeek();settleLabelWeek();s.chartWeek=s.week;for(const a of s.albums)if(a.debutStreams===undefined&&a.week===s.week)a.debutStreams=albumStreams(a);let rankings=compileSongs();updateChartRecords(rankings);rankings.forEach((x,i)=>{if(x.you){let track=s.songs.find(y=>y.id===x.id);track.peak=Math.min(track.peak||Infinity,i+1)}});s.streams=count;s.total+=count;added=settleAudience(count,added);added=applyAudienceEvent('streaming',added,{reach:s.expansion.listeners});updateCareerWorld();let royalties=Math.round(count*.50*100)/100;const financial=closeFinances(royalties,overheadRate);s.energy=200;if(added>0)s.loyalty=clamp(s.loyalty+1);s.careerRecords.royalties+=royalties;s.lastReport={cashChange:financial.net,finance:financial,streams:count,fans:added,royalties,debut:debut.map(x=>x.id)};finishCareerWeek();let completed=s.week;const earned=scanAchievements();catalogReport(completed);weeklyNews(completed);s.week++;s.boost=0;log(count?compact(count)+' streams, '+fmt(added)+' net fans, and '+money(royalties)+' in royalties.':'A fresh week. New records are dropping around you.');if(s.cash<0)log('Your balance is below zero. Work shifts can cover the shortfall.');if(!monthlyAdvancing){render();weekRecap(completed,count,added,debut,financial,earned)}};

/* Actionable briefing hotfix — reports and offers should lead directly to the
   system or decision they describe instead of ending at Continue/Archive. */
function V107_openTourBriefing(){
 if($('modal')?.open)$('modal').close();
 careerTab='Touring';go('Career');
 window.setTimeout?.(()=>{const target=document.querySelector?.('.tour-active,.touring-active,.tour-route,.tour-ledger,.tour-history');target?.scrollIntoView?.({behavior:'smooth',block:'start'})},0)
}
function V107_opportunityForBriefing(b){
 if(!b?.id?.startsWith('offer:'))return null;
 const week=Number(String(b.id).split(':')[1]),list=s.expansion?.opportunities||[];
 return list.find(o=>o.id===`offer-${week}`)||list.find(o=>Number(o.week)===week)||null
}
function V107_reviewOpportunityBriefing(id){
 const b=s.achievements?.briefings?.find(x=>x.id===id),o=V107_opportunityForBriefing(b);
 if($('modal')?.open)$('modal').close();
 if(o&&typeof V080_markReviewed==='function')V080_markReviewed(o);
 if(o&&!o.done&&o.expires>=s.week&&typeof acceptOpportunity==='function'){acceptOpportunity(o.id);return}
 careerTab='Opportunities';go('Career');
 if(o?.done)toast?.('That opportunity has already been resolved.');else if(o&&o.expires<s.week)toast?.('That opportunity has expired.')
}
const V107_offerBriefingButtonBase=offerBriefingButton;
offerBriefingButton=function(b){
 const id=String(b?.id||'');
 if(id.startsWith('tour-week:'))return `<button class="memo-primary" onclick="V107_openTourBriefing()">Review tour report</button>`;
 if(id.startsWith('tour-complete:'))return `<button class="memo-primary" onclick="V107_openTourBriefing()">Open Touring</button>`;
 if(id.startsWith('offer:')){const label=/interview/i.test(String(b?.title||''))?'Review interview offer':'Review opportunity';return `<button class="memo-primary" onclick="V107_reviewOpportunityBriefing('${esc(id)}')">${label}</button>`}
 return V107_offerBriefingButtonBase(b)
};
