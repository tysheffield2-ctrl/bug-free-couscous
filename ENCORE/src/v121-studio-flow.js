/* ENCORE 0.9.17 — Studio flow cleanup.
   Song identity stays front-loaded in the creative brief. Recording and mixing
   are direct production stages, so onboarding must not teach removed choices. */
if(Array.isArray(gameplayTour)){
 const step=gameplayTour.find(x=>x?.page==='Create'&&x?.title==='Choose your sound');
 if(step){
  step.title='Finish the record';
  step.text=()=> 'After writing, record the performance for $40 and 15 energy, then mix it for $30 and 15 energy. Your creative brief, skills, production budget, features and career context shape the finished record; there is no extra recording/mix choice menu.';
 }
}
