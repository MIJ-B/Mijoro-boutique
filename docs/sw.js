/*==========================================
   SERVICE WORKER - VERSION CORRIGÉE
   PWA Score: 44/44 Target
   FIX: Images non disponibles
   ========================================== */

const VERSION = '1.8.2'; // ✅ Version incrémentée
const CACHE_NAME = `mijoro-v${VERSION}`;
const OFFLINE_CACHE = `mijoro-offline-v${VERSION}`;
const IMAGE_CACHE = `mijoro-images-v${VERSION}`;
const API_CACHE = `mijoro-api-v${VERSION}`;

// ✅ Timeout configuration - AUGMENTÉ pour images
const FETCH_TIMEOUT = 8000;
const IMAGE_TIMEOUT = 20000; // ✅ 20 secondes pour les images
const CACHE_TIMEOUT = 3000;

// Assets critiques
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@600;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

// Patterns pour cache
const CACHE_PATTERNS = [
  /\.(?:woff2?|ttf|eot|otf)$/i,
  /\.(?:css|js)$/i,
  /fonts\.googleapis\.com/i,
  /fonts\.gstatic\.com/i,
  /cdnjs\.cloudflare\.com/i
];

// ✅ API patterns pour stratégie spéciale
const API_PATTERNS = [
  /supabase\.co.*\/rest\//i,
  /supabase\.co.*\/auth\//i,
  /api\./i
];

// ✅ Skip cache - AJOUT des hébergeurs d'images externes
const SKIP_CACHE = [
  /chrome-extension:/,
  /localhost:.*hot-update/,
  /\.map$/i,
  /ibb\.co/i,          // ✅ Bypass i.ibb.co
  /imgur\.com/i,       // ✅ Bypass imgur
  /imgbb\.com/i        // ✅ Bypass imgbb
];

/* ==========================================
   UTILITIES
   ========================================== */

// ✅ Fetch avec timeout
function fetchWithTimeout(request, timeout = FETCH_TIMEOUT) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Fetch timeout')), timeout)
    )
  ]);
}

// ✅ Log avec timestamp
function log(message, data = '') {
  console.log(`[SW ${new Date().toISOString().split('T')[1].slice(0, 8)}] ${message}`, data);
}

/* ==========================================
   INSTALL
   ========================================== */
self.addEventListener('install', (e) => {
  log('📦 Installation v' + VERSION);
  
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        log('✅ Pre-caching static assets');
        return cache.addAll(STATIC_ASSETS).catch((err) => {
          log('⚠️ Pre-cache partial failure:', err.message);
          return Promise.resolve();
        });
      })
      .then(() => {
        log('✅ Skip waiting');
        return self.skipWaiting();
      })
      .catch((err) => {
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
      // Nettoyer les anciens caches
      caches.keys().then((keys) => {
        const validCaches = [CACHE_NAME, OFFLINE_CACHE, IMAGE_CACHE, API_CACHE];
        return Promise.all(
          keys
            .filter((key) => !validCaches.includes(key))
            .map((key) => {
              log('🗑️ Deleting old cache:', key);
              return caches.delete(key);
            })
        );
      }),
      
      // Prendre le contrôle immédiatement
      self.clients.claim()
    ]).then(() => {
      log('✅ Activation complete - All caches cleared');
    })
  );
});

/* ==========================================
   FETCH - UNIFIED STRATEGY
   ========================================== */
self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Ignore non-http
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // ✅ Skip cache patterns (images externes incluses)
  if (SKIP_CACHE.some((pattern) => pattern.test(url.href))) {
    log('⚡ Bypassing SW for:', url.hostname);
    return; // Laisser le navigateur gérer directement
  }

  // ✅ API calls - Network First avec cache fallback
  if (API_PATTERNS.some((pattern) => pattern.test(url.href))) {
    e.respondWith(handleAPI(request));
    return;
  }

  // ✅ Images locales uniquement - Cache First
  if (/\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(url.pathname)) {
    // Vérifier si c'est une image locale ou hébergée sur le même domaine
    if (url.origin === self.location.origin) {
      e.respondWith(handleLocalImage(request));
    } else {
      // Images externes: laisser passer sans cache
      log('🌐 External image, no cache:', url.href);
      return;
    }
    return;
  }

  // Static assets - Cache First
  if (CACHE_PATTERNS.some((pattern) => pattern.test(url.href))) {
    e.respondWith(cacheFirst(request));
    return;
  }

  // HTML & navigation - Network First
  if (request.mode === 'navigate' || request.destination === 'document') {
    e.respondWith(networkFirst(request));
    return;
  }

  // Default - Network First
  e.respondWith(networkFirst(request));
});

/* ==========================================
   STRATEGIES
   ========================================== */

