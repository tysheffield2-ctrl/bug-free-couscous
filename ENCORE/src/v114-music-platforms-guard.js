/* ENCORE 0.9.12 migration guard.
   Existing careers can already contain released songs when Music Platform
   Ecosystem first initializes. Mark the in-progress seed before nested track
   initialization so the migration remains one-pass instead of recursing. */
const V114_stateSeedBase=V114_state;
V114_state=function(state=s){
 const p=state?.musicPlatforms;
 if(p&&p.seeded!==true)p.seeded=true;
 return V114_stateSeedBase(state)
};
