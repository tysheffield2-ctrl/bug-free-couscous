/* ENCORE 0.9.14 — Representation Relationships 1.0.
   Representatives are people, not static buffs. Every active manager, agent and
   specialist now has a visible working relationship that can improve, strain,
   recover and eventually break down through player choices and time. */

const V117_RELATIONSHIP_START=50;
const V117_RELATIONSHIP_MAX=100;
const V117_RELATIONSHIP_MIN=0;
const V117_ROLE_ACTIONS={
 manager:{check:'Career check-in',trust:'Back their plan'},
 booking:{check:'Tour-business check-in',trust:'Trust their routing'},
 business:{check:'Finance check-in',trust:'Back their cash plan'},
 attorney:{check:'Legal check-in',trust:'Trust their counsel'},
 publicist:{check:'Press check-in',trust:'Back their narrative'},
 creative:{check:'Creative check-in',trust:'Try their direction'},
 tour:{check:'Road check-in',trust:'Trust their logistics'},
 social:{check:'Campaign check-in',trust:'Back their strategy'},
 cpa:{check:'Tax-planning check-in',trust:'Trust their forecast'}
};

const V117_repTeamBase=V100_repTeam;
V100_repTeam=function(){
 const rep=V117_repTeamBase();
 for(const c of Object.values(rep.team||{}))V117_migrateRepresentative(c);
 return rep
};
function V117_migrateRepresentative(c){
 if(!c)return c;
 if(!Number.isFinite(Number(c.relationship)))c.relationship=V117_RELATIONSHIP_START;
 c.relationship=clamp(Math.round(Number(c.relationship)),V117_RELATIONSHIP_MIN,V117_RELATIONSHIP_MAX);
 if(!Array.isArray(c.relationshipEvents))c.relationshipEvents=[];
 if(!Number.isFinite(Number(c.lastRelationshipInteractionWeek)))c.lastRelationshipInteractionWeek=Number(c.started)||0;
 if(!Number.isFinite(Number(c.relationshipTrend)))c.relationshipTrend=0;
 return c
}
function V117_relationshipLabel(value){const n=clamp(Number(value)||0,0,100);return n<15?'Fractured':n<35?'Strained':n<55?'Professional':n<75?'Trusted':n<90?'Close':'Inner circle'}
function V117_relationshipTone(value){const n=clamp(Number(value)||0,0,100);return n<15?'danger':n<35?'warning':n<75?'steady':'strong'}
function V117_effectiveSkill(c){
 if(!c)return 0;const rel=clamp(Number(c.relationship)||V117_RELATIONSHIP_START,0,100),base=clamp(Number(c.skill)||0,0,100);
 const mod=rel>=90?4:rel>=75?2:rel>=55?1:rel>=35?0:rel>=20?-4:-8;
 return clamp(Math.round(base+mod),0,100)
}
function V117_relationshipBar(c,compact=false){
 const rel=clamp(Number(c?.relationship)||0,0,100),trend=Number(c?.relationshipTrend)||0,label=V117_relationshipLabel(rel),tone=V117_relationshipTone(rel),trendText=trend>0?'+'+trend:trend<0?String(trend):'—';
 return `<div class="v117-relation ${compact?'v117-relation-compact':''}" data-tone="${tone}"><div class="v117-relation-head"><span>${esc(label)}</span><strong>${rel}/100</strong><small>${trend?'LAST '+trendText:'STABLE'}</small></div><div class="v117-relation-track" role="progressbar" aria-label="Working relationship with ${esc(c?.name||'representative')}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${rel}"><i style="width:${rel}%"></i></div></div>`
}
function V117_styleText(c){return String(c?.marketStyle||c?.personality||'Specialist').toLowerCase()}
function V117_actionDelta(c,kind){
 const style=V117_styleText(c),relational=/relationship|community|grassroots|artist developer|calm|advocate/.test(style),assertive=/deal closer|growth|scale|maximalist|viral|hit-focused|aggressive/.test(style),strict=/exacting|compliance|risk|cash controller|conservative/.test(style);
 if(kind==='checkin')return 7+(relational?2:0);
 if(kind==='trust')return 6+(assertive?3:relational?1:0);
 if(kind==='appreciate')return 9+(relational?2:0);
 if(kind==='challenge')return -(strict?9:relational?-4:-6);
 if(kind==='repair')return 15+(relational?3:0);
 return 0
}
function V117_appreciationCost(){return [50,100,250,1000,5000,20000,50000][clamp(tier(s.fans),0,6)]||250}
function V117_addRelationshipEvent(c,delta,reason,type='interaction',week=s.week){
 V117_migrateRepresentative(c);c.relationshipEvents.unshift({week,type,delta,reason});c.relationshipEvents=c.relationshipEvents.slice(0,16)
}
function V117_changeRelationship(role,delta,reason,type='interaction',week=s.week){
 const rep=V100_repTeam(),c=rep.team?.[role];if(!c)return 0;V117_migrateRepresentative(c);
 const before=c.relationship,after=clamp(before+Math.round(Number(delta)||0),0,100),actual=after-before;c.relationship=after;c.relationshipTrend=actual;
 if(actual||reason)V117_addRelationshipEvent(c,actual,reason,type,week);
 if(before<75&&after>=75)addBriefing?.('rep-trust:'+c.id+':'+week,'Team',c.name+' trusts the partnership','Your working relationship reached '+V117_relationshipLabel(after)+'. Strong chemistry can improve effective advisor skill.');
 if(before>=35&&after<35)addBriefing?.('rep-strain:'+c.id+':'+week,'Team','Tension with '+c.name,'The relationship is now '+V117_relationshipLabel(after)+'. Repair it before the working relationship reaches a breaking point.');
 if(after>10)c.breakingPointWeek=null;
 return actual
}
function V117_repInteract(role,kind){
 if(!labelActive?.())return false;const rep=V100_repTeam(),c=rep.team?.[role];if(!c)return false;V117_migrateRepresentative(c);
 if(c.lastRelationshipInteractionWeek===s.week){toast?.('You already had a relationship interaction with '+c.name+' this week.');return false}
 const cost=kind==='appreciate'?V117_appreciationCost():0,energy=kind==='repair'?10:5;
 if(kind==='repair'&&c.relationship>=40){toast?.('There is no serious tension to repair right now.');return false}
 if(!spend(energy,cost))return false;
 const actions=V117_ROLE_ACTIONS[role]||{check:'Check in',trust:'Back their plan'},labels={checkin:actions.check,trust:actions.trust,appreciate:'Show appreciation',challenge:'Challenge their strategy',repair:'Clear the air'},delta=V117_actionDelta(c,kind);
 c.lastRelationshipInteractionWeek=s.week;V117_changeRelationship(role,delta,labels[kind]||'Relationship interaction');queueSave?.();render();V117_openRepRelationship(role);return true
}
function V117_recentEvents(c){
 const events=(c.relationshipEvents||[]).slice(0,6);return events.length?events.map(x=>`<div class="v117-event"><span>WEEK ${x.week}</span><p>${esc(x.reason||'Relationship changed')}</p><strong class="${x.delta<0?'bad':'highlight'}">${x.delta>0?'+':''}${x.delta}</strong></div>`).join(''):'<p class="fine">No relationship events yet. Check in, support their work, disagree or simply let time pass.</p>'
}
function V117_openRepRelationship(role){
 const c=V100_repTeam().team?.[role],r=V100_REP_ROLES[role];if(!c||!r)return false;V117_migrateRepresentative(c);
 const used=c.lastRelationshipInteractionWeek===s.week,actions=V117_ROLE_ACTIONS[role]||{check:'Check in',trust:'Back their plan'},cost=V117_appreciationCost(),effective=V117_effectiveSkill(c),base=Math.round(Number(c.skill)||0),modifier=effective-base;
 modal(`<section class="v117-relationship-sheet">${typeof personPhoto==='function'?personPhoto('rep-'+c.id,c.name):''}<span class="eyebrow">${esc(r.name.toUpperCase())} · WORKING RELATIONSHIP</span><h2>${esc(c.name)}</h2><p>${esc(c.marketStyle||c.personality||'Specialist')} · ${esc(c.specialty||'General')}</p>${V117_relationshipBar(c)}<div class="v117-chemistry-facts">${profileRows([['Base skill',base+'/100'],['Relationship-adjusted skill',effective+'/100'+(modifier?` (${modifier>0?'+':''}${modifier})`:'' )],['Time together',Math.max(0,s.week-(c.started||s.week))+' weeks'],['Last relationship action',c.lastRelationshipInteractionWeek?`Week ${c.lastRelationshipInteractionWeek}`:'None yet']])}</div><p class="fine">This is separate from the legal agreement. Strong chemistry can improve effective advisor skill; strained chemistry reduces it. If a relationship stays at a breaking point after a warning, the representative can resign.</p><div class="v117-actions"><button class="secondary" ${used?'disabled':''} onclick="V117_repInteract('${role}','checkin')">${esc(actions.check)} · 5 energy</button><button class="secondary" ${used?'disabled':''} onclick="V117_repInteract('${role}','trust')">${esc(actions.trust)} · 5 energy</button><button class="secondary" ${used?'disabled':''} onclick="V117_repInteract('${role}','appreciate')">Show appreciation · 5 energy · ${money(cost)}</button><button class="secondary" ${used?'disabled':''} onclick="V117_repInteract('${role}','challenge')">Challenge strategy · 5 energy</button>${c.relationship<40?`<button class="primary" ${used?'disabled':''} onclick="V117_repInteract('${role}','repair')">Clear the air · 10 energy</button>`:''}</div><p class="fine">One direct relationship action with this representative per week. Different working styles respond differently to trust, appreciation and pushback.</p><hr><h3>Recent relationship history</h3><div class="v117-event-list">${V117_recentEvents(c)}</div><div class="controls"><button class="secondary" onclick="V100_reviewTermination('${role}')">Review legal agreement / termination</button><button class="secondary" onclick="$('modal').close()">Close</button></div></section>`);return true
}

