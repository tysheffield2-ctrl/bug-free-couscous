/* Keep legacy/headless callers from replacing sanitized Studio idea strings with undefined DOM values. */
V125_syncIdea=function(){const i=V125_idea(),t=$('songtitle');if(typeof t?.value==='string')i.title=t.value;const f=t?.form;if(f)for(const k of ['mood','brief','package']){const x=f.elements?.[k];if(typeof x?.value==='string')i[k]=x.value}return i};