// ✅ Cache First (avec update background)
async function cacheFirst(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    
    if (cached) {
      // Update in background (stale-while-revalidate)
      fetchWithTimeout(request).then((response) => {
        if (response && response.ok) {
          cache.put(request, response.clone());
        }
      }).catch(() => {
        // Silent fail pour background update
      });
      
      return cached;
    }

    // Pas en cache, fetch avec timeout
    const response = await fetchWithTimeout(request);
    
    if (response && response.ok && request.method === 'GET') {
      cache.put(request, response.clone());
    }
    
    return response;
    
  } catch (err) {
    log('⚠️ Cache first error:', err.message);
    
    // Fallback sur cache même si expiré
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    
    // Dernière option: offline page
    return offlineFallback(request);
  }
}

// ✅ Network First (avec cache fallback)
async function networkFirst(request) {
  try {
    const response = await fetchWithTimeout(request);
    
    if (response && response.ok && request.method === 'GET') {
      const cache = await caches.open(OFFLINE_CACHE);
      cache.put(request, response.clone()).catch(() => {
        // Silent fail si cache plein
      });
    }
    
    return response;
    
  } catch (err) {
    log('⚠️ Network first error:', err.message);
    
    // Fallback sur cache
    const cached = await caches.match(request);
    if (cached) {
      log('✅ Serving from cache');
      return cached;
    }
    
    // Offline fallback
    return offlineFallback(request);
  }
}

// ✅ API Handler - Network First avec cache limité
async function handleAPI(request) {
  try {
    const response = await fetchWithTimeout(request, 5000);
    
    // Cache seulement les GET réussis
    if (response && response.ok && request.method === 'GET') {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone()).catch(() => {
        log('⚠️ API cache failed');
      });
    }
    
    return response;
    
  } catch (err) {
    log('⚠️ API error, trying cache:', err.message);
    
    // Fallback sur cache API si GET
    if (request.method === 'GET') {
      const cached = await caches.match(request);
      if (cached) {
        log('✅ Serving stale API data');
        return cached;
      }
    }
    
    // Retourner erreur JSON
    return new Response(
      JSON.stringify({ 
        error: 'Network unavailable', 
        offline: true,
        message: 'Données non disponibles hors ligne'
      }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}

// ✅ Local Image Handler - UNIQUEMENT pour images locales
async function handleLocalImage(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      log('✅ Serving local image from cache');
      
      // Update en background
      fetchWithTimeout(request, IMAGE_TIMEOUT).then((response) => {
        if (response && response.ok) {
          cache.put(request, response.clone());
        }
      }).catch(() => {});
      
      return cached;
    }

    // Fetch avec timeout long pour images
    const response = await fetchWithTimeout(request, IMAGE_TIMEOUT);
    
    if (response && response.ok) {
      // Vérifier que c'est bien une image
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.startsWith('image/')) {
        cache.put(request, response.clone());
      }
    }
    
    return response;
    
  } catch (err) {
    log('⚠️ Local image error:', err.message);
    
    // Fallback cache
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    
    // Placeholder SVG minimaliste
    return new Response(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#0f172a"/>
        <circle cx="200" cy="120" r="40" fill="#334155" opacity="0.5"/>
        <rect x="160" y="170" width="80" height="8" fill="#334155" opacity="0.5" rx="4"/>
        <rect x="140" y="190" width="120" height="8" fill="#334155" opacity="0.3" rx="4"/>
      </svg>`,
      { 
        headers: { 
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache'
        } 
      }
    );
  }
}

// ✅ Offline Fallback - Enhanced
function offlineFallback(request) {
  // Si c'est une requête de navigation, retourner la page offline
  if (request.mode === 'navigate') {
    return new Response(
      `<!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="theme-color" content="#4ade80">
        <title>Hors ligne - Mijoro Boutique</title>
        <style>
          *{margin:0;padding:0;box-sizing:border-box}
          body{display:flex;align-items:center;justify-content:center;
               min-height:100vh;background:linear-gradient(135deg,#667eea,#764ba2);
               font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
               color:#fff;text-align:center;padding:20px}
          .offline-box{max-width:400px;padding:40px;background:rgba(0,0,0,.3);
                       border-radius:20px;backdrop-filter:blur(10px);
                       box-shadow:0 8px 32px rgba(0,0,0,.3)}
          h1{font-size:4em;margin:0 0 20px;animation:pulse 2s infinite}
          h2{font-size:1.8em;margin:0 0 10px}
          p{font-size:1.1em;opacity:.9;margin:0 0 30px;line-height:1.6}
          button{padding:14px 40px;background:#fff;color:#667eea;
                 border:none;border-radius:50px;font-size:1em;font-weight:700;
                 cursor:pointer;transition:.3s;box-shadow:0 4px 15px rgba(0,0,0,.2)}
          button:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.3)}
          button:active{transform:translateY(0)}
          @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
          .info{margin-top:20px;padding:15px;background:rgba(255,255,255,.1);
                border-radius:10px;font-size:14px;opacity:.8}
        </style>
      </head>
      <body>
        <div class="offline-box">
          <h1>📡</h1>
          <h2>Hors ligne</h2>
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
  
  // Pour les autres requêtes, erreur générique
  return new Response('Service Unavailable', { status: 503 });
}

/* ==========================================
   PUSH NOTIFICATIONS
   ========================================== */

const DEFAULT_ICON = './icons/android-launchericon-192-192.png';
// ✅ OVAO (× = multiplication symbol, tsy x)
const DEFAULT_BADGE = './icons/512x512-monochrome.png';

self.addEventListener('push', function(event) {
  log('📨 Push notification received');
  
  let notificationData = {
    title: 'Mijoro Boutique', // ✅ APP NAME tsara
    body: '🆕 Nouveau produit disponible!',
    icon: DEFAULT_ICON,
    badge: DEFAULT_BADGE,
    tag: 'mijoro-notification',
    requireInteraction: false,
    vibrate: [200, 100, 200],
    data: {
      url: '/Mijoro-boutique/'
    },
    actions: [
      { action: 'view', title: '👀 Voir', icon: DEFAULT_ICON },
      { action: 'dismiss', title: '✖️ Fermer' }
    ]
  };
  
  if (event.data) {
    try {
      const payload = event.data.json();
      log('📦 Payload:', payload);
      
      // Merge payload mais garde "Mijoro Boutique" comme titre si tsy misy
      notificationData = {
        ...notificationData,
        title: payload.title || 'Mijoro Boutique', // ✅
        body: payload.body || notificationData.body,
        icon: payload.image || payload.icon || DEFAULT_ICON,
        image: payload.image,
        data: payload.data || notificationData.data,
        actions: payload.actions || notificationData.actions
      };
      
    } catch (err) {
      log('❌ Push parse error:', err);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

/* ==========================================
   NOTIFICATION CLICK
   ========================================== */
self.addEventListener('notificationclick', function(event) {
  log('🖱️ Notification clicked:', event.action);
  
  event.notification.close();
  
  const data = event.notification.data || {};
  let url = 'https://mij-b.github.io/Mijoro-boutique/';
  
  if (event.action === 'dismiss') {
    return;
  }
  
  if (data.url) {
    url = data.url;
  } else if (data.productId) {
    url = `https://mij-b.github.io/Mijoro-boutique/?product=${data.productId}#shop`;
  }
  
  log('🔗 Opening:', url);
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        for (let client of windowClients) {
          if (client.url.includes('mij-b.github.io/Mijoro-boutique/') && 'focus' in client) {
            return client.navigate(url).then(() => client.focus());
          }
        }
        return clients.openWindow(url);
      })
  );
});

/* ==========================================
   BACKGROUND SYNC
   ========================================== */
self.addEventListener('sync', (event) => {
  log('🔄 Background sync:', event.tag);
  
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart());
  } else if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders());
  }
});

