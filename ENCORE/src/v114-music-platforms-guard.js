/* ENCORE 0.9.12 migration + navigation guard.
   Existing careers can already contain released songs when Music Platform
   Ecosystem first initializes. Mark the in-progress seed before nested track
   initialization so the migration remains one-pass instead of recursing.

   Visual System 2.0 renders the More directory from V080_destinations rather
   than the older destinations array. Keep both registries synchronized so the
   Music Platforms screen is always discoverable after deployment. */
const V114_stateSeedBase=V114_state;
V114_state=function(state=s){
 const p=state?.musicPlatforms;
 if(p&&p.seeded!==true)p.seeded=true;
 return V114_stateSeedBase(state)
};

const V114_PLATFORM_DESTINATION=['Music platforms','Music','Platforms','Streaming services, playlists, video and audience profiles',3];
function V114_installPlatformDestination(rows){
 if(!Array.isArray(rows)||rows.some(x=>x?.[2]==='Platforms'))return;
 const after=rows.findIndex(x=>x?.[2]==='Releases');
 rows.splice(after>=0?after+1:rows.length,0,[...V114_PLATFORM_DESTINATION]);
}
if(typeof destinations!=='undefined')V114_installPlatformDestination(destinations);
if(typeof V080_destinations!=='undefined')V114_installPlatformDestination(V080_destinations);

const V114_screenFamilyGuardBase=screenFamily;
screenFamily=function(){
 if(tab==='Career'&&careerTab==='Platforms')return 'studio';
 return V114_screenFamilyGuardBase()
};
