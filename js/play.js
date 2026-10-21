/* Pip's Sky Islands: Screens and the question player, including drag and drop, Part A/B, Yes/No and math reasoning. Loaded in order by index.html; all files share one global scope. */
/* ================= screens ================= */
let S=null,tipTimer=0,tips=[],tipI=0;
const SCREENS=['gate','kids','map','play','done','closet','albumS','story','parent','home','inside','teach'];
let curScreen='';
function show(id){if(id!=='play'&&typeof aliveEventEnd==='function')aliveEventEnd();if(id!=='play'){document.body.classList.remove('has-mission');if(typeof MS!=='undefined')MS.on=false}curScreen=id;
  if(typeof musicTheme==='function'&&id!=='done')musicTheme(id==='play'?(S&&S.mode==='boss'?'boss':'play'):id==='story'?'story':['home','closet','albumS','inside'].includes(id)?'home':'map');document.body.classList.toggle('nogame',id==='gate'||id==='kids'||id==='teach');document.body.classList.toggle('ongate',id==='gate');SCREENS.forEach(s=>$('#'+s).hidden=s!==id);document.body.dataset.screen=id;scrollTo({top:0});if(id!=='map')clearInterval(tipTimer);if(id!=='play')stopSpeak()}
let EXPLORE=new Set();
function pickExplore(){EXPLORE=new Set();for(const g of ['math','world'])ISLANDS.filter(i=>i.group===g&&i.gen&&!i.retired&&!G.visited[i.id]).slice(0,2).forEach(i=>EXPLORE.add(i.id))}
function card(isl,i){
  if(unlockOf(isl.id)&&!isOpen(isl.id))return teaserCard(isl,i);
  const b=starFor(isl.id);let status='',cls=unlockFresh.has(isl.id)?' fresh':'',rib='';
  if(isl.special==='daily'){status=dailyDone()?`<span class="status ok">Done today! Back tomorrow</span>`:`<span class="status go">+${REW.daily} coins</span>`;if(!dailyDone())rib='<span class="ribbon">NEW!</span>'}
  else if(isl.special==='review'){const due=reviewDue().length,all=G.review.length;
    status=due?`<span class="status go">${due} puzzle${due>1?'s':''} to fix</span>`:all?`<span class="status lock">${all} coming back later</span>`:`<span class="status ok">No mistakes to fix!</span>`;if(due)rib=`<span class="ribbon blue">${due}</span>`}
  else if(isl.special==='ptest'){const L=G.tests||[];status=L.length?`<span class="status ok">Last: ${L[0].s} of ${L[0].n}</span>`:`<span class="status go">Math or English</span>`;if(!L.length)rib='<span class="ribbon">NEW!</span>'}
  else if(isl.special==='boss'&&starTotal()<BOSS_NEED){cls=' locked';status=`<span class="status lock">Locked: ${starTotal()}/${BOSS_NEED} stars</span>`}
  else{status=`<span class="stars">${[0,1,2].map(k=>starSVG(k<b)).join('')}${G.hardMaster[isl.id]?CROWN_MINI:''}</span>`;
    if(isl.gen&&!isl.noDiff&&diffFor(isl)!==2)status+=`<span class="diff d${diffFor(isl)}">${DIFF_NAME[diffFor(isl)]}</span>`;
    if(isl.gen&&typeof resShown==='function'&&resShown()){const k=resOf(isl.id),t=resTired(isl.id);status+=`<span class="isres${t?' tired':''}" title="${t?`Tired today: fewer ${RES[k].name}`:`Missions here give ${RES[k].name}`}">${RES_ICON[k]}<span>${t?'tired':RES[k].name}</span></span>`}}
  if(isl.gen&&!G.visited[isl.id]&&EXPLORE.has(isl.id))rib='<span class="ribbon blue">Explore!</span>';
  else if(isl.gen){const pk=pickToday();if(pk&&pk.id===isl.id)rib='<span class="ribbon">×2 coins</span>'}
  return `<button class="isle${cls}" type="button" data-id="${isl.id}" style="--d:${-(i%7)*0.6}s" aria-label="${isl.name}: ${isl.topic}">${rib}
    ${islandSVG(isl.color,LANDMARKS[isl.lm])}<span class="plaque"><b>${isl.name}</b><small>${isl.topic}</small>${status}${isl.gen&&!isl.special?skillBar(isl.id):''}</span></button>`;
}
function weekCard(){const tw=thisWeek(),lw=G.weeks[lastWeekKey()];
  const target=lw&&lw.c>0?lw.c:0;
  renderPickCard();renderGoalCard();if(typeof renderBuddyCard==='function')renderBuddyCard();if(typeof renderFGoal==="function")renderFGoal();
  $('#weekCard').innerHTML=target?`<b>Weekly Challenge</b><span class="wtext">This week: <b>${tw.c}</b> right answers. Last week: <b>${target}</b>. ${tw.c>target?'You beat it! Amazing!':`Beat it for <b>+${REW.week} coins</b>!`}</span><div class="bar warm"><i style="width:${Math.min(100,tw.c/(target+1)*100)}%"></i></div>`
    :`<b>Weekly Challenge</b><span class="wtext">This week: <b>${tw.c}</b> right answers on the first try. Next week, try to beat this number for <b>+${REW.week} coins</b>!</span>`;
}
function buildTips(){
  const t=[],st=starTotal(),lv=levelOf(G.xp),n=G.name?`${esc(G.name)}, `:'';
  if(!playedToday()&&curStreak()>0)t.push({text:`${n}your <b>${curStreak()}-day streak</b> is on the line! Finish one round today to keep it going. The <b>Daily Challenge</b> gives <b>+${REW.daily} bonus coins</b>!`,label:'Play the Daily Challenge',act:()=>start(byId('daily'))});
  else if(!dailyDone())t.push({text:`Today's <b>Daily Challenge</b> is ready! Finish it for <b>+${REW.daily} bonus coins</b>.${curStreak()?'':' Finish any round today to start a day streak!'}`});
  if(CUR_EV){const st=evState(CUR_EV),nx=EV_MILES.find(m=>st.pts<m[0]);t.push({text:`The <b>${CUR_EV.name}</b> is on until ${evEnd(CUR_EV)}!${nx?` Only <b>${nx[0]-st.pts} more points</b> to the next prize!`:' You won every prize. WOW!'}`,label:`Play ${CUR_EV.island}`,act:()=>start(eventIsland())})}
  if(!G.home||homeBuilt()<homeTotal())t.push({text:homeCount()?`Let's keep building <b>our island</b>! What should we add next?`:`Did you know we can build <b>our own island</b>? Let's start with a cozy tent!`,label:'Go to My Island',act:openHome});
  const due=reviewDue().length;if(due)t.push({text:`${n}<b>${due} old mistake${due>1?'s are':' is'}</b> waiting at Fix-It Falls. Fixing them makes your brain super strong!`,label:'Go to Fix-It Falls',act:()=>start(byId('review'))});
  const ch=CHAPTERS[G.story.ch];if(ch&&!chapterWaiting(G.story.ch))t.push({text:(ch.book||1)>=2?`Story time! ${BOOKS[ch.book].title} needs ${BOOKS[ch.book].unit} <b>${G.story.ch-BOOKS[ch.book].start+1}</b>: "${ch.name}". Will you help me?`:`Story time! We still need to find <b>map piece ${G.story.ch+1}</b>: "${ch.name}". Will you help me?`,label:'Open Story Mode',act:openStory});
  {const L=G.writing||[];if(!L.length||Date.now()-L[0].ts>5*864e5)t.push({text:`${n}want to write your <b>own story</b>? The <b>Writing Desk</b> helps you, and saves it for your grown-ups to read!`,label:'Open Writing Desk',act:()=>openDesk()})}
  const unv=STAR_ISLANDS.filter(i=>i.gen&&!G.visited[i.id]);
  if(unv.length){const i=pick(unv);t.push({text:`Psst... I've never been to <b>${i.name}</b>! Want to explore it with me?`,label:`Fly to ${i.name}`,act:()=>start(i)})}
  const almost=STAR_ISLANDS.filter(i=>i.gen&&starFor(i.id)>0&&starFor(i.id)<3);
  if(almost.length){const i=pick(almost);t.push({text:`<b>${i.name}</b> has only ${starFor(i.id)} star${starFor(i.id)>1?'s':''}. I bet you can get all 3!`,label:'Try for 3 stars',act:()=>start(i)})}
  const cheap=[...Object.entries(BASKETS).filter(([k])=>!G.baskets.includes(k)),...Object.entries(CHARS).filter(([k])=>!G.chars.includes(k)),...Object.entries(PETS).filter(([k])=>!G.pets.includes(k)),...Object.entries(HATS).filter(([k])=>!G.hats.includes(k)),...Object.entries(BALLOONS).filter(([k])=>!G.balloons.includes(k)),...Object.entries(GLASSES).filter(([k])=>!G.glasses.includes(k)),...Object.entries(DECOS).filter(([k])=>!G.decos.includes(k))].filter(([,v])=>!v.ev&&!v.reward&&!v.mast).sort((a,b)=>a[1].price-b[1].price)[0];
  if(cheap){if(G.coins>=cheap[1].price)t.push({text:`You have <b>${fmt(G.coins)} coins</b>! Can I please get the <b>${cheap[1].name}</b>? Pretty please?`,label:"Open Pip's Closet",act:openCloset});
    else t.push({text:`Only <b>${cheap[1].price-G.coins} more coins</b> until you can buy me the <b>${cheap[1].name}</b>!`})}
  const owned=Object.keys(G.stickers).length;if(owned<STK.length)t.push({text:`You have <b>${owned} of ${STK.length}</b> stickers. Finish islands to find more. Some are super rare and GOLDEN!`,label:'See my album',act:openAlbum});
  if(st<BOSS_NEED)t.push({text:`Collect <b>${BOSS_NEED-st} more stars</b> to unlock Boss Island and battle the Grumble Cloud!`});
  else if(!G.badges.includes('boss'))t.push({text:`Boss Island is open! The <b>Grumble Cloud</b> is waiting. Are you brave enough?`,label:'Battle the boss!',act:()=>start(byId('boss'))});
  if(LV[lv+1])t.push({text:`Only <b>${LV[lv+1]-G.xp} XP</b> until you become a <b>${TITLES[lv+1]}</b>! Every right answer gives XP.`});
  t.push({text:`Can you beat your Thunder Tower record of <b>${G.bestThunder}</b>? Let's make it rain answers!`,label:'Go to Thunder Tower',act:()=>start(byId('flash'))});
  return t;
}
/* Pip's map bubble keeps one height (the tallest of his lines), so the page below never jumps when he says something new */
function lockBubble(){const box=$('#mapsay');if(!box||$('#map').hidden)return;const w=box.getBoundingClientRect().width;if(!w)return;
  const c=box.cloneNode(true);c.removeAttribute('id');c.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));
  Object.assign(c.style,{position:'absolute',visibility:'hidden',left:'0',top:'0',width:w+'px',minHeight:'0',animation:'none',pointerEvents:'none'});box.parentNode.appendChild(c);
  const t=c.querySelector('span'),b=c.querySelector('button');let max=0;
  const cand=[[$('#maptext').innerHTML,!$('#mapact').hidden,$('#mapact').textContent],...tips.map(x=>[x.text,!!x.act,x.label||''])];
  for(const [h,btn,lab] of cand){t.innerHTML=h;b.hidden=!btn;b.textContent=lab;max=Math.max(max,c.getBoundingClientRect().height)}
  c.remove();box.style.minHeight=Math.ceil(max)+'px'}
addEventListener('resize',()=>{clearTimeout(lockBubble.t);lockBubble.t=setTimeout(lockBubble,150)});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>lockBubble());
function showTip(){const tp=tips[tipI%tips.length];tipI++;say($('#maptext'),tp.text,true);const b=$('#mapact');if(tp.act){b.hidden=false;b.textContent=tp.label;b.onclick=()=>{tone([523,784]);tp.act()}}else b.hidden=true}
function checkChest(){const c=G.chest;if(!c||!c.from||c.from>=dayKey()||c.from<=(G.chestOpened||''))return;G.chestOpened=c.from;G.coins+=REW.chest;save();
  overlay(`<div class="pipbob" data-fox></div><div class="eyebrow">Welcome back${nm()}!</div><h2>Your surprise chest</h2><svg viewBox="0 0 120 90" style="width:150px;align-self:center" aria-hidden="true"><rect x="14" y="40" width="92" height="44" rx="6" fill="#b5773f" stroke="#8c5a2c" stroke-width="3"/><path d="M14 44 Q14 14 60 14 Q106 14 106 44Z" fill="#c98a4c" stroke="#8c5a2c" stroke-width="3"/><rect x="52" y="36" width="16" height="18" rx="3" fill="#ffc23d" stroke="#e09a14" stroke-width="2"/><g fill="#ffd56b"><circle cx="34" cy="10" r="4"/><circle cx="86" cy="8" r="3"/><circle cx="60" cy="4" r="3"/></g></svg><p>You reached your goal yesterday and took a break. That's how brains grow! <b>+${REW.chest} coins</b>.</p><button class="go" type="button" style="align-self:center" onclick="closeOverlay()">Yay!</button>`,()=>{updateStats('#coinPill');sWin();burst(innerWidth/2,innerHeight/3,100)})}
