/* ENCORE Premium Home 1.0
 * Editorial forest palette, compact white action rows and real career state.
 * This is presentation only: the core renderer retains routing, forms and simulation.
 */
V137_ICONS.calendar='<rect x="3.5" y="5.5" width="17" height="15" rx="2"/><path d="M7 3v5M17 3v5M4 10h16M8 14h3M13 14h3M8 17h3"/>';
const ENCORE_PREMIUM_NAV=[
 {route:'Home',label:'Home',icon:'home'},
 {route:'ReleasePlan',label:'Calendar',icon:'calendar'},
 {route:'Songs',label:'Studio',icon:'studio'},
 {route:'Features',label:'Industry',icon:'people'},
 {route:'Menu',label:'More',icon:'more'}
];
const ENCORE_PREMIUM_ACTIVE={
 Home:'Home',ReleasePlan:'ReleasePlan',ReleaseDetail:'ReleasePlan',
 Songs:'Songs',Create:'Songs',SongDetail:'Songs',Albums:'Songs',AlbumEdit:'Songs',Features:'Features',
 Menu:'Menu',Stats:'Menu',Guide:'Menu',Activity:'Menu',Saves:'Menu',Appearance:'Menu',
 Marketing:'Menu',CampaignDetail:'Menu',Pulse:'Menu',PulseCompose:'Menu',PulsePost:'Menu',
 Charts:'Menu',ChartDetail:'Menu',Tours:'Menu',AlbumDetail:'Songs',ArtistFile:'Menu'
};
Object.assign(EUI,{
 row(icon,title,note,action,tag=''){
  const safeIcon=Object.prototype.hasOwnProperty.call(V137_ICONS,icon)?icon:'more';
  return `<button class="core-row" data-icon="${safeIcon}" onclick="${action}" aria-label="${esc(title)}"><span class="core-row-art" aria-hidden="true">${V137_icon(safeIcon)}</span><span class="core-row-copy"><strong>${esc(title)}</strong><small>${esc(note)}</small></span>${tag?`<span class="core-row-badge">${esc(String(tag))}</span>`:''}<b aria-hidden="true">›</b></button>`;
 },
 header(){
  const home=tab==='Home',name=esc(s.name||'Your artist'),genre=esc(s.genre||'Artist'),portrait=home?V129_portrait(V129_get()):'';
  return `<header class="core-header ${home?'core-header-home':'core-header-compact'}">
   <div class="core-premium-masthead">
    <div class="core-premium-logo"><span class="core-logo-flourish" aria-hidden="true">✦</span><strong>ENCORE</strong><small>MUSIC CAREER SIMULATION</small></div>
    <button class="core-theme-toggle" onclick="toggleTheme()" aria-label="Switch to ${theme==='dark'?'light':'dark'} mode">${theme==='dark'?'☀ Light':'☾ Dark'}</button>
   </div>
   ${home?`<div class="core-premium-identity"><span class="core-premium-portrait" aria-hidden="true">${portrait}</span><div class="core-premium-person"><span class="core-premium-eyebrow">YOUR MUSIC CAREER</span><h1>${name}</h1><p>${genre} · ${esc(tierNames[tier(s.fans)])}</p><div class="core-premium-reach"><span>${compact(s.fans)} fans</span><span>${compact(s.total)} lifetime streams</span></div></div></div>`:''}
   <div class="core-premium-resources"><div><small>WEEK</small><strong>${s.week}</strong></div><div><small>CASH</small><strong>${money(s.cash)}</strong></div><div><small>ENERGY</small><strong>${Math.round(s.energy)}/200</strong></div><button class="core-week-action" onclick="advance()">End week <span aria-hidden="true">›</span></button></div>
   <button id="core-save-status" class="core-save-status" onclick="saveNow()" aria-label="Save career">${esc($('save-status')?.textContent||'Autosave ready')}</button>
  </header>`;
 },
 nav(){
  const current=ENCORE_PREMIUM_ACTIVE[tab]||'Menu';
  return ENCORE_PREMIUM_NAV.map(({route,label,icon})=>`<button onclick="go('${route}')" aria-label="${label}" ${route===current?'aria-current="page"':''}>${V137_icon(icon)}<span>${label}</span></button>`).join('');
 },
 home(){
  const released=s.songs.filter(x=>x.released).length,projects=(s.draft?1:0)+s.projects.length,
    touring=activeTour(),planned=s.songs.filter(x=>x.scheduledRelease&&!x.released).length;
  return `<div class="core-home-heading"><span>YOUR CAREER · YOUR DECISIONS</span><h2>Make your next move.</h2></div>
  <div class="core-list core-home-list">
   ${EUI.row('song','Write a Song',s.draft?'Continue your current recording':'Write, record, and shape new music',"go('Create')",projects?projects+' ACTIVE':'')}
   ${EUI.row('catalog','Released Songs','Manage your catalog and performance',"go('Songs')",released?released+' RELEASED':'')}
   ${EUI.row('people','Features','Create with artists across the industry',"go('Features')")}
   ${EUI.row('album','Albums','Build projects and grow your catalog',"go('Albums')",s.albums.length?s.albums.length+' RELEASED':'')}
   ${EUI.row('market','Release Strategy','Choose timing and launch against competition',"go('ReleasePlan')",planned?planned+' PLANNED':'')}
   ${EUI.row('tour','Tours',touring?'Your current tour is underway':'Book shows and grow your audience live',"go('Tours')",touring?'ON TOUR':'')}
   ${EUI.row('chart','Charts','Rankings, peaks, and release milestones',"go('Charts')")}
   ${EUI.row('marketing','Marketing','Campaigns, promotion and audience growth',"go('Marketing')")}
   ${EUI.row('pulse','PULSE','Your audience, the scene, and industry buzz',"go('Pulse')")}
   ${EUI.row('artist','Artist File','Your stats, reputation, and career progress',"go('ArtistFile')")}
  </div>
  <div class="core-home-heading core-home-heading-secondary"><span>KEEP MOVING</span><h2>Quick actions</h2></div>
  <div class="core-quick"><button onclick="action('work')">Work <small>+$180 · 15 energy</small></button><button onclick="action('rest')" ${s.restWeek===s.week?'disabled':''}>Rest <small>+40 energy</small></button><button onclick="go('Stats')">Skills <small>Train your craft</small></button></div>
  <section class="core-recent"><h2>Latest activity</h2>${s.history.slice(0,3).map(x=>`<p><small>Week ${x.week}</small>${esc(x.text)}</p>`).join('')||'<p>Your next career moment starts with a decision.</p>'}</section>`;
 }
});
