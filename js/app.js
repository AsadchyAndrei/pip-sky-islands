/* Pip's Sky Islands: Closet, album, story, sign-in, Parents, Writing Desk, my island, the house, home layout, start-up. Loaded in order by index.html; all files share one global scope. */
/* ================= closet ================= */
function openCloset(){
  stopTimers();show('closet');renderCloset();
  if(G.shopNews!=='v2'&&(G.xp||0)>0){G.shopNews='v2';save(true);say($('#csay'),`New in my closet: <b>glasses</b>, <b>balloon decorations</b>, more hats and pets, and super rare <b>Legendary</b> treasures! Look for the <b>NEW</b> tags!`);foxClass('waving',1600);return}
  say($('#csay'),G.coins<100?`My closet! Earn coins by solving puzzles, then come back and dress me up!`:`Ooh, you have <b>${fmt(G.coins)} coins</b>! What should I wear?`);foxClass('waving',1600);
}
const SHOP={basket:{items:()=>BASKETS,list:()=>G.baskets,key:'basket'},char:{items:()=>CHARS,list:()=>G.chars,key:'char'},hat:{items:()=>HATS,list:()=>G.hats,key:'hat'},balloon:{items:()=>BALLOONS,list:()=>G.balloons,key:'balloon'},pet:{items:()=>PETS,list:()=>G.pets,key:'pet'},glass:{items:()=>GLASSES,list:()=>G.glasses,key:'glass'},deco:{items:()=>DECOS,list:()=>G.decos,key:'deco'}};
function shopItem(kind,id,it){
  const k=SHOP[kind],owned=k.list().includes(id),wearing=G[k.key]===id,word=kind==='deco'?(id==='none'?'Chosen':'On balloon'):kind==='basket'?'In use':kind==='char'?'Playing':kind==='pet'?(id==='none'?'Chosen':'With Pip'):'Wearing',act=kind==='pet'||kind==='char'?'Choose':kind==='basket'?'Use':kind==='deco'?(id==='none'?'Choose':'Add'):'Wear';
  let btn;
  if(wearing)btn=`<button type="button" class="worn" disabled>${word}</button>`;
  else if(owned)btn=`<button type="button" class="wear" data-k="${kind}" data-id="${id}">${act}</button>`;
  else if(it.reward)btn=`<button type="button" disabled>Prize: ${EV_MILES[1][0]} pts</button>`;
  else if(it.mast)btn=`<button type="button" disabled class="mastb">${mastLabel(it.mast)}${it.mast.isl?` · now ${starsMini(starFor(it.mast.isl))||'no stars'}`:''}</button>`;
  else if(G.coins>=it.price)btn=`<button type="button" class="buy" data-k="${kind}" data-id="${id}">${COIN_ICON} ${it.price}</button>`;
  else btn=`<button type="button" disabled>${COIN_ICON} ${it.price}</button>`;
  const leg=it.price>=1000,isw=G.wish&&G.wish.k===kind&&G.wish.id===id,canWish=!owned&&!it.reward&&!it.mast&&it.price>0;
  return `<div class="item${wearing?' wearing':''}${leg?' leg':''}${it.mast&&!owned?' locked':''}" data-kind="${kind}">${it.mast&&!owned?`<span class="locktag" aria-label="Locked">${ICON.lock}</span>`:''}${it.nw&&!owned?'<span class="newtag">NEW</span>':''}${canWish?`<button type="button" class="wishb${isw?' on':''}" data-wk="${kind}" data-wid="${id}" aria-label="${isw?'Remove from wish':'Make this my wish'}" title="${isw?'My wish!':'Make this my wish'}">${isw?ICON.wishOn+'My wish':ICON.wishOff+'Wish'}</button>`:''}<div class="prev" data-tk="${kind}" data-tid="${id}" title="Try it on">${foxSVG({[kind]:id})}</div><b>${it.name}</b>${leg?'<span class="legtag">Legendary</span>':''}${btn}</div>`;
}
function renderCloset(){
  refreshFoxes();updateStats();
  $('#shopMastery').innerHTML=MASTERY.map(([k,id])=>shopItem(k,id,SHOP[k].items()[id])).join('');
  $('#shopChars').innerHTML=Object.entries(CHARS).map(([k,v])=>shopItem('char',k,v)).join('');
  const keep=(list)=>([k,v])=>!v.ev||list.includes(k);
  $('#shopPets').innerHTML=Object.entries(PETS).filter(keep(G.pets)).map(([k,v])=>shopItem('pet',k,v)).join('');
  const E=CUR_EV;$('#evShopTitle').hidden=$('#shopEvent').hidden=!E;
  if(E){$('#evShopTitle').innerHTML=`${E.name} Shop <small>limited time, until ${evEnd(E)}. Bought items stay forever!</small>`;
    $('#shopEvent').innerHTML=shopItem('hat',E.hat,HATS[E.hat])+shopItem('basket',E.basket,BASKETS[E.basket])+shopItem('pet',E.pet,PETS[E.pet])}
  const C=CHARS[G.char]||CHARS.fox;$('#swatches').innerHTML=`<span>${C.name} colors:</span>`+C.v.map((v,i)=>`<button type="button" class="sw${((G.charColor||{})[G.char]||0)===i?' on':''}" data-sw="${i}" title="${v.n}" aria-label="${v.n}" style="background:${v.m}"></button>`).join('');
  document.querySelectorAll('[data-sw]').forEach(b=>b.onclick=()=>{G.charColor=G.charColor||{};G.charColor[G.char]=+b.dataset.sw;save();renderCloset();tone([660,880]);setTimeout(()=>foxMove('spin'),50);say($('#csay'),`Ooh, ${C.v[+b.dataset.sw].n}! I love it!`)});
  $('#shopHats').innerHTML=Object.entries(HATS).filter(([,v])=>!v.mast).filter(keep(G.hats)).map(([k,v])=>shopItem('hat',k,v)).join('');
  $('#shopBalloons').innerHTML=Object.entries(BALLOONS).filter(([,v])=>!v.mast).map(([k,v])=>shopItem('balloon',k,v)).join('');
  $('#shopGlasses').innerHTML=Object.entries(GLASSES).filter(([,v])=>!v.mast).map(([k,v])=>shopItem('glass',k,v)).join('');
  $('#shopDecos').innerHTML=Object.entries(DECOS).filter(([,v])=>!v.mast).map(([k,v])=>shopItem('deco',k,v)).join('');
  $('#shopBaskets').innerHTML=Object.entries(BASKETS).filter(keep(G.baskets)).map(([k,v])=>shopItem('basket',k,v)).join('');
  $('#tcount').textContent=`${G.badges.length} of ${BADGES.length} badges`;
  $('#trophies').innerHTML=BADGES.map(b=>`<div class="trophy${G.badges.includes(b[0])?'':' off'}">${MEDAL(b[3])}<div><b>${b[1]}</b><small>${b[2]}</small></div></div>`).join('');
  document.querySelectorAll('.item .wishb').forEach(b=>b.onclick=()=>{const k=b.dataset.wk,id=b.dataset.wid,it=SHOP[k].items()[id];if(G.wish&&G.wish.k===k&&G.wish.id===id){G.wish=null;save();renderCloset();return}
    G.wish={k,id};save();renderCloset();tone([660,990],.06);say($('#csay'),`The <b>${it.name}</b> is our wish! I'll show on the map how close we are. ${G.coins>=it.price?'And guess what? We can get it right now!':`Only <b>${fmt(it.price-G.coins)} more coins</b>!`}`)});
  document.querySelectorAll('.item .prev[data-tk]').forEach(el=>el.onclick=()=>{const k=el.dataset.tk,id=el.dataset.tid,it=SHOP[k].items()[id],bob=$('.closetTop .pipbob');if(!bob)return;bob.innerHTML=foxSVG({[k]:id});foxMove('spin');
    say($('#csay'),SHOP[k].list().includes(id)?`I already have the <b>${it.name}</b>. Tap the button to use it!`:`Trying on the <b>${it.name}</b>... What do you think? It costs <b>${fmt(it.price)} coins</b>.`)});
  document.querySelectorAll('.item button[data-id]').forEach(b=>b.onclick=()=>{
    const kind=b.dataset.k,id=b.dataset.id,K=SHOP[kind],it=K.items()[id],list=K.list();
    const pname=kind==='pet'&&id!=='none'?it.name.split(' the ')[0]:'';
    if(!list.includes(id)){if(G.coins<it.price)return;G.coins-=it.price;list.push(id);award('shopper');if(G.wish&&G.wish.k===kind&&G.wish.id===id)G.wish=null;if(it.price>=1000)award('legend');sWin();burstAt(b,80);
      say($('#csay'),kind==='basket'?pick([`What a ride! I love my new <b>${it.name}</b>!`,`Wheee! The <b>${it.name}</b> is so comfy!`]):kind==='char'?`Ta-da! I'm a <b>${it.animal}</b> now! Try my 3 colors above!`:kind==='pet'?pick([`Meet my new best friend, <b>${pname}</b>! Thank you SO much!`,`<b>${pname}</b> is coming on all our adventures!`,`Hi <b>${pname}</b>! Welcome to the balloon!`]):pick([`I LOVE it! Thank you so much!`,`Wow! I look amazing! Thank you!`,`Best. Gift. EVER!`]))}
    else{tone([660,880]);say($('#csay'),kind==='char'?`I'm a ${it.animal} again! Let's fly!`:kind==='pet'?(id==='none'?`Just me for now!`:`<b>${pname}</b>, hop in! Let's fly!`):pick([`Good choice!`,`Looking sharp!`,`Ta-da!`]))}
    G[K.key]=id;save();renderCloset();setTimeout(()=>foxMove(kind==='pet'?'hop':'spin'),50);
  });
}
$('#closetBtn').onclick=()=>{tone([523,784]);openCloset()};
$('#homeBtn').onclick=()=>{tone([523,784]);openHome()};

/* ================= album ================= */
function openAlbum(){
  stopTimers();show('albumS');
  $('#albumBody').innerHTML=STICKER_SETS.map(([set,name,bg,evid])=>{const list=STK.filter(s=>s.set===set),have=list.filter(s=>G.stickers[s.id]).length;
    if(evid&&!have&&(!CUR_EV||CUR_EV.id!==evid))return '';const E=evid&&EVENTS.find(e=>e.id===evid);
    return `<h3 class="sectitle">${name} <small>${have} of ${list.length}${G.setsDone[set]?' · complete!':''}${E?(CUR_EV&&CUR_EV.id===evid?` · limited, until ${evEnd(E)}!`:' · limited event set'):''}</small></h3><div class="album">${list.map(s=>{const n=G.stickers[s.id]||0;
      return `<div class="stk">${n>1?`<span class="cnt">×${n}</span>`:''}${stickerSVG(s,n>0)}<b>${n?esc(s.name):'???'}</b><small class="r-${s.rar}">${s.rar}</small></div>`}).join('')}</div>`}).join('');
}
$('#albumBtn').onclick=()=>{tone([523,784]);openAlbum()};

/* ================= story ================= */
/* one treasure map torn into 4 interlocking pieces; the river, the trail and the fog run across the tears */
let MAPN=0;
const MAP_V=[[158,6],[163,22],[154,40],[162,58],[155,76],[161,92],[158,108],[153,124],[162,142],[155,160],[163,178],[156,196],[158,210]];
const MAP_H=[[6,108],[22,103],[40,112],[58,104],[76,113],[96,103],[116,112],[136,104],[158,108],[178,113],[198,103],[218,112],[238,104],[258,113],[278,103],[296,111],[310,108]];
const MAP_PIECES=[
  [[6,6],...MAP_V.slice(0,7),...MAP_H.slice(0,9).reverse()],
  [[310,6],[310,108],...MAP_H.slice(8).reverse(),...MAP_V.slice(0,7).reverse()],
  [...MAP_H.slice(0,9),...MAP_V.slice(6),[6,210]],
  [...MAP_H.slice(8),[310,210],...MAP_V.slice(6).reverse()]
];
const MAP_MID=[[82,58],[234,58],[82,160],[234,160]];
function mapArt(done){
  const ink='#8c5a2c';
  return `<rect x="6" y="6" width="304" height="204" fill="#bfe3ef"/>
  ${[[30,22],[200,16],[286,60],[22,140],[290,196],[120,204]].map(([x,y])=>`<path d="M${x} ${y} q4 -4 8 0 t8 0" fill="none" stroke="#7fb9cf" stroke-width="1.5"/>`).join('')}
  <path d="M28 34 Q80 14 142 26 Q204 12 272 30 Q302 54 292 100 Q306 142 282 184 Q228 204 160 194 Q92 206 42 188 Q14 152 24 108 Q12 62 28 34Z" fill="#f2deb0" stroke="#c9a46a" stroke-width="2.5"/>
  <path d="M150 20 Q172 58 150 90 Q130 122 168 150 Q188 174 170 202" fill="none" stroke="#8fcbe0" stroke-width="7" stroke-linecap="round"/>
  <path d="M150 20 Q172 58 150 90 Q130 122 168 150 Q188 174 170 202" fill="none" stroke="#bfe3ef" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="3 6"/>
  ${[[60,96],[200,92],[226,128],[122,74]].map(([x,y])=>`<path d="M${x} ${y} l5 -8 l5 8" fill="none" stroke="#b08a52" stroke-width="1.5"/>`).join('')}
  <path d="M42 52 C84 92 112 22 160 40 C204 52 222 64 246 84 C246 120 140 104 104 136 C116 190 206 186 248 176" fill="none" stroke="${ink}" stroke-width="2.5" stroke-dasharray="5 4" stroke-linecap="round"/>
  <g><path d="M33 38 a9 10 0 1 1 18 0 q0 7 -9 12 q-9 -5 -9 -12z" fill="#ff6b57" stroke="#1f3557" stroke-width="1.2"/><rect x="38" y="52" width="8" height="6" rx="1.5" fill="#a0683a" stroke="#1f3557" stroke-width="1"/><text x="42" y="70" text-anchor="middle" ${FONT} font-size="9" fill="${ink}">START</text></g>
  <g><path d="M88 82 L110 50 L132 82Z" fill="#d9c08a" stroke="${ink}" stroke-width="1.5"/><text x="110" y="76" text-anchor="middle" ${FONT} font-size="10" fill="${ink}">× ÷</text></g>
  <g><rect x="238" y="44" width="22" height="40" fill="#e9dcff" stroke="#1f3557" stroke-width="1.5"/><path d="M234 46 L249 30 L264 46Z" fill="#6b5bd6" stroke="#1f3557" stroke-width="1.5"/><circle cx="249" cy="58" r="8" fill="#fff" stroke="#1f3557" stroke-width="1.5"/><path d="M249 58 V52 M249 58 L254 60" stroke="#1f3557" stroke-width="1.5" stroke-linecap="round"/></g>
  <g><path d="M40 172 L60 138 L80 172Z" fill="#ffc23d" stroke="#1f3557" stroke-width="1.5"/><rect x="86" y="150" width="22" height="22" fill="#7fd0f5" stroke="#1f3557" stroke-width="1.5"/><circle cx="128" cy="161" r="11" fill="#e2558f" stroke="#1f3557" stroke-width="1.5"/></g>
  <path d="M28 134 q12 -7 24 0 t24 0 t24 0 t24 0 t24 0 t24 0" fill="none" stroke="#9aa6b6" stroke-width="3" stroke-linecap="round" opacity=".8"/>
  <path d="M40 182 q12 -6 24 0 t24 0 t24 0" fill="none" stroke="#9aa6b6" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>
  <g><path d="M262 128 a10 10 0 0 1 19 -4 a8 8 0 0 1 12 10 h-31z" fill="#6a5bc0" stroke="#1f3557" stroke-width="1.2"/><path d="M276 136 l-4 9 h5 l-3 8" fill="none" stroke="#ffc23d" stroke-width="2" stroke-linecap="round"/></g>
  <g><path d="M240 168 l16 16 m0 -16 l-16 16" stroke="#ff3b30" stroke-width="5" stroke-linecap="round"/>${done?`<circle cx="248" cy="176" r="15" fill="#ffd56b" opacity=".45"/>`:''}<rect x="264" y="174" width="16" height="11" rx="2" fill="#a0683a" stroke="#1f3557" stroke-width="1.2"/><rect x="264" y="174" width="16" height="4" fill="#ffc23d" stroke="#1f3557" stroke-width="1"/></g>
  <g transform="translate(38 196)"><circle r="9" fill="#fff5d6" stroke="${ink}" stroke-width="1"/><path d="M0 -8 L2 0 L0 8 L-2 0Z" fill="${ink}"/><text y="-11" text-anchor="middle" ${FONT} font-size="7" fill="${ink}">N</text></g>`;
}
function mapSVG(pieces,fresh){
  const id='tm'+(++MAPN),pts=a=>a.map(p=>p.join(',')).join(' ');
  const art=mapArt(pieces>=4);
  let defs='',body='';
  MAP_PIECES.forEach((poly,i)=>{
    defs+=`<clipPath id="${id}c${i}"><polygon points="${pts(poly)}"/></clipPath>`;
    if(i<pieces){
      body+=`<g class="piece${fresh&&i===pieces-1?' fresh':''}"><g clip-path="url(#${id}c${i})">${art}</g><polygon points="${pts(poly)}" fill="none" stroke="#8c5a2c" stroke-width="1.5" stroke-linejoin="round"/></g>`;
    }else{
      const [cx,cy]=MAP_MID[i];
      body+=`<g class="piece missing"><polygon points="${pts(poly)}" fill="#dfe6ee" stroke="#9aa6b6" stroke-width="1.5" stroke-dasharray="5 4" stroke-linejoin="round"/><text x="${cx}" y="${cy+9}" text-anchor="middle" ${FONT} font-size="28" fill="#b3bfcd">?</text></g>`;
    }
  });
  return `<svg class="storymap" viewBox="0 0 316 216" role="img" aria-label="Treasure map with ${pieces} of 4 pieces found"><defs>${defs}</defs>${body}</svg>`;
}
function chapterReady(i){return CHAPTERS[i].islands.every(id=>starFor(id)>=2)}
/* Book 2 opens one chapter at a time: a new chapter can start 2 days after the one before it was won */
function chapterOpensOn(i){if(!CHAPTERS[i]||(CHAPTERS[i].book||1)<2||i===4||i===8)return '';const at=((G.story||{}).at||{})[i-1];if(!at)return '';const d=new Date(at+'T12:00:00');d.setDate(d.getDate()+2);return d.toISOString().slice(0,10)}
const chapterWaiting=i=>{const o=chapterOpensOn(i);return o&&dayKey()<o?o:''};
function compassSVG2(n,fresh){const cx=158,cy=108,R1=92,R0=26,cols=['#2f9fe0','#ffc23d','#38b98a','#e2558f'],L=['N','E','S','W'];let o='';
  for(let k=0;k<4;k++){const a0=(-135+90*k)*Math.PI/180,a1=a0+Math.PI/2,P=(r,a)=>`${(cx+r*Math.cos(a)).toFixed(1)} ${(cy+r*Math.sin(a)).toFixed(1)}`,am=(a0+a1)/2;
    const d=`M${P(R0,a0)} L${P(R1,a0)} A${R1} ${R1} 0 0 1 ${P(R1,a1)} L${P(R0,a1)} A${R0} ${R0} 0 0 0 ${P(R0,a0)}Z`,got=k<n;
    o+=got?`<g class="${fresh&&k===n-1?'fresh':''}"><path d="${d}" fill="${cols[k]}" stroke="#1f3557" stroke-width="2.5" stroke-linejoin="round"/><text x="${(cx+60*Math.cos(am)).toFixed(1)}" y="${(cy+60*Math.sin(am)+9).toFixed(1)}" text-anchor="middle" ${FONT} font-size="26" fill="#fff">${L[k]}</text></g>`
      :`<g><path d="${d}" fill="#dfe6ee" stroke="#9aa6b6" stroke-width="1.5" stroke-dasharray="5 4"/><text x="${(cx+60*Math.cos(am)).toFixed(1)}" y="${(cy+60*Math.sin(am)+9).toFixed(1)}" text-anchor="middle" ${FONT} font-size="26" fill="#b3bfcd">?</text></g>`}
  o+=`<circle cx="${cx}" cy="${cy}" r="${R0}" fill="${n>=4?'#ffd56b':'#fff5d6'}" stroke="#1f3557" stroke-width="2.5"/>`;
  if(n>=1)o+=`<path d="M${cx} ${cy-20} L${cx+7} ${cy} L${cx} ${cy+20} L${cx-7} ${cy}Z" fill="#ff6b57" stroke="#1f3557" stroke-width="2"/>`;
  if(n>=4)o+=`<circle cx="${cx}" cy="${cy}" r="${R1+8}" fill="none" stroke="#ffd56b" stroke-width="5" opacity=".8"/>`;
  return `<svg class="storymap" viewBox="0 0 316 216" role="img" aria-label="Starlight Compass with ${n} of 4 parts found"><rect width="316" height="216" rx="18" fill="#2c3266"/>${[[30,30],[280,40],[40,180],[270,190],[150,14]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.5" fill="#fff" opacity=".8"/>`).join('')}${o}</svg>`}
function openStory(){
  stopTimers();show('story');refreshFoxes();
  const bk=G.story.ch>=CHAPTERS.length?3:bookOf(G.story.ch),B=BOOKS[bk],book2=bk>=2;$('#storyMap').innerHTML=bookArt(bk,Math.min(G.story.ch,CHAPTERS.length)-B.start);
  const st=$('#story .iname');if(st)st.textContent=B.title;const sq=$('#story .qnum');if(sq)sq.textContent='Earn 2 stars on every island in a chapter, then beat its boss.';
  const cur=CHAPTERS[G.story.ch],wait=cur?chapterWaiting(G.story.ch):'';
  say($('#storysay'),!cur?`We finished all three books together${nm()}! The Rainbow Bridge shines. You can replay any chapter boss for fun and stickers.`:wait?`What an adventure! The next chapter, <b>${cur.name}</b>, opens on <b>${new Date(wait+'T12:00:00').toLocaleDateString('en-US',{weekday:'long'})}</b>. Practice its islands now so you're ready!`:chapterReady(G.story.ch)?`All islands are ready! Time to battle the <b>${BOSSES[cur.boss].name}</b>!`:`Chapter ${G.story.ch+1}: <b>${cur.name}</b>. Earn <b>2 stars</b> on each island below to call out the boss.`);
  const BN={1:'The Lost Map',2:'The Starlight Compass',3:'The Rainbow Bridge'};
  const bkIdx=b=>CHAPTERS.map((_,i)=>i).filter(i=>bookOf(i)===b),bkDone=b=>bkIdx(b).filter(i=>i<G.story.ch).length;
  {const n=bkIdx(bk).length,d=bkDone(bk);$('#bkmeter').innerHTML=`<span>Book ${bk} · ${d}/${n} chapters</span><span class="bar"><i style="width:${Math.round(d/n*100)}%"></i></span>`}
  const card=i=>{const ch=CHAPTERS[i];const lock=i>G.story.ch,fin=i<G.story.ch,w=i===G.story.ch?chapterWaiting(i):'',ready=chapterReady(i)&&!w;
    const okN=ch.islands.filter(id=>starFor(id)>=2).length;
    const st=fin?`<span class="status ok">${CHECK}${BOOKS[ch.book||1].won}</span>`:lock?`<span class="status lock">${ICON.lock}Locked</span>`:w?`<span class="status go">Opens ${new Date(w+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</span>`:`<span class="status go">In progress</span>`;
    return `<div class="chap${lock?' is-lock':fin?' is-fin':' is-cur'}"><div class="chhd"><span class="chnum">${fin?CHECK:i+1}</span><div class="chtt"><h4>${ch.name}</h4><p>Chapter ${i+1} · Boss: ${BOSSES[ch.boss].name}</p></div>${st}</div>
      <div class="chlbl">Islands <b>${okN}/${ch.islands.length}</b> ready</div>
      <div class="clist">${ch.islands.map(id=>{const isl=byId(id),ok=starFor(id)>=2;return `<button type="button" class="cisl${ok?' ok':''}" data-isl="${id}" ${lock?'disabled':''}>${ok?CHECK:''}<span class="cnm">${isl.name}</span>${starsMini(starFor(id))}${!ok&&!lock?`<small class="tneed">needs ${2-starFor(id)} more ${starsMini(1)}</small>`:''}</button>`}).join('')}</div>
      ${lock?`<p class="chnote">${ICON.lock}Finish Chapter ${i} to open it.</p>`:`<div class="chact"><button type="button" class="go small alt" data-intro="${i}">Story</button><button type="button" class="go small${ready||fin?'':' alt'}" data-boss="${i}" ${ready||fin?'':'disabled'}>${ready||fin?'':ICON.lock}${fin?'Replay boss':'Battle boss'}</button></div>`}</div>`};
  const books=[bk,...[1,2,3].filter(b=>b!==bk)];
  $('#chapters').innerHTML=books.map(b=>{const n=bkIdx(b).length,d=bkDone(b),open=bkIdx(b)[0]<=G.story.ch;
    return `<div class="bookbox${b===bk?' cur':''}"><div class="bookhd"><h3 class="sectitle">Book ${b}: ${BN[b]}</h3><span class="status ${d===n?'ok':open?'go':'lock'}">${d===n?CHECK:open?'':ICON.lock}${d}/${n} chapters</span></div><div class="chgrid">${bkIdx(b).map(card).join('')}</div></div>`}).join('');
  document.querySelectorAll('[data-isl]').forEach(b=>b.onclick=()=>start(byId(b.dataset.isl)));
  document.querySelectorAll('[data-intro]').forEach(b=>b.onclick=()=>playDialog(CHAPTERS[+b.dataset.intro].intro));
  document.querySelectorAll('[data-boss]').forEach(b=>b.onclick=()=>startChapterBoss(+b.dataset.boss));
  if(cur&&!G.story.seen[G.story.ch]){G.story.seen[G.story.ch]=1;save(true);setTimeout(()=>playDialog(cur.intro),400)}
}
function startChapterBoss(i){const ch=CHAPTERS[i];startBoss(byId('boss'),{boss:ch.boss,chapter:i,pool:ch.islands})}
function playDialog(lines,k=0){
  if(k>=lines.length){closeOverlay();return}
  const html=`<div class="pipbob" data-fox></div><div class="dlg"><div class="speaker">Pip</div></div><p style="font-size:1.15em;color:var(--ink)">${lines[k]}</p><button class="go" type="button" id="dlgNext" style="align-self:center">${k<lines.length-1?'Next':"Let's go!"}</button>`;
  if(k===0)overlay(html,()=>bindDlg(lines,k));else{$('#ocard').innerHTML=html;refreshFoxes();bindDlg(lines,k)}
}
function bindDlg(lines,k){foxClass('talking',1800);$('#dlgNext').onclick=()=>{stopSpeak();tone([523,659]);if(k+1>=lines.length)closeOverlay();else playDialog(lines,k+1)}}
$('#storyBtn').onclick=()=>{tone([523,784]);openStory()};

/* ================= sign-in, consent, players ================= */
const CLOUD_ICON='<svg viewBox="0 0 24 16" width="20" height="14" aria-hidden="true"><path d="M6 15h12a4.5 4.5 0 0 0 .6-8.96A6 6 0 0 0 7.1 5.2 4.9 4.9 0 0 0 6 15z" fill="currentColor"/></svg>';
const APPLE_ICON='<svg viewBox="0 0 17 20" width="20" height="22" aria-hidden="true"><path fill="currentColor" d="M14.2 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.5 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.7-1-2.7-4.1zM11.7 3c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.1 1.1.1 2.3-.6 3-1.5z"/></svg>';
const G_ICON='<svg viewBox="0 0 48 48" width="24" height="24" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z"/><path fill="#FBBC05" d="M10.6 28.6A14.4 14.4 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l8-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.2 0-11.5-4.1-13.4-9.8l-8 6.1C6.6 42.6 14.6 48 24 48z"/></svg>';
const LOCK=ICON.lock;
const lsGet=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const lsJSON=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}};
function waitCloud(ms){return new Promise(res=>{if(window.PipCloud)return res(window.PipCloud);const t=setTimeout(()=>res(window.PipCloud||null),ms);addEventListener('pipcloud',()=>{clearTimeout(t);res(window.PipCloud)},{once:true})})}
const cfgWanted=()=>{const c=window.PIP_FIREBASE_CONFIG;return !!(c&&c.apiKey&&!/PASTE|YOUR_/i.test(c.apiKey))};
const kidAvatar=p=>foxSVG({char:p.char,hat:p.hat,balloon:p.balloon,pet:p.pet,basket:p.basket,cv:(p.charColor||{})[p.char]||0});
const AUTH_ERR={'auth/invalid-email':'That email address doesn\'t look right.','auth/missing-password':'Please type a password.','auth/weak-password':'Password needs at least 6 characters.',
  'auth/email-already-in-use':'This email already has an account. Tap "Sign in" instead.','auth/invalid-credential':'Email or password is not right. Try again, or tap "Forgot password?".',
  'auth/wrong-password':'That password is not right.','auth/user-not-found':'No account with this email yet. Tap "Create account".','auth/too-many-requests':'Too many tries. Please wait a few minutes.',
  'auth/popup-closed-by-user':'The sign-in window was closed. Try again.','auth/cancelled-popup-request':'','auth/network-request-failed':'No internet connection. Check it and try again.',
  'auth/unauthorized-domain':'This website address is not allowed yet. (Grown-up setup: add it in Firebase > Authentication > Settings > Authorized domains.)',
  'auth/operation-not-allowed':'This sign-in method is turned off. (Setup: enable it in Firebase > Authentication > Sign-in method.)','auth/requires-recent-login':'For safety, please sign in again first.'};
const authMsg=e=>AUTH_ERR[e&&e.code]!=null?AUTH_ERR[e.code]:'Something went wrong. Please try again.';

async function boot(){
  show('gate');gateLoading();
  const api=await waitCloud(cfgWanted()?12000:1500);CL.api=api;
  if(api&&api.configured){api.onAuth(onAuthChange);return}
  if(cfgWanted()){ // cloud is set up but could not load (offline or blocked)
    const uid=lsGet('pip-last-uid');
    if(uid&&lsGet('pip-cloud-'+uid)){CL.mode='offline';CL.uid=uid;loadCache();openKids();return}
    return gateOffline()}
  startGuest();
}
function startGuest(){CL.mode='guest';CL.uid='';ROOT=readGuestRoot();ROOT.current='';G=freshProfile();CL.loaded=true;prune();openKids()}
function loadCache(){const r=lsJSON('pip-cloud-'+CL.uid)||{};ROOT={profiles:{},current:'',pin:r.pin||'',ts:r.ts||0,gone:r.gone||{}};for(const k in (r.profiles||{}))ROOT.profiles[k]=normalizeProfile(r.profiles[k]);G=freshProfile();CL.loaded=true;prune()}
async function onAuthChange(u){
  if(!u){if(CL.mode==='cloud')leaveCloud();if(CL.wantGuest||lsGet('pip-guest'))return startGuest();return showGate()}
  leaveGuest();
  if(CL.mode==='cloud'&&CL.uid===u.uid)return;
  CL.mode='cloud';CL.uid=u.uid;CL.email=u.email||'';CL.provider=u.provider||'';CL.verified=u.verified!==false;CL.synced=false;CL.remote={};CL.dirty={};CL.err='';
  loadCache();show('gate');gateLoading();
  let ud=null;try{ud=await CL.api.getUserDoc()}catch(e){ud=lsJSON('pip-ud-'+CL.uid)}
  if(CL.uid!==u.uid)return;
  if(!ud||!ud.consentAt||!ud.role)return showConsent(ud||{});
  afterConsent(ud);
}
function afterConsent(ud){
  CL.userDoc=ud||{};lsSet('pip-ud-'+CL.uid,JSON.stringify(CL.userDoc));setTimeout(()=>{if(typeof notifyFresh==='function')notifyFresh()},4000);
  if(CL.userDoc.pin)ROOT.pin=CL.userDoc.pin;else if(ROOT.pin)CL.api.setUserDoc({pin:ROOT.pin}).catch(()=>{});
  if(CL.interactive){CL.interactive=false;CL.unlockUntil=Date.now()+10*60000}
  if(CL.unsub)CL.unsub();
  CL.unsub=CL.api.watchKids(onKids,e=>{CL.err=(e&&e.code)||'error';setSync()});
  openKids();
  /* a teacher starts at the teacher desk (not on a classroom device, where students pick their names) */
  if(isTeacher()&&!classDevice()&&curScreen==='kids')teacherGate(()=>openTeach());
}
function leaveCloud(){cloudFlush();persistLocal();if(CL.unsub)CL.unsub();CL.unsub=null;clearTimeout(CL.t);CL.t=0;
  Object.assign(CL,{mode:'guest',uid:'',email:'',remote:{},dirty:{},synced:false,loaded:false,userDoc:{},unlockUntil:0,waiting:0,err:''});ROOT={profiles:{},current:'',pin:'',ts:0};G=freshProfile()}
