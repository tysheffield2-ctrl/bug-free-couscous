import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',125021);await h.run('boot()');
h.run(`s.started=true;s.cash=1000000;s.fans=500000;s.reputation=60;s.total=2000000;s.energy=200;`);

assert.equal(h.run("ENCORE_ICON_DESTINATIONS.some(x=>x[0]==='Label HQ'&&x[1]==='Labels'&&x[3]==='Label')"),true,'Label HQ must be a primary icon destination');
assert.match(h.run("V103_menuResults('Label HQ')"),/data-destination="Labels"/);
assert.match(h.run("encoreIcon('Label')"),/class="encore-icon"/);

const form=h.run('V143_songCreationPage()');
for(const token of ['NEW SONG','ARTISTRY','WRITING','STUDIO','CREDITS & SPLITS','SONG CREDITS & SPLITS','+ Songwriter','+ Composer','+ Producer','Rights chain:'])assert.ok(form.includes(token),token+' must live in canonical Song Creation');
assert.ok(!form.includes('Start your next record'),'retired v092 creator must not return through the credits system');
assert.ok(!form.includes('SESSION 01'),'retired session wrapper must not return through the credits system');

h.run(`
 s.studioIdea=ensureStudioIdeaSchema({title:'Paper Trail'});s.studioIdea.credits=[];
 const w=s.world[0],p=s.world[1],c=s.world[2];
 V125_attachCredit(w,'writer',{fee:0,share:20,credited:true,agreement:'accepted',usualFee:0,usualShare:20});
 V125_attachCredit(p,'producer',{fee:500,share:5,credited:true,agreement:'accepted',usualFee:500,usualShare:5});
 V125_attachCredit(c,'composer',{fee:0,share:0,credited:false,agreement:'unauthorized',usualFee:250,usualShare:15});
`);
assert.equal(h.run('V125_compUsed()'),20,'accepted writing plus unauthorized proposed composition should preserve only contracted ownership in the actual pool');
assert.equal(h.run('V125_idea().credits.length'),3);
assert.match(h.run('V125_creditBuilder()'),/YOUR COMPOSITION SHARE/);
assert.match(h.run('V125_creditBuilder()'),/UNAPPROVED/);
assert.ok(h.run('V143_creditCost()')>=500,'canonical New Song total must include accepted contributor fees');

h.run(`
 const clean={id:700,title:'Clean Session',released:1,streams:1000,total:5000,credits:[{id:s.world[3].id,name:s.world[3].name,role:'writer',fee:0,share:10,agreement:'accepted',credited:true,usualShare:10}],features:[{id:s.world[4].id,name:s.world[4].name,fee:0,royaltyRate:.1,agreement:'accepted',credited:true}]};
 s.songs=[clean];
`);
assert.equal(h.run('V124_ctx().creditRisks'),0,'clean documented contributors must not create songwriting lawsuit pressure');
assert.equal(h.run('V124_scores().credit'),0,'generic collaborator count must no longer create credit suits');
assert.equal(h.run('V124_scores().producer'),0,'generic collaborator count must no longer create producer suits');
assert.equal(h.run('V125_creditRoyaltyExpense()'),50,'10% writer split on 1,000 streams at $0.50 should pay $50');

