const CACHE_NAME = 'hm-books-v1';

const PRECACHE_URLS = [
  './',
  './index.html',
  './home-icon.png',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800;900&display=swap',
  './covers/emerald-and-the-lost-treasure.jpg',
  './covers/emerald-and-the-magic-shell.jpg',
  './covers/emerald-and-the-new-arrival.jpg',
  './covers/emerald-and-the-ocean-parade.jpg',
  './covers/emerald-and-the-pearly-turtles.jpg',
  './covers/emerald-and-the-runaway-royal.jpg',
  './covers/emerald-and-the-sea-dragon.jpg',
  './covers/emerald-and-the-sea-sprites.jpg',
  './covers/isadora-moon-and-the-frost-festival.jpg',
  './covers/isadora-moon-and-the-new-girl.jpg',
  './covers/isadora-moon-and-the-pop-stars.jpg',
  './covers/isadora-moon-and-the-shooting-star.jpg',
  './covers/isadora-moon-gets-in-trouble.jpg',
  './covers/isadora-moon-gets-the-magic-pox.jpg',
  './covers/isadora-moon-goes-camping.jpg',
  './covers/isadora-moon-goes-on-a-school-trip.jpg',
  './covers/isadora-moon-goes-on-holiday.jpg',
  './covers/isadora-moon-goes-to-a-wedding.jpg',
  './covers/isadora-moon-goes-to-school.jpg',
  './covers/isadora-moon-goes-to-the-ballet.jpg',
  './covers/isadora-moon-goes-to-the-fair.jpg',
  './covers/isadora-moon-has-a-birthday.jpg',
  './covers/isadora-moon-has-a-sleepover.jpg',
  './covers/isadora-moon-helps-out.jpg',
  './covers/isadora-moon-makes-a-wish.jpg',
  './covers/isadora-moon-makes-winter-magic.jpg',
  './covers/isadora-moon-meets-the-tooth-fairy.jpg',
  './covers/isadora-moon-puts-on-a-show.jpg',
  './covers/isadora-moon-rides-a-bike.jpg',
  './covers/isadora-moon-under-the-sea.jpg',
  './covers/mirabelle-and-the-baby-dragons.jpg',
  './covers/mirabelle-and-the-enchanted-sea-globe.jpg',
  './covers/mirabelle-and-the-haunted-house.jpg',
  './covers/mirabelle-and-the-magical-mayhem.jpg',
  './covers/mirabelle-and-the-midnight-feast.jpg',
  './covers/mirabelle-and-the-naughty-bat-kittens.jpg',
  './covers/mirabelle-and-the-party-tricks.jpg',
  './covers/mirabelle-and-the-picnic-pranks.jpg',
  './covers/mirabelle-breaks-the-rules.jpg',
  './covers/mirabelle-gets-up-to-mischief.jpg',
  './covers/mirabelle-has-a-bad-day.jpg',
  './covers/mirabelle-in-double-trouble.jpg',
  './covers/mirabelle-in-witch-city.jpg',
  './covers/mirabelle-takes-charge.jpg',
  './covers/mirabelle-wants-to-win.jpg'
];

// Install: precache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first, with dynamic caching for font files
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Dynamically cache font files from Google
        if (event.request.url.includes('fonts.gstatic.com') || event.request.url.includes('fonts.googleapis.com')) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => {
      // Offline fallback — return cached index for navigation requests
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
