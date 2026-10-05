/* ENCORE 0.8.4 unique core cast.
   The first 18 artists have permanent unique portrait IDs. Portraits are generated as
   separate Safari-safe SVG <img> data URLs so no two core artists reuse a face. */
const V085_CORE_CAST=[
 ['Mira Wells','female','Pop','artist-01'],['Cairo Vale','male','R&B','artist-02'],
 ['Amara Sun','female','Afrobeats','artist-03'],['Orion Saint','male','Hip-hop','artist-04'],
 ['Selah Monroe','female','R&B','artist-05'],['Malik Cross','male','Hip-hop','artist-06'],
 ['Zara Voss','female','Electronic','artist-07'],['Leon Rivers','male','Rock','artist-08'],
 ['Nyla Hart','female','Pop','artist-09'],['Theo Knox','male','Country','artist-10'],
 ['Sanaa Rose','female','Gospel','artist-11'],['Nico Lane','male','Indie folk','artist-12'],
 ['Talia North','female','Country','artist-13'],['Jalen Storm','male','R&B','artist-14'],
 ['Lyra Quinn','female','K-pop','artist-15'],['Idris Blue','male','Jazz','artist-16'],
 ['Nova Rey','female','Latin','artist-17'],['Kofi Dawn','male','Afrobeats','artist-18']
].map(([name,gender,genre,portraitId],index)=>({index,name,gender,genre,portraitId}));
const V085_CORE_COUNT=V085_CORE_CAST.length;
const V085_SKINS=['#6e3f2d','#a86846','#c88d67','#8b543c','#d0a07d','#754735','#b67653','#5a3427','#9d6248','#c58a63','#7d4b36','#b97755','#e0b18c','#6a3c2c','#aa6a4d','#8f5a43','#c78968','#5d3629'];
const V085_HAIR=['#101216','#17191d','#271a18','#101114','#38221c','#0c0e12','#1b1618','#2a1e19','#16171b','#2e221d','#111316','#5a3527','#1d1515','#101114','#2d201c','#17191d','#2c1715','#0f1013'];
const V085_BG=[['#15243b','#5a72a6'],['#2b193a','#8759a4'],['#1b3b33','#6aa68e'],['#3d2118','#b16c4a'],['#1b2846','#6e83b5'],['#17344a','#5c95ae'],['#2b1736','#a05fa7'],['#282828','#8b6f57'],['#242041','#8a78c1'],['#273221','#879c63'],['#3a1f2b','#b86c82'],['#20333d','#6d9aa0'],['#37291e','#b9895e'],['#251d39','#806baf'],['#16283c','#5c91b2'],['#2c2b20','#9c9365'],['#371b25','#b85f72'],['#1a332c','#69a989']];
const V085_CLOTH=['#542f75','#1e3b63','#2d6253','#743a31','#273f78','#202a33','#5d294e','#3a3b41','#364d8c','#4f5a30','#7b3047','#40585f','#805d3e','#47366d','#2e5f77','#635b30','#8c3f4a','#315c49'];
const V085_ACCENT=['#e9c46a','#d6a7ff','#8bd3c7','#f6bd60','#90caf9','#d4af37','#f4a7c5','#c0c0c0','#b39ddb','#d4b483','#ffd1dc','#8ecae6','#f4c27a','#c5a3ff','#9ad5ff','#e6d38a','#ffc0cb','#9ed9b5'];
const V085_HAIR_STYLE=['waves','fade','braids','locs','bob','buzz','afro','shag','pony','crop','twists','curly','long','highfade','bangs','slick','curls','shortlocs'];
function V085_hairMarkup(style,c){
 if(style==='waves')return `<path d="M145 224c-8-112 46-164 118-162 76 2 131 51 127 159-25-31-43-48-68-63-13 28-38 40-61 36-24 23-54 32-88 30-8 30-11 63-8 91-22-25-27-55-20-91z" fill="${c}"/><path d="M155 200c18-70 55-109 109-113 62-4 99 36 116 110-34-39-65-55-101-52-41 4-78 21-124 55z" fill="#000" opacity=".22"/>`;
 if(style==='fade'||style==='buzz'||style==='crop'||style==='highfade'||style==='slick')return `<path d="M166 166c12-72 53-106 105-106 55 0 91 30 103 95-54-24-109-21-168 9-15 8-28 8-40 2z" fill="${c}"/><path d="M188 135c48-37 104-42 167-13-57-12-112-6-167 13z" fill="#fff" opacity=".05"/>`;
 if(style==='braids'||style==='locs'||style==='twists'||style==='shortlocs'){let strands='';for(let j=0;j<7;j++)strands+=`<path d="M${156+j*22} 116 C${142+j*23} 206,${158+j*21} 294,${146+j*22} 378" stroke="${c}" stroke-width="${style==='braids'?13:17}" stroke-linecap="round" fill="none"/>`;return `<path d="M158 164c8-72 48-108 104-108 58 0 98 36 106 105-44-23-87-29-130-18-27 7-53 14-80 21z" fill="${c}"/>${strands}`;}
 if(style==='bob'||style==='long'||style==='bangs')return `<path d="M137 219c0-104 46-161 122-161 77 0 124 57 124 162l-9 166-67-17 5-145c-34 21-70 28-107 20l-7 143-66 18z" fill="${c}"/><path d="M174 150c28-50 61-72 99-65 37 7 63 29 79 67-45-21-88-22-128-3-17 8-34 9-50 1z" fill="${c}"/>`;
 if(style==='afro'||style==='curly'||style==='curls')return [[151,176,34],[179,130,42],[218,105,44],[264,100,46],[310,109,43],[348,136,40],[368,180,33]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join('');
 if(style==='pony')return `<ellipse cx="366" cy="176" rx="51" ry="78" fill="${c}"/><path d="M150 195c5-88 48-137 111-137 65 0 106 49 109 134-33-30-69-45-108-45-39 0-76 16-112 48z" fill="${c}"/>`;
 return `<path d="M146 179c12-77 56-121 116-121 70 0 112 50 116 129l-25-18-20 31-28-22-25 31-31-22-29 26-26-30-25 22-27-26z" fill="${c}"/>`;
}
function V085_portraitSvg(i){
 const skin=V085_SKINS[i],hair=V085_HAIR[i],[bg1,bg2]=V085_BG[i],cloth=V085_CLOTH[i],accent=V085_ACCENT[i],style=V085_HAIR_STYLE[i],female=V085_CORE_CAST[i].gender==='female',faceX=female?158:154,faceR=512-faceX;
 const glasses=i%4===1?`<path d="M196 232h41m38 0h41m-79 0h38" stroke="${accent}" stroke-width="4"/><rect x="190" y="220" width="54" height="31" rx="13" fill="none" stroke="${accent}" stroke-width="4"/><rect x="268" y="220" width="54" height="31" rx="13" fill="none" stroke="${accent}" stroke-width="4"/>`:'';
 const earrings=i%3===0?`<circle cx="${faceX+2}" cy="273" r="9" fill="none" stroke="${accent}" stroke-width="4"/><circle cx="${faceR-2}" cy="273" r="9" fill="none" stroke="${accent}" stroke-width="4"/>`:'';
 const chain=i%5===2?`<path d="M213 383q43 45 86 0" stroke="${accent}" stroke-width="6" fill="none"/><circle cx="256" cy="420" r="8" fill="${accent}"/>`:'';
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></linearGradient><radialGradient id="g"><stop stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="512" height="512" rx="44" fill="url(#b)"/><circle cx="398" cy="84" r="170" fill="url(#g)"/><path d="M0 430Q120 380 256 416T512 402V512H0Z" fill="${accent}" opacity=".13"/><path d="M221 324h70l10 57h-90z" fill="${skin}"/><path d="M105 512c10-91 61-143 151-143s141 52 151 143H105z" fill="${cloth}"/><ellipse cx="${faceX+3}" cy="245" rx="16" ry="25" fill="${skin}"/><ellipse cx="${faceR-3}" cy="245" rx="16" ry="25" fill="${skin}"/><path d="M${faceX} 181C${faceX-8} 244 ${faceX+5} 316 256 343C${faceR-5} 316 ${faceR+8} 244 ${faceR} 181C356 145 156 146 ${faceX} 181Z" fill="${skin}"/><path d="M187 187c25-21 53-31 83-31 37 0 68 14 93 42-31-11-59-14-85-9-33 6-64 20-91 41z" fill="#fff" opacity=".08"/>${V085_hairMarkup(style,hair)}<path d="M194 215q22-14 45-1M274 214q22-13 45 1" stroke="${hair}" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M198 235q18-11 36 0-18 13-36 0Z" fill="#faf7f2"/><circle cx="216" cy="235" r="6.5" fill="#14161a"/><path d="M278 235q18-11 36 0-18 13-36 0Z" fill="#faf7f2"/><circle cx="296" cy="235" r="6.5" fill="#14161a"/><path d="M256 241l-9 37h23" stroke="#704632" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"/><path d="M224 296q32 19 64 0-32 33-64 0Z" fill="${female?'#6e2f45':'#5a332f'}"/>${glasses}${earrings}${chain}<rect x="7" y="7" width="498" height="498" rx="38" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="3"/></svg>`;
}
const V085_ARTIST_PORTRAITS=V085_CORE_CAST.map((_,i)=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(V085_portraitSvg(i)));
const V085_makeWorldBase=makeWorld;
makeWorld=function(){const world=V085_makeWorldBase();for(let i=0;i<V085_CORE_COUNT&&i<world.length;i++){const c=V085_CORE_CAST[i];world[i]={...world[i],name:c.name,genre:c.genre,portraitId:c.portraitId,coreArtist:true}}return world};
function V085_assignPortraits(world=s.world){if(!Array.isArray(world))return;const ids=V085_CORE_CAST.map(x=>x.portraitId),used=new Set(),pools={female:V085_CORE_CAST.filter(x=>x.gender==='female').map(x=>x.portraitId),male:V085_CORE_CAST.filter(x=>x.gender==='male').map(x=>x.portraitId)};const claim=gender=>{const preferred=(pools[gender]||[]).find(id=>!used.has(id)),id=preferred||ids.find(x=>!used.has(x));if(id)used.add(id);return id};for(let i=0;i<Math.min(V085_CORE_COUNT,world.length);i++){const a=world[i],valid=ids.includes(a.portraitId)&&!used.has(a.portraitId);if(valid)used.add(a.portraitId);else a.portraitId=claim(typeof V083_nameGender==='function'?V083_nameGender(a.name):'neutral');a.coreArtist=true}}
function migrateV085(){s.v085??={version:1};s.v085.version=1;V085_assignPortraits()}
function V085_portraitSource(id){const m=/^artist-(\d{2})$/.exec(String(id||''));if(!m)return null;const i=Number(m[1])-1;return V085_ARTIST_PORTRAITS[i]||null}
function V085_artistForPhoto(key,name){const m=/^artist-(\d+)$/.exec(String(key||''));if(m){const a=s.world?.[Number(m[1])];if(a&&a.name===name)return a}return s.world?.find?.(a=>a.coreArtist&&a.name===name)||null}
const V085_personPhotoBase=personPhoto;
personPhoto=function(key,name,large=false){const a=V085_artistForPhoto(key,name),src=a?V085_portraitSource(a.portraitId):null;if(!src)return V085_personPhotoBase(key,name,large);return `<img class="person-photo v085-core-portrait ${large?'portrait-large':''}" src="${src}" alt="Illustrated fictional portrait of ${esc(name)}" decoding="async" loading="${large?'eager':'lazy'}">`};
V084_featuredIndustryRoster=function(world=V084_activeIndustryRoster()){return V084_filteredIndustryRoster(world).slice(0,V085_CORE_COUNT)};
const V085_industryBase=industry;
industry=function(){const html=V085_industryBase();if(industryTab!=='Artists')return html;return html.replace(/(\d+) featured · (\d+) active artists?/,'$2 artists')};
const V085_renderBase=render;
render=function(){migrateV085();return V085_renderBase()};
