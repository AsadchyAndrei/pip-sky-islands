/* Pip's Sky Islands: a round is a little mission. Each answer does something in a scene above the puzzle.
   Six kinds of scenes, each island has its own story:
     bridge   – Pip builds a bridge (or dock, or arch) across a gap, one plank per puzzle, then flies across to the flag
     lanterns – Pip lights the lanterns of a dark room in the clouds; the room glows brighter with each one
     garden   – a seed in each pot grows when you answer; first-try answers bloom into flowers
     climb    – Pip flies up through cloud rings toward a star
     machine  – each answer lights a bulb on a whirring cloud machine; when it is full it puffs a rainbow
     map      – each answer uncovers a piece of an old map until the treasure X shows
   First try = golden (bright flower, golden ring, bright bulb...), second try = normal, a miss = small (sprout, grey
   ring, dim bulb...), so the mission always finishes (a miss is never a punishment) and the finished scene shows how the
   round went. Only decoration: no rule depends on it; "reduce motion" keeps it still. */
const MK=(kind,title,done,startSay)=>({kind,title,done,startSay});
const MISSIONS={
  place:MK('bridge','Build the bridge','Bridge built! Pip flies across.','Help me build a bridge to the next cliff! Each right answer adds a plank.'),
  addsub:MK('bridge','Cross Carry Canyon','We crossed the canyon!','Let\'s build a bridge across the canyon! Each right answer adds a plank.'),
  angle:MK('bridge','Build the arch bridge','The arch bridge is done!','Every right answer adds a stone to our bridge!'),
  shape:MK('bridge','Build the dock','The dock is ready for ships!','Help me build a dock for the shipyard! Each right answer adds a board.'),
  reading:MK('lanterns','Light the library','The library is glowing! Every lantern is lit.','The cloud library is dark! Each right answer lights a lantern.'),
  listen:MK('lanterns','Light the lagoon','The whole lagoon sparkles!','The lagoon is dark tonight. Each right answer lights a lantern.'),
  words:MK('lanterns','Light the waterfall cave','The cave behind the waterfall is bright!','There\'s a dark cave behind the waterfall! Let\'s light it up.'),
  write:MK('lanterns','Light the stage','The stage is ready for the show!','Our story stage needs lights! Each right answer turns one on.'),
  mult:MK('garden','Grow the meadow','The meadow is in bloom!','Each pot has a seed. Answer right and watch it grow!'),
  div:MK('garden','Plant the shore','The shore garden is growing!','Let\'s plant a garden by the shore! Each answer helps a seed grow.'),
  area:MK('garden','Plant the farm','The farm rows are full!','Fence Farm needs plants! Every right answer grows one.'),
  graph:MK('garden','Grow the garden','Graph Garden is blooming!','Help the garden grow! First-try answers make flowers.'),
  grammar:MK('garden','Grow the grove','The grove is green again!','Each right answer grows a little tree in the grove!'),
  frac:MK('climb','Fly to the peak','We reached the top of Pie Peak!','Let\'s fly up to the peak! Each right answer lifts us through a cloud ring.'),
  dec:MK('climb','Sail up the sky','We sailed all the way up!','Each right answer lifts my balloon through a ring!'),
  pattern:MK('climb','Climb the pass','We made it over the pass!','Fly with me over the pass! Each answer is one ring higher.'),
  riddle:MK('climb','Reach the riddle star','We reached the riddle star!','A star is waiting at the top! Each answer flies us closer.'),
  science:MK('machine','Fix the cloud machine','The cloud machine works! A rainbow!','The cloud machine is broken! Each right answer lights a bulb.'),
  measure:MK('machine','Power the mine cart','The mine cart is rolling!','Help me power up the mine machine! Each answer lights a bulb.'),
  money:MK('machine','Fill the market','The market is open!','Let\'s light up the market stalls! Each answer turns on a light.'),
  time:MK('machine','Wind the clock tower','The clock tower is ticking!','The big clock stopped! Each right answer winds it up.'),
  history:MK('map','Find the lost map','The map is whole! X marks the spot!','A treasure map is hidden here! Each answer uncovers a piece.'),
  geo:MK('map','Uncover the map','The whole map is uncovered!','Help me uncover the map, piece by piece!')
};
const MS={on:false,n:0,kind:'',got:[]};
const msOn=()=>MS.on&&S&&S.mode==='island';
function missionFor(){if(!S||S.mode!=='island'||!S.isl||S.chal)return null;if(G&&G.settings&&G.settings.mission===false)return null;return MISSIONS[S.isl.id]||null}
const msPip=(w,h,dx,dy)=>`<g class="mspip"><g class="mspipin">${AL_PIP.replace('<svg viewBox="0 0 24 30" aria-hidden="true">',`<svg x="${dx}" y="${dy}" width="${w}" height="${h}" viewBox="0 0 24 30">`)}</g></g>`;
const MSCENE={};
function missionRound(){const box=document.getElementById('mission');if(!box)return;const M=missionFor();
  MS.on=!!M;document.body.classList.toggle('has-mission',MS.on);if(!M){box.hidden=true;box.innerHTML='';return}
  MS.n=S.qs.length;MS.kind=M.kind;MS.got=Array(MS.n).fill('');box.hidden=false;box.classList.remove('msdone');
  box.innerHTML=`<div class="mstitle"><span>${M.title}</span><b id="msCount">0 / ${MS.n}</b></div>${MSCENE[M.kind].svg(MS.n)}`;missionDraw();
  if(S.i===0&&!S.msSaid){S.msSaid=1;setTimeout(()=>{if(msOn()&&S.i===0&&!S.locked)say($('#say'),M.startSay)},1600)}}
