/* ENCORE 0.9.2 integration fixes. Loaded after the business overhaul modules. */

/* Allocate exactly the full panel vote, with no negative remainder from rounding. */
V092_allocateVotes=function(nominees,total=1000){if(!nominees.length)return nominees;const weights=nominees.map(n=>Math.pow(Math.max(1,n.score+rand(-5,5)),2.2)),sum=weights.reduce((a,b)=>a+b,0),raw=weights.map(w=>total*w/sum),base=raw.map(Math.floor);let left=total-base.reduce((a,b)=>a+b,0);const order=raw.map((v,i)=>({i,r:v-base[i]})).sort((a,b)=>b.r-a.r||a.i-b.i);for(let k=0;k<left;k++)base[order[k%order.length].i]++;nominees.forEach((n,i)=>n.votes=base[i]);return nominees};

/* Artist-side label offers show one rights summary; roster offers keep editable clauses. */
contractFields=function(t,artistOffer=false){const base=V090_oldContractFields(t,artistOffer);return base+(artistOffer?'':V090_rightsChecklist(t.type,t.rights,true))};

/* Add sale controls back to the new aggregate sports ownership view. */
const V092_sportsPageBase=V081_sportsPage;
V081_sportsPage=function(){let html=V092_sportsPageBase();if(V081_sportsTab!=='My stakes')return html;const lots=(s.v081?.sports?.holdings||[]).map(h=>{const t=s.v081.sports.teams.find(x=>x.id===h.team);if(!t)return '';return `<div class="project-row"><div><strong>${esc(t.name)} · ${(h.share*100).toFixed(3)}% lot</strong><small>Basis ${money(h.basis)} · Current ${money(t.value*h.share)} · Distributions ${money(h.payouts||0)}</small></div><button class="secondary" onclick="V081_sellSports(${h.id})">Review sale</button></div>`}).join('');return html+`<section class="card"><h2>Ownership lots & exits</h2><p class="fine">Purchases remain separate lots so you can sell individual positions without giving up the rest of your ownership.</p>${lots||'<p>No positions to sell.</p>'}</section>`};

/* 360 merchandise participation follows the negotiated merch-rights clause. */
function V092_merchLabelShare(gross){const c=s.expansion?.contract;if(!c||c.type!=='360')return 0;const rights=typeof V090_contractRights==='function'?V090_contractRights(c.type,c.rights):{merch:true};return rights.merch?cents(Math.max(0,gross)*(c.share||0)):0}
const V092_settleCommerceBase=settleCommerce;
settleCommerce=function(){const beforeCash=s.cash,beforeMerch=V091_num(s.finance?.week?.merch),beforeExpenses=V091_num(s.finance?.week?.expenses);V092_settleCommerceBase();const gross=Math.max(0,V091_num(s.finance?.week?.merch)-beforeMerch),cut=V092_merchLabelShare(gross);if(cut>0){changeCash(-cut);s.finance.week.expenses=cents(V091_num(s.finance.week.expenses)+cut);if(s.expansion.contract)s.expansion.contract.recovered=cents((s.expansion.contract.recovered||0)+cut);moneyEvent('360 merchandise participation',-cut)}return {gross,cut,cashChange:s.cash-beforeCash,expenseChange:V091_num(s.finance?.week?.expenses)-beforeExpenses}};

/* Safer Studio cleanup: remove the old horizontal direction group only when the new 0.9 brief is present. */
const V092_studioCleanupBase=studio;
studio=function(){let html=V092_studioCleanupBase();if(!s.draft&&html.includes('studio-creative-brief')){const start=html.search(/<h[23][^>]*>Creative direction<\/h[23]>/i),end=start>=0?html.slice(start).search(/<h[23][^>]*>Production budget<\/h[23]>/i):-1;if(start>=0&&end>0)html=html.slice(0,start)+html.slice(start+end)}return html};