/* Song creation now moves directly through Write → Record → Mix. Creative
   direction is chosen before the session; recording/mixing no longer add a
   second layer of style-choice menus. */
function studio(){let html=studioLegacy();if(s.draft){const p=s.draft.sessionPlan||{};html=html.replace('<p class="project-persist">',`<div class="studio-stepper">${['01 Write','02 Record','03 Mix'].map((n,i)=>`<span class="${s.draft.steps>i?'complete':''}">${n}</span>`).join('')}</div><p class="project-persist">`);html=html.replace('<div class="project-stages">','<div class="project-stages" hidden>');html=html.replace('<div class="controls">',`<p>${esc(p.feedback||'The song is written. Continue through recording and mixing to finish the master.')}</p><div class="controls">`)}return html}
/* Compatibility only: old cached markup may still call these names. Current
   Studio screens never present session choices and both paths simply advance
   the authoritative baseline stage. */
function sessionChoices(){return progressSong()}
function performSession(){return progressSong()}
