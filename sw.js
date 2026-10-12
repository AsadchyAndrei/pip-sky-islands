/* Pip's Sky Islands service worker: the game opens even without internet.
   Own files: network first (always fresh when online), cache when offline.
   Fonts and the Firebase library: cache first. Everything else (sign-in, saving) goes straight to the network. */
const V='pip-v1',RT='pip-rt-v1';
const CORE=['./','index.html','favicon.svg','firebase-config.js','cloud.js','privacy.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(CORE.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!==RT).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const RT_HOSTS=['fonts.googleapis.com','fonts.gstatic.com'];
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin===location.origin){
    e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r.mode==='navigate'?'index.html':r,cp))}return res})
      .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||(r.mode==='navigate'?caches.match('index.html'):undefined)).then(m=>m||Response.error())));
    return}
  if(RT_HOSTS.includes(u.hostname)||(u.hostname==='www.gstatic.com'&&u.pathname.startsWith('/firebasejs/'))){
    e.respondWith(caches.open(RT).then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque')c.put(r,res.clone());return res}))));
  }
});
