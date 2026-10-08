/* ENCORE 0.9.2 compatibility with established 0.8 presentation layers. */
createMerch=function(e,id){e.preventDefault();const spec=merchItems.find(x=>x[0]===id),f=new FormData(e.target),mode=String(f.get('mode')||'inventory'),qty=Number(f.get('qty')),price=Number(f.get('price')),look=Number(f.get('look')||0),looks=typeof V080_merchLooks!=='undefined'?V080_merchLooks:merchandiseLooks;if(!spec||!['inventory','preorder','pod'].includes(mode)||!Number.isFinite(price)||price<.01||price>Number.MAX_SAFE_INTEGER||!Number.isInteger(look)||look<0||look>=looks.length)return;if(mode==='inventory'&&(!Number.isInteger(qty)||qty<1||qty>1e9))return;const units=mode==='inventory'?qty:0,cost=mode==='inventory'?cents(units*spec[2]):0;V092_pendingMerch={item:id,look,name:spec[1]+' · '+looks[look],stock:units,sold:0,price,cost,unitCost:spec[2],mode,unlimited:mode!=='inventory',preorder:mode==='preorder',preorders:0,launchedMonth:s.empire.month};const est=V092_merchEstimate(id,price,mode);modal(`${merchPhoto(id,look)}<h2>Launch ${esc(V092_pendingMerch.name)}?</h2>${profileRows([['Model',mode==='inventory'?'Inventory':mode==='preorder'?'Preorders':'Unlimited / print on demand'],['Upfront production',money(cost)],['Sale price',money(price)],['Projected monthly demand',compact(mode==='inventory'?Math.min(units,est.units):est.units)+' units'],['Projected gross at demand',money(mode==='inventory'?Math.min(units,est.units)*price:est.gross)]])}<p>10 energy. Demand is an estimate, not a guarantee.</p><button class="primary" onclick="confirmMerch()">Confirm launch</button>`)};

const V092_sportsCompatPage=V081_sportsPage;
V081_sportsPage=function(){let html=V092_sportsCompatPage();html=html.replace('Sports ownership.','ENCORE Pro Basketball.').replace('Invest, take control, build a franchise','Ten teams. Invest, take control, build a franchise');return html};

/* The 0.8.1 validator predates controlling ownership and hard-capped a single sports lot at 10%.
   0.9.2 independently validates the new 0–100% ownership range, then lets the legacy
   validation chain inspect every other field with a temporary compatibility value. */
const V092_validatePresentationCompat=validatePresentationState;
validatePresentationState=function(){
 const holdings=s.v081?.sports?.holdings||[];
 const elevated=[];
 for(const h of holdings){
  if(!Number.isInteger(h.id)||!Number.isInteger(h.team)||!Number.isFinite(h.share)||h.share<=0||h.share>1||!Number.isFinite(h.basis)||h.basis<0)throw Error('Invalid sports holding');
  if(h.share>.1){elevated.push([h,h.share]);h.share=.1}
 }
 try{return V092_validatePresentationCompat()}
 finally{for(const [h,share] of elevated)h.share=share}
};