/* ---------- bridge ---------- */
const BR={x0:62,x1:298,y:58};
MSCENE.bridge={
  svg(n){const w=(BR.x1-BR.x0)/n;let slots='';
    for(let i=0;i<n;i++)slots+=`<g class="msslot" data-i="${i}"><rect class="msghost" x="${BR.x0+i*w+1.5}" y="${BR.y}" width="${w-3}" height="9" rx="2"/><g class="msplank"></g></g>`;
    return `<svg class="msscene bridge" viewBox="0 0 360 112" role="img" aria-label="A bridge Pip is building across a canyon">
      <defs><linearGradient id="msSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe6ff"/><stop offset="1" stop-color="#e9f6ff"/></linearGradient></defs>
      <rect x="0" y="0" width="360" height="112" rx="14" fill="url(#msSky)"/>
      <g fill="#fff" opacity=".85"><ellipse cx="180" cy="100" rx="70" ry="10"/><ellipse cx="120" cy="104" rx="40" ry="7"/><ellipse cx="245" cy="104" rx="44" ry="7"/></g>
      <path d="M0 52 H64 L58 70 L66 112 H0Z" fill="#9b7a55"/><path d="M0 52 H64 L62 58 H0Z" fill="#6fbf6a"/>
      <path d="M360 52 H296 L302 70 L294 112 H360Z" fill="#9b7a55"/><path d="M360 52 H296 L298 58 H360Z" fill="#6fbf6a"/>
      <path d="M${BR.x0} ${BR.y-14} Q180 ${BR.y-2} ${BR.x1} ${BR.y-14}" fill="none" stroke="#8a6a44" stroke-width="2" stroke-dasharray="3 3" class="msrope"/>
      ${slots}<g class="msflag" transform="translate(326 22)">${AL_FLAG.replace('<svg viewBox="0 0 20 22" aria-hidden="true">','<svg width="22" height="26" viewBox="0 0 20 22">')}</g>${msPip(22,28,-11,-30)}</svg>`},
  draw(svg,done){const n=MS.n,w=(BR.x1-BR.x0)/n;
    MS.got.forEach((k,i)=>{const g=svg.querySelector(`.msslot[data-i="${i}"] .msplank`);if(!g||g.dataset.k===k)return;g.dataset.k=k;
      const x=BR.x0+i*w+1.5,W=w-3;g.innerHTML=!k?'':k==='miss'?`<path d="M${x} ${BR.y+4} Q${x+W/2} ${BR.y+8} ${x+W} ${BR.y+4}" stroke="#a08a6a" stroke-width="3" fill="none" stroke-linecap="round"/>`
        :`<rect x="${x}" y="${BR.y}" width="${W}" height="9" rx="2" fill="${k==='gold'?'#ffc23d':'#c98a4b'}" stroke="#1f3557" stroke-width="1.4"/>${k==='gold'?`<path d="M${x+3} ${BR.y+3} h${Math.max(2,W-6)}" stroke="#fff3c2" stroke-width="1.6" stroke-linecap="round"/>`:''}`;
      if(k)g.classList.add('drop')});
    let last=-1;for(let i=0;i<n;i++){if(MS.got[i])last=i;else break}
    return done?[328,50]:[last<0?36:BR.x0+(last+1)*w-w/2,BR.y-1]},
  slot:i=>`.msslot[data-i="${i}"]`};
