/* ENCORE 0.9.3 — Career World depth: PULSE scale, richer conversations and connected career systems. */
const V093_socialAnalyticsBase=socialAnalytics;
socialAnalytics=function(){const m=V093_socialAnalyticsBase();const rate=clamp(m.rate*1.75,0,.28);const engagedReach=m.posts.length?m.views*rate/m.posts.length:0;const signal=m.posts.length?Math.round(clamp(Math.log10(1+engagedReach)*13+Math.min(24,rate*180)+Math.min(10,m.posts.length*2))):0;return {...m,rate,engagedReach,signal}}

function V093_weeklyStreamScale(){return Math.max(0,Number(s.empire?.lastMonth?.streams||s.streams||0))}
function V093_organicPulseFollowers(){migrateSocial();const streams=V093_weeklyStreamScale(),momentum=clamp(Number(s.careerWorld?.momentum||0),0,100),market=level('marketability'),viral=level('viralAbility'),rep=clamp(s.reputation||0,0,100);if(streams<1000)return 0;const discovery=Math.pow(streams,.55)*(1.1+market*.012+viral*.014+rep*.006+momentum*.005),fanFloor=Math.sqrt(Math.max(0,s.fans||0))*12,cap=Math.max(5000,Math.min(250000000,(s.fans||0)*.08+streams*.00008));return Math.max(0,Math.min(Math.round(discovery+fanFloor),Math.round(cap)))}
const V093_finishSocialWeekBase=finishSocialWeek;
finishSocialWeek=function(){migrateSocial();const before=s.social.followers,last=s.social.lastWeek;V093_finishSocialWeekBase();if(last===s.week)return;const organic=V093_organicPulseFollowers();if(organic>0){s.social.followers+=organic;const row=s.social.weekly.find(x=>x.week===s.week);if(row)row.net=(row.net||0)+organic;log('PULSE discovery: +'+compact(organic)+' followers from music reach and career momentum.')}if(s.social.followers<before)s.social.followers=before}

const V093_replyChoices={
 appreciative:['Thank y’all for showing up. I appreciate every one of you.','Much love. Y’all made this night special.','Thank you for riding with me. More is coming.'],
 excited:['That energy was CRAZY. We have to do it again!','Y’all were LOUD tonight. I’m still on a high.','Best crowd yet. We’re only getting started.'],
 tease:['Just wait until you see what we’re planning next.','I might have something special coming sooner than you think.','Keep that same energy. The next move is bigger.'],
 funny:['So basically y’all are saying I have to come back 😂','Okay okay, I heard y’all. Don’t make me book another show 😂','My voice is gone and somehow y’all still want more 😭'],
 confident:['This is what we built for. Bigger rooms next.','We came to make a statement. Mission accomplished.','One city down. The world is next.']
};
function V093_fillReply(text){const box=$('reply-text');if(box){box.value=text;box.focus()}}
function V093_replyPicker(){const groups=Object.entries(V093_replyChoices);return `<div class="reply-suggestions"><span class="eyebrow">QUICK REPLIES</span><p class="fine">Pick a randomized tone or write your own response.</p><div class="chips">${groups.map(([tone,lines])=>{const line=pick(lines);return `<button type="button" onclick="V093_fillReply('${line.replaceAll("'","\\'")}')">${tone[0].toUpperCase()+tone.slice(1)}</button>`}).join('')}</div></div>`}
const V093_openPulseThreadBase=openPulseThread;
openPulseThread=function(key){V093_openPulseThreadBase(key);const form=$('reply-text')?.closest?.('form');if(form&&!form.querySelector('.reply-suggestions'))form.insertAdjacentHTML('beforebegin',V093_replyPicker())}
