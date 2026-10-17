/* Pip's Sky Islands: a round is a little mission. Each answer does something in a scene above the puzzle:
   - Digit Cliffs: Pip builds a bridge across a canyon, one plank per puzzle, then flies across to the flag
   - Bookworm Bay: Pip lights the lanterns of a dark library in the clouds; the room glows brighter with each one
   Right on the first try = a golden plank / a bright lantern; on the second try = a wooden plank / a warm lantern;
   a miss = a rope plank / a small candle, so the mission always finishes (a miss is never a punishment) and the
   finished scene shows how the round went. Only decoration: no rule depends on it; "reduce motion" keeps it still. */
const MISSIONS={
  place:{kind:'bridge',title:'Build the bridge',done:'Bridge built! Pip flies across.',startSay:'Help me build a bridge to the next cliff! Each right answer adds a plank.'},
  reading:{kind:'lanterns',title:'Light the library',done:'The library is glowing! Every lantern is lit.',startSay:'The cloud library is dark! Each right answer lights a lantern.'}
};
const MS={on:false,n:0,kind:'',got:[]};
const msOn=()=>MS.on&&S&&S.mode==='island';
function missionFor(){if(!S||S.mode!=='island'||!S.isl||S.chal)return null;if(G&&G.settings&&G.settings.mission===false)return null;return MISSIONS[S.isl.id]||null}
function missionRound(){const box=document.getElementById('mission');if(!box)return;const M=missionFor();
  MS.on=!!M;document.body.classList.toggle('has-mission',MS.on);if(!M){box.hidden=true;box.innerHTML='';return}
  MS.n=S.qs.length;MS.kind=M.kind;MS.got=Array(MS.n).fill('');box.hidden=false;
  box.innerHTML=`<div class="mstitle"><span>${M.title}</span><b id="msCount">0 / ${MS.n}</b></div>${M.kind==='bridge'?bridgeSVG(MS.n):lanternSVG(MS.n)}`;
  box.classList.remove('msdone');missionDraw();
  if(S.i===0&&!S.msSaid){S.msSaid=1;setTimeout(()=>{if(msOn()&&S.i===0&&!S.locked)say($('#say'),M.startSay)},1600)}}
/* ---------- the bridge ---------- */
const BR={x0:62,x1:298,y:58};
function bridgeSVG(n){const w=(BR.x1-BR.x0)/n;let slots='';
  for(let i=0;i<n;i++)slots+=`<g class="msslot" data-i="${i}"><rect class="msghost" x="${BR.x0+i*w+1.5}" y="${BR.y}" width="${w-3}" height="9" rx="2"/><g class="msplank"></g></g>`;
  return `<svg class="msscene bridge" viewBox="0 0 360 112" role="img" aria-label="A bridge Pip is building across a canyon">
    <defs><linearGradient id="msSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe6ff"/><stop offset="1" stop-color="#e9f6ff"/></linearGradient></defs>
    <rect x="0" y="0" width="360" height="112" rx="14" fill="url(#msSky)"/>
    <g fill="#fff" opacity=".85"><ellipse cx="180" cy="100" rx="70" ry="10"/><ellipse cx="120" cy="104" rx="40" ry="7"/><ellipse cx="245" cy="104" rx="44" ry="7"/></g>
    <path d="M0 52 H64 L58 70 L66 112 H0Z" fill="#9b7a55"/><path d="M0 52 H64 L62 58 H0Z" fill="#6fbf6a"/>
    <path d="M360 52 H296 L302 70 L294 112 H360Z" fill="#9b7a55"/><path d="M360 52 H296 L298 58 H360Z" fill="#6fbf6a"/>
    <path d="M${BR.x0} ${BR.y-14} Q180 ${BR.y-2} ${BR.x1} ${BR.y-14}" fill="none" stroke="#8a6a44" stroke-width="2" stroke-dasharray="3 3" class="msrope"/>
    ${slots}
    <g class="msflag" transform="translate(326 22)">${AL_FLAG.replace('<svg viewBox="0 0 20 22" aria-hidden="true">','<svg width="22" height="26" viewBox="0 0 20 22">')}</g>
    <g class="mspip"><g class="mspipin">${AL_PIP.replace('<svg viewBox="0 0 24 30" aria-hidden="true">','<svg x="-11" y="-30" width="22" height="28" viewBox="0 0 24 30">')}</g></g>
  </svg>`}
