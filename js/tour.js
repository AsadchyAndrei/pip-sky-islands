/* Pip's Sky Islands: guided tours. Pip flies around the real screen, lights up one thing at a time and says what it does.
   - "map": the islands, for a new player (and the grown-up next to them), right after the quick check
   - "parent": Parents' Corner, the first time a grown-up opens it
   - "desk" and "class": the teacher desk and a class
   Every tour starts by asking (Show me / Skip), can be left at any step, and can be replayed from "How Pip works"
   (Settings menu, Parents' Corner, teacher desk). */
const TOURS={
  map:{steps:[
    {intro:1,t:"Hi, I'm Pip!",x:"Want a quick tour of the sky islands? It takes one minute.",yes:'Show me around'},
    {el:['#pickCard'],t:"Today's flight plan",x:'Your plan for today: a few short rounds picked just for you. Start here every day!'},
    {el:['.islbox'],t:'Islands',x:'Every island is one school topic. Pick Math or Words & World, then tap an island to play. Win stars on each one!'},
    {el:['#g-ch'],up:'.chbox',t:'Challenges',x:'Quick games that change every day. Great for extra coins!'},
    {el:['#starPill','.stats'],t:'Stars and coins',x:'Stars show how well you know an island. Coins come from right answers.'},
    {el:['#closetBtn','#bnav [data-go="closetBtn"]'],t:'Closet',x:'Spend coins on hats, pets, glasses and balloons. Make Pip look awesome!'},
    {el:['#homeBtn','#bnav [data-go="homeBtn"]'],t:'Your island',x:'Build and decorate your very own island home.'},
    {el:['#rewards','#weekCard'],t:'Rewards',x:'Events, the weekly challenge and your goals live here.'},
    {el:['#parentBtn','#gearBtn'],t:'For grown-ups',x:'Parents: progress, settings and weekly emails, safe behind a PIN.',skip:()=>!!(G.roster||(typeof classDevice==='function'&&classDevice()))},
    {el:['#gearBtn'],t:'Help any time',x:'Open this menu and tap "How Pip works" to see this tour again.'},
    {end:1,t:"You're ready to fly!",x:'Have fun on the islands. I will be right here!'}]},
  parent:{steps:[
    {intro:1,t:"Welcome to Parents' Corner",x:'A 1-minute tour of where to see progress, change settings and get the weekly email?',yes:'Show me'},
    {el:['.kidbar'],t:'One child at a time',x:'Switch between your kids here. Everything below is about the child you pick.'},
    {el:['.ptabs'],t:'Three tabs',x:'Progress, Settings, and Account & data. Most of what you need is on Progress.'},
    {el:['.pfocus'],t:"This week's tip",x:'Pip looks at the week and tells you the one thing that matters most.'},
    {el:[()=>cardWith('This week')],t:'This week',x:'Minutes, puzzles, accuracy and skills mastered, with a printable report for the fridge.'},
    {el:['.fgp'],t:'Family goal',x:'Set a goal for 7 days and a reward you choose. Your child sees it on the map.'},
    {el:[()=>cardWith('Needs practice')],t:'What to practice',x:'The topics that need work, each with a quick idea to try at home.'},
    {el:['.ptabs [data-pt="set"]'],t:'Settings',x:'Players and PINs, the grade and state, a teacher\'s class code, time limits, voice and text size.'},
    {el:['.ptabs [data-pt="acct"]'],t:'Account & data',x:'Weekly email and notifications, daily backups, and your data.'},
    {el:['#pHelp'],t:'How Pip works',x:'Answers to common questions, and this tour again, any time.'},
    {end:1,t:'All set!',x:'Tip: turn on the weekly email in Account & data. It arrives Sunday evening.'}]},
  desk:{steps:[
    {intro:1,t:'Welcome to the teacher desk',x:'A 1-minute tour of how to set up a class and follow progress?',yes:'Show me'},
    {el:['.tclass'],t:'Your classes',x:'Tap a class to see its students, progress and tasks.'},
    {el:[()=>cardOf('#ncName')],t:'Make a class',x:'A name and a grade. You get a class code for families right away.'},
    {el:[()=>cardOf('#coCode')],t:'Co-teaching',x:'Got an invite code from a colleague? Join their class here.'},
    {el:[()=>cardOf('#tnWeekly')],t:'Weekly class email',x:'Sunday evening: who played, who needs help and how tasks are going.'},
    {el:['#tHelp'],t:'How Pip works',x:'The teacher guide and these tours, any time.'},
    {end:1,t:'Ready!',x:'Make your first class and add students. Open a class for its own short tour.'}]},
  class:{steps:[
    {intro:1,t:'Your class',x:'A quick look at the four tabs?',yes:'Show me'},
    {el:['[data-tt="kids"]'],t:'Students',x:'Add names (or import from Google Classroom), print picture login cards, and turn a Chromebook into a class device.'},
    {el:['[data-tt="prog"]'],t:'Progress',x:'Who played, groups by level, skills by island and by standard, and printable family reports.'},
    {el:['[data-tt="tasks"]'],t:'Tasks',x:'Topics you teach now, tasks with due dates, a live lesson mode, and a message to families.'},
    {el:['[data-tt="set"]'],t:'Class settings',x:'Class code, co-teachers, moving to a new school year.'},
    {end:1,t:'Have a great class!',x:'Each tab has small "?" buttons that explain the numbers.'}]}};
