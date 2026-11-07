/* ENCORE Single Signature Contract Engine — presentation limited to contracts. */

function V144_state(){
 if(!s.v144||typeof s.v144!=='object')s.v144={next:1,agreements:[]};
 if(!Array.isArray(s.v144.agreements))s.v144.agreements=[];
 s.v144.next=Math.max(1,Number(s.v144.next)||1);
 return s.v144;
}

function V144_evidence(signer){
 return {kind:'drawn',format:'normalized-strokes-v1',signer:String(signer||s.name||'Artist'),week:s.week,strokes:V101_signaturePayload()};
}

function V144_record(spec,evidence){
 const state=V144_state(),reference=spec.reference||null;
 const entry={id:'enc-contract-'+state.next++,week:s.week,kind:String(spec.kind||'agreement'),counterparty:String(spec.counterparty||'Counterparty'),signer:String(spec.signer||s.name||'Artist'),title:String(spec.documentTitle||'Agreement'),amount:cents(Math.max(0,Number(spec.amount)||0)),payer:spec.payer||'none',payee:spec.payee||'none',basis:spec.basis||'contracted services',reference,obligations:Array.isArray(spec.obligations)?spec.obligations.map(x=>({...x})):[],signature:evidence,counterpartyAcceptance:'confirmed by simulated execution',status:'signed',breaches:[],caseIds:[],history:[{week:s.week,kind:'signed',detail:'Agreement executed with drawn signature'}]};
 state.agreements.unshift(entry);
 V144_bindRecordedAgreement(entry);
 if(state.agreements.length>120)state.agreements.length=120;
 V118_event?.('contract-signed','Contract signed: '+entry.title,entry.counterparty,{agreementId:entry.id,playerInvolved:true});
 queueSave?.();
 return entry;
}

function V144_close(){
 const shell=document.querySelector?.('#v144-contract-shell');
 shell?.remove?.();
 document.documentElement?.classList?.remove?.('contract-reading');
 document.body?.classList?.remove?.('contract-reading');
 V101_signatureObserver?.disconnect?.();
 V101_signatureObserver=null;V101_signaturePointer=null;V101_signatureStrokes=[];
 globalThis.V144_activeAgreement=null;
}

function V144_mount(spec){
 if(typeof document==='undefined'||!document.body?.appendChild||!spec)return false;
 const pages=Array.isArray(spec.pages)&&spec.pages.length?spec.pages:[{title:'Agreement',body:'Review the terms.'}],signer=String(spec.signer||s.name||'Artist');
 document.querySelector?.('#v144-contract-shell')?.remove?.();
 document.querySelector?.('#v108-contract-shell')?.remove?.();
 document.querySelector?.('#v101-contract-shell')?.remove?.();
 try{$('modal')?.close?.()}catch{}
 V101_signatureObserver?.disconnect?.();V101_signatureObserver=null;V101_signaturePointer=null;V101_signatureStrokes=[];
 globalThis.V144_activeAgreement={...spec,busy:false};
 document.documentElement?.classList?.add?.('contract-reading');document.body?.classList?.add?.('contract-reading');
 const shell=document.createElement('section');shell.id='v144-contract-shell';shell.className='contract-reading-room contract-entered v144-contract-room';
 const terms=pages.map((p,i)=>'<section class="v144-clause"><small>SECTION '+String(i+1).padStart(2,'0')+'</small><h3>'+esc(String(p.title||'Term').replace(/^\d+\s*·\s*/,''))+'</h3><p>'+esc(p.body||'')+'</p>'+(p.rows?.length?V108_contractRows(p.rows):'')+(p.note?'<p class="v144-material">'+esc(p.note)+'</p>':'')+'</section>').join('');
 shell.innerHTML='<div class="contract-room-ambient"></div><div class="contract-room"><header class="contract-room-header"><div><span class="contract-room-kicker">SINGLE CONTRACT REVIEW</span><h1>'+esc(spec.counterparty||'Agreement')+'</h1><p>'+esc(spec.documentTitle||'Professional services agreement')+'</p></div><button class="contract-room-close" onclick="V144_close()" aria-label="Close contract without signing" type="button"><span>×</span><small>DO NOT SIGN</small></button></header><main class="paper-contract-viewer"><div class="contract-folder-intro"><span>ENC</span><div><small>CONTRACT NUMBER</small><strong>Week '+s.week+' · '+esc(spec.kind||'agreement')+'</strong></div><em>UNSIGNED</em></div><article class="legal-sheet v144-sheet"><header class="legal-letterhead"><div class="legal-seal">ENC</div><div><strong>'+esc(spec.counterparty||'Counterparty')+'</strong><small>'+esc(String(spec.documentTitle||'Agreement').toUpperCase())+'</small></div></header><div class="legal-rule"></div><h2>Review &amp; execute</h2><p class="legal-recital">This agreement documents the obligations between <b>'+esc(signer)+'</b> and <b>'+esc(spec.counterparty||'Counterparty')+'</b>. Any material breach may be disputed through Legal Affairs, with outcomes based on evidence and the simulated legal process.</p>'+(spec.summaryHtml?'<section class="v144-summary"><h3>'+esc(spec.summaryTitle||'Key financial terms')+'</h3>'+spec.summaryHtml+'</section>':'')+terms+(spec.executionNote?'<div class="legal-material-box"><b>EXECUTION TERMS</b><p>'+esc(spec.executionNote)+'</p></div>':'')+'</article><section class="legal-execution-form v144-execute"><span class="eyebrow">ONE SIGNATURE · NO TYPING</span><h3>Sign this agreement</h3><p>Review the terms above. Your single handwritten signature accepts this complete agreement; no typed name, initials, or separate checkboxes are required.</p>'+V101_signaturePadMarkup(signer)+'<button type="button" id="v144-execute" class="primary" onclick="V144_execute()">Sign &amp; execute agreement</button><button type="button" class="secondary" onclick="V144_close()">Not now</button><p class="fine">Execution is irreversible when the underlying deal succeeds. Signing records the negotiated financial obligations and a compact signature with your saved career.</p></section></main></div>';
 document.body.appendChild(shell);
 const pad=$('v101-signature-pad');if(pad?.dataset&&pad?.addEventListener)V101_wireSignaturePad();
 return true;
}

function V144_execute(){
 const spec=globalThis.V144_activeAgreement;
 if(!spec||spec.busy)return false;
 if(!V101_signatureHasInk()){toast?.('Draw a signature with your finger or stylus before signing.');return false}
 spec.busy=true;
 const evidence=V144_evidence(spec.signer),before=s.v144?.agreements?.length||0;
 let completed=false;
 try{completed=typeof spec.execute==='function'&&spec.execute({signature:evidence})!==false}catch(err){spec.busy=false;toast?.('Contract execution could not be completed.');return false}
 if(completed){
  if((s.v144?.agreements?.length||0)===before)V144_record(spec,evidence);
  V144_close();render?.();return true
 }
 spec.busy=false;
 V144_close();
 return false;
}

function V144_standard(spec){return V144_mount({...spec,reference:spec.reference||null})}

