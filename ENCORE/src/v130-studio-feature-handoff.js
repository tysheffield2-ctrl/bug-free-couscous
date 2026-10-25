/* Complete the simplified Song / Features / Mood handoff using the current
   outgoing-feature negotiation flow. The v130 form chooses the artist; this
   wrapper opens the existing cash / hybrid / royalty negotiation after the
   song draft is created. */
const V130_featureSongBase=newSong;
newSong=function(e){
 const data=new FormData(e.target),raw=data.get('feature'),featureId=raw===''?null:Number(raw);
 V130_featureSongBase(e);
 if(s.draft&&Number.isInteger(featureId)&&featureId>=0&&typeof studioGuest==='function')studioGuest(featureId)
};
