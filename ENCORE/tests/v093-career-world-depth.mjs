import fs from 'node:fs';
import assert from 'node:assert/strict';

const career=fs.readFileSync(new URL('../src/career-world.js',import.meta.url),'utf8');
const depth=fs.readFileSync(new URL('../src/v093-career-world-depth.js',import.meta.url),'utf8');
const map=fs.readFileSync(new URL('../src/v093-market-map.js',import.meta.url),'utf8');
const routing=fs.readFileSync(new URL('../src/v093-tour-routing.js',import.meta.url),'utf8');
const page=fs.readFileSync(new URL('../src/career-world-routing.js',import.meta.url),'utf8');
const build=fs.readFileSync(new URL('../build.mjs',import.meta.url),'utf8');

assert.match(career,/function reconcileRegionalAudience/,'Career World must retain one audience-conservation function.');
assert.match(career,/target=Math\.max\(0,Math\.floor\(s\.fans\|\|0\)\)/,'Regional attribution must be anchored to the global fan count.');
assert.match(depth,/function V093_marketData\(\)\{const w=migrateCareerWorld\(\)/,'0.9.3 market presentation must read the authoritative Career World.');
assert.doesNotMatch(depth,/V093_marketSeeds/,'0.9.3 must not restore the duplicate seeded market model.');
assert.match(map,/const V093_marketCoordinates=/,'Audience must provide geographic coordinates.');
for(const metric of ['demand','fans','streams','awareness','loyalty','touring'])assert.match(map,new RegExp(`${metric}:\\{label:`),`Map is missing ${metric} layer.`);
assert.match(routing,/tourStopEstimate\(/,'Route recommendations must use the Touring engine forecast.');
assert.match(routing,/Plan a show in/,'Market detail must lead directly into tour planning.');
assert.match(page,/V093_routeIntelligence/,'Audience page must expose route intelligence.');
assert.doesNotMatch(page,/V093_audienceMap\(\):''\)\+regionalAudiencePage\(\)/,'Audience page must not render the old regional page underneath the new system.');
for(const module of ['v093-career-world-depth','v093-audience-loop','v093-market-map','v093-tour-routing'])assert.ok(build.includes(`'${module}'`),`Build is missing ${module}.`);

console.log('0.9.3 Career World regression checks passed.');