async function signOutNow(){stopTimers();cloudFlush();persistLocal();CL.wantGuest=false;if(CL.mode==='guest'||CL.mode==='offline'){leaveCloud();return showGate()}try{await CL.api.signOut()}catch(e){leaveCloud();showGate()}}

function gateShell(inner){show('gate');$('#gate').innerHTML=`<div class="gatebox"><div class="gatefox" data-fox></div><h1 class="gtitle">Pip's <span>Sky Islands</span></h1>${inner}</div>`;refreshFoxes()}
function gateLoading(){gateShell(`<p class="gsub">Getting the balloons ready...</p>`)}
function gateOffline(){gateShell(`<div class="gcard"><h3>Can't reach the sign-in service</h3><p>Check the internet connection and try again.</p><div class="btnrow"><button class="go" type="button" id="gRetry">Try again</button></div>
  <button class="linkbtn" type="button" id="gGuest">Play without an account (saved on this device only)</button></div>`);
  $('#gRetry').onclick=()=>location.reload();$('#gGuest').onclick=()=>playAsGuest()}
/* a guest who has played a few rounds is invited (twice at most) to save the progress with a free account */
function guestNudge(){if(CL.mode!=='guest'||!(CL.api&&CL.api.configured)||ovOpen)return;
  const n=(+lsGet('pip-guest-rounds')||0)+1,asked=+lsGet('pip-guest-asked')||0;lsSet('pip-guest-rounds',String(n));
  if(!((n===3&&asked<1)||(n===10&&asked<2)))return;lsSet('pip-guest-asked',String(asked+1));
  overlay(`<div class="pipbob" data-fox></div><div class="eyebrow">Nice work${nm()}!</div><h2>Keep your stars safe</h2>
    <p>${(()=>{const st=starTotal(),have=[st?`<b>${st} star${st>1?'s':''}</b>`:'',G.coins?`<b>${fmt(G.coins)} coins</b>`:''].filter(Boolean);return have.length?`You have ${have.join(' and ')}. Right now they live only on this device.`:'Right now your progress lives only on this device.'})()} A grown-up can sign in for free, and everything comes along: stars, coins, outfits and the island, on any phone, tablet or computer.</p>
    <div class="btnrow"><button type="button" class="go" id="gnSave">Sign in to save</button><button type="button" class="go alt" id="gnLater">Maybe later</button></div>`,
    ()=>{$('#gnSave').onclick=()=>{closeOverlay();leaveGuest();showGate()};$('#gnLater').onclick=closeOverlay})}
/* "Play now": no account; the game remembers the choice, so the next visit opens straight away */
function playAsGuest(){lsSet('pip-guest','1');lsSet('pip-gate-hint','1');CL.wantGuest=true;startGuest()}
function leaveGuest(){try{localStorage.removeItem('pip-guest')}catch(e){}CL.wantGuest=false}
function showGate(){
  if(!(CL.api&&CL.api.configured))return startGuest();
  const hint=!lsGet('pip-gate-hint');
  gateShell(`<p class="gsub">Math, reading, science and social studies puzzles for grades 3 to 5. Free, no ads.</p>
  <div class="gtry">${hint?`<div class="gbub" id="gHint" role="note"><b>Just looking?</b> Try a few puzzles first. No account needed!</div>`:''}
    <button class="gplay" type="button" id="gPlay"><span class="gpico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg></span><span class="gptx"><b>Play now</b><small>No sign-up. Kids can start right away.</small></span></button>
    <a class="gdemo" href="?demo=teacher"><b>Teachers: try the teacher desk</b><span>A sample class with progress, groups and reports. No sign-up.</span></a></div>
  <div class="gcard"><h3>Save progress: sign in</h3><p>For parents and teachers (kids never need an email). Progress is saved in the cloud and follows you to any device. Free.</p>
    <button class="gbtn" type="button" id="gGoogle">${G_ICON}<span>Continue with Google</span></button>
    ${CL.api.appleOn?`<button class="gbtn apple" type="button" id="gApple">${APPLE_ICON}<span>Continue with Apple</span></button>`:''}
    <div class="or"><span>or with email</span></div>
    <input class="gin" type="email" id="gEmail" placeholder="Email" autocomplete="email" aria-label="Email">
    <input class="gin" type="password" id="gPass" placeholder="Password (6 or more characters)" autocomplete="current-password" aria-label="Password">
    <div class="btnrow"><button class="go small" type="button" id="gIn">Sign in</button><button class="go small alt" type="button" id="gUp">Create account</button></div>
    <button class="linkbtn" type="button" id="gForgot">Forgot password?</button>
    <p class="note" id="gNote" role="status"></p></div>
  <a class="linkbtn" href="guide.html" target="_blank" rel="noopener">How Pip works</a>
  <a class="linkbtn" href="privacy.html" target="_blank" rel="noopener">Privacy notice</a>`);
  const note=(t,ok)=>{const n=$('#gNote');n.className='note '+(ok?'ok':'bad');n.textContent=t};
  const busy=on=>document.querySelectorAll('#gate button').forEach(b=>b.disabled=on);
  const run=async(fn)=>{note('');busy(true);CL.interactive=true;try{await fn()}catch(e){CL.interactive=false;const m=authMsg(e);if(m)note(m)}busy(false)};
  const em=()=>$('#gEmail').value.trim(),pw=()=>$('#gPass').value;
  $('#gGoogle').onclick=()=>run(()=>CL.api.signInGoogle());
  if($('#gApple'))$('#gApple').onclick=()=>run(()=>CL.api.signInApple());
  $('#gIn').onclick=()=>run(()=>CL.api.signInEmail(em(),pw()));
  $('#gUp').onclick=()=>run(()=>CL.api.signUpEmail(em(),pw()));
  $('#gPass').onkeydown=e=>{if(e.key==='Enter')$('#gIn').click()};
  $('#gForgot').onclick=async()=>{if(!em()){note('Type your email first, then tap "Forgot password?".');return}
    try{await CL.api.resetPassword(em());note('If that email has an account, a reset link is on its way. Check your inbox.',true)}catch(e){note(authMsg(e))}};
  $('#gPlay').onclick=playAsGuest;
  if(hint){const off=()=>{lsSet('pip-gate-hint','1');const h=$('#gHint');if(h)h.classList.add('out')};setTimeout(()=>{const h=$('#gHint');if(h)h.classList.add('in')},700);$('#gate').addEventListener('pointerdown',off,{once:true})}
}
const ROLE_ICO={parent:`<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="18" cy="14" r="7" fill="#ffd8a8" stroke="#1f3557" stroke-width="2.5"/><path d="M5 42c0-9 6-15 13-15s13 6 13 15" fill="#7cc4ff" stroke="#1f3557" stroke-width="2.5" stroke-linejoin="round"/><circle cx="35" cy="22" r="5" fill="#ffd8a8" stroke="#1f3557" stroke-width="2.5"/><path d="M27 42c0-7 4-11 8-11s8 4 8 11" fill="#ffc23d" stroke="#1f3557" stroke-width="2.5" stroke-linejoin="round"/></svg>`,
  teacher:`<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="4" y="6" width="40" height="26" rx="3" fill="#38b98a" stroke="#1f3557" stroke-width="2.5"/><path d="M10 14h14M10 20h20M10 26h10" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><path d="M16 32l-4 10M32 32l4 10" stroke="#1f3557" stroke-width="2.5" stroke-linecap="round"/><circle cx="36" cy="16" r="4" fill="#ffc23d"/></svg>`};
/* first sign-in: who is this grown-up (parent or teacher) and the matching agreement; old accounts only pick a role */
function showConsent(ud){ud=ud||{};const had=!!ud.consentAt;let role=ud.role==='teacher'||ud.role==='parent'?ud.role:'';
  const bullets=`<ul class="glist"><li>We save your <b>email</b>, and for each child a <b>first name or nickname</b> plus their game progress.</li><li>No ads, no tracking, never sold or shared.</li><li>You can download or delete everything at any time in <b>Parents</b>.</li></ul>`;
  gateShell(`<div class="gcard"><div class="eyebrow">${had?'One quick question':'One quick step'}</div><h3>Welcome! Who are you?</h3>
    <div class="rolepick" role="radiogroup" aria-label="I am a">
      <button type="button" class="rolebtn" data-role="parent" role="radio" aria-checked="false">${ROLE_ICO.parent}<span><b>Parent or guardian</b><small>My own children play, at home or anywhere</small></span></button>
      <button type="button" class="rolebtn" data-role="teacher" role="radio" aria-checked="false">${ROLE_ICO.teacher}<span><b>Teacher</b><small>I use Pip with a class (I can add my own kids too)</small></span></button></div>
    <div id="roleMore"></div>
    <div class="btnrow"><button class="go" type="button" id="cGo" disabled>Continue</button><button class="go alt" type="button" id="cOut">Sign out</button></div><p class="note" id="cNote"></p>
    <p class="note">You can change this later in <b>Parents</b>.</p></div>`);
  const more=()=>{const m=$('#roleMore');
    if(role==='parent')m.innerHTML=had?'':`${bullets}<label class="chk"><input type="checkbox" id="cOk"><span>I am the parent or legal guardian of the children who will play, and I agree to the <a href="privacy.html" target="_blank" rel="noopener">Privacy notice</a>.</span></label>`;
    else if(role==='teacher')m.innerHTML=`${TEACHER_TERMS}${had?'':'<p class="note">No ads, no tracking, never sold or shared. You can download or delete everything at any time in <b>Parents</b>.</p>'}
      <div class="setrow"><label for="cName">Your name for students<small>Shown to students and families, for example "Ms. Rivera"</small></label><input type="text" id="cName" class="gin" maxlength="40" autocomplete="off" value="${esc(ud.teacherName||lsGet('pip-tname-'+CL.uid)||'')}"></div>
      ${ud.teacherAt?'':`<label class="chk"><input type="checkbox" id="cOk"><span>I agree${had?'':' to the <a href="privacy.html" target="_blank" rel="noopener">Privacy notice</a>'}, and I have read the <a href="privacy.html#teachers" target="_blank" rel="noopener">Privacy notice for teachers</a>.</span></label>`}`;
    else m.innerHTML='';
    document.querySelectorAll('.rolebtn').forEach(b=>b.setAttribute('aria-checked',b.dataset.role===role));
    const check=()=>{const ok=role&&(!$('#cOk')||$('#cOk').checked)&&(role!=='teacher'||$('#cName').value.trim().length>=2);$('#cGo').disabled=!ok};
    if($('#cOk'))$('#cOk').onchange=check;if($('#cName'))$('#cName').oninput=check;check()};
  document.querySelectorAll('.rolebtn').forEach(b=>b.onclick=()=>{role=b.dataset.role;tone([523,659],.04);more();const n=$('#cName');if(n&&!n.value)n.focus()});
  more();
  $('#cOut').onclick=signOutNow;
  $('#cGo').onclick=async()=>{const now=new Date().toISOString(),d={role,roleAt:now};
    if(!had)Object.assign(d,{email:CL.email,consentAt:now,consentVersion:1});
    if(role==='teacher'){const tn=$('#cName').value.trim().slice(0,40);d.teacherName=tn;lsSet('pip-tname-'+CL.uid,tn);if(!ud.teacherAt)Object.assign(d,{teacherAt:now,teacherVersion:1})}
    $('#cGo').disabled=true;
    try{await CL.api.setUserDoc(d)}catch(e){$('#cNote').className='note bad';$('#cNote').textContent='Could not save. Check the internet and try again.';$('#cGo').disabled=false;return}
    CL.interactive=true;afterConsent(Object.assign({},ud,CL.userDoc,d))};
}

function openKids(){stopTimers();stopSpeak();if(ROOT.current){ROOT.profiles[ROOT.current]=G;cloudFlush()}
  let rs=null;try{rs=sessionStorage.getItem('pip-resume');sessionStorage.removeItem('pip-resume')}catch(e){}
  let to='',ul=0;try{to=sessionStorage.getItem('pip-resume-to')||'';ul=+sessionStorage.getItem('pip-unlock')||0;sessionStorage.removeItem('pip-resume-to');sessionStorage.removeItem('pip-unlock')}catch(e){}
  if(rs&&ROOT.profiles[rs]&&(ROOT.profiles[rs].pack||PACK_DEFAULT)===PACK.id){selectKid(rs);if(to==='parent'&&ul>Date.now()){CL.unlockUntil=ul;renderParent()}return}
  show('kids');renderKids()}
function renderKids(){
  const el=$('#kids');if(!el)return;
  const cdev=classDevice(),cdevCls=cdev&&(lsJSON('pip-classes-'+CL.uid)||[]).find(c=>c.cid===cdev);
  const ids=Object.keys(ROOT.profiles).filter(id=>{const p=ROOT.profiles[id];return cdev?p.roster&&p.cls&&p.cls.cid===cdev:!p.roster}).sort((a,b)=>(ROOT.profiles[a].name||'').localeCompare(ROOT.profiles[b].name||''));
  if(cdev)return renderClassKids(el,ids,cdevCls);
  const guest=CL.mode==='cloud'?importable():[];
  const acct=CL.mode==='cloud'?`<span>Signed in as <b>${esc(CL.email||'grown-up')}</b></span><button class="linkbtn" type="button" id="kOut">Sign out</button>`
    :CL.mode==='offline'?`<span>Offline: saved on this device, uploads next time</span>`
    :CL.api&&CL.api.configured?`<span>Not signed in: progress is saved on this device only.</span><button class="linkbtn" type="button" id="kIn">Parent or teacher sign in</button>`:`<span>Progress is saved on this device.</span>`;
  el.innerHTML=`<div class="kidshead"><div class="kfox" data-fox></div><div><div class="eyebrow">${isTeacher()?'My own kids · not a class':"Who's playing?"}</div><h2>${ids.length?'Tap your name!':isTeacher()?'Add your own child':'Add the first player!'}</h2></div>${ROOT.current&&ROOT.profiles[ROOT.current]&&!ROOT.profiles[ROOT.current].roster?'<button class="go small alt" type="button" id="kBack">Back to the game</button>':''}${isTeacher()?`<button class="go small leaf" type="button" id="kTeach">${BOARD_ICO}<span>Teacher desk</span></button>`:''}</div>
    <div class="kidgrid">${ids.map(id=>{const p=ROOT.profiles[id],stars=STAR_ISLANDS.reduce((s,i)=>s+(p.best[i.id]||0),0);
      return `<button type="button" class="kid${id===ROOT.current?' cur':''}" data-kid="${id}"><span class="kav">${kidAvatar(p)}</span><b>${esc(p.name||'Player')}${p.kidPin?` <i class="klock" title="Has a PIN">${LOCK}</i>`:''}</b><small>${kidGrade(p)} · Level ${levelOf(p.xp)+1} · ${stars} ${starsMini(1)}</small></button>`}).join('')}
      <button type="button" class="kid add" id="kAdd"><span class="plus">+</span><b>Add a player</b><small>Just a first name or nickname</small></button></div>
    ${isTeacher()?`<p class="tkidsnote">This is for <b>your own children</b>, at home or anywhere. They are not part of any class. Your students are in the <b>Teacher desk</b>.</p>`:''}
    ${ids.length||isTeacher()?'':`<div class="kabout"><b>What is Pip's Sky Islands?</b><p>A free learning game for grades 3 to 5, built on each grade's state standards (California, and Common Core for the other states): math, reading, grammar, science and social studies. A parent or teacher picks the grade. Kids solve short puzzles, get a hint and a "How?" explanation when stuck, and old mistakes come back for practice.</p><ul><li>No ads, no chat, nothing to buy</li><li>Only a first name or nickname</li><li>A parent can sign in to save progress and see what to practice</li></ul></div>`}
    ${guest.length?`<div class="kimport"><p>This device has progress from before you signed in: <b>${guest.map(([,p])=>esc(p.name||'Player')).join(', ')}</b>. Keep it safe in your account?</p><button class="go small leaf" type="button" id="kImp">Add to my account</button></div>`:''}
    <div class="kidfoot">${acct}${isStandalone()?'':'<button class="linkbtn" type="button" id="kInst">Install app</button>'}<a class="linkbtn" href="privacy.html" target="_blank" rel="noopener">Privacy</a></div>`;
  if($('#kInst'))$('#kInst').onclick=async()=>{if(installEvt){const e=installEvt;e.prompt();try{await e.userChoice}catch(x){}installEvt=null;renderKids();return}
    overlay(`<div class="pipbob" data-fox></div><div class="eyebrow">For parents</div><h2>Install Pip as an app</h2><p>It opens full screen, like an app, and works without internet.</p>${/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)?'<p><b>iPhone / iPad:</b> open this site in <b>Safari</b>, tap <b>Share</b> (the square with an arrow), then <b>Add to Home Screen</b>.</p><p class="note">The installed app keeps its own copy. Sign in once inside it (Parents → account) and the progress comes back from the cloud.</p>':'<p><b>Android:</b> Chrome menu (⋮) → <b>Install app</b> or <b>Add to Home screen</b>. <b>Computer:</b> the install icon at the right end of the address bar.</p>'}<button class="go alt" type="button" style="align-self:center" onclick="closeOverlay()">Close</button>`)};
  refreshFoxes();
  el.querySelectorAll('[data-kid]').forEach(b=>b.onclick=()=>{const id=b.dataset.kid,p=ROOT.profiles[id];tone([523,784]);if(p.kidPin&&id!==ROOT.current)kidPinPrompt(p,()=>selectKid(id));else selectKid(id)});
  $('#kAdd').onclick=()=>newPlayer(id=>selectKid(id));
  if($('#kBack'))$('#kBack').onclick=()=>renderMap();
  if($('#kTeach'))$('#kTeach').onclick=()=>teacherGate(()=>openTeach());
  if($('#kOut'))$('#kOut').onclick=signOutNow;
  if($('#kIn'))$('#kIn').onclick=()=>{leaveGuest();showGate()};
  if($('#kImp'))$('#kImp').onclick=()=>{const done=JSON.parse(lsGet('pip-imported-'+CL.uid)||'[]');for(const [gid,p] of importable()){addKid(p);done.push(gid)}lsSet('pip-imported-'+CL.uid,JSON.stringify(done));toast('Progress saved!','It is now in your account and safe in the cloud.','#38b98a');renderKids()};
}
/* a classroom device: only this class's students, each with a picture password; leaving needs the grown-up PIN */
function renderClassKids(el,ids,c){
  el.innerHTML=`<div class="kidshead"><div class="kfox" data-fox></div><div><div class="eyebrow">${esc(c?c.name:'Class')}${c&&c.teacher?' · '+esc(c.teacher):''}</div><h2>${ids.length?'Tap your name!':'No students yet'}</h2></div></div>
    <div class="kidgrid">${ids.map(id=>{const p=ROOT.profiles[id],stars=STAR_ISLANDS.reduce((s,i)=>s+(p.best[i.id]||0),0);
      return `<button type="button" class="kid" data-kid="${id}"><span class="kav">${kidAvatar(p)}</span><b>${esc(p.name||'Player')}</b><small>Level ${levelOf(p.xp)+1} · ${stars} ${starsMini(1)}</small></button>`}).join('')}</div>
    <div class="kidfoot"><span>Classroom device</span><button class="linkbtn" type="button" id="kTeach">Teacher</button></div>`;
  refreshFoxes();
  el.querySelectorAll('[data-kid]').forEach(b=>b.onclick=()=>{const id=b.dataset.kid,p=ROOT.profiles[id];tone([523,784]);if(p.pic&&p.pic.length===2)picLogin(p,()=>selectKid(id));else selectKid(id)});
  $('#kTeach').onclick=()=>teacherGate(()=>overlay(`<div class="eyebrow">Teacher</div><h2>Classroom device</h2><p>This device shows only ${esc(c?c.name:'the class')}'s students.</p>
    <div class="btnrow"><button class="go" type="button" id="cdDesk">Teacher desk</button><button class="go alt" type="button" id="cdOff">Stop class mode</button></div><button class="linkbtn" type="button" id="cdClose">Close</button>`,()=>{
    $('#cdDesk').onclick=()=>{closeOverlay();CL.unlockUntil=Date.now()+5*60000;openTeach(c&&c.cid)};$('#cdClose').onclick=closeOverlay;
    $('#cdOff').onclick=()=>{try{localStorage.removeItem('pip-classdev-'+CL.uid)}catch(e){}if(ROOT.current&&(ROOT.profiles[ROOT.current]||{}).roster){ROOT.current='';G=freshProfile()}closeOverlay();renderKids()}}))}
const kidGrade=p=>{const P=CONTENT.packs[p.pack||PACK_DEFAULT];return P?(P.grade===0?'K':'Grade '+P.grade):''};
function importable(){const done=JSON.parse(lsGet('pip-imported-'+CL.uid)||'[]');const r=readGuestRoot();return Object.entries(r.profiles).filter(([id,p])=>hasProgress(p)&&!done.includes(id))}
function selectKid(id){
  if(!ROOT.profiles[id])return;ROOT.current=id;G=ROOT.profiles[id];
  const r=CL.remote[id];if(r&&r.p){G=mergeProfiles(G,r.p);ROOT.profiles[id]=G;r.fresh=false}
  persistLocal();if(ensurePack())return;
  persistLocal();applySettings();renderMap();if(!G.name)askName(true);
  if(G.cls){classCheck();classPush()}
}
function newPlayer(then){
  /* the school program is picked right away, so nobody plays the wrong grade by accident; default = the last child added */
  const last=Object.values(ROOT.profiles).filter(p=>!p.roster&&p.pack&&CONTENT.packs[p.pack]).sort((a,b)=>(b._u||0)-(a._u||0))[0];
  let dk=lsGet('pip-newpack')||(last&&last.pack)||PACK_DEFAULT;if(!packReady(CONTENT.packs[dk]))dk=PACK_DEFAULT;
  const D=CONTENT.packs[dk],opt=(v,t,on,off)=>`<option value="${v}"${on?' selected':''}${off?' disabled':''}>${esc(t)}</option>`;
  /* only what can be played now, then one quiet line (a long list of "planned" states was noise here; Parents can still record a planned state) */
  const soon=t=>`<option value="" disabled>${t}</option>`;
  const stOpts=st=>{const ok=US_STATES.filter(([c])=>GRADES.some(([g])=>packReady(CONTENT.packs[packKey(c,g)])));return ok.map(([c,n])=>opt(c,n,c===st)).join('')+(ok.length<US_STATES.length?soon('More states coming soon'):'')};
  const grOpts=(st,gr)=>{const ok=GRADES.filter(([g])=>packReady(CONTENT.packs[packKey(st,g)]));return ok.map(([g,n])=>opt(g,n,g===gr)).join('')+(ok.length<GRADES.length?soon('More grades coming soon'):'')};
  overlay(`<div class="pipbob" data-fox></div><div class="eyebrow">New player</div><h2>What's the player's name?</h2><p>A first name or nickname is perfect.</p>
    <input type="text" id="nameIn" maxlength="16" autocomplete="off" aria-label="Player name">
    <div class="npschool"><b>School program</b><small>The islands follow this state's standards for this grade. You can change it later in Parents.</small>
      <div class="setrow"><label for="npState">State</label><select id="npState">${stOpts(lsGet('pip-newstate')||(last&&last.settings&&last.settings.state&&last.settings.state!=='US'?last.settings.state:'')||(D.state==='US'?'':D.state))}</select></div>
      <div class="setrow"><label for="npGrade">Grade</label><select id="npGrade">${grOpts(D.state,D.grade)}</select></div></div>
    <label class="limchk"><input type="checkbox" id="limIn" checked> Limit play to 45 minutes a day <small>Recommended. Parents can change it any time.</small></label><div class="btnrow"><button class="go" type="button" id="nameOk">Add player</button><button class="go alt" type="button" id="nameNo">Cancel</button></div>`,
    ()=>{const i=$('#nameIn'),sS=$('#npState'),sG=$('#npGrade');setTimeout(()=>i.focus(),100);
      sS.onchange=()=>{const st=sS.value,cur=+sG.value,ok=g=>packReady(CONTENT.packs[packKey(st,g)]);const g=ok(cur)?cur:(GRADES.map(x=>x[0]).find(ok)??cur);sG.innerHTML=grOpts(st,g)};
      const ok=()=>{const n=i.value.trim().slice(0,16);if(!n){i.focus();return}const key=packKey(sS.value,+sG.value);if(!packReady(CONTENT.packs[key])){sG.focus();return}
        const p=freshProfile();p.name=n;p.pack=key;p.settings=Object.assign({},p.settings,{state:sS.value,grade:CONTENT.packs[key].grade});lsSet('pip-newstate',sS.value);
        if($('#limIn')&&$('#limIn').checked)p.settings.limit='45';lsSet('pip-newpack',key);const id=addKid(p);closeOverlay();then&&then(id)};
      $('#nameOk').onclick=ok;i.onkeydown=e=>{if(e.key==='Enter')ok()};$('#nameNo').onclick=closeOverlay});
}
function pinPad(title,sub,onDone){let buf='';
  const html=()=>`<div class="pipbob" data-fox></div><h2 style="font-size:28px">${title}</h2>${sub?`<p>${sub}</p>`:''}<div class="pinbox" id="pinbox">${[0,1,2,3].map(i=>`<i class="${i<buf.length?'on':''}"></i>`).join('')}</div>
    <div class="keys">${[1,2,3,4,5,6,7,8,9].map(n=>`<button type="button" data-kp="${n}">${n}</button>`).join('')}<button type="button" class="del" data-kp="x" aria-label="Cancel">${ICON.close}</button><button type="button" data-kp="0">0</button><button type="button" class="del" data-kp="del" aria-label="Delete">${ICON.del}</button></div>`;
  const bind=()=>document.querySelectorAll('[data-kp]').forEach(b=>b.onclick=()=>{const k=b.dataset.kp;if(k==='x'){closeOverlay();return}if(k==='del')buf=buf.slice(0,-1);else if(buf.length<4)buf+=k;
    if(buf.length===4){const v=buf;buf='';if(onDone(v)===false){$('#ocard').innerHTML=html();refreshFoxes();bind();setTimeout(()=>{const p=$('#pinbox');p&&p.classList.add('bad')},10);sNo();return}const pb=$('#pinbox');if(pb)pb.innerHTML='<i></i><i></i><i></i><i></i>';return}
    const pb=$('#pinbox');if(pb){pb.classList.remove('bad');pb.innerHTML=[0,1,2,3].map(i=>`<i class="${i<buf.length?'on':''}"></i>`).join('')}return
});
  overlay(html(),bind)}
function kidPinPrompt(p,ok){pinPad(`Hi ${esc(p.name||'there')}! Type your PIN`,'',v=>{if(v===p.kidPin){closeOverlay();ok();return true}return false})}
function askName(first){
  overlay(`<div class="pipbob" data-fox></div><div class="eyebrow">${first?'Nice to meet you!':'Change name'}</div><h2>What's your name?</h2><p>I'll use it to cheer for you!</p>
    <input type="text" id="nameIn" maxlength="16" autocomplete="off" value="${esc(G.name)}" aria-label="Your name"><div class="btnrow"><button class="go" type="button" id="nameOk">Let's fly!</button></div>`,
    ()=>{const i=$('#nameIn');setTimeout(()=>i.focus(),100);const ok=()=>{G.name=i.value.trim().slice(0,16)||G.name||'Player';save();updateStats();closeOverlay();renderMap()};
      $('#nameOk').onclick=ok;i.onkeydown=e=>{if(e.key==='Enter')ok()}});
}
function pickPlayer(){openKids()}
$('#playerBtn').onclick=pickPlayer;

