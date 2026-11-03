/* ENCORE Native Shell 3.2 compatibility + simplification contracts.
   Keep established Home/onboarding/accessibility hooks while removing redundant
   navigation and deep-linking Home platform buttons to their real profiles. */
const V137_openPlatformsBase=V137_openPlatforms;
V137_openPlatforms=function(id=''){
 const key=String(id||'').toLowerCase();
 if(['vybe','muse','amp','worldwave','frame'].includes(key)){
  if(typeof V128_openPlatform==='function'){V128_openPlatform(key);return}
  if(typeof V114_setTab==='function'){V114_setTab(key);careerTab='Platforms';tab='Career';render();window.scrollTo?.({top:0,behavior:'instant'});return}
 }
 return V137_openPlatformsBase()
};

const V137_nativeHomeBase=V137_home;
V137_home=function(){
 let html=V137_nativeHomeBase();
 ['vybe','muse','amp'].forEach((id,i)=>{html=html.replace(`class="p${i+1}" onclick="V137_openPlatforms()"`,`class="p${i+1}" onclick="V137_openPlatforms('${id}')"`)});
 return html
};
home=function(){
 let html=V137_home();
 html=html.replace('<article class="v137-shell v137-home">','<article class="v137-shell v137-home v103-home home-dashboard"><span class="encore-wordmark v137-compat-marker" aria-hidden="true"></span>');
 const desk='<div class="v137-desk-label v103-desk">CAREER DESK</div>';
 if(!html.includes('CAREER DESK'))html=html.replace('<section class="v137-menu-stack">',desk+'<section class="v137-menu-stack">');
 return html
};

const V137_nativeNavigationBase=navigationBar;
navigationBar=function(){
 let html=V137_nativeNavigationBase();
 html=html.replace(/<button class="([^"]*)" aria-label="Home"/,(_,classes)=>`<button class="${classes} nav-home"${tab==='Home'?' aria-current="page"':''} aria-label="Home"`);
 return html
};

function V137_moreHub(){
 return `<article class="v137-shell v137-more">${V137_topbar()}<section class="v137-more-intro"><span>MORE</span><h1>Career & utilities</h1><p>Secondary systems without another directory wall.</p></section><section class="v137-menu-stack">${V137_menuRow('people','Representation','Managers, agents, attorneys and your professional team',"encoreOpenIconDestination('Agency')")}${V137_menuRow('contract','Legal Affairs','Disputes, counsel, exposure and legal matters',"encoreOpenIconDestination('LegalAffairs')")}${V137_menuRow('business','Label HQ','Operate and grow your owned label',"encoreOpenIconDestination('Labels')")}${V137_menuRow('finance','Finance','Income, expenses, taxes and detailed accounting',"encoreOpenIconDestination('Finances')")}${V137_menuRow('more','Settings','Game, accessibility and career preferences',"encoreOpenIconDestination('Settings')")}</section></article>`
}
menu=V137_moreHub;

const V137_nativeWealthHubBase=V137_wealthHub;
V137_wealthHub=function(){return V137_nativeWealthHubBase().replace(/<section class="v137-context-actions wealth-actions">[\s\S]*?<\/section>/,'')};

if(typeof gameplayTour!=='undefined'){
 const closeWeek=gameplayTour.find(x=>x.page==='Home'&&x.target==='.weekbar');
 if(closeWeek)closeWeek.target='.v137-end-week';
}
