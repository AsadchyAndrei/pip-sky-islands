/* Pip's Sky Islands: guided tours. Pip flies around the real screen, lights up one thing at a time and says what it does.
   - "map":    the sky islands, for a new player (and the grown-up next to them), right after the quick check
   - "play":   a round on an island (the question, read aloud, How?, coins), the first time a player starts one
   - "parent": Parents' Corner: Progress, then Settings and Account & data
   - "desk":   the teacher desk;  "class": inside a class, tab by tab (students, progress, tasks, settings)
   Every tour asks first (Show me / Not now), can be left at any step (Skip tour, Esc), and can be replayed from
   "How Pip works" (Settings menu, Parents' Corner, teacher desk). Some steps ask the player to tap the lit-up
   button themselves. Kids get 20 coins the first time they finish the islands tour. */
const tTab=t=>()=>{if(typeof TC!=='undefined'&&TC.tab!==t){TC.tab=t;TC.autoTab=0;renderTeach()}};
const pTabGo=t=>()=>{const b=document.querySelector(`.ptabs [data-pt="${t}"]`);if(b&&b.getAttribute('aria-selected')!=='true')b.click()};
const firstVisible=sel=>[...document.querySelectorAll(sel)].find(e=>tourVisible(e));
const TOUR_COINS=20;
const TOURS={
  map:{title:'The sky islands',who:'kids',steps:[
    {intro:1,t:"Hi, I'm Pip!",x:`Want a quick tour of the sky islands? Finish it and I'll give you ${TOUR_COINS} coins!`,yes:'Show me around'},
    {el:['#pickCard'],t:"Today's flight plan",x:'Your plan for today: a few short rounds picked just for you. Start here every day!'},
    {el:['.islbox'],t:'The islands',x:'Every island is one school topic. Play an island to win up to 3 stars.'},
    {el:[()=>firstVisible('.islbox .isle')],t:'An island',x:'The stars show how well you did. The bar shows its skills: yellow = practicing, green = mastered. The little icon tells which Wonder resource its missions give.'},
    {el:['.islbox [data-tab="world"]'],act:1,t:'Your turn: tap it!',x:'Tap "Words & World" to see the reading, writing, science and history islands.',done:'Great!'},
    {el:['.islbox [data-tab="math"]'],act:1,t:'And back to Math',x:'Tap "Math" to go back. You can switch any time.'},
    {el:['#g-ch'],up:'.chbox',t:'Challenges',x:'Quick games that change every day: fix old mistakes, beat the clock, defeat the boss! Secret ones open as you play.'},
    {el:['.lvl'],t:'Your level',x:'Every right answer gives you points. Fill the bar to reach the next level.'},
    {el:['#coinPill','.stats'],t:'Coins',x:'Coins come from right answers. Spend them in the Closet and on your island.'},
    {el:['#starPill'],t:'Stars',x:'All your island stars. Some islands open when you have enough stars.'},
    {el:['#streakPill'],t:'Day streak',x:'Finish at least one round every day to grow your streak!'},
    {el:['#storyBtn','#bnav [data-go="storyBtn"]'],t:'Story Mode',x:'Follow Pip through a story, chapter by chapter, and beat the bosses.'},
    {el:['#albumBtn','#bnav [data-go="albumBtn"]'],t:'Sticker Album',x:'Collect stickers for great rounds. Can you fill the whole album?'},
    {el:['#closetBtn','#bnav [data-go="closetBtn"]'],t:'Closet',x:'Hats, pets, glasses, balloons: make Pip look awesome!'},
    {el:['#homeBtn','#bnav [data-go="homeBtn"]'],t:'Your island',x:'Build and decorate your very own island home.'},
    {el:['#rewards','#weekCard'],t:'Rewards',x:'Events, the weekly challenge and your goals live here.'},
    {el:['#playerBtn'],t:'Who is playing?',x:'Tap your name to switch to another player.',skip:()=>Object.keys(ROOT.profiles||{}).length<2},
    {el:['#parentBtn','#gearBtn'],t:'For parents',x:'Parents: progress, settings and weekly emails, safe behind a PIN.',skip:()=>!!(G.roster||(typeof classDevice==='function'&&classDevice()))},
    {el:['#gearBtn'],t:'Help any time',x:'Open this menu and tap "How Pip works" to see this tour again.'},
    {end:1,t:"You're ready to fly!",x:'Have fun on the islands. I will be right here!'}]},
  play:{title:'Playing a round',who:'kids',steps:[
    {intro:1,t:'Your first round!',x:'Want me to show you how a round works? It only takes a moment.',yes:'Show me'},
    {el:['#card'],t:'The puzzle',x:'Read the question carefully. Take your time, there is no clock here.'},
    {el:['#choices','#kpad','.kpad'],t:'Your answer',x:'Tap an answer, or type it on the keypad.'},
    {el:['#speakBtn'],t:'Read it to me',x:'Tap the speaker and I will read the question out loud.'},
    {el:['#howBtn'],t:'How?',x:'Stuck? Tap How? for a hint. No worries, everyone needs help sometimes.'},
    {el:['#dots'],t:'Your progress',x:'One dot for each puzzle. Green means right on the first try!'},
    {el:['#pcoins'],t:'Your coins',x:'Every right answer adds coins here. Several in a row give even more!'},
    {el:['#back'],t:'Back to the map',x:'Need a break? This button takes you back.'},
    {end:1,t:'Go for it!',x:'Good luck! I believe in you.'}]},
  parent:{title:"Parents' Corner",who:'parents',start:pTabGo('prog'),steps:[
    {intro:1,t:"Welcome to Parents' Corner",x:'A 2-minute tour of progress, settings and the weekly email?',yes:'Show me'},
    {need:()=>Object.values(ROOT.profiles||{}).filter(p=>!p.roster).length>1,el:['.kidbar'],t:'One child at a time',x:'Switch between your kids here. Everything below is about the child you pick.'},
    {el:['.ptabs'],t:'Three tabs',x:'Progress, Settings, and Account & data.'},
    {ch:'Progress',go:pTabGo('prog'),el:['.pfocus'],t:'The week at a glance',x:'How much your child played, what is going well, and the one topic to practice next.'},
    {ch:'Progress',el:[()=>cardWith('This week')],t:'This week',x:'Minutes, puzzles, accuracy and skills mastered. The "?" buttons explain each number. Print the report for the fridge.'},
    {ch:'Progress',need:()=>!!G.cls,el:[()=>cardWith('From ')],t:'From the teacher',x:'Messages and tasks from your child\'s teacher, when you join a class.'},
    {ch:'Progress',el:['.fgp'],t:'Family goal',x:'Set a goal for 7 days and a reward you choose. Your child sees it on the map.'},
    {ch:'Progress',el:[()=>cardWith('Needs practice')],t:'What to practice',x:'The topics that need work, each with a quick idea to try at home.'},
    {ch:'Progress',el:[()=>cardWith('Last 8 weeks')],t:'Last 8 weeks',x:'Minutes and accuracy week by week: see the trend at a glance.'},
    {ch:'Settings',go:pTabGo('set'),el:[()=>cardWith('Players')],t:'Players and PINs',x:'Add a child, remove one, or change the Parents PIN. A player can have their own PIN too.'},
    {ch:'Settings',el:[()=>cardWith('Settings for ')],t:'Settings for your child',x:'The grade and state, a daily goal, a time limit, difficulty, Pip\'s voice and easier reading.'},
    {ch:'Settings',el:[()=>cardWith("Join a teacher's class"),()=>cardWith("Teacher's class")],t:"A teacher's class",x:'Got a class code from the teacher? Type it here. The teacher then sees progress and can send tasks.'},
    {ch:'Account',go:pTabGo('acct'),need:()=>CL.mode==='cloud',el:[()=>cardWith('Emails and notifications')],t:'Weekly email',x:'A Sunday email about your child, reminders, and notifications on this device. Turn them on here.'},
    {ch:'Account',need:()=>CL.mode==='cloud',el:[()=>cardWith('Backups for ')],t:'Backups',x:'A copy every day for 30 days. Restore it if something goes wrong.'},
    {ch:'Account',go:pTabGo('acct'),el:[()=>cardWith('Account and saving')],t:'Your account',x:'Sign out, download all your data, or delete the account.'},
    {go:pTabGo('prog'),el:['#pHelp'],t:'How Pip works',x:'Answers to common questions, and every tour again, any time.'},
    {end:1,t:'All set!',x:'Tip: turn on the weekly email in Account & data. It arrives Sunday evening.'}]},
  desk:{title:'Teacher desk',who:'teachers',steps:[
    {intro:1,t:'Welcome to the teacher desk',x:'A 1-minute tour of how to set up a class and follow progress?',yes:'Show me'},
    {el:['.tclass'],t:'Your classes',x:'Tap a class to see its students, progress and tasks. Each class has its own short tour.'},
    {el:[()=>cardOf('#ncName')],t:'Make a class',x:'A name and a grade. You get a class code for families right away.'},
    {el:[()=>cardOf('#coCode')],t:'Co-teaching',x:'Got an invite code from a colleague? Join their class here.'},
    {el:[()=>cardOf('#tnWeekly')],t:'Weekly class email',x:'Sunday evening: who played, who needs help and how tasks are going.'},
    {el:['#tBack'],t:'Your own kids',x:'Have kids of your own? They play under "My own kids", apart from your classes.'},
    {el:['#tHelp'],t:'How Pip works',x:'The teacher guide and these tours, any time.'},
    {end:1,t:'Ready!',x:'Make your first class, or open one for its tour.'}]},
  class:{title:'Inside a class',who:'teachers',steps:[
    {intro:1,t:'Your class',x:'A 2-minute tour, tab by tab?',yes:'Show me'},
    {ch:'Students',go:tTab('kids'),el:['[data-tt="kids"]'],t:'Students',x:'Everyone in the class: on classroom devices, and from home.'},
    {ch:'Students',el:[()=>cardOf('#addNames')],t:'Add students',x:'Type first names, or paste a column from a spreadsheet. "Rivera, Maya" becomes "Maya R."'},
    {ch:'Students',el:['#gcImp'],t:'Google Classroom',x:'Or import the names from a Google Classroom class.'},
    {ch:'Students',need:()=>rosterOf(TC.cur).length>0,el:['#cardsGo'],t:'Login cards',x:'Print a card per student: they log in by tapping their name and two pictures. No passwords.'},
    {ch:'Students',need:()=>rosterOf(TC.cur).length>0,el:['#devGo'],t:'A class device',x:'On a Chromebook or iPad, this shows only your class\'s names. A PIN keeps students out of the teacher desk.'},
    {ch:'Students',el:[()=>cardWith('Students who joined from home')],t:'From home',x:'Families join with the class code. Share it in Google Classroom with one tap.'},
    {ch:'Progress',go:tTab('prog'),el:['.csum'],t:'This week',x:'Who played, minutes, accuracy, and reminders about overdue tasks.'},
    {ch:'Progress',el:[()=>{const g=document.querySelector('.grps');return g&&g.closest('.pcard')}],t:'Groups',x:'Needs help, on track, ahead. Send a group a task in one click.'},
    {ch:'Progress',el:[()=>{const t=document.querySelector('table.heat:not(.stdt)');return t&&t.closest('.pcard')}],t:'Every student, every island',x:'Red needs help, yellow is practicing, green is mastered. Tap a name for a student card, an island for its skills.'},
    {ch:'Progress',el:[()=>cardWith('Where the class needs help')],t:'Where the class needs help',x:'The skills most students have not mastered. "Assign practice" sends a task to the ones who need it.'},
    {ch:'Progress',el:[()=>cardWith('Reports for families')],t:'Family reports',x:'One printable page per student, with ideas to try at home. Great for conferences.'},
    {ch:'Tasks',go:tTab('tasks'),el:[()=>cardWith('In class right now')],t:'In class right now',x:'Mark what you are teaching: every student\'s daily plan practices it first.'},
    {ch:'Tasks',el:[()=>cardWith('Lesson mode'),'.lessonlive'],t:'Lesson mode',x:'10 to 30 minutes on 1 to 3 islands, and you see who is playing, live.'},
    {ch:'Tasks',el:[()=>cardWith('Message to families')],t:'Message to families',x:'A short note families see in Parents, and as a notification.'},
    {ch:'Tasks',el:[()=>{const h=document.querySelector('#tNewTask');return h&&h.closest('.pcard')}],t:'Tasks',x:'Islands to play by a due date, for the class or chosen students. See who is done.'},
    {ch:'Settings',go:tTab('set'),el:[()=>cardWith('Class code')],t:'Class code',x:'Families use it to join. Make a new one if it leaks.'},
    {ch:'Settings',el:[()=>cardWith('Co-teachers')],t:'Co-teachers',x:'Invite a colleague, specialist or aide to see progress and send tasks.'},
    {ch:'Settings',el:[()=>cardWith('New school year')],t:'New school year',x:'Move the whole class up a grade in one tap. Last year\'s stars stay saved.'},
    {go:tTab('prog'),end:1,t:'Have a great class!',x:'Small "?" buttons on the Progress tab explain the numbers.'}]}};
