/* ENCORE 0.9.21 — Credits, splits and rights-chain studio pass.
   Songwriting/composition/production contributors now have explicit terms,
   accepted agreements, visible credits and consequences when a release uses
   work without clearance. Feature negotiations gain the same manual controls. */
const V125_ROLES={
 writer:{name:'Songwriter',lane:'Composition',max:100,defaultShare:20,feeFactor:.08},
 composer:{name:'Composer',lane:'Composition',max:100,defaultShare:15,feeFactor:.08},
 producer:{name:'Producer',lane:'Master',max:25,defaultShare:4,feeFactor:.22}
};
function V125_idea(){
 s.studioIdea=ensureStudioIdeaSchema();
 if(!Array.isArray(s.studioIdea.credits))s.studioIdea.credits=[];
 return s.studioIdea
}
function V125_credits(track){return Array.isArray(track?.credits)?track.credits:[]}
function V125_syncIdea(){const i=V125_idea(),t=$('songtitle');if(t)i.title=t.value;const f=t?.form;if(f){for(const k of ['mood','brief','package']){const x=f.elements?.[k];if(x)i[k]=x.value}}return i}
function V125_terms(a,role){
 const spec=V125_ROLES[role]||V125_ROLES.writer,rel=Number(a?.relation)||0,leverage=Math.log10(1+Math.max(0,s.fans||0))-Math.log10(1+Math.max(0,a?.fans||0)),star=tier(Math.max(0,a?.fans||0));
 let fee=Math.max(0,Math.round((typeof quote==='function'?quote(a):Math.max(100,a?.fans*.002||100))*spec.feeFactor/25)*25),share=spec.defaultShare+star*(role==='producer'?.65:1.8)+(a?.skill||0)*(role==='producer'?.018:.055)-Math.max(-2,leverage)*(role==='producer'?.35:1.4);
 if(rel>=60||leverage>=1.1)fee=Math.round(fee*.35/25)*25;if(rel>=85&&leverage>=0)fee=0;
 share=clamp(Math.round(share*2)/2,role==='producer'?1:5,spec.max);
 return {fee,share,rel,leverage}
}
function V125_compUsed(list=V125_idea().credits){return list.filter(x=>['writer','composer'].includes(x.role)).reduce((n,x)=>n+(Number(x.share)||0),0)}
function V125_acceptChance(a,role,fee,share){
 const t=V125_terms(a,role),cash=t.fee?fee/t.fee:(fee===0?1:1.4),split=t.share?share/t.share:1,rel=(Number(a?.relation)||0)/220,lev=clamp(t.leverage,-2,2)*.08;
 let p=.12+Math.min(1.5,cash)*.24+Math.min(1.5,split)*.38+rel+lev;
 if(fee===0&&share===0)p=.04+Math.max(0,Number(a?.relation)||0)/130+Math.max(0,t.leverage)*.14;
 return clamp(p,.02,.98)
}
function V125_creditRows(list){return list.map((x,i)=>`<div class="v125-credit-row"><span><b>${esc(x.name)}</b><small>${V125_ROLES[x.role]?.name||x.role} · ${x.agreement==='accepted'?'agreed':'UNAPPROVED'}${x.credited?' · credited':' · no credit'}</small></span><strong>${x.fee?money(x.fee)+' + ':''}${Number(x.share)||0}%</strong><button type="button" onclick="V125_removeCredit(${i})">Remove</button></div>`).join('')}
function V125_creditBuilder(){
 const i=V125_idea(),list=i.credits,used=V125_compUsed(list),player=Math.max(0,100-used);
 return `<section class="v125-splits"><header><span>SONG CREDITS & SPLITS</span><h3>Document who made the record.</h3><p>Writing and composition shares come out of the 100% composition pool. Producer points are separate. $0 and 0% are valid offers only when the collaborator actually agrees.</p></header><div class="v125-split-meter"><span><small>YOUR COMPOSITION SHARE</small><strong>${player.toFixed(player%1?1:0)}%</strong></span><i><b style="width:${player}%"></b></i><em>${used.toFixed(used%1?1:0)}% assigned</em></div>${list.length?`<div class="v125-credit-list">${V125_creditRows(list)}</div>`:'<p class="v125-empty">No outside writing, composition or production contributions attached yet.</p>'}<div class="v125-role-actions">${Object.entries(V125_ROLES).map(([id,x])=>`<button type="button" onclick="V125_openCreditPicker('${id}')"><small>${esc(x.lane)}</small><strong>+ ${esc(x.name)}</strong><span>${id==='producer'?'Negotiate fee + producer points':'Negotiate fee + ownership split'}</span></button>`).join('')}</div><p class="v125-rights-note"><b>Rights chain:</b> you can release with an unapproved or uncredited contribution, but the game records that choice. If the song gets noticed, that person can discover the release and file a real Legal Affairs case tied to this song.</p></section>`
}
function V125_openCreditPicker(role){
 if(!V125_ROLES[role])return;V125_syncIdea();const list=V125_idea().credits,artists=(s.world||[]).filter(a=>!list.some(x=>x.role===role&&x.id===a.id)).sort((a,b)=>(b.relation||0)-(a.relation||0)||(b.fans||0)-(a.fans||0));
 modal(`<span class="eyebrow">SESSION COLLABORATOR</span><h2>Add a ${V125_ROLES[role].name.toLowerCase()}.</h2><p>Select the exact person whose contribution is being used on this record. Their normal terms depend on career size, skill, leverage and your relationship.</p><label>Collaborator<select id="v125-credit-artist">${artists.map(a=>`<option value="${a.id}">${esc(a.name)} · ${compact(a.fans||0)} fans · relation ${Math.round(a.relation||0)}</option>`).join('')}</select></label><div class="controls"><button class="secondary" onclick="$(${JSON.stringify('modal')}).close()">Cancel</button><button class="primary" onclick="V125_openCreditTerms('${role}',Number($('v125-credit-artist').value))">Set terms →</button></div>`)
}
function V125_openCreditTerms(role,id,fee=null,share=null,credited=true){
 const a=s.world?.[id],spec=V125_ROLES[role];if(!a||!spec)return;const t=V125_terms(a,role),f=fee===null?t.fee:fee,p=share===null?t.share:share;
 modal(`${personPhoto('artist-'+(a.directoryKey??a.id),a.name,true)}<span class="eyebrow">${esc(spec.name.toUpperCase())} AGREEMENT</span><h2>${esc(a.name)}</h2><p>The numbers below are their usual terms for this session. Edit either field and send a custom offer.</p>${profileRows([['Usual upfront',money(t.fee)],['Usual '+(role==='producer'?'producer points':'composition split'),t.share+'%'],['Relationship',String(Math.round(a.relation||0))],['Career leverage',t.leverage>=.35?'You have more leverage':t.leverage<=-.35?'They have more leverage':'Similar leverage']])}<div class="v125-term-grid"><label>Upfront fee ($)<input id="v125-credit-fee" type="number" min="0" step="1" value="${Math.max(0,Number(f)||0)}"></label><label>${role==='producer'?'Producer royalty points (%)':'Composition ownership (%)'}<input id="v125-credit-share" type="number" min="0" max="${spec.max}" step="0.5" value="${Math.max(0,Number(p)||0)}"></label></div><label class="v125-check"><input id="v125-credit-name" type="checkbox" ${credited?'checked':''}> Give ${esc(a.name)} an on-record credit</label><p class="fine">A free contribution can be legitimate. What matters is whether both sides agreed to the $0 / 0% terms. Removing credit after they contributed creates separate risk.</p><div class="controls"><button class="secondary" onclick="V125_openCreditPicker('${role}')">Back</button><button class="primary" onclick="V125_sendCreditOffer('${role}',${id})">Send offer</button></div>`)
}
function V125_sendCreditOffer(role,id){
 const a=s.world?.[id],spec=V125_ROLES[role];if(!a||!spec)return;const fee=Math.max(0,Math.round(Number($('v125-credit-fee')?.value)||0)),share=Math.max(0,Number($('v125-credit-share')?.value)||0),credited=!!$('v125-credit-name')?.checked;if(share>spec.max){toast('That split is above this role’s allowed range.');return}
 if(['writer','composer'].includes(role)&&V125_compUsed()+share>100){toast('Writing/composition ownership cannot exceed 100%.');return}
 const t=V125_terms(a,role),chance=V125_acceptChance(a,role,fee,share);if(Math.random()<=chance){V125_attachCredit(a,role,{fee,share,credited,agreement:'accepted',usualFee:t.fee,usualShare:t.share});$('modal').close();render();toast(a.name+' agreed to the '+spec.name.toLowerCase()+' terms.');return}
 modal(`${personPhoto('artist-'+(a.directoryKey??a.id),a.name,true)}<span class="eyebrow">OFFER DECLINED</span><h2>${esc(a.name)} did not approve those terms.</h2><p>You can revise the offer—or deliberately use the contribution without an agreement. Doing that is recorded as a rights-chain violation and can become a lawsuit after release.</p><div class="controls"><button class="secondary" onclick="V125_openCreditTerms('${role}',${id},${fee},${share},${credited})">Revise offer</button><button class="danger" onclick="V125_useWithoutAgreement('${role}',${id},${fee},${share},${credited})">Use it anyway</button></div>`)
}
function V125_attachCredit(a,role,x){const i=V125_idea();i.credits.push({id:a.id,name:a.name,role,fee:x.agreement==='accepted'?x.fee:0,share:x.agreement==='accepted'?x.share:0,offeredFee:x.fee,offeredShare:x.share,credited:!!x.credited,agreement:x.agreement,usualFee:x.usualFee,usualShare:x.usualShare,addedWeek:s.week});queueSave?.()}
function V125_useWithoutAgreement(role,id,fee,share,credited){const a=s.world?.[id];if(!a)return;const t=V125_terms(a,role);V125_attachCredit(a,role,{fee:Number(fee)||0,share:Number(share)||0,credited:!!credited,agreement:'unauthorized',usualFee:t.fee,usualShare:t.share});$('modal').close();render();toast('Unapproved contribution attached. Legal risk will follow the release.')}
function V125_removeCredit(index){const i=V125_idea();i.credits.splice(index,1);queueSave?.();render()}
function V125_creditSummary(track){const list=V125_credits(track),used=list.filter(x=>['writer','composer'].includes(x.role)&&x.agreement==='accepted').reduce((n,x)=>n+(Number(x.share)||0),0),rows=list.map(x=>`<div class="v125-credit-row static"><span><b>${esc(x.name)}</b><small>${V125_ROLES[x.role]?.name||x.role} · ${x.agreement==='accepted'?'agreed':'UNAPPROVED'}${x.credited?' · credited':' · no credit'}</small></span><strong>${x.fee?money(x.fee)+' + ':''}${Number(x.share)||0}%</strong></div>`).join('');return `<section class="v125-session-credits"><header><span>RIGHTS & CREDITS</span><strong>${list.length?list.length+' outside contributor'+(list.length===1?'':'s'):'Self-contained record'}</strong></header>${list.length?rows:'<p>No outside writing, composition or production credits.</p>'}<footer><span>Your composition share</span><b>${Math.max(0,100-used)}%</b></footer></section>`}