/* ---------- lanterns ---------- */
const lampX=n=>Array.from({length:n},(_,i)=>36+i*(288/Math.max(1,n-1))),lampY=x=>18+20*(1-Math.pow((x-180)/170,2))*.98;
MSCENE.lanterns={
  svg(n){const xs=lampX(n);
    return `<svg class="msscene lanterns" viewBox="0 0 360 112" role="img" aria-label="A dark room in the clouds that Pip is lighting up">
      <rect x="0" y="0" width="360" height="112" rx="14" fill="#23305a"/>
      <g class="msroom" opacity=".18">
        <rect x="0" y="0" width="360" height="112" rx="14" fill="#ffe7b0"/>
        ${[16,74,250,308].map(x=>`<g transform="translate(${x} 44)"><rect width="38" height="64" fill="#8c5a2c"/>${[6,26,46].map(y=>`<rect x="3" y="${y}" width="32" height="16" fill="#5a3a1c"/>${[0,1,2,3,4].map(k=>`<rect x="${5+k*6}" y="${y+2}" width="4" height="13" fill="${['#e2558f','#2f9fe0','#38b98a','#ffc23d','#7b6cf0'][(k+x)%5]}"/>`).join('')}`).join('')}</g>`).join('')}
        <circle cx="180" cy="62" r="26" fill="#fff6d8"/><path d="M168 62 a12 12 0 1 0 22 -9 a10 10 0 1 1 -22 9z" fill="#ffd56b"/>
        <path d="M142 108 L150 70 h60 l8 38z" fill="#c98a4b"/><path d="M152 76 h56 M150 86 h60" stroke="#8c5a2c" stroke-width="2"/>
      </g>
      <path d="M10 18 Q180 38 350 18" fill="none" stroke="#c9b48a" stroke-width="1.6"/>
      ${xs.map((x,i)=>`<g class="mslamp" data-i="${i}" transform="translate(${x.toFixed(1)} ${lampY(x).toFixed(1)})"><circle class="msglow" r="15" fill="#ffd56b" opacity="0"/><path d="M0 0 v5" stroke="#c9b48a" stroke-width="1.4"/><rect class="msjar" x="-6" y="5" width="12" height="15" rx="4" fill="#3b4a78" stroke="#c9b48a" stroke-width="1.4"/><path class="msflame" d="M0 9 q3 4 0 7 q-3 -3 0 -7z" fill="#ffb347" opacity="0"/></g>`).join('')}
      ${msPip(20,25,-10,-4)}</svg>`},
  draw(svg,done){const lamps=[...svg.querySelectorAll('.mslamp')];let lit=0;
    MS.got.forEach((k,i)=>{const L=lamps[i];if(!L)return;L.classList.toggle('lit',!!k);L.classList.toggle('gold',k==='gold');L.classList.toggle('candle',k==='miss');if(k)lit+=k==='gold'?1:k==='ok'?.8:.5});
    svg.querySelector('.msroom').setAttribute('opacity',(.18+.82*lit/MS.n).toFixed(2));
    const xs=lampX(MS.n),nx=MS.got.findIndex(k=>!k),i=nx<0?MS.n-1:nx;return done?[180,52]:[xs[i],lampY(xs[i])+22]},
  slot:i=>`.mslamp[data-i="${i}"]`};
