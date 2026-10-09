/* ENCORE 0.9.2 compatibility fixes discovered by the full regression suite. */
const V092_reviewArtistOfferDeadline=reviewArtistOffer;
reviewArtistOffer=function(id){
 const o=s.labelBusiness?.offers?.find(x=>x.id===id&&!x.used&&x.expires>=s.week);
 if(o&&typeof V080_markReviewed==='function')V080_markReviewed(o);
 return V092_reviewArtistOfferDeadline(id);
};

/* Keep the established ten-team ENCORE Pro Basketball world while removing ownership caps. */
V092_expandSportsUniverse=function(){
 const teams=s.v081?.sports?.teams;if(!Array.isArray(teams))return;
 for(const t of teams){
  t.championships??=t.titles??0;
  t.playoffAppearances??=0;
  t.seasonsCompleted??=Math.max(0,(t.season||1)-1);
  t.management??={strategy:'balanced',ticket:'balanced',facilities:0,capital:0};
 }
};
const V092_sportsPageBrand=V081_sportsPage;
V081_sportsPage=function(){return V092_sportsPageBrand().replace('Sports ownership.','ENCORE Pro Basketball · Sports ownership.')};
const V092_settleSportsTitles=V081_settleSports;
V081_settleSports=function(){const result=V092_settleSportsTitles();for(const t of s.v081?.sports?.teams||[])t.titles=Math.max(t.titles||0,t.championships||0);return result};
