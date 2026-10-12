import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';

const js=readFileSync(new URL('../src/v094-career-ui.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/v094.css',import.meta.url),'utf8');
assert.match(js,/Math\.max\(Math\.ceil\(views\*\.25\)/,'PULSE must enforce a 25% count-backed engagement floor');
assert.doesNotMatch(js,/Math\.min\(views,Math\.round\(views\*rate\)\)/,'PULSE engagement must not be capped at one interaction per view');
assert.match(js,/audience-map-pin/,'Regional audience must expose tappable city pins');
assert.match(js,/V094_selectMarket/,'Regional map must support city selection');
assert.match(js,/artist-file-v094/,'Artist File must lead with the career identity hero');
assert.match(js,/quick-train-v094/,'Stats cards must expose training actions');
assert.match(js,/V094_WHEEL_ROW=44/,'Wheel row math must match compact 44px rows');
assert.match(css,/\.ios-wheel\{height:220px;padding:88px 0\}/,'Wheel must remain five rows while using the compact footprint');
console.log('v0.9.3 beta 2 career UI checks passed');
