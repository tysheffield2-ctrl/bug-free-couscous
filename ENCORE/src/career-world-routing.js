/* Route the Living Career destinations to their actual player-facing screens.
   These routes are installed late because the 0.8 presentation layers own the final Career renderer. */
const CAREER_WORLD_ROUTE_IDS=new Set(['CareerPulse','Audience']);
function careerWorldPage(id){
 if(id==='CareerPulse')return head('Know where your career stands','Career Pulse.')+careerPulseCard();
 if(id==='Audience')return regionalAudiencePage();
 return '';
}
const careerWorldBaseOpenDestination=openDestination;
openDestination=function(id){
 if(CAREER_WORLD_ROUTE_IDS.has(id)){
  careerTab=id;
  tab='Career';
  render();
  window.scrollTo?.(0,0);
  return;
 }
 return careerWorldBaseOpenDestination(id);
};
const careerWorldBaseCareer=career;
career=function(){
 if(CAREER_WORLD_ROUTE_IDS.has(careerTab))return careerWorldPage(careerTab);
 return careerWorldBaseCareer();
};
