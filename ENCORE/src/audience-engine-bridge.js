/* Bind legacy ENCORE to the shared renderer-independent Audience Engine. */
applyAudienceEvent=function(source,delta,options={}){
 return ENCORE_AUDIENCE.apply(s,source,delta,options,{
  ensureWorld:()=>migrateCareerWorld(),
  reconcile:()=>reconcileRegionalAudience()
 });
};
