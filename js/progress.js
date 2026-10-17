/* Pip's Sky Islands: Saving, profiles, skills, sound, rewards, lessons, Pip's Pick, daily limits. Loaded in order by index.html; all files share one global scope. */
/* ================= save data, profiles, cloud ================= */
/* Three layers keep progress safe: 1) this device (localStorage, written on every change),
   2) Firestore offline queue (survives no-internet), 3) the cloud copy + one backup per day (30 days).
   Profiles from different devices are MERGED, never overwritten: stars/xp/stickers only go up, coins are
   counted per device, purchases are unioned. Only an explicit Reset or Restore (resetAt) replaces data. */
const ROOT_KEY='pip-sky-islands-v3';
const DEF_SETTINGS={goal:'min20',read:false,big:false,dys:false,diff:'auto',voice:'',pv:true,vstyle:'fox',talk:false,sv:2};
const DEF={name:'',best:{},xp:0,hats:['none'],balloons:['classic'],pets:['none'],home:{house:0,items:{},pos:{},hidden:{}},events:{},baskets:['classic'],basket:'classic',glasses:['none'],glass:'none',decos:['none'],deco:'none',chars:['fox'],charColor:{},char:'fox',hat:'none',balloon:'classic',pet:'none',badges:[],dstreak:0,lastDaily:'',visited:{},bestThunder:0,bestCombo:0,greeted:'',
  diff:{},hardMaster:{},stats:{},days:{},wrongLog:[],review:[],fixed:0,fixedSeeds:[],stickers:{},setsDone:{},story:{ch:0,seen:{}},weeks:{},weekRewarded:'',goalDone:'',kidPin:'',cdev:{},_u:0,resetAt:0,settings:{...DEF_SETTINGS}};
const clone=o=>o===undefined?undefined:JSON.parse(JSON.stringify(o));
const freshRaw=()=>clone(DEF);
let DEV='';try{DEV=localStorage.getItem('pip-dev')||'';if(!DEV){DEV='d'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);localStorage.setItem('pip-dev',DEV)}}catch(e){DEV=DEV||'d'+Math.random().toString(36).slice(2,10)}
/* coins = sum over devices of (earned - spent); each device only ever raises its own two counters, so merging is just "max" */
function attachCoins(g){
  if(!g.cdev||typeof g.cdev!=='object'||Array.isArray(g.cdev))g.cdev={};
  Object.defineProperty(g,'coins',{configurable:true,enumerable:false,
    get(){let t=0;for(const k in this.cdev){const c=this.cdev[k]||{};t+=(+c.e||0)-(+c.s||0)}return Math.max(0,Math.round(t))},
    set(v){const d=Math.round(v)-this.coins;if(!d)return;const c=this.cdev[DEV]||(this.cdev[DEV]={e:0,s:0});if(d>0)c.e+=d;else c.s+=-d;try{const k=dayKey(),ds=this.days||(this.days={}),t=ds[k]||(ds[k]={sec:0,q:0,c:0});if(d>0)t.e=(t.e||0)+d;else t.s=(t.s||0)-d}catch(x){}}});
  return g}
/* keep at most 3 waiting mistakes per kind of puzzle (most practiced first), so the list stays doable */
function trimReview(a){const by=new Map();for(const r of a){const k=r.i+'|'+r.t;if(!by.has(k))by.set(k,[]);by.get(k).push(r)}const keep=new Set();
  for(const l of by.values())l.slice().sort((x,y)=>(y.box||0)-(x.box||0)||String(x.s).localeCompare(String(y.s))).slice(0,3).forEach(r=>keep.add(r));return a.filter(r=>keep.has(r))}
function normalizeProfile(p){
  p=p?clone(p):{};const legacy=p.coins;delete p.coins;
  const g=Object.assign(freshRaw(),p);
  if(!g.cdev||typeof g.cdev!=='object'||Array.isArray(g.cdev))g.cdev={};
  if(typeof legacy==='number'&&legacy>0&&!Object.keys(g.cdev).length)g.cdev.legacy={e:legacy,s:0};
  g.settings=Object.assign({...DEF_SETTINGS},g.settings||{});if((g.settings.sv||0)<2){g.settings.talk=false;g.settings.read=false;g.settings.sv=2}
  g.story=Object.assign({ch:0,seen:{}},g.story||{});if(g.placed==null&&(g.xp||0)>0)g.placed=1;g.home=Object.assign({house:0,items:{},pos:{},hidden:{}},g.home||{});
  for(const k of ['review','wrongLog','fixedSeeds','badges'])if(!Array.isArray(g[k]))g[k]=[];
  g.review=trimReview(g.review);
  if(g.sk)g.sk=skLegacy(g.sk);
  if(!g.pack)g.pack=PACK_DEFAULT;if(!g.grades||typeof g.grades!=='object')g.grades={};
  return attachCoins(g)}
/* skill progress used to be saved under "island:number" keys; now under the skill's id from the library */
const SK_LEGACY=Object.fromEntries(Object.values(CONTENT.skills).filter(s=>s.legacy).map(s=>[s.legacy,s.id]));
function skLegacy(sk){let o=null;for(const k in sk){const n=SK_LEGACY[k];if(!n)continue;o=o||Object.assign({},sk);if(!(n in o)||String(sk[k]).length>String(o[n]).length)o[n]=sk[k];delete o[k]}return o||sk}
const freshProfile=()=>normalizeProfile(null);
/* stable string (sorted keys and arrays) to compare two profiles */
function stable(o){if(Array.isArray(o))return '['+o.map(stable).sort().join(',')+']';if(o&&typeof o==='object')return '{'+Object.keys(o).sort().map(k=>JSON.stringify(k)+':'+stable(o[k])).join(',')+'}';return JSON.stringify(o)}
function deepMax(a,b){
  if(a===undefined)return clone(b);if(b===undefined)return clone(a);
  if(Array.isArray(a)&&Array.isArray(b)){const out=clone(a),seen=new Set(a.map(x=>JSON.stringify(x)));for(const x of b){const k=JSON.stringify(x);if(!seen.has(k)){seen.add(k);out.push(clone(x))}}return out}
  if(a&&b&&typeof a==='object'&&typeof b==='object'&&!Array.isArray(a)&&!Array.isArray(b)){const o={};for(const k of new Set([...Object.keys(a),...Object.keys(b)]))o[k]=deepMax(a[k],b[k]);return o}
  if(typeof a==='number'&&typeof b==='number')return Math.max(a,b);
  if(typeof a==='string'&&typeof b==='string')return a>b?a:b;
  if(typeof a==='boolean'&&typeof b==='boolean')return a||b;
  return clone(a)}
/* fields where the most recent choice wins (what Pip wears, settings, difficulty...) */
const LATEST=['pack','name','char','hat','balloon','pet','basket','glass','deco','wish','pickDay','charColor','settings','diff','wrongLog','kidPin','greetedName','saveGoal','roll','deck'];
function mergeProfiles(a,b){
  if(!a&&!b)return freshProfile();if(!a)return normalizeProfile(b);if(!b)return normalizeProfile(a);
  a=normalizeProfile(a);b=normalizeProfile(b);
  const ra=a.resetAt||0,rb=b.resetAt||0;if(ra!==rb)return normalizeProfile(ra>rb?a:b);
  const ua=a._u||0,ub=b._u||0,aNew=ua>ub||(ua===ub&&stable(a)>=stable(b));
  const nw=aNew?a:b,ol=aNew?b:a;
  const o=deepMax(nw,ol);
  for(const k of LATEST)o[k]=k in nw?clone(nw[k]):clone(ol[k]);
  o.home=Object.assign({},o.home,{pos:clone((nw.home&&nw.home.pos)||(ol.home&&ol.home.pos)||{}),hidden:clone((nw.home&&nw.home.hidden)||(ol.home&&ol.home.hidden)||{})});if((nw.home&&nw.home.inside)||(ol.home&&ol.home.inside))o.home.inside=clone((nw.home&&nw.home.inside)||ol.home.inside); // island layout and storage: newest arrangement wins
  const la=a.lastDaily||'',lb=b.lastDaily||'',st=la===lb?((a.dstreak||0)>=(b.dstreak||0)?a:b):(la>lb?a:b);o.lastDaily=st.lastDaily;o.dstreak=st.dstreak;
  const fixed=new Set(o.fixedSeeds);o.fixedSeeds=o.fixedSeeds.slice(-400);
  const rv=new Map();for(const r of ol.review)rv.set(r.s,r);for(const r of nw.review)rv.set(r.s,r);
  o.review=trimReview([...rv.values()].filter(r=>!fixed.has(r.s)).slice(-200).map(clone));
  return normalizeProfile(o)}
const sameProfile=(a,b)=>stable(normalizeProfile(a))===stable(normalizeProfile(b));

let ROOT={profiles:{},current:'',pin:'',ts:0},G=freshProfile();
function readGuestRoot(){
  let r=null;try{r=JSON.parse(localStorage.getItem(ROOT_KEY)||'null')}catch(e){}
  if(!r||!r.profiles){
    let old=null;try{old=JSON.parse(localStorage.getItem('pip-sky-islands-v2')||'null')}catch(e){}
    if(!old){try{const v1=JSON.parse(localStorage.getItem('pip-sky-islands-v1')||'null');if(v1)old={best:v1}}catch(e){}}
    r={profiles:old?{p1:old}:{},current:old?'p1':'',pin:'',ts:0};
  }
  for(const k in r.profiles)r.profiles[k]=normalizeProfile(r.profiles[k]);
  if(!r.profiles[r.current])r.current=Object.keys(r.profiles)[0]||'';
  return r}
const hasProgress=p=>p&&(p.xp>0||p.coins>0||Object.keys(p.best||{}).length>0);
function prune(){const cut=(()=>{const d=new Date();d.setDate(d.getDate()-120);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`})();for(const p of Object.values(ROOT.profiles)){for(const k in p.days)if(k<cut)delete p.days[k];for(const k in p.weeks)if(k<cut)delete p.weeks[k]}}

/* ---- cloud state ---- */
const CL={mode:'guest',uid:'',email:'',provider:'',verified:true,remote:{},synced:false,dirty:{},t:0,tAt:0,last:0,busy:false,pending:false,waiting:0,state:'',unsub:null,userDoc:{},unlockUntil:0,api:null};
const cacheKey=()=>'pip-cloud-'+CL.uid;
function persistLocal(){if(!CL.loaded)return;const key=CL.mode==='guest'?ROOT_KEY:cacheKey();
  try{const old=JSON.parse(localStorage.getItem(key)||'null'); // another tab may have saved meanwhile: keep its work too
    if(old&&old.profiles){ROOT.gone=Object.assign({},old.gone||{},ROOT.gone||{});for(const id in old.profiles){if(ROOT.gone[id]||id===ROOT.current)continue;const o=old.profiles[id],mine=ROOT.profiles[id];
      if(!mine)ROOT.profiles[id]=normalizeProfile(o);else if((o._u||0)>(mine._u||0))ROOT.profiles[id]=mergeProfiles(mine,o)}}}catch(e){}
  try{localStorage.setItem(key,JSON.stringify(ROOT));if(CL.mode!=='guest')localStorage.setItem('pip-last-uid',CL.uid)}catch(e){}}
function save(quiet){if(!ROOT.current)return;G._u=Date.now();ROOT.ts=G._u;ROOT.profiles[ROOT.current]=G;persistLocal();if(CL.mode==='cloud'){CL.dirty[ROOT.current]=1;cloudSchedule(quiet?30000:3000)}else setSync()}
function cloudSchedule(delay){if(CL.mode!=='cloud')return;const wait=Math.max(delay,CL.last+15000-Date.now());const at=Date.now()+wait;if(CL.t&&CL.tAt<=at)return;clearTimeout(CL.t);CL.tAt=at;CL.t=setTimeout(cloudPush,wait);setSync()}
function cloudFlush(){if(CL.mode!=='cloud')return;clearTimeout(CL.t);CL.t=0;cloudPush()}
async function cloudPush(){
  CL.t=0;if(CL.mode!=='cloud')return;
  if(!CL.synced){if(Object.keys(CL.dirty).length)cloudSchedule(5000);return} // never write before we have seen the server copy
  if(CL.busy){CL.pending=true;return}
  const ids=Object.keys(CL.dirty);CL.dirty={};if(!ids.length){setSync();return}
  CL.busy=true;CL.last=Date.now();
  for(const id of ids){const local=ROOT.profiles[id];if(!local)continue;const rem=CL.remote[id];
    if(rem&&rem.deleted){dropKid(id);continue}
    const merged=mergeProfiles(local,rem&&rem.p);
    if(rem&&rem.p&&sameProfile(merged,rem.p))continue;
    CL.remote[id]={p:merged,ts:Date.now()};CL.waiting++;
    let pr;try{pr=CL.api.saveKid(id,{data:JSON.stringify(merged),name:(merged.name||'Player').slice(0,16),ts:Date.now(),v:1})}catch(e){pr=Promise.reject(e)}
    pr.then(()=>{CL.waiting--;CL.err='';setSync();saveDigest(id,local)},e=>{CL.waiting--;CL.err=(e&&e.code)||'error';
      if(e&&e.code==='permission-denied'){CL.remote[id]={deleted:true};dropKid(id)}else{CL.dirty[id]=1;cloudSchedule(30000)}setSync()});
    dailyBackup(id,merged);
  }
  CL.busy=false;setSync();if(CL.pending){CL.pending=false;cloudSchedule(3000)}
}
/* the small summary for the weekly email goes in its own write: if it is refused, the player's save is never affected */
function saveDigest(id,p){if(p.roster||typeof digestFor!=='function'||!CL.api.saveKidMail)return;const dg=digestFor(id);if(!dg||dg.length>11000)return;
  CL.api.saveKidMail(id,dg).catch(()=>{})} // after every save: the save replaces the whole document
function dailyBackup(id,p){const day=dayKey(),k='pip-bk-'+CL.uid+'-'+id;let last='';try{last=localStorage.getItem(k)||''}catch(e){}if(last===day)return;
  try{localStorage.setItem(k,day)}catch(e){}
  CL.api.writeBackup(id,day,{data:JSON.stringify(p),name:(p.name||'Player').slice(0,16),ts:Date.now(),xp:p.xp,stars:STAR_ISLANDS.reduce((s,i)=>s+(p.best[i.id]||0),0),coins:p.coins})
    .then(()=>CL.api.pruneBackups(id,30)).catch(()=>{try{localStorage.removeItem(k)}catch(e){}})}
function onKids(docs,meta){
  const first=!CL.synced&&!meta.fromCache;if(!meta.fromCache)CL.synced=true;
  for(const id in docs){const d=docs[id];
    if(d.deleted){CL.remote[id]={deleted:true};if(ROOT.profiles[id])dropKid(id);continue}
    let p;try{p=JSON.parse(d.data)}catch(e){continue}
    const pending=d._pending;CL.remote[id]={p,ts:d.ts,fresh:!pending||(CL.remote[id]||{}).fresh};
    const loc=ROOT.profiles[id];
    if(!loc){ROOT.profiles[id]=normalizeProfile(p);continue}
    if(id===ROOT.current){if(!pending&&!sameProfile(G,p)&&canAdopt())adoptRemote()}
    else if(!pending)ROOT.profiles[id]=mergeProfiles(loc,p);
    if(!pending&&!sameProfile(mergeProfiles(ROOT.profiles[id],p),p))CL.dirty[id]=1;
  }
  if(first)for(const id in ROOT.profiles)if(!docs[id])CL.dirty[id]=1; // made offline, not uploaded yet
  if(!meta.fromCache)for(const id in ROOT.profiles)if(!docs[id]&&CL.remote[id]&&CL.remote[id].p&&!CL.dirty[id]){/* removed elsewhere */dropKid(id)}
  persistLocal();if(Object.keys(CL.dirty).length)cloudSchedule(first?1500:3000);
  setSync();if(curScreen==='kids')renderKids();
  /* the teacher desk follows when class students arrive from the cloud */
  const nk=Object.keys(ROOT.profiles).length;if(curScreen==='teach'&&!ovOpen&&nk!==onKids.n&&typeof renderTeach==='function'){if(TC.autoTab&&TC.cur)TC.tab=tabFor(TC.cur);renderTeach()}onKids.n=nk;
}
function canAdopt(){return curScreen!=='play'&&curScreen!=='done'&&!ovOpen&&!(curScreen==='home'&&homeEdit)}
/* pull in changes from other devices (only between rounds, never mid-puzzle) */
function adoptRemote(){if(CL.mode!=='cloud'||!ROOT.current)return;const r=CL.remote[ROOT.current];if(!r||!r.p||!r.fresh)return;r.fresh=false;
  if(sameProfile(G,r.p))return;G=mergeProfiles(G,r.p);ROOT.profiles[ROOT.current]=G;persistLocal();if(ensurePack())return;applySettings();refreshFoxes();
  if(curScreen==='map'&&!adoptRemote.inMap){adoptRemote.inMap=1;renderMap();adoptRemote.inMap=0}
  else if(curScreen==='home')renderHome()} // the island screen must show the adopted profile, not the old object
function dropKid(id){delete ROOT.profiles[id];(ROOT.gone=ROOT.gone||{})[id]=1;if(ROOT.current===id){ROOT.current='';G=freshProfile();if(CL.mode!=='guest'&&curScreen!=='gate')openKids()}persistLocal()}
function setSync(st){if(st)CL.state=st;const el=$('#syncBadge');const s=syncInfo();if(el){el.className='tbtn sync '+s.cls;el.innerHTML=`${CLOUD_ICON}<span>${s.short}</span>`;el.title=s.long}
  const n=$('#cloudNote');if(n){n.className='note '+(s.cls==='ok'?'ok':s.cls==='bad'?'bad':'');n.textContent=s.long}}
function syncInfo(){
  if(CL.mode==='guest')return {cls:'warn',short:'This device',long:'Saved on this device only. A grown-up can sign in to keep progress safe in the cloud.'};
  if(CL.mode==='offline')return {cls:'warn',short:'Offline',long:'No connection. Progress is saved on this device and will upload automatically next time.'};
  if(!navigator.onLine)return {cls:'warn',short:'Offline',long:'You are offline. Progress is saved on this device and will upload when the internet is back.'};
  if(CL.err&&CL.err!=='permission-denied')return {cls:'bad',short:'Retrying',long:'Could not reach the cloud just now. Progress is safe on this device and Pip will try again.'};
  if(!CL.synced)return {cls:'warn',short:'Connecting',long:'Connecting to the cloud...'};
  if(CL.waiting||CL.t||CL.busy||Object.keys(CL.dirty).length)return {cls:'warn',short:'Saving',long:'Saving to the cloud...'};
  return {cls:'ok',short:'Saved',long:'All progress is saved in the cloud. It will be there on any device where you sign in.'}}
addEventListener('online',()=>{setSync();cloudSchedule(1000)});addEventListener('offline',()=>setSync());
addEventListener('pagehide',()=>{persistLocal();cloudFlush()});
function encodeSave(only){const r=only?{profiles:{[only]:ROOT.profiles[only]},current:only,pin:'',ts:Date.now()}:{...ROOT,pin:''};const bytes=new TextEncoder().encode(JSON.stringify(r));let bin='';bytes.forEach(b=>bin+=String.fromCharCode(b));return 'PIP1:'+btoa(bin)}
function decodeSave(code){code=code.trim().replace(/\s+/g,'');if(!code.startsWith('PIP1:'))throw new Error('bad');const bin=atob(code.slice(5));const bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));const r=JSON.parse(new TextDecoder().decode(bytes));if(!r||!r.profiles)throw new Error('bad');return r}
const newKidId=()=>'k'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
function addKid(p){const id=newKidId();p=normalizeProfile(p);p._u=Date.now();ROOT.profiles[id]=p;persistLocal();if(CL.mode==='cloud'){CL.dirty[id]=1;cloudSchedule(500)}return id}
/* ONE star measure for everything (map, story, closet prizes, grown-ups): the better of the best round and recent accuracy
   (7 of 10 right lately = 2 stars, 8 of 10 = 3). Stars never go down. */
/* ===== Skills: every island is a topic, every question type belongs to a skill. A skill is mastered at 80% of the last 10 first tries (at least 5). ===== */
const rng=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
/* Skills come from the skill library (content/skills, built into js/content.js). A skill lists its question types,
   or names a selector below for islands whose question types depend on the size of a question bank. */
const SKILL_SEL={
  'reading.short':isl=>rng(0,PASSAGES.length*3-1),
  'reading.long':(isl,k)=>{const P3=PASSAGES.length*3;return LQ.map((x,i)=>LONGP[x[0]].q[x[1]][0]===k?P3+i:-1).filter(i=>i>=0)},
  'reading.struct':isl=>rng(PASSAGES.length*3+LQ.length,PASSAGES.length*3+LQ.length+TSTRUCT.length-1),
  'reading.media':isl=>rng(PASSAGES.length*3+LQ.length+TSTRUCT.length,isl.types-1),
  all:isl=>rng(0,isl.types-1),
  bank:(isl,b)=>rng(0,SKILL_BANKS[b].length-1),
  mod:(isl,a)=>{const L=SKILL_BANKS[a.base].length;return rng(0,isl.types-L-1).filter(x=>x%a.m===a.j).map(x=>L+x)},
  'gram.cat':(isl,name)=>GRAMF.map((x,i)=>x.cat===name?i:-1).filter(i=>i>=0),
  /* grade 3 and later: question banks with skill tags, and grade 3 reading */
  tag:(isl,a)=>{const L=BANK3[a.bank].length;return BANK3[a.bank].map((x,i)=>x[0]===a.tag?i:-1).filter(i=>i>=0).concat((BANKX[a.bank]||[]).map((x,i)=>x.tag===a.tag?L+i:-1).filter(i=>i>=0))},
  'r3.short':isl=>rng(0,PASS3Q.length-1),
  'r3.long':(isl,k)=>LONG3Q.map((x,i)=>LONG3[x[0]].q[x[1]][0]===k?PASS3Q.length+i:-1).filter(i=>i>=0),
  'r3.feat':isl=>rng(PASS3Q.length+LONG3Q.length,PASS3Q.length+LONG3Q.length+BANK3.feat3.length-1),
  'r3.media':isl=>rng(PASS3Q.length+LONG3Q.length+BANK3.feat3.length,isl.types-1),
  'r5.short':isl=>rng(0,PASS5Q.length-1),
  'r5.long':(isl,k)=>LONG5Q.map((x,i)=>LONG5[x[0]].q[x[1]][0]===k?PASS5Q.length+i:-1).filter(i=>i>=0),
  'r5.feat':isl=>rng(PASS5Q.length+LONG5Q.length,PASS5Q.length+LONG5Q.length+BANK3.feat5.length-1),
  'r5.media':isl=>rng(PASS5Q.length+LONG5Q.length+BANK3.feat5.length,isl.types-1)};
const SKILL_BANKS={SCIENCE,GRAMF};
function skillsOf(id){const c=skillsOf.c||(skillsOf.c={});if(c[id])return c[id];const isl=byId(id);if(!isl||!isl.gen||isl.retired)return c[id]=[];
  const L=(isl.skills||[]).map(k=>CONTENT.skills[k]).filter(Boolean);
  if(!L.length)return c[id]=[{k:id+':0',id,i:0,name:'All puzzles',std:'',codes:[],ts:rng(0,isl.types-1)}];
  return c[id]=L.map((S,i)=>({k:S.id,id,i,name:S.name,std:S.std.join(' / '),codes:S.std,ts:S.src.types?S.src.types.slice():SKILL_SEL[S.src.sel](isl,S.src.arg)}))}
const skillOf=(id,t)=>skillsOf(id).find(s=>s.ts.includes(t));
function skAdd(id,t,ok){const s=skillOf(id,t);if(!s)return;G.sk=Object.assign({},G.sk||{});const before=skStat(s.k).st;G.sk[s.k]=((skRec(s.k)+(ok?'1':'0')).slice(-10));
  if(before<2&&skStat(s.k).st===2&&S&&S.mode!=='boss'){const rk=typeof resOf==='function'?resOf(id):null;if(rk)resAdd(rk,5);if(typeof stat==='function')stat('mastered');if(typeof buddyMastered==='function')buddyMastered();toast(`Skill mastered: ${s.name}!`,`${byId(id).name}: ${skillsDone(id)} of ${skillsOf(id).length} skills mastered.${rk?` <b>+5 ${RES[rk].name}</b> for your Wonders!`:''}`,'#38b98a')}}
/* a skill split from an older, bigger one ("was") starts with the older one's record, so mastery and stars carry over */
function skRec(k){const m=G.sk||{};if(m[k]!=null)return m[k];const w=CONTENT.skills[k]&&CONTENT.skills[k].was;return (w&&m[w])||''}
function skStat(k){const r=skRec(k),n=r.length,ok=r.split('').filter(x=>x==='1').length;return {n,ok,acc:n?ok/n:0,st:n>=5&&ok/n>=.8?2:n?1:0}}
const skillsDone=id=>skillsOf(id).filter(s=>skStat(s.k).st===2).length;
const allSkills=id=>{const L=skillsOf(id);return !L.length||L.every(s=>skStat(s.k).st===2)};
/* islands that already had 3 stars before skills existed keep them */
function skMigrate(){if(G.skMig)return;G.skMig=1;G.star3={};for(const i of ISLANDS)if(i.gen&&starRaw(i.id)>=3)G.star3[i.id]=1}
function weakSkill(id){const L=skillsOf(id).map(s=>({s,m:skStat(s.k)}));const tried=L.filter(x=>x.m.n>=3&&x.m.st<2).sort((a,b)=>a.m.acc-b.m.acc);if(tried.length)return tried[0].s;const fresh=L.filter(x=>x.m.n===0);return fresh.length?fresh[0].s:null}
function skillQs(isl,s){
  if(s.ts.some(t=>t>=10)&&isl.genKey==='riddle'){const seed=R(1,2e9),sc=R(0,2);return [0,1,2,3].map(k=>makeQ(isl,10+sc*4+k,seed)).concat([0,1].map(()=>makeQ(isl,pick(s.ts),R(1,2e9))))}
  if(isl.id==='reading'&&s.i===0&&isl.round)return isl.round(isl);
  if(isl.id==='listen'&&isl.round)return isl.round(isl);
  const ts=shuffle(s.ts.slice());return Array.from({length:6},(_,k)=>makeQ(isl,ts[k%ts.length],R(1,2e9)))}
function startSkill(isl,s){if(limitGate(()=>startSkill(isl,s)))return;beginRound(isl,'island',skillQs(isl,s));S.skill=s.k;
  const nm2=$('#iname');const sp=document.createElement('span');sp.className='idiff';sp.textContent=` · ${s.name}`;nm2.appendChild(sp);say($('#say'),`Let's practice <b>${esc(s.name)}</b>${nm()}! Six puzzles, all on this one skill.`)}
const SK_DOT=st=>`<i class="skd s${st}"></i>`;
/* "?" explanations for grown-ups */
const QHELP={quest:['Class quest','A shared goal for 7 days. Every student\'s right answers (or minutes) add up to one class total, counted on our server. Students only see the class total and their own share: no names and no ranking, so nobody is singled out. You choose the reward.'],mastered:['Mastered','A skill is mastered when 8 of the last 10 puzzles on it were right on the first try (at least 5 tries). It means your child can do it reliably.'],
  almost:['Almost there','Not mastered yet, but at least 3 tries and 70% or more right. A little more practice usually finishes it.'],
  first:['Right on the first try','The share of puzzles answered correctly before any hint or second try. 80% or more is strong; under 60% means the topic is still hard.'],
  struggling:['Struggling','Under 60% right on the first try after at least 5 puzzles. A short lesson or practicing together helps most.'],
  groups:['Groups','Students are grouped by how often they are right on the first try this week: under 65%, 65 to 84%, and 85% or more. Use them for small-group work or to send a task to one group.'],
  lesson:['Lesson mode','While a lesson runs, every student\'s map shows the topic you picked at the top, and Pip\'s Pick practices it first. Students who are not in your room just see it as a suggestion.'],
  pace:['School-year pace','A rough guide: the share of this grade\'s skills mastered (and almost mastered) compared with how much of the school year has passed. Every child learns in their own order, so use it as a hint, not a grade.']};
const qhelp=k=>`<button type="button" class="qh" data-qh="${k}" aria-label="What does ${QHELP[k][0]} mean?">?</button>`;
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-qh]');if(!b)return;e.preventDefault();e.stopPropagation();const h=QHELP[b.dataset.qh];if(!h)return;
  if(ovOpen){toast(h[0],h[1],'#2f9fe0');return}overlay(`<div class="eyebrow">What does it mean?</div><h2>${h[0]}</h2><p>${h[1]}</p><div class="btnrow"><button class="go" type="button" id="qhOk">Got it</button></div>`,()=>{$('#qhOk').onclick=closeOverlay})},true);
