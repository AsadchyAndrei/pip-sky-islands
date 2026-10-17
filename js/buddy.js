/* Pip's Sky Islands: a sky buddy. After the first mission the child finds a mysterious egg. It hatches after playing on
   5 different days (a week of regular play, not one long session). The baby grows with what the child masters:
   stage 2 after 4 mastered skills, stage 3 after 12 (counted from hatching). It flies next to Pip in missions, lives on
   the island and has a card on the map that shows what it needs next. Nothing is ever lost: no feeding, no sickness,
   no punishment for days off. */
const BUDDY_HATCH=5,BUDDY_STAGE=[0,4,12];
const BUDDIES={
  pup:{name:'Cloud Pup',body:'#ffffff',belly:'#e3f2ff',accent:'#7fc4f5',ear:'pup'},
  kit:{name:'Star Kitten',body:'#ffd56b',belly:'#fff3c2',accent:'#ff9f43',ear:'cat'},
  dragon:{name:'Sky Dragon',body:'#8fd18b',belly:'#e3f7d6',accent:'#2e9e5b',ear:'horn'},
  owl:{name:'Moon Owl',body:'#b3a8ff',belly:'#ece8ff',accent:'#6b5bd6',ear:'tuft'}};
const STK3='stroke="#1f3557" stroke-width="2" stroke-linejoin="round"';
/* one creature drawn around (0,0), about 44 px tall at stage 1 */
function buddyArt(kind,stage){const B=BUDDIES[kind]||BUDDIES.pup,s=[0,.8,1,1.18][stage]||1;let o='';
  if(stage>=2)o+=`<path d="M-14 -6 q-18 -12 -22 4 q10 0 18 6z M14 -6 q18 -12 22 4 q-10 0 -18 6z" fill="${B.accent}" ${STK3} class="bwing"/>`;
  const ear={pup:`<ellipse cx="-12" cy="-22" rx="6" ry="9" fill="${B.accent}" ${STK3} transform="rotate(-20 -12 -22)"/><ellipse cx="12" cy="-22" rx="6" ry="9" fill="${B.accent}" ${STK3} transform="rotate(20 12 -22)"/>`,
    cat:`<path d="M-15 -16 L-12 -30 L-4 -20Z M15 -16 L12 -30 L4 -20Z" fill="${B.body}" ${STK3}/>`,
    horn:`<path d="M-8 -20 L-11 -31 L-3 -22Z M8 -20 L11 -31 L3 -22Z" fill="#ffc23d" ${STK3}/>`,
    tuft:`<path d="M-14 -18 L-16 -28 L-7 -21Z M14 -18 L16 -28 L7 -21Z" fill="${B.accent}" ${STK3}/>`}[B.ear];
  o+=ear+`<ellipse cx="0" cy="0" rx="17" ry="18" fill="${B.body}" ${STK3}/><ellipse cx="0" cy="6" rx="10" ry="9" fill="${B.belly}"/>`;
  o+=`<circle cx="-6" cy="-5" r="3" fill="#1f3557"/><circle cx="6" cy="-5" r="3" fill="#1f3557"/><circle cx="-5" cy="-6" r="1" fill="#fff"/><circle cx="7" cy="-6" r="1" fill="#fff"/><path d="M-3 1 q3 3 6 0" fill="none" stroke="#1f3557" stroke-width="1.8" stroke-linecap="round"/><circle cx="-11" cy="1" r="2.6" fill="#ff9fc4" opacity=".7"/><circle cx="11" cy="1" r="2.6" fill="#ff9fc4" opacity=".7"/>`;
  if(kind==='dragon')o+=`<path d="M14 10 q12 4 10 -6" fill="none" stroke="${B.accent}" stroke-width="4" stroke-linecap="round"/>`;
  if(kind==='owl')o+=`<path d="M-2 -1 L0 2 L2 -1Z" fill="#ffc23d"/>`;
  if(stage>=3)o+=`<path d="M-8 -26 L-5 -32 L0 -27 L5 -32 L8 -26Z" fill="#ffc23d" ${STK3}/>`+[[-24,-22],[24,-16],[-20,16]].map(([x,y])=>`<path d="M${x} ${y-4} l1.2 2.8 3 .4 -2.2 2 .6 3 -2.6 -1.4 -2.6 1.4 .6 -3 -2.2 -2 3 -.4z" fill="#ffc23d" class="hglow"/>`).join('');
  return `<g transform="scale(${s})">${o}</g>`}
const buddySVG=(kind,stage,w=60)=>`<svg viewBox="-34 -36 68 64" width="${w}" height="${Math.round(w*64/68)}" aria-hidden="true">${buddyArt(kind,stage)}</svg>`;
function eggArt(p){const cr=Math.min(3,Math.floor(p*4));return `<ellipse cx="0" cy="0" rx="15" ry="19" fill="#fff8e6" ${STK3}/><path d="M-9 -6 q4 -4 8 0 t8 0" fill="none" stroke="#ffc23d" stroke-width="3"/><circle cx="-6" cy="8" r="2.5" fill="#7fc4f5"/><circle cx="6" cy="6" r="2" fill="#ff9fc4"/>`+
  [`<path d="M-4 -18 l3 5 -3 3" fill="none" stroke="#1f3557" stroke-width="1.6"/>`,`<path d="M8 -12 l-3 4 3 4 -3 3" fill="none" stroke="#1f3557" stroke-width="1.6"/>`,`<path d="M-12 2 l4 2 -1 4 4 2" fill="none" stroke="#1f3557" stroke-width="1.6"/>`].slice(0,cr).join('')}
