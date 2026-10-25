import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',130001);await h.run('boot()');
h.run("s.started=true;s.cash=1000000;s.energy=200;s.fans=250000;s.reputation=60;s.loyalty=70;s.songs=[{id:130,title:'Different Roads',released:s.week,streams:300000,total:1500000000,organic:300000,quality:88,commercial:91,mood:'Focused'}]");

const vybe=h.run("V114_platformPanel('vybe')");
const muse=h.run("V114_platformPanel('muse')");
const amp=h.run("V114_platformPanel('amp')");
const world=h.run("V114_platformPanel('worldwave')");
assert.match(vybe,/ALGORITHM PULSE/);
assert.match(muse,/ALBUM SHELF/);
assert.match(amp,/COMMUNITY FEED/);
assert.match(world,/GLOBAL AUDIENCE MAP/);
assert.notEqual(vybe,muse);
assert.notEqual(muse,amp);
assert.notEqual(amp,world);

h.run("V114_state();globalThis.energyBefore=s.energy;globalThis.actionResult=V130_runPlatformAction('vybe',130)");
assert.equal(h.run('actionResult'),true);
assert.equal(h.run('s.energy'),h.run('energyBefore')-5);
assert.equal(h.run("V130_service('vybe').strategy.focusSongId"),130);
assert.ok(h.run("s.songs[0].platformLiftNext>0"));

const plaque=h.run("certificationCard(s.songs[0],'songs')");
assert.match(plaque,/v130-plaque-diamond/);
assert.match(plaque,/<svg/);
assert.doesNotMatch(plaque,/class=\"bar\"/);
assert.match(plaque,/DIAMOND/);

const studio=h.run('V092_unifiedSongForm()');
assert.match(studio,/>Song</);
assert.match(studio,/>Features</);
assert.match(studio,/>Mood</);
for(const removed of ['>Theme<','>Tempo<','>Intent<','>Texture<','>Hook approach<','>Writing approach<','>Production budget<'])assert.ok(!studio.includes(removed),`simple studio should not show ${removed}`);

h.run("s.world[0].relation=100;s.world[0].fans=1000;s.world[0].reputation=20;s.draft=null;newSong({preventDefault(){},target:{songtitle:'Three Fields',feature:'0',mood:directions[0].id,package:'0',brief:'story'}})");
assert.equal(h.run("s.draft.title"),'Three Fields');
assert.ok(h.run("document.getElementById('modal').innerHTML.includes('FEATURE NEGOTIATION')"));

const src=fs.readFileSync(new URL('../src/v130-platforms-plaques-studio.js',import.meta.url),'utf8');
const handoff=fs.readFileSync(new URL('../src/v130-studio-feature-handoff.js',import.meta.url),'utf8');
assert.ok(src.includes('V130_worldMap'));
assert.ok(src.includes('V130_plaqueArt'));
assert.ok(src.includes('Three decisions'));
assert.ok(handoff.includes('studioGuest'));
console.log('PASS Music Platforms 2.0, real visual plaques, Diamond treatment, platform strategy actions and Song / Features / Mood Studio with live feature negotiation handoff.');