/* school-year pace: mastered (+ half of almost) against the part of the school year that has passed (mid-August to the end of May) */
function yearPace(P=G){const SK=ISLANDS.filter(i=>i.gen&&!i.retired).flatMap(i=>skillsOf(i.id));if(!SK.length)return null;
  const d=new Date(),y=d.getMonth()>=7?d.getFullYear():d.getFullYear()-1,a=new Date(y,7,15),b=new Date(y+1,4,31),f=Math.max(0,Math.min(1,(d-a)/(b-a)));
  const m=SK.filter(s=>skStat(s.k).st===2).length,al=SK.filter(s=>skAlmost(skStat(s.k))).length,have=(m+al/2)/SK.length;
  return {f,have,st:f<.08?'early':have>=f+.1?'ahead':have>=f-.12?'on':'behind'}}
/* "almost there": not mastered yet, at least 3 tries and 70% or more right */
const skAlmost=m=>m&&m.st!==2&&m.n>=3&&m.ok/m.n>=.7;
/* the last n weeks (oldest first): [minutes, puzzles, right on the first try] */
function weekHist(n,P=G){return [...Array(n)].map((_,w)=>{const off=(n-1-w)*7;const D=[...Array(7)].map((_,k)=>addDays(k-6-off));return D.reduce((a,k)=>{const d=(P.days||{})[k]||{};return [a[0]+(d.sec||0)/60,a[1]+(d.q||0),a[2]+(d.c||0)]},[0,0,0]).map(Math.round)})}
/* weekly bars: minutes per week, accuracy under each bar */
function weeksHTML(wh){if(!wh||!wh.length)return '<p class="note">No weeks yet.</p>';const mx=Math.max(10,...wh.map(w=>w[0]));
  return `<div class="weeks">${wh.map((w,i)=>`<div><em>${w[0]}</em><i style="height:${Math.max(2,w[0]/mx*100)}%"></i><span>${i===wh.length-1?'This wk':i===wh.length-2?'Last wk':`${wh.length-1-i}w ago`}</span><small class="${w[1]&&w[2]/w[1]<.6?'low':''}">${w[1]?Math.round(w[2]/w[1]*100)+'%':'–'}</small></div>`).join('')}</div><p class="note wknote">Bars: minutes per week. Under each bar: right on the first try.</p>`}
function skillBar(id){const L=skillsOf(id);if(L.length<2)return '';const d=skillsDone(id);
  return `<span class="skbar" title="${d} of ${L.length} skills mastered" aria-label="${d} of ${L.length} skills mastered">${(()=>{const st=L.map(s=>skStat(s.k).st),pc=v=>Math.round(st.filter(x=>x===v).length/L.length*100);return `<span class="sksegs meter"><i class="s2" style="flex:0 0 ${pc(2)}%"></i><i class="s1" style="flex:0 0 ${pc(1)}%"></i></span>`})()}<em>${d}/${L.length}</em></span>`}
function openIsland(isl){const L=skillsOf(isl.id),b=starFor(isl.id),d=skillsDone(isl.id);
  if(L.length<2||isl.flash)return start(isl);
  const third=b>=2&&!allSkills(isl.id)&&!(G.star3||{})[isl.id];
  overlay(`<div class="ishead"><span class="isico">${islandSVG(isl.color,LANDMARKS[isl.lm])}</span><div><div class="eyebrow" style="color:${isl.color}">${esc(isl.topic)}</div><h2>${esc(isl.name)}</h2><span class="stars">${[0,1,2].map(k=>starSVG(k<b)).join('')}</span></div></div>
    <div class="isbtns"><button type="button" class="go big" id="isPlay">Play</button>${lessonsFor(isl.id).length?'<button type="button" class="go alt" id="isLearn">Learn the trick</button>':''}</div>
    <div class="sklist" role="list"><div class="skhead"><b>Skills</b><span>${d} of ${L.length} mastered</span></div>${L.map(s=>{const m=skStat(s.k);return `<div class="skrow s${m.st}" role="listitem">${SK_DOT(m.st)}<div class="skname"><b>${esc(s.name)}</b><small>${m.st===2?'Mastered':m.n?`${m.ok} of ${m.n} right lately`:'Not tried yet'}</small></div><button type="button" class="go small alt" data-sk="${s.i}" aria-label="Practice ${esc(s.name)}">Practice</button></div>`}).join('')}</div>
    ${third?`<p class="note">The <b>3rd star</b> shines when every skill here is mastered.</p>`:''}<div class="actrow"><button type="button" class="go alt" id="isClose">Back to map</button></div>`,()=>{
    $('#ocard').classList.add('wide');const close=()=>{$('#ocard').classList.remove('wide');closeOverlay()};
    $('#isPlay').onclick=()=>{close();start(isl)};if($('#isLearn'))$('#isLearn').onclick=()=>{close();start(lessonIsland(lessonFor(isl.id)))};$('#isClose').onclick=close;$('#isPlay').focus({preventScroll:true});
    $('#ocard').querySelectorAll('[data-sk]').forEach(b=>b.onclick=()=>{close();tone([523,784]);startSkill(isl,L[+b.dataset.sk])})})}
function pickPlay(P){const w=weakSkill(P.id);if(w&&skillsOf(P.id).length>1)startSkill(P,w);else start(P,{noOffer:true})}
function nowParentHTML(){const cd=classDoc();if(cd&&(cd.now||[]).length)return `<div class="pcard wide"><h4>In class right now</h4><p class="note">Set by ${esc(cd.teacher||'the teacher')}: <b>${cd.now.map(byId).filter(Boolean).map(i=>esc(i.topic)).join(', ')}</b>. Pip's Pick practices these first.</p></div>`;const sel=G.settings.now||[],groups=[['Math',ISLANDS.filter(i=>i.gen&&!i.retired&&i.group==='math')],['English and more',ISLANDS.filter(i=>i.gen&&!i.retired&&i.group==='world')]];
  return `<div class="pcard wide"><h4>In class right now</h4><p class="note">Tap the topics ${esc(G.name||'your child')} is learning at school this month (up to 4). Pip's Pick will practice these first, starting with the skills not mastered yet.</p>${groups.map(([g,L])=>`<div class="nowgrp"><b>${g}</b><div class="nowchips">${L.map(i=>`<button type="button" class="nowchip${sel.includes(i.id)?' on':''}" data-now="${i.id}" aria-pressed="${sel.includes(i.id)}">${esc(i.topic)}</button>`).join('')}</div></div>`).join('')}${sel.length?`<p class="note">Now practicing first: <b>${sel.map(id=>esc(byId(id).name)).join(', ')}</b>.</p>`:''}</div>`}
