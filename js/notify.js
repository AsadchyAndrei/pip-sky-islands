/* Pip's Sky Islands: weekly emails, reminders and notifications (the server side is functions/index.js).
   - kidDigest(): a small summary of the current player saved with the player, so the weekly email can be written
   - Parents → Account: "Emails and notifications" (weekly email, reminders, notifications on this device, test email)
   - a one-time question on the Progress tab, and a "Weekly class email" switch on the teacher desk */
const taskName=t=>{const s=t.sk&&CONTENT.skills[t.sk]?CONTENT.skills[t.sk].name:'';return ((t.isl||[]).map(id=>(byId(id)||{}).name||id).join(', ')+(s?': '+s:'')).slice(0,80)};
function kidDigest(){if(G.roster||G.pack!==PACK.id)return null;
  const dd={};for(let i=0;i<14;i++){const k=addDays(-i),d=(G.days||{})[k];if(d&&(d.q||d.sec))dd[k]=[Math.round((d.sec||0)/60),d.q||0,d.c||0]}
  const SK=ISLANDS.filter(i=>i.gen&&!i.retired).flatMap(i=>skillsOf(i.id).map(s=>({...s,isl:i})));
  const need=SK.filter(s=>{const m=skStat(s.k);return m.n>=3&&m.st!==2}).sort((a,b)=>skStat(a.k).ok/skStat(a.k).n-skStat(b.k).ok/skStat(b.k).n).slice(0,4);
  const lang=(CL.userDoc&&CL.userDoc.lang)||undefined,tips=[...new Set(need.map(s=>s.isl.id))].slice(0,2).map(id=>[byId(id).name,homeTip(id,undefined,lang)]).filter(x=>x[1]); // the ideas in the family's language
  const g=G.fgoal,p=g&&fgProg(g),c=G.cls&&typeof classDoc==='function'?classDoc():null;
  const last=Object.keys(G.days||{}).filter(k=>(G.days[k].q||0)>0).sort().pop()||'';
  return JSON.stringify({v:1,name:G.name||'Player',grade:`${PACK.stateName}, ${GRADE_WORD(PACK.grade).toLowerCase()}`,dd,
    mast:SK.filter(s=>skStat(s.k).st===2).length,tot:SK.length,alm:SK.filter(s=>skAlmost(skStat(s.k))).length,
    need:need.map(s=>{const m=skStat(s.k);return [s.name,s.isl.name,m.ok,m.n]}),tips,
    goal:g&&p?{t:fgText(g),have:p.have,need:p.need,done:p.done,end:p.end,reward:g.reward||''}:null,
    cls:c?{teacher:c.teacher||'',note:(noteOf(c)||{}).text||'',tasks:openTasks().slice(0,8).map(t=>[taskName(t),t.due||'',!!t.done,t.id])}:null,last})}
/* the digest saved with each player (the current one is fresh; others keep the last one made on this device) */
function digestFor(id){try{if(id===ROOT.current){const d=kidDigest();if(d)localStorage.setItem('pip-dg-'+id,d);return d||''}return localStorage.getItem('pip-dg-'+id)||''}catch(e){return ''}}

/* ---------- settings ---------- */
const notifyOf=()=>(CL.userDoc||{}).notify||null;
/* 5 pm on this device's clock, in UTC: the server looks for the people whose 5 pm it is */
function notifySlot(){const d=new Date();d.setHours(17,0,0,0);let tz='America/Los_Angeles';try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||tz}catch(e){}return {tz,h:d.getUTCHours()}}
async function saveNotify(patch){const n=Object.assign({weekly:false,remind:false},notifyOf()||{},patch,notifySlot());
  CL.userDoc=Object.assign({},CL.userDoc,{notify:n});lsSet('pip-ud-'+CL.uid,JSON.stringify(CL.userDoc));
  try{await CL.api.setUserDoc({notify:n});return true}catch(e){return false}}
/* keep the 5 pm slot right after a move or a daylight-saving change */
function notifyFresh(){const n=notifyOf();if(CL.mode!=='cloud'||!n)return;const s=notifySlot();if(n.h!==s.h||n.tz!==s.tz)saveNotify({})}
const isTeach=()=>(CL.userDoc||{}).role==='teacher';
function notifyHTML(){if(CL.mode!=='cloud')return '';const n=notifyOf()||{},sw=(id,on)=>`<button type="button" class="switch" role="switch" id="${id}" aria-checked="${!!on}"></button>`;
  const push=CL.api.pushOn&&CL.api.pushOn();
  return `<div class="pcard wide nfy"><h4>Emails and notifications</h4><p class="note">Emails go to <b>${esc(CL.email||'your sign-in email')}</b>${CL.verified===false?'. Confirm this address first: open the link in the email we sent when you signed up.':'.'}</p>
    <div class="setrow"><label for="nWeekly">Weekly email<small>Sunday evening: minutes, skills, what to practice and ideas for home${isTeach()?', plus a summary of your classes':''}.</small></label>${sw('nWeekly',n.weekly)}</div>
    <div class="setrow"><label for="nRemind">Reminders<small>When a child has not played for 3 days, or a class task is due tomorrow. A notification if this device gets them, otherwise an email (at most one a week).</small></label>${sw('nRemind',n.remind)}</div>
    <div class="setrow"><label for="nPush">Notifications on this device<small id="nPushSub">New tasks and messages from the teacher, and reminders.</small></label>${sw('nPush',push)}</div>
    <div class="btnrow" style="justify-content:flex-start"><button type="button" class="go small alt" id="nTest">Send me this week's email now</button></div><p class="note" id="nNote" role="status"></p></div>`}
