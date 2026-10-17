/* ENCORE 0.9.12 interaction hotfix — Representation role actions.
   The role rows previously displayed OPEN as a visual tag even though players
   reasonably read it as a tappable control. Turn every open role into a real
   action and provide a focused candidate picker before contract review. */

function V115_roleCandidates(role){
 const rep=V100_repTeam();
 if(rep.team?.[role])return [];
 return V100_REP_CANDIDATES.filter(c=>c.role===role)
}

function V115_reviewCandidate(id){
 const dialog=$('modal');
 if(dialog?.open)dialog.close();
 return V100_reviewRep(id)
}

function V115_openRoleMarket(role){
 const r=V100_REP_ROLES[role];
 if(!r)return false;
 const rep=V100_repTeam(),current=rep.team?.[role];
 if(current){V100_reviewTermination(role);return true}
 const candidates=V115_roleCandidates(role);
 if(!candidates.length){toast?.('No '+r.name+' candidates are available right now.');return false}
 const explainer=typeof V108_repExplanation==='function'?V108_repExplanation(role):`<p>${esc(r.purpose||'Representation specialist.')}</p>`;
 modal(`<span class="eyebrow">REPRESENTATION MARKET · ${esc(r.name.toUpperCase())}</span><h2>Choose who you want to review.</h2>${explainer}<div class="v115-role-candidates">${candidates.map(c=>`<section class="card"><strong>${esc(c.name)}</strong><small>${esc(c.specialty||'General representation')} · ${c.skill}/100 skill</small><p>${esc(c.resume||'')}</p><button class="primary" type="button" onclick="V115_reviewCandidate('${c.id}')">Review role & contract →</button></section>`).join('')}</div><button class="secondary" type="button" onclick="$('modal').close()">Keep looking</button>`);
 return true
}

V100_repTeamPanel=function(){
 const rep=V100_repTeam();
 const rows=Object.entries(V100_REP_ROLES).map(([id,r])=>{
  const c=rep.team[id];
  return `<div class="project-row"><div><strong>${esc(r.name)}</strong><small>${c?esc(c.name)+' · '+(c.commission||0)+'% · '+esc(V100_repScopeLabel(c.scope)):esc(r.purpose)}</small><p>${esc(V100_repAdviceFor(id))}</p></div>${c?`<button class="secondary" type="button" onclick="V100_reviewTermination('${id}')">Review agreement</button>`:`<button class="secondary" type="button" onclick="V115_openRoleMarket('${id}')">Browse candidates →</button>`}</div>`
 }).join('');
 const market=V100_REP_CANDIDATES.filter(c=>!rep.team[c.role]).map(c=>V100_repCandidateCard(c)).join('');
 const history=rep.history.slice(0,12).map(x=>`<p><strong>Week ${x.week}</strong> · ${esc(x.name)} · ${x.type==='hired'?'Joined as '+V100_REP_ROLES[x.role].name:'Agreement ended · '+esc(x.reason||'New direction')+(x.fee?' · '+money(x.fee):'')}</p>`).join('')||'<p>Your hires, departures and termination reasons will appear here.</p>';
 return `<section class="card v108-representation-guide"><span class="eyebrow">REPRESENTATION · HOW THE TEAM WORKS</span><h2>Every representative has a defined job.</h2><p>There are no mystery bonuses here. Tap a role to compare available candidates, then review the exact role, compensation and contract before signing.</p></section><section class="card"><span class="eyebrow">REPRESENTATION 2.0 · YOUR TEAM</span><h2>Advice has a job attached to it.</h2><p>Percentage compensation only applies to the income categories written into that person’s scope. Investments, catalog sales and unrelated assets are excluded unless a future contract explicitly says otherwise.</p>${rows}</section><h2>Representation market</h2>${market}<section class="card"><h2>Team history</h2>${history}</section>`
};