const V117_hireRepBase=V100_hireRep;
V100_hireRep=function(id){
 const c=V100_REP_CANDIDATES.find(x=>x.id===id),result=V117_hireRepBase(id),hired=c&&V100_repTeam().team?.[c.role];
 if(hired?.id===id&&!Number.isFinite(Number(hired.relationship))){hired.relationship=V117_RELATIONSHIP_START;hired.relationshipTrend=0;hired.lastRelationshipInteractionWeek=Number(hired.started)||s.week;hired.relationshipEvents=[{week:s.week,type:'hire',delta:0,reason:'Working relationship began'}]}
 return result
};
const V117_terminateRepBase=V100_terminateRep;
V100_terminateRep=function(role,fee){
 const rep=V100_repTeam(),c=rep.team?.[role],snapshot=c?{relationship:c.relationship,label:V117_relationshipLabel(c.relationship)}:null,result=V117_terminateRepBase(role,fee);
 const h=rep.history?.[0];if(snapshot&&h&&h.role===role&&h.type==='terminated'){h.relationship=snapshot.relationship;h.relationshipLabel=snapshot.label}return result
};

function V117_settleRepRelationships(completedWeek=s.week){
 const rep=V100_repTeam();
 for(const [role,c] of Object.entries({...rep.team})){
  if(!c)continue;V117_migrateRepresentative(c);const last=Number(c.lastRelationshipInteractionWeek||c.started||completedWeek),idle=Math.max(0,completedWeek-last),tenure=Math.max(0,completedWeek-(c.started||completedWeek));
  if(idle>=6&&idle%2===0)V117_changeRelationship(role,-1,'Long stretch without a check-in','weekly',completedWeek);
  else if(idle<=2&&tenure>0&&tenure%4===0&&c.relationship<90)V117_changeRelationship(role,1,'A steady working rhythm strengthened the partnership','weekly',completedWeek);
  if(c.relationship<=5){
   if(!Number.isFinite(Number(c.breakingPointWeek))){c.breakingPointWeek=completedWeek;addBriefing?.('rep-breaking:'+c.id+':'+completedWeek,'Team',c.name+' says the relationship is at a breaking point','Repair the relationship soon. If it remains this strained through another full week, they may leave the team.')}
   else if(completedWeek-c.breakingPointWeek>=2){rep.history.unshift({week:s.week,type:'resigned',role,name:c.name,relationship:c.relationship,relationshipLabel:V117_relationshipLabel(c.relationship),reason:'Relationship breakdown',earned:c.earned||0,tenure:Math.max(0,s.week-(c.started||s.week))});delete rep.team[role];addBriefing?.('rep-resigned:'+c.id+':'+completedWeek,'Team',c.name+' resigned','The '+(V100_REP_ROLES[role]?.name||'representative')+' left after the working relationship remained at a breaking point.');toast?.(c.name+' resigned from your team.')}
  }else if(c.relationship>10)c.breakingPointWeek=null
 }
}
const V117_accumulateWeekBase=V083_accumulateWeek;
V083_accumulateWeek=function(completed,beforeCash){V117_settleRepRelationships(completed);return V117_accumulateWeekBase(completed,beforeCash)};

