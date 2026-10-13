/* Wave 2 — small presentation guardrails for dynamic labels. */
function V104_displayValue(value,fallback='—'){
 if(value===undefined||value===null||value==='')return fallback;
 if(typeof value==='function')return fallback;
 if(typeof value==='object')return fallback;
 return String(value)
}
