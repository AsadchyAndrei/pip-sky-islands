/* Pip's Sky Islands: anonymous usage counts, so we can tell what helps children (do they come back, do missions
   help, does accuracy hold). Only counters per day and grade go to our server: how many rounds, puzzles, first-try
   answers, missions... No name, no id, no device, nothing about who played. Counted on this device and sent in
   small batches. Never in the demo or on test sites. */
const STAT_URL='https://us-central1-pip-sky-islands.cloudfunctions.net/stat';
let statOff=()=>!!(window.PIP_DEMO||/\.test$|^localhost$|^127\./.test(location.hostname));
function statLoad(){try{return JSON.parse(localStorage.getItem('pip-stat')||'null')}catch(e){return null}}
function statSave(o){try{localStorage.setItem('pip-stat',JSON.stringify(o))}catch(e){}}
function stat(k,n=1){if(statOff()||!n)return;try{const d=dayKey(),g=(typeof PACK!=='undefined'&&PACK&&PACK.id)||'x';let o=statLoad();
  if(!o||o.d!==d||o.g!==g){if(o)statFlush(o);o={d,g,c:{}}}o.c[k]=(o.c[k]||0)+n;statSave(o)}catch(e){}}
function statFlush(o){if(statOff())return;o=o||statLoad();if(!o||!o.c||!Object.keys(o.c).length)return;const body=JSON.stringify(o);let sent=false;
  try{sent=!!(navigator.sendBeacon&&navigator.sendBeacon(STAT_URL,new Blob([body],{type:'text/plain'})))}catch(e){}
  if(!sent)try{fetch(STAT_URL,{method:'POST',body,keepalive:true,headers:{'Content-Type':'text/plain'}}).catch(()=>{})}catch(e){}
  const cur=statLoad();if(cur&&cur.d===o.d&&cur.g===o.g){cur.c={};statSave(cur)}}
/* once a day per player: one more player today, and whether they also played yesterday */
function statDay(){if(typeof G==='undefined'||!G)return;const d=dayKey();if(G.statDay===d)return;G.statDay=d;stat('players');const y=(G.days||{})[addDays(-1)];if(y&&(y.q||y.sec))stat('returning')}
addEventListener('pagehide',()=>statFlush());document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')statFlush()});
