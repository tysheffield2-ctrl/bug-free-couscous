/* ENCORE Empire · integration hooks. Loaded last so existing beta remains backward-compatible. */
const empireTabs=['Social','Wealth','Team','Catalog rights','Offers'];
const _empireRender=render;
render=function(){migrateEmpire();empireEnsureStyles();return _empireRender()}
const _empireCareerMenu=careerMenu;
careerMenu=function(){if(empireTabs.includes(careerTab)){return '<div class="career-navigation"><div class="career-groups">'+careerGroups.map(g=>'<button onclick="careerTab=\''+g.tabs[0]+'\';render()">'+g.name+'</button>').join('')+'<button class="selected" onclick="careerTab=\'Social\';render()">Empire</button><button onclick="openSettings()" aria-label="Open settings">Settings</button></div><div class="career-subnav">'+empireTabs.map(t=>'<button class="'+(careerTab===t?'selected':'')+'" onclick="careerTab=\''+t+'\';render()">'+t+'</button>').join('')+'</div></div>'}const base=_empireCareerMenu();return base.replace('</div><div class="career-subnav"','<button onclick="careerTab=\'Social\';render()">Empire</button></div><div class="career-subnav"')}
const _empireCareer=career;
career=function(){migrateEmpire();if(careerTab==='Social')return careerMenu()+empireSocialPage();if(careerTab==='Wealth')return careerMenu()+empireWealthPage();if(careerTab==='Team')return careerMenu()+empireTeamPage();if(careerTab==='Catalog rights')return careerMenu()+empireCatalogRightsPage();if(careerTab==='Offers')return careerMenu()+empireOffersPage();return _empireCareer()}
const _empireIndustry=industry;
industry=function(){migrateEmpire();if(industryTab==='Universe')return empireUniversePage();if(industryTab==='Artist File')return empireArtistFilePage();const base=_empireIndustry();return base+'<section class="card"><div class="sectionhead"><div><span class="eyebrow">EXPANDED INDUSTRY</span><h2>5,000-artist universe</h2></div><button class="primary" onclick="industryTab=\'Universe\';render()">Explore artists</button></div><p>Browse a procedural industry without bloating your save. Artists become persistent once you interact with them.</p></section>'}
profile=function(id){empireOpenArtistFile(String(id))}
featurePicker=function(){empireFeatureBrowser()}
bookFeature=function(id,confirmed=false){return empireBookFeature(String(id),confirmed)}
const _empireStudio=studio;
studio=function(){const base=_empireStudio();if(!s.draft)return base;const list=empireFeatureList(s.draft),extra='<section class="card"><div class="sectionhead"><div><span class="eyebrow">FEATURE CAST</span><h2>'+list.length+' / 6 artists attached</h2></div><button class="primary" '+(list.length>=6?'disabled':'')+' onclick="empireFeatureBrowser()">'+(list.length?'Add another artist':'Choose artists')+'</button></div><div class="feature-stack">'+list.map(f=>'<span class="feature-chip">'+esc(f.name)+'<button onclick="empireRemoveFeature(\''+String(f.id)+'\')">×</button></span>').join('')+'</div><p class="fine">Each guest has an independent fee, relationship and reach contribution. Up to six can appear on one song.</p></section>';return base+extra}
reach=function(track){return Math.round(180+s.fans*.9+empireFeatureReach(track))}
const _empireBeginCareerWeek=beginCareerWeek;
beginCareerWeek=function(){_empireBeginCareerWeek();empireMarketWeek();empireStaffWeek();empireMonthlyAdvance();empireWeeklyMerch()}
function empireAfterCharts(){migrateEmpire();for(const kind of ['songs','albums'])for(const row of s.chartBook?.[kind]?.current||[]){if(!row.you)continue;if((row.movement==='NEW'||row.movement==='RE'||row.movement==='ENTRY')&&row.releaseWeek<s.week){const key='late-chart-'+kind+'-'+row.id+'-'+s.week;if(!s.achievements.briefings.some(b=>b.id===key))addBriefing(key,'Celebration',(row.movement==='RE'?'Chart re-entry':'New chart entry')+' · #'+row.rank,'“'+row.title+'” '+(row.movement==='RE'?'returned to':'entered')+' the '+(kind==='songs'?'Global Top 100':'Global Albums 50')+' after its original release.','This was not an original debut-week chart placement.')}}}
const _empireFinishCareerWeek=finishCareerWeek;
finishCareerWeek=function(){empireSocialWeek();empireRiskWeek();empireMaybeCatalogOffer();empireAfterCharts();s.empire.catalogHistory.push({week:s.week,gross:empireCatalogValue(false),owned:empireCatalogValue(true)});s.empire.catalogHistory=s.empire.catalogHistory.slice(-104);for(const d of s.empire.deals)if(d.status==='open'&&d.expires<s.week)d.status='expired';_empireFinishCareerWeek()}
artistLabelCut=function(royalties){return empireArtistLabelCut(royalties)}
const _empireTaxDue=taxDue;
taxDue=function(profit){return cents(_empireTaxDue(profit)*empireTaxMultiplier())}
reviewArtistOffer=function(id){return empireReviewArtistOffer(id)}
counterArtistOffer=function(e,id){return empireCounterArtistOffer(e,id)}
signNegotiatedOffer=function(id,confirmed=false){return empireSignArtistOffer(id,confirmed)}
const _empireLabelPage=labelPage;
labelPage=function(){const base=_empireLabelPage();return base+'<section class="card"><div class="sectionhead"><div><span class="eyebrow">DEAL DESK</span><h2>Everything negotiable, in one place.</h2></div><button class="primary" onclick="careerTab=\'Offers\';render()">Open all offers</button></div><p>Review label approaches, media deals, brand campaigns, catalog proposals and private career issues without hunting through pop-ups.</p></section>'}