/* School program: the state and grade decide which islands and skills the child gets (a content pack per state and grade) */
const US_STATES=[['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['DC','District of Columbia'],['FL','Florida'],['GA','Georgia'],['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MD','Maryland'],['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming']];
const GRADES=[[0,'Kindergarten'],[1,'Grade 1'],[2,'Grade 2'],[3,'Grade 3'],[4,'Grade 4'],[5,'Grade 5']];
const packKey=(st,gr)=>`${String(st).toLowerCase()}-${gr}`;
/* Progress tied to islands is kept per grade: changing grade (a new school year) starts that grade's islands fresh
   and keeps the old grade's stars safe in G.grades. Coins, purchases, Pip, the home island and the story are shared. */
const GRADE_FIELDS=['best','diff','hardMaster','stats','roll','star3','tierBest','review','wrongLog','deck','lessonOffer','skMig','placed'];
function packSwitch(to,P=G){if(!P.pack)P.pack=PACK_DEFAULT;if(P.pack===to)return;P.grades=Object.assign({},P.grades);
  const keep={};for(const f of GRADE_FIELDS)if(P[f]!==undefined)keep[f]=clone(P[f]);P.grades[P.pack]=keep;
  const back=P.grades[to]||{};for(const f of GRADE_FIELDS){if(back[f]!==undefined)P[f]=clone(back[f]);else if(DEF[f]!==undefined)P[f]=clone(DEF[f]);else delete P[f]}
  const N=CONTENT.packs[to];if(N){P.settings=Object.assign({},P.settings,{state:N.state,grade:N.grade})}
  P.pack=to;P.packSince=Date.now()}
const packReady=P=>P&&(P.status!=='draft'||(()=>{try{return localStorage.getItem('pip-dev-packs')==='1'}catch(e){return false}})());
/* the page runs one pack at a time: if this player's pack is another one, reload with it */
/* after the reload the same player comes straight back (no second "Who's playing?") */
function ensurePack(){const id=G.pack||PACK_DEFAULT;if(id!==PACK.id&&CONTENT.packs[id]){try{localStorage.setItem('pip-pack',id);if(ROOT.current)sessionStorage.setItem('pip-resume',ROOT.current)}catch(e){}location.reload();return true}return false}
function packParentHTML(){
  if(G.cls)return `<div class="pcard wide"><h4>School program</h4><p>${esc(G.name||'Your child')} plays <b>${esc(PACK.stateName)}, ${GRADE_WORD(PACK.grade).toLowerCase()}</b>, the grade of ${G.roster?'the class':`${esc(G.cls.teacher||'the teacher')}'s class <b>${esc(G.cls.name||'')}</b>`}.</p><p class="note">${G.roster?'The teacher sets the grade for the whole class.':'The class decides the grade, so the teacher sees the right skills. To choose another grade, leave the class first (below).'}</p></div>`;
  const st=G.settings.state||PACK.state,gr=G.settings.grade!=null?+G.settings.grade:PACK.grade,ready=packReady(CONTENT.packs[packKey(st,gr)]);
  const opt=(v,t,on)=>`<option value="${v}"${on?' selected':''}>${esc(t)}</option>`;
  return `<div class="pcard wide"><h4>School program</h4><p class="note">Choose the state and grade of ${esc(G.name||'your child')}'s school. The islands and skills follow that state's standards for that grade.</p>
    <div class="setrow"><label for="setState">State</label><select id="setState">${US_STATES.map(([c,n])=>opt(c,n+(Object.values(CONTENT.packs).some(P=>P.state===c&&packReady(P))?'':' (planned)'),c===st)).join('')}</select></div>
    <div class="setrow"><label for="setGrade">Grade</label><select id="setGrade">${GRADES.map(([g,n])=>opt(g,n+(packReady(CONTENT.packs[packKey(st,g)])?'':' (planned)'),g===gr)).join('')}</select></div>
    <p class="note${ready?' ok':''}" id="packNote">${ready?`Playing: <b>${esc(PACK.stateName)}, grade ${PACK.grade}</b>.`:`${esc((US_STATES.find(x=>x[0]===st)||['',st])[1])}, ${esc(GRADES.find(x=>x[0]===gr)[1].toLowerCase())} is planned but not ready yet. Until then the islands follow <b>${esc(PACK.stateName)}, grade ${PACK.grade}</b>; most math and English skills are the same from state to state.`}</p></div>`}
function setPack(st,gr){if(G.cls)return renderParent();delete G.visit;G.settings.state=st;G.settings.grade=gr;const id=packKey(st,gr);
  if(packReady(CONTENT.packs[id])&&id!==PACK.id){packSwitch(id);save();try{localStorage.setItem('pip-pack',id)}catch(e){}location.reload();return}save();renderParent()}
const SUBJ_NAMES={math:'Math',ela:'English',science:'Science',social:'Social studies'};
const islandSubject=i=>{const k=(i.skills||[])[0];return k&&CONTENT.skills[k]?CONTENT.skills[k].subject:''};
function skillsParentHTML(){const groups=Object.keys(SUBJ_NAMES).map(sj=>[SUBJ_NAMES[sj],ISLANDS.filter(i=>i.gen&&!i.retired&&islandSubject(i)===sj).map(i=>i.id)]).filter(g=>g[1].length);
  let all=0,done=0;const body=groups.map(([g,ids])=>`<h5 class="skgrp">${g}</h5>${ids.filter(id=>byId(id)&&skillsOf(id).length).map(id=>{const L=skillsOf(id),d=skillsDone(id);all+=L.length;done+=d;
    return `<details class="skdet"><summary><b>${esc(byId(id).name)}</b><span>${esc(byId(id).topic)}</span><em>${d}/${L.length}</em><span class="skmeter"><i style="width:${Math.round(d/L.length*100)}%"></i></span></summary><ul>${L.map(s=>{const m=skStat(s.k);return `<li class="s${m.st}">${SK_DOT(m.st)}<span>${esc(s.name)}</span><small>${esc(s.std)}</small><em>${m.st===2?'Mastered':m.n?`${m.ok}/${m.n} lately`:'Not tried'}</em></li>`}).join('')}</ul></details>`}).join('')}`).join('');
  return `<div class="pcard wide"><h4>Skills checklist</h4><p class="note">Every island is a topic made of skills. A skill is <b>mastered</b> at 8 of 10 right on the first try (at least 5 tries). Mastered: <b>${done} of ${all}</b> skills. Tap an island to see its skills and standards.</p><div class="sklegend">${SK_DOT(2)} mastered ${SK_DOT(1)} practicing ${SK_DOT(0)} not tried</div>${body}</div>`}
const starRaw=id=>Math.max(G.best[id]||0,typeof tierBest==='function'?tierBest(id):0);
/* a 3rd star, once earned, stays: new skills added to an island later never take it away */
const starFor=id=>{const r=starRaw(id);if(r<3)return r;if(!G.skMig)skMigrate();if(G.skMig<2)skMigrate2();if((G.star3||{})[id])return 3;if(allSkills(id)){G.star3=Object.assign({},G.star3,{[id]:1});return 3}return 2};
/* islands whose skills were all mastered before skills were added to them (skills without a legacy key are new) keep their 3rd star */
function skMigrate2(){G.skMig=2;G.star3=Object.assign({},G.star3);for(const i of ISLANDS){if(!i.gen||starRaw(i.id)<3||G.star3[i.id])continue;
  const old=skillsOf(i.id).filter(s=>CONTENT.skills[s.k]&&CONTENT.skills[s.k].legacy);if(old.length&&old.every(s=>skStat(s.k).st===2))G.star3[i.id]=1}}
const starTotal=()=>ISLANDS.filter(i=>i.id!=='daily'&&i.id!=='review').reduce((s,i)=>s+starFor(i.id),0);
const dayKey=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const addDays=(n,base=new Date())=>{const d=new Date(base);d.setDate(d.getDate()+n);return dayKey(d)};
const yesterdayKey=()=>addDays(-1);
const weekKey=(d=new Date())=>{const x=new Date(d);const wd=(x.getDay()+6)%7;x.setDate(x.getDate()-wd);return dayKey(x)};
const lastWeekKey=()=>{const d=new Date();d.setDate(d.getDate()-7);return weekKey(d)};
const curStreak=()=>(G.lastDaily===dayKey()||G.lastDaily===yesterdayKey())?G.dstreak:0;
const dailyDone=()=>G.lastDaily===dayKey();
const today=()=>{const k=dayKey();return G.days[k]||(G.days[k]={sec:0,q:0,c:0})};
const bump=(f,n=1)=>{const t=today();t[f]=(t[f]||0)+n};
const thisWeek=()=>{const k=weekKey();return G.weeks[k]||(G.weeks[k]={c:0,th:0})};
function diffFor(isl){if(!isl||!isl.gen)return 2;const m=G.settings.diff;return m==='auto'?(G.diff[isl.id]||2):+m}
const DIFF_NAME=['','Easy','Normal','Hard'];
function reviewDue(){const k=dayKey();return G.review.filter(r=>r.due<=k)}

const LV=[0,15,40,75,120,180,250,340,450,600,800,1050,1350,1700,2100];
const TITLES=['Cloud Cadet','Breeze Rider','Sky Scout','Kite Captain','Rainbow Racer','Storm Chaser','Star Pilot','Comet Commander','Galaxy Guide','Sky Legend','Wizard of the Winds','Grand Sky Master','Sky Champion','Cosmic Captain','Legend of the Skies'];
/* levels never run out: after the 15 named titles come Legend stars */
for(let k=LV.length;k<60;k++){LV.push(LV[k-1]+400+(k-15)*50);TITLES.push(`Legend of the Skies ★${k-13}`)}
function levelOf(xp){let l=0;while(l+1<LV.length&&xp>=LV[l+1])l++;return l}
/* coin rewards (rebalanced Oct 2026: about 2.5x lower, so the shop and big projects last) */
const REW={ans:4,ans2:2,star:4,best:8,daily:20,goal:12,week:40,badge:10,dup:4,set:40,story:200,chest:25};
const BADGES=[
  ['first','First Flight','Finish your first island.','#38b98a'],['perfect','Perfect Flight','Get every puzzle right on the first try.','#ffc23d'],
  ['combo5','Hot Streak','Answer 5 in a row on the first try.','#ff9f43'],['combo10','Unstoppable','Answer 10 in a row on the first try.','#ff6b57'],
  ['stars20','Star Collector','Collect 20 stars.','#ffc23d'],['stars40','Star Hoarder','Collect 40 stars.','#e2558f'],['stars60','Sky Royalty','Collect every star in the sky.','#6b5bd6'],
  ['travel','World Traveler','Finish every island at least once.','#2f9fe0'],['clock','Time Keeper','Get 3 stars on Clock Cove.','#5ec3d6'],
  ['boss','Storm Tamer','Defeat the Grumble Cloud on Boss Island.','#6b6f9e'],['daily3','3-Day Streak','Finish the Daily Challenge 3 days in a row.','#ff9f43'],
  ['daily7','Week Warrior','Finish the Daily Challenge 7 days in a row.','#ff6b57'],['shopper','Snappy Dresser','Buy something in Pip\'s Closet.','#e2558f'],['legend','Living Legend','Buy a Legendary item in Pip\'s Closet.','#ffc23d'],
  ['thunder','Lightning Brain','Answer 20 facts in Thunder Tower.','#7c8fb8'],['level5','Sky Scholar','Reach level 5.','#38b98a'],['rich','Treasure Keeper','Have 500 coins at once.','#e09a14'],
  ['hard','Hard Mode Hero','Get 3 stars on an island in Hard mode.','#ff6b57'],['fixer','Comeback Kid','Fix 10 old mistakes at Fix-It Falls.','#5ec3d6'],
  ['learner','Quick Learner','Finish a lesson with Pip.','#2f9fe0'],['story2','Compass Keeper','Fix the Starlight Compass in Story Mode.','#2c3266'],['story3','Bridge Builder','Bring back every color of the Rainbow Bridge.','#e2558f'],['grand','Master Builder','Finish a Grand Project on your island.','#e09a14'],['goal','Goal Getter','Reach your daily goal.','#38b98a'],['album','Set Collector','Complete a sticker set.','#e2558f'],
  ['week','Personal Best','Beat last week\'s score.','#2f9fe0'],['builder','Home Builder','Build 5 things on your island.','#8fd16a'],['dream','Dream Island','Build everything on your island.','#ffc23d'],['popper','Balloon Popper','Pop 15 balloons in one bonus game.','#ff6b57'],['event','Event Champion','Win the top prize in a seasonal event.','#ff9f43'],['story','Map Master','Finish the whole Story Mode.','#6b5bd6'],
  ['homey','Home Sweet Home','Put 5 things inside your home.','#ff9f43'],['cozy','Interior Designer','Make a room 5 out of 5 cozy.','#e2558f'],['decorset','Set Collector','Complete a decor set in your home.','#8f7cf0']
];

/* ================= sound, music, speech ================= */
let actx=null,soundOn=true;
function ctx(){actx=actx||new(window.AudioContext||window.webkitAudioContext)();if(actx.state==='suspended')actx.resume();return actx}
function tone(freqs,dur=.11,type='triangle'){if(!soundOn)return;try{ctx();const t=actx.currentTime;freqs.forEach((f,i)=>{const o=actx.createOscillator(),g=actx.createGain();o.type=type;o.frequency.value=f;
  g.gain.setValueAtTime(.0001,t+i*dur);g.gain.exponentialRampToValueAtTime(.17,t+i*dur+.02);g.gain.exponentialRampToValueAtTime(.0001,t+i*dur+dur);o.connect(g).connect(actx.destination);o.start(t+i*dur);o.stop(t+i*dur+dur+.03)})}catch(e){}}
const sYes=()=>tone([660,880,1175]),sNo=()=>tone([220,180],.14,'sine'),sWin=()=>{if(typeof jingle==='function')jingle('win');else tone([523,659,784,1047,1319],.12)},sCoin=()=>tone([1320,1760],.06,'square'),sBadge=()=>tone([784,988,1175,1568],.1),sLevel=()=>jingle('level');
let musicOn=true;try{musicOn=localStorage.getItem('pip-music')!=='off'}catch(e){}
let mGain=null,mTimer=0,nextT=0,step=0;
const hz=m=>440*Math.pow(2,(m-69)/12),_=null;
/* music by place: each theme is a short loop (4 bars × 4 phrases) played by the same little synth, no audio files.
   map: the sunny theme · play: soft and sparse, so it never gets in the way of thinking · boss: driving, minor
   story: slow and a bit mysterious · home: cozy and plucky (island, closet, album) */
const THEMES={
  map:{bpm:116,roots:[36,43,45,41],stabs:[[60,64,67],[59,62,67],[57,60,64],[57,60,65]],bass:[0,_,12,0,_,0,12,_],kick:[0,4],hat:1,lead:'triangle',vol:.4,
    tunes:[[[72,_,76,79,_,76,74,_],[74,_,71,74,_,79,77,_],[76,_,72,76,_,81,79,_],[77,76,74,72,_,74,_,_]],[[79,_,79,76,79,_,84,_],[83,_,79,_,74,76,77,_],[76,_,81,79,76,_,72,_],[74,_,77,76,74,_,72,_]],0,null]},
  play:{bpm:92,roots:[41,36,45,43],stabs:[[65,69,72],[64,67,72],[64,69,72],[62,67,71]],bass:[0,_,_,_,7,_,_,_],kick:[],hat:0,lead:'sine',vol:.26,
    tunes:[[[77,_,_,_,76,_,72,_],[_,_,79,_,_,_,76,_],[_,_,72,_,74,_,76,_],[74,_,_,_,_,_,_,_]],null,[[72,_,_,74,_,_,76,_],[_,_,77,_,_,_,79,_],[_,_,76,_,72,_,69,_],[71,_,_,_,_,_,_,_]],null],
    spark:[84,88,91,96]},
  boss:{bpm:136,roots:[33,33,29,31],stabs:[[57,60,64],[57,60,64],[53,57,60],[55,59,62]],bass:[0,0,12,0,0,12,0,12],kick:[0,2,4,6],hat:1,lead:'square',vol:.32,
    tunes:[[[69,_,72,_,76,_,74,72],[69,_,_,67,69,_,72,_],[65,_,69,_,72,_,71,69],[67,_,71,_,74,_,_,_]],0,[[76,_,74,_,72,_,74,76],[77,_,76,_,74,_,72,_],[72,_,69,_,65,_,69,72],[71,_,67,_,71,74,_,_]],null]},
  story:{bpm:84,roots:[38,34,41,36],stabs:[[62,65,69],[58,62,65],[60,65,69],[60,64,67]],bass:[0,_,_,7,_,_,12,_],kick:[0],hat:0,lead:'sine',vol:.3,
    tunes:[[[74,_,_,77,_,76,_,74],[70,_,_,_,74,_,_,_],[72,_,_,76,_,77,_,79],[76,_,_,_,_,_,_,_]],null,[[81,_,_,79,_,77,_,76],[74,_,_,_,70,_,_,_],[72,_,76,_,77,_,76,_],[74,_,_,_,_,_,_,_]],null]},
  home:{bpm:104,roots:[43,40,36,38],stabs:[[67,71,74],[64,67,71],[64,67,72],[62,66,69]],bass:[0,_,7,_,12,_,7,_],kick:[0,4],hat:0,lead:'triangle',vol:.32,
    tunes:[[[79,_,83,_,86,_,83,_],[76,_,79,_,83,_,_,_],[76,_,79,_,84,_,83,_],[81,_,78,_,74,_,_,_]],0,[[86,_,84,_,83,_,81,_],[79,_,_,_,76,_,_,_],[79,_,81,_,83,_,84,_],[86,_,_,_,_,_,_,_]],null]}};
let theme='map',mLayer=0,mVol=1;try{mVol=Math.max(0,Math.min(1,(+localStorage.getItem('pip-mvol')||100)/100))}catch(e){}
const mLevel=()=>THEMES[theme].vol*duck*mVol+.0001;
let noiseBuf=null,duck=1;
function note(m,t,dur,vol,type,attack){const o=actx.createOscillator(),g=actx.createGain();o.type=type;o.frequency.value=hz(m);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vol,t+attack);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g).connect(mGain);o.start(t);o.stop(t+dur+.05)}
function hat(t,vol){if(!noiseBuf){noiseBuf=actx.createBuffer(1,actx.sampleRate*.06,actx.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
  const s=actx.createBufferSource(),f=actx.createBiquadFilter(),g=actx.createGain();s.buffer=noiseBuf;f.type='highpass';f.frequency.value=7000;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+.05);s.connect(f).connect(g).connect(mGain);s.start(t);s.stop(t+.06)}
function kick(t){const o=actx.createOscillator(),g=actx.createGain();o.type='sine';o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(45,t+.12);g.gain.setValueAtTime(.16,t);g.gain.exponentialRampToValueAtTime(.0001,t+.18);o.connect(g).connect(mGain);o.start(t);o.stop(t+.2)}
function schedule(){const T=THEMES[theme],E8=60/T.bpm/2;
  while(nextT<actx.currentTime+.25){const bar=Math.floor(step/8),pos=step%8,c=bar%4,pi=Math.floor(bar/4)%4;let ph=T.tunes[pi];if(ph===0)ph=T.tunes[0];
    if(T.bass[pos]!==null)note(T.roots[c]+T.bass[pos],nextT,E8*.9,.09,'triangle',.005);
    if(pos%2===1)T.stabs[c].forEach(m=>note(m,nextT,E8*.6,.02,'triangle',.005));
    if(T.kick.includes(pos))kick(nextT);if(T.hat)hat(nextT,pos%2?.035:.018);
    if(ph&&ph[c][pos]!==null)note(ph[c][pos],nextT,E8*1.6,.05,T.lead,.006);
    /* a streak adds a twinkle on top (the round theme gets brighter as the child gets things right) */
    if(mLayer&&T.spark&&pos%2===0&&(mLayer>1||pos%4===0))note(T.spark[(bar+pos/2)%T.spark.length],nextT,E8*.8,.018*mLayer,'sine',.004);
    nextT+=E8;step++}}
function musicStart(){if(!musicOn||mTimer||document.hidden)return;try{ctx();if(!mGain){const f=actx.createBiquadFilter();f.type='lowpass';f.frequency.value=9000;mGain=actx.createGain();mGain.connect(f).connect(actx.destination)}
  const t=actx.currentTime;mGain.gain.cancelScheduledValues(t);mGain.gain.setValueAtTime(.0001,t);mGain.gain.linearRampToValueAtTime(mLevel(),t+1.2);nextT=t+.1;step=0;mTimer=setInterval(schedule,100)}catch(e){}}
function musicStop(){if(!mTimer)return;clearInterval(mTimer);mTimer=0;try{const t=actx.currentTime;mGain.gain.cancelScheduledValues(t);mGain.gain.setValueAtTime(mGain.gain.value,t);mGain.gain.linearRampToValueAtTime(.0001,t+.5)}catch(e){}}
/* switch themes with a short fade: the new loop starts from its first bar */
function musicTheme(name){if(!THEMES[name]||name===theme)return;theme=name;mLayer=0;if(!mTimer||!actx)return;
  try{const t=actx.currentTime;mGain.gain.cancelScheduledValues(t);mGain.gain.setValueAtTime(mGain.gain.value,t);mGain.gain.linearRampToValueAtTime(.0001,t+.35);
    nextT=t+.45;step=0;mGain.gain.setValueAtTime(.0001,t+.45);mGain.gain.linearRampToValueAtTime(mLevel(),t+1.4)}catch(e){}}
function musicLayer(n){mLayer=Math.max(0,Math.min(2,n|0))}
function setMusicVolume(v){mVol=Math.max(0,Math.min(1,v));try{localStorage.setItem('pip-mvol',String(Math.round(mVol*100)))}catch(e){}setDuck(duck)}
/* short tunes for big moments; the music steps back while they play */
const JINGLES={win:[[72,0],[76,.12],[79,.24],[84,.36],[88,.52]],level:[[67,0],[72,.1],[76,.2],[79,.3],[84,.45],[79,.6],[84,.72]],unlock:[[79,0],[83,.09],[86,.18],[91,.3]],
  quest:[[72,0],[72,.12],[72,.24],[77,.4],[81,.62],[84,.84],[89,1.05]]};
function jingle(name){const J=JINGLES[name];if(!J||!soundOn)return;try{ctx();const t0=actx.currentTime+.02;
  J.forEach(([m,dt],i)=>{const o=actx.createOscillator(),g=actx.createGain(),t=t0+dt,d=i===J.length-1?.5:.16;o.type='triangle';o.frequency.value=hz(m);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.16,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(actx.destination);o.start(t);o.stop(t+d+.05)});
  const end=J[J.length-1][1]+.6;setDuck(.3);clearTimeout(jingle.t);jingle.t=setTimeout(()=>setDuck(1),end*1000)}catch(e){}}
function setDuck(v){duck=v;if(mGain&&mTimer&&actx){const t=actx.currentTime;mGain.gain.cancelScheduledValues(t);mGain.gain.setValueAtTime(mGain.gain.value,t);mGain.gain.linearRampToValueAtTime(mLevel(),t+.3)}}
const canSpeak='speechSynthesis' in window&&typeof SpeechSynthesisUtterance!=='undefined';
let voice=null;
function voiceList(){if(!canSpeak)return [];try{return speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang))}catch(e){return []}}
function voiceScore(v){let s=0;if(v.localService===false&&navigator.onLine===false)s-=200;if(/^en[-_]US/i.test(v.lang))s+=20;else if(/^en[-_](GB|AU|CA|IE|NZ)/i.test(v.lang))s+=8;
  if(/natural|neural|online|enhanced|premium/i.test(v.name))s+=30;
  if(/Samantha|Ava|Allison|Susan|Aria|Jenny|Ana\b|Emma|Google US English|Karen|Moira|Tessa|Serena|Zira/i.test(v.name))s+=15;
  if(/Fred|Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Deranged|Good News|Hysterical|Pipe Organ|Trinoids|Whisper|Zarvox|Jester|Organ|Superstar|Wobble|Junior|Ralph|Kathy|Princess|Grandpa|Grandma|Rocko|Shelley|Sandy|Flo|Eddy|Reed/i.test(v.name))s-=60;
  return s}
function sortedVoices(){return voiceList().sort((a,b)=>voiceScore(b)-voiceScore(a))}
function pickVoice(){const vs=sortedVoices();const want=G&&G.settings.voice;let w=want&&vs.find(v=>v.name===want);if(w&&w.localService===false&&navigator.onLine===false)w=null;voice=w||vs[0]||null}
if(canSpeak){pickVoice();try{speechSynthesis.onvoiceschanged=()=>{pickVoice();fillVoiceSelect()}}catch(e){}
  /* offline, voices that need the internet stay silent: switch to a voice on this device, and back when online */
  addEventListener('offline',pickVoice);addEventListener('online',pickVoice)}
const VSTYLE={fox:{pitch:1.45,rate:1.04},calm:{pitch:1.2,rate:.92},plain:{pitch:1,rate:.95}};
function fillVoiceSelect(){const el=document.getElementById('setVoice');if(!el)return;const vs=sortedVoices();
  const pip=typeof pvOn==='function'&&G.settings.pv!==false;
  el.innerHTML=(typeof canTalk==='function'?`<option value="__pip"${pip?' selected':''}>Pip's own voice (recommended)</option>`:'')+(canSpeak?`<option value=""${!pip&&!G.settings.voice?' selected':''}>Device voice: best one (automatic)</option>`+vs.map(v=>`<option value="${esc(v.name)}"${!pip&&v.name===G.settings.voice?' selected':''}>Device voice: ${esc(v.name)} (${esc(v.lang)})</option>`).join(''):'');
  const st=document.getElementById('vstyleRow');if(st)st.hidden=pip}
function htmlToSpeech(html){
  const d=document.createElement('div');d.innerHTML=html;
  d.querySelectorAll('.frac').forEach(f=>{const s=f.querySelectorAll('span');f.replaceWith(` ${s[0].textContent} over ${s[1].textContent} `)});
  d.querySelectorAll('svg').forEach(s=>s.remove());
  return d.textContent.replace(/×/g,' times ').replace(/÷/g,' divided by ').replace(/□/g,' blank ').replace(/−/g,' minus ').replace(/°/g,' degrees').replace(/(\d)¢/g,'$1 cents').replace(/\u00a0\?\u00a0/g,' blank ').replace(/___/g,' blank ').replace(/\s+/g,' ').trim();
}
function speak(html,o={}){
  if(!o.user)return;const txt=htmlToSpeech(html);if(!txt)return;
  /* Pip's own voice first (js/voice.js); the device voice when it cannot read this */
  if(typeof pvSpeak==='function'){if(!o.queue&&canSpeak)try{speechSynthesis.cancel()}catch(e){}if(pvSpeak(txt,o))return}
  deviceSpeak(txt,o)}
