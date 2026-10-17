/* Pip's Sky Islands: a livelier round. Pip does things, not only says them:
   - a little balloon rides along the progress dots toward a flag, one dot per puzzle
   - a right answer sends a star flying into Pip's basket
   - a streak makes Pip glow (3 in a row), then sparkle while the sun shines brighter (5 in a row)
   - a miss: a small grey cloud drifts over the sun for a moment, then the sky clears again (gentle, never a penalty)
   Everything is decoration: no game rule depends on it, and it stays still for "reduce motion". */
const AL_PIP=`<svg viewBox="0 0 24 30" aria-hidden="true"><path d="M12 1.5a8.5 8.5 0 0 0-8.5 8.6c0 4.6 4.6 8.4 7 10h3c2.4-1.6 7-5.4 7-10A8.5 8.5 0 0 0 12 1.5z" fill="#ff6b57" stroke="#1f3557" stroke-width="1.5"/><path d="M12 1.5c-2.6 2.4-3.6 5.6-3.6 8.6 0 3.6 1.2 7 2.1 10h3c.9-3 2.1-6.4 2.1-10 0-3-1-6.2-3.6-8.6z" fill="#ffc23d"/><path d="M10.5 20.1 9.6 23.4M13.5 20.1l.9 3.3" stroke="#1f3557" stroke-width="1.2"/><rect x="8.4" y="23.2" width="7.2" height="5.3" rx="1.2" fill="#b07a45" stroke="#1f3557" stroke-width="1.4"/></svg>`;
const AL_FLAG=`<svg viewBox="0 0 20 22" aria-hidden="true"><path d="M5 21V2" stroke="#1f3557" stroke-width="2" stroke-linecap="round"/><path d="M5.5 2.5h11l-3 4 3 4h-11z" fill="#38b98a" stroke="#1f3557" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
const AL_STAR=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" fill="#ffc23d" stroke="#1f3557" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
const alOn=()=>S&&!['boss','flash'].includes(S.mode);
/* the balloon on the dots */
function aliveRound(){document.body.classList.remove('al-s3','al-s5');const d=$('#dots');if(!d||!alOn())return;
  d.insertAdjacentHTML('beforeend',`<span class="dotflag" aria-hidden="true">${AL_FLAG}</span><span class="dotpip" aria-hidden="true">${AL_PIP}</span>`);
  const p=d.querySelector('.dotpip');p.style.transition='none';aliveStep(0);void p.offsetWidth;p.style.transition='';aliveEventEnd();aliveEventPlan()}
function aliveStep(i){const d=$('#dots'),p=d&&d.querySelector('.dotpip');if(!p)return;
  const dots=d.querySelectorAll('.dot'),t=i>=dots.length?d.querySelector('.dotflag'):dots[i];if(!t)return;
  p.style.left=(t.offsetLeft+t.offsetWidth/2-p.offsetWidth/2)+'px';p.style.top=(t.offsetTop+t.offsetHeight/2-p.offsetHeight+5)+'px';
  p.classList.toggle('home',i>=dots.length)}
/* a right answer: a star flies from the answer into Pip's basket */
function aliveRight(from,first){if(!alOn())return;aliveStreak();
  const pip=document.querySelector('#pipfly .pipbob');if(!pip||reduce||!from)return;
  const a=from.getBoundingClientRect(),b=pip.getBoundingClientRect();if(!a.width||!b.width)return;
  const s=document.createElement('div');s.className='starfly'+(first?'':' small');s.innerHTML=AL_STAR;document.body.appendChild(s);
  const x0=a.left+a.width/2,y0=a.top+a.height/2,x1=b.left+b.width/2,y1=b.top+b.height*.72,dx=x1-x0,dy=y1-y0,lift=Math.min(140,Math.abs(dx)*.4+60);
  s.style.left=(x0+scrollX)+'px';s.style.top=(y0+scrollY)+'px'; // page coordinates: the star keeps its course if the page scrolls to the explanation
  const an=s.animate([{transform:'translate(-50%,-50%) scale(.5)',opacity:.4},{transform:`translate(calc(${dx*.45}px - 50%),calc(${dy*.45-lift}px - 50%)) scale(1.25)`,opacity:1,offset:.45},{transform:`translate(calc(${dx}px - 50%),calc(${dy}px - 50%)) scale(.45)`,opacity:.95}],{duration:720,easing:'cubic-bezier(.45,.05,.4,1)'});
  an.onfinish=()=>{s.remove();pip.classList.remove('catch');void pip.offsetWidth;pip.classList.add('catch');const r=pip.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)burst(r.left+r.width/2,r.top+r.height*.72,14)}}
/* streak: glow at 3, sparkles and a brighter sun at 5 */
function aliveStreak(){const n=S?S.streak:0;if(typeof musicLayer==='function')musicLayer(n>=5?2:n>=3?1:0);document.body.classList.toggle('al-s3',n>=3&&n<5);document.body.classList.toggle('al-s5',n>=5)}
/* a miss: a small cloud passes over the sun */
function aliveWrong(){if(!alOn())return;aliveStreak();if(reduce)return;const sky=document.querySelector('.sky');if(!sky||sky.querySelector('.alcloud'))return;
  sky.insertAdjacentHTML('beforeend','<div class="alcloud"><i></i><i></i><i></i></div>');const c=sky.querySelector('.alcloud');setTimeout(()=>c.remove(),2800)}
/* ---------- mini-events: sometimes, once in a round, something happens in the sky ----------
   wind: a gust pushes Pip's balloon away; a right first answer catches it (+coins)
   bird: a bird carries a star across the sky; answer before it is gone (+coins)
   bubble: a treasure bubble floats up; tap it before it floats away (+coins, no puzzle needed)
   Only a bonus: a miss or a slow answer costs nothing. Not in tests, lessons, the quick check, bosses or the first rounds. */
const EV_BONUS=10,EV_KINDS=['wind','bird','bubble'];
function aliveEventPlan(){S.ev=null;if(!['island','daily','review'].includes(S.mode)||S.qs.length<5||(G.rounds||0)<2||S.chapter!=null&&S.mode!=='island')return;
  if(Math.random()>=.4)return;S.ev={at:2+Math.floor(Math.random()*Math.min(3,S.qs.length-3)),kind:EV_KINDS[Math.floor(Math.random()*EV_KINDS.length)],on:false,done:false}}
function aliveEventEnd(){document.querySelectorAll('.evbird,.evbubble,.evgust').forEach(e=>e.remove());document.body.classList.remove('ev-wind');if(S&&S.ev){clearTimeout(S.ev.t);S.ev.on=false}}
function evWin(el,msg){if(!S||!S.ev)return;S.ev.done=true;const c=taper(EV_BONUS);gain(c,0,el||$('#prompt'));updateStats("#coinPill");say($('#say'),msg);foxMove('spin');aliveEventEnd()}
function aliveEvent(){if(!S||!S.ev)return;if(S.ev.on&&S.i!==S.ev.at)aliveEventEnd();if(S.i!==S.ev.at||S.ev.done)return;
  const e=S.ev;e.on=true;e.done=true;
  if(e.kind==='wind'){document.body.classList.add('ev-wind');{const f=$('#pipfly');if(f)f.insertAdjacentHTML('beforeend','<i class="evgust" aria-hidden="true"></i>')}e.done=false;say($('#say'),`Whoosh! A <b>gust of wind</b> pushed my balloon away! Get this one right on the first try to catch it!`);return}
  if(e.kind==='bird'){e.done=false;document.body.insertAdjacentHTML('beforeend',`<div class="evbird" aria-hidden="true"><svg viewBox="0 0 64 40"><path d="M6 22 Q18 6 30 20 Q42 6 54 22" fill="none" stroke="#1f3557" stroke-width="4" stroke-linecap="round"/><g transform="translate(22 22)">${AL_STAR.replace('<svg viewBox="0 0 24 24" aria-hidden="true">','<svg width="20" height="20" viewBox="0 0 24 24">')}</g></svg></div>`);
    say($('#say'),`Look, a <b>star bird</b>! Solve this one before it flies away and it drops a bonus!`);e.t=setTimeout(()=>{if(S&&S.ev===e&&!e.done){e.done=true;aliveEventEnd();say($('#say'),`The bird flew off. No worries, it comes back another day!`)}},22000);return}
  if(e.kind==='bubble'){const card=$('#card');document.body.insertAdjacentHTML('beforeend',`<button type="button" class="evbubble" aria-label="Treasure bubble: tap it for bonus coins"><span>${COIN_ICON}</span></button>`);
    const b=document.querySelector('.evbubble'),r=card.getBoundingClientRect();b.style.left=(r.left+14+scrollX)+'px';b.style.top=(r.top+70+scrollY)+'px'; // left side: never over the How? and read-aloud buttons
    say($('#say'),`A <b>treasure bubble</b>! Tap it before it floats away!`);
    b.onclick=()=>{burstAt(b,24);tone([784,1047],.05);evWin(b,`Pop! <b>+${taper(EV_BONUS)} bonus coins</b>! Now, back to the puzzle!`)};
    e.t=setTimeout(()=>{if(document.querySelector('.evbubble'))aliveEventEnd()},6000)}}
/* the answer to the event puzzle */
function aliveEventAnswer(ok,first,el){const e=S&&S.ev;if(!e||!e.on||e.done||S.i!==e.at)return;
  if(e.kind==='wind'){if(ok&&first)evWin(el,`You caught my balloon! <b>+${taper(EV_BONUS)} bonus coins!</b>`);else{e.done=true;setTimeout(()=>{aliveEventEnd();say($('#say'),`Phew, the wind calmed down and my balloon floated back. Keep going!`)},900)}}
  if(e.kind==='bird'){if(ok&&first){evWin(el,`The star bird dropped its star! <b>+${taper(EV_BONUS)} bonus coins!</b>`)}else if(!ok){/* a second try still counts while the bird is here */}else{e.done=true;aliveEventEnd()}}}
