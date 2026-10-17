/* Pip's Sky Islands: challenge a friend. After a round, the same puzzles go to a friend:
   - as a link (shared by the family: Messages, email...), or to a brother or sister on this device
   - the friend plays exactly the same puzzles and sees both scores at the end
   No chat, no accounts needed, nothing stored on a server: the link itself carries the puzzles
   (island, question type, seed and difficulty) and, if the child wants, their first name. */
const CH_MAX=12;
const b64u={enc:s=>btoa(unescape(encodeURIComponent(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''),
  dec:s=>decodeURIComponent(escape(atob(String(s).replace(/-/g,'+').replace(/_/g,'/'))))};
function chEncode(ch){return b64u.enc(JSON.stringify(ch))}
/* a challenge from a link is checked before it is used: only known islands and question types, sensible numbers */
function chDecode(code){try{const c=JSON.parse(b64u.dec(code));if(!c||c.v!==1||!Array.isArray(c.q)||!c.q.length||c.q.length>CH_MAX)return null;
  const q=c.q.filter(x=>Array.isArray(x)&&typeof x[0]==='string'&&Number.isInteger(x[1])&&Number.isInteger(x[2])&&[1,2,3].includes(x[3])).map(x=>[x[0].slice(0,20),x[1],x[2],x[3]]);
  if(q.length!==c.q.length)return null;
  return {v:1,g:String(c.g||'').slice(0,12),i:String(c.i||'').slice(0,20),n:String(c.n||'').replace(/[<>]/g,'').slice(0,16),sc:Math.max(0,Math.min(q.length,+c.sc|0)),q,from:c.from?String(c.from).slice(0,40):''}}catch(e){return null}}
/* the round that just ended, as a challenge (normal island rounds only) */
function chFromRound(){if(!S||S.mode!=='island'||S.chapter!=null||!S.qs.length||S.qs.some(q=>!q.meta))return null;
  return {v:1,g:PACK.id,i:S.isl.id,n:G.name||'',sc:S.score,q:S.qs.map(q=>[q.meta.i,q.meta.t,q.meta.s,q.meta.d||2])}}
const chLink=ch=>location.origin+location.pathname.replace(/index\.html$/,'')+'?ch='+chEncode(ch);
const chWho=ch=>ch.n?esc(ch.n):'A friend';
/* ---------- sending ---------- */
function chOffer(){const ch=chFromRound();if(!ch)return;const sibs=Object.entries(ROOT.profiles).filter(([id,p])=>id!==ROOT.current&&!p.roster&&(p.pack||PACK_DEFAULT)===PACK.id);
  overlay(`<div class="pipbob" data-fox></div><div class="eyebrow">Challenge a friend</div><h2>Can they beat ${ch.sc} of ${ch.q.length}?</h2>
    <p>Your friend gets these <b>same ${ch.q.length} puzzles</b> on ${esc(S.isl.name)} and sees both scores at the end.</p>
    ${sibs.length?`<div class="chsibs"><b>Someone on this device:</b>${sibs.map(([id,p])=>`<button type="button" class="go small leaf" data-chsib="${id}">${esc(p.name||'Player')}</button>`).join('')}</div>`:''}
    <label class="limchk"><input type="checkbox" id="chName" ${G.name?'checked':''}> Show my name${G.name?` (${esc(G.name)})`:''}<small>Only your first name or nickname, nothing else.</small></label>
    <div class="btnrow"><button class="go" type="button" id="chShare">Send a link</button><button class="go alt small" type="button" id="chNo">Not now</button></div>
    <p class="note" id="chNote" role="status"></p>`);
  const pack=()=>Object.assign({},ch,{n:$('#chName').checked?ch.n:''});
  document.querySelectorAll('[data-chsib]').forEach(b=>b.onclick=()=>{const p=ROOT.profiles[b.dataset.chsib];if(!p)return;
    const ch2=Object.assign(pack(),{n:G.name||'',from:ROOT.current});touchKid(b.dataset.chsib,q=>{q.chIn=[...(q.chIn||[]).slice(-4),ch2]});
    closeOverlay();toast('Challenge sent!',`${esc(p.name||'They')} will see it on the map.`,'#38b98a')});
  $('#chShare').onclick=async()=>{const url=chLink(pack()),txt=`${pack().n||'I'} got ${ch.sc} of ${ch.q.length} on ${S.isl.name} in Pip's Sky Islands. Can you beat it?`;
    try{if(navigator.share){await navigator.share({title:"A Pip's Sky Islands challenge",text:txt,url});closeOverlay();return}}catch(e){if(e&&e.name==='AbortError')return}
    let copied=false;try{await navigator.clipboard.writeText(url);copied=true}catch(e){}
    const n=$('#chNote');n.className='note ok';n.innerHTML=`${copied?'Link copied! Paste it in a message to your friend\'s family.':'Copy this link and send it to your friend\'s family:'}<input class="chlink" readonly value="${esc(url)}">`;
    const i=n.querySelector('input');i.onclick=()=>i.select();if(!copied)i.select()};
  $('#chNo').onclick=closeOverlay}
/* ---------- receiving ---------- */
/* a link opened the game: keep the challenge until a player is on the map */
(function chCatch(){try{const m=/[?&]ch=([A-Za-z0-9_-]{10,3000})/.exec(location.search);if(!m)return;localStorage.setItem('pip-ch-link',m[1]);
  history.replaceState(null,'',location.pathname+location.search.replace(/[?&]ch=[^&]*/,'').replace(/^&/,'?')+location.hash)}catch(e){}})();
function chPending(){const L=(G.chIn||[]).slice();let link=null;try{link=localStorage.getItem('pip-ch-link')}catch(e){}if(link){const c=chDecode(link);if(c)L.unshift(Object.assign(c,{link:1}))}return L}
function chDrop(ch){if(ch.link){try{localStorage.removeItem('pip-ch-link')}catch(e){}}else{G.chIn=(G.chIn||[]).filter(x=>x!==ch&&JSON.stringify(x.q)!==JSON.stringify(ch.q));save(true)}}
let chSnooze=false;
function chIncoming(){if(curScreen!=='map'||ovOpen||(typeof TR!=='undefined'&&TR.on))return;
  const res=(G.chRes||[])[0];if(res){G.chRes=G.chRes.slice(1);save(true);
    const won=res.sc>res.their,tie=res.sc===res.their;
    return overlay(`<div class="pipbob" data-fox></div><div class="eyebrow">Challenge result</div><h2>${esc(res.n||'Your friend')} ${won?'beat your challenge!':tie?'tied with you!':'tried your challenge!'}</h2><p>${esc(res.n||'They')}: <b>${res.sc} of ${res.of}</b>. You: <b>${res.their} of ${res.of}</b>.${won?' Want a rematch?':' Nice work!'}</p><button class="go" type="button" style="align-self:center" onclick="closeOverlay()">OK</button>`)}
  const ch=chSnooze?null:chPending()[0];if(!ch)return;
  const P=CONTENT.packs[ch.g];if(ch.g&&ch.g!==PACK.id){chDrop(ch);return overlay(`<div class="pipbob" data-fox></div><div class="eyebrow">A challenge</div><h2>${chWho(ch)} sent a challenge</h2><p>It is for <b>${P?esc(P.stateName+', '+GRADE_WORD(P.grade).toLowerCase()):'another grade'}</b>, and you are playing ${esc(PACK.stateName+', '+GRADE_WORD(PACK.grade).toLowerCase())}, so these puzzles would not fit. Try sending one back from your grade!</p><button class="go" type="button" style="align-self:center" onclick="closeOverlay()">OK</button>`)}
  const home=byId(ch.i);if(!home||ch.q.some(x=>!byId(x[0])||x[1]>=byId(x[0]).types)){chDrop(ch);return}
  overlay(`<div class="pipbob" data-fox></div><div class="eyebrow">A challenge for you!</div><h2>${chWho(ch)} challenges you!</h2><p><b>${ch.q.length} puzzles</b> on ${esc(home.name)}. ${chWho(ch)} got <b>${ch.sc} of ${ch.q.length}</b> right on the first try. Can you beat it?</p><div class="btnrow"><button class="go" type="button" id="chGo">Accept the challenge</button><button class="go alt small" type="button" id="chLater">Later</button></div>`,()=>sWin());
  $('#chGo').onclick=()=>{closeOverlay();chDrop(ch);limitGate(()=>chStart(ch))||chStart(ch)};
  $('#chLater').onclick=()=>{closeOverlay();chSnooze=true; // asked again next time the game opens
    if(ch.link){try{localStorage.removeItem('pip-ch-link')}catch(e){}const k=Object.assign({},ch);delete k.link;G.chIn=[...(G.chIn||[]).slice(-4),k];save(true)}}}
function chStart(ch){const home=byId(ch.i);const qs=ch.q.map(([i,t,s,d])=>{const isl=byId(i),q=makeQ(isl,t,s,d);if(isl.id!==home.id)q.from=isl.name;return q});
  beginRound(home,'island',qs);S.chal=ch;say($('#say'),`${chWho(ch)}'s challenge! ${ch.q.length} puzzles. ${chWho(ch)} got ${ch.sc}. Let's go!`)}
/* the end of a challenge round: both scores, and the result goes back to a brother or sister on this device */
function chDone(){const ch=S&&S.chal;if(!ch)return '';const me=S.score,of=S.qs.length,won=me>ch.sc,tie=me===ch.sc;
  if(ch.from&&ROOT.profiles[ch.from]&&ch.from!==ROOT.current){const r={n:G.name||'',sc:me,their:ch.sc,of};touchKid(ch.from,p=>{p.chRes=[...(p.chRes||[]).slice(-4),r]})}
  return `<span class="chres ${won?'won':tie?'tie':''}"><b>You: ${me} of ${of}</b> · ${chWho(ch)}: ${ch.sc} of ${of}. ${won?'You won the challenge!':tie?"It's a tie!":`${chWho(ch)} wins this time. Try again!`}</span> `}
