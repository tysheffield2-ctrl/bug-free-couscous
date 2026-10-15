/* ENCORE v1.08 — actionable offers + one contract language.
   Every formal signing flow should use the same paper-contract reading room
   introduced for artist signings. Briefings should offer both "review here"
   and "open the owning screen" without forcing the player through Business HQ. */

let V108_contractPage=0;
globalThis.V108_activeAgreement=null;

function V108_closeOpenModal(){try{if($('modal')?.open)$('modal').close()}catch{}}
function V108_contractMark(label){return String(label||'ENCORE').split(/\s+/).map(x=>x[0]).join('').slice(0,3).toUpperCase()||'ENC'}
function V108_contractRows(rows=[]){return `<div class="legal-terms-grid v108-legal-terms">${rows.map(([k,v])=>`<div><small>${esc(k)}</small><b>${esc(v)}</b></div>`).join('')}</div>`}
function V108_contractPages(spec){return Array.isArray(spec?.pages)&&spec.pages.length?spec.pages:[{title:'Agreement',body:'Review the material terms before signing.'}]}
function V108_contractPaper(spec,page=0){
 const pages=V108_contractPages(spec),i=Math.max(0,Math.min(pages.length-1,page)),entry=pages[i],last=i===pages.length-1;
 return `<div class="legal-desk"><div class="legal-folder-tab">${esc(spec.counterparty)} · LEGAL AFFAIRS</div><article class="legal-sheet"><header class="legal-letterhead"><div class="legal-seal">${esc(V108_contractMark(spec.counterparty))}</div><div><strong>${esc(spec.counterparty)}</strong><small>${esc(String(spec.documentTitle||'ENTERTAINMENT AGREEMENT').toUpperCase())}</small></div><span>CONFIDENTIAL</span></header><div class="legal-rule"></div><div class="legal-doc-meta"><span>AGREEMENT NO. ${String(s.week).padStart(4,'0')}-${esc(String(spec.number||Date.now()).slice(-4))}</span><span>PAGE ${i+1} OF ${pages.length}</span></div><h2>${esc(String(entry.title||'').replace(/^\d+\s*·\s*/,''))}</h2><p class="legal-recital">This Agreement is entered into by and between <b>${esc(spec.counterparty)}</b> (the “Counterparty”) and <b>${esc(spec.signer||s.name)}</b> (the “Artist”). The parties agree as follows:</p><section class="legal-clause"><span>${String(i+1).padStart(2,'0')}.</span><p>${esc(entry.body||'')}</p></section>${entry.rows?.length?V108_contractRows(entry.rows):''}${entry.note?`<div class="legal-material-box"><b>MATERIAL TERMS</b><p>${esc(entry.note)}</p></div>`:''}${last?`<div class="legal-signatures"><div><span>ARTIST</span><div class="signature-line">${esc(spec.signer||s.name)}</div><small>Electronic signature required below to execute</small></div><div><span>COUNTERPARTY</span><div class="signature-line legal-counter-sign">${esc(spec.counterparty)} Authorized Representative</div><small>Authorized counterparty</small></div></div>`:`<div class="legal-initial-line"><span>ARTIST INITIALS</span><i></i></div>`}<footer><span>ENCORE CONTRACT VAULT · ${esc(String(spec.kind||'agreement').toUpperCase())}</span><span>${i+1} / ${pages.length}</span></footer></article></div>`
}
function V108_renderContractPage(){
 const host=$('v108-paper-host'),spec=globalThis.V108_activeAgreement;if(!host||!spec)return;
 host.classList.remove('page-turning');void host.offsetWidth;host.classList.add('page-turning');host.innerHTML=V108_contractPaper(spec,V108_contractPage);
 const total=V108_contractPages(spec).length,back=$('v108-paper-back'),next=$('v108-paper-next'),count=$('v108-paper-count');
 if(back)back.disabled=V108_contractPage<=0;
 if(next){next.disabled=V108_contractPage>=total-1;next.textContent=V108_contractPage>=total-1?'Execution page':'Next page →'}
 if(count)count.textContent=`${V108_contractPage+1} of ${total}`
}
function V108_turnContract(delta){const spec=globalThis.V108_activeAgreement;if(!spec)return;V108_contractPage=Math.max(0,Math.min(V108_contractPages(spec).length-1,V108_contractPage+delta));V108_renderContractPage()}
function V108_closeContract(){
 const shell=document.querySelector?.('#v108-contract-shell');
 if(!shell){globalThis.V108_activeAgreement=null;document.documentElement?.classList?.remove?.('contract-reading');document.body?.classList?.remove?.('contract-reading');return}
 shell.classList.add('contract-exit');setTimeout(()=>{shell.remove?.();globalThis.V108_activeAgreement=null;document.documentElement?.classList?.remove?.('contract-reading');document.body?.classList?.remove?.('contract-reading')},260)
}
function V108_mountStandardContract(spec){
 if(typeof document==='undefined'||!document.body?.appendChild)return false;
 V108_closeOpenModal();document.querySelector?.('#v108-contract-shell')?.remove?.();
 globalThis.V108_activeAgreement=spec;V108_contractPage=0;document.documentElement?.classList?.add?.('contract-reading');document.body?.classList?.add?.('contract-reading');
 const pages=V108_contractPages(spec).length,shell=document.createElement('section');shell.id='v108-contract-shell';shell.className='contract-reading-room v108-contract-room';
 shell.innerHTML=`<div class="contract-room-ambient"></div><div class="contract-room"><header class="contract-room-header"><div><span class="contract-room-kicker">PRIVATE LEGAL REVIEW</span><h1>${esc(spec.counterparty)}</h1><p>${esc(spec.documentTitle||'Entertainment Agreement')}</p></div><button class="contract-room-close" type="button" onclick="V108_closeContract()" aria-label="Return to ENCORE"><span>×</span><small>RETURN TO ENCORE</small></button></header><main class="paper-contract-viewer"><div class="contract-folder-intro"><span>${esc(V108_contractMark(spec.counterparty))}</span><div><small>ARTIST COPY</small><strong>${esc(spec.signer||s.name)}</strong></div><em>CONFIDENTIAL</em></div><div id="v108-paper-host"></div><div class="paper-pagination"><button id="v108-paper-back" class="contract-paper-button" type="button" onclick="V108_turnContract(-1)">← Previous</button><strong id="v108-paper-count"></strong><button id="v108-paper-next" class="contract-paper-button" type="button" onclick="V108_turnContract(1)">Next page →</button></div><section class="contract-room-advisory v108-contract-advisory"><h3>${esc(spec.summaryTitle||'Deal summary')}</h3>${spec.summaryHtml||''}${spec.explainer?`<p class="fine">${esc(spec.explainer)}</p>`:''}</section><form class="form legal-execution-form" onsubmit="V108_executeStandardContract(event)"><span class="eyebrow">EXECUTION</span><h3>Execute this agreement</h3><p>Review all ${pages} pages. Initial the material terms, then sign exactly as your artist name appears.</p><label>Artist initials<input name="initials" maxlength="6" autocomplete="off" placeholder="Initials" required></label><label>Electronic signature<input name="signature" maxlength="80" autocomplete="off" placeholder="${esc(spec.signer||s.name)}" required></label>${spec.executionNote?`<p class="fine">${esc(spec.executionNote)}</p>`:''}<button class="primary">Sign & execute agreement</button></form></main></div>`;
 document.body.appendChild(shell);const enter=()=>{shell.classList.add('contract-entered');V108_renderContractPage()};if(typeof requestAnimationFrame==='function')requestAnimationFrame(enter);else enter();return true
}
function V108_executeStandardContract(e){
 e.preventDefault();const spec=globalThis.V108_activeAgreement;if(!spec)return;const f=new FormData(e.target),initials=String(f.get('initials')||'').trim(),signature=String(f.get('signature')||'').trim(),expected=String(spec.signer||s.name).trim();
 if(!initials||initials.length>6){toast?.('Initial the material terms before signing.');return}
 if(signature.toLowerCase()!==expected.toLowerCase()){toast?.('Type your artist name exactly to sign.');return}
 const ok=typeof spec.execute==='function'?spec.execute({initials,signature}):false;if(ok===false)return;V108_closeContract()
}

