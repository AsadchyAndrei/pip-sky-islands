/* Pip's Sky Islands: Pip's own voice (Google "Puck", a studio-quality voice) instead of the device voice.
   - Pip's everyday lines (praise, hints, nudges, the tour...) come with the game as small MP3 files (voice/pack.json):
     they play at once and work without internet.
   - Anything else (each question, explanations, pop-ups) is made on our server the first time it is needed and kept,
     so the next child hears it at once. The service worker keeps what this device heard, for offline play.
   - A child's name is never sent: names are taken out of the text first ("Great job, Alisa!" → "Great job!").
   - No internet, the server is busy, or the parent picked a device voice: the device voice reads it, as before.
   Played through Web Audio (the music's audio context), so it works on iPhones after the first tap and the music
   gets quieter while Pip talks. */
const PV={url:'https://us-central1-pip-sky-islands.cloudfunctions.net/tts',pack:null,q:[],cur:null,gen:0,down:0,buf:new Map()};
const pvOn=()=>typeof G!=='undefined'&&G&&G.settings&&G.settings.pv!==false&&!!(window.AudioContext||window.webkitAudioContext)&&typeof fetch==='function';
const canTalk=()=>canSpeak||pvOn();
/* the pack of Pip's everyday lines that comes with the game */
function pvLoadPack(){if(PV.pack||PV.loading)return;PV.loading=fetch('voice/pack.json').then(r=>r.ok?r.json():null).then(j=>{PV.pack=(j&&j.lines)||{}}).catch(()=>{PV.pack={}}).finally(()=>{PV.loading=null})}
/* names out. The player's own name goes (or becomes "you"/"your"); anyone else's (a brother or sister on this device,
   a friend from a challenge, the teacher) becomes "your friend" / "your teacher". */
function pvNames(){const L=[],add=(n,w)=>{n=String(n||'').trim();if(n.length>1&&!L.some(x=>x[0].toLowerCase()===n.toLowerCase()))L.push([n,w])};
  try{add(G&&G.name,'');if(typeof CL!=='undefined'&&CL.userDoc)add(CL.userDoc.teacherName,'your teacher');
    if(typeof S!=='undefined'&&S&&S.chal)add(S.chal.n,'your friend');Object.values(ROOT.profiles||{}).forEach(p=>p&&add(p.name,'your friend'))}catch(e){}
  return L.sort((a,b)=>b[0].length-a[0].length)}
function pvText(txt){let t=' '+String(txt||'')+' ';const B='(?=[\\s!?.,:;"”)]|$)',A='(^|[\\s"“(])';
  pvNames().forEach(([nm,w])=>{const e=nm.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    if(w)t=t.replace(new RegExp(`${A}${e}(['’]s)?${B}`,'gi'),(m,p,s)=>p+w+(s||''));
    else t=t.replace(new RegExp(`,\\s*${e}${B}`,'gi'),'').replace(new RegExp(`${A}${e}['’]s${B}`,'gi'),'$1your').replace(new RegExp(`${A}${e},?${B}`,'gi'),'$1')});
  return t.replace(/\s+([!?.,;:])/g,'$1').replace(/,([!?.])/g,'$1').replace(/([!?.])\s*,/g,'$1').replace(/^\s*[,!.]\s*/,'').replace(/\s+/g,' ').trim()}
function pvSrc(t){const f=PV.pack&&PV.pack[t];if(f)return {url:'voice/'+f,packed:true};
  if(navigator.onLine===false||Date.now()<PV.down||t.length>900)return null;return {url:PV.url+'?t='+encodeURIComponent(t),packed:false}}
/* returns false when Pip's voice cannot read this, so the device voice reads it instead */
/* long texts (a whole reading passage) go in pieces of a few sentences: each piece is made and kept once, and the next
   piece is fetched while the current one plays */
function pvChunks(t,max=500){if(t.length<=max)return [t];const out=[];let cur='';
  for(const s of t.split(/(?<=[.!?]["”']?)\s+/)){if(cur&&(cur+' '+s).length>max){out.push(cur);cur=s}else cur=cur?cur+' '+s:s}
  if(cur)out.push(cur);return out.flatMap(c=>c.length>900?c.match(/.{1,880}(\s|$)/g).map(x=>x.trim()):[c])}
function pvSpeak(txt,o={}){if(!pvOn())return false;pvLoadPack();const t=pvText(txt);if(!t||!/[a-z0-9]/i.test(t))return false;
  const parts=pvChunks(t),srcs=parts.map(pvSrc);if(srcs.some(x=>!x))return false;
  if(!o.queue)pvStop();parts.forEach((p,i)=>PV.q.push({t:p,src:srcs[i],o:i?Object.assign({},o,{queue:true,pip:false}):o}));if(!PV.cur)pvNext();return true}
function pvFetch(src){if(PV.buf.has(src.url))return Promise.resolve(PV.buf.get(src.url));
  const ac=new AbortController(),tm=setTimeout(()=>ac.abort(),src.packed?8000:7000);
  return fetch(src.url,{signal:ac.signal}).then(r=>{if(!r.ok)throw new Error('voice '+r.status);return r.arrayBuffer()}).then(b=>new Promise((ok,no)=>{const p=ctx().decodeAudioData(b,ok,no);if(p&&p.then)p.then(ok,no)}))
    .then(a=>{clearTimeout(tm);if(PV.buf.size>40)PV.buf.delete(PV.buf.keys().next().value);PV.buf.set(src.url,a);return a})}
function pvTalking(on){const b=document.getElementById('speakBtn');if(b)b.classList.toggle('on',on);setDuck(on?.3:1)}
function pvNext(){const it=PV.q.shift();if(!it){PV.cur=null;pvTalking(false);return}
  const g=PV.gen;PV.cur=it;pvTalking(true);if(it.o.pip&&!it.o.queue)tone([1046,1568],.045,'sine');
  pvFetch(it.src).then(a=>{if(g!==PV.gen)return;const s=actx.createBufferSource();s.buffer=a;s.connect(actx.destination);it.node=s;
      s.onended=()=>{if(g===PV.gen&&PV.cur===it)pvNext()};s.start();const nx=PV.q[0];if(nx&&!PV.buf.has(nx.src.url))pvFetch(nx.src).catch(()=>{})})
    .catch(()=>{if(g!==PV.gen)return;
      /* the server could not answer: the device voice reads this and what is waiting, and we try the server again in a minute */
      if(!it.src.packed)PV.down=Date.now()+60000;const rest=[it,...PV.q];PV.q=[];PV.cur=null;pvTalking(false);
      rest.forEach((x,i)=>deviceSpeak(x.t,{user:true,queue:i>0}))})}
function pvStop(){PV.gen++;PV.q=[];const c=PV.cur;PV.cur=null;if(c&&c.node)try{c.node.onended=null;c.node.stop()}catch(e){}if(c)pvTalking(false)}
const pvBusy=()=>!!PV.cur;
/* warm up: the next question is fetched while the child reads this one */
function pvPrefetch(html){if(!pvOn()||typeof G==='undefined'||!G.settings.read)return;const t=pvText(htmlToSpeech(html)),src=t&&pvSrc(t);if(src&&!PV.buf.has(src.url))pvFetch(src).catch(()=>{})}
