/* Pip's Sky Islands: resources and Wonders. Coins still come from every right answer; resources come from what you
   learn, by subject, and build big Wonders on your island:
     stone (math), books (English), crystals (science), relics (history & geography), and rare golden bricks.
   Where they come from (quality, not quantity):
     - a finished mission: 2 + one for each first-try answer; the same island again and again on one day gives less
     - a mastered skill: 5 of its subject
     - an old mistake fixed for good at Fix-It Falls: a golden brick
   Wonders need a mix of subjects, so a child who loves math also wants books for the library.
   Never bought with money, never lost for a mistake, never traded between children. */
const RES={stone:{name:'stone',one:'stone',col:'#9aa5b5'},book:{name:'books',one:'book',col:'#2f9fe0'},crystal:{name:'crystals',one:'crystal',col:'#7b6cf0'},relic:{name:'relics',one:'relic',col:'#d9a441'},gold:{name:'golden bricks',one:'golden brick',col:'#ffc23d'}};
const RES_ICON={
  stone:'<svg viewBox="0 0 20 20" class="resi" aria-hidden="true"><path d="M3 14 L6 6 L13 4 L18 10 L15 16 L7 17Z" fill="#b8c1cf" stroke="#1f3557" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 8 l4 -1" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/></svg>',
  book:'<svg viewBox="0 0 20 20" class="resi" aria-hidden="true"><path d="M3 4 h6 q1 0 1 1 v12 q0 -1 -1 -1 h-6z M17 4 h-6 q-1 0 -1 1 v12 q0 -1 1 -1 h6z" fill="#7fc4f5" stroke="#1f3557" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  crystal:'<svg viewBox="0 0 20 20" class="resi" aria-hidden="true"><path d="M10 2 L16 8 L10 18 L4 8Z" fill="#b3a8ff" stroke="#1f3557" stroke-width="1.5" stroke-linejoin="round"/><path d="M4 8 H16 M10 2 L8 8 L10 18 L12 8Z" fill="none" stroke="#1f3557" stroke-width="1"/></svg>',
  relic:'<svg viewBox="0 0 20 20" class="resi" aria-hidden="true"><path d="M6 3 h8 l-1 3 q4 3 3 8 q-1 4 -6 4 q-5 0 -6 -4 q-1 -5 3 -8z" fill="#e8b866" stroke="#1f3557" stroke-width="1.5" stroke-linejoin="round"/><path d="M5 11 h10" stroke="#a0683a" stroke-width="1.4"/></svg>',
  gold:'<svg viewBox="0 0 20 20" class="resi" aria-hidden="true"><path d="M2 12 L6 7 H18 L14 12Z" fill="#ffe08a" stroke="#1f3557" stroke-width="1.4" stroke-linejoin="round"/><path d="M2 12 H14 V16 H2Z M14 12 L18 7 V11 L14 16Z" fill="#ffc23d" stroke="#1f3557" stroke-width="1.4" stroke-linejoin="round"/></svg>'};
const SUBJ_RES={math:'stone',ela:'book',science:'crystal',social:'relic'};
const resOf=id=>{const s=skillsOf(id)[0],k=s&&CONTENT.skills[s.k];return (k&&SUBJ_RES[k.subject])||'stone'};
const resHave=k=>((G&&G.res)||{})[k]||0;
const resChip=(k,n)=>`<span class="reschip">${RES_ICON[k]}<b>${fmt(n)}</b></span>`;
function resAdd(k,n,why){if(!n||!RES[k])return 0;G.res=Object.assign({stone:0,book:0,crystal:0,relic:0,gold:0},G.res||{});G.res[k]+=n;
  if(!G.resIntro){G.resIntro=1;setTimeout(()=>toast(`New: ${RES[k].name}!`,`You earn ${RES[k].name} from ${k==='gold'?'fixing old mistakes':'missions and mastered skills'}. Build <b>Wonders</b> on your island with them!`,'#7b6cf0'),1800)}
  else if(why)toast(`+${n} ${n===1?RES[k].one:RES[k].name}`,why,RES[k].col);
  return n}
