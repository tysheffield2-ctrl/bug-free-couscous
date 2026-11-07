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
 V101_wireSignaturePad();
 return true;
}

function V144_execute(){
 const spec=globalThis.V144_activeAgreement;
 if(!spec||spec.busy)return false;
 if(!V101_signatureHasInk()){toast?.('Draw a signature with your finger or stylus before signing.');return false}
 spec.busy=true;
 const evidence=V144_evidence(spec.signer),before=V144_state().agreements.length;
 let completed=false;
 try{completed=typeof spec.execute==='function'&&spec.execute({signature:evidence})!==false}catch(err){spec.busy=false;toast?.('Contract execution could not be completed.');return false}
 if(completed){
  if(V144_state().agreements.length===before)V144_record(spec,evidence);
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
 return V144_state().agreements.find(x=>x.kind===kind&&String(x.reference?.id)===String(id))||null;
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
 const html=V144_legalPageBase(),agreements=V144_state().agreements;if(!agreements.length)return html;
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
 for(const a of V144_state().agreements){
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
