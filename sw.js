// Sube el número de versión cada vez que cambies algún archivo
const CACHE='descansos-v10';
const FILES=['./','index.html','manifest.json','icon-180.png','icon-192.png','icon-512.png',
 'B612-Regular.ttf','B612-Bold.ttf','B612Mono-Regular.ttf','B612Mono-Bold.ttf','bebe.jpg'];

// Instalación: descarga todo saltándose la caché del navegador
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE)
    .then(c=>Promise.all(FILES.map(f=>fetch(new Request(f,{cache:'reload'})).then(r=>{if(r.ok)return c.put(f,r)}).catch(()=>{}))))
    .then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  // La página: primero la red (así las actualizaciones se ven al momento), sin red la copia guardada
  if(req.mode==='navigate'){
    e.respondWith(fetch(req,{cache:'no-store'}).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put('index.html',c));return r})
      .catch(()=>caches.match('index.html')));
    return;
  }
  // Iconos y tipografías: primero la copia guardada
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(r=>r||fetch(req)));
});
