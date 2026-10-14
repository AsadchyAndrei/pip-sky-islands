/* Pip's Sky Islands: classes. A teacher account owns classes (cloud: classes/{cid}); children are either on the
   teacher's roster (profiles in the teacher's own account, played on classroom devices with a picture password)
   or join from home with the class code (their grown-up's account shares a progress summary with the class).
   The teacher sees only the summary documents (classes/{cid}/members), never a family's account. */

/* ---------- picture passwords: two pictures out of twelve, tapped in order ---------- */
const PICS=[
  ['Sun','<circle cx="20" cy="20" r="8" fill="#ffc23d"/><g stroke="#e09a14" stroke-width="3" stroke-linecap="round"><path d="M20 4v5M20 31v5M4 20h5M31 20h5M8.7 8.7l3.5 3.5M27.8 27.8l3.5 3.5M8.7 31.3l3.5-3.5M27.8 12.2l3.5-3.5"/></g>'],
  ['Moon','<path d="M25 6a14 14 0 1 0 9 22A12 12 0 0 1 25 6z" fill="#ffe08a" stroke="#c99a1c" stroke-width="2"/>'],
  ['Star','<path d="M20 4l4.7 9.6 10.6 1.5-7.7 7.5 1.8 10.5L20 28.1l-9.4 5 1.8-10.5-7.7-7.5 10.6-1.5z" fill="#ffc23d" stroke="#e09a14" stroke-width="2" stroke-linejoin="round"/>'],
  ['Heart','<path d="M20 33S5 24 5 14a7.5 7.5 0 0 1 15-2 7.5 7.5 0 0 1 15 2c0 10-15 19-15 19z" fill="#ff6b8a" stroke="#c23a5c" stroke-width="2"/>'],
  ['Tree','<rect x="17" y="24" width="6" height="11" rx="1" fill="#8c5a2c"/><circle cx="20" cy="16" r="11" fill="#38b98a" stroke="#2e7d4f" stroke-width="2"/>'],
  ['Fish','<path d="M6 20c6-9 18-9 24 0-6 9-18 9-24 0z" fill="#5fc3f0" stroke="#1f6fa0" stroke-width="2"/><path d="M30 20l7-6v12z" fill="#5fc3f0" stroke="#1f6fa0" stroke-width="2" stroke-linejoin="round"/><circle cx="13" cy="18" r="2" fill="#1f3557"/>'],
  ['Apple','<path d="M20 12c-8-4-15 2-13 10 2 8 7 13 13 10 6 3 11-2 13-10 2-8-5-14-13-10z" fill="#ef4f4f" stroke="#a62b2b" stroke-width="2"/><path d="M20 12c0-4 2-6 5-7" stroke="#6b3d1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>'],
  ['Flower','<g fill="#e2558f"><circle cx="20" cy="10" r="6"/><circle cx="29.5" cy="17" r="6"/><circle cx="26" cy="28" r="6"/><circle cx="14" cy="28" r="6"/><circle cx="10.5" cy="17" r="6"/></g><circle cx="20" cy="20" r="5" fill="#ffc23d"/>'],
  ['Boat','<path d="M5 25h30l-5 9H10z" fill="#8c5a2c" stroke="#5a3818" stroke-width="2" stroke-linejoin="round"/><path d="M20 5v19M20 6l11 16H20z" fill="#fff" stroke="#1f3557" stroke-width="2" stroke-linejoin="round"/>'],
  ['Cloud','<path d="M11 30a7 7 0 0 1-1-14 9 9 0 0 1 17-2 7 7 0 0 1 3 16z" fill="#dff3ff" stroke="#2f9fe0" stroke-width="2" stroke-linejoin="round"/>'],
  ['Kite','<path d="M20 4l10 12-10 14-10-14z" fill="#9b6bff" stroke="#5b34b8" stroke-width="2" stroke-linejoin="round"/><path d="M20 30c-2 3 2 4 0 7" stroke="#5b34b8" stroke-width="2" fill="none"/>'],
  ['Car','<path d="M6 26v-5l4-7h18l5 7v5z" fill="#ff9f43" stroke="#b8621a" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="27" r="4" fill="#1f3557"/><circle cx="28" cy="27" r="4" fill="#1f3557"/><path d="M12 15h7v6h-9zM22 15h5l3 6h-8z" fill="#dff3ff"/>']];
const picSVG=(i,cls='')=>`<svg class="ppic ${cls}" viewBox="0 0 40 40" role="img" aria-label="${PICS[i][0]}">${PICS[i][1]}</svg>`;
function newPics(){const a=Math.floor(Math.random()*PICS.length);let b;do{b=Math.floor(Math.random()*PICS.length)}while(b===a);return [a,b]}
function picLogin(p,ok){let got=[];
  const html=()=>`<div class="eyebrow">Hi ${esc(p.name||'there')}!</div><h2 style="font-size:26px">Tap your 2 pictures</h2><div class="picgot">${[0,1].map(k=>got[k]!=null?picSVG(got[k]):'<i></i>').join('')}</div>
    <div class="picgrid">${PICS.map((x,i)=>`<button type="button" data-pic="${i}" aria-label="${x[0]}">${picSVG(i)}</button>`).join('')}</div>
    <div class="btnrow"><button type="button" class="go alt small" id="picNo">Not me</button></div>`;
  const bind=()=>{$('#picNo').onclick=closeOverlay;document.querySelectorAll('[data-pic]').forEach(b=>b.onclick=()=>{got.push(+b.dataset.pic);tone([523+got.length*60]);
    if(got.length<2){$('#ocard').innerHTML=html();bind();return}
    if(got[0]===p.pic[0]&&got[1]===p.pic[1]){closeOverlay();ok();return}
    got=[];sNo();$('#ocard').innerHTML=html();bind();const g=$('#ocard .picgot');g&&g.classList.add('bad')})};
  overlay(html(),bind)}

const BOARD_ICO=`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="4" width="19" height="13" rx="2" fill="#2e7d4f" stroke="#1f3557" stroke-width="2"/><path d="M6 9h7M6 12.5h4" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><path d="M8 17l-2 4M16 17l2 4" stroke="#1f3557" stroke-width="2" stroke-linecap="round"/></svg>`;
/* ---------- state ---------- */
const TC={classes:null,cur:'',mem:{},tab:'kids',busy:false,err:''};
const isTeacher=()=>CL.mode==='cloud'&&(CL.userDoc||{}).role==='teacher';
const classDevice=()=>CL.mode!=='guest'&&CL.uid?lsGet('pip-classdev-'+CL.uid)||'':'';
const rosterOf=cid=>Object.entries(ROOT.profiles).filter(([,p])=>p.roster&&p.cls&&p.cls.cid===cid).sort((a,b)=>(a[1].name||'').localeCompare(b[1].name||''));
const curClass=()=>(TC.classes||[]).find(c=>c.cid===TC.cur);
const packLabel=pk=>{const P=CONTENT.packs[pk];return P?`${P.stateName}, ${GRADE_WORD(P.grade).toLowerCase()}`:pk};
const packIslands=pk=>((CONTENT.packs[pk]||{}).islands||[]).filter(i=>(i.skills||[]).length);
const packSkills=pk=>packIslands(pk).flatMap(i=>i.skills.map(k=>CONTENT.skills[k]).filter(Boolean).map(s=>({...s,isl:i.id})));
async function loadClasses(force){
  if(!force&&TC.classes)return TC.classes;
  const key='pip-classes-'+CL.uid;
  try{TC.classes=await CL.api.myClasses();lsSet(key,JSON.stringify(TC.classes));TC.err=''}
  catch(e){TC.classes=lsJSON(key)||[];TC.err='offline'}
  TC.classes.sort((a,b)=>(a.name||'').localeCompare(b.name||''));return TC.classes}
async function loadMembers(cid){try{TC.mem[cid]=await CL.api.members(cid)}catch(e){TC.mem[cid]=TC.mem[cid]||[]}return TC.mem[cid]}
/* change a profile that is not the one playing right now (roster children) */
function touchKid(id,fn){const p=ROOT.profiles[id];if(!p)return;fn(p);p._u=Date.now();if(id===ROOT.current)G=p;persistLocal();if(CL.mode==='cloud'){CL.dirty[id]=1;cloudSchedule(1500)}}

