const C='be-v4';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html'])).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
async function audio(r){const c=await caches.open(C);let m=await c.match(r.url);
 if(!m){const res=await fetch(r.url);if(!res.ok)return res;await c.put(r.url,res.clone());m=res}
 const rg=r.headers.get('range');if(!rg)return m;
 const buf=await m.clone().arrayBuffer(),n=buf.byteLength,x=/bytes=(\d*)-(\d*)/.exec(rg)||[];let s=x[1]?+x[1]:0,e=x[2]?+x[2]:n-1;if(!x[1]&&x[2]){s=n-+x[2];e=n-1}e=Math.min(e,n-1);
 return new Response(buf.slice(s,e+1),{status:206,headers:{'Content-Type':'audio/mpeg','Content-Range':`bytes ${s}-${e}/${n}`,'Content-Length':String(e-s+1),'Accept-Ranges':'bytes'}})}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
 if(u.pathname.includes('/audio/')){e.respondWith(audio(r).catch(()=>fetch(r)));return}
 e.respondWith(fetch(r).then(res=>{if(res.ok){const cl=res.clone();caches.open(C).then(c=>c.put(r,cl))}return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('./index.html'))))});
