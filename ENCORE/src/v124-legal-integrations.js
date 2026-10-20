/* ENCORE 0.9.20 — Legal Affairs 2.0 integration pass.
   Keep exposure accounting attached to authoritative game systems that live
   outside the physical-asset ledger. */
const V124_ctxCore=V124_ctx;
V124_ctx=function(){
 const ctx=V124_ctxCore();
 const sportsHoldings=Array.isArray(s.v081?.sports?.holdings)?s.v081.sports.holdings.length:0;
 ctx.sports+=sportsHoldings;
 return ctx
};