const eggSVG=(p,w=56)=>`<svg viewBox="-24 -26 48 48" width="${w}" height="${w}" aria-hidden="true"><g class="${p>=.8?'eggwob':''}">${eggArt(p)}</g></svg>`;
/* ---------- life of the buddy ---------- */
const buddyStage=()=>{const b=G.buddy;if(!b)return 0;return b.m>=BUDDY_STAGE[2]?3:b.m>=BUDDY_STAGE[1]?2:1};
const buddyName=()=>G.buddy?(G.buddy.name||BUDDIES[G.buddy.kind].name):'';
function buddyGiveEgg(){if(G.egg||G.buddy)return;G.egg={days:[dayKey()]};save(true);
  setTimeout(()=>toast('You found a mysterious egg!','Play on 5 different days and it will hatch. It is on your map.','#ff9f43'),2600)}
/* a new day of play: the egg gets closer to hatching */
function buddyDay(){if(!G.egg)return;const d=dayKey();if(!G.egg.days.includes(d)){G.egg.days=[...G.egg.days,d].slice(-BUDDY_HATCH);save(true)}}
function buddyReady(){return G.egg&&G.egg.days.length>=BUDDY_HATCH}
function buddyHatch(){if(!buddyReady())return;const kinds=Object.keys(BUDDIES),kind=kinds[Math.floor(Math.random()*kinds.length)];
  overlay(`<div class="bhatch">${buddySVG(kind,1,120)}</div><div class="eyebrow">The egg hatched!</div><h2>Meet your ${BUDDIES[kind].name}!</h2>
    <p>It will fly with Pip on every mission. It grows when you <b>master skills</b>.</p>
    <label class="bname">Give it a name<input id="bnIn" maxlength="12" autocomplete="off" placeholder="${BUDDIES[kind].name}"></label>
    <button class="go" type="button" id="bnOk" style="align-self:center">That's its name!</button>`,()=>{
  sWin();setTimeout(()=>{const c=document.querySelector('.bhatch');if(c&&!reduce){const r=c.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,40)}},200);
  $('#bnIn').onkeydown=e=>{if(e.key==='Enter')$('#bnOk').click()};
  $('#bnOk').onclick=()=>{const n=($('#bnIn').value||'').replace(/[<>&"]/g,'').trim().slice(0,12);G.buddy={kind,name:n,m:0,born:dayKey()};delete G.egg;save();closeOverlay();renderBuddyCard();
    const s=document.querySelector('#hsay')||document.querySelector('#say');if(s)say(s,`Welcome, <b>${esc(buddyName())}</b>! Let's fly together!`)}})}
function buddyMastered(){if(!G.buddy)return;const before=buddyStage();G.buddy.m=(G.buddy.m||0)+1;const now=buddyStage();
  if(now>before)setTimeout(()=>toast(`${esc(buddyName())} grew up!`,now===3?'It got a little crown! What a star!':'It grew wings! Now it can really fly!','#7b6cf0'),2200)}
/* ---------- the map card ---------- */
function renderBuddyCard(){const el=document.getElementById('buddyCard');if(!el)return;
  if(G.buddy){const st=buddyStage(),need=st<3?BUDDY_STAGE[st]-G.buddy.m:0;el.hidden=false;
    el.innerHTML=`<div class="gprev">${buddySVG(G.buddy.kind,st,74)}</div><div class="gtxt"><b>${esc(buddyName())}</b><span>${st<3?`Master <b>${need}</b> more skill${need>1?'s':''} to help it grow`:'Fully grown! Keep it company on your missions.'}</span>${st<3?`<div class="bar warm"><i style="width:${Math.round(100*(G.buddy.m-BUDDY_STAGE[st-1])/(BUDDY_STAGE[st]-BUDDY_STAGE[st-1]))}%"></i></div>`:''}</div>`;return}
  if(G.egg){const n=G.egg.days.length,ready=n>=BUDDY_HATCH;el.hidden=false;
    el.innerHTML=`<div class="gprev">${eggSVG(n/BUDDY_HATCH,70)}</div><div class="gtxt"><b>${ready?'Your egg is hatching!':'A mysterious egg'}</b><span>${ready?'Tap to see who is inside!':`Played on ${n} of ${BUDDY_HATCH} days. Come back tomorrow!`}</span>${ready?'':`<div class="bar warm"><i style="width:${n/BUDDY_HATCH*100}%"></i></div>`}</div>${ready?'<button type="button" class="go small" id="bHatch">Hatch!</button>':''}`;
    const h=document.getElementById('bHatch');if(h)h.onclick=buddyHatch;return}
  el.hidden=true}
