import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';

const hype=readFileSync(new URL('../src/v095-release-hype.js',import.meta.url),'utf8');
const artist=readFileSync(new URL('../src/v095-artist-file.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/v095.css',import.meta.url),'utf8');

assert.match(hype,/V095_HYPE_ACTIONS/,'release hype actions must exist');
assert.match(hype,/preReleasePeak/,'pre-release hype must persist into release state');
assert.match(hype,/V095_adjustReleaseStreamsBase/,'release hype must affect simulated streams');
assert.match(hype,/kind==='albums'/,'albums must be valid hype targets');
assert.match(hype,/V095_albumPlanCard/,'album hype must exist before album release');
assert.match(hype,/POST-RELEASE MOMENTUM/,'released songs and albums must remain hypeable');
assert.match(hype,/SANDBOX\|\|!Number\.isFinite\(s\.social\.sandboxEngagementRate\)/,'normal careers must ignore sandbox engagement overrides');
assert.match(hype,/PULSE followers/,'sandbox editor must expose PULSE follower editing');
assert.match(hype,/PULSE engagement rate/,'sandbox editor must expose PULSE engagement editing');
assert.match(artist,/artistFilePage=function/,'Artist File must use the cohesive premium layout');
assert.match(artist,/ESTIMATED WEALTH/,'Artist File must preserve financial context');
assert.match(artist,/SINCE LAST WEEK/,'Artist File must preserve recent career movement');
assert.match(css,/\.artist-file-page-v095/,'Artist File redesign styles must ship');
assert.match(css,/\.hype-actions-v095/,'release hype controls must ship');
console.log('v0.9.4 release hype, Artist File and sandbox PULSE checks passed');
