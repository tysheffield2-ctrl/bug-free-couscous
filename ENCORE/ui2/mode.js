/* UI2 mode identity: keep sandbox unmistakably separate from the normal career. */
(()=>{
'use strict';
const sandbox=globalThis.ENCORE_UI2_SAVE_URL==='/api/sandbox/save';
if(!sandbox)return;
document.documentElement.classList.add('ui2-sandbox-mode');
function mark(){
 const brand=document.querySelector('.ui2-brand');if(brand&&!brand.querySelector('.ui2-lab-mark'))brand.insertAdjacentHTML('beforeend','<small class="ui2-lab-mark">LAB</small>');
 const status=document.querySelector('.ui2-status');if(status)status.textContent=status.textContent.includes('loaded')?'Sandbox loaded ✓':'UI2 sandbox';
 const meta=document.querySelector('.ui2-topmeta span:first-child');if(meta)meta.innerHTML='<strong>UI2 LAB</strong> · separate sandbox save';
}
new MutationObserver(mark).observe(document.documentElement,{subtree:true,childList:true});mark();
})();