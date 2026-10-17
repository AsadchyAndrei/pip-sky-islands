/* Pip's Sky Islands: visit another grade. A child who needs a refresher plays last year's islands ("Review grade 3"),
   a child who is ahead peeks at next year's ("Sneak peek: grade 5"). The child's own grade stays home: its stars,
   skills and mistakes wait untouched (they are kept per grade, see packSwitch), and a bar on the map always leads back.
   Coins, the island, the closet and the sky buddy are shared, as always. Not for players in a teacher's class: the class
   decides the grade there, so the teacher's view stays right. */
const visitHome=()=>(G&&G.visit&&G.visit.home)||(G&&G.pack)||PACK.id;
function visitTargets(){const H=CONTENT.packs[visitHome()];if(!H)return {};const ready=g=>{const P=CONTENT.packs[packKey(H.state,g)];return packReady(P)?P:null};
  return {home:H,down:ready(H.grade-1),up:ready(H.grade+1)}}
const visitOk=()=>!!G&&!G.cls&&!G.roster;
function visitGrade(id){if(!visitOk()||!CONTENT.packs[id]||id===G.pack)return;
  const home=visitHome();if(id===home)delete G.visit;else G.visit={home,since:Date.now()};
  packSwitch(id);save(true);try{localStorage.setItem('pip-pack',id);if(ROOT.current)sessionStorage.setItem('pip-resume',ROOT.current)}catch(e){}location.reload()}
const visitBack=()=>visitGrade(visitHome());
/* the bar on the map while visiting, and two small doors when at home */
function renderVisitBar(){const el=document.getElementById('visitBar');if(!el)return;const T=visitTargets();
  if(G.visit&&T.home){const up=PACK.grade>T.home.grade;el.hidden=false;el.className='visitbar'+(up?' up':'');
    el.innerHTML=`<span class="vbtxt"><b>${up?`Sneak peek: ${GRADE_WORD(PACK.grade)}`:`Review: ${GRADE_WORD(PACK.grade)}`}</b><small>${up?'Next year\'s islands. Stars here count for this grade.':'Last year\'s islands, to make old skills strong.'} Your ${GRADE_WORD(T.home.grade).toLowerCase()} progress is safe.</small></span><button type="button" class="go small" id="visitBack">Back to ${GRADE_WORD(T.home.grade).toLowerCase()}</button>`;
    document.getElementById('visitBack').onclick=visitBack;return}
  el.hidden=true;el.innerHTML=''}
function visitDoorsHTML(){if(!visitOk()||G.visit)return '';const T=visitTargets();if(!T.down&&!T.up)return '';
  return `<span class="vdoors">${T.down?`<button type="button" class="linkbtn" data-visit="${T.down.id}">Review ${GRADE_WORD(T.down.grade).toLowerCase()}</button>`:''}${T.down&&T.up?' · ':''}${T.up?`<button type="button" class="linkbtn" data-visit="${T.up.id}">Sneak peek: ${GRADE_WORD(T.up.grade).toLowerCase()}</button>`:''}</span>`}
function bindVisitDoors(root){(root||document).querySelectorAll('[data-visit]').forEach(b=>b.onclick=()=>visitGrade(b.dataset.visit))}
/* Parents: the same choice, explained */
function visitParentHTML(){if(!visitOk())return '';const T=visitTargets();if(!T.down&&!T.up&&!G.visit)return '';const n=esc(G.name||'your child');
  if(G.visit)return `<div class="pcard wide"><h4>Visiting another grade</h4><p>${n} is playing <b>${esc(GRADE_WORD(PACK.grade).toLowerCase())}</b> islands right now. The ${esc(GRADE_WORD(T.home.grade).toLowerCase())} progress waits, untouched.</p><div class="btnrow"><button type="button" class="go small" data-visit="${T.home.id}">Back to ${esc(GRADE_WORD(T.home.grade).toLowerCase())}</button></div></div>`;
  return `<div class="pcard wide"><h4>Review or get ahead</h4><p class="note">Islands from another grade, with their own stars and skills. ${n}'s ${esc(GRADE_WORD(T.home.grade).toLowerCase())} progress stays safe, and one tap on the map brings ${n} back.</p><div class="btnrow">${T.down?`<button type="button" class="go small alt" data-visit="${T.down.id}">Review ${esc(GRADE_WORD(T.down.grade).toLowerCase())}</button>`:''}${T.up?`<button type="button" class="go small alt" data-visit="${T.up.id}">Sneak peek: ${esc(GRADE_WORD(T.up.grade).toLowerCase())}</button>`:''}</div><p class="note">Good for summer, for filling gaps from last year, or for a child who finished this grade's islands.</p></div>`}