/* Add the rights-chain editor to the existing creative brief without replacing
   the authoritative studio flow. */
const V125_songFormBase=V092_unifiedSongForm;
V092_unifiedSongForm=function(){return V125_songFormBase().replace('<div class="studio-commit">',V125_creditBuilder()+'<div class="studio-commit">')};
const V125_studioBase=studio;
studio=function(){let h=V125_studioBase();if(s.draft)h=h.replace('<section class="v103-collab-strip">',V125_creditSummary(s.draft)+'<section class="v103-collab-strip">');return h};

/* Accepted terms are paid and copied into the persistent master when writing
   starts. Unapproved contributions are copied too, but receive no automatic fee
   or royalty because no contract exists. */
const V125_newSongBase=newSong;
newSong=function(e){
 const idea=V125_syncIdea(),credits=typeof structuredClone==='function'?structuredClone(idea.credits||[]):JSON.parse(JSON.stringify(idea.credits||[])),form=e?.target,packageIndex=Number(form?new FormData(form).get('package'):idea.package||0),productionFee=Number(studioPackages?.[packageIndex]?.fee)||0,fees=credits.filter(x=>x.agreement==='accepted').reduce((n,x)=>n+(Number(x.fee)||0),0);
 if((Number(s.cash)||0)<productionFee+fees){e?.preventDefault?.();toast('Not enough cash for the production budget and agreed collaborator fees.');return}
 V125_newSongBase(e);if(!s.draft)return;s.draft.credits=credits;s.draft.rights={compositionPlayerShare:Math.max(0,100-credits.filter(x=>x.agreement==='accepted'&&['writer','composer'].includes(x.role)).reduce((n,x)=>n+(Number(x.share)||0),0)),createdWeek:s.week};
 if(fees){changeCash(-fees);s.finance.week.expenses=cents((Number(s.finance.week.expenses)||0)+fees);moneyEvent('Song collaborator fees',-fees)}queueSave();render()
};