const cardWith=t=>[...document.querySelectorAll('.pcard h4')].find(h=>h.textContent.trim().startsWith(t))?.closest('.pcard');
const cardOf=sel=>{const e=document.querySelector(sel);return e&&e.closest('.pcard')};
const tourVisible=e=>{if(!e)return false;const r=e.getBoundingClientRect();return r.width>4&&r.height>4&&getComputedStyle(e).visibility!=='hidden'&&!e.closest('[hidden]')};
function tourEl(s){for(const c of s.el||[]){let e=typeof c==='function'?c():document.querySelector(c);if(e&&s.up&&e.closest(s.up))e=e.closest(s.up);if(tourVisible(e))return e}return null}

/* who has seen which tour: a player (map, play) or the account (the others); kept on the device and in the account */
const kidTour=id=>id==='map'||id==='play';
const tourKey=id=>'pip-tour-'+(CL.uid||'guest')+'-'+id+(kidTour(id)?'-'+(ROOT.current||''):'');
function tourSeen(id){if(lsGet(tourKey(id)+'-again'))return false;if(lsGet(tourKey(id)))return true;if(kidTour(id))return !!(G.tour&&G.tour[id]);return !!(((CL.userDoc||{}).tours||{})[id])}
function tourMark(id){lsSet(tourKey(id),'1');try{localStorage.removeItem(tourKey(id)+'-again')}catch(e){}
  if(kidTour(id)){G.tour=Object.assign({},G.tour,{[id]:1});save(true);return}
  if(CL.mode==='cloud'){CL.userDoc=Object.assign({},CL.userDoc,{tours:Object.assign({},(CL.userDoc||{}).tours,{[id]:1})});CL.api.setUserDoc({tours:{[id]:1}}).catch(()=>{})}}