function plankHTML(kind,i,n){const w=(BR.x1-BR.x0)/n,x=BR.x0+i*w+1.5,W=w-3;
  if(kind==='miss')return `<path d="M${x} ${BR.y+4} Q${x+W/2} ${BR.y+8} ${x+W} ${BR.y+4}" stroke="#a08a6a" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  return `<rect x="${x}" y="${BR.y}" width="${W}" height="9" rx="2" fill="${kind==='gold'?'#ffc23d':'#c98a4b'}" stroke="#1f3557" stroke-width="1.4"/>${kind==='gold'?`<path d="M${x+3} ${BR.y+3} h${Math.max(2,W-6)}" stroke="#fff3c2" stroke-width="1.6" stroke-linecap="round"/>`:''}`}
/* ---------- the lanterns ---------- */
function lanternSVG(n){const xs=Array.from({length:n},(_,i)=>36+i*(288/Math.max(1,n-1)));
  return `<svg class="msscene lanterns" viewBox="0 0 360 112" role="img" aria-label="A dark library in the clouds that Pip is lighting up">
    <rect x="0" y="0" width="360" height="112" rx="14" fill="#23305a"/>
    <g class="msroom" opacity=".18">
      <rect x="0" y="0" width="360" height="112" rx="14" fill="#ffe7b0"/>
      ${[16,74,250,308].map(x=>`<g transform="translate(${x} 44)"><rect width="38" height="64" fill="#8c5a2c"/>${[6,26,46].map(y=>`<rect x="3" y="${y}" width="32" height="16" fill="#5a3a1c"/>${[0,1,2,3,4].map(k=>`<rect x="${5+k*6}" y="${y+2}" width="4" height="13" fill="${['#e2558f','#2f9fe0','#38b98a','#ffc23d','#7b6cf0'][(k+x)%5]}"/>`).join('')}`).join('')}</g>`).join('')}
      <circle cx="180" cy="62" r="26" fill="#fff6d8"/><path d="M168 62 a12 12 0 1 0 22 -9 a10 10 0 1 1 -22 9z" fill="#ffd56b"/>
      <path d="M142 108 L150 70 h60 l8 38z" fill="#c98a4b"/><path d="M152 76 h56 M150 86 h60" stroke="#8c5a2c" stroke-width="2"/>
    </g>
    <path d="M10 18 Q180 38 350 18" fill="none" stroke="#c9b48a" stroke-width="1.6"/>
    ${xs.map((x,i)=>{const y=18+20*(1-Math.pow((x-180)/170,2))*.98;return `<g class="mslamp" data-i="${i}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle class="msglow" r="15" fill="#ffd56b" opacity="0"/><path d="M0 0 v5" stroke="#c9b48a" stroke-width="1.4"/><rect class="msjar" x="-6" y="5" width="12" height="15" rx="4" fill="#3b4a78" stroke="#c9b48a" stroke-width="1.4"/><path class="msflame" d="M0 9 q3 4 0 7 q-3 -3 0 -7z" fill="#ffb347" opacity="0"/></g>`}).join('')}
    <g class="mspip"><g class="mspipin">${AL_PIP.replace('<svg viewBox="0 0 24 30" aria-hidden="true">','<svg x="-10" y="-4" width="20" height="25" viewBox="0 0 24 30">')}</g></g>
  </svg>`}
/* ---------- drawing the progress ---------- */
function missionDraw(){const box=document.getElementById('mission');if(!box||!MS.on)return;const svg=box.querySelector('svg');if(!svg)return;
  const placed=MS.got.filter(Boolean).length,c=document.getElementById('msCount');if(c)c.textContent=`${placed} / ${MS.n}`;
  if(MS.kind==='bridge'){MS.got.forEach((k,i)=>{const g=svg.querySelector(`.msslot[data-i="${i}"] .msplank`);if(g&&g.dataset.k!==k){g.dataset.k=k;g.innerHTML=k?plankHTML(k,i,MS.n):'';if(k)g.classList.add('drop')}});
    /* Pip stands at the end of the bridge built so far, or over the far cliff when it is finished */
    let last=-1;for(let i=0;i<MS.n;i++){if(MS.got[i])last=i;else break}
    const w=(BR.x1-BR.x0)/MS.n,x=placed===MS.n&&box.classList.contains('msdone')?328:last<0?36:BR.x0+(last+1)*w-w/2,y=placed===MS.n&&box.classList.contains('msdone')?50:BR.y-1;
    svg.querySelector('.mspip').style.transform=`translate(${x}px,${y}px)`}
  else{const lamps=[...svg.querySelectorAll('.mslamp')];let lit=0;
    MS.got.forEach((k,i)=>{const L=lamps[i];if(!L)return;L.classList.toggle('lit',!!k);L.classList.toggle('gold',k==='gold');L.classList.toggle('candle',k==='miss');if(k)lit+=k==='gold'?1:k==='ok'?.8:.5});
    svg.querySelector('.msroom').setAttribute('opacity',(.18+.82*lit/MS.n).toFixed(2));
    const nx=MS.got.findIndex(k=>!k),L=lamps[nx<0?lamps.length-1:nx];if(L){const m=/translate\(([\d.]+) ([\d.]+)\)/.exec(L.getAttribute('transform'));
      svg.querySelector('.mspip').style.transform=nx<0&&box.classList.contains('msdone')?'translate(180px,52px)':`translate(${m[1]}px,${(+m[2]+22).toFixed(1)}px)`}}}
/* an answer: 'gold' (first try), 'ok' (second try), 'miss' (shown the answer); 'wobble' for a first wrong try */
function missionAnswer(kind){if(!msOn())return;const i=S.i;if(i<0||i>=MS.n)return;
  if(kind==='wobble'){const box=document.getElementById('mission'),el=box&&box.querySelector(MS.kind==='bridge'?`.msslot[data-i="${i}"]`:`.mslamp[data-i="${i}"]`);
    if(el&&!reduce){el.classList.remove('wob');void el.getBoundingClientRect();el.classList.add('wob')}return}
  MS.got[i]=kind;missionDraw();if(MS.got.every(Boolean))setTimeout(missionFinish,700)}
function missionFinish(){if(!msOn())return;const box=document.getElementById('mission');if(!box||box.classList.contains('msdone'))return;box.classList.add('msdone');missionDraw();
  const M=missionFor(),gold=MS.got.filter(k=>k==='gold').length;
  setTimeout(()=>{if(!msOn())return;const r=box.getBoundingClientRect();if(r.width&&!reduce)burst(r.left+r.width*(MS.kind==='bridge'?.9:.5),r.top+r.height*.4,22);
    if(typeof jingle==='function')jingle('level');say($('#say'),`${M.done} ${gold===MS.n?'<b>All golden!</b> Perfect!':gold>=MS.n-1?'Almost all golden!':'Every round makes it stronger!'}`,true)},500)}
