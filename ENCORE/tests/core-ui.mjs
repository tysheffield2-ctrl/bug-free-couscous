import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';
const shell=fs.readFileSync('dist/native-shell.js','utf8');
function game(path='/sandbox'){
 const h=harness(path);h.c.requestAnimationFrame=f=>f();
 h.c.FormData=class{constructor(v={}){this.v={...v}}get(k){return this.v[k]??null}getAll(k){const v=this.v[k];return Array.isArray(v)?v:v==null?[]:[v]}set(k,v){this.v[k]=v}append(k,v){this.v[k]=[...this.getAll(k),v]}};
 h.run('saveReady=true;titleVisible=false;s.started=true;s.songs=[];s.albums=[];s.draft=null;s.projects=[];s.week=1;applyStartingBackground("Bedroom artist");');h.run(shell);h.run('V137_installShell();');return h;
}
const h=game();
for(const page of Object.keys(h.run('EUI.titles'))){h.run(`go('${page}');render()`);assert.ok(h.elements.app.innerHTML.length>100,page)}
// A render never schedules or opens an unsolicited announcement.
h.run(`go('Home');s.achievements.popups=true;s.achievements.briefings.push({id:'test',title:'Test',body:'test',read:false});render();scheduleBriefing();V096_priorityPopup()`);
assert.equal(h.elements.modal.open,false);
h.run(`EUI.history=[];EUI.current=null;tab='Songs';render();go('Create');EUI.captureSong({songtitle:'Afterglow',mood:directions[2].id,package:'0'});EUI.back();go('Create')`);
assert.match(h.elements.app.innerHTML,/value="Afterglow"/);assert.equal(h.run('s.studioIdea.mood'),h.run('directions[2].id'));
// Start, park, resume, finish and release through the retained simulation commands.
h.run(`newSong({preventDefault(){},target:{songtitle:s.studioIdea.title,mood:s.studioIdea.mood,package:'0',brief:'story'}})`);
assert.equal(h.elements.modal.open,false,'writing without a feature must not open a negotiation');assert.equal(h.run('s.draft.title'),'Afterglow');assert.equal(h.run('s.energy'),190);
h.run(`parkProject();resumeProject(s.projects[0].id);progressSong();progressSong()`);assert.equal(h.run('s.draft.steps'),3);
h.run(`EUI.reviewSingle();`);assert.equal(h.elements.modal.open,true);assert.match(h.elements.modal.innerHTML,/Publish single/);
h.run(`$('modal').close();finishSong(true,true);go('Songs')`);assert.equal(h.run('s.songs.length'),1);assert.equal(h.run('s.songs[0].released'),1);assert.match(h.elements.app.innerHTML,/Afterglow/);
// Features: quote + fees, guest persistence, and no main page replaced by a profile.
h.run(`s.energy=200;changeCash(100000);newSong({preventDefault(){},target:{songtitle:'Duet',mood:directions[0].id,package:'0'}});s.reputation=100;s.fans=1000000;const guest=s.world[23];guest.relation=100;go('Features');bookFeature(23,true);`);
assert.ok(h.run('guestList(s.draft).some(x=>x.id===23)'));
h.run(`$('modal').close();parkProject();resumeProject(s.projects[0].id)`);assert.ok(h.run('guestList(s.draft).some(x=>x.id===23)'));
h.run('progressSong();progressSong();finishSong(false)');
for(const title of ['Northbound','Silver Hours'])h.run(`s.energy=200;newSong({preventDefault(){},target:{songtitle:${JSON.stringify(title)},mood:directions[0].id,package:'0'}});progressSong();progressSong();finishSong(false)`);
h.run(`profile(23)`);assert.match(h.elements.modal.innerHTML,/Feature requirements/);assert.doesNotMatch(h.elements.modal.innerHTML,/Career intelligence|WEALTH TALK/);h.run(`$('modal').close()`);
// Album draft and explicit sequence survive save serialization, navigation, and publishing.
h.run(`go('AlbumEdit');EUI.captureAlbum({albumtitle:'Late Light',price:'15'});s.songs.slice(1).forEach(x=>EUI.track(x.id,true));EUI.moveTrack(s.songs[3].id,-1);`);
const order=JSON.parse(h.run('JSON.stringify(s.coreAlbumDraft.tracks)'));assert.equal(order.length,3);
const state=h.run('JSON.stringify(saveBundle())');h.run(`s=validateBundle(JSON.parse(${JSON.stringify(state)}));go('Home');go('AlbumEdit')`);
assert.match(h.elements.app.innerHTML,/Late Light/);assert.deepEqual(JSON.parse(h.run('JSON.stringify(s.coreAlbumDraft.tracks)')),order);
h.run('EUI.publishAlbum()');assert.equal(h.run('s.albums.length'),1);assert.deepEqual(JSON.parse(h.run('JSON.stringify(s.albums[0].tracks)')),order);assert.equal(h.run('s.coreAlbumDraft.title'),'');
h.run('EUI.publishAlbum()');assert.equal(h.run('s.albums.length'),1,'double submit must not duplicate album');
// Invalid/low-resource actions leave the draft usable.
h.run(`go('Create');s.energy=0;newSong({preventDefault(){},target:{songtitle:'No energy',mood:directions[0].id,package:'0'}})`);assert.equal(h.run('s.draft'),null);
// Tour: add, edit, launch, settle, keep record.
h.run(`s.energy=200;changeCash(1000000);go('Tours');saveTourStop({preventDefault(){},target:{city:s.careerWorld.currentCity,week:String(s.week),venue:'4',price:'20',vip:'0',production:'0',security:'0',opener:''}});reviewWorldTour();confirmWorldTour();`);
assert.ok(h.run('!!activeTour()'));assert.equal(h.run('s.liveTour.route.length'),1);
h.run('settleWorldTour()');assert.equal(h.run('s.liveTour.route[0].status'),'played');assert.ok(h.run('s.careerRecords.tours.length>0'));
h.run(`go('ArtistFile')`);assert.match(h.elements.app.innerHTML,/v138-artist-file/);assert.doesNotMatch(h.elements.app.innerHTML,/V137_openContracts/);
h.run(`go('Menu')`);assert.match(h.elements.app.innerHTML,/sandboxEditor\(\)/);
const normal=game('/');normal.run(`go('Menu')`);assert.doesNotMatch(normal.elements.app.innerHTML,/onclick="sandboxEditor/);assert.match(normal.elements.app.innerHTML,/Open separate sandbox/);
// Same modal instance, backed navigation, and complete close.
h.run(`modal('<h2>First</h2>');modal('<h2>Second</h2>');EUI.dialogBack()`);assert.match(h.elements.modal.innerHTML,/First/);h.run(`$('modal').close()`);assert.equal(h.elements.modal.open,false);assert.equal(h.run('EUI.dialogHistory.length'),0);
// Appearance is a routed screen with explicit save/discard, never an extra overlay.
h.run(`go('ArtistFile');V129_open();V129_draft.skin=4;EUI.saveAppearance()`);assert.equal(h.run('s.appearance.skin'),4);assert.equal(h.run('tab'),'ArtistFile');
const exported=h.run('JSON.stringify(saveBundle())');h.run(`validateBundle(JSON.parse(${JSON.stringify(exported)}))`);

// Restored Charts uses only saved issues: no speculative rankings or new save fields.
h.run('s.chartBook.issuedWeek=null;go("Charts")');
assert.match(h.elements.app.innerHTML,/No chart issue published yet/);
assert.equal(h.elements.modal.open,false,'opening Charts must not create a modal');
const ownSongId=Number(h.run('s.songs[0].id'));
const ownAlbumId=Number(h.run('s.albums[0].id'));
const aiEntries=Array.from({length:21},(_,i)=>({key:'npc:s:'+i,id:i,title:'Fiction Track '+i,artist:'Fictional Artist '+i,you:false,rank:i+2,last:i+3,peak:i+2,weeks:2,streams:390000-i*1000,movement:'UP'}));
const chartBook={version:1,sinceWeek:1,issuedWeek:7,songs:{current:[{key:'you:s:'+ownSongId,id:ownSongId,title:'Afterglow',artist:'Fictional Player',you:true,rank:1,last:4,peak:1,weeks:3,streams:600000,movement:'UP'},...aiEntries],previous:[],records:{}},albums:{current:[{key:'you:a:'+ownAlbumId,id:ownAlbumId,title:'Late Light',artist:'Fictional Player',you:true,rank:5,last:null,peak:5,weeks:1,units:10000,movement:'NEW'}],previous:[],records:{}}};
for(const kind of ['songs','albums'])for(const row of chartBook[kind].current)chartBook[kind].records[row.key]={title:row.title,artist:row.artist,you:row.you,id:row.id,peak:row.peak,weeks:row.weeks,partial:false,debutRank:row.rank,debutWeek:7,numberOneWeeks:0,history:[{week:7,rank:row.rank}]};
h.run('s.chartBook='+JSON.stringify(chartBook)+';render()');
assert.match(h.elements.app.innerHTML,/Global Top 100/);
assert.match(h.elements.app.innerHTML,/#1 Afterglow/);
assert.match(h.elements.app.innerHTML,/↑ 3/);
assert.match(h.elements.app.innerHTML,/1 \/ 2/,'charts show only 20 entries per page');
assert.doesNotMatch(h.elements.app.innerHTML,/Fiction Track 20/,'later pages are not rendered unnecessarily');
h.run('EUI.chartPage=1;render()');
assert.match(h.elements.app.innerHTML,/Fiction Track 20/);
h.run('EUI.myCharts=true;EUI.chartPage=0;render()');
assert.match(h.elements.app.innerHTML,/#1 Afterglow/);
assert.doesNotMatch(h.elements.app.innerHTML,/Fiction Track 0/);
h.run('EUI.myCharts=false;EUI.openChartEntry(0)');
assert.equal(h.run('tab'),'ChartDetail');
assert.match(h.elements.app.innerHTML,/Recorded chart path/);
assert.match(h.elements.app.innerHTML,/Open song/);
assert.equal(h.elements.modal.open,false,'chart details must use a routed screen');
h.run('EUI.back()');
assert.equal(h.run('tab'),'Charts');
h.run("EUI.chooseChart('albums')");
assert.match(h.elements.app.innerHTML,/Global Albums 50/);
assert.match(h.elements.app.innerHTML,/Late Light/);
h.run('go("Songs")');
assert.equal(h.run('s.chartBook.songs.current.length'),22,'chart navigation does not change simulation results');

// Growth screens use existing simulation engines without restoring legacy menu layers.
for(const route of ['ReleasePlan','Marketing','Pulse','PulseCompose']){
 h.run('go('+JSON.stringify(route)+')');assert.ok(h.elements.app.innerHTML.length>200,route);
 assert.equal(h.elements.modal.open,false,route+' should not open any modal');
}
h.run('go("ReleasePlan")');
assert.match(h.elements.app.innerHTML,/Upcoming industry weeks/);
h.run('go("Marketing")');
assert.match(h.elements.app.innerHTML,/Weekly|Catalog|catalog/i);
h.run('go("Pulse")');
assert.match(h.elements.app.innerHTML,/in-game platform/);
h.run('go("PulseCompose")');
assert.match(h.elements.app.innerHTML,/Publish PULSE post/);
h.run('go("Songs")');assert.ok(h.elements.app.innerHTML.length>100);
// Drill into campaign; a fresh career cannot buy promotion without released music.
h.run('EUI.openCampaign("grassroots")');assert.equal(h.run('tab'),'CampaignDetail');
assert.match(h.elements.app.innerHTML,/Weekly spend/);
h.run('EUI.back()');assert.equal(h.run('tab'),'Songs');
// Every new page remains operable through direct UI navigation, not an overlay.
assert.match(h.run('EUI.titles.ReleaseDetail'),/Schedule a song/);
assert.match(h.run('EUI.titles.PulsePost'),/PULSE post/);
assert.match(h.run('EUI.titles.Marketing'),/Marketing/);

// Premium visual skin: live data, destination parity, compact screen controls,
// no second renderer or modal navigation, and both theme modes.
h.run('s.name="Fictional Artist";go("Home")');
assert.match(h.elements.app.innerHTML,/MUSIC CAREER SIMULATION/);
assert.match(h.elements.app.innerHTML,/Fictional Artist/);
assert.match(h.elements.app.innerHTML,/core-premium-portrait/);
assert.match(h.elements.app.innerHTML,/core-home-list/);
for (const label of ['Write a Song','Released Songs','Features','Albums','Release Strategy','Tours','Charts','Marketing','PULSE','Artist File']) {
 assert.ok(h.elements.app.innerHTML.includes(label),'Missing live Home destination: '+label);
}
assert.match(h.elements.app.innerHTML,/class="core-header core-header-home"/);
assert.doesNotMatch(h.elements.app.innerHTML,/Nova Lane|Avery Bloom|Solara/,'reference names must never seed gameplay');
assert.match(h.elements.nav.innerHTML,/Calendar/);
assert.match(h.elements.nav.innerHTML,/Studio/);
assert.match(h.elements.nav.innerHTML,/Industry/);
assert.match(h.elements.nav.innerHTML,/More/);
assert.equal(h.elements.modal.open,false,'Home is an ordinary route, never a modal');
h.run('go("ReleasePlan")');
assert.match(h.elements.nav.innerHTML,/aria-label="Calendar" aria-current="page"/);
assert.match(h.elements.app.innerHTML,/core-header-compact/);
h.run('go("Songs")');
assert.match(h.elements.nav.innerHTML,/aria-label="Studio" aria-current="page"/);
h.run('go("Features")');
assert.match(h.elements.nav.innerHTML,/aria-label="Industry" aria-current="page"/);
h.run('go("Menu")');
assert.match(h.elements.nav.innerHTML,/aria-label="More" aria-current="page"/);
h.run('go("Home")');
assert.match(h.elements.nav.innerHTML,/aria-label="Home" aria-current="page"/);
assert.equal(h.run('EUI.history.at(-1).tab'),'Menu','ordinary Back history must persist');
h.run('EUI.back()');assert.equal(h.run('tab'),'Menu');
const premiumRow=h.run('EUI.row("song","Studio Test","All captions stay escaped","go(\\'Songs\\')")');
assert.match(premiumRow,/core-row-art/);
assert.match(premiumRow,/core-row-copy/);
assert.match(h.run("EUI.row('pulse','PULSE','Industry buzz',\"go('Pulse')\")"),/data-icon="pulse"/);
console.log('PASS focused UI: all routes, draft continuity, feature booking, release, ordered album persistence, tour settlement, save round-trip, modal back/close, appearance and sandbox isolation.');
