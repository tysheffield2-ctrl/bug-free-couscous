/* ENCORE 0.9.26 — Editorial Artist File.
   Recasts the player dossier into the approved profile-page hierarchy while keeping
   every displayed value grounded in ENCORE's live career state. */
function V138_num(v){const n=Number(v);return Number.isFinite(n)?n:0}
function V138_fmt(v){return Math.round(Math.max(0,V138_num(v))).toLocaleString()}
function V138_profileWealth(){
 if(typeof V137_estimatedWealth==='function')return V137_estimatedWealth();
 if(typeof migrateEmpire==='function')migrateEmpire();
 const assets=(s.empire?.assets||[]).reduce((n,a)=>n+V138_num(a.value),0),catalog=typeof catalogValue==='function'?V138_num(catalogValue()):0,owned=typeof catalogOwnedValue==='function'?V138_num(catalogOwnedValue()):0;
 return {assets,catalog,owned,total:V138_num(s.cash)+assets+catalog+owned}
}
function V138_chartProfile(){
 let records=[];try{const b=typeof ENCORE_CHARTS!=='undefined'?ENCORE_CHARTS.ensure(s):s.chartBook;records=Object.values(b?.songs?.records||{}).filter(r=>r?.you)}catch{}
 const released=(s.songs||[]).filter(x=>x.released),fallback=released.filter(x=>V138_num(x.peak)>0),base=records.length?records:fallback;
 return {hits:base.length,ones:base.filter(x=>V138_num(x.peak)===1).length,longest:Math.max(0,...base.map(x=>V138_num(x.longest??x.longestNumberOne))),weeks:Math.max(0,...base.map(x=>V138_num(x.weeks??x.chartWeeks)))}
}
function V138_tourProfile(){
 const tours=[...(s.careerRecords?.tours||[])],highest=[...tours].sort((a,b)=>V138_num(b.gross)-V138_num(a.gross))[0]||null,mostSeats=[...tours].sort((a,b)=>V138_num(b.tickets)-V138_num(a.tickets))[0]||null;
 return {count:tours.length,highest,mostSeats,liveGross:V138_num(s.careerRecords?.liveGross)}
}
function V138_merchProfile(){const merch=s.empire?.merch||[];return {releases:merch.length,sold:merch.reduce((n,x)=>n+V138_num(x.sold),0)}}
function V138_profileSources(w){
 const sources=['Music'],assets=s.empire?.assets||[],company=s.labelBusiness?.company?.name;
 if(company)sources.push(company);if(w.catalog>0||w.owned>0)sources.push('Catalog');if(assets.some(a=>a.kind==='Property'))sources.push('Real Estate');if(assets.some(a=>['Stocks','Bonds','Crypto'].includes(a.kind)))sources.push('Investments');
 return [...new Set(sources)].join(', ')
}
function V138_profileSubtitle(){const company=s.labelBusiness?.company?.name;return company?`Musician and Founder, ${company}`:`${s.genre||'Independent'} musician`}
function V138_profileRow(label,value){return `<div class="v138-profile-row"><dt>${esc(String(label))}</dt><dd>${esc(String(value??'—'))}</dd></div>`}
function V138_artistFile(){
 if(typeof migrateV131==='function')migrateV131();if(typeof V131_captureSnapshot==='function')V131_captureSnapshot(false);if(typeof migrateEmpire==='function')migrateEmpire();
 const legacy=typeof V131_legacy==='function'?V131_legacy():{score:0,tier:'EMERGING',certs:0,ones:0,awards:0,total:V138_num(s.total)},cw=typeof migrateCareerWorld==='function'?migrateCareerWorld():{state:'Building'},wealth=V138_profileWealth(),charts=V138_chartProfile(),tour=V138_tourProfile(),merch=V138_merchProfile(),topSong=typeof V137_topSongs==='function'?V137_topSongs()[0]:null,topAlbum=typeof V137_topAlbums==='function'?V137_topAlbums()[0]:null,albums=s.albums||[],songs=(s.songs||[]).filter(x=>x.released),company=s.labelBusiness?.company?.name||'Independent',careerYear=typeof V131_weekYear==='function'?V131_weekYear(s.week):Math.max(1,Math.floor((V138_num(s.week)-1)/52)+1),age=V138_num(s.age),finance=typeof ENCORE_FINANCE!=='undefined'?ENCORE_FINANCE.ensureFinance(s):(s.finance||{}),lastNet=V138_num(finance.last?.revenue)-V138_num(finance.last?.expenses),deltaClass=lastNet>0?'up':lastNet<0?'down':'flat',deltaMark=lastNet>0?'↑':lastNet<0?'↓':'•';
 const rows=[];
 if(age>0)rows.push(['Age',age]);else rows.push(['Career Year',careerYear]);
 rows.push(['Genre',s.genre||'—'],['Career Tier',tierNames?.[tier(s.fans)]||'Unknown'],['Career State',cw.state||'Building'],['Source of Wealth',V138_profileSources(wealth)],['Legacy Score',`${legacy.score}/100 · ${legacy.tier}`],['True Fans',V138_fmt(s.fans)],['Lifetime Streams',V138_fmt(legacy.total)],['Songs Released',songs.length],['Albums',albums.length],['Song (Most Popular)',topSong?`${topSong.title} (${V138_fmt(topSong.total)})`:'—'],['Album (Most Popular)',topAlbum?`${topAlbum.a.title} (${V138_fmt(topAlbum.value)})`:'—'],['Chart Hits',charts.hits],['Chart Hits (#1s)',charts.ones],['Chart Hits (Longest #1)',charts.longest],['Chart Hits (Most Weeks On)',charts.weeks],['Certified Releases',legacy.certs],['Awards Won',V138_num(s.expansion?.awardWins)],['Feature Appearances',V138_num(s.expansion?.featureAppearances)],['Tour (Highest Grossing)',tour.highest?.title||'—'],['Tour (Highest Grossing Revenue)',tour.highest?money(V138_num(tour.highest.gross)):'—'],['Tour (Most Seats Sold)',tour.mostSeats?V138_fmt(tour.mostSeats.tickets):'—'],['Career Live Gross',money(tour.liveGross)],['# Merch Released',merch.releases],['Merch Units Sold',V138_fmt(merch.sold)],['Music Catalog Value',money(wealth.catalog)],['Owned Catalog Interests',money(wealth.owned)],['Company / Label',company],['Cash',money(V138_num(s.cash))],['Estimated Net Worth',money(wealth.total)]);
 return `<article class="v138-artist-file" aria-label="ENCORE Artist File"><div class="v138-masthead">ENCORE</div><section class="v138-profile-sheet"><div class="v138-profile-kicker"><div><span class="v138-e-box">E</span><span>PROFILE</span></div><button aria-label="Close Artist File" title="Close Artist File" onclick="go('Home')">×</button></div><div class="v138-identity"><h1>${esc(s.name||'Artist')}</h1><p>${esc(V138_profileSubtitle())}</p></div><section class="v138-worth"><div><strong>${money(wealth.total)}</strong><span class="v138-worth-delta ${deltaClass}">${deltaMark} ${money(Math.abs(lastNet))} last week net</span></div><aside><b>Real Time Net Worth</b><span>as of ${esc(careerDate())}</span><span>Legacy ${esc(legacy.tier)} · ${legacy.score}/100</span></aside></section><div class="v138-rule"></div><section class="v138-stats"><h2>Personal Stats</h2><dl>${rows.map(([k,v])=>V138_profileRow(k,v)).join('')}</dl></section><footer class="v138-profile-links"><button onclick="go('Stats')">Open Stats 2.0</button><button onclick="V129_open()">Edit appearance</button><button onclick="careerTab='Activity';go('Career')">Career history</button><button onclick="V137_openAchievements()">Awards & plaques</button><button onclick="V137_openContracts('Overview')">Contracts & rights</button></footer></section></article>`
}
artistFilePage=V138_artistFile;
