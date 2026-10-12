/* ENCORE 0.9.4 hotfix: keep sandbox PULSE controls atomic and backward-compatible. */

/* Do not mutate social state merely by reading analytics. The underlying analytics function
   already migrates social when the game genuinely needs that system. */
socialAnalytics=function(){
 const base=V095_socialAnalyticsBase();
 if(!SANDBOX||!Number.isFinite(s.social?.sandboxEngagementRate))return base;
 const rate=Math.max(0,s.social.sandboxEngagementRate),engagements=Math.round(base.views*rate),engagedReach=base.posts.length?base.views*rate/base.posts.length:0;
 const signal=base.posts.length?Math.round(clamp(Math.log10(1+engagedReach)*13+Math.min(20,rate*200)+Math.min(10,base.posts.length*2))):0;
 return {...base,engagements,rate,engagedReach,signal}
};

/* Opening ENCORE LAB settings must be read-only until the player submits the form. */
sandboxEditor=function(){
 if(!SANDBOX||!saveReady||saveConflict)return;
 V095_sandboxEditorBase();
 const el=$('modal');if(!el?.open)return;
 const followers=Number.isFinite(s.social?.followers)?s.social.followers:Math.round(Math.max(60,s.fans*.75));
 const a=s.social,posts=Array.isArray(a?.posts)?a.posts.filter(p=>p.week>=s.week-8):[],views=posts.reduce((n,p)=>n+(Number(p.views)||0),0),engagements=posts.reduce((n,p)=>n+(Number(p.likes)||0)+(Number(p.comments)||0)+(Number(p.shares)||0),0),computedRate=views?engagements/views:0;
 const rate=Number.isFinite(s.social?.sandboxEngagementRate)?s.social.sandboxEngagementRate*100:computedRate*100;
 el.innerHTML=el.innerHTML.replace('<h3>Artist skills · 0–100</h3>',`<h3>PULSE sandbox controls</h3><p class="fine">These fields exist only in ENCORE LAB. They never appear in a normal career.</p><label>PULSE followers<input name="pulseFollowers" type="number" min="0" max="9007199254740991" step="1" value="${Math.round(followers)}" required></label><label>PULSE engagement rate (%)<input name="pulseEngagement" type="number" min="0" max="10000" step="0.1" value="${rate.toFixed(1)}" required></label><p class="fine">Engagement may exceed 100% because one viewer can like, comment and share the same post.</p><h3>Artist skills · 0–100</h3>`)
};

/* Older tests/import helpers submit the pre-0.9.4 sandbox form without PULSE fields.
   Treat those fields as optional at the API boundary, while the visible LAB form requires both. */
applySandboxEdits=function(event){
 if(!SANDBOX||!saveReady||saveConflict)return;
 const f=new FormData(event.target),rawFollowers=f.get('pulseFollowers'),rawEngagement=f.get('pulseEngagement'),hasFollowers=rawFollowers!==null,hasEngagement=rawEngagement!==null,hasPulse=hasFollowers||hasEngagement;
 let followers=null,engagement=null;
 if(hasPulse){
  if(!hasFollowers||!hasEngagement){event.preventDefault?.();if($('lab-error'))$('lab-error').textContent='Enter both PULSE followers and engagement rate.';return}
  followers=Number(rawFollowers);engagement=Number(rawEngagement);
  if(!Number.isSafeInteger(followers)||followers<0||followers>Number.MAX_SAFE_INTEGER){event.preventDefault?.();if($('lab-error'))$('lab-error').textContent='Enter a whole-number PULSE follower count.';return}
  if(!Number.isFinite(engagement)||engagement<0||engagement>10000){event.preventDefault?.();if($('lab-error'))$('lab-error').textContent='Enter PULSE engagement from 0% to 10,000%.';return}
 }
 V095_applySandboxEditsBase(event);
 if($('modal').open||!hasPulse)return;
 migrateSocial();s.social.followers=followers;s.social.sandboxEngagementRate=engagement/100;
 log('Sandbox PULSE followers and engagement rate updated.');queueSave();render();toast('Sandbox PULSE settings applied.')
};
