/* Pip's Sky Islands: a sky buddy. After the first mission the child finds a mysterious egg. It hatches after playing on
   5 different days (a week of regular play, not one long session). The baby grows with what the child masters:
   stage 2 after 4 mastered skills, stage 3 after 12 (counted from hatching). It flies next to Pip in missions, lives on
   the island and has a card on the map that shows what it needs next. Nothing is ever lost: no feeding, no sickness,
   no punishment for days off. */
const BUDDY_HATCH=5,BUDDY_STAGE=[0,4,12];
/* sky spirits, not animals: the closet already sells pets that ride in Pip's basket. A buddy cannot be bought, it is
   grown by learning, so it looks like nothing in the shop. Old keys (from the first version) map to the new ones. */
const BUDDIES={
  puff:{name:'Cloud Puff',body:'#ffffff',accent:'#7fc4f5'},
  star:{name:'Star Sprite',body:'#ffd56b',accent:'#ff9f43'},
  wisp:{name:'Rainbow Wisp',body:'#ffb3d1',accent:'#e2558f'},
  moon:{name:'Moon Drop',body:'#fff3c2',accent:'#7b6cf0'}};
const BUDDY_OLD={pup:'puff',kit:'star',dragon:'wisp',owl:'moon'};
const buddyKind=k=>BUDDIES[k]?k:BUDDY_OLD[k]||'puff';
const STK3='stroke="#1f3557" stroke-width="2" stroke-linejoin="round"';
function buddyBody(kind,B){
  if(kind==='puff'){const C=[[-10,4,11],[10,4,11],[0,-6,14],[-17,9,7],[17,9,7]];
    return C.map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#1f3557" stroke="#1f3557" stroke-width="4"/>`).join('')+C.map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${B.body}"/>`).join('')+`<ellipse cx="0" cy="11" rx="14" ry="4" fill="#e3f2ff"/>`}
  if(kind==='star'){const pts=Array.from({length:10},(_,i)=>{const a=-Math.PI/2+i*Math.PI/5,r=i%2?11:24;return `${(r*Math.cos(a)).toFixed(1)},${(r*Math.sin(a)+3).toFixed(1)}`}).join(' ');
    return `<polygon points="${pts}" fill="${B.body}" stroke="#1f3557" stroke-width="2.4" stroke-linejoin="round"/><polygon points="${pts}" fill="#fff3c2" transform="translate(0 1.5) scale(.55)"/>`}
  if(kind==='wisp'){const d=s=>`M0 ${-27*s} C${10*s} ${-13*s} ${18*s} ${-3*s} ${18*s} ${7*s} A${18*s} ${18*s} 0 0 1 ${-18*s} ${7*s} C${-18*s} ${-3*s} ${-10*s} ${-13*s} 0 ${-27*s}Z`;
    return `<path d="${d(1)}" fill="${B.body}" ${STK3}/><path d="${d(.72)}" fill="#ffe08a" transform="translate(0 3)"/><path d="${d(.45)}" fill="#b8f0d2" transform="translate(0 6)"/>`}
  /* moon */
  return `<circle cx="0" cy="2" r="19" fill="${B.body}"/><path d="M6 -16 A19 19 0 0 1 6 20 A26 26 0 0 0 6 -16Z" fill="#ffd56b"/><circle cx="-11" cy="12" r="2.2" fill="#f0dfa0"/><circle cx="-12" cy="-8" r="1.6" fill="#f0dfa0"/><circle cx="0" cy="2" r="19" fill="none" ${STK3}/>`}
/* one spirit drawn around (0,0), about 44 px tall at stage 1. Stage 2: it glows and gets a sparkle ring; stage 3: a crown */
function buddyArt(kind,stage){kind=buddyKind(kind);const B=BUDDIES[kind],s=[0,.8,1,1.18][stage]||1;let o='';
  if(stage>=2)o+=`<circle class="hglow" cx="0" cy="2" r="28" fill="${B.accent}" opacity=".22"/><ellipse cx="0" cy="8" rx="30" ry="8" fill="none" stroke="${B.accent}" stroke-width="2.5" stroke-dasharray="1 6" stroke-linecap="round" opacity=".9"/>`;
  o+=buddyBody(kind,B);
  o+=`<circle cx="-6" cy="-1" r="3" fill="#1f3557"/><circle cx="6" cy="-1" r="3" fill="#1f3557"/><circle cx="-5" cy="-2" r="1" fill="#fff"/><circle cx="7" cy="-2" r="1" fill="#fff"/><path d="M-3 4 q3 3 6 0" fill="none" stroke="#1f3557" stroke-width="1.8" stroke-linecap="round"/><circle cx="-11" cy="4" r="2.6" fill="#ff9fc4" opacity=".7"/><circle cx="11" cy="4" r="2.6" fill="#ff9fc4" opacity=".7"/>`;
  if(stage>=3)o+=`<path d="M-8 -24 L-5 -31 L0 -25 L5 -31 L8 -24Z" fill="#ffc23d" ${STK3} transform="translate(0 ${kind==='star'?3:kind==='wisp'?-1:0})"/>`+[[-26,-20],[26,-14],[-22,18]].map(([x,y])=>`<path d="M${x} ${y-4} l1.2 2.8 3 .4 -2.2 2 .6 3 -2.6 -1.4 -2.6 1.4 .6 -3 -2.2 -2 3 -.4z" fill="#ffc23d" class="hglow"/>`).join('');
  return `<g transform="scale(${s})">${o}</g>`}
const buddySVG=(kind,stage,w=60)=>`<svg viewBox="-40 -44 80 80" width="${w}" height="${w}" aria-hidden="true">${buddyArt(kind,stage)}</svg>`;
function eggArt(p){const cr=Math.min(3,Math.floor(p*4));return `<ellipse cx="0" cy="0" rx="15" ry="19" fill="#fff8e6" ${STK3}/><path d="M-9 -6 q4 -4 8 0 t8 0" fill="none" stroke="#ffc23d" stroke-width="3"/><circle cx="-6" cy="8" r="2.5" fill="#7fc4f5"/><circle cx="6" cy="6" r="2" fill="#ff9fc4"/>`+
  [`<path d="M-4 -18 l3 5 -3 3" fill="none" stroke="#1f3557" stroke-width="1.6"/>`,`<path d="M8 -12 l-3 4 3 4 -3 3" fill="none" stroke="#1f3557" stroke-width="1.6"/>`,`<path d="M-12 2 l4 2 -1 4 4 2" fill="none" stroke="#1f3557" stroke-width="1.6"/>`].slice(0,cr).join('')}
const eggSVG=(p,w=56)=>`<svg viewBox="-24 -26 48 48" width="${w}" height="${w}" aria-hidden="true"><g class="${p>=.8?'eggwob':''}">${eggArt(p)}</g></svg>`;
/* ---------- life of the buddy ---------- */
const buddyStage=()=>{const b=G.buddy;if(!b)return 0;return b.m>=BUDDY_STAGE[2]?3:b.m>=BUDDY_STAGE[1]?2:1};
const buddyName=()=>G.buddy?(G.buddy.name||BUDDIES[buddyKind(G.buddy.kind)].name):'';
function buddyGiveEgg(){if(G.egg||G.buddy)return;G.egg={days:[dayKey()]};save(true);
  setTimeout(()=>toast('You found a mysterious egg!','Play on 5 different days and it will hatch. It is on your map.','#ff9f43'),2600)}
/* a new day of play (a finished round, like the day streak): the egg gets closer to hatching */
function buddyDay(){if(!G.egg)return;const d=dayKey();if(!G.egg.days.includes(d)){G.egg.days=[...G.egg.days,d].slice(-BUDDY_HATCH);save(true)}}
function buddyReady(){return G.egg&&G.egg.days.length>=BUDDY_HATCH}
function buddyHatch(){if(!buddyReady())return;const kinds=Object.keys(BUDDIES),kind=kinds[Math.floor(Math.random()*kinds.length)];
  overlay(`<div class="bhatch">${buddySVG(kind,1,120)}</div><div class="eyebrow">The egg hatched!</div><h2>Meet your ${BUDDIES[kind].name}!</h2>
    <p>A sky spirit! You can't buy one in any shop: it grows when you <b>master skills</b>. It will fly with Pip on every mission.</p>
    <label class="bname">Give it a name<input id="bnIn" maxlength="12" autocomplete="off" placeholder="${BUDDIES[kind].name}"></label>
    <button class="go" type="button" id="bnOk" style="align-self:center">That's its name!</button>`,()=>{
  sWin();setTimeout(()=>{const c=document.querySelector('.bhatch');if(c&&!reduce){const r=c.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,40)}},200);
  $('#bnIn').onkeydown=e=>{if(e.key==='Enter')$('#bnOk').click()};
  $('#bnOk').onclick=()=>{const n=($('#bnIn').value||'').replace(/[<>&"]/g,'').trim().slice(0,12);G.buddy={kind,name:n,m:0,born:dayKey()};delete G.egg;save();closeOverlay();renderBuddyCard();
    const s=document.querySelector('#hsay')||document.querySelector('#say');if(s)say(s,`Welcome, <b>${esc(buddyName())}</b>! Let's fly together!`)}})}
function buddyMastered(){if(!G.buddy)return;const before=buddyStage();G.buddy.m=(G.buddy.m||0)+1;const now=buddyStage();
  if(now>before)setTimeout(()=>toast(`${esc(buddyName())} grew up!`,now===3?'It got a little crown! What a star!':'It started to glow, with a sparkle ring!','#7b6cf0'),2200)}
/* ---------- the map card ---------- */
function renderBuddyCard(){const el=document.getElementById('buddyCard');if(!el)return;
  if(G.buddy){const st=buddyStage(),need=st<3?BUDDY_STAGE[st]-G.buddy.m:0;el.hidden=false;
    el.innerHTML=`<div class="gprev">${buddySVG(G.buddy.kind,st,74)}</div><div class="gtxt"><b>${esc(buddyName())}</b><span>${st<3?`Master <b>${need}</b> more skill${need>1?'s':''} to help it grow`:'Fully grown! Keep it company on your missions.'}</span>${st<3?`<div class="bar warm"><i style="width:${Math.round(100*(G.buddy.m-BUDDY_STAGE[st-1])/(BUDDY_STAGE[st]-BUDDY_STAGE[st-1]))}%"></i></div>`:''}</div>`;return}
  if(G.egg){const n=G.egg.days.length,ready=n>=BUDDY_HATCH;el.hidden=false;
    el.innerHTML=`<div class="gprev">${eggSVG(n/BUDDY_HATCH,70)}</div><div class="gtxt"><b>${ready?'Your egg is hatching!':'A mysterious egg'}</b><span>${ready?'Tap to see who is inside!':G.egg.days.includes(dayKey())?`Played on ${n} of ${BUDDY_HATCH} days. Come back tomorrow!`:`Played on ${n} of ${BUDDY_HATCH} days. Finish a round today to make it ${n+1}!`}</span>${ready?'':`<div class="bar warm"><i style="width:${n/BUDDY_HATCH*100}%"></i></div>`}</div>${ready?'<button type="button" class="go small" id="bHatch">Hatch!</button>':''}`;
    const h=document.getElementById('bHatch');if(h)h.onclick=buddyHatch;return}
  el.hidden=true}