let mapTab=(()=>{try{const t=localStorage.getItem('pip-tab');return t==='world'?'world':'math'}catch(e){return 'math'}})();
/* switching tabs must not make the page jump: a spacer under the map holds only the room the current scroll needs, and shrinks away as you scroll up */
function fitSpacer(y=scrollY){const sp=$('#mapSpacer');if(!sp)return;const H=document.scrollingElement.scrollHeight-sp.offsetHeight;const need=Math.max(0,Math.ceil(y+innerHeight-H));sp.style.height=need?need+'px':''}
addEventListener('scroll',()=>{const sp=$('#mapSpacer');if(sp&&sp.offsetHeight)fitSpacer()},{passive:true});
function setTab(t){const y=scrollY,sp=$('#mapSpacer');if(sp)sp.style.height=(y+innerHeight)+'px';mapTab=t;try{localStorage.setItem('pip-tab',t)}catch(e){}document.querySelectorAll('.itabs [data-tab]').forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===t));document.querySelectorAll('.tabp').forEach(p=>{p.hidden=p.dataset.tabp!==t});fitSpacer(y)}
document.querySelectorAll('.itabs [data-tab]').forEach(b=>b.onclick=()=>{setTab(b.dataset.tab);tone([523,659],.04)});
function renderMap(){setTimeout(homeLayout,0);setTimeout(()=>{if(typeof tourHook==='function'&&curScreen==='map')tourHook('map')},0);{const f=$('#mapFoot');if(f)f.textContent=`${PACK.stateName}, ${GRADE_WORD(PACK.grade).toLowerCase()}: `+ISLANDS.filter(i=>i.gen&&!i.retired).map(i=>i.topic.toLowerCase()).join(', ')+'.';if(typeof visitDoorsHTML==='function'){const d=visitDoorsHTML();if(d){f.insertAdjacentHTML('beforeend',' '+d);bindVisitDoors(f)}}}if(typeof renderVisitBar==='function')renderVisitBar();{const sp=$('#mapSpacer');if(sp)sp.style.height=''}
  if(!ROOT.current||!ROOT.profiles[ROOT.current])return openKids();
  adoptRemote();stopTimers();setTab(mapTab);updateStats();refreshFoxes();weekCard();renderClassCard();if(G.cls)classCheck();setTimeout(maybeYearOffer,700);CUR_EV=activeEvent();renderEventCard();grantMastery(true);checkChest();
  unlockCheck();unlockNav();pickExplore();const groups={ch:'#g-ch',math:'#g-math',time:'#g-time',world:'#g-world'};
  for(const [g,sel] of Object.entries(groups))$(sel).innerHTML=ISLANDS.map((isl,i)=>isl.group===g&&!isl.retired?card(isl,i):'').join('');
  $('#storySub').textContent=G.story.ch>=CHAPTERS.length?'All 3 books done! Replay any boss':`Chapter ${G.story.ch+1}: ${CHAPTERS[G.story.ch].name}${chapterWaiting(G.story.ch)?' (soon)':''}`;
  $('#albumSub').textContent=`${Object.keys(G.stickers).length} of ${STK.length} stickers`;
  document.querySelectorAll('.isle').forEach(b=>b.onclick=()=>{if(b.dataset.teaser)return teaserTap(b.dataset.id);const isl=byId(b.dataset.id);
    if(isl.special==='boss'&&starTotal()<BOSS_NEED){say($('#maptext'),`Boss Island is locked! Collect <b>${BOSS_NEED-starTotal()} more stars</b> first. You can do it!`);$('#mapact').hidden=true;foxMove('wobble');sNo();scrollTo({top:0,behavior:'smooth'});return}
    tone([523,784]);isl.gen&&!isl.special?openIsland(isl):start(isl)});
  show('map');
  tips=buildTips();tipI=0;
  /* a brand-new player sees one thing to do: the quick check (the day's plan, events and projects appear after it) */
  const newbie=!G.placed&&G.xp===0;document.body.classList.toggle('newbie',newbie);
  if(G.greeted!==dayKey()||newbie){G.greeted=dayKey();save(true);
    say($('#maptext'),G.xp===0?`Hi${nm()}! I'm <b>Pip</b>, a balloon-flying ${heroName()}! Solve puzzles on the islands to earn <b>stars, coins and stickers</b>. ${G.placed?'Want to start with Story Mode?':'First, a <b>quick 2-minute check</b> so I can pick puzzles that fit you just right!'}`:`Welcome back${nm()}! I missed you! ${!dailyDone()?'A brand new <b>Daily Challenge</b> is waiting!':''}`);
    if(typeof autoSay==='function')autoSay($('#maptext').innerHTML,false);
    const b=$('#mapact');if(G.xp===0){b.hidden=false;if(G.placed){b.textContent='Start Story Mode';b.onclick=openStory}else{b.textContent='Quick check';b.onclick=startPlacement}}else b.hidden=true}
  else showTip();
  lockBubble();unlockCelebrate();setTimeout(()=>{if(typeof chIncoming!=='function')return;if(ovOpen)setTimeout(chIncoming,4500);else chIncoming()},2400);
  setTimeout(()=>foxClass('waving',2000),300);
  clearInterval(tipTimer);if(!newbie)tipTimer=setInterval(()=>{if(!$('#map').hidden&&$('#overlay').hidden){showTip();if(rand()<.5)foxClass('waving',1800);else foxMove('hop')}},10000);
}

/* ================= play ================= */
const YES=['Woo-hoo! Nailed it!','Math magic!','Super sharp thinking!','Balloon power: UP!','You make it look easy!','High paw!','Brain power level: HUGE!','That was awesome!','Yes, yes, YES!','You\'re a genius!','Spot on!','I\'m so proud of you!','Boom! Correct!','You\'re a superstar!'];
const SECOND=['You got it on the second try. That\'s grit!','Never give up! Great fix!','See? Mistakes help us learn!','Way to bounce back!'];
const TRY=['Hmm, not quite. Peek at the hint!','Close! Give it one more try.','Tricky one. Read the hint!','Oops! Let\'s try again together.','Almost! Check the hint and go again.'];
const NUDGE=['Take your time! Read the question one more time.','Stuck? Cross out the answers that can\'t be right.','You can do it! Think it through step by step.','Hmm, what do you notice first?','Tap the speaker to hear the question!'];
const COMBO_MSG={3:'3 in a row! Combo bonus coins!',5:'5 in a row! You\'re on fire!',7:'7 in a row! Unstoppable!',10:'10 in a row!! LEGENDARY!',15:'15 in a row! Are you a robot?!'};
function setAlt(n){$('#pipfly').style.transform=`translateY(${-Math.min(n,8)*9}px)`}
/* deal question types like a deck of cards: no repeats until every type of an island was shown */
function dealTypes(key,total,k){G.deck=Object.assign({},G.deck||{});let d=(G.deck[key]||[]).filter(x=>x<total);const out=[];
  while(out.length<k){if(!d.length){d=shuffle([...Array(total).keys()]).filter(x=>!out.includes(x));if(!d.length)d=shuffle([...Array(total).keys()])}out.push(d.shift())}
  G.deck[key]=d;return out}
function start(isl,opts={}){
  if(limitGate(()=>start(isl,opts)))return;
  if(isl.special==='ptest')return openTest(isl);
  if(isl.special==='lesson')return startLesson(isl.lesson);
  if(isl.special==='placement')return startPlacement();
  if(isl.gen&&!isl.special&&!opts.noOffer&&lessonOfferNeeded(isl))return offerLesson(isl,()=>start(isl,{noOffer:true}));
  if(isl.special==='boss')return startBoss(isl,opts);
  if(isl.special==='daily'){const keep=rand;rand=seeded(+dayKey().replace(/-/g,''));const qs=Array.from({length:8},()=>mixedQ());rand=keep;
    /* 3 old mistakes that are due come back inside the daily challenge, so spaced practice happens every day */
    if(!dailyDone())shuffle(reviewDue().filter(r=>byId(r.i))).slice(0,5).forEach((r,i)=>{const isl2=byId(r.i);const q=makeQ(isl2,r.t,r.s,r.d);q.from=isl2.name;q.rv=1;qs[[1,3,4,6,7][i]]=q});
    return beginRound(isl,'daily',qs)}
  if(isl.special==='review'){const due=reviewDue();
    if(!due.length){const all=G.review.length;say($('#maptext'),all?`Nothing to fix today! <b>${all} puzzle${all>1?'s':''}</b> will come back on another day, so your brain can practice remembering.`:`No mistakes to fix. Wow! When you miss a puzzle, it comes here so you can try it again later.`);$('#mapact').hidden=true;show('map');scrollTo({top:0,behavior:'smooth'});foxMove('hop');return}
    const qs=shuffle(due.slice()).slice(0,8).map(r=>{const isl2=byId(r.i);const q=makeQ(isl2,r.t,r.s,r.d);q.from=isl2.name;return q});
    return beginRound(isl,'review',qs)}
  if(isl.flash)return startFlash(isl);
  if(isl.round)return beginRound(isl,'island',isl.round(isl));
  const order=isl.types>6?dealTypes(isl.id,isl.types,6):shuffle([...Array(isl.types).keys()]),d=diffFor(isl);
  const qs=Array.from({length:6},(_,i)=>makeQ(isl,order[i%order.length],R(1,2e9),d));
  /* one old mistake that is due rides along in every normal round, so the mistake list keeps shrinking */
  const due=isl.id==='ev'?[]:reviewDue().filter(r=>byId(r.i));if(due.length){const r=pick(due),i2=byId(r.i),q=makeQ(i2,r.t,r.s,r.d);q.rv=1;if(i2.id!==isl.id)q.from=i2.name;qs[2]=q}
  beginRound(isl,'island',qs);
}
function freshState(isl,mode){return {isl,mode,qs:[],i:0,score:0,tries:0,streak:0,bestStreak:0,coins:0,xp:0,locked:false,badges:[],lvNow:levelOf(G.xp),lv0:levelOf(G.xp)}}
function beginRound(isl,mode,qs){if(typeof stat==='function'){statDay();stat('rounds')}if(typeof buddyDay==='function')buddyDay();
  stopTimers();S=freshState(isl,mode);S.qs=qs;S.d=diffFor(isl);
  {const nm=$('#iname');nm.textContent=isl.name;if(mode==='island'){const d=document.createElement('span');d.className='idiff';d.textContent=` · ${DIFF_NAME[S.d]}`;nm.appendChild(d)}}$('#timer').hidden=true;$('#bossbar').hidden=true;$('#dots').hidden=false;$('#combo').hidden=true;
  $('#dots').innerHTML=qs.map(()=>'<span class="dot"></span>').join('');setAlt(0);
  show('play');refreshFoxes();aliveRound();if(typeof missionRound==='function')missionRound();
  say($('#say'),mode==='daily'?`Daily Challenge! 8 surprise puzzles from all over the sky. Let's go${nm()}!`:mode==='review'?`Fix-It Falls! These are puzzles that tricked you before. Let's beat them this time!`
    :pick([`Welcome to ${isl.name}! Let's go${nm()}!`,`Buckle up! ${isl.name}, here we come!`,`6 puzzles on ${isl.name}. You've got this!`,`Ready, set, THINK!`]));
  foxClass('waving',1500);showQ();
}
function stopTimers(){if(S){clearInterval(S.timer);clearTimeout(S.nudge)}}
function armNudge(){clearTimeout(S.nudge);S.nudge=setTimeout(()=>{if(!S.locked&&!$('#play').hidden){say($('#say'),pick(NUDGE));foxClass('waving',1500)}},25000)}
function label(c,unit){const m=/^(\d+)\/(\d+)$/.exec(c);return m?frac(m[1],m[2]):c+(unit?` <small>${unit}</small>`:'')}
function drawChoices(q,handler){
  const box=$('#choices');box.className='choices'+(q.teach?' one':q.long?' long':(q.choices.length===3?' three':''));box.innerHTML='';
  q.choices.forEach((c,k)=>{const b=document.createElement('button');b.type='button';b.className='choice';b.id='ch'+k;b.dataset.v=c;
    if(q.clockChoices){b.classList.add('clockc');b.setAttribute('aria-label','Clock choice '+(k+1));b.innerHTML=clockSVG(...c.split(':').map(Number),140)}
    else if(q.render){b.innerHTML=q.render(c);b.setAttribute('aria-label',c)}
    else b.innerHTML=label(c,q.unit);
    b.style.setProperty('--c','var(--ans)');b.onclick=()=>handler(b);box.appendChild(b)});
}
function showQ(){
  document.querySelectorAll('.dghost').forEach(g=>g.remove());
  const q=S.qs[S.i];S.tries=0;S.locked=false;
  const c=$('#card');c.classList.remove('enter');void c.offsetWidth;c.classList.add('enter');
  if(S.mode==='boss')$('#qnum').textContent=`Attack ${S.i+1}${q.from?` · from ${q.from}`:''}`;
  else{$('#qnum').textContent=`Puzzle ${S.i+1} of ${S.qs.length}${q.from?` · from ${q.from}`:''}${q.rv?' · fix an old mistake!':''}${q.eased?' · a bit easier':''}`;if(q.rv)say($('#say'),`This one tricked you before. Let's <b>fix it</b> for good!`);document.querySelectorAll('.dot').forEach((d,k)=>d.classList.toggle('now',k===S.i));aliveStep(S.i);aliveEvent()}
  $('#prompt').innerHTML=q.prompt;$('#card').classList.toggle('reading',!!q.wide);if(typeof autoSay==='function')autoSay(q.speak||q.prompt);{const nx=S.qs[S.i+1];if(nx&&typeof pvPrefetch==='function')setTimeout(()=>pvPrefetch(nx.speak||nx.prompt),1500)}
  if(S.mode==='lesson'&&S.i>0){const pv=S.qs[S.i-1];if(q.guided&&!pv.guided)say($('#say'),`Now let's do one <b>together</b>, step by step!`);else if(!q.teach&&!q.guided&&(pv.guided||pv.teach))say($('#say'),`Your turn! Try these <b>on your own</b>. Use the trick!`)}
  $('#visual').innerHTML=q.visual||'';$('#visual').hidden=!q.visual;if(q.listen)wireListen();$('#card').classList.toggle('lp',!!q.longp);
  $('#hint').hidden=$('#feedback').hidden=$('#next').hidden=true;
  $('#speakBtn').hidden=!canTalk();
  $('#howBtn').hidden=S.mode==='boss'||S.mode==='test'||!(q.how||q.hint);
  if(typeof esShowQ==='function')esShowQ(q);
  armNudge();
  if(S.i===0&&S.mode==='island'&&typeof tourHook==='function')tourHook('play');
  if(q.kind==='setclock')return setupClock(q);
  if(q.kind==='order')return setupOrder(q);
  if(q.kind==='angle')return setupAngle(q);
  if(q.kind==='multi')return setupMulti(q);
  if(q.kind==='sort')return setupSort(q);
  if(q.kind==='partab')return setupPartAB(q);
  if(q.kind==='hilite')return setupHilite(q);
  if(q.kind==='yesno')return setupYesNo(q);
  if(q.kind==='rank')return setupRank(q);
  if(q.kind==='money')return setupMoney(q);
  if(q.kind==='numline')return setupNumline(q);
  if(q.kind==='shade')return setupShade(q);
  if(keypadFor(q)){q.kind='keypad';return setupKeypad(q)}
  drawChoices(q,choose);
}
$('#howBtn').onclick=()=>{bump('w');openHow()};
$('#esBtn').onclick=()=>esOpen();
document.addEventListener('keydown',e=>{if(curScreen!=='play'||ovOpen||!S||S.mode==='flash'||e.ctrlKey||e.metaKey||e.altKey)return;const tg=e.target;if(tg&&/INPUT|TEXTAREA|SELECT/.test(tg.tagName))return;
  if(/^[1-4]$/.test(e.key)&&!S.locked){const q=S.qs[S.i];if(q&&!q.kind){const b=$('#ch'+(+e.key-1));if(b&&!b.disabled){e.preventDefault();b.click()}}}
  else if(e.key==='Enter'&&!$('#next').hidden&&document.activeElement!==$('#next')){e.preventDefault();$('#next').click()}
  else if((e.key==='h'||e.key==='H')&&!$('#howBtn').hidden){e.preventDefault();$('#howBtn').click()}});