const V108_REP_DETAILS={
 manager:{headline:'Your career quarterback.',what:'Shapes career strategy, helps triage opportunities and gives context before major business decisions.',effect:'ENCORE uses this role for manager-specific strategy guidance. Their percentage commission is charged only to the eligible income categories written in the agreement.',best:'Most valuable when several deals, releases, tours and commercial decisions are competing for attention.'},
 booking:{headline:'Your live-business specialist.',what:'Focuses on routing, guarantees, festivals, appearances and the economics of performing live.',effect:'ENCORE uses this role for touring guidance. Their commission applies only to live and appearance income under the current contract scope.',best:'Most valuable when touring becomes a major source of revenue or you are scaling into larger venues.'},
 business:{headline:'Your financial-control specialist.',what:'Helps you read budgets, reserves, statements and cash exposure before you commit money.',effect:'This role takes no income percentage in the current system. Your taxes and accounting still resolve through ENCORE’s finance engine; the Business Manager provides contextual financial guidance rather than secretly changing the numbers.',best:'Most valuable when your career has large releases, tours, taxes, assets or multiple businesses moving at once.'},
 attorney:{headline:'Your contract protection.',what:'Reviews rights, ownership, recoupment, options, extensions, cross-collateralization and exit language.',effect:'Hiring an Attorney adds named counsel and review confidence to contract screens while surfacing structural warnings before you sign.',best:'Most valuable before label, rights-heavy or long-term agreements.'},
 publicist:{headline:'Your public narrative lead.',what:'Focuses on press strategy, reputation, announcements and crisis response.',effect:'This is currently an advisory role: ENCORE surfaces publicity guidance based on your public interest and career state rather than applying an invisible stat buff.',best:'Most valuable during high-attention eras, major announcements or reputation problems.'},
 creative:{headline:'Your music-development advisor.',what:'Helps evaluate collaborators, release timing and creative direction from an A&R perspective.',effect:'This is currently an advisory role tied to your recent release form and creative context. It does not own your songs or silently change song quality.',best:'Most valuable when deciding what to release, who to work with and when to slow down for quality.'},
 tour:{headline:'Your road-operations lead.',what:'Focuses on crew, logistics, routing, fatigue and operational risk once you are on the road.',effect:'This is currently an advisory role. It gives touring-specific operational guidance without automatically changing a route or spending money for you.',best:'Most valuable on multi-city tours where logistics and fatigue matter as much as ticket demand.'},
 social:{headline:'Your audience-conversion strategist.',what:'Focuses on PULSE, campaign choices and turning attention into streams, tickets and merchandise.',effect:'This is currently an advisory role. It helps interpret social strategy; it does not auto-post or spend campaign money.',best:'Most valuable when engagement is strong but you need to convert attention into career outcomes.'}
};
function V108_repDetail(role){return V108_REP_DETAILS[role]||{headline:'A specialist on your team.',what:V100_REP_ROLES[role]?.purpose||'Provides career support.',effect:'The exact scope is written into the agreement.',best:'Use this role when its specialty matches the decision in front of you.'}}
function V108_repExplanation(role){const r=V100_REP_ROLES[role],d=V108_repDetail(role);return `<section class="v108-role-explainer"><span class="eyebrow">WHAT THIS REPRESENTATIVE ACTUALLY DOES</span><h3>${esc(d.headline)}</h3><div><strong>Job</strong><p>${esc(d.what)}</p></div><div><strong>In ENCORE</strong><p>${esc(d.effect)}</p></div><div><strong>Best time to hire</strong><p>${esc(d.best)}</p></div><div><strong>Authority limit</strong><p>They advise and perform the role above. They never accept offers, sign away rights, spend your money or make career decisions automatically.</p></div>${r?.scope?.length?`<div><strong>Commission scope</strong><p>${esc(V100_repScopeLabel(r.scope))}</p></div>`:''}</section>`}

