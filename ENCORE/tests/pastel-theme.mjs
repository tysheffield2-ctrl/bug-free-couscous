import assert from 'node:assert/strict';
import fs from 'node:fs';

const legacy=fs.readFileSync(new URL('../src/v107-pastel-theme.css',import.meta.url),'utf8');
const recap=fs.readFileSync(new URL('../src/v108-recap-contrast.css',import.meta.url),'utf8');
const ui2=fs.readFileSync(new URL('../ui2/phase11-pastel.css',import.meta.url),'utf8');
const builtLegacy=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
const builtUi2=fs.readFileSync(new URL('../dist/ui2.html',import.meta.url),'utf8');

function token(css,name){
  const m=css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  assert.ok(m,`missing color token --${name}`);
  return m[1];
}
function rgb(hex){const n=parseInt(hex.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255]}
function luminance(hex){
  const vals=rgb(hex).map(v=>{const c=v/255;return c<=.03928?c/12.92:((c+.055)/1.055)**2.4});
  return .2126*vals[0]+.7152*vals[1]+.0722*vals[2]
}
function contrast(a,b){const x=luminance(a),y=luminance(b),hi=Math.max(x,y),lo=Math.min(x,y);return(hi+.05)/(lo+.05)}
function requireContrast(label,fg,bg,min=4.5){
  const ratio=contrast(fg,bg);
  assert.ok(ratio>=min,`${label} contrast ${ratio.toFixed(2)} is below ${min}:1`)
}

const bg=token(legacy,'encore-bg');
const surface=token(legacy,'encore-surface');
const text=token(legacy,'encore-text');
const soft=token(legacy,'encore-text-soft');
const muted=token(legacy,'encore-text-muted');
const mint=token(legacy,'encore-mint');
const red=token(legacy,'encore-red');
const sand=token(legacy,'encore-sand');
const gold=token(legacy,'encore-gold');
const buttonInk=token(legacy,'encore-button-text');

requireContrast('primary text on app background',text,bg,7);
requireContrast('primary text on surface',text,surface,7);
requireContrast('secondary text on app background',soft,bg,4.5);
requireContrast('secondary text on surface',soft,surface,4.5);
requireContrast('muted text on surface',muted,surface,4.5);
requireContrast('positive values on surface',mint,surface,4.5);
requireContrast('negative values on surface',red,surface,4.5);
requireContrast('tax/reserve values on surface',sand,surface,4.5);
requireContrast('primary button text on gold',buttonInk,gold,7);

const recapDarkHeading=token(recap,'recap-dark-heading');
const recapDarkBody=token(recap,'recap-dark-body');
const recapLightSurface=token(recap,'recap-light-surface');
const recapLightHeading=token(recap,'recap-light-heading');
const recapLightValue=token(recap,'recap-light-value');
const recapLightBody=token(recap,'recap-light-body');
requireContrast('weekly recap heading on dark report',recapDarkHeading,'#0a0f18',7);
requireContrast('weekly recap body on dark report',recapDarkBody,'#0a0f18',7);
requireContrast('You Kept label on cream report',recapLightHeading,recapLightSurface,7);
requireContrast('You Kept value on cream report',recapLightValue,recapLightSurface,7);
requireContrast('You Kept supporting copy on cream report',recapLightBody,recapLightSurface,4.5);
for(const selector of ['.v103-recap .v103-recap-ledger>header','.v103-recap .v103-recap-ledger>p','.v103-recap .v103-recap-kept>span','.v103-recap .v103-recap-kept>strong','.v103-recap .v103-recap-kept>p'])assert.ok(recap.includes(selector),`recap guard missing scoped override ${selector}`);

for(const tokenName of ['--bg:#151719','--ink:#fff8ec','--peach:#e9ad91','--lavender:#bba6d9','--blue:#9fc6dc','--sage:#a9c7ae','--sand:#d7bd92'])assert.ok(ui2.includes(tokenName),`UI2 missing pastel token ${tokenName}`);
for(const contract of ['.ui2-week-recap','.ui2-studio-room','.ui2-chart-row','.ui2-business-hero','.ui2-pulse-post','.ui2-tour-map-svg','.ui2-neg-room','.ui2-honors','.ui2-wealth'])assert.ok(ui2.includes(contract),`pastel theme missing system contract ${contract}`);
assert.ok(builtLegacy.includes('--encore-peach:#e9ad91'),'interactive renderer must bundle pastel system');
assert.ok(builtLegacy.includes('--recap-light-value:#17191d'),'interactive renderer must bundle recap contrast guard');
assert.ok(builtUi2.includes('--peach:#e9ad91'),'UI2 renderer must bundle pastel system');

console.log('PASS ENCORE dark-pastel design system: WCAG-readable core text/status colors, surface-specific weekly recap contrast, and both renderers bundled.');
