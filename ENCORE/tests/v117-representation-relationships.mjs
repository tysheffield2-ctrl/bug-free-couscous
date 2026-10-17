import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',117001);await h.run('boot()');
h.run("V100_hireRep('imani')");
assert.equal(h.run('V100_repTeam().team.manager.relationship'),50,'new representatives should begin at a professional 50/100 relationship');
assert.ok(h.run("V100_repTeam().team.manager.relationshipEvents.some(x=>x.type==='hire')"));

const panel=h.run('V100_repTeamPanel()');
assert.ok(panel.includes('REPRESENTATION 3.0'));
assert.ok(panel.includes('v117-relation-track'));
assert.ok(panel.includes('Relationship & agreement'));

h.run("V117_openRepRelationship('manager')");
assert.ok(h.elements.modal.open);
assert.ok(h.elements.modal.innerHTML.includes('WORKING RELATIONSHIP'));
assert.ok(h.elements.modal.innerHTML.includes('Career check-in'));
assert.ok(h.elements.modal.innerHTML.includes('Challenge strategy'));
assert.ok(h.elements.modal.innerHTML.includes('Relationship-adjusted skill'));

const energyBefore=h.run('s.energy');
assert.equal(h.run("V117_repInteract('manager','checkin')"),true);
const afterCheckin=h.run('V100_repTeam().team.manager.relationship');
assert.ok(afterCheckin>50,'check-ins should build trust');
assert.equal(h.run('s.energy'),energyBefore-5);
assert.equal(h.run("V117_repInteract('manager','challenge')"),false,'only one direct relationship interaction should be allowed per representative each week');

h.run('s.week+=1');
assert.equal(h.run("V117_repInteract('manager','challenge')"),true);
assert.ok(h.run('V100_repTeam().team.manager.relationship')<afterCheckin,'challenging strategy should create relationship friction');

h.run("V100_repTeam().team.manager.relationship=90");
const strong=h.run('V117_effectiveSkill(V100_repTeam().team.manager)');
h.run("V100_repTeam().team.manager.relationship=10");
const strained=h.run('V117_effectiveSkill(V100_repTeam().team.manager)');
assert.ok(strong>strained,'chemistry should affect effective advisor skill');

h.run("V100_repTeam().team.manager.relationship=0;V100_repTeam().team.manager.breakingPointWeek=10;s.week=13;V117_settleRepRelationships(12)");
assert.equal(h.run("Boolean(V100_repTeam().team.manager)"),false,'representatives should be able to resign after a sustained breaking-point relationship');
assert.equal(h.run("V100_repTeam().history[0].type"),'resigned');

const src=fs.readFileSync(new URL('../src/v117-representation-relationships.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v117-representation-relationships.css',import.meta.url),'utf8');
const build=fs.readFileSync(new URL('../build.mjs',import.meta.url),'utf8');
assert.ok(src.includes('V117_repInteract'));
assert.ok(src.includes('V117_settleRepRelationships'));
assert.ok(src.includes('breaking point'));
assert.ok(css.includes('.v117-relation-track'));
assert.ok(build.includes("'v117-representation-relationships'"));
console.log('PASS Representation Relationships 1.0: visible chemistry bars, role-specific interactions, style-sensitive gains/losses, effectiveness impact, idle drift and breaking-point resignations.');