V100_repCandidateCard=function(c){const r=V100_REP_ROLES[c.role],d=V108_repDetail(c.role);return `<section class="card v108-rep-card">${typeof personPhoto==='function'?personPhoto('rep-'+c.id,c.name):''}<span class="eyebrow">${esc(r.name.toUpperCase())} · AVAILABLE</span><h2>${esc(c.name)}</h2><p class="v108-rep-headline">${esc(d.headline)}</p>${profileRows([['Skill',c.skill+'/100'],['Industry reputation',c.reputation+'/100'],['Specialty',c.specialty],['Compensation',c.commission?c.commission+'% of '+V100_repScopeLabel(r.scope):'No percentage commission'],['Term',c.months+' months']])}<p>${esc(c.resume)}</p><p class="fine"><strong>Role:</strong> ${esc(d.what)}</p><button class="primary" onclick="V100_reviewRep('${c.id}')">Review role & contract</button></section>`};
V100_reviewRep=function(id){const c=V100_REP_CANDIDATES.find(x=>x.id===id);if(!c)return;const r=V100_REP_ROLES[c.role],scope=[...r.scope];modal(`<span class="eyebrow">REPRESENTATION · ROLE REVIEW</span><h2>${esc(c.name)} · ${esc(r.name)}</h2>${V108_repExplanation(c.role)}${profileRows([['Commission',c.commission?c.commission+'%':'0%'],['Eligible income',V100_repScopeLabel(scope)],['Term',c.months+' months'],['Skill',c.skill+'/100'],['Reputation',c.reputation+'/100']])}<p>${esc(c.resume)}</p><div class="controls"><button class="primary" onclick="V108_openRepContract('${c.id}')">Review full contract →</button><button class="secondary" onclick="$('modal').close()">Keep looking</button></div>`)};
function V108_openRepContract(id){
 const c=V100_REP_CANDIDATES.find(x=>x.id===id);if(!c)return false;const r=V100_REP_ROLES[c.role],d=V108_repDetail(c.role);
 return V108_mountStandardContract({kind:'representation',counterparty:c.name,documentTitle:r.name+' Representation Agreement',summaryTitle:'Representation terms',summaryHtml:profileRows([['Role',r.name],['Commission',c.commission?c.commission+'%':'0%'],['Eligible income',V100_repScopeLabel(r.scope)],['Term',c.months+' months'],['Specialty',c.specialty]]),explainer:d.effect,executionNote:'No representative can accept offers or spend money automatically. This signature only hires the representative under the written scope.',pages:[
  {title:'1 · Appointment',body:`${c.name} is appointed as your ${r.name} for ${c.months} months. ${d.what}`},
  {title:'2 · Duties & Scope',body:d.effect,rows:[['SPECIALTY',c.specialty],['SKILL',c.skill+'/100'],['REPUTATION',c.reputation+'/100']]},
  {title:'3 · Compensation',body:c.commission?`${c.name} receives ${c.commission}% of eligible income only. Eligible income: ${V100_repScopeLabel(r.scope)}.`:'This role currently carries no percentage commission.',note:'Investments, catalog sales and unrelated personal assets are excluded unless a future agreement explicitly says otherwise.'},
  {title:'4 · Term',body:`The appointment lasts ${c.months} months beginning when this agreement is executed. The representative’s authority ends when the term or a valid termination is completed.`},
  {title:'5 · Authority & Limits',body:'The representative may advise within the role above, but may not accept an offer, sign a separate agreement, transfer ownership, spend career cash or make a player decision automatically.'},
  {title:'6 · Early Termination',body:'You may review termination from Representation. ENCORE may calculate a settlement based on remaining term and career earnings together before the relationship ends.'},
  {title:'7 · Execution',body:'Signing hires this representative under the exact role, compensation, scope and term shown in this agreement.'}
 ],execute:()=>{V100_hireRep(id);return V100_repTeam()?.team?.[c.role]?.id===c.id}})
}
const V108_repTeamPanelBase=V100_repTeamPanel;
V100_repTeamPanel=function(){const html=V108_repTeamPanelBase();return `<section class="card v108-representation-guide"><span class="eyebrow">REPRESENTATION · HOW THE TEAM WORKS</span><h2>Every representative has a defined job.</h2><p>There are no mystery bonuses here. Open a candidate to see exactly what the role influences, what it does not control, how compensation works and when that specialist is useful.</p></section>${html}`};

