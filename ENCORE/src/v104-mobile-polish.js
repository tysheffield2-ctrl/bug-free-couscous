/* ENCORE Visual System 2.0 — Wave 2 shell semantics. */
function V104_shellCompact(){return typeof matchMedia==='function'&&matchMedia('(max-width:700px)').matches}
const V104_navigationToolsBase=navigationTools;
navigationTools=function(){
 const html=V104_navigationToolsBase();
 return V104_shellCompact()?html.replace('class="v103-shellbar"','class="v103-shellbar v104-shell-compact"'):html
}
