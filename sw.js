// SimpleStock Service Worker v1
const CACHE='simplestock-v1';
const SHELL=['/app/','/app/index.html','/offline.html','/manifest.webmanifest','/favicon.svg','/icon-192.png','/icon-512.png','/'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL).catch(()=>{})).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.hostname.includes('supabase.co')||url.hostname.includes('supabase.io'))return;
  if(req.mode==='navigate'||(req.headers.get('accept')||'').includes('text/html')){
    e.respondWith(fetch(req).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(req,copy));return r}).catch(()=>caches.match(req).then(r=>r||caches.match('/offline.html'))));
    return;
  }
  if(url.origin===location.origin){
    e.respondWith(caches.match(req).then(r=>r||fetch(req).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put(req,copy));return resp})));
  }
});