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
