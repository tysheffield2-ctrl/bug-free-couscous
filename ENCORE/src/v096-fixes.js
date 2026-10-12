/* ENCORE 0.9.5 compatibility: notification state should not touch an unstarted career. */
const V096_migrateStartedCareer=migrateV096;
migrateV096=function(){
 if(saveReady&&!s.started)return;
 return V096_migrateStartedCareer()
};

/* The game normally runs in browsers with requestAnimationFrame. Tests and stripped-down
   embedded runtimes may not provide it, so defer safely without changing browser behavior. */
if(typeof globalThis.requestAnimationFrame!=='function')globalThis.requestAnimationFrame=fn=>setTimeout(fn,0);
