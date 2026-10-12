/* ENCORE 0.9.5 compatibility: keep the new notification layer passive during boot. */
migrateV096=function(){
 if(!s.v096)s.v096={version:V096_SCHEMA,seenPriority:V096_priorityRaw().map(x=>x.key).slice(-200)};
 s.v096.version=V096_SCHEMA;
 if(!Array.isArray(s.v096.seenPriority))s.v096.seenPriority=[];
 s.v096.seenPriority=[...new Set(s.v096.seenPriority.map(String))].slice(-300);
 V096_consolidateDestinations()
};

/* Creative/tour migrations may create world state. Only run them once the title layer is gone
   and the player is actually in the career, never while boot is restoring the save. */
V096_preparePriority=function(){
 if(!saveReady||!s.started||titleVisible||monthlyAdvancing)return;
 migrateV096();
 migrateV081?.();
 migrateTouring?.();
 V081_generateCreativeOffers?.();
 generateOpeningSlots?.();
 V096_consolidateDestinations()
};

/* The game normally runs in browsers with requestAnimationFrame. Tests and stripped-down
   embedded runtimes may not provide it, so defer safely without changing browser behavior. */
if(typeof globalThis.requestAnimationFrame!=='function')globalThis.requestAnimationFrame=fn=>setTimeout(fn,0);
