const CACHE_NAME = 'gerd-finder-v5-pwa-v1';
const APP_SHELL = ['./','./index.html','./manifest.json','../assets/icon-app-gerd-finder-v5.webp'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = e.request.url;
  if(url.includes('vercel.app/api') || url.includes('script.google.com')){
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request).then(res=>{
    return caches.open(CACHE_NAME).then(c=>{c.put(e.request,res.clone());return res;});
  })));
});