/* ---------- the child's side: summary for the teacher, tasks, topics ---------- */
function memberSum(){
  if(!G.cls||G.pack!==PACK.id)return null;
  const sk={},isl={};
  for(const i of ISLANDS){if(!i.gen||i.retired)continue;const L=skillsOf(i.id).filter(s=>CONTENT.skills[s.k]);if(!L.length)continue;
    let d=0;for(const s of L){const m=skStat(s.k);if(m.n)sk[s.k]=[m.st,m.ok,m.n];if(m.st===2)d++}isl[i.id]=[starFor(i.id),d,L.length]}
  const days=[...Array(7)].map((_,k)=>addDays(k-6)),m7=Math.round(days.reduce((s,k)=>s+((G.days[k]||{}).sec||0),0)/60);
  const all=Object.values(G.stats||{}).reduce((a,s)=>[a[0]+s.a,a[1]+s.c],[0,0]);
  const wrong=(G.wrongLog||[]).filter(w=>byId(w.i)).slice(0,15).map(w=>{const s=w.t!=null?skillOf(w.i,w.t):null;return {i:w.i,k:s&&CONTENT.skills[s.k]?s.k:'',p:String(w.p||'').slice(0,120),g:w.g||'',a:String(w.a||'').slice(0,40),d:w.d}});
  const lastDay=Object.keys(G.days||{}).filter(k=>(G.days[k].q||0)>0).sort().pop()||'';
  const wk=off=>{const D=[...Array(7)].map((_,k)=>addDays(k-6-off));return [Math.round(D.reduce((s,k)=>s+((G.days[k]||{}).sec||0),0)/60),D.reduce((s,k)=>s+((G.days[k]||{}).q||0),0),D.reduce((s,k)=>s+((G.days[k]||{}).c||0),0)]};
  return {v:1,sk,isl,a:all[0],c:all[1],m7,w:wk(0),wp:wk(7),wh:weekHist(8),last:lastDay,tasks:G.taskDone||{},wrong}}
function memberDoc(){const s=memberSum();return s&&{name:(G.name||'Player').slice(0,16),pack:G.pack,ts:Date.now(),sum:JSON.stringify(s),...(G.cls.code?{code:G.cls.code}:{})}}
let clsPushT=0,clsPushAt=0;
function classPush(now){if(CL.mode!=='cloud'||!G.cls||!ROOT.current)return;clearTimeout(clsPushT);const wait=now?0:Math.max(0,clsPushAt+120000-Date.now());
  const id=ROOT.current;clsPushT=setTimeout(()=>{if(ROOT.current!==id||!G.cls)return;const d=memberDoc();if(!d)return;clsPushAt=Date.now();
    CL.api.saveMember(G.cls.cid,id,d).catch(e=>{if(e&&e.code==='permission-denied')classCheck(true)})},wait)}
/* the class document (topics and tasks) is cached per class; a child removed from the class, or a deleted class, is let go */
const clsCache=cid=>lsJSON('pip-class-'+cid);
async function classCheck(force){if(CL.mode!=='cloud'||!G.cls)return;const cid=G.cls.cid,id=ROOT.current,c0=clsCache(cid);
  if(!force&&c0&&Date.now()-(c0._at||0)<10*60000)return;
  let c=null,m=null;try{c=await CL.api.getClass(cid);m=await CL.api.getMember(cid,CL.uid+'_'+id)}catch(e){return}
  if(ROOT.current!==id||!G.cls||G.cls.cid!==cid)return;
  if(!c||(m&&m.removed)){const nm=G.cls.name;if(m)CL.api.leaveClass(cid,id).catch(()=>{});touchKid(id,p=>{delete p.cls});try{localStorage.removeItem('pip-class-'+cid)}catch(e){}
    if(!G.roster)toast('Class left',`${esc(nm||'The class')} is no longer linked to ${esc(G.name||'this player')}.`,'#2f9fe0');return}
  c._at=Date.now();lsSet('pip-class-'+cid,JSON.stringify(c));
  if(c.name!==G.cls.name||c.teacher!==G.cls.teacher)touchKid(id,p=>{p.cls=Object.assign({},p.cls,{name:c.name,teacher:c.teacher})});
  if(!m)classPush(true);
  if(c.pack&&c.pack!==G.pack&&CONTENT.packs[c.pack]&&canAdopt()){packSwitch(c.pack);save();try{localStorage.setItem('pip-pack',c.pack)}catch(e){}
    toast(`Now in ${GRADE_WORD(CONTENT.packs[c.pack].grade).toLowerCase()}!`,`${esc(c.teacher||'The teacher')} moved the class. Last year's stars are kept safe.`,'#38b98a');setTimeout(()=>location.reload(),1800);return}
  if(curScreen==='map')renderClassCard()}
const classDoc=()=>G.cls?clsCache(G.cls.cid):null;
const myMid=()=>CL.uid+'_'+ROOT.current;
function openTasks(){const c=classDoc();if(!c)return [];const mid=myMid(),done=G.taskDone||{};
  return (c.tasks||[]).filter(t=>(!t.to||!t.to.length||t.to.includes(mid))).map(t=>({...t,done:!!done[t.id]}))}
/* topics "in class right now": the teacher's list wins over the grown-up's list */
function nowList(){const c=classDoc();return c&&(c.now||[]).length?c.now.filter(id=>byId(id)):(G.settings.now||[])}
function classRoundDone(S){if(!G.cls||!S||!S.isl)return;const id=S.isl.id,c=classDoc();if(!c)return;let hit=false;
  for(const t of c.tasks||[])if((t.isl||[]).includes(id)&&!(G.taskDone||{})[t.id]){
    const left=t.isl.filter(x=>x!==id&&!((G.taskRounds||{})[t.id]||[]).includes(x));G.taskRounds=Object.assign({},G.taskRounds,{[t.id]:[...new Set([...((G.taskRounds||{})[t.id]||[]),id])]});
    if(!left.length){G.taskDone=Object.assign({},G.taskDone,{[t.id]:Date.now()});hit=true}}
  if(hit)toast('Task done!',`${esc(G.cls.teacher||'Your teacher')} will see it.`,'#38b98a');classPush(hit)}
function renderClassCard(){const el=$('#classCard');if(!el)return;const c=classDoc();if(!c){el.hidden=true;return}
  const L=openTasks().sort((a,b)=>a.done-b.done||String(a.due||'9').localeCompare(String(b.due||'9')));const open=L.filter(t=>!t.done);
  if(!L.length&&!(c.now||[]).length){el.hidden=true;return}
  el.hidden=false;const due=d=>d?`due ${new Date(d+'T12:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}`:'';
  el.innerHTML=`<div class="cchead"><span class="ccico">${BOARD_ICO}</span><div><div class="eyebrow">From ${esc(c.teacher||'your teacher')} · ${esc(c.name)}</div><b>${open.length?`${open.length} task${open.length>1?'s':''} to do`:L.length?'All tasks done!':'In class right now'}</b></div></div>
    ${L.length?`<div class="cctasks">${L.slice(0,4).map(t=>`<div class="cctask${t.done?' done':''}">${(t.isl||[]).map(id=>byId(id)).filter(Boolean).map(i=>`<button type="button" class="ccisl" data-cc="${i.id}" style="--c:${i.color}">${esc(i.name)}${((G.taskRounds||{})[t.id]||[]).includes(i.id)?' ✓':''}</button>`).join('')}<small>${t.done?'Done':esc(due(t.due))}${t.note?` · ${esc(t.note)}`:''}</small></div>`).join('')}</div>`:''}
    ${(c.now||[]).length?`<p class="ccnow">In class now: ${c.now.map(byId).filter(Boolean).map(i=>esc(i.topic)).join(', ')}</p>`:''}`;
  el.querySelectorAll('[data-cc]').forEach(b=>b.onclick=()=>{tone([523,784]);const i=byId(b.dataset.cc);i.gen&&!i.special?openIsland(i):start(i)})}

/* ---------- a grown-up joins a class from home (Grown-ups → School program) ---------- */
function classParentHTML(){if(CL.mode!=='cloud')return `<div class="pcard wide"><h4>Join a teacher's class</h4><p class="note">Sign in with a grown-up account to join a class with the teacher's class code.</p></div>`;
  if(G.roster)return '';
  if(G.cls)return `<div class="pcard wide"><h4>Teacher's class</h4><p>${esc(G.name||'Your child')} is in <b>${esc(G.cls.name||'a class')}</b>${G.cls.teacher?` with <b>${esc(G.cls.teacher)}</b>`:''}. The teacher sees ${esc(G.name||'your child')}'s first name, skills, stars, minutes played this week, finished tasks and recent mistakes, and nothing else from your account.</p><div class="btnrow"><button type="button" class="go small alt" id="clsLeave">Leave the class</button></div><p class="note" id="clsNote" role="status"></p></div>`;
  return `<div class="pcard wide"><h4>Join a teacher's class</h4><p class="note">If ${esc(G.name||'your child')}'s teacher uses Pip, type the 6-character class code. The teacher then sees ${esc(G.name||'your child')}'s progress and can send tasks.</p><div class="setrow"><input type="text" id="clsCode" class="codein" maxlength="6" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="ABC234" aria-label="Class code"><button type="button" class="go small" id="clsJoin">Join</button></div><p class="note" id="clsNote" role="status"></p></div>`}
