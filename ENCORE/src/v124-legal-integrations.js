/* ENCORE 0.9.20 — Legal Affairs 2.0 integration pass.
   Keep exposure accounting attached to authoritative game systems that live
   outside the physical-asset ledger, and make the system directly testable in Sandbox. */
const V124_ctxCore=V124_ctx;
V124_ctx=function(){
 const ctx=V124_ctxCore();
 const sportsHoldings=Array.isArray(s.v081?.sports?.holdings)?s.v081.sports.holdings.length:0;
 ctx.sports+=sportsHoldings;
 return ctx
};

function V124_sandboxMatter(type=''){
 if(!(SANDBOX||s.sandbox))return false;
 if(V118_openCases().length>=5){toast?.('Resolve an open legal matter before generating another test case.');return false}
 const c=V124_generateMatter(type||null,true);if(!c){toast?.('Build more career exposure before generating a risk-weighted matter.');return false}
 queueSave?.();render();V118_openDocketCase(c.id);return true
}
const V124_legalAffairsPageCore=V118_legalAffairsPage;
V118_legalAffairsPage=function(){
 const html=V124_legalAffairsPageCore();if(!(SANDBOX||s.sandbox))return html;
 const options=Object.entries(V124_LEGAL_TYPES).map(([id,x])=>`<option value="${id}">${esc(x.name)} · ${esc(x.category)}</option>`).join('');
 const lab=`<section class="card v124-sandbox-legal"><span class="eyebrow">SANDBOX · LEGAL PLAYTEST</span><h2>Put the legal system on the table.</h2><p>Generate a simulated filing immediately so you can test counsel, mediation, settlement, defense, deadlines and docket history without waiting for the weekly risk roll.</p><label>Matter to generate<select id="v124-sandbox-type"><option value="">Risk-weighted random matter</option>${options}</select></label><button class="primary" onclick="V124_sandboxMatter($('v124-sandbox-type').value)">Generate test legal matter</button><p class="fine">Sandbox-only. This never creates a case in your normal career.</p></section>`;
 return html.replace('<section class="card"><h2>Active docket',lab+'<section class="card"><h2>Active docket')
};
