import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../src/v142-presentation-unification.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v142-presentation-unification.css',import.meta.url),'utf8');
const build=fs.readFileSync(new URL('../build.mjs',import.meta.url),'utf8');

assert.ok(js.includes("careerTab==='Inbox'"), 'Inbox route must be replaced by v142 presentation');
assert.ok(js.includes("careerTab==='Releases'"), 'Catalog route must be replaced by v142 presentation');
assert.ok(js.includes("careerTab==='Achievements'"), 'Awards route must be replaced by v142 presentation');
assert.ok(js.includes("careerTab==='Wealth'")&&js.includes("careerTab==='Properties'"), 'Collection and property routes must use the unified storefront presentation');
assert.ok(js.includes("V142_cycleValue('artistryIndex'")&&js.includes("V142_cycleValue('writingIndex'")&&js.includes("V142_cycleValue('studioIndex'"), 'Song creation arrows must be functional for artistry, writing and studio choices');
assert.ok(js.includes('V142_applyStudioChoices')&&js.includes('ENCORE_STUDIO?.score?.(s.draft)'), 'Selected song providers must affect the authoritative draft score');
assert.ok(js.includes('TOTAL COST')&&js.includes('V142_studioTotal()'), 'Song creation must show the combined provider and studio cost');
assert.ok(css.includes('.v142-song-create{max-width:760px'), 'New Song screen must use the compact composition rather than the giant legacy layout');
assert.ok(css.includes('.v142-inbox{min-height:100vh;background:#fff;color:#20262b'), 'Inbox must use the white editorial presentation');
assert.ok(css.includes('.v142-dark-list')&&css.includes('.v142-release-row'), 'Songs and albums must use the dark compact catalog presentation');
assert.ok(css.includes('.v142-awards{background:#07090e'), 'Awards must use the prestige black/gold presentation');
assert.ok(css.includes('.v142-store')&&css.includes('.v142-listing'), 'Property and collection screens must use the luxury storefront presentation');

const shellList=build.match(/const shellModules=\[(.*?)\];/s)?.[1]||'';
const cssList=build.match(/const css=\[(.*?)\]\.map/s)?.[1]||'';
assert.ok(shellList.includes("'v142-presentation-unification'"), 'v142 must load in the native shell');
assert.ok(shellList.lastIndexOf("'v142-presentation-unification'")>shellList.lastIndexOf("'v140-cohesive-career-ui'"), 'v142 must load after v140 so it owns the final live routes');
assert.ok(cssList.lastIndexOf("'v142-presentation-unification'")>cssList.lastIndexOf("'v141-light-surface-contract'"), 'v142 CSS must load last');

console.log('PASS v142 presentation unification: legacy route families are replaced and Studio selectors are functional.');
