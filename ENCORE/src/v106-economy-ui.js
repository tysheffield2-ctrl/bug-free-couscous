/* ENCORE v1.06 economy presentation cleanup.
   The 1.0 finance engine already replaced percentage overhead with explicit costs.
   This layer removes the stale legacy wording still left in the shell / finance UI. */

function V106_operatingCostNow(){
  try{return V100_operatingTotal(V100_operatingCosts())}catch{return 0}
}

const V106_financeScreenBase=financeScreen;
financeScreen=function(){
  let html=V106_financeScreenBase();
  const operating=money(V106_operatingCostNow());
  html=html.replace(/<span>Career overhead<\/span><strong>[^<]*<\/strong>/g,`<span>Weekly operating costs</span><strong>${operating}</strong>`);
  html=html.replace(/Career overhead/gi,'Operating costs');
  return html
};

const V106_renderEconomyBase=render;
render=function(){
  const result=V106_renderEconomyBase();
  const label=$('weekly-cost');
  if(label)label.textContent='Explicit operating costs · taxes tracked';
  return result
};

const V106_advanceWeekBase=advanceWeek;
advanceWeek=function(confirmed=false){
  if(confirmed)return V106_advanceWeekBase(true);
  if(!saveReady||saveConflict)return;
  const operating=V106_operatingCostNow();
  modal(`<h2>Finish the week?</h2><p>You have ${s.energy}/200 energy left. Advancing refills it to 200; unused energy does not stack.</p><p>This week’s simulated operating costs are approximately <strong>${money(operating)}</strong> before any project, staff, representation, contract or tax charges. A tax reserve may also be adjusted at week close.</p><div class="controls"><button class="secondary" onclick="$(${JSON.stringify('modal')}).close()">Keep playing</button><button class="primary" onclick="$(${JSON.stringify('modal')}).close();advance(true)">Finish week</button></div>`);
};
