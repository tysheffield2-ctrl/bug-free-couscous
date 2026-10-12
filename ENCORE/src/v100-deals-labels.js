/* ENCORE 1.0 playable integration: Contract Vault navigation, amendments and player-label negotiation parity. */

(function V100_wireContractVault(){
 if(typeof V096_BUSINESS_AREAS==='undefined'||typeof V096_BUSINESS_IDS==='undefined')return;
 if(!V096_BUSINESS_IDS.has('ContractVault')){
  V096_BUSINESS_AREAS.splice(2,0,{id:'ContractVault',group:'Deals & revenue',name:'Contract Vault',desc:'Executed agreements, signatures, clauses and legal history'});
  V096_BUSINESS_IDS.add('ContractVault');
 }
})();

const V100_careerBeforeContractVault=career;
career=function(){
 if(tab==='Career'&&careerTab==='ContractVault')return V096_businessSubnav('ContractVault')+V100_contractVaultPage();
 return V100_careerBeforeContractVault();
};

function V100_amendmentSpec(kind){
 return {
  recoupment:{label:'Make advance non-recoupable',cost:18,apply:t=>{t.recoupment=false}},
  options:{label:'Remove company options',cost:16,apply:t=>{t.options=0}},
  autoExtension:{label:'Remove automatic extension',cost:12,apply:t=>{t.autoExtension=false}},
  crossCollateral:{label:'Remove cross-collateralization',cost:22,apply:t=>{t.crossCollateral=false}}
 }[kind];
}
function V100_contractAmendmentControls(id,t){
 const c=V100_contractClauses(t),items=[];
 if(c.recoupment)items.push('recoupment');
 if(c.options)items.push('options');
 if(c.autoExtension)items.push('autoExtension');
 if(c.crossCollateral)items.push('crossCollateral');
 if(!items.length)return '<section class="card"><span class="eyebrow">AMENDMENTS</span><h3>No major structural amendment is currently needed.</h3><p>You can return to the financial negotiation if you still want to change the advance, royalty split or term.</p></section>';
 return '<section class="card"><span class="eyebrow">REQUEST AN AMENDMENT</span><h3>Push back before you sign.</h3><p>Material changes consume counterparty patience. Strong interest and leverage improve the chance that the company accepts the amendment.</p><div class="controls">'+items.map(k=>'<button class="secondary" onclick="V100_requestAmendment(\''+id+'\',\''+k+'\')">'+esc(V100_amendmentSpec(k).label)+'</button>').join('')+'</div></section>';
}
function V100_requestAmendment(id,kind){
 const o=s.labelBusiness?.offers?.find(x=>x.id===id&&!x.used&&x.expires>=s.week),spec=V100_amendmentSpec(kind);
 if(!o||!spec||!labelActive())return;
 const n=negotiationMeters(o);
 if(n.status!=='active'){toast('This negotiation is no longer active.');return}
 if(!spend(5))return;
 const t=ensureLabelProposal(o),score=n.leverage*.55+n.interest*.35+s.reputation*.1-spec.cost;
 n.patience=Math.round(clamp(n.patience-spec.cost*.55,0,100));
 if(n.patience<=4){o.used=true;o.walkedAway=true;n.status='walked';o.response='The company ended negotiations after the amendment request.';$('modal').close();render();toast('The company walked away.');return}
 if(score>=36){
  spec.apply(t);n.interest=Math.round(clamp(n.interest+1,0,100));n.leverage=Math.round(clamp(n.leverage+2,0,100));o.response='Amendment accepted: '+spec.label+'.';
  log(labelDeals[o.label].name+' accepted a contract amendment: '+spec.label+'.');
 }else{
  n.interest=Math.round(clamp(n.interest-5,0,100));o.response='Amendment declined: '+spec.label+'. The current clause remains in the offer.';
 }
 render();signNegotiatedOffer(id);
}
const V100_signBeforeAmendments=signNegotiatedOffer;
signNegotiatedOffer=function(id,confirmed=false){
 if(confirmed)return V100_signBeforeAmendments(id,true);
 const o=s.labelBusiness?.offers?.find(x=>x.id===id&&!x.used&&x.expires>=s.week);
 if(!o)return;
 const t=ensureLabelProposal(o),label=labelDeals[o.label].name;
 modal('<span class="eyebrow">CONTRACTS 2.0 · REVIEW CONTRACT</span><h2>'+esc(label)+'</h2>'+negotiationPanel(o)+(o.response?'<p class="highlightbox">'+esc(o.response)+'</p>':'')+V100_contractDocument(t,label)+V100_contractAmendmentControls(id,t)+'<form class="form" onsubmit="V100_executeContract(event,\''+id+'\')"><label>Initial material terms<input name="initials" maxlength="6" autocomplete="off" placeholder="Initials" required></label><label>Electronic signature<input name="signature" maxlength="80" autocomplete="off" placeholder="'+esc(s.name)+'" required></label><p class="fine">Initial the material-terms page, then type your artist name exactly. 10 energy is charged only when the contract executes.</p><button class="primary">Sign & execute agreement</button></form><button class="secondary" onclick="reviewArtistOffer(\''+id+'\')">Back to financial negotiation</button><button class="secondary" onclick="$(\'modal\').close()">Do not sign</button>');
};