function tourUnmark(id){lsSet(tourKey(id)+'-again','1')} // show it again (on this device), whatever the saved progress says
/* start a tour on its own the first time (never during automated checks; it waits for pop-ups to close) */
const TOUR_SCREEN={map:'map',play:'play',parent:'parent',desk:'teach',class:'teach'};
function maybeTour(id,delay=900){if(navigator.webdriver&&!window.__tourTest)return;if(tourSeen(id)||TR.on)return;
  clearTimeout(maybeTour.t);maybeTour.t=setTimeout(()=>{if(TR.on||tourSeen(id))return;if(ovOpen){if(delay<20000)maybeTour(id,delay+1500);return}
    if(curScreen!==TOUR_SCREEN[id])return;if(id==='class'&&!TC.cur||id==='desk'&&TC.cur)return;startTour(id)},delay)}

const TR={on:false,id:'',i:0,steps:[]};
function startTour(id){const T=TOURS[id];if(!T)return;closeTour();if(T.start)T.start();
  TR.on=true;TR.id=id;TR.i=0;TR.scr=curScreen;TR.steps=T.steps.filter(s=>!(s.skip&&s.skip())&&!(s.need&&!s.need())).map(s=>Object.assign({},s));
  /* a tour that stays on one screen: leave out what this screen does not have (so "3 of 12" is right from the start) */
  if(!TR.steps.some(s=>s.go))TR.steps.forEach(s=>{if(!s.intro&&!s.end&&!tourEl(s))s._gone=1});TR.chs=[...new Set(TR.steps.filter(s=>s.ch).map(s=>s.ch))];
  const L=document.createElement('div');L.id='tourL';L.className='tourL';
  L.innerHTML=`<div class="tspot"></div><i class="tblk"></i><i class="tblk"></i><i class="tblk"></i><i class="tblk"></i><div class="tbub" role="dialog" aria-modal="true" aria-labelledby="tbT" aria-describedby="tbX"><i class="tarrow"></i>
    <div class="tpip" data-fox></div><div class="tbody"><div class="tstep" id="tbS"></div><h3 id="tbT"></h3><p id="tbX"></p><div class="tdots" id="tbD"></div>
    <div class="tbtns"><button type="button" class="linkbtn tskip" id="tbSkip">Skip tour</button><span class="tgap"></span><button type="button" class="go small alt" id="tbBack">Back</button><button type="button" class="go small" id="tbNext">Next</button></div></div></div>`;
  document.body.appendChild(L);refreshFoxes();document.body.classList.add('touring');
  $('#tbSkip').onclick=()=>endTour(false);$('#tbBack').onclick=()=>tourGo(TR.i-1,-1);$('#tbNext').onclick=()=>tourGo(TR.i+1,1);
  L.addEventListener('click',e=>{if(e.target===L||e.target.classList.contains('tspot')||e.target.classList.contains('tblk')){const b=L.querySelector('.tbub');b.classList.remove('nudge');void b.offsetWidth;b.classList.add('nudge');$('#tbNext').focus()}});
  TR.key=e=>{if(!TR.on||ovOpen)return;
    if(e.key==='Tab'){const B=[...document.querySelectorAll('#tourL .tbtns button')].filter(b=>!b.hidden);if(!B.length)return;e.preventDefault();e.stopPropagation(); // keep the keyboard inside the bubble
      const k=B.indexOf(document.activeElement);B[(k+(e.shiftKey?-1:1)+B.length)%B.length].focus();return}
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();endTour(false);return}
    if(e.key==='ArrowRight'){e.stopPropagation();tourGo(TR.i+1,1);return}if(e.key==='ArrowLeft'&&TR.i>0){e.stopPropagation();tourGo(TR.i-1,-1);return}
    if(e.key!=='Enter'&&e.key!==' ')e.stopPropagation()}; // the game's own keys (answers, hints) wait until the tour is over
  clearInterval(TR.tick);TR.tick=setInterval(()=>{const L=$('#tourL');if(!TR.on||!L){clearInterval(TR.tick);return}
    if(curScreen!==TR.scr){tourMark(TR.id);closeTour();return}L.style.display=ovOpen?'none':'';if(!ovOpen)tourPlace()},400);
  TR.re=()=>{if(TR.on)tourPlace()};addEventListener('keydown',TR.key,true);addEventListener('resize',TR.re);addEventListener('scroll',TR.re,{passive:true,capture:true});
  tourShow()}
