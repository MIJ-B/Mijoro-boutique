/*==========================================
   SERVICE WORKER - VERSION OPTIMISÉE
   PWA Score Target: 44/44
   FIX: Tous les problèmes résolus
   ========================================== */

const VERSION = '1.9.0';
const CACHE_NAME = `mijoro-v${VERSION}`;
const OFFLINE_CACHE = `mijoro-offline-v${VERSION}`;
const IMAGE_CACHE = `mijoro-images-v${VERSION}`;
const API_CACHE = `mijoro-api-v${VERSION}`;

// Configuration timeouts
const TIMEOUTS = {
  fetch: 10000,
  image: 25000,
  api: 8000,
  cache: 5000
};

// ✅ Assets critiques avec chemins absolus
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json'
];

// ✅ CDN assets - mis en cache séparément
const CDN_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@600;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

// Patterns pour cache
const CACHE_PATTERNS = {
  fonts: /\.(?:woff2?|ttf|eot|otf)$/i,
  styles: /\.css$/i,
  scripts: /\.js$/i,
  images: /\.(?:jpg|jpeg|png|gif|webp|svg|avif)$/i,
  googleFonts: /fonts\.(?:googleapis|gstatic)\.com/i,
  cdnjs: /cdnjs\.cloudflare\.com/i
};

// ✅ API patterns
const API_PATTERNS = [
  /supabase\.co.*\/rest\//i,
  /supabase\.co.*\/auth\//i,
  /supabase\.co.*\/storage\//i,
  /\/api\//i
];

// ✅ Skip cache - inclut hébergeurs d'images externes
const SKIP_CACHE_PATTERNS = [
  /chrome-extension:/,
  /localhost:.*hot-update/,
  /\.map$/i,
  /ibb\.co/i,
  /imgur\.com/i,
  /imgbb\.com/i,
  /postimg\.cc/i,
  /imagekit\.io/i
];

/* ==========================================
   UTILITIES
   ========================================== */

function log(message, data = '') {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, 12);
  console.log(`[SW ${timestamp}] ${message}`, data);
}

function fetchWithTimeout(request, timeout) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Fetch timeout')), timeout)
    )
  ]);
}

function shouldSkipCache(url) {
  return SKIP_CACHE_PATTERNS.some(pattern => pattern.test(url));
}

function isApiRequest(url) {
  return API_PATTERNS.some(pattern => pattern.test(url));
}

function isImageRequest(url) {
  return CACHE_PATTERNS.images.test(url);
}

function isCacheableAsset(url) {
  return Object.values(CACHE_PATTERNS).some(pattern => pattern.test(url));
}

/* ==========================================
   INSTALL
   ========================================== */
self.addEventListener('install', (e) => {
  log('📦 Installation v' + VERSION);
  
  e.waitUntil(
    Promise.all([
      // Cache assets statiques
      caches.open(CACHE_NAME).then(cache => {
        log('✅ Caching static assets');
        return cache.addAll(STATIC_ASSETS).catch(err => {
          log('⚠️ Static cache partial failure:', err.message);
          // Continue même si certains échouent
          return Promise.all(
            STATIC_ASSETS.map(url =>
              cache.add(url).catch(() => log('❌ Failed:', url))
            )
          );
        });
      }),
      
      // Cache CDN assets séparément
      caches.open(CACHE_NAME).then(cache => {
        log('✅ Caching CDN assets');
        return Promise.all(
          CDN_ASSETS.map(url =>
            fetch(url, { mode: 'cors' })
              .then(response => {
                if (response.ok) {
                  return cache.put(url, response);
                }
              })
              .catch(() => log('⚠️ CDN asset failed:', url))
          )
        );
      })
    ])
    .then(() => {
      log('✅ Install complete');
      return self.skipWaiting();
    })
    .catch(err => {
      log('❌ Install error:', err);
    })
  );
});

/* ==========================================
   ACTIVATE
   ========================================== */
self.addEventListener('activate', (e) => {
  log('🔄 Activation v' + VERSION);
  
  e.waitUntil(
    Promise.all([
      // Nettoyer anciens caches
      caches.keys().then(keys => {
        const validCaches = [CACHE_NAME, OFFLINE_CACHE, IMAGE_CACHE, API_CACHE];
        const deletePromises = keys
          .filter(key => !validCaches.includes(key))
          .map(key => {
            log('🗑️ Deleting cache:', key);
            return caches.delete(key);
          });
        return Promise.all(deletePromises);
      }),
      
      // Prendre contrôle
      self.clients.claim()
    ])
    .then(() => {
      log('✅ Activation complete');
      
      // Notifier tous les clients
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            version: VERSION
          });
        });
      });
    })
  );
});