h.run(`
 s.songs[0].credits.push({id:s.world[5].id,name:s.world[5].name,role:'writer',fee:0,share:0,offeredShare:0,agreement:'unauthorized',credited:false,usualShare:25});
 s.songs[0].credits.push({id:s.world[6].id,name:s.world[6].name,role:'producer',fee:0,share:0,agreement:'unauthorized',credited:false,usualShare:6});
`);
assert.equal(h.run('V124_ctx().creditRisks'),1);
assert.equal(h.run('V124_ctx().producerRisks'),1);
assert.ok(h.run('V124_scores().credit')>0&&h.run('V124_scores().producer')>0,'actual broken rights chains should create legal pressure');
assert.equal(h.run("V124_claimant('credit')"),h.run('s.world[5].name'),'credit claimant should be the actual contributor, not a random artist');
assert.match(h.run("V124_triggerDetail('credit',V124_ctx())"),/Clean Session/,'legal cause should name the implicated master');
const risk=h.run("V125_rightsCandidates('credit')[0]");
const lawsuit=h.run("V125_fileRightsSuit(V125_rightsCandidates('credit')[0])");
assert.equal(lawsuit.songId,700);
assert.equal(lawsuit.collaboratorId,risk.credit.id);
assert.equal(lawsuit.plaintiff,risk.credit.name);
assert.equal(lawsuit.matterType,'credit');
assert.ok(lawsuit.triggerDetail.includes('Clean Session'));
assert.equal(h.run(`s.achievements.briefings.some(b=>b.id==='legal-risk:${lawsuit.id}')`),true,'rights lawsuit needs an actionable detailed briefing');

h.run(`s.draft={id:800,title:'Uncleared Feature',steps:3,features:[],credits:[],development:s.development,sessionPlan:{},creative:{}}`);
h.run('V125_useFeatureWithoutClearance(7,false)');
assert.equal(h.run('s.draft.features[0].agreement'),'unauthorized');
assert.equal(h.run('s.draft.features[0].credited'),false);
assert.match(h.run('V125_releaseWarning(s.draft)'),/RIGHTS NOT FULLY CLEARED/);


/* Feature contracts must not bypass shared eligibility, quote terms, or the
   song-level royalty budget. All names and catalog data are fictional. */
h.run(`
 s.fans=1e10;s.reputation=100;s.cash=1000000;s.energy=200;
 s.world[0].relation=90;
 s.draft={id:801,title:'Fictional Collaboration',steps:2,features:[],credits:[],development:s.development};
 $('v125-feature-fee').value='100';
 $('v125-feature-share').value='10';
 $('v125-feature-credit').checked=true;
 Math.random=()=>0;
`);
assert.equal(h.run('accessible(s.world[0])'),true,'fixture artist should be eligible for custom offers');
const initialCash=h.run('s.cash'),initialExpenses=h.run('s.finance.week.expenses'),initialEnergy=h.run('s.energy');
assert.equal(h.run('V144_customFeatureOriginal(0)'),true,'a valid custom deal can be accepted');
assert.equal(h.run('s.draft.features.length'),1);
assert.equal(h.run('s.draft.features[0].royaltyRate'),.10);
assert.equal(h.run('s.draft.features[0].agreement'),'accepted');
assert.equal(h.run('s.cash'),initialCash-100,'upfront fee charged once');
assert.equal(h.run('s.finance.week.expenses'),initialExpenses+100,'fee entered in expense ledger once');
assert.equal(h.run('s.energy'),initialEnergy-5,'accepted custom offer consumes energy once');
const afterFee=h.run('s.cash'),afterEnergy=h.run('s.energy');
assert.equal(h.run('V144_customFeatureOriginal(0)'),false,'cannot accept the same artist twice by resubmitting');
assert.equal(h.run('V125_useFeatureWithoutClearance(0,false)'),false,'unauthorized path cannot double-attach the same artist');
assert.equal(h.run('s.cash'),afterFee);
assert.equal(h.run('s.energy'),afterEnergy);
assert.equal(h.run('s.draft.features.length'),1);

