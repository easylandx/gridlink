const VERSION = 'gridlink-v2';
const SHELL = [
 "./",
 "./index.html",
 "./grid.html",
 "./manifest.webmanifest",
 "./pawvibesz.png",
 "./icon-192.png",
 "./icon-512.png",
 "./maskable-512.png",
 "./apple-touch-icon.png",
 "./favicon.png",
 "./gridlink802_files/copilot.png",
 "./gridlink802_files/image002.png",
 "./gridlink802_files/image004.png",
 "./gridlink802_files/image006.png",
 "./gridlink802_files/image008.png",
 "./gridlink802_files/image010.png",
 "./gridlink802_files/image012.png",
 "./gridlink802_files/image014.png",
 "./gridlink802_files/image016.png",
 "./gridlink802_files/image018.png",
 "./gridlink802_files/image020.png",
 "./gridlink802_files/image022.png",
 "./gridlink802_files/image024.png",
 "./gridlink802_files/image026.png",
 "./gridlink802_files/image028.png",
 "./gridlink802_files/image030.png",
 "./gridlink802_files/image032.png",
 "./gridlink802_files/image034.png",
 "./gridlink802_files/image036.png",
 "./gridlink802_files/image038.png",
 "./gridlink802_files/image040.png",
 "./gridlink802_files/image042.png",
 "./gridlink802_files/image044.png",
 "./gridlink802_files/image046.png",
 "./gridlink802_files/image048.png",
 "./gridlink802_files/image050.png",
 "./gridlink802_files/image056.png"
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Pages: network first, cached copy when offline
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('./grid.html'))));
    return;
  }
  // Own files, images and Google Fonts: cache first, refreshed in background
  if (url.origin === location.origin || req.destination === 'image' || req.destination === 'font' ||
      url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.match(req).then(cached => {
      const fresh = fetch(req).then(res => {
        if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => cached);
      return cached || fresh;
    }));
  }
});
