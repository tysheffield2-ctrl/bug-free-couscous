function V143_num(v){const n=Number(v);return Number.isFinite(n)?n:0}
function V143_cycleValue(key,length,dir){const idea=ensureStudioIdeaSchema(),i=Math.max(0,Math.min(length-1,Number(idea[key])||0));setCreativeDirection(key,(i+dir+length)%length);render()}
function V143_serviceOptions(kind){
 const selfName=s.name||'You',selfQ=kind==='writing'?level('writing'):Math.round((level('recording')+level('charisma'))/2);
 return kind==='writing'?
  [{name:selfName,quality:selfQ,cost:0,note:'Write it yourself'},{name:'Independent songwriter',quality:55,cost:750,note:'Reliable outside writer'},{name:'Professional songwriter',quality:70,cost:3500,note:'Experienced commercial writer'},{name:'Hit-room writer',quality:84,cost:15000,note:'High-end writing room'},{name:'Elite songwriter',quality:96,cost:60000,note:'Top-tier writing specialist'}]:
  [{name:selfName,quality:selfQ,cost:0,note:'Perform it yourself'},{name:'Session artist',quality:55,cost:500,note:'Reliable session performance'},{name:'Professional vocalist',quality:70,cost:2500,note:'Polished professional performance'},{name:'Elite performer',quality:85,cost:12000,note:'High-end performance specialist'},{name:'A-list session artist',quality:97,cost:50000,note:'World-class performance'}]
}
function V143_studioOptions(){return (studioPackages||[]).map((x,i)=>({name:x.name,quality:Math.min(100,50+V143_num(x.quality)*5),cost:V143_num(x.fee),index:i,note:x.quality?`+${x.quality} production quality`:'No production bonus'}))}
function V143_albumOptions(){return [{id:null,title:'SINGLE'},...(s.albums||[]).filter(a=>!a.released).map(a=>({id:a.id,title:a.title}))]}
function V143_selected(key,options){const i=Math.max(0,Math.min(options.length-1,Number(ensureStudioIdeaSchema()[key])||0));return options[i]||options[0]}
function V143_picker(label,key,options){const o=V143_selected(key,options);return `<section class="v143-choice"><span>${label}</span><div class="v143-picker"><button type="button" aria-label="Previous ${label}" onclick="V143_cycleValue('${key}',${options.length},-1)">←</button><div><strong>${esc(o.name||o.title)}</strong>${o.quality!==undefined?`<small><b>${Math.round(o.quality)}</b> QUALITY · ${o.cost?money(o.cost):'$0'}</small>`:''}${o.note?`<em>${esc(o.note)}</em>`:''}</div><button type="button" aria-label="Next ${label}" onclick="V143_cycleValue('${key}',${options.length},1)">→</button></div></section>`}
function V143_creditCost(){const credits=Array.isArray(ensureStudioIdeaSchema().credits)?ensureStudioIdeaSchema().credits:[];return credits.filter(x=>x?.agreement==='accepted').reduce((n,x)=>n+V143_num(x.fee),0)}
function V143_total(){const a=V143_selected('artistryIndex',V143_serviceOptions('artistry')),w=V143_selected('writingIndex',V143_serviceOptions('writing')),st=V143_selected('studioIndex',V143_studioOptions());return V143_num(a?.cost)+V143_num(w?.cost)+V143_num(st?.cost)+V143_creditCost()}
function V143_applyChoices(idea){
 if(!s.draft)return;
 const artistry=V143_serviceOptions('artistry')[Number(idea.artistryIndex)||0]||V143_serviceOptions('artistry')[0];
 const writing=V143_serviceOptions('writing')[Number(idea.writingIndex)||0]||V143_serviceOptions('writing')[0];
 const studio=V143_studioOptions()[Number(idea.studioIndex)||0]||V143_studioOptions()[0];
 const albums=V143_albumOptions(),album=albums[Number(idea.albumIndex)||0]||albums[0];
 const dev=s.draft.development||{};
 const setMin=(k,q)=>{if(!dev[k])return;const cur=typeof dev[k]==='object'?Number(dev[k].level??dev[k].value??0):Number(dev[k]);if(cur>=q)return;if(typeof dev[k]==='object')dev[k]={...dev[k],level:q};else dev[k]=q};
 setMin('writing',writing.quality);setMin('recording',artistry.quality);setMin('charisma',Math.round(artistry.quality*.9));
 s.draft.sessionPlan={...(s.draft.sessionPlan||{}),artistryProvider:artistry.name,writingProvider:writing.name,studioProvider:studio?.name||'Studio',plannedAlbumId:album.id??null,serviceCost:V143_num(artistry.cost)+V143_num(writing.cost)};
 s.draft.plannedAlbumId=album.id??null;s.draft.explicit=!!idea.explicit;s.draft.creative={...(s.draft.creative||{}),explicit:!!idea.explicit};
 ENCORE_STUDIO?.score?.(s.draft);if(typeof creativeProfile==='function')s.draft.creativeScores=creativeProfile(s.draft)
}
function V143_songCreationPage(){
 const idea=ensureStudioIdeaSchema(),art=V143_serviceOptions('artistry'),writers=V143_serviceOptions('writing'),studios=V143_studioOptions(),albums=V143_albumOptions();
 const studio=V143_selected('studioIndex',studios),album=V143_selected('albumIndex',albums),total=V143_total(),credits=typeof V125_creditBuilder==='function'?`<details class="v143-credits"><summary>CREDITS & SPLITS</summary>${V125_creditBuilder()}</details>`:'';
 return `<article class="v143-song-create"><header class="v143-head"><button type="button" onclick="go('Career')">‹</button><span>⚡ ${s.energy}</span><h1>NEW SONG</h1></header><form onsubmit="V143_submitSong(event)"><input type="hidden" name="mood" value="${esc(idea.mood||directions[0].id)}"><input type="hidden" name="brief" value="${esc(idea.brief||'story')}"><input type="hidden" name="package" value="${studio?.index||0}"><label class="v143-title-label">SONG NAME</label><div class="v143-title-input"><input id="songtitle" name="songtitle" maxlength="70" value="${esc(idea.title||'')}" placeholder="Enter a song title" autocomplete="off" oninput="setCreativeDirection('title',this.value)" required><button type="button" aria-label="Generate song title" onclick="this.previousElementSibling.value=generate('song');setCreativeDirection('title',this.previousElementSibling.value)">✦</button></div><section class="v143-choice"><span>ASSIGN ALBUM</span><div class="v143-picker"><button type="button" aria-label="Previous album" onclick="V143_cycleValue('albumIndex',${albums.length},-1)">←</button><div><strong>${esc(album.title)}</strong><em>${album.id===null?'Standalone single':'Planned album placement'}</em></div><button type="button" aria-label="Next album" onclick="V143_cycleValue('albumIndex',${albums.length},1)">→</button></div></section>${V143_picker('ARTISTRY','artistryIndex',art)}${V143_picker('WRITING','writingIndex',writers)}${V143_picker('STUDIO','studioIndex',studios)}${credits}<div class="v143-total"><span>TOTAL COST</span><strong>${money(total)}</strong></div><div class="v143-controls"><button type="button" class="genre" onclick="V140_openGenre()">${esc(s.genre||'Pop')}</button><button type="button" class="clean" onclick="setCreativeDirection('explicit',ensureStudioIdeaSchema().explicit?'':'yes');render()">${idea.explicit?'EXPLICIT':'CLEAN'}</button></div><button class="v143-create" type="submit">CREATE · 10 ⚡</button><small class="v143-cash">CASH AVAILABLE: ${money(s.cash)}</small></form></article>`
}
function V143_submitSong(e){
 e?.preventDefault?.();if(s.draft)return;
 const idea={...ensureStudioIdeaSchema()},studio=V143_selected('studioIndex',V143_studioOptions()),art=V143_selected('artistryIndex',V143_serviceOptions('artistry')),writing=V143_selected('writingIndex',V143_serviceOptions('writing')),extra=V143_num(art?.cost)+V143_num(writing?.cost),total=extra+V143_num(studio?.cost)+V143_creditCost();
 if(V143_num(s.cash)<total){toast?.('You need '+money(total)+' for the selected song team.');return}
 newSong(e);
 if(!s.draft)return;
 if(extra>0&&!spend(0,extra))return;
 V143_applyChoices(idea);queueSave?.();render()
}