function V144_labelRoom({id,label,terms,artistName=s.name,mode='artist',buyout=0}){
 const roster=mode==='roster';
 globalThis.V101_activeContract={id,label,terms,artistName,mode,buyout};
 const p=V101_contractPagesForArtist(terms,label,artistName).map(([title,body])=>({title,body}));
 const summary=roster?profileRows([['Advance',money(terms.advance||0)],['Buyout',money(buyout)],['Company share',(Number(terms.share||0)*100).toFixed(1)+'%'],['Term',terms.weeks+' weeks']]):V100_contractRightsSummary(terms)+V100_attorneyPanel(terms);
 return V144_mount({kind:roster?'roster':'recording',counterparty:label,signer:roster?s.name:artistName,documentTitle:roster?'Artist recording agreement':'Recording & entertainment agreement',summaryTitle:'Financial & ownership terms',summaryHtml:summary,pages:p,amount:Number(terms.advance)||0,payer:roster?'player':'counterparty',payee:roster?'counterparty':'player',basis:'recording and licensing obligations',reference:{type:roster?'roster':'label-offer',id:String(id)},obligations:[{type:'advance',amount:Number(terms.advance)||0,due:'at execution'}],execute:()=>{
  if(roster){
   if(!pendingRosterOffer||pendingRosterOffer.artist!==terms.artist)return false;
   const before=ownerContracts().length;
   confirmRosterOffer();
   return ownerContracts().length>before;
  }
  return V101_commitContractExecution(id,'');
 }});
}

function V144_findAgreement(kind,id){
 return s.v144?.agreements?.find(x=>x.kind===kind&&String(x.reference?.id)===String(id))||null;
}

const V144_contractRoomBase=V108_mountStandardContract;

V108_mountStandardContract=V144_standard;

const V144_labelRoomBase=V101_mountContractRoom;

V101_mountContractRoom=V144_labelRoom;

function V144_quickFeature(id,mode){
 const a=s.world?.[id],track=s.draft,t=a&&V092_outgoingFeatureTerms(a)?.[mode];
 if(!a||!track||!t||!V125_featureSlotAvailable(id)||!V092_featureSplitFits(track,t.rate))return false;
 return V144_mount({kind:'outgoing-feature',counterparty:a.name,documentTitle:'Guest Recording & Royalty Agreement',summaryTitle:'Feature offer',summaryHtml:profileRows([['Guest artist',a.name],['Upfront fee',money(t.upfront)],['Master royalties',(t.rate*100).toFixed(1)+'%'],['Offer acceptance',Math.round(t.chance*100)+'% (not guaranteed)']]),pages:[
 {title:'Performance & master',body:a.name+' agrees to appear on “'+track.title+'” if the proposal is accepted. The master credit is attached to this recording only.'},
 {title:'Compensation',body:'An upfront payment of '+money(t.upfront)+' is due only if the guest accepts. They earn '+(t.rate*100).toFixed(1)+'% of this master’s simulated artist royalties after release.'},
 {title:'Obligations & disputes',body:'Player must honor the fee, royalties and agreed credit. Unauthorized use, withheld agreed payments, or false credit can form a documented legal claim.'}
 ],amount:t.upfront,payer:'player',payee:'counterparty',basis:(t.rate*100).toFixed(1)+'% master royalty + upfront fee',reference:{type:'feature',id:String(track.id||'draft')+':'+id},obligations:[{type:'upfront',amount:t.upfront,due:'when guest accepts'},{type:'master-royalty',rate:t.rate,due:'weekly after release'}],execute:()=>V144_quickFeatureOriginal(id,mode)===true});
}

function V144_customFeature(id,terms=null){
 if(terms)return V144_customFeatureOriginal(id,terms);
 const a=s.world?.[id],track=s.draft;if(!a||!track||!V125_featureSlotAvailable(id))return false;
 const offer={fee:$('v125-feature-fee')?.value,share:$('v125-feature-share')?.value,credited:!!$('v125-feature-credit')?.checked},fee=Number(offer.fee),rate=Number(offer.share)/100;
 if(offer.fee==null||String(offer.fee).trim()===''||!Number.isSafeInteger(fee)||fee<0||!V092_featureSplitFits(track,rate)){
  toast?.('Review the feature fee and available royalty shares before signing.');return false
 }
 return V144_mount({kind:'outgoing-feature',counterparty:a.name,documentTitle:'Custom Feature Agreement',summaryHtml:profileRows([['Upfront payment',money(fee)],['Master royalty',(rate*100).toFixed(1)+'%'],['Release credit',offer.credited?'Required':'Not required']]),pages:[
 {title:'Recording use',body:'The offer applies to “'+track.title+'” only, including the agreed feature appearance and credit status.'},
 {title:'Payment & royalty rights',body:'The upfront payment is '+money(fee)+'. After release, master royalties are '+(rate*100).toFixed(1)+'%. Payment is due only upon acceptance.'},
 {title:'Breach & enforcement',body:'Approved payment, usage and credit clauses remain enforceable in the simulation. A rejected offer is not an executed agreement.'}
 ],amount:fee,payer:'player',payee:'counterparty',basis:offer.share+'% master royalty',reference:{type:'feature',id:String(track.id||'draft')+':'+id},obligations:[{type:'upfront',amount:fee,due:'on acceptance'},{type:'master-royalty',rate,due:'weekly after release'}],execute:()=>V144_customFeatureOriginal(id,offer)===true});
}

function V144_creditOffer(role,id,terms=null){
 if(terms)return V144_creditOfferOriginal(role,id,terms);
 const a=s.world?.[id],spec=V125_ROLES[role];if(!a||!spec)return false;
 const offer={fee:$('v125-credit-fee')?.value,share:$('v125-credit-share')?.value,credited:!!$('v125-credit-name')?.checked},fee=Number(offer.fee),share=Number(offer.share);
 if(offer.fee==null||String(offer.fee).trim()===''||offer.share==null||String(offer.share).trim()===''||!V125_creditOfferAllowed(role,id,fee,share)){
  toast?.('This composition or production agreement does not fit the available rights or payment terms.');return false
 }
 const song=V125_idea().title||s.draft?.title||'Untitled master',pool=role==='producer'?'master':'composition';
 return V144_mount({kind:'studio-contributor',counterparty:a.name,documentTitle:spec.name+' Contribution Agreement',summaryTitle:'Contributor terms',summaryHtml:profileRows([['Contribution',spec.name],['Upfront fee',money(fee)],['Rights pool',pool],['Royalty share',share.toFixed(1)+'%'],['Credit on release',offer.credited?'Yes':'No']]),pages:[
 {title:'Services',body:a.name+' is offered a '+spec.name.toLowerCase()+' contribution to “'+song+'”. Actual contribution is subject to artist acceptance.'},
 {title:'Fee and rights',body:'Fee of '+money(fee)+' is payable when the music session begins. The agreed '+share.toFixed(1)+'% share applies to the '+pool+' pool only, not both pools.'},
 {title:'Performance & rights enforcement',body:'No contract exists if the other party declines. Failure to credit, unauthorized reuse or withholding agreed compensation can support a civil dispute.'}
 ],amount:fee,payer:'player',payee:'counterparty',basis:share+'% '+pool+' rights',reference:{type:'studio-credit',id:role+':'+id+':'+s.week},obligations:[{type:'contribution',role,due:'at recording'},{type:'fee',amount:fee,due:'when recording begins'},{type:'royalty',pool,rate:share/100,due:'weekly after release'}],execute:()=>V144_creditOfferOriginal(role,id,offer)===true});
}