/* go to step i; a step may first switch a tab (go), and is skipped when its thing is not on this screen */
function tourGo(i,dir){if(!TR.on||i<0)return;if(i>=TR.steps.length)return endTour(true);const s=TR.steps[i];TR.i=i;
  const run=()=>{if(!TR.on||TR.i!==i)return;if(!s.intro&&!s.end&&!tourEl(s)){if(s.go&&!s._tried){s._tried=1;return setTimeout(run,350)}s._gone=1;return tourGo(i+dir,dir)}s._gone=0;tourShow()};
  if(s.go){s.go();setTimeout(run,260)}else run()}
function tourShow(){const s=TR.steps[TR.i],L=$('#tourL');if(!L)return;
  const real=TR.steps.filter(x=>!x.intro&&!x.end&&!x._gone),k=real.indexOf(s),n=real.length; // steps not on this screen are not counted
  L.classList.toggle('center',!!(s.intro||s.end));L.classList.toggle('act',!!s.act);
  $('#tbS').textContent=s.intro?`Quick tour · ${n} stops`:s.end?'Done':`${s.ch?s.ch+' · ':''}${k+1} of ${n}`;
  $('#tbT').textContent=s.t;$('#tbX').textContent=s.x;if(typeof autoSay==='function')autoSay(s.t+'. '+s.x,false);
  $('#tbD').innerHTML=s.intro||s.end?'':n>12?`<span class="tbar"><i style="width:${Math.round((k+1)/n*100)}%"></i></span>`:real.map((_,j)=>`<i class="${j<k?'was':j===k?'now':''}"></i>`).join('');
  if(TR.chs.length>1&&!s.intro&&!s.end)$('#tbD').insertAdjacentHTML('beforeend',`<span class="tchs">${TR.chs.map(c=>`<b class="${c===s.ch?'on':''}">${c}</b>`).join('')}</span>`);
  $('#tbBack').hidden=!!(s.intro||s.end||k===0);$('#tbSkip').hidden=!!s.end;$('#tbSkip').textContent=s.intro?'Not now':'Skip tour';
  $('#tbNext').textContent=s.intro?(s.yes||'Show me'):s.end?'Done!':s.act?'Skip this step':k===n-1?'Finish':'Next';
  $('#tbNext').classList.toggle('alt',!!s.act);
  const bub=L.querySelector('.tbub');bub.classList.remove('pop');void bub.offsetWidth;bub.classList.add('pop');
  if(s.end){setTimeout(()=>{const r=bub.getBoundingClientRect();if(typeof burst==='function')burst(r.left+r.width/2,r.top+30,70)},200);try{if(typeof tone==='function')tone([523,659,784],.05)}catch(e){}}
  const el=s.intro||s.end?null:tourEl(s);TR.el=el;
  if(TR.actOff){TR.actOff();TR.actOff=null}
  if(el&&s.act){const h=()=>{if(TR.actOff){TR.actOff();TR.actOff=null}try{tone([660,880],.05)}catch(e){}$('#tbT').textContent=s.done||'Nice!';setTimeout(()=>{if(TR.on&&TR.steps[TR.i]===s)tourGo(TR.i+1,1)},650)};
    el.addEventListener('click',h);TR.actOff=()=>el.removeEventListener('click',h)}
  if(el){const r=el.getBoundingClientRect(),beh=matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
    if(r.height>innerHeight*.55)scrollBy({top:r.top-Math.min(90,innerHeight*.12),behavior:beh}); // a tall box: show its top, the bubble sits lower
    else if(r.top<70||r.bottom>innerHeight-40)el.scrollIntoView({block:'center',behavior:beh})}
  tourPlace();const t0=performance.now();cancelAnimationFrame(TR.raf);const follow=()=>{if(!TR.on)return;tourPlace();if(performance.now()-t0<1100)TR.raf=requestAnimationFrame(follow)};TR.raf=requestAnimationFrame(follow);
  setTimeout(()=>{const n=$('#tbNext');n&&n.focus({preventScroll:true})},60)}
