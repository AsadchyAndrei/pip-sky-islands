/* Pip's Sky Islands: the learning record. A printable page for any period (a month, a quarter, the school year):
   days of learning, hours, puzzles, first-try accuracy by month, and every skill mastered in the period with its
   standard. Made for homeschool portfolios and records, and useful for any family. Times count while puzzles are on
   screen. Skills mastered before the record started (G.mastLog, from October 2026) show as "mastered earlier". */
const REC_PERIODS=[['month','This month'],['last','Last month'],['quarter','Last 3 months'],['year','This school year'],['custom','Choose dates']];
function recRange(kind){const now=new Date(),y=now.getFullYear(),m=now.getMonth(),iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,t=dayKey();
  if(kind==='month')return [iso(new Date(y,m,1)),t];
  if(kind==='last')return [iso(new Date(y,m-1,1)),iso(new Date(y,m,0))];
  if(kind==='quarter')return [iso(new Date(y,m-2,1)),t];
  const sy=m>=7?y:y-1;return [`${sy}-08-01`,t]}
function recData(from,to){const D=G.days||{},days=Object.keys(D).filter(k=>k>=from&&k<=to&&((D[k].q||0)>0||(D[k].sec||0)>=60)).sort();
  const sum=days.reduce((a,k)=>[a[0]+(D[k].sec||0),a[1]+(D[k].q||0),a[2]+(D[k].c||0)],[0,0,0]);
  const months={};days.forEach(k=>{const mk=k.slice(0,7),d=D[k];const M=months[mk]||(months[mk]=[0,0,0,0]);M[0]++;M[1]+=d.sec||0;M[2]+=d.q||0;M[3]+=d.c||0});
  const seen=new Set(),mast=(G.mastLog||[]).filter(x=>x.d>=from&&x.d<=to&&CONTENT.skills[x.k]&&!seen.has(x.k)&&seen.add(x.k)).map(x=>({...x,S:CONTENT.skills[x.k]}));
  return {days,sum,months,mast}}
const recHours=s=>(s/3600).toFixed(s>=36000?0:1);
function printRecord(from,to){if(!from||!to||from>to){toast('Check the dates','The first date must come before the second.','#ff6b57');return}
  const R=recData(from,to),acc=R.sum[1]?Math.round(R.sum[2]/R.sum[1]*100):null,fmtD=k=>new Date(k+'T12:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  const S=ISLANDS.filter(i=>i.gen&&!i.retired),SK=S.flatMap(i=>skillsOf(i.id).map(s=>({...s,isl:i})));
  const subj=Object.keys(SUBJ_NAMES).map(k=>{const L=SK.filter(s=>islandSubject(s.isl)===k);return [SUBJ_NAMES[k],L.filter(s=>skStat(s.k).st===2).length,L.length]}).filter(x=>x[2]);
  const bySubj=Object.keys(SUBJ_NAMES).map(k=>[SUBJ_NAMES[k],R.mast.filter(x=>x.S.subject===k)]).filter(x=>x[1].length);
  const monthName=mk=>new Date(mk+'-15T12:00').toLocaleDateString('en-US',{month:'long',year:'numeric'});
  let pa=$('#printArea');if(!pa){pa=document.createElement('div');pa.id='printArea';document.body.appendChild(pa)}
  pa.innerHTML=`<section class="rpt"><header><b>Pip's Sky Islands · Learning record</b><span>${fmtD(from)} – ${fmtD(to)}</span></header>
    <h1>${esc(G.name||'Player')}</h1><p class="rsub">${esc(PACK.stateName)}, ${GRADE_WORD(PACK.grade).toLowerCase()} · math, English, science and social studies practice aligned to state standards</p>
    <div class="rtiles"><div><b>${R.days.length}</b><span>days of learning</span></div><div><b>${recHours(R.sum[0])}</b><span>hours of practice</span></div><div><b>${fmt(R.sum[1])}</b><span>puzzles solved</span></div><div><b>${acc==null?'–':acc+'%'}</b><span>right on the first try</span></div></div>
    <h2>By month</h2>${Object.keys(R.months).length?`<table class="rtab rmon"><tr><th>Month</th><th>Days</th><th>Hours</th><th>Puzzles</th><th>First try</th></tr>${Object.keys(R.months).sort().map(mk=>{const M=R.months[mk];return `<tr><td>${monthName(mk)}</td><td>${M[0]}</td><td>${recHours(M[1])}</td><td>${fmt(M[2])}</td><td>${M[2]?Math.round(M[3]/M[2]*100)+'%':'–'}</td></tr>`}).join('')}</table>`:'<p>No play in this period.</p>'}
    <h2>Skills mastered in this period</h2>${bySubj.length?bySubj.map(([t,L])=>`<p class="rsk"><b>${t}</b></p><ul>${L.map(x=>`<li>${esc(x.S.name)} <small>(${esc(x.S.std.join(', '))}) · ${fmtD(x.d)}</small></li>`).join('')}</ul>`).join(''):'<p>No new skills mastered in this period.</p>'}
    <h2>Where things stand now (${GRADE_WORD(PACK.grade).toLowerCase()})</h2><table class="rtab">${subj.map(([t,m,n])=>`<tr><td>${t}</td><td><div class="rbar"><i style="width:${Math.round(m/n*100)}%"></i></div></td><td>${m} of ${n} skills mastered</td></tr>`).join('')}</table>
    <p class="wknote">A skill is mastered at 8 of the last 10 puzzles right on the first try, after at least 8 tries on 2 different days. Hours count while puzzles are on screen. Printed ${fmtD(dayKey())}.</p>
    <p class="rsign">Parent / teacher signature: ______________________________ &nbsp; Date: ____________</p></section>`;
  document.body.classList.add('printing');const done=()=>{document.body.classList.remove('printing');removeEventListener('afterprint',done)};addEventListener('afterprint',done);
  setTimeout(()=>{try{window.print()}catch(e){}setTimeout(done,1000)},50)}
function recordParentHTML(){const [f,t]=recRange('year'),R=recData(f,t);
  return `<div class="pcard wide" id="recCard"><h4>Learning record</h4><p class="note">A printable record for any period: days of learning, hours, puzzles by month, and every skill mastered with its standard. Handy for homeschool portfolios. This school year so far: <b>${R.days.length}</b> days, <b>${recHours(R.sum[0])}</b> hours.</p>
    <div class="setrow"><label for="recKind">Period</label><select id="recKind">${REC_PERIODS.map(([k,n])=>`<option value="${k}"${k==='year'?' selected':''}>${n}</option>`).join('')}</select></div>
    <div class="setrow" id="recDates" hidden><label>From – to</label><span class="recdates"><input type="date" id="recFrom" value="${f}"> <input type="date" id="recTo" value="${t}"></span></div>
    <div class="btnrow" style="justify-content:flex-start"><button type="button" class="go small alt" id="recPrint">Print the record</button><a class="go small alt" href="homeschool.html?pack=${encodeURIComponent(PACK.id)}#plan" target="_blank" rel="noopener">Year plan by weeks</a></div></div>`}
function bindRecord(){const k=$('#recKind');if(!k)return;k.onchange=()=>{$('#recDates').hidden=k.value!=='custom'};
  $('#recPrint').onclick=()=>{const [f,t]=k.value==='custom'?[$('#recFrom').value,$('#recTo').value]:recRange(k.value);printRecord(f,t)}}
