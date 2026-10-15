/* Bind legacy ENCORE Studio actions to engine/studio.js.
   Presentation remains legacy here; simulation mutations are shared with UI2. */
scoreSong=function(d){return ENCORE_STUDIO.score(d)};
newSong=function(e){
 e?.preventDefault?.();if(!saveReady||saveConflict||s.draft)return;
 const f=new FormData(e.target),idea=typeof ensureStudioIdeaSchema==='function'?ensureStudioIdeaSchema():s.studioIdea||{};
 try{
  const d=ENCORE_STUDIO.start(s,{
   title:String(f.get('songtitle')||'').trim()||generate('song'),
   mood:String(f.get('mood')||idea.mood||ENCORE_STUDIO.directions[0].id),
   packageIndex:Number(f.get('package')||idea.package||0),
   brief:String(f.get('brief')||idea.brief||'story'),
   creative:{theme:idea.theme,tempo:idea.tempo,intent:idea.intent,texture:idea.texture,hook:idea.hook}
  });
  log('Started writing “'+d.title+'”.');queueSave();render();
 }catch(error){toast(error.message||'The writing session could not start.')}
};
performSession=function(id){
 if(!saveReady||saveConflict)return;
 try{const result=ENCORE_STUDIO.perform(s,id);log((result.stage==='record'?'Recording':'Mixing')+' session: '+result.option.name+'.');queueSave();render()}
 catch(error){toast(error.message||'That studio session could not be completed.')}
};
finishSong=function(release,confirmed=false){
 const d=s.draft;if(!d||d.steps!==3||!saveReady||saveConflict)return;
 if(release&&!confirmed){modal(`<h2>Publish this single?</h2><p>“${esc(d.title)}” will enter your released catalog. You cannot edit the finished recording afterward. Results arrive when you advance the week.</p><p>$20 · 5 energy</p><div class="controls"><button class="secondary" onclick="$(${JSON.stringify('modal')}).close()">Keep in studio</button><button class="primary" onclick="$(${JSON.stringify('modal')}).close();finishSong(true,true)">Release single</button></div>`);return}
 try{const song=ENCORE_STUDIO.finish(s,{release:!!release});log('“'+song.title+'” '+(release?'is out. Results arrive at the end of this week.':'is ready for your album.'));queueSave();render();toast(release?'Single released. Advance the week for results.':'Finished track saved.')}
 catch(error){toast(error.message||'The master could not be finished.')}
};
releaseShelf=function(id,confirmed=false){
 const x=s.songs.find(x=>x.id===id);if(!x||x.released||!saveReady||saveConflict)return;
 if(!confirmed){modal(`<h2>Release “${esc(x.title)}”?</h2><p>This publishes the finished recording. Pay $20 and 5 energy. Results arrive at week close.</p><button class="primary" onclick="releaseShelf(${JSON.stringify(id)},true)">Publish single</button>`);return}
 try{$('modal').close();const song=ENCORE_STUDIO.releaseShelf(s,id);log('“'+song.title+'” is out.');queueSave();render()}
 catch(error){toast(error.message||'The master could not be released.')}
};