const cardWith=t=>[...document.querySelectorAll('.pcard h4')].find(h=>h.textContent.trim().startsWith(t))?.closest('.pcard');
const cardOf=sel=>{const e=document.querySelector(sel);return e&&e.closest('.pcard')};
const tourVisible=e=>{if(!e)return false;const r=e.getBoundingClientRect();return r.width>4&&r.height>4&&getComputedStyle(e).visibility!=='hidden'&&!e.closest('[hidden]')};
function tourEl(s){for(const c of s.el||[]){let e=typeof c==='function'?c():document.querySelector(c);if(e&&s.up&&e.closest(s.up))e=e.closest(s.up);if(tourVisible(e))return e}return null}

/* who has seen which tour: a player (map) or the account (the others); kept on the device and in the account */
const tourKey=id=>'pip-tour-'+(CL.uid||'guest')+'-'+id+(id==='map'?'-'+(ROOT.current||''):'');
function tourSeen(id){if(lsGet(tourKey(id)))return true;if(id==='map')return !!(G.tour&&G.tour.map);return !!(((CL.userDoc||{}).tours||{})[id])}
function tourMark(id){lsSet(tourKey(id),'1');
  if(id==='map'){G.tour=Object.assign({},G.tour,{map:1});save(true);return}
  if(CL.mode==='cloud'){CL.userDoc=Object.assign({},CL.userDoc,{tours:Object.assign({},(CL.userDoc||{}).tours,{[id]:1})});CL.api.setUserDoc({tours:{[id]:1}}).catch(()=>{})}}
/* start a tour on its own the first time (never during automated checks, never over a pop-up) */
function maybeTour(id,delay=900){if(navigator.webdriver&&!window.__tourTest)return;if(tourSeen(id)||TR.on)return;
  clearTimeout(maybeTour.t);maybeTour.t=setTimeout(()=>{if(TR.on||tourSeen(id)||ovOpen)return;const want={map:'map',parent:'parent',desk:'teach',class:'teach'}[id];if(curScreen!==want)return;
    if(id==='class'&&!TC.cur||id==='desk'&&TC.cur)return;startTour(id)},delay)}