function V144_incomingFeature(id,mode){
 migrateV092();
 const o=s.v081?.creative?.offers?.find(x=>x.id===id&&x.status==='open'),a=o&&s.world?.[o.artist];
 if(!o||!a||!['cash','hybrid','royalty'].includes(mode))return false;
 const ask=s.v092.feature.price,budget=o.artistBudget??Math.max(100,baseFee(a)),offer=clamp(o.royaltyOffer||.08,.02,.2);
 const fee=mode==='cash'?Math.min(ask,budget):mode==='hybrid'?Math.min(budget,Math.round(ask*.35)):0;
 const rate=mode==='cash'?0:mode==='hybrid'?clamp(offer*.6,.02,.12):offer;
 if(mode==='cash'&&budget<ask){toast?.('The artist cannot cover your cash quote.');return false}
 return V144_mount({kind:'incoming-feature',counterparty:a.name,documentTitle:'Guest Artist Appearance Agreement',summaryHtml:profileRows([['You receive at signing',money(fee)],['Artist royalty share',(rate*100).toFixed(1)+'%'],['Maximum royalty term','26 weeks']]),pages:[
 {title:'Guest performance',body:'You will be credited on a new recording released by '+a.name+'. The appearance occurs when both sides sign.'},
 {title:'Payment and royalties',body:a.name+' owes the agreed '+money(fee)+' upfront, and '+(rate*100).toFixed(1)+'% royalties from this song for up to 26 simulated weeks.'},
 {title:'Enforcement',body:'Late, missing or incorrect payments may support a claim in Legal Affairs. Misrepresentation or failure to perform may create liability for the guest.'}
 ],amount:fee,payer:'counterparty',payee:'player',basis:rate+' master royalty',reference:{type:'incoming-feature',id:String(id)},obligations:[{type:'upfront',amount:fee,due:'on execution'},{type:'royalty',rate,due:'following 26 weeks'}],execute:()=>{
  const before=o.status;V144_incomingFeatureOriginal(id,mode);
  return before==='open'&&o.status==='accepted'
 }});
}

function V144_opportunity(id,confirmed=false){
 const o=s.expansion?.opportunities?.find(x=>x.id===id&&!x.done&&x.expires>=s.week);
 if(!o)return false;
 if(confirmed)return V144_opportunityOriginal(id,true);
 return V144_mount({kind:'appearance',counterparty:o.name,documentTitle:o.type+' Paid Engagement',summaryHtml:profileRows([['Guaranteed fee',money(o.fee)],['Energy cost','15'],['Engagement',o.type]]),pages:[
 {title:'Performance',body:'The artist agrees to complete the '+o.type.toLowerCase()+' engagement with '+o.name+' when this agreement is signed.'},
 {title:'Payment',body:o.name+' owes '+money(o.fee)+' on successful completion. The fee is settled through the existing career income ledger.'},
 {title:'Breach & consequences',body:'A failure to perform, a cancelled engagement or a withheld agreed fee may become a legal claim with evidence and deadlines.'}
 ],amount:o.fee,payer:'counterparty',payee:'player',basis:'paid appearance',reference:{type:'appearance',id:String(o.id)},obligations:[{type:'performance',due:'on execution'},{type:'fee',amount:o.fee,due:'on performance completion'}],execute:()=>{
  const wasDone=!!o.done;V144_opportunityOriginal(id,true);return !wasDone&&!!o.done
 }});
}

function V144_bindRecordedAgreement(entry){
 const ref=entry.reference;
 if(ref?.type==='brand'){
  const c=s.v080?.commercial?.contracts?.find(x=>String(x.id)===String(ref.id));
  if(c)c.agreementId=entry.id;
 }else if(ref?.type==='feature'){
  const guestId=Number(String(ref.id).split(':').at(-1));
  const g=guestList(s.draft).find(x=>Number(x.id)===guestId&&!x.agreementId);
  if(g)g.agreementId=entry.id;
 }else if(ref?.type==='studio-credit'){
  const [role,id]=String(ref.id).split(':');
  const x=V125_idea().credits.find(y=>y.role===role&&Number(y.id)===Number(id)&&!y.agreementId);
  if(x)x.agreementId=entry.id;
 }
}

const V144_quickFeatureOriginal=V092_bookFeatureDeal;
V092_bookFeatureDeal=V144_quickFeature;
const V144_customFeatureOriginal=V125_offerFeature;
V125_offerFeature=V144_customFeature;
const V144_creditOfferOriginal=V125_sendCreditOffer;
V125_sendCreditOffer=V144_creditOffer;
const V144_incomingFeatureOriginal=V092_acceptIncomingFeature;
V092_acceptIncomingFeature=V144_incomingFeature;
const V144_opportunityOriginal=acceptOpportunity;
acceptOpportunity=V144_opportunity;

function V144_markBreach(agreementId,against,reason,amount){
 const a=V144_state().agreements.find(x=>x.id===agreementId);
 if(!a||!['player','counterparty'].includes(against)||a.breaches.some(b=>b.against===against&&b.status==='open'))return false;
 const b={id:'breach-'+a.id+'-'+(a.breaches.length+1),week:s.week,against,reason:String(reason||'Contract obligation was not fulfilled'),amount:cents(Math.max(0,Number(amount)||0)),status:'open',caseId:null};
 a.breaches.push(b);a.history.unshift({week:s.week,kind:'breach',detail:b.reason});
 V118_event?.('contract-breach','Contract breach: '+a.title,b.reason,{agreementId:a.id,playerInvolved:true});
 addBriefing?.('breach:'+b.id,'Legal',against==='player'?'Contract payment at risk':'Counterparty missed a contractual obligation',a.counterparty+' · '+b.reason);
 queueSave?.();return b
}

function V144_fileClaim(agreementId){
 const a=V144_state().agreements.find(x=>x.id===agreementId),b=a?.breaches.find(x=>x.against==='counterparty'&&x.status==='open'&&!x.caseId);
 if(!a||!b||V118_openCases().length>=4)return false;
 const c=V118_fileCase({title:String(s.name||'Artist')+' v. '+a.counterparty,issue:b.reason,plaintiff:String(s.name||'Artist'),defendant:a.counterparty,claim:cents(Math.max(1000,b.amount)),agreementId:a.id,clauses:['Payment','Performance','Contract enforcement'],strength:72,category:'Contract',matterType:'breach',triggerDetail:'Signed Week '+a.week+' · '+b.reason,generatedBy:'signed-contract'});
 if(!c)return false;
 c.playerPlaintiff=true;c.stage='PLAINTIFF CLAIM';c.deadlineWeek=s.week+6;c.playerEvidence=a.signature?80:50;
 c.history.unshift({week:s.week,text:'Player filed a claim supported by the signed agreement and recorded breach.'});
 b.caseId=c.id;a.caseIds.push(c.id);queueSave?.();render?.();return true
}

