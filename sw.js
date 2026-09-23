const CACHE_VERSION = 'limbus-diy-pwa-v9-0-input-jank-fix';
const CORE = [
  './','./index.html','./style.css?v=9.0','./app.js?v=9.0','./manifest.webmanifest?v=9.0',
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
    await Promise.allSettled(CORE.map(async url=>{
      const r=await fetch(url,{cache:'no-store'});
      if(r.ok) await cache.put(url,r.clone());
    }));
    await Promise.allSettled(LOCAL_ASSETS.map(async url=>{
      const r=await fetch(url,{cache:'no-store'});
      if(r.ok) await cache.put(url,r.clone());
    }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE_VERSION).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

function isAppShell(url){
  const p=url.pathname;
  return p.endsWith('/index.html') || p.endsWith('/app.js') || p.endsWith('/style.css') ||
         p.endsWith('/manifest.webmanifest') || p.endsWith('/assets/skill_icons/manifest.json');
}

self.addEventListener('fetch', event => {
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);

  if(req.mode==='navigate' || isAppShell(url)){
    event.respondWith((async()=>{
      try{
        const resp=await fetch(req,{cache:'no-store'});
        if(resp && resp.ok){
          const cache=await caches.open(CACHE_VERSION);
          cache.put(req,resp.clone()).catch(()=>{});
        }
        return resp;
      }catch(_e){
        return (await caches.match(req)) || (await caches.match('./index.html'));
      }
    })());
    return;
  }

  event.respondWith((async()=>{
    const cached=await caches.match(req);
    if(cached) return cached;
    try{
      const resp=await fetch(req);
      if(resp && (resp.ok || resp.type==='opaque')){
        const cache=await caches.open(CACHE_VERSION);
        cache.put(req,resp.clone()).catch(()=>{});
      }
      return resp;
    }catch(_e){
      return cached || Response.error();
    }
  })());
});