/* ================= grown-ups ================= */
let pinBuf='',pinStage='',pinFirst='';
/* ===== Writing Desk: the child writes their own paragraph or story with a frame; it is saved for grown-ups (W.4.1-3, W.4.5) ===== */
const DESK={
  opinion:{name:'Opinion',sub:'Tell what you think and why',color:'#e2558f',
    prompts:['What is the best season of the year?','Should kids have homework?','What is the best pet to have?','Should every school have a garden?','What is the best place to visit in California?','Is it better to read a book or watch the movie?'],
    parts:[['Your opinion',['I think','In my opinion,','I believe']],['Reason 1',['First,','One reason is']],['Reason 2',['Also,','Another reason is']],['Ending',['That is why','For these reasons,']]]},
  story:{name:'Story',sub:'Make up a story with a beginning, middle and end',color:'#2f9fe0',
    prompts:['Pip\'s balloon lands on a mystery island.','The day the class pet escaped.','You find a tiny door in your backyard.','Your best day ever at the beach.','A rainy day that turned out great.','A talking fox moves in next door.'],
    parts:[['Beginning: who and where?',['One sunny morning,','Once upon a time,','Last summer,']],['The problem',['Suddenly,','All at once,','But then']],['What happened next',['Then','Next,','After that,']],['Ending: how did it turn out? How did they feel?',['Finally,','In the end,']]]},
  report:{name:'Report',sub:'Use fact cards to write a short report',color:'#e09a14',
    prompts:['Sea otters','The Gold Rush','Volcanoes','Honeybees'],
    notes:{'Sea otters':['Sea otters live along the California coast.','They use rocks to crack open shellfish.','They wrap themselves in kelp so they don\'t drift while sleeping.','Their thick fur keeps them warm in cold water.'],'The Gold Rush':['Gold was found at Sutter\'s Mill in 1848.','About 300,000 people came to California.','Miners used pans to wash gold from rivers.','Towns like San Francisco grew very fast.'],'Volcanoes':['A volcano is an opening in Earth\'s crust.','Hot melted rock is called magma (lava when it comes out).','Mount Shasta in California is a volcano.','Volcanic ash can make soil very rich.'],'Honeybees':['Honeybees live in hives with up to 60,000 bees.','Worker bees collect nectar from flowers.','Bees help plants by carrying pollen.','Bees dance to tell others where flowers are.']},
    parts:[['Topic: what is your report about?',['This report is about','Did you know that']],['Fact 1 (in your own words)',['First,','One fact is that']],['Fact 2 (in your own words)',['Also,','Another fact is that']],['Ending: why does it matter?',['That is why','In conclusion,']]]},
  info:{name:'Teach it',sub:'Explain how to do something or facts about a topic',color:'#38b98a',
    prompts:['How to make a sandwich','All about your favorite animal','How to take care of a plant','All about your school','How to play your favorite game','All about the ocean'],
    parts:[['Topic: what will you teach?',['Here is how to','Let me tell you about']],['Step or fact 1',['First,','One fact is']],['Step or fact 2',['Next,','Also,','For example,']],['Ending',['Finally,','Now you know']]]},
};
const DESK_REW=15,TRANS_RE=/\b(first|second|next|then|after that|finally|also|because|for example|another|in the end|suddenly|that is why|for these reasons|so|but)\b/i;
const wcount=s=>(String(s).trim().match(/[A-Za-z0-9'’-]+/g)||[]).length;
function deskList(){return G.writing=G.writing||[]}
function openDesk(kind){
  if(!kind){overlay(`<div class="eyebrow">Writing Desk</div><h2>What will you write?</h2><p>Your writing is saved, so your grown-ups can read it.</p><div class="deskkinds">${Object.entries(DESK).map(([k,D])=>`<button type="button" class="deskkind" data-k="${k}" style="--dc:${D.color}"><b>${D.name}</b><small>${D.sub}</small></button>`).join('')}</div>${deskList().length?`<p class="note">You have written <b>${deskList().length}</b> piece${deskList().length>1?'s':''} so far.</p>`:''}<div class="actrow"><button type="button" class="go alt" id="dkClose">Close</button></div>`,()=>{
      $('#dkClose').onclick=closeOverlay;$('#ocard').querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{tone([523,784]);closeOverlay();setTimeout(()=>openDesk(b.dataset.k),60)})});return}
  const D=DESK[kind],dr=G.writeDraft&&G.writeDraft.k===kind?G.writeDraft:{k:kind,pr:pick(D.prompts),v:D.parts.map(()=>'')};G.writeDraft=dr;
  overlay(`<div class="eyebrow" style="color:${D.color}">Writing Desk · ${D.name}</div><h3 class="dkpr">${esc(dr.pr)} <button type="button" class="linkbtn" id="dkNew">new idea</button></h3>
    ${D.notes?`<div class="dknotes"><b>Fact cards</b>${(D.notes[dr.pr]||[]).map(n=>`<span>${esc(n)}</span>`).join('')}</div>`:''}<div class="dkparts">${D.parts.map(([lab,st],i)=>`<label class="dkpart"><span>${i+1}. ${lab}</span><textarea rows="2" data-i="${i}" spellcheck="true" autocapitalize="sentences" placeholder="${esc(st[0])} ...">${esc(dr.v[i]||'')}</textarea><span class="dkst">${st.map(s=>`<button type="button" class="dkchip" data-i="${i}" data-s="${esc(s)}">${esc(s)}</button>`).join('')}</span></label>`).join('')}</div>
    <ul class="dkcheck" aria-live="polite"></ul><div class="actrow"><button type="button" class="go" id="dkSave" disabled>Save my writing</button><button type="button" class="go alt" id="dkClose">Close</button></div>`,()=>{
    $('#ocard').classList.add('wide');
    const tas=[...$('#ocard').querySelectorAll('textarea')];
    const check=()=>{dr.v=tas.map(t=>t.value);save(true);const parts=dr.v.map(s=>s.trim()),all=parts.join(' '),w=wcount(all);
      const items=[[parts.every(p=>wcount(p)>=3),'Every part has a sentence'],[parts.filter(Boolean).every(p=>/^[A-Z"“]/.test(p)),'Sentences start with a capital letter'],[parts.filter(Boolean).every(p=>/[.!?]["”]?$/.test(p)),'Sentences end with . ! or ?'],[TRANS_RE.test(all),'Uses a linking word (first, then, because, also...)'],[w>=40,`At least 40 words (${w} now)`]].concat(kind==='story'?[[/["“][^"”]{3,}["”]/.test(all),'Has dialogue: someone talks in "quotation marks"']]:[]);
      $('#ocard .dkcheck').innerHTML=items.map(([ok,t])=>`<li class="${ok?'ok':''}">${ok?CHECK:'<span class="dot"></span>'} ${t}</li>`).join('');
      $('#dkSave').disabled=!items[0][0];return items};
    tas.forEach(t=>t.oninput=check);
    $('#ocard').querySelectorAll('.dkchip').forEach(b=>b.onclick=()=>{const t=tas[+b.dataset.i];const s=b.dataset.s;if(!t.value.trim())t.value=s+' ';else if(!t.value.startsWith(s))t.value=s+' '+t.value.trim()[0].toLowerCase()+t.value.trim().slice(1);t.focus();t.setSelectionRange(t.value.length,t.value.length);check()});
    $('#dkNew').onclick=()=>{let p;do{p=pick(D.prompts)}while(p===dr.pr&&D.prompts.length>1);dr.pr=p;$('#ocard .dkpr').firstChild.textContent=p+' ';const nb=$('#ocard .dknotes');if(nb)nb.innerHTML=`<b>Fact cards</b>${D.notes[p].map(n=>`<span>${esc(n)}</span>`).join('')}`;save(true)};
    $('#dkClose').onclick=()=>{$('#ocard').classList.remove('wide');closeOverlay()};
    $('#dkSave').onclick=()=>{const items=check(),txt=dr.v.map(s=>s.trim()).filter(Boolean).join(' '),w=wcount(txt),L=deskList();
      L.unshift({ts:Date.now(),d:dayKey(),k:kind,pr:dr.pr,txt,w,ok:items.filter(x=>x[0]).length,of:items.length});if(L.length>40)L.length=40;
      let rew=0;if(G.writeDay!==dayKey()){G.writeDay=dayKey();rew=DESK_REW;G.coins+=rew;updateStats('#coinPill')}
      G.writeDraft=null;save();sWin();$('#ocard').classList.remove('wide');closeOverlay();
      overlay(`<div class="pipbob" data-fox></div><div class="eyebrow">Saved!</div><h2>${pick(['What a writer!','Great writing!','I love it!'])}</h2><div class="dkdone"><b>${esc(dr.pr)}</b><p>${esc(txt)}</p><small>${w} words</small></div>${rew?`<p><b>+${rew} coins</b> for writing today!</p>`:''}<p class="note">Your grown-ups can read it in Parents.</p><div class="actrow"><button type="button" class="go alt" id="dkRead">Read it to me</button><button type="button" class="go" id="dkOk">Done</button></div>`,()=>{
        $('#dkOk').onclick=()=>{stopSpeak&&stopSpeak();closeOverlay()};$('#dkRead').onclick=()=>speak(esc(txt));setTimeout(()=>burstAt($('#ocard'),80),150)})};
    check();if(!dr.v.some(Boolean))setTimeout(()=>tas[0].focus({preventScroll:true}),200)});
}
function deskParentHTML(){const L=deskList(),nm=esc(G.name||'Your child');
  return `<div class="pcard wide"><h4>Writing Desk</h4><p class="note">${nm} writes opinion pieces, stories and how-to paragraphs with a 4-part frame (4th grade writing standards). The newest are first. A good next step: read one together and ask "Can you add one more detail?"</p>${L.length?`<ul class="dklist">${L.slice(0,5).map(x=>`<li><div><b>${esc(x.pr)}</b><small>${DESK[x.k]?DESK[x.k].name:''} · ${new Date(x.ts).toLocaleDateString(undefined,{month:'short',day:'numeric'})} · ${x.w} words · ${x.ok}/${x.of||5} checklist</small></div><p>${esc(x.txt)}</p></li>`).join('')}</ul>${L.length>5?`<p class="note">${L.length-5} older piece${L.length-5>1?'s':''} saved.</p>`:''}`:`<p>No writing saved yet.</p>`}<button type="button" class="go small" id="pDesk">Open the Writing Desk</button></div>`}
function openParent(){
  stopTimers();if(CL.unlockUntil>Date.now()){renderParent();return}pinBuf='';pinStage=ROOT.pin?'enter':'create';pinFirst='';
  overlay(pinHTML(),bindPin);
}
function pinHTML(){const t={enter:'Enter the parents\' PIN',create:'Create a 4-digit PIN',confirm:'Type the PIN again'}[pinStage];
  return `<div class="eyebrow">Parents only</div><h2 style="font-size:28px">${t}</h2>${pinStage==='create'?'<p>Kids won\'t know it, so this page stays private.</p>':''}
  <div class="pinbox" id="pinbox">${[0,1,2,3].map(i=>`<i class="${i<pinBuf.length?'on':''}"></i>`).join('')}</div>
  <div class="keys">${[1,2,3,4,5,6,7,8,9].map(n=>`<button type="button" data-pk="${n}">${n}</button>`).join('')}<button type="button" class="del" data-pk="x" aria-label="Cancel">${ICON.close}</button><button type="button" data-pk="0">0</button><button type="button" class="del" data-pk="del" aria-label="Delete">${ICON.del}</button></div>
  ${pinStage==='enter'?`<p class="note">${CL.mode==='cloud'?'Forgot the PIN? Tap "Switch player" (the name button), sign out, then sign in again: Parents opens without the PIN for 10 minutes so you can set a new one.':'Forgot the PIN? Use the save code to restore progress, or contact whoever set it.'}</p>`:''}`}
let pinThen=null;
function askPinThen(fn){pinThen=fn;pinBuf='';pinStage='enter';pinFirst='';overlay(pinHTML(),bindPin)}
function bindPin(){document.querySelectorAll('[data-pk]').forEach(b=>b.onclick=()=>pinKey(b.dataset.pk))}
function pinKey(k){
  if(k==='x'){pinThen=null;closeOverlay();return}if(k==='del')pinBuf=pinBuf.slice(0,-1);else if(pinBuf.length<4)pinBuf+=k;
  if(pinBuf.length===4){
    if(pinStage==='enter'){if(pinBuf===ROOT.pin){closeOverlay();if(pinThen){const f=pinThen;pinThen=null;f();return}renderParent();return}bad()}
    else if(pinStage==='create'){pinFirst=pinBuf;pinBuf='';pinStage='confirm'}
    else{if(pinBuf===pinFirst){ROOT.pin=pinBuf;persistLocal();if(CL.mode==='cloud')CL.api.setUserDoc({pin:pinBuf}).catch(()=>{});CL.unlockUntil=0;closeOverlay();if(pinThen){const f=pinThen;pinThen=null;f();return}renderParent();return}pinStage='create';bad()}
  }
  $('#ocard').innerHTML=pinHTML();bindPin();
  function bad(){pinBuf='';setTimeout(()=>{const p=$('#pinbox');if(p){p.classList.add('bad')}},10);sNo()}
}
$('#parentBtn').onclick=openParent;
function acc(id){const s=G.stats[id];return s&&s.a?Math.round(s.c/s.a*100):null}
/* program map: the pack's islands by subject, with the standard areas their skills cover */
const stdArea=c=>c.replace(/[.-]\d+[a-z]?$/,'');
const GRADE_WORD=g=>g===0?'Kindergarten':['','1st','2nd','3rd','4th','5th'][g]+' grade';
function curMapHTML(){const gw=GRADE_WORD(PACK.grade);
  const rows=Object.keys(SUBJ_NAMES).flatMap(sj=>ISLANDS.filter(i=>i.gen&&!i.retired&&islandSubject(i)===sj).map(i=>{const areas=[...new Set(skillsOf(i.id).flatMap(s=>s.codes).map(stdArea))];
    const own=areas.filter(a=>a.includes(String(PACK.grade))&&a!=='MP');return [SUBJ_NAMES[sj],i,(own.length?own:areas).join(' / ')]}));
  return `<div class="pcard wide curmap"><h4>${gw} program map</h4><p class="note">How ${esc(G.name||'your child')} is doing in each part of the ${esc(PACK.stateName)} ${gw.toLowerCase()} program. Stars are the same as in the game: the best round, or recent accuracy (7 of 10 right lately = 2 stars, 8 of 10 = 3).</p>
      <div class="tscroll"><table class="topics cur"><thead><tr><th>Subject</th><th>Island</th><th>Standards</th><th>Progress</th></tr></thead><tbody>
      ${rows.map(([sub,i,code])=>{const sf=starFor(i.id),st=(G.stats[i.id]||{}).a||0,lab=sf?starsMini(sf):st?'Practicing':'Not started';return `<tr><td>${sub}</td><td>${esc(i.name)}<small class="cdone">${esc(i.topic)}</small></td><td><code>${esc(code)}</code></td><td><span class="cst s${sf||(st?'p':'n')}">${lab}</span></td></tr>`}).join('')}
      </tbody></table></div></div>`}
/* grown-ups: three tabs and one line that says what to do this week */
let pTab='prog';
const PT_ICO={prog:`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="12" width="5" height="9" rx="1.5" fill="#5fc3f0" stroke="#1f3557" stroke-width="2"/><rect x="9.5" y="7" width="5" height="14" rx="1.5" fill="#38b98a" stroke="#1f3557" stroke-width="2"/><rect x="16" y="3" width="5" height="18" rx="1.5" fill="#ffc23d" stroke="#1f3557" stroke-width="2"/></svg>`,acct:`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18a4.5 4.5 0 0 1-.6-9 6 6 0 0 1 11.4 1.6A3.8 3.8 0 0 1 17.5 18Z" fill="#dff3ff" stroke="#1f3557" stroke-width="2" stroke-linejoin="round"/><path d="M12 10.5v5m-2.3-2.4L12 15.5l2.3-2.4" fill="none" stroke="#1f3557" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`};
function parentTabs(rows,allA){const grid=document.querySelector('#parentBody .pgrid');if(!grid)return;
  /* long detail cards start closed, so the first screen shows the week at a glance */
  grid.querySelectorAll(':scope>.pcard').forEach(c=>{const h=c.querySelector(':scope>h4');if(!h||!/^(Skills checklist|Topics|Home Puzzles|Recent mistakes|Writing Desk|Reading fluency|Test Practice|.*program map|Last 7 days|Today)/.test(h.textContent))return;
    const d=document.createElement('details');d.className='pfold';const sm=document.createElement('summary');sm.appendChild(h);sm.insertAdjacentHTML('beforeend','<span class="pfmore">Show</span>');d.appendChild(sm);while(c.firstChild)d.appendChild(c.firstChild);c.appendChild(d)});
  const tabOf=h=>/^(Settings|Players|Install|School program|Join a teacher|Teacher's class|In class right now)/.test(h)?'set':/^(Account|Emails and|Teacher tools|Backups|Move progress|Delete|Danger|Reset|Erase)/.test(h)?'acct':'prog';
  grid.querySelectorAll(':scope>.pcard').forEach(c=>{const h=(c.querySelector('h4')||{}).textContent||'';c.dataset.ptab=tabOf(h)});
  const w=rows.find(r=>r.s.a>=5&&r.p!=null&&r.p<80);
  /* the top card: the week in three lines (played, going well, practice next); before there is enough to say, what will appear here */
  const nm0=esc(G.name||'your child'),wk=[...Array(7)].map((_,k)=>G.days[addDays(k-6)]||{}).reduce((a,d)=>[a[0]+(d.sec||0)/60,a[1]+(d.q||0),a[2]+(d.c||0)],[0,0,0]).map(Math.round);
  const good=rows.filter(r=>r.s.a>=8&&r.p!=null&&r.p>=85).sort((a,b)=>b.p-a.p).slice(0,2);
  let focus;
  if(allA<20)focus=`<p><b>Pip is getting to know ${nm0}.</b> ${allA?`${allA} puzzle${allA>1?'s':''} so far. `:''}After about 20 puzzles, this card shows the week in three lines: how much ${nm0} played, what is going well, and the one topic to practice next.</p>
    <ul class="pglance soon"><li>Meanwhile: set a <b>family goal</b> with a reward below${CL.mode==='cloud'?', or turn on the <b>weekly email</b> in Account':''}.</li></ul>`;
  else focus=`<ul class="pglance">
    <li><b>Played:</b> ${wk[0]} min this week · ${wk[1]} puzzles${wk[1]?` · ${Math.round(wk[2]/wk[1]*100)}% right on the first try`:''}</li>
    <li><b>Going well:</b> ${good.length?good.map(r=>`${esc(r.i.name)} (${r.p}%)`).join(', '):'keep playing, strong topics will show up here'}</li>
    ${(()=>{const L=(G.msLog||[]).filter(m=>m.d>=addDays(-6));if(!L.length)return '';const g=L.reduce((a,m)=>a+m.g,0),n=L.reduce((a,m)=>a+m.n,0),fav={};L.forEach(m=>fav[m.i]=(fav[m.i]||0)+1);
      const top=Object.entries(fav).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([i])=>byId(i)&&byId(i).name).filter(Boolean),W=PROJECTS.filter(P=>P.res&&projStage(P.id)>0).map(P=>`${P.name} (step ${projStage(P.id)} of ${P.stages.length})`);
      return `<li><b>Missions:</b> ${L.length} this week · ${Math.round(g/Math.max(1,n)*100)}% golden (first try)${top.length?` · favorites: ${top.map(esc).join(', ')}`:''}${W.length?` · building: ${W.map(esc).join(', ')}`:''}</li>`})()}
    <li><b>Practice next:</b> ${w?`${esc(w.i.name)}, ${esc(w.i.topic.toLowerCase())} (${w.p}% right on the first try).${lessonsFor(w.i.id).length?' Its 3-minute lesson explains the trick.':''}`:'nothing urgent: every topic is at 80% or more right on the first try.'}</li></ul>
    ${w?`<p class="pfbtn"><button type="button" class="go small" data-play="${w.i.id}">Play ${esc(w.i.name)} together</button></p>`:''}`;
  /* the top card already names the topic to practice: Pip's note about the same topic would only repeat it */
  if(w)grid.querySelectorAll('.pnotes li').forEach(li=>{if(/hardest topic/.test(li.textContent)&&li.textContent.startsWith(w.i.name))li.remove()});
  grid.querySelectorAll('.pnotes').forEach(c=>{if(!c.querySelector('li'))c.remove()});
  grid.insertAdjacentHTML('afterbegin',`<div class="pcard wide pfocus" data-ptab="prog"><span class="pfico">${PT_ICO.prog}</span><div class="pfbody"><h4>${allA<20?'Getting started':'The week at a glance'}</h4>${focus}</div></div>`);
  grid.querySelectorAll(':scope>.pcard').forEach(c=>{if(/^Install/.test((c.querySelector('h4')||{}).textContent||''))grid.appendChild(c)});
  const fb=grid.querySelector('.pfocus [data-play]');if(fb)fb.onclick=()=>start(byId(fb.dataset.play),{noOffer:true});
  grid.insertAdjacentHTML('beforebegin',`<div class="itabs ptabs" role="tablist" aria-label="Parents' Corner sections"><button type="button" role="tab" data-pt="prog">${PT_ICO.prog}<span>Progress</span></button><button type="button" role="tab" data-pt="set">${ICON.gear}<span>Settings</span></button><button type="button" role="tab" data-pt="acct">${PT_ICO.acct}<span>Account<span class="ptlong"> &amp; data</span></span></button></div>`);
  const sel=t=>{pTab=t;document.querySelectorAll('.ptabs [data-pt]').forEach(b=>b.setAttribute('aria-selected',b.dataset.pt===t));grid.querySelectorAll(':scope>.pcard').forEach(c=>c.hidden=c.dataset.ptab!==t)};
  document.querySelectorAll('.ptabs [data-pt]').forEach(b=>b.onclick=()=>sel(b.dataset.pt));sel(pTab)}
function parentSwitch(id){if(!ROOT.profiles[id]||id===ROOT.current)return;save();ROOT.current=id;G=ROOT.profiles[id];const r=CL.remote[id];if(r&&r.p){G=mergeProfiles(G,r.p);ROOT.profiles[id]=G;r.fresh=false}persistLocal();
  try{sessionStorage.setItem('pip-resume-to','parent');sessionStorage.setItem('pip-unlock',String(CL.unlockUntil||0))}catch(e){}
  if(ensurePack())return;try{sessionStorage.removeItem('pip-resume-to');sessionStorage.removeItem('pip-unlock')}catch(e){}applySettings();refreshFoxes();renderParent()}
function renderParent(){
  show('parent');
  const t=today(),last7=[...Array(7)].map((_,i)=>addDays(i-6)),mins=last7.map(k=>Math.round(((G.days[k]||{}).sec||0)/60)),maxM=Math.max(10,...mins);
  const allA=Object.values(G.stats).reduce((a,s)=>a+s.a,0),allC=Object.values(G.stats).reduce((a,s)=>a+s.c,0);
  const rows=ISLANDS.filter(i=>i.gen&&!i.retired).map(i=>({i,s:G.stats[i.id]||{a:0,c:0},p:acc(i.id)})).sort((a,b)=>(a.p==null)-(b.p==null)||(a.p??0)-(b.p??0));
  const weak=rows.filter(r=>r.s.a>=5&&r.p<70).slice(0,3);
  const gi=goalInfo();
  $('#pSub').textContent=`${G.name||'Player'} · Level ${levelOf(G.xp)+1} · ${starTotal()} stars · ${fmt(G.coins)} coins`;
  const sel=(id,opts,val)=>`<select id="${id}">${opts.map(([v,l])=>`<option value="${v}"${v===val?' selected':''}>${l}</option>`).join('')}</select>`;
  const sw=(id,on)=>`<button type="button" class="switch" role="switch" id="${id}" aria-checked="${on}"></button>`;
  const notes=[];{const mx=Math.max(...mins),di=mins.indexOf(mx);if(mx>60&&!+(G.settings.limit||0))notes.push(`<b>${Math.floor(mx/60)} h ${mx%60} min</b> played on ${new Date(last7[di]+'T12:00:00').toLocaleDateString('en-US',{weekday:'long'})}. That is a lot for one day. You can set a daily time limit in Settings below.`)}
  {const w=rows.find(r=>r.s.a>=10&&r.p<60);if(w){const ln=Object.keys(G.lessons||{}).filter(k=>LESSONS.some(L=>L.id===k&&L.isl===w.i.id)).length;notes.push(`<b>${esc(w.i.name)}</b> is the hardest topic right now: ${w.p}% right on the first try (${w.s.a} puzzles). ${lessonsFor(w.i.id).length?(ln?`${ln} of ${lessonsFor(w.i.id).length} Pip lessons done for it.`:`Pip has ${lessonsFor(w.i.id).length} short lessons for it; none done yet.`):''}`)}}
  {const lastD=Object.keys(G.days||{}).filter(k=>(G.days[k].q||0)>0).sort().pop();const away=lastD?Math.floor((Date.now()-new Date(lastD+'T12:00'))/864e5):0;if(away>=4)notes.push(`${esc(G.name||'Your child')} has not played for <b>${away} days</b>. Even 10 minutes a day keeps skills fresh.`)}
  {const od=typeof openTasks==='function'?openTasks().filter(t=>!t.done&&t.due&&t.due<dayKey()):[];if(od.length)notes.push(`<b>${od.length} class task${od.length>1?'s are':' is'} overdue</b> from ${esc((G.cls||{}).teacher||'the teacher')}. They are on the map, in the class card.`)}
  if(new Date().getDay()===1&&!notes.length){const lw=weekHist(2)[0];if(lw[1])notes.push(`New week! Last week ${esc(G.name||'your child')} played <b>${lw[0]} minutes</b> and answered <b>${lw[1]} puzzles</b> (${Math.round(lw[2]/lw[1]*100)}% right on the first try).`)}
  if(G.review.length>=15)notes.push(`<b>${G.review.length} old mistakes</b> are waiting for practice (${G.fixed} fixed so far). One comes back in every round and up to five in the Daily Challenge.`);
  const kidsP=Object.keys(ROOT.profiles).filter(id=>!ROOT.profiles[id].roster);
  $('#parentBody').innerHTML=`${typeof langSwitchHTML==='function'?langSwitchHTML():''}${kidsP.length>1?`<div class="kidbar" role="tablist" aria-label="Child">${kidsP.map(id=>`<button type="button" role="tab" data-pk="${id}" aria-selected="${id===ROOT.current}"><span class="kav sm">${kidAvatar(ROOT.profiles[id])}</span>${esc(ROOT.profiles[id].name||'Player')}<small>${kidGrade(ROOT.profiles[id])}</small></button>`).join('')}</div>`:''}<div class="pgrid">${notes.length?`<div class="pcard wide pnotes"><h4>Pip's notes</h4><ul>${notes.map(n=>`<li>${n}</li>`).join('')}</ul></div>`:''}
    ${(()=>{const wk=off=>{const D=[...Array(7)].map((_,k)=>addDays(k-6-off));return D.reduce((a,k)=>{const d=G.days[k]||{};return [a[0]+(d.sec||0)/60,a[1]+(d.q||0),a[2]+(d.c||0)]},[0,0,0]).map(Math.round)};
      const w=wk(0),p=wk(7),ac=w[1]?Math.round(w[2]/w[1]*100):null,acp=p[1]?Math.round(p[2]/p[1]*100):null;
      const SK=ISLANDS.filter(i=>i.gen&&!i.retired).flatMap(i=>skillsOf(i.id)),mast=SK.filter(s=>skStat(s.k).st===2).length,tried=SK.filter(s=>skStat(s.k).n).length,alm=SK.filter(s=>skAlmost(skStat(s.k))).length;
      const tr=(a,b,u='')=>{if(a==null||b==null)return '';const d=a-b;return d===0?'<small class="tr">same as last week</small>':`<small class="tr ${d>0?'up':'dn'}">${d>0?'▲':'▼'} ${Math.abs(d)}${u} vs last week</small>`};
      return `<div class="pcard wide"><h4>This week</h4><div class="ctiles">
        <div><b>${w[0]}</b><span>minutes played</span>${tr(w[0],p[0],' min')}</div>
        <div><b>${w[1]}</b><span>puzzles answered</span>${tr(w[1],p[1])}</div>
        <div><b>${ac==null?'–':ac+'%'}</b><span>right on the first try ${qhelp('first')}</span>${ac!=null&&acp!=null?tr(ac,acp,'%'):''}</div>
        <div><b>${mast} <small>of ${SK.length}</small></b><span>skills mastered ${qhelp('mastered')}</span><small class="tr">${alm} almost there ${qhelp('almost')} · ${tried} tried</small></div></div>
        ${(()=>{const yp=yearPace();if(!yp||yp.st==='early'||!tried)return '';return `<p class="pace p-${yp.st}"><b>School-year pace ${qhelp('pace')}:</b> ${yp.st==='ahead'?'ahead of pace':yp.st==='on'?'on pace':'a bit behind pace'} (${Math.round(yp.have*100)}% of this grade's skills, ${Math.round(yp.f*100)}% of the school year so far).</p>`})()}
        <div class="btnrow" style="justify-content:flex-start"><button type="button" class="go small alt" id="wkPrint">Print this week's report</button></div>
        <p class="note">A skill is mastered at 8 of the last 10 right on the first try, on 2 different days. Settings, the school program and class topics are in the <b>Settings</b> tab.</p></div>`})()}
    ${notifyAskHTML()}
    ${fromTeacherHTML()}
    ${typeof recordParentHTML==='function'?recordParentHTML():''}
    ${fgoalParentHTML()}
    <div class="pcard"><h4>Needs practice</h4>${weak.length?`<ul class="mist">${weak.map(r=>`<li>${r.i.name}<small>${r.i.topic} · ${r.p}% first-try (${r.s.a} puzzles)</small>${homeTip(r.i.id)?`<p class="htip"><b>Try at home:</b> ${esc(homeTip(r.i.id))}</p>`:''}</li>`).join('')}</ul>`:`<p>${allA<10?'Not enough data yet. After a few islands, weak topics will show up here.':'No weak topics right now. Great job!'}</p>`}
      <p>Waiting at Fix-It Falls: <b>${G.review.length}</b> puzzle${G.review.length===1?'':'s'} (${reviewDue().length} due today).</p></div>
    <div class="pcard"><h4>Last 8 weeks</h4>${weeksHTML(weekHist(8))}</div>
    <div class="pcard"><h4>Last 7 days (minutes)</h4><div class="days7">${last7.map((k,i)=>`<div><em>${mins[i]}</em><i style="height:${Math.max(2,mins[i]/maxM*100)}%"></i><span>${DSHORT[new Date(k+'T12:00').getDay()]}</span></div>`).join('')}</div>
      <p>All time: ${allA} puzzles, ${allA?Math.round(allC/allA*100):0}% right on the first try. Best combo: ${G.bestCombo}. Mistakes fixed for good: ${G.fixed}.</p></div>
    <div class="pcard ptoday"><h4>Today</h4><div class="kpis">
      <div class="kpi"><b>${Math.floor(t.sec/60)}</b><small>minutes played</small></div><div class="kpi"><b>${t.q}</b><small>puzzles answered</small></div>
      <div class="kpi"><b>${t.q?Math.round(t.c/t.q*100)+'%':'–'}</b><small>right on first try</small></div><div class="kpi"><b>${gi?(gi.cur>=gi.max?'Done':gi.label):'Off'}</b><small>daily goal</small></div></div><p class="note">Today: ${t.h||0} hints shown · ${t.w||0} "How?" explanations · ${t.l||0} lessons · ${t.e||0} coins earned, ${t.s||0} spent.</p></div>
    ${packParentHTML()}${typeof visitParentHTML==='function'?visitParentHTML():''}
    ${classParentHTML()}
    ${nowParentHTML()}
    ${skillsParentHTML()}
    ${testParentHTML()}
    ${fluencyParentHTML()}
    ${deskParentHTML()}
    <div class="pcard wide"><h4>Install the app</h4>${isStandalone()?'<p>You are using the installed app. It opens even without internet; progress uploads when you are back online.</p>':`<p>Put Pip on the home screen: it opens like an app, full screen, and works without internet.</p>${installEvt?'<button type="button" class="go small leaf" id="pInstall">Install on this device</button>':/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)?'<p><b>iPhone / iPad:</b> open this site in <b>Safari</b>, tap <b>Share</b> (the square with an arrow), then <b>Add to Home Screen</b>.</p>':'<p><b>Android:</b> Chrome menu (⋮) → <b>Install app</b> or <b>Add to Home screen</b>. <b>Computer:</b> the install icon at the right end of the address bar.</p>'}<p class="note">On iPhone and iPad the installed app keeps its own copy of the game. Sign in once inside it (Parents → account) and the progress comes back from the cloud.</p>`}</div>
    ${curMapHTML()}
    <div class="pcard wide"><h4>Topics</h4><div class="tscroll"><table class="topics"><thead><tr><th>Island</th><th>Puzzles</th><th>First-try accuracy</th><th>Last 20</th><th>Level</th><th>Stars</th></tr></thead><tbody>
      ${rows.map(r=>`<tr><td><button type="button" class="cisl" data-play="${r.i.id}">${r.i.name}</button></td><td>${r.s.a}</td><td>${r.p==null?'–':`<div class="acc ${r.p<60?'low':r.p<80?'mid':''}"><div class="bar"><i style="width:${r.p}%"></i></div>${r.p}%</div>`}</td><td>${(()=>{const m=rollAcc(r.i.id);return m.n?`${Math.round(m.acc*100)}%${m.n>=12&&m.acc>=.8?' ✓':''}`:'–'})()}</td><td>${DIFF_NAME[diffFor(r.i)]}</td><td>${starsMini(starFor(r.i.id))||'–'}</td></tr>`).join('')}
    </tbody></table></div></div>
    <div class="pcard wide"><h4>Recent mistakes</h4>${G.wrongLog.length?`<ul class="mist">${G.wrongLog.slice(0,10).map(w=>`<li>${esc(w.p)}<small>${(byId(w.i)||{}).name||''} · answer: ${esc(w.a)} · ${w.d}</small></li>`).join('')}</ul>`:'<p>No mistakes yet!</p>'}</div>
    ${(()=>{const P=(G.home&&G.home.inside&&G.home.inside.pz)||{n:0,by:{},att:{},first:{},done:{},day:''};const att=P.att||{},fst=P.first||{},by=P.by||{},today=P.day===dayKey()?P.done||{}:{};
      const next=INSIDE.filter(it=>it.prize&&it.prize>(P.n||0)).sort((a,b)=>a.prize-b.prize)[0];
      return `<div class="pcard wide"><h4>Home Puzzles</h4><p class="note">Math tasks inside ${esc(G.name||'the player')}'s home: one of each gives coins once a day.</p><ul class="mist pzlist">${PZ_TYPES.map(T=>{const a=att[T.id]||0,f=fst[T.id]||0;return `<li>${T.name} <small>${T.sub} · <b>${by[T.id]||0}</b> solved${a?` · ${Math.round(f/a*100)}% right on the first try (${f} of ${a})`:''}${today[T.id]?' · done today':''}</small></li>`}).join('')}</ul><p>Total solved: <b>${P.n||0}</b>${next?` · ${next.prize-(P.n||0)} more to unlock the ${esc(next.name)}`:' · all prizes unlocked'}.</p></div>`})()}
    <div class="pcard"><h4>Settings for ${esc(G.name||'this player')}</h4>
      <div class="setrow"><label for="setGoal">Daily goal<small>Pip suggests a break when it's reached; after it, puzzles give fewer coins</small></label>${sel('setGoal',[['min10','10 minutes'],['min15','15 minutes'],['min20','20 minutes'],['min30','30 minutes'],['q30','30 puzzles'],['off','No goal']],G.settings.goal)}</div>
      <div class="setrow"><label for="setLimit">Daily time limit<small>After it, new puzzles wait until tomorrow. Your PIN can add 15 minutes.</small></label>${sel('setLimit',[['0','No limit'],['30','30 minutes'],['45','45 minutes'],['60','1 hour'],['90','1.5 hours'],['120','2 hours']],String(G.settings.limit||'0'))}</div>
      <div class="setrow"><label for="setDiff">Difficulty<small>Auto adjusts each island after every round</small></label>${sel('setDiff',[['auto','Auto (recommended)'],['1','Always Easy'],['2','Always Normal'],['3','Always Hard']],G.settings.diff)}</div>
      <div class="setrow"><label>Show everything now<small>New players get places one by one as they play (Fix-It Falls, the Sticker Album, Thunder Tower, Test Practice), so the first days stay simple. Turn on to open them all now.</small></label>${sw('setAll',!!G.settings.showAll)}</div>
      ${canTalk()?`<div class="setrow"><label for="setVoice">Pip's voice<small>Pip's own voice sounds like a real cartoon fox. It needs the internet for new questions; offline, the device voice reads them.</small></label><select id="setVoice"></select></div>
      <div class="setrow" id="vstyleRow"><label for="setVstyle">Voice style<small>For a device voice</small></label>${sel('setVstyle',[['fox','Cheerful fox (higher, bouncy)'],['calm','Gentle fox (softer, slower)'],['plain','Normal voice']],G.settings.vstyle)}</div>
      <div class="setrow"><label>Try it</label><button type="button" class="go small" id="testVoice">Hear Pip</button></div>`:'<div class="setrow"><small>This browser has no voices available for reading aloud.</small></div>'}
      ${canTalk()?`<div class="setrow"><label>Read everything aloud<small>Pip reads each question, hints, explanations and his own lines by himself. Great for younger readers. The speaker button always works.</small></label>${sw('setRead',!!G.settings.read)}</div>`:''}
      <div class="setrow"><label for="setMvol">Music volume<small>On this device. Music can also be turned off in the menu.</small></label><input type="range" id="setMvol" min="0" max="100" step="5" value="${Math.round(mVol*100)}" aria-label="Music volume"></div>
      <div class="setrow"><label>Bigger text</label>${sw('setBig',G.settings.big)}</div>
      <div class="setrow"><label>Easy-to-read font<small>Wider letters and spacing, helpful for dyslexia</small></label>${sw('setDys',G.settings.dys)}</div>
      <div class="setrow"><label>Spanish help <span lang="es">· Ayuda en español</span><small>For children learning English: in math and science, a Spanish hint and Spanish meanings for key words (tap a dotted word). Reading, writing and grammar stay in English.${typeof classDoc==='function'&&G.cls&&(classDoc()||{}).es?' <b>The teacher has turned it on for the class.</b>':''}</small></label>${sw('setEs',!!G.settings.es)}</div>
      <div class="setrow"><label for="setName">Player name</label><input type="text" id="setName" maxlength="16" value="${esc(G.name)}"></div>
      <div class="setrow"><label>Player PIN<small>Optional. Stops brothers and sisters from playing as ${esc(G.name||'this player')}.</small></label><span class="actrow"><button type="button" class="go small alt" id="kPin">${G.kidPin?'Change':'Set PIN'}</button>${G.kidPin?'<button type="button" class="go small alt" id="kPinOff">Remove</button>':''}</span></div>
    </div>
    <div class="pcard"><h4>Players</h4><p>Each player has their own stars, coins and progress. Tap a name to switch.</p>
      <div class="profs">${Object.keys(ROOT.profiles).filter(id=>!ROOT.profiles[id].roster||id===ROOT.current).map(id=>`<button type="button" class="prof${id===ROOT.current?' cur':''}" data-sw="${id}">${esc(ROOT.profiles[id].name||'Player')}</button>`).join('')}</div>
      <div class="actrow" style="justify-content:flex-start"><button type="button" class="go small" id="addP">Add player</button>${Object.keys(ROOT.profiles).length>1?'<button type="button" class="go small alt" id="delP">Remove this player</button>':''}</div><p class="note" id="pNote"></p>
      <h4 style="margin-top:8px">Parents\' PIN</h4><div class="actrow" style="justify-content:flex-start"><button type="button" class="go small alt" id="chPin">Set a new PIN</button></div></div>
    ${notifyHTML()}
    ${teacherAcctHTML()}
    <div class="pcard wide"><h4>Account and saving</h4><p class="note" id="cloudNote"></p>
      ${CL.mode==='cloud'?`<p>Signed in as <b>${esc(CL.email)}</b>. Every player in this account is saved in the cloud and appears on any device where you sign in.</p>
        <div class="actrow" style="justify-content:flex-start"><button type="button" class="go small alt" id="aOut">Sign out</button><button type="button" class="go small alt" id="aDl">Download all data</button><button type="button" class="go small alt" id="aDel">Delete account and all data</button></div><p class="note" id="aNote"></p>`
      :CL.mode==='offline'?'<p>No connection to the cloud right now. Everything is saved on this device and uploads next time the game opens online.</p>'
      :CL.api&&CL.api.configured?`<p>Not signed in. Progress lives only in this browser and can be lost if browser data is cleared. Sign in to keep it safe: your players move into your account.</p>
        <div class="actrow" style="justify-content:flex-start"><button type="button" class="go small leaf" id="aIn">Sign in or create account</button><button type="button" class="go small alt" id="aDl">Download all data</button></div>`
      :`<p>Cloud saving is not set up for this copy of the game, so progress is saved in this browser. Use the save code below to move it.</p><div class="actrow" style="justify-content:flex-start"><button type="button" class="go small alt" id="aDl">Download all data</button></div>`}
      <p><a class="linkbtn" href="privacy.html" target="_blank" rel="noopener">Privacy notice</a></p></div>
    ${CL.mode==='cloud'?`<div class="pcard wide"><h4>Backups for ${esc(G.name||'this player')}</h4><p>One copy is saved automatically every day and kept for 30 days. Restoring replaces this player's progress on every device (the current progress is backed up first).</p>
      <ul class="bklist" id="bkList"><li><span>Loading backups...</span></li></ul>
      <div class="actrow" style="justify-content:flex-start"><button type="button" class="go small alt" id="bkNow">Back up now</button><span class="note" id="bkNote"></span></div></div>`:''}
    <div class="pcard wide"><h4>Move progress with a code</h4>
      <p>Copy this code to move ${esc(G.name||'this player')} to another account or browser. Pasting a code adds its players here; it never erases anyone.</p>
      <textarea class="code" id="codeOut" readonly aria-label="Save code"></textarea>
      <div class="actrow" style="justify-content:flex-start"><button type="button" class="go small" id="copyCode">Copy code</button><span class="note" id="copyNote"></span></div>
      <label for="codeIn" style="font-weight:800">Add players from a code</label><textarea class="code" id="codeIn" placeholder="Paste a code that starts with PIP1:"></textarea>
      <div class="actrow" style="justify-content:flex-start"><button type="button" class="go small alt" id="loadCode">Add from code</button><span class="note" id="loadNote"></span></div></div>
    <div class="pcard wide"><h4>Reset</h4><p>Erase all progress for ${esc(G.name||'this player')} (stars, coins, stickers, stats) on every device. You can undo it with a backup${CL.mode==='cloud'?' above':''} for 30 days.</p>
      <div class="actrow" style="justify-content:flex-start"><button type="button" class="go small alt" id="resetP">Reset this player</button><span class="note bad" id="resetNote"></span></div></div>
  </div>`;
  setSync();$('#codeOut').value=encodeSave(ROOT.current);if(CL.mode==='cloud')loadBackups();
  document.querySelectorAll('[data-play]').forEach(b=>b.onclick=()=>start(byId(b.dataset.play)));
  if(typeof bindVisitDoors==='function')bindVisitDoors($('#parent'));const sS=$('#setState'),sG=$('#setGrade');if(sS&&sG){sS.onchange=()=>setPack(sS.value,+sG.value);sG.onchange=()=>setPack(sS.value,+sG.value)}
  document.querySelectorAll('[data-now]').forEach(b=>b.onclick=()=>{const id=b.dataset.now,L=G.settings.now=(G.settings.now||[]).slice(),k=L.indexOf(id);if(k>=0)L.splice(k,1);else{if(L.length>=4)L.shift();L.push(id)}save();renderParent();const c=[...document.querySelectorAll('.pcard h4')].find(h=>h.textContent==='In class right now');c&&c.scrollIntoView({block:'center'})});
  if($('#pDesk'))$('#pDesk').onclick=()=>openDesk();if($('#pFlu'))$('#pFlu').onclick=()=>openFluency();
  if($('#pInstall'))$('#pInstall').onclick=async()=>{const e=installEvt;if(!e)return;e.prompt();try{await e.userChoice}catch(x){}installEvt=null;renderParent()};
  $('#setGoal').onchange=e=>{G.settings.goal=e.target.value;save();updateStats()};
  $('#setLimit').onchange=e=>{G.settings.limit=e.target.value;save()};
  $('#setDiff').onchange=e=>{G.settings.diff=e.target.value;save()};
  const bindSw=(id,key,fx)=>{$('#'+id).onclick=e=>{G.settings[key]=!G.settings[key];e.currentTarget.setAttribute('aria-checked',G.settings[key]);save();fx&&fx()}};
  fillVoiceSelect();
  if($('#setVoice')){$('#setVoice').onchange=e=>{const v=e.target.value;G.settings.pv=v==='__pip';if(v!=='__pip')G.settings.voice=v;save();pickVoice();fillVoiceSelect();speak(`Hi${nm()}! I'm Pip. Do you like my voice?`,{pip:true,user:true})};
    $('#setVstyle').onchange=e=>{G.settings.vstyle=e.target.value;save();speak(`Hi${nm()}! I'm Pip. Do you like my voice?`,{pip:true,user:true})};
    $('#testVoice').onclick=()=>speak(`Hi${nm()}! I'm Pip, your balloon-flying ${heroName()}. Let's solve some puzzles together!`,{pip:true,user:true})}bindSw('setBig','big',applySettings);if($('#setEs'))bindSw('setEs','es');if($('#setRead'))bindSw('setRead','read');if($('#setMvol'))$('#setMvol').oninput=e=>{setMusicVolume(+e.target.value/100);if(!mTimer&&musicOn)musicStart()};bindSw('setAll','showAll');bindSw('setDys','dys',applySettings);
  $('#setName').onchange=e=>{G.name=e.target.value.trim().slice(0,16);save();updateStats()};
  document.querySelectorAll('[data-sw],[data-pk]').forEach(b=>b.onclick=()=>parentSwitch(b.dataset.sw||b.dataset.pk));
  $('#addP').onclick=()=>newPlayer(id=>{save();ROOT.current=id;G=ROOT.profiles[id];persistLocal();if(ensurePack())return;applySettings();renderParent()});
  if($('#delP'))$('#delP').onclick=async e=>{const b=e.currentTarget,n=$('#pNote');if(b.dataset.c!=='1'){b.dataset.c='1';b.textContent='Tap again to remove';n.className='note bad';n.textContent=`This removes ${G.name||'this player'}, all their progress and backups, on every device.`;return}
    const id=ROOT.current;b.disabled=true;
    if(CL.mode==='cloud'){n.className='note';n.textContent='Removing...';try{await CL.api.deleteKid(id)}catch(err){b.disabled=false;n.className='note bad';n.textContent='Could not remove right now. Check the internet and try again.';return}CL.remote[id]={deleted:true}}
    else if(CL.mode==='offline'){b.disabled=false;n.textContent='Removing a player needs the internet.';return}
    delete CL.dirty[id];delete ROOT.profiles[id];(ROOT.gone=ROOT.gone||{})[id]=1;ROOT.current=Object.keys(ROOT.profiles)[0];G=ROOT.profiles[ROOT.current];persistLocal();if(ensurePack())return;applySettings();renderParent()};
  $('#kPin').onclick=()=>{let first='';pinPad('New player PIN','4 digits the player will type to start.',v=>{if(!first){first=v;$('#ocard h2').textContent='Type it again';return}if(v!==first){first='';$('#ocard h2').textContent='New player PIN';return false}G.kidPin=v;save();closeOverlay();renderParent();toast('Player PIN set',`${esc(G.name||'Player')} will type it to start.`,'#38b98a')})};
  if($('#kPinOff'))$('#kPinOff').onclick=()=>{G.kidPin='';save();renderParent()};
  if($('#aOut'))$('#aOut').onclick=signOutNow;
  if($('#aIn'))$('#aIn').onclick=()=>{leaveGuest();CL.mode==='guest'&&showGate()};
  if($('#aDl'))$('#aDl').onclick=downloadData;
  if($('#aDel'))$('#aDel').onclick=deleteAccountFlow;
  if($('#bkNow'))$('#bkNow').onclick=async()=>{const n=$('#bkNote');save();n.textContent='Saving...';const p=G,t=new Date();
    try{await CL.api.writeBackup(ROOT.current,`${dayKey()}-m${String(t.getHours()).padStart(2,'0')}${String(t.getMinutes()).padStart(2,'0')}`,bkDoc(p));n.className='note ok';n.textContent='Backup saved.';loadBackups()}catch(e){n.className='note bad';n.textContent='Backups need the internet.'}};
  bindClassParent();bindTeacherAcct();bindFGoal();bindNotify();bindNotifyAsk();if($("#wkPrint"))$("#wkPrint").onclick=printWeek;if(typeof bindRecord==="function")bindRecord();
  parentTabs(rows,allA);if(typeof bindLangSwitch==='function'){bindLangSwitch();esWatch()}if(typeof tourHook==='function')tourHook('parent');
  $('#chPin').onclick=()=>{pinBuf='';pinStage='create';overlay(pinHTML(),bindPin)};
  $('#copyCode').onclick=()=>{const ta=$('#codeOut');const ok=()=>$('#copyNote').textContent='Copied!';
    try{navigator.clipboard.writeText(ta.value).then(ok,()=>{ta.select();$('#copyNote').textContent='Selected. Press Ctrl+C / ⌘C to copy.'})}catch(e){ta.select();$('#copyNote').textContent='Selected. Press Ctrl+C / ⌘C to copy.'}};
  $('#loadCode').onclick=()=>{const n=$('#loadNote');let r;try{r=decodeSave($('#codeIn').value)}catch(err){n.className='note bad';n.textContent='That code didn\'t work. Copy the whole code, starting with PIP1:';return}
    const names=[];for(const k in r.profiles){const p=normalizeProfile(r.profiles[k]);if(!p.name)p.name='Player';addKid(p);names.push(p.name)}
    $('#codeIn').value='';renderParent();toast('Players added',`${names.map(esc).join(', ')} ${names.length===1?'is':'are'} now in the player list.`,'#38b98a')};
  $('#resetP').onclick=e=>{const b=e.currentTarget;if(b.dataset.c!=='1'){b.dataset.c='1';b.textContent='Tap again to erase';$('#resetNote').textContent='Are you sure? Everything for this player will be erased.';return}
    const name=G.name,set=G.settings,kp=G.kidPin;if(CL.mode==='cloud')CL.api.writeBackup(ROOT.current,`${dayKey()}-r${Date.now().toString(36)}`,bkDoc(G)).catch(()=>{});G=freshProfile();G.name=name;G.settings=set;G.kidPin=kp;G.resetAt=Date.now();ROOT.profiles[ROOT.current]=G;save();cloudFlush();refreshFoxes();renderParent();toast('Progress reset',`${name||'Player'} starts fresh.`,'#ff9f43')};
}

const bkDoc=p=>({data:JSON.stringify(p),name:(p.name||'Player').slice(0,16),ts:Date.now(),xp:p.xp,stars:STAR_ISLANDS.reduce((s,i)=>s+(p.best[i.id]||0),0),coins:p.coins});
function bkLabel(id){const m=id.match(/^(\d{4})-(\d{2})-(\d{2})(?:-([mr])(.*))?$/);if(!m)return esc(id);const d=new Date(+m[1],+m[2]-1,+m[3]);
  const base=d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});return m[4]==='m'?`${base}, ${m[5].slice(0,2)}:${m[5].slice(2)} (made by you)`:m[4]==='r'?`${base} (before a reset or restore)`:`${base} (daily)`}
async function loadBackups(){const el=$('#bkList');if(!el)return;const kid=ROOT.current;let list;
  try{list=await CL.api.listBackups(kid)}catch(e){if($('#bkList'))el.innerHTML='<li><span>Backups need an internet connection.</span></li>';return}
  if(!$('#bkList')||ROOT.current!==kid)return;
  el.innerHTML=list.length?list.map(b=>`<li><span>${bkLabel(b.id)}<small>Level ${levelOf(b.xp||0)+1} · ${b.stars||0} stars · ${fmt(b.coins||0)} coins</small></span><button type="button" class="go small alt" data-bk="${esc(b.id)}">Restore</button></li>`).join('')
    :'<li><span>The first backup is made automatically after the first puzzle today.</span></li>';
  el.querySelectorAll('[data-bk]').forEach(btn=>btn.onclick=()=>{if(btn.dataset.c!=='1'){btn.dataset.c='1';btn.textContent='Tap again to restore';return}
    const b=list.find(x=>x.id===btn.dataset.bk);let p;try{p=normalizeProfile(JSON.parse(b.data))}catch(e){toast('Could not restore','That backup looks damaged.','#c9473a');return}
    CL.api.writeBackup(kid,`${dayKey()}-r${Date.now().toString(36)}`,bkDoc(G)).catch(()=>{});
    p.resetAt=Date.now();G=p;ROOT.profiles[kid]=G;save();cloudFlush();applySettings();refreshFoxes();renderParent();toast('Backup restored',`${esc(G.name||'Player')} is back to ${bkLabel(b.id).replace(/ \(.*\)$/,'')}.`,'#38b98a')})}
async function downloadData(){let data;
  try{data=CL.mode==='cloud'?await CL.api.exportAll():null}catch(e){data=null}
  if(!data)data={exportedAt:new Date().toISOString(),note:'Saved on this device',players:Object.values(ROOT.profiles)};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`pip-sky-islands-data-${dayKey()}.json`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)}
function deleteAccountFlow(){
  const pw=CL.provider==='password';
  overlay(`<div class="eyebrow" style="color:#c9473a">Delete account</div><h2 style="font-size:28px">Delete everything?</h2><p>This permanently deletes your account, all ${Object.keys(ROOT.profiles).length} player${Object.keys(ROOT.profiles).length===1?'':'s'}, their progress and all backups. It can't be undone. Tip: tap "Download all data" first if you want a copy.</p>
    ${pw?'<input type="password" id="delPw" placeholder="Your password" autocomplete="current-password" aria-label="Password">':`<p class="note">${CL.provider==='apple.com'?'Apple':'Google'} will ask you to confirm your account.</p>`}
    <label class="chk"><input type="checkbox" id="delOk"><span>Yes, delete my account and all data.</span></label>
    <div class="btnrow"><button class="go" type="button" id="delGo" disabled style="background:#c9473a;box-shadow:0 6px 0 #9c3329">Delete forever</button><button class="go alt" type="button" id="delNo">Cancel</button></div><p class="note bad" id="delNote"></p>`,
  ()=>{$('#delOk').onchange=e=>$('#delGo').disabled=!e.target.checked;$('#delNo').onclick=closeOverlay;
    $('#delGo').onclick=async()=>{const n=$('#delNote');$('#delGo').disabled=true;n.textContent='Deleting...';const uid=CL.uid;
      try{clearTimeout(CL.t);CL.t=0;CL.dirty={};if(CL.unsub)CL.unsub();CL.unsub=null;await CL.api.deleteAccount(pw?$('#delPw').value:null)}
      catch(e){n.textContent=authMsg(e);$('#delGo').disabled=false;CL.unsub=CL.api.watchKids(onKids,er=>{CL.err=(er&&er.code)||'error';setSync()});return}
      for(const k of Object.keys(localStorage))if(k.includes(uid))try{localStorage.removeItem(k)}catch(e){}
      try{if(localStorage.getItem('pip-last-uid')===uid)localStorage.removeItem('pip-last-uid')}catch(e){}
      CL.mode='guest';CL.loaded=false;closeOverlay();toast('Account deleted','All data was removed.','#506686');leaveCloud();showGate()}});
}

/* ================= my island ================= */
const STK2='stroke="#1f3557" stroke-width="2" stroke-linejoin="round"';
const HOUSES=[
  {name:'Cozy Tent',price:100,draw:(x,y)=>`<path d="M${x-42} ${y} L${x} ${y-58} L${x+42} ${y}Z" fill="#ff9f43" ${STK2}/><path d="M${x} ${y-58} L${x-11} ${y} L${x+11} ${y}Z" fill="#c4643a" ${STK2}/><path d="M${x} ${y-58} v-14 l13 5 l-13 5" fill="#ff6b57" ${STK2}/>`},
  {name:'Little Cottage',price:400,draw:(x,y)=>`<rect x="${x+16}" y="${y-92}" width="10" height="20" fill="#c4643a" ${STK2}/><rect x="${x-42}" y="${y-58}" width="84" height="58" fill="#fff5d6" ${STK2}/><path d="M${x-52} ${y-56} L${x} ${y-96} L${x+52} ${y-56}Z" fill="#ff6b57" ${STK2}/><rect x="${x-10}" y="${y-34}" width="20" height="34" rx="3" fill="#a0683a" ${STK2}/><circle cx="${x+6}" cy="${y-17}" r="2" fill="#ffc23d"/><rect x="${x-34}" y="${y-46}" width="16" height="16" fill="#7fd0f5" ${STK2}/><rect x="${x+18}" y="${y-46}" width="16" height="16" fill="#7fd0f5" ${STK2}/>`},
  {name:'Tower House',price:900,draw:(x,y)=>HOUSES[1].draw(x-14,y)+`<rect x="${x+30}" y="${y-104}" width="30" height="104" fill="#ffd56b" ${STK2}/><path d="M${x+24} ${y-102} L${x+45} ${y-140} L${x+66} ${y-102}Z" fill="#2f9fe0" ${STK2}/><circle cx="${x+45}" cy="${y-80}" r="7" fill="#7fd0f5" ${STK2}/><rect x="${x+39}" y="${y-54}" width="12" height="16" rx="6" fill="#7fd0f5" ${STK2}/>`},
  {name:'Sky Castle',price:2000,draw:(x,y)=>{const crn=(x0,w,yy)=>Array.from({length:Math.floor(w/12)},(_,i)=>`<rect x="${x0+i*12}" y="${yy-8}" width="7" height="9" fill="#e9dcff" ${STK2}/>`).join('');
    const tower=(tx)=>`<rect x="${tx-16}" y="${y-110}" width="32" height="110" fill="#d9c8ff" ${STK2}/><path d="M${tx-21} ${y-108} L${tx} ${y-152} L${tx+21} ${y-108}Z" fill="#e2558f" ${STK2}/><path d="M${tx} ${y-152} v-14 l12 5 l-12 5" fill="#ffc23d" ${STK2}/><rect x="${tx-5}" y="${y-86}" width="10" height="16" rx="5" fill="#7fd0f5" ${STK2}/>`;
    return `${crn(x-50,100,y-70)}<rect x="${x-50}" y="${y-70}" width="100" height="70" fill="#e9dcff" ${STK2}/>${tower(x-62)}${tower(x+62)}<rect x="${x-14}" y="${y-138}" width="28" height="70" fill="#d9c8ff" ${STK2}/><path d="M${x-19} ${y-136} L${x} ${y-176} L${x+19} ${y-136}Z" fill="#6b5bd6" ${STK2}/><path d="M${x-16} ${y} V${y-26} Q${x} ${y-44} ${x+16} ${y-26} V${y}Z" fill="#a0683a" ${STK2}/><circle cx="${x}" cy="${y-110}" r="6" fill="#ffc23d" ${STK2}/>`}}
];
const tree=(x,y,c='#38b98a',c2='#2e9e5b')=>`<rect x="${x-5}" y="${y-30}" width="10" height="30" fill="#8c5a2c" ${STK2}/><circle cx="${x}" cy="${y-48}" r="22" fill="${c}" ${STK2}/><circle cx="${x-14}" cy="${y-34}" r="13" fill="${c2}" ${STK2}/><circle cx="${x+14}" cy="${y-36}" r="14" fill="${c2}" ${STK2}/>`;
const HOME=[
  {id:'rainbow',name:'Rainbow Arch',price:800,pos:[320,190],z:0,draw:(x,y)=>['#e2558f','#ff9f43','#ffc23d','#38b98a','#2f9fe0','#6b5bd6'].map((c,i)=>`<path d="M${x-230+i*9} ${y} A${230-i*9} ${150-i*7} 0 0 1 ${x+230-i*9} ${y}" fill="none" stroke="${c}" stroke-width="9" opacity=".85"/>`).join('')},
  {id:'windmill',name:'Windmill',price:500,pos:[190,205],z:1,draw:(x,y)=>`<path d="M${x-20} ${y} L${x-12} ${y-80} H${x+12} L${x+20} ${y}Z" fill="#fff5d6" ${STK2}/><path d="M${x-16} ${y-78} L${x} ${y-98} L${x+16} ${y-78}Z" fill="#ff6b57" ${STK2}/><rect x="${x-6}" y="${y-22}" width="12" height="22" rx="6" fill="#a0683a" ${STK2}/><g class="hspin" style="transform-origin:${x}px ${y-80}px">${[0,90,180,270].map(r=>`<rect x="${x-4}" y="${y-128}" width="8" height="48" rx="3" fill="#fff" ${STK2} transform="rotate(${r} ${x} ${y-80})"/>`).join('')}</g><circle cx="${x}" cy="${y-80}" r="5" fill="#ffc23d" ${STK2}/>`},
  {id:'lighthouse',name:'Lighthouse',price:600,pos:[462,200],z:1,draw:(x,y)=>`<path d="M${x-18} ${y} L${x-11} ${y-100} H${x+11} L${x+18} ${y}Z" fill="#fff" ${STK2}/><path d="M${x-16.6} ${y-20} H${x+16.6} L${x+15.2} ${y-40} H${x-15.2}Z M${x-13.8} ${y-60} H${x+13.8} L${x+12.4} ${y-80} H${x-12.4}Z" fill="#ff6b57"/><rect x="${x-13}" y="${y-118}" width="26" height="18" fill="#ffd56b" ${STK2}/><circle class="hglow" cx="${x}" cy="${y-109}" r="16" fill="#ffd56b" opacity=".35"/><path d="M${x-16} ${y-118} L${x} ${y-134} L${x+16} ${y-118}Z" fill="#ff6b57" ${STK2}/>`},
  {id:'oak',name:'Oak Tree',price:80,pos:[560,212],z:1,draw:(x,y)=>tree(x,y)},
  {id:'pine',name:'Pine Tree',price:80,pos:[82,246],z:2,draw:(x,y)=>`<rect x="${x-4}" y="${y-16}" width="8" height="16" fill="#8c5a2c" ${STK2}/><path d="M${x-26} ${y-14} L${x} ${y-50} L${x+26} ${y-14}Z M${x-21} ${y-36} L${x} ${y-70} L${x+21} ${y-36}Z" fill="#2e9e5b" ${STK2}/>`},
  {id:'palm',name:'Palm Tree',price:180,pos:[150,252],z:2,draw:(x,y)=>`<path d="M${x} ${y} Q${x-8} ${y-40} ${x+4} ${y-76}" stroke="#a0683a" stroke-width="9" fill="none" stroke-linecap="round"/>${[-60,-20,20,60,100].map(r=>`<ellipse cx="${x+4}" cy="${y-76}" rx="26" ry="7" fill="#38b98a" ${STK2} transform="rotate(${r} ${x+4} ${y-76}) translate(18 0)"/>`).join('')}<circle cx="${x+2}" cy="${y-72}" r="4" fill="#8c5a2c"/><circle cx="${x+9}" cy="${y-70}" r="4" fill="#8c5a2c"/>`},
  {id:'lamps',name:'Lamp Posts',price:90,pos:[240,250],z:2,draw:(x,y)=>[[x-22,y],[x+22,y+2]].map(([a,b])=>`<rect x="${a-2.5}" y="${b-50}" width="5" height="50" fill="#1f3557"/><rect x="${a-8}" y="${b-62}" width="16" height="14" rx="3" fill="#ffd56b" ${STK2}/><circle class="hglow" cx="${a}" cy="${b-55}" r="13" fill="#ffd56b" opacity=".3"/>`).join('')},
  {id:'swing',name:'Swing Set',price:200,pos:[410,252],z:2,draw:(x,y)=>`<path d="M${x-30} ${y} L${x-20} ${y-60} L${x-10} ${y} M${x+10} ${y} L${x+20} ${y-60} L${x+30} ${y} M${x-20} ${y-60} H${x+20}" stroke="#ff6b57" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><g class="hswing" style="transform-origin:${x}px ${y-60}px"><path d="M${x-8} ${y-60} V${y-18} M${x+8} ${y-60} V${y-18}" stroke="#1f3557" stroke-width="1.5"/><rect x="${x-12}" y="${y-20}" width="24" height="5" rx="2" fill="#2f9fe0" ${STK2}/></g>`},
  {id:'apple',name:'Apple Tree',price:150,pos:[105,276],z:3,draw:(x,y)=>tree(x,y,'#5cc48c','#38b98a')+[[-10,-50],[8,-44],[-16,-34],[14,-30],[0,-60]].map(([a,b])=>`<circle cx="${x+a}" cy="${y+b}" r="4" fill="#ff3b30"/>`).join('')},
  {id:'flowers',name:'Flower Beds',price:120,pos:[212,290],z:3,draw:(x,y)=>`<ellipse cx="${x}" cy="${y-6}" rx="36" ry="10" fill="#8c5a2c"/>`+[[-26,'#e2558f'],[-14,'#ffc23d'],[-2,'#ff6b57'],[10,'#c7b6ff'],[22,'#e2558f']].map(([a,c])=>`<path d="M${x+a} ${y-8} V${y-22}" stroke="#2b8a62" stroke-width="2.5"/><circle cx="${x+a}" cy="${y-25}" r="6" fill="${c}"/><circle cx="${x+a}" cy="${y-25}" r="2.2" fill="#fff"/>`).join('')},
  {id:'bench',name:'Park Bench',price:70,pos:[268,294],z:3,draw:(x,y)=>`<rect x="${x-24}" y="${y-28}" width="48" height="6" rx="2" fill="#c98a4b" ${STK2}/><rect x="${x-26}" y="${y-18}" width="52" height="6" rx="2" fill="#c98a4b" ${STK2}/><path d="M${x-20} ${y-12} V${y} M${x+20} ${y-12} V${y}" stroke="#1f3557" stroke-width="3"/>`},
  {id:'fountain',name:'Fountain',price:300,pos:[326,300],z:3,draw:(x,y)=>`<ellipse cx="${x}" cy="${y-8}" rx="34" ry="11" fill="#b9c3cf" ${STK2}/><ellipse cx="${x}" cy="${y-10}" rx="27" ry="7" fill="#7fd0f5"/><rect x="${x-5}" y="${y-40}" width="10" height="30" fill="#b9c3cf" ${STK2}/><ellipse cx="${x}" cy="${y-40}" rx="14" ry="4" fill="#b9c3cf" ${STK2}/><path class="hsplash" d="M${x} ${y-44} Q${x-14} ${y-66} ${x-22} ${y-14} M${x} ${y-44} Q${x+14} ${y-66} ${x+22} ${y-14} M${x} ${y-44} V${y-62}" stroke="#2f9fe0" stroke-width="3" fill="none" stroke-linecap="round"/>`},
  {id:'mailbox',name:'Mailbox',price:60,pos:[384,292],z:3,draw:(x,y)=>`<rect x="${x-2.5}" y="${y-30}" width="5" height="30" fill="#8c5a2c"/><path d="M${x-12} ${y-30} V${y-44} Q${x-12} ${y-52} ${x} ${y-52} Q${x+12} ${y-52} ${x+12} ${y-44} V${y-30}Z" fill="#2f9fe0" ${STK2}/><path d="M${x+12} ${y-46} H${x+18} V${y-56}" stroke="#ff6b57" stroke-width="3" fill="none"/>`},
  {id:'pond',name:'Duck Pond',price:250,pos:[458,292],z:3,draw:(x,y)=>`<ellipse cx="${x}" cy="${y-10}" rx="40" ry="13" fill="#5fc3f0" ${STK2}/><g class="hduck"><ellipse cx="${x-12}" cy="${y-14}" rx="7" ry="4.5" fill="#ffd56b" ${STK2}/><circle cx="${x-17}" cy="${y-20}" r="3.5" fill="#ffd56b" ${STK2}/><path d="M${x-21} ${y-20} l-4 1 l4 1" fill="#ff9f43"/></g><ellipse cx="${x+14}" cy="${y-12}" rx="6" ry="4" fill="#fff" ${STK2}/><circle cx="${x+18}" cy="${y-17}" r="3" fill="#fff" ${STK2}/>`},
  {id:'telescope',name:'Telescope',price:220,pos:[252,198],z:1,draw:(x,y)=>`<path d="M${x} ${y-24} L${x-13} ${y} M${x} ${y-24} L${x+13} ${y} M${x} ${y-24} L${x+2} ${y+2}" stroke="#1f3557" stroke-width="3" stroke-linecap="round"/><g transform="rotate(-32 ${x} ${y-28})"><rect x="${x-20}" y="${y-34}" width="36" height="11" rx="4" fill="#6b5bd6" ${STK2}/><rect x="${x+14}" y="${y-36}" width="8" height="15" rx="2" fill="#ffc23d" ${STK2}/><rect x="${x-25}" y="${y-32}" width="6" height="7" rx="2" fill="#1f3557"/></g><circle cx="${x}" cy="${y-27}" r="3.5" fill="#ffc23d" ${STK2}/>`},
  {id:'birdhouse',name:'Bird House',price:90,pos:[394,202],z:1,draw:(x,y)=>`<rect x="${x-2.5}" y="${y-34}" width="5" height="34" fill="#8c5a2c"/><rect x="${x-11}" y="${y-56}" width="22" height="22" rx="2" fill="#38b98a" ${STK2}/><path d="M${x-15} ${y-54} L${x} ${y-68} L${x+15} ${y-54}Z" fill="#ff6b57" ${STK2}/><circle cx="${x}" cy="${y-46}" r="4" fill="#1f3557"/><g class="hduck"><ellipse cx="${x+15}" cy="${y-63}" rx="6" ry="4.5" fill="#2f9fe0" ${STK2}/><circle cx="${x+19}" cy="${y-67}" r="3" fill="#2f9fe0" ${STK2}/><path d="M${x+22} ${y-67} l3 1 l-3 1" fill="#ff9f43"/></g>`},
  {id:'picnic',name:'Picnic Blanket',price:110,pos:[132,308],z:3,draw:(x,y)=>`<path d="M${x-30} ${y-4} L${x-18} ${y-22} L${x+30} ${y-22} L${x+18} ${y-4}Z" fill="#fff" ${STK2}/><path d="M${x-27} ${y-8} L${x+21} ${y-8} M${x-23} ${y-13} L${x+25} ${y-13} M${x-20} ${y-18} L${x+28} ${y-18} M${x-18} ${y-4} L${x-6} ${y-22} M${x-6} ${y-4} L${x+6} ${y-22} M${x+6} ${y-4} L${x+18} ${y-22}" stroke="#ff6b57" stroke-width="3" opacity=".75"/><rect x="${x+6}" y="${y-36}" width="18" height="13" rx="3" fill="#c98a4b" ${STK2}/><path d="M${x+9} ${y-36} Q${x+15} ${y-46} ${x+21} ${y-36}" fill="none" stroke="#1f3557" stroke-width="2"/><circle cx="${x-10}" cy="${y-16}" r="4.5" fill="#ff6b57" ${STK2}/>`},
  {id:'mushrooms',name:'Mushroom Ring',price:70,pos:[490,252],z:2,draw:(x,y)=>[[-16,2,1],[0,-3,1.25],[16,1,.9],[6,6,.75]].map(([a,b,k])=>`<rect x="${x+a-3*k}" y="${y+b-12*k}" width="${6*k}" height="${12*k}" rx="2" fill="#fff5d6" ${STK2}/><path d="M${x+a-10*k} ${y+b-11*k} Q${x+a} ${y+b-26*k} ${x+a+10*k} ${y+b-11*k}Z" fill="#ff6b57" ${STK2}/><circle cx="${x+a-3*k}" cy="${y+b-16*k}" r="${1.8*k}" fill="#fff"/><circle cx="${x+a+4*k}" cy="${y+b-14*k}" r="${1.5*k}" fill="#fff"/>`).join('')}
];
/* item upgrades: each one turns a built item into a fancier version (level 2) */
const HOME_UP={
  fountain:{name:'Grand Fountain',price:400,draw:(x,y)=>`<ellipse cx="${x}" cy="${y-8}" rx="42" ry="13" fill="#b9c3cf" ${STK2}/><ellipse cx="${x}" cy="${y-10}" rx="35" ry="9" fill="#7fd0f5"/><rect x="${x-5}" y="${y-44}" width="10" height="34" fill="#b9c3cf" ${STK2}/><ellipse cx="${x}" cy="${y-44}" rx="20" ry="6" fill="#b9c3cf" ${STK2}/><ellipse cx="${x}" cy="${y-45}" rx="14" ry="3.5" fill="#7fd0f5"/><rect x="${x-3.5}" y="${y-66}" width="7" height="21" fill="#b9c3cf" ${STK2}/><ellipse cx="${x}" cy="${y-66}" rx="10" ry="3" fill="#ffc23d" ${STK2}/><path class="hsplash" d="M${x} ${y-70} Q${x-12} ${y-90} ${x-18} ${y-48} M${x} ${y-70} Q${x+12} ${y-90} ${x+18} ${y-48} M${x} ${y-70} V${y-88} M${x-20} ${y-46} Q${x-32} ${y-50} ${x-34} ${y-14} M${x+20} ${y-46} Q${x+32} ${y-50} ${x+34} ${y-14}" stroke="#2f9fe0" stroke-width="3" fill="none" stroke-linecap="round"/>`},
  flowers:{name:'Rose Garden',price:180,draw:(x,y,base)=>[[-20,'#ff6b57'],[-8,'#e2558f'],[4,'#ff6b57'],[16,'#e2558f']].map(([a,c])=>`<path d="M${x+a} ${y-14} V${y-34}" stroke="#2b8a62" stroke-width="2.5"/><circle cx="${x+a}" cy="${y-37}" r="6.5" fill="${c}" ${STK2}/><circle cx="${x+a}" cy="${y-37}" r="2.6" fill="#b8323f"/><path d="M${x+a} ${y-24} q-6 -2 -7 -7 q6 0 7 5" fill="#38b98a"/>`).join('')+base+`<path d="M${x-40} ${y-2} H${x+40} M${x-40} ${y-9} H${x+40}" stroke="#fff" stroke-width="3"/>${[-36,-24,-12,0,12,24,36].map(a=>`<path d="M${x+a-3} ${y+1} V${y-12} L${x+a} ${y-16} L${x+a+3} ${y-12} V${y+1}Z" fill="#fff" stroke="#1f3557" stroke-width="1.5"/>`).join('')}`},
  pond:{name:'Lily Pond',price:300,draw:(x,y,base)=>base+`<path d="M${x-30} ${y-8} a7 3.5 0 1 0 8 -2" fill="#38b98a" ${STK2}/><path d="M${x+28} ${y-6} a7 3.5 0 1 0 -6 -3" fill="#38b98a" ${STK2}/><circle cx="${x-27}" cy="${y-11}" r="3.5" fill="#ff9fc4" ${STK2}/><g class="hduck"><ellipse cx="${x+2}" cy="${y-7}" rx="4.5" ry="3" fill="#ffd56b" ${STK2}/><circle cx="${x-1}" cy="${y-11}" r="2.5" fill="#ffd56b" ${STK2}/></g><path d="M${x+36} ${y-12} V${y-34} M${x+41} ${y-12} V${y-30}" stroke="#2b8a62" stroke-width="2.5"/><rect x="${x+33.5}" y="${y-40}" width="5" height="11" rx="2.5" fill="#8c5a2c"/><rect x="${x+38.5}" y="${y-36}" width="5" height="10" rx="2.5" fill="#8c5a2c"/>`},
  lamps:{name:'Fairy Lights',price:150,draw:(x,y,base)=>base+`<path d="M${x-22} ${y-52} Q${x} ${y-30} ${x+22} ${y-50}" fill="none" stroke="#1f3557" stroke-width="2"/>${[[-14,-43,'#ff6b57'],[-5,-39,'#ffc23d'],[4,-39,'#38b98a'],[13,-42,'#2f9fe0']].map(([a,b,c])=>`<circle cx="${x+a}" cy="${y+b+3}" r="4.5" fill="${c}" stroke="#1f3557" stroke-width="1.5"/>`).join('')}`},
  telescope:{name:'Star Telescope',price:250,draw:(x,y,base)=>base.replace('fill="#6b5bd6"','fill="#ffc23d"')+[[-24,-58,5],[-12,-70,3.5],[-34,-44,3]].map(([a,b,r])=>`<path d="M${x+a} ${y+b-r*2} L${x+a+r*.6} ${y+b-r*.6} L${x+a+r*2} ${y+b} L${x+a+r*.6} ${y+b+r*.6} L${x+a} ${y+b+r*2} L${x+a-r*.6} ${y+b+r*.6} L${x+a-r*2} ${y+b} L${x+a-r*.6} ${y+b-r*.6}Z" fill="#ffd56b" stroke="#e09a14" stroke-width="1.5"/>`).join('')}
};
const itemLv=id=>{const v=((G.home||{}).items||{})[id];return v?(+v||1):0};
const itemName=(it,lv=itemLv(it.id))=>lv>1&&HOME_UP[it.id]?HOME_UP[it.id].name:it.name;
function itemDraw(it,lv=itemLv(it.id),x=it.pos[0],y=it.pos[1]){const base=it.draw(x,y),U=HOME_UP[it.id];return lv>1&&U?U.draw(x,y,base):base}
const upDone=()=>Object.keys(HOME_UP).filter(id=>itemLv(id)>1).length;
const homeTotal=()=>HOME.length+HOUSES.length+Object.keys(HOME_UP).length;
const homeBuilt=()=>homeCount()+upDone();
/* ---------- Grand Projects: big multi-stage builds to save up for ---------- */
const PROJECTS=[
  {id:'treehouse',name:'Giant Treehouse',pos:[118,212],stages:[['Giant tree',1200],['Ladder and deck',1600],['Tree hut',2200],['Lights and flag',2000]],
   draw:(x,y,n)=>{let o=`<path d="M${x-16} ${y} Q${x-9} ${y-60} ${x-12} ${y-112} H${x+12} Q${x+9} ${y-60} ${x+16} ${y}Z" fill="#8c5a2c" ${STK2}/><path d="M${x-16} ${y} l-10 4 M${x+16} ${y} l10 4" stroke="#1f3557" stroke-width="2"/>`+
     `<circle cx="${x-36}" cy="${y-124}" r="30" fill="#2e9e5b" ${STK2}/><circle cx="${x+36}" cy="${y-124}" r="30" fill="#2e9e5b" ${STK2}/><circle cx="${x}" cy="${y-150}" r="42" fill="#38b98a" ${STK2}/>`;
     if(n>=2)o+=`<path d="M${x-30} ${y-92} L${x-12} ${y-70} M${x+30} ${y-92} L${x+12} ${y-70}" stroke="#a0683a" stroke-width="5" stroke-linecap="round"/><rect x="${x-48}" y="${y-100}" width="96" height="9" rx="2" fill="#c98a4b" ${STK2}/>`;
     if(n>=3)o+=`<rect x="${x-26}" y="${y-138}" width="52" height="38" fill="#ffd56b" ${STK2}/><path d="M${x-34} ${y-136} L${x} ${y-166} L${x+34} ${y-136}Z" fill="#ff6b57" ${STK2}/><circle cx="${x-11}" cy="${y-120}" r="7" fill="#7fd0f5" ${STK2}/><rect x="${x+5}" y="${y-126}" width="13" height="26" rx="6" fill="#a0683a" ${STK2}/>`;
     if(n>=2)o+=`<path d="M${x+34} ${y} V${y-100} M${x+48} ${y} V${y-100}" stroke="#a0683a" stroke-width="4"/>`+Array.from({length:7},(_,i)=>`<path d="M${x+34} ${y-8-i*13} H${x+48}" stroke="#a0683a" stroke-width="3"/>`).join('');
     if(n>=4)o+=`<path d="M${x} ${y-166} V${y-194}" stroke="#1f3557" stroke-width="2.5"/><path d="M${x} ${y-194} l18 6 l-18 6Z" fill="#2f9fe0" ${STK2}/>`+[[-62,-118],[-44,-150],[-20,-176],[22,-178],[46,-152],[64,-120]].map(([a,b],i)=>`<circle class="hglow" cx="${x+a}" cy="${y+b}" r="4" fill="${['#ffc23d','#e2558f','#7fd0f5'][i%3]}"/>`).join('');
     return o}},
  {id:'observatory',name:'Star Observatory',pos:[522,214],stages:[['Stone tower',1800],['Silver dome',2600],['Big telescope',3600]],
   draw:(x,y,n)=>{let o=`<rect x="${x-32}" y="${y-96}" width="64" height="96" fill="#d8dee8" ${STK2}/>`+[30,60].map(d=>`<path d="M${x-32} ${y-d} H${x+32}" stroke="#aab4c3" stroke-width="2"/>`).join('')+`<path d="M${x-10} ${y} V${y-22} Q${x} ${y-34} ${x+10} ${y-22} V${y}Z" fill="#6b5bd6" ${STK2}/><circle cx="${x}" cy="${y-66}" r="7" fill="#7fd0f5" ${STK2}/>`;
     if(n>=3)o+=`<g transform="rotate(-38 ${x} ${y-112})"><rect x="${x-7}" y="${y-166}" width="14" height="58" rx="3" fill="#2f9fe0" ${STK2}/><rect x="${x-9}" y="${y-170}" width="18" height="10" rx="2" fill="#1f3557"/></g>`;
     if(n>=2)o+=`<path d="M${x-38} ${y-96} A38 38 0 0 1 ${x+38} ${y-96}Z" fill="#b9c3cf" ${STK2}/><path d="M${x-5} ${y-133} V${y-96} H${x+5} V${y-133}" fill="#1f3557"/>`;
     if(n>=3)o+=[[-58,-150],[50,-166],[70,-128],[-30,-180]].map(([a,b])=>`<path class="hglow" d="M${x+a} ${y+b-7} l2.2 4.8 5 .6 -3.7 3.4 1 5 -4.5-2.5 -4.5 2.5 1-5 -3.7-3.4 5-.6z" fill="#ffc23d"/>`).join('');
     return o}},
  {id:'airship',name:'Sky Airship',pos:[440,34],sky:true,scale:.7,stages:[['Balloon',1500],['Cabin',2000],['Propeller and sails',2500]],
   draw:(x,y,n)=>{let o='';
     if(n>=3)o+=`<path d="M${x-66} ${y} L${x-92} ${y-24} L${x-84} ${y} L${x-92} ${y+24}Z" fill="#e2558f" ${STK2}/><g class="hspin" style="transform-origin:${x-98}px ${y}px"><ellipse cx="${x-98}" cy="${y-12}" rx="4" ry="12" fill="#1f3557"/><ellipse cx="${x-98}" cy="${y+12}" rx="4" ry="12" fill="#1f3557"/></g>`;
     if(n>=2)o+=`<path d="M${x-40} ${y+20} L${x-26} ${y+40} M${x+40} ${y+20} L${x+26} ${y+40} M${x} ${y+28} V${y+40}" stroke="#1f3557" stroke-width="2"/><rect x="${x-32}" y="${y+40}" width="64" height="20" rx="6" fill="#a0683a" ${STK2}/>`+[-18,0,18].map(d=>`<circle cx="${x+d}" cy="${y+50}" r="5" fill="#7fd0f5" ${STK2}/>`).join('');
     o+=`<ellipse cx="${x}" cy="${y}" rx="70" ry="28" fill="#ff9f43" ${STK2}/><path d="M${x-70} ${y} H${x+70} M${x-36} ${y-24} Q${x-46} ${y} ${x-36} ${y+24} M${x+36} ${y-24} Q${x+46} ${y} ${x+36} ${y+24}" stroke="#e07a18" stroke-width="3" fill="none"/><ellipse cx="${x-24}" cy="${y-12}" rx="18" ry="6" fill="#fff" opacity=".4"/>`;
     if(n>=3)o+=`<path d="M${x+70} ${y} V${y-30}" stroke="#1f3557" stroke-width="2"/><path d="M${x+70} ${y-30} l16 5 l-16 5Z" fill="#38b98a" ${STK2}/>`;
     return `<g class="hbob">${o}</g>`}},
  /* a waterfall pouring off the island's edge into the sky */
  {id:'waterfall',name:'Sky Waterfall',pos:[602,248],stages:[['Spring pool',2500],['Waterfall',3500],['Rainbow mist',4000],['Lily stepping stones',4500]],
   draw:(x,y,n)=>{let o='';
     if(n>=2)o+=`<path d="M${x} ${y+4} Q${x+16} ${y+10} ${x+18} ${y+40} V${y+168} H${x+4} V${y+44} Q${x+2} ${y+22} ${x-8} ${y+12}Z" fill="#7fc4f5" ${STK2}/>`+[0,1,2,3].map(i=>`<path d="M${x+11} ${y+36+i*32} v20" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".85"/>`).join('');
     if(n>=3)o+=['#e2558f','#ffc23d','#38b98a','#2f9fe0'].map((c,i)=>`<path d="M${x-12+i*3} ${y+166} A${23-i*3} ${18-i*3} 0 0 1 ${x+34-i*3} ${y+166}" fill="none" stroke="${c}" stroke-width="3"/>`).join('')+`<ellipse cx="${x+11}" cy="${y+168}" rx="18" ry="6" fill="#fff" ${STK2}/>`;
     o+=`<ellipse cx="${x-6}" cy="${y}" rx="22" ry="9" fill="#2f9fe0" ${STK2}/><path d="M${x-16} ${y-2} q6 -3 12 0" stroke="#bfe3fb" stroke-width="2.5" fill="none" stroke-linecap="round"/>`+[[-28,2,6],[-20,9,5],[14,-5,5],[16,4,4]].map(([a,b,r])=>`<circle cx="${x+a}" cy="${y+b}" r="${r}" fill="#b8c3d3" ${STK2}/>`).join('');
     if(n>=4)o+=[[22,-34],[16,-70],[24,-106]].map(([a,b],i)=>`<g class="hbob" style="animation-delay:${i*.5}s"><ellipse cx="${x+a}" cy="${y+b}" rx="11" ry="4.5" fill="#38b98a" ${STK2}/><circle cx="${x+a+3}" cy="${y+b-3}" r="3" fill="#ff9fc4" ${STK2}/></g>`).join('');
     return o}}
];
function projScene(P,n){const [x,y]=P.pos,d=P.draw(x,y,n);return P.scale?`<g transform="translate(${x} ${y}) scale(${P.scale}) translate(${-x} ${-y})">${d}</g>`:d}
const projStage=id=>((G.home&&G.home.proj)||{})[id]||0;
const projDone=P=>projStage(P.id)>=P.stages.length;
function projNext(P){const n=projStage(P.id);return n<P.stages.length?{n,name:P.stages[n][0],price:P.stages[n][1]}:null}
function saveGoalProject(){const g=PROJECTS.find(P=>!P.res&&P.id===G.saveGoal&&!projDone(P));if(g)return g;const open=PROJECTS.filter(P=>!P.res&&!projDone(P));if(!open.length)return null;return open.slice().sort((a,b)=>projNext(a).price-projNext(b).price)[0]}
/* a project card picture: the built steps in color and, on top, the finished build as a faint picture (so the child sees what it will become) */
function projPreview(P,n){const [x,y]=P.pos,L=P.stages.length,vb=P.sky?`${x-110} ${y-45} 200 115`:`${x-90} ${y-205} 180 215`;
  return `<svg viewBox="${vb}">${n>=1?P.draw(x,y,n):''}${n<L?`<g class="pghost">${P.draw(x,y,L)}</g>`:''}</svg>`}
function projThumb(P,n){const [x,y]=P.pos;const vb=P.sky?`${x-110} ${y-45} 200 115`:`${x-90} ${y-205} 180 215`;return `<svg viewBox="${vb}">${P.draw(x,y,Math.max(1,n))}</svg>`}
function wishItem(){const w=G.wish;if(!w||!SHOP[w.k])return null;const it=SHOP[w.k].items()[w.id];if(!it||SHOP[w.k].list().includes(w.id))return null;return {...w,it}}
function renderGoalCard(){const el=$('#goalCard');if(!el)return;const W=wishItem();
  if(W){el.hidden=false;const have=Math.max(0,G.coins),pr=W.it.price,can=have>=pr;
    el.innerHTML=`<div class="gprev wishprev">${foxSVG({[W.k]:W.id})}</div><div class="gtxt"><b>${can?`You can get your wish: ${esc(W.it.name)}!`:`My wish: ${esc(W.it.name)}`}</b><span>${can?'Go to the closet and get it!':`${fmt(pr-have)} more coins to go`}</span><div class="bar warm"><i style="width:${Math.min(100,have/pr*100)}%"></i></div><small>${fmt(Math.min(have,pr))} / ${fmt(pr)} coins</small></div><button type="button" class="go small${can?' leaf':' alt'}" id="goalGo">${can?'Get it':'Closet'}</button>`;
    $('#goalGo').onclick=openCloset;return}
  const P=saveGoalProject();if(!P){el.hidden=true;return}el.hidden=false;const nx=projNext(P),have=Math.max(0,G.coins),pct=Math.min(100,have/nx.price*100),can=have>=nx.price;
  el.innerHTML=`<div class="gprev">${projPreview(P,nx.n)}</div><div class="gtxt"><b>${can?`You can build the ${esc(P.name)}!`:`Saving for: ${esc(P.name)}`}</b><span>Step ${nx.n+1} of ${P.stages.length}: ${esc(nx.name)}</span><div class="bar warm"><i style="width:${pct}%"></i></div><small>${fmt(Math.min(have,nx.price))} / ${fmt(nx.price)} coins</small></div><button type="button" class="go small${can?' leaf':' alt'}" id="goalGo">${can?'Build it':'See projects'}</button>`;
  $('#goalGo').onclick=()=>{openHome();setTimeout(()=>{const t=$('#homeProj');if(t)t.scrollIntoView({behavior:'smooth',block:'start'})},150)}}
const HOUSE_POS=[320,206],HERO_POS=[547,283];
const BUDDY_POS=[HERO_POS[0]-64,HERO_POS[1]+6];
function defPos(id){if(id==='house')return HOUSE_POS;if(id==='hero')return HERO_POS;if(id==='buddy')return BUDDY_POS;if(id.startsWith('p_')){const P=PROJECTS.find(x=>'p_'+x.id===id);return P?P.pos:[320,240]}const it=HOME.find(x=>x.id===id);return it?it.pos:[320,240]}
let homeEdit=false,homeSel='';
function homePos(id){const P=(G.home.pos||{})[id];if(P)return P;return defPos(id)}
/* keep a thing's foot on the grassy part of the island */
function clampFoot(x,y){const cx=320,cy=246,rx=262,ry=66;let dx=(x-cx)/rx,dy=(y-cy)/ry;const d=Math.hypot(dx,dy);if(d>1){dx/=d;dy/=d}return [Math.round(cx+dx*rx),Math.round(cy+dy*ry)]}
function homeSVG(){
  G.home=G.home||{house:0,items:{}};const H=G.home;
  const things=[];
  const hid=H.hidden||{};
  HOME.forEach(it=>{if(it.id!=='rainbow'&&H.items[it.id]&&!hid[it.id])things.push({id:it.id,name:itemName(it),def:it.pos,draw:()=>itemDraw(it)})});
  PROJECTS.forEach(P=>{const n=projStage(P.id);if(n&&!hid['p_'+P.id])things.push({id:'p_'+P.id,name:P.name,def:P.pos,draw:()=>projScene(P,n)})});
  if(H.house&&!hid.house)things.push({id:'house',name:HOUSES[H.house-1].name,def:HOUSE_POS,draw:()=>HOUSES[H.house-1].draw(...HOUSE_POS)});
  things.push({id:'hero',name:heroName(),def:HERO_POS,draw:()=>foxSVG().replace('<svg class="fox" viewBox="0 0 120 165" aria-hidden="true">',`<svg x="${HERO_POS[0]-39}" y="${HERO_POS[1]-107}" width="78" height="107" viewBox="0 0 120 165">`)});
  if(G.buddy&&typeof buddyArt==='function')things.push({id:'buddy',name:buddyName(),def:BUDDY_POS,draw:()=>`<g class="hbob"><g transform="translate(${BUDDY_POS[0]} ${BUDDY_POS[1]-26}) scale(.85)">${buddyArt(G.buddy.kind,buddyStage())}</g></g>`});
  things.forEach(t=>{t.p=homePos(t.id)});
  things.sort((p,q)=>p.p[1]-q.p[1]||(p.id==='hero')-(q.id==='hero'));
  const body=things.map(t=>{const dx=t.p[0]-t.def[0],dy=t.p[1]-t.def[1];
    return `<g class="hthing${homeEdit?' movable':''}${homeSel===t.id?' sel':''}" data-mv="${t.id}" transform="translate(${dx} ${dy})"${homeEdit?` tabindex="0" role="button" aria-label="Move ${esc(t.name)}"`:''}>${homeEdit?`<ellipse class="hfoot" cx="${t.def[0]}" cy="${t.def[1]}" rx="24" ry="7"/>`:''}${t.draw()}</g>`}).join('');
  const hint=H.house&&!hid.house?'':`<text x="320" y="190" text-anchor="middle" ${FONT} font-size="18" fill="#2b8a62" opacity=".7">${H.house?'Your home is in storage':'Build a home here!'}</text>`;
  return `<svg viewBox="0 0 640 420" class="homeisl${homeEdit?' editing':''}" role="img" aria-label="${esc(G.name||'Pip')}'s island">
    <ellipse cx="320" cy="412" rx="170" ry="8" fill="#1f3557" opacity=".08"/>
    <path d="M38 232 C60 330 200 402 320 408 C440 402 580 330 602 232Z" fill="#a9785a"/><path d="M80 290 C150 350 230 370 320 372 C410 370 500 345 560 290" stroke="#8a5d43" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M200 360 L230 390 M420 360 L400 392" stroke="#8a5d43" stroke-width="5" stroke-linecap="round"/>
    ${H.items.rainbow&&!(H.hidden||{}).rainbow?HOME[0].draw(...HOME[0].pos):''}
    <ellipse cx="320" cy="230" rx="286" ry="78" fill="#7cc95a"/><ellipse cx="320" cy="222" rx="270" ry="64" fill="#8fd46a"/>
    ${homeEdit?'<ellipse cx="320" cy="246" rx="262" ry="66" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="10 8" opacity=".7"/>':''}
    ${hint}${body}</svg>`;
}
function clampSky(x,y){return [Math.round(Math.min(540,Math.max(100,x))),Math.round(Math.min(80,Math.max(30,y)))]}
const clampFor=id=>{const P=PROJECTS.find(x=>'p_'+x.id===id);return P&&P.sky?clampSky:clampFoot};
function setHomePos(id,p){G.home.pos=Object.assign({},G.home.pos||{});G.home.pos[id]=clampFor(id)(p[0],p[1])}
function bindHomeDrag(){
  const svg=$('#homeView svg');if(!svg||!homeEdit)return;
  const pt=e=>{const m=svg.getScreenCTM().inverse();const q=new DOMPoint(e.clientX,e.clientY).matrixTransform(m);return [q.x,q.y]};
  svg.querySelectorAll('[data-mv]').forEach(g=>{
    const id=g.dataset.mv;
    g.onpointerdown=e=>{e.preventDefault();homeSel=id;svg.querySelectorAll('.sel').forEach(x=>x.classList.remove('sel'));g.classList.add('sel','dragging');
      const start=pt(e),p0=homePos(id).slice(),def=defPos(id);let cur=p0,moved=false;
      try{g.setPointerCapture(e.pointerId)}catch(err){}
      g.onpointermove=ev=>{const q=pt(ev);cur=clampFor(id)(p0[0]+q[0]-start[0],p0[1]+q[1]-start[1]);moved=true;g.setAttribute('transform',`translate(${cur[0]-def[0]} ${cur[1]-def[1]})`)};
      g.onpointerup=g.onpointercancel=()=>{g.onpointermove=g.onpointerup=g.onpointercancel=null;g.classList.remove('dragging');if(moved){setHomePos(id,cur);save();tone([392,523],.05)}renderHomeView()}};
    g.onkeydown=e=>{if((e.key==='Delete'||e.key==='Backspace')&&id!=='hero'){e.preventDefault();putAway(id);return}const k={ArrowLeft:[-8,0],ArrowRight:[8,0],ArrowUp:[0,-6],ArrowDown:[0,6]}[e.key];if(!k)return;e.preventDefault();const p=homePos(id);setHomePos(id,[p[0]+k[0],p[1]+k[1]]);homeSel=id;save(true);renderHomeView();const n=$(`#homeView [data-mv="${id}"]`);n&&n.focus()};
  });
}
const thingName=id=>id==='house'?(HOUSES[G.home.house-1]||{}).name||'House':id==='hero'?heroName():id.startsWith('p_')?(PROJECTS.find(x=>'p_'+x.id===id)||{}).name||id:(()=>{const it=HOME.find(x=>x.id===id);return it?{name:itemName(it)}:{}})().name||id;
function storedIds(){const H=G.home,hid=H.hidden||{};const out=[];if(H.house&&hid.house)out.push('house');HOME.forEach(it=>{if(H.items[it.id]&&hid[it.id])out.push(it.id)});PROJECTS.forEach(P=>{if(projStage(P.id)&&hid['p_'+P.id])out.push('p_'+P.id)});return out}
function putAway(id){if(id==='hero')return;G.home.hidden=Object.assign({},G.home.hidden||{},{[id]:1});homeSel='';save();tone([523,392],.06);renderHome();say($('#hsay'),`I put the <b>${thingName(id)}</b> in storage. It's still yours, so you can bring it back for free!`)}
function placeBack(id){const h=Object.assign({},G.home.hidden||{});delete h[id];G.home.hidden=h;homeSel=id;save();tone([392,523,659],.06);renderHome();say($('#hsay'),`The <b>${thingName(id)}</b> is back on our island!`);foxMove('hop')}
function storageThumb(id){if(id.startsWith('p_')){const P=PROJECTS.find(x=>'p_'+x.id===id);return projThumb(P,projStage(P.id))}if(id==='house')return `<svg viewBox="240 40 160 180">${HOUSES[G.home.house-1].draw(320,206)}</svg>`;const it=HOME.find(x=>x.id===id),[x,y]=it.pos;
  const vb=id==='rainbow'?'80 30 480 180':id==='lamps'?`${x-50} ${y-80} 100 90`:`${x-60} ${y-140} 120 150`;return `<svg viewBox="${vb}">${itemDraw(it)}</svg>`}
function renderHomeView(){$('#homeView').innerHTML=homeSVG();bindHomeDrag();
  const sel=homeSel&&homeSel!=='hero'&&$(`#homeView [data-mv="${homeSel}"]`)?homeSel:'';
  const t=$('#homeTools');if(t)t.innerHTML=homeEdit?`<button type="button" class="go small leaf" id="hDone">Done</button>${sel?`<button type="button" class="go small alt" id="hAway">Put away: ${esc(thingName(sel))}</button>`:''}<button type="button" class="go small alt" id="hReset">Reset layout</button><span class="note">Drag things to move them. Tap one to put it in storage.</span>`
    :`${G.home.house&&!(G.home.hidden||{}).house?`<button type="button" class="go small" id="hInside">Go inside</button>`:''}<button type="button" class="go small${G.home.house?' alt':''}" id="hMove"${movableCount()?'':' hidden'}>Move or put away</button>`;
  const st=storedIds(),tray=$('#homeStore');
  if(tray){tray.hidden=!st.length;tray.innerHTML=st.length?`<h4>In storage <small>still yours, free to bring back</small></h4><div class="storelist">${st.map(id=>`<button type="button" class="storeit" data-place="${id}" title="Put back on the island"><span class="prev">${storageThumb(id)}</span><b>${esc(thingName(id))}</b><small>Put back</small></button>`).join('')}</div>`:''}
  document.querySelectorAll('[data-place]').forEach(b=>b.onclick=()=>placeBack(b.dataset.place));
  if($('#hAway'))$('#hAway').onclick=()=>putAway(sel);
  if($('#hInside'))$('#hInside').onclick=()=>{tone([523,784]);openInside()};
  if(!homeEdit){const hs=$('#homeView [data-mv="house"]');if(hs){hs.style.cursor='pointer';hs.setAttribute('role','button');hs.setAttribute('tabindex','0');hs.setAttribute('aria-label','Go inside');hs.onclick=()=>{tone([523,784]);openInside()};hs.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openInside()}}}}
  if($('#hMove'))$('#hMove').onclick=()=>{homeEdit=true;homeSel='';renderHomeView();say($('#hsay'),`Let's decorate! <b>Drag</b> anything to a new spot. Tap something to <b>put it away</b>. I can move too!`);foxClass('waving',1200)};
  if($('#hDone'))$('#hDone').onclick=()=>{homeEdit=false;homeSel='';save();renderHomeView();if(typeof adoptRemote==='function'&&canAdopt())adoptRemote();say($('#hsay'),`I love how you arranged our island!`);foxMove('hop');sWin()};
  if($('#hReset'))$('#hReset').onclick=e=>{const b=e.currentTarget;if(b.dataset.c!=='1'){b.dataset.c='1';b.textContent='Tap again: all back to the start';return}G.home.pos={};G.home.hidden={};save();renderHome()};
}
function homeCount(){G.home=G.home||{house:0,items:{}};return Object.keys(G.home.items).length+G.home.house}
const movableCount=()=>homeCount()+PROJECTS.filter(P=>projStage(P.id)).length
function openHome(){
  stopTimers();homeEdit=false;homeSel='';show('home');renderHome();
  const n=homeCount();say($('#hsay'),n===0?`This is <b>your</b> island! Spend coins to build a home, plant trees and add fun things. Let's start with a tent!`:n<6?`Our island is looking great! What should we build next?`:`Wow, this is the best island in the whole sky!`);foxClass('waving',1500);
}
/* every picture in the Build shop fills its frame the same way, whatever its real size */
function fitPreviews(root){if(!root)return;root.querySelectorAll('.prev svg').forEach(svg=>{try{const b=svg.getBBox();if(!b.width||!b.height)return;const w=Math.max(b.width,b.height*.9),h=Math.max(b.height,b.width*.55),pad=Math.max(w,h)*.1;
  svg.setAttribute('viewBox',`${(b.x+b.width/2-w/2-pad).toFixed(1)} ${(b.y+b.height/2-h/2-pad).toFixed(1)} ${(w+2*pad).toFixed(1)} ${(h+2*pad).toFixed(1)}`);svg.setAttribute('preserveAspectRatio','xMidYMid meet')}catch(e){}})}
function renderHome(){
  updateStats();G.home=G.home||{house:0,items:{}};const H=G.home;
  renderHomeView();
  const total=homeTotal(),built=homeBuilt();
  $('#homeProg').innerHTML=`${built} of ${total} built<div class="bar warm" style="margin-top:6px"><i style="width:${built/total*100}%"></i></div>`;
  const next=HOUSES[H.house];
  const houseCard=`<div class="item${H.house&&next?' upgrade':''}">${H.house&&next?'<span class="upbadge">Upgrade</span>':''}<div class="prev"><svg viewBox="${H.house?'240 40 160 180':'240 60 160 160'}">${(next||HOUSES[3]).draw(320,206)}</svg></div><b>${next?next.name:'Sky Castle'}</b>${next?`<button type="button" class="${G.coins>=next.price?'buy':''}" data-house="1" ${G.coins>=next.price?'':'disabled'}>${COIN_ICON} ${next.price}</button>`:`<button type="button" class="worn" disabled>Built!</button>`}</div>`;
  $('#homeShop').innerHTML=houseCard+HOME.map(it=>{const [x,y]=it.pos,have=H.items[it.id];
    const vb=it.id==='rainbow'?'80 30 480 180':it.id==='lamps'?`${x-50} ${y-80} 100 90`:`${x-60} ${y-140} 120 150`;
    const away=have&&(H.hidden||{})[it.id];
    const lv=itemLv(it.id),U=HOME_UP[it.id],canUp=have&&!away&&U&&lv<2;
    if(canUp)return `<div class="item upgrade"><span class="upbadge">Upgrade</span><div class="prev"><svg viewBox="${vb}">${itemDraw(it,2)}</svg></div><b>${U.name}</b><button type="button" class="${G.coins>=U.price?'buy':''}" data-up="${it.id}" ${G.coins>=U.price?'':'disabled'}>${COIN_ICON} ${U.price}</button></div>`;
    return `<div class="item${have&&!away?' wearing':''}"><div class="prev"><svg viewBox="${vb}">${have?itemDraw(it):it.draw(x,y)}</svg></div><b>${have?itemName(it):it.name}</b>${away?`<button type="button" class="buy" data-place="${it.id}">Put back</button>`:have?`<button type="button" class="worn" disabled>Built!</button>`:`<button type="button" class="${G.coins>=it.price?'buy':''}" data-build="${it.id}" ${G.coins>=it.price?'':'disabled'}>${COIN_ICON} ${it.price}</button>`}</div>`}).join('');
  /* Wonders (built with resources from what you learn) come first, then the coin projects */
  const projCard=P=>{const n=projStage(P.id),nx=projNext(P),goal=saveGoalProject()===P,cost=typeof projCost==='function'?projCost(nx):null,can=nx&&(cost?canAffordRes(cost):G.coins>=nx.price);
    return `<div class="pcard2${nx?'':' done'}${P.res?' wonder':''}"><div class="prev">${projPreview(P,n)}</div><div class="pinfo"><b>${P.name}</b><div class="psteps">${P.stages.map((st,i)=>`<span class="pst${i<n?' on':''}" title="${esc(st[0])}"></span>`).join('')}</div>${nx?`<small>Step ${nx.n+1} of ${P.stages.length}: <b>${esc(nx.name)}</b></small><div class="prow"><button type="button" class="${can?'buy':''}" data-proj="${P.id}" ${can?'':'disabled'}>${cost?Object.entries(cost).map(([k,v])=>`<span class="rescost${resHave(k)>=v?'':' short'}" title="${v} ${RES[k].name}">${RES_ICON[k]}${resHave(k)>=v?v:`${resHave(k)}/${v}`} <small>${v===1?RES[k].one:RES[k].name}</small></span>`).join(''):COIN_ICON+fmt(nx.price)}</button>${P.res?'':`<button type="button" class="pgoal${goal?' on':''}" data-pgoal="${P.id}" aria-pressed="${goal}">${goal?ICON.wishOn+'My goal':ICON.wishOff+'Make it my goal'}</button>`}</div>${cost&&!can&&typeof resNeedHTML==='function'?resNeedHTML(cost):''}${!cost&&!can?`<div class="resneed"><span>${COIN_ICON.replace('<svg','<svg class="resi"')} <b>${fmt(nx.price-Math.max(0,G.coins))} more coins</b> to build this step</span></div>`:''}`:`<small><b>Finished!</b> All ${P.stages.length} steps built.</small>`}</div></div>`};
  const W=PROJECTS.filter(P=>P.res);
  /* Wonders show once the first resources arrive (after the first mission); before that, one line says how to start */
  const wOpen=!!G.res||W.some(P=>projStage(P.id));
  $('#homeProj').innerHTML=(W.length?`<h4 class="wtitle">Wonders <small>built with resources you earn by learning: missions, mastered skills, fixed mistakes</small></h4>${wOpen?resBarHTML()+W.map(projCard).join(''):`<p class="wsoon">Finish a mission on any island to earn your first resources. Then you can build a Floating Library, a Crystal Cavern, a Fossil Dig and more here!</p>`}<h4 class="wtitle">Coin projects <small>built with coins, one step at a time. Tap "Make it my goal" to see your savings on the map.</small></h4>`:'')+PROJECTS.filter(P=>!P.res).map(projCard).join('');
  fitPreviews($('#homeProj'));
  fitPreviews($('#homeShop'));
  document.querySelectorAll('[data-proj]').forEach(b=>b.onclick=()=>{const P=PROJECTS.find(x=>x.id===b.dataset.proj),nx=projNext(P),cost=projCost(nx);if(!nx)return;
    /* a big step costs a lot: the first tap asks, the second one builds */
    if(b.dataset.c!=='1'){document.querySelectorAll('[data-proj][data-c="1"]').forEach(o=>{o.dataset.c='';o.innerHTML=o.dataset.l});b.dataset.l=b.innerHTML;b.dataset.c='1';b.classList.add('ask');b.innerHTML=`Build ${esc(nx.name)}? Tap again`;tone([523,659],.05);
      clearTimeout(b._t);b._t=setTimeout(()=>{if(b.isConnected&&b.dataset.c==='1'){b.dataset.c='';b.classList.remove('ask');b.innerHTML=b.dataset.l}},4000);return}
    if(cost){if(!canAffordRes(cost))return;resPay(cost);if(typeof stat==='function')stat('wonders')}else{if(G.coins<nx.price)return;G.coins-=nx.price}G.home.proj=Object.assign({},G.home.proj||{},{[P.id]:nx.n+1});
    if(projDone(P))award('grand');built0(projDone(P)?`We finished the <b>${P.name}</b>! It's the best thing in the whole sky!`:`Step ${nx.n+1} done: <b>${nx.name}</b>! Only ${P.stages.length-nx.n-1} more to go!`)});
  if(typeof bindResGo==='function')bindResGo($('#homeProj'));
  document.querySelectorAll('[data-pgoal]').forEach(b=>b.onclick=()=>{G.saveGoal=b.dataset.pgoal;save();renderHome();tone([523,659],.06)});
  document.querySelectorAll('[data-house]').forEach(b=>b.onclick=()=>{const H=G.home,nx=HOUSES[H.house];if(!nx||G.coins<nx.price)return;G.coins-=nx.price;H.house++;built0(`Our <b>${nx.name}</b> is ready! It's perfect!`)});
  document.querySelectorAll('[data-build]').forEach(b=>b.onclick=()=>{const it=HOME.find(x=>x.id===b.dataset.build);if(G.coins<it.price||G.home.items[it.id])return;G.coins-=it.price;G.home.items[it.id]=1;built0(`Yay, a <b>${it.name}</b>! I love it!`)});
  document.querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>{const it=HOME.find(x=>x.id===b.dataset.up),U=HOME_UP[it.id];if(!U||itemLv(it.id)!==1||G.coins<U.price)return;G.coins-=U.price;G.home.items[it.id]=2;built0(`Wow! Our ${it.name} is now a <b>${U.name}</b>!`)});
  document.querySelectorAll('#homeShop [data-place]').forEach(b=>b.onclick=()=>{placeBack(b.dataset.place);scrollTo({top:0,behavior:'smooth'})});
  function built0(msg){save();sWin();burst(innerWidth/2,innerHeight/3,90);renderHome();say($('#hsay'),msg);foxMove('hop');scrollTo({top:0,behavior:'smooth'});
    if(homeCount()>=5)award('builder');if(homeBuilt()>=total)award('dream')}
}

/* ================= balloon pop bonus ================= */
function startPop(next){
  let score=0,won=0,left=15,spawnT=0,tickT=0;
  overlay(`<div class="popgame"><div class="pophead"><b>Balloon Pop!</b><span class="poptime" id="popTime">15</span><span id="popScore">0 popped</span></div>
    <div class="popfield" id="popfield"><p class="popintro">Tap the balloons! Gold ones are worth 5 coins!</p></div></div>`,()=>{
    $('#ocard').classList.add('wide');const field=$('#popfield');tone([523,659,784],.08);
    const spawn=()=>{const b=document.createElement('button');b.type='button';b.className='pb';const gold=Math.random()<.1,col=gold?'#ffc23d':pick(['#ff6b57','#2f9fe0','#38b98a','#e2558f','#6b5bd6','#ff9f43']);
      b.setAttribute('aria-label',gold?'Gold balloon':'Balloon');
      b.innerHTML=`<svg viewBox="0 0 40 60"><ellipse cx="20" cy="20" rx="16" ry="19" fill="${col}"${gold?' stroke="#e09a14" stroke-width="2"':''}/><ellipse cx="14" cy="13" rx="4" ry="6" fill="#fff" opacity=".45"/><path d="M17.5 38 L22.5 38 L20 42Z" fill="${col}"/><path d="M20 42 Q16 50 21 58" stroke="#506686" stroke-width="1.2" fill="none"/>${gold?`<text x="20" y="25" text-anchor="middle" font-size="13" ${FONT} fill="#a86b00">5</text>`:''}</svg>`;
      b.style.left=R(2,84)+'%';b.style.animationDuration=(2.6+Math.random()*2.2)+'s';
      b.onpointerdown=e=>{e.preventDefault();if(b.dataset.p||!left&&!b.isConnected)return;b.dataset.p=1;score++;const v=gold?5:1;won+=v;tone([660+Math.min(score,30)*18],.05,'square');
        const r=b.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/3,14);floatText(b,'+'+v);b.classList.add('popped');setTimeout(()=>b.remove(),180);$('#popScore').textContent=score+' popped'};
      b.addEventListener('animationend',()=>b.remove());field.appendChild(b)};
    spawn();spawnT=setInterval(spawn,430);
    tickT=setInterval(()=>{left--;const t=$('#popTime');if(t)t.textContent=left;if(left<=0){clearInterval(spawnT);clearInterval(tickT);setTimeout(finish,700)}},1000);
  });
  function finish(){$('#ocard').innerHTML=`<div class="pipbob" data-fox></div><div class="eyebrow">Bonus round over!</div><h2>${score} balloon${score===1?'':'s'}!</h2><p>You won <b>${won} bonus coin${won===1?'':'s'}</b>! Back to the puzzles!</p><button class="go" id="popDone" type="button" style="align-self:center">Keep going</button>`;
    $('#ocard').classList.remove('wide');refreshFoxes();sWin();setTimeout(()=>foxMove('spin'),100);
    $('#popDone').onclick=()=>{closeOverlay();gain(won,0,$('#prompt'));if(score>=15)award('popper');next&&next()}}
}

/* ================= settings & toggles ================= */
function applySettings(){document.body.classList.toggle('big',!!G.settings.big);document.body.classList.toggle('dys',!!G.settings.dys);$('#bigBtn').setAttribute('aria-pressed',!!G.settings.big)}
$('#gearBtn').onclick=e=>{e.stopPropagation();const m=$('#tmenu'),o=m.hidden;m.hidden=!o;$('#gearBtn').setAttribute('aria-expanded',o);
  /* keep the menu on screen: if it would stick out on the left, open it from the button's left edge instead */
  if(o){m.style.left='';m.style.right='';const r=m.getBoundingClientRect();if(r.left<8){m.style.left='0';m.style.right='auto'}const r2=m.getBoundingClientRect();if(r2.right>innerWidth-8){m.style.left='auto';m.style.right=Math.min(0,innerWidth-8-m.parentNode.getBoundingClientRect().right)+'px'}}};
/* on phones the Parents button lives inside the Settings menu */
(()=>{const b=document.createElement('button');b.type='button';b.className='tbtn menuonly';b.innerHTML=ICON.family+'<span>Parents</span>';b.onclick=()=>{$('#tmenu').hidden=true;$('#gearBtn').setAttribute('aria-expanded','false');$('#parentBtn').click()};$('#tmenu').appendChild(b)})();
document.querySelectorAll('.ico-slot[data-ico]').forEach(e=>{e.outerHTML=ICON[e.dataset.ico]});
$('#helpBtn').onclick=()=>{$('#tmenu').hidden=true;$('#gearBtn').setAttribute('aria-expanded','false');openHelp()};
$('#pHelp').onclick=()=>openHelp('parents');
/* ================= inside the house: rooms you decorate ================= */
/* the room is a doll-house cut-away: a wall with 2 rows of slots and a floor with 3 rows of cells.
   Every thing snaps to cells, so it never overlaps and is easy to move with a finger. */
const IN_CW=70,IN_WALL=[50,236],IN_FLOOR=[236,410],IN_ROWS=3,IN_WROWS=2;
/* rooms open as the home grows: the main room gets wider, and bigger homes add new rooms */
const ROOMS=[
  {id:'main',need:1,name:()=>((G.home&&G.home.house)||0)<=1?'Tent':'Living Room',cols:()=>[0,4,6,7,8][Math.min(4,(G.home&&G.home.house)||0)]||4,def:['cream','wood']},
  {id:'bed',need:3,name:()=>'Bedroom',cols:()=>6,def:['candy','wood']},
  {id:'tower',need:3,name:()=>'Tower Room',cols:()=>4,def:['stars','wood']},
  {id:'ball',need:4,name:()=>'Ballroom',cols:()=>8,def:['cream','tiles']},
  {id:'roof',need:4,name:()=>'Roof Garden',cols:()=>7,def:['_sky','grass'],sky:1},
];
const roomOpen=r=>((G.home&&G.home.house)||0)>=r.need;
const curRoom=()=>ROOMS.find(r=>r.id===inState().cur&&roomOpen(r))||ROOMS[0];
const inCols=()=>curRoom().cols();
const roomOf=t=>t.rm||'main';
function roomWF(rid=curRoom().id){const I=inState(),R=ROOMS.find(r=>r.id===rid)||ROOMS[0];const v=I.rw[rid]||{};return {w:v.w||R.def[0],f:v.f||R.def[1]}}
const canUse=(kind,id)=>{const I=inState(),R=curRoom();return (kind==='wall'?I.walls:I.floors).includes(id)||(kind==='wall'?R.def[0]:R.def[1])===id};
/* things that make a room cozy, and the decor sets that give a bonus */
const SEATS={sofa:[-30,-24],armchair:[-30,0],beanbag:[-30,0],cushions:[-32,0],chair:[-34,-2],beachchair:[-30,-4],bed:'lie'};
const COZY=[['light','a light',t=>inItem(t.id).cat==='light'],['plant','a plant',t=>t.id==='plant'||t.id==='monstera'],['rug','a rug',t=>inItem(t.id).k==='r'],['seat','a place to sit',t=>!!SEATS[t.id]],['art','wall art',t=>inItem(t.id).k==='w']];
const DSETS=[
  {id:'corner',name:'Cozy Corner',items:['sofa','armchair','rugRound','lamp','cushions'],bonus:100},
  {id:'dreams',name:'Sweet Dreams',items:['bed','nightlight','toybox','beanbag','window'],bonus:100},
  {id:'library',name:'Little Library',items:['bookcase','shelf','desk','chair','globe'],bonus:120},
  {id:'art',name:'Art & Plants',items:['painting','portrait','plant','monstera','lavalamp'],bonus:100},
];
const roomThings=rid=>inState().items.filter(t=>t.p&&inItem(t.id)&&roomOf(t)===rid);
const cozyOf=rid=>COZY.map(([k,n,f])=>[k,n,roomThings(rid).some(f)]);
const setHave=S=>S.items.filter(id=>inState().items.some(t=>t.p&&t.id===id));
let inPip=0;
const inX0=()=>320-inCols()*IN_CW/2;
const inBand=r=>{const h=(IN_FLOOR[1]-IN_FLOOR[0])/IN_ROWS;return [IN_FLOOR[0]+r*h,IN_FLOOR[0]+(r+1)*h]};
const inScale=r=>[.84,.92,1][r]||1;
const inWallY=r=>[100,182][r];
const S2='stroke="#1f3557" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"';
/* catalog: k = kind (f floor thing, w wall thing, r rug), w = width in cells, d = depth in rows (rugs) */
const INSIDE=[
  {id:'bed',name:'Cozy Bed',cat:'furn',k:'f',w:2,price:260,draw:()=>`<rect x="-64" y="-62" width="14" height="62" rx="5" fill="#c98a4b" ${S2}/><rect x="-60" y="-30" width="124" height="22" rx="7" fill="#c98a4b" ${S2}/><rect x="-54" y="-44" width="114" height="17" rx="7" fill="#fff" ${S2}/><rect x="-22" y="-47" width="84" height="24" rx="8" fill="#8f7cf0" ${S2}/><path d="M-10 -40 h60" stroke="#fff" stroke-width="3" opacity=".6"/><rect x="-50" y="-56" width="28" height="13" rx="6" fill="#fff" ${S2}/><path d="M-54 -8 V0 M58 -8 V0" stroke="#1f3557" stroke-width="5" stroke-linecap="round"/>`},
  {id:'sofa',name:'Comfy Sofa',cat:'furn',k:'f',w:2,price:220,draw:()=>`<rect x="-56" y="-54" width="112" height="30" rx="12" fill="#ff8a6b" ${S2}/><rect x="-60" y="-30" width="120" height="24" rx="9" fill="#ff6b57" ${S2}/><rect x="-66" y="-40" width="18" height="36" rx="8" fill="#ff8a6b" ${S2}/><rect x="48" y="-40" width="18" height="36" rx="8" fill="#ff8a6b" ${S2}/><circle cx="-26" cy="-38" r="8" fill="#ffc23d" ${S2}/><path d="M-52 -6 V0 M52 -6 V0" stroke="#1f3557" stroke-width="5" stroke-linecap="round"/>`},
  {id:'armchair',name:'Armchair',cat:'furn',k:'f',w:1,price:120,draw:()=>`<rect x="-24" y="-56" width="48" height="30" rx="12" fill="#5cc4b0" ${S2}/><rect x="-26" y="-30" width="52" height="22" rx="8" fill="#38b98a" ${S2}/><rect x="-32" y="-40" width="14" height="34" rx="7" fill="#5cc4b0" ${S2}/><rect x="18" y="-40" width="14" height="34" rx="7" fill="#5cc4b0" ${S2}/><path d="M-24 -6 V0 M24 -6 V0" stroke="#1f3557" stroke-width="5" stroke-linecap="round"/>`},
  {id:'table',name:'Round Table',cat:'furn',k:'f',w:2,price:150,draw:()=>`<ellipse cx="0" cy="-46" rx="56" ry="10" fill="#e0a56a" ${S2}/><path d="M-40 -42 L-46 0 M40 -42 L46 0 M-8 -38 L-10 0 M8 -38 L10 0" stroke="#a0683a" stroke-width="5" stroke-linecap="round"/><ellipse cx="0" cy="-52" rx="16" ry="6" fill="#fff" ${S2}/><circle cx="-5" cy="-57" r="5" fill="#ff6b57" ${S2}/><circle cx="6" cy="-57" r="5" fill="#ffc23d" ${S2}/>`},
  {id:'chair',name:'Little Chair',cat:'furn',k:'f',w:1,price:50,draw:()=>`<rect x="-18" y="-66" width="8" height="40" rx="3" fill="#2f9fe0" ${S2}/><rect x="-18" y="-34" width="36" height="9" rx="4" fill="#2f9fe0" ${S2}/><path d="M-14 -25 V0 M14 -25 V0" stroke="#1f3557" stroke-width="4" stroke-linecap="round"/><rect x="-18" y="-62" width="30" height="8" rx="3" fill="#7fd0f5" ${S2}/>`},
  {id:'desk',name:'Study Desk',cat:'furn',k:'f',w:2,price:180,draw:()=>`<rect x="-58" y="-52" width="116" height="10" rx="3" fill="#c98a4b" ${S2}/><rect x="18" y="-42" width="36" height="36" rx="3" fill="#e0a56a" ${S2}/><path d="M28 -30 h16 M28 -18 h16" stroke="#1f3557" stroke-width="2.5" stroke-linecap="round"/><path d="M-52 -42 V0 M52 -6 V0" stroke="#1f3557" stroke-width="5" stroke-linecap="round"/><rect x="-40" y="-64" width="22" height="12" rx="2" fill="#6b5bd6" ${S2}/><rect x="-14" y="-70" width="18" height="18" rx="3" fill="#fff" ${S2}/><path d="M-10 -64 h10 M-10 -59 h10" stroke="#2f9fe0" stroke-width="2"/>`},
  {id:'bookcase',name:'Bookcase',cat:'furn',k:'f',w:1,price:160,draw:()=>`<rect x="-28" y="-124" width="56" height="124" rx="4" fill="#c98a4b" ${S2}/>${[-118,-80,-42].map((y,i)=>`<rect x="-22" y="${y}" width="44" height="34" fill="#a0683a"/>${[['#ff6b57',0,30],['#2f9fe0',9,26],['#ffc23d',18,32],['#38b98a',27,28],['#8f7cf0',35,24]].slice(i,i+4).map(([c,x,h])=>`<rect x="${-20+x}" y="${y+34-h}" width="8" height="${h}" rx="1.5" fill="${c}" stroke="#1f3557" stroke-width="1.5"/>`).join('')}`).join('')}<path d="M-22 -84 h44 M-22 -46 h44 M-22 -8 h44" stroke="#1f3557" stroke-width="2.5"/>`},
  {id:'lamp',name:'Floor Lamp',cat:'light',k:'f',w:1,price:80,draw:()=>`<circle class="hglow" cx="0" cy="-104" r="30" fill="#ffd56b" opacity=".35"/><path d="M0 -96 V-4" stroke="#1f3557" stroke-width="4"/><ellipse cx="0" cy="-3" rx="16" ry="5" fill="#1f3557"/><path d="M-20 -94 L-12 -124 H12 L20 -94Z" fill="#ffd56b" ${S2}/>`},
  {id:'nightlight',name:'Star Night-Light',cat:'light',k:'f',w:1,price:60,draw:()=>`<circle class="hglow" cx="0" cy="-30" r="26" fill="#fff2a8" opacity=".5"/><rect x="-14" y="-12" width="28" height="12" rx="4" fill="#8f7cf0" ${S2}/><path d="M0 -50 L6 -36 L21 -35 L9 -26 L13 -12 L0 -20 L-13 -12 L-9 -26 L-21 -35 L-6 -36Z" fill="#ffd56b" ${S2}/>`},
  {id:'lavalamp',name:'Lava Lamp',cat:'light',k:'f',w:1,price:110,draw:()=>`<circle class="hglow" cx="0" cy="-50" r="26" fill="#ff9fc4" opacity=".35"/><path d="M-10 -84 L-16 -20 H16 L10 -84Z" fill="#ffb3d1" ${S2}/><circle cx="-3" cy="-44" r="6" fill="#e2558f"/><circle cx="4" cy="-62" r="4.5" fill="#e2558f"/><ellipse cx="0" cy="-28" rx="9" ry="5" fill="#e2558f"/><path d="M-10 -84 H10 L6 -94 H-6Z" fill="#b9c3cf" ${S2}/><path d="M-16 -20 H16 L12 0 H-12Z" fill="#b9c3cf" ${S2}/>`},
  {id:'garland',name:'String Lights',cat:'light',k:'w',w:2,price:90,draw:()=>`<path d="M-62 -16 Q-31 14 0 -10 Q31 14 62 -16" fill="none" stroke="#1f3557" stroke-width="2"/>${[[-48,-4,'#ff6b57'],[-31,2,'#ffc23d'],[-14,-2,'#38b98a'],[14,-2,'#2f9fe0'],[31,2,'#e2558f'],[48,-4,'#ffc23d']].map(([x,y,c])=>`<circle class="hglow" cx="${x}" cy="${y+6}" r="10" fill="${c}" opacity=".3"/><circle cx="${x}" cy="${y+6}" r="5.5" fill="${c}" stroke="#1f3557" stroke-width="1.8"/>`).join('')}`},
  {id:'plant',name:'Potted Plant',cat:'decor',k:'f',w:1,price:60,draw:()=>`<path d="M0 -30 Q-24 -46 -22 -66 Q-4 -60 0 -32 Q2 -64 18 -74 Q24 -50 2 -30 Q20 -48 30 -44 Q24 -30 2 -28" fill="#38b98a" ${S2}/><path d="M-16 -30 H16 L12 0 H-12Z" fill="#ff8a6b" ${S2}/><rect x="-18" y="-34" width="36" height="7" rx="3" fill="#ff6b57" ${S2}/>`},
  {id:'monstera',name:'Big Leafy Plant',cat:'decor',k:'f',w:1,price:110,draw:()=>`<path d="M0 -30 V-92" stroke="#2b8a62" stroke-width="3"/>${[[-22,-98,-30],[20,-104,30],[-26,-62,-50],[26,-66,50],[0,-118,0]].map(([x,y,r])=>`<ellipse cx="${x}" cy="${y}" rx="15" ry="24" fill="#38b98a" ${S2} transform="rotate(${r} ${x} ${y})"/><path d="M${x} ${y-16} V${y+16}" stroke="#2b8a62" stroke-width="2" transform="rotate(${r} ${x} ${y})"/>`).join('')}<path d="M-18 -32 H18 L13 0 H-13Z" fill="#fff5d6" ${S2}/>`},
  {id:'globe',name:'Globe',cat:'decor',k:'f',w:1,price:130,draw:()=>`<path d="M0 -20 V-4" stroke="#1f3557" stroke-width="4"/><ellipse cx="0" cy="-3" rx="16" ry="5" fill="#c98a4b" ${S2}/><circle cx="0" cy="-48" r="26" fill="#5fc3f0" ${S2}/><path d="M-14 -62 q8 -4 12 4 q-2 8 -10 6 q-6 4 -4 10 q-8 -4 -6 -12Z M6 -46 q10 -6 14 4 q-4 12 -12 10 q-6 -6 -2 -14Z" fill="#38b98a"/><path d="M-30 -48 A30 30 0 0 1 22 -70" fill="none" stroke="#c98a4b" stroke-width="4" stroke-linecap="round"/>`},
  {id:'fishtank',name:'Fish Tank',cat:'decor',k:'f',w:1,price:200,draw:()=>`<rect x="-26" y="-34" width="52" height="34" rx="3" fill="#c98a4b" ${S2}/><rect x="-30" y="-80" width="60" height="46" rx="5" fill="#bfe9ff" ${S2}/><rect x="-28" y="-72" width="56" height="36" fill="#7fd0f5" opacity=".7"/><path d="M-20 -36 q4 -14 0 -22 M18 -36 q-5 -10 2 -18" stroke="#38b98a" stroke-width="3" fill="none" stroke-linecap="round"/><g class="hduck"><ellipse cx="-4" cy="-58" rx="8" ry="5" fill="#ff9f43" stroke="#1f3557" stroke-width="1.5"/><path d="M4 -58 l7 -5 v10Z" fill="#ff9f43" stroke="#1f3557" stroke-width="1.5"/></g><circle cx="12" cy="-66" r="2.5" fill="#fff"/><circle cx="16" cy="-72" r="1.8" fill="#fff"/>`},
  {id:'window',name:'Window',cat:'decor',k:'w',w:1,price:120,draw:()=>`<rect x="-28" y="-32" width="56" height="64" rx="6" fill="#9fdcff" ${S2}/><circle cx="12" cy="-14" r="8" fill="#ffd56b"/><path d="M-20 14 q6 -8 14 -2 q6 -8 14 0 q8 -2 10 6Z" fill="#fff"/><path d="M0 -32 V32 M-28 0 H28" stroke="#fff" stroke-width="4"/><rect x="-28" y="-32" width="56" height="64" rx="6" fill="none" ${S2}/><rect x="-34" y="30" width="68" height="8" rx="3" fill="#fff" ${S2}/>`},
  {id:'painting',name:'Sunny Painting',cat:'decor',k:'w',w:1,price:70,draw:()=>`<rect x="-26" y="-24" width="52" height="46" rx="3" fill="#ffc23d" ${S2}/><rect x="-20" y="-18" width="40" height="34" fill="#dff3ff"/><circle cx="8" cy="-6" r="7" fill="#ff9f43"/><path d="M-20 16 L-8 2 L2 12 L10 4 L20 16Z" fill="#38b98a"/>`},
  {id:'portrait',name:'Pip Portrait',cat:'decor',k:'w',w:1,price:90,draw:()=>`<ellipse cx="0" cy="0" rx="27" ry="31" fill="#e0a56a" ${S2}/><ellipse cx="0" cy="0" rx="21" ry="25" fill="#fff5d6"/><path d="M-14 -4 L-12 -20 L-4 -10 M14 -4 L12 -20 L4 -10" fill="#ff9f43" ${S2}/><circle cx="0" cy="2" r="12" fill="#ff9f43" ${S2}/><path d="M-6 6 Q0 14 6 6" fill="#fff"/><circle cx="-4" cy="0" r="1.8" fill="#1f3557"/><circle cx="4" cy="0" r="1.8" fill="#1f3557"/><circle cx="0" cy="5" r="1.8" fill="#1f3557"/>`},
  {id:'clock',name:'Wall Clock',cat:'decor',k:'w',w:1,price:80,draw:()=>`<circle cx="0" cy="0" r="24" fill="#fff" stroke="#1f3557" stroke-width="3"/><circle cx="0" cy="0" r="24" fill="none" stroke="#ff6b57" stroke-width="5" opacity=".6"/>${[0,90,180,270].map(a=>`<path d="M0 -19 V-15" stroke="#1f3557" stroke-width="2.5" transform="rotate(${a})"/>`).join('')}<path d="M0 0 V-13 M0 0 L9 5" stroke="#1f3557" stroke-width="3" stroke-linecap="round"/><circle r="2.5" fill="#1f3557"/>`},
  {id:'shelf',name:'Book Shelf',cat:'decor',k:'w',w:2,price:100,draw:()=>`<rect x="-60" y="14" width="120" height="8" rx="3" fill="#c98a4b" ${S2}/>${[['#ff6b57',-52,30],['#2f9fe0',-42,26],['#ffc23d',-32,32],['#38b98a',-22,24]].map(([c,x,h])=>`<rect x="${x}" y="${14-h}" width="9" height="${h}" rx="1.5" fill="${c}" stroke="#1f3557" stroke-width="1.8"/>`).join('')}<path d="M-8 14 V-4 Q2 -12 10 -4 V14" fill="#8f7cf0" ${S2}/><path d="M26 14 q4 -16 12 -16 q8 0 12 16Z" fill="#ff8a6b" ${S2}/><path d="M38 -2 v-10 M34 -12 q4 -8 8 0" stroke="#38b98a" stroke-width="3" fill="none"/>`},
  {id:'rugRound',name:'Round Rug',cat:'cozy',k:'r',w:2,d:2,price:120,col:['#ffb3d1','#ff8ab5']},
  {id:'rugStripe',name:'Stripy Rug',cat:'cozy',k:'r',w:3,d:2,price:180,col:['#bfe9ff','#7fd0f5']},
  {id:'rugRainbow',name:'Rainbow Rug',cat:'cozy',k:'r',w:4,d:3,price:260,col:['#fff3c4','#ffc23d']},
  {id:'beanbag',name:'Bean Bag',cat:'cozy',k:'f',w:1,price:90,draw:()=>`<path d="M-28 0 Q-34 -30 -12 -40 Q4 -48 18 -36 Q34 -22 28 0Z" fill="#ffc23d" ${S2}/><path d="M-14 -30 q10 6 24 -2" stroke="#e09a14" stroke-width="3" fill="none" stroke-linecap="round"/>`},
  {id:'cushions',name:'Floor Cushions',cat:'cozy',k:'f',w:1,price:50,draw:()=>`<rect x="-28" y="-16" width="56" height="16" rx="8" fill="#8f7cf0" ${S2}/><rect x="-22" y="-32" width="44" height="16" rx="8" fill="#5cc4b0" ${S2}/><circle cx="0" cy="-24" r="2.5" fill="#1f3557"/><circle cx="0" cy="-8" r="2.5" fill="#1f3557"/>`},
  {id:'toybox',name:'Toy Box',cat:'cozy',k:'f',w:1,price:70,draw:()=>`<circle cx="-10" cy="-40" r="9" fill="#ff6b57" ${S2}/><path d="M6 -52 l4 10 l10 1 l-8 7 l3 10 l-9 -6 l-9 6 l3 -10 l-8 -7 l10 -1Z" fill="#ffd56b" ${S2}/><rect x="-28" y="-34" width="56" height="34" rx="4" fill="#2f9fe0" ${S2}/><path d="M-28 -24 H28" stroke="#1f3557" stroke-width="2.5"/><circle cx="0" cy="-12" r="5" fill="#ffc23d" ${S2}/>`},
  {id:'trophy',name:'Puzzle Trophy',cat:'decor',k:'f',w:1,price:150,prize:5,draw:()=>`<rect x="-18" y="-16" width="36" height="16" rx="3" fill="#a0683a" ${S2}/><rect x="-7" y="-44" width="14" height="30" fill="#ffc23d" ${S2}/><path d="M-22 -86 H22 Q22 -46 0 -40 Q-22 -46 -22 -86Z" fill="#ffc23d" ${S2}/><path d="M-22 -80 Q-36 -78 -30 -62 Q-26 -56 -18 -56 M22 -80 Q36 -78 30 -62 Q26 -56 18 -56" fill="none" stroke="#1f3557" stroke-width="3"/><path d="M0 -76 l4 8 l9 1 l-7 6 l2 9 l-8 -5 l-8 5 l2 -9 l-7 -6 l9 -1Z" fill="#fff" opacity=".9"/>`},
  {id:'rocketlamp',name:'Rocket Lamp',cat:'light',k:'f',w:1,price:200,prize:12,draw:()=>`<circle class="hglow" cx="0" cy="-60" r="32" fill="#ffd56b" opacity=".35"/><path d="M0 -118 Q18 -96 16 -48 H-16 Q-18 -96 0 -118Z" fill="#fff" ${S2}/><circle cx="0" cy="-84" r="8" fill="#7fd0f5" ${S2}/><path d="M-16 -62 L-28 -38 L-16 -44Z M16 -62 L28 -38 L16 -44Z" fill="#ff6b57" ${S2}/><path d="M-10 -48 Q0 -26 10 -48Z" fill="#ffc23d" ${S2}/><rect x="-18" y="-8" width="36" height="8" rx="3" fill="#6b5bd6" ${S2}/><path d="M0 -26 V-8" stroke="#1f3557" stroke-width="3"/>`},
  {id:'numrug',name:'Number Rug',cat:'cozy',k:'r',w:3,d:2,price:200,prize:25,col:['#c9f0d8','#38b98a']},
  {id:'pumpkinlamp',name:'Pumpkin Lamp',cat:'season',ev:'halloween',k:'f',w:1,price:90,draw:()=>`<circle class="hglow" cx="0" cy="-24" r="28" fill="#ffb347" opacity=".4"/><ellipse cx="0" cy="-22" rx="26" ry="21" fill="#ff8c1a" ${S2}/><path d="M-9 -42 Q-12 -22 -9 -2 M9 -42 Q12 -22 9 -2" stroke="#d9620a" stroke-width="2.5" fill="none"/><path d="M0 -42 q2 -8 8 -10" stroke="#2b8a62" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M-13 -28 l5 -6 l5 6Z M3 -28 l5 -6 l5 6Z M-12 -16 Q0 -8 12 -16 Q0 -12 -12 -16Z" fill="#ffd56b"/>`},
  {id:'batgarland',name:'Bat Garland',cat:'season',ev:'halloween',k:'w',w:2,price:80,draw:()=>`<path d="M-62 -16 Q0 16 62 -16" fill="none" stroke="#1f3557" stroke-width="2"/>${[-40,-8,24,52].map((x,i)=>`<g transform="translate(${x} ${[-2,6,4,-6][i]})"><path d="M0 0 q-6 -8 -16 -4 q6 2 4 8 q6 -4 12 0 q6 -4 12 0 q-2 -6 4 -8 q-10 -4 -16 4Z" fill="#6b5bd6" stroke="#1f3557" stroke-width="1.5"/><circle cx="-2" cy="1" r="1" fill="#ffd56b"/><circle cx="2" cy="1" r="1" fill="#ffd56b"/></g>`).join('')}`},
  {id:'harvest',name:'Harvest Basket',cat:'season',ev:'thanks',k:'f',w:1,price:90,draw:()=>`<circle cx="-10" cy="-30" r="9" fill="#ff6b57" ${S2}/><circle cx="8" cy="-32" r="10" fill="#ff9f43" ${S2}/><ellipse cx="0" cy="-38" rx="6" ry="9" fill="#ffc23d" ${S2}/><path d="M-26 -26 H26 L20 0 H-20Z" fill="#c98a4b" ${S2}/><path d="M-22 -16 H22 M-20 -8 H20" stroke="#a0683a" stroke-width="2.5"/>`},
  {id:'wreath',name:'Leaf Wreath',cat:'season',ev:'thanks',k:'w',w:1,price:70,draw:()=>`${Array.from({length:10},(_,i)=>{const a=i*36*Math.PI/180;return `<ellipse cx="${(Math.cos(a)*20).toFixed(1)}" cy="${(Math.sin(a)*20).toFixed(1)}" rx="9" ry="5" fill="${['#ff9f43','#ff6b57','#ffc23d'][i%3]}" stroke="#1f3557" stroke-width="1.5" transform="rotate(${i*36+90} ${(Math.cos(a)*20).toFixed(1)} ${(Math.sin(a)*20).toFixed(1)})"/>`}).join('')}<path d="M-6 18 l6 8 l6 -8" fill="#ff6b57" stroke="#1f3557" stroke-width="1.5"/>`},
  {id:'snowtree',name:'Twinkle Tree',cat:'season',ev:'winter',k:'f',w:1,price:120,draw:()=>`<rect x="-5" y="-14" width="10" height="14" fill="#8c5a2c" ${S2}/><path d="M0 -112 L26 -60 H14 L32 -14 H-32 L-14 -60 H-26Z" fill="#2e9e5b" ${S2}/><path d="M0 -122 l3 7 l7 1 l-5 5 l1 7 l-6 -3 l-6 3 l1 -7 l-5 -5 l7 -1Z" fill="#ffd56b" ${S2}/>${[[-10,-70,'#ff6b57'],[10,-52,'#2f9fe0'],[-16,-30,'#ffc23d'],[14,-24,'#e2558f'],[2,-88,'#fff']].map(([x,y,c])=>`<circle class="hglow" cx="${x}" cy="${y}" r="4" fill="${c}" stroke="#1f3557" stroke-width="1.2"/>`).join('')}`},
  {id:'snowlights',name:'Snowflake Lights',cat:'season',ev:'winter',k:'w',w:2,price:80,draw:()=>`<path d="M-62 -16 Q0 14 62 -16" fill="none" stroke="#1f3557" stroke-width="2"/>${[-44,-14,16,46].map((x,i)=>`<g transform="translate(${x} ${[-2,6,6,-2][i]+8})" stroke="#5fb6e6" stroke-width="3" stroke-linecap="round"><path d="M0 -9 V9 M-8 -4.5 L8 4.5 M-8 4.5 L8 -4.5"/></g>`).join('')}`},
  {id:'tulips',name:'Tulip Vase',cat:'season',ev:'spring',k:'f',w:1,price:80,draw:()=>`${[[-10,'#e2558f'],[0,'#ffc23d'],[10,'#ff6b57']].map(([x,c],i)=>`<path d="M${x/2} -30 Q${x} -50 ${x} -60" stroke="#2b8a62" stroke-width="3" fill="none"/><path d="M${x-7} -62 Q${x-7} -74 ${x} -70 Q${x+7} -74 ${x+7} -62 Q${x} -54 ${x-7} -62Z" fill="${c}" ${S2}/>`).join('')}<path d="M-14 -32 H14 Q18 -14 10 0 H-10 Q-18 -14 -14 -32Z" fill="#7fd0f5" ${S2}/>`},
  {id:'butterfly',name:'Butterfly Frame',cat:'season',ev:'spring',k:'w',w:1,price:70,draw:()=>`<rect x="-26" y="-24" width="52" height="48" rx="4" fill="#fff" stroke="#c98a4b" stroke-width="5"/><path d="M0 -6 Q-18 -22 -16 0 Q-18 16 0 6 Q18 16 16 0 Q18 -22 0 -6Z" fill="#8f7cf0" ${S2}/><path d="M0 -10 V10" stroke="#1f3557" stroke-width="2.5"/>`},
  {id:'beachchair',name:'Beach Chair',cat:'season',ev:'summer',k:'f',w:1,price:90,draw:()=>`<path d="M-22 0 L-8 -30 M22 0 L4 -26" stroke="#c98a4b" stroke-width="4" stroke-linecap="round"/><path d="M-26 -30 H14 L22 -58 H-12Z" fill="#ff6b57" ${S2}/><path d="M-16 -36 H16 M-8 -50 H20" stroke="#fff" stroke-width="4"/>`},
  {id:'shellframe',name:'Seashell Frame',cat:'season',ev:'summer',k:'w',w:1,price:70,draw:()=>`<rect x="-26" y="-24" width="52" height="48" rx="4" fill="#bfe9ff" stroke="#ffd56b" stroke-width="5"/><path d="M-12 12 Q-14 -10 0 -12 Q14 -10 12 12Z" fill="#ff9fc4" ${S2}/><path d="M0 -12 V12 M-6 -10 L-4 12 M6 -10 L4 12" stroke="#1f3557" stroke-width="1.5"/>`}
];
const IN_CATS=[['furn','Furniture'],['light','Lights'],['decor','Decor'],['cozy','Cozy'],['season','Seasonal'],['walls','Walls & Floors'],['sets','Sets']];
const evOn=id=>!!(CUR_EV&&CUR_EV.id===id);
const WALLS=[
  {id:'cream',name:'Cream Wall',price:0,base:'#fff3dc',pat:''},
  {id:'sky',name:'Sky Stripes',price:80,base:'#e4f5ff',pat:'<rect x="0" y="0" width="14" height="40" fill="#c9eaff"/>',pw:28,ph:40},
  {id:'stars',name:'Starry Night',price:120,base:'#e9e3ff',pat:'<path d="M14 6 l2.4 5 l5.6 .8 l-4 3.9 l1 5.5 l-5 -2.6 l-5 2.6 l1 -5.5 l-4 -3.9 l5.6 -.8Z" fill="#ffd56b"/><circle cx="34" cy="30" r="2.5" fill="#fff"/>',pw:44,ph:44},
  {id:'leafy',name:'Leafy Green',price:120,base:'#e3f6e8',pat:'<ellipse cx="14" cy="14" rx="5" ry="9" fill="#a8dfb8" transform="rotate(35 14 14)"/><ellipse cx="34" cy="34" rx="5" ry="9" fill="#a8dfb8" transform="rotate(-35 34 34)"/>',pw:48,ph:48},
  {id:'candy',name:'Candy Dots',price:80,base:'#ffe6ef',pat:'<circle cx="10" cy="10" r="4" fill="#ffb3d1"/><circle cx="30" cy="30" r="4" fill="#ffd56b"/>',pw:40,ph:40},
];
const FLOORS=[
  {id:'wood',name:'Wood Floor',price:0,base:'#e2ad74',pat:'<path d="M0 0 H80 M40 0 V20 M0 20 H80 M10 20 V40 M60 20 V40" stroke="#c98a4b" stroke-width="2"/>',pw:80,ph:40},
  {id:'tiles',name:'Checker Tiles',price:80,base:'#ffffff',pat:'<rect width="24" height="24" fill="#cfe3f5"/><rect x="24" y="24" width="24" height="24" fill="#cfe3f5"/>',pw:48,ph:48},
  {id:'cloud',name:'Cloud Carpet',price:120,base:'#eaf6ff',pat:'<circle cx="14" cy="14" r="7" fill="#fff"/><circle cx="22" cy="12" r="6" fill="#fff"/><circle cx="42" cy="36" r="6" fill="#fff"/><circle cx="49" cy="38" r="5" fill="#fff"/>',pw:60,ph:48},
  {id:'grass',name:'Grass Mat',price:100,base:'#bfe6a0',pat:'<path d="M10 20 l3 -8 l3 8 M36 40 l3 -8 l3 8" stroke="#8fd46a" stroke-width="2.5" fill="none" stroke-linecap="round"/>',pw:48,ph:48},
];
const patDef=(id,P)=>P.pat?`<pattern id="${id}" patternUnits="userSpaceOnUse" width="${P.pw}" height="${P.ph}"><rect width="${P.pw}" height="${P.ph}" fill="${P.base}"/>${P.pat}</pattern>`:'';
const patFill=(id,P)=>P.pat?`url(#${id})`:P.base;
let inEdit=false,inSel='',inCat='furn';
function inState(){G.home=G.home||{house:0,items:{}};const I=G.home.inside=G.home.inside||{};I.walls=I.walls||['cream'];I.floors=I.floors||['wood'];I.items=I.items||[];I.n=I.n||0;
  if(!I.rw){I.rw={main:{w:I.wall||'cream',f:I.floor||'wood'}};delete I.wall;delete I.floor}I.cur=I.cur||'main';I.done=I.done||{};return I}
const inItem=id=>INSIDE.find(x=>x.id===id);
const inCount=id=>inState().items.filter(t=>t.id===id).length;
/* cells a thing covers, so two things never sit on the same spot */
function inCells(t,c=t.c,r=t.r){const it=inItem(t.id),out=[];const d=it.k==='r'?it.d:1;for(let i=0;i<it.w;i++)for(let j=0;j<d;j++)out.push((it.k)+':'+(c+i)+':'+(r+j));return out}
function inFits(t,c,r){const it=inItem(t.id),C=inCols(),R=it.k==='w'?IN_WROWS:IN_ROWS,d=it.k==='r'?it.d:1;if(c<0||r<0||c+it.w>C||r+d>R)return false;
  const busy=new Set(),rid=curRoom().id;inState().items.forEach(o=>{if(o!==t&&o.p&&roomOf(o)===rid)inCells(o).forEach(k=>busy.add(k))});return inCells(t,c,r).every(k=>!busy.has(k))}
function inFreeSpot(t){const it=inItem(t.id),R=it.k==='w'?IN_WROWS:IN_ROWS;for(let r=0;r<R;r++)for(let c=0;c<inCols();c++)if(inFits(t,c,r))return [c,r];return null}
/* where a thing is drawn: floor things stand on the middle of their cells; back rows are a little smaller */
function inPos(t){const it=inItem(t.id),x=inX0()+(t.c+it.w/2)*IN_CW;if(it.k==='w')return {x,y:inWallY(t.r),s:1};const [a,b]=inBand(t.r);return {x,y:a+(b-a)*.78,s:inScale(t.r)}}
function rugSVG(it,x0,y0,x1,y1){const [c1,c2]=it.col,cx=(x0+x1)/2,cy=(y0+y1)/2;
  if(it.id==='rugRound')return `<ellipse cx="${cx}" cy="${cy}" rx="${(x1-x0)/2-6}" ry="${(y1-y0)/2-6}" fill="${c1}" ${S2}/><ellipse cx="${cx}" cy="${cy}" rx="${(x1-x0)/2-20}" ry="${(y1-y0)/2-16}" fill="none" stroke="${c2}" stroke-width="6"/>`;
  if(it.id==='rugStripe'){const w=x1-x0-12;return `<rect x="${x0+6}" y="${y0+6}" width="${w}" height="${y1-y0-12}" rx="10" fill="${c1}" ${S2}/>${[0.2,0.45,0.7].map(f=>`<rect x="${x0+6+w*f}" y="${y0+8}" width="${w*.1}" height="${y1-y0-16}" fill="${c2}"/>`).join('')}<rect x="${x0+6}" y="${y0+6}" width="${w}" height="${y1-y0-12}" rx="10" fill="none" ${S2}/>`}
  if(it.id==='numrug'){const W=x1-x0-12,H=y1-y0-12,cw=W/3,ch=H/2;return `<rect x="${x0+6}" y="${y0+6}" width="${W}" height="${H}" rx="10" fill="${c1}" ${S2}/>${[1,2,3,4,5,6].map((n,i)=>`<text x="${x0+6+(i%3+.5)*cw}" y="${y0+6+(Math.floor(i/3)+.5)*ch+8}" text-anchor="middle" ${FONT} font-size="24" fill="${['#ff6b57','#2f9fe0','#e09a14','#8f7cf0','#e2558f','#1d7a55'][i]}">${n}</text>`).join('')}<path d="M${x0+6+cw} ${y0+8} V${y1-8} M${x0+6+2*cw} ${y0+8} V${y1-8} M${x0+8} ${y0+6+ch} H${x1-8}" stroke="${c2}" stroke-width="2.5" stroke-dasharray="6 5"/><rect x="${x0+6}" y="${y0+6}" width="${W}" height="${H}" rx="10" fill="none" ${S2}/>`}
  const cols=['#ff6b57','#ff9f43','#ffc23d','#38b98a','#2f9fe0','#8f7cf0'],h=y1-y0-12;return `<rect x="${x0+6}" y="${y0+6}" width="${x1-x0-12}" height="${h}" rx="14" fill="${c1}" ${S2}/>${cols.map((c,i)=>`<rect x="${x0+12}" y="${y0+12+i*(h-12)/6}" width="${x1-x0-24}" height="${(h-12)/6-2}" rx="4" fill="${c}" opacity=".75"/>`).join('')}<rect x="${x0+6}" y="${y0+6}" width="${x1-x0-12}" height="${h}" rx="14" fill="none" ${S2}/>`}
function rugCells(t){const it=inItem(t.id),x0=inX0()+t.c*IN_CW,x1=x0+it.w*IN_CW,y0=inBand(t.r)[0],y1=inBand(t.r+it.d-1)[1];return [x0,y0,x1,y1]}
function inThingSVG(t){const it=inItem(t.id);if(it.k==='r')return rugSVG(it,...rugCells(t));const p=inPos(t);return `<g transform="translate(${p.x} ${p.y}) scale(${(t.f?-1:1)*p.s} ${p.s})">${it.draw()}</g>`}
/* Pip lives in the room: sits on a seat, naps on the bed, or just stands around. Tap Pip to move. */
function pipSpots(placed){return placed.filter(t=>SEATS[t.id]).sort((a,b)=>a.u<b.u?-1:1)}
function pipInRoom(placed,x1){
  const spots=pipSpots(placed),t=spots.length?spots[inPip%(spots.length+1)]:null;
  const svgAt=(x,y,w,h)=>foxSVG({bare:1}).replace(/<svg class="fox" viewBox="([^"]+)" aria-hidden="true">/,`<svg class="infox" x="${x}" y="${y}" width="${w}" height="${h}" viewBox="$1">`);
  if(!t)return `<g class="inpip" role="button" aria-label="Pip">${svgAt(x1-80,IN_FLOOR[1]-96,72,84)}</g>`;
  const p=inPos(t),S=SEATS[t.id],f=t.f?-1:1;
  if(S==='lie'){const hx=p.x+f*(-26)*p.s,hy=p.y-44*p.s,w=60*p.s,h=70*p.s;
    return `<g class="inpip" role="button" aria-label="Pip"><g transform="translate(${hx} ${hy}) rotate(${f*-80})">${svgAt(-w/2,-h*.55,w,h)}</g><g transform="translate(${p.x} ${p.y}) scale(${f*p.s} ${p.s})"><rect x="-14" y="-47" width="76" height="24" rx="8" fill="#8f7cf0" ${S2}/><path d="M-2 -40 h52" stroke="#fff" stroke-width="3" opacity=".6"/></g><text x="${hx+f*14}" y="${hy-40*p.s}" ${FONT} font-size="${18*p.s}" fill="#6b5bd6" class="zzz">z<tspan dx="2" dy="-8" font-size="${14*p.s}">z</tspan><tspan dx="2" dy="-7" font-size="${11*p.s}">z</tspan></text></g>`}
  const w=60*p.s,h=70*p.s,cx=p.x+f*S[1]*p.s,top=p.y+S[0]*p.s;
  return `<g class="inpip" role="button" aria-label="Pip">${svgAt(cx-w/2,top-h*.86,w,h)}</g>`}
function insideSVG(){
  const I=inState(),R=curRoom(),wf=roomWF(),C=inCols(),x0=inX0(),x1=x0+C*IN_CW,W=WALLS.find(w=>w.id===wf.w)||WALLS[0],F=FLOORS.find(f=>f.id===wf.f)||FLOORS[0];
  const placed=roomThings(R.id);
  const thing=t=>`<g class="inthing${inEdit?' movable':''}${inSel===t.u?' sel':''}" data-iu="${t.u}"${inEdit?` tabindex="0" role="button" aria-label="Move ${esc(inItem(t.id).name)}"`:''}>${inThingSVG(t)}</g>`;
  const grid=inEdit?`<g class="ingrid">${Array.from({length:IN_ROWS},(_,r)=>Array.from({length:C},(_,c)=>{const [a,b]=inBand(r);return `<rect x="${x0+c*IN_CW+3}" y="${a+3}" width="${IN_CW-6}" height="${b-a-6}" rx="8"/>`}).join('')).join('')}${Array.from({length:IN_WROWS},(_,r)=>Array.from({length:C},(_,c)=>`<rect x="${x0+c*IN_CW+3}" y="${inWallY(r)-38}" width="${IN_CW-6}" height="76" rx="8"/>`).join('')).join('')}</g>`:'';
  const floorThings=placed.filter(t=>inItem(t.id).k==='f').sort((a,b)=>a.r-b.r||a.c-b.c);
  const pip=inEdit?'':pipInRoom(placed,x1);
  const lvl=(G.home&&G.home.house)||0,roof=['#ff9f43','#ff6b57','#2f9fe0','#8f7cf0'][Math.max(0,lvl-1)];
  const vw=Math.max(x1-x0+88,540);return `<svg viewBox="${320-vw/2} 0 ${vw} 420" class="inroom${inEdit?' editing':''}" role="img" aria-label="Inside ${esc(G.name||'Pip')}'s home"><defs>${patDef('inW',W)}${patDef('inF',F)}</defs>
    ${R.sky?`<rect x="${x0-14}" y="${IN_WALL[0]}" width="${x1-x0+28}" height="${IN_FLOOR[1]-IN_WALL[0]+4}" rx="10" fill="#b9c3cf" ${S2}/><rect x="${x0}" y="${IN_WALL[0]+8}" width="${x1-x0}" height="${IN_WALL[1]-IN_WALL[0]-8}" fill="#bfe9ff"/><g fill="#fff" opacity=".9"><circle cx="${x0+60}" cy="110" r="16"/><circle cx="${x0+82}" cy="104" r="20"/><circle cx="${x0+104}" cy="112" r="14"/><circle cx="${x1-90}" cy="160" r="13"/><circle cx="${x1-72}" cy="154" r="17"/><circle cx="${x1-54}" cy="161" r="12"/></g><circle cx="${x1-60}" cy="92" r="20" fill="#ffd56b"/>`
    :`<path d="M${x0-26} ${IN_WALL[0]+2} L320 6 L${x1+26} ${IN_WALL[0]+2}Z" fill="${roof}" ${S2}/>
    <rect x="${x0-14}" y="${IN_WALL[0]}" width="${x1-x0+28}" height="${IN_FLOOR[1]-IN_WALL[0]+4}" rx="10" fill="#a0683a" ${S2}/>
    <rect x="${x0}" y="${IN_WALL[0]+8}" width="${x1-x0}" height="${IN_WALL[1]-IN_WALL[0]-8}" fill="${patFill('inW',W)}"/>`}
    <path d="M${x0} ${IN_FLOOR[0]} H${x1} V${IN_FLOOR[1]} H${x0}Z" fill="${patFill('inF',F)}"/>
    ${R.sky?`<path d="M${x0} ${IN_FLOOR[0]-26} H${x1} M${x0} ${IN_FLOOR[0]-10} H${x1}" stroke="#fff" stroke-width="5"/>${Array.from({length:C*2+1},(_,i)=>`<path d="M${x0+i*IN_CW/2} ${IN_FLOOR[0]-32} V${IN_FLOOR[0]}" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`).join('')}`:''}
    <path d="M${x0} ${IN_FLOOR[0]} H${x1}" stroke="#fff" stroke-width="8"/><path d="M${x0} ${IN_FLOOR[0]+4} H${x1}" stroke="#1f3557" stroke-width="2" opacity=".35"/>
    <rect x="${x0}" y="${IN_WALL[0]+8}" width="${x1-x0}" height="${IN_FLOOR[1]-IN_WALL[0]-8}" fill="none" stroke="#1f3557" stroke-width="2.5"/>
    ${placed.filter(t=>inItem(t.id).k==='w').map(thing).join('')}
    ${placed.filter(t=>inItem(t.id).k==='r').map(thing).join('')}
    ${grid}
    ${floorThings.map(thing).join('')}
    ${pip}
    ${!placed.length&&!inEdit?`<text x="320" y="150" text-anchor="middle" ${FONT} font-size="20" fill="#1f3557" opacity=".55">An empty ${esc(R.name().toLowerCase())}! Let's decorate it.</text>`:''}
  </svg>`;
}
function openInside(){
  if(!G.home||!G.home.house){openHome();say($('#hsay'),`First let's build a home. Then we can go <b>inside</b> and decorate it!`);return}
  stopTimers();inEdit=false;inSel='';show('inside');inState();renderInside();
  const n=inState().items.length;say($('#insay'),n?`Welcome home${nm()}! Want to <b>decorate</b> a little more?`:`This is the inside of our <b>${esc(HOUSES[G.home.house-1].name)}</b>! Let's buy some furniture and make it cozy.`);foxClass('waving',1400);
}
function renderInside(){
  updateStats();const I=inState(),lvl=G.home.house,C=inCols();
  const R=curRoom();$('#inTitle').textContent=`${HOUSES[lvl-1].name}: ${R.name()}`;
  const nxt=HOUSES[lvl];$('#inSub').innerHTML=`Room size: <b>${C} × ${IN_ROWS}</b> floor squares${nxt?` · build the ${esc(nxt.name)} for ${lvl>=2?'more rooms':'a bigger room'}`:''}`;
  $('#inRooms').innerHTML=ROOMS.map(r=>{const open=roomOpen(r),on=r===R;return `<button type="button" class="ichip${on?' on':''}${open?'':' lockd'}" data-room="${r.id}" aria-pressed="${on}">${open?'':ICON.lock}${esc(r.name())}</button>`}).join('');
  $('#inRooms').querySelectorAll('[data-room]').forEach(b=>b.onclick=()=>{const r=ROOMS.find(x=>x.id===b.dataset.room);
    if(!roomOpen(r)){sNo();say($('#insay'),`The <b>${esc(r.name())}</b> opens when we build the <b>${esc(HOUSES[r.need-1].name)}</b>. Let's save up!`);return}
    I.cur=r.id;inEdit=false;inSel='';inPip=0;save(true);tone([523,659,784],.05);renderInside();say($('#insay'),pickR([`Welcome to the <b>${esc(r.name())}</b>!`,`Let's make the <b>${esc(r.name())}</b> super cozy!`]))});
  renderInsideView();renderInShop();renderPuzzles();
}
function renderInsideView(){
  $('#inView').innerHTML=insideSVG();bindInDrag();
  const I=inState(),sel=inSel&&I.items.find(t=>t.u===inSel&&t.p);
  $('#inTools').innerHTML=inEdit?`<button type="button" class="go small leaf" id="inDone">Done</button>${sel?`<button type="button" class="go small alt" id="inFlip">Flip</button><button type="button" class="go small alt" id="inAway">Put away: ${esc(inItem(sel.id).name)}</button>`:''}<span class="note">Drag things to a free square. Tap one to flip it or put it away.</span>`
    :`<button type="button" class="go small" id="inDeco"${I.items.some(t=>t.p)?'':' hidden'}>Decorate</button><button type="button" class="go small alt" id="inOut">Back outside</button>`;
  const cz=cozyOf(curRoom().id),cn=cz.filter(c=>c[2]).length;
  $('#inCozy').innerHTML=`<div class="czhead"><b>Cozy</b><span class="czhearts" aria-label="${cn} out of 5">${cz.map(c=>`<svg viewBox="0 0 24 24" class="${c[2]?'on':''}"><path d="M12 20.5 C5 15.5 2.5 12 2.5 8.6 A4.6 4.6 0 0 1 12 6.4 A4.6 4.6 0 0 1 21.5 8.6 C21.5 12 19 15.5 12 20.5Z"/></svg>`).join('')}</span><small>${cn}/5</small></div><div class="czlist">${cz.map(c=>`<span class="${c[2]?'ok':''}">${c[2]?CHECK:''}${c[1]}</span>`).join('')}</div>`;
  inRewards();
  const st=I.items.filter(t=>!t.p&&inItem(t.id)),tray=$('#inStore');
  tray.hidden=!st.length;tray.innerHTML=st.length?`<h4>In storage <small>still yours, free to put back</small></h4><div class="storelist">${st.map(t=>`<button type="button" class="storeit" data-iplace="${t.u}" title="Put it in the room"><span class="prev">${inThumb(t.id)}</span><b>${esc(inItem(t.id).name)}</b><small>Put back</small></button>`).join('')}</div>`:'';
  fitPreviews(tray);
  tray.querySelectorAll('[data-iplace]').forEach(b=>b.onclick=()=>inPlaceBack(b.dataset.iplace));
  if($('#inDeco'))$('#inDeco').onclick=()=>{inEdit=true;inSel='';renderInsideView();say($('#insay'),`Decorating time! <b>Drag</b> things to a free square. Tap one to <b>flip</b> it or put it away.`)};
  if($('#inDone'))$('#inDone').onclick=()=>{inEdit=false;inSel='';renderInsideView();say($('#insay'),`Looks amazing! I love our home.`);foxMove('hop')};
  if($('#inOut'))$('#inOut').onclick=()=>{tone([523,392]);openHome()};
  if($('#inFlip'))$('#inFlip').onclick=()=>{sel.f=sel.f?0:1;save();tone([523,659],.05);renderInsideView()};
  if($('#inAway'))$('#inAway').onclick=()=>{sel.p=false;inSel='';save();tone([523,392],.06);renderInsideView();say($('#insay'),`I put the <b>${esc(inItem(sel.id).name)}</b> in storage. Put it back any time, for free!`)};
  const pg=$('#inView .inpip');if(pg)pg.onclick=e=>{e.stopPropagation();inPip++;tone([659,880],.05);renderInsideView();const sp=pipSpots(roomThings(curRoom().id)),t=sp.length?sp[inPip%(sp.length+1)]:null;
    say($('#insay'),!t?pickR([`I'll just stand here and admire our home!`,`Where should I sit? Buy a <b>sofa</b> or a <b>bean bag</b>!`]):t.id==='bed'?pickR([`Zzz... nap time!`,`This bed is sooo comfy. Zzz...`]):pickR([`Ahh, the <b>${esc(inItem(t.id).name)}</b> is so comfy!`,`I love sitting here!`]))};
  if(!inEdit)$('#inView').querySelectorAll('[data-iu]').forEach(g=>g.onclick=()=>{const t=I.items.find(x=>x.u===g.dataset.iu);if(!t)return;tone([659,784],.05);g.classList.remove('boing');void g.getBBox();g.classList.add('boing');say($('#insay'),pickR([`I love the <b>${esc(inItem(t.id).name)}</b>!`,`The <b>${esc(inItem(t.id).name)}</b> looks great right there.`,`Ooh, the <b>${esc(inItem(t.id).name)}</b>!`]))});
}
const pickR=a=>a[Math.floor(Math.random()*a.length)];
function inRewards(){const I=inState(),R=curRoom();let changed=false;
  if(I.items.filter(t=>t.p).length>=5)award('homey');
  if(cozyOf(R.id).every(c=>c[2])&&!I.done['cozy_'+R.id]){I.done['cozy_'+R.id]=1;G.coins+=50;changed=true;award('cozy');toast(`${R.name()} is 5/5 cozy!`,'+50 coins','#e2558f');setTimeout(()=>{burstAt($('#inCozy'),80);sWin()},200)}
  DSETS.forEach(S=>{if(!I.done['set_'+S.id]&&setHave(S).length===S.items.length){I.done['set_'+S.id]=1;G.coins+=S.bonus;changed=true;award('decorset');toast(`Set complete: ${S.name}!`,`+${S.bonus} coins`,'#8f7cf0');setTimeout(()=>sWin(),300)}});
  if(changed){save();updateStats('#coinPill')}}
function inThumb(id){const it=inItem(id);if(it.k==='r'){return `<svg viewBox="0 0 ${it.w*IN_CW} ${it.d*58}">${rugSVG(it,0,0,it.w*IN_CW,it.d*58)}</svg>`}return `<svg viewBox="-80 -140 160 150">${it.draw()}</svg>`}
function inPlaceBack(u){const t=inState().items.find(x=>x.u===u);if(!t)return;const sp=inFreeSpot(t);
  if(!sp){say($('#insay'),`There's no free spot for the <b>${esc(inItem(t.id).name)}</b>. Put something else away first${G.home.house<4?', or build a bigger home!':'.'}`);sNo();return}
  [t.c,t.r]=sp;t.p=true;t.rm=curRoom().id;inSel=t.u;save();tone([392,523,659],.06);renderInsideView();say($('#insay'),`The <b>${esc(inItem(t.id).name)}</b> is back!`);foxMove('hop')}
function bindInDrag(){
  const svg=$('#inView svg');if(!svg||!inEdit)return;const I=inState();
  const pt=e=>{const m=svg.getScreenCTM().inverse();const q=new DOMPoint(e.clientX,e.clientY).matrixTransform(m);return [q.x,q.y]};
  const cellAt=(t,x,y)=>{const it=inItem(t.id);let c=Math.round((x-inX0())/IN_CW-it.w/2),r;
    if(it.k==='w')r=y<(inWallY(0)+inWallY(1))/2?0:1;else{const h=(IN_FLOOR[1]-IN_FLOOR[0])/IN_ROWS,d=it.k==='r'?it.d:1;r=Math.round((y-IN_FLOOR[0])/h-d/2)}
    const R=it.k==='w'?IN_WROWS:IN_ROWS,d=it.k==='r'?it.d:1;return [Math.max(0,Math.min(inCols()-it.w,c)),Math.max(0,Math.min(R-d,r))]};
  svg.querySelectorAll('[data-iu]').forEach(g=>{const t=I.items.find(x=>x.u===g.dataset.iu);if(!t)return;
    g.onpointerdown=e=>{e.preventDefault();inSel=t.u;svg.querySelectorAll('.sel').forEach(x=>x.classList.remove('sel'));g.classList.add('sel','dragging');
      const s=pt(e),p0=inPos(t),it=inItem(t.id),ctr=it.k==='r'?(()=>{const [a,b,c,d]=rugCells(t);return [(a+c)/2,(b+d)/2]})():[p0.x,it.k==='w'?p0.y:p0.y-20];let cell=[t.c,t.r],moved=false;
      try{g.setPointerCapture(e.pointerId)}catch(err){}
      g.onpointermove=ev=>{const q=pt(ev);if(Math.hypot(q[0]-s[0],q[1]-s[1])>4)moved=true;if(!moved)return;cell=cellAt(t,ctr[0]+q[0]-s[0],ctr[1]+q[1]-s[1]);
        const old=[t.c,t.r];[t.c,t.r]=cell;const ok=inFits(t,...cell);const p=inPos(t);[t.c,t.r]=old;g.classList.toggle('bad',!ok);
        g.setAttribute('transform',`translate(${(it.k==='r'?(cell[0]-t.c)*IN_CW:p.x-p0.x).toFixed(1)} ${(it.k==='r'?inBand(cell[1])[0]-inBand(t.r)[0]:p.y-p0.y).toFixed(1)})`)};
      g.onpointerup=g.onpointercancel=()=>{g.onpointermove=g.onpointerup=g.onpointercancel=null;g.classList.remove('dragging','bad');
        if(moved&&(cell[0]!==t.c||cell[1]!==t.r)){if(inFits(t,...cell)){[t.c,t.r]=cell;save();tone([392,523],.05)}else{sNo();say($('#insay'),`Oops, that spot is taken. Try a <b>free square</b>!`)}}
        renderInsideView();const n=$(`#inView [data-iu="${t.u}"]`);n&&n.focus({preventScroll:true})}};
    g.onkeydown=e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();t.p=false;inSel='';save();renderInsideView();return}
      const k={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!k)return;e.preventDefault();
      const c=t.c+k[0],r=t.r+k[1];if(inFits(t,c,r)){t.c=c;t.r=r;save(true)}inSel=t.u;renderInsideView();const n=$(`#inView [data-iu="${t.u}"]`);n&&n.focus({preventScroll:true})};
  });
}
function renderInShop(){
  const I=inState();
  $('#inCats').innerHTML=IN_CATS.filter(([k])=>k!=='season'||INSIDE.some(it=>it.ev&&(evOn(it.ev)||inCount(it.id)))).map(([k,n])=>`<button type="button" class="ichip${inCat===k?' on':''}" data-icat="${k}" aria-pressed="${inCat===k}">${n}</button>`).join('');
  $('#inCats').querySelectorAll('[data-icat]').forEach(b=>b.onclick=()=>{inCat=b.dataset.icat;tone([523,659],.04);renderInShop()});
  const buyBtn=(price,attr)=>`<button type="button" class="${G.coins>=price?'buy':''}" ${attr} ${G.coins>=price?'':'disabled'}>${COIN_ICON} ${fmt(price)}</button>`;
  let html;
  if(inCat==='sets'){
    html=DSETS.map(S=>{const have=setHave(S),done=I.done['set_'+S.id];return `<div class="setcard${done?' won':''}"><div class="sethead"><b>${esc(S.name)}</b><span class="status ${done?'ok':'go'}">${done?CHECK+'Bonus won!':`+${S.bonus} coins`}</span></div><div class="setitems">${S.items.map(id=>{const ok=have.includes(id);return `<div class="setit${ok?' ok':''}"><span class="prev">${inThumb(id)}</span><small>${ok?CHECK:''}${esc(inItem(id).name)}</small></div>`}).join('')}</div><p>${done?'You found the whole set!':`Put all ${S.items.length} things in your home (any room). <b>${have.length}/${S.items.length}</b> so far.`}</p></div>`}).join('');
    $('#inShop').innerHTML=`<div class="setgrid">${html}</div>`;fitPreviews($('#inShop'));return}
  if(inCat==='walls'){
    const wf=roomWF(),R=curRoom();
    const sw=(P,kind)=>{const own=canUse(kind,P.id),use=(kind==='wall'?wf.w:wf.f)===P.id,pid=`sw${kind}${P.id}`;
      return `<div class="item${use?' wearing':''}"><div class="prev"><svg viewBox="0 0 120 80"><defs>${patDef(pid,P)}</defs><rect x="4" y="4" width="112" height="72" rx="10" fill="${patFill(pid,P)}" ${S2}/></svg></div><b>${esc(P.name)}</b>${use?`<button type="button" class="worn" disabled>In use</button>`:own?`<button type="button" class="buy" data-iuse="${kind}:${P.id}">Use it</button>`:buyBtn(P.price,`data-ibuy="${kind}:${P.id}"`)}</div>`};
    html=(R.sky?'':WALLS.map(P=>sw(P,'wall')).join(''))+FLOORS.map(P=>sw(P,'floor')).join('');
  }else{const P=pzState();html=INSIDE.filter(it=>it.cat===inCat&&(!it.ev||evOn(it.ev)||inCount(it.id))).map(it=>{const n=inCount(it.id),lock=it.prize&&P.n<it.prize,free=it.prize&&!lock&&!P.claimed[it.id],gone=it.ev&&!evOn(it.ev);
    const btn=lock?`<button type="button" disabled>${ICON.lock} Solve ${it.prize} puzzles</button>`:free?`<button type="button" class="buy" data-ifree="${it.id}">Get it free!</button>`:gone?`<button type="button" class="worn" disabled>Event is over</button>`:buyBtn(it.price,`data-ibuy="item:${it.id}"`);
    const tag=n?`<span class="ownbadge">You have ${n}</span>`:it.prize?`<span class="ownbadge prz">Puzzle prize</span>`:it.ev?`<span class="ownbadge evb">${esc((EVENTS.find(e=>e.id===it.ev)||{}).name||'Limited')}</span>`:'';
    return `<div class="item${lock?' locked':''}">${tag}<div class="prev">${inThumb(it.id)}</div><b>${esc(it.name)}</b><small class="isize">${it.k==='w'?`wall · ${it.w} wide`:it.k==='r'?`${it.w} × ${it.d} squares`:`${it.w} square${it.w>1?'s':''}`}</small>${btn}</div>`}).join('')}
  $('#inShop').innerHTML=html;fitPreviews($('#inShop'));
  $('#inShop').querySelectorAll('[data-ibuy]').forEach(b=>b.onclick=()=>inBuy(...b.dataset.ibuy.split(':')));
  $('#inShop').querySelectorAll('[data-ifree]').forEach(b=>b.onclick=()=>{const P=pzState(),it=inItem(b.dataset.ifree);if(P.claimed[it.id]||P.n<it.prize)return;P.claimed[it.id]=1;G.coins+=it.price;inBuy('item',it.id)});
  $('#inShop').querySelectorAll('[data-iuse]').forEach(b=>b.onclick=()=>{const [k,id]=b.dataset.iuse.split(':');setWF(k,id);save();tone([523,659,784],.06);renderInside()});
}
function setWF(kind,id){const I=inState(),rid=curRoom().id;I.rw[rid]=Object.assign({},I.rw[rid]||{},{[kind==='wall'?'w':'f']:id})}
function inBuy(kind,id){
  const I=inState();
  if(kind==='wall'||kind==='floor'){const P=(kind==='wall'?WALLS:FLOORS).find(x=>x.id===id);if(!P||G.coins<P.price)return;G.coins-=P.price;(kind==='wall'?I.walls:I.floors).push(id);setWF(kind,id);save();sWin();renderInside();say($('#insay'),`New <b>${esc(P.name)}</b>! It feels like a brand new room.`);foxMove('hop');return}
  const it=inItem(id);if(!it||G.coins<it.price||(it.prize&&pzState().n<it.prize))return;G.coins-=it.price;
  const t={u:'i'+(++I.n),id,c:0,r:0,f:0,p:false,rm:curRoom().id};I.items.push(t);const sp=inFreeSpot(t);
  if(sp){[t.c,t.r]=sp;t.p=true;inSel=t.u}
  save();sWin();renderInside();
  const v=$('#inView');if(v)v.scrollIntoView({behavior:'smooth',block:'center'});
  if(sp){burstAt($(`#inView [data-iu="${t.u}"]`),50);say($('#insay'),pickR([`Yay, a <b>${esc(it.name)}</b>!`,`The <b>${esc(it.name)}</b> is perfect for our home!`,`Ooh, a new <b>${esc(it.name)}</b>! Tap <b>Decorate</b> to move it.`]));foxMove('hop')}
  else say($('#insay'),`I love the <b>${esc(it.name)}</b>! There's no free spot right now, so it's waiting in <b>storage</b>.`);
}
/* ===== Home Puzzles: area & perimeter with rugs, money with the shop, fractions with paint ===== */
const PZ_TYPES=[
  {id:'rug',name:'Rug Math',sub:'area & perimeter',color:'#e2558f'},
  {id:'shop',name:'Shopping Math',sub:'adding & change',color:'#e09a14'},
  {id:'frac',name:'Paint Fractions',sub:'parts of a wall',color:'#2f9fe0'},
];
const PZ_REW=20,PZ_ALL=30;
function pzState(){const I=inState();const P=I.pz=I.pz||{n:0,day:'',done:{},by:{},claimed:{}};if(P.day!==dayKey()){P.day=dayKey();P.done={}}P.by=P.by||{};P.att=P.att||{};P.first=P.first||{};P.claimed=P.claimed||{};return P}
const pzR=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
function pzOpts(right,cands){const set=[right];for(const c of cands){if(set.length>=4)break;if(c>0&&!set.includes(c))set.push(c)}let k=1;while(set.length<4){const c=right+k*(k%2?1:-1)*2;if(c>0&&!set.includes(c))set.push(c);k++}return shuffle(set)}
function rugPuzzle(){const w=pzR(2,6),d=pzR(2,5),area=Math.random()<.5;const A=w*d,P=2*(w+d);
  const right=area?A:P,cands=area?[P,w+d,A+w,A-d]:[A,w+d,P+2,P-2];
  const cols=['#ffb3d1','#bfe9ff','#c9f0d8','#fff3c4'],c=pickR(cols),cs=26,ox=40,oy=30;
  const svg=`<svg viewBox="0 0 ${w*cs+80} ${d*cs+60}" class="pzart" role="img" aria-label="A rug ${w} squares long and ${d} squares wide"><rect x="${ox-4}" y="${oy-4}" width="${w*cs+8}" height="${d*cs+8}" rx="10" fill="${c}" ${S2}/>${Array.from({length:d},(_,r)=>Array.from({length:w},(_,q)=>`<rect x="${ox+q*cs+2}" y="${oy+r*cs+2}" width="${cs-4}" height="${cs-4}" rx="5" fill="#fff" opacity=".55"/>`).join('')).join('')}<text x="${ox+w*cs/2}" y="${oy-12}" text-anchor="middle" ${FONT} font-size="15" fill="#1f3557">${w} squares</text><text x="${ox-12}" y="${oy+d*cs/2}" text-anchor="middle" ${FONT} font-size="15" fill="#1f3557" transform="rotate(-90 ${ox-12} ${oy+d*cs/2})">${d} squares</text></svg>`;
  return {q:area?`What is the <b>area</b> of this rug?`:`What is the <b>perimeter</b> of this rug?`,art:svg,right,opts:pzOpts(right,cands),unit:area?'squares':'units',
    why:area?`Area = length × width = ${w} × ${d} = <b>${A}</b> squares.`:`Perimeter = all 4 sides = ${w} + ${d} + ${w} + ${d} = <b>${P}</b>.`}}