function V144_playerLegalAction(id,action){
 const c=V118_legalCases().find(x=>x.id===id&&x.status==='open'&&x.playerPlaintiff);
 if(!c)return V144_caseActionBase(id,action);
 if(action==='pursue'&&c.stage==='PLAINTIFF CLAIM'){
  const fee=cents(clamp(c.claim*.025,250,25000));
  if(!spend(10,fee))return false;
  c.stage='EVIDENCE FILED';c.reviewWeek=s.week+3;
  c.history.unshift({week:s.week,text:'Player submitted evidence and paid '+money(fee)+' in legal costs.'});
  queueSave?.();V118_openDocketCase(id);return true
 }
 if(action==='settle'){
  const amount=V118_caseSettlement(c);
  changeCash(amount);recordIncome('other',amount);moneyEvent?.('Contract claim settlement',amount);
  V118_closeCase(c,'Counterparty settled claim',0,1);queueSave?.();render?.();return true
 }
 return false
}

function V144_playerLegalWeek(completed=s.week){
 for(const c of V118_openCases().filter(x=>x.playerPlaintiff)){
  if(c.stage==='PLAINTIFF CLAIM'&&completed>=c.deadlineWeek){
   V118_closeCase(c,'Claim withdrawn after missed filing deadline',0,0);continue
  }
  if(c.stage!=='EVIDENCE FILED'||completed<c.reviewWeek)continue;
  const chance=clamp(.35+(c.plaintiffStrength||55)/250+(c.playerEvidence||50)/500+((c.attorneySkill||0)/100)*.09,.28,.91);
  const roll=typeof V124_roll==='function'?V124_roll('plaintiff:'+c.id):Math.random();
  if(roll<chance){
   const award=cents(c.claim*clamp(.65+(c.plaintiffStrength||55)/350,.55,1));
   changeCash(award);recordIncome('other',award);moneyEvent?.('Contract claim award',award);
   V118_closeCase(c,'Plaintiff prevailed; award collected',0,1)
  }else V118_closeCase(c,'Counterparty defended claim successfully',0,-1)
 }
}


function V144_openLegalCase(id){
 const c=V118_legalCases().find(x=>x.id===id);
 if(!c?.playerPlaintiff)return V144_openLegalCaseBase(id);
 const fee=cents(clamp(c.claim*.025,250,25000));
 const history=c.history.map(x=>`<p><b>Week ${x.week}</b> · ${esc(x.text)}</p>`).join('');
 const actions=c.status==='open'?`<div class="v118-request-actions">${c.stage==='PLAINTIFF CLAIM'?`<button class="primary" onclick="V118_caseAction('${c.id}','pursue')">Pursue claim · ${money(fee)} + 10 energy</button>`:''}<button class="secondary" onclick="V118_caseAction('${c.id}','settle')">Accept settlement · ${money(V118_caseSettlement(c))}</button></div>`:'';
 modal(`<article class="v118-docket-paper"><header><span>ENCORE CONTRACT CLAIM</span><b>${esc(c.number)}</b></header><div class="v118-docket-stamp">${esc(c.stage)}</div><h2>${esc(c.title)}</h2>${profileRows([['Your role','Plaintiff'],['Claim against',c.defendant],['Claim amount',money(c.claim)],['Signed agreement',c.agreementId||'None'],['Filing deadline','Week '+c.deadlineWeek],['Outcome',c.outcome||'Pending']])}<section class="v118-case-history"><h3>Claim history</h3>${history}</section>${actions}<p class="fine">This is your claim against the counterparty. Winning pays damages; losing may still cost the legal fees you spent pursuing it.</p></article>`);
 return true
}

function V144_openAgreement(id){
 const a=V144_state().agreements.find(x=>x.id===id);if(!a)return false;
 const b=a.breaches||[],claim=b.find(x=>x.against==='counterparty'&&x.status==='open'&&!x.caseId);
 const obligations=(a.obligations||[]).map(x=>`<p>${esc(x.type||'Obligation')} · ${esc(String(x.due||''))}${x.amount?' · '+money(x.amount):''}${x.rate?' · '+(x.rate*100).toFixed(1)+'%':''}</p>`).join('');
 const breaches=b.map(x=>`<p>${esc(x.reason)} · ${money(x.amount)}${x.caseId?' · legal case filed':' · unresolved'}</p>`).join('')||'<p>No recorded contractual breach.</p>';
 const file=claim?`<button class="primary" onclick="V144_fileClaim('${a.id}')">Sue for documented breach</button>`:'';
 const sandbox=s.sandbox?`<p class="fine">Sandbox legal testing</p><button class="secondary" onclick="V144_markBreach('${a.id}','counterparty','Missed contractual payment (sandbox)',${Math.max(1000,a.amount)})">Simulate missed payment</button>`:'';
 modal(`<span class="eyebrow">EXECUTED AGREEMENT · WEEK ${a.week}</span><h2>${esc(a.title)}</h2>${profileRows([['Counterparty',a.counterparty],['Signing artist',a.signer],['Agreement ID',a.id],['Type',a.kind],['Upfront amount',money(a.amount)],['Payment basis',a.basis],['Signature',a.signature?.kind==='drawn'?'Drawn proof stored':'Imported / historical']])}<h3>Contract obligations</h3>${obligations}<h3>Breach record</h3>${breaches}${file}${sandbox}<p class="fine">${a.caseIds?.length||0} linked legal matter(s). Filing does not guarantee a favorable outcome.</p>`);
 return true
}

function V144_legalPage(){
 const html=V144_legalPageBase(),agreements=s.v144?.agreements||[];if(!agreements.length)return html;
 const rows=agreements.slice(0,30).map(a=>{
  const breached=a.breaches.some(x=>x.status==='open');
  return `<button class="v118-docket-card" onclick="V144_openAgreement('${a.id}')"><span><small>${esc(a.kind.toUpperCase())} · WEEK ${a.week}</small><strong>${esc(a.title)}</strong><em>${esc(a.counterparty)} · ${breached?'Breach on record':'Executed'}</em></span><b>VIEW →</b></button>`
 }).join('');
 return html+`<section class="card"><span class="eyebrow">EXECUTED AGREEMENTS</span><h2>Contract register</h2><p>Signed terms and documented breaches live here. Open an agreement to review obligations or file a supported claim.</p>${rows}</section>`;
}

function V144_brandSettlement(){
 migrateV080();
 const contracts=s.v080?.commercial?.contracts||[],skipped=[];
 for(const c of contracts){
  const a=V144_findAgreement('commercial',c.id),due=c.remaining/Math.max(1,(c.durationMonths||120)-(c.monthsPaid||0));
  if(!c.active||!a||due<=0||a.breaches.some(b=>b.against==='counterparty'&&b.status==='open'))continue;
  const chance=s.sandbox?.12:.025;
  const roll=typeof V124_roll==='function'?V124_roll('commercial-default:'+c.id+':'+(s.empire?.month||0)):Math.random();
  if(roll>=chance)continue;
  c.active=false;skipped.push({c,a,due:cents(due)});
 }
 let result;
 try{result=V144_brandSettlementBase()}finally{
  for(const {c,a,due} of skipped){
   c.active=true;
   V144_markBreach(a.id,'counterparty','Guaranteed commercial installment was not paid when due',due)
  }
 }
 return result
}