/* ---------- before playing: what an island gives, and where a missing resource comes from ---------- */
const RES_FROM={stone:'math islands',book:'English islands',crystal:'science islands',relic:'history and geography islands',gold:'Fix-It Falls'};
/* missions on one island give less after 3 on the same day (see resForMission) */
const resTired=id=>!!(G&&G.resDay&&G.resDay.d===dayKey()&&(G.resDay.c[id]||0)>=3);
const resShown=()=>!!(G&&(G.res||PROJECTS.some(P=>P.res&&projStage(P.id))));
function resIslandFor(k){if(k==='gold'){const r=byId('review');return r&&reviewDue().length?r:null}
  const L=STAR_ISLANDS.filter(i=>i.gen&&!i.special&&!i.flash&&resOf(i.id)===k&&!(unlockOf(i.id)&&!isOpen(i.id)));
  const pk=pickToday();if(pk&&L.includes(pk)&&!resTired(pk.id))return pk;
  return L.filter(i=>!resTired(i.id)).sort((a,b)=>starFor(a.id)-starFor(b.id))[0]||L[0]||null}
function resNeedHTML(cost){const short=Object.entries(cost||{}).filter(([k,v])=>resHave(k)<v);if(!short.length)return '';
  return `<div class="resneed">${short.map(([k,v])=>{const i=resIslandFor(k),m=v-resHave(k);return `<span>${RES_ICON[k]} <b>${m} more ${m===1?RES[k].one:RES[k].name}</b> from ${RES_FROM[k]}${i?` <button type="button" class="linkbtn" data-resgo="${i.id}">Go to ${esc(i.name)}</button>`:k==='gold'?' (fix an old mistake for good)':''}</span>`}).join('')}</div>`}
function bindResGo(root){(root||document).querySelectorAll('[data-resgo]').forEach(b=>b.onclick=()=>{const i=byId(b.dataset.resgo);if(!i)return;renderMap();setTimeout(()=>openIsland(i),60)})}
/* the island card: the next star and what a round here gives */
function islRewardsHTML(isl){if(!isl.gen||isl.special)return '';const b=starFor(isl.id),L=skillsOf(isl.id),d=skillsDone(isl.id),k=resOf(isl.id),pk=pickToday(),x2=pk&&pk.id===isl.id;
  const star=b>=3?'All 3 stars! Keep them shining.':b===2?(starRaw(isl.id)>=3?`<b>3rd star</b>: master every skill here (${d} of ${L.length} done).`:`<b>3rd star</b>: a round with every puzzle right on the first try, and every skill here mastered (${d} of ${L.length}).`)
    :b===1?'<b>2nd star</b>: get 2 of every 3 puzzles right on the first try in one round.':'<b>1st star</b>: finish a round here.';
  const rows=[`<li>${starSVG(true)}<span>${star}</span></li>`,`<li>${COIN_ICON}<span>Coins for every right answer, more on the first try and in a row.${x2?' <b>×2 today</b> (Pip\'s Pick)!':''}</span></li>`];
  if(resShown())rows.push(`<li>${RES_ICON[k]}<span>${resTired(isl.id)?`This island is <b>tired today</b>: missions here give fewer ${RES[k].name}. Try another island!`:`Finish the mission: <b>${RES[k].name}</b> for your Wonders (more for golden answers). Master a skill: <b>+5</b>.`}</span></li>`);
  else rows.push(`<li>${RES_ICON[k]}<span>Finish the mission to earn your first resources for <b>Wonders</b>!</span></li>`);
  return `<ul class="isrew" aria-label="What you can earn here">${rows.join('')}</ul>`}
