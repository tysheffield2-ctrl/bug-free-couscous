/* ENCORE 0.9.13 — Representation Market 2.0.
   Expands each role into a deeper rotating talent market. Players see four
   candidates at a time, can refresh for a different set, and get visibly
   different working styles instead of one obvious fixed choice. */

const V116_MARKET_SIZE=4;
const V116_ROLE_ORDER=['manager','booking','business','attorney','publicist','creative','tour','social','cpa'];
const V116_FIRST_NAMES=['Avery','Jordan','Camille','Darius','Naomi','Malik','Sierra','Julian','Brielle','Andre','Morgan','Tiana','Elias','Renee','Kendall','Dominic','Nia','Micah','Selena','Roman','Imani','Jalen','Maya','Victor'];
const V116_LAST_NAMES=['Cole','Bennett','Hayes','Brooks','Mercer','Vale','Park','Ellis','Price','Cross','Walsh','Hale','Reed','Stone','Monroe','Carter','Blake','Wells','Hart','Banks','Rowe','King','Lane','Bell'];
const V116_STYLE_BANK={
 manager:[
  {name:'Long-game strategist',specialty:'Career architecture',approach:'Protects leverage, sequencing and long-term positioning before chasing the biggest immediate check.',tradeoff:'Can move slower when a short-term opportunity is unusually hot.',skill:3,rep:3},
  {name:'Deal closer',specialty:'Major negotiations',approach:'Pushes aggressively on money, term and leverage when counterparties are motivated.',tradeoff:'Higher-pressure tactics can leave less room for relationship-first deals.',skill:5,rep:2},
  {name:'Relationship builder',specialty:'Industry relationships',approach:'Prioritizes repeat partners, trust and access across labels, brands and collaborators.',tradeoff:'May leave a little money on the table to preserve long-term relationships.',skill:1,rep:5},
  {name:'Independent-first operator',specialty:'Ownership & independence',approach:'Favors ownership, optionality and shorter obligations whenever the career can support them.',tradeoff:'May pass on larger advances that require more control.',skill:2,rep:1},
  {name:'Growth executive',specialty:'Career scaling',approach:'Looks for the fastest credible path from the current tier into the next one.',tradeoff:'Growth plans can require heavier spending and a busier calendar.',skill:4,rep:4}
 ],
 booking:[
  {name:'Sell-through planner',specialty:'Demand-first routing',approach:'Books rooms around realistic demand and repeat-market strength.',tradeoff:'Less likely to gamble on prestige venues before the audience is ready.',skill:4,rep:2},
  {name:'Festival networker',specialty:'Festivals & appearances',approach:'Uses festival slots and special appearances to widen reach between tours.',tradeoff:'Festival-heavy plans can sacrifice some headline control.',skill:2,rep:5},
  {name:'Scale chaser',specialty:'Venue progression',approach:'Looks for moments to jump room size and raise guarantees quickly.',tradeoff:'More exposure to weak sell-through if demand is overestimated.',skill:5,rep:3},
  {name:'Global router',specialty:'International touring',approach:'Builds multi-market routes around travel efficiency and international demand.',tradeoff:'More complex logistics and higher travel exposure.',skill:4,rep:4},
  {name:'Guarantee specialist',specialty:'Promoter economics',approach:'Prioritizes strong guarantees, promoter confidence and downside protection.',tradeoff:'May prefer safer deals over upside-heavy percentage structures.',skill:3,rep:3}
 ],
 business:[
  {name:'Cash controller',specialty:'Liquidity & reserves',approach:'Keeps operating buffers, tax reserves and major commitments visible before discretionary spending.',tradeoff:'Can feel conservative during aggressive growth eras.',skill:5,rep:4},
  {name:'Growth finance lead',specialty:'Expansion budgeting',approach:'Builds budgets around scaling tours, releases, staff and owned businesses.',tradeoff:'Accepts tighter liquidity when the expected growth case is strong.',skill:4,rep:3},
  {name:'Operations accountant',specialty:'Cost discipline',approach:'Focuses on recurring overhead, leakage and clean departmental budgets.',tradeoff:'Less focused on high-risk/high-upside expansion.',skill:3,rep:4},
  {name:'Wealth integrator',specialty:'Career + asset planning',approach:'Views career cash, businesses and owned assets as one coordinated financial picture.',tradeoff:'Best value arrives later in larger careers.',skill:4,rep:5},
  {name:'Forecast analyst',specialty:'Scenario planning',approach:'Compares best/base/worst-case cash outcomes before major commitments.',tradeoff:'More analysis can slow fast decisions.',skill:5,rep:2}
 ],
 attorney:[
  {name:'Rights hawk',specialty:'Masters & publishing',approach:'Protects ownership, licensing scope and future control above headline cash.',tradeoff:'Can make rights-heavy deals harder to close.',skill:5,rep:4},
  {name:'Exit specialist',specialty:'Options & termination',approach:'Focuses on escape clauses, extensions, buyouts and what happens when a deal goes bad.',tradeoff:'May spend less negotiation capital on cosmetic terms.',skill:4,rep:3},
  {name:'Deal architect',specialty:'Complex agreements',approach:'Balances economics, rights, term and obligations across complicated contracts.',tradeoff:'Complex structures can take longer to negotiate.',skill:5,rep:5},
  {name:'Artist advocate',specialty:'Fair-term negotiation',approach:'Pushes for understandable, balanced contracts without unnecessary traps.',tradeoff:'Less interested in exotic structures just to maximize leverage.',skill:3,rep:4},
  {name:'Risk litigator',specialty:'Disputes & enforcement',approach:'Treats breach risk, enforcement and documentation as first-class concerns.',tradeoff:'Can be more defensive than growth-oriented.',skill:4,rep:4}
 ],
 publicist:[
  {name:'Prestige press lead',specialty:'Editorial positioning',approach:'Builds credibility through long-form press, interviews and carefully timed announcements.',tradeoff:'Usually slower than viral-first publicity.',skill:4,rep:5},
  {name:'Viral narrator',specialty:'Fast-cycle attention',approach:'Moves quickly around trends, moments and high-engagement public narratives.',tradeoff:'Short-lived attention can cool quickly if the music does not convert it.',skill:3,rep:2},
  {name:'Crisis specialist',specialty:'Reputation recovery',approach:'Prioritizes message discipline, response timing and damage containment.',tradeoff:'Less valuable during quiet, low-risk eras.',skill:5,rep:4},
  {name:'Grassroots storyteller',specialty:'Authentic fan narrative',approach:'Builds human stories around the artist, community and career journey.',tradeoff:'May not create the biggest immediate media splash.',skill:2,rep:3},
  {name:'Event publicist',specialty:'Launch moments',approach:'Builds press around releases, tours, awards and major career events.',tradeoff:'Less focused on always-on daily attention.',skill:4,rep:4}
 ],
 creative:[
  {name:'Hit-focused A&R',specialty:'Commercial records',approach:'Prioritizes hooks, fit, collaborators and songs with broad release potential.',tradeoff:'Can push against riskier artistic choices.',skill:5,rep:4},
  {name:'Album architect',specialty:'Cohesive projects',approach:'Thinks in eras, sequencing, sonic identity and complete bodies of work.',tradeoff:'May favor slower project development over rapid singles.',skill:4,rep:4},
  {name:'Experimental scout',specialty:'New sounds',approach:'Looks for unusual collaborators, genre movement and creative differentiation.',tradeoff:'Higher variance between breakout ideas and misses.',skill:3,rep:3},
  {name:'Artist developer',specialty:'Long-term craft',approach:'Focuses on skill growth, creative identity and sustainable improvement.',tradeoff:'Less obsessed with immediate chart optimization.',skill:4,rep:5},
  {name:'Collaboration broker',specialty:'Features & producers',approach:'Builds creative networks and matches artists with complementary collaborators.',tradeoff:'The best idea may depend more heavily on outside talent.',skill:3,rep:5}
 ],
 tour:[
  {name:'Logistics commander',specialty:'Operational reliability',approach:'Minimizes routing failures, crew problems and preventable road disruption.',tradeoff:'Can choose operationally easier routes over flashy ones.',skill:5,rep:4},
  {name:'Cost cutter',specialty:'Tour margin',approach:'Looks for efficient staffing, travel and production choices that protect profit.',tradeoff:'May resist expensive production upgrades.',skill:4,rep:2},
  {name:'Production maximalist',specialty:'Premium live production',approach:'Builds larger show experiences when demand and budget can support them.',tradeoff:'Higher fixed costs increase downside if ticket demand softens.',skill:3,rep:5},
  {name:'International operator',specialty:'Cross-border logistics',approach:'Handles travel complexity, regional routing and international operations.',tradeoff:'Less specialized in tiny domestic runs.',skill:4,rep:4},
  {name:'Fatigue planner',specialty:'Schedule sustainability',approach:'Balances routing, recovery and workload to protect long tours.',tradeoff:'May sacrifice an extra date to keep the tour healthy.',skill:4,rep:3}
 ],
 social:[
  {name:'Conversion strategist',specialty:'Streams, tickets & merch',approach:'Measures social success by what attention turns into, not raw impressions.',tradeoff:'May ignore vanity growth that does not convert.',skill:5,rep:3},
  {name:'Viral operator',specialty:'Trend velocity',approach:'Chases fast-moving formats and moments that can accelerate discovery.',tradeoff:'Performance can be volatile when trends cool.',skill:4,rep:2},
  {name:'Community builder',specialty:'Fan loyalty',approach:'Prioritizes replies, recurring fans and durable community behavior.',tradeoff:'Usually grows slower than aggressive viral tactics.',skill:3,rep:4},
  {name:'Campaign analyst',specialty:'Testing & optimization',approach:'Compares campaign performance and reallocates attention toward what converts.',tradeoff:'Needs enough activity to generate useful data.',skill:5,rep:4},
  {name:'Brand storyteller',specialty:'Artist identity',approach:'Keeps visuals, messaging and public identity cohesive across campaigns.',tradeoff:'Can reject effective tactics that clash with the artist brand.',skill:3,rep:5}
 ],
 cpa:[
  {name:'Compliance-first CPA',specialty:'Clean filings & documentation',approach:'Prioritizes defensible records, clean classifications and low audit friction.',tradeoff:'More conservative around ambiguous deductions.',skill:4,rep:4},
  {name:'Touring tax specialist',specialty:'Multi-state touring income',approach:'Focuses on complex touring, appearance and multi-jurisdiction income.',tradeoff:'Less differentiated for very small careers.',skill:5,rep:4},
  {name:'Entertainment planner',specialty:'Royalties & endorsements',approach:'Specializes in mixed creator income, royalties, brand deals and career expenses.',tradeoff:'Less focused on large non-entertainment holdings.',skill:4,rep:5},
  {name:'Wealth CPA',specialty:'High-net-worth structures',approach:'Best at large companies, assets, investments and complex income mixes.',tradeoff:'Expensive relative to an early-stage career.',skill:5,rep:5},
  {name:'Deduction reviewer',specialty:'Expense classification',approach:'Looks closely at eligible business use, documentation and deduction quality.',tradeoff:'Strong documentation demands more financial discipline.',skill:3,rep:3}
 ]
};

