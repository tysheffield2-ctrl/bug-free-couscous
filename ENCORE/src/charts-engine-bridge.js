/* Bind legacy ENCORE chart history/publication to engine/charts.js. */
initialChartBook=function(){return ENCORE_CHARTS.initial(1)};
trackChartIssue=function(kind,list,baseline=false){
 return ENCORE_CHARTS.track(s,kind,list,{baseline,owner:(_state,k,id)=>chartOwner(k,id)});
};
updateChartRecords=function(rankings){
 const result=ENCORE_CHARTS.publish(s,{songs:rankings,albums:compileAlbums(),owner:(_state,k,id)=>chartOwner(k,id)});
 if(!result.published)return;
 updateCertifications();
 lateChartAlerts();
};
chartRecord=function(kind,key){return ENCORE_CHARTS.record(s,kind,key)};
