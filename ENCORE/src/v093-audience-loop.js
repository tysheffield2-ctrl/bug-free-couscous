/* ENCORE 0.9.3 — Audience → touring → market consequence loop. */
function V093_marketSnapshot(){migrateCareerWorld();return Object.fromEntries(regionalMarkets.map(meta=>{const m=s.careerWorld.markets[meta.id];return [meta.id,{fans:Number(m.fans||0),awareness:Number(m.awareness||0),loyalty:Number(m.loyalty||0),demand:Number(m.demand||0),connection:Number(m.culturalConnection||0),fatigue:Number(m.tourFatigue||0)}]}))}
function V093_deltaLabel(n,digits=1){const v=Number(n||0);return `${v>=0?'+':''}${v.toFixed(digits)}`}
function V093_captureTourMarketImpact(before){
 const t=s.liveTour;
 if(!t?.route)return;
 for(const r of t.route.filter(x=>x.report?.week===s.week&&!x.report.marketImpact)){
  const old=before[r.city];
  if(!old)continue;
  const m=careerWorldMarket(r.city);
  const impact={fans:Number(m.fans||0)-old.fans,awareness:Number(m.awareness||0)-old.awareness,loyalty:Number(m.loyalty||0)-old.loyalty,demand:Number(m.demand||0)-old.demand,connection:Number(m.culturalConnection||0)-old.connection,fatigue:Number(m.tourFatigue||0)-old.fatigue};
  r.report.marketImpact=impact;
  const positive=impact.demand>0||impact.loyalty>0;
  const headline=r.report.satisfaction>=75?'Market strengthened':r.report.satisfaction>=55?'Market held steady':'Market cooled';
  r.report.marketHeadline=headline;
  if(typeof addBriefing==='function')addBriefing(`market-impact:${t.id}:${r.id}:${s.week}`,'Audience',`${m.city} · ${headline}`,`${fmt(r.report.tickets)} attended · ${r.report.satisfaction}/100 satisfaction · demand ${V093_deltaLabel(impact.demand)} · loyalty ${V093_deltaLabel(impact.loyalty)} · awareness ${V093_deltaLabel(impact.awareness)} · ${fmt(Math.max(0,r.report.fans||0))} new fans.`,positive?'Momentum here can support a return date, larger venue or nearby routing.':'Give this market time to recover before another aggressive booking.');
 }
}
const V093_settleWorldTourBase=settleWorldTour;
settleWorldTour=function(){const before=V093_marketSnapshot();V093_settleWorldTourBase();V093_captureTourMarketImpact(before)};
function V093_marketImpactRows(report){const x=report?.marketImpact;if(!x)return [];return [['Market outcome',report.marketHeadline||'Updated'],['Demand change',V093_deltaLabel(x.demand)],['Loyalty change',V093_deltaLabel(x.loyalty)],['Awareness change',V093_deltaLabel(x.awareness)],['Cultural connection',V093_deltaLabel(x.connection)],['Tour fatigue',V093_deltaLabel(x.fatigue)]]}
const V093_tourRouteCardsBase=tourRouteCards;
tourRouteCards=function(route){const html=V093_tourRouteCardsBase(route);if(!route?.some(r=>r.report?.marketImpact))return html;return html+`<section class="card"><span class="eyebrow">AUDIENCE AFTERMATH</span><h2>What the shows changed</h2><p class="fine">Tour results feed directly back into the same regional markets used for future demand.</p>${route.filter(r=>r.report?.marketImpact).slice(-8).reverse().map(r=>{const m=careerWorldMarket(r.city);return `<details><summary>${esc(m.city)} · ${esc(r.report.marketHeadline||'Market updated')}</summary>${profileRows(V093_marketImpactRows(r.report))}</details>`}).join('')}</section>`}