$('#speakBtn').onclick=()=>{const q=S&&S.qs[S.i];if(q)speak(q.speak||q.prompt,{user:true,pip:true})};
function checkBtn(label,fn){const b=document.createElement('button');b.type='button';b.className='go';b.id='check';b.textContent=label;b.onclick=e=>{if(!S.locked)fn(e.currentTarget)};return b}

/* number line: tap or drag to place the flag on a tick (fractions, tenths) */
function nlLabel(q,i){return i%q.den===0?String(i/q.den):''}
function drawNumline(q,reveal){const W=340,x0=24,x1=W-24,n=q.max*q.den,sx=i=>x0+(x1-x0)*i/n,cur=S.nl;
  let t='';for(let i=0;i<=n;i++){const whole=i%q.den===0;t+=`<line x1="${sx(i)}" y1="${whole?52:58}" x2="${sx(i)}" y2="${whole?84:78}" stroke="#1f3557" stroke-width="${whole?3:2}"/>`;const l=nlLabel(q,i);if(l!=='')t+=`<text x="${sx(i)}" y="106" text-anchor="middle" ${FONT} font-size="17" fill="#1f3557">${l}</text>`}
  const flag=cur==null?'':`<g class="nlflag${reveal?' right':''}" transform="translate(${sx(cur)} 0)"><line x1="0" y1="14" x2="0" y2="68" stroke="#1f3557" stroke-width="3"/><path d="M0 14 L30 22 L0 32Z" fill="${reveal?'#38b98a':'#ff6b57'}" stroke="#1f3557" stroke-width="2" stroke-linejoin="round"/><circle cx="0" cy="68" r="7" fill="${reveal?'#38b98a':'#ff6b57'}" stroke="#1f3557" stroke-width="2"/></g>`;
  $('#nlBox').innerHTML=`<svg viewBox="0 0 ${W} 116" class="nlsvg" role="slider" tabindex="0" aria-label="Number line" aria-valuemin="0" aria-valuemax="${n}" aria-valuenow="${cur??0}"><line x1="${x0-10}" y1="68" x2="${x1+10}" y2="68" stroke="#1f3557" stroke-width="3" stroke-linecap="round"/><path d="M${x1+14} 68 l-9 -6 v12Z M${x0-14} 68 l9 -6 v12Z" fill="#1f3557"/>${t}${flag}</svg>`}
function setupNumline(q){S.nl=null;const box=$('#choices');box.className='choices one';
  box.innerHTML=`<div class="nlwrap"><div id="nlBox"></div><p class="nlnote">Tap the line to place the flag. Drag it or use the arrow keys to move it.</p></div>`;drawNumline(q);
  const row=document.createElement('div');row.className='actrow';row.appendChild(checkBtn('Check',b=>{if(S.nl==null){say($('#say'),'Tap the number line to place the flag first!');return}judge(S.nl===q.target,b)}));box.appendChild(row);
  const n=q.max*q.den,place=e=>{const svg=$('#nlBox svg');const m=svg.getScreenCTM().inverse(),pt=new DOMPoint(e.clientX,e.clientY).matrixTransform(m);const i=Math.max(0,Math.min(n,Math.round((pt.x-24)/(292)*n)));if(i!==S.nl){S.nl=i;tone([440+i*30],.04,'sine');drawNumline(q);bind()}};
  const box2=$('#nlBox');
  box2.onpointerdown=e=>{if(S.locked)return;e.preventDefault();try{box2.setPointerCapture(e.pointerId)}catch(err){}place(e);box2.onpointermove=ev=>place(ev);box2.onpointerup=box2.onpointercancel=()=>{box2.onpointermove=null}};
  box2.onkeydown=e=>{if(S.locked)return;const d={ArrowLeft:-1,ArrowRight:1}[e.key];if(!d)return;e.preventDefault();S.nl=Math.max(0,Math.min(n,(S.nl??0)+d));drawNumline(q);$('#nlBox svg').focus()};
  const bind=()=>{};}
/* fraction bar: tap parts to shade them */
function drawShade(q,reveal){const W=320,h=70,w=W/q.parts;
  $('#shBox').innerHTML=`<svg viewBox="-4 -4 ${W+8} ${h+8}" class="shsvg" role="group" aria-label="A bar in ${q.parts} equal parts">${Array.from({length:q.parts},(_,i)=>`<rect class="shpart" data-sh="${i}" role="button" tabindex="0" aria-pressed="${S.shade.has(i)}" aria-label="Part ${i+1}" x="${i*w}" y="0" width="${w}" height="${h}" fill="${S.shade.has(i)?(reveal?'#38b98a':'#e2558f'):'#fff3dc'}" stroke="#1f3557" stroke-width="2.5"/>`).join('')}</svg>`;
  $('#shCount').innerHTML=`Shaded: <b>${S.shade.size}/${q.parts}</b>`}
function setupShade(q){S.shade=new Set();const box=$('#choices');box.className='choices one';
  box.innerHTML=`<div class="nlwrap"><div id="shBox"></div><p class="nlnote" id="shCount" aria-live="polite"></p></div>`;drawShade(q);
  const bind=()=>$('#shBox').querySelectorAll('.shpart').forEach(r=>{const tg=()=>{if(S.locked)return;const i=+r.dataset.sh;S.shade.has(i)?S.shade.delete(i):S.shade.add(i);tone([480+S.shade.size*35],.04);drawShade(q);bind();const nr=$(`#shBox [data-sh="${i}"]`);nr&&nr.focus({preventScroll:true})};r.onclick=tg;r.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();tg()}}});bind();
  const row=document.createElement('div');row.className='actrow';row.appendChild(checkBtn('Check',b=>judge(S.shade.size===q.need,b)));box.appendChild(row)}
/* typing the answer instead of picking it: the default for calculations (like the state test) */
const ANS_RE=/^\$?\d[\d,]*(\.\d+)?$|^\d+( \d+)?\/\d+$|^\d+ R \d+$/;
function keypadFor(q){if(q.kind||!S||S.mode==='flash'||q.teach)return false;const a=String(q.answer||'');
  if(!(q.numeric&&/^[\d,]+$/.test(a))&&!(q.calc&&ANS_RE.test(a)))return false;
  if(S.mode==='lesson')return !q.guided&&Math.random()<.5;
  const p=S.mode==='island'?[0,.55,.75,.9][S.d||2]:S.mode==='boss'?.4:S.mode==='test'?.9:.6;return Math.random()<p} // test practice: almost always typed, like the CAASPP math test
function ansParse(s){s=String(s).trim().replace(/[$,]/g,'').replace(/\s+/g,' ');let m;
  if(m=s.match(/^(\d+) ?[Rr] ?(\d+)$/))return {r:[+m[1],+m[2]]};
  if(m=s.match(/^(\d+) (\d+)\/(\d+)$/))return +m[3]?{v:+m[1]+m[2]/m[3],form:'mixed',proper:+m[2]<+m[3]}:null;
  if(m=s.match(/^(\d+)\/(\d+)$/))return +m[2]?{v:m[1]/m[2],form:'frac'}:null;
  if(/^\d*\.\d+$|^\d+\.?$/.test(s))return {v:parseFloat(s),form:s.includes('.')?'decimal':'whole'};return null}
function ansMatch(entry,q){const a=ansParse(q.answer),e=ansParse(entry);if(!a||!e)return false;
  if(a.r||e.r)return !!(a.r&&e.r&&a.r[0]===e.r[0]&&a.r[1]===e.r[1]);
  if(Math.abs(a.v-e.v)>1e-9)return false;
  if(q.calc==='mixed')return e.form==='mixed'&&e.proper||e.form==='whole';
  if(q.calc==='decimal')return e.form==='decimal'||e.form==='whole';
  return true}