function deviceSpeak(txt,o={}){
  if(!canSpeak)return;try{if(!txt)return;if(!o.queue)speechSynthesis.cancel();if(!voice)pickVoice();
    const st=VSTYLE[G.settings.vstyle]||VSTYLE.fox;const u=new SpeechSynthesisUtterance(txt);u.lang=voice?voice.lang:'en-US';u.rate=st.rate;u.pitch=st.pitch;if(voice)u.voice=voice;
    if(o.pip&&!o.queue)tone([1046,1568],.045,'sine');
    u.onstart=()=>{setDuck(.3);$('#speakBtn')&&$('#speakBtn').classList.add('on')};u.onend=u.onerror=()=>{setDuck(1);$('#speakBtn')&&$('#speakBtn').classList.remove('on')};
    speechSynthesis.speak(u)}catch(e){}
}
/* "Read everything aloud" (a parents' setting, per player): Pip reads his lines, each question, hints, explanations,
   pop-ups and tour bubbles by himself. Off by default; the speaker button always works. */
const readOn=()=>!!(typeof G!=='undefined'&&G&&G.settings&&G.settings.read&&(typeof canTalk==='function'?canTalk():canSpeak)&&curScreen!=='parent'&&curScreen!=='teach');
function autoSay(html,queue=true){if(readOn())speak(html,{user:true,queue})}
function readAloud(box){if(!readOn()||!box||box.querySelector('#pinbox'))return;const h=box.querySelector('h2,h3'),p=[...box.querySelectorAll('p')].filter(x=>!x.classList.contains('note')).slice(0,2);
  const t=[h&&h.innerHTML,...p.map(x=>x.innerHTML)].filter(Boolean).join('. ');if(t)speak(t,{user:true})}
function stopSpeak(){if(typeof pvStop==='function')pvStop();if(canSpeak)try{speechSynthesis.cancel()}catch(e){}setDuck(1)}
let lastAct=Date.now();
addEventListener('pointerdown',()=>{lastAct=Date.now();musicStart()});addEventListener('keydown',()=>{lastAct=Date.now();musicStart()});
document.addEventListener('visibilitychange',()=>{if(document.hidden){musicStop();stopSpeak();persistLocal();cloudFlush()}else{musicStart();setSync();if(canAdopt())adoptRemote()}});

/* ================= effects ================= */
const cv=$('#confetti'),cx2=cv.getContext('2d');let parts=[],raf=0;const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function burst(x,y,n=60){if(reduce)return;cv.width=innerWidth;cv.height=innerHeight;const cols=['#ff6b57','#ffc23d','#38b98a','#2f9fe0','#e2558f'];
  for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=3+Math.random()*7;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-5,r:4+Math.random()*5,c:cols[Math.floor(Math.random()*5)],rot:Math.random()*6,life:70+Math.floor(Math.random()*30)})}
  if(!raf)raf=requestAnimationFrame(tick)}
function tick(){cx2.clearRect(0,0,cv.width,cv.height);parts=parts.filter(p=>p.life-->0);for(const p of parts){p.vy+=.25;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.rot+=.2;cx2.save();cx2.translate(p.x,p.y);cx2.rotate(p.rot);cx2.fillStyle=p.c;cx2.fillRect(-p.r/2,-p.r/4,p.r,p.r/2);cx2.restore()}raf=parts.length?requestAnimationFrame(tick):0}
function burstAt(el,n){if(!el)return;const r=el.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,n)}
function floatText(el,text){if(!el)return;const r=el.getBoundingClientRect(),f=document.createElement('div');f.className='floater';f.textContent=text;f.style.left=(r.left+r.width/2)+'px';f.style.top=(r.top-6)+'px';document.body.appendChild(f);setTimeout(()=>f.remove(),1200)}
/* at most 2 pop-ups on screen at once; the rest wait their turn, so they never pile up over the round summary */
let toastQ=[],toastLive=0;
function toast(title,desc,color,icon,kind){toastQ.push([title,desc,color,icon,kind||'']);pumpToasts()}
function pumpToasts(){while(toastLive<2&&toastQ.length&&!ovOpen){const [title,desc,color,icon,kind]=toastQ.shift();toastLive++;
  const t=document.createElement('div');t.className='toast';t.dataset.kind=kind;t.innerHTML=`${icon||MEDAL(color)}<div><b>${title}</b>${desc}</div>`;$('#toasts').appendChild(t);
  let gone=false;const kill=()=>{if(gone)return;gone=true;clearTimeout(t._tm);t.classList.add('out');setTimeout(()=>{t.remove();toastLive--;pumpToasts()},400)};t._kill=kill;
  t._tm=setTimeout(kill,toastQ.length?2600:3600)}}
function dropBadgeToasts(){toastQ=toastQ.filter(x=>x[4]!=='badge');document.querySelectorAll('#toasts .toast[data-kind=badge]').forEach(t=>t._kill&&t._kill())}
let ovQueue=[],ovOpen=false;
function overlay(html,onOpen){ovQueue.push([html,onOpen]);if(!ovOpen)nextOverlay()}
let ovReturn=null;
function nextOverlay(){const it=ovQueue.shift();if(!it){$('#overlay').hidden=true;ovOpen=false;if(duck<1&&!(canSpeak&&speechSynthesis.speaking)&&!(typeof pvBusy==='function'&&pvBusy()))setDuck(1);if(ovReturn&&document.contains(ovReturn))try{ovReturn.focus({preventScroll:true})}catch(e){}ovReturn=null;pumpToasts();return}
  if(!ovOpen)ovReturn=document.activeElement;ovOpen=true;$('#ocard').innerHTML=it[0];$('#overlay').hidden=false;refreshFoxes();it[1]&&it[1]();
  if(curScreen==='play')setDuck(.4); // explanations and pop-ups during a round: the music steps back
  readAloud($('#ocard'));
  const h=$('#ocard').querySelector('h2,h3');$('#ocard').setAttribute('aria-label',h?h.textContent:'Pip');setTimeout(()=>{const f=$('#ocard').querySelector('input,button.go,button');if(f&&!$('#overlay').hidden)try{f.focus({preventScroll:true})}catch(e){}},60)}
/* keyboard: Tab stays inside the window; Esc closes windows that only have one button */
document.addEventListener('keydown',e=>{if(!ovOpen)return;const box=$('#ocard'),f=[...box.querySelectorAll('button:not([disabled]),input,select,textarea,a[href]')].filter(x=>x.offsetParent);
  if(e.key==='Tab'&&f.length){const i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}
  if(e.key==='Escape'){const bs=[...box.querySelectorAll('button:not([disabled])')].filter(x=>x.offsetParent&&!x.closest('.speak'));if(bs.length===1){e.preventDefault();bs[0].click()}}});
function closeOverlay(){nextOverlay()}

/* ================= stats & rewards ================= */
function goalInfo(){const g=G.settings.goal,t=today();if(g==='off')return null;
  if(g==='q30')return {cur:t.q,max:30,label:`${t.q}/30 puzzles`};const mins=+g.slice(3);return {cur:Math.floor(t.sec/60),max:mins,label:`${Math.floor(t.sec/60)}/${mins} min`}}
function updateStats(bump){
  const lv=levelOf(G.xp),lo=LV[lv],hi=LV[lv+1];
  $('#lvnum').textContent=`Lv ${lv+1}`;$('#lvname').textContent=TITLES[lv];
  $('#xpfill').style.width=(hi?Math.min(100,(G.xp-lo)/(hi-lo)*100):100)+'%';
  $('#xptext').textContent=hi?`${G.xp-lo} / ${hi-lo} XP to ${TITLES[lv+1]}`:`Max level! ${G.xp} XP`;
  $('#coinPill').innerHTML=`${COIN_ICON}<span>${fmt(G.coins)}</span>`;const pc=$('#pcoins');if(pc)pc.innerHTML=`${COIN_ICON}<span>${fmt(G.coins)}</span>`;
  $('#starPill').innerHTML=`${starSVG(true)}<span>${starTotal()} / ${MAX}</span>`;
  $('#streakPill').innerHTML=`${FLAME}<span>${curStreak()}</span><small>day streak</small>`;
  const gi=goalInfo(),gp=$('#goalPill');
  if(gi){gp.hidden=false;const met=gi.cur>=gi.max;gp.classList.toggle('met',met);gp.innerHTML=`<small>${met?'Goal done!':'Today'} · ${gi.label}</small><div class="bar warm"><i style="width:${Math.min(100,gi.cur/gi.max*100)}%"></i></div>`}else gp.hidden=true;
  $('#playerBtn').innerHTML=`<span class="pname">${esc(G.name||'Player')}</span><small class="grchip">${PACK.grade===0?'K':`${['','1st','2nd','3rd','4th','5th'][PACK.grade]}<span class="grw"> grade</span>`}</small>`;$('#playerBtn').title=`${G.name||'Player'}, ${GRADE_WORD(PACK.grade).toLowerCase()}. Switch player`;
  if(bump){const p=$(bump);p.classList.remove('bump');void p.offsetWidth;p.classList.add('bump')}
}
function award(id){
  if(G.badges.includes(id))return;const b=BADGES.find(x=>x[0]===id);if(!b)return;
  G.badges.push(id);if(S&&S.badges)S.badges.push(id);G.coins+=REW.badge;save();updateStats('#coinPill');sBadge();toast(`New badge: ${b[1]}`,`${b[2]} +${REW.badge} coins`,b[3],'','badge');
}
function gain(c,x,el){
  G.coins+=c;G.xp+=x;if(S){S.coins+=c;S.xp+=x}
  if(c>0){floatText(el,`+${c}`);setTimeout(sCoin,120)}
  updateStats('#coinPill');
  const lv=levelOf(G.xp);if(S&&lv>S.lvNow){S.lvNow=lv;toast(`Level ${lv+1}!`,`You're now a ${TITLES[lv]}!`,'#38b98a');sLevel()}
  if(lv>=4)award('level5');if(G.coins>=500)award('rich');save();
}
function track(q,first,correct,given){
  if(!q||!q.meta)return;const id=q.meta.i;if(first&&S&&S.mode!=='boss'){skAdd(id,q.meta.t,correct);const t0=tierOf(id);rollAdd(id,correct);const t1=tierOf(id);if(t1>t0&&byId(id)){G.tierBest=Object.assign({},G.tierBest||{});if(t1>(G.tierBest[id]||0)){const before=starFor(id);G.tierBest[id]=t1;if(starFor(id)>before)toast(`${starsMini(starFor(id))} ${byId(id).name}!`,`${Math.round(rollAcc(id).acc*100)}% right lately. A new star!`,'#e09a14');grantMastery()}}}const s=G.stats[id]||(G.stats[id]={a:0,c:0});s.a++;if(first&&correct)s.c++;
  const t=today();t.q++;if(first&&correct){t.c++;thisWeek().c++}
  if(!(first&&correct)){
    G.wrongLog.unshift({p:htmlToSpeech(q.prompt).slice(0,140),a:String(q.answer!=null?q.answer:q.kind==='order'?q.items.join(', '):q.kind==='multi'?q.correct.map(k=>{const it=q.items.find(i=>i.id===k);return it&&it.name||(SHAPES[k]||{}).name||k}).join(', '):q.kind==='sort'||q.kind==='rank'?dragAnswer(q):q.kind==='partab'||q.kind==='hilite'||q.kind==='yesno'?kindAnswer(q):q.kind==='money'?fmtM(q.target):q.kind==='angle'?q.target+'°':q.target&&q.target.h?tf(q.target.h,q.target.m):''),i:id,d:dayKey(),...(given?{g:String(given).slice(0,40)}:{}),...(q.meta.t!=null?{t:q.meta.t}:{})});G.wrongLog=G.wrongLog.slice(0,30);
    if(S&&S.mode!=='review'&&id!=='ev'&&!G.review.some(r=>r.s===q.meta.s)&&G.review.filter(r=>r.i===id&&r.t===q.meta.t).length<3){G.review.push({...q.meta,box:0,due:addDays(1)});if(G.review.length>200)G.review.shift()}
  }
  checkWeek();
}
function checkWeek(){const lw=G.weeks[lastWeekKey()],tw=thisWeek(),wk=weekKey();
  if(lw&&lw.c>0&&tw.c>lw.c&&G.weekRewarded!==wk){G.weekRewarded=wk;G.coins+=REW.week;award('week');toast('You beat last week!',`${tw.c} correct answers vs ${lw.c} last week. +${REW.week} coins!`,'#2f9fe0');updateStats('#coinPill')}}

/* time & goal tracking */
let tickN=0;
setInterval(()=>{
  if(document.hidden||Date.now()-lastAct>60000)return;
  if($('#play').hidden&&$('#done').hidden)return;
  today().sec++;tickN++;
  if(tickN%15===0){save(true);updateStats()}
  const gi=goalInfo();if(gi&&gi.cur>=gi.max&&G.goalDone!==dayKey())goalReached();
},1000);
function goalReached(){
  G.goalDone=dayKey();G.chest={from:dayKey()};G.coins+=REW.goal;award('goal');save();updateStats('#goalPill');sWin();burst(innerWidth/2,innerHeight/3,120);
  overlay(`<div class="pipbob" data-fox></div><div class="eyebrow">Daily goal reached!</div><h2>Awesome work${nm()}!</h2><p>You did your learning for today: <b>+${REW.goal} coins</b>! Pip packed a <b>surprise chest</b> for you. Come back tomorrow to open it! From now on, puzzles give fewer coins today. This is a great time for a break. Stretch, drink some water, or go play outside. You can keep playing too if you want!</p><button class="go" type="button" style="align-self:center" onclick="closeOverlay()">Okay!</button>`,()=>setTimeout(()=>foxMove('spin'),200));
}

/* ================= Pip's Lessons: learn the trick first (worked example -> do it together -> try it alone) ================= */
const teachCard=(title,html,btn='Got it!')=>({teach:true,prompt:title,visual:`<div class="lesson">${html}</div>`,choices:[btn],answer:btn,speak:(title+'. '+html.replace(/<svg[\s\S]*?<\/svg>/g,' ')).replace(/<[^>]+>/g,' ')});
const guided=(prompt,ch,hint,explain)=>Object.assign({prompt,hint,explain,guided:true},ch,{numeric:false});
const fr=(n,d)=>`${n}/${d}`;
function jumpsSVG(d,q,r){const n=q*d+r,W=320,x=v=>20+v/n*(W-40);let s=`<line x1="${x(0)}" y1="70" x2="${x(n)}" y2="70" stroke="#1f3557" stroke-width="3"/>`;
  for(let v=0;v<=n;v++)s+=`<line x1="${x(v)}" y1="64" x2="${x(v)}" y2="76" stroke="#1f3557" stroke-width="${v%d===0?2.5:1}"/>`;
  for(let k=0;k<q;k++){const a=x(k*d),b=x((k+1)*d);s+=`<path class="fadein" style="animation-delay:${k*.5}s" d="M${a} 62 Q${(a+b)/2} 18 ${b} 62" fill="none" stroke="#2f9fe0" stroke-width="3"/><text class="fadein" style="animation-delay:${k*.5}s" x="${(a+b)/2}" y="30" text-anchor="middle" ${FONT} font-size="15" fill="#2f9fe0">+${d}</text>`}
  s+=`<rect class="fadein" style="animation-delay:${q*.5}s" x="${x(q*d)}" y="60" width="${x(n)-x(q*d)}" height="20" rx="4" fill="#ff6b57" opacity=".35"/>`;
  [0,q*d,n].forEach(v=>s+=`<text x="${x(v)}" y="98" text-anchor="middle" ${FONT} font-size="15" fill="#1f3557">${v}</text>`);
  return `<svg viewBox="0 0 ${W} 108" style="width:${W}px;max-width:100%">${s}</svg>`}
const pies=(n,d,o)=>`<span class="lpies">${piesRow(n,d,Object.assign({size:84},o||{}))}</span>`;
/* mini passages for the main-idea lesson: [text, main idea, [3 wrong]] */
const MAINIDEA=[
  ['Owls hunt at night. Their big eyes see in the dark. Their soft feathers make no sound when they fly. They can even hear a mouse under the snow.','Owls are built to hunt at night',['Owls have feathers','Mice live under snow','All birds sleep at night']],
  ['Cactus plants store water in their thick stems. Their sharp spines keep thirsty animals away. Long roots spread out to catch every drop of rain.','A cactus can live where water is hard to find',['Cactus spines are sharp','Rain falls in the desert every day','Animals are always thirsty']],
  ['Mia sets her alarm for six. She packs her bag the night before. She lays out her clothes, too. Mia is never late for the school bus.','Mia gets ready early so she is on time',['Mia has a red bag','School buses are yellow','Mia likes her clothes']],
  ['Recycling paper saves trees. Recycling cans saves metal and energy. Recycling plastic keeps it out of the ocean. Every bottle in the blue bin helps.','Recycling helps protect the Earth',['Cans are made of metal','The bin is blue','The ocean is very big']],
  ['Ants work as a team. Some ants find food. Others carry it home. Some take care of the baby ants, and some guard the nest.','Ants share the work in a colony',['Ants carry food','Baby ants are small','Ants live in every country']],
  ['The Gold Rush began in 1848. People heard about gold in California rivers. Thousands came by ship and by wagon. Towns like San Francisco grew very fast.','Finding gold brought many people to California',['Ships are faster than wagons','Rivers have water','San Francisco has many hills']]
];
/* context clue sentences: [sentence, word, meaning, [3 wrong], clue] */
const CONTEXT=[
  ['The <b>fragile</b> glass vase broke when it was only bumped a little.','fragile','easy to break',['very heavy','full of water','very old'],'broke when it was only bumped a little'],
  ['After the long hike, Leo was <b>exhausted</b> and fell asleep right away.','exhausted','very tired',['very hungry','very angry','very happy'],'fell asleep right away'],
  ['The puppy was <b>timid</b>, so it hid behind the couch when guests came.','timid','shy and a little scared',['loud and wild','tall and strong','fast and silly'],'hid behind the couch'],
  ['Please <b>conserve</b> water by turning off the tap while you brush.','conserve','save, not waste',['spill','drink fast','make dirty'],'turning off the tap'],
  ['The desert is <b>arid</b>; it hardly ever rains there.','arid','very dry',['very cold','very green','very loud'],'it hardly ever rains'],
  ['Sam was <b>reluctant</b> to jump in the cold pool and stood at the edge for a long time.','reluctant','not wanting to do something',['excited','ready right away','angry'],'stood at the edge for a long time'],
  ['The ancient castle was built more than a thousand years ago.'.replace('ancient','<b>ancient</b>'),'ancient','very old',['very new','very small','very bright'],'built more than a thousand years ago'],
  ['The soup was so <b>scalding</b> that steam rose and Ava had to wait before tasting it.','scalding','very hot',['very salty','very cold','very sweet'],'steam rose and she had to wait']
];
/* mastery prizes: cannot be bought, only earned with the silver/gold bar */
const MASTERY=[['hat','piechef'],['hat','timescrown'],['glass','sharespecs'],['deco','wordkite'],['balloon','mastergold']];
Object.assign(HATS,{
  piechef:{name:'Pie Chef Hat',price:0,mast:{isl:'frac',tier:2},svg:`<g fill="#fff" stroke="#c3cdd8" stroke-width="1.2"><circle cx="51" cy="91" r="6.5"/><circle cx="69" cy="91" r="6.5"/><circle cx="60" cy="87" r="8"/><rect x="48" y="94" width="24" height="13" rx="2"/></g><path d="M48.6 95 H71.4" stroke="#fff" stroke-width="3"/><g transform="translate(60 101)"><circle r="4.6" fill="#ffd56b" stroke="#e09a14" stroke-width="1"/><path d="M0 0 L0 -4.6 A4.6 4.6 0 0 1 4.4 -1.4Z" fill="#5cc48c"/></g>`},
  timescrown:{name:'Times Table Crown',price:0,mast:{isl:'mult',tier:2},svg:`<path d="M44 107 L44 91 L52 98 L60 86 L68 98 L76 91 L76 107Z" fill="#ffc23d" stroke="#e09a14" stroke-width="1.6" stroke-linejoin="round"/><path d="M56 97 L64 105 M64 97 L56 105" stroke="#e2558f" stroke-width="2.6" stroke-linecap="round"/>`}
});
Object.assign(GLASSES,{
  sharespecs:{name:'Sharing Specs',price:0,mast:{isl:'div',tier:2},svg:`<g fill="#bfe8ff" fill-opacity=".5" stroke="#2f9fe0" stroke-width="1.8"><rect x="46" y="111" width="13" height="10" rx="4"/><rect x="61" y="111" width="13" height="10" rx="4"/></g><path d="M59 115 H61 M46 114 L42.5 112.5 M74 114 L77.5 112.5" stroke="#2f9fe0" stroke-width="1.6"/><g fill="#2f9fe0"><circle cx="52.5" cy="113.6" r=".9"/><circle cx="52.5" cy="118.4" r=".9"/><circle cx="67.5" cy="113.6" r=".9"/><circle cx="67.5" cy="118.4" r=".9"/></g><path d="M50.3 116 H54.7 M65.3 116 H69.7" stroke="#2f9fe0" stroke-width="1.2"/>`}
});
Object.assign(DECOS,{
  wordkite:{name:'Word Kite',price:0,mast:{isl:'words',tier:2},layer:'r',svg:`<path d="M78 118 Q92 112 98 100" stroke="#7a5236" stroke-width="1" fill="none"/><g transform="translate(101 92) rotate(-15)"><path d="M0 -12 L9 0 L0 12 L-9 0Z" fill="#ff9fb7" stroke="#b83a6f" stroke-width="1.2"/><path d="M0 -12 V12 M-9 0 H9" stroke="#b83a6f" stroke-width=".8"/><text x="-4.4" y="-2" font-size="6" font-weight="800" fill="#1f3557">A</text><text x="1.2" y="7" font-size="6" font-weight="800" fill="#1f3557">b</text></g><path d="M101 104 q-3 4 0 7 q3 3 0 6" stroke="#ffc23d" stroke-width="1.5" fill="none"/>`}
});
Object.assign(BALLOONS,{
  mastergold:{name:"Master's Gold",price:0,mast:{gold:3},c:['#ffc23d','#fff1b8'],skirt:'#e09a14',stars:true,starC:'#fff',twk:true}
});
const mastDone=m=>m.gold?STAR_ISLANDS.filter(i=>starFor(i.id)>=3).length>=m.gold:starFor(m.isl)>=m.tier;
const mastLabel=m=>m.gold?`3 stars on ${m.gold} islands`:`${m.tier} star${m.tier>1?'s':''} on ${byId(m.isl).name}`;
function grantMastery(quiet){for(const [k,id] of MASTERY){const it=SHOP[k].items()[id],L=SHOP[k].list();if(it&&!L.includes(id)&&mastDone(it.mast)){L.push(id);if(!quiet)toast(`Mastery prize: ${it.name}!`,`You earned it: ${mastLabel(it.mast)}. Find it in Pip's Closet!`,'#e09a14')}}}

