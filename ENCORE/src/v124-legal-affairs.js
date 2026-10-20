/* ENCORE 0.9.20 — Legal Affairs 2.0.
   Expands the civil docket from label-only contract disputes into a career-wide
   legal-risk simulation with cause-based filings, General Counsel integration,
   prevention, outside counsel and player-visible risk forecasting. */

const V124_LEGAL_TYPES={
 copyright:{name:'Copyright / sample dispute',category:'Music IP',issue:'Copyright, sample or composition infringement',claim:1.25,strength:58,prevent:'Clear samples, keep stronger legal review and avoid an oversized uncleared catalog.'},
 credit:{name:'Songwriting credit dispute',category:'Music IP',issue:'Songwriting credit / ownership dispute',claim:.8,strength:54,prevent:'Keep collaborator relationships healthy and document splits before release.'},
 producer:{name:'Producer royalty dispute',category:'Music IP',issue:'Producer royalty / accounting dispute',claim:.95,strength:56,prevent:'Use clear producer terms and accurate royalty accounting.'},
 venue:{name:'Tour / venue contract dispute',category:'Live',issue:'Venue, promoter or cancellation breach',claim:1.35,strength:57,prevent:'Keep routing realistic, honor booked dates and use stronger live operations.'},
 injury:{name:'Live-event injury claim',category:'Live',issue:'Negligence / live-event personal injury',claim:1.6,strength:61,prevent:'Fund security, avoid overextended routing and reduce live incidents.'},
 employment:{name:'Employment / termination claim',category:'Corporate',issue:'Employment, termination or compensation dispute',claim:.9,strength:55,prevent:'Use stable leadership, fair exits and General Counsel review around departures.'},
 merch:{name:'Merch / vendor dispute',category:'Commerce',issue:'Vendor, manufacturing or merchandise contract dispute',claim:.7,strength:52,prevent:'Keep vendor volume manageable and avoid scaling merchandise faster than operations.'},
 sponsor:{name:'Sponsorship / endorsement dispute',category:'Commercial',issue:'Sponsorship, endorsement or deliverables dispute',claim:1.1,strength:55,prevent:'Avoid overcommitting brand obligations and maintain commercial review.'},
 trademark:{name:'Trademark / name dispute',category:'IP',issue:'Trademark, likeness or brand-confusion dispute',claim:1.35,strength:59,prevent:'Protect the artist/company identity as the brand becomes more valuable.'},
 defamation:{name:'Defamation / publication claim',category:'Media',issue:'Defamation, false-light or publication dispute',claim:.9,strength:53,prevent:'Reduce reckless public conflict and use counsel on high-risk public statements.'},
 property:{name:'Property / lease dispute',category:'Assets',issue:'Property, lease, contractor or premises dispute',claim:1.15,strength:56,prevent:'Maintain owned property and keep business-use/property obligations documented.'},
 label:{name:'Label interference / poaching claim',category:'Industry',issue:'Interference, solicitation or label-to-label contract dispute',claim:1.8,strength:62,prevent:'Use clean roster negotiations and legal review around poaching or contract exits.'},
 tax:{name:'Tax / regulatory matter',category:'Regulatory',issue:'Tax assessment, records or regulatory compliance matter',claim:1.0,strength:64,prevent:'Use qualified finance/legal staff, maintain reserves and keep entity administration current.'},
 sports:{name:'Sports ownership dispute',category:'Ownership',issue:'Ownership, governance or partner dispute',claim:2.5,strength:61,prevent:'Use strong governance and legal review around high-value ownership positions.'},
 partnership:{name:'Business partnership dispute',category:'Corporate',issue:'Commercial partnership, ownership or performance dispute',claim:1.3,strength:57,prevent:'Document ownership, obligations and exit terms before scaling partnerships.'}
};