h.run(`s.draft.features=[];s.draft.feature=null;$('v125-feature-fee').value='Infinity';$('v125-feature-share').value='10'`);
assert.equal(h.run('V144_customFeatureOriginal(0)'),false,'non-finite offers are invalid');
h.run(`$('v125-feature-fee').value='100';$('v125-feature-share').value='7.3'`);
assert.equal(h.run('V144_customFeatureOriginal(0)'),false,'unsupported fractional splits are invalid');
assert.equal(h.run('s.cash'),afterFee,'invalid offers do not spend cash');
assert.equal(h.run('s.energy'),afterEnergy,'invalid offers do not spend energy');
h.run(`s.draft.features=[{id:3,name:'Fictional Guest A',royaltyRate:.5},{id:4,name:'Fictional Guest B',royaltyRate:.4}];$('v125-feature-share').value='10'`);
assert.equal(h.run('V092_featureSplitTotal(s.draft)'),.9);
assert.equal(h.run('V144_customFeatureOriginal(0)'),false,'custom deal cannot exceed 90% combined backend');
assert.equal(h.run("V144_quickFeatureOriginal(0,'royalty')"),false,'quick deal uses the same 90% limit');
assert.equal(h.run('s.energy'),afterEnergy,'over-budget deals are rejected before spending energy');
assert.equal(h.run('s.cash'),afterFee,'over-budget deals are rejected before spending cash');
assert.equal(h.run('s.draft.features.length'),2,'rejected offers do not modify the track');

h.run(`s.draft.features=[0,1,2,3,4,5].map(id=>({id,name:'Fictional Guest '+id,royaltyRate:.1}))`);
assert.equal(h.run('V125_useFeatureWithoutClearance(7,false)'),false,'six-guest limit also applies to unauthorized attachment');
assert.equal(h.run('s.draft.features.length'),6);

h.run(`s.draft.features=[];s.draft.feature=null;$('v125-feature-share').value='0';$('v125-feature-fee').value='0';s.world[0].relation=90;Math.random=()=>1`);
const beforeDecline=h.run('s.world[0].relation'),beforeDeclineCash=h.run('s.cash');
assert.equal(h.run('V144_customFeatureOriginal(0)'),false,'unattractive offers can be refused');
assert.equal(h.run('s.world[0].relation'),beforeDecline-1,'failed negotiations affect the future relationship');
assert.equal(h.run('s.cash'),beforeDeclineCash,'refusal never pays an upfront fee');
assert.equal(h.run('s.draft.features.length'),0,'declined deal does not grant a feature');


// Separate composition and master credits must never overcommit new agreements.
h.run(`
 s.studioIdea=ensureStudioIdeaSchema({title:'Fictional Royalty Session'});
 s.studioIdea.credits=[];
 s.draft={id:880,title:'Fictional Royalty Session',features:[],credits:[],development:s.development};
 s.fans=1e10;s.reputation=100;s.energy=200;s.cash=1000000;
 s.world[0].relation=90;s.world[1].relation=90;s.world[2].relation=90;
 $('v125-credit-fee').value='0';$('v125-credit-share').value='25';$('v125-credit-name').checked=true;
 Math.random=()=>0;
`);
assert.equal(h.run("V144_creditOfferOriginal('producer',0)"),true,'producer can agree to 25 master points');
assert.equal(h.run('V125_idea().credits.length'),1);
assert.equal(h.run('V125_idea().credits[0].share'),25);
assert.equal(h.run('V125_masterCommitment(s.draft,V125_idea().credits)'),.25);
assert.equal(h.run('s.world[0].relation'),93,'accepted credit improves persistent artist chemistry');
const paidCash=h.run('s.cash'),paidEnergy=h.run('s.energy');
assert.equal(h.run("V144_creditOfferOriginal('producer',0)"),false,'same contributor cannot sign twice in the same role');
assert.equal(h.run('s.energy'),paidEnergy,'duplicate offer must not consume energy');
assert.equal(h.run('s.cash'),paidCash,'duplicate offer must not create charges');
h.run(`s.draft.features=[{id:11,name:'Fictional Guest',royaltyRate:.5}];$('v125-credit-share').value='20'`);
assert.equal(h.run("V144_creditOfferOriginal('producer',1)"),false,'master producer points must share cap with booked features');
h.run('s.draft.credits=V125_idea().credits.map(x=>({...x}))'); // A created master carries its accepted studio credits.
assert.equal(h.run('V092_featureSplitFits(s.draft,.15)'),true,'15% more fits 90% including producer points');
assert.equal(h.run('V092_featureSplitFits(s.draft,.20)'),false,'20% more would exceed 90% master rights');
assert.equal(h.run('V125_idea().credits.length'),1);
h.run(`s.draft.features=[];s.studioIdea.credits=[{id:10,name:'Fictional Writer',role:'writer',share:95,agreement:'accepted',credited:true}];$('v125-credit-share').value='10'`);
assert.equal(h.run("V144_creditOfferOriginal('composer',2)"),false,'composition ownership cannot exceed 100%');
h.run(`$('v125-credit-share').value='5'`);
assert.equal(h.run("V144_creditOfferOriginal('composer',2)"),true,'composition ownership may reach exactly 100%');
assert.equal(h.run('V125_compUsed()'),100);
h.run(`$('v125-credit-share').value='Infinity'`);
assert.equal(h.run("V144_creditOfferOriginal('writer',1)"),false,'non-finite composition shares rejected');
h.run(`$('v125-credit-share').value='5.1'`);
assert.equal(h.run("V144_creditOfferOriginal('writer',1)"),false,'unsupported share precision rejected');
h.run(`$('v125-credit-share').value='5';$('v125-credit-fee').value='-1'`);
assert.equal(h.run("V144_creditOfferOriginal('writer',1)"),false,'negative fee rejected');
assert.equal(h.run('V125_idea().credits.length'),2);