/* Legacy agent agreements still exist in mature saves, so they use the same reading room. */
const V108_signAgentBase=signAgent;
signAgent=function(id,confirmed=false){
 if(confirmed)return V108_signAgentBase(id,true);
 const o=s.agency?.offers?.find(x=>x.agent===id),a=freelanceAgents?.find(x=>x.id===id);if(!labelActive()||!o||!a||s.agency?.contract)return;
 return V108_mountStandardContract({kind:'representation',counterparty:a.name,documentTitle:'Booking & Representation Agreement',summaryHtml:profileRows([['Commission',o.commission+'%'],['Eligible income','Music royalties + album sales + live income'],['Term',o.months+' months'],['Reach skill',a.skill+'/100'],['Execution cost','10 energy']]),explainer:'This legacy agent can increase reach through agentReach(), earns the written commission, and may generate simulated conduct incidents that can be investigated.',executionNote:'Signing costs 10 energy. Early dismissal uses the separate exit-fee review.',pages:[
  {title:'1 · Appointment',body:`${a.name} is appointed as your agent for ${o.months} months.`},
  {title:'2 · Services',body:`${a.note} The agent supplies simulated reach support based on a ${a.skill}/100 reach skill.`},
  {title:'3 · Commission',body:`The agent receives ${o.commission}% of music royalties, album sales and live income.`},
  {title:'4 · Term',body:`The agreement lasts ${o.months} months beginning at execution.`},
  {title:'5 · Conduct & Disputes',body:'Agent conduct incidents can occur in the simulation. Unapproved withdrawals or disputes remain reviewable through the representation screen.'},
  {title:'6 · Termination',body:'Early dismissal is subject to the separate dismissal review and its displayed exit cost.'},
  {title:'7 · Execution',body:'Signing activates the negotiated commission, term and reach-support relationship.'}
 ],execute:()=>{V108_signAgentBase(id,true);return s.agency?.contract?.agent===id}})
};

