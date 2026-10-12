/* ENCORE 1.0.2 — hard gate player-label roster execution behind the paper contract room. */
const V102_confirmRosterOfferOld=confirmRosterOffer;
confirmRosterOffer=function(){
 const t=pendingRosterOffer;
 const active=globalThis.V101_activeContract;
 if(t&&(!active||active.mode!=='roster'||active.id!=='roster-'+t.artist)){
  if(typeof V101_openRosterContract==='function'&&V101_openRosterContract()!==false)return;
 }
 return V102_confirmRosterOfferOld();
};
