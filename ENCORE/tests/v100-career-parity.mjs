import assert from 'node:assert/strict';import {harness} from './harness.mjs';
const h=harness('/sandbox',717171);await h.run('boot()');
assert.equal(h.run("V100_seasonBand(15)"),'Drought');assert.equal(h.run("V100_seasonBand(50)"),'Stable');assert.equal(h.run("V100_seasonBand(90)"),'Peak');assert.equal(h.run("V100_seasonBand(60,{wasCold:true,momentum:60})"),'Comeback');assert.equal(h.run("V100_seasonBand(70,{early:true,breakout:true})"),'Breakout');
assert.ok(h.run("V100_seasonOpportunityFactor('Drought')<1"));assert.ok(h.run("V100_seasonOpportunityFactor('Peak')>1"));assert.ok(h.run("V100_seasonAudienceFactor('Drought')<V100_seasonAudienceFactor('Peak')"));
h.run("globalThis.q=V100_qualityDimensions(82,70)");assert.ok(h.run("q.technical===82&&q.commercial>=0&&q.commercial<=100&&q.artistic>=0&&q.longevity>=0"));
h.run("globalThis.a=s.world[0];migrateAiIndustry();V100_syncAiSeason(a)");assert.ok(h.run("V100_CAREER_SEASONS.includes(a.aiCareer.season)"));assert.ok(h.run("a.aiCareer.seasonScore>=0&&a.aiCareer.seasonScore<=100"));
h.run("s.careerWorld.state='Drought';globalThis.d=V100_playerOpportunityContext();s.careerWorld.state='Peak';globalThis.p=V100_playerOpportunityContext()");assert.ok(h.run("d.factor<p.factor"));assert.ok(h.run("V100_careerConsequences().includes('CAREER SEASON')"));
console.log('PASS ENCORE 1.0 shared player/NPC career seasons, quality dimensions and opportunity consequences.');