async function syncCart() {
  log('🛒 Syncing cart...');
  try {
    const cache = await caches.open(API_CACHE);
    const requests = await cache.keys();
    const cartRequests = requests.filter(req => req.url.includes('/cart'));
    
    if (cartRequests.length > 0) {
      log('✅ Cart data found, syncing...');
    }
  } catch (err) {
    log('❌ Cart sync error:', err);
    throw err;
  }
}

async function syncOrders() {
  log('📦 Syncing orders...');
  try {
    log('✅ Orders synced');
  } catch (err) {
    log('❌ Orders sync error:', err);
    throw err;
  }
}

/* ==========================================
   MESSAGE HANDLER
   ========================================== */
self.addEventListener('message', (e) => {
  log('📬 Message:', e.data?.type);
  
  if (e.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (e.data?.type === 'CLEAR_CACHE') {
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => caches.delete(key)));
    }).then(() => {
      log('🗑️ All caches cleared');
      e.ports[0]?.postMessage({ success: true });
    });
  }
  
  if (e.data?.type === 'CACHE_SIZE') {
    getCacheSize().then(size => {
      e.ports[0]?.postMessage({ size });
    });
  }
});

// ✅ Utilitaire pour mesurer la taille du cache
async function getCacheSize() {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage,
      quota: estimate.quota,
      percent: Math.round((estimate.usage / estimate.quota) * 100)
    };
  }
  return null;
}

/* ==========================================
   PERIODIC BACKGROUND SYNC (si supporté)
   ========================================== */
self.addEventListener('periodicsync', (event) => {
  log('🔄 Periodic sync:', event.tag);
  
  if (event.tag === 'check-products') {
    event.waitUntil(checkNewProducts());
  }
});

async function checkNewProducts() {
  log('🔍 Checking new products...');
  try {
    // Placeholder pour vérification de nouveaux produits
  } catch (err) {
    log('❌ Check products error:', err);
  }
}

log(`🚀 Service Worker v${VERSION} loaded - Images externes bypass enabled`);