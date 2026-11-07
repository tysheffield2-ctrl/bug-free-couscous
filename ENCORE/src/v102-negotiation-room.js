/* ENCORE 1.0.2 — dedicated player-label negotiation environment. */
function V102_canRender(){return typeof document!=='undefined'&&document.body&&typeof document.createElement==='function'}
function V102_clearNegotiationState(){if(typeof document!=='undefined'){document.documentElement?.classList?.remove?.('negotiation-reading');document.body?.classList?.remove?.('negotiation-reading')}globalThis.V102_activeNegotiation=null}
function V102_closeNegotiation(){if(typeof document==='undefined'){V102_clearNegotiationState();return}const shell=document.querySelector?.('#v102-negotiation-shell');if(!shell){V102_clearNegotiationState();return}shell.classList.add('negotiation-exit');setTimeout(()=>{shell.remove?.();V102_clearNegotiationState()},240)}
function V102_terms(id){const a=s.world[id];return {type:'record',share:.1,weeks:26,advance:rosterTerms(a,'record',.1,26).minimum}}
function V102_renderNegotiation(id,terms){if(!V102_canRender())return false;const a=s.world[id],n=V100_rosterNegotiation(id);if(!a||!n||!s.labelBusiness?.company)return false;globalThis.V102_activeNegotiation={artist:id,terms:{...terms}};document.querySelector?.('#v102-negotiation-shell')?.remove?.();try{$('modal')?.close?.()}catch{}document.documentElement.classList.add('negotiation-reading');document.body.classList.add('negotiation-reading');const shell=document.createElement('section');shell.id='v102-negotiation-shell';shell.className='negotiation-room-shell';shell.innerHTML=`<div class="negotiation-room-bg"></div><div class="negotiation-room"><header class="negotiation-room-header"><div><span class="negotiation-room-kicker">PRIVATE NEGOTIATION · ROUND ${Math.max(1,(n.rounds||0)+1)}</span><h1>${esc(a.name)}</h1><p>${esc(s.labelBusiness.company.name)} · Artist acquisition meeting</p></div><button class="negotiation-room-close" type="button" onclick="V102_closeNegotiation()" aria-label="Leave negotiations"><span>×</span><small>LEAVE TALKS</small></button></header><main class="negotiation-table"><section class="negotiation-counterparty"><div class="negotiation-avatar">${esc((a.name||'?').split(/\s+/).map(x=>x[0]).join('').slice(0,2))}</div><div><small>ACROSS THE TABLE</small><h2>${esc(a.name)}</h2><p>${esc(n.response||'The artist is willing to hear your offer.')}</p></div></section><section class="negotiation-room-meters">${negotiationBar('Artist interest',n.interest,'How strongly the artist currently wants to join your company.')}${negotiationBar('Artist patience',n.patience,'How much more bargaining they will tolerate before ending talks.')}${negotiationBar('Your leverage',n.leverage,'Your label reputation, staff support and relationship advantage.')}</section><section class="negotiation-offer-sheet"><div class="negotiation-offer-heading"><span class="negotiation-room-kicker">YOUR PROPOSAL</span><h2>Put the deal on the table.</h2><p>Broader rights, a larger label share and longer control increase what the artist expects in return.</p></div><form class="form" oninput="previewRosterTerms(this,${id})" onsubmit="V102_submitRosterOffer(event,${id})">${contractFields(terms)}<div class="negotiation-preview" id="roster-preview">Requested advance ${money(terms.advance)} · Reputation ${s.reputation}/${rosterTerms(a,terms.type,terms.share,terms.weeks).reputation}</div><div class="negotiation-room-actions"><button class="secondary" type="button" onclick="V102_closeNegotiation()">Walk away</button><button class="primary">Present offer</button></div></form></section></main></div>`;document.body.appendChild(shell);const enter=()=>shell.classList.add('negotiation-entered');if(typeof requestAnimationFrame==='function')requestAnimationFrame(enter);else enter();return true}
function V102_openRosterNegotiation(id){const a=s.world[id];if(!labelActive()||!s.labelBusiness.company||!a||ownerContracts().some(c=>c.artist===id)||ownerContracts().length>=labelCapacity())return;const n=V100_rosterNegotiation(id);if(n.status==='walked'&&s.week<(n.walkedUntil||0)){toast(a.name+' is not ready to reopen talks yet.');return}if(n.status==='walked'){n.status='active';n.patience=Math.max(35,n.patience);n.interest=Math.max(30,n.interest)}return V102_renderNegotiation(id,V102_terms(id))}
function V102_askPriorities(id){
 if(!labelActive()||!s.labelBusiness?.company)return false;
 try{
  const outcome=ENCORE_ROSTER_NEGOTIATION.meet(s,id);
  if(outcome.status==='energy'){toast('You need 3 energy to discuss their priorities.');return false}
  if(outcome.status==='unavailable')return false;
  queueSave?.();
  const current=globalThis.V102_activeNegotiation?.terms||V102_terms(id);
  V102_renderNegotiation(id,current);
  return true
 }catch(err){toast(err.message);return false}
}
function V102_useCounter(id){
 if(!labelActive()||!s.labelBusiness?.company)return false;
 const n=V100_rosterNegotiation(id),offer=n?.lastCounter;
 if(!offer||n.status!=='active')return false;
 // Applying a counteroffer edits only the form. It does not sign, spend, or
 // consume another negotiation round until the player presents it.
 return V102_renderNegotiation(id,{...offer})
}
function V102_submitRosterOffer(e,id){
 e.preventDefault();
 if(!labelActive()||!s.labelBusiness?.company)return false;
 try{
  const t=readRosterTerms(e.target),a=s.world?.[id];
  if(!a)return false;
  globalThis.V102_activeNegotiation={artist:id,terms:{...t}};
  if(pendingRosterOffer?.artist===id)pendingRosterOffer=null;
  const result=ENCORE_ROSTER_NEGOTIATION.present(s,id,t,{rng:Math.random});
  queueSave?.();
  if(result.status==='walked'){
   V102_closeNegotiation();render();toast(a.name+' ended negotiations. Trust will take time to rebuild.');return false
  }
  if(result.status==='accepted'){
   pendingRosterOffer={...result.terms,artist:Number(id),buyout:npcBuyout(id)};
   const shell=document.querySelector?.('#v102-negotiation-shell');
   if(shell)shell.classList.add('negotiation-to-contract');
   setTimeout(()=>{V102_clearNegotiationState();shell?.remove?.();V101_openRosterContract()},260);
   return true
  }
  V102_renderNegotiation(id,t);
  return false
 }catch(err){toast(err.message);return false}
}
/* Replace the old modal entry point. All existing Start Negotiations buttons call rosterOfferForm. */
rosterOfferForm=V102_openRosterNegotiation;
V100_rosterOfferForm=V102_openRosterNegotiation;