/* Commercial partnerships are contracts too: Accept opens the legal document first. */
const V108_acceptCommercialOfferBase=acceptCommercialOffer080;
function V108_openCommercialContract(id){
 const o=s.v080?.commercial?.offers?.find(x=>x.id===id&&x.status==='open'&&x.expires>=s.week);if(!o)return false;
 const upfront=cents(o.guarantee*(o.lifetime?.25:.35));
 return V108_mountStandardContract({kind:'commercial',counterparty:o.brand||o.name,documentTitle:V080_offerCategoryName(o.category)+' Agreement',summaryHtml:profileRows([['Headline value',money(o.totalValue)],['Guaranteed compensation',money(o.guarantee)],['Signing payment',money(upfront)],['Performance upside',money(o.bonus)],['Term',o.lifetime?'Lifetime relationship · 120-month guarantee schedule':o.durationMonths+' months'],['Exclusivity',o.exclusive?'Category exclusive':'Non-exclusive'],['Execution cost','10 energy']]),explainer:'Headline value is not paid all at once. The guaranteed portion settles through the signing payment and scheduled installments; milestone upside remains separate.',executionNote:'Signing costs 10 energy and immediately triggers the displayed signing payment.',pages:[
  {title:'1 · Parties & Term',body:`You and ${o.brand||o.name} enter a ${V080_offerCategoryName(o.category).toLowerCase()} relationship for ${o.lifetime?'the lifetime relationship defined here':o.durationMonths+' months'}.`},
  {title:'2 · Compensation',body:`Headline value: ${money(o.totalValue)}. Guaranteed compensation: ${money(o.guarantee)}. Performance or milestone upside: ${money(o.bonus)}.`,rows:[['SIGNING PAYMENT',money(upfront)],['GUARANTEED',money(o.guarantee)],['UPSIDE',money(o.bonus)]]},
  {title:'3 · Payment Schedule',body:'The full headline value is not a single immediate cash payment. Guaranteed compensation is paid through the signing payment and scheduled installments under ENCORE’s commercial settlement system.'},
  {title:'4 · Exclusivity',body:o.exclusive?'This agreement includes category exclusivity for its active term.':'This agreement is non-exclusive.'},
  {title:'5 · Performance Terms',body:'Performance and milestone upside is separate from guaranteed compensation and is not represented as guaranteed cash at execution.'},
  {title:'6 · Decision & Authority',body:'No business representative or notification may accept this agreement automatically. Execution occurs only after your electronic signature.'},
  {title:'7 · Execution',body:'Signing activates the commercial relationship and authorizes the displayed signing payment and future settlement schedule.'}
 ],execute:()=>{V108_acceptCommercialOfferBase(id);return o.status==='accepted'}})
}
acceptCommercialOffer080=function(id){return V108_openCommercialContract(id)};
reviewCommercialOffer080=function(id){migrateV080();const o=s.v080.commercial.offers.find(x=>x.id===id&&x.status==='open'&&x.expires>=s.week);if(!o)return;V080_markReviewed(o);modal(`<span class="eyebrow">${esc(V080_offerCategoryName(o.category))}</span><h2>${esc(o.name)}</h2>${profileRows([['Headline value',money(o.totalValue)],['Guaranteed compensation',money(o.guarantee)],['Performance / milestone upside',money(o.bonus)],['Term',o.lifetime?'Lifetime relationship · guaranteed payments over 120 months':o.durationMonths+' months'],['Exclusivity',o.exclusive?'Category exclusivity':'Non-exclusive'],['Decision window',V080_offerDeadlineText(o)]])}<p>Value reflects audience scale, engagement, reputation, performance, awards and marketability. Headline value is not paid all at once: long deals use a signing payment plus monthly guaranteed installments and potential bonuses.</p><form class="form" onsubmit="counterCommercialOffer080(event,${id})"><label>Counter headline value ($)<input name="value" type="number" min="1" max="9007199254740991" step="1" value="${o.totalValue}" required></label><button class="secondary">Send counter · 5 energy</button></form><div class="controls"><button class="primary" onclick="acceptCommercialOffer080(${id})">Review contract →</button><button class="secondary" onclick="declineCommercialOffer080(${id})">Decline</button></div><p class="fine">Every formal agreement opens the same page-by-page legal review used when signing an artist.</p>`);render()};

