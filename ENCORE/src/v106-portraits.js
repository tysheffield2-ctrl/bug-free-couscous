/* ENCORE v1.06 — scalable artist portrait presentation.
   Core cast uses their shipped portrait photography. Generated artists receive a
   deterministic illustrated portrait so no two-letter placeholder has to carry the UI. */

function V106_portraitHash(value){
  let h=2166136261>>>0;
  for(const ch of String(value||'artist')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0}
  return h>>>0
}
function V106_generatedPortrait(name,key='',large=false){
  /* Identity must be stable across Artist File, catalog, PULSE, negotiation, etc. */
  const identity=String(name||'artist').trim().toLowerCase(),h=V106_portraitHash(identity),pick=(list,shift=0)=>list[(h>>>shift)%list.length];
  const skins=['#5b3627','#704735','#8a5b43','#a46f51','#bb8565','#d09c7b','#e0b08f'];
  const hairPalette=['#15100e','#201713','#33231b','#4a3022','#120f10'];
  const shirts=['#1d3546','#412829','#243c31','#4b3b24','#302a46','#3c2a36'];
  const bgs=['#1b3444','#40302b','#263a35','#423648','#3e3825','#203644'];
  const skin=pick(skins,1),hairColor=pick(hairPalette,5),shirt=pick(shirts,9),bg=pick(bgs,13),style=(h>>>17)%5;
  const glasses=((h>>>22)%5===0),earring=((h>>>25)%4===0),beard=((h>>>27)%3===0);
  const hairShape=[
    `<ellipse cx="50" cy="30" rx="27" ry="18" fill="${hairColor}"/><circle cx="30" cy="32" r="11" fill="${hairColor}"/><circle cx="70" cy="31" r="11" fill="${hairColor}"/>`,
    `<path d="M25 37Q27 13 51 13Q76 14 76 39Q67 29 51 29Q36 29 25 37Z" fill="${hairColor}"/>`,
    `<path d="M24 34Q28 12 51 13Q73 14 77 35L71 63H66L68 29L62 65H57L60 27L52 66H47L50 27L39 66H34L41 28L30 62H25Z" fill="${hairColor}"/>`,
    `<path d="M22 39Q22 12 50 12Q79 12 79 40L75 69Q67 55 65 30Q50 23 35 31Q32 56 25 69Z" fill="${hairColor}"/>`,
    `<path d="M27 35Q29 18 50 18Q70 18 73 35Q62 29 50 29Q38 29 27 35Z" fill="${hairColor}"/>`
  ][style];
  const initials=esc(String(name||'?').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase());
  const label=esc(`Illustrated portrait of ${name}`);
  return `<span class="person-photo v106-generated-portrait ${large?'portrait-large':''}" role="img" aria-label="${label}"><svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"><rect width="100" height="100" rx="8" fill="${bg}"/><circle cx="81" cy="17" r="16" fill="#d5ad5f" opacity=".12"/><path d="M10 100Q14 72 36 68H64Q87 72 91 100Z" fill="${shirt}"/><path d="M42 61H59V75H42Z" fill="${skin}"/><ellipse cx="50" cy="43" rx="23" ry="29" fill="${skin}"/><ellipse cx="27" cy="44" rx="4" ry="7" fill="${skin}"/><ellipse cx="73" cy="44" rx="4" ry="7" fill="${skin}"/>${hairShape}<path d="M38 43q5-3 10 0M53 43q5-3 10 0" fill="none" stroke="#261d1a" stroke-width="1.5" stroke-linecap="round"/><circle cx="43" cy="44" r="1.6" fill="#171312"/><circle cx="58" cy="44" r="1.6" fill="#171312"/><path d="M50 45l-2 10h5" fill="none" stroke="#6a4234" stroke-width="1.2" stroke-linecap="round"/>${beard?`<path d="M36 57Q50 70 65 57Q62 73 50 76Q38 73 36 57Z" fill="${hairColor}" opacity=".78"/>`:''}<path d="M43 61Q50 65 57 61" fill="none" stroke="#6b3431" stroke-width="1.5" stroke-linecap="round"/>${glasses?`<g fill="none" stroke="#c7b47f" stroke-width="1.3"><rect x="34" y="39" width="14" height="10" rx="4"/><rect x="53" y="39" width="14" height="10" rx="4"/><path d="M48 43h5"/></g>`:''}${earring?`<circle cx="73" cy="51" r="2" fill="#d8bd78"/>`:''}<rect x="7" y="77" width="25" height="15" rx="3" fill="#070b0f" opacity=".72"/><text x="19.5" y="88" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" font-weight="800" fill="#eee9dd">${initials}</text></svg></span>`
}

const V106_portraitBase=personPhoto;
personPhoto=function(key,name,large=false){
  const core=typeof V085_CORE_CAST!=='undefined'&&V085_CORE_CAST.some(x=>x.name===name);
  if(core)return V106_portraitBase(key,name,large);
  const portraitKey=String(key||'');
  const artist=/^(artist|player)-/.test(portraitKey)||s.world?.some?.(x=>x.name===name);
  if(artist)return V106_generatedPortrait(name,key,large);
  return V106_portraitBase(key,name,large)
};