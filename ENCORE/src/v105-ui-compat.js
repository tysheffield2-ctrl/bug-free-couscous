/* ENCORE v1.05 UI compatibility
   Keep legacy/live presentation destinations reachable after the newer shell overrides. */

const V105_industryDesk = industry;
industry = function(){
  if(industryTab==='World pulse' && typeof V082_worldPulsePage==='function'){
    return V082_worldPulsePage();
  }
  const html=V105_industryDesk();
  if(!html || typeof html!=='string' || html.includes("industryTab='World pulse'"))return html;
  return html.replace(
    /(<nav class="v103-industry-tabs">[\s\S]*?)(<\/nav>)/,
    `$1<button class="${industryTab==='World pulse'?'selected':''}" onclick="industryTab='World pulse';render()">World Pulse</button>$2`
  );
};