function shopPuzzle(){const pool=INSIDE.filter(it=>!it.prize&&!it.ev);const kind=pzR(0,2);
  if(kind===0){const [a,b]=shuffle(pool.slice()).slice(0,2),sum=a.price+b.price;return {q:`How much do the <b>${esc(a.name)}</b> and the <b>${esc(b.name)}</b> cost together?`,art:pzItems([a,b]),right:sum,opts:pzOpts(sum,[sum+10,sum-10,sum+100,Math.abs(a.price-b.price)]),unit:'coins',why:`${a.price} + ${b.price} = <b>${sum}</b> coins.`}}
  if(kind===1){const [a,b]=shuffle(pool.slice()).slice(0,2),sum=a.price+b.price,have=Math.ceil((sum+pzR(20,180))/50)*50,left=have-sum;return {q:`You have <b>${have}</b> coins. You buy the <b>${esc(a.name)}</b> and the <b>${esc(b.name)}</b>. How many coins are left?`,art:pzItems([a,b]),right:left,opts:pzOpts(left,[left+10,left-10,have-a.price,left+100]),unit:'coins',why:`${a.price} + ${b.price} = ${sum}. Then ${have} − ${sum} = <b>${left}</b> coins left.`}}
  const a=pickR(pool),n=pzR(2,4),tot=a.price*n;return {q:`How much do <b>${n}</b> of the <b>${esc(a.name)}</b> cost?`,art:pzItems([a]),right:tot,opts:pzOpts(tot,[a.price+n,tot+a.price,tot-a.price,tot+10]),unit:'coins',why:`${n} × ${a.price} = <b>${tot}</b> coins.`}}
