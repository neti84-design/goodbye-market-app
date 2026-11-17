// 오프라인에서도 열리도록 앱 파일을 저장해 둠 (파일을 고치면 VERSION과 index.html의 ?v= 숫자를 같이 올리기)
var VERSION = 'goodbye-v11';
var FILES = ['./', 'index.html', 'app.css?v=11', 'app.js?v=11', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png', 'icons/icon-maskable-512.png',
  'img/p1.webp', 'img/p2.webp', 'img/p3.webp', 'img/p4.webp', 'img/p5.webp', 'img/p6.webp', 'img/i1.webp',
  'img/g1.webp', 'img/g2.webp', 'img/g1-l.webp', 'img/g2-l.webp', 'img/g3.webp', 'img/g3-l.webp', 'img/g4.webp', 'img/g4-l.webp', 'img/p1-l.webp', 'img/p2-l.webp', 'img/p3-l.webp', 'img/p4-l.webp', 'img/p5-l.webp', 'img/p6-l.webp'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(FILES.map(function (f) { return new Request(f, { cache: 'reload' }); })); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
// 네트워크 먼저, 안 되면 저장본
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var same = new URL(e.request.url).origin === location.origin;
  e.respondWith((same ? fetch(e.request.url, { cache: 'no-cache' }) : fetch(e.request)).then(function (res) {
    var copy = res.clone();
    caches.open(VERSION).then(function (c) { c.put(e.request, copy); });
    return res;
  }).catch(function () { return caches.match(e.request).then(function (r) { return r || caches.match('index.html'); }); }));
});