const TR={on:false,id:'',i:0,steps:[]};
function startTour(id){const T=TOURS[id];if(!T)return;closeTour(true);
  TR.on=true;TR.id=id;TR.i=0;TR.steps=T.steps.filter(s=>!(s.skip&&s.skip()));
  const L=document.createElement('div');L.id='tourL';L.className='tourL';
  L.innerHTML=`<div class="tspot"></div><div class="tbub" role="dialog" aria-modal="true" aria-labelledby="tbT" aria-describedby="tbX"><i class="tarrow"></i>
    <div class="tpip" data-fox></div><div class="tbody"><div class="tstep" id="tbS"></div><h3 id="tbT"></h3><p id="tbX"></p><div class="tdots" id="tbD"></div>
    <div class="tbtns"><button type="button" class="linkbtn tskip" id="tbSkip">Skip tour</button><span class="tgap"></span><button type="button" class="go small alt" id="tbBack">Back</button><button type="button" class="go small" id="tbNext">Next</button></div></div></div>`;
  document.body.appendChild(L);refreshFoxes();document.body.classList.add('touring');
  $('#tbSkip').onclick=()=>endTour(false);$('#tbBack').onclick=()=>tourGo(TR.i-1,-1);$('#tbNext').onclick=()=>tourGo(TR.i+1,1);
  L.addEventListener('click',e=>{if(e.target===L||e.target.classList.contains('tspot'))$('#tbNext').focus()});
  TR.key=e=>{if(!TR.on)return;if(e.key==='Escape'){e.preventDefault();endTour(false)}else if(e.key==='ArrowRight')tourGo(TR.i+1,1);else if(e.key==='ArrowLeft'&&TR.i>0)tourGo(TR.i-1,-1)};
  TR.re=()=>{if(TR.on)tourPlace()};addEventListener('keydown',TR.key);addEventListener('resize',TR.re);addEventListener('scroll',TR.re,{passive:true,capture:true});
  tourShow()}
function tourGo(i,dir){if(i<0)return;if(i>=TR.steps.length)return endTour(true);TR.i=i;
  const s=TR.steps[i];if(!s.intro&&!s.end&&!tourEl(s))return tourGo(i+dir,dir); // not on this screen: skip it
  tourShow()}
