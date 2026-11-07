/* The approved white-row UI is unchanged; only Label Boss pages are added. */
Object.assign(EUI,{
 labelArtistId:null,
 labelBoss(){
  migrateLabelBusiness();const co=s.labelBusiness?.company;
  if(!co){const r=executiveReadiness();return '<section class="core-summary"><span>Optional career expansion</span><h1>Label Boss</h1><p>Become a recording-company CEO while keeping your artist career.</p></section>'+profileRows([['Formation fee',money(25000)],['Energy',10],['Eligibility',r.ready?'Qualified':'Locked']])+(r.ready?'<button class="core-primary" onclick="foundLabelForm()">Found a label</button>':'<p class="core-note">'+r.missing.map(esc).join(' · ')+'</p>')+'<p class="core-note">Existing artist milestones unlock this expansion. Sandbox still uses the existing relaxed requirements.</p>'}
  const b=V145_state(),active=b.projects.filter(p=>['active','ready'].includes(p.status));
  return '<section class="core-summary"><span>Record company · CEO mode</span><h1>'+esc(co.name)+'</h1><p>'+ownerContracts().length+' / '+labelCapacity()+' artists · '+active.length+' projects · '+money(V145_payroll())+'/week payroll</p></section>'+
  profileRows([['Career cash (shared)',money(s.cash)],['Lifetime label receipts',money(co.receipts)],['Studio projects',active.length],['Next payroll',money(V145_payroll())]])+
  '<div class="core-list">'+
  EUI.row('people','A&R and scouting',b.prospects.length+' industry prospects',"go('LabelScouting')")+
  EUI.row('album','Roster and production','Develop artists, finish masters and release',"go('LabelRoster')")+
  EUI.row('people','Staff and payroll','Hire producers, coaches and marketers',"go('LabelStaff')")+
  EUI.row('chart','Label finances','Weekly statements and project investments',"go('LabelFinance')")+
  '</div><h2>Release authority</h2><p class="core-note">CEO approval holds finished masters. Delegated approval releases them when production is completed.</p>'+
  '<div class="core-quick"><button '+(b.approvals==='manual'?'disabled':'')+' onclick="V145_setApproval(\'manual\')">CEO approval</button><button '+(b.approvals==='delegated'?'disabled':'')+' onclick="V145_setApproval(\'delegated\')">Delegate releases</button></div>'+
  '<h2>Recent label activity</h2>'+(b.history.slice(0,5).map(x=>'<p class="core-history"><small>Week '+x.week+'</small>'+esc(x.text)+'</p>').join('')||EUI.empty('Sign artists and hire your staff to start operating.'));
 },
 labelScouting(){
  const b=V145_read();if(!b)return EUI.empty('Form a record label first.');
  if(!V145_staff('ar'))return '<p class="core-note">Hire an A&R scout to find and evaluate prospects.</p>'+EUI.row('people','Recruit a scout','An executed employment agreement is required',"go('LabelStaff')");
  const candidates=b.prospects.map(id=>s.world?.[id]).filter(a=>a&&!ownerContracts().some(c=>c.artist===a.id));
  return '<p class="core-note">A&R delivers candidates every four fully funded weeks. Signing is negotiated through ENCORE’s existing artist-contract engine.</p><h2>Prospects <small>'+candidates.length+'</small></h2><div class="core-list">'+
   (candidates.map(a=>{const report=b.scoutingReports?.[a.id];const range=report?' · A&R estimates '+report.min+'–'+report.max+' / 100 · '+report.confidence+'% confidence':' · Awaiting A&R evaluation';return EUI.row('people',a.name,esc(a.genre)+' · '+compact(a.fans)+' fans'+range,'rosterOfferForm('+a.id+')')}).join('')||EUI.empty('Advance one funded week for the first scouting report.'))+'</div>';
 },
 labelRoster(){
  const b=V145_read();if(!b)return EUI.empty('Form a label first.');
  return '<p class="core-note">Commission masters for signed artists. A development coach, producer and marketing team are needed to finish each project.</p>'+
   '<h2>Active roster <small>'+ownerContracts().length+' / '+labelCapacity()+'</small></h2><div class="core-list">'+
   (ownerContracts().map(c=>{const a=s.world?.[c.artist];if(!a)return '';const p=b.projects.find(x=>x.artist===c.artist&&['active','ready'].includes(x.status));return EUI.row('people',a.name,p?p.title+' · '+p.stage:'No current recording · Contract ends Week '+c.ends,'EUI.openLabelArtist('+c.artist+')')}).join('')||EUI.empty('Sign an artist from A&R and scouting.'))+
   '</div><h2>Completed label releases</h2><div class="core-list">'+
   (b.projects.filter(p=>p.status==='released').slice(0,8).map(p=>EUI.row('song',p.title,'Week '+p.releasedWeek+' · '+compact(p.streams||0)+' debut streams','EUI.openLabelArtist('+p.artist+')')).join('')||EUI.empty('No CEO-managed releases yet.'))+'</div>';
 },
 openLabelArtist(id){if(!s.world?.[id])return;EUI.remember();EUI.labelArtistId=Number(id);tab='LabelArtist';EUI.current=null;render();window.scrollTo?.(0,0)},
 labelArtist(){
  const id=EUI.labelArtistId,b=V145_read(),a=s.world?.[id],c=ownerContracts().find(x=>x.artist===id);
  if(!a||!b||!c)return EUI.empty('The artist is no longer on your active roster.');
  const p=b.projects.find(x=>x.artist===id&&['active','ready'].includes(x.status));
  const team=['development','producer','marketing'].map(k=>V145_ROLES[k].name+': '+(V145_staff(k)?'hired':'missing')).join(' · ');
  return '<section class="core-summary"><span>Artist development</span><h1>'+esc(a.name)+'</h1><p>'+esc(a.genre)+' · '+compact(a.fans)+' fans · Skill '+Math.round(a.skill||0)+'/100</p></section>'+
   profileRows([['Contract ends','Week '+c.ends],['Label share',(c.share*100).toFixed(0)+'%'],['Label receipts',money(c.receipts)],['Team readiness',team]])+
   (p?'<h2>'+esc(p.title)+'</h2>'+profileRows([['Stage',p.stage],['Progress',p.stage==='ready'?'Awaiting authorization':p.progress+' / '+(V145_STAGES[p.stage]?.weeks||1)+' funded weeks'],['Studio investment',money(p.spent)],['Weeks stalled',p.pausedWeeks||0]])+(p.status==='ready'?'<button class="core-primary" onclick="V145_approve('+p.id+')">Approve & release</button>':'<p class="core-note">Work advances at week close if the required department and total payroll are funded.</p>'):
   '<p class="core-note">No active project. A studio commission costs '+money(4000)+' and 5 energy.</p><button class="core-primary" onclick="V145_assignProject('+id+')">Commission a single</button>')+
   '<h2>Artist catalog</h2><div class="core-list">'+(a.catalog||[]).slice(-6).reverse().map(x=>EUI.row('song',x.title,'Week '+x.week+' · '+compact(x.total||0)+' streams',"go('LabelRoster')")).join('')+'</div>';
 },
 labelStaff(){
  const b=V145_read();if(!b)return EUI.empty('Form a label first.');
  return '<section class="core-summary"><span>Departments and operations</span><h1>Staff</h1><p>One drawn signature for paid employment. No funded payroll means no department work that week.</p></section>'+
   profileRows([['Weekly salary obligations',money(V145_payroll())],['Cash available',money(s.cash)],['Last payroll',s.labelBusiness.company.staffFunded?'Funded':'Paused'],['Unfunded weeks',b.unfundedWeeks||0]])+
   Object.entries(V145_ROLES).map(([role,info])=>{
    const hired=V145_staff(role),worker=b.team[role];
    return '<h2>'+esc(info.name)+'</h2><p class="core-note">'+esc(info.purpose)+' · '+money(info.salary)+'/week'+(hired?' · '+esc(worker?.name||'Existing employee'):'')+'</p>'+
    (hired?'<button class="core-secondary" onclick="V145_fire(\''+role+'\')">End employment · 5 energy</button>':'<div class="core-list">'+[0,1,2].map(i=>{const c=V145_candidate(role,i);return EUI.row('people',c.name,'Skill '+c.skill+'/100 · Signing bonus '+money(c.fee),"V145_reviewHire('"+role+"',"+i+")")}).join('')+'</div>');
   }).join('');
 },
 labelFinance(){
  const co=s.labelBusiness?.company,b=V145_read();if(!co||!b)return EUI.empty('Form a label first.');
  return '<p class="core-note">This is a separate departmental statement, not a separate bank account. Cash and payroll settle in the existing artist-career wallet exactly once.</p>'+
   profileRows([['Label receipts',money(co.receipts)],['Studio budgets paid',money(b.totalInvested||0)],['Weekly payroll',money(V145_payroll())],['Statement history',b.statements.length]])+
   '<h2>Weekly statements</h2><div class="core-list">'+(b.statements.slice(0,16).map(x=>EUI.row('chart','Week '+x.week,'Receipts '+money(x.receipts)+' · Payroll '+money(x.payroll)+' · Studio '+money(x.production||0)+' · Net '+money(x.net),"go('LabelFinance')")).join('')||EUI.empty('Close a week to receive a statement.'))+'</div>';
 }
});
const V145_moreOriginal=EUI.more;
EUI.more=function(){
 const html=V145_moreOriginal(),link=EUI.row('catalog','Label Boss',s.labelBusiness?.company?'Operate your record company':'Unlock record-label ownership',"go('LabelBoss')");
 return html.replace('<div class="core-list">','<div class="core-list">'+link)
  .replace('Investments, shopping and business expansion remain on hold in the focused interface.','Investments and shopping remain on hold in the focused interface. Label Boss is an optional career expansion.');
};
