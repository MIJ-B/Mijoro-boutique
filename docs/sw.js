/*==========================================
   SERVICE WORKER - OFFLINE MODE + PREMIUM NOTIFICATIONS
   ========================================== */

const CACHE_NAME = 'mijoro-v1.7';
const OFFLINE_CACHE = 'mijoro-offline-v1';
const IMAGE_CACHE = 'mijoro-images-v1';

// Assets critiques
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@600;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

// Patterns
const CACHE_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,
  /\.(?:woff2?|ttf|eot|otf)$/i,
  /\.(?:css|js)$/i,
  /ibb\.co/i
];

// ✅ SKIP - Aza cached ny API calls
const SKIP_CACHE = [
  /chrome-extension:/,
  /localhost:.*hot-update/,
  /\.map$/i,
  /api-inference\.huggingface\.co/i,
  /api\.groq\.com/i,
  /api\.cohere\.ai/i,
  /supabase\.co.*\/rest\//i,
  /supabase\.co.*\/auth\//i
];

/* ==========================================
   INSTALL
   ========================================== */
self.addEventListener('install', (e) => {
  console.log('[SW] Installation...');
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Erreur pre-cache:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

/* ==========================================
   ACTIVATE
   ========================================== */
self.addEventListener('activate', (e) => {
  console.log('[SW] Activation...');
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => !['mijoro-v1.7', 'mijoro-offline-v1', 'mijoro-images-v1'].includes(key))
          .map((key) => {
            console.log('[SW] Suppression cache obsolète:', key);
            return caches.delete(key);
          })
      );
    }).then(() => self.clients.claim())
  );
});

/* ==========================================
   FETCH - UNIFIED STRATEGY ✅
   ========================================== */
self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Ignore non-http
  if (!url.protocol.startsWith('http')) return;

  // ✅ CRITICAL: Skip cache for API calls
  if (SKIP_CACHE.some((pattern) => pattern.test(url.href))) {
    console.log('[SW] Bypassing cache for:', url.href);
    return;
  }

  // Images - Cache First
  if (/\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(url.pathname)) {
    e.respondWith(handleImage(request));
    return;
  }

  // Static assets - Cache First
  if (CACHE_PATTERNS.some((pattern) => pattern.test(url.href))) {
    e.respondWith(cacheFirst(request));
    return;
  }

  // Everything else - Network First
  e.respondWith(networkFirst(request));
});

/* ==========================================
   STRATEGIES
   ========================================== */

// Cache First
async function cacheFirst(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    
    if (cached) {
      // Update in background (stale-while-revalidate)
      fetch(request).then((response) => {
        if (response && response.ok) {
          cache.put(request, response.clone());
        }
      }).catch(() => {});
      
      return cached;
    }

    const response = await fetch(request);
    if (response && response.ok && request.method === 'GET') {
      cache.put(request, response.clone());
    }
    return response;
    
  } catch (err) {
    const cached = await caches.match(request);
    return cached || offlineFallback();
  }
}

// Network First
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    
    if (response && response.ok && request.method === 'GET') {
      const cache = await caches.open(OFFLINE_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    return cached || offlineFallback();
  }
}