function V124_legalState(){
 const root=V118_state();
 if(!root.legalRisk||typeof root.legalRisk!=='object')root.legalRisk={version:1,startedWeek:s.week,lastGeneratedWeek:0,lastByType:{},generated:0,lastChance:0,lastScore:0};
 const x=root.legalRisk;x.version=1;x.startedWeek??=s.week;x.lastGeneratedWeek??=0;x.lastByType??={};x.generated??=0;x.lastChance??=0;x.lastScore??=0;return x
}
function V124_hash(value){let h=2166136261;for(const ch of String(value)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function V124_roll(key){return V124_hash(`${key}|${s.week}|${s.name||''}`)/4294967296}
function V124_log10(n){return Math.log10(Math.max(1,Number(n)||0))}
function V124_ctx(){
 const songs=Array.isArray(s.songs)?s.songs:[],world=Array.isArray(s.world)?s.world:[],emp=s.empire||{},assets=Array.isArray(emp.assets)?emp.assets:[],merch=Array.isArray(emp.merch)?emp.merch:[],media=Array.isArray(emp.media)?emp.media:[],contracts=Array.isArray(s.labelBusiness?.company?.contracts)?s.labelBusiness.company.contracts:[],exec=typeof V123_execState==='function'?V123_execState():{team:{},history:[]};
 const routes=[...(Array.isArray(s.touring?.archive)?s.touring.archive.flatMap(t=>Array.isArray(t.route)?t.route:[]):[]),...(Array.isArray(s.liveTour?.route)?s.liveTour.route:[])];
 const played=routes.filter(r=>['played','completed'].includes(r.status)),cancelled=routes.filter(r=>r.status==='cancelled'),incidents=played.filter(r=>r.report?.incident).length;
 const collaborators=songs.reduce((n,x)=>n+(Array.isArray(x.guests)?x.guests.length:Array.isArray(x.features)?x.features.length:0),0);
 const properties=assets.filter(a=>String(a.kind||'').toLowerCase().includes('property')).length;
 const sports=assets.filter(a=>/sport|team|franchise/i.test(`${a.kind||''} ${a.name||''} ${a.item||''}`)).length;
 const businesses=Array.isArray(emp.businesses)?emp.businesses.length:assets.filter(a=>/business|company|store|laund|rental/i.test(`${a.kind||''} ${a.name||''}`)).length;
 const recentExecDepartures=(exec.history||[]).filter(x=>['departure','resignation'].includes(x.type)&&s.week-(x.week||0)<=26).length;
 const negativeIndustry=world.filter(a=>Number(a.relation||0)<=-25).length;
 const feed=Array.isArray(s.social?.feed)?s.social.feed:[];
 const merchSold=merch.reduce((n,x)=>n+Math.max(0,Number(x.sold)||0),0),mediaUsed=media.filter(x=>x.used).length;
 let entity='individual';if(typeof V113_entity==='function')entity=V113_entity().id||'individual';
 return {songs:songs.length,collaborators,played:played.length,cancelled:cancelled.length,incidents,merch:merch.length,merchSold,mediaUsed,properties,sports,businesses,contracts:contracts.length,execCount:Object.keys(exec.team||{}).length,recentExecDepartures,negativeIndustry,feed:feed.length,entity,fans:Math.max(0,Number(s.fans)||0),cash:Math.max(0,Number(s.cash)||0),reputation:Math.max(0,Number(s.reputation)||0),assets:assets.length,label:Boolean(s.labelBusiness?.company)}
}
function V124_scores(ctx=V124_ctx()){
 const entityWeight={individual:0,llc:1,entertainment:2,corporation:3,holding:4}[ctx.entity]||0;
 const score={
  copyright:ctx.songs>=2?8+ctx.songs*1.2+ctx.collaborators*2+ctx.reputation*.06:0,
  credit:ctx.songs>=4||ctx.collaborators?5+ctx.songs*.75+ctx.collaborators*3:0,
  producer:ctx.songs>=3?5+ctx.songs+ctx.collaborators:0,
  venue:ctx.played+ctx.cancelled>=2?5+ctx.played*.7+ctx.cancelled*7:0,
  injury:ctx.played?3+ctx.played*.55+ctx.incidents*15:0,
  employment:ctx.execCount||ctx.recentExecDepartures?3+ctx.execCount*1.5+ctx.recentExecDepartures*16:0,
  merch:ctx.merchSold>=100?4+V124_log10(ctx.merchSold)*8+ctx.merch*2:0,
  sponsor:ctx.mediaUsed?4+ctx.mediaUsed*4+V124_log10(ctx.fans)*2:0,
  trademark:ctx.fans>=250000||ctx.label?5+V124_log10(ctx.fans)*5+(ctx.label?8:0):0,
  defamation:ctx.feed>=5?3+ctx.feed*.45+ctx.negativeIndustry*2+ctx.reputation*.05:0,
  property:ctx.properties?4+ctx.properties*7+ctx.assets:0,
  label:ctx.contracts>=2?4+ctx.contracts*7+ctx.negativeIndustry*2:0,
  tax:entityWeight?5+entityWeight*9+V124_log10(ctx.cash)*2.5:0,
  sports:ctx.sports?10+ctx.sports*12+V124_log10(ctx.cash)*3:0,
  partnership:ctx.businesses?5+ctx.businesses*8+ctx.assets*.8:0
 };
 for(const k of Object.keys(score))score[k]=clamp(Math.round(score[k]),0,100);return score
}
function V124_counsel(){
 const gc=typeof V123_execState==='function'?V123_execState().team?.legal:null;
 if(gc)return {name:gc.name,skill:typeof V123_effectiveSkill==='function'?V123_effectiveSkill(gc):gc.skill||70,type:'General Counsel',authority:gc.authority||'hands'};
 const attorney=typeof V100_repTeam==='function'?V100_repTeam()?.team?.attorney:null;
 if(attorney)return {name:attorney.name,skill:typeof V117_effectiveSkill==='function'?V117_effectiveSkill(attorney):attorney.skill||70,type:'Personal attorney',authority:'hands'};
 return null
}
function V124_prevention(){const c=V124_counsel();if(!c)return 0;let reduction=Math.min(.24,(c.skill||0)*.0024);if(c.type==='General Counsel'){if(c.authority==='guardrails')reduction+=.07;if(c.authority==='full')reduction+=.11;if(c.authority==='recommend')reduction+=.03}return clamp(reduction,0,.42)}
function V124_snapshot(){
 const st=V124_legalState(),scores=V124_scores(),entries=Object.entries(scores).filter(([,v])=>v>0).map(([id,score])=>({id,score,...V124_LEGAL_TYPES[id]})).sort((a,b)=>b.score-a.score),total=entries.reduce((n,x)=>n+x.score,0),open=V118_openCases().length,prevention=V124_prevention(),cooldown=s.sandbox?3:6,recent=s.week-st.lastGeneratedWeek<cooldown;
 let raw=total?Math.min(.055,.0015+total*.000035):0;if(s.sandbox)raw=Math.min(.09,raw*1.8);if(open===1)raw*=.75;if(open===2)raw*=.5;if(open>=3||recent)raw=0;const chance=clamp(raw*(1-prevention),0,.09);st.lastChance=chance;st.lastScore=total;return {scores,entries,total,open,prevention,chance,recent,counsel:V124_counsel()}
}
function V124_companyValue(){return typeof V092_businessValue==='function'?Math.max(0,Number(V092_businessValue())||0):0}
function V124_claim(type,score){const spec=V124_LEGAL_TYPES[type],base=clamp(Math.max(50000,s.cash*.012+s.fans*.06+V124_companyValue()*.0015),50000,25000000),swing=.72+V124_roll('claim:'+type)*.62;return cents(clamp(base*spec.claim*swing*(.72+score/180),25000,100000000))}
function V124_strength(type,score){const spec=V124_LEGAL_TYPES[type];return clamp(Math.round(spec.strength+(score-40)*.18+(V124_roll('strength:'+type)-.5)*12),30,94)}
function V124_claimant(type){
 const names={copyright:'Northline Publishing',credit:'A former co-writer',producer:'A former producer',venue:'Regional Venue Partners',injury:'A concert attendee',employment:'A former company employee',merch:'Meridian Manufacturing',sponsor:'Atlas Brand Group',trademark:'A competing entertainment brand',defamation:'An industry figure',property:'A property counterparty',label:'A competing label',tax:'Revenue Compliance Bureau',sports:'A minority ownership partner',partnership:'A commercial partner'};
 if(['defamation','label','credit'].includes(type)&&Array.isArray(s.world)&&s.world.length){const a=s.world[V124_hash(type+s.week)%s.world.length];if(a?.name)return type==='label'?a.name+' / affiliated label':a.name}
 return names[type]||'Counterparty'
}
function V124_triggerDetail(type,ctx){const map={copyright:`${ctx.songs} songs and ${ctx.collaborators} credited collaborators have expanded music-rights exposure.`,credit:`A growing catalog and ${ctx.collaborators} collaborator credits create split/credit pressure.`,producer:`${ctx.songs} recorded works create more producer-accounting touchpoints.`,venue:`${ctx.played} played shows and ${ctx.cancelled} cancellations create promoter/venue exposure.`,injury:`${ctx.played} completed shows with ${ctx.incidents} recorded live incidents create premises/injury risk.`,employment:`${ctx.execCount} executives and ${ctx.recentExecDepartures} recent leadership departures create employment exposure.`,merch:`${ctx.merchSold} lifetime merch units sold across ${ctx.merch} products create vendor exposure.`,sponsor:`${ctx.mediaUsed} completed media/brand opportunities create deliverables risk.`,trademark:`A ${compact(ctx.fans)}-fan brand and growing company identity create name/likeness exposure.`,defamation:`${ctx.feed} PULSE posts and ${ctx.negativeIndustry} strained industry relationships create publication risk.`,property:`${ctx.properties} owned property assets create lease, contractor and premises exposure.`,label:`${ctx.contracts} roster contracts and ${ctx.negativeIndustry} strained industry relationships create interference risk.`,tax:`Your ${ctx.entity} structure and current company scale create more records/compliance exposure.`,sports:`${ctx.sports} sports ownership positions create governance and partner exposure.`,partnership:`${ctx.businesses} business interests and ${ctx.assets} owned assets create commercial-counterparty exposure.`};return map[type]||'Career activity created a legal exposure.'}
function V124_pickType(snapshot){let pool=snapshot.entries.map(x=>({...x,weight:x.score})).filter(x=>{const last=V124_legalState().lastByType[x.id]||0;return s.week-last>=16});if(!pool.length)pool=snapshot.entries.map(x=>({...x,weight:x.score*.25}));const sum=pool.reduce((n,x)=>n+x.weight,0);if(!sum)return null;let needle=V124_roll('legal-type')*sum;for(const x of pool){needle-=x.weight;if(needle<=0)return x}return pool.at(-1)}
function V124_generateMatter(type=null,forced=false){
 const st=V124_legalState(),snap=V124_snapshot(),ctx=V124_ctx(),pick=type&&V124_LEGAL_TYPES[type]?{id:type,score:V124_scores(ctx)[type]||35,...V124_LEGAL_TYPES[type]}:V124_pickType(snap);if(!pick)return null;
 const claim=V124_claim(pick.id,pick.score),plaintiff=V124_claimant(pick.id),detail=V124_triggerDetail(pick.id,ctx),c=V118_fileCase({title:`${plaintiff} v. ${s.labelBusiness?.company?.name||s.name}`,issue:pick.issue,plaintiff,claim,strength:V124_strength(pick.id,pick.score),clauses:[pick.category],matterType:pick.id,category:pick.category,triggerDetail:detail,preventText:pick.prevent,riskScore:pick.score,generatedBy:'legal-risk'});
 if(!c)return null;c.filingKind=pick.id==='tax'?'Regulatory matter':'Civil claim';c.triggerDetail=detail;c.preventText=pick.prevent;c.riskScore=pick.score;c.category=pick.category;c.matterType=pick.id;c.generatedBy='legal-risk';st.lastGeneratedWeek=s.week;st.lastByType[pick.id]=s.week;st.generated++;V118_event('legal-risk',pick.name,detail,{caseId:c.id});addBriefing?.('legal-risk:'+c.id,'Legal',pick.name+' filed',detail+' Exposure: '+money(claim)+'.');if(forced)toast?.('Sandbox legal matter generated for testing.');return c
}
function V124_legalRiskWeek(){const st=V124_legalState();if(st.lastCheckedWeek===s.week)return null;st.lastCheckedWeek=s.week;const snap=V124_snapshot();if(!snap.entries.length)return null;const sandboxGuarantee=!!s.sandbox&&st.generated===0&&s.week-st.startedWeek>=6&&snap.total>=80;if(sandboxGuarantee||V124_roll('legal-week')<snap.chance)return V124_generateMatter(null,sandboxGuarantee);return null}

/* Every filing now prefers corporate General Counsel when one exists. Personal
   representation remains a fallback, and legacy label disputes get the same upgrade. */
const V124_fileCaseBase=V118_fileCase;
V118_fileCase=function(spec={}){const c=V124_fileCaseBase(spec);if(!c)return c;const counsel=V124_counsel();if(counsel){c.assignedAttorney=counsel.name;c.attorneySkill=counsel.skill;c.counselType=counsel.type;c.counselAuthority=counsel.authority}for(const key of ['matterType','category','triggerDetail','preventText','riskScore','generatedBy','filingKind'])if(spec[key]!==undefined)c[key]=spec[key];return c};

function V124_assignGeneralCounsel(id){const c=V118_legalCases().find(x=>x.id===id&&x.status==='open'),gc=typeof V123_execState==='function'?V123_execState().team?.legal:null;if(!c||!gc)return false;c.assignedAttorney=gc.name;c.attorneySkill=typeof V123_effectiveSkill==='function'?V123_effectiveSkill(gc):gc.skill||70;c.counselType='General Counsel';c.counselAuthority=gc.authority;c.history.unshift({week:s.week,text:'General Counsel assumed lead responsibility for the matter.'});queueSave?.();render();V118_openDocketCase(id);return true}
function V124_outsideCost(c){return cents(clamp(c.claim*.015,5000,250000))}
function V124_retainOutsideCounsel(id){const c=V118_legalCases().find(x=>x.id===id&&x.status==='open');if(!c)return false;const cost=V124_outsideCost(c);if(s.cash<cost){toast?.('Not enough cash for outside counsel.');return false}changeCash(-cost);if(s.finance?.week)s.finance.week.expenses=cents((s.finance.week.expenses||0)+cost);c.attorneySkill=clamp(Math.max(c.attorneySkill||0,72)+12,0,100);c.counselType=c.counselType==='General Counsel'?'General Counsel + outside litigation':'Outside litigation counsel';c.assignedAttorney=c.assignedAttorney||'Outside litigation counsel';c.history.unshift({week:s.week,text:'Outside litigation counsel retained: '+money(cost)+'.'});queueSave?.();render();V118_openDocketCase(id);return true}
function V124_mediationCost(c){return cents(clamp(c.claim*.0125,2500,150000))}
function V124_mediateCase(id){const c=V118_legalCases().find(x=>x.id===id&&x.status==='open');if(!c||c.stage!=='FILED')return false;const fee=V124_mediationCost(c);if(!spend(5,fee))return false;c.history.unshift({week:s.week,text:'Pretrial mediation opened. Legal spend '+money(fee)+'.'});const counsel=Math.max(0,c.attorneySkill||0),score=counsel*.55+s.reputation*.12-c.plaintiffStrength*.42+(V124_roll('mediate:'+c.number)-.5)*35;if(score>=10){const amount=cents(c.claim*clamp(.32+c.plaintiffStrength*.0022,.34,.56));if(s.cash<amount){c.history.unshift({week:s.week,text:'Mediation produced terms, but the company could not fund the settlement.'});render();return false}changeCash(-amount);if(s.finance?.week)s.finance.week.expenses=cents((s.finance.week.expenses||0)+amount);c.history.unshift({week:s.week,text:'Mediated settlement paid: '+money(amount)+'.'});V118_closeCase(c,'Resolved through mediation',0,0);$('modal')?.close?.();render();toast?.(c.number+' resolved through mediation.');return true}c.deadlineWeek+=1;c.history.unshift({week:s.week,text:'Mediation ended without agreement. Response deadline extended one week.'});$('modal')?.close?.();render();toast?.('No settlement. The response deadline moved one week.');return false}

const V124_caseActionBase=V118_caseAction;
V118_caseAction=function(id,action){if(action==='mediate')return V124_mediateCase(id);return V124_caseActionBase(id,action)};

function V124_riskLabel(chance){return chance>=.05?'High':chance>=.025?'Elevated':chance>=.01?'Moderate':chance>0?'Low':'Minimal'}
function V124_riskRows(snapshot){return snapshot.entries.slice(0,6).map(x=>`<div class="v124-risk-row"><div><strong>${esc(x.name)}</strong><small>${esc(x.category)} · pressure ${x.score}/100</small></div><span>${esc(x.prevent)}</span></div>`).join('')||'<p class="fine">No material legal-risk source is active yet.</p>'}

V118_docketCard=function(c){return `<button class="v118-docket-card" onclick="V118_openDocketCase('${c.id}')"><span><small>${esc(c.number)} · ${esc(c.stage)}${c.category?' · '+esc(c.category.toUpperCase()):''}</small><strong>${esc(c.title)}</strong><em>${esc(c.issue)} · exposure ${money(c.claim)}</em></span><b>${c.status==='open'?'OPEN':'RESOLVED'} →</b></button>`};
V118_legalAffairsPage=function(){const cases=V118_legalCases(),open=cases.filter(x=>x.status==='open'),resolved=cases.filter(x=>x.status==='resolved'),snap=V124_snapshot(),counsel=snap.counsel;return head('Consequences have a paper trail','Legal affairs.')+`<section class="v118-docket-hero"><div><span class="eyebrow">ENCORE LEGAL AFFAIRS · CIVIL / REGULATORY DOCKET</span><h2>${open.length?'Active matters require attention.':'No active legal matter.'}</h2><p>Legal pressure now grows from music rights, touring, staff, commerce, property, brands, ownership and tax/compliance exposure—not from a flat random event rate.</p></div>${metricRail([['Open matters',String(open.length)],['Exposure',money(open.reduce((n,x)=>n+x.claim,0))],['Weekly filing risk',(snap.chance*100).toFixed(1)+'%'],['Counsel',counsel?.name||'None']])}</section><section class="card v124-risk-card"><div class="v124-risk-head"><div><span class="eyebrow">LEGAL RISK MONITOR</span><h2>${V124_riskLabel(snap.chance)} current pressure</h2></div><strong>${(snap.chance*100).toFixed(1)}%</strong></div><p>Current exposure score ${snap.total}. Counsel prevention is reducing modeled filing pressure by ${Math.round(snap.prevention*100)}%. ${s.sandbox?'Sandbox runs legal-event pressure faster so the system is easier to play-test.':'Normal careers use the standard legal-event cadence.'}</p>${V124_riskRows(snap)}</section><section class="card"><h2>Active docket</h2>${open.map(V118_docketCard).join('')||'<p class="fine">No case is currently filed against your career or company.</p>'}</section><section class="card"><h2>Resolved matters</h2>${resolved.slice(0,30).map(V118_docketCard).join('')||'<p class="fine">Resolved disputes will remain in the permanent file.</p>'}</section>`};
V118_openDocketCase=function(id){const c=V118_legalCases().find(x=>x.id===id);if(!c)return false;const settlement=V118_caseSettlement(c),defense=V118_caseDefenseCost(c),outside=V124_outsideCost(c),mediation=V124_mediationCost(c),gc=typeof V123_execState==='function'?V123_execState().team?.legal:null;modal(`<article class="v118-docket-paper v124-docket-paper"><header><span>ENCORE LEGAL AFFAIRS</span><b>${esc(c.number)}</b></header><div class="v118-docket-stamp">${esc(c.status==='open'?c.stage:'RESOLVED')}</div><h2>${esc(c.title)}</h2>${profileRows([['Matter type',c.matterType&&V124_LEGAL_TYPES[c.matterType]?V124_LEGAL_TYPES[c.matterType].name:c.category||'Contract dispute'],['Cause / issue',c.issue],['Plaintiff / agency',c.plaintiff],['Defendant',c.defendant],['Filed',`Week ${c.filedWeek}`],['Claim / exposure',money(c.claim)],['Risk pressure at filing',c.riskScore?c.riskScore+'/100':'—'],['Linked agreement',c.agreementId||'None'],['Assigned counsel',c.assignedAttorney?`${c.assignedAttorney}${c.counselType?' · '+c.counselType:''}`:'No counsel retained'],['Response deadline',c.status==='open'&&c.stage==='FILED'?`Week ${c.deadlineWeek}`:'—']])}${c.triggerDetail?`<section class="v124-cause"><small>WHY THIS MATTER APPEARED</small><p>${esc(c.triggerDetail)}</p>${c.preventText?`<strong>Risk control: ${esc(c.preventText)}</strong>`:''}</section>`:''}<section class="v118-case-history"><h3>Docket history</h3>${c.history.map(x=>`<p><strong>Week ${x.week}</strong> · ${esc(x.text)}</p>`).join('')}</section>${c.status==='open'?`<div class="v118-request-actions">${c.stage==='FILED'?`<button class="primary" onclick="V118_caseAction('${c.id}','contest')">File defense · ${money(defense)} + 10 energy</button><button class="secondary" onclick="V118_caseAction('${c.id}','mediate')">Attempt mediation · ${money(mediation)} + 5 energy</button><button class="secondary" onclick="V118_caseAction('${c.id}','settle')">Settle now · ${money(settlement)}</button>`:''}${gc&&c.counselType!=='General Counsel'&&!String(c.counselType||'').includes('General Counsel')?`<button class="secondary" onclick="V124_assignGeneralCounsel('${c.id}')">Assign General Counsel</button>`:''}<button class="secondary" onclick="V124_retainOutsideCounsel('${c.id}')">Retain outside counsel · ${money(outside)}</button></div>`:`<div class="v118-case-result"><strong>${esc(c.outcome||'Resolved')}</strong><span>Week ${c.resolvedWeek||s.week}</span></div>`}<p class="fine">Ignoring a filed matter through its response deadline can create a default judgment. Outcomes post back into cash, reputation and permanent career history.</p></article>`);return true};

const V124_beginCareerWeekBase=beginCareerWeek;
beginCareerWeek=function(){const result=V124_beginCareerWeekBase();V124_legalRiskWeek();return result};
