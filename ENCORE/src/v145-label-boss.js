/* ENCORE Label Boss — an expansion of the existing owned-label economy.
 * No parallel NPC roster, music charts, release royalties or independent wallet.
 * Opt-in state is created only on visiting Label Boss or taking a label action. */
const V145_ROLES={
 manager:{name:'Label manager',salary:1500,legacy:true,purpose:'Expands roster capacity and coordinates management'},
 ar:{name:'A&R scout',salary:1000,legacy:true,purpose:'Delivers qualified artist prospects'},
 development:{name:'Artist development coach',salary:1800,purpose:'Develops signed artists and improves musical ability'},
 producer:{name:'Staff producer',salary:2200,purpose:'Records and completes roster masters'},
 marketing:{name:'Marketing team',salary:2500,legacy:true,purpose:'Prepares campaigns and release plans'}
};
const V145_NAMES=['Mara Vale','Jonah Cruz','Iris Mercer','Alden Brooks','Nina Ward','Kellan Reed','Lena Hart','Omar Blake','Casey Moon','Drew Fields','Sage Rowan','Miles Park','Rae Collins','Ari Porter','Tessa Lyon'];
const V145_STAGES={development:{role:'development',weeks:2,next:'recording'},recording:{role:'producer',weeks:2,next:'campaign'},campaign:{role:'marketing',weeks:1,next:'ready'}};
function V145_read(){return s.labelBusiness?.company?.boss||null}
function V145_state(){
 const co=s.labelBusiness?.company;if(!co)return null;
 if(!co.boss||typeof co.boss!=='object')co.boss={version:1,team:{},projects:[],prospects:[],approvals:'manual',nextId:1,lastProgressWeek:0,lastStatementWeek:0,unfundedWeeks:0,statements:[],history:[],totalInvested:0};
 const b=co.boss;
 b.team??={};b.projects??=[];b.prospects??=[];b.statements??=[];b.history??=[];
 b.approvals=b.approvals==='delegated'?'delegated':'manual';
 return b
}
function V145_note(kind,message){
 const b=V145_state();if(!b)return;
 b.history.unshift({week:s.week,kind,text:String(message)});b.history=b.history.slice(0,50);
}
function V145_staff(role){
 if(!V145_ROLES[role]||!s.labelBusiness?.company)return false;
 return V145_ROLES[role].legacy?!!s.labelBusiness.company.staff?.[role]:!!V145_read()?.team?.[role]
}
function V145_candidate(role,index=0){
 if(!V145_ROLES[role]||!Number.isInteger(index)||index<0||index>2)return null;
 const seed=String(role).split('').reduce((n,c)=>n+c.charCodeAt(0),0)+(s.labelBusiness?.company?.started||1);
 return {id:role+'-'+index,name:V145_NAMES[(seed+index*3)%V145_NAMES.length],role,skill:48+index*14,fee:[0,1500,4000][index],salary:V145_ROLES[role].salary};
}
function V145_extras(){const b=V145_read();return b?['development','producer'].reduce((n,k)=>n+(b.team?.[k]?V145_ROLES[k].salary:0),0):0}
function V145_payroll(){return labelPayroll()+V145_extras()}
function V145_reviewHire(role,index=0){
 const c=V145_candidate(role,index),co=s.labelBusiness?.company;
 if(!labelActive()||!co||!c||V145_staff(role))return false;
 return V144_mount({kind:'label-staff',counterparty:c.name,signer:s.name,documentTitle:c.name+' · '+V145_ROLES[role].name+' Employment Agreement',
  summaryTitle:'Compensation and role',summaryHtml:profileRows([['Position',V145_ROLES[role].name],['Skill',c.skill+'/100'],['Signing bonus',money(c.fee)],['Weekly salary',money(c.salary)],['Energy at hiring','5']]),
  pages:[{title:'Duties',body:c.name+' will serve as '+V145_ROLES[role].name+' for '+co.name+'. '+V145_ROLES[role].purpose+'.'},
   {title:'Compensation and working conditions',body:'The player pays a one-time '+money(c.fee)+' signing bonus and '+money(c.salary)+' for each funded active employment week. If total payroll is unavailable, operations pause and no unpaid work is performed. Either party may terminate employment; completed weeks remain recorded.'},
   {title:'Enforcement',body:'Agreed payments, earned compensation, authorized work and proper termination may create civil disputes if breached. This is a simulated contract, not a real employment agreement.'}],
  amount:c.fee,payer:'player',payee:'counterparty',basis:money(c.salary)+'/week conditional payroll',reference:{type:'label-staff',id:c.id},
  obligations:[{type:'hire',amount:c.fee,due:'at execution'},{type:'salary',amount:c.salary,due:'weekly when staff are funded'}],
  execute:()=>{
   const b=V145_state();if(!b||V145_staff(role)||!spend(5,c.fee))return false;
   if(V145_ROLES[role].legacy)co.staff[role]=true;
   b.team[role]={...c,hiredWeek:s.week,morale:80};
   V145_note('hire',c.name+' joined as '+V145_ROLES[role].name);
   queueSave?.();return true
  }})
}
function V145_fire(role){
 const b=V145_read(),co=s.labelBusiness?.company;
 if(!labelActive()||!b||!co||!V145_staff(role)||!V145_ROLES[role])return false;
 if(role==='manager'&&ownerContracts().length>3){toast('An active roster above three requires the label manager.');return false}
 if(!spend(5))return false;
 const person=b.team[role]?.name||V145_ROLES[role].name;
 if(V145_ROLES[role].legacy)co.staff[role]=false;
 const record=b.team[role];delete b.team[role];
 if(record){const signed=s.v144?.agreements?.find(x=>x.kind==='label-staff'&&x.reference?.id===record.id);if(signed){signed.status='terminated';signed.history.unshift({week:s.week,kind:'termination',detail:'Employment ended by the label'})}}
 V145_note('exit',person+' left the label');queueSave?.();render?.();return true
}
function V145_scout(){
 const co=s.labelBusiness?.company,b=V145_read();if(!co||!b||!V145_staff('ar')||!co.staffFunded)return false;
 const roster=new Set(ownerContracts().map(c=>c.artist));
 const pool=(s.world||[]).filter(a=>a&&a.aiCareer?.status!=='retired'&&!roster.has(a.id)&&a.relation>-40);
 pool.sort((a,c)=>(Number(c.skill)||0)+(Number(c.relation)||0)*.25+(Math.log10(1+Number(c.fans)||0))*6-
 ((Number(a.skill)||0)+(Number(a.relation)||0)*.25+(Math.log10(1+Number(a.fans)||0))*6));
 const offset=Math.floor(s.week/4)%Math.max(1,pool.length);
 b.prospects=pool.slice(offset,offset+8).map(a=>a.id);
 if(b.prospects.length<8)b.prospects.push(...pool.slice(0,8-b.prospects.length).map(a=>a.id));
 b.scoutedWeek=s.week;V145_note('scout','A&R delivered '+b.prospects.length+' prospects');
 return true
}
function V145_assignProject(artistId){
 const id=Number(artistId),co=s.labelBusiness?.company,b=V145_read(),c=ownerContracts().find(c=>c.artist===id),a=s.world?.[id];
 if(!labelActive()||!co||!b||!c||!a||a.aiCareer?.status==='retired'||b.projects.some(p=>p.artist===id&&!['released','cancelled'].includes(p.status)))return false;
 const budget=4000;if(!spend(5,budget))return false;
 const p={id:b.nextId++,artist:id,title:generate('song'),stage:'development',progress:0,status:'active',spent:budget,createdWeek:s.week,quality:0,pausedWeeks:0};
 b.projects.unshift(p);b.projects=b.projects.slice(0,48);b.totalInvested=cents((b.totalInvested||0)+budget);
 V145_note('project','Commissioned '+p.title+' for '+a.name+' at '+money(budget));
 moneyEvent?.('Label studio project · '+a.name,-budget);
 queueSave?.();render?.();return true
}
function V145_release(p,auto=false){
 const co=s.labelBusiness?.company,b=V145_read(),a=s.world?.[p.artist];
 if(!co||!b||p.status!=='ready'||!a||!ownerContracts().some(c=>c.artist===p.artist)||a.aiCareer?.status==='retired')return false;
 if(a.catalog.some(x=>x.week===s.week&&x.labelBossProject))return false;
 const skill=Number(a.skill)||40,quality=clamp(Math.round(p.quality||skill),10,100);
 const factor=clamp(reception(quality),.2,4),base=Math.max(50,Math.round((Number(a.fans)||0)*(.35+quality/200)));
 const streams=Math.max(1,Math.round(base*factor));
 a.nextCatalogId=Math.max(1,Number(a.nextCatalogId)||1);
 const track={uid:a.nextCatalogId++,title:p.title,type:'Single',week:s.week,base,streams,total:streams,factor,labelBossProject:p.id,quality};
 a.catalog.push(track);a.weekly=(Number(a.weekly)||0)+streams;
 a.fans=Math.max(0,Math.round((Number(a.fans)||0)+streams*.009/(1+(Number(a.fans)||0)/250000000)));
 a.nextRelease=Math.max(Number(a.nextRelease)||0,s.week+4);
 s.feed?.unshift({name:a.name,title:track.title,type:'Single',week:s.week,tier:tierNames[tier(a.fans)],streams,result:outcome(factor)});
 p.status='released';p.stage='released';p.releasedWeek=s.week;p.streams=streams;p.quality=quality;
 V145_note('release',a.name+' released '+p.title+' ('+(auto?'delegated':'CEO approval')+')');
 addBriefing?.('label-boss-release:'+p.id,'Business',a.name+' released '+p.title,compact(streams)+' debut streams. Your label share settles through the existing royalty engine.');
 queueSave?.();return true
}
function V145_approve(projectId){
 const p=V145_read()?.projects?.find(x=>x.id===Number(projectId));
 if(!p||p.status!=='ready'||!labelActive())return false;
 const result=V145_release(p,false);if(result)render?.();return result
}
function V145_setApproval(mode){
 const b=V145_state();if(!b||!labelActive()||!['manual','delegated'].includes(mode))return false;
 b.approvals=mode;V145_note('policy','Release approval set to '+mode);
 if(mode==='delegated')for(const p of b.projects.filter(p=>p.status==='ready'))V145_release(p,true);
 queueSave?.();render?.();return true
}
function V145_prepareWeek(){
 const co=s.labelBusiness?.company,b=V145_read();if(!co||!b||co.preparedWeek===s.week)return V145_prepareBase();
 const total=V145_payroll();
 if(s.cash<total){
  co.preparedWeek=s.week;co.staffFunded=false;co.payrollThisWeek=0;b.unfundedWeeks=(b.unfundedWeeks||0)+1;
  V145_note('payroll','Operations paused: '+money(total)+' payroll not funded');
  log('Label Boss staff paused for unfunded weekly payroll.');
  return;
 }
 V145_prepareBase();
 const extra=V145_extras();
 if(extra&&co.staffFunded){
  changeCash(-extra);s.finance.week.expenses=cents((Number(s.finance.week.expenses)||0)+extra);
  s.finance.week.labelPayroll=cents((Number(s.finance.week.labelPayroll)||0)+extra);
  co.payrollThisWeek=cents((Number(co.payrollThisWeek)||0)+extra)
 }
 b.unfundedWeeks=0
}
function V145_advanceProjects(){
 const co=s.labelBusiness?.company,b=V145_read();if(!co||!b||b.lastProgressWeek===s.week)return;
 b.lastProgressWeek=s.week;
 if(co.preparedWeek!==s.week||!co.staffFunded){
  for(const p of b.projects)if(p.status==='active')p.pausedWeeks=(p.pausedWeeks||0)+1;
  return
 }
 if(V145_staff('ar')&&(!b.scoutedWeek||s.week-b.scoutedWeek>=4))V145_scout();
 for(const p of b.projects){
  if(p.status!=='active')continue;
  const c=ownerContracts().find(x=>x.artist===p.artist),a=s.world?.[p.artist];
  if(!c||!a||a.aiCareer?.status==='retired'){p.status='cancelled';p.reason='Artist contract expired or artist unavailable';V145_note('project',p.title+' paused permanently: artist unavailable');continue}
  const stage=V145_STAGES[p.stage];if(!stage)continue;
  if(!V145_staff(stage.role)){p.pausedWeeks=(p.pausedWeeks||0)+1;continue}
  const specialist=b.team[stage.role],speed=1+(specialist?.skill>=76?1:0);
  p.progress+=speed;p.pausedWeeks=0;
  if(p.progress<stage.weeks)continue;
  if(p.stage==='development'){
   a.skill=clamp((Number(a.skill)||40)+Math.max(1,Math.round((specialist?.skill||60)/40)),0,100);
  }else if(p.stage==='recording')p.quality=clamp(Math.round((Number(a.skill)||50)*.7+(specialist?.skill||60)*.3),10,100);
  p.stage=stage.next;p.progress=0;
  V145_note('project',p.title+' progressed to '+p.stage);
  if(p.stage==='ready'){p.status='ready';p.readyWeek=s.week;if(b.approvals==='delegated')V145_release(p,true)}
 }
 if(b.approvals==='delegated')for(const p of b.projects.filter(x=>x.status==='ready'))V145_release(p,true);
}
function V145_finishWeek(){
 const co=s.labelBusiness?.company,b=V145_read();if(!co||!b)return V145_settleBase();
 if(b.lastProgressWeek!==s.week)V145_advanceProjects();
 const result=V145_settleBase();
 if(co.settledWeek===s.week&&b.lastStatementWeek!==s.week){
  b.lastStatementWeek=s.week;
  const statement={week:s.week,receipts:cents(co.last?.income||0),payroll:cents(co.last?.payroll||0),recording:cents(co.last?.recording||0),live:cents(co.last?.other||0)};
  statement.net=cents(statement.receipts-statement.payroll);
  b.statements.unshift(statement);b.statements=b.statements.slice(0,52);
 }
 return result
}
const V145_prepareBase=prepareLabelWeek;prepareLabelWeek=V145_prepareWeek;
const V145_settleBase=settleLabelWeek;settleLabelWeek=V145_finishWeek;
