const CACHE='earnings-pwa-next-v28-2';
const ASSETS=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./icon.svg','./icon-180.png','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./pony.webp'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
// Network-first: обновления приложения приходят сразу, кэш нужен только для работы офлайн.
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
  e.respondWith(
    fetch(req).then(res=>{
      if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{})}
      return res;
    }).catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||(req.mode==='navigate'?caches.match('./index.html'):null)||Response.error()))
  );
});
