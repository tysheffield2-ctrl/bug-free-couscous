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
console.log('PASS focused UI: all routes, draft continuity, feature booking, release, ordered album persistence, tour settlement, save round-trip, modal back/close, appearance and sandbox isolation.');
