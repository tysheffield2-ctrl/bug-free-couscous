/* ENCORE 0.8.5 marketing safety fixes. */
V086_activeCampaign=function(){
 migrateV086();const c=s.v086.catalogCampaign,p=c&&V086_plan(c.planId);if(!c||!p)return null;
 Object.defineProperty(c,'plan',{value:p,writable:true,configurable:true,enumerable:false});return c
};
V086_startCampaign=function(id){
 const p=V086_plan(id);if(!p||!s.songs.some(x=>x.released))return;migrateV086();
 const old=V086_activeCampaign();
 if(old?.lastPaidWeek===s.week)s.boost=Math.max(0,s.boost-old.plan.streamBoost);
 if(!spend(5,p.cost)){if(old?.lastPaidWeek===s.week)s.boost+=old.plan.streamBoost;return}
 s.v086.catalogCampaign={planId:p.id,startedWeek:s.week,lastPaidWeek:s.week,weeksPaid:(old?.planId===p.id?(old.weeksPaid||0):0)+1,totalSpent:cents((old?.planId===p.id?(old.totalSpent||0):0)+p.cost),autoRenew:true};
 s.boost+=p.streamBoost;moneyEvent('Catalog campaign · '+p.name,-p.cost);log(p.name+' active: +'+Math.round(p.streamBoost*100)+'% catalog streams and +'+Math.round(p.fanBoost*100)+'% fan conversion this week.');$('modal').close();render()
};
let V086_pendingRollout=null;
V086_startRollout=function(e){
 e?.preventDefault?.();if(!e?.target)return;const f=new FormData(e.target),weeks=Number(f.get('duration')),scale=V086_ROLLOUT_SCALES.find(x=>x.id===f.get('scale')),lead=Number(f.get('lead')),name=String(f.get('name')||'Album era').trim().slice(0,55),song=s.songs.find(x=>x.id===lead&&x.released);
 if(![8,12,16].includes(weeks)||!scale||!song||!name)return;const cost=weeks*scale.weekly,boost=V086_rolloutBoost(scale,weeks);if(s.cash<cost){toast('Not enough cash for that rollout.');return}
 V086_pendingRollout={name,lead,weeks,scaleId:scale.id};
 modal(`<span class="eyebrow">ALBUM ROLLOUT</span><h2>${esc(name)}</h2>${profileRows([['Duration',weeks+' weeks'],['Campaign tier',scale.name],['Total upfront budget',money(cost)],['Weekly catalog reach','+'+Math.round(boost*100)+'%'],['Fan conversion lift','+'+Math.round(scale.fan*100)+'%']])}<p>The full rollout budget is paid upfront. Promotion remains active through the final scheduled week.</p><button class="primary" onclick="V086_confirmPendingRollout()">Launch rollout</button>`)
};
function V086_confirmPendingRollout(){const p=V086_pendingRollout;if(!p)return;const scale=V086_ROLLOUT_SCALES.find(x=>x.id===p.scaleId),song=s.songs.find(x=>x.id===p.lead&&x.released);if(!scale||!song||s.expansion.albumRollout)return;const cost=p.weeks*scale.weekly,boost=V086_rolloutBoost(scale,p.weeks);if(s.cash<cost){toast('Not enough cash for that rollout.');return}if(!spend(15))return;changeCash(-cost);s.finance.week.expenses=cents((s.finance.week.expenses||0)+cost);s.expansion.albumRollout={started:s.week,until:s.week+p.weeks-1,duration:p.weeks,budget:cost,boost,fanBoost:scale.fan,lead:p.lead,name:p.name,scale:scale.id};moneyEvent(p.weeks+'-week album rollout · '+p.name,-cost);V086_pendingRollout=null;$('modal').close();render();toast(p.name+' rollout launched · '+p.weeks+' weeks')}
V081_startRollout=V086_startRollout;
