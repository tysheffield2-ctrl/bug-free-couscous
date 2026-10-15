/* ENCORE UI2 Phase 7 — player-facing language + finishing touches.
   No simulation changes live here. */
(()=>{
'use strict';
const sandbox=globalThis.ENCORE_UI2_SAVE_URL==='/api/sandbox/save';
const hash=value=>{let h=2166136261>>>0;for(const c of String(value||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)>>>0}return h>>>0};

function replaceText(node,from,to){if(node&&node.textContent.includes(from))node.textContent=node.textContent.replace(from,to)}

function polishChrome(){
 const nav=document.querySelector('.ui2-bottomnav');if(nav)nav.setAttribute('aria-label','ENCORE navigation');
 const status=document.querySelector('.ui2-status');
 if(status&&!sandbox){const loaded=/loaded|saved/i.test(status.textContent);status.textContent=loaded?'Career saved ✓':'Career setup';}
 const first=document.querySelector('.ui2-topmeta span:first-child');
 if(first&&!sandbox&&!first.dataset.phase7){first.dataset.phase7='1';first.innerHTML='<strong>CAREER</strong>';}
}

function polishHome(){
 const art=document.querySelector('.ui2-release-art');
 if(art&&!art.dataset.phase7){
  const title=art.nextElementSibling?.querySelector('strong')?.textContent?.trim()||art.textContent.trim()||'ENCORE';
  art.dataset.phase7='1';art.dataset.coverMark=title;art.style.setProperty('--cover-h',String(hash(title)%360));art.innerHTML='<span class="ui2-cover-glyph">♪</span>';
 }
 const strip=document.querySelector('.ui2-release-strip');if(strip?.dataset.toast?.includes('migration'))strip.dataset.toast='Release details are not available from this summary yet.';
 document.querySelectorAll('.ui2-feed-row[data-toast]').forEach(row=>{if(/reconnect|migration/i.test(row.dataset.toast||''))row.dataset.toast='Open the related career section for the full detail.'});
}

function polishCharts(){
 const kicker=document.querySelector('.ui2-chart-head .ui2-kicker');
 if(kicker&&/PREVIEW/i.test(kicker.textContent))kicker.textContent='WEEKLY ISSUE · AWAITING PUBLICATION';
 const toolbar=document.querySelector('.ui2-chart-toolbar span');
 if(toolbar&&/live game/i.test(toolbar.textContent))toolbar.textContent='Advance the week to publish the next chart issue.';
 const empty=document.querySelector('.ui2-chart-empty span');
 if(empty&&/live career/i.test(empty.textContent))empty.textContent='The first issue appears after you advance the week.';
}

function polishBusiness(){
 const hero=document.querySelector('.ui2-business-hero');if(!hero)return;
 const heading=hero.querySelector('h1');const p=hero.querySelector('p');
 if(heading?.textContent.trim()==='Your Business Office'){
  hero.classList.add('is-unformed');
  if(p)p.textContent='Your company starts here. Build executive readiness, form your label, then run the roster, finances and rights from this office.';
  if(!hero.querySelector('.ui2-company-prompt'))hero.insertAdjacentHTML('beforeend','<span class="ui2-company-prompt">Independent ownership · $25,000 formation when eligible</span>');
 }
 document.querySelectorAll('.ui2-inbox-row[data-toast]').forEach(row=>{if(/migration|reconnect/i.test(row.dataset.toast||''))row.dataset.toast='Review this item from the department that owns it.'});
 document.querySelectorAll('.ui2-department[data-toast]').forEach(row=>{if(/native UI2|next phase/i.test(row.dataset.toast||''))row.dataset.toast='This department is not available from the new office yet.'});
}

function polishMore(){
 const profile=document.querySelector('.ui2-more-profile');
 if(profile){const span=profile.querySelector('span');if(span&&/UI2 reads/i.test(span.textContent))span.textContent='Autosaved career · progress is shared across ENCORE.';}
 document.querySelectorAll('.ui2-more-group .ui2-section-title small').forEach(s=>{if(s.textContent.trim()==='Migration queue')s.textContent='Career systems'});
 const footer=document.querySelector('.ui2-more-footer');
 if(footer){const tag=footer.querySelector('span'),strong=footer.querySelector('strong');if(tag)tag.textContent='ENCORE';if(strong)strong.textContent='Career systems · synchronized save';}
 const messages=new Map([
  ['Awards & Honors','Awards, nominations, milestones and legacy history are being prepared for this directory.'],
  ['Wealth & Assets','Properties, vehicles, investments and ownership remain part of your career.'],
  ['Player Guide','Gameplay systems, rules and help remain available from the main ENCORE guide.'],
  ['Save Tools','Backups, imports and reset controls remain protected by the existing save tools.'],
  ['Settings','Appearance, accessibility and preferences will live here.']
 ]);
 document.querySelectorAll('[data-ui2-more-info]').forEach(button=>{const title=button.querySelector('strong')?.textContent.trim();if(messages.has(title))button.dataset.ui2MoreInfo=messages.get(title)});
}

function polishTouringPulse(){
 const tour=document.querySelector('.ui2-tour-screen');
 if(tour){
  const lead=tour.querySelector('.ui2-extra-head p');if(lead&&/live engine|UI2 reads/i.test(lead.textContent))lead.textContent='See the road as one connected run: route, dates, show economics and results.';
  const empty=tour.querySelector('.ui2-extra-empty');if(empty&&/UI2 will populate/i.test(empty.textContent))empty.textContent='No tour route exists yet. Plan your first run to start the map.';
  tour.querySelectorAll('[data-ui2-extra-toast]').forEach(b=>{if(/reconnect|migration/i.test(b.dataset.ui2ExtraToast||''))b.dataset.ui2ExtraToast=b.textContent.includes('offer')?'Tour offers are not available from this screen yet.':'Route editing is not available from this screen yet.'});
 }
 const pulse=document.querySelector('.ui2-pulse-screen');
 if(pulse){const compose=pulse.querySelector('.ui2-pulse-compose[data-ui2-extra-toast]');if(compose&&/reconnect|approved/i.test(compose.dataset.ui2ExtraToast||''))compose.dataset.ui2ExtraToast='Posting from this screen is not available yet.';}
}

function polish(){polishChrome();polishHome();polishCharts();polishBusiness();polishMore();polishTouringPulse()}
let scheduled=false;
const schedule=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;polish()})};
new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true});
polish();
})();