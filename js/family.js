/* Pip's Sky Islands: grown-ups — family goal with a reward, note and tasks from the teacher, printable weekly report */
const FG_KINDS={min:['Play {n} minutes',[60,90,120,150,200],'minutes'],right:['Get {n} puzzles right on the first try',[50,100,150,200,300],'right'],skills:['Master {n} new skills',[2,3,5,8,12],'skills']};
const fgDay=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const fgEnd=g=>{const d=new Date(g.start+'T12:00');d.setDate(d.getDate()+6);return fgDay(d)};
const fgText=g=>FG_KINDS[g.k][0].replace('{n}',g.n);
const masteredNow=()=>ISLANDS.filter(i=>i.gen&&!i.retired).flatMap(i=>skillsOf(i.id)).filter(s=>skStat(s.k).st===2).length;
/* progress of the family goal: [have, need, done, expired] */
function fgProg(g=G.fgoal){if(!g)return null;const end=fgEnd(g);let have=0;
  if(g.k==='skills')have=Math.max(0,masteredNow()-(g.base||0));
  else for(const k in G.days||{})if(k>=g.start&&k<=end){const d=G.days[k];have+=g.k==='min'?(d.sec||0)/60:(d.c||0)}
  have=Math.floor(have);const done=have>=g.n;return {have:Math.min(have,g.n),need:g.n,done,expired:!done&&dayKey()>end,end}}
