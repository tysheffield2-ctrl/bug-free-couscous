import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';

const js=readFileSync(new URL('../src/v096-business-hq-notifications.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/v096.css',import.meta.url),'utf8');
const build=readFileSync(new URL('../build.mjs',import.meta.url),'utf8');

assert.match(js,/V096_consolidateDestinations/);
assert.match(js,/V096_BUSINESS_AREAS/);
assert.match(js,/Feature request/);
assert.match(js,/Production request/);
assert.match(js,/Tour invitation/);
assert.match(js,/priority-opportunity/);
assert.match(js,/chart-podium/);
assert.match(js,/chart-volume-meter/);
assert.match(js,/Business HQ is the single front door/);
assert.match(css,/\.chart-podium/);
assert.match(css,/\.business-area-card/);
assert.match(css,/\.priority-request/);
assert.match(build,/v096-business-hq-notifications/);
assert.match(build,/'v096'/);

console.log('v0.9.5 chart, Business HQ and priority notification smoke checks passed');
