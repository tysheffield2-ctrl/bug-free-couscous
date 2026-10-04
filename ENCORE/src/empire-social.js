/* ENCORE Empire · procedural artist universe + social influence */
const EMPIRE_VERSION=1;
const empirePlatforms={
 pulse:{name:'Pulse',tag:'Conversation',detail:'Fast posts, fan conversation and headlines.',weight:1},
 loop:{name:'Loop',tag:'Short video',detail:'Clips, snippets, challenges and viral discovery.',weight:1.25},
 lens:{name:'Lens',tag:'Lifestyle',detail:'Photos, fashion, luxury and brand identity.',weight:.9},
 livewire:{name:'LiveWire',tag:'Live',detail:'Streams, Q&As and direct fan connection.',weight:1.1}
};
function empireHash(text){let h=2166136261>>>0;for(const ch of String(text)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function empireRandom(seed){let x=seed>>>0;return ()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}}
function pickDet(a,r){return a[Math.floor(r()*a.length)]}
function migrateEmpire(){
 if(!s.empire)s.empire={version:EMPIRE_VERSION,createdWeek:s.week,social:{},posts:[],socialHistory:[],contacts:{},holdings:[],staff:{},staffHistory:[],deals:[],dealHistory:[],catalogHistory:[],artistViews:{},lastSocialWeek:0,lastMarketWeek:0,lastStaffWeek:0,lastRiskWeek:0,ancillary:{week:0,merch:0,brand:0,media:0},realizedGains:0,taxSavings:0};
 const e=s.empire;e.version=EMPIRE_VERSION;e.social??={};e.posts??=[];e.socialHistory??=[];e.contacts??={};e.holdings??=[];e.staff??={};e.staffHistory??=[];e.deals??=[];e.dealHistory??=[];e.catalogHistory??=[];e.artistViews??={};e.ancillary??={week:0,merch:0,brand:0,media:0};
 for(const id of Object.keys(empirePlatforms))if(!e.social[id]){const factor={pulse:.8,loop:.55,lens:.4,livewire:.22}[id];e.social[id]={followers:Math.max(20,Math.round(s.fans*factor)),engagement:.04,weeklyViews:0,momentum:0,lastPostWeek:0}}
 for(const x of s.songs){if(!x.features)x.features=x.feature?[{...x.feature}]:[];empireEnsureRights?.(x)}
 if(s.draft&&!s.draft.features)s.draft.features=s.draft.feature?[{...s.draft.feature}]:[];
 return e
}
function empireUniverseArtist(index){
 index=Math.max(0,Math.min(4999,Number(index)||0));
 if(index<s.world.length)return {...s.world[index],universeId:String(index),core:true};
 const r=empireRandom(empireHash('ENCORE-ARTIST-'+index)),name=pickDet(nameWords.first,r)+' '+pickDet(nameWords.last,r),genre=genres[Math.floor(r()*genres.length)],fame=Math.pow(r(),2.25),fans=Math.max(40,Math.round(40+fame*220000000)),rep=clamp(Math.round(8+Math.log10(fans+1)*9+r()*20)),skill=clamp(Math.round(25+Math.log10(fans+1)*7+r()*25));
 return {id:'u'+index,universeId:'u'+index,name,genre,fans,reputation:rep,skill,relation:0,lastTalk:0,lastNegotiate:0,discount:0,weekly:Math.round(fans*(.18+r()*.55)),core:false,personality:['Private','Ambitious','Warm','Competitive','Chaotic','Strategic','Art-first','Commercial'][Math.floor(r()*8)],marketability:Math.round(20+r()*80)}
}
function empireArtist(id){
 if(typeof id==='number'||(/^\d+$/.test(String(id))&&Number(id)<s.world.length))return s.world[Number(id)];
 migrateEmpire();const key=String(id);if(s.empire.contacts[key])return s.empire.contacts[key];const base=empireUniverseArtist(Number(key.replace(/^u/,'')));return s.empire.contacts[key]={...base,relation:0,lastTalk:0,lastNegotiate:0,discount:0,catalog:[],nextRelease:s.week+Math.round(2+Math.random()*7)}
}
function empireArtistSnapshot(a){return {fans:a.fans||0,weekly:a.weekly||a.catalog?.reduce((n,x)=>n+(x.streams||0),0)||0,relation:a.relation||0,reputation:a.reputation||0,at:Date.now(),week:s.week}}
function empireFeatureList(track){if(track?.features?.length)return track.features;if(track?.feature)return [track.feature];return []}
function empireFeatureReach(track){return empireFeatureList(track).reduce((sum,f)=>{const a=empireArtist(f.id),rel=a?.relation??f.relation??0,genre=a?.genre||f.genre;return sum+(f.fans||a?.fans||0)*(rel<=-40?.004:.018)*(genre===s.genre?1:.8)},0)}
function empireSocialTotals(){migrateEmpire();let followers=0,views=0,weighted=0;for(const [id,p] of Object.entries(s.empire.social)){followers+=p.followers;views+=p.weeklyViews||0;weighted+=p.followers*p.engagement*(empirePlatforms[id]?.weight||1)}return {followers,views,influence:Math.round(weighted*(1+level('marketability')/100)),engagement:followers?weighted/followers:0}}
function empirePost(platform,kind,cost=0){
 migrateEmpire();const p=s.empire.social[platform];if(!p||s.energy<5||s.cash<cost)return false;const qualities={update:1,teaser:2,behind:2,viral:3,luxury:2,controversy:3,live:2};if(!spend(5,cost))return false;const q=qualities[kind]||1;
 if(kind==='controversy'&&Math.random()<.35){s.reputation=clamp(s.reputation-3);s.loyalty=clamp(s.loyalty+(Math.random()<.5?2:-2));log('A controversial post split your audience. Reputation −3.')}
 s.empire.posts.unshift({id:Date.now(),platform,kind,quality:q,week:s.week});s.empire.posts=s.empire.posts.slice(0,80);p.lastPostWeek=s.week;render();return true
}
function empirePushDeal(deal){migrateEmpire();if(s.empire.deals.some(x=>x.id===deal.id))return;s.empire.deals.unshift({status:'open',createdWeek:s.week,...deal});s.empire.deals=s.empire.deals.slice(0,60);addBriefing('empire-deal:'+deal.id,'Opportunity',deal.title,deal.detail||'A new offer is waiting.','Open Career → Offers to review it.')}
function empireSocialWeek(){
 migrateEmpire();const e=s.empire;if(e.lastSocialWeek===s.week)return;e.lastSocialWeek=s.week;const socialSkill=empireStaffEffect?.('social')/100||0,publicist=empireStaffEffect?.('publicist')/100||0,recent=e.posts.filter(p=>s.week-p.week<=2),releaseHeat=Math.min(2,(s.streams||0)/Math.max(1000,s.fans*2)),history={week:s.week};
 for(const [id,p] of Object.entries(e.social)){const posts=recent.filter(x=>x.platform===id),quality=posts.reduce((n,x)=>n+x.quality,0),r=empireRandom(empireHash('SOCIAL-'+id+'-'+s.week+'-'+p.followers)),viral=posts.some(x=>x.kind==='viral')&&r()<.08+level('viralAbility')*.0015,base=(18+Math.sqrt(Math.max(1,s.fans))*2.2)*(1+level('marketability')*.012+socialSkill*.5),gain=Math.round(base*(1+quality*.14+releaseHeat*.18)*(viral?(4+r()*9):(.7+r()*.7))),loss=Math.round(p.followers*Math.max(0,.0008-p.engagement*.005));p.followers=Math.max(0,p.followers+gain-loss);p.weeklyViews=Math.round((p.followers*.4+s.streams*.08)*(1+quality*.18)*(viral?(3+r()*5):1));p.engagement=clamp(p.engagement*.82+(.025+level('charisma')*.00045+socialSkill*.03+quality*.004)*.18,.01,.35);p.momentum=gain-loss;history[id]={followers:p.followers,gain:gain-loss,views:p.weeklyViews,engagement:p.engagement}}
 e.socialHistory.push(history);e.socialHistory=e.socialHistory.slice(-52);
 const t=empireSocialTotals(),eligible=labelDeals.map((d,i)=>({d,i})).filter(x=>!s.expansion.contract&&!s.labelBusiness?.company&&s.fans>=x.d.fans*.45&&s.reputation>=Math.max(0,x.d.rep-12)&&!s.labelBusiness?.offers?.some(o=>o.label===x.i&&!o.used&&o.expires>=s.week));
 if(eligible.length&&t.influence>5000&&Math.random()<Math.min(.42,.05+Math.log10(t.influence+1)*.035+publicist*.08)){const hit=pick(eligible);createLabelOffer(hit.i,'A&R discovered you through social momentum');empirePushDeal({id:'social-label-'+hit.i+'-'+s.week,type:'label',title:hit.d.name+' wants a meeting',detail:'A&R found your growth through social media and sent a contract offer.',labelOfferId:'label-'+hit.i+'-'+s.week,expires:s.week+4})}
 if(t.influence>30000&&Math.random()<Math.min(.28,.04+Math.log10(t.influence)*.018)){const brand=pick(['Vanta Motors','Maison Aurelia','Nova Mobile','Crown Athletics','Obsidian Audio']),fee=Math.round((1500+Math.sqrt(t.influence)*70)*(1+level('marketability')/100));empirePushDeal({id:'brand-'+s.week+'-'+brand,type:'brand',title:brand+' campaign',detail:'Sponsored campaign tied to your audience and brand value.',gross:fee,expires:s.week+3,status:'open'})}
 if(t.influence>150000&&Math.random()<.16+publicist*.08){const outlet=pick(['Northstar Studios','Scene+','Prime Stage','Halo Pictures']),fee=Math.round(5000+Math.sqrt(t.influence)*120);empirePushDeal({id:'media-'+s.week+'-'+outlet,type:'media',title:outlet+' media offer',detail:'Paid appearance, documentary, soundtrack or screen-media opportunity.',gross:fee,expires:s.week+4,status:'open'})}
}