/* a finished mission */
function resForMission(islId,gold,n){const k=resOf(islId),day=dayKey();G.resDay=G.resDay&&G.resDay.d===day?G.resDay:{d:day,c:{}};
  const c=(G.resDay.c[islId]||0)+1;G.resDay.c[islId]=c;let a=2+Math.min(gold,8);if(c>3)a=Math.max(1,Math.ceil(a/3));
  resAdd(k,a);save(true);return {k,a}}
/* ---------- Wonders: big builds that need resources from different subjects ---------- */
const WONDERS=[
  {id:'w_library',name:'Floating Library',res:true,sky:true,scale:.62,pos:[262,80],stages:[['Cloud base',{stone:12}],['Bookshelves',{book:20,stone:8}],['Lantern tower',{book:20,crystal:6}],['Golden roof',{gold:2,book:10}]],
   draw:(x,y,n)=>{let o=`<ellipse cx="${x}" cy="${y+34}" rx="70" ry="16" fill="#fff" ${STK2}/><ellipse cx="${x-40}" cy="${y+28}" rx="26" ry="12" fill="#fff"/><ellipse cx="${x+42}" cy="${y+28}" rx="24" ry="11" fill="#fff"/>`;
     if(n>=3)o+=`<rect x="${x+22}" y="${y-62}" width="18" height="44" fill="#d9c8ff" ${STK2}/><circle cx="${x+31}" cy="${y-70}" r="9" fill="#ffd56b" ${STK2}/><circle class="hglow" cx="${x+31}" cy="${y-70}" r="15" fill="#ffd56b" opacity=".35"/>`;
     if(n>=2)o+=`<rect x="${x-46}" y="${y-22}" width="92" height="50" rx="4" fill="#fff5d6" ${STK2}/>`+[0,1].map(r=>`<rect x="${x-40}" y="${y-16+r*22}" width="80" height="16" fill="#8c5a2c"/>`+Array.from({length:12},(_,i)=>`<rect x="${x-38+i*6.4}" y="${y-14+r*22}" width="5" height="13" fill="${['#e2558f','#2f9fe0','#38b98a','#ffc23d','#7b6cf0','#ff6b57'][(i+r*2)%6]}"/>`).join('')).join('');
     if(n>=4)o+=`<path d="M${x-54} ${y-20} L${x} ${y-52} L${x+54} ${y-20}Z" fill="#ffc23d" ${STK2}/><path d="M${x-30} ${y-28} L${x} ${y-46}" stroke="#fff3c2" stroke-width="3" stroke-linecap="round"/>`;
     else if(n>=2)o+=`<path d="M${x-52} ${y-20} L${x} ${y-46} L${x+52} ${y-20}Z" fill="#c98a4b" ${STK2}/>`;
     return `<g class="hbob">${o}</g>`}},
  {id:'w_weather',name:'Weather Tower',res:true,pos:[590,238],stages:[['Stone base',{stone:15}],['Wind vane',{crystal:12,stone:8}],['Rain maker',{crystal:18,book:6}],['Rainbow light',{gold:2,crystal:10}]],
   draw:(x,y,n)=>{let o='';
     if(n>=4)o+=['#e2558f','#ffc23d','#38b98a','#2f9fe0'].map((c,i)=>`<path d="M${x-44+i*5} ${y-60} A${44-i*5} ${40-i*4} 0 0 1 ${x+44-i*5} ${y-60}" fill="none" stroke="${c}" stroke-width="4"/>`).join('');
     if(n>=2)o+=`<rect x="${x-6}" y="${y-118}" width="12" height="90" fill="#c0c8dc" ${STK2}/><path d="M${x} ${y-118} V${y-132}" stroke="#1f3557" stroke-width="2.5"/><path d="M${x-16} ${y-132} H${x+16} M${x+16} ${y-132} l-6 -5 M${x+16} ${y-132} l-6 5" stroke="#1f3557" stroke-width="2.5" stroke-linecap="round"/><g class="hspin" style="transform-origin:${x}px ${y-104}px">${[0,90,180,270].map(a=>`<path d="M${x} ${y-104} l13 -4 l0 8z" fill="#7b6cf0" ${STK2} transform="rotate(${a} ${x} ${y-104})"/>`).join('')}</g>`;
     if(n>=3)o+=`<rect x="${x+12}" y="${y-74}" width="34" height="24" rx="5" fill="#7c8fb8" ${STK2}/><ellipse cx="${x+29}" cy="${y-86}" rx="18" ry="9" fill="#fff" ${STK2}/>`+[0,1,2].map(i=>`<path d="M${x+20+i*9} ${y-46} v6" stroke="#2f9fe0" stroke-width="3" stroke-linecap="round"/>`).join('');
     o+=`<path d="M${x-28} ${y} L${x-20} ${y-30} H${x+20} L${x+28} ${y}Z" fill="#b8c1cf" ${STK2}/><path d="M${x-22} ${y-12} H${x+22}" stroke="#8a95a8" stroke-width="2"/>`;
     if(n>=4)o+=`<path d="M${x} ${y-150} L${x+7} ${y-140} L${x} ${y-128} L${x-7} ${y-140}Z" fill="#b3a8ff" ${STK2}/><circle class="hglow" cx="${x}" cy="${y-140}" r="13" fill="#b3a8ff" opacity=".4"/>`;
     return o}},
  {id:'w_museum',name:'History Museum',res:true,pos:[92,252],stages:[['Columns',{stone:15,relic:6}],['Exhibit hall',{relic:18,book:8}],['Great map',{relic:18,crystal:6}],['Golden dome',{gold:2,relic:10}]],
   draw:(x,y,n)=>{let o='';
     if(n>=4)o+=`<path d="M${x-26} ${y-70} A26 24 0 0 1 ${x+26} ${y-70}Z" fill="#ffc23d" ${STK2}/><path d="M${x} ${y-94} V${y-104}" stroke="#1f3557" stroke-width="2.5"/><circle cx="${x}" cy="${y-106}" r="3" fill="#ffc23d" ${STK2}/>`;
     if(n>=2)o+=`<rect x="${x-44}" y="${y-62}" width="88" height="52" fill="#fff5d6" ${STK2}/><rect x="${x-34}" y="${y-50}" width="18" height="14" fill="#e8b866" ${STK2}/><rect x="${x+16}" y="${y-50}" width="18" height="14" fill="#9ad08a" ${STK2}/>`;
     o+=`<rect x="${x-52}" y="${y-10}" width="104" height="10" fill="#d8dee8" ${STK2}/>`+[-36,-12,12,36].map(d=>`<rect x="${x+d-5}" y="${y-60}" width="10" height="50" fill="#eef1f6" ${STK2}/>`).join('');
     o+=`<path d="M${x-54} ${y-60} L${x} ${y-84} L${x+54} ${y-60}Z" fill="#d8dee8" ${STK2}/>`;
     if(n>=3)o+=`<rect x="${x-14}" y="${y-76}" width="28" height="12" fill="#f6e7c4" stroke="#a8844a" stroke-width="1.5"/><path d="M${x-10} ${y-68} q6 -6 10 0 t10 -2" fill="none" stroke="#c0392b" stroke-width="1.5" stroke-dasharray="2 2"/>`;
     return o}}
];
PROJECTS.push(...WONDERS);
const projCost=nx=>nx&&typeof nx.price==='object'?nx.price:null;
const canAffordRes=cost=>Object.entries(cost).every(([k,v])=>resHave(k)>=v);
function resPay(cost){G.res=Object.assign({},G.res);Object.entries(cost).forEach(([k,v])=>{G.res[k]-=v})}
function resBarHTML(){return `<div class="resbar"><b>Your resources</b>${Object.keys(RES).map(k=>resChip(k,resHave(k))).join('')}<small>Earn them by finishing missions (golden answers give more), mastering skills and fixing old mistakes.</small></div>`}