const LESSONS=[
  /* ----- lessons for the Words & World islands ----- */
  {id:'gram_runon',isl:'grammar',types:[],title:'Fixing run-on sentences',
   build(){const i=R(0,GX.pair.length-1),[a,b]=GX.pair[i],c=GX.conj[i];return [
    teachCard('Two ideas need a break',`<p>A <b>run-on</b> squishes two complete ideas together: <i>"The bell rang the kids ran outside."</i></p><p>Fix it 2 ways:</p><p>1. Make <b>two sentences</b>: <i>"The bell rang. The kids ran outside."</i></p><p>2. Join with a <b>comma + and / but / so</b>: <i>"The bell rang, so the kids ran outside."</i></p><p>A comma <b>alone</b> is not enough!</p>`,'Let\'s try one together!'),
    guided(`Is this a run-on? <i>"${a} ${lowerFirst(b)}."</i>`,strChoices('Yes, it has two complete ideas with nothing between them',['No, it is a complete sentence','No, it is a question']),`Find the two "who did what" parts.`,`"${a}" and "${b}" are both complete ideas: it is a <b>run-on</b>.`),
    guided(`Which word could join the two ideas with a comma?`,strChoices(c,['the','because of','very']),`Use and, but, or so.`,`Use a comma and <b>${c}</b>.`),
    guided(`Which is fixed correctly?`,strChoices(`${a}, ${c} ${lowerFirst(b)}.`,[`${a}, ${lowerFirst(b)}.`,`${a} ${c}, ${lowerFirst(b)}.`]),`Comma first, then the joining word.`,`<b>${a}, ${c} ${lowerFirst(b)}.</b>`)]},
   get practice(){const L=GRAMF.length;return [L+1,L+9,L+17]}},
  {id:'gram_adj',isl:'grammar',types:[],title:'Adjective order',
   build(){return [
    teachCard('Opinion, size, age, shape, color, origin, material',`<p>When you use several adjectives, they go in a special order:</p><p class="lbig">opinion → size → age → shape → color → origin → material</p><p><i>a <b>lovely</b> <b>little</b> <b>old</b> <b>red</b> <b>wooden</b> box</i></p><p>Trick: say it out loud. The wrong order sounds funny ("a wooden red little box").</p>`,'Let\'s try one together!'),
    guided(`Which comes first: a <b>size</b> word or a <b>color</b> word?`,strChoices('Size',['Color','It does not matter']),`Opinion, size, age, shape, color...`,`<b>Size</b> comes before color: "a big red ball".`),
    guided(`Which sounds right?`,strChoices('a funny little dog',['a little funny dog','a dog funny little']),`Opinion before size.`,`<b>Funny</b> (opinion) comes before <b>little</b> (size).`),
    guided(`Which sounds right?`,strChoices('a small blue plastic cup',['a plastic small blue cup','a blue plastic small cup']),`Size, color, material.`,`<b>small</b> (size) → <b>blue</b> (color) → <b>plastic</b> (material).`)]},
   get practice(){const L=GRAMF.length;return [L+2,L+10,L+18]}},
  {id:'write_para',isl:'write',types:[1,4,5],title:'The parts of a paragraph',
   build(){return [
    teachCard('Hamburger paragraph',`<p>A good paragraph is like a hamburger:</p><p>🍞 <b>Topic sentence</b> (top bun): the big idea.</p><p>🥬 <b>Details</b> (the middle): facts, reasons or examples that explain the big idea.</p><p>🍞 <b>Ending</b> (bottom bun): sums it up again in new words.</p>`,'Let\'s try one together!'),
    guided(`Which sentence is the best <b>topic sentence</b>?`,strChoices('Dogs make great pets for many reasons.',['My dog is named Max.','Dogs have four legs.','Some dogs are brown.']),`The topic sentence tells the big idea of the whole paragraph.`,`"<b>Dogs make great pets for many reasons.</b>" gives the big idea.`),
    guided(`Topic: <b>"Dogs make great pets."</b> Which detail supports it?`,strChoices('Dogs are loyal and love to play with their families.',['Cats like to sleep a lot.','My friend has a bike.','Dogs were around long ago.']),`A detail explains WHY the big idea is true.`,`Being <b>loyal and playful</b> is a reason dogs are great pets.`),
    guided(`Which is the best <b>ending</b>?`,strChoices('That is why a dog can be a wonderful friend.',['Dogs have four legs.','Some dogs bark.','The end.']),`The ending sums up the big idea in new words.`,`"<b>That is why a dog can be a wonderful friend.</b>" wraps it up.`)]},
   practice:[1,4,5]},
  {id:'write_revise',isl:'write',types:[8,9],title:'Revising like a writer',
   build(){return [
    teachCard('Cut, swap and check',`<p>When you <b>revise</b>, you make your writing better:</p><p>✂️ <b>Cut</b> sentences that are not about the topic.</p><p>🔁 <b>Swap</b> weak words (good, nice, big, went) for precise ones (delicious, gentle, enormous, sprinted).</p><p>✅ <b>Check</b> that every sentence starts with a capital and ends with a mark.</p>`,'Let\'s try one together!'),
    guided(`Topic: <b>Our trip to the beach.</b> Which sentence should be <b>cut</b>?`,strChoices('My cousin likes video games.',['We built a huge sandcastle.','The waves were cold and splashy.','We found three shells.']),`Which one is not about the beach trip?`,`"<b>My cousin likes video games.</b>" is not about the trip.`),
    guided(`Swap the weak word: <i>"The cake was <u>good</u>."</i>`,strChoices('delicious',['okay','fine','nice']),`Which word tells exactly how good?`,`<b>Delicious</b> paints a clearer picture.`),
    guided(`Swap the weak word: <i>"Max <u>went</u> to the door when the bell rang."</i>`,strChoices('raced',['moved','got','did']),`Which verb shows HOW he moved?`,`<b>Raced</b> shows he moved fast and excited.`)]},
   practice:[8,9,8]},
  {id:'sci_graph',isl:'science',types:[],title:'Reading a science experiment',
   build(){return [
    teachCard('What changed? What was measured?',`<p>In an experiment, scientists <b>change one thing</b> on purpose and <b>measure</b> what happens.</p><p>On a graph: the thing they <b>changed</b> is along the <b>bottom</b>. What they <b>measured</b> goes <b>up the side</b>.</p><p>Then look at the bars: do they go up, down or stay the same?</p>`,'Let\'s try one together!'),
    guided(`Kids rolled a car down ramps of different heights and measured how far it went. What did they <b>change</b>?`,strChoices('The ramp height',['How far the car rolled','The color of the car']),`What did they set differently each time?`,`They changed the <b>ramp height</b>.`),
    guided(`What did they <b>measure</b>?`,strChoices('How far the car rolled',['The ramp height','The day of the week']),`What did they write down after each try?`,`They measured <b>how far the car rolled</b>.`),
    guided(`The bars get taller as the ramp gets higher. What does that show?`,strChoices('Higher ramps make the car roll farther',['Higher ramps make the car slower','Nothing changes']),`Taller bars = bigger results.`,`<b>Higher ramp → more energy → the car rolls farther.</b>`)]},
   get practice(){const L=SCIENCE.length;return [L,L+11,L+22]}},
  {id:'geo_latlong',isl:'geo',types:[5],title:'Latitude and longitude',
   build(){return [
    teachCard('Lines on the map',`<p><b>Latitude</b> lines go <b>across</b> (like the rungs of a ladder 🪜). They tell how far <b>north</b> you are: 32°N, 34°N...</p><p><b>Longitude</b> lines go <b>up and down</b>. They tell how far <b>west</b>: 118°W, 120°W...</p><p>Find a place: read the line across, then the line up and down.</p>`,'Let\'s try one together!'),
    guided(`Which lines go <b>across</b> the map?`,strChoices('Latitude',['Longitude','The equator only']),`Ladder rungs go across.`,`<b>Latitude</b> lines go across.`),
    guided(`A place is at <b>38°N</b>. Which kind of line is that?`,strChoices('Latitude (north)',['Longitude (west)','A road']),`N means north. North and south are measured with latitude.`,`<b>N</b> = north = <b>latitude</b>.`),
    guided(`Los Angeles is near 34°N, 118°W. San Francisco is near 38°N, 122°W. Which city is farther <b>north</b>?`,strChoices('San Francisco',['Los Angeles','They are the same']),`A bigger °N number is farther north.`,`38°N is more than 34°N, so <b>San Francisco</b> is farther north.`)]},
   practice:[5,5,5]},
  {id:'hist_timeline',isl:'history',types:[],title:'California history in order',
   build(){return [
    teachCard('A timeline of California',`<p>🏹 <b>Long ago:</b> many Native tribes live all over California.</p><p>⛪ <b>1769:</b> the first Spanish mission is built in San Diego.</p><p>🇲🇽 <b>1821:</b> Mexico becomes free from Spain; California is part of Mexico.</p><p>⛏️ <b>1848:</b> gold is found at Sutter's Mill: the Gold Rush!</p><p>⭐ <b>1850:</b> California becomes the 31st state.</p><p>🚂 <b>1869:</b> the railroad connects California to the East.</p>`,'Let\'s try one together!'),
    guided(`Which came <b>first</b>?`,strChoices('The first mission was built',['The Gold Rush started','The railroad was finished']),`Look at the years: 1769, 1848, 1869.`,`The first mission came first, in <b>1769</b>.`),
    guided(`Gold was found in <b>1848</b>. What happened two years later, in <b>1850</b>?`,strChoices('California became a state',['The first mission was built','Mexico became free from Spain']),`Look at the timeline after 1848.`,`In <b>1850</b> California became the 31st state.`),
    guided(`Who lived in California <b>before</b> the missions?`,strChoices('Many Native American tribes',['Nobody','Gold miners']),`Look at the very top of the timeline.`,`<b>Native tribes</b> lived all over California long before 1769.`)]},
   practice:[3,15,30]},
  {id:'listen_tips',isl:'listen',types:[],title:'How to listen carefully',
   build(){const C=LISTEN[0];return [
    teachCard('Listen like a detective',`<p>👂 <b>Before</b> you listen: read the title. What will it be about?</p><p>🔢 <b>While</b> you listen: catch the <b>topic</b>, <b>numbers</b>, <b>names</b> and words like <b>first, because, only</b>.</p><p>🔁 You can press <b>Listen again</b>. Good listeners listen twice!</p>`,'Let\'s try one together!'),
    Object.assign(guided(`Press <b>Listen</b>. What is this talk mostly about?`,strChoices('Hummingbirds',['Penguins','Flowers']),`Listen for the topic in the first sentence.`,`It is about <b>hummingbirds</b>.`),{visual:listenCard(C),listen:C.txt}),
    Object.assign(guided(`Listen again for a <b>number</b>. How many times a second can their wings beat?`,strChoices('up to 80',['up to 8','up to 800']),`Numbers are important clues!`,`Their wings beat <b>up to eighty times a second</b>.`),{visual:listenCard(C),listen:C.txt}),
    Object.assign(guided(`Listen for the word <b>"only"</b>. What can only hummingbirds do?`,strChoices('fly backward',['sing','swim']),`"Only" tells you something special.`,`They are the only birds that can <b>fly backward</b>.`),{visual:listenCard(C),listen:C.txt})]},
   practice:[3,6,9]},
  {id:'mult_break',isl:'mult',types:[0,2],title:'Break it apart!',
   build(){const a=R(2,4)*10+R(1,9),b=R(3,6),T=a-a%10,O=a%10;return [
    teachCard('Big multiplying = small multiplying, added up!',`<p>To find <b>3 × 24</b>, break 24 into <b>20 + 4</b>.</p>${multAnim(24,[20,4],3)}<p>3 × 20 = 60 and 3 × 4 = 12. Add them: <b>60 + 12 = 72</b>.</p>`),
    teachCard('The secret',`<p>Tens first, then ones, then <b>add</b>. That works for any big number!</p><p class="lbig">3 × 24 = 3 × 20 + 3 × 4</p>`,'Let\'s try one together!'),
    guided(`Let's find <b>${b} × ${a}</b> together. First, break <b>${a}</b> into tens and ones.`,strChoices(`${T} + ${O}`,[`${T+10} + ${O}`,`${T/10} + ${O}`,`${T} + ${O+1}`]),`${a} has ${T/10} tens and ${O} ones.`,`${a} = <b>${T} + ${O}</b>.`),
    guided(`Multiply the tens: <b>${b} × ${T} = ?</b>`,numChoices(b*T,[b*T+b,b*(T/10),b*T-10,b*T+10]),`${b} × ${T/10} = ${b*T/10}. Now put the zero back.`,`${b} × ${T} = <b>${b*T}</b>.`),
    guided(`Multiply the ones: <b>${b} × ${O} = ?</b>`,numChoices(b*O,[b*O+b,b+O,b*O-1]),`Think of ${b} groups of ${O}.`,`${b} × ${O} = <b>${b*O}</b>.`),
    guided(`Now add the two parts: <b>${b*T} + ${b*O} = ?</b>`,numChoices(b*a,[b*T+b*O+10,b*T+O,b*a-10]),`Add the tens and the ones.`,`So <b>${b} × ${a} = ${b*a}</b>. You did it!`)]},
   practice:[0,0,2]},
  {id:'mult_tens',isl:'mult',types:[3],title:'Zeros are easy!',
   build(){const a=R(2,9),c=R(2,9),a2=R(2,9),c2=R(2,9);return [
    teachCard('Hide the zeros, then bring them back',`<p class="lbig">4 × 30 = ?</p><p>Hide the zero: <b>4 × 3 = 12</b>. Bring the zero back: <b>120</b>.</p><p class="lbig">4 × 300 = 1,200</p><p>Two zeros hidden, two zeros back!</p>`,'Let\'s try one together!'),
    guided(`Start with the small fact: <b>${a} × ${c} = ?</b>`,numChoices(a*c,[a*c+a,a+c,a*c-c]),`Use your times tables.`,`${a} × ${c} = <b>${a*c}</b>.`),
    guided(`Now bring the zero back: <b>${a} × ${c*10} = ?</b>`,numChoices(a*c*10,[a*c,a*c*100,a*c*10+10]),`One zero was hidden, so put one zero back.`,`${a} × ${c*10} = <b>${fmt(a*c*10)}</b>.`),
    guided(`Your turn with two zeros: <b>${a2} × ${c2*100} = ?</b>`,numChoices(a2*c2*100,[a2*c2*10,a2*c2*1000,a2*c2*100+100]),`${a2} × ${c2} = ${a2*c2}. Then put two zeros back.`,`${a2} × ${c2*100} = <b>${fmt(a2*c2*100)}</b>.`)]},
   practice:[3,3,3]},
  {id:'mult_2x2',isl:'mult',types:[1],title:'Two-digit times two-digit',
   build(){const a=R(12,19),b=R(12,19),o=b-10;return [
    teachCard('Split one number into 10 and the rest',`<p>To find <b>13 × 14</b>, split 14 into <b>10 + 4</b>.</p>${multAnim(14,[10,4],13)}<p>13 × 10 = 130 and 13 × 4 = 52. Add: <b>130 + 52 = 182</b>.</p>`,'Let\'s try one together!'),
    guided(`Let's find <b>${a} × ${b}</b>. Split <b>${b}</b> into 10 and the rest.`,strChoices(`10 + ${o}`,[`${o} + ${o}`,`1 + ${o}`,`10 + ${o+1}`]),`${b} = 10 + something.`,`${b} = <b>10 + ${o}</b>.`),
    guided(`<b>${a} × 10 = ?</b>`,numChoices(a*10,[a+10,a*100,a*10+a]),`Times 10: just add a zero.`,`${a} × 10 = <b>${a*10}</b>.`),
    guided(`<b>${a} × ${o} = ?</b>`,numChoices(a*o,[a*o+a,a+o,a*o-o]),`Break ${a} into 10 + ${a-10}: 10 × ${o} = ${10*o}, ${a-10} × ${o} = ${(a-10)*o}.`,`${a} × ${o} = <b>${a*o}</b>.`),
    guided(`Add the parts: <b>${a*10} + ${a*o} = ?</b>`,numChoices(a*b,[a*b+10,a*10+o,a*b-a]),`Add tens and ones.`,`So <b>${a} × ${b} = ${a*b}</b>. Amazing!`)]},
   practice:[1,1,1]},
  {id:'div_share',isl:'div',types:[0,2],title:'Share in friendly parts',
   build(){const d=R(2,5),q=R(11,Math.floor(60/d)),n=q*d,t=Math.floor(n/(d*10))*d*10,rest=n-t;return [
    teachCard('Big sharing = small sharings, added up!',`<p>Share <b>72</b> cookies with <b>3</b> friends.</p><p class="lbig">72 = 60 + 12</p><p>60 ÷ 3 = <b>20</b> and 12 ÷ 3 = <b>4</b>. Each friend gets <b>20 + 4 = 24</b>.</p><p>Pick a first part that is <b>easy to share</b> (like 30, 60, 90 for 3 friends).</p>`,'Let\'s try one together!'),
    guided(`Share <b>${n}</b> by <b>${d}</b>. We split ${n} into <b>${t} + ${rest}</b>. What is <b>${t} ÷ ${d}</b>?`,numChoices(t/d,[t/d+10,t/d+1,t]),`${d} × ${t/d/10} = ${t/10}, so ${d} × ${t/d} = ${t}.`,`${t} ÷ ${d} = <b>${t/d}</b>.`),
    guided(`Now the small part: <b>${rest} ÷ ${d} = ?</b>`,numChoices(rest/d,[rest/d+1,rest/d+2,rest]),`Which number times ${d} makes ${rest}?`,`${rest} ÷ ${d} = <b>${rest/d}</b>.`),
    guided(`Add them: <b>${t/d} + ${rest/d} = ?</b> That is ${n} ÷ ${d}.`,numChoices(q,[q+1,q+10,q-1]),`Add the two answers.`,`So <b>${n} ÷ ${d} = ${q}</b>. Check: ${d} × ${q} = ${n}!`)]},
   practice:[0,0,2]},
  {id:'div_left',isl:'div',types:[1,3],title:'Leftovers!',
   build(){const d=R(3,6),q=R(2,5),r=R(1,d-1),n=q*d+r;return [
    teachCard('Jump by the number you share by',`<p><b>17 ÷ 5</b>: jump by 5s. 5, 10, 15... the next jump (20) is too far!</p>${jumpsSVG(5,3,2)}<p>3 jumps, and <b>2 are left over</b>. So 17 ÷ 5 = <b>3 R2</b>.</p>`,'Let\'s try one together!'),
    guided(`<b>${n} ÷ ${d}</b>. Jump by ${d}s. What is the <b>last jump</b> that is not bigger than ${n}?`,numChoices(q*d,[(q+1)*d,(q-1)*d,n]),`Count: ${d}, ${2*d}, ${3*d}...`,`${Array.from({length:q},(_,i)=>(i+1)*d).join(', ')}. The last one is <b>${q*d}</b>.`),
    guided(`How many <b>jumps</b> did we make?`,numChoices(q,[q+1,q-1>0?q-1:q+2,d]),`Count the jumps up to ${q*d}.`,`${q} jumps of ${d} make ${q*d}.`),
    guided(`How many are <b>left over</b>? ${n} − ${q*d} = ?`,numChoices(r,[r+1,d,q]),`Take ${q*d} away from ${n}.`,`<b>${r}</b> left over.`),
    guided(`So <b>${n} ÷ ${d} = ?</b>`,strChoices(`${q} R${r}`,[`${q+1} R${r}`,`${r} R${q}`,`${q} R${r===d-1?r-1:r+1}`]),`Jumps first, then the leftover.`,`<b>${n} ÷ ${d} = ${q} R${r}</b>.`)]},
   practice:[1,1,3]},
  {id:'frac_same',isl:'frac',types:[0,1],title:'Same amount, more pieces',
   build(){const [a,b]=pick([[1,2],[1,3],[2,3],[1,4],[3,4]]),k=R(2,4),k2=k===2?3:2;return [
    teachCard('Cut every piece again',`<div class="lrow">${pies(1,2)}<span class="lbig">=</span>${pies(2,4)}<span class="lbig">=</span>${pies(4,8)}</div><p class="lc lbig">${frac(1,2)} = ${frac(2,4)} = ${frac(4,8)}</p><p>The shaded part stays the same!</p><p>Cut every piece in 2: <b>twice as many pieces</b>, and <b>twice as many shaded</b>.</p><p>Rule: multiply the top <b>and</b> the bottom by the <b>same</b> number.</p>`,'Let\'s try one together!'),
    guided(`${frac(a,b)} = ${frac('?',b*k)}. The bottom got ${k} times bigger (${b} × ${k} = ${b*k}). What is the new top? <b>${a} × ${k} = ?</b>`,numChoices(a*k,[a+k,a*k+1,b*k]),`Do the same to the top as to the bottom.`,`${frac(a,b)} = <b>${frac(a*k,b*k)}</b>.`),
    Object.assign(guided(`Which fraction is the <b>same amount</b> as ${frac(a,b)}?`,strChoices(fr(a*k2,b*k2),[fr(a+k2,b+k2),fr(a*k2,b),fr(a,b*k2)]),`Multiply top and bottom by the same number.`,`${frac(a,b)} = ${frac(a*k2,b*k2)}: both were multiplied by ${k2}.`),{render:fracText})]},
   practice:[1,1,0]},
  {id:'frac_compare',isl:'frac',types:[2],title:'Which fraction is bigger?',
   build(){const d=pick([5,6,8]),x=R(1,d-2),y=R(x+1,d-1),n=R(1,2),p=pick([3,4,5]),q=p+R(2,4);const lo=pick([[1,4],[2,5],[3,8]]),hi=pick([[3,4],[4,6],[5,8]]);return [
    teachCard('Three tricks to compare',`<p><b>1. Same bottom:</b> the bigger top wins.</p><div class="lrow">${pies(5,8)}<span class="lbig">${frac(5,8)} &gt; ${frac(3,8)}</span>${pies(3,8)}</div><p><b>2. Same top:</b> the smaller bottom wins, because its pieces are bigger!</p><div class="lrow">${pies(1,3)}<span class="lbig">${frac(1,3)} &gt; ${frac(1,5)}</span>${pies(1,5)}</div><p><b>3. Different?</b> Compare each one to one half.</p>`,'Let\'s try!'),
    Object.assign(guided(`Same bottom! Which is bigger?`,strChoices(fr(y,d),[fr(x,d)],2),`Same size pieces: more pieces is more.`,`${frac(y,d)} is bigger: ${y} pieces beat ${x}.`),{render:fracText}),
    Object.assign(guided(`Same top! Which is bigger?`,strChoices(fr(n,p),[fr(n,q)],2),`Fewer pieces in the whole means each piece is bigger.`,`${frac(n,p)} is bigger: a whole cut in ${p} has bigger pieces than one cut in ${q}.`),{render:fracText}),
    Object.assign(guided(`Compare to one half. Which is bigger?`,strChoices(fr(...hi),[fr(...lo)],2),`Is it more or less than half of its bottom number?`,`${frac(...hi)} is more than ${frac(1,2)}, and ${frac(...lo)} is less. So ${frac(...hi)} wins.`),{render:fracText})]},
   practice:[2,2,2]},
  {id:'frac_add',isl:'frac',types:[3,4],title:'Adding and taking away pieces',
   build(){const d=pick([5,6,8]),a=R(1,d-3),b=R(1,d-1-a),c=R(3,d-1),e=R(1,c-1);return [
    teachCard('Same size pieces? Just count them!',`<div class="lrow">${pies(5,8,{split:2,color2:true})}</div><p>${frac(2,8)} + ${frac(3,8)} = ${frac(5,8)}: 2 pieces and 3 pieces make <b>5 pieces</b>.</p><p>The bottom number <b>stays the same</b>, because the pieces are still eighths!</p>`,'Let\'s try one together!'),
    guided(`${frac(a,d)} + ${frac(b,d)}. Add the tops: <b>${a} + ${b} = ?</b>`,numChoices(a+b,[a+b+1,a*b>0&&a*b!==a+b?a*b:a+b+2,d]),`Count the pieces.`,`${a} + ${b} = <b>${a+b}</b> pieces.`),
    Object.assign(guided(`So ${frac(a,d)} + ${frac(b,d)} = ?`,strChoices(fr(a+b,d),[fr(a+b,d+d),fr(a+b,d+1),fr(a*b||1,d)]),`The bottom number stays the same.`,`${frac(a,d)} + ${frac(b,d)} = <b>${frac(a+b,d)}</b>.`),{render:fracText}),
    Object.assign(guided(`Taking away works the same way: ${frac(c,d)} − ${frac(e,d)} = ?`,strChoices(fr(c-e,d),[fr(c+e,d),fr(c-e,d-e),fr(c,d-e)]),`Subtract the tops. Keep the bottom.`,`${c} − ${e} = ${c-e}, so the answer is <b>${frac(c-e,d)}</b>.`),{render:fracText})]},
   practice:[3,4,3]},
  {id:'area_inout',isl:'area',types:[0,1],title:'Inside or around?',
   build(){const w=R(3,6),l=R(w+1,9),A=l*w,P=2*(l+w);return [
    teachCard('Area is inside. Perimeter is around.',`<p><b>Area</b> = how many squares cover the <b>inside</b>. Multiply: length × width.</p><div class="lrow">${areaAnim(5,3)}</div><p class="lc lbig">5 × 3 = 15 square feet</p><p><b>Perimeter</b> = the fence <b>around</b> the outside. Add all four sides.</p><div class="lrow">${periAnim(5,3)}</div><p class="lc lbig">5 + 3 + 5 + 3 = 16 feet</p>`,'Let\'s try one together!'),
    Object.assign(guided(`Pip wants grass to <b>cover</b> the whole patch. Is that area or perimeter?`,strChoices('Area',['Perimeter'],2),`Covering the inside means squares.`,`Covering the inside = <b>area</b>.`),{visual:rectVis(l,w,`${l} ft`,`${w} ft`)}),
    Object.assign(guided(`Find the <b>area</b>: <b>${l} × ${w} = ?</b>`,numChoices(A,[P,l+w,A+l]),`${w} rows of ${l} squares.`,`${l} × ${w} = <b>${A} square feet</b>.`),{visual:areaAnim(l,w)}),
    Object.assign(guided(`Now the fence <b>around</b> it. Add all four sides: <b>${l} + ${w} + ${l} + ${w} = ?</b>`,numChoices(P,[A,l+w,P+2]),`Two long sides and two short sides.`,`${l} + ${w} + ${l} + ${w} = <b>${P} feet</b>.`),{visual:periAnim(l,w)})]},
   practice:[0,1,1]},
  {id:'area_side',isl:'area',types:[2,3],title:'Find the missing side',
   build(){const w=R(3,7),l=R(w+1,10),A=l*w,P=2*(l+w);return [
    teachCard('Work backwards!',`<p><b>Area is 24</b> and one side is <b>4</b>. Think: <b>4 × ? = 24</b>. That is 24 ÷ 4 = <b>6</b>.</p><p><b>The fence is 20</b> and the short side is <b>4</b>. Both short sides use 4 + 4 = 8. That leaves 20 − 8 = 12 for the <b>two</b> long sides, so each one is 12 ÷ 2 = <b>6</b>.</p>`,'Let\'s try one together!'),
    Object.assign(guided(`The area is <b>${A} sq ft</b> and one side is <b>${w} ft</b>. Which question finds the other side?`,strChoices(`${w} × ? = ${A}`,[`${w} + ? = ${A}`,`${A} × ${w} = ?`,`${A} + ${w} = ?`]),`Area = length × width.`,`Area = length × width, so <b>${w} × ? = ${A}</b>.`),{visual:rectVis(l,w,'? ft',`${w} ft`)}),
    guided(`<b>${A} ÷ ${w} = ?</b>`,numChoices(l,[l+1,l-1,A-w]),`Which number times ${w} makes ${A}?`,`${A} ÷ ${w} = <b>${l}</b>. Check: ${l} × ${w} = ${A}.`),
    Object.assign(guided(`Now a fence of <b>${P} ft</b>, short side <b>${w} ft</b>. Take away both short sides: <b>${P} − ${2*w} = ?</b>`,numChoices(P-2*w,[P-w,P-2*w+2,P/2]),`The two short sides use ${w} + ${w} = ${2*w}.`,`${P} − ${2*w} = <b>${P-2*w}</b> feet for the two long sides.`),{visual:rectVis(l,w,'? ft',`${w} ft`)}),
    guided(`Share that between the two long sides: <b>${P-2*w} ÷ 2 = ?</b>`,numChoices(l,[P-2*w,l+2,l-1]),`Half of ${P-2*w}.`,`Each long side is <b>${l} feet</b>.`)]},
   practice:[2,3,3]},
  {id:'meas_convert',isl:'measure',types:[0,4],title:'Big unit to small unit',
   build(){const c=pick(CONV.filter(x=>x.f<=60)),n=R(2,6),h=R(1,3),m=R(1,11)*5;return [
    teachCard('One big unit = many small ones',`<p class="lbig">1 foot = 12 inches</p><p>So <b>3 feet</b> = 12 + 12 + 12 = 3 × 12 = <b>36 inches</b>.</p><p>Going from a <b>big</b> unit to a <b>small</b> unit, the number gets <b>bigger</b>. So we <b>multiply</b>.</p><p>Hours too: <b>2 hours 15 minutes</b> = 2 × 60 + 15 = <b>135 minutes</b>.</p>`,'Let\'s try one together!'),
    guided(`1 ${c.big} = ${c.f} ${c.small}. In <b>${n} ${c.bigs}</b>, are there more or fewer than ${n} ${c.small}?`,strChoices(`More than ${n}`,[`Fewer than ${n}`],2),`Each ${c.big} holds lots of ${c.small}.`,`The ${c.small} are small, so we need <b>more</b> of them.`),
    guided(`So multiply: <b>${n} × ${c.f} = ?</b>`,numChoices(n*c.f,[n+c.f,n*c.f+c.f,n*10]),`${n} groups of ${c.f}.`,`${n} ${c.bigs} = <b>${n*c.f} ${c.small}</b>.`),
    guided(`Pip read for <b>${h} hour${h>1?'s':''} ${m} minutes</b>. First the hours: <b>${h} × 60 = ?</b> minutes`,numChoices(h*60,[h*100,h*60+60,h+60]),`1 hour = 60 minutes.`,`${h} × 60 = <b>${h*60}</b> minutes.`),
    guided(`Add the extra minutes: <b>${h*60} + ${m} = ?</b>`,numChoices(h*60+m,[h*100+m,h*60,h*60+m+10]),`Just add them.`,`<b>${h*60+m} minutes</b> in all.`)]},
   practice:[0,4,0]},
  {id:'meas_same',isl:'measure',types:[1,2],title:'Same units first',
   build(){const n=R(3,6),cut=R(5,n*12-5),k=R(2,4),inch=k*12+(coin()?R(1,6):-R(1,6)),big=inch>k*12;return [
    teachCard('Change to the same unit, then compare',`<p>Which is longer: <b>2 feet</b> or <b>20 inches</b>?</p><p>Change the feet to inches: 2 × 12 = <b>24 inches</b>. 24 inches is more than 20 inches, so <b>2 feet</b> is longer!</p><p>Feet and inches mixed in one problem? Change everything to <b>inches</b> first.</p>`,'Let\'s try one together!'),
    guided(`Which is more: <b>${k} feet</b> or <b>${inch} inches</b>? First change: <b>${k} feet = ? inches</b>`,numChoices(k*12,[k*10,k+12,k*12+12]),`1 foot = 12 inches.`,`${k} × 12 = <b>${k*12} inches</b>.`),
    guided(`${k} feet = ${k*12} inches. So which is more?`,strChoices(big?`${inch} inches`:`${k} feet`,[big?`${k} feet`:`${inch} inches`],2),`Compare ${k*12} and ${inch}.`,`${k*12} ${big?'&lt;':'&gt;'} ${inch}, so <b>${big?inch+' inches':k+' feet'}</b> is more.`),
    guided(`A rope is <b>${n} feet</b> long. Pip cuts off <b>${cut} inches</b>. Change the rope to inches: <b>${n} × 12 = ?</b>`,numChoices(n*12,[n*10,n+12,n*12-12]),`1 foot = 12 inches.`,`${n} feet = <b>${n*12} inches</b>.`),
    guided(`Now take away: <b>${n*12} − ${cut} = ?</b>`,numChoices(n*12-cut,[n*12+cut,n*12-cut+12,Math.abs(n*10-cut)]),`Subtract the part he cut off.`,`<b>${n*12-cut} inches</b> are left.`)]},
   practice:[1,2,2]},
  {id:'money_count',isl:'money',types:[0,1],title:'Count the big coins first',
   build(){const q=R(1,3),d=R(1,3),nk=R(0,1),p=R(1,4),tot=q*25+d*10+nk*5+p,set=[...Array(q).fill(25),...Array(d).fill(10),...Array(nk).fill(5),...Array(p).fill(1)],pay=R(6,19)*5,nq=Math.floor(pay/25),vis=`<div class="coins">${set.map(v=>coinSVG(v,60)).join('')}</div>`;return [
    teachCard('Biggest first, then count on',`<div class="coins">${[25,25,10,5,1,1].map(v=>coinSVG(v,52)).join('')}</div><p>Quarters first: <b>25, 50</b>. Then the dime: <b>60</b>. The nickel: <b>65</b>. Pennies: <b>66, 67</b>.</p><p class="lc lbig">67¢ = $0.67</p><p>Paying? Same idea: start with the <b>biggest</b> coin that still fits.</p>`,'Let\'s try one together!'),
    Object.assign(guided(`Start with the <b>quarters</b>. How much are they?`,numChoices(q*25,[q*25+25,q*10,q*5]),`Count by 25s: 25, 50, 75.`,`${q} quarter${q>1?'s':''} = <b>${q*25}¢</b>.`),{visual:vis}),
    Object.assign(guided(`Count on with the dimes: ${q*25}, ${Array.from({length:d},(_,i)=>i<d-1?q*25+(i+1)*10:'?').join(', ')}`,numChoices(q*25+d*10,[q*25+d,q*25+d*10+10,q*25+d*5]),`Each dime adds 10.`,`${q*25} + ${d*10} = <b>${q*25+d*10}¢</b>.`),{visual:vis}),
    Object.assign(guided(`Count on with ${nk?'the nickel and ':''}the pennies. How much in all?`,strChoices(fmtM(tot),[fmtM(tot+10),fmtM(tot-p),fmtM(tot+5)]),`${nk?'The nickel adds 5, then e':'E'}ach penny adds 1.`,`${set.map(v=>v+'¢').join(' + ')} = <b>${fmtM(tot)}</b>.`),{visual:vis}),
    guided(`To pay <b>${pay}¢</b>, start with quarters. How many quarters fit?`,numChoices(nq,[nq+1,nq-1,pay%25||nq+2]),`25, 50, 75... stop before you go over ${pay}.`,`${nq} quarter${nq>1?'s':''} = ${nq*25}¢. Then ${pay-nq*25}¢ more with smaller coins.`)]},
   practice:[1,0,1]},
  {id:'money_change',isl:'money',types:[2,3],title:'Count up to make change',
   build(){const p=R(2,4)*100+R(1,19)*5,D=Math.ceil(p/100)*100,up=D-p,ch=500-p,a=R(1,4)*100+R(1,19)*5,b=R(1,3)*100+R(1,19)*5;return [
    teachCard('Count up from the price',`<p>A kite costs <b>$3.65</b>. Pip pays with <b>$5.00</b>.</p><p>Count up: $3.65 → <b>$4.00</b> is 35¢. Then $4.00 → <b>$5.00</b> is $1.00.</p><p class="lc lbig">35¢ + $1.00 = $1.35 change</p><p>Adding prices? Add the dollars, then the cents. <b>100¢ makes $1</b>.</p>`,'Let\'s try one together!'),
    guided(`A toy costs <b>${fmtM(p)}</b>. Pip pays <b>$5.00</b>. Count up to the next whole dollar: ${fmtM(p)} → ${fmtM(D)} is how much?`,strChoices(fmtM(up),[fmtM(up+10),fmtM(100-up),fmtM(up+5)]),`How many cents to get to ${fmtM(D)}?`,`${fmtM(p)} + <b>${up}¢</b> = ${fmtM(D)}.`),
    guided(`Now count up from ${fmtM(D)} to $5.00.`,strChoices(fmtM(500-D),[fmtM(500-D+100),fmtM(D),fmtM(500-D+50)]),`Count the whole dollars.`,`${fmtM(D)} → $5.00 is <b>${fmtM(500-D)}</b>.`),
    guided(`Add the two parts: <b>${up}¢ + ${fmtM(500-D)}</b> = the change.`,strChoices(fmtM(ch),[fmtM(ch+100),fmtM(ch-10),fmtM(up)]),`Put the cents and the dollars together.`,`The change is <b>${fmtM(ch)}</b>. Check: ${fmtM(p)} + ${fmtM(ch)} = $5.00.`),
    guided(`Pip buys two things: <b>${fmtM(a)}</b> and <b>${fmtM(b)}</b>. How much in all?`,strChoices(fmtM(a+b),[fmtM(a+b-100),fmtM(a+b+100),fmtM(a+b+10)]),`Dollars first, then cents. 100¢ makes $1.`,`${fmtM(a)} + ${fmtM(b)} = <b>${fmtM(a+b)}</b>.`)]},
   practice:[2,3,2]},
  {id:'pat_jump',isl:'pattern',types:[0,1],title:'Find the jump',
   build(){const a=R(2,20),s=R(3,9),seq=[0,1,2,3].map(k=>a+k*s),a2=R(1,4),m=pick([2,3]),g=[0,1,2,3].map(k=>a2*m**k),sq=x=>`<div class="seq">${x.map(v=>`<span>${v}</span>`).join('')}<span class="q">?</span></div>`;return [
    teachCard('Look at the jump between neighbors',`<div class="seq"><span>5</span><span>9</span><span>13</span><span>17</span><span class="q">?</span></div><p>9 − 5 = <b>4</b>, 13 − 9 = <b>4</b>, 17 − 13 = <b>4</b>. The same jump every time, so the rule is <b>Add 4</b>. Next: 17 + 4 = <b>21</b>.</p><p>Jumps getting bigger and bigger (2, 4, 8, 16)? Try <b>multiplying</b>: × 2.</p>`,'Let\'s try one together!'),
    Object.assign(guided(`What is the jump? <b>${seq[1]} − ${seq[0]} = ?</b>`,numChoices(s,[s+1,s-1,seq[1]]),`Subtract the first number from the second.`,`The jump is <b>${s}</b>. Check the others: it is ${s} every time.`),{visual:sq(seq)}),
    Object.assign(guided(`So what comes next? <b>${seq[3]} + ${s} = ?</b>`,numChoices(a+4*s,[a+4*s+1,a+4*s-1,seq[3]+2*s]),`Add the jump to the last number.`,`${seq[3]} + ${s} = <b>${a+4*s}</b>. The rule is <b>Add ${s}</b>.`),{visual:sq(seq)}),
    Object.assign(guided(`These jumps keep growing. What is the rule?`,strChoices(`Multiply by ${m}`,[`Add ${g[1]-g[0]}`,`Multiply by ${m+1}`,`Add ${m}`]),`Is each number ${m} times the one before?`,`${g.join(' → ')}: each one is <b>${m} times</b> the one before. Next is ${g[3]*m}.`),{visual:sq(g)})]},
   practice:[0,1,0]},
  {id:'pat_factor',isl:'pattern',types:[2,3,4],title:'Factors, multiples and primes',
   build(){const n=pick([12,18,20,24,30,36]),fs=[];for(let f=2;f<n;f++)if(n%f===0)fs.push(f);const f=pick(fs.filter(x=>x<=10)),nf=pick([4,5,7,8,9,10].filter(x=>n%x)),k=R(3,9),mm=k*R(3,8),p=pick([7,11,13,17,19,23]),cs=shuffle([9,15,21,25,27,33,35,39]).slice(0,3);return [
    teachCard('Factor, multiple, prime',`<p><b>Factors</b> of 12 split it evenly: 1, 2, 3, 4, 6, 12 (because 2 × 6 = 12 and 3 × 4 = 12).</p><p><b>Multiples</b> of 4 are in the 4 times table: 4, 8, 12, 16, 20...</p><p><b>Prime</b> means only two factors: 1 and itself. 7 is prime. 9 is not, because 3 × 3 = 9.</p>`,'Let\'s try one together!'),
    guided(`Is <b>${f}</b> a factor of ${n}? Does ${n} ÷ ${f} come out even?`,strChoices(`Yes: ${n} ÷ ${f} = ${n/f}`,[`No: there is a leftover`],2),`Try ${f} × ${n/f}.`,`${f} × ${n/f} = ${n}, so <b>${f}</b> is a factor of ${n}.`),
    guided(`Which number is <b>NOT</b> a factor of ${n}?`,numChoices(nf,shuffle(fs).slice(0,3)),`Try dividing ${n} by each one. Which leaves a leftover?`,`${n} ÷ ${nf} has a leftover, so <b>${nf}</b> is not a factor.`),
    guided(`Which number is a <b>multiple</b> of ${k}?`,numChoices(mm,[mm+1,mm-1,mm+2]),`Say the ${k} times table: ${k}, ${2*k}, ${3*k}...`,`${k} × ${mm/k} = <b>${mm}</b>.`),
    guided(`Which number is <b>prime</b>?`,numChoices(p,cs),`Try to split each one: by 3? by 5?`,`<b>${p}</b> only splits as 1 × ${p}. The others split, like ${cs[0]} = ${[3,5].find(x=>cs[0]%x===0)} × ${cs[0]/[3,5].find(x=>cs[0]%x===0)}.`)]},
   practice:[2,3,4]},
  {id:'angle_kind',isl:'angle',types:[0,3],title:'The square corner trick',
   build(){const d=pick([30,40,50,60,70,120,130,140,150]),t=angleType(d),whole=coin()?90:180,a=whole===90?R(2,16)*5:R(4,32)*5,sm=x=>angleSVG(x).replace('width:340px','width:150px');return [
    teachCard('Compare with a square corner',`<div class="lrow">${sm(40)}${sm(90)}${sm(130)}</div><p>A square corner, like the corner of a book, is <b>90°</b>: a <b>right</b> angle.</p><p>Smaller than that: <b>acute</b>. Bigger: <b>obtuse</b>. A flat line: <b>straight</b>, 180°.</p><p>Two angles that fill a square corner add up to <b>90°</b>. Two that make a flat line add up to <b>180°</b>.</p>`,'Let\'s try one together!'),
    Object.assign(guided(`Is it smaller or bigger than a square corner? What kind of angle is this?`,{choices:shuffle(['Acute','Right','Obtuse','Straight']),answer:t},`Imagine a book corner on it.`,`It is ${d<90?'smaller':'bigger'} than a square corner, so it is <b>${t.toLowerCase()}</b>.`),{visual:angleSVG(d)}),
    guided(`Two angles make a <b>${whole===90?'right angle (90°)':'straight line (180°)'}</b>. One is <b>${a}°</b>. How do we find the other one?`,strChoices(`${whole} − ${a}`,[`${whole} + ${a}`,`${a} × 2`],3),`The two parts add up to ${whole}°.`,`Take the part we know away from the whole: <b>${whole} − ${a}</b>.`),
    guided(`<b>${whole} − ${a} = ?</b>`,numChoices(whole-a,[a,whole-a+10,whole-a-10]),`Subtract.`,`The other angle is <b>${whole-a}°</b>.`)]},
   practice:[0,3,0]},
  {id:'angle_read',isl:'angle',types:[1,2],title:'Read the right numbers',
   build(){let d;do{d=R(2,16)*10}while(d===90);return [
    teachCard('Start at 0!',`<div class="lrow">${protractorSVG('',50)}</div><p>The black ray lies on the <b>0 on the right</b>. So we read the <b>dark numbers</b>, which start at 0 on the right.</p><p>Follow them up to the red ray: <b>50°</b>. (The small red numbers would say 130°. That scale is for angles that start on the left.)</p>`,'Let\'s try one together!'),
    Object.assign(guided(`The black ray is on the 0 at the right. Which numbers do we read?`,strChoices('The dark numbers',['The small red numbers'],2),`Which scale starts at 0 on the right?`,`The <b>dark numbers</b> start at 0 on the right.`),{visual:protractorSVG('',d)}),
    Object.assign(guided(`Follow the dark numbers to the red ray. How many degrees?`,numChoices(d,[180-d,d+10,d-10]),`Count from 0 on the right.`,`The angle is <b>${d}°</b>. The red scale would give ${180-d}°, the wrong one here.`),{visual:protractorSVG('',d)})]},
   practice:[1,2,1]},
  {id:'frac_times',isl:'frac',types:[7],title:'Fraction times a whole number',
   build(){const den=pick([3,4,5,6]),a=R(1,den-1),n=R(3,5),tot=n*a;return [
    teachCard('Groups of the same fraction',`<p><b>3 × ${frac(2,5)}</b> means <b>3 groups</b> of ${frac(2,5)}:</p><div class="lrow">${barsRow(3,2,5)}</div><p class="lc lbig">${frac(2,5)} + ${frac(2,5)} + ${frac(2,5)} = ${frac(6,5)}</p><p>Shortcut: multiply the <b>top</b> number. The bottom stays the same, because the pieces are still fifths: 3 × 2 = 6, so <b>${frac(6,5)}</b>.</p>`,'Let\'s try one together!'),
    guided(`<b>${n} × ${frac(a,den)}</b> is the same as adding ${frac(a,den)} how many times?`,numChoices(n,[n+1,a,den]),`The whole number tells how many groups.`,`${n} groups, so we add ${frac(a,den)} <b>${n} times</b>.`),
    guided(`Multiply the top number: <b>${n} × ${a} = ?</b>`,numChoices(tot,[n+a,tot+n,a*den]),`${n} groups of ${a} pieces.`,`${n} × ${a} = <b>${tot}</b> pieces.`),
    Object.assign(guided(`So <b>${n} × ${frac(a,den)} = ?</b>`,strChoices(fr(tot,den),[fr(tot,den*n),fr(n+a,den),fr(a,den*n)]),`The bottom number stays ${den}.`,`${n} × ${frac(a,den)} = <b>${frac(tot,den)}</b>.`),{render:fracText})]},
   practice:[7,7,7]},
  {id:'frac_mixed',isl:'frac',types:[5,6],title:'Wholes and pieces',
   build(){const den=pick([3,4,5,6]),w=R(1,3),r=R(1,den-1),n=w*den+r,n1=R(1,den-2),n2=R(1,den-1-n1),w1=R(1,3),w2=R(1,2);return [
    teachCard('Every full set of pieces makes 1 whole',`<p><b>${frac(11,4)}</b> is 11 quarters. Every 4 quarters make 1 whole.</p><div class="lrow">${pies(11,4)}</div><p class="lc lbig">${frac(11,4)} = ${mixedHTML(2,3,4)}</p><p>11 ÷ 4 = 2 R3: <b>2 wholes</b> and <b>3 pieces</b> left.</p><p>Adding mixed numbers? Add the wholes, then add the pieces: ${mixedHTML(1,1,4)} + ${mixedHTML(2,2,4)} = <b>${mixedHTML(3,3,4)}</b>.</p>`,'Let\'s try one together!'),
    guided(`${frac(n,den)}: how many <b>wholes</b>? Think ${n} ÷ ${den}.`,numChoices(w,[w+1,r,n]),`How many groups of ${den} fit in ${n}?`,`${den} × ${w} = ${w*den}, so there are <b>${w} whole${w>1?'s':''}</b>.`),
    guided(`How many pieces are <b>left over</b>? ${n} − ${w*den} = ?`,numChoices(r,[r+1,den,w+r]),`Take the wholes away.`,`<b>${r}</b> piece${r>1?'s':''} left over.`),
    Object.assign(guided(`So ${frac(n,den)} = ?`,strChoices(`${w} ${r}/${den}`,[`${w+1} ${r}/${den}`,`${r} ${w}/${den}`,`${w} ${den-r}/${den}`]),`Wholes first, then the pieces left.`,`${frac(n,den)} = <b>${mixedHTML(w,r,den)}</b>.`),{render:fracText}),
    Object.assign(guided(`${mixedHTML(w1,n1,den)} + ${mixedHTML(w2,n2,den)} = ? Add the wholes, then the pieces.`,strChoices(`${w1+w2} ${n1+n2}/${den}`,[`${w1+w2} ${n1+n2}/${den*2}`,`${w1+w2+1} ${n1+n2}/${den}`,`${w1*w2} ${n1+n2}/${den}`]),`Wholes: ${w1} + ${w2}. Pieces: ${n1} + ${n2}.`,`${w1} + ${w2} = ${w1+w2} wholes, ${n1} + ${n2} = ${n1+n2} pieces: <b>${mixedHTML(w1+w2,n1+n2,den)}</b>.`),{render:fracText})]},
   practice:[6,5,6]},
  {id:'read_main',isl:'reading',types:[],title:'Find the main idea',
   build(){const P=shuffle(MAINIDEA.slice()).slice(0,4);return [
    teachCard('What are MOST of the sentences about?',`<div class="passage"><p>Bees visit flowers all day. They drink sweet nectar. Pollen sticks to their legs and moves to the next flower. That helps new seeds grow.</p></div><p>The <b>main idea</b> is what <b>most</b> sentences are about: <b>bees help flowers make seeds</b>.</p><p>"Bees have legs" is only a small <b>detail</b>. "All about insects" is <b>too big</b>.</p>`,'Let\'s try some!'),
    ...P.map(x=>Object.assign(guided(`<div class="passage"><p>${x[0]}</p></div>What is the <b>main idea</b>?`,strChoices(x[1],x[2]),`What do almost all the sentences talk about?`,`Most sentences tell about this: <b>${x[1]}</b>.`),{long:true,render:c=>c}))]},
   practice:[]},
  {id:'word_context',isl:'words',types:[],title:'Clues around a word',
   build(){const P=shuffle(CONTEXT.slice()).slice(0,4);return [
    teachCard('The other words give clues',`<p class="lbig">"The <b>enormous</b> whale was longer than a school bus."</p><p>Don't know <b>enormous</b>? Look around it: <i>longer than a school bus</i>. So enormous means <b>very big</b>.</p><p>Clues can be an example, an opposite ("not tiny"), or an explanation after a comma.</p>`,'Let\'s try some!'),
    ...P.map(x=>Object.assign(guided(`<i>"${x[0]}"</i><br>What does <b>${x[1]}</b> mean?`,strChoices(x[2],x[3]),`Find the words near <b>${x[1]}</b> that explain it.`,`The clue is <i>${x[4]}</i>. So <b>${x[1]}</b> means <b>${x[2]}</b>.`),{long:true,render:c=>c}))]},
   practice:[]},
  {id:'place_value',isl:'place',types:[0,2],title:'Each place is 10 times bigger',
   build(){const n=R(21,98)*1000+R(100,999),s=String(n),pos=R(0,s.length-2),d=+s[pos],pl=s.length-1-pos,names=['ones','tens','hundreds','thousands','ten thousands'];return [
    teachCard('Read the place, then the value',`<p class="lbig">4<b style="color:var(--berry)">7</b>,382</p><p>The <b>7</b> is in the <b>thousands</b> place, so it is worth <b>7,000</b>.</p><p>Moving one place to the left makes a digit worth <b>10 times more</b>: 7 → 70 → 700 → 7,000.</p>`,'Let\'s try one together!'),
    guided(`In <b>${fmt(n)}</b>, which place is the <b>${d}</b> in? (count from the right: ones, tens, hundreds...)`,strChoices(names[pl],names.filter((_,i)=>i!==pl).slice(0,3)),`Start at the right with "ones" and move left one place at a time.`,`The ${d} is in the <b>${names[pl]}</b> place.`),
    guided(`So what is the <b>${d}</b> worth?`,numChoices(d*10**pl,[d*10**(pl+1),d*10**Math.max(0,pl-1)||d*100,d]),`${names[pl]} means 1 with ${pl} zero${pl>1?'s':''}.`,`${d} ${names[pl]} = <b>${fmt(d*10**pl)}</b>.`),
    guided(`A digit moves one place to the <b>left</b>. Its value becomes...`,strChoices('10 times bigger',['10 times smaller','2 times bigger','the same']),`Think: 7 → 70.`,`Each place to the left is worth <b>10 times more</b>.`)]},
   practice:[0,2,0]},
  {id:'place_round',isl:'place',types:[1],title:'Rounding: look next door',
   build(){const n=R(1100,9899),p=pick([10,100,1000]),nm={10:'ten',100:'hundred',1000:'thousand'}[p],down=Math.floor(n/p)*p,up=down+p,r=Math.round(n/p)*p,next=Math.floor(n%p/(p/10));return [
    teachCard('Find the digit next door',`<p>Round <b>3,<u>6</u>48</b> to the nearest <b>thousand</b>. It's between <b>3,000</b> and <b>4,000</b>.</p><p>Look at the digit <b>next door</b> (to the right): 6. <b>5 or more → round up</b>. 4 or less → round down.</p><p class="lbig">3,648 → 4,000</p>`,'Let\'s try one together!'),
    guided(`Round <b>${fmt(n)}</b> to the nearest ${nm}. Which two numbers is it between?`,strChoices(`${fmt(down)} and ${fmt(up)}`,[`${fmt(down-p)} and ${fmt(down)}`,`${fmt(up)} and ${fmt(up+p)}`,`${fmt(down+p/2)} and ${fmt(up+p/2)}`]),`Keep the digits up to the ${nm}s place, make the rest zeros. Then add one ${nm}.`,`${fmt(n)} is between <b>${fmt(down)}</b> and <b>${fmt(up)}</b>.`),
    guided(`What is the digit next door (just right of the ${nm}s place)?`,numChoices(next,[(next+1)%10,(next+5)%10,(next+3)%10]),`Find the ${nm}s digit, then look one place to the right.`,`The digit next door is <b>${next}</b>.`),
    guided(`${next} is ${next>=5?'5 or more':'4 or less'}. So ${fmt(n)} rounds to...`,numChoices(r,[r===up?down:up,r+p,n]),`5 or more → up. 4 or less → down.`,`${fmt(n)} rounds to <b>${fmt(r)}</b>.`)]},
   practice:[1,1,1]},
  {id:'add_regroup',isl:'addsub',types:[0,1],title:'Line up and regroup',
   build(){const a=R(1200,4800),b=R(1100,4900),o=(a%10+b%10),c=o>=10?1:0;return [
    teachCard('Same places in a column, start on the right',`<pre class="lcol">  2,758\n+ 1,465\n-------\n  4,223</pre><p><b>Ones</b>: 8 + 5 = 13. Write <b>3</b>, carry the <b>1</b> ten.</p><p>Then tens, hundreds, thousands, always adding the carried 1.</p><p>Subtracting? If the top digit is smaller, <b>borrow</b> 1 from the next place: it becomes 10 more.</p>`,'Let\'s try one together!'),
    guided(`Let's add <b>${fmt(a)} + ${fmt(b)}</b>. First the ones: <b>${a%10} + ${b%10} = ?</b>`,numChoices(o,[o+1,Math.abs(o-1),o+10]),`Just the last digits.`,`${a%10} + ${b%10} = <b>${o}</b>${c?'. Write the '+(o%10)+' and carry 1 ten.':'.'}`),
    guided(`Do we carry a 1 into the tens?`,strChoices(c?'Yes, because the ones made 10 or more':'No, the ones made less than 10',[c?'No, the ones made less than 10':'Yes, because the ones made 10 or more','Only when subtracting']),`Is ${o} 10 or more?`,c?`${o} is 10 or more, so <b>carry 1</b>.`:`${o} is less than 10: <b>no carry</b>.`),
    guided(`Finish the column: <b>${fmt(a)} + ${fmt(b)} = ?</b>`,numChoices(a+b,[a+b+10,a+b-10,a+b+100]),`Tens, hundreds, thousands, adding any carried 1s.`,`<b>${fmt(a)} + ${fmt(b)} = ${fmt(a+b)}</b>.`)]},
   practice:[0,1,0]},
  {id:'dec_tenths',isl:'dec',types:[0,1,3,4],title:'Tenths and hundredths',
   build(){const t=R(1,9),h=R(11,99);return [
    teachCard('A decimal is a fraction of 10 or 100',`<p class="lbig">0.7 = ${frac(7,10)} = ${frac(70,100)}</p><p>One place after the point = <b>tenths</b>. Two places = <b>hundredths</b>.</p><p class="lbig">0.45 = ${frac(45,100)}</p><p>To add tenths and hundredths, turn tenths into hundredths first: ${frac(3,10)} = ${frac(30,100)}.</p>`,'Let\'s try one together!'),
    guided(`Write <b>${frac(t,10)}</b> as a decimal.`,strChoices(`0.${t}`,[`0.0${t}`,`${t}.0`,`0.${t}0${t}`]),`Tenths → one place after the point.`,`${frac(t,10)} = <b>0.${t}</b>.`),
    guided(`Write <b>${frac(h,100)}</b> as a decimal.`,strChoices(dec(h),[`0.${h}0`,`${h}.0`,(h/1000).toFixed(3)]),`Hundredths → two places after the point.`,`${frac(h,100)} = <b>${dec(h)}</b>.`),
    guided(`${frac(t,10)} is the same as how many hundredths?`,strChoices(`${t*10}/100`,[`${t}/100`,`${t+10}/100`,`${t}/1000`]),`Multiply the top and bottom by 10.`,`${frac(t,10)} = <b>${frac(t*10,100)}</b>.`)]},
   practice:[0,1,4]},
  {id:'graph_read',isl:'graph',types:[0,1,2,3],title:'Read the graph like a detective',
   build(){const a=R(3,9),b=R(10,16);return [
    teachCard('Title, scale, then compare',`<p>1. Read the <b>title</b>: what is it about?</p><p>2. Check the <b>scale</b>: does each line count by 1, 2 or 5?</p><p>3. <b>"How many more"</b> means <b>subtract</b>. <b>"Together"</b> or <b>"in all"</b> means <b>add</b>.</p>`,'Let\'s try one together!'),
    guided(`Dogs got <b>${b}</b> votes and Fish got <b>${a}</b>. How many <b>more</b> votes did Dogs get?`,numChoices(b-a,[a+b,b-a+1,b]),`"How many more" → subtract.`,`${b} − ${a} = <b>${b-a}</b>.`),
    guided(`How many votes did Dogs and Fish get <b>together</b>?`,numChoices(a+b,[b-a,a+b+1,a*b]),`"Together" → add.`,`${b} + ${a} = <b>${a+b}</b>.`),
    guided(`On a picture graph each 🐾 stands for <b>2</b> votes. Cats have <b>4</b> 🐾. How many votes?`,numChoices(8,[4,6,2]),`Count by 2s for each picture.`,`4 pictures × 2 = <b>8</b> votes.`)]},
   practice:[0,2,3]},
  {id:'shape_lines',isl:'shape',types:[2,3,0],title:'Lines and four-sided shapes',
   build(){return [
    teachCard('Parallel, perpendicular, intersecting',`<svg viewBox="0 0 300 80" style="max-width:300px"><path d="M10 20 H90 M10 50 H90" stroke="#2f9fe0" stroke-width="5"/><path d="M130 65 H200 M165 10 V65" stroke="#e2558f" stroke-width="5"/><path d="M230 10 L290 70 M230 70 L290 10" stroke="#38b98a" stroke-width="5"/></svg><p><b>Parallel</b>: never meet. <b>Perpendicular</b>: meet in a square corner (90°). <b>Intersecting</b>: cross each other.</p><p>Quadrilaterals: a <b>parallelogram</b> has 2 pairs of parallel sides; a <b>rectangle</b> also has 4 right angles; a <b>square</b> also has 4 equal sides; a <b>trapezoid</b> has just 1 pair.</p>`,'Let\'s try some!'),
    guided(`Two train tracks run side by side and never meet. They are...`,strChoices('parallel',['perpendicular','intersecting','curved']),`Never meeting = ?`,`Lines that never meet are <b>parallel</b>.`),
    guided(`The corner of a book: two edges meet in a square corner. They are...`,strChoices('perpendicular',['parallel','curved','not lines']),`Square corner = 90°.`,`They are <b>perpendicular</b>.`),
    guided(`A shape has 4 equal sides and 4 right angles. What is the <b>best</b> name?`,strChoices('Square',['Trapezoid','Rhombus','Pentagon']),`Rectangles have right angles; which one also has equal sides?`,`It's a <b>square</b>.`)]},
   practice:[2,3,0]},
  {id:'time_jump',isl:'time',types:[3,8,9,11],title:'Elapsed time: jump to the hour',
   build(){const h=R(1,10),m=R(1,5)*5+20,d=R(4,9)*5,end=(m+d)%60,eh=h+Math.floor((m+d)/60);return [
    teachCard('Jump to the next o\'clock first',`<p>The show starts at <b>2:40</b> and lasts <b>35 minutes</b>.</p><p>2:40 → <b>3:00</b> is a jump of 20 minutes. 35 − 20 = 15 left. 3:00 + 15 = <b>3:15</b>.</p><p>How long? Count the same jumps from start to end.</p>`,'Let\'s try one together!'),
    guided(`Start at <b>${h}:${String(m).padStart(2,'0')}</b>. How many minutes to <b>${h+1}:00</b>?`,numChoices(60-m,[m,60-m+5,100-m]),`An hour has 60 minutes.`,`60 − ${m} = <b>${60-m}</b> minutes.`),
    guided(`We need ${d} minutes in all. ${d>=60-m?`After the jump to ${h+1}:00, how many minutes are left?`:'Do we even reach the next hour?'}`,d>=60-m?numChoices(d-(60-m),[d,60-m,d-(60-m)+5]):strChoices('No, we stay in the same hour',['Yes','We go back an hour']),d>=60-m?`${d} − ${60-m}`:`${d} is less than ${60-m}.`,d>=60-m?`${d} − ${60-m} = <b>${d-(60-m)}</b> minutes left.`:`${d} < ${60-m}, so we stay before ${h+1}:00.`),
    guided(`So the end time is...`,strChoices(`${eh}:${String(end).padStart(2,'0')}`,[`${eh+1}:${String(end).padStart(2,'0')}`,`${h}:${String((m+d)%60).padStart(2,'0')}`.replace(`${eh}:`,`${h+2}:`),`${eh}:${String((end+10)%60).padStart(2,'0')}`]),`Add the leftover minutes to the o'clock time.`,`It ends at <b>${eh}:${String(end).padStart(2,'0')}</b>.`)]},
   practice:[3,8,9]},
  {id:'riddle_steps',isl:'riddle',types:[0,3,1],title:'Big problems in small steps',
   build(){const b=R(4,7),e=R(6,12),g=R(3,9);return [
    teachCard('What do I know? What do I need? One step at a time.',`<p>"Pip has <b>3 bags</b> with <b>8 acorns</b> each. He eats <b>5</b>. How many are left?"</p><p><b>Step 1</b>: 3 × 8 = 24 acorns. <b>Step 2</b>: 24 − 5 = <b>19</b>.</p><p>Underline the numbers, find the question, then solve one step at a time.</p>`,'Let\'s try one together!'),
    guided(`Mia has <b>${b} boxes</b> with <b>${e} crayons</b> each. She gives away <b>${g}</b>. Step 1: how many crayons does she have at first?`,numChoices(b*e,[b+e,b*e+b,b*e-g]),`Boxes × crayons in each box.`,`${b} × ${e} = <b>${b*e}</b>.`),
    guided(`Step 2: she gives away ${g}. How many are left?`,numChoices(b*e-g,[b*e+g,b*e,b*e-g-1]),`Gives away → subtract.`,`${b*e} − ${g} = <b>${b*e-g}</b>.`),
    guided(`I think of a number, multiply it by 3, then add 4, and get 19. Work <b>backward</b>: 19 − 4 = 15. What is 15 ÷ 3?`,numChoices(5,[4,6,15]),`Undo each step in reverse order.`,`15 ÷ 3 = <b>5</b>. The number is 5!`)]},
   practice:[0,3,1]},
  {id:'frac_line',isl:'frac',types:[8,9],title:'Fractions on a number line',
   build(){const den=pick([3,4,5,6,8]),n=R(1,den-1);return [
    teachCard('Split each whole into equal jumps',`<p>From 0 to 1, make <b>4 equal jumps</b>. Each jump is ${frac(1,4)}.</p><p>${frac(3,4)} is <b>3 jumps</b> from 0. ${frac(5,4)} is 5 jumps: past 1!</p><p>On a bar, ${frac(2,3)} and ${frac(4,6)} cover the <b>same amount</b>: they are equal.</p>`,'Let\'s try one together!'),
    guided(`A line from 0 to 1 is split into <b>${den}</b> equal jumps. Each jump is...`,strChoices(`1/${den}`,[`${den}/1`,`1/${den+1}`,`1/${den*2}`]),`One whole split into ${den} parts.`,`Each jump is <b>${frac(1,den)}</b>.`),
    guided(`How many jumps from 0 to reach <b>${frac(n,den)}</b>?`,numChoices(n,[den,den-n||n+1,n+1]),`The top number counts the jumps.`,`<b>${n}</b> jumps.`),
    guided(`Which fraction is equal to ${frac(1,2)}?`,strChoices(`${den%2?2:den/2}/${den%2?4:den}`,['1/3','2/3','3/4'].filter(x=>x!==`${den%2?2:den/2}/${den%2?4:den}`)),`Half of the parts.`,`Half of the parts shaded is the same as ${frac(1,2)}.`)]},
   practice:[8,9,8]}

];
LESSONS.push(...LESSONS3,...LESSONS3E,...LESSONS3X,...LESSONS5,...LESSONS5E,...LESSONS5X);
/* lessons belong to a question generator (L.gen, or the island id for 4th grade lessons), so each grade gets its own */
const lessonsFor=id=>{const k=(byId(id)||{}).genKey||id;return LESSONS.filter(L=>(L.gen||L.isl)===k)};
function lessonFor(id){const ls=lessonsFor(id);if(!ls.length)return null;const miss=t=>G.review.filter(r=>r.i===id&&t.includes(r.t)).length,done=L=>((G.lessons||{})[L.id]||'');
  return ls.slice().sort((x,y)=>miss(y.types)-miss(x.types)||done(x).localeCompare(done(y)))[0]}
