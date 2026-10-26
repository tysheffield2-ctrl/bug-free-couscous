/* ENCORE 1.31 — keep Stats 2.0 week history identical across legacy and UI2 week engines. */
if(typeof V131_beginCareerWeekBase==='function')beginCareerWeek=V131_beginCareerWeekBase;
const V131_accumulateWeekBase=V083_accumulateWeek;
V083_accumulateWeek=function(completed,beforeCash){
 const result=V131_accumulateWeekBase(completed,beforeCash);
 V131_captureSnapshot();
 return result;
};
