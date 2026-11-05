import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../src/v142-presentation-unification.js',import.meta.url),'utf8');
const creator=fs.readFileSync(new URL('../src/v143-song-creation.js',import.meta.url),'utf8');
const creatorCss=fs.readFileSync(new URL('../src/v143-song-creation.css',import.meta.url),'utf8');
const v103=fs.readFileSync(new URL('../src/v103-studio.js',import.meta.url),'utf8');
const v140=fs.readFileSync(new URL('../src/v140-cohesive-career-ui.js',import.meta.url),'utf8');
const build=fs.readFileSync(new URL('../build.mjs',import.meta.url),'utf8');
const game=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8');

assert.ok(js.includes("careerTab==='Inbox'"), 'Inbox route must be replaced by v142 presentation');
assert.ok(js.includes("careerTab==='Releases'"), 'Catalog route must be replaced by v142 presentation');
assert.ok(js.includes("careerTab==='Achievements'"), 'Awards route must be replaced by v142 presentation');
assert.ok(js.includes("careerTab==='Wealth'")&&js.includes("careerTab==='Properties'"), 'Collection and property routes must use the unified storefront presentation');

assert.ok(!js.includes('V140_studioIdeaForm='), 'v142 must not layer a Song Creation renderer over v140');
assert.ok(!js.includes('V142_newSongBase'), 'v142 must not wrap newSong');
assert.ok(!js.includes('V142_cycleValue'), 'Song Creation controls must not live in the presentation-unification patch');
assert.ok(!v140.includes('function V140_studioIdeaForm'), 'old v140 Song Creation renderer must be deleted');
assert.ok(!v140.includes('V140_newSongBase'), 'v140 must not wrap newSong');
assert.ok(v140.includes('if(!s.draft)return V143_songCreationPage()'), 'v140 Studio must call the canonical creator directly');
assert.ok(v103.includes("if(!s.draft)return typeof V143_songCreationPage==='function'?V143_songCreationPage():''"), 'core Studio must route directly to canonical Song Creation');
assert.ok(!v103.includes('V092_unifiedSongForm'), 'core Studio must not render the old v092 creation form');
assert.ok(!v103.includes('studioV089()'), 'core Studio must not render the retired pre-v103 Studio beneath the current UI');
assert.ok(!v103.includes('v103-studio-legacy'), 'active Studio must not append retired legacy project tools');

for(const token of ['function V143_songCreationPage','function V143_submitSong','function V143_cycleValue','ARTISTRY','WRITING','STUDIO','TOTAL COST','CREDITS & SPLITS'])assert.ok(creator.includes(token),`canonical Song Creation missing ${token}`);
assert.ok(creator.includes("V143_cycleValue('artistryIndex'")||creator.includes("V143_picker('ARTISTRY','artistryIndex'"), 'Artistry arrows must use the canonical selector');
assert.ok(creator.includes("V143_picker('WRITING','writingIndex'"), 'Writing arrows must use the canonical selector');
assert.ok(creator.includes("V143_picker('STUDIO','studioIndex'"), 'Studio arrows must use the canonical selector');
assert.ok(creator.includes('V125_creditBuilder'), 'credits and splits must attach to the canonical creator instead of a legacy form');
assert.ok(creator.includes('V143_applyChoices(idea)')&&creator.includes('ENCORE_STUDIO?.score?.(s.draft)'), 'selected providers must affect the authoritative draft score');
assert.ok(creator.includes('newSong(e)'), 'canonical submit must use the established draft engine without rendering its retired UI');
assert.ok(creatorCss.includes('.v143-song-create')&&!creatorCss.includes('.v140-fullscreen'), 'canonical creator must have its own root presentation instead of the retired v140 wrapper');
assert.ok(creatorCss.includes('.v143-credits'), 'credits and splits must stay compact/collapsible inside the canonical creator');

const modules=build.match(/const modules=\[(.*?)\];/s)?.[1]||'';
const shellList=build.match(/const shellModules=\[(.*?)\];/s)?.[1]||'';
const cssList=build.match(/const css=\[(.*?)\]\.map/s)?.[1]||'';
assert.ok(modules.includes("'v143-song-creation'"), 'canonical Song Creation must ship in the core game bundle');
assert.ok(modules.lastIndexOf("'v143-song-creation'")>modules.lastIndexOf("'v136-living-memory'"), 'canonical creator must load after legacy Studio generations');
assert.ok(shellList.includes("'v142-presentation-unification'"), 'v142 presentation routes must remain in the native shell');
assert.ok(cssList.lastIndexOf("'v143-song-creation'")>cssList.lastIndexOf("'v142-presentation-unification'"), 'canonical Song Creation CSS must load last');
assert.ok(!build.includes("'V142_cycleValue'"), 'retired v142 Song Creation globals must not be exported');
assert.ok(build.includes("name==='v090-studio'")&&build.includes("name==='v092-business-career'")&&build.includes("name==='v125-collaboration-splits'"), 'build must explicitly remove every retired creation wrapper');
for(const retired of ['Start your next record','SESSION 01','studio-v092','creativeDirectionMarkup','CREATIVE BRIEF','V092_unifiedSongForm','V125_songFormBase'])assert.ok(!game.includes(retired),`shipped game.js still contains retired Song Creation code: ${retired}`);
assert.ok(game.includes('function V143_songCreationPage'), 'shipped game.js must contain the canonical v143 creator');
assert.ok(game.includes('function V125_creditBuilder'), 'rights-chain credits/splits gameplay must remain available after removing its old UI hook');

console.log('PASS v143 Song Creation replacement: one canonical creator ships, credits/splits attach to it, retired creation generations are absent from game.js, and no legacy UI can render beneath it.');
