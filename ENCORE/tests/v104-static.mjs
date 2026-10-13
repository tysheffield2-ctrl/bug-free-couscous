import fs from 'node:fs';import assert from 'node:assert/strict';
const build=fs.readFileSync(new URL('../build.mjs',import.meta.url),'utf8');
const mobile=fs.readFileSync(new URL('../src/v104-mobile-polish.css',import.meta.url),'utf8');
const dossier=fs.readFileSync(new URL('../src/v104-artist-dossier.css',import.meta.url),'utf8');
const scenes=fs.readFileSync(new URL('../src/v104-scene-polish.css',import.meta.url),'utf8');
assert.ok(build.includes("'v104-mobile-polish'"));assert.ok(build.includes("'v104-artist-dossier'"));assert.ok(build.includes("'v104-scene-polish'"));assert.ok(mobile.includes('@media (max-width:700px)'));assert.ok(mobile.includes('.v103-industry-roster .numbers'));assert.ok(dossier.includes('dialog:has(.artist-profile)'));assert.ok(scenes.includes('.v102-negotiation-room'));
console.log('PASS Wave 2 mobile, artist-dossier and high-stakes scene presentation assets are wired into the build.');