function V144_closeFinances(royalties,rate){
 const report=V144_financesBase(royalties,rate);
 if(Number(s.cash)<0&&Number(report?.featureRoyalty)>0){
  const a=V144_state().agreements.find(x=>x.kind==='outgoing-feature'&&x.obligations?.some(o=>o.type==='master-royalty'&&o.rate>0)&&!x.breaches.some(b=>b.against==='player'&&b.status==='open'));
  if(a)V144_markBreach(a.id,'player','Insufficient funds to meet contracted guest royalties',Math.min(report.featureRoyalty,Math.abs(s.cash)));
 }
 return report
}

function V144_contractWeek(completed=s.week){
 for(const a of s.v144?.agreements||[]){
  for(const b of a.breaches){
   if(b.against!=='player'||b.caseId||b.status!=='open'||completed-b.week<2||V118_openCases().length>=4)continue;
   const claim=cents(Math.max(1000,b.amount*1.5));
   const c=V118_fileCase({title:a.counterparty+' v. '+(s.labelBusiness?.company?.name||s.name),issue:b.reason,plaintiff:a.counterparty,claim,agreementId:a.id,clauses:['Payment','Royalty breach'],strength:65,matterType:'contract',category:'Contract',triggerDetail:b.reason,generatedBy:'signed-contract'});
   if(c){b.caseId=c.id;a.caseIds.push(c.id);queueSave?.()}
  }
 }
}

const V144_caseActionBase=V118_caseAction;
V118_caseAction=V144_playerLegalAction;
const V144_openLegalCaseBase=V118_openDocketCase;
V118_openDocketCase=V144_openLegalCase;
const V144_legalPageBase=V118_legalAffairsPage;
V118_legalAffairsPage=V144_legalPage;
const V144_advanceLegalBase=V118_advanceLegal;
V118_advanceLegal=function(completed){const result=V144_advanceLegalBase(completed);V144_playerLegalWeek(completed);V144_contractWeek(completed);return result};
const V144_brandSettlementBase=settleCommercialContracts080;
settleCommercialContracts080=V144_brandSettlement;
const V144_financesBase=closeFinances;
closeFinances=V144_closeFinances;

/* ENCORE Label Boss — an expansion of the existing owned-label economy.
 * No parallel NPC roster, music charts, release royalties or independent wallet.
 * Opt-in state is created only on visiting Label Boss or taking a label action. */
