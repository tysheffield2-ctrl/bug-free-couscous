/* Low-risk integration layer: extend core without rewriting core.js. */
const encoreCoreRender=render;
const encoreCoreCloseFinances=closeFinances;
render=function(){
  migrateEmpire();
  if(tab!=='Empire'){
    encoreCoreRender();
    const nav=$('nav');
    if(nav&&!nav.querySelector('[data-empire-nav]'))nav.insertAdjacentHTML('beforeend','<button data-empire-nav onclick="go(\'Empire\')"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h16M6 20V9l6-5 6 5v11M9 20v-6h6v6M4 9h16"/></svg>Empire</button>');
    return;
  }
  const wanted=tab;
  tab='Home';encoreCoreRender();tab=wanted;
  const nav=$('nav');if(nav){nav.querySelectorAll('button').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-current','false')});nav.insertAdjacentHTML('beforeend','<button data-empire-nav class="active" aria-current="page" onclick="go(\'Empire\')"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h16M6 20V9l6-5 6 5v11M9 20v-6h6v6M4 9h16"/></svg>Empire</button>')}
  $('app').innerHTML=offlineBanner()+sandboxBar()+empirePage();$('app').className='screen-empire';queueSave();
};
closeFinances=function(...args){empireWeekTick();return encoreCoreCloseFinances(...args)};
reach=function(track){const guests=featureGuests(track),featureReach=guests.reduce((n,g)=>n+(g.fans||0)*((g.relation??0)<=-40?.004:.018)*(g.genre===s.genre?1:.8),0);return Math.round(180+s.fans*.9+featureReach)};