/* Mature-save legacy label signings and roster renewals follow the same legal room. */
const V108_signLabelBase=signLabel;
signLabel=function(i,confirmed=false){
 if(confirmed)return V108_signLabelBase(i,true);const d=labelDeals?.[i];if(!d||s.labelBusiness?.company||s.expansion?.contract||s.fans<d.fans||s.reputation<d.rep)return;
 return V108_mountStandardContract({kind:'recording',counterparty:d.name,documentTitle:'Recording Agreement',summaryHtml:profileRows([['Advance',money(d.advance)],['Company share',Math.round(d.share*100)+'%'],['Artist share',Math.round((1-d.share)*100)+'%'],['Term','26 weeks'],['Execution cost','10 energy']]),executionNote:'Signing costs 10 energy and pays the advance immediately under the legacy agreement rules.',pages:[
  {title:'1 · Parties & Term',body:`${d.name} and ${s.name} enter a 26-week recording agreement.`},
  {title:'2 · Advance & Royalty',body:`Advance: ${money(d.advance)}. Company share: ${Math.round(d.share*100)}%. Artist share: ${Math.round((1-d.share)*100)}%.`},
  {title:'3 · Services',body:`${d.description||d.style||'The label supplies release support under the agreement.'}`},
  {title:'4 · Reach Support',body:`Active support adds approximately ${Math.round(d.lift*100)}% reach under this legacy contract model.`},
  {title:'5 · Exclusivity',body:'The active legacy recording agreement cannot be cancelled early through this flow.'},
  {title:'6 · Tax Treatment',body:'The advance is recorded as taxable career income under the game economy.'},
  {title:'7 · Execution',body:'Signing activates the 26-week contract and authorizes the advance payment.'}
 ],execute:()=>{V108_signLabelBase(i,true);return s.expansion?.contract?.name===d.name}})
};