function lessonIsland(L){const base=byId(L.isl);return Object.assign({},base,{id:'lesson_'+L.id,name:'Lesson: '+L.title,special:'lesson',lesson:L,gen:null})}
function startLesson(L){const isl=byId(L.isl);const qs=[...L.build(),...L.practice.map(t=>{const q=makeQ(isl,t%isl.types,R(1,2e9),1);q.numeric=false;return q})];
  beginRound(lessonIsland(L),'lesson',qs);say($('#say'),`Lesson time${nm()}! First I'll show you the trick, then we try it together.`)}
function finishLesson(){const L=S.isl.lesson,isl=byId(L.isl),n=S.qs.filter(q=>!q.teach).length,s=S.score,st=s===n?3:s>=Math.ceil(n*.66)?2:s>=1?1:0;
  bump('l');const first=!(G.lessons||{})[L.id];G.lessons=Object.assign({},G.lessons||{},{[L.id]:dayKey()});if(first)award('learner');
  done(st,`You learned <b>${L.title}</b>! ${s} of ${n} right on the first try. Now use the trick on <b>${isl.name}</b>.`,{title:'Lesson complete!',sticker:first?.6:0});
  const nb=$('#nextIsl');nb.hidden=false;nb.textContent=`Practice on ${isl.name}`;nb.onclick=()=>start(isl)}
