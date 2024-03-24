var cacheName = 'SmartyPals-v1';
var cacheFiles = [
    '/images/art.png',
    '/images/basketball.png',
    '/images/cricket.png',
    '/images/dance.png',
    '/images/football.png',
    '/images/music.png',
    '/images/robotics.png',
    '/images/smarty_pal.png',
    '/images/swimming.png',
    '/images/table-tennis.png',
    '/images/tennis.png',
    '/images/volleyball.png',
    'favicon.ico',
    'index.html',
    'server.js',
    'service-worker.js',
    'SmartyPals.webmanifest',
    'styles.css'
];

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching all the files');
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (r) {
            // Download the file if it is not in the cache, 
            return r || fetch(e.request).then(function (response) {
                // add the new file to cache
                return caches.open(cacheName).then(function (cache) {
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});