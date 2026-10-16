/* Pip's Sky Islands: the map opens step by step for a new player, so the first day has one clear path
   (quick check → story → islands) and something new shows up every few days.
   - a locked place shows as a mystery card with what opens it; tapping it tells the child how close they are
   - when it opens: a small celebration with Pip, once, and the card glows on the map
   - never locked: players who already got there (checked silently the first time, so nothing changes for them),
     class devices, the demo, places a teacher's task points to, and anyone whose parent chose "Show everything now" */
const roundsPlayed=()=>Math.max(G.rounds||0,Object.keys(G.visited||{}).filter(k=>k!=='placement').length);
const UNLOCKS=[
  {id:'review',met:()=>((G.review||[]).length>0||(G.fixedSeeds||[]).length>0)&&roundsPlayed()>=2,
    left:()=>roundsPlayed()<2?'Opens after your next round':'Opens when a puzzle tricks you',
    t:'Fix-It Falls',x:'Puzzles that tricked you wait here. Fix them and they are gone for good, and your brain gets stronger!',go:'Fix them now'},
  {id:'albumBtn',met:()=>Object.keys(G.stickers||{}).length>0,
    t:'Sticker Album',x:'You won your first sticker! Great rounds win more. Finish a whole set for bonus coins.',go:'Open my album'},
  {id:'flash',met:()=>roundsPlayed()>=4||!!(G.visited||{}).flash||!!G.bestThunder,
    left:()=>{const k=Math.max(1,4-roundsPlayed());return `Opens after ${k} more round${k>1?'s':''}`},
    t:'Thunder Tower',x:'A 60-second storm of quick facts. How many can you zap before the thunder stops?',go:'Try it now'},
  {id:'ptest',met:()=>starTotal()>=6||(G.tests||[]).length>0,
    left:()=>{const k=Math.max(1,6-starTotal());return `Opens with ${k} more star${k>1?'s':''}`},
    t:'Test Practice',x:'12 questions just like the real spring test, in math or English. Great practice for the big day!',go:'Try it now'}];
const unlockOf=id=>UNLOCKS.find(u=>u.id===id);
const allOpen=()=>!!(G&&(G.settings.showAll||G.roster||window.PIP_DEMO));
/* a teacher's task that points to a place opens it */
function taskOpens(id){try{return !!(G.cls&&typeof openTasks==='function'&&openTasks().some(t=>(t.isl||[]).includes(id)))}catch(e){return false}}
let unlockQueue=[];const unlockFresh=new Set();
/* first look at a player: whoever is past the first days keeps the map exactly as it was */
function unlockInit(){if(G.unl&&typeof G.unl==='object')return;G.unl={};
  const veteran=roundsPlayed()>=4||starTotal()>=6||levelOf(G.xp||0)>=3;
  UNLOCKS.forEach(u=>{if(veteran||u.met())G.unl[u.id]=1});save(true)}
/* is this place open? (opens it on the spot when its moment has come; the celebration waits for the map) */
/* well past every step (a profile that arrived from the cloud or another device after a first look): all open, quietly */
const wellPast=()=>roundsPlayed()>=12||starTotal()>=15||levelOf(G.xp||0)>=5;
function isOpen(id){const u=unlockOf(id);if(!u)return true;unlockInit();if(G.unl[id])return true;
  if(wellPast()){UNLOCKS.forEach(x=>G.unl[x.id]=1);save(true);return true}
  if(u.met()){G.unl[id]=1;save(true);if(!allOpen()&&!unlockQueue.includes(id))unlockQueue.push(id);return true}
  return allOpen()||taskOpens(id)}
let unlockWho='';
function unlockCheck(){if(unlockWho!==ROOT.current){unlockWho=ROOT.current;unlockQueue=[];unlockFresh.clear()} // celebrations belong to one player
  UNLOCKS.forEach(u=>isOpen(u.id))}
/* the mystery card */
const FOG_ART=`<ellipse cx="62" cy="58" rx="24" ry="17" fill="#fff"/><ellipse cx="96" cy="56" rx="26" ry="19" fill="#fff"/><ellipse cx="80" cy="44" rx="25" ry="21" fill="#fff"/><text x="80" y="66" font-size="36" font-family="Lilita One,Baloo 2,system-ui,sans-serif" text-anchor="middle" fill="#7b6cf0" stroke="#1f3557" stroke-width="1.4">?</text>`;
function teaserCard(isl,i){const u=unlockOf(isl.id);
  return `<button class="isle locked teaser" type="button" data-id="${isl.id}" data-teaser="1" style="--d:${-(i%7)*0.6}s" aria-label="A secret island: ${esc(u.left())}">
    ${islandSVG('#c9cfe3',FOG_ART)}<span class="plaque"><b>Secret island</b><small>${esc(u.left())}</small><span class="status lock">${LOCK}Coming soon</span></span></button>`}
function teaserTap(id){const u=unlockOf(id);say($('#maptext'),`That island is still a <b>secret</b>! ${esc(u.left())}. Keep flying!`);$('#mapact').hidden=true;foxMove('hop');tone([440,523]);scrollTo({top:0,behavior:'smooth'})}
/* the album tab appears with the first sticker */
function unlockNav(){document.body.classList.toggle('lk-album',!isOpen('albumBtn'))}
/* one celebration at a time, on the map, never on top of a pop-up or a guided tour */
function unlockCelebrate(delay=1600){clearTimeout(unlockCelebrate.t);if(!unlockQueue.length)return;
  unlockCelebrate.t=setTimeout(()=>{if(curScreen!=='map'||!unlockQueue.length)return;
    if(ovOpen||(typeof TR!=='undefined'&&TR.on)){if(delay<30000)unlockCelebrate(delay+1500);return}
    const id=unlockQueue.shift(),u=unlockOf(id);
    if(id!=='albumBtn'&&(G.visited||{})[id])return unlockCelebrate(400); // already found it on their own
    unlockFresh.add(id);
    overlay(`<div class="pipbob" data-fox></div><div class="eyebrow">New on the map!</div><h2>${u.t}</h2><p>${u.x}</p><div class="btnrow"><button class="go" type="button" id="unGo">${u.go}</button><button class="go alt small" type="button" id="unLater">Later</button></div>`,()=>{burst(innerWidth/2,innerHeight/3,90);sWin()});
    $('#unGo').onclick=()=>{closeOverlay();unlockQueue=[];if(id==='albumBtn')return openAlbum();start(byId(id))};
    $('#unLater').onclick=()=>{closeOverlay();renderMap()}},delay)}
