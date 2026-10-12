/* ENCORE 1.0 sandbox entry hotfix.
   Sandbox data remains isolated behind /sandbox and /api/sandbox/save.
   This only restores a visible route from the normal title screen; it never creates,
   resets, migrates, or overwrites a sandbox save. */
(function(){
 const previousRenderTitle=renderTitle;
 renderTitle=function(){
  previousRenderTitle();
  if(SANDBOX||!titleVisible)return;
  const shell=document.querySelector?.('#title-screen .intro-shell');
  if(!shell||shell.querySelector('[data-sandbox-entry]'))return;
  const footer=shell.querySelector('.intro-footer');
  const button=document.createElement('button');
  button.className='intro-secondary';
  button.dataset.sandboxEntry='true';
  button.textContent='Open Sandbox';
  button.onclick=()=>{globalThis.location.href='/sandbox'};
  if(footer)shell.insertBefore(button,footer);else shell.appendChild(button);
 };
})();