const V108_renewRosterBase=renewRoster;
renewRoster=function(id,confirmed=false){
 if(confirmed)return V108_renewRosterBase(id,true);const c=ownerContracts().find(x=>x.artist===id),a=s.world?.[id];if(!labelActive()||!c||!a||c.ends-s.week>8||c.weeks+26>104)return;const cost=rosterTerms(a,c.type,c.share,26).minimum;
 return V108_mountStandardContract({kind:'roster renewal',counterparty:a.name,signer:s.name,documentTitle:'Artist Contract Renewal',summaryHtml:profileRows([['Artist',a.name],['Renewal advance',money(cost)],['Label share',Math.round(c.share*100)+'%'],['Artist share',Math.round((1-c.share)*100)+'%'],['Extension','26 weeks'],['Execution cost','10 energy']]),executionNote:'Execution costs 10 energy and pays the renewal advance immediately.',pages:[
  {title:'1 · Renewal Parties',body:`Your label and ${a.name} agree to extend the existing artist agreement by 26 chart weeks.`},
  {title:'2 · Renewal Advance',body:`A new ${money(cost)} advance is due at execution.`},
  {title:'3 · Revenue Split',body:`The existing split continues: ${Math.round(c.share*100)}% to your label and ${Math.round((1-c.share)*100)}% to the artist.`},
  {title:'4 · Rights',body:'The original catalog and rights scope continues through the renewal term.'},
  {title:'5 · Continuous Term',body:`The resulting continuous term will be ${c.weeks+26} weeks, subject to the 104-week maximum.`},
  {title:'6 · Payment Authority',body:'The renewal advance is paid only after this agreement is electronically executed.'},
  {title:'7 · Execution',body:'Signing extends the existing artist agreement by 26 weeks on the terms above.'}
 ],execute:()=>{const before=c.ends;V108_renewRosterBase(id,true);return c.ends>before}})
};

/* Opportunity briefings: review in place OR open the exact owning screen. */
function V108_activeOpportunity(id){return s.expansion?.opportunities?.find(x=>x.id===id&&!x.done&&x.expires>=s.week)||null}
function V108_reviewOpportunity(id){const o=V108_activeOpportunity(id);if(!o){toast?.('That opportunity is no longer active.');return}V080_markReviewed?.(o);V108_closeOpenModal();acceptOpportunity(o.id,false)}
function V108_openOpportunityScreen(id=null){const o=id?V108_activeOpportunity(id):null;V108_closeOpenModal();careerTab='Opportunities';go('Career');if(o)window.setTimeout?.(()=>{const title=[...document.querySelectorAll?.('.card h2')||[]].find(x=>x.textContent?.trim()===o.type);title?.closest?.('.card')?.scrollIntoView?.({behavior:'smooth',block:'center'})},0)}
function V108_briefingOpportunity(id){const b=s.achievements?.briefings?.find(x=>x.id===id);return typeof V107_opportunityForBriefing==='function'?V107_opportunityForBriefing(b):null}
function V108_reviewBriefingOpportunity(id){const o=V108_briefingOpportunity(id);if(!o){V108_openOpportunityScreen();return}V108_reviewOpportunity(o.id)}
function V108_openBriefingOpportunity(id){const o=V108_briefingOpportunity(id);V108_openOpportunityScreen(o?.id||null)}
function V108_openTourScreen(focus=false){V108_closeOpenModal();careerTab='Touring';go('Career');window.setTimeout?.(()=>{const selector=focus?'.tour-ledger,.tour-history,.tour-active,.touring-active':'.touring-2,.tour-screen,.screen-career';document.querySelector?.(selector)?.scrollIntoView?.({behavior:'smooth',block:'start'})},0)}