function setupKeypad(q){
  S.entry='';const box=$('#choices');box.className='choices one';const a=String(q.answer);
  const money=a.startsWith('$'),extra=[];
  if(/\./.test(a)||money)extra.push(['.','.','Decimal point']);
  if(/\//.test(a)){if(/ /.test(a)||q.calc==='mixed')extra.push(['sp','whole ␣','Space between the whole number and the fraction']);extra.push(['/','/','Fraction bar'])}
  if(/ R /.test(a))extra.push(['R','R','R for remainder']);
  box.innerHTML=`<div class="keypad"><div class="entry" id="entry">${money?'<small class="pre">$</small>':''}<span id="entryTxt"></span><span class="caret"></span>${q.unit?`<small>${q.unit}</small>`:''}</div>
    ${extra.length?`<div class="keys xkeys">${extra.map(([k,l,al])=>`<button type="button" data-k="${k}" aria-label="${al}">${l}</button>`).join('')}</div>`:''}
    <div class="keys">${[1,2,3,4,5,6,7,8,9].map(n=>`<button type="button" data-k="${n}">${n}</button>`).join('')}<button type="button" class="del" data-k="del" aria-label="Delete">${ICON.del}</button><button type="button" data-k="0">0</button><button type="button" class="ok" data-k="ok" aria-label="Check">${ICON.check}</button></div></div>`;
  box.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>keyIn(b.dataset.k,b));
  const allow=new Set(extra.map(x=>x[0]));
  S.keyH=e=>{if($('#play').hidden||!S||S.locked||S.qs[S.i]!==q)return;if(/^\d$/.test(e.key))keyIn(e.key);else if(e.key==='Backspace')keyIn('del');else if(e.key==='Enter')keyIn('ok');
    else if(e.key==='.'&&allow.has('.'))keyIn('.');else if(e.key==='/'&&allow.has('/')){e.preventDefault();keyIn('/')}else if(e.key===' '&&allow.has('sp')){e.preventDefault();keyIn('sp')}else if(/^r$/i.test(e.key)&&allow.has('R'))keyIn('R')};
  removeEventListener('keydown',window._keyH||(()=>{}));window._keyH=S.keyH;addEventListener('keydown',S.keyH);
}
function keyShow(e){return e.replace(/^\d+/,m=>m.length>3&&!/[.\/R ]/.test(e)?fmt(+m):m)}
function keyIn(k,btn){if(S.locked)return;const q=S.qs[S.i];let e=S.entry;
  if(k==='del')e=e.slice(0,-1);
  else if(k==='ok'){if(!e||/[ \/R.]$/.test(e))return;const integer=/^[\d,]+$/.test(String(q.answer));judge(integer&&!q.calc?e===String(q.answer).replace(/,/g,''):ansMatch(e,q),$('#entry'));return}
  else if(e.length>=10)return;
  else if(k==='.'){if(/\.|\//.test(e))return;e=(e||'0')+'.'}
  else if(k==='/'){if(!e||/[\/.R]|\s$/.test(e))return;e+='/'}
  else if(k==='sp'){if(!e||/[ \/.R]/.test(e))return;e+=' '}
  else if(k==='R'){if(!e||/[ \/.R]/.test(e))return;e+=' R '}
  else{e=(e==='0'?'':e)+k;tone([500+ +k*40],.04,'sine')}
  S.entry=e;const t=$('#entryTxt');if(t)t.textContent=keyShow(e)}
function setupClock(q){
  S.clk={h:12,m:0};S.ang={h:0,m:0};const v=$('#visual');v.hidden=false;
  v.innerHTML=`<div class="setwrap"><div class="lcd">${tf(q.target.h,q.target.m)}</div>${clockSVG(12,0,260,'sc')}<div class="clockctl">
    <div class="ctl"><span>Hour</span><button type="button" id="hmn" aria-label="Hour back">−</button><button type="button" id="hpl" aria-label="Hour forward">+</button></div>
    <div class="ctl"><span>Minutes</span><button type="button" id="mmn" aria-label="5 minutes back">−5</button><button type="button" id="mpl" aria-label="5 minutes forward">+5</button></div></div></div>`;
  const st=(dh,dm)=>{if(S.locked)return;S.clk.h=wrapH(S.clk.h+dh);S.clk.m=(S.clk.m+dm+60)%60;tone([392+S.clk.m*5],.05,'sine');updClock()};
  $('#hmn').onclick=()=>st(-1,0);$('#hpl').onclick=()=>st(1,0);$('#mmn').onclick=()=>st(0,-5);$('#mpl').onclick=()=>st(0,5);
  const box=$('#choices');box.className='choices one';box.innerHTML='';box.appendChild(checkBtn('Check my clock',b=>judge(S.clk.h===q.target.h&&S.clk.m===q.target.m,b)));
}
function updClock(){const near=(p,a)=>{while(a-p>180)a-=360;while(p-a>180)a+=360;return a};S.ang.h=near(S.ang.h,((S.clk.h%12)+S.clk.m/60)*30);S.ang.m=near(S.ang.m,S.clk.m*6);
  $('#sch').style.transform=`rotate(${S.ang.h}deg)`;$('#scm').style.transform=`rotate(${S.ang.m}deg)`}
function setupOrder(q){
  S.pos=0;const v=$('#visual');v.hidden=false;v.innerHTML=`<div class="slots">${q.items.map((_,k)=>`<span class="slot" id="sl${k}">${k+1}</span>`).join('')}</div>`;
  const box=$('#choices');box.className='chips';box.innerHTML='';
  shuffle([...q.items]).forEach((it,k)=>{const b=document.createElement('button');b.type='button';b.className='choice chip';b.dataset.v=it;b.textContent=it;b.style.setProperty('--c','var(--ans)');b.onclick=()=>orderTap(b);box.appendChild(b)});
}
function orderTap(b){if(S.locked||b.disabled)return;const q=S.qs[S.i];
  if(b.dataset.v===q.items[S.pos]){const sl=$('#sl'+S.pos);sl.textContent=b.dataset.v;sl.classList.add('filled');b.disabled=true;b.classList.add('used');S.pos++;tone([392+S.pos*45],.08);if(S.pos===q.items.length)judge(true,null)}
  else judge(false,b)}
function setupAngle(q){
  S.av=0;const v=$('#visual');v.hidden=false;v.innerHTML=protractorSVG('pr',0);
  const svg=$('#pr');let drag=false;
  const upd=e=>{const r=svg.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*260,y=(e.clientY-r.top)/r.height*156;let a=Math.atan2(140-y,x-130)*180/Math.PI;if(a<0)a=x>130?0:180;setAV(Math.round(a/5)*5)};
  svg.addEventListener('pointerdown',e=>{if(S.locked)return;drag=true;try{svg.setPointerCapture(e.pointerId)}catch(_){}upd(e)});
  svg.addEventListener('pointermove',e=>{if(drag&&!S.locked)upd(e)});
  svg.addEventListener('pointerup',()=>drag=false);svg.addEventListener('pointercancel',()=>drag=false);
  const box=$('#choices');box.className='choices one';box.innerHTML=`<div class="ctl"><button type="button" data-d="-10">−10°</button><button type="button" data-d="-5">−5°</button><button type="button" data-d="5">+5°</button><button type="button" data-d="10">+10°</button></div>`;
  box.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{if(!S.locked)setAV(S.av+ +b.dataset.d)});
  box.appendChild(checkBtn('Check my angle',b=>judge(S.av===q.target,b)));
}
function setAV(a){const n=Math.max(0,Math.min(180,a));if(n!==S.av)tone([300+n*4],.04,'sine');S.av=n;$('#prray').style.transform=`rotate(${-n}deg)`}
/* ===== drag and drop: sort into groups ('sort'), label a picture ('sort' + q.pic), put in order ('rank'). Tap-tap works too (tap a card, then tap where it goes). ===== */
function dragGhost(el,e){const r=el.getBoundingClientRect(),g=el.cloneNode(true);g.classList.add('dghost');g.style.cssText=`position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;margin:0;z-index:999;pointer-events:none`;document.body.appendChild(g);
  return {g,dx:e.clientX-r.left,dy:e.clientY-r.top,move(ev){g.style.left=(ev.clientX-this.dx)+'px';g.style.top=(ev.clientY-this.dy)+'px'},end(){g.remove()}}}
function dragify(el,{onTap,onMove,onDrop}){let st=null;
  const mv=e=>{if(!st||e.pointerId!==st.id)return;if(!st.drag&&Math.hypot(e.clientX-st.x,e.clientY-st.y)>7){st.drag=dragGhost(el,e);el.classList.add('dragging');tone([520],.03)}if(st.drag){e.preventDefault();st.drag.move(e);onMove&&onMove(e)}};
  const up=e=>{if(!st||e.pointerId!==st.id)return;const s=st;st=null;removeEventListener('pointermove',mv);removeEventListener('pointerup',up);removeEventListener('pointercancel',up);
    if(s.drag){el._tapped=Date.now();s.drag.end();el.classList.remove('dragging');if(e.type==='pointerup'){const t=document.elementFromPoint(e.clientX,e.clientY);onDrop&&onDrop(t,e)}else onDrop&&onDrop(null,e)}else if(e.type==='pointerup'){el._tapped=Date.now();onTap&&onTap()}};
  el.addEventListener('pointerdown',e=>{if(S.locked||(e.button&&e.button!==0)||st)return;st={x:e.clientX,y:e.clientY,drag:null,id:e.pointerId};addEventListener('pointermove',mv,{passive:false});addEventListener('pointerup',up);addEventListener('pointercancel',up)});
  el.addEventListener('click',e=>{if(Date.now()-(el._tapped||0)<500)return;if(!S.locked)onTap&&onTap()});/* keyboard Enter/Space */
  el.style.touchAction='none'}
function setupSort(q){
  S.pick=null;const v=$('#visual');v.hidden=false;
  const binHTML=b=>`<div class="sbin${q.pic?' spot':''}" data-bin="${b.id}" role="button" tabindex="0" aria-label="${esc(b.aria||b.label||'Drop here')}" ${q.pic?`style="left:${b.x}%;top:${b.y}%"`:''}>${b.label?`<span class="sbl">${b.label}</span>`:''}<div class="sbin-in"></div></div>`;
  v.innerHTML=q.pic?`<div class="lblwrap">${q.pic}${q.bins.map(binHTML).join('')}</div>`:`<div class="sbins sb${q.bins.length}">${q.bins.map(binHTML).join('')}</div>`;
  const box=$('#choices');box.className='choices one';box.innerHTML=`<p class="dnote">Drag each card to where it belongs (or tap a card, then tap the place).</p><div class="stray" data-bin="" role="button" tabindex="0" aria-label="Cards">${shuffle(q.items.slice()).map(it=>`<button type="button" class="schip${it.pic?' pic':''}" data-id="${it.id}" aria-label="${esc(it.name||it.id)}">${it.html}</button>`).join('')}</div>`;
  const row=document.createElement('div');row.className='actrow';box.appendChild(row);
  const place=(chip,zone)=>{if(!chip||!zone||S.locked)return;const inner=zone.dataset.bin?zone.querySelector('.sbin-in'):zone;
    if(q.pic&&zone.dataset.bin){const old=inner.querySelector('.schip');if(old&&old!==chip)$('#choices .stray').appendChild(old)}
    inner.appendChild(chip);chip.classList.remove('picked','bad');S.pick=null;document.querySelectorAll('.sbin,.stray').forEach(z=>z.classList.remove('armed'));tone([440+80*document.querySelectorAll('.sbin .schip').length],.05);
    $('#check').disabled=!!document.querySelector('#choices .stray .schip')};
  const zoneAt=t=>t&&t.closest&&t.closest('[data-bin]');
  document.querySelectorAll('#visual .schip,#choices .schip').forEach(chip=>dragify(chip,{
    onTap(){if(S.pick===chip){chip.classList.remove('picked');S.pick=null;document.querySelectorAll('.sbin,.stray').forEach(z=>z.classList.remove('armed'));return}
      document.querySelectorAll('.schip.picked').forEach(c=>c.classList.remove('picked'));S.pick=chip;chip.classList.add('picked');document.querySelectorAll('.sbin,.stray').forEach(z=>z.classList.add('armed'));tone([660],.04)},
    onMove(e){const z=zoneAt(document.elementFromPoint(e.clientX,e.clientY));document.querySelectorAll('.sbin,.stray').forEach(x=>x.classList.toggle('over',x===z))},
    onDrop(t){document.querySelectorAll('.over').forEach(x=>x.classList.remove('over'));const z=zoneAt(t);if(z)place(chip,z)}}));
  document.querySelectorAll('.sbin,.stray').forEach(z=>{const go=e=>{if(S.pick&&!e.target.closest('.schip'))place(S.pick,z)};z.addEventListener('click',go);z.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&S.pick&&e.target===z){e.preventDefault();place(S.pick,z)}})});
  row.appendChild(checkBtn('Check',b=>{const wrong=[...document.querySelectorAll('.sbin .schip')].filter(c=>{const it=q.items.find(i=>i.id===c.dataset.id);return it.bin!==c.closest('.sbin').dataset.bin});
    if(wrong.length){wrong.forEach(c=>c.classList.add('bad'));setTimeout(()=>{if(!S.locked)wrong.forEach(c=>{c.classList.remove('bad');$('#choices .stray').appendChild(c)});if($('#check'))$('#check').disabled=!!document.querySelector('#choices .stray .schip')},900)}
    judge(!wrong.length,b)}));$('#check').disabled=true;
}
function revealSort(q){q.items.forEach(it=>{const c=document.querySelector(`.schip[data-id="${it.id}"]`),z=document.querySelector(`.sbin[data-bin="${it.bin}"] .sbin-in`);if(c&&z){z.appendChild(c);c.classList.remove('bad','picked');c.classList.add('ok')}})}
function setupRank(q){
  S.pick=null;const box=$('#choices');box.className='choices one';
  box.innerHTML=`<p class="dnote">Drag the cards into order (or tap two cards to swap them).</p><div class="rankend"><span>${q.lo||'least'}</span><span>${q.hi||'greatest'}</span></div><div class="rank">${shuffleUntil(q.items.map(i=>i.id),q.order).map(id=>{const it=q.items.find(i=>i.id===id);return `<button type="button" class="rcard" data-id="${id}" aria-label="${esc(it.name||id)}">${it.html}</button>`}).join('')}</div>`;
  const list=box.querySelector('.rank');
  const slotAt=(x,y)=>{for(const c of list.querySelectorAll('.rcard:not(.dragging)')){const r=c.getBoundingClientRect();if(y<r.top||(y<=r.bottom&&x<r.left+r.width/2))return c}return null};
  list.querySelectorAll('.rcard').forEach(card=>dragify(card,{
    onTap(){if(!S.pick){S.pick=card;card.classList.add('picked');tone([660],.04);return}if(S.pick===card){card.classList.remove('picked');S.pick=null;return}
      const a=S.pick,b=card,n=a.nextSibling===b?a:a.nextSibling;list.insertBefore(a,b);list.insertBefore(b,n);a.classList.remove('picked');S.pick=null;tone([520,660],.04)},
    onMove(e){const t=slotAt(e.clientX,e.clientY);if(t!==card.nextSibling&&t!==card)list.insertBefore(card,t)},
    onDrop(){tone([600],.04)}}));
  const row=document.createElement('div');row.className='actrow';box.appendChild(row);
  row.appendChild(checkBtn('Check',b=>{const now=[...list.querySelectorAll('.rcard')].map(c=>c.dataset.id);judge(now.join('|')===q.order.join('|'),b)}));
}
function shuffleUntil(a,bad){let s,g=0;do{s=shuffle(a.slice())}while(s.join('|')===bad.join('|')&&g++<20);return s}
function revealRank(q){const list=$('#choices .rank');if(!list)return;q.order.forEach(id=>{const c=list.querySelector(`[data-id="${id}"]`);list.appendChild(c);c.classList.add('ok')})}
const dragAnswer=q=>q.kind==='sort'?q.bins.map(b=>`${(b.label||b.aria||'').replace(/<[^>]+>/g,'')}: ${q.items.filter(i=>i.bin===b.id).map(i=>i.name||i.id).join(', ')}`).join('; '):q.kind==='rank'?q.order.map(id=>{const it=q.items.find(i=>i.id===id);return it.name||id}).join(', '):'';
/* ---- question types that use: choose ALL correct ('multi'), sort into groups / label a picture ('sort'), put in order ('rank') ---- */
const txtTile=(id,html,name)=>({id:String(id),html:`<span class="ttx">${html}</span>`,name:name||String(id),txt:true});
const FR_NICE=[[1,10],[1,8],[1,6],[1,5],[1,4],[1,3],[3,8],[2,5],[1,2],[3,5],[5,8],[2,3],[7,10],[3,4],[4,5],[5,6],[7,8],[9,10]];
function dragPattern(t){
  if(t===8){const n=pick([12,16,18,20,24,30,36]);let nums,g=0;do{nums=shuffle([2,3,4,5,6,7,8,9,10,11,12].filter(x=>x<n)).slice(0,6)}while((nums.filter(x=>n%x===0).length<2||nums.filter(x=>n%x).length<2)&&g++<50);
    const correct=nums.filter(x=>n%x===0).map(String);
    return {kind:'multi',items:nums.sort((a,b)=>a-b).map(x=>txtTile(x,x)),correct,prompt:`Tap <b>every</b> number that is a <b>factor of ${n}</b>. Then press Check.`,
      hint:`A factor divides ${n} with nothing left over. Try ${n} ÷ each number.`,explain:`Factors of ${n} here: <b>${correct.join(', ')}</b>. ${correct.map(x=>`${n} ÷ ${x} = ${n/x}`).join('. ')}.`}}
  const ps=shuffle(PRIMES.slice(0,12)).slice(0,3),cs=shuffle(COMPS.slice()).slice(0,3);
  return {kind:'sort',bins:[{id:'p',label:'Prime'},{id:'c',label:'Composite'}],items:[...ps.map(x=>({id:String(x),html:`<b>${x}</b>`,bin:'p',name:String(x)})),...cs.map(x=>({id:String(x),html:`<b>${x}</b>`,bin:'c',name:String(x)}))],
    prompt:`Sort the numbers: <b>prime</b> or <b>composite</b>?`,hint:`Prime: only 1 and itself are factors. Composite: it has more factors. Try dividing by 2, 3 and 5.`,
    explain:`Prime: <b>${ps.slice().sort((a,b)=>a-b).join(', ')}</b>. Composite: <b>${cs.slice().sort((a,b)=>a-b).map(c=>{let f=2;while(c%f)f++;return `${c} (${f} × ${c/f})`}).join(', ')}</b>.`};
}
function dragFrac(t){
  if(t===12){const k=R(0,2);
    const sets=[['1/2',[[2,4],[3,6],[4,8],[5,10],[6,12]],[[2,3],[3,4],[1,3],[3,8],[5,8],[4,6],[2,5],[6,10]],'equal to '+frac(1,2),'Equal to 1/2 means the top is exactly half of the bottom.'],
      ['1',[[3,3],[4,4],[6,6],[8,8],[5,5]],[[3,4],[5,6],[7,8],[4,3],[2,5],[6,5]],'equal to <b>1 whole</b>','A fraction equals 1 when the top and bottom are the same.'],
      ['>1',[[5,4],[7,6],[4,3],[9,8],[3,2],[6,5]],[[3,4],[5,6],[2,3],[7,8],[4,4],[1,2]],'<b>greater than 1</b>','A fraction is more than 1 when the top is bigger than the bottom.']][k];
    const yes=shuffle(sets[1].slice()).slice(0,R(2,3)),no=shuffle(sets[2].slice()).slice(0,6-yes.length),all=shuffle([...yes,...no]);
    return {kind:'multi',items:all.map(([a,b])=>txtTile(`${a}/${b}`,frac(a,b))),correct:yes.map(([a,b])=>`${a}/${b}`),prompt:`Tap <b>every</b> fraction ${sets[3]}. Then press Check.`,
      hint:sets[4],explain:`${sets[4]} The right ones: <b>${yes.map(([a,b])=>`${a}/${b}`).join(', ')}</b>.`}}
  if(t===13){let fs,g=0;do{fs=shuffle(FR_NICE.filter(f=>f[0]*2!==f[1]).slice()).slice(0,6)}while((fs.filter(f=>f[0]/f[1]<.5).length<2||fs.filter(f=>f[0]/f[1]>.5).length<2)&&g++<50);
    return {kind:'sort',bins:[{id:'lo',label:`Less than ${frac(1,2)}`,aria:'Less than one half'},{id:'hi',label:`More than ${frac(1,2)}`,aria:'More than one half'}],items:fs.map(([a,b])=>({id:`${a}/${b}`,html:frac(a,b),bin:a/b<.5?'lo':'hi',name:`${a}/${b}`})),
      prompt:`Sort the fractions: less than ${frac(1,2)} or more than ${frac(1,2)}?`,hint:`Half of the bottom number is the middle. Is the top number less or more than that?`,
      explain:fs.map(([a,b])=>`${frac(a,b)}: half of ${b} is ${b/2}, and ${a} is ${a<b/2?'less':'more'}`).join('. ')+'.'}}
  let fs,g=0;do{fs=shuffle(FR_NICE.slice()).slice(0,4).sort((x,y)=>x[0]/x[1]-y[0]/y[1])}while(fs.some((f,i)=>i&&f[0]/f[1]-fs[i-1][0]/fs[i-1][1]<.06)&&g++<80);
  return {kind:'rank',items:fs.map(([a,b])=>({id:`${a}/${b}`,html:frac(a,b),name:`${a}/${b}`})),order:fs.map(([a,b])=>`${a}/${b}`),lo:'least',hi:'greatest',
    prompt:`Put the fractions in order from <b>least</b> to <b>greatest</b>.`,hint:`Compare each one to ${frac(1,2)}. Fractions with the same top: a bigger bottom means smaller pieces.`,
    explain:`${fs.map(([a,b])=>frac(a,b)).join(' &lt; ')}. In decimals: ${fs.map(([a,b])=>(a/b).toFixed(2)).join(' &lt; ')}.`};
}
function dragDec(){let v,g=0;do{v=[R(1,9)*10,R(1,9)*10,R(11,99),R(1,9)];v[2]=v[2]%10?v[2]:v[2]+1}while(new Set(v).size<4&&g++<50);
  const show=n=>n%10===0?(n/100).toFixed(1):dec(n),o=v.slice().sort((a,b)=>a-b);
  return {kind:'rank',items:v.map(n=>({id:show(n),html:`<b>${show(n)}</b>`,name:show(n)})),order:o.map(show),lo:'least',hi:'greatest',prompt:`Put the decimals in order from <b>least</b> to <b>greatest</b>.`,
    hint:`Give every number two places after the point: 0.4 = 0.40. Then compare.`,explain:`${o.map(n=>dec(n)).join(' &lt; ')}, so: <b>${o.map(show).join(', ')}</b>.`}}
