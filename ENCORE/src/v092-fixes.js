/* ENCORE 0.9.2 compatibility fixes discovered by the full regression suite. */
const V092_reviewArtistOfferDeadline=reviewArtistOffer;
reviewArtistOffer=function(id){
 const o=s.labelBusiness?.offers?.find(x=>x.id===id&&!x.used&&x.expires>=s.week);
 if(o&&typeof V080_markReviewed==='function')V080_markReviewed(o);
 return V092_reviewArtistOfferDeadline(id);
};

/* Keep the established ten-team ENCORE Pro Basketball world while removing ownership caps.
   v083 rebuilds the canonical team objects during render, so 0.9.2 owner state lives in
   s.v092 and is rehydrated whenever the sports/business layer is entered. */
V092_expandSportsUniverse=function(){
 const teams=s.v081?.sports?.teams;if(!Array.isArray(teams)||!s.v092)return;
 const state=s.v092.sports??={};state.management??={};state.teamMeta??={};
 for(const t of teams){
  const priorManagement=t.management;
  if(priorManagement&&typeof priorManagement==='object')state.management[t.id]={...priorManagement};
  const meta=state.teamMeta[t.id]??={};
  if(Number.isFinite(t.championships))meta.championships=t.championships;
  if(Number.isFinite(t.playoffAppearances))meta.playoffAppearances=t.playoffAppearances;
  if(Number.isFinite(t.seasonsCompleted))meta.seasonsCompleted=t.seasonsCompleted;
  t.management={...(state.management[t.id]||{strategy:'balanced',ticket:'balanced',facilities:0,capital:0})};
  t.championships=meta.championships??t.titles??0;
  t.playoffAppearances=meta.playoffAppearances??0;
  t.seasonsCompleted=meta.seasonsCompleted??Math.max(0,(t.season||1)-1);
  t.titles=Math.max(t.titles||0,t.championships||0);
 }
};
const V092_sportsPageBrand=V081_sportsPage;
V081_sportsPage=function(){return V092_sportsPageBrand().replace('Sports ownership.','ENCORE Pro Basketball · Sports ownership.')};
const V092_settleSportsTitles=V081_settleSports;
V081_settleSports=function(){const result=V092_settleSportsTitles();V092_expandSportsUniverse();return result};
const V092_saveTeamPlanHydrated=V092_saveTeamPlan;
V092_saveTeamPlan=function(e,id){migrateV092();return V092_saveTeamPlanHydrated(e,id)};

/* v083 recreates its canonical team objects at the end of render. Rehydrate only the
   lightweight owner fields afterwards so controls never flash back to defaults. */
const V092_renderSportsState=render;
render=function(){const result=V092_renderSportsState();if(saveReady&&s.v092)V092_expandSportsUniverse();return result};
