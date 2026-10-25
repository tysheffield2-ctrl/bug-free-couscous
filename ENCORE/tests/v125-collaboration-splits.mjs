import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',125021);await h.run('boot()');
h.run(`s.started=true;s.cash=1000000;s.fans=500000;s.reputation=60;s.total=2000000;s.energy=200;`);

assert.equal(h.run("ENCORE_ICON_DESTINATIONS.some(x=>x[0]==='Label HQ'&&x[1]==='Labels'&&x[3]==='Label')"),true,'Label HQ must be a primary icon destination');
assert.match(h.run("V103_menuResults('Label HQ')"),/data-destination="Labels"/);
assert.match(h.run("encoreIcon('Label')"),/class="encore-icon"/);

const form=h.run('V092_unifiedSongForm()');
for(const token of ['>Song<','>Features<','>Mood<'])assert.ok(form.includes(token),token+' should remain visible in simple Studio creation');
for(const token of ['SONG CREDITS & SPLITS','+ Songwriter','+ Composer','+ Producer','Rights chain:'])assert.ok(!form.includes(token),token+' should stay out of the simple Studio creation form');

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

const js=fs.readFileSync(new URL('../src/v125-collaboration-splits.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v125-collaboration-splits.css',import.meta.url),'utf8');
const build=fs.readFileSync(new URL('../build.mjs',import.meta.url),'utf8');
for(const token of ['V125_openCreditTerms','V125_sendCreditOffer','V125_offerFeature','V125_useFeatureWithoutClearance','V125_rightsDiscoveryWeek','V125_fileRightsSuit'])assert.ok(js.includes(token));
assert.ok(css.includes('.v125-splits')&&css.includes('.v125-release-risk'));
assert.ok(build.includes("'v125-collaboration-splits'"));
console.log('PASS rights-chain depth remains wired while simple Studio creation stays Song / Features / Mood; songwriter/composer/producer terms, manual splits, feature terms, release risk, song-specific lawsuits and accepted royalty payouts remain covered.');
