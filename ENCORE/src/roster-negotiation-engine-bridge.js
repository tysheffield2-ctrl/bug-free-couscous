/* Bridge legacy ENCORE negotiation helpers to the shared renderer-independent engine. */
(function(){
'use strict';
if(!globalThis.ENCORE_ROSTER_NEGOTIATION)return;
const engine=globalThis.ENCORE_ROSTER_NEGOTIATION;
rosterTerms=function(a,type,share,weeks){return engine.terms(s,a.id,type,share,weeks)};
V100_rosterNegotiation=function(id){return engine.ensure(s,id)};
V100_rosterOfferPressure=function(a,t,r,n){return engine.pressure(s,a.id,t,r,n)};
V100_biddingWar=function(id){return engine.biddingWar(s,id,Math.random)};
npcBuyout=function(id){return engine.buyout(s,id)};
})();