function bindClassParent(){const note=(t,ok)=>{const n=$('#clsNote');if(n){n.className='note '+(ok?'ok':'bad');n.textContent=t}};
  if($('#clsJoin'))$('#clsJoin').onclick=async()=>{const code=$('#clsCode').value.trim().toUpperCase();if(!/^[A-Z2-9]{6}$/.test(code)){note('A class code has 6 letters and digits.');return}
    $('#clsJoin').disabled=true;note('Looking for the class...',true);let c=null;try{c=await CL.api.classByCode(code)}catch(e){}
    $('#clsJoin').disabled=false;if(!c){note('No class with this code. Check it with the teacher.');return}
    overlay(`<div class="eyebrow">Join a class</div><h2>${esc(c.name)}</h2><p>${esc(c.teacher||'The teacher')} · ${esc(packLabel(c.pack))}</p>
      <ul class="glist"><li>The teacher will see <b>${esc(G.name||'your child')}</b> (first name or nickname), skills and stars, minutes played this week, finished tasks and recent mistakes.</li><li>Nothing else: no email, no other children, no account details.</li><li>You can leave the class at any time here.</li></ul>
      ${c.pack!==G.pack?`<p class="note">The class plays <b>${esc(packLabel(c.pack))}</b>. ${esc(G.name||'Your child')}'s islands switch to it; progress in the other grade stays safe.</p>`:''}
      <div class="btnrow"><button class="go" type="button" id="clsYes">Join the class</button><button class="go alt" type="button" id="clsNo">Cancel</button></div><p class="note" id="clsN2"></p>`,()=>{
      $('#clsNo').onclick=closeOverlay;$('#clsYes').onclick=async()=>{$('#clsYes').disabled=true;const id=ROOT.current;
        G.cls={cid:c.cid,code,name:c.name,teacher:c.teacher||''};
        try{await CL.api.saveMember(c.cid,id,{name:(G.name||'Player').slice(0,16),pack:c.pack,code,ts:Date.now()})}
        catch(e){delete G.cls;$('#clsYes').disabled=false;const n=$('#clsN2');n.className='note bad';n.textContent='Could not join right now. Check the internet and try again.';return}
        c._at=Date.now();lsSet('pip-class-'+c.cid,JSON.stringify(c));
        if(c.pack!==G.pack&&CONTENT.packs[c.pack]){const P=CONTENT.packs[c.pack];G.settings.state=P.state;G.settings.grade=P.grade;packSwitch(c.pack);save();closeOverlay();try{localStorage.setItem('pip-pack',c.pack)}catch(e){}location.reload();return}
        save();classPush(true);closeOverlay();toast('Joined!',`${esc(G.name||'Player')} is in ${esc(c.name)}.`,'#38b98a');renderParent()}})};
  if($('#clsLeave'))$('#clsLeave').onclick=async e=>{const b=e.currentTarget;if(b.dataset.c!=='1'){b.dataset.c='1';b.textContent='Tap again to leave';return}
    b.disabled=true;const cid=G.cls.cid;try{await CL.api.leaveClass(cid,ROOT.current)}catch(err){if(!(err&&err.code==='permission-denied')){b.disabled=false;note('Could not leave right now. Check the internet and try again.');return}}
    delete G.cls;try{localStorage.removeItem('pip-class-'+cid)}catch(x){}save();renderParent()}}

/* ---------- teacher: role ---------- */
const TEACHER_TERMS=`<ul class="glist"><li>I am a teacher, and my school allows me to use this app with my students, or I will get their parents' permission first.</li><li>I add students by <b>first name or nickname</b> only.</li><li>Students' progress stays in my account; I can download or delete it at any time.</li></ul>`;
function teacherOn(){overlay(`<div class="eyebrow">Teacher tools</div><h2>Use Pip with a class</h2><p>Make classes, print login cards with picture passwords, send tasks and see who needs help.</p>${TEACHER_TERMS}
  <div class="setrow"><label for="tName">Your name for students<small>For example "Ms. Rivera"</small></label><input type="text" id="tName" maxlength="40" autocomplete="off" value="${esc((CL.userDoc||{}).teacherName||lsGet('pip-tname-'+CL.uid)||'')}"></div>
  <label class="chk"><input type="checkbox" id="tOk"><span>I agree, and I have read the <a href="privacy.html#teachers" target="_blank" rel="noopener">Privacy notice for teachers</a>.</span></label>
  <div class="btnrow"><button class="go" type="button" id="tGo" disabled>Turn on teacher tools</button><button class="go alt" type="button" id="tNo">Cancel</button></div><p class="note" id="tNote"></p>`,()=>{
  const tchk=()=>$('#tGo').disabled=!($('#tOk').checked&&$('#tName').value.trim().length>=2);$('#tOk').onchange=tchk;$('#tName').oninput=tchk;$('#tNo').onclick=closeOverlay;
  $('#tGo').onclick=async()=>{const now=new Date().toISOString(),tn=$('#tName').value.trim().slice(0,40),ud={role:'teacher',roleAt:now,teacherName:tn};if(!(CL.userDoc||{}).teacherAt)Object.assign(ud,{teacherAt:now,teacherVersion:1});lsSet('pip-tname-'+CL.uid,tn);$('#tGo').disabled=true;
    try{await CL.api.setUserDoc(ud)}catch(e){$('#tNote').className='note bad';$('#tNote').textContent='Could not save. Check the internet and try again.';$('#tGo').disabled=false;return}
    Object.assign(CL.userDoc,ud);lsSet('pip-ud-'+CL.uid,JSON.stringify(CL.userDoc));closeOverlay();openTeach()}})}
function teacherAcctHTML(){if(CL.mode!=='cloud')return '';
  return `<div class="pcard"><h4>Account type</h4>${isTeacher()?`<p>This is a <b>teacher</b> account${(CL.userDoc||{}).teacherName?` (${esc(CL.userDoc.teacherName)})`:''}. It opens at the teacher desk; your own kids are under <b>My own kids</b>.</p><div class="btnrow"><button type="button" class="go small" id="tOpen">Open the teacher desk</button></div><button type="button" class="linkbtn" id="tOff">Switch to a parent account</button>`:`<p>This is a <b>parent</b> account. Teachers can make classes, print picture-password login cards, send tasks and see the class's progress by skill.</p><div class="btnrow"><button type="button" class="go small alt" id="tOn">I'm a teacher</button></div>`}</div>`}
function teacherOff(){overlay(`<div class="eyebrow">Account type</div><h2>Switch to a parent account?</h2><p>The app will open at "Who's playing?" instead of the teacher desk. Your classes and students are <b>not deleted</b>; switch back any time to see them.</p><div class="btnrow"><button class="go" type="button" id="toGo">Switch</button><button class="go alt" type="button" id="toNo">Cancel</button></div><p class="note" id="toNote"></p>`,()=>{
  $('#toNo').onclick=closeOverlay;$('#toGo').onclick=async()=>{const d={role:'parent',roleAt:new Date().toISOString()};$('#toGo').disabled=true;
    try{await CL.api.setUserDoc(d)}catch(e){$('#toNote').className='note bad';$('#toNote').textContent='Could not save. Check the internet and try again.';$('#toGo').disabled=false;return}
    Object.assign(CL.userDoc,d);lsSet('pip-ud-'+CL.uid,JSON.stringify(CL.userDoc));closeOverlay();renderParent()}})}
function bindTeacherAcct(){if($('#tOn'))$('#tOn').onclick=teacherOn;if($('#tOpen'))$('#tOpen').onclick=()=>openTeach();if($('#tOff'))$('#tOff').onclick=teacherOff}
/* the grown-up PIN guards the teacher desk and leaving class-device mode */
function teacherGate(fn){if(CL.unlockUntil>Date.now()||!ROOT.pin&&!classDevice())return fn();if(!ROOT.pin){pinThen=fn;pinBuf='';pinStage='create';pinFirst='';overlay(pinHTML(),bindPin);return}askPinThen(fn)}

/* ---------- teacher desk ---------- */
function openTeach(cid){stopTimers();if(cid){TC.cur=cid;TC.tab=tabFor(cid);TC.autoTab=1}show('teach');renderTeach();loadClasses(true).then(()=>{if(TC.cur&&!curClass())TC.cur='';if(!TC.cur&&!TC.seen&&(TC.classes||[]).length===1){TC.cur=TC.classes[0].cid;TC.tab=tabFor(TC.cur);TC.autoTab=1}TC.seen=1;renderTeach();const c=curClass();if(c)loadMembers(c.cid).then(()=>{if(TC.autoTab&&TC.cur===c.cid)TC.tab=tabFor(c.cid);if(curScreen==='teach'&&TC.cur===c.cid)renderTeach()})})}
function teachHead(sub){return `<div class="playhead"><button class="back" type="button" id="tBack">${ICON.back}${TC.cur?'All classes':'My own kids'}</button><div class="ihead"><div class="iname">Teacher desk</div><div class="qnum">${esc(sub)}</div></div></div>`}
function renderTeach(){const el=$('#teach');if(!el)return;const c=curClass();
  if(!c)el.innerHTML=teachHead(CL.email||'')+classListHTML();
  else el.innerHTML=teachHead(`${c.name} · ${packLabel(c.pack)}`)+classHTML(c);
  $('#tBack').onclick=()=>{if(TC.cur){TC.cur='';renderTeach()}else openKids()};
  if(!c)bindClassList();else bindClass(c)}
function classListHTML(){const L=TC.classes;
  const ready=Object.values(CONTENT.packs).filter(packReady).sort((a,b)=>a.state.localeCompare(b.state)||a.grade-b.grade);
  return `<p class="tkidsnote">Your classes are here. Your <b>own children</b> play under <b>My own kids</b> (top left), separate from your classes.</p><div class="pgrid">${L==null?'<div class="pcard wide"><p>Loading your classes...</p></div>':''}
    ${(L||[]).map(c=>{const n=rosterOf(c.cid).length;return `<button type="button" class="pcard tclass" data-cls="${c.cid}"><h4>${esc(c.name)}</h4><p>${esc(packLabel(c.pack))}</p><p class="note">${n} student${n===1?'':'s'} on this account · class code <b class="ccode">${esc(c.code)}</b></p></button>`}).join('')}
    ${L&&!L.length?`<div class="pcard wide tsteps"><h4>Welcome to the teacher desk!</h4><ol><li><b>Make a class</b> below: a name and a grade.</li><li><b>Add students</b> by first name, then print login cards with picture passwords, or give families the class code to join from home.</li><li><b>Send tasks</b> and see who needs help, skill by skill.</li></ol></div>`:''}
    <div class="pcard wide"><h4>${L&&L.length?'Add a class':'Make your first class'}</h4><p class="note">A class has a name, a grade and a class code. Students can play on classroom devices with picture passwords, or join from home with the code.</p>
      <div class="setrow"><label for="ncName">Class name<small>For example "Room 12" or "Ms. Rivera's 4th grade"</small></label><input type="text" id="ncName" maxlength="40" autocomplete="off"></div>
      <div class="setrow"><label for="ncTeacher">Your name for students<small>Shown to students and families, for example "Ms. Rivera"</small></label><input type="text" id="ncTeacher" maxlength="40" autocomplete="off" value="${esc(lsGet('pip-tname-'+CL.uid)||(CL.userDoc||{}).teacherName||'')}"></div>
      <div class="setrow"><label for="ncPack">Grade</label><select id="ncPack">${ready.map(P=>`<option value="${P.id}"${P.id===PACK.id?' selected':''}>${esc(packLabel(P.id))}</option>`).join('')}</select></div>
      <div class="btnrow"><button type="button" class="go" id="ncGo">Make the class</button></div><p class="note" id="ncNote" role="status">${TC.err?'Offline: showing the classes saved on this device.':''}</p></div></div>`}
const tabFor=cid=>rosterOf(cid).length||(TC.mem[cid]||[]).some(m=>m.owner!==CL.uid&&!m.removed)?'prog':'kids';
function bindClassList(){document.querySelectorAll('[data-cls]').forEach(b=>b.onclick=()=>{TC.cur=b.dataset.cls;TC.tab=tabFor(TC.cur);TC.autoTab=1;renderTeach();loadMembers(TC.cur).then(()=>{if(TC.autoTab&&TC.cur)TC.tab=tabFor(TC.cur);if(curScreen==='teach')renderTeach()})});
  const go=$('#ncGo');if(!go)return;go.onclick=async()=>{const name=$('#ncName').value.trim(),teacher=$('#ncTeacher').value.trim(),pack=$('#ncPack').value,n=$('#ncNote');
    if(!name){n.className='note bad';n.textContent='Type a class name.';$('#ncName').focus();return}
    go.disabled=true;n.className='note';n.textContent='Making the class...';lsSet('pip-tname-'+CL.uid,teacher);
    try{const c=await CL.api.createClass({name,teacher,pack,now:[],tasks:[],v:1});TC.classes.push(c);TC.cur=c.cid;TC.tab='kids';TC.mem[c.cid]=[];renderTeach()}
    catch(e){go.disabled=false;n.className='note bad';n.textContent='Could not make the class. Check the internet and try again.'}}}
const TABS=[['kids','Students'],['prog','Progress'],['tasks','Tasks'],['set','Class settings']];
function classHTML(c){return `<div class="itabs ptabs ttabs" role="tablist" aria-label="Class sections">${TABS.map(([k,t])=>`<button type="button" role="tab" data-tt="${k}" aria-selected="${TC.tab===k}"><span>${t}</span></button>`).join('')}</div>
  <div class="pgrid">${TC.tab==='kids'?kidsTabHTML(c):TC.tab==='prog'?progTabHTML(c):TC.tab==='tasks'?tasksTabHTML(c):setTabHTML(c)}</div>`}
function bindClass(c){document.querySelectorAll('[data-tt]').forEach(b=>b.onclick=()=>{TC.tab=b.dataset.tt;TC.autoTab=0;renderTeach();if(TC.tab==='prog'||TC.tab==='tasks')loadMembers(c.cid).then(()=>{if(curScreen==='teach'&&TC.cur===c.cid)renderTeach()})});
  if(TC.tab==='kids')bindKidsTab(c);else if(TC.tab==='prog')bindProgTab(c);else if(TC.tab==='tasks')bindTasksTab(c);else bindSetTab(c)}

/* --- students --- */
const homeMembers=c=>(TC.mem[c.cid]||[]).filter(m=>m.owner!==CL.uid&&!m.removed);
function kidsTabHTML(c){const R=rosterOf(c.cid),H=homeMembers(c);
  return `<div class="pcard wide"><h4>Students on classroom devices</h4>${R.length?`<p class="note">Each student taps their name, then their 2 pictures. Print the login cards and hand them out.</p>
      <ul class="roster">${R.map(([id,p])=>`<li><span class="kav sm">${kidAvatar(p)}</span><b>${esc(p.name)}</b><span class="rpics">${(p.pic||[]).map(i=>picSVG(i)).join('')}</span><button type="button" class="linkbtn" data-rpic="${id}">New pictures</button><button type="button" class="linkbtn bad" data-rdel="${id}">Remove</button></li>`).join('')}</ul>`
      :'<p class="note">No students yet. Add their first names or nicknames below.</p>'}
    <div class="setrow col"><label for="addNames">Add students<small>One first name or nickname per line (up to 16 letters each)</small></label><textarea id="addNames" rows="4" placeholder="Maya&#10;Leo&#10;Sam R."></textarea></div>
    <div class="btnrow"><button type="button" class="go small" id="addGo">Add students</button>${R.length?'<button type="button" class="go small leaf" id="cardsGo">Print login cards</button><button type="button" class="go small alt" id="devGo">Use this device for the class</button>':''}</div><p class="note" id="addNote" role="status"></p></div>
    <div class="pcard wide"><h4>Students who joined from home</h4><p class="note">Families type the class code <b class="ccode">${esc(c.code)}</b> in Grown-ups → Settings → "Join a teacher's class". Their child's progress then shows here.</p>
      ${H.length?`<ul class="roster">${H.map(m=>`<li><b>${esc(m.name)}</b><small>${m.ts?'updated '+new Date(m.ts).toLocaleDateString('en-US',{month:'short',day:'numeric'}):''}</small><button type="button" class="linkbtn bad" data-mdel="${esc(m.mid)}">Remove from class</button></li>`).join('')}</ul>`:'<p>No one yet.</p>'}</div>`}
function bindKidsTab(c){const n=$('#addNote');
  $('#addGo').onclick=()=>{const names=[...new Set($('#addNames').value.split(/\n|,/).map(s=>s.trim().replace(/\s+/g,' ').slice(0,16)).filter(Boolean))];if(!names.length){n.className='note bad';n.textContent='Type at least one name.';return}
    const R=rosterOf(c.cid);if(R.length+names.length>40){n.className='note bad';n.textContent='A class can have up to 40 students on classroom devices.';return}
    for(const name of names){const p=freshProfile();p.name=name;p.roster=1;p.pic=newPics();p.pack=c.pack;p.packSince=Date.now();p.cls={cid:c.cid,code:'',name:c.name,teacher:c.teacher||''};
      const P=CONTENT.packs[c.pack];p.settings.state=P.state;p.settings.grade=P.grade;p.greeted='';const id=addKid(p);
      CL.api.saveMember(c.cid,id,{name,pack:c.pack,ts:Date.now()}).catch(()=>{})}
    toast(`${names.length} student${names.length>1?'s':''} added`,'Print the login cards next.','#38b98a');renderTeach()};
  document.querySelectorAll('[data-rpic]').forEach(b=>b.onclick=()=>{touchKid(b.dataset.rpic,p=>{p.pic=newPics()});renderTeach()});
  document.querySelectorAll('[data-rdel]').forEach(b=>b.onclick=async()=>{if(b.dataset.c!=='1'){b.dataset.c='1';b.textContent='Tap again: removes all progress';return}
    const id=b.dataset.rdel;b.disabled=true;try{await CL.api.deleteKid(id);await CL.api.leaveClass(c.cid,id).catch(()=>{})}catch(e){b.disabled=false;n.className='note bad';n.textContent='Could not remove right now. Check the internet.';return}
    CL.remote[id]={deleted:true};delete CL.dirty[id];delete ROOT.profiles[id];(ROOT.gone=ROOT.gone||{})[id]=1;if(ROOT.current===id){ROOT.current='';G=freshProfile()}persistLocal();renderTeach()});
  document.querySelectorAll('[data-mdel]').forEach(b=>b.onclick=async()=>{if(b.dataset.c!=='1'){b.dataset.c='1';b.textContent='Tap again to remove';return}
    b.disabled=true;try{await CL.api.removeMember(c.cid,b.dataset.mdel)}catch(e){b.disabled=false;return}TC.mem[c.cid]=(TC.mem[c.cid]||[]).filter(m=>m.mid!==b.dataset.mdel);renderTeach()});
  if($('#cardsGo'))$('#cardsGo').onclick=()=>printCards(c);
  if($('#devGo'))$('#devGo').onclick=()=>{const go=()=>{lsSet('pip-classdev-'+CL.uid,c.cid);openKids()};if(!ROOT.pin){pinThen=go;pinBuf='';pinStage='create';pinFirst='';overlay(pinHTML(),bindPin);return}go()}}
function printCards(c){const R=rosterOf(c.cid);let pa=$('#printArea');if(!pa){pa=document.createElement('div');pa.id='printArea';document.body.appendChild(pa)}
  pa.innerHTML=`<div class="cards">${R.map(([,p])=>`<div class="lcard"><div class="lchead"><b>Pip's Sky Islands</b><small>${esc(c.name)}${c.teacher?' · '+esc(c.teacher):''}</small></div><div class="lcname">${esc(p.name)}</div><div class="lcpics">${(p.pic||[]).map((i,k)=>`<div><span>${k+1}</span>${picSVG(i)}<small>${PICS[i][0]}</small></div>`).join('')}</div><p>Tap your name, then your 2 pictures in order.</p></div>`).join('')}</div>`;
  document.body.classList.add('printing');const done=()=>{document.body.classList.remove('printing');removeEventListener('afterprint',done)};addEventListener('afterprint',done);
  setTimeout(()=>{try{window.print()}catch(e){}setTimeout(done,1000)},50)}

/* --- progress: students x islands, weak skills, typical mistakes, CSV --- */
function classRows(c){const rows=[];
  for(const [id,p] of rosterOf(c.cid)){const m=(TC.mem[c.cid]||[]).find(x=>x.mid===CL.uid+'_'+id);rows.push({mid:CL.uid+'_'+id,name:p.name,sum:parseSum(m&&m.sum),ts:m&&m.ts,roster:1})}
  for(const m of homeMembers(c))rows.push({mid:m.mid,name:m.name,sum:parseSum(m.sum),ts:m.ts});
  return rows}
const parseSum=s=>{try{return s?JSON.parse(s):null}catch(e){return null}};
const skSt=(r,k)=>((r.sum&&r.sum.sk||{})[k]||[0,0,0]);
function weakSkills(c,rows){const N=rows.length;if(!N)return [];const focus=new Set([...(c.now||[]),...(c.tasks||[]).flatMap(t=>t.isl||[])]);
  return packSkills(c.pack).map(s=>{let T=0,M=0;for(const r of rows){const v=skSt(r,s.id);if(v[2])T++;if(v[0]===2)M++}return {s,T,M,share:M/N}})
    .filter(x=>x.share<.6&&(focus.has(x.s.isl)||x.T>=Math.max(2,N*.3))).sort((a,b)=>a.share-b.share||b.T-a.T).slice(0,8)}
/* ---- progress helpers: one student's numbers ---- */
const SUBJ=[['all','All'],['math','Math'],['ela','English'],['sci','Science & social']];
const islSubj=i=>{const k=(i.skills||[])[0],sj=(CONTENT.skills[k]||{}).subject||'math';return sj==='science'||sj==='social'?'sci':sj};
const pct=(a,b)=>b?Math.round(a/b*100):null;
const wkOf=r=>r.sum&&r.sum.w?r.sum.w:r.sum?[r.sum.m7||0,0,0]:null;
const accOf=r=>{const w=wkOf(r);if(w&&w[1]>=5)return pct(w[2],w[1]);return r.sum&&r.sum.a>=5?pct(r.sum.c,r.sum.a):null};
const lastLbl=d=>{if(!d)return '–';const t=dayKey(),y=addDays(-1);if(d===t)return 'Today';if(d===y)return 'Yesterday';const dt=new Date(d+'T12:00'),days=(Date.now()-dt)/864e5;return days<7?dt.toLocaleDateString('en-US',{weekday:'short'}):dt.toLocaleDateString('en-US',{month:'short',day:'numeric'})};
function islState(r,i){const v=(r.sum&&r.sum.isl||{})[i.id],tot=v?v[2]:i.skills.length,d=v?v[1]:0;let ok=0,n=0,al=0;for(const k of i.skills){const x=skSt(r,k);ok+=x[1];n+=x[2];if(skAlmost({st:x[0],ok:x[1],n:x[2]}))al++}
  const acc=pct(ok,n);if(!n)return {st:'none',d,tot,acc,al};if(d>=tot&&tot)return {st:'done',d,tot,acc,al};return {st:n>=5&&acc<60?'hard':'go',d,tot,acc,al}}
function studentNeeds(r,c,max){return packSkills(c.pack).map(s=>({s,v:skSt(r,s.id)})).filter(x=>x.v[2]>=3&&x.v[0]<2).sort((a,b)=>a.v[1]/a.v[2]-b.v[1]/b.v[2]).slice(0,max)}
const stdShort=L=>L.length>3?L.slice(0,3).join(', ')+' …':L.join(', ');
const trend=(a,b,unit='')=>{if(a==null||b==null)return '';const d=a-b;return d===0?'<small class="tr">same as last week</small>':`<small class="tr ${d>0?'up':'dn'}">${d>0?'▲':'▼'} ${Math.abs(d)}${unit} vs last week</small>`};
function progTabHTML(c){const rows=classRows(c),allIsl=packIslands(c.pack);
  if(!rows.length)return `<div class="pcard wide"><h4>Progress</h4><p>Add students first. Their progress shows up here after they play.</p></div>`;
  const sub=TC.subj||'math',isl=sub==='all'?allIsl:allIsl.filter(i=>islSubj(i)===sub),drill=TC.drill&&allIsl.find(i=>i.id===TC.drill);
  const W=weakSkills(c,rows),played=rows.filter(r=>wkOf(r)&&wkOf(r)[0]>0),mins=rows.reduce((s,r)=>s+((wkOf(r)||[0])[0]),0);
  const wq=rows.reduce((s,r)=>s+((wkOf(r)||[0,0])[1]),0),wc=rows.reduce((s,r)=>s+((wkOf(r)||[0,0,0])[2]),0),cacc=pct(wc,wq);
  const idle=rows.filter(r=>!wkOf(r)||!wkOf(r)[0]);
  const cell=(r,i)=>{const x=islState(r,i);const t=x.st==='none'?'Not started':`${x.d} of ${x.tot} skills mastered${x.al?`, ${x.al} almost there`:''}${x.acc!=null?` · ${x.acc}% right`:''}`;
    return `<td class="hm s-${x.st}" title="${esc(i.name)}: ${t}">${x.st==='none'?'':x.st==='done'?'✓':`${x.acc}%`}${x.st!=='none'&&x.st!=='done'?`<small>${x.d}/${x.tot}${x.al?` +${x.al}`:''}</small>`:''}</td>`};
  const sk=TC.sort||'name',sv=r=>sk==='min'?-((wkOf(r)||[0])[0]):sk==='acc'?(accOf(r)??999):sk==='last'?((r.sum&&r.sum.last)||'0'):r.name.toLowerCase();
  rows.sort((a,b)=>{const x=sv(a),y=sv(b);return x<y?-1:x>y?1:a.name.localeCompare(b.name)});
  const nameBtn=r=>`<button type="button" class="sname" data-stu="${esc(r.mid)}">${esc(r.name)}</button>${r.roster?'':' <small>home</small>'}`;
  return `<div class="pcard wide csum"><h4>This week</h4><div class="ctiles">
      <div><b>${played.length} <small>of ${rows.length}</small></b><span>students played</span></div>
      <div><b>${mins}</b><span>minutes in all</span></div>
      <div><b>${cacc==null?'–':cacc+'%'}</b><span>right on the first try</span></div>
      <div><b>${W.length}</b><span>skills that need help</span></div></div>
      ${W.length?`<p class="cneed"><b>Needs help most:</b> ${W.slice(0,3).map(x=>esc(x.s.name)).join(', ')}</p>`:''}
      ${idle.length&&idle.length<rows.length?`<p class="note">Did not play this week: ${idle.map(r=>esc(r.name)).join(', ')}</p>`:''}</div>
    <div class="pcard wide"><h4>Students</h4>
      <div class="tfind"><input type="search" id="stuFind" placeholder="Find a student" aria-label="Find a student" autocomplete="off" value="${esc(TC.find||'')}">
        <label for="stuSort">Sort</label><select id="stuSort">${[['name','Name'],['acc','Lowest accuracy first'],['min','Most minutes first'],['last','Longest since playing']].map(([v,t])=>`<option value="${v}"${sk===v?' selected':''}>${t}</option>`).join('')}</select></div>
      <div class="subjf" role="tablist" aria-label="Subject">${SUBJ.map(([k,t])=>`<button type="button" role="tab" data-subj="${k}" aria-selected="${sub===k}">${t}</button>`).join('')}</div>
      <p class="hlegend"><span class="hm s-none"></span>not started <span class="hm s-hard">45%</span>struggling (under 60% right) <span class="hm s-go">80%</span>practicing <span class="hm s-done">✓</span>all skills mastered. <span class="note">Small numbers: skills mastered (8 of 10 right on the first try) of the island's skills, and "+2" = 2 more almost there (70%+ right). Tap a name for details, an island for its skills.</span></p>
      <div class="tscroll heatwrap"><table class="heat"><thead><tr><th>Student</th><th title="minutes this week">Min</th><th title="right on the first try, this week">Right</th><th>Last</th>${isl.map(i=>`<th><button type="button" class="hmh${TC.drill===i.id?' on':''}" data-drill="${i.id}" style="--c:${i.color}" title="${esc(i.topic)}">${esc(i.name)}</button></th>`).join('')}</tr></thead>
      <tbody>${rows.map(r=>{const a=accOf(r);return `<tr data-row="${esc(r.name.toLowerCase())}"><th>${nameBtn(r)}</th><td class="num">${wkOf(r)?wkOf(r)[0]:'–'}</td><td class="num${a!=null&&a<60?' low':''}">${a==null?'–':a+'%'}</td><td class="num last">${lastLbl(r.sum&&r.sum.last)}</td>${isl.map(i=>cell(r,i)).join('')}</tr>`}).join('')}</tbody></table></div>
      <ul class="scards">${rows.map(r=>{const a=accOf(r),nd=studentNeeds(r,c,2),done=isl.filter(i=>islState(r,i).st!=='none');return `<li data-row="${esc(r.name.toLowerCase())}"><button type="button" class="scard" data-stu="${esc(r.mid)}"><b>${esc(r.name)}${r.roster?'':' <small>home</small>'}</b>
        <span class="sline"><span>${wkOf(r)?wkOf(r)[0]:0} min</span><span class="${a!=null&&a<60?'low':''}">${a==null?'–':a+'% right'}</span><span>${lastLbl(r.sum&&r.sum.last)}</span></span>
        <span class="smap">${isl.map(i=>{const x=islState(r,i);return `<i class="s-${x.st}" title="${esc(i.name)}"></i>`}).join('')}</span>
        ${nd.length?`<span class="sneed">Needs: ${nd.map(x=>esc(x.s.name)).join(', ')}</span>`:done.length?'':'<span class="sneed">Not started yet</span>'}</button></li>`}).join('')}</ul></div>
    ${drill?`<div class="pcard wide"><h4>${esc(drill.name)}: skills</h4><div class="tscroll"><table class="heat sk"><thead><tr><th>Student</th>${drill.skills.map(k=>CONTENT.skills[k]).filter(Boolean).map(s=>`<th title="${esc(s.std.join(', '))}"><span>${esc(s.name)}</span></th>`).join('')}</tr></thead>
      <tbody>${rows.map(r=>`<tr><th>${esc(r.name)}</th>${drill.skills.map(k=>{const v=skSt(r,k);return `<td class="skc" title="${v[2]?`${v[1]} of ${v[2]} right lately`:'Not tried'}">${SK_DOT(v[0])}${v[2]?`<small>${v[1]}/${v[2]}</small>`:''}</td>`}).join('')}</tr>`).join('')}</tbody></table></div></div>`:''}
    <div class="pcard wide"><h4>Where the class needs help</h4>${W.length?`<p class="note">Skills that fewer than 60% of the class have mastered, among the topics in class now, the tasks, and skills many students have tried.</p><ul class="weak">${W.map(x=>{const ex=[];const seen=new Set();for(const r of rows)for(const w of (r.sum&&r.sum.wrong)||[])if(w.k===x.s.id&&!seen.has(w.p+w.g)&&ex.length<2){seen.add(w.p+w.g);ex.push(w)}
      return `<li><div><b>${esc(x.s.name)}</b><small>${esc((allIsl.find(i=>i.id===x.s.isl)||{}).name||'')} · ${esc(stdShort(x.s.std))}</small></div><em>${x.M} of ${rows.length} mastered · ${x.T} tried</em>${ex.length?`<ul class="wex">${ex.map(w=>`<li>${esc(w.p)} <small>answered <b>${esc(w.g)}</b>, right: <b>${esc(w.a)}</b></small></li>`).join('')}</ul>`:''}</li>`}).join('')}</ul>`:'<p class="note">Nothing stands out yet. Skills show up here once several students have tried them.</p>'}</div>
    <div class="pcard wide"><h4>Download</h4><p class="note">Spreadsheet files (CSV) for your gradebook: one row per student.</p><div class="btnrow"><button type="button" class="go small alt" id="csvSk">By skill</button><button type="button" class="go small alt" id="csvStd">By standard</button></div></div>`}
function studentCard(c,mid){const r=classRows(c).find(x=>x.mid===mid);if(!r)return;const w=r.sum&&r.sum.w,wp=r.sum&&r.sum.wp,S=packSkills(c.pack);
  const acc=w&&w[1]?pct(w[2],w[1]):null,accP=wp&&wp[1]?pct(wp[2],wp[1]):null,mast=S.filter(s=>skSt(r,s.id)[0]===2).length,tried=S.filter(s=>skSt(r,s.id)[2]).length,alm=S.filter(s=>{const v=skSt(r,s.id);return skAlmost({st:v[0],ok:v[1],n:v[2]})}).length;
  const nd=studentNeeds(r,c,5),wr=((r.sum&&r.sum.wrong)||[]).slice(0,5),T=(c.tasks||[]).filter(t=>!t.to||!t.to.length||t.to.includes(mid)),isl=packIslands(c.pack);
  overlay(`<div class="stucard"><div class="eyebrow">${esc(c.name)}${r.roster?'':' · joined from home'}</div><h2>${esc(r.name)}</h2><p class="note">Last played: ${r.sum&&r.sum.last?lastLbl(r.sum.last):'not yet'}</p>
    ${r.sum?`<div class="ctiles st">
      <div><b>${w?w[0]:r.sum.m7||0}</b><span>minutes this week</span>${trend(w&&w[0],wp&&wp[0],' min')}</div>
      <div><b>${w?w[1]:'–'}</b><span>puzzles this week</span>${trend(w&&w[1],wp&&wp[1])}</div>
      <div><b>${acc==null?'–':acc+'%'}</b><span>right on the first try</span>${acc!=null&&accP!=null?trend(acc,accP,'%'):''}</div>
      <div><b>${mast} <small>of ${S.length}</small></b><span>skills mastered</span><small class="tr">${alm} almost there · ${tried} tried</small></div></div>
    ${r.sum.wh?`<h5 class="skgrp">Last 8 weeks</h5>${weeksHTML(r.sum.wh)}`:''}
    <h5 class="skgrp">Needs practice</h5>${nd.length?`<ul class="weak">${nd.map(x=>`<li><div><b>${esc(x.s.name)}</b><small>${esc((isl.find(i=>i.id===x.s.isl)||{}).name||'')} · ${esc(stdShort(x.s.std))}</small></div><em>${x.v[1]} of ${x.v[2]} right</em></li>`).join('')}</ul>`:'<p class="note">Nothing yet: a skill shows up here after 3 tries without mastering it.</p>'}
    <h5 class="skgrp">Recent mistakes</h5>${wr.length?`<ul class="weak">${wr.map(x=>`<li><div><b>${esc(x.p)}</b><small>answered <b>${esc(x.g)}</b> · right: <b>${esc(x.a)}</b></small></div></li>`).join('')}</ul>`:'<p class="note">No mistakes saved yet.</p>'}
    ${T.length?`<h5 class="skgrp">Tasks</h5><ul class="weak">${T.map(t=>{const d=r.sum.tasks&&r.sum.tasks[t.id];return `<li><div><b>${(t.isl||[]).map(id=>esc((isl.find(i=>i.id===id)||{}).name||id)).join(', ')}</b><small>${t.due?'due '+new Date(t.due+'T12:00').toLocaleDateString('en-US',{month:'short',day:'numeric'}):'no due date'}</small></div><em class="${d?'ok':''}">${d?'Done':'Not yet'}</em></li>`}).join('')}</ul>`:''}`
    :'<p>No progress yet. It shows up after the first round.</p>'}
    <div class="btnrow"><button class="go" type="button" id="stClose">Close</button></div></div>`,()=>{$('#stClose').onclick=closeOverlay})}
function bindProgTab(c){document.querySelectorAll('[data-drill]').forEach(b=>b.onclick=()=>{TC.drill=TC.drill===b.dataset.drill?'':b.dataset.drill;renderTeach()});
  document.querySelectorAll('[data-subj]').forEach(b=>b.onclick=()=>{TC.subj=b.dataset.subj;renderTeach()});
  document.querySelectorAll('[data-stu]').forEach(b=>b.onclick=()=>studentCard(c,b.dataset.stu));
  const fl=()=>{const q=(TC.find||'').trim().toLowerCase();document.querySelectorAll('[data-row]').forEach(e=>e.hidden=!!q&&!e.dataset.row.includes(q))};
  if($('#stuFind'))$('#stuFind').oninput=e=>{TC.find=e.target.value;fl()};if($('#stuSort'))$('#stuSort').onchange=e=>{TC.sort=e.target.value;renderTeach()};fl();
  if($('#csvSk'))$('#csvSk').onclick=()=>csvDownload(c,'skill');if($('#csvStd'))$('#csvStd').onclick=()=>csvDownload(c,'std')}
const csvCell=v=>{v=String(v==null?'':v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
function csvDownload(c,kind){const rows=classRows(c),S=packSkills(c.pack);let head,body;
  if(kind==='skill'){head=['Student','Minutes this week','Puzzles',...S.map(s=>`${s.name} (${s.std.join(' ')})`)];
    body=rows.map(r=>[r.name,r.sum?r.sum.m7:'',r.sum?r.sum.a:'',...S.map(s=>{const v=skSt(r,s.id);return v[0]===2?'mastered':v[2]?`practicing ${v[1]}/${v[2]}`:'not started'})])}
  else{const codes=Object.keys((CONTENT.standards[(CONTENT.packs[c.pack]||{}).standards]||{}).codes||{}).filter(k=>{const v=CONTENT.standards[CONTENT.packs[c.pack].standards].codes[k];return v.app!==false&&!v.review});
    const by=Object.fromEntries(codes.map(k=>[k,S.filter(s=>s.std.some(x=>x===k||x.replace(/[a-z]$/,'')===k))]));
    const used=codes.filter(k=>by[k].length);head=['Student',...used];
    body=rows.map(r=>[r.name,...used.map(k=>{const L=by[k],m=L.filter(s=>skSt(r,s.id)[0]===2).length;return `${Math.round(m/L.length*100)}%`})])}
  const txt=[head,...body].map(r=>r.map(csvCell).join(',')).join('\r\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['﻿'+txt],{type:'text/csv'}));a.download=`${c.name.replace(/[^\w-]+/g,'_')}-${kind==='skill'?'skills':'standards'}-${dayKey()}.csv`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)}

/* --- tasks and topics in class now --- */
function tasksTabHTML(c){const rows=classRows(c),isl=packIslands(c.pack),T=c.tasks||[],now=c.now||[];
  const who=t=>!t.to||!t.to.length?rows:rows.filter(r=>t.to.includes(r.mid));
  return `<div class="pcard wide"><h4>In class right now</h4><p class="note">Pick up to 4 topics you are teaching. Pip's Pick practices them first, and families see them.</p><div class="nowchips">${isl.map(i=>`<button type="button" class="nowchip${now.includes(i.id)?' on':''}" data-tnow="${i.id}" aria-pressed="${now.includes(i.id)}">${esc(i.topic)}</button>`).join('')}</div></div>
    <div class="pcard wide"><h4>Tasks</h4>${T.length?`<ul class="tasks">${T.map(t=>{const W=who(t),d=W.filter(r=>r.sum&&r.sum.tasks&&r.sum.tasks[t.id]);return `<li><div><b>${(t.isl||[]).map(id=>esc((isl.find(i=>i.id===id)||{}).name||id)).join(', ')}</b><small>${t.due?'due '+new Date(t.due+'T12:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}):'no due date'} · ${!t.to||!t.to.length?'whole class':W.map(r=>esc(r.name)).join(', ')}${t.note?' · '+esc(t.note):''}</small></div><em title="${esc(W.filter(r=>!d.includes(r)).map(r=>r.name).join(', '))}">${d.length} of ${W.length} done</em><button type="button" class="linkbtn bad" data-tdel="${t.id}">Delete</button></li>`}).join('')}</ul>`:'<p class="note">No tasks yet.</p>'}
      <h5 class="skgrp">New task</h5><p class="note">Students play one round on each island. A task is done when every island in it has a finished round.</p>
      <div class="nowchips">${isl.map(i=>`<button type="button" class="nowchip" data-tisl="${i.id}" aria-pressed="false">${esc(i.name)}</button>`).join('')}</div>
      <div class="setrow"><label for="tDue">Due date</label><input type="date" id="tDue" value="${addDays(7)}"></div>
      <div class="setrow"><label for="tNoteIn">Note<small>Optional, shown to students</small></label><input type="text" id="tNoteIn" maxlength="60"></div>
      <div class="setrow col"><label>Who</label><div class="nowchips"><button type="button" class="nowchip on" data-tall="1" aria-pressed="true">Whole class</button>${rows.map(r=>`<button type="button" class="nowchip" data-twho="${esc(r.mid)}" aria-pressed="false">${esc(r.name)}</button>`).join('')}</div></div>
      <div class="btnrow"><button type="button" class="go small" id="tAdd">Send the task</button></div><p class="note" id="tNote2" role="status"></p></div>`}
async function saveClass(c,patch,note){Object.assign(c,patch);lsSet('pip-classes-'+CL.uid,JSON.stringify(TC.classes));
  try{await CL.api.updateClass(c.cid,patch);return true}catch(e){if(note){note.className='note bad';note.textContent='Could not save. Check the internet and try again.'}return false}}
function bindTasksTab(c){const tog=b=>{const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on);b.classList.toggle('on',on);return on};
  document.querySelectorAll('[data-tnow]').forEach(b=>b.onclick=()=>{const L=(c.now||[]).slice(),id=b.dataset.tnow,k=L.indexOf(id);if(k>=0)L.splice(k,1);else{if(L.length>=4)L.shift();L.push(id)}saveClass(c,{now:L});renderTeach()});
  document.querySelectorAll('[data-tisl]').forEach(b=>b.onclick=()=>tog(b));
  const all=$('[data-tall]');document.querySelectorAll('[data-twho]').forEach(b=>b.onclick=()=>{tog(b);const any=!!document.querySelector('[data-twho][aria-pressed="true"]');all.setAttribute('aria-pressed',!any);all.classList.toggle('on',!any)});
  all.onclick=()=>{document.querySelectorAll('[data-twho]').forEach(b=>{b.setAttribute('aria-pressed',false);b.classList.remove('on')});all.setAttribute('aria-pressed',true);all.classList.add('on')};
  $('#tAdd').onclick=async()=>{const n=$('#tNote2'),ids=[...document.querySelectorAll('[data-tisl][aria-pressed="true"]')].map(b=>b.dataset.tisl);
    if(!ids.length){n.className='note bad';n.textContent='Pick at least one island.';return}
    const t={id:'t'+Date.now().toString(36),isl:ids.slice(0,6),due:$('#tDue').value||'',note:$('#tNoteIn').value.trim().slice(0,60),to:[...document.querySelectorAll('[data-twho][aria-pressed="true"]')].map(b=>b.dataset.twho),ts:Date.now()};
    const T=[...(c.tasks||[]),t].slice(-40);$('#tAdd').disabled=true;if(await saveClass(c,{tasks:T},n)){toast('Task sent','Students see it on their map.','#38b98a');renderTeach()}else $('#tAdd').disabled=false};
  document.querySelectorAll('[data-tdel]').forEach(b=>b.onclick=()=>{if(b.dataset.c!=='1'){b.dataset.c='1';b.textContent='Tap again';return}saveClass(c,{tasks:(c.tasks||[]).filter(t=>t.id!==b.dataset.tdel)});renderTeach()})}

/* --- class settings --- */
function setTabHTML(c){return `<div class="pcard wide"><h4>Class</h4>
    <div class="setrow"><label for="csName">Class name</label><input type="text" id="csName" maxlength="40" value="${esc(c.name)}"></div>
    <div class="setrow"><label for="csTeacher">Your name for students</label><input type="text" id="csTeacher" maxlength="40" value="${esc(c.teacher||'')}"></div>
    <p>Grade: <b>${esc(packLabel(c.pack))}</b></p><div class="btnrow"><button type="button" class="go small" id="csSave">Save</button></div><p class="note" id="csNote" role="status"></p></div>
  ${(()=>{const P=CONTENT.packs[c.pack],nx=P&&CONTENT.packs[packKey(P.state,P.grade+1)];return nx&&packReady(nx)?`<div class="pcard wide"><h4>New school year</h4><p class="note">Move the whole class to <b>${esc(packLabel(nx.id))}</b>. Every student gets the ${GRADE_WORD(nx.grade).toLowerCase()} islands; last year's stars stay saved in each student's progress. Tasks and "in class now" topics are cleared. You may want to rename the class too.</p><div class="btnrow"><button type="button" class="go small leaf" id="csUp">Move to ${GRADE_WORD(nx.grade).toLowerCase()}</button></div><p class="note" id="csUpNote" role="status"></p></div>`:''})()}
  <div class="pcard"><h4>Class code: <span class="ccode">${esc(c.code)}</span></h4><p class="note">Families use it to join from home. A new code stops new joins with the old one; students already in the class stay.</p><div class="btnrow"><button type="button" class="go small alt" id="csCode">Make a new code</button></div></div>
  <div class="pcard"><h4>Delete the class</h4><p class="note">Removes the class, its tasks, and the progress summaries families shared. Students on classroom devices are removed with all their progress.</p><div class="btnrow"><button type="button" class="go small alt bad" id="csDel">Delete the class</button></div><p class="note" id="csDelNote" role="status"></p></div>`}
function bindSetTab(c){if($('#csUp'))$('#csUp').onclick=e=>{const b=e.currentTarget;if(b.dataset.c!=='1'){b.dataset.c='1';b.textContent='Tap again to move the class';return}b.disabled=true;moveClassUp(c,$('#csUpNote'))};
  $('#csSave').onclick=async()=>{const name=$('#csName').value.trim()||c.name,teacher=$('#csTeacher').value.trim();if(await saveClass(c,{name,teacher},$('#csNote'))){
    for(const [id] of rosterOf(c.cid))touchKid(id,p=>{p.cls=Object.assign({},p.cls,{name,teacher})});renderTeach();toast('Saved','','#38b98a')}};
  $('#csCode').onclick=async e=>{const b=e.currentTarget;b.disabled=true;try{const code=await CL.api.newClassCode(c.cid,c.code);c.code=code;lsSet('pip-classes-'+CL.uid,JSON.stringify(TC.classes));renderTeach()}catch(err){b.disabled=false}};
  $('#csDel').onclick=async e=>{const b=e.currentTarget,n=$('#csDelNote');if(b.dataset.c!=='1'){b.dataset.c='1';b.textContent=`Tap again to delete ${c.name}`;return}
    b.disabled=true;n.className='note';n.textContent='Deleting...';
    try{for(const [id] of rosterOf(c.cid)){await CL.api.deleteKid(id);CL.remote[id]={deleted:true};delete CL.dirty[id];delete ROOT.profiles[id];(ROOT.gone=ROOT.gone||{})[id]=1;if(ROOT.current===id){ROOT.current='';G=freshProfile()}}
      await CL.api.deleteClass(c.cid,c.code)}catch(err){b.disabled=false;n.className='note bad';n.textContent='Could not delete right now. Check the internet and try again.';return}
    persistLocal();if(classDevice()===c.cid)try{localStorage.removeItem('pip-classdev-'+CL.uid)}catch(x){}
    TC.classes=TC.classes.filter(x=>x.cid!==c.cid);TC.cur='';lsSet('pip-classes-'+CL.uid,JSON.stringify(TC.classes));renderTeach()}}

/* ---------- a new school year (August and September): offer the next grade ---------- */
function yearOffer(now=new Date()){if(G.cls||!ROOT.current)return null;const m=now.getMonth(),yr=now.getFullYear();if(m<7||m>8||G.yearAsk===yr)return null;
  const aug1=new Date(yr,7,1).getTime();let since=G.packSince||0;
  if(!since){const k=Object.keys(G.days||{}).filter(d=>(G.days[d].q||0)>0).sort()[0];if(!k)return null;since=new Date(k+'T12:00').getTime()}
  if(since>=aug1)return null;const next=CONTENT.packs[packKey(PACK.state,PACK.grade+1)];if(!next||!packReady(next))return null;return {next,yr}}
let yearShown=false;
function maybeYearOffer(){if(yearShown||curScreen!=='map'||ovOpen)return;const o=yearOffer();if(!o)return;yearShown=true;const g=GRADE_WORD(o.next.grade).toLowerCase(),nm=esc(G.name||'you');
  overlay(`<div class="pipbob" data-fox></div><div class="eyebrow">A new school year!</div><h2>Is ${nm} in ${g} now?</h2><p>A grown-up can move ${nm} up to the ${esc(o.next.stateName)} ${g} islands. Stars from ${GRADE_WORD(PACK.grade).toLowerCase()} stay safe, and coins, Pip and the home island come along.</p>
    <div class="btnrow"><button class="go" type="button" id="yrYes">Yes, move up</button><button class="go alt" type="button" id="yrNo">Not yet</button></div><button class="linkbtn" type="button" id="yrLater">Ask me later</button>`,()=>{
    $('#yrLater').onclick=closeOverlay;$('#yrNo').onclick=()=>{G.yearAsk=o.yr;save();closeOverlay()};
    $('#yrYes').onclick=()=>{closeOverlay();teacherGate(()=>{packSwitch(o.next.id);G.yearAsk=o.yr;save();try{localStorage.setItem('pip-pack',o.next.id)}catch(e){}location.reload()})}})}

/* ---------- teacher: move the whole class to the next grade (a new school year) ---------- */
async function moveClassUp(c,note){const P=CONTENT.packs[c.pack],next=P&&CONTENT.packs[packKey(P.state,P.grade+1)];if(!next||!packReady(next))return;
  if(!await saveClass(c,{pack:next.id,now:[],tasks:[]},note))return;
  for(const [id] of rosterOf(c.cid))touchKid(id,p=>{packSwitch(next.id,p);p.cls=Object.assign({},p.cls)});
  for(const [id,p] of rosterOf(c.cid))CL.api.saveMember(c.cid,id,{name:(p.name||'Player').slice(0,16),pack:next.id,ts:Date.now()}).catch(()=>{});
  TC.mem[c.cid]=(TC.mem[c.cid]||[]).map(m=>Object.assign({},m,{sum:''}));
  toast(`${esc(c.name)}: ${GRADE_WORD(next.grade).toLowerCase()}`,'Students keep last year\'s stars. Families\' devices switch on their next visit.','#38b98a');renderTeach()}
