import assert from 'node:assert/strict';
import fs from 'node:fs';

const css=fs.readFileSync(new URL('../src/v141-light-surface-contract.css',import.meta.url),'utf8');
const build=fs.readFileSync(new URL('../build.mjs',import.meta.url),'utf8');

assert.ok(css.includes('body:has(.v138-artist-file)'), 'Artist File light-surface contract must be present');
assert.ok(css.includes('.v138-profile-sheet h1')&&css.includes('color:#000!important'), 'Artist File editorial text must be forced to black');
assert.ok(css.includes('@media(max-width:620px)')&&css.includes('.v138-worth{grid-template-columns:1fr!important'), 'Artist File worth summary must stack before iPhone widths can collide');
assert.ok(css.includes('.v138-worth,.v138-worth>div,.v138-worth aside{min-width:0!important}'), 'Artist File worth columns must be allowed to shrink safely');
assert.ok(css.includes('.v138-worth aside{padding:14px 0 0!important;border-top:1px solid #c7c7c7!important}'), 'Stacked worth summary must become its own row');

assert.ok(css.includes('.v139-muse,.v139-muse-page,.v139-muse-body{background:#fff!important;color:#000!important}'), 'MUSE page must enforce white surface with black text');
assert.ok(css.includes('.v139-muse-list header{background:#fff!important;color:#000!important'), 'MUSE Top Songs header must not inherit the dark global header');
assert.ok(css.includes('.v139-muse-list>button{background:#fff!important;color:#000!important}'), 'MUSE song rows must use black text on white');
assert.ok(css.includes('.v139-muse-list>button strong,.v139-muse-list>button small,.v139-muse-list>button>b{color:#000!important}'), 'MUSE row descendants must not inherit cream/white text');
assert.ok(css.includes('.v139-muse-albums h2')&&css.includes('.v139-muse-footer small{color:#000!important}'), 'MUSE album and footer copy must use black ink');
assert.ok(css.includes('.v139-muse-ranking>small')&&css.includes('.v139-muse-quality span,.v139-muse-quality strong{color:#000!important}'), 'MUSE analytics light-surface copy must use black ink');

const cssList=build.match(/const css=\[(.*?)\]\.map/s)?.[1]||'';
assert.ok(cssList.includes("'v141-light-surface-contract'"), 'Build must include the light-surface contract stylesheet');
assert.ok(cssList.lastIndexOf("'v141-light-surface-contract'")>cssList.lastIndexOf("'v140-cohesive-career-ui'"), 'Light-surface contract must load after prior presentation CSS');

console.log('PASS v141 light-surface contract: Artist File reflows before overlap and MUSE white surfaces are black-ink only.');