function pzItems(list){return `<div class="pzitems">${list.map(it=>`<div class="pzit"><span class="prev">${inThumb(it.id)}</span><b>${esc(it.name)}</b><small>${COIN_ICON} ${it.price}</small></div>`).join('')}</div>`}
function fracPuzzle(){const n=pickR([2,3,4,5,6,8]),k=pzR(1,n-1),c=pickR(['#2f9fe0','#e2558f','#38b98a','#ff9f43']);return {frac:true,n,k,c,q:`Pip wants to paint <b>${k}/${n}</b> of the wall. Tap the parts to paint them!`,why:`${k}/${n} means ${k} out of ${n} equal parts.`}}
function fracSVG(n,on,c){const W=300,H=150,w=W/n;return `<svg viewBox="-4 -4 ${W+8} ${H+8}" class="pzart pzwall" role="group" aria-label="A wall in ${n} equal parts">${Array.from({length:n},(_,i)=>`<rect class="pzpart" data-part="${i}" role="button" tabindex="0" aria-pressed="${on.has(i)}" aria-label="Part ${i+1}" x="${i*w}" y="0" width="${w}" height="${H}" fill="${on.has(i)?c:'#fff3dc'}" stroke="#1f3557" stroke-width="2.5"/>`).join('')}</svg>`}
function openPuzzle(type){
  const P=pzState(),T=PZ_TYPES.find(t=>t.id===type),pz=type==='rug'?rugPuzzle():type==='shop'?shopPuzzle():fracPuzzle();let tries=0;
  const head=`<div class="eyebrow" style="color:${T.color}">${T.name} · ${T.sub}</div>`;
  const finish=ok=>{
    P.by[type]=(P.by[type]||0)+(ok?1:0);if(tries===0)P.att[type]=(P.att[type]||0)+1;if(ok&&tries===0)P.first[type]=(P.first[type]||0)+1;let rew=0;
    if(ok){P.n++;if(!P.done[type]&&tries===0){P.done[type]=1;rew=PZ_REW;if(PZ_TYPES.every(t=>P.done[t.id]))rew+=PZ_ALL}else if(!P.done[type])P.done[type]=1}
    if(rew){G.coins+=rew;updateStats('#coinPill')}
    save();sWin();const unlocked=INSIDE.filter(it=>it.prize&&P.n===it.prize);
    $('#ocard').querySelector('.pzres').innerHTML=`<p class="pzok">${CHECK} ${pickR(['Great job!','You got it!','Super smart!','Perfect!'])}${rew?` <b>+${rew} coins</b>${rew>PZ_REW?' (all 3 puzzles today!)':''}`:''}</p>${unlocked.map(it=>`<p class="pzprize">New prize unlocked: <b>${esc(it.name)}</b>! Find it in the Home Shop.</p>`).join('')}<div class="actrow"><button type="button" class="go" id="pzMore">Another one</button><button type="button" class="go alt" id="pzDone">Done</button></div>`;
    $('#pzMore').onclick=()=>{closeOverlay();setTimeout(()=>openPuzzle(type),80)};$('#pzDone').onclick=()=>{closeOverlay();renderInside()};$('#pzMore').focus();
    if(unlocked.length)setTimeout(()=>burstAt($('#ocard'),90),150)};
  const wrong=()=>{if(tries===0){P.att[type]=(P.att[type]||0)+1;save(true)}tries++;sNo();$('#ocard').querySelector('.pzres').innerHTML=`<p class="pzno">Not quite! ${pz.why}</p>`};
  if(pz.frac){const on=new Set();
    overlay(`${head}<h3 class="pzq">${pz.q}</h3><div class="pzwrap">${fracSVG(pz.n,on,pz.c)}</div><p class="pzcount" aria-live="polite">Painted: <b>0/${pz.n}</b></p><div class="pzres" aria-live="polite"></div><div class="actrow"><button type="button" class="go" id="pzCheck">Check</button><button type="button" class="go alt" id="pzClose">Close</button></div>`,()=>{
      const draw=()=>{$('#ocard .pzwrap').innerHTML=fracSVG(pz.n,on,pz.c);$('#ocard .pzcount').innerHTML=`Painted: <b>${on.size}/${pz.n}</b>`;bind()};
      const bind=()=>$('#ocard').querySelectorAll('.pzpart').forEach(r=>{const tg=()=>{const i=+r.dataset.part;on.has(i)?on.delete(i):on.add(i);tone([523+on.size*40],.04);draw();const nr=$(`#ocard [data-part="${i}"]`);nr&&nr.focus({preventScroll:true})};r.onclick=tg;r.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();tg()}}});
      bind();$('#pzClose').onclick=closeOverlay;
      $('#pzCheck').onclick=()=>{if(on.size===pz.k){$('#pzCheck').remove();$('#pzClose').remove();finish(true)}else{wrong();$('#ocard .pzno').innerHTML+=` You painted ${on.size}/${pz.n}. Try again!`}}});
    return}
  overlay(`${head}<h3 class="pzq">${pz.q}</h3><div class="pzwrap">${pz.art}</div><div class="pzopts">${pz.opts.map(v=>`<button type="button" class="choice pzopt" data-v="${v}">${fmt(v)}${pz.unit==='coins'?' coins':''}</button>`).join('')}</div><div class="pzres" aria-live="polite"></div><div class="actrow"><button type="button" class="go alt" id="pzClose">Close</button></div>`,()=>{
    fitPreviews($('#ocard'));$('#pzClose').onclick=closeOverlay;
    $('#ocard').querySelectorAll('.pzopt').forEach(b=>b.onclick=()=>{if(+b.dataset.v===pz.right){b.classList.add('right');$('#ocard').querySelectorAll('.pzopt').forEach(x=>x.disabled=true);$('#pzClose').parentElement.remove();finish(true)}else{b.classList.add('wrong');b.disabled=true;wrong()}})});
}
function renderPuzzles(){
  const P=pzState(),el=$('#inPuzz');if(!el)return;const next=INSIDE.filter(it=>it.prize&&it.prize>P.n).sort((a,b)=>a.prize-b.prize)[0];
  el.innerHTML=PZ_TYPES.map(T=>`<button type="button" class="pzcard${P.done[T.id]?' done':''}" data-pz="${T.id}" style="--pc:${T.color}"><span class="pzico">${T.id==='rug'?'<svg viewBox="0 0 40 40"><rect x="5" y="9" width="30" height="22" rx="5" fill="#ffb3d1" stroke="#1f3557" stroke-width="2.5"/><path d="M15 9V31M25 9V31M5 20H35" stroke="#fff" stroke-width="2.5"/></svg>':T.id==='shop'?COIN_ICON:'<svg viewBox="0 0 40 40"><rect x="5" y="8" width="30" height="24" rx="3" fill="#fff3dc" stroke="#1f3557" stroke-width="2.5"/><rect x="5" y="8" width="15" height="24" fill="#2f9fe0" stroke="#1f3557" stroke-width="2.5"/></svg>'}</span><b>${T.name}</b><small>${T.sub}</small><span class="pztag">${P.done[T.id]?CHECK+' Done today':`+${PZ_REW} coins`}</span></button>`).join('')+
    `<div class="pzinfo"><b>${P.n}</b> home puzzle${P.n===1?'':'s'} solved${next?` · <b>${next.prize-P.n}</b> more to unlock the <b>${esc(next.name)}</b>`:' · all secret prizes unlocked!'}. Solve all 3 today for <b>+${PZ_ALL}</b> bonus coins.</div>`;
  el.querySelectorAll('[data-pz]').forEach(b=>b.onclick=()=>{tone([523,784]);openPuzzle(b.dataset.pz)});
}
$('#inBack').onclick=()=>{tone([523,392]);openHome()};