/* Features now expose fully manual fee + master royalty negotiations in addition
   to the existing quick structures. */
const V125_studioGuestBase=studioGuest;
studioGuest=function(id){
 const a=s.world?.[id],d=s.draft;if(!a||!d||guestList(d).some(g=>g.id===id)||guestList(d).length>=6)return;const t=V092_outgoingFeatureTerms(a);
 modal(`${personPhoto('artist-'+(a.directoryKey??a.id),a.name,true)}<span class="eyebrow">FEATURE NEGOTIATION</span><h2>${esc(a.name)}</h2><p>Use a quick structure or type the exact fee and master royalty split you want. A $0 deal is valid if they agree.</p><div class="feature-deal-grid"><button class="feature-deal" onclick="V092_bookFeatureDeal(${id},'cash')"><strong>Cash</strong><span>${money(t.cash.upfront)}</span><small>No backend</small></button><button class="feature-deal" onclick="V092_bookFeatureDeal(${id},'hybrid')"><strong>Hybrid</strong><span>${money(t.hybrid.upfront)} + ${(t.hybrid.rate*100).toFixed(1)}%</span><small>Fee + split</small></button><button class="feature-deal" onclick="V092_bookFeatureDeal(${id},'royalty')"><strong>Royalty</strong><span>${(t.royalty.rate*100).toFixed(0)}%</span><small>No upfront</small></button></div><section class="v125-custom-feature"><h3>Custom feature terms</h3><div class="v125-term-grid"><label>Upfront fee ($)<input id="v125-feature-fee" type="number" min="0" step="1" value="${t.hybrid.upfront}"></label><label>Artist royalty split (%)<input id="v125-feature-share" type="number" min="0" max="50" step="0.5" value="${(t.hybrid.rate*100).toFixed(1)}"></label></div><label class="v125-check"><input id="v125-feature-credit" type="checkbox" checked> Credit ${esc(a.name)} on the release</label><button class="primary" onclick="V125_offerFeature(${id})">Send custom offer</button></section>${featureRequirements(a)}`)
};
function V125_offerFeature(id){
 const a=s.world?.[id],d=s.draft;if(!a||!d)return;const fee=Math.max(0,Math.round(Number($('v125-feature-fee')?.value)||0)),rate=clamp((Number($('v125-feature-share')?.value)||0)/100,0,.5),credited=!!$('v125-feature-credit')?.checked,t=V092_outgoingFeatureTerms(a),feeScore=t.fee?fee/t.fee:(fee===0?1:1.2),shareScore=rate/.15,chance=clamp(t.cash.chance*.35+Math.min(1.5,feeScore)*.28+Math.min(1.5,shareScore)*.24+(a.relation||0)/260,.03,.98);
 if((Number(s.cash)||0)<fee){toast('You do not have enough cash for that offer.');return}if(!spend(5))return;if(Math.random()>chance){modal(`<span class="eyebrow">FEATURE OFFER DECLINED</span><h2>${esc(a.name)} did not clear the feature.</h2><p>Revise the deal or deliberately use the unapproved contribution. Releasing an uncleared or uncredited feature creates a song-specific legal risk.</p><div class="controls"><button class="secondary" onclick="studioGuest(${id})">Revise offer</button><button class="danger" onclick="V125_useFeatureWithoutClearance(${id},${credited})">Use it anyway</button></div>`);return}
 if(fee){changeCash(-fee);s.finance.week.expenses=cents((Number(s.finance.week.expenses)||0)+fee);moneyEvent(a.name+' feature fee',-fee)}d.features=[...guestList(d),{id:a.id,name:a.name,fans:a.fans,fee,dealType:'custom',royaltyRate:rate,agreement:'accepted',credited,usualShare:.15,usualFee:t.fee}];d.feature=d.features[0];a.relation=clamp((a.relation||0)+5,-100,100);$('modal').close();queueSave();render();toast(a.name+' accepted the custom feature terms.')
}
function V125_useFeatureWithoutClearance(id,credited=false){const a=s.world?.[id],d=s.draft;if(!a||!d)return;const t=V092_outgoingFeatureTerms(a);d.features=[...guestList(d),{id:a.id,name:a.name,fans:a.fans,fee:0,dealType:'unauthorized',royaltyRate:0,agreement:'unauthorized',credited:!!credited,usualShare:.15,usualFee:t.fee}];d.feature=d.features[0];$('modal').close();queueSave();render();toast('Unapproved feature attached. Releasing it can trigger a rights dispute.')}

