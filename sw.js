/* Pip's Sky Islands service worker: the game opens and plays the same way without internet.
   Own files: network first (always fresh when online), but never wait long: offline or on a weak
   connection the saved copy opens right away. Fonts and the Firebase library: saved at install and
   cache first, so the game looks the same offline. Sign-in and cloud saving go straight to the network. */
const V='pip-v53',RT='pip-rt-v2';
const CORE=['./','index.html','js/demo.js','styles.css','js/content.js','js/core.js','js/scenes.js','js/math.js','js/math3.js','js/math3x.js','js/math5.js','js/math5x.js','js/english.js','js/english3.js','js/english3x.js','js/english5.js','js/english5x.js','js/homehelp.js','js/islands.js','js/progress.js','js/unlock.js','js/alive.js','js/challenge.js','js/play.js','js/teacher.js','js/family.js','js/notify.js','js/guide.js','js/tour.js','guide.html','js/es.js','js/app.js','favicon.svg','firebase-config.js','cloud.js','privacy.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png'];
const FONT_CSS='https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Lilita+One&family=Lexend:wght@400;600;700&display=swap';
/* save the font sheet and every font file it points to, so text never falls back to a plain font offline */
async function saveFonts(){try{const c=await caches.open(RT);const res=await fetch(FONT_CSS,{mode:'cors'});if(!res.ok)return;
  const css=await res.clone().text();await c.put(FONT_CSS,res);
  const urls=[...new Set((css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)||[]).map(m=>m.slice(4,-1)))];
  await Promise.all(urls.map(u=>c.match(u).then(m=>m||fetch(u,{mode:'cors'}).then(r=>{if(r.ok)return c.put(u,r)}).catch(()=>{}))))}catch(e){}}
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(CORE.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))).then(saveFonts).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!==RT).map(k=>caches.delete(k)))).then(()=>self.clients.claim()).then(saveFonts))});
const RT_HOSTS=['fonts.googleapis.com','fonts.gstatic.com'];
const fromCache=r=>caches.match(r,{ignoreSearch:true,ignoreVary:true}).then(m=>m||(r.mode==='navigate'?caches.match('index.html'):undefined));
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin===location.origin){
    const net=fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r.mode==='navigate'?'index.html':r,cp))}return res});
    e.respondWith((async()=>{
      if(self.navigator&&self.navigator.onLine===false){const m=await fromCache(r);if(m){net.catch(()=>{});return m}}
      /* weak connection: wait at most 3 seconds, then open the saved copy (the fresh one is still saved for next time) */
      const timer=new Promise(res=>setTimeout(()=>res('slow'),3000));
      const first=await Promise.race([net.catch(()=>'fail'),timer]);
      if(first!=='slow'&&first!=='fail')return first;
      const m=await fromCache(r);if(m){net.catch(()=>{});return m}
      return net.catch(()=>Response.error())})());
    return}
  if(RT_HOSTS.includes(u.hostname)||(u.hostname==='www.gstatic.com'&&u.pathname.startsWith('/firebasejs/'))){
    e.respondWith(caches.open(RT).then(c=>c.match(r,{ignoreVary:true}).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque')c.put(r,res.clone());return res}))));
  }
});
/* notifications from the server (Firebase Cloud Messaging): new class tasks, teacher messages, reminders */
self.addEventListener('push',e=>{let j={};try{j=e.data?e.data.json():{}}catch(x){j={data:{body:e.data&&e.data.text()}}}
  const d=Object.assign({},j.notification||{},j.data||{});
  e.waitUntil(self.registration.showNotification(d.title||"Pip's Sky Islands",{body:d.body||'',icon:'icon-192.png',badge:'icon-192.png',tag:d.tag||'pip',data:{link:d.link||'./'}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const link=(e.notification.data&&e.notification.data.link)||'./';
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(L=>{const w=L.find(c=>new URL(c.url).origin===location.origin);if(w)return w.focus();return self.clients.openWindow(link)}))});