/* Relationship-adjusted advisor effectiveness is deliberately small. It never
   changes contract commission or tax law; it only changes systems that already
   consume advisor skill. */
if(typeof V112_forecastUncertainty==='function')V112_forecastUncertainty=function(){
 const bm=V112_businessManager(),cpa=V112_cpa();let spread=.18;
 if(bm)spread-=V117_effectiveSkill(bm)/100*.04;
 if(cpa)spread-=V117_effectiveSkill(cpa)/100*.08;
 return clamp(spread,.04,.18)
};

V100_repTeamPanel=function(){
 const rep=V100_repTeam(),rows=Object.entries(V100_REP_ROLES).map(([id,r])=>{const c=rep.team[id];return `<div class="project-row v117-team-row"><div class="v117-team-copy"><strong>${esc(r.name)}</strong><small>${c?esc(c.name)+' · '+esc(c.marketStyle||c.personality||'Specialist')+(c.commission?' · '+c.commission+'%':''):esc(r.purpose)}</small>${c?V117_relationshipBar(c,true):''}<p>${esc(V100_repAdviceFor(id))}</p></div>${c?`<button class="secondary" type="button" onclick="V117_openRepRelationship('${id}')">Relationship & agreement →</button>`:`<button class="secondary" type="button" onclick="V115_openRoleMarket('${id}')">Browse candidates →</button>`}</div>`}).join('');
 const history=rep.history.slice(0,12).map(x=>`<p><strong>Week ${x.week}</strong> · ${esc(x.name)} · ${x.type==='hired'?'Joined as '+V100_REP_ROLES[x.role].name:x.type==='resigned'?'Resigned as '+V100_REP_ROLES[x.role].name+' · '+esc(x.relationshipLabel||'relationship breakdown'):'Agreement ended · '+esc(x.reason||'New direction')+(x.relationshipLabel?' · Relationship '+esc(x.relationshipLabel):'')+(x.fee?' · '+money(x.fee):'')}</p>`).join('')||'<p>Your hires, departures and termination reasons will appear here.</p>';
 return `<section class="card v108-representation-guide"><span class="eyebrow">REPRESENTATION · PEOPLE, NOT BUFFS</span><h2>Your team now has chemistry.</h2><p>Every representative has a working relationship with you. Check in, trust their plan, show appreciation, challenge them or repair tension. The relationship can improve effective advisor skill—or deteriorate until somebody walks.</p></section><section class="card"><span class="eyebrow">REPRESENTATION 3.0 · YOUR TEAM</span><h2>Skill matters. Chemistry does too.</h2><p>Relationship is separate from the legal contract and compensation. It changes through your interactions and time together; the bar makes that visible.</p>${rows}</section><section class="card v116-market-summary"><span class="eyebrow">REPRESENTATION MARKET</span><h2>The market moves.</h2><p>Each open role shows <strong>4 candidates at a time</strong> from a larger pool. Refresh for a different set, or advance the week and the market rotates automatically.</p><p class="fine">Refreshing is only a search action. It never hires anyone, spends career cash or changes an agreement.</p></section><section class="card"><h2>Team history</h2>${history}</section>`
};