function bindNotify(){if(!$('#nWeekly'))return;const note=(t,ok)=>{const e=$('#nNote');e.className='note '+(ok?'ok':ok===false?'bad':'');e.textContent=t};
  const flip=async(id,key)=>{const b=$('#'+id),on=b.getAttribute('aria-checked')!=='true';b.setAttribute('aria-checked',on);if(!(await saveNotify({[key]:on}))){b.setAttribute('aria-checked',!on);note('Could not save. Check the internet and try again.',false)}else note(on?'Saved. ':'Turned off.',true)};
  $('#nWeekly').onclick=()=>flip('nWeekly','weekly');$('#nRemind').onclick=()=>flip('nRemind','remind');
  $('#nPush').onclick=async()=>{const b=$('#nPush'),on=b.getAttribute('aria-checked')!=='true';b.disabled=true;
    try{if(on){const r=await CL.api.enablePush();if(!r.ok){note(r.why==='unsupported'?(/iPhone|iPad/.test(navigator.userAgent)?'On iPhone and iPad: first add Pip to the Home Screen (Share → Add to Home Screen), open it from there, then turn this on.':'This browser cannot show notifications.'):r.why==='demo'?'Notifications are turned off in the demo.':r.why==='denied'?'Notifications are blocked for this site. Allow them in the browser settings, then try again.':'Notifications were not turned on.',false);b.disabled=false;return}
        b.setAttribute('aria-checked',true);note('Notifications are on for this device.',true)}
      else{await CL.api.disablePush();b.setAttribute('aria-checked',false);note('Notifications are off for this device.',true)}}
    catch(e){note('Could not change notifications right now. Try again in a minute.',false)}b.disabled=false};
  $('#nTest').onclick=async()=>{const b=$('#nTest');b.disabled=true;note('Sending...');
    try{await CL.api.sendTestEmail();note(`Sent to ${CL.email}. It can take a minute; check the spam folder too.`,true)}
    catch(e){const m=String((e&&e.message)||'');note(/demo/.test(m)?'Emails are not sent in the demo.':/no-email/.test(m)?'Confirm your email address first (the link in the sign-up email).':/nothing/.test(m)?'Nothing to send yet: play a few puzzles first.':/wait/.test(m)?'One test email every 5 minutes, please.':'Emails are not available yet. Try again later.',false)}
    setTimeout(()=>{b.disabled=false},4000)}}
/* asked once on the Progress tab */
function notifyAskHTML(){if(CL.mode!=='cloud'||notifyOf()||lsGet('pip-nask-'+CL.uid))return '';
  return `<div class="pcard wide nask"><h4>Weekly email about ${esc(G.name||'your child')}?</h4><p class="note">Every Sunday evening: minutes played, skills mastered, what to practice and one idea to try at home. You can turn it off any time in Account.</p><div class="btnrow" style="justify-content:flex-start"><button type="button" class="go small leaf" id="naYes">Yes, send it</button><button type="button" class="go small alt" id="naNo">No, thanks</button></div></div>`}
function bindNotifyAsk(){if(!$('#naYes'))return;
  $('#naYes').onclick=async()=>{await saveNotify({weekly:true,remind:true});toast('Weekly email is on','Every Sunday evening. Settings are in Account.','#38b98a');renderParent()};
  $('#naNo').onclick=()=>{lsSet('pip-nask-'+CL.uid,'1');renderParent()}}
/* teacher desk: one switch */
function teachNotifyHTML(){if(CL.mode!=='cloud')return '';const n=notifyOf()||{};
  return `<div class="pcard wide"><h4>Weekly class email</h4><div class="setrow"><label for="tnWeekly">Sunday evening summary<small>Who played, minutes, accuracy, who needs help and how tasks are going. Sent to ${esc(CL.email||'your email')}.</small></label><button type="button" class="switch" role="switch" id="tnWeekly" aria-checked="${!!n.weekly}"></button></div></div>`}
function bindTeachNotify(){const b=$('#tnWeekly');if(!b)return;b.onclick=async()=>{const on=b.getAttribute('aria-checked')!=='true';b.setAttribute('aria-checked',on);if(!(await saveNotify({weekly:on})))b.setAttribute('aria-checked',!on);else toast(on?'Weekly class email is on':'Weekly class email is off',on?'Every Sunday evening.':'','#38b98a')}}