function tourPlace(){const L=$('#tourL');if(!L)return;const sp=L.querySelector('.tspot'),bub=L.querySelector('.tbub'),ar=L.querySelector('.tarrow'),B=L.querySelectorAll('.tblk');
  const s=TR.steps[TR.i];if(TR.el&&!TR.el.isConnected&&s&&!s.intro&&!s.end)TR.el=tourEl(s); // the screen was redrawn: find the element again
  const el=TR.el,W=innerWidth,H=innerHeight-(document.body.classList.contains('demo')?(W<641?120:70):0),bw=Math.min(380,W-24); // keep clear of the demo ribbonbub.style.width=bw+'px';
  if(!el||!L.isConnected||L.classList.contains('center')){sp.style.cssText=`left:${W/2}px;top:${H/2}px;width:0;height:0;opacity:0`;B.forEach(b=>b.style.cssText='display:none');bub.style.left=((W-bw)/2)+'px';bub.style.top=Math.max(12,(H-bub.offsetHeight)/2)+'px';ar.hidden=true;return}
  const r=el.getBoundingClientRect(),pad=8,x=Math.max(4,r.left-pad),y=Math.max(4,r.top-pad),w=Math.min(W-8,r.width+pad*2),h=Math.min(H-8,r.height+pad*2);
  sp.style.cssText=`left:${x}px;top:${y}px;width:${w}px;height:${h}px;opacity:1`;
  /* on "tap it yourself" steps only the lit-up thing can be tapped: four blocks cover the rest */
  if(s&&s.act){const R=[[0,0,W,y],[0,y+h,W,H-y-h],[0,y,x,h],[x+w,y,W-x-w,h]];B.forEach((b,k)=>{const q=R[k];b.style.cssText=`display:block;left:${q[0]}px;top:${q[1]}px;width:${Math.max(0,q[2])}px;height:${Math.max(0,q[3])}px`})}
  else B.forEach(b=>b.style.cssText='display:none');
  const bh=bub.offsetHeight,below=H-(y+h),above=y,rightS=W-(x+w),leftS=x;let top,left,dir;
  const vy=Math.min(H-bh-12,Math.max(12,y+Math.min(h,H-y)/2-bh/2)); // beside the box, level with its visible middle
  if(below>=bh+18){top=y+h+14;dir='up'}else if(above>=bh+18){top=y-bh-14;dir='down'}
  else if(rightS>=bw+26){left=x+w+14;top=vy;dir='left'}else if(leftS>=bw+26){left=x-bw-14;top=vy;dir='right'}
  else{top=Math.max(12,H-bh-12);dir=''} // no room anywhere: at the bottom, over the lower part of a big box
  if(left==null)left=Math.min(W-bw-12,Math.max(12,x+w/2-bw/2));bub.style.left=left+'px';bub.style.top=top+'px';
  ar.hidden=!dir;ar.className='tarrow '+dir;
  if(dir==='up'||dir==='down'){ar.style.left=Math.min(bw-28,Math.max(16,x+w/2-left-8))+'px';ar.style.top=''}
  else if(dir){ar.style.top=Math.min(bh-28,Math.max(16,y+Math.min(h,H-y)/2-top-8))+'px';ar.style.left=''}}