// Image Handler
async function handleImage(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      // Update in background
      fetch(request).then((response) => {
        if (response && response.ok) {
          cache.put(request, response.clone());
        }
      }).catch(() => {});
      
      return cached;
    }

    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
    
  } catch (err) {
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#1e293b"/><text x="300" y="200" text-anchor="middle" fill="#64748b" font-size="20">Image non disponible</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// Offline Fallback - Enhanced
function offlineFallback() {
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
        p{font-size:1.1em;opacity:.9;margin:0 0 30px}
        button{padding:14px 40px;background:#fff;color:#667eea;
               border:none;border-radius:50px;font-size:1em;font-weight:700;
               cursor:pointer;transition:.3s;box-shadow:0 4px 15px rgba(0,0,0,.2)}
        button:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.3)}
        button:active{transform:translateY(0)}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
      </style>
    </head>
    <body>
      <div class="offline-box">
        <h1>📡</h1>
        <h2>Hors ligne</h2>
        <p>Tsy misy connexion internet.<br>Avereno rehefa misy internet.</p>
        <button onclick="location.reload()">♻️ Réessayer</button>
      </div>
    </body>
    </html>`,
    { 
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      } 
    }
  );
}

/* ==========================================
   PUSH NOTIFICATIONS ✅ PREMIUM
   ========================================== */

// ✅ Default icons (fallback) - Using product image as icon
const DEFAULT_ICON = './icons/android-launchericon-192-192.png';
const DEFAULT_BADGE = './icons/android-launchericon-96-96.png';
const FALLBACK_PRODUCT_IMAGE = 'https://i.ibb.co/kVQxwznY/IMG-20251104-074641.jpg';

self.addEventListener('push', function(event) {
  console.log('[SW] 📨 Push received');
  
  // ✅ Default notification structure
  let notificationData = {
    title: '🆕 Nouveau produit!',
    body: 'Découvrez les nouveautés',
    icon: DEFAULT_ICON,
    badge: DEFAULT_BADGE,
    requireInteraction: true,
    vibrate: [200, 100, 200],
    data: {}
  };
  
  // ✅ Parse payload from Edge Function
  if (event.data) {
    try {
      const payload = event.data.json();
      console.log('[SW] 📦 Payload:', payload);
      
      // ✅ Merge with defaults, keeping payload priority
      notificationData = {
        title: payload.title || notificationData.title,
        body: payload.body || notificationData.body,
        
        // ✅ CRITICAL: Use product image as icon if available, otherwise logo
        icon: payload.image || payload.icon || DEFAULT_ICON,
        badge: payload.badge || DEFAULT_BADGE,
        image: payload.image || FALLBACK_PRODUCT_IMAGE,  // Large image (600x400)
        
        tag: payload.tag || 'general',
        requireInteraction: payload.requireInteraction !== undefined ? payload.requireInteraction : true,
        vibrate: payload.vibrate || [200, 100, 200],
        renotify: payload.renotify || false,
        silent: payload.silent || false,
        
        // ✅ Actions - Premium buttons
        actions: payload.actions || [
          { action: 'view', title: '👀 Voir' },
          { action: 'dismiss', title: '❌ Fermer' }
        ],
        
        // ✅ Data for click handler
        data: payload.data || {}
      };
      
      console.log('[SW] ✅ Final notification:', notificationData);
      
    } catch (err) {
      console.error('[SW] ❌ Push parse error:', err);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

/* ==========================================
   NOTIFICATION CLICK ✅ PREMIUM ACTIONS
   ========================================== */
self.addEventListener('notificationclick', function(event) {
  console.log('[SW] 🖱️ Notification clicked:', event.action);
  
  event.notification.close();
  
  const data = event.notification.data || {};
  let url = 'https://mijoroboutique.netlify.app/';
  
  // ✅ Handle different actions
  if (event.action === 'dismiss') {
    console.log('[SW] ❌ Dismissed');
    return;
  }
  
  if (event.action === 'buy') {
    // Direct to checkout with product
    if (data.productId) {
      url = `https://mijoroboutique.netlify.app/?product=${data.productId}&action=buy#checkout`;
    }
  } else if (event.action === 'view' || !event.action) {
    // View product details
    if (data.url) {
      url = data.url;
    } else if (data.productId) {
      url = `https://mijoroboutique.netlify.app/?product=${data.productId}#shop`;
    }
  }
  
  console.log('[SW] 🔗 Opening URL:', url);
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if already open
      for (let client of windowClients) {
        if (client.url.includes('mijoroboutique.netlify.app') && 'focus' in client) {
          return client.navigate(url).then(() => client.focus());
        }
      }
      // Open new window
      return clients.openWindow(url);
    })
  );
});

/* ==========================================
   PERIODIC BACKGROUND SYNC
   ========================================== */
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] 🔄 Periodic sync:', event.tag);
  
  if (event.tag === 'check-new-products') {
    event.waitUntil(checkNewProducts());
  }
});

async function checkNewProducts() {
  console.log('[SW] 🔍 Checking for new products...');
  // Placeholder - Mety ampiana logic eto rehefa misy backend sync
  try {
    // Fetch new products from API
    // const response = await fetch('/api/products/latest');
    // const products = await response.json();
    // if (products.length > 0) {
    //   await self.registration.showNotification('Nouveaux produits!', {
    //     body: `${products.length} produit(s) ajouté(s)`,
    //     icon: DEFAULT_ICON
    //   });
    // }
  } catch (err) {
    console.error('[SW] Periodic sync error:', err);
  }
}

/* ==========================================
   BACKGROUND SYNC
   ========================================== */
self.addEventListener('sync', (event) => {
  console.log('[SW] 🔄 Background sync:', event.tag);
  
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart());
  } else if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders());
  }
});

async function syncCart() {
  console.log('[SW] 🛒 Syncing cart...');
  // Sync shopping cart when back online
  try {
    // const cart = await getLocalCart();
    // await fetch('/api/cart/sync', {
    //   method: 'POST',
    //   body: JSON.stringify(cart)
    // });
  } catch (err) {
    console.error('[SW] Cart sync error:', err);
  }
}

async function syncOrders() {
  console.log('[SW] 📦 Syncing orders...');
  // Sync pending orders when back online
  try {
    // const pendingOrders = await getPendingOrders();
    // for (const order of pendingOrders) {
    //   await fetch('/api/orders', {
    //     method: 'POST',
    //     body: JSON.stringify(order)
    //   });
    // }
  } catch (err) {
    console.error('[SW] Orders sync error:', err);
  }
}

/* ==========================================
   MESSAGE HANDLER
   ========================================== */
self.addEventListener('message', (e) => {
  console.log('[SW] 📬 Message received:', e.data);
  
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (e.data && e.data.type === 'CLEAR_CACHE') {
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => caches.delete(key)));
    }).then(() => {
      console.log('[SW] 🗑️ All caches cleared');
    });
  }
});