function V116_marketState(){
 if(!s.representationMarket||typeof s.representationMarket!=='object')s.representationMarket={version:1,roles:{}};
 s.representationMarket.version=1;s.representationMarket.roles??={};
 for(const role of V116_ROLE_ORDER){const r=s.representationMarket.roles[role]??={week:s.week,refresh:0};if(r.week!==s.week){r.week=s.week;r.refresh=0}}
 return s.representationMarket
}
function V116_generatedCandidate(role,i){
 const ri=Math.max(0,V116_ROLE_ORDER.indexOf(role)),styles=V116_STYLE_BANK[role]||[{name:'Specialist',specialty:'General',approach:'Provides role-specific guidance.',tradeoff:'Generalist profile.',skill:0,rep:0}],style=styles[i%styles.length];
 const first=V116_FIRST_NAMES[(i*5+ri*3)%V116_FIRST_NAMES.length],last=V116_LAST_NAMES[(i*7+ri*5+2)%V116_LAST_NAMES.length];
 const skill=clamp(68+((i*7+ri*3)%24)+(style.skill||0),60,99),reputation=clamp(62+((i*5+ri*4)%26)+(style.rep||0),55,99),months=[6,12,18,24,36][(i+ri)%5];
 const commission=role==='manager'?8+((i*3+ri)%9):role==='booking'?6+((i*2+ri)%8):0;
 const weeklyRetainer=role==='cpa'?[700,1200,2200,4000,7000,11000][(i+ri)%6]:0;
 return {id:`v116-${role}-${i}`,name:first+' '+last,role,skill,reputation,personality:style.name,commission,months,weeklyRetainer,specialty:style.specialty,resume:`Known for ${style.approach.charAt(0).toLowerCase()+style.approach.slice(1)}`,marketStyle:style.name,approach:style.approach,tradeoff:style.tradeoff}
}
const V116_GENERATED=[];
for(const role of V116_ROLE_ORDER)for(let i=0;i<8;i++)V116_GENERATED.push(V116_generatedCandidate(role,i));
for(const c of V116_GENERATED)if(!V100_REP_CANDIDATES.some(x=>x.id===c.id))V100_REP_CANDIDATES.push(c);

