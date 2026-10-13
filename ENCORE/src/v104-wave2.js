/* ENCORE Visual System 2.0 — Wave 2 presentation helpers. */
function V104_displayValue(value,fallback='—'){
 if(value===undefined||value===null||value==='')return fallback;
 if(typeof value==='function'||typeof value==='object')return fallback;
 return String(value)
}
function V104_isCompact(){return typeof matchMedia==='function'&&matchMedia('(max-width:700px)').matches}
const V104_navigationToolsBase=navigationTools;
navigationTools=function(){const html=V104_navigationToolsBase();return V104_isCompact()?html.replace('class="v103-shellbar"','class="v103-shellbar v104-shell-compact"'):html}