const V145_ROLES={
 manager:{name:'Label manager',salary:1500,legacy:true,purpose:'Expands roster capacity and coordinates management'},
 ar:{name:'A&R scout',salary:1000,legacy:true,purpose:'Delivers qualified artist prospects'},
 development:{name:'Artist development coach',salary:1800,purpose:'Develops signed artists and improves musical ability'},
 producer:{name:'Staff producer',salary:2200,purpose:'Records and completes roster masters'},
 marketing:{name:'Marketing team',salary:2500,legacy:true,purpose:'Prepares campaigns and release plans'}
};
const V145_NAMES=['Mara Vale','Jonah Cruz','Iris Mercer','Alden Brooks','Nina Ward','Kellan Reed','Lena Hart','Omar Blake','Casey Moon','Drew Fields','Sage Rowan','Miles Park','Rae Collins','Ari Porter','Tessa Lyon'];
const V145_STAGES={development:{role:'development',weeks:2,next:'recording'},recording:{role:'producer',weeks:2,next:'campaign'},campaign:{role:'marketing',weeks:1,next:'ready'}};
function V145_read(){return s.labelBusiness?.company?.boss||null}
function V145_state(){
 const co=s.labelBusiness?.company;if(!co)return null;
 if(!co.boss||typeof co.boss!=='object')co.boss={version:1,team:{},projects:[],prospects:[],approvals:'manual',nextId:1,lastProgressWeek:0,lastStatementWeek:0,unfundedWeeks:0,statements:[],investments:[],history:[],totalInvested:0};
 const b=co.boss;
 b.team??={};b.projects??=[];b.prospects??=[];b.statements??=[];b.investments??=[];b.history??=[];
 b.approvals=b.approvals==='delegated'?'delegated':'manual';
 return b
}
function V145_note(kind,message){
 const b=V145_state();if(!b)return;
 b.history.unshift({week:s.week,kind,text:String(message)});b.history=b.history.slice(0,50);
}
function V145_staff(role){
 if(!V145_ROLES[role]||!s.labelBusiness?.company)return false;
 return V145_ROLES[role].legacy?!!s.labelBusiness.company.staff?.[role]:!!V145_read()?.team?.[role]
}
function V145_candidate(role,index=0){
 if(!V145_ROLES[role]||!Number.isInteger(index)||index<0||index>2)return null;
 const roleIndex=Object.keys(V145_ROLES).indexOf(role),offset=(s.labelBusiness?.company?.started||1)%V145_NAMES.length;
 return {id:role+'-'+index,name:V145_NAMES[(roleIndex*3+index+offset)%V145_NAMES.length],role,skill:48+index*14,fee:[0,1500,4000][index],salary:V145_ROLES[role].salary};
}
function V145_extras(){const b=V145_read();return b?['development','producer'].reduce((n,k)=>n+(b.team?.[k]?V145_ROLES[k].salary:0),0):0}
function V145_payroll(){return labelPayroll()+V145_extras()}
function V145_reviewHire(role,index=0){
 const c=V145_candidate(role,index),co=s.labelBusiness?.company;
 if(!labelActive()||!co||!c||V145_staff(role))return false;
 return V144_mount({kind:'label-staff',counterparty:c.name,signer:s.name,documentTitle:c.name+' · '+V145_ROLES[role].name+' Employment Agreement',
  summaryTitle:'Compensation and role',summaryHtml:profileRows([['Position',V145_ROLES[role].name],['Skill',c.skill+'/100'],['Signing bonus',money(c.fee)],['Weekly salary',money(c.salary)],['Energy at hiring','5']]),
  pages:[{title:'Duties',body:c.name+' will serve as '+V145_ROLES[role].name+' for '+co.name+'. '+V145_ROLES[role].purpose+'.'},
   {title:'Compensation and working conditions',body:'The player pays a one-time '+money(c.fee)+' signing bonus and '+money(c.salary)+' for each funded active employment week. If total payroll is unavailable, operations pause and no unpaid work is performed. Either party may terminate employment; completed weeks remain recorded.'},
   {title:'Enforcement',body:'Agreed payments, earned compensation, authorized work and proper termination may create civil disputes if breached. This is a simulated contract, not a real employment agreement.'}],
  amount:c.fee,payer:'player',payee:'counterparty',basis:money(c.salary)+'/week conditional payroll',reference:{type:'label-staff',id:c.id},
  obligations:[{type:'hire',amount:c.fee,due:'at execution'},{type:'salary',amount:c.salary,due:'weekly when staff are funded'}],
  execute:()=>{
   const b=V145_state();if(!b||V145_staff(role)||!spend(5,c.fee))return false;
   if(V145_ROLES[role].legacy)co.staff[role]=true;
   b.team[role]={...c,hiredWeek:s.week,morale:80};
   V145_note('hire',c.name+' joined as '+V145_ROLES[role].name);
   queueSave?.();return true
  }})
}
function V145_fire(role){
 const b=V145_read(),co=s.labelBusiness?.company;
 if(!labelActive()||!b||!co||!V145_staff(role)||!V145_ROLES[role])return false;
 if(role==='manager'&&ownerContracts().length>3){toast('An active roster above three requires the label manager.');return false}
 if(!spend(5))return false;
 const person=b.team[role]?.name||V145_ROLES[role].name;
 if(V145_ROLES[role].legacy)co.staff[role]=false;
 const record=b.team[role];delete b.team[role];
 if(record){const signed=s.v144?.agreements?.find(x=>x.kind==='label-staff'&&x.reference?.id===record.id);if(signed){signed.status='terminated';signed.history.unshift({week:s.week,kind:'termination',detail:'Employment ended by the label'})}}
 V145_note('exit',person+' left the label');queueSave?.();render?.();return true
}
function V145_scout(){
 const co=s.labelBusiness?.company,b=V145_read();
 if(!co||!b||!V145_staff('ar')||!co.staffFunded||b.scoutedWeek===s.week)return false;
 const roster=new Set(ownerContracts().map(c=>Number(c.artist)));
 const pool=(s.world||[]).filter(a=>a&&a.aiCareer?.status!=='retired'&&!roster.has(Number(a.id))&&(Number(a.relation)||0)>-40);
 const scoutQuality=Number(b.team?.ar?.skill)||55;
 const reports=pool.map(a=>({artist:a,report:ENCORE_ROSTER_NEGOTIATION.scoutReport(s,a.id,scoutQuality,s.week)}))
  .filter(x=>x.report);
 // Staff act on imperfect estimates. Higher scout skill narrows uncertainty,
 // while fan counts and reputation remain publicly visible.
 const score=x=>x.report.estimated+(Number(x.artist.relation)||0)*.20+
  Math.log10(1+Math.max(0,Number(x.artist.fans)||0))*5;
 reports.sort((a,c)=>score(c)-score(a));
 const offset=Math.floor(s.week/4)%Math.max(1,reports.length);
 const selected=reports.slice(offset,offset+8);
 if(selected.length<8)selected.push(...reports.slice(0,8-selected.length));
 b.prospects=[...new Set(selected.map(x=>Number(x.artist.id)))];
 b.scoutingReports=Object.fromEntries(selected.map(x=>[String(x.artist.id),x.report]));
 b.scoutedWeek=s.week;
 V145_note('scout','A&R submitted '+b.prospects.length+' talent reports ('+Math.round(clamp(34+scoutQuality*.59,34,93))+'% scouting confidence)');
 return true
}
function V145_assignProject(artistId){
 const id=Number(artistId),co=s.labelBusiness?.company,b=V145_read(),c=ownerContracts().find(c=>c.artist===id),a=s.world?.[id];
 if(!labelActive()||!co||!b||!c||!a||a.aiCareer?.status==='retired'||b.projects.some(p=>p.artist===id&&!['released','cancelled'].includes(p.status)))return false;
 const budget=4000;if(!spend(5,budget))return false;
 const p={id:b.nextId++,artist:id,title:generate('song'),stage:'development',progress:0,status:'active',spent:budget,createdWeek:s.week,quality:0,pausedWeeks:0};
 b.projects.unshift(p);b.projects=b.projects.slice(0,48);b.investments.unshift({week:s.week,projectId:p.id,amount:budget});b.investments=b.investments.slice(0,80);b.totalInvested=cents((b.totalInvested||0)+budget);
 V145_note('project','Commissioned '+p.title+' for '+a.name+' at '+money(budget));
 moneyEvent?.('Label studio project · '+a.name,-budget);
 queueSave?.();render?.();return true
}
function V145_release(p,auto=false){
 const co=s.labelBusiness?.company,b=V145_read(),a=s.world?.[p.artist];
 if(!co||!b||p.status!=='ready'||!a||!ownerContracts().some(c=>c.artist===p.artist)||a.aiCareer?.status==='retired')return false;
 if(a.catalog.some(x=>x.week===s.week&&x.labelBossProject))return false;
 const skill=Number(a.skill)||40,quality=clamp(Math.round(p.quality||skill),10,100);
 const factor=clamp(reception(quality),.2,4),base=Math.max(50,Math.round((Number(a.fans)||0)*(.35+quality/200)));
 const streams=Math.max(1,Math.round(base*factor));
 a.nextCatalogId=Math.max(1,Number(a.nextCatalogId)||1);
 const track={uid:a.nextCatalogId++,title:p.title,type:'Single',week:s.week,base,streams,total:streams,factor,labelBossProject:p.id,quality};
 a.catalog.push(track);a.weekly=(Number(a.weekly)||0)+streams;
 a.fans=Math.max(0,Math.round((Number(a.fans)||0)+streams*.009/(1+(Number(a.fans)||0)/250000000)));
 a.nextRelease=Math.max(Number(a.nextRelease)||0,s.week+4);
 s.feed?.unshift({name:a.name,title:track.title,type:'Single',week:s.week,tier:tierNames[tier(a.fans)],streams,result:outcome(factor)});
 p.status='released';p.stage='released';p.releasedWeek=s.week;p.streams=streams;p.quality=quality;
 V145_note('release',a.name+' released '+p.title+' ('+(auto?'delegated':'CEO approval')+')');
 addBriefing?.('label-boss-release:'+p.id,'Business',a.name+' released '+p.title,compact(streams)+' debut streams. Your label share settles through the existing royalty engine.');
 queueSave?.();return true
}
function V145_approve(projectId){
 const p=V145_read()?.projects?.find(x=>x.id===Number(projectId));
 if(!p||p.status!=='ready'||!labelActive())return false;
 const result=V145_release(p,false);if(result)render?.();return result
}
function V145_setApproval(mode){
 const b=V145_state();if(!b||!labelActive()||!['manual','delegated'].includes(mode))return false;
 b.approvals=mode;V145_note('policy','Release approval set to '+mode);
 if(mode==='delegated')for(const p of b.projects.filter(p=>p.status==='ready'))V145_release(p,true);
 queueSave?.();render?.();return true
}
function V145_prepareWeek(){
 const co=s.labelBusiness?.company,b=V145_read();if(!co||!b||co.preparedWeek===s.week)return V145_prepareBase();
 const total=V145_payroll();
 if(s.cash<total){
  co.preparedWeek=s.week;co.staffFunded=false;co.payrollThisWeek=0;b.unfundedWeeks=(b.unfundedWeeks||0)+1;
  V145_note('payroll','Operations paused: '+money(total)+' payroll not funded');
  log('Label Boss staff paused for unfunded weekly payroll.');
  return;
 }
 V145_prepareBase();
 const extra=V145_extras();
 if(extra&&co.staffFunded){
  changeCash(-extra);s.finance.week.expenses=cents((Number(s.finance.week.expenses)||0)+extra);
  s.finance.week.labelPayroll=cents((Number(s.finance.week.labelPayroll)||0)+extra);
  co.payrollThisWeek=cents((Number(co.payrollThisWeek)||0)+extra)
 }
 b.unfundedWeeks=0
}
function V145_advanceProjects(){
 const co=s.labelBusiness?.company,b=V145_read();if(!co||!b||b.lastProgressWeek===s.week)return;
 b.lastProgressWeek=s.week;
 if(co.preparedWeek!==s.week||!co.staffFunded){
  for(const p of b.projects)if(p.status==='active')p.pausedWeeks=(p.pausedWeeks||0)+1;
  return
 }
 if(V145_staff('ar')&&(!b.scoutedWeek||s.week-b.scoutedWeek>=4))V145_scout();
 for(const p of b.projects){
  if(p.status!=='active')continue;
  const c=ownerContracts().find(x=>x.artist===p.artist),a=s.world?.[p.artist];
  if(!c||!a||a.aiCareer?.status==='retired'){p.status='cancelled';p.reason='Artist contract expired or artist unavailable';V145_note('project',p.title+' paused permanently: artist unavailable');continue}
  const stage=V145_STAGES[p.stage];if(!stage)continue;
  if(!V145_staff(stage.role)){p.pausedWeeks=(p.pausedWeeks||0)+1;continue}
  const specialist=b.team[stage.role],speed=1+(specialist?.skill>=76?1:0);
  p.progress+=speed;p.pausedWeeks=0;
  if(p.progress<stage.weeks)continue;
  if(p.stage==='development'){
   a.skill=clamp((Number(a.skill)||40)+Math.max(1,Math.round((specialist?.skill||60)/40)),0,100);
  }else if(p.stage==='recording')p.quality=clamp(Math.round((Number(a.skill)||50)*.7+(specialist?.skill||60)*.3),10,100);
  p.stage=stage.next;p.progress=0;
  V145_note('project',p.title+' progressed to '+p.stage);
  if(p.stage==='ready'){p.status='ready';p.readyWeek=s.week;if(b.approvals==='delegated')V145_release(p,true)}
 }
 if(b.approvals==='delegated')for(const p of b.projects.filter(x=>x.status==='ready'))V145_release(p,true);
}
function V145_finishWeek(){
 const co=s.labelBusiness?.company,b=V145_read();if(!co||!b)return V145_settleBase();
 if(b.lastProgressWeek!==s.week)V145_advanceProjects();
 const result=V145_settleBase();
 if(co.settledWeek===s.week&&b.lastStatementWeek!==s.week){
  b.lastStatementWeek=s.week;
  const production=cents((b.investments||[]).filter(x=>x.week===s.week).reduce((n,x)=>n+x.amount,0));
  const statement={week:s.week,receipts:cents(co.last?.income||0),payroll:cents(co.last?.payroll||0),production,recording:cents(co.last?.recording||0),live:cents(co.last?.other||0)};
  statement.net=cents(statement.receipts-statement.payroll-production);
  b.statements.unshift(statement);b.statements=b.statements.slice(0,52);
 }
 return result
}
const V145_prepareBase=prepareLabelWeek;prepareLabelWeek=V145_prepareWeek;
const V145_settleBase=settleLabelWeek;settleLabelWeek=V145_finishWeek;