/* ==========================================
   FETCH - STRATÉGIE UNIFIÉE
   ========================================== */
self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Ignorer non-HTTP
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // ✅ Skip cache si nécessaire
  if (shouldSkipCache(url.href)) {
    log('⚡ Bypassing cache:', url.hostname);
    return;
  }

  // ✅ Requêtes API
  if (isApiRequest(url.href)) {
    e.respondWith(handleAPI(request));
    return;
  }

  // ✅ Images locales uniquement
  if (isImageRequest(url.href) && url.origin === self.location.origin) {
    e.respondWith(handleLocalImage(request));
    return;
  }

  // ✅ Assets cacheables
  if (isCacheableAsset(url.href)) {
    e.respondWith(cacheFirst(request));
    return;
  }

  // ✅ Navigation
  if (request.mode === 'navigate' || request.destination === 'document') {
    e.respondWith(networkFirst(request));
    return;
  }

  // ✅ Default - Network First
  e.respondWith(networkFirst(request));
});

/* ==========================================
   STRATÉGIES DE CACHE
   ========================================== */

// Cache First avec update en background
async function cacheFirst(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    
    if (cached) {
      // Update en background (stale-while-revalidate)
      fetchWithTimeout(request, TIMEOUTS.fetch)
        .then(response => {
          if (response?.ok) {
            cache.put(request, response.clone()).catch(() => {});
          }
        })
        .catch(() => {});
      
      return cached;
    }

    // Pas en cache, fetch
    const response = await fetchWithTimeout(request, TIMEOUTS.fetch);
    
    if (response?.ok && request.method === 'GET') {
      cache.put(request, response.clone()).catch(() => {});
    }
    
    return response;
    
  } catch (err) {
    log('⚠️ Cache first error:', err.message);
    
    // Fallback cache
    const cached = await caches.match(request);
    if (cached) return cached;
    
    return offlineFallback(request);
  }
}

// Network First avec cache fallback
async function networkFirst(request) {
  try {
    const response = await fetchWithTimeout(request, TIMEOUTS.fetch);
    
    if (response?.ok && request.method === 'GET') {
      const cache = await caches.open(OFFLINE_CACHE);
      cache.put(request, response.clone()).catch(() => {});
    }
    
    return response;
    
  } catch (err) {
    log('⚠️ Network first error:', err.message);
    
    const cached = await caches.match(request);
    if (cached) {
      log('✅ Serving from cache');
      return cached;
    }
    
    return offlineFallback(request);
  }
}

// Handler API
async function handleAPI(request) {
  try {
    const response = await fetchWithTimeout(request, TIMEOUTS.api);
    
    if (response?.ok && request.method === 'GET') {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone()).catch(() => {});
    }
    
    return response;
    
  } catch (err) {
    log('⚠️ API error:', err.message);
    
    if (request.method === 'GET') {
      const cached = await caches.match(request);
      if (cached) {
        log('✅ Serving stale API data');
        return cached;
      }
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Network unavailable',
        offline: true,
        message: 'Connexion requise'
      }),
      { 
        status: 503,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      }
    );
  }
}

// Handler images locales
async function handleLocalImage(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      log('✅ Image from cache');
      
      // Update en background
      fetchWithTimeout(request, TIMEOUTS.image)
        .then(response => {
          if (response?.ok) {
            cache.put(request, response.clone()).catch(() => {});
          }
        })
        .catch(() => {});
      
      return cached;
    }

    const response = await fetchWithTimeout(request, TIMEOUTS.image);
    
    if (response?.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType?.startsWith('image/')) {
        cache.put(request, response.clone()).catch(() => {});
      }
    }
    
    return response;
    
  } catch (err) {
    log('⚠️ Image error:', err.message);
    
    const cached = await caches.match(request);
    if (cached) return cached;
    
    return createPlaceholderImage();
  }
}