function endTour(done){const id=TR.id;if(!TR.on)return;const T=TOURS[id];tourMark(id);const back=done&&TR.steps[TR.steps.length-1].go;closeTour();if(back)back();
  if(done&&id==='map'&&!G.tourCoins){G.tourCoins=1;G.coins+=TOUR_COINS;save();updateStats('#coinPill');toast(`+${TOUR_COINS} coins!`,'Thanks for touring the sky islands with Pip.','#ffc23d')}
  else if(!done&&T.who==='kids')toast('Tour skipped','Replay it any time: Settings → How Pip works.','#2f9fe0')}
function closeTour(){TR.on=false;clearInterval(TR.tick);cancelAnimationFrame(TR.raf);if(TR.actOff){TR.actOff();TR.actOff=null}
  const L=$('#tourL');if(L)L.remove();document.body.classList.remove('touring');
  if(TR.key){removeEventListener('keydown',TR.key,true);removeEventListener('resize',TR.re);removeEventListener('scroll',TR.re,{capture:true})}}

/* "How Pip works": tours to replay (with a check for the ones already seen) and the guide */
const teachTours=()=>isTeacher()&&(!classDevice()||curScreen==='teach');
const canTour=id=>kidTour(id)||id==='parent'?true:teachTours();
function openHelp(sec){const list=[['map','The sky islands','The map, stars, coins, Closet and rewards','1 min'],['play','Playing a round','The puzzle, read aloud, How? and coins','next round'],['parent',"Parents' Corner",'Progress, family goal, settings and emails','2 min']]
    .concat(teachTours()?[['desk','Teacher desk','Classes, co-teaching and the weekly email','1 min'],['class','Inside a class','Students, progress, tasks and settings, tab by tab','2 min']]:[]);
  overlay(`<div class="pipbob" data-fox></div><div class="eyebrow">Help</div><h2>How Pip works</h2><p class="note">Pick a tour: Pip lights up each button and tells you what it does.</p>
    <div class="trlist">${list.map(([id,t,d,len])=>`<button type="button" class="trbtn${tourSeen(id)?' seen':''}" data-replay="${id}"><b>${t}</b><small>${d}</small><span class="trrow"><span class="trgo">${tourSeen(id)?'✓ Seen · again':'Take the tour'}</span><em>${len}</em></span></button>`).join('')}</div>
    <div class="gd" id="gdBox">${guideHTML(sec||(isTeacher()?'teachers':'parents'),canTour)}</div>
    <div class="btnrow"><button type="button" class="go alt" id="hClose">Close</button></div>`,bindHelp)}