function tourShow(){const s=TR.steps[TR.i],L=$('#tourL');if(!L)return;
  const real=TR.steps.filter(x=>!x.intro&&!x.end),k=real.indexOf(s);
  L.classList.toggle('center',!!(s.intro||s.end));
  $('#tbS').textContent=s.intro?'Quick tour':s.end?'Done':`${k+1} of ${real.length}`;
  $('#tbT').textContent=s.t;$('#tbX').textContent=s.x;
  $('#tbD').innerHTML=s.intro||s.end?'':real.map((_,j)=>`<i class="${j<k?'was':j===k?'now':''}"></i>`).join('');
  $('#tbBack').hidden=!!(s.intro||s.end||k===0);$('#tbSkip').hidden=!!s.end;$('#tbSkip').textContent=s.intro?'Not now':'Skip tour';
  $('#tbNext').textContent=s.intro?(s.yes||'Show me'):s.end?'Done!':k===real.length-1?'Finish':'Next';
  const bub=L.querySelector('.tbub');bub.classList.remove('pop');void bub.offsetWidth;bub.classList.add('pop');
  if(s.end){setTimeout(()=>{const r=bub.getBoundingClientRect();if(typeof burst==='function')burst(r.left+r.width/2,r.top+30,70)},200);if(typeof tone==='function')try{tone([523,659,784],.05)}catch(e){}}
  const el=s.intro||s.end?null:tourEl(s);TR.el=el;
  if(el){const r=el.getBoundingClientRect();if(r.top<70||r.bottom>innerHeight-40)el.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
  tourPlace();const t0=performance.now();cancelAnimationFrame(TR.raf);const follow=()=>{if(!TR.on)return;tourPlace();if(performance.now()-t0<1100)TR.raf=requestAnimationFrame(follow)};TR.raf=requestAnimationFrame(follow);setTimeout(()=>{const n=$('#tbNext');n&&n.focus({preventScroll:true})},60)}
function tourPlace(){const L=$('#tourL');if(!L)return;const sp=L.querySelector('.tspot'),bub=L.querySelector('.tbub'),ar=L.querySelector('.tarrow'),el=TR.el;
  const W=innerWidth,H=innerHeight,bw=Math.min(380,W-24);bub.style.width=bw+'px';
  if(!el||!L.isConnected||L.classList.contains('center')){sp.style.cssText=`left:${W/2}px;top:${H/2}px;width:0;height:0;opacity:0`;bub.style.left=((W-bw)/2)+'px';bub.style.top=Math.max(12,(H-bub.offsetHeight)/2)+'px';ar.hidden=true;return}
  const r=el.getBoundingClientRect(),pad=8,x=Math.max(4,r.left-pad),y=Math.max(4,r.top-pad),w=Math.min(W-8,r.width+pad*2),h=Math.min(H-8,r.height+pad*2);
  sp.style.cssText=`left:${x}px;top:${y}px;width:${w}px;height:${h}px;opacity:1`;
  const bh=bub.offsetHeight,below=H-(y+h),above=y;let top,dir;
  if(below>=bh+18){top=y+h+14;dir='up'}else if(above>=bh+18){top=y-bh-14;dir='down'}else{top=Math.max(12,H-bh-12);dir=''}
  const left=Math.min(W-bw-12,Math.max(12,x+w/2-bw/2));bub.style.left=left+'px';bub.style.top=top+'px';
  ar.hidden=!dir;ar.className='tarrow '+dir;ar.style.left=Math.min(bw-28,Math.max(16,x+w/2-left-8))+'px'}
function endTour(done){const id=TR.id;if(!TR.on)return;tourMark(id);closeTour();if(!done&&id==='map')toast('Tour skipped','Replay it any time: Settings → How Pip works.','#2f9fe0')}
function closeTour(){TR.on=false;const L=$('#tourL');if(L)L.remove();document.body.classList.remove('touring');
  if(TR.key){removeEventListener('keydown',TR.key);removeEventListener('resize',TR.re);removeEventListener('scroll',TR.re,{capture:true})}}

/* "How Pip works": tours to replay and the guide */
function openHelp(sec){const tours=[['map','The islands','For kids and grown-ups: the map, stars, coins and rewards'],['parent',"Parents' Corner",'Progress, family goal, settings and emails']].concat(isTeacher()?[['desk','Teacher desk','Classes, co-teaching and the weekly email'],['class','A class','Students, progress, tasks and settings']]:[]);
  overlay(`<div class="pipbob" data-fox></div><div class="eyebrow">Help</div><h2>How Pip works</h2>
    <div class="trlist">${tours.map(([id,t,d])=>`<button type="button" class="trbtn" data-replay="${id}"><b>${t}</b><small>${d}</small><span class="trgo">Take the tour</span></button>`).join('')}</div>
    <div class="gd" id="gdBox">${guideHTML(sec||(isTeacher()?'teachers':'parents'),true)}</div>
    <div class="btnrow"><button type="button" class="go alt" id="hClose">Close</button></div>`,bindHelp)}
function bindHelp(){$('#hClose').onclick=closeOverlay;
  const bind=()=>{document.querySelectorAll('[data-gd]').forEach(b=>b.onclick=()=>{$('#gdBox').innerHTML=guideHTML(b.dataset.gd,true);bind()});
    document.querySelectorAll('[data-gtour],[data-replay]').forEach(b=>b.onclick=()=>replayTour(b.dataset.gtour||b.dataset.replay))};bind()}
/* replay: go to the right screen first; the screen starts the tour once it is drawn (tourHook) */
function replayTour(id){closeOverlay();TR.pending=id;
  if(id==='map'){if(!ROOT.current){TR.pending='';toast('Pick a player first','Then open How Pip works again.','#2f9fe0');return}if(curScreen==='map')return tourHook('map');renderMap();return}
  if(id==='parent'){if(!ROOT.current){TR.pending='';toast('Pick a player first',"Parents' Corner shows one child at a time.",'#2f9fe0');return}if(curScreen==='parent')return tourHook('parent');openParent();return}
  if(id==='desk'){TC.cur='';openTeach();return}
  if(id==='class'){const c=(TC.classes||[])[0];if(!c){TR.pending='';toast('Make a class first','Then the class tour can show its tabs.','#2f9fe0');return}if(!TC.cur)TC.cur=c.cid;TC.tab='prog';openTeach(TC.cur)}}
/* called when a screen has been drawn */
function tourHook(id){if(TR.pending===id){TR.pending='';setTimeout(()=>startTour(id),550);return}
  if(id==='map'&&document.body.classList.contains('newbie'))return;maybeTour(id)}
