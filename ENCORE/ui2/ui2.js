(()=>{
  'use strict';
  const root=document.getElementById('ui2-root');
  let state=null,saveMeta=null,current='home',toastTimer=null;

  const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const num=value=>Number.isFinite(Number(value))?Number(value):0;
  const compact=value=>{
    const n=num(value),a=Math.abs(n),units=[[1e12,'T'],[1e9,'B'],[1e6,'M'],[1e3,'K']];
    for(const [size,label] of units)if(a>=size)return `${(n/size).toFixed(a>=size*100?0:a>=size*10?1:2).replace(/\.0+$/,'')}${label}`;
    return Math.round(n).toLocaleString('en-US')
  };
  const money=value=>{
    const n=num(value),a=Math.abs(n);
    if(a>=1e12)return `${n<0?'−':''}$${compact(a)}`;
    if(a>=1e6)return `${n<0?'−':''}$${compact(a)}`;
    return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n)
  };
  const clamp=(v,min=0,max=100)=>Math.max(min,Math.min(max,num(v)));
  const thresholds=[0,1000,25000,250000,2000000,20000000,100000000];
  const tierNames=['Unknown','Emerging','Breakout','Star','Superstar','Global star','Global icon'];
  const artistTier=fans=>tierNames[thresholds.reduce((out,threshold,index)=>num(fans)>=threshold?index:out,0)];
  const careerDate=week=>{
    const w=Math.max(1,Math.floor(num(week)||1)),year=2026+Math.floor((w-1)/52),offset=(w-1)%52;
    const starts=[0,4,8,13,17,21,26,30,34,39,43,47],names=['January','February','March','April','May','June','July','August','September','October','November','December'];
    let month=0;for(let i=0;i<starts.length;i++)if(offset>=starts[i])month=i;
    return `${names[month]} ${year}`
  };
  const initials=name=>String(name||'?').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'?';
  const hash=value=>{let h=2166136261>>>0;for(const ch of String(value||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0}return h>>>0};

  function fallbackState(){
    return {
      name:'Solace',genre:'Hip-hop',week:1,cash:650,fans:42,energy:200,reputation:8,streams:0,total:0,skill:0,stage:0,
      songs:[],albums:[],feed:[],history:[{week:1,text:'Your story starts here.'}],
      development:{writing:0,recording:0,producing:0,charisma:0,marketability:0},
      labelBusiness:{company:null,offers:[]},achievements:{briefings:[]},empire:{assets:[]}
    }
  }
  async function loadCareer(){
    root.innerHTML='<div class="ui2-error"><h1>Loading UI2…</h1><p>Reading your ENCORE career without touching the old presentation layer.</p></div>';
    try{
      const response=await fetch('/api/save',{credentials:'same-origin',cache:'no-store'});
      if(!response.ok)throw new Error(`Save read failed (${response.status})`);
      const payload=await response.json();
      saveMeta=payload;
      state=payload?.save?.state||fallbackState();
    }catch(error){
      console.warn('UI2 save read failed',error);
      state=fallbackState();
      saveMeta={save:null,error:true};
    }
    routeFromHash();
  }

  function portraitSvg(name){
    const h=hash(String(name).toLowerCase());
    const skins=['#633b2c','#80513c','#9d684d','#ba8061','#d7a27f'];
    const hairs=['#15100e','#2a1b15','#442e21','#0f1012'];
    const shirts=['#1c3950','#49302f','#254437','#463357','#4b4028'];
    const skin=skins[h%skins.length],hair=hairs[(h>>>3)%hairs.length],shirt=shirts[(h>>>6)%shirts.length];
    const glasses=(h>>>10)%4===0,beard=(h>>>12)%3===0;
    return `<svg viewBox="0 0 240 320" role="img" aria-label="Illustrated portrait of ${esc(name)}">
      <defs><linearGradient id="bg-${h}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#183148"/><stop offset="1" stop-color="#091018"/></linearGradient></defs>
      <rect width="240" height="320" rx="18" fill="url(#bg-${h})"/>
      <circle cx="194" cy="52" r="54" fill="#d2aa60" opacity=".08"/>
      <path d="M24 320Q37 231 105 217H144Q207 232 220 320Z" fill="${shirt}"/>
      <path d="M101 195H145V234H101Z" fill="${skin}"/>
      <ellipse cx="123" cy="144" rx="63" ry="78" fill="${skin}"/>
      <ellipse cx="60" cy="148" rx="11" ry="21" fill="${skin}"/><ellipse cx="186" cy="148" rx="11" ry="21" fill="${skin}"/>
      <path d="M61 127Q63 62 124 60Q188 61 188 131Q166 102 124 101Q83 101 61 127Z" fill="${hair}"/>
      <path d="M87 140q14-8 27 0M134 140q14-8 27 0" fill="none" stroke="#2b1f1a" stroke-width="4" stroke-linecap="round"/>
      <circle cx="102" cy="146" r="4" fill="#171310"/><circle cx="147" cy="146" r="4" fill="#171310"/>
      <path d="M123 151l-6 29h14" fill="none" stroke="#764d3b" stroke-width="3" stroke-linecap="round"/>
      ${beard?`<path d="M84 183Q123 224 164 182Q157 231 123 239Q91 229 84 183Z" fill="${hair}" opacity=".77"/>`:''}
      <path d="M103 193Q123 204 143 193" fill="none" stroke="#7b3d39" stroke-width="4" stroke-linecap="round"/>
      ${glasses?`<g fill="none" stroke="#cfb878" stroke-width="4"><rect x="80" y="132" width="39" height="29" rx="10"/><rect x="130" y="132" width="39" height="29" rx="10"/><path d="M119 142h11"/></g>`:''}
      <rect x="18" y="274" width="58" height="28" rx="5" fill="#05080c" opacity=".78"/><text x="47" y="293" text-anchor="middle" fill="#efece4" font-family="Arial,sans-serif" font-size="14" font-weight="800">${esc(initials(name))}</text>
    </svg>`
  }

  function latestRelease(){
    const songs=Array.isArray(state.songs)?state.songs:[];
    return songs.filter(song=>song?.released).at(-1)||songs.at(-1)||null
  }
  function playerStats(){
    const dev=state.development||{};
    return [
      ['Writing',dev.writing??state.skill??0],
      ['Recording',dev.recording??state.skill??0],
      ['Producing',dev.producing??0],
      ['Charisma',dev.charisma??state.reputation??0],
      ['Marketability',dev.marketability??state.reputation??0]
    ].map(([name,value])=>[name,Math.round(clamp(value))])
  }
  function recentHistory(){
    const rows=Array.isArray(state.history)?state.history.slice(-8).reverse():[];
    return rows.length?rows:[{week:state.week||1,text:'Your current career history will appear here as UI2 migration continues.'}]
  }
  function feedItems(){
    const items=[];
    const latest=latestRelease();
    if(latest)items.push({icon:'♪',title:`${latest.title||'Your latest release'} is in circulation`,detail:`${compact(latest.total||latest.streams||0)} lifetime streams`,meta:'Music'});
    const offers=state.labelBusiness?.offers||[];
    const activeOffers=offers.filter(x=>!x?.declined&&!x?.accepted).slice(0,2);
    for(const offer of activeOffers)items.push({icon:'↗',title:offer.label?`${offer.label} wants to talk`:'A business offer is waiting',detail:'Review the terms before making a decision.',meta:'Offer'});
    const briefings=state.achievements?.briefings||[];
    for(const note of briefings.filter(x=>!x?.read).slice(-2).reverse())items.push({icon:'!',title:note.title||note.text||'Career update',detail:note.detail||'A new career development needs your attention.',meta:'Update'});
    if(!items.length){
      items.push({icon:'•',title:'Your desk is clear',detail:'No major decision is waiting right now.',meta:'Now'});
      items.push({icon:'+',title:'Build the next chapter',detail:'Create music, develop your skills, or pursue a new opportunity.',meta:'Career'});
    }
    return items.slice(0,5)
  }

  function shell(content){
    const hasSave=!!saveMeta?.save;
    return `<div class="ui2-app">
      <header class="ui2-topbar">
        <div class="ui2-brand">ENCORE<span class="ui2-brand-mark">®</span></div>
        <div class="ui2-status">${hasSave?'Career loaded ✓':'UI2 sample career'}</div>
        <div class="ui2-topmeta"><span><strong>UI2 PREVIEW</strong> · independent renderer</span><span>Week ${Math.max(1,num(state.week)||1)} · ${careerDate(state.week)}</span></div>
      </header>
      <main class="ui2-main">${content}</main>
      ${bottomNav()}
      <div id="ui2-toast" class="ui2-toast"></div>
    </div>`
  }

  function bottomNav(){
    const nav=[
      ['studio','Studio','M5 19V5h14v14H5zm3-11h8v2H8zm0 4h5v2H8z'],
      ['charts','Charts','M4 20V11h3v9zm6 0V5h3v15zm6 0V8h3v12z'],
      ['home','Home','M3 11 12 3l9 8v10h-6v-6H9v6H3z'],
      ['business','Business','M4 7h16v13H4zm4 0V4h8v3'],
      ['more','More','M4 7h16M4 12h16M4 17h16']
    ];
    return `<nav class="ui2-bottomnav" aria-label="UI2 navigation">${nav.map(([id,label,path])=>`<button type="button" class="${current===id?'is-active ':''}${id==='home'?'ui2-home-button':''}" data-route="${id}" aria-label="${label}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg><span>${label}</span></button>`).join('')}</nav>`
  }

  function homeScreen(){
    const release=latestRelease(),feed=feedItems();
    return `<section class="ui2-screen" data-screen="home">
      <div class="ui2-home-hero">
        <div class="ui2-home-visual"><div class="ui2-stage-lines"></div></div>
        <div class="ui2-home-copy">
          <span class="ui2-kicker">YOUR CAREER · ${esc(careerDate(state.week))}</span>
          <h1 class="ui2-home-name">${esc(state.name||'Artist')}</h1>
          <div class="ui2-home-sub"><span>${esc(artistTier(state.fans))}</span><span>${esc(state.genre||'Artist')}</span><span>Reputation ${Math.round(num(state.reputation))}</span></div>
          <button class="ui2-primary-link" type="button" data-route="artist">Open Artist File <span>→</span></button>
        </div>
      </div>
      <div class="ui2-ledger" aria-label="Career metrics">
        <div class="ui2-ledger-item"><small>Fans</small><strong>${compact(state.fans)}</strong><em>Audience</em></div>
        <div class="ui2-ledger-item"><small>Cash</small><strong>${money(state.cash)}</strong><em>Available</em></div>
        <div class="ui2-ledger-item"><small>Energy</small><strong>${Math.round(num(state.energy))}/200</strong><em>This week</em></div>
      </div>
      ${release?`<div class="ui2-release-strip" role="button" tabindex="0" data-toast="Release details migrate after layout approval."><div class="ui2-release-art">${esc(initials(release.title||state.name))}</div><div><small>Current release</small><strong>${esc(release.title||'Untitled')}</strong><span>${compact(release.total||release.streams||0)} lifetime streams</span></div><b>›</b></div>`:''}
      <div class="ui2-section-title"><h2>Career Feed</h2><small>${feed.length} signals</small></div>
      <div class="ui2-feed">${feed.map(item=>`<div class="ui2-feed-row" role="button" tabindex="0" data-toast="This action will reconnect to the live system after the UI2 layout is approved."><div class="ui2-feed-icon">${esc(item.icon)}</div><div class="ui2-feed-copy"><strong>${esc(item.title)}</strong><span>${esc(item.detail)}</span></div><div class="ui2-feed-meta">${esc(item.meta)}</div></div>`).join('')}</div>
      <div class="ui2-section-title"><h2>Quick Moves</h2><small>UI2 interaction migration next</small></div>
      <div class="ui2-actions-line"><button type="button" data-toast="Work action is intentionally read-only in UI2 preview.">Work a shift</button><button type="button" data-toast="Open mic is intentionally read-only in UI2 preview.">Open mic</button><button type="button" data-toast="Rest is intentionally read-only in UI2 preview.">Rest</button></div>
    </section>`
  }

  function artistScreen(){
    const stats=playerStats(),history=recentHistory();
    const careerWeeks=Math.max(0,num(state.week)-1),years=(careerWeeks/52).toFixed(1).replace('.0','');
    const totalStreams=num(state.total)||num(state.streams);
    return `<section class="ui2-screen" data-screen="artist">
      <div class="ui2-screen-head"><div><span class="ui2-kicker">ARTIST FILE</span><h1>Career dossier</h1><p>Identity, career scale, development and history on one continuous surface.</p></div><button class="ui2-inline-action" type="button" data-route="home">Home</button></div>
      <div class="ui2-artist-hero">
        <div class="ui2-portrait-zone"><div class="ui2-avatar">${portraitSvg(state.name||'Artist')}</div><div class="ui2-artist-identity"><span class="ui2-kicker">${esc(artistTier(state.fans))} · ${esc(state.genre||'Artist')}</span><h1>${esc(state.name||'Artist')}</h1><p>${compact(state.fans)} fans · ${compact(totalStreams)} career streams</p></div></div>
        <aside class="ui2-artist-sidebar">
          <div class="ui2-artist-fact"><span>Career week</span><strong>${Math.max(1,num(state.week)||1)}</strong></div>
          <div class="ui2-artist-fact"><span>Career length</span><strong>${years} ${years==='1'?'year':'years'}</strong></div>
          <div class="ui2-artist-fact"><span>Reputation</span><strong>${Math.round(num(state.reputation))}/100</strong></div>
          <div class="ui2-artist-fact"><span>Released songs</span><strong>${(state.songs||[]).filter(x=>x?.released).length}</strong></div>
          <div class="ui2-artist-fact"><span>Albums</span><strong>${(state.albums||[]).length}</strong></div>
          <div class="ui2-artist-quote">“The career should feel like a life being lived — not a dashboard being filled.”</div>
        </aside>
      </div>
      <div class="ui2-section-title"><h2>Development</h2><small>Core skills</small></div>
      <div class="ui2-stat-list">${stats.map(([name,value])=>`<div class="ui2-stat-line"><label>${esc(name)}</label><div class="ui2-stat-track"><i style="width:${value}%"></i></div><strong>${value}</strong></div>`).join('')}</div>
      <div class="ui2-section-title"><h2>Career History</h2><small>Latest entries</small></div>
      <div class="ui2-history">${history.map(row=>`<div class="ui2-history-row"><time>Week ${Math.max(1,num(row.week)||1)}</time><p>${esc(row.text||row.title||'Career event')}</p></div>`).join('')}</div>
    </section>`
  }

  function businessData(){
    const company=state.labelBusiness?.company||null,last=company?.last||null;
    const revenue=num(last?.income),payroll=num(last?.payroll),profit=revenue-payroll;
    const tracked=!!last?.v106Financials;
    return {
      company,
      name:company?.name||'Your Business Office',
      active:(company?.contracts||[]).filter(x=>!x?.expired&&num(x?.ends)>=num(state.week)).length,
      totalRevenue:num(company?.receipts),revenue,payroll,profit,tracked,
      gross:num(last?.grossRoster),artistShare:num(last?.artistShare),master:num(last?.recordingRevenue??last?.recording),distribution:num(last?.distributionRevenue),other:num(last?.touringMerchRevenue??last?.other)
    }
  }
  function businessInbox(){
    const rows=[];
    for(const offer of (state.labelBusiness?.offers||[]).filter(x=>!x?.accepted&&!x?.declined).slice(0,3))rows.push({code:'OF',title:offer.label||'Label offer',detail:'Contract terms are waiting for review.'});
    const unread=(state.achievements?.briefings||[]).filter(x=>!x?.read).slice(-2).reverse();
    for(const note of unread)rows.push({code:'IN',title:note.title||'Career notice',detail:note.detail||note.text||'A business decision needs attention.'});
    if(!rows.length)rows.push({code:'✓',title:'Desk clear',detail:'No creative or commercial request needs a decision right now.'});
    return rows.slice(0,4)
  }
  function businessScreen(){
    const b=businessData(),inbox=businessInbox();
    const statement=b.tracked?[
      ['Roster gross generated',money(b.gross)],['Artist royalty / participation share',money(b.artistShare)],['Master recording revenue',money(b.master)],['Distribution revenue',money(b.distribution)],['360 touring & merchandise revenue',money(b.other)],['Staff & payroll',money(b.payroll)],['Operating profit',money(b.profit)]
    ]:[
      ['Last week label revenue',money(b.revenue)],['Staff & payroll',money(b.payroll)],['Operating profit',money(b.profit)],['Historical gross / artist-share split','Tracks from the next settlement']
    ];
    const departments=[
      ['OF','Offers center','Label, media, endorsement and partnership offers'],
      ['CT','Contracts & rights','Contracts, ownership, buyouts and catalog rights'],
      ['RS','Roster','Signed artists, scouting and development'],
      ['FN','Finance','Revenue, costs, taxes and business performance'],
      ['MK','Marketing','Campaigns, rollout strategy and audience growth'],
      ['ST','Staff','Management, A&R and recurring operating costs']
    ];
    return `<section class="ui2-screen" data-screen="business">
      <div class="ui2-business-hero"><span class="ui2-kicker">BUSINESS HQ</span><h1>${esc(b.name)}</h1><p>${b.company?'Operate the company through decisions, statements and departments — without turning the whole office into a grid of tiles.':'Form a record company in the current game and UI2 will read it here automatically.'}</p></div>
      <div class="ui2-business-ledger">
        <div class="ui2-business-number"><small>Active artists</small><strong>${b.active}</strong></div>
        <div class="ui2-business-number"><small>Total label revenue</small><strong>${money(b.totalRevenue)}</strong></div>
        <div class="ui2-business-number"><small>Last week revenue</small><strong>${money(b.revenue)}</strong></div>
        <div class="ui2-business-number profit"><small>Operating profit</small><strong>${money(b.profit)}</strong></div>
      </div>
      <div class="ui2-section-title"><h2>Operating Statement</h2><small>${b.company&&b.company.last?`Week ${b.company.last.week}`:'No settlement yet'}</small></div>
      <div class="ui2-statement">${statement.map(([label,value])=>`<div class="ui2-statement-row"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join('')}</div>
      <div class="ui2-section-title"><h2>Priority Inbox</h2><small>${inbox.length} ${inbox.length===1?'item':'items'}</small></div>
      <div class="ui2-inbox">${inbox.map(item=>`<div class="ui2-inbox-row" role="button" tabindex="0" data-toast="Business actions reconnect after UI2 layout approval."><div class="ui2-inbox-badge">${esc(item.code)}</div><div><strong>${esc(item.title)}</strong><span>${esc(item.detail)}</span></div><b>›</b></div>`).join('')}</div>
      <div class="ui2-section-title"><h2>Company</h2><small>Departments</small></div>
      <div class="ui2-departments">${departments.map(([code,title,detail])=>`<div class="ui2-department" role="button" tabindex="0" data-toast="${esc(title)} becomes a native UI2 screen in the next migration phase."><div class="ui2-dept-code">${esc(code)}</div><div><strong>${esc(title)}</strong><span>${esc(detail)}</span></div><b>›</b></div>`).join('')}</div>
    </section>`
  }

  function placeholderScreen(name,description){
    return `<section class="ui2-placeholder" data-screen="${esc(current)}"><div class="ui2-placeholder-inner"><span class="ui2-kicker">UI2 MIGRATION</span><h1>${esc(name)}</h1><p>${esc(description)}</p><button type="button" data-route="home">Return to rebuilt Home</button></div></section>`
  }
  function moreScreen(){
    return `<section class="ui2-placeholder" data-screen="more"><div class="ui2-placeholder-inner"><span class="ui2-kicker">UI2 PREVIEW</span><h1>New shell, old engine.</h1><p>This preview reads your existing ENCORE save but does not import the legacy screen renderer. Home, Artist File and Business HQ are rebuilt. Studio and Charts are the next two migrations.</p><button type="button" data-open-legacy="1">Open current ENCORE</button></div></section>`
  }

  function screen(){
    if(current==='home')return homeScreen();
    if(current==='artist')return artistScreen();
    if(current==='business')return businessScreen();
    if(current==='studio')return placeholderScreen('Studio','The Studio will be rebuilt as a session workspace instead of a form wrapped in boxes. Song title, creative direction, collaborators and recording decisions will occupy one continuous production surface.');
    if(current==='charts')return placeholderScreen('Charts','Charts will become a dense editorial ranking screen with movement, weeks, peaks, certifications and artist identity — not a stack of repeated containers.');
    return moreScreen()
  }
  function render(){
    root.innerHTML=shell(screen());
    bind();
    window.scrollTo({top:0,behavior:'instant'});
  }
  function navigate(route){
    const allowed=new Set(['home','artist','business','studio','charts','more']);
    current=allowed.has(route)?route:'home';
    history.replaceState(null,'',`#${current}`);
    render()
  }
  function routeFromHash(){navigate((location.hash||'#home').slice(1))}
  function showToast(message){
    const node=document.getElementById('ui2-toast');if(!node)return;
    node.textContent=message;node.classList.add('is-visible');
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('is-visible'),2300)
  }
  function bind(){
    document.querySelectorAll('[data-route]').forEach(node=>node.addEventListener('click',()=>navigate(node.dataset.route)));
    document.querySelectorAll('[data-toast]').forEach(node=>{
      const fire=()=>showToast(node.dataset.toast||'UI2 preview is read-only.');
      node.addEventListener('click',fire);node.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();fire()}})
    });
    document.querySelectorAll('[data-open-legacy]').forEach(node=>node.addEventListener('click',()=>location.assign('/')))
  }
  window.addEventListener('hashchange',routeFromHash);
  loadCareer();
})();