function V125_risky(track){
 const credits=V125_credits(track).map(x=>({song:track,credit:x,role:x.role,kind:x.role==='producer'?'producer':'credit'})),features=guestList(track).filter(x=>x.agreement==='unauthorized'||x.credited===false).map(x=>({song:track,credit:x,role:'feature',kind:'credit'}));
 return [...credits,...features].filter(x=>x.credit.agreement!=='accepted'||x.credit.credited===false)
}
function V125_releaseWarning(track){const risks=V125_risky(track);if(!risks.length)return '';return `<section class="v125-release-risk"><strong>RIGHTS NOT FULLY CLEARED</strong><p>${risks.map(x=>`${esc(x.credit.name)} · ${esc(x.role||x.credit.role)} · ${x.credit.agreement==='accepted'?'agreement exists':'NO AGREEMENT'} · ${x.credit.credited===false?'NO CREDIT':'credited'}`).join('<br>')}</p><small>You can still release the song. If the contribution is discovered, Legal Affairs can generate a case tied to this master.</small></section>`}
const V125_finishBase=finishSong;
finishSong=function(release,confirmed=false){const d=s.draft;if(release&&!confirmed&&d&&V125_risky(d).length){modal(`<h2>Release with uncleared rights?</h2>${V125_releaseWarning(d)}<div class="controls"><button class="secondary" onclick="$(${JSON.stringify('modal')}).close()">Go back</button><button class="danger" onclick="$(${JSON.stringify('modal')}).close();finishSong(true,true)">Release anyway</button></div>`);return}const id=d?.id;V125_finishBase(release,confirmed);if(release&&id){const song=s.songs?.find(x=>String(x.id)===String(id));if(song&&V125_risky(song).length){song.rightsRiskReleasedWeek=s.week;queueSave?.()}}};
const V125_releaseShelfBase=releaseShelf;
releaseShelf=function(id,confirmed=false){const x=s.songs?.find(x=>String(x.id)===String(id));if(x&&!confirmed&&V125_risky(x).length){modal(`<h2>Release with uncleared rights?</h2>${V125_releaseWarning(x)}<div class="controls"><button class="secondary" onclick="$(${JSON.stringify('modal')}).close()">Cancel</button><button class="danger" onclick="$(${JSON.stringify('modal')}).close();releaseShelf(${JSON.stringify(id)},true)">Release anyway</button></div>`);return}V125_releaseShelfBase(id,confirmed);if(confirmed&&x&&x.released&&V125_risky(x).length){x.rightsRiskReleasedWeek=s.week;queueSave?.()}};