/* ---------- garden ---------- */
const potX=n=>Array.from({length:n},(_,i)=>34+i*(292/Math.max(1,n-1)));
const PLANT={gold:c=>`<path d="M0 0 V-22" stroke="#2e9e5b" stroke-width="2.4"/><path d="M0 -10 q-8 -2 -9 -9 q7 0 9 7z M0 -14 q8 -2 9 -9 q-7 0 -9 7z" fill="#38b98a"/>${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-30" rx="4.2" ry="7" fill="${c}" transform="rotate(${a} 0 -30) translate(0 -5)"/>`).join('')}<circle cx="0" cy="-30" r="4" fill="#ffc23d" stroke="#1f3557" stroke-width="1"/>`,
  ok:()=>`<path d="M0 0 V-20" stroke="#2e9e5b" stroke-width="2.4"/><path d="M0 -8 q-10 -2 -11 -11 q9 0 11 9z M0 -13 q10 -2 11 -11 q-9 0 -11 9z M0 -19 q-6 -6 0 -12 q6 6 0 12z" fill="#38b98a"/>`,
  miss:()=>`<path d="M0 0 V-7" stroke="#2e9e5b" stroke-width="2"/><path d="M0 -6 q-5 -1 -6 -6 q5 0 6 5z M0 -6 q5 -1 6 -6 q-5 0 -6 5z" fill="#7bcf8e"/>`};
MSCENE.garden={
  svg(n){const xs=potX(n);
    return `<svg class="msscene garden" viewBox="0 0 360 112" role="img" aria-label="A row of flower pots that grow as Pip answers">
      <defs><linearGradient id="msMead" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9ecff"/><stop offset="1" stop-color="#f1fbff"/></linearGradient></defs>
      <rect x="0" y="0" width="360" height="112" rx="14" fill="url(#msMead)"/>
      <circle class="mssun" cx="326" cy="22" r="11" fill="#ffd56b" opacity=".5"/>
      <path d="M0 96 Q90 84 180 94 T360 92 V112 H0Z" fill="#8fd18b"/>
      ${xs.map((x,i)=>`<g class="mspot" data-i="${i}" transform="translate(${x.toFixed(1)} 92)"><g class="msplant"></g><path d="M-10 -2 h20 l-3 14 h-14z" fill="#d9774a" stroke="#1f3557" stroke-width="1.3"/><rect x="-11" y="-4" width="22" height="4" rx="1.5" fill="#c4643a" stroke="#1f3557" stroke-width="1.1"/></g>`).join('')}
      <g class="msbugs" opacity="0">${[[90,26,'#e2558f'],[250,34,'#2f9fe0']].map(([x,y,c])=>`<g transform="translate(${x} ${y})"><path d="M0 0 q-7 -8 -10 0 q3 6 10 0z M0 0 q7 -8 10 0 q-3 6 -10 0z" fill="${c}"/></g>`).join('')}</g>
      ${msPip(20,25,-10,-28)}</svg>`},
  draw(svg,done){const xs=potX(MS.n),cols=['#e2558f','#ff9f43','#7b6cf0','#2f9fe0','#ff6b57'];
    MS.got.forEach((k,i)=>{const g=svg.querySelector(`.mspot[data-i="${i}"] .msplant`);if(!g||g.dataset.k===k)return;g.dataset.k=k;g.innerHTML=k?PLANT[k](cols[i%cols.length]):'';if(k)g.classList.add('msup')});
    svg.querySelector('.msbugs').setAttribute('opacity',done?1:0);svg.querySelector('.mssun').setAttribute('opacity',done?1:.5);
    const nx=MS.got.findIndex(k=>!k);return done?[180,34]:[xs[nx<0?MS.n-1:nx],48]},
  slot:i=>`.mspot[data-i="${i}"]`};
/* ---------- climb ---------- */
const ringP=n=>Array.from({length:n},(_,i)=>{const t=n>1?i/(n-1):0;return [48+t*250,88-t*58]});
MSCENE.climb={
  svg(n){const P=ringP(n);
    return `<svg class="msscene climb" viewBox="0 0 360 112" role="img" aria-label="Pip flies up through cloud rings toward a star">
      <defs><linearGradient id="msUp" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#d9f0ff"/><stop offset="1" stop-color="#7f9cf0"/></linearGradient></defs>
      <rect x="0" y="0" width="360" height="112" rx="14" fill="url(#msUp)"/>
      <g fill="#fff" opacity=".7"><ellipse cx="60" cy="104" rx="60" ry="10"/><ellipse cx="200" cy="108" rx="80" ry="9"/><ellipse cx="330" cy="70" rx="30" ry="6"/></g>
      ${P.map(([x,y],i)=>`<g class="msring" data-i="${i}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><ellipse class="msr" rx="9" ry="14" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="4 3" opacity=".8"/></g>`).join('')}
      <g class="msstar" transform="translate(330 20)" opacity=".45">${AL_STAR.replace('<svg viewBox="0 0 24 24" aria-hidden="true">','<svg x="-12" y="-12" width="24" height="24" viewBox="0 0 24 24">')}</g>
      ${msPip(20,25,-10,-12)}</svg>`},
  draw(svg,done){const P=ringP(MS.n);
    MS.got.forEach((k,i)=>{const r=svg.querySelector(`.msring[data-i="${i}"] .msr`);if(!r)return;r.setAttribute('stroke',k==='gold'?'#ffc23d':k==='ok'?'#2f9fe0':k==='miss'?'#9aa7bd':'#fff');r.setAttribute('stroke-dasharray',k&&k!=='miss'?'none':'4 3');r.setAttribute('stroke-width',k==='gold'?4:3)});
    svg.querySelector('.msstar').setAttribute('opacity',done?1:.45);
    let last=-1;for(let i=0;i<MS.n;i++){if(MS.got[i])last=i;else break}
    return done?[330,34]:last<0?[22,100]:P[last]},
  slot:i=>`.msring[data-i="${i}"]`};
/* ---------- machine ---------- */
const bulbX=n=>Array.from({length:n},(_,i)=>116+i*(128/Math.max(1,n-1)));
MSCENE.machine={
  svg(n){const xs=bulbX(n);
    return `<svg class="msscene machine" viewBox="0 0 360 112" role="img" aria-label="A machine Pip powers up one light at a time">
      <rect x="0" y="0" width="360" height="112" rx="14" fill="#e3ecff"/>
      <path class="msbow" d="M60 112 A120 90 0 0 1 300 112" fill="none" stroke-width="7" stroke="url(#msRb)" opacity="0"/>
      <defs><linearGradient id="msRb" x1="0" x2="1"><stop offset="0" stop-color="#ff6b57"/><stop offset=".35" stop-color="#ffc23d"/><stop offset=".65" stop-color="#38b98a"/><stop offset="1" stop-color="#2f9fe0"/></linearGradient></defs>
      <rect x="100" y="40" width="160" height="62" rx="12" fill="#7c8fb8" stroke="#1f3557" stroke-width="2"/>
      <rect x="236" y="18" width="16" height="24" fill="#5d6f99" stroke="#1f3557" stroke-width="2"/>
      <g class="mspuff" opacity="0"><circle cx="244" cy="12" r="8" fill="#fff"/><circle cx="256" cy="8" r="6" fill="#fff"/></g>
      <g transform="translate(180 82)"><g class="msgear"><circle r="12" fill="#c0c8dc" stroke="#1f3557" stroke-width="1.6"/><circle r="4" fill="#1f3557"/>${[0,45,90,135].map(a=>`<rect x="-2.5" y="-16" width="5" height="32" fill="#c0c8dc" stroke="#1f3557" stroke-width="1.2" transform="rotate(${a})"/>`).join('')}<circle r="10" fill="#c0c8dc"/><circle r="4" fill="#1f3557"/></g></g>
      ${xs.map((x,i)=>`<g class="msbulb" data-i="${i}" transform="translate(${x.toFixed(1)} 56)"><circle class="msglow" r="12" fill="#ffd56b" opacity="0"/><circle class="msb" r="7" fill="#46557f" stroke="#1f3557" stroke-width="1.4"/></g>`).join('')}
      ${msPip(20,25,-10,-26)}</svg>`},
  draw(svg,done){const xs=bulbX(MS.n);
    MS.got.forEach((k,i)=>{const b=svg.querySelector(`.msbulb[data-i="${i}"]`);if(!b)return;b.querySelector('.msb').setAttribute('fill',k==='gold'?'#ffd56b':k==='ok'?'#fff1b8':k==='miss'?'#8b97b8':'#46557f');b.querySelector('.msglow').setAttribute('opacity',k==='gold'?.55:k==='ok'?.3:0)});
    svg.querySelector('.msgear').classList.toggle('spin',MS.got.some(Boolean));svg.querySelector('.msbow').setAttribute('opacity',done?.9:0);svg.querySelector('.mspuff').setAttribute('opacity',done?1:0);
    const nx=MS.got.findIndex(k=>!k);return done?[60,40]:[xs[nx<0?MS.n-1:nx],34]},
  slot:i=>`.msbulb[data-i="${i}"]`};
/* ---------- map ---------- */
MSCENE.map={
  svg(n){const cols=Math.ceil(n/2),W=240/cols,H=40;let tiles='';
    for(let i=0;i<n;i++){const c=i%cols,r=Math.floor(i/cols);tiles+=`<rect class="mstile" data-i="${i}" x="${60+c*W}" y="${18+r*H}" width="${W}" height="${H}" fill="#d9b77a" stroke="#a8844a" stroke-width="1.2"/>`}
    return `<svg class="msscene map" viewBox="0 0 360 112" role="img" aria-label="An old map Pip uncovers piece by piece">
      <rect x="0" y="0" width="360" height="112" rx="14" fill="#8ec5ea"/>
      <rect x="56" y="14" width="248" height="88" rx="6" fill="#f6e7c4" stroke="#a8844a" stroke-width="2"/>
      <g class="mspic">
        <path d="M86 24 l14 6 l6 18 l14 14 l4 18 l10 12 l-12 4 l-14 -10 l-12 -22 l-8 -20z" fill="#cfe7b0" stroke="#7a9a58" stroke-width="1.4"/>
        <path d="M150 74 l12 -20 l12 20z M168 74 l14 -26 l14 26z" fill="#b59a74" stroke="#7a5f3c" stroke-width="1.2"/><path d="M177 52 l5 -4 l5 4z" fill="#fff"/>
        <path d="M206 84 q20 -14 40 0 t40 0" fill="none" stroke="#2f9fe0" stroke-width="3"/>
        <path d="M120 88 C150 70 190 96 222 60 S270 40 280 34" fill="none" stroke="#c0392b" stroke-width="2" stroke-dasharray="5 4"/>
        <g transform="translate(280 34)"><g class="msx"><path d="M-7 -7 L7 7 M7 -7 L-7 7" stroke="#c0392b" stroke-width="4" stroke-linecap="round"/></g></g>
        <g transform="translate(270 82)"><circle r="9" fill="#fff" stroke="#1f3557" stroke-width="1.2"/><path d="M0 -7 L2 0 L0 7 L-2 0z" fill="#e2558f"/><text y="-11" text-anchor="middle" font-size="7" font-weight="800" fill="#1f3557">N</text></g>
      </g>
      <g class="mstiles">${tiles}</g>
      ${msPip(20,25,-10,-28)}</svg>`},
  draw(svg,done){const cols=Math.ceil(MS.n/2),W=240/cols;
    MS.got.forEach((k,i)=>{const t=svg.querySelector(`.mstile[data-i="${i}"]`);if(!t)return;t.setAttribute('opacity',k==='gold'||k==='ok'?0:k==='miss'?.45:1)});
    svg.querySelector('.msx').classList.toggle('pulse',done);
    const nx=MS.got.findIndex(k=>!k),i=nx<0?MS.n-1:nx;return done?[280,30]:[60+(i%cols)*W+W/2,18+Math.floor(i/cols)*40+30]},
  slot:i=>`.mstile[data-i="${i}"]`};
/* ---------- progress ---------- */
function missionDraw(){const box=document.getElementById('mission');if(!box||!MS.on)return;const svg=box.querySelector('svg');if(!svg)return;
  const placed=MS.got.filter(Boolean).length,c=document.getElementById('msCount');if(c)c.textContent=`${placed} / ${MS.n}`;
  const done=placed===MS.n&&box.classList.contains('msdone'),[x,y]=MSCENE[MS.kind].draw(svg,done);
  svg.querySelector('.mspip').style.transform=`translate(${(+x).toFixed(1)}px,${(+y).toFixed(1)}px)`}
/* an answer: 'gold' (first try), 'ok' (second try), 'miss' (shown the answer); 'wobble' for a first wrong try */
function missionAnswer(kind){if(!msOn())return;const i=S.i;if(i<0||i>=MS.n)return;
  if(kind==='wobble'){const box=document.getElementById('mission'),el=box&&box.querySelector(MSCENE[MS.kind].slot(i));
    if(el&&!reduce){el.classList.remove('wob');void el.getBoundingClientRect();el.classList.add('wob')}return}
  MS.got[i]=kind;missionDraw();if(MS.got.every(Boolean))setTimeout(missionFinish,700)}
function missionFinish(){if(!msOn())return;const box=document.getElementById('mission');if(!box||box.classList.contains('msdone'))return;box.classList.add('msdone');missionDraw();
  const M=missionFor(),gold=MS.got.filter(k=>k==='gold').length;
  /* the mission's reward: resources of the island's subject (js/wonders.js) */
  const R=typeof resForMission==='function'?resForMission(S.isl.id,gold,MS.n):null,c=document.getElementById('msCount');
  if(R&&c){c.classList.add('msgot');c.innerHTML=`+${R.a} ${RES_ICON[R.k]}`;c.title=`+${R.a} ${RES[R.k].name}`}
  setTimeout(()=>{if(!msOn())return;const r=box.getBoundingClientRect();if(r.width&&!reduce)burst(r.left+r.width*(MS.kind==='bridge'?.9:.5),r.top+r.height*.4,22);
    if(typeof jingle==='function')jingle('level');say($('#say'),`${M.done} ${gold===MS.n?'<b>All golden!</b> Perfect!':gold>=MS.n-1?'Almost all golden!':'Every round makes it stronger!'}${R?` <b>+${R.a} ${R.a===1?RES[R.k].one:RES[R.k].name}</b> for your Wonders!`:''}`,true)},500)}