function dragPlace(){const L=Dv(4,5,6),base=String(R(10**(L-1),10**L-1));const set=new Set([+base]);let g=0;
  while(set.size<4&&g++<60){const a=[...base];const i=R(1,L-1),j=R(0,L-1);[a[i],a[j]]=[a[j],a[i]];if(a[0]!=='0')set.add(+a.join(''))}while(set.size<4)set.add(+base+R(1,999));
  const nums=[...set],o=nums.slice().sort((a,b)=>a-b);
  return {kind:'rank',items:nums.map(n=>({id:String(n),html:`<b>${fmt(n)}</b>`,name:fmt(n)})),order:o.map(String),lo:'least',hi:'greatest',prompt:`Put the numbers in order from <b>least</b> to <b>greatest</b>.`,
    hint:`Compare digits from the left. The first place where they are different decides.`,explain:`<b>${o.map(fmt).join(' &lt; ')}</b>.`}}
function dragAngle(){const want=pick(['Acute','Obtuse']);let ds,g=0;do{ds=shuffle([20,30,40,50,60,70,80,100,110,120,130,140,150,160,90]).slice(0,6)}while((ds.filter(d=>angleType(d)===want).length<2||ds.filter(d=>angleType(d)!==want).length<2)&&g++<50);
  const correct=ds.filter(d=>angleType(d)===want).map(String);
  return {kind:'multi',items:ds.map(d=>({id:String(d),html:angleSVG(d).replace(/style="[^"]*"/,''),name:d+'°'})),correct,prompt:`Tap <b>every ${want.toLowerCase()}</b> angle. Then press Check.`,
    hint:want==='Acute'?`Acute angles are smaller than a square corner (90°).`:`Obtuse angles are wider than a square corner (90°), but not a flat line.`,
    explain:`${want} angles here: <b>${correct.map(d=>d+'°').join(', ')}</b>. ${ds.includes(90)?'The square corner (90°) is a right angle, not acute or obtuse.':''}`}}
function triAngles(ty){if(ty==='r'){const o=R(3,6)*10;return shuffle([90,o])}if(ty==='a'){let A,B;do{A=R(10,15)*5;B=R(10,15)*5}while(180-A-B>75||180-A-B<50);return [A,B]}const big=R(22,27)*5,s=R(5,Math.max(5,(180-big)/5-4))*5;return coin()?[big,s]:[s,big]}
function dragShape(){const tys=shuffle(['r','r','a','a','o','o']);
  return {kind:'sort',bins:[{id:'r',label:'Right'},{id:'a',label:'Acute'},{id:'o',label:'Obtuse'}],items:tys.map((ty,i)=>{const [A,B]=triAngles(ty);return {id:'t'+i,html:triSVG(A,B,false).replace(/style="[^"]*"/,''),bin:ty,pic:1,name:{r:'right',a:'acute',o:'obtuse'}[ty]+' triangle'}}),
    prompt:`Sort the triangles: <b>right</b>, <b>acute</b> or <b>obtuse</b>?`,hint:`Find the biggest angle. Square corner = right. Wider than a square corner = obtuse. All smaller = acute.`,
    explain:`A <b>right</b> triangle has a square corner. An <b>obtuse</b> triangle has one angle wider than a square corner. In an <b>acute</b> triangle every angle is smaller than a square corner.`}}
const POS_WORDS={n:['puppy','river','teacher','pencil','island','garden','cloud','sandwich'],v:['jump','swim','laugh','build','whisper','climb','paint','race'],a:['shiny','tiny','brave','noisy','soft','purple','gentle','sticky']};
const PREP_W=['under','over','beside','behind','across','through','between','during','above','near'],NOTPREP_W=['quickly','jump','happy','apple','loudly','sing','green','they','sleepy','run'];
function dragGram(k){
  if(k===6){const ps=shuffle(PREP_W.slice()).slice(0,R(3,4)),ns=shuffle(NOTPREP_W.slice()).slice(0,8-ps.length),all=shuffle([...ps,...ns]);
    return {kind:'multi',items:all.map(w=>txtTile(w,w)),correct:ps,prompt:`Tap <b>every preposition</b>. Then press Check.`,
      hint:`A preposition tells where or when: try "The cat sat ___ the box." Does the word fit?`,explain:`Prepositions: <b>${ps.join(', ')}</b>. They tell where or when ("${ps[0]} the box").`}}
  const ws=[...shuffle(POS_WORDS.n.slice()).slice(0,2).map(w=>[w,'n']),...shuffle(POS_WORDS.v.slice()).slice(0,2).map(w=>[w,'v']),...shuffle(POS_WORDS.a.slice()).slice(0,2).map(w=>[w,'a'])];
  return {kind:'sort',bins:[{id:'n',label:'Noun'},{id:'v',label:'Verb'},{id:'a',label:'Adjective'}],items:ws.map(([w,b])=>({id:w,html:w,bin:b,name:w})),prompt:`Sort the words: <b>noun</b>, <b>verb</b> or <b>adjective</b>?`,
    hint:`Noun = a person, place or thing. Verb = an action (you can do it). Adjective = describes a noun (what kind?).`,
    explain:`Nouns: <b>${ws.filter(x=>x[1]==='n').map(x=>x[0]).join(', ')}</b>. Verbs: <b>${ws.filter(x=>x[1]==='v').map(x=>x[0]).join(', ')}</b>. Adjectives: <b>${ws.filter(x=>x[1]==='a').map(x=>x[0]).join(', ')}</b>.`}}
const ENERGY={r:['Sunlight (solar)','Wind','Moving water','Heat from inside Earth'],n:['Coal','Oil','Natural gas','Gasoline']};
const PLANT_PIC=`<svg viewBox="0 0 300 300" role="img" aria-label="A plant"><rect x="0" y="210" width="300" height="90" fill="#c99a6b"/><path d="M150 210 C148 160 152 120 150 80" stroke="#38b98a" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M150 150 C120 130 95 140 80 152 C100 168 130 166 150 150Z" fill="#7cc95a" stroke="#1f3557" stroke-width="2"/><path d="M151 120 C180 100 205 108 220 120 C200 136 172 136 151 120Z" fill="#7cc95a" stroke="#1f3557" stroke-width="2"/><g transform="translate(150 66)">${[0,72,144,216,288].map(a=>`<ellipse rx="13" ry="22" cy="-20" fill="#ff9fb7" stroke="#1f3557" stroke-width="2" transform="rotate(${a})"/>`).join('')}<circle r="11" fill="#ffc23d" stroke="#1f3557" stroke-width="2"/></g><path d="M150 210 C146 235 130 250 116 268 M150 214 C156 240 172 252 186 272 M150 220 C150 245 150 262 148 286" stroke="#8c5a2c" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;
const WC_PIC=`<svg viewBox="0 0 300 200" role="img" aria-label="The water cycle"><rect x="0" y="150" width="300" height="50" fill="#8fd3f7"/><circle cx="34" cy="30" r="20" fill="#ffd56b" stroke="#e09a14" stroke-width="2"/><path d="M188 48a16 16 0 0 1 30-8a14 14 0 0 1 26 6a12 12 0 0 1-4 24h-50a12 12 0 0 1-2-22z" fill="#fff" stroke="#1f3557" stroke-width="2"/><path d="M80 146 C74 110 110 70 172 56" fill="none" stroke="#e2558f" stroke-width="3" stroke-dasharray="6 4"/><path d="M200 80 l-6 14 M214 80 l-6 14 M228 80 l-6 14 M242 80 l-6 14" stroke="#2f9fe0" stroke-width="3" stroke-linecap="round"/><path d="M252 96 C268 112 274 126 278 144" fill="none" stroke="#1f3557" stroke-width="2.5"/></svg>`;
function dragSci(k){
  if(k===4){const r=shuffle(ENERGY.r.slice()).slice(0,3),n=shuffle(ENERGY.n.slice()).slice(0,3);
    return {kind:'sort',bins:[{id:'r',label:'Renewable'},{id:'n',label:'Nonrenewable'}],items:[...r.map(x=>({id:x,html:x,bin:'r',name:x})),...n.map(x=>({id:x,html:x,bin:'n',name:x}))],
      prompt:`Sort the energy sources: <b>renewable</b> (never runs out) or <b>nonrenewable</b> (will run out)?`,hint:`Fossil fuels (coal, oil, gas) took millions of years to form. Sun, wind and water keep coming back.`,
      explain:`Renewable: <b>${r.join(', ')}</b>. Nonrenewable: <b>${n.join(', ')}</b> (fossil fuels, they will run out).`}}
  if(k===5)return {kind:'sort',pic:PLANT_PIC,bins:[{id:'f',x:66,y:16,aria:'Top of the plant'},{id:'l',x:3,y:42,aria:'Side of the stem'},{id:'s',x:62,y:52,aria:'Middle of the plant'},{id:'r',x:66,y:82,aria:'Under the ground'}],
    items:[{id:'Flower',html:'Flower',bin:'f'},{id:'Leaf',html:'Leaf',bin:'l'},{id:'Stem',html:'Stem',bin:'s'},{id:'Roots',html:'Roots',bin:'r'}],
    prompt:`Label the parts of the plant. Drag each word to its box.`,hint:`Roots are under the ground. The flower is at the top. Leaves stick out from the stem.`,
    explain:`<b>Roots</b> take in water. The <b>stem</b> holds the plant up and carries water. <b>Leaves</b> make food from sunlight. The <b>flower</b> makes seeds.`};
  return {kind:'sort',pic:WC_PIC,bins:[{id:'e',x:2,y:44,aria:'Arrow going up from the water'},{id:'c',x:66,y:2,aria:'The cloud'},{id:'p',x:46,y:52,aria:'Drops falling from the cloud'},{id:'o',x:30,y:80,aria:'The ocean'}],
    items:[{id:'Evaporation',html:'Evaporation',bin:'e'},{id:'Condensation',html:'Condensation',bin:'c'},{id:'Precipitation',html:'Precipitation',bin:'p'},{id:'Collection',html:'Collection',bin:'o'}],
    prompt:`Label the water cycle. Drag each word to its box.`,hint:`Evaporation goes UP from the water. Condensation makes clouds. Precipitation falls DOWN.`,
    explain:`<b>Evaporation</b>: the sun turns water into vapor that rises. <b>Condensation</b>: vapor cools into cloud drops. <b>Precipitation</b>: rain or snow falls. <b>Collection</b>: water gathers in oceans and lakes.`};
}
/* ===== test-style kinds: Part A + Part B ('partab'), tap a sentence in the text ('hilite'), Yes/No table ('yesno') ===== */
function setupPartAB(q){
  S.ab={a:null,b:null};const box=$('#choices');box.className='choices one';
  const grp=(k,P)=>`<div class="abpart" data-part="${k}"><div class="abhead"><span class="abtag">Part ${k.toUpperCase()}</span> ${P.prompt}</div><div class="abopts">${P.choices.map((c,i)=>`<button type="button" class="choice abopt" style="--c:var(--ans)" data-part="${k}" data-v="${esc(c)}" aria-pressed="false">${c}</button>`).join('')}</div></div>`;
  box.innerHTML=grp('a',q.a)+grp('b',q.b);
  box.querySelectorAll('.abopt').forEach(b=>b.onclick=()=>{if(S.locked)return;const k=b.dataset.part;box.querySelectorAll(`.abopt[data-part="${k}"]`).forEach(x=>{x.classList.remove('sel','wrong');x.setAttribute('aria-pressed','false')});b.classList.add('sel');b.setAttribute('aria-pressed','true');S.ab[k]=b.dataset.v;tone([600],.04);$('#check').disabled=!(S.ab.a&&S.ab.b)});
  const row=document.createElement('div');row.className='actrow';box.appendChild(row);
  row.appendChild(checkBtn('Check',b=>{const okA=S.ab.a===esc(q.a.answer)||S.ab.a===q.a.answer,okB=S.ab.b===esc(q.b.answer)||S.ab.b===q.b.answer;
    if(!(okA&&okB))box.querySelectorAll('.abopt.sel').forEach(x=>{const P=x.dataset.part==='a'?q.a:q.b;if(x.dataset.v!==esc(P.answer)&&x.dataset.v!==P.answer)x.classList.add('wrong')});judge(okA&&okB,b)}));$('#check').disabled=true;
}
function revealPartAB(q){$('#choices').querySelectorAll('.abopt').forEach(x=>{const P=x.dataset.part==='a'?q.a:q.b;if(x.dataset.v===esc(P.answer)||x.dataset.v===P.answer)x.classList.add('right');else x.classList.add('muted')})}
function setupHilite(q){
  S.hl=null;const v=$('#visual');v.querySelectorAll('.sent').forEach(sp=>{sp.classList.add('tapme');sp.setAttribute('role','button');sp.tabIndex=0;
    const go=()=>{if(S.locked)return;v.querySelectorAll('.sent.sel').forEach(x=>x.classList.remove('sel','wrong'));sp.classList.add('sel');S.hl=+sp.dataset.s;tone([600],.04);$('#check').disabled=false};
    sp.onclick=go;sp.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}}});
  const box=$('#choices');box.className='choices one';box.innerHTML=`<p class="dnote">Tap a sentence in the text to highlight it, then press Check.</p>`;
  const row=document.createElement('div');row.className='actrow';box.appendChild(row);
  row.appendChild(checkBtn('Check',b=>{const ok=q.hl.includes(S.hl);if(!ok){const s=v.querySelector('.sent.sel');s&&s.classList.add('wrong')}judge(ok,b)}));$('#check').disabled=true;
}
function revealHilite(q){const v=$('#visual');q.hl.forEach(i=>{const s=v.querySelector(`.sent[data-s="${i}"]`);if(s){s.classList.add('right');s.scrollIntoView({block:'nearest',behavior:'smooth'})}})}
function setupYesNo(q){
  S.yn={};const box=$('#choices');box.className='choices one';
  box.innerHTML=`<div class="yntab" role="table"><div class="ynrow ynhead" role="row"><span role="columnheader">${q.colHead||''}</span><span role="columnheader">Yes</span><span role="columnheader">No</span></div>${q.rows.map((r,i)=>`<div class="ynrow" role="row" data-r="${i}"><span class="ynq" role="cell">${r.html}</span><button type="button" class="ynb" data-r="${i}" data-v="1" aria-label="Yes" aria-pressed="false"></button><button type="button" class="ynb" data-r="${i}" data-v="0" aria-label="No" aria-pressed="false"></button></div>`).join('')}</div>`;
  box.querySelectorAll('.ynb').forEach(b=>b.onclick=()=>{if(S.locked)return;const r=b.dataset.r;box.querySelectorAll(`.ynb[data-r="${r}"]`).forEach(x=>{x.classList.remove('on');x.setAttribute('aria-pressed','false')});b.classList.add('on');b.setAttribute('aria-pressed','true');box.querySelector(`.ynrow[data-r="${r}"]`).classList.remove('bad');S.yn[r]=b.dataset.v==='1';tone([b.dataset.v==='1'?660:440],.04);$('#check').disabled=Object.keys(S.yn).length<q.rows.length});
  const row=document.createElement('div');row.className='actrow';box.appendChild(row);
  row.appendChild(checkBtn('Check',b=>{const bad=q.rows.map((r,i)=>S.yn[i]!==r.yes?i:-1).filter(i=>i>=0);bad.forEach(i=>box.querySelector(`.ynrow[data-r="${i}"]`).classList.add('bad'));judge(!bad.length,b)}));$('#check').disabled=true;
}
function revealYesNo(q){const box=$('#choices');q.rows.forEach((r,i)=>{box.querySelectorAll(`.ynb[data-r="${i}"]`).forEach(x=>x.classList.toggle('on',(x.dataset.v==='1')===r.yes));const row=box.querySelector(`.ynrow[data-r="${i}"]`);row.classList.remove('bad');row.classList.add('ok')})}
const kindAnswer=q=>q.kind==='partab'?`A: ${q.a.answer} / B: ${q.b.answer}`:q.kind==='hilite'?(q.sentText||''):q.kind==='yesno'?q.rows.map(r=>`${r.name||r.html.replace(/<[^>]+>/g,'')}: ${r.yes?'Yes':'No'}`).join('; '):'';
function setupMulti(q){
  S.sel=new Set();const box=$('#choices');box.className='tiles'+(q.oneCol?' one':'');box.innerHTML='';
  q.items.forEach(it=>{const b=document.createElement('button');b.type='button';b.className='tile'+(it.txt?' txt':'');b.dataset.id=it.id;b.innerHTML=it.html;b.setAttribute('aria-pressed','false');
    b.onclick=()=>{if(S.locked)return;S.sel.has(it.id)?S.sel.delete(it.id):S.sel.add(it.id);b.classList.toggle('sel');b.setAttribute('aria-pressed',S.sel.has(it.id));tone([S.sel.has(it.id)?660:440],.05)};box.appendChild(b)});
  const row=document.createElement('div');row.className='actrow';row.style.gridColumn='1/-1';
  row.appendChild(checkBtn('Check',b=>judge(S.sel.size===q.correct.length&&q.correct.every(k=>S.sel.has(k)),b)));box.appendChild(row);
}
function setupMoney(q){
  S.pay=[];const v=$('#visual');v.hidden=false;
  v.innerHTML=`<div class="moneybox"><div class="pricetag">Price: ${fmtM(q.target)}</div><div class="tray" id="tray"></div><div class="traytotal" id="traytotal" hidden></div></div>`;
  const box=$('#choices');box.className='choices one';
  box.innerHTML=`<div class="coinrow">${[100,25,10,5,1].map(c=>`<button type="button" class="coinbtn" data-c="${c}" aria-label="Add ${c===100?'one dollar':c+' cents'}">${coinSVG(c,78)}</button>`).join('')}</div>
    <div class="actrow"><button type="button" class="go alt small" id="undo">Undo</button><button type="button" class="go alt small" id="clear">Clear</button></div>`;
  box.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{if(S.locked||S.pay.length>=20)return;S.pay.push(+b.dataset.c);tone([700+S.pay.length*20],.05,'square');renderTray()});
  $('#undo').onclick=()=>{if(!S.locked){S.pay.pop();renderTray()}};$('#clear').onclick=()=>{if(!S.locked){S.pay=[];renderTray()}};
  box.querySelector('.actrow').appendChild(checkBtn('Pay!',b=>judge(S.pay.reduce((a,c)=>a+c,0)===q.target,b)));renderTray();
}
function renderTray(){const t=$('#tray');if(!t)return;t.innerHTML=S.pay.length?S.pay.map(c=>coinSVG(c,54)).join(''):'<span class="trayempty">Tap coins below to put them here</span>';
  const tt=$('#traytotal');tt.textContent=`In the tray: ${fmtM(S.pay.reduce((a,c)=>a+c,0))}`;tt.hidden=!(S.tries>0||S.locked)}

function choose(btn){if(S.locked||btn.disabled)return;judge(btn.dataset.v===S.qs[S.i].answer,btn)}
function reveal(q){
  if(q.kind==='setclock'){S.clk={...q.target};updClock()}
  else if(q.kind==='order'){q.items.forEach((it,k)=>{const sl=$('#sl'+k);sl.textContent=it;sl.classList.add('filled')});[...$('#choices').children].forEach(b=>{b.disabled=true;b.classList.add('used')})}
  else if(q.kind==='angle')setAV(q.target);
  else if(q.kind==='multi')document.querySelectorAll('.tile').forEach(t=>{if(q.correct.includes(t.dataset.id))t.classList.add('right');else if(t.classList.contains('sel'))t.classList.add('wrongsel')});
  else if(q.kind==='sort')revealSort(q);
  else if(q.kind==='partab')revealPartAB(q);
  else if(q.kind==='hilite')revealHilite(q);
  else if(q.kind==='yesno')revealYesNo(q);
  else if(q.kind==='rank')revealRank(q);
  else if(q.kind==='money'){S.pay=greedy(q.target);renderTray()}
  else if(q.kind==='numline'){S.nl=q.target;drawNumline(q,true)}
  else if(q.kind==='shade'){S.shade=new Set([...Array(q.need).keys()]);drawShade(q,true)}
  else if(q.kind==='keypad'){const t=$('#entryTxt');if(t)t.textContent=String(q.answer).replace(/^\$/,'');$('#entry').classList.add('right')}
  else [...$('#choices').children].forEach(b=>{if(b.dataset.v===q.answer)b.classList.add('right');else if(!b.classList.contains('wrong'))b.classList.add('muted')});
}
function explainHTML(q,ok){
  const steps=/<svg/.test(q.explain)?[q.explain]:q.explain.split(/(?<=[.!?])\s+(?=[A-Z<(“"])/);
  return `<div><b>${ok?'Yes!':"Here's how:"}</b></div><div class="steps">${steps.map((s,i)=>`<span class="step" style="animation-delay:${i*.55}s">${s}</span>`).join('')}</div>${q.anim?`<div class="anim">${q.anim}</div>`:''}`;
}
function comboUI(){const c=$('#combo');if(S.streak>=2){c.hidden=false;c.innerHTML=`${FLAME} Combo ×${S.streak}`;c.classList.remove('pulse');void c.offsetWidth;c.classList.add('pulse')}else c.hidden=true}
function judge(ok,btn){
  clearTimeout(S.nudge);stopSpeak();
  if(S.qs[S.i]&&S.qs[S.i].teach){S.locked=true;if(btn)btn.classList.add('right');tone([660,880],.05);$('#hint').hidden=true;$('#howBtn').hidden=true;finishQ();return}
  const q=S.qs[S.i],dot=S.mode==='boss'?null:document.querySelectorAll('.dot')[S.i];
  if(ok){
    S.locked=true;if(btn)btn.classList.add('right');
    const first=S.tries===0;if(first)track(q,true,true);
    if(first){S.score++;S.streak++;dot&&dot.classList.add('gold');if(q.meta)(S.missRun||(S.missRun={}))[q.meta.i+'|'+q.meta.t]=0}else{S.streak=0;dot&&dot.classList.add('ok')}
    if(first&&S.mode==='place'){S.pr=S.pr||{};S.pr[q.meta.i]=(S.pr[q.meta.i]||0)+1}
    S.bestStreak=Math.max(S.bestStreak,S.streak);if(S.bestStreak>G.bestCombo)G.bestCombo=S.bestStreak;
    let c=first?REW.ans:REW.ans2;if(first&&S.streak>=3)c+=Math.min(S.streak,8)-1;if(S.mode==='island'){const pk=pickToday();if(pk&&pk.id===S.isl.id)c*=2}c=taper(c);if(S.mode==='island'&&S.d===3)c=Math.round(c*1.5);
    if(S.mode==='review'||q.rv)reviewResult(q,first);
    sYes();burstAt(btn||$('#card'));foxMove(S.streak>=5&&S.streak%5===0?'spin':'hop');setAlt(S.score);aliveRight(btn||$('#entry')||$('#check')||$('#card'),first);if(typeof missionAnswer==='function')missionAnswer(first?'gold':'ok');if(first&&typeof stat==='function'){stat('qs');stat('first')}aliveEventAnswer(true,first,btn||$('#prompt'));
    gain(c,first?2:1,btn||$('#prompt'));
    if(S.mode==='boss')bossHit();
    say($('#say'),COMBO_MSG[S.streak]||(first?pick(YES):pick(SECOND)));
    if(S.streak>=5)award('combo5');if(S.streak>=10)award('combo10');
    if(first&&CUR_EV&&S.mode!=='boss')addEventPts(S.isl.id==='ev'?3:1);
    if(first&&S.streak>0&&S.streak%5===0&&['island','daily','review'].includes(S.mode))S.bonus=true;
    comboUI();
    $('#hint').hidden=true;const fb=$('#feedback');fb.className='feedback';fb.innerHTML=explainHTML(q,true);fb.hidden=false;if(typeof esAfterExplain==='function')esAfterExplain(q);finishQ();
  }else{
    const given=btn&&!q.kind?btn.textContent.trim():q.kind==='keypad'?String(S.entry||''):'';
    S.tries++;sNo();foxMove('wobble');foxClass('sad',1400);S.streak=0;comboUI();aliveWrong();aliveEventAnswer(false,false);
    if(btn){if(!q.kind){btn.classList.add('wrong');btn.disabled=true}else{btn.classList.remove('nope');void btn.offsetWidth;btn.classList.add('nope')}}
    if(q.kind==='money')renderTray();
    if(q.kind==='keypad'){S.entry='';const t=$('#entryTxt');if(t)t.textContent=''}
    if(S.mode==='boss'){S.locked=true;track(q,true,false,given);loseHeart();reveal(q);say($('#say'),S.hearts>0?`Ouch! The ${BOSSES[S.boss].name} zapped a heart! Shake it off!`:`Oh no, no hearts left! It got away this time...`);
      const fb=$('#feedback');fb.className='feedback miss';fb.innerHTML=explainHTML(q,false);fb.hidden=false;finishQ();return}
    if(S.mode==='test'&&S.tries===1){track(q,true,false,given);S.tries=2}
    if(S.tries===1&&S.mode==='island'&&q.meta&&q.meta.t!=null&&!q.rv&&byId(q.meta.i)&&byId(q.meta.i).gen){const k=q.meta.i+'|'+q.meta.t;S.missRun=S.missRun||{};S.helped=S.helped||{};S.missRun[k]=(S.missRun[k]||0)+1;if(S.missRun[k]>=2&&!S.helped[k]){S.helped[k]=1;S.helpQ=q}}
    if(typeof missionAnswer==='function')missionAnswer(S.tries===1?'wobble':'miss');if(S.tries===1&&typeof stat==='function')stat('qs');
    if(S.tries===1){track(q,true,false,given);bump('h');firstMistakeTip();say($('#say'),pick(TRY));const h=$('#hint');h.innerHTML=`<b>Hint:</b> ${q.hint}`;h.hidden=false;if(typeof esAfterHint==='function')esAfterHint(q);armNudge();autoSay(`Hint: ${q.hint}`)}
    else{S.locked=true;dot&&dot.classList.add('miss');if(S.mode==='review'||q.rv)reviewResult(q,false);reveal(q);say($('#say'),`That one was tricky! Watch how it works. It'll come back at Fix-It Falls so you can beat it later!`);
      $('#hint').hidden=true;const fb=$('#feedback');fb.className='feedback miss';fb.innerHTML=explainHTML(q,false);fb.hidden=false;autoSay(fb.innerHTML);if(typeof esAfterExplain==='function')esAfterExplain(q);finishQ()}
  }
}
function firstMistakeTip(){if(G.tutHint)return;G.tutHint=1;save(true);
  setTimeout(()=>{['#hint','#howBtn'].forEach(sel=>{const el=$(sel);if(el&&!el.hidden){el.classList.remove('pulsehelp');void el.offsetWidth;el.classList.add('pulsehelp')}});
    say($('#say'),`Stuck? Read the <b>Hint</b> below the puzzle. Still stuck? Tap <b>How?</b> and I'll show you step by step!`)},350)}
function reviewResult(q,first){
  const r=G.review.find(x=>x.s===q.meta.s);if(!r)return;
  if(first){r.box++;if(r.box>=3){G.review=G.review.filter(x=>x!==r);G.fixedSeeds.push(r.s);G.fixed++;if(typeof resAdd==='function')resAdd('gold',1);toast('Mistake fixed forever!','That puzzle won\'t trick you again. <b>+1 golden brick</b> for your Wonders!','#38b98a');if(G.fixed>=10)award('fixer')}else r.due=addDays([1,3,7][r.box])}
  else{r.box=0;r.due=addDays(1)}
}
function finishQ(){
  $('#howBtn').hidden=true;
  const n=$('#next');
  if(S.mode==='boss')n.textContent=S.hp<=0?'Victory!':S.hearts<=0?'See results':'Next attack';
  else if(S.mode==='lesson')n.textContent=S.i===S.qs.length-1?'Finish the lesson':S.qs[S.i+1]&&!S.qs[S.i+1].teach&&!S.qs[S.i+1].guided?'Now try it alone!':'Next';
  else n.textContent=S.bonus?'Bonus game!':S.i===S.qs.length-1?'See my results':'Next puzzle';
  n.hidden=false;setTimeout(()=>{try{n.focus({preventScroll:true})}catch(e){}},50);if(S.i===S.qs.length-1&&S.mode!=='boss')setTimeout(()=>aliveStep(S.qs.length),400);
  setTimeout(showAnswerArea,120);
}
/* after an answer, gently scroll so the explanation (and the Next button) are on screen; never scroll past the top of the explanation */
function showAnswerArea(){const n=$('#next');if(n.hidden||$('#play').hidden)return;const fb=$('#feedback');
  const sticky=getComputedStyle(n).position==='sticky',nr=n.getBoundingClientRect(),fr=fb.hidden?nr:fb.getBoundingClientRect();
  const limit=innerHeight-(sticky?nr.height+24:16),want=sticky?fr.bottom-limit:nr.bottom-limit;
  const dy=Math.min(want,fr.top-12);if(dy>4)scrollBy({top:dy,behavior:reduce?'auto':'smooth'})}
$('#next').onclick=()=>{
  if(S.bonus){S.bonus=false;return startPop(()=>{S.i++;if(S.i>=S.qs.length)finishRound();else showQ()})}
  if(S.mode==='boss'){if(S.hp<=0)return finishBoss(true);if(S.hearts<=0)return finishBoss(false);S.qs.push(mixedQ(S.pool));S.i++;return showQ()}
  if(S.helpQ&&S.i+1<S.qs.length){const hq=S.helpQ;S.helpQ=null;return showHelp(hq,()=>{S.i++;showQ()})}
  S.i++;if(S.i>=S.qs.length)finishRound();else showQ();
};
/* two misses in a row on the same kind of puzzle: Pip solves one out loud, and the next puzzle is a bit easier */
function showHelp(q,go){const isl=byId(q.meta.i),d=Math.max(1,(q.meta.d||2)-1),ex=makeQ(isl,q.meta.t,R(1,2e9),d),nx=S.qs[S.i+1];
  if(nx&&!nx.rv&&!nx.teach){const e=makeQ(isl,q.meta.t,R(1,2e9),d);e.eased=1;S.qs[S.i+1]=e}
  const how=explainHTML(ex,true).replace('<b>Yes!</b>',"<b>Here's how Pip does it:</b>");
  overlay(`<div class="pipbob" data-fox></div><div class="eyebrow">Pip's tip</div><h2>Let's slow down</h2><p>Two tricky ones in a row! Watch me solve one, then you try a slightly easier one.</p><div class="helpex"><div class="hxq">${ex.prompt}</div>${ex.visual?`<div class="hxv">${ex.visual}</div>`:''}<div class="feedback">${how}</div></div><button class="go" type="button" id="helpOk" style="align-self:center">Got it, let me try!</button>`,()=>{$('#helpOk').onclick=()=>{closeOverlay();go()}})}

/* boss */
function startBoss(isl,opts={}){
  stopTimers();S=freshState(isl,'boss');S.boss=opts.boss||'grumble';S.chapter=opts.chapter;S.pool=opts.pool?opts.pool.map(byId):null;
  S.qs=[mixedQ(S.pool)];S.hp=8;S.hpMax=8;S.hearts=3;
  $('#iname').textContent=opts.chapter!=null?`Chapter ${opts.chapter+1} Boss`:'Boss Island';$('#bossname').textContent=BOSSES[S.boss].name;
  $('#timer').hidden=true;$('#dots').hidden=true;$('#combo').hidden=true;$('#bossbar').hidden=false;
  $('#bossfig').innerHTML=bossSVG(S.boss);$('#hpfill').style.width='100%';$('#hearts').innerHTML=HEART(1).repeat(3);setAlt(0);
  show('play');refreshFoxes();say($('#say'),`The ${BOSSES[S.boss].name}! Every right answer zaps it. Get 8 hits before you lose 3 hearts. No hints in a boss fight. You've got this${nm()}!`);showQ();
}
function bossHit(){S.hp--;$('#hpfill').style.width=(S.hp/S.hpMax*100)+'%';const b=$('#bossfig .boss');if(!b)return;b.classList.remove('hit','laugh');void b.getBoundingClientRect();b.classList.add(S.hp<=0?'gone':'hit');burstAt($('#bossfig'),30)}
function loseHeart(){S.hearts--;$('#hearts').innerHTML=[0,1,2].map(k=>HEART(k<S.hearts)).join('');const b=$('#bossfig .boss');if(b){b.classList.remove('hit','laugh');void b.getBoundingClientRect();b.classList.add('laugh')}}
function finishBoss(win){
  const name=BOSSES[S.boss].name;
  if(win&&S.chapter==null)award('boss');
  let extra='';if(win&&S.chapter!=null&&G.story.ch===S.chapter){G.story.ch++;G.story.at=Object.assign({},G.story.at||{},{[S.chapter]:dayKey()});extra=` You won a ${BOOKS[CHAPTERS[S.chapter].book||1].unit}!`;S.storyWin=S.chapter}
  done(win?S.hearts:0,win?`You beat the ${name} with ${S.hearts} heart${S.hearts>1?'s':''} left!${extra}`:`The ${name} escaped after ${S.hpMax-S.hp} hits. Practice on the islands and try again!`,{title:win?'Victory!':'So close!',sticker:win?(S.chapter!=null?'rare':1):0});
}

/* thunder tower */
function startFlash(isl){
  stopTimers();S=freshState(isl,'flash');S.end=performance.now()+60000;S.d=diffFor({gen:1,id:'flash'});
  $('#iname').textContent=isl.name;$('#timer').hidden=false;$('#dots').hidden=true;$('#bossbar').hidden=true;$('#visual').hidden=true;$('#combo').hidden=true;$('#speakBtn').hidden=true;$('#howBtn').hidden=true;
  $('#hint').hidden=$('#feedback').hidden=$('#next').hidden=true;setAlt(0);show('play');refreshFoxes();
  say($('#say'),`Fact storm! Answer as many as you can in 60 seconds. Your record is ${G.bestThunder}. Go go go!`);nextFlash();
  S.timer=setInterval(()=>{const left=Math.max(0,S.end-performance.now());$('#timerfill').style.width=(left/600)+'%';
    $('#qnum').textContent=`${Math.ceil(left/1000)} seconds left · ${S.score} correct`;
    if(left<=0){clearInterval(S.timer);const st=S.score>=20?3:S.score>=13?2:S.score>=6?1:0;const rec=S.score>G.bestThunder;if(rec)G.bestThunder=S.score;if(S.score>=20)award('thunder');
      const tw=thisWeek();if(S.score>tw.th)tw.th=S.score;
      done(st,`You answered ${S.score} facts in 60 seconds.${rec?' That\'s a NEW RECORD!':` Your record: ${G.bestThunder}.`} (3 stars = 20 or more)`)}},100);
}
function nextFlash(){
  const keep=DIFF;DIFF=S.d||2;const q=genFlash();DIFF=keep;q.meta={i:'flash'};S.q=q;S.locked=false;$('#prompt').innerHTML=`<span class="bignum">${q.prompt} = ?</span>`;
  drawChoices(q,b=>{if(S.locked)return;S.locked=true;
    if(b.dataset.v===q.answer){S.score++;S.streak++;b.classList.add('right');sYes();burstAt(b,25);foxMove('hop');setAlt(Math.min(S.score,16)/2);gain(3,1,b);comboUI();const t=today();t.q++;t.c++;thisWeek().c++;checkWeek();
      if(S.score%5===0)say($('#say'),`${S.score} already! Keep zapping!`);setTimeout(nextFlash,260)}
    else{S.streak=0;comboUI();b.classList.add('wrong');sNo();foxMove('wobble');today().q++;[...$('#choices').children].forEach(x=>{if(x.dataset.v===q.answer)x.classList.add('right')});setTimeout(nextFlash,700)}});
}

/* results */
function finishRound(){
  markRound();
  if(S.mode==='lesson')return finishLesson();
  if(S.mode==='test')return finishTest();
  if(G.cls)classRoundDone(S);
  const n=S.qs.length,s=S.score;let st=s===n?3:s>=Math.ceil(n*.66)?2:s>=1?1:0;let extra='',stick=st>=3?.6:st===2?.4:st===1?.2:0;
  if(S.mode==='daily'){
    if(!dailyDone()){G.dstreak=G.lastDaily===yesterdayKey()?G.dstreak+1:1;G.lastDaily=dayKey();gain(REW.daily,5,$('#prompt'));{const k=curStreak();extra=` Daily bonus: +${REW.daily} coins! Streak: ${k} day${k>1?'s':''}!`}stick=1;
      if(G.dstreak>=3)award('daily3');if(G.dstreak>=7)award('daily7')}
    else extra=' (You already got today\'s bonus. Come back tomorrow for a new challenge!)';
  }
  if(S.mode==='place')extra=' '+finishPlacement();
  if(S.mode==='review'){const left=G.review.length;extra=` ${left?`${left} puzzle${left>1?'s':''} will come back on a later day.`:'Your mistake list is empty!'}`}
  if(S.mode==='island'){
    if(s===n)award('perfect');
    if(s===n&&S.d===3){G.hardMaster[S.isl.id]=1;award('hard')}
    const id=S.isl.id,m=rollAcc(id);
    if(st===3&&!mastered(id)&&!(G.best[id]>=3)){st=2;extra+=m.n<MASTER_N?` Almost a 3rd star! Play <b>${MASTER_N-m.n} more</b> puzzles here and keep getting them right to earn it.`:` Almost a 3rd star! It shines when you get <b>8 of 10</b> right here (right now: ${Math.round(m.acc*100)}%).`}
    if(st===3&&!allSkills(id)&&!(G.star3||{})[id]&&!/3rd star/.test(extra)){st=2;extra+=` For the 3rd star, master every skill here: <b>${skillsDone(id)} of ${skillsOf(id).length}</b> done.`}
    if(S.skill){const sk=skillsOf(id).find(x=>x.k===S.skill),m=skStat(S.skill);if(sk)extra+=` <b>${esc(sk.name)}</b>: ${m.st===2?'mastered!':`${m.ok} of ${m.n} right lately (8 of 10 to master).`}`}
    {const have=Math.max(starFor(id),st),tk=have+1;if(tk<=3&&m.n>=4&&!/3rd star/.test(extra)){const k=toTier(id,tk);if(k>0&&k<40)extra+=` Star ${tk} here: <b>${k} more</b> right answer${k>1?'s':''}.`}}
    {const pk=pickToday();if(pk&&pk.id===id){const pd=G.pickDay&&G.pickDay.d===dayKey()?G.pickDay:(G.pickDay={d:dayKey(),done:[],n:{}});pd.n=pd.n||{};pd.done=pd.done||[];pd.n[id]=(pd.n[id]||0)+1;
      if(pd.n[id]>=3&&!pd.done.includes(id)){pd.done.push(id);const nx=pipPick();if(nx&&nx.id!==id)extra+=` Great practice! Pip's Pick now moves to <b>${esc(nx.name)}</b> (×2 coins there).`}}}
    if(G.settings.diff==='auto'&&!S.isl.noDiff){const cur=G.diff[id]||2;
      if(cur<3&&m.n>=MASTER_N&&m.acc>=.85){G.diff[id]=cur+1;G.roll[id]='';extra+=` ${S.isl.name} is now <b>${DIFF_NAME[cur+1]}</b> mode. Bigger challenges, more coins!`}
      else if(cur>1&&m.n>=8&&m.acc<.6){G.diff[id]=cur-1;G.roll[id]='';extra+=` Next time ${S.isl.name} will be <b>${DIFF_NAME[cur-1]}</b> so you can practice and grow.`}}
  }
  done(st,`${s} of ${n} puzzles right on the first try.${extra}`,{sticker:stick});
}
function dropSticker(chance){
  if(!chance)return null;let rar;
  if(chance==='rare')rar=Math.random()<.25?'gold':'rare';
  else{if(Math.random()>chance)return null;const r=Math.random();rar=r<.06?'gold':r<.32?'rare':'common'}
  const evPool=CUR_EV?STK.filter(s=>s.set===CUR_EV.set&&s.rar===rar):[],useEv=evPool.length&&(S&&S.isl&&S.isl.id==='ev'?Math.random()<.85:Math.random()<.3);
  const pool=useEv?evPool:STK.filter(s=>!s.ev&&s.rar===rar),s=pool[Math.floor(Math.random()*pool.length)],dup=!!G.stickers[s.id];
  G.stickers[s.id]=(G.stickers[s.id]||0)+1;if(dup)G.coins+=REW.dup;
  for(const [set,name] of STICKER_SETS)if(!G.setsDone[set]&&STK.filter(x=>x.set===set).every(x=>G.stickers[x.id])){G.setsDone[set]=1;G.coins+=REW.set;award('album');setTimeout(()=>toast(`Set complete: ${name}!`,`+${REW.set} coins!`,'#e2558f'),1500)}
  return {s,dup};
}
function done(st,line,o={}){if(typeof markRound==='function')markRound();
  stopTimers();removeEventListener('keydown',window._keyH||(()=>{}));
  const isl=S.isl,hasStars=STAR_ISLANDS.includes(isl)&&S.chapter==null,prev=G.best[isl.id]||0,newBest=hasStars&&st>prev;
  G.visited[isl.id]=1;G.rounds=(G.rounds||0)+1;award('first');
  if(newBest)G.best[isl.id]=st;
  let bonus=taper(st*REW.star+(newBest?REW.best:0));gain(bonus,st,$('#dstars'));
  const tot=starTotal();if(tot>=20)award('stars20');if(tot>=40)award('stars40');if(tot>=MAX)award('stars60');
  if(STAR_ISLANDS.every(i=>i.special||G.visited[i.id]))award('travel');if(isl.id==='time'&&st===3)award('clock');
  const drop=dropSticker(o.sticker);
  save();updateStats('#starPill');
  $('#dstars').innerHTML=[0,1,2].map(k=>starSVG(k<st)).join('');[...$('#dstars').children].forEach((s,k)=>s.style.animationDelay=(k*0.25)+'s');
  $('#dtitle').textContent=o.title||(st===3?`Sky Captain${G.name?', '+G.name:''}!`:st===2?'Great flying!':st===1?'Nice start!':'Keep practicing!');
  $('#dmsg').innerHTML=(typeof chDone==='function'?chDone():'')+line;if(S.chal&&S.score>S.chal.sc)$('#dtitle').textContent='Challenge won!';
  {const cb=$('#chalBtn');if(cb){cb.hidden=!(typeof chFromRound==='function'&&chFromRound()&&!S.chal);cb.onclick=chOffer}}
  $('#drew').innerHTML=`<div class="pill">${COIN_ICON}<span id="cc">+0</span><small>coins</small></div><div class="pill">${starSVG(true)}<span>+${S.xp}</span><small>XP</small></div>${newBest&&prev>0?'<span class="newbest">New best!</span>':''}`;
  let k=0;const target=S.coins,iv=setInterval(()=>{k=Math.min(target,k+Math.ceil(target/25)||1);const e=$('#cc');if(e)e.textContent='+'+k;if(k>=target)clearInterval(iv)},40);
  $('#dsticker').innerHTML=drop?`<div class="reveal">${stickerSVG(drop.s)}<div><b>${drop.dup?'Double sticker!':'New sticker!'}</b><span>${esc(drop.s.name)} · <span class="r-${drop.s.rar}">${drop.s.rar.toUpperCase()}</span>${drop.dup?' · +10 coins':''}</span></div></div>`:'';
  $('#dbadges').innerHTML=S.badges.map(id=>{const b=BADGES.find(x=>x[0]===id);return `<div class="badge">${MEDAL(b[3])}<span>${b[1]}</span></div>`}).join('');
  const sugg=STAR_ISLANDS.filter(i=>i.id!==isl.id&&i.gen).sort((a,b)=>starFor(a.id)-starFor(b.id)||(Math.random()-.5))[0];
  const nb=$('#nextIsl');
  if(S.mode==='place'){nb.hidden=false;nb.textContent='Start Story Mode';nb.onclick=openStory}
  else if(S.chapter!=null){nb.hidden=false;nb.textContent='Back to Story';nb.onclick=openStory}
  else if(reviewDue().length&&S.mode!=='review'&&isOpen('review')){nb.hidden=false;nb.textContent=`Fix ${reviewDue().length} mistake${reviewDue().length>1?'s':''}`;nb.onclick=()=>start(byId('review'))}
  else if(sugg){nb.hidden=false;nb.textContent=`Next: ${sugg.name}`;nb.onclick=()=>start(sugg)}else nb.hidden=true;
  if(S.mode==='island'&&S.chapter==null&&S.score<=3&&lessonsFor(isl.id).length){nb.hidden=false;nb.textContent='Learn the trick (3 min)';nb.onclick=()=>start(lessonIsland(lessonFor(isl.id)))}
  else if(isl.id==='write'&&S.mode==='island'&&S.chapter==null){nb.hidden=false;nb.textContent='Write my own story';nb.onclick=()=>openDesk()}
  $('#again').hidden=S.mode==='place'||S.mode==='review'&&!reviewDue().length;
  if(typeof stat==='function'){stat('finished');statFlush()}
  show('done');dropBadgeToasts();refreshFoxes();if(typeof guestNudge==='function')setTimeout(guestNudge,1600);
  if(st>0){sWin();setTimeout(()=>burst(innerWidth/2,innerHeight/3,120),300)}
  setTimeout(()=>{foxMove(st>=2?'spin':st>0?'hop':'wobble');if(st===0)foxClass('sad',1500)},400);
  if(S.storyWin!=null){const ch=CHAPTERS[S.storyWin],bk=ch.book||1,B=BOOKS[bk],last=S.storyWin===B.start+3,b2=bk>=2;
    if(last){G.coins+=REW.story;award(bk===3?'story3':bk===2?'story2':'story');save();updateStats('#coinPill')}
    setTimeout(()=>overlay(`<div class="pipbob" data-fox></div><div class="eyebrow">${B.unit[0].toUpperCase()+B.unit.slice(1)} ${S.storyWin-B.start+1} of 4</div>${bookArt(bk,G.story.ch-B.start,true)}<p>${ch.outro}${last?` <b>+${REW.story} coins!</b>`:''}</p><button class="go" type="button" style="align-self:center" onclick="closeOverlay()">Hooray!</button>`,()=>{burst(innerWidth/2,innerHeight/2,160);sWin()}),1200)}
  if(levelOf(G.xp)>S.lv0)setTimeout(()=>showLevelUp(levelOf(G.xp)),1400);
}
function showLevelUp(lv){overlay(`<div class="pipbob" data-fox></div><div class="eyebrow">Level up!</div><h2>Level ${lv+1}</h2><p>You're now a <b>${TITLES[lv]}</b>! Keep flying to unlock the next title.</p><button class="go" type="button" style="align-self:center" onclick="closeOverlay()">Awesome!</button>`,()=>{sLevel();burst(innerWidth/2,innerHeight/2,160);setTimeout(()=>foxMove('spin'),200)})}
$('#again').onclick=()=>{if(S.mode==='boss'&&S.chapter!=null)return startChapterBoss(S.chapter);start(S.isl)};
$('#tomap').onclick=renderMap;
$('#back').onclick=()=>{stopTimers();renderMap()};
document.querySelectorAll('[data-home]').forEach(b=>b.onclick=renderMap);

