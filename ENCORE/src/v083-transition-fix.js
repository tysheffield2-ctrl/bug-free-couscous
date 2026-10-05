/* Prevent the internal week-close render from migrating the calendar before
   the outgoing month accumulator has been finalized. */
let V083_transitionAdvancing=false;
const V083_renderWithWeeklyCalendar=render;
render=function(){
  if(V083_transitionAdvancing)return V083_render082();
  return V083_renderWithWeeklyCalendar();
};
const V083_advanceWithMonthlyAccumulator=advance;
advance=function(confirmed=false){
  if(!confirmed)return V083_advanceWithMonthlyAccumulator(false);
  V083_transitionAdvancing=true;
  try{return V083_advanceWithMonthlyAccumulator(true)}
  finally{
    V083_transitionAdvancing=false;
    if(saveReady&&$('week'))$('week').textContent=V083_weekDate();
  }
};