function V116_rolePool(role){return V100_REP_CANDIDATES.filter(c=>c.role===role)}
function V116_roleCandidates(role){
 if(V100_repTeam().team?.[role])return [];
 const pool=V116_rolePool(role);if(!pool.length)return [];
 const state=V116_marketState().roles[role],weekShift=((Math.max(1,s.week)-1)%3)*2,start=(weekShift+state.refresh*V116_MARKET_SIZE)%pool.length,out=[];
 for(let i=0;i<Math.min(V116_MARKET_SIZE,pool.length);i++)out.push(pool[(start+i)%pool.length]);
 return out
}
function V116_compensationLabel(c){if(c.role==='cpa')return money(c.weeklyRetainer||0)+'/week';if(c.commission)return c.commission+'% eligible income';return '0% income commission'}
function V116_styleFor(c){return c.marketStyle||c.personality||'Specialist'}
function V116_approachFor(c){return c.approach||c.resume||'Role-specific career support.'}
function V116_tradeoffFor(c){return c.tradeoff||'Compare skill, reputation, compensation and term against the other candidates.'}
function V116_candidateCard(c){return `<article class="v116-candidate-card"><div class="v116-candidate-top"><span class="v116-style-pill">${esc(V116_styleFor(c))}</span><small>${esc(c.specialty||'General')}</small></div><h3>${esc(c.name)}</h3>${profileRows([['Skill',c.skill+'/100'],['Industry reputation',c.reputation+'/100'],['Compensation',V116_compensationLabel(c)],['Term',c.months+' months']])}<p><strong>Approach:</strong> ${esc(V116_approachFor(c))}</p><p class="fine"><strong>Trade-off:</strong> ${esc(V116_tradeoffFor(c))}</p><button class="primary" type="button" onclick="V115_reviewCandidate('${c.id}')">Review role & contract →</button></article>`}
function V116_refreshRoleMarket(role){const state=V116_marketState().roles[role];state.refresh=(state.refresh||0)+1;queueSave?.();return V115_openRoleMarket(role)}