/* Accepted backend terms become real weekly expenses. Unauthorized contributors
   receive nothing automatically; that missing agreement/payment is part of the
   damages model if they later sue. */
function V125_creditRoyaltyExpense(){let due=0;for(const song of s.songs||[]){if(!song.released||!song.streams)continue;for(const x of V125_credits(song)){if(x.agreement!=='accepted')continue;const rate=clamp((Number(x.share)||0)/100,0,1);if(rate)due+=(Number(song.streams)||0)*.50*rate}}return cents(due)}
const V125_closeFinancesBase=closeFinances;
closeFinances=function(royalties,rate){const due=V125_creditRoyaltyExpense();if(due){changeCash(-due);s.finance.week.expenses=cents((Number(s.finance.week.expenses)||0)+due);moneyEvent('Songwriter / producer splits',-due)}const r=V125_closeFinancesBase(royalties,rate);r.collaboratorRoyalty=due;return r};
const V125_financeRowsBase=financeRows;
financeRows=function(r,full=false){const a=r.collaboratorRoyalty?{...r,actionExpenses:Math.max(0,(Number(r.actionExpenses)||0)-r.collaboratorRoyalty)}:r,rows=V125_financeRowsBase(a,full);if(r.collaboratorRoyalty){const i=Math.max(0,rows.findIndex(x=>String(x[0]).startsWith('Career/action expenses')));rows.splice(i,0,['Songwriter / producer royalty splits','−'+money(r.collaboratorRoyalty)])}return rows};