// Placeholder image SVG
function createPlaceholderImage() {
  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1"/>
          <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1"/>
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#bg)"/>
      <circle cx="200" cy="120" r="35" fill="#334155" opacity="0.5"/>
      <rect x="160" y="170" width="80" height="6" fill="#334155" opacity="0.5" rx="3"/>
      <rect x="140" y="185" width="120" height="6" fill="#334155" opacity="0.3" rx="3"/>
      <text x="200" y="240" font-family="Arial" font-size="14" fill="#64748b" text-anchor="middle">
        Image non disponible
      </text>
    </svg>`,
    { 
      headers: { 
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache'
      }
    }
  );
}

// Offline fallback
function offlineFallback(request) {
  if (request.mode === 'navigate') {
    return new Response(
      `<!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="theme-color" content="#4ade80">
        <title>Hors ligne - Mijoro</title>
        <style>
          *{margin:0;padding:0;box-sizing:border-box}
          body{
            display:flex;align-items:center;justify-content:center;
            min-height:100vh;
            background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);
            font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
            color:#fff;text-align:center;padding:20px
          }
          .container{
            max-width:450px;width:100%;
            padding:50px 30px;
            background:rgba(255,255,255,0.1);
            backdrop-filter:blur(20px);
            border-radius:24px;
            box-shadow:0 20px 60px rgba(0,0,0,0.3);
            border:1px solid rgba(255,255,255,0.2)
          }
          .icon{
            font-size:5em;
            margin-bottom:20px;
            animation:pulse 2s ease-in-out infinite
          }
          h1{font-size:2.2em;margin:0 0 15px;font-weight:800}
          p{font-size:1.15em;opacity:0.95;margin:0 0 35px;line-height:1.6}
          button{
            padding:16px 50px;
            background:#fff;color:#667eea;
            border:none;border-radius:50px;
            font-size:1.05em;font-weight:700;
            cursor:pointer;
            transition:all 0.3s ease;
            box-shadow:0 6px 25px rgba(0,0,0,0.25)
          }
          button:hover{
            transform:translateY(-3px);
            box-shadow:0 10px 35px rgba(0,0,0,0.35)
          }
          button:active{transform:translateY(-1px)}
          .info{
            margin-top:30px;
            padding:18px;
            background:rgba(255,255,255,0.15);
            border-radius:12px;
            font-size:14px;
            opacity:0.9;
            border:1px solid rgba(255,255,255,0.1)
          }
          @keyframes pulse{
            0%,100%{transform:scale(1)}
            50%{transform:scale(1.15)}
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">📡</div>
          <h1>Hors ligne</h1>
          <p>
            Connexion internet indisponible.<br>
            Certaines fonctionnalités sont limitées.
          </p>
          <button onclick="location.reload()">♻️ Réessayer</button>
          <div class="info">
            💡 Vos données sont conservées localement
          </div>
        </div>
      </body>
      </html>`,
      { 
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store'
        }
      }
    );
  }
  
  return new Response('Service Unavailable', { 
    status: 503,
    headers: { 'Cache-Control': 'no-store' }
  });
}

/* ==========================================
   PUSH NOTIFICATIONS
   ========================================== */

self.addEventListener('push', (e) => {
  log('📨 Push notification');
  
  let data = {
    title: 'Mijoro Boutique',
    body: '🆕 Nouveau produit disponible!',
    icon: '/icons/android-launchericon-192-192.png',
    badge: '/icons/512x512-monochrome.png',
    tag: 'mijoro-notif',
    data: { url: '/' }
  };
  
  if (e.data) {
    try {
      const payload = e.data.json();
      data = { ...data, ...payload };
    } catch (err) {
      log('⚠️ Push parse error');
    }
  }
  
  e.waitUntil(
    self.registration.showNotification(data.title, data)
  );
});

self.addEventListener('notificationclick', (e) => {
  log('🖱️ Notification click');
  e.notification.close();
  
  const url = e.notification.data?.url || '/';
  
  e.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        for (let client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

/* ==========================================
   MESSAGE HANDLER
   ========================================== */
self.addEventListener('message', (e) => {
  log('📬 Message:', e.data?.type);
  
  if (e.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (e.data?.type === 'CLEAR_CACHE') {
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => {
        log('🗑️ All caches cleared');
        e.ports[0]?.postMessage({ success: true });
      });
  }
  
  if (e.data?.type === 'GET_VERSION') {
    e.ports[0]?.postMessage({ version: VERSION });
  }
});

log(`🚀 Service Worker v${VERSION} ready - Optimized for 44/44 PWA score`);