function bindHelp(){$('#hClose').onclick=closeOverlay;
  const bind=()=>{document.querySelectorAll('[data-gd]').forEach(b=>b.onclick=()=>{$('#gdBox').innerHTML=guideHTML(b.dataset.gd,canTour);bind()});
    document.querySelectorAll('[data-gtour],[data-replay]').forEach(b=>b.onclick=()=>replayTour(b.dataset.gtour||b.dataset.replay))};bind()}
/* replay: go to the right screen first; the screen starts the tour once it is drawn (tourHook) */
function replayTour(id){closeOverlay();TR.pending=id;TR.pendAt=Date.now();
  if(id==='play'){TR.pending='';if(!ROOT.current){toast('Pick a player first','Then open How Pip works again.','#2f9fe0');return}tourUnmark('play');
    toast('Tour on your next round','Open any island: Pip will show you around.','#2f9fe0');return}
  if(id==='map'){if(!ROOT.current){TR.pending='';toast('Pick a player first','Then open How Pip works again.','#2f9fe0');return}if(curScreen==='map')return tourHook('map');renderMap();return}
  if(id==='parent'){if(!ROOT.current){TR.pending='';toast('Pick a player first',"Parents' Corner shows one child at a time.",'#2f9fe0');return}if(curScreen==='parent')return tourHook('parent');openParent();return}
  if(!teachTours()){TR.pending='';return}
  if(id==='desk'){if(curScreen==='teach'&&!TC.cur)return tourHook('desk');teacherGate(()=>{TC.cur='';openTeach()});return}
  if(id==='class'){if(curScreen==='teach'&&TC.cur)return tourHook('class');const c=(TC.classes||[])[0];if(!c){TR.pending='';toast('Make a class first','Then the class tour can show its tabs.','#2f9fe0');return}teacherGate(()=>openTeach(c.cid))}}
/* called when a screen has been drawn */
function tourHook(id){if(TR.pending&&Date.now()-(TR.pendAt||0)>60000)TR.pending=''; // a replay that was not finished (PIN closed) is forgotten
  if(TR.pending===id){TR.pending='';setTimeout(()=>startTour(id),550);return}
  if(id==='map'&&document.body.classList.contains('newbie'))return;maybeTour(id)}