/* offer a lesson when an island is hard right now */
function lessonOfferNeeded(isl){if(!lessonsFor(isl.id).length)return false;const m=rollAcc(isl.id),weak=(m.n>=6&&m.acc<.6)||(G.diff[isl.id]===1);G.lessonOffer=G.lessonOffer||{};return weak&&G.lessonOffer[isl.id]!==dayKey()}
function offerLesson(isl,go){const L=lessonFor(isl.id);G.lessonOffer=Object.assign({},G.lessonOffer||{},{[isl.id]:dayKey()});save(true);
  overlay(`<div class="pipbob" data-fox></div><div class="eyebrow">Pip's tip</div><h2>Learn the trick first?</h2><p>${esc(isl.name)} has been tricky lately. I have a <b>3-minute lesson</b>: <b>${L.title}</b>. Then the puzzles get easier!</p><div class="btnrow"><button class="go leaf" type="button" id="lsYes">Show me the trick</button><button class="go alt" type="button" id="lsNo">Just play</button></div>`,()=>{
    $('#lsYes').onclick=()=>{closeOverlay();start(lessonIsland(L))};$('#lsNo').onclick=()=>{closeOverlay();go()}})}
/* ---------- quick check for new players: sets Easy or Normal on the core math islands ---------- */
const PLACE_ISL=['place','addsub','mult','div','frac','area'].filter(id=>byId(id)&&byId(id).gen);
function startPlacement(){const base=byId('daily'),isl=Object.assign({},base,{id:'placement',name:'Quick Check',special:'placement'});
  const qs=PLACE_ISL.flatMap(id=>[0,1].map(k=>{const i=byId(id);const q=makeQ(i,k%i.types,R(1,2e9),2);q.from=i.name;return q}));
  beginRound(isl,'place',shuffle(qs));say($('#say'),`Quick check! 12 puzzles, no pressure. Just do your best${nm()}, so I know where to start.`)}