h.run(`
 s.songs=[
  {id:900,title:'Fictional Paid Master',released:1,streams:1000,credits:[
   {id:0,role:'writer',share:10,agreement:'accepted'},
   {id:1,role:'composer',share:10,agreement:'accepted'},
   {id:2,role:'producer',share:5,agreement:'accepted'},
   {id:3,role:'writer',share:10,agreement:'unauthorized'}
  ]},
  {id:901,title:'Fictional Unreleased',released:0,streams:2000,credits:[{id:4,role:'writer',share:50,agreement:'accepted'}]}
 ];
`);
const royalty=h.run('V125_creditRoyaltyBreakdown()');
assert.equal(royalty.composition,100,'writer and composer split their 20% composition share');
assert.equal(royalty.producer,25,'producer 5% share is separately attributed to master');
assert.equal(royalty.total,125,'unreleased and unauthorized credits generate no paid royalties');
assert.equal(h.run('V125_creditRoyaltyExpense()'),125,'finance charge uses the same single breakdown');
h.run("s.songs[0].streams=0");
assert.equal(h.run('V125_creditRoyaltyExpense()'),0,'zero streams do not incur royalties');
h.run("s.songs[0].streams=NaN");
assert.equal(h.run('V125_creditRoyaltyExpense()'),0,'invalid saved stream counts do not incur royalties');

const js=fs.readFileSync(new URL('../src/v125-collaboration-splits.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v125-collaboration-splits.css',import.meta.url),'utf8');
const build=fs.readFileSync(new URL('../build.mjs',import.meta.url),'utf8');
for(const token of ['V125_openCreditTerms','V125_sendCreditOffer','V125_offerFeature','V125_useFeatureWithoutClearance','V125_rightsDiscoveryWeek','V125_fileRightsSuit'])assert.ok(js.includes(token));
assert.ok(css.includes('.v125-splits')&&css.includes('.v125-release-risk'));
assert.ok(build.includes("'v125-collaboration-splits'"));
assert.ok(build.includes("name==='v125-collaboration-splits'"),'production build must strip the retired v092 form wrapper while keeping rights-chain gameplay');
console.log('PASS rights-chain depth remains wired through canonical v143 Song Creation: songwriter/composer/producer terms, manual splits, feature terms, release risk, song-specific lawsuits and accepted royalty payouts remain covered.');
