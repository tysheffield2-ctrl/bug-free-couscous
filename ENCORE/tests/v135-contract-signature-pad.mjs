import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness} from './harness.mjs';

const h=harness('/sandbox',135001);await h.run('boot()');
h.run("s.started=true;s.energy=200;s.cash=1000000;createLabelOffer(0,'Signature pad regression');globalThis.o=s.labelBusiness.offers.find(x=>!x.used);globalThis.pad=V101_signaturePadMarkup(s.name)");
assert.match(h.run('pad'),/v101-signature-pad/);
assert.match(h.run('pad'),/Draw your signature/);
assert.doesNotMatch(h.run('pad'),/name=\"signature\"/);

h.run("V101_signatureStrokes=[[{x:.1,y:.1,p:.5}]];globalThis.dotOnly=V101_signatureHasInk()");
assert.equal(h.run('dotOnly'),false,'a tap/dot must not count as a signature');

h.run("V101_signatureStrokes=[[{x:.08,y:.55,p:.5},{x:.18,y:.34,p:.55},{x:.31,y:.62,p:.6},{x:.46,y:.27,p:.7},{x:.63,y:.58,p:.6},{x:.82,y:.38,p:.5}]];globalThis.beforeVault=V100_contractVault().length;globalThis.executed=V101_commitContractExecution(o.id,'TK')");
assert.equal(h.run('executed'),true);
assert.equal(h.run('V100_contractVault().length'),h.run('beforeVault')+1);
assert.equal(h.run("V100_contractVault()[0].initials"),'TK');
assert.equal(h.run("V100_contractVault()[0].signature.kind"),'drawn');
assert.equal(h.run("V100_contractVault()[0].signature.format"),'normalized-strokes-v1');
assert.equal(h.run("V100_contractVault()[0].signature.signer"),h.run('s.name'));
assert.ok(h.run("V100_contractVault()[0].signature.strokes[0].length>=6"));
assert.equal(h.run('o.used'),true);

const source=fs.readFileSync(new URL('../src/v101-contract-document.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v100.css',import.meta.url),'utf8');
assert.ok(source.includes('draw your signature with your finger or stylus'));
assert.ok(source.includes('V101_signatureHasInk'));
assert.ok(source.includes("kind:'drawn'"));
assert.ok(!source.includes('<label>Electronic signature<input'));
assert.ok(css.includes('.legal-signature-pad'));
assert.ok(css.includes('touch-action:none'));
console.log('PASS contract execution uses initials plus a finger/stylus signature pad, rejects tap-only marks, stores compact normalized signature vectors, and removes the live typed-signature field.');