function finishPlacement(){const pr=S.pr||{},easy=[],ok=[];
  PLACE_ISL.forEach(id=>{const r=pr[id]||0;if(r===0){G.diff[id]=1;easy.push(byId(id).name)}else{G.diff[id]=2;ok.push(byId(id).name)}});G.placed=1;save();
  return `${easy.length?`I set <b>${easy.join(', ')}</b> to Easy mode so you can warm up. `:''}${ok.length?`You're ready for Normal mode on ${ok.length===PLACE_ISL.length?'all the math islands':ok.join(', ')}. `:''}Next, try <b>Story Mode</b>!`}
/* ---------- rolling accuracy: the last 20 first tries on each island ---------- */
function rollAcc(id){const r=(G.roll||{})[id]||'';return {n:r.length,acc:r.length?r.split('').filter(x=>x==='1').length/r.length:0}}
function rollAdd(id,ok){if(!id)return;G.roll=Object.assign({},G.roll||{});G.roll[id]=(((G.roll[id]||'')+(ok?'1':'0')).slice(-20))}
const MASTER_N=12,MASTER_ACC=.8;
const mastered=id=>{const m=rollAcc(id);return m.n>=MASTER_N&&m.acc>=MASTER_ACC};
/* mastery steps on the bar: bronze 60%, silver 70%, gold 80% of the last 20 first tries */
const TIERS=[[0,'',''],[.6,'Bronze','#d08a4e'],[.7,'Silver','#8e9aab'],[MASTER_ACC,'Gold','#38b98a']];
function tierOf(id){const m=rollAcc(id);let t=0;for(let k=1;k<4;k++)if(m.acc>=TIERS[k][0]&&m.n>=(k===1?10:MASTER_N))t=k;return t}
function toTier(id,k){const r=(G.roll||{})[id]||'',need=k===1?10:MASTER_N;for(let x=0;x<=40;x++){const w=(r+'1'.repeat(x)).slice(-20),a=w.split('').filter(c=>c==='1').length/(w.length||1);if(w.length>=need&&a>=TIERS[k][0])return x}return 40}
const tierBest=id=>Math.max(tierOf(id),(G.tierBest||{})[id]||0);
/* ---------- Pip's Pick: the trickiest topic pays double today ---------- */
const pickToday=()=>(nowList().length||Object.values(G.stats||{}).some(x=>x&&x.a>=6))?pipPick():null;
function pipPick(){
  const pool=ISLANDS.filter(i=>i.gen&&['math','time','world'].includes(i.group)&&!i.special&&!i.flash&&STAR_ISLANDS.includes(i));
  const accOf=i=>{const m=rollAcc(i.id);if(m.n>=8)return m.acc;const st=G.stats[i.id];return st&&st.a>=6?st.c/st.a:null};
  const now=nowList().map(byId).filter(i=>i&&pool.includes(i));
  /* topics the grown-up marked as "in class right now" come first; inside them, the ones with skills still to master */
  let weak=now.length?now.slice().sort((a,b)=>(allSkills(a.id)-allSkills(b.id))||((accOf(a)??-1)-(accOf(b)??-1))).slice(0,3):pool.filter(i=>accOf(i)!==null&&accOf(i)<.8).sort((a,b)=>accOf(a)-accOf(b)).slice(0,3);
  if(!weak.length)weak=pool.filter(i=>i.group==='math').sort((a,b)=>(G.best[a.id]||0)-(G.best[b.id]||0)||((G.stats[a.id]||{}).a||0)-((G.stats[b.id]||{}).a||0)).slice(0,3);
  if(!weak.length)return null;const d=Math.floor(Date.parse(dayKey())/864e5),pd=G.pickDay&&G.pickDay.d===dayKey()?G.pickDay:null;
  /* after 3 rounds on today's pick, Pip moves the x2 to the next weak topic, so no single topic gets all the practice */
  for(let k=0;k<weak.length;k++){const c=weak[(d+k)%weak.length];if(!pd||!(pd.done||[]).includes(c.id))return c}
  return weak[d%weak.length]}
function renderPickCard(){const el=$('#pickCard');if(!el)return;/* no 'trickiest topic' until there is something to measure */const P=pickToday();el.hidden=false;
  const gi=goalInfo(),pd=G.pickDay&&G.pickDay.d===dayKey()?G.pickDay:null,pickPlayed=!!(pd&&Object.values(pd.n||{}).some(v=>v>0));
  const steps=[{done:dailyDone(),title:'Daily Challenge',sub:`8 surprise puzzles · +${REW.daily} coins`,btn:'<button type="button" class="go small" id="tdDaily">Play</button>'},
    P?{done:pickPlayed,title:`Pip's Pick: ${esc(P.name)}${(()=>{const w=weakSkill(P.id);return w&&skillsOf(P.id).length>1?` · ${esc(w.name)}`:''})()}`,sub:(()=>{const st=G.stats[P.id],pc=st&&st.a>=6?Math.round(st.c/st.a*100):null;return `${pc!==null?`Trickiest topic right now (${pc}% right)`:esc(P.topic)} · <span class="x2">×2 coins</span>`})(),btn:`<span class="pkbtns">${lessonsFor(P.id).length?'<button type="button" class="go small alt" id="pickLearn">Learn the trick</button>':''}<button type="button" class="go small" id="pickGo">Play</button></span>`}:null,
    {done:!!gi&&G.goalDone===dayKey(),title:'Free flight',sub:gi?`Any island you like · today's goal ${gi.label}`:'Any island you like',btn:''}].filter(Boolean);
  const nd=steps.filter(x=>x.done).length,cur=steps.findIndex(x=>!x.done&&x.btn);
  el.innerHTML=`<div class="today"><div class="tdhead"><b>Today's flight plan</b><span>${nd===steps.length?'All done! Rest, or play for fun.':`${nd} of ${steps.length} done`}</span></div><div class="tdmeta">${gi?`<span>${gi.cur>=gi.max?'Goal done!':'Today'} · ${gi.label}</span><div class="bar warm"><i style="width:${Math.min(100,gi.cur/gi.max*100)}%"></i></div>`:''}<span>${FLAME} ${curStreak()} day streak</span></div><ol class="tdsteps">${steps.map((x,i)=>`<li class="${x.done?'done':''}${i===cur?' cur':''}"><span class="tdchk">${x.done?CHECK:i+1}</span><div class="tdtx"><b>${x.title}</b><small>${x.sub}</small></div>${x.done?'':x.btn}</li>`).join('')}</ol></div>`;
  if($('#tdDaily'))$('#tdDaily').onclick=()=>start(byId('daily'));
  if(!P)return;
  if($('#pickGo'))$('#pickGo').onclick=()=>pickPlay(P);if($('#pickLearn'))$('#pickLearn').onclick=()=>start(lessonIsland(lessonFor(P.id)));
  return;const st=G.stats[P.id],pc=st&&st.a>=6?Math.round(st.c/st.a*100):null;
  el.innerHTML=`<div class="pkisl">${islandSVG(P.color,LANDMARKS[P.lm])}</div><div class="gtxt"><b>Pip's Pick for today: ${esc(P.name)}${(()=>{const w=weakSkill(P.id);return w&&skillsOf(P.id).length>1?` · ${esc(w.name)}`:''})()}</b><span>${pc!==null?`Your trickiest topic right now (${pc}% right). Practice makes it easier!`:`${esc(P.topic)}: let's get stronger here!`}</span></div><span class="x2">×2 coins</span><div class="pkbtns">${lessonsFor(P.id).length?'<button type="button" class="go small alt" id="pickLearn">Learn the trick</button>':''}<button type="button" class="go small" id="pickGo">Play</button></div>`;
  $('#pickGo').onclick=()=>pickPlay(P);if($('#pickLearn'))$('#pickLearn').onclick=()=>start(lessonIsland(lessonFor(P.id)))}
/* ---------- after the daily goal, coins taper off, so long sessions are not over-rewarded ---------- */
function taper(c){const gi=goalInfo();if(!gi||G.goalDone!==dayKey()||c<=0)return c;const f=gi.cur>=gi.max*2?.25:.5;
  if(G.taperNote!==dayKey()){G.taperNote=dayKey();setTimeout(()=>toast('Pip is getting sleepy','You reached today\'s goal, so puzzles give fewer coins now. A break is a great idea!','#7c8fb8'),400)}
  return Math.max(1,Math.round(c*f))}
/* ---------- optional daily time limit (set by a grown-up) ---------- */
function limitLeft(){const L=+(G.settings.limit||0);if(!L)return Infinity;const t=today(),ex=G.limitExtra&&G.limitExtra.d===dayKey()?G.limitExtra.m:0;return L+ex-Math.floor(t.sec/60)}
function limitGate(go){if(limitLeft()>0)return false;
  overlay(`<div class="pipbob" data-fox></div><div class="eyebrow">Time to rest</div><h2>Pip is asleep</h2><p>You played <b>${Math.floor(today().sec/60)} minutes</b> today. That's today's limit. Your brain grows while you rest, so come back tomorrow!</p><p class="note">You can still visit your island, closet and album.</p><div class="btnrow"><button class="go" type="button" id="limOk">OK, see you tomorrow!</button><button class="go alt small" type="button" id="limMore">Parent: 15 more minutes</button></div>`,()=>{
    $('#limOk').onclick=closeOverlay;
    $('#limMore').onclick=()=>{const grant=()=>{const d=dayKey(),m=G.limitExtra&&G.limitExtra.d===d?G.limitExtra.m:0;G.limitExtra={d,m:m+15};save();closeOverlay();toast('15 more minutes','A grown-up said yes!','#38b98a');go&&go()};
      if(!ROOT.pin){grant();return}closeOverlay();askPinThen(grant)}});
  return true}