const V108_offerBriefingButtonBase=offerBriefingButton;
offerBriefingButton=function(b){const id=String(b?.id||'');if(id.startsWith('offer:')){const review=/interview/i.test(String(b?.title||''))?'Review interview offer':'Review opportunity';return `<div class="memo-action-pair"><button class="memo-primary" onclick="V108_reviewBriefingOpportunity('${esc(id)}')">${review}</button><button class="memo-secondary" onclick="V108_openBriefingOpportunity('${esc(id)}')">Open Opportunities</button></div>`}if(id.startsWith('tour-week:'))return `<div class="memo-action-pair"><button class="memo-primary" onclick="V108_openTourScreen(true)">Review city report</button><button class="memo-secondary" onclick="V108_openTourScreen(false)">Open Touring</button></div>`;if(id.startsWith('tour-complete:'))return `<div class="memo-action-pair"><button class="memo-primary" onclick="V108_openTourScreen(true)">Review final report</button><button class="memo-secondary" onclick="V108_openTourScreen(false)">Open Touring</button></div>`;return V108_offerBriefingButtonBase(b)};

function V108_reviewPriority(key){const item=V096_priorityRaw().find(x=>x.key===key);if(!item)return;V096_markSeen([key]);if(item.kind==='career'){V108_reviewOpportunity(item.id);return}if(item.kind==='commercial'){V108_closeOpenModal();reviewCommercialOffer080(item.id);return}V096_openPriority(key)}
function V108_openPriorityScreen(key){const item=V096_priorityRaw().find(x=>x.key===key);if(!item)return;V096_markSeen([key]);V108_closeOpenModal();if(item.kind==='career'){V108_openOpportunityScreen(item.id);return}if(item.kind==='tour'){V108_openTourScreen(false);return}if(item.kind==='creative'){V081_creativeTab='Opportunities';V096_openBusinessArea('Creative');return}if(item.kind==='commercial'){V096_openBusinessArea('Offers');return}V096_openPriority(key)}
function V108_priorityScreenLabel(item){return item.kind==='career'?'Open Opportunities':item.kind==='tour'?'Open Touring':item.kind==='creative'?'Open Creative Network':item.kind==='commercial'?'Open Offers Center':'Open screen'}
V096_priorityPopup=function(){
 if(!saveReady||!s.started||titleVisible||monthlyAdvancing||$('modal')?.open)return;V096_preparePriority();const items=V096_unseenPriority().slice(0,6);if(!items.length)return;V096_markSeen(items.map(x=>x.key));
 const cards=items.map(x=>`<article class="priority-request v108-priority-request"><span class="priority-icon" aria-hidden="true">${x.kind==='tour'?'♬':x.kind==='creative'?'✦':x.kind==='commercial'?'$':'!'}</span><span><small>${esc(x.category)} · NEW</small><strong>${esc(x.title)}</strong><em>${esc(x.detail)}</em><span class="v108-priority-actions"><button class="priority-review" onclick="V108_reviewPriority('${x.key}')">Review now</button><button class="priority-open" onclick="V108_openPriorityScreen('${x.key}')">${esc(V108_priorityScreenLabel(x))}</button></span></span></article>`).join('');
 const single=items.length===1?items[0]:null,footerPrimary=single?`<button class="primary" onclick="V108_openPriorityScreen('${single.key}')">${esc(V108_priorityScreenLabel(single))}</button>`:`<button class="primary" onclick="$('modal').close();careerTab='Inbox';go('Career')">Open Career Inbox</button>`;
 modal(`<article class="priority-opportunity"><div class="priority-opportunity-head"><span class="eyebrow">IMPORTANT · ACTION AVAILABLE</span><h2>${items.length===1?'New opportunity':'New opportunities'}</h2><p>Review a request immediately without leaving this screen, or open the exact system that owns it. Nothing is accepted automatically.</p></div><div class="priority-request-stack">${cards}</div><div class="priority-opportunity-actions"><button class="secondary" onclick="$('modal').close()">Later</button>${footerPrimary}</div></article>`,'priority-opportunity-dialog')
};
