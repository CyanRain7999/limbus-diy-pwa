const CACHE_VERSION = 'limbus-diy-pwa-v8-5-builtin-lcb';
const CORE = [
  './','./index.html','./style.css','./app.js','./manifest.webmanifest',
  './icons/icon-192.png','./icons/icon-512.png','./assets/skill_icons/manifest.json'
];
const SINS=['wrath','lust','sloth','gluttony','gloom','pride','envy'];
const LOCAL_ASSETS=[
  ...SINS.flatMap(s=>[1,2,3].map(t=>`./assets/skill_frames/${s}-${t}.webp`)),
  ...SINS.map(s=>`./assets/sin_icons/${s}.webp`)
];
self.addEventListener('install', event => {
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE_VERSION);
    await cache.addAll(CORE);
    // 素材目录允许尚未 vendor；逐个尝试，缺文件不阻断 PWA 安装。
    await Promise.allSettled(LOCAL_ASSETS.map(async url=>{
      const r=await fetch(url,{cache:'no-store'});
      if(r.ok) await cache.put(url,r);
    }));
    self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req=event.request;
  if(req.method!=='GET') return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(resp=>{const copy=resp.clone();caches.open(CACHE_VERSION).then(c=>c.put('./index.html',copy));return resp}).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(req).then(cached=>{
    const network=fetch(req).then(resp=>{if(resp&&(resp.ok||resp.type==='opaque')){const copy=resp.clone();caches.open(CACHE_VERSION).then(c=>c.put(req,copy)).catch(()=>{})}return resp}).catch(()=>cached);
    return cached||network;
  }));
});