/* ===== calmer home: one "next up" block, one rewards card, no duplicates ===== */
let rwTab='';
function homeLayout(){
  const L=document.querySelector('.mapL'),pc=$('#pickCard');if(!L||!pc)return;
  let nu=$('#nextUp');
  /* Pip's speech stays in its own bubble above the plan, so changing tips never move the flight plan */
  if(!nu){nu=document.createElement('div');nu.id='nextUp';nu.className='nextup';pc.parentNode.insertBefore(nu,pc);nu.appendChild(pc)}
  let rw=$('#rewards');
  if(!rw){rw=document.createElement('div');rw.id='rewards';rw.className='rewards';rw.innerHTML='<div class="rwhead"><b>Rewards</b><div class="rwtabs" role="tablist" aria-label="Rewards"></div></div><div class="rwbody"></div>';
    const ev=$('#eventCard');ev.parentNode.insertBefore(rw,ev);const body=rw.querySelector('.rwbody');['eventCard','fgoalCard','goalCard','weekCard'].forEach(id=>{const e=$('#'+id);if(e)body.appendChild(e)})}
  const tabs=[['eventCard',CUR_EV?CUR_EV.name.replace(/ Party| Festival| Fest/,''):'Event'],['fgoalCard','Family goal'],['goalCard','My goal'],['weekCard','This week']].filter(([id])=>{const e=$('#'+id);return e&&!e.hidden&&e.innerHTML.trim()});
  if(!tabs.some(t=>t[0]===rwTab))rwTab=tabs[0]?tabs[0][0]:'';
  rw.hidden=!tabs.length;
  rw.querySelector('.rwtabs').innerHTML=tabs.map(([id,n])=>`<button type="button" role="tab" aria-selected="${id===rwTab}" data-rw="${id}">${esc(n)}</button>`).join('');
  ['eventCard','fgoalCard','goalCard','weekCard'].forEach(id=>{const e=$('#'+id);if(e)e.classList.toggle('rwoff',id!==rwTab)});
  rw.querySelectorAll('[data-rw]').forEach(b=>b.onclick=()=>{rwTab=b.dataset.rw;tone([523,659],.04);homeLayout()});
  const d=document.querySelector('#g-ch .isle[data-id="daily"]');if(d)d.classList.add('inplan');
}
/* phone bottom bar: the four sections + the map, always one tap away */
document.querySelectorAll('#bnav [data-go]').forEach(b=>{const id=b.dataset.go;if(id!=='map'){const sv=document.querySelector('#'+id+' svg');if(sv)b.insertAdjacentHTML('afterbegin',sv.outerHTML)}
  b.onclick=()=>{tone([523,784]);if(id==='map'){stopTimers();renderMap()}else $('#'+id).click()}});
/* the hint appears between the question and the answers, where the child is already looking */
$('#card').insertBefore($('#hint'),$('#choices'));
/* tip buttons first in the markup, so on phones they float right and the question wraps around them */
(()=>{const qt=document.querySelector('.qtop'),p=$('#prompt');qt.insertBefore($('#speakBtn'),p);qt.insertBefore($('#howBtn'),p)})();
document.addEventListener('click',e=>{const m=$('#tmenu');if(m&&!m.hidden&&!e.target.closest('.tmwrap')){m.hidden=true;$('#gearBtn').setAttribute('aria-expanded','false')}});
$('#bigBtn').onclick=()=>{G.settings.big=!G.settings.big;save();applySettings()};
$('#sound').onclick=e=>{soundOn=!soundOn;e.currentTarget.setAttribute('aria-pressed',soundOn);e.currentTarget.querySelector('.tval').textContent='Sounds: '+(soundOn?'on':'off')};
function musicLabel(){const b=$('#music');b.setAttribute('aria-pressed',musicOn);b.querySelector('.tval').textContent='Music: '+(musicOn?'on':'off')}
$('#music').onclick=()=>{musicOn=!musicOn;try{localStorage.setItem('pip-music',musicOn?'on':'off')}catch(e){}musicLabel();musicOn?musicStart():musicStop()};
musicLabel();
addEventListener('resize',()=>{if(parts.length){cv.width=innerWidth;cv.height=innerHeight}});

applySettings();boot();
/* installable app: offline cache + "Add to Home Screen" */
let installEvt=null;addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e});
const isStandalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
