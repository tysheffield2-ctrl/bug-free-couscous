/* ENCORE Native Shell 3.2 — simplify Home/More and deep-link platform profiles.
   Presentation-only: authoritative platform, finance, business and save systems stay unchanged. */
const V139_PLATFORM_IDS=new Set(['vybe','muse','amp','worldwave','frame']);
const V139_openPlatformsBase=V137_openPlatforms;
V137_openPlatforms=function(id=''){
 const key=String(id||'').toLowerCase();
 if(key&&V139_PLATFORM_IDS.has(key)){
  if(typeof V128_openPlatform==='function'){V128_openPlatform(key);return}
  if(typeof V114_setTab==='function'){V114_setTab(key);careerTab='Platforms';tab='Career';render();window.scrollTo?.({top:0,behavior:'instant'});return}
 }
 return V139_openPlatformsBase()
};

const V139_homeBase=V137_home;
V137_home=function(){
 let html=V139_homeBase();
 ['vybe','muse','amp'].forEach((id,i)=>{html=html.replace(`class="p${i+1}" onclick="V137_openPlatforms()"`,`class="p${i+1}" onclick="V137_openPlatforms('${id}')"`)});
 return html
};
/* Preserve established Home/accessibility hooks, but intentionally retire Next Move. */
home=function(){
 let html=V137_home();
 html=html.replace('<article class="v137-shell v137-home">','<article class="v137-shell v137-home v103-home home-dashboard"><span class="encore-wordmark v137-compat-marker" aria-hidden="true"></span>');
 const desk='<div class="v137-desk-label v103-desk">CAREER DESK</div>';
 if(!html.includes('CAREER DESK'))html=html.replace('<section class="v137-menu-stack">',desk+'<section class="v137-menu-stack">');
 return html
};

function V139_moreHub(){
 return `<article class="v137-shell v139-more">${V137_topbar()}<section class="v139-more-intro"><span>MORE</span><h1>Career & utilities</h1><p>Secondary systems without another directory wall.</p></section><section class="v137-menu-stack">${V137_menuRow('people','Representation','Managers, agents, attorneys and your professional team',"encoreOpenIconDestination('Agency')")}${V137_menuRow('contract','Legal Affairs','Disputes, counsel, exposure and legal matters',"encoreOpenIconDestination('LegalAffairs')")}${V137_menuRow('business','Label HQ','Operate and grow your owned label',"encoreOpenIconDestination('Labels')")}${V137_menuRow('finance','Finance','Income, expenses, taxes and detailed accounting',"encoreOpenIconDestination('Finances')")}${V137_menuRow('more','Settings','Game, accessibility and career preferences',"encoreOpenIconDestination('Settings')")}</section></article>`
}
/* Menu/More no longer renders the legacy icon directory. */
menu=V139_moreHub;

const V139_wealthHubBase=V137_wealthHub;
V137_wealthHub=function(){
 return V139_wealthHubBase().replace(/<section class="v137-context-actions wealth-actions">[\s\S]*?<\/section>/,'')
};