function fgoalParentHTML(){const g=G.fgoal,nm=esc(G.name||'your child');
  if(g){const p=fgProg(g),endL=new Date(p.end+'T12:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
    return `<div class="pcard wide fgp"><h4>Family goal</h4><p><b>${esc(fgText(g))}</b> by ${endL}${g.reward?` · reward: <b>${esc(g.reward)}</b>`:''}</p>
      <div class="bar warm"><i style="width:${Math.round(p.have/p.need*100)}%"></i></div><p class="note">${p.done?`Done! ${nm} reached the goal${g.reward?' and sees the reward on the map':''}.`:p.expired?'Time is up. Set a new goal, maybe a smaller one.':`${p.have} of ${p.need} ${FG_KINDS[g.k][2]} so far. ${nm} sees this goal on the map.`}</p>
      <div class="btnrow" style="justify-content:flex-start"><button type="button" class="go small alt" id="fgNew">${p.done||p.expired?'Set a new goal':'Change the goal'}</button><button type="button" class="linkbtn" id="fgDel">Remove</button></div></div>`}
  return `<div class="pcard wide fgp"><h4>Family goal</h4><p class="note">Set a goal for the next 7 days and a reward you choose, like a park trip or a family movie night. ${nm} sees it on the map with a progress bar.</p>${fgFormHTML()}</div>`}
function fgFormHTML(){const k0=(G.fgoal&&G.fgoal.k)||'min';
  return `<div class="setrow"><label for="fgKind">Goal</label><select id="fgKind">${Object.entries(FG_KINDS).map(([k,v])=>`<option value="${k}"${k===k0?' selected':''}>${v[0].replace('{n}','…')}</option>`).join('')}</select></div>
    <div class="setrow"><label for="fgN">How many</label><select id="fgN">${FG_KINDS[k0][1].map((n,i)=>`<option${i===2?' selected':''}>${n}</option>`).join('')}</select></div>
    <div class="setrow"><label for="fgRew">Reward<small>Optional, up to 40 letters</small></label><input type="text" id="fgRew" maxlength="40" placeholder="Family movie night" value="${esc((G.fgoal&&G.fgoal.reward)||'')}"></div>
    <div class="btnrow" style="justify-content:flex-start"><button type="button" class="go small" id="fgGo">Set the goal</button></div>`}
function bindFGoal(){const k=$('#fgKind');if(k)k.onchange=()=>{$('#fgN').innerHTML=FG_KINDS[k.value][1].map((n,i)=>`<option${i===2?' selected':''}>${n}</option>`).join('')};
  if($('#fgGo'))$('#fgGo').onclick=()=>{G.fgoal={k:$('#fgKind').value,n:+$('#fgN').value,reward:$('#fgRew').value.trim().slice(0,40),start:dayKey(),base:masteredNow()};save();toast('Goal set',`${esc(G.name||'Your child')} sees it on the map.`,'#38b98a');renderParent()};
  if($('#fgNew'))$('#fgNew').onclick=()=>{const c=$('#fgNew').closest('.pcard');c.querySelector('.btnrow').remove();c.insertAdjacentHTML('beforeend',fgFormHTML());bindFGoal()};
  if($('#fgDel'))$('#fgDel').onclick=()=>{delete G.fgoal;save();renderParent()}}
/* the child's side, in the Rewards box on the map */
function renderFGoal(){const el=$('#fgoalCard');if(!el)return;const g=G.fgoal,p=fgProg(g);if(!g||p.expired&&!p.done){el.hidden=true;return}el.hidden=false;
  el.innerHTML=`<div class="gprev fgico">${FG_ICO}</div><div class="gtxt"><b>${p.done?'Family goal reached!':esc(fgText(g))}</b><span>${p.done?(g.reward?`Ask your grown-up for: ${esc(g.reward)}`:'Your grown-up will be proud!'):`A goal from your grown-up${g.reward?` · reward: ${esc(g.reward)}`:''}`}</span><div class="bar warm"><i style="width:${Math.round(p.have/p.need*100)}%"></i></div><small>${p.have} / ${p.need} ${FG_KINDS[g.k][2]}</small></div>`;
  if(p.done&&!g.cele){g.cele=Date.now();save();setTimeout(()=>{toast('Family goal reached!',g.reward?`Reward: ${esc(g.reward)}`:'Amazing work!','#38b98a');if(typeof confetti==='function')confetti()},600)}}
const FG_ICO='<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="20" width="32" height="22" rx="3" fill="#ff6b57" stroke="#1f3557" stroke-width="2.5"/><rect x="5" y="14" width="38" height="8" rx="2" fill="#ffc23d" stroke="#1f3557" stroke-width="2.5"/><path d="M24 14v28" stroke="#1f3557" stroke-width="2.5"/><path d="M24 14c-4-8-12-6-9-1 2 3 9 1 9 1zm0 0c4-8 12-6 9-1-2 3-9 1-9 1z" fill="#fff" stroke="#1f3557" stroke-width="2.2" stroke-linejoin="round"/></svg>';
/* Grown-ups: what the teacher shares (note, tasks, lesson) */
function fromTeacherHTML(){if(!G.cls||typeof classDoc!=='function')return '';const c=classDoc();if(!c)return '';const N=noteOf(c),T=openTasks(),L=lessonOf(c),today=dayKey();
  if(!N&&!T.length&&!L)return '';
  return `<div class="pcard wide"><h4>From ${esc(c.teacher||'the teacher')}</h4>${N?`<blockquote class="tnote">${esc(N.text)}<small>${new Date(N.ts).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</small></blockquote>`:''}
    ${L?`<p class="note">A class lesson is running now.</p>`:''}
    ${T.length?`<ul class="weak">${T.map(t=>`<li><div><b>${(t.isl||[]).map(id=>(byId(id)||{}).name||id).join(', ')}${t.sk&&CONTENT.skills[t.sk]?': '+esc(CONTENT.skills[t.sk].name):''}</b><small>${t.due?'due '+new Date(t.due+'T12:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}):'no due date'}${t.note?' · '+esc(t.note):''}</small></div><em class="${t.done?'ok':t.due&&t.due<today?'late':''}">${t.done?'Done':t.due&&t.due<today?'Overdue':'To do'}</em></li>`).join('')}</ul>`:''}</div>`}
/* printable report of the week for the family fridge (or the teacher) */
function printWeek(){const S=ISLANDS.filter(i=>i.gen&&!i.retired),wh=weekHist(8),w=wh[7],acc=w[1]?Math.round(w[2]/w[1]*100):null;
  const SK=S.flatMap(i=>skillsOf(i.id).map(s=>({...s,isl:i}))),mast=SK.filter(s=>skStat(s.k).st===2).length,alm=SK.filter(s=>skAlmost(skStat(s.k))).length;
  const subj=Object.keys(SUBJ_NAMES).map(k=>{const L=SK.filter(s=>islandSubject(s.isl)===k);return [SUBJ_NAMES[k],L.filter(s=>skStat(s.k).st===2).length,L.length]}).filter(x=>x[2]);
  const need=SK.filter(s=>{const m=skStat(s.k);return m.n>=3&&m.st!==2}).sort((a,b)=>skStat(a.k).ok/skStat(a.k).n-skStat(b.k).ok/skStat(b.k).n).slice(0,4);
  const tips=[...new Set(need.map(s=>s.isl.id))].slice(0,3).map(id=>[byId(id).name,homeTip(id)]).filter(x=>x[1]);
  let pa=$('#printArea');if(!pa){pa=document.createElement('div');pa.id='printArea';document.body.appendChild(pa)}
  pa.innerHTML=`<section class="rpt"><header><b>Pip's Sky Islands</b><span>Week of ${new Date(addDays(-6)+'T12:00').toLocaleDateString('en-US',{month:'long',day:'numeric'})} – ${new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</span></header>
    <h1>${esc(G.name||'Player')}</h1><p class="rsub">${esc(PACK.stateName)}, ${GRADE_WORD(PACK.grade).toLowerCase()}</p>
    <div class="rtiles"><div><b>${w[0]}</b><span>minutes this week</span></div><div><b>${w[1]}</b><span>puzzles this week</span></div><div><b>${acc==null?'–':acc+'%'}</b><span>right on the first try</span></div><div><b>${mast}/${SK.length}</b><span>skills mastered (${alm} almost)</span></div></div>
    <h2>Last 8 weeks</h2>${weeksHTML(wh)}
    <h2>Skills by subject</h2><table class="rtab">${subj.map(([t,m,n])=>`<tr><td>${t}</td><td><div class="rbar"><i style="width:${Math.round(m/n*100)}%"></i></div></td><td>${m} of ${n} mastered</td></tr>`).join('')}</table>
    <h2>To practice next</h2>${need.length?`<ul>${need.map(s=>{const m=skStat(s.k);return `<li><b>${esc(s.name)}</b> (${esc(s.isl.name)}): ${m.ok} of ${m.n} right</li>`}).join('')}</ul>`:'<p>Nothing stands out right now. Keep playing a little each day!</p>'}
    ${tips.length?`<h2>Try at home</h2><ul>${tips.map(([n,t])=>`<li><b>${esc(n)}:</b> ${esc(t)}</li>`).join('')}</ul>`:''}</section>`;
  document.body.classList.add('printing');const done=()=>{document.body.classList.remove('printing');removeEventListener('afterprint',done)};addEventListener('afterprint',done);
  setTimeout(()=>{try{window.print()}catch(e){}setTimeout(done,1000)},50)}