/* ENCORE artist intelligence. Loaded from the optional contract/label
 * gameplay asset, not the boot-critical core bundle. Uses the same shared
 * roster-negotiation engine in the browser, save replay and week worker. */
(function(global){
'use strict';
const E=global.ENCORE_ROSTER_NEGOTIATION;
if(!E)throw new Error('Roster negotiation engine must load before artist intelligence');
const clamp=(value,lo=0,hi=100)=>Math.max(lo,Math.min(hi,Number(value)||0));
const artist=(state,id)=>(state?.world||[]).find(a=>Number(a?.id)===Number(id))||null;
const terms=E.terms,ensure=E.ensure,open=E.open,pressure=E.pressure;
const biddingWar=E.biddingWar,buyout=E.buyout,normalizeOffer=E.normalizeOffer;

/* Persistent artist negotiating instincts. Values are derived from immutable
 * fictional roster identity, not current wealth or popularity, so their motives
 * don't change unexpectedly as the industry advances. */
function persona(s,id){
 const a=artist(s,id);if(!a)return null;
 const key=String(a.id)+'|'+String(a.name||'')+'|'+String(a.genre||'');
 let seed=2166136261;
 for(let i=0;i<key.length;i++){seed=Math.imul(seed^key.charCodeAt(i),16777619)>>>0}
 // Avalanche the hash before using low bits. FNV alone over-correlates
 // IDs and alternating genres, hiding entire artist archetypes.
 seed^=seed>>>16;seed=Math.imul(seed,0x7feb352d);
 seed^=seed>>>15;seed=Math.imul(seed,0x846ca68b);seed^=seed>>>16;seed>>>=0;
 const priorities=['advance','ownership','creative control','career reach'];
 const temperaments=['pragmatic','cautious','ambitious','independent'];
 const priority=priorities[seed%priorities.length],temperament=temperaments[(seed>>>5)%temperaments.length];
 const maxShare=priority==='ownership'?.33:priority==='advance'?.60:priority==='creative control'?.44:.51;
 const maxWeeks=priority==='ownership'?52:priority==='creative control'?65:priority==='advance'?104:78;
 return {priority,temperament,maxShare,maxWeeks,dislikes360:priority==='ownership'||priority==='creative control',seed}
}
function scoutReport(s,id,scoutSkill=50,week=s.week){
 const a=artist(s,id),p=persona(s,id);if(!a||!p)return null;
 const quality=clamp(scoutSkill,0,100);
 const confidence=Math.round(clamp(34+quality*.59,34,93));
 const noise=(100-confidence)*.40;
 const phase=((p.seed+Math.floor((Number(week)||0)/4)*67)>>>0)%101/50-1;
 const estimate=Math.round(clamp((Number(a.skill)||40)+phase*noise,0,100));
 const spread=Math.max(3,Math.round((100-confidence)*.42));
 return {artist:Number(id),week:Number(week)||0,confidence,estimated:estimate,
  min:Math.round(clamp(estimate-spread,0,100)),max:Math.round(clamp(estimate+spread,0,100)),
  source:'funded A&R report',uncertainty:confidence>=80?'high':confidence>=60?'moderate':'low'}
}
function artistAssessment(s,id,t,required=terms(s,id,t.type,t.share,t.weeks)){
 const p=persona(s,id);if(!p)return null;
 const premium=p.priority==='advance'?.17:p.priority==='ownership'?.07:p.priority==='creative control'?.05:0;
 const scopePenalty=p.dislikes360&&t.type==='360'?.16:0;
 const minimum=Math.max(required.minimum,Math.ceil(required.minimum*(1+premium+scopePenalty)));
 const shareCeiling=p.maxShare,termCeiling=p.maxWeeks;
 const issues=[];
 if(t.advance<minimum)issues.push('advance');
 if(t.share>shareCeiling+1e-9)issues.push('royalty split');
 if(t.weeks>termCeiling)issues.push('term');
 if(p.dislikes360&&t.type==='360')issues.push('rights scope');
 const revised={...t,advance:Math.max(minimum,Number(t.advance)||0),
  share:Math.min(shareCeiling,Number(t.share)||.1),
  weeks:Math.min(termCeiling,Number(t.weeks)||26),
  type:p.dislikes360&&t.type==='360'?'record':t.type};
 // Counter offers do not change accepted terms without an explicit player action.
 return {priority:p.priority,temperament:p.temperament,minimum,issues,counter:revised}
}
function meet(s,id){
 const a=artist(s,id),n=open(s,id),p=persona(s,id);
 if(!a||!n||!p)return {status:'unavailable'};
 if(n.lastMeetingWeek===Number(s.week))return {status:'already-met',priority:p.priority,temperament:p.temperament,negotiation:n};
 if((Number(s.energy)||0)<3)return {status:'energy'};
 s.energy-=3;n.lastMeetingWeek=Number(s.week);n.revealed=true;
 n.memory??={offers:0,lowballs:0,walkouts:0,meetings:0,trust:0,history:[]};
 n.memory.meetings++;n.memory.trust=clamp((Number(n.memory.trust)||0)+2,-50,50);
 n.memory.history.unshift({week:s.week,type:'meeting',detail:'Discussed priorities and contract expectations'});
 n.memory.history=n.memory.history.slice(0,20);
 n.interest=Math.round(clamp(n.interest+2,0,100));
 n.response=a.name+' prioritizes '+p.priority+'. '+(p.dislikes360?'Broad 360 ownership is a dealbreaker. ':'')+
  (p.priority==='advance'?'Reliable upfront funding matters most.':p.priority==='career reach'?'They value industry connections and a credible release plan.':p.priority==='ownership'?'They want to retain a meaningful share of their rights.':'They care about independence and the duration of control.');
 return {status:'met',priority:p.priority,temperament:p.temperament,negotiation:n}
}

function present(s,id,input,{rng=Math.random}={}){
 const a=artist(s,id),n=open(s,id),t=normalizeOffer(input),r=terms(s,id,t.type,t.share,t.weeks);
 const d=artistAssessment(s,id,t,r),b=biddingWar(s,id,rng),top=b?.offers?.[0];
 n.memory??={offers:0,lowballs:0,walkouts:0,meetings:0,trust:0,history:[]};
 n.memory.offers++;n.memory.lastOffer={...t};n.memory.lastOfferWeek=Number(s.week);
 n.acceptedOffer=null;
 if(top){
  const gap=(Number(top.advance)-t.advance)/Math.max(1,Number(top.advance));
  if(gap>.15){
   n.interest=Math.round(clamp(n.interest-Math.min(12,gap*18),0,100));
   n.response='A rival currently offers a stronger financial package.';
  }else if(t.advance>=Number(top.advance)){
   n.interest=Math.round(clamp(n.interest+6,0,100));n.leverage=Math.round(clamp(n.leverage+3,0,100))
  }
 }
 if((Number(a.relation)||0)<=-40||(Number(s.reputation)||0)<r.reputation){
  n.interest=Math.round(clamp(n.interest-8,0,100));
  n.response='The artist will not sign with your current relationship or company reputation.';
  return {status:'blocked',terms:t,required:r,assessment:d,negotiation:n,bidding:b}
 }
 const p=pressure(s,id,t,r,n);
 const insulting=t.advance<d.minimum*.45||t.share>Math.min(.9,d.counter.share+.22)||
  (d.issues.includes('rights scope')&&t.weeks>78);
 const trust=Number(n.memory.trust)||0;
 n.patience=Math.round(clamp(n.patience-p-(insulting?7:0)+Math.max(-3,Math.min(3,trust*.1)),0,100));
 n.rounds=(Number(n.rounds)||0)+1;
 const value=t.advance/Math.max(1,d.minimum);
 const appeal=(value-1)*24+(1-t.share)*8+(t.type==='distribution'?4:t.type==='360'?-5:0)+
  (d.priority==='career reach'?(Number(s.reputation)||0)*.045:0)+Math.max(-4,Math.min(4,trust*.2));
 n.interest=Math.round(clamp(n.interest+appeal-p*.35-(insulting?6:0),0,100));
 if(insulting){
  n.memory.lowballs++;n.memory.trust=clamp(trust-4,-50,50);
  a.relation=clamp((Number(a.relation)||0)-1,-100,100);
 }
 n.memory.history.unshift({week:s.week,type:insulting?'lowball':'proposal',
  detail:insulting?'Offer treated as exploitative':'Received formal offer',share:t.share,advance:t.advance,weeks:t.weeks});
 n.memory.history=n.memory.history.slice(0,20);
 if(n.patience<=4||n.interest<=7){
  n.status='walked';n.walkedUntil=Number(s.week)+8+
   (n.memory.lowballs>1?Math.min(8,n.memory.lowballs*2):0);
  n.memory.walkouts++;n.memory.trust=clamp((Number(n.memory.trust)||0)-6,-50,50);
  a.relation=clamp((Number(a.relation)||0)-2,-100,100);
  n.response='Talks ended. Repeated low offers damaged trust. The artist will not reopen until Week '+n.walkedUntil+'.';
  return {status:'walked',terms:t,required:r,assessment:d,negotiation:n,bidding:b}
 }
 if(d.issues.length||n.interest<34){
  const ask=Math.max(d.minimum,Math.round(d.minimum*(1+Math.max(0,34-n.interest)*.008)));
  const proposed={...d.counter,advance:Math.max(d.counter.advance,ask)};
  n.lastCounter=proposed;
  const reason=d.issues.length?d.issues.join(', '):'mutual confidence';
  const disclosure=n.revealed?'They value '+d.priority+'. ':'';
  n.response=disclosure+'Their counter addresses '+reason+': $'+proposed.advance.toLocaleString('en-US')+
   ' advance, '+Math.round(proposed.share*100)+'% company share, '+proposed.weeks+
   ' weeks, '+proposed.type+' rights. Patience '+n.patience+'/100.';
  return {status:'counter',counter:proposed,ask:proposed.advance,terms:t,required:r,assessment:d,negotiation:n,bidding:b}
 }
 n.lastCounter=null;n.acceptedOffer={...t};n.memory.trust=clamp((Number(n.memory.trust)||0)+2,-50,50);
 n.response='The artist accepted these business terms. Legal may prepare the signed agreement.';
 return {status:'accepted',terms:{...t,artist:Number(id),buyout:buyout(s,id)},required:r,assessment:d,negotiation:n,bidding:b}
}
Object.assign(E,{persona,scoutReport,artistAssessment,meet,present});
})(globalThis);