/* Songwriting/producer legal pressure is now cause-based. Merely having 17
   collaborators no longer means 17 random people can sue: an actual broken
   rights chain on a released song must exist. */
function V125_rightsCandidates(kind=null){return (s.songs||[]).filter(x=>x.released).flatMap(V125_risky).filter(x=>!x.credit.caseId&&(!kind||x.kind===kind))}
function V125_pickRights(kind){const a=V125_rightsCandidates(kind);if(!a.length)return null;return a[Math.floor((typeof V124_roll==='function'?V124_roll('rights:'+kind):Math.random())*a.length)%a.length]}
const V125_ctxBase=V124_ctx;
V124_ctx=function(){const c=V125_ctxBase(),all=V125_rightsCandidates();c.creditRisks=all.filter(x=>x.kind==='credit').length;c.producerRisks=all.filter(x=>x.kind==='producer').length;return c};
const V125_scoresBase=V124_scores;
V124_scores=function(ctx=V124_ctx()){const z=V125_scoresBase(ctx),scale=x=>clamp(22+x*17+Math.log10(1+Math.max(0,s.total||0))*4,0,100);z.credit=ctx.creditRisks?Math.round(scale(ctx.creditRisks)):0;z.producer=ctx.producerRisks?Math.round(scale(ctx.producerRisks)):0;return z};
const V125_claimantBase=V124_claimant;
V124_claimant=function(type){const r=['credit','producer'].includes(type)?V125_pickRights(type):null;return r?.credit?.name||V125_claimantBase(type)};
const V125_triggerBase=V124_triggerDetail;
V124_triggerDetail=function(type,ctx){const r=['credit','producer'].includes(type)?V125_pickRights(type):null;if(!r)return V125_triggerBase(type,ctx);const x=r.credit,reason=[x.agreement!=='accepted'?'no approved agreement':null,x.credited===false?'missing release credit':null].filter(Boolean).join(' and ');return `${x.name} contributed ${r.role||x.role} work to “${r.song.title},” which was released with ${reason||'a disputed split'}. The dispute is tied to that specific master.`};
const V125_generateMatterBase=V124_generateMatter;
V124_generateMatter=function(type=null,forced=false){const c=V125_generateMatterBase(type,forced);if(c&&['credit','producer'].includes(c.matterType)){const r=V125_pickRights(c.matterType);if(r){r.credit.caseId=c.id;r.credit.discoveredWeek??=s.week;c.songId=r.song.id;c.collaboratorId=r.credit.id;c.plaintiff=r.credit.name;c.title=`${r.credit.name} v. ${s.labelBusiness?.company?.name||s.name}`;c.issue=(r.role||r.credit.role)==='producer'?'Producer royalty / approval dispute':'Songwriting, composition or feature credit dispute'}}return c};
function V125_fileRightsSuit(r){
 if(!r||r.credit.caseId||V118_openCases().length>=4)return null;const x=r.credit,song=r.song,rate=Math.max(Number(x.usualShare)||0,Number(x.offeredShare)||0,5)/100,unpaid=Math.max(0,(Number(song.total)||Number(song.streams)||0)*.50*rate),claim=cents(clamp(15000+unpaid*3+(x.agreement!=='accepted'?25000:0)+(x.credited===false?15000:0),15000,100000000)),matter=r.kind==='producer'?'producer':'credit',issue=r.kind==='producer'?'Producer royalty / approval dispute':'Songwriting, composition or feature credit dispute',detail=`${x.name} discovered that “${song.title}” used their ${r.role||x.role} contribution ${x.agreement!=='accepted'?'without an approved agreement':''}${x.agreement!=='accepted'&&x.credited===false?' and ':''}${x.credited===false?'without release credit':''}. The claim is tied to this master and its actual release history.`;
 const c=V118_fileCase({title:`${x.name} v. ${s.labelBusiness?.company?.name||s.name}`,issue,plaintiff:x.name,claim,strength:clamp(64+(x.agreement!=='accepted'?12:0)+(x.credited===false?8:0),45,94),clauses:[matter==='producer'?'Music IP / producer':'Music IP / credit'],matterType:matter,category:'Music IP',triggerDetail:detail,preventText:'Document contributor terms, obtain approval and publish accurate credits before release.',riskScore:90,generatedBy:'legal-risk'});if(!c)return null;c.songId=song.id;c.collaboratorId=x.id;x.caseId=c.id;x.discoveredWeek=s.week;V118_event?.('rights-discovery',issue,detail,{caseId:c.id,songId:song.id});addBriefing?.('legal-risk:'+c.id,'Legal',x.name+' filed a rights claim',detail+' Exposure: '+money(claim)+'.');return c
}
function V125_rightsDiscoveryWeek(){
 for(const r of V125_rightsCandidates()){const x=r.credit,song=r.song,total=Math.max(Number(song.total)||0,Number(song.streams)||0),base=.015+Math.min(.42,Math.log10(1+total)*.045)+(x.agreement!=='accepted'?.18:0)+(x.credited===false?.12:0),chance=clamp(base,.02,.82),roll=typeof V124_roll==='function'?V124_roll(`discover:${song.id}:${x.id}:${r.role||x.role}`):Math.random();if(roll<chance){V125_fileRightsSuit(r);break}}
}
const V125_beginWeekBase=beginCareerWeek;
beginCareerWeek=function(){const result=V125_beginWeekBase();V125_rightsDiscoveryWeek();return result};