function V100_rosterNegotiations(){
 migrateLabelBusiness();
 if(!s.labelBusiness.rosterNegotiations)s.labelBusiness.rosterNegotiations={};
 return s.labelBusiness.rosterNegotiations;
}
function V100_rosterNegotiation(id){
 const a=s.world[id],book=V100_rosterNegotiations();
 if(!a)return null;
 if(!book[id]||book[id].status==='expired'){
  const rival=!!s.labelLeague?.contracts?.[id],relation=Number(a.relation||0);
  book[id]={interest:Math.round(clamp(48+relation*.28+s.reputation*.22-(rival?8:0),12,94)),patience:Math.round(clamp(66+relation*.12+(s.labelBusiness.company?.staff?.ar?6:0),24,92)),leverage:Math.round(clamp(30+s.reputation*.35+(s.labelBusiness.company?.staff?.ar?8:0),8,95)),rounds:0,status:'active',response:rival?'This artist is under contract elsewhere. A buyout and strong terms may be required.':'The artist is willing to hear an offer.'};
 }
 return book[id];
}
function V100_rosterNegotiationPanel(id){
 const n=V100_rosterNegotiation(id);if(!n)return '';
 return '<section class="negotiation-meters">'+negotiationBar('Artist interest',n.interest,'How strongly the artist currently wants to join your company.')+negotiationBar('Artist patience',n.patience,'How much more bargaining they will tolerate before ending talks.')+negotiationBar('Your leverage',n.leverage,'Your label reputation, staff support and relationship advantage.')+'</section>';
}
function V100_rosterOfferPressure(a,t,r,n){
 const shortfall=Math.max(0,r.minimum-t.advance)/Math.max(1,r.minimum),rights=t.type==='360'?10:t.type==='distribution'?-2:3,share=Math.max(0,t.share-.15)*55,term=Math.max(0,t.weeks-26)/104*18;
 return clamp(4+shortfall*30+rights+share+term-n.leverage*.06,2,32);
}
function V100_rosterOfferForm(id){
 const a=s.world[id];if(!labelActive()||!s.labelBusiness.company||!a||ownerContracts().some(c=>c.artist===id)||ownerContracts().length>=labelCapacity())return;
 const n=V100_rosterNegotiation(id);if(n.status==='walked'&&s.week<(n.walkedUntil||0)){toast(a.name+' is not ready to reopen talks yet.');return}
 if(n.status==='walked'){n.status='active';n.patience=Math.max(35,n.patience);n.interest=Math.max(30,n.interest)}
 const t={type:'record',share:.1,weeks:26,advance:rosterTerms(a,'record',.1,26).minimum};
 modal('<h2>Negotiate with '+esc(a.name)+'</h2>'+V100_rosterNegotiationPanel(id)+'<p class="highlightbox">'+esc(n.response||'Present terms to begin.')+'</p><p>Higher label shares, longer terms and broader rights increase what the artist expects in return. A rival contract can also create a buyout.</p><form class="form" oninput="previewRosterTerms(this,'+id+')" onsubmit="V100_reviewRosterOffer(event,'+id+')">'+contractFields(t)+'<p id="roster-preview">Requested advance '+money(t.advance)+' · Reputation '+s.reputation+'/'+rosterTerms(a,t.type,t.share,t.weeks).reputation+'</p><p class="fine">Presenting terms is free, but every serious offer affects patience. Signing uses 10 energy and pays the advance plus any buyout immediately.</p><button class="primary">Present offer</button></form>');
}
rosterOfferForm=V100_rosterOfferForm;
function V100_reviewRosterOffer(e,id){
 e.preventDefault();if(!labelActive()||!s.labelBusiness.company||!s.world[id])return;
 const a=s.world[id],n=V100_rosterNegotiation(id);if(!n||n.status!=='active')return;
 try{
  const t=readRosterTerms(e.target),r=rosterTerms(a,t.type,t.share,t.weeks);
  if(a.relation<=-40||s.reputation<r.reputation){n.interest=Math.round(clamp(n.interest-8,0,100));n.response='They are not willing to sign while the relationship or your label reputation is this weak.';render();V100_rosterOfferForm(id);return}
  const pressure=V100_rosterOfferPressure(a,t,r,n);
  n.patience=Math.round(clamp(n.patience-pressure,0,100));n.rounds++;
  const value=t.advance/Math.max(1,r.minimum),appeal=(value-1)*24+(1-t.share)*8+(t.type==='distribution'?4:t.type==='360'?-5:0);
  n.interest=Math.round(clamp(n.interest+appeal-pressure*.35,0,100));
  if(n.patience<=4||n.interest<=7){n.status='walked';n.walkedUntil=s.week+8;n.response='Talks ended. The artist will not reopen negotiations for eight weeks.';$('modal').close();render();toast(a.name+' walked away from negotiations.');return}
  if(t.advance<r.minimum||n.interest<34){
   const ask=Math.max(r.minimum,Math.round(r.minimum*(1+(34-n.interest)*.008)));
   n.response='Counteroffer: '+money(ask)+' advance for the current rights, split and term. Interest '+n.interest+'/100 · patience '+n.patience+'/100.';
   render();V100_rosterOfferForm(id);return;
  }
  pendingRosterOffer={...t,artist:id,buyout:npcBuyout(id)};
  n.response='The artist accepted the business terms. Review the final signing cost.';
  modal('<h2>'+esc(a.name)+' is ready to sign</h2>'+V100_rosterNegotiationPanel(id)+profileRows([['Advance',money(t.advance)],['Current-label buyout',money(npcBuyout(id))],['Your label share',Math.round(t.share*100)+'%'],['Artist share',Math.round((1-t.share)*100)+'%'],['Term',t.weeks+' weeks'],['Rights',t.type==='360'?'Recording + live + merchandise':t.type==='distribution'?'Distribution':'Recording']])+'<p>'+esc(n.response)+'</p><button class="secondary" onclick="V100_rosterOfferForm('+id+')">Keep negotiating</button><button class="primary" onclick="confirmRosterOffer()">Pay & sign artist</button>');
 }catch(err){toast(err.message)}
}
reviewRosterOffer=V100_reviewRosterOffer;
const V100_confirmRosterOfferOld=confirmRosterOffer;
confirmRosterOffer=function(){
 const t=pendingRosterOffer,a=t?s.world[t.artist]:null,n=t?V100_rosterNegotiation(t.artist):null,before=ownerContracts().length;
 V100_confirmRosterOfferOld();
 if(t&&a&&ownerContracts().length>before&&n){n.status='signed';n.interest=100;n.response='Signed to '+s.labelBusiness.company.name+'.';}
};
