/* ENCORE 0.9.25 — Native Shell compatibility contracts.
   Keep established Home/onboarding/accessibility hooks alive inside the redesigned
   shell rather than forcing older systems to know about the new presentation. */
const V137_nativeHomeBase=home;
home=function(){
 let html=V137_nativeHomeBase();
 html=html.replace('<article class="v137-shell v137-home">','<article class="v137-shell v137-home v103-home home-dashboard"><span class="encore-wordmark v137-compat-marker" aria-hidden="true"></span>');
 const next=typeof encoreNextMove==='function'?encoreNextMove():'';
 if(next&&!html.includes('NEXT MOVE'))html=html.replace('<section class="v137-menu-stack">',next+'<div class="v137-desk-label">CAREER DESK</div><section class="v137-menu-stack">');
 else if(!html.includes('CAREER DESK'))html=html.replace('<section class="v137-menu-stack">','<div class="v137-desk-label">CAREER DESK</div><section class="v137-menu-stack">');
 return html
};
const V137_nativeNavigationBase=navigationBar;
navigationBar=function(){
 let html=V137_nativeNavigationBase();
 html=html.replace(/<button class="([^"]*)" aria-label="Home"/,(_,classes)=>`<button class="${classes} nav-home"${tab==='Home'?' aria-current="page"':''} aria-label="Home"`);
 return html
};
if(typeof gameplayTour!=='undefined'){
 const closeWeek=gameplayTour.find(x=>x.page==='Home'&&x.target==='.weekbar');
 if(closeWeek)closeWeek.target='.v137-end-week';
}
