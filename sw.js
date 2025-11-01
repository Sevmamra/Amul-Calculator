// Cache ka naam aur version
const CACHE_NAME = 'amul-calc-v1';

// Woh sabhi files jo offline mode ke liye cache karni hain
const ASSETS_TO_CACHE = [
    '/',
    'index.html',
    'style.css',
    'script.js',
    'products.json',
    'icons/icon-192x192.png',
    'icons/icon-512x512.png'
    'header-title.png'
];

// 1. Install event: Jab SW install hota hai
self.addEventListener('install', (event) => {
    // Wait karo jab tak saare assets cache na ho jaayein
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching all assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// 2. Fetch event: Jab bhi app koi file (image, css, js) maangta hai
self.addEventListener('fetch', (event) => {
    event.respondWith(
        // Pehle cache mein check karo
        caches.match(event.request)
            .then((response) => {
                // Agar cache mein hai, to wahaan se de do
                if (response) {
                    return response;
                }
                // Agar cache mein nahi hai, to internet se fetch karo
                return fetch(event.request);
            })
    );
});

// 3. Activate event: Purane cache ko saaf karne ke liye
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Agar cache ka naam purana (v1, v2) hai, to use delete kar do
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