V115_openRoleMarket=function(role){
 const r=V100_REP_ROLES[role];if(!r)return false;
 const rep=V100_repTeam(),current=rep.team?.[role];if(current){V100_reviewTermination(role);return true}
 const candidates=V116_roleCandidates(role);if(!candidates.length){toast?.('No '+r.name+' candidates are available right now.');return false}
 const state=V116_marketState().roles[role],pool=V116_rolePool(role),sets=Math.max(1,Math.ceil(pool.length/V116_MARKET_SIZE)),explainer=typeof V108_repExplanation==='function'?V108_repExplanation(role):`<p>${esc(r.purpose||'Representation specialist.')}</p>`;
 modal(`<section class="v116-market"><span class="eyebrow">REPRESENTATION MARKET · ${esc(r.name.toUpperCase())}</span><div class="v116-market-heading"><div><h2>Four different people. Four different ways to work.</h2><p>This market rotates automatically each week. Refreshing shows another search set without changing your career or signing anyone.</p></div><button class="secondary" type="button" onclick="V116_refreshRoleMarket('${role}')">Refresh search ↻</button></div><div class="v116-market-meta"><span>SET ${(state.refresh%sets)+1} / ${sets}</span><span>${pool.length} TOTAL CANDIDATES</span><span>WEEK ${s.week}</span></div>${explainer}<div class="v116-candidate-grid">${candidates.map(V116_candidateCard).join('')}</div><button class="secondary" type="button" onclick="$('modal').close()">Keep looking</button></section>`);
 return true
};

const V116_hireRepBase=V100_hireRep;
V100_hireRep=function(id){const c=V100_REP_CANDIDATES.find(x=>x.id===id),result=V116_hireRepBase(id),hired=c&&V100_repTeam()?.team?.[c.role];if(hired?.id===id){hired.marketStyle=c.marketStyle||c.personality;hired.approach=c.approach;hired.tradeoff=c.tradeoff}return result};
const V116_repAdviceBase=V100_repAdviceFor;
V100_repAdviceFor=function(role){const base=V116_repAdviceBase(role),c=V100_repTeam()?.team?.[role];return c?.approach?`${base} Working style — ${c.marketStyle||c.personality||'Specialist'}: ${c.approach}`:base};

V100_repTeamPanel=function(){
 const rep=V100_repTeam(),rows=Object.entries(V100_REP_ROLES).map(([id,r])=>{const c=rep.team[id];return `<div class="project-row"><div><strong>${esc(r.name)}</strong><small>${c?esc(c.name)+' · '+esc(c.marketStyle||c.personality||'Specialist')+(c.commission?' · '+c.commission+'%':''):esc(r.purpose)}</small><p>${esc(V100_repAdviceFor(id))}</p></div>${c?`<button class="secondary" type="button" onclick="V100_reviewTermination('${id}')">Review agreement</button>`:`<button class="secondary" type="button" onclick="V115_openRoleMarket('${id}')">Browse candidates →</button>`}</div>`}).join('');
 const history=rep.history.slice(0,12).map(x=>`<p><strong>Week ${x.week}</strong> · ${esc(x.name)} · ${x.type==='hired'?'Joined as '+V100_REP_ROLES[x.role].name:'Agreement ended · '+esc(x.reason||'New direction')+(x.fee?' · '+money(x.fee):'')}</p>`).join('')||'<p>Your hires, departures and termination reasons will appear here.</p>';
 return `<section class="card v108-representation-guide"><span class="eyebrow">REPRESENTATION · HOW THE TEAM WORKS</span><h2>Every representative has a defined job—and a different way of doing it.</h2><p>Skill, reputation, compensation, term and working style all vary. Open a role to compare the current search set before you sign.</p></section><section class="card"><span class="eyebrow">REPRESENTATION 2.0 · YOUR TEAM</span><h2>Advice has a job attached to it.</h2><p>Percentage compensation only applies to the income categories written into that person’s scope. Investments, catalog sales and unrelated assets are excluded unless a future contract explicitly says otherwise.</p>${rows}</section><section class="card v116-market-summary"><span class="eyebrow">REPRESENTATION MARKET</span><h2>The market moves.</h2><p>Each open role shows <strong>4 candidates at a time</strong> from a larger pool. Refresh for a different set, or advance the week and the market rotates automatically.</p><p class="fine">Refreshing is only a search action. It never hires anyone, spends career cash or changes an agreement.</p></section><section class="card"><h2>Team history</h2>${history}</section>`
};
