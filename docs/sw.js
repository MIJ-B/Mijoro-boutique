/* ==========================================
   SERVICE WORKER REGISTRATION - VERSION CORRIGÉE
   FIX: Gestion correcte des mises à jour (0/6 → 6/6)
   ========================================== */

(function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.warn('[SW] ❌ Service Workers non supportés');
    return;
  }
  
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js', {
        scope: './',
        updateViaCache: 'none'
      });
      
      console.log('[SW] ✅ Enregistré:', registration.scope);
      
      // ✅ FIX PRINCIPAL: Gérer le SW en attente (waiting)
      if (registration.waiting) {
        console.log('[SW] ⚠️ Nouveau SW en attente, activation...');
        updateServiceWorker(registration.waiting);
      }
      
      // ✅ Détecter les nouvelles installations
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('[SW] 🔄 Nouvelle version détectée');
        
        newWorker.addEventListener('statechange', () => {
          console.log('[SW] État:', newWorker.state);
          
          // ✅ Quand le nouveau SW est installé mais en attente
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Il y a déjà un SW actif, le nouveau est en attente
              console.log('[SW] ✨ Mise à jour disponible');
              updateServiceWorker(newWorker);
            } else {
              // Premier install, pas de SW actif
              console.log('[SW] 🎉 Première installation réussie');
            }
          }
          
          if (newWorker.state === 'activated') {
            console.log('[SW] ✅ Nouveau SW activé');
          }
        });
      });
      
      // ✅ Auto-reload quand le controller change
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          console.log('[SW] 🔄 Controller changé, reload...');
          refreshing = true;
          window.location.reload();
        }
      });
      
      // ✅ Écouter les messages du SW
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('[SW] 📬 Message:', event.data);
        
        if (event.data.type === 'SW_ACTIVATED') {
          console.log('[SW] ✅ Version:', event.data.version);
        }
      });
      
      // ✅ Vérifier les mises à jour toutes les 60 secondes
      setInterval(() => {
        registration.update().catch(err => {
          console.warn('[SW] ⚠️ Update check failed:', err);
        });
      }, 60000);
      
    } catch (err) {
      console.error('[SW] ❌ Erreur enregistrement:', err);
    }
  });
  
  // ✅ Fonction pour activer le nouveau SW
  function updateServiceWorker(worker) {
    // Option 1: Activation automatique silencieuse (RECOMMANDÉ)
    console.log('[SW] 🚀 Activation automatique du nouveau SW...');
    worker.postMessage({ type: 'SKIP_WAITING' });
    
    // Option 2: Demander confirmation (décommenter si préféré)
    /*
    const shouldUpdate = confirm(
      '🔄 Nouvelle version disponible!\n\n' +
      'Recharger maintenant pour profiter des améliorations?'
    );
    
    if (shouldUpdate) {
      worker.postMessage({ type: 'SKIP_WAITING' });
    }
    */
  }
  
  // ✅ Gérer le cas où le SW devient actif pendant que la page est chargée
  if (navigator.serviceWorker.controller) {
    console.log('[SW] ✅ SW contrôle déjà cette page');
  } else {
    console.log('[SW] ⏳ En attente du contrôle SW...');
  }
  
})();

/* ==========================================
   UTILITIES DE DEBUG
   ========================================== */

// Fonction accessible dans la console
window.checkSW = async function() {
  console.group('🔍 SERVICE WORKER STATUS');
  
  if (!('serviceWorker' in navigator)) {
    console.log('❌ Service Workers non supportés');
    console.groupEnd();
    return;
  }
  
  const registration = await navigator.serviceWorker.getRegistration();
  
  if (!registration) {
    console.log('❌ Aucun SW enregistré');
    console.groupEnd();
    return;
  }
  
  console.log('📊 Registration:', {
    scope: registration.scope,
    updateViaCache: registration.updateViaCache,
    installing: registration.installing?.state,
    waiting: registration.waiting?.state,
    active: registration.active?.state
  });
  
  const controller = navigator.serviceWorker.controller;
  if (controller) {
    console.log('✅ SW contrôle cette page');
    console.log('📄 Script URL:', controller.scriptURL);
  } else {
    console.log('⚠️ Aucun SW ne contrôle cette page');
    console.log('💡 Rechargez (Ctrl+Shift+R)');
  }
  
  // ✅ Vérifier si update disponible
  if (registration.waiting) {
    console.log('🔄 MISE À JOUR EN ATTENTE!');
    console.log('💡 Tapez: activateSW()');
  }
  
  // Caches
  try {
    const cacheNames = await caches.keys();
    console.log('💾 Caches:', cacheNames.length, 'cache(s)');
    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      console.log(`  - ${name}: ${keys.length} fichiers`);
    }
  } catch (e) {
    console.warn('⚠️ Impossible de lire les caches');
  }
  
  console.groupEnd();
};

// ✅ Forcer l'activation du SW en attente
window.activateSW = async function() {
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration?.waiting) {
    console.log('[SW] 🚀 Activation forcée...');
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  } else {
    console.log('[SW] ℹ️ Aucun SW en attente');
  }
};

// ✅ Forcer la vérification des mises à jour
window.updateSW = async function() {
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration) {
    console.log('[SW] 🔄 Vérification des mises à jour...');
    await registration.update();
    console.log('[SW] ✅ Vérification terminée');
    
    // Attendre un peu et vérifier si une mise à jour est disponible
    setTimeout(async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg.waiting) {
        console.log('[SW] 🔄 Mise à jour trouvée! Tapez: activateSW()');
      } else {
        console.log('[SW] ✅ Déjà à jour');
      }
    }, 1000);
  } else {
    console.log('[SW] ❌ Aucun SW enregistré');
  }
};

// ✅ Nettoyer complètement
window.clearSW = async function() {
  if (!confirm('⚠️ Supprimer tous les caches et désinstaller le SW?')) {
    return;
  }
  
  // Supprimer tous les caches
  const cacheNames = await caches.keys();
  for (const name of cacheNames) {
    await caches.delete(name);
    console.log('[Cache] 🗑️ Supprimé:', name);
  }
  
  // Désinstaller tous les SW
  const registrations = await navigator.serviceWorker.getRegistrations();
  for (const reg of registrations) {
    await reg.unregister();
    console.log('[SW] 🗑️ Désinstallé');
  }
  
  console.log('[SW] ✅ Nettoyage complet');
  
  if (confirm('Recharger la page?')) {
    window.location.reload(true);
  }
};

console.log('\n💡 Commandes disponibles dans la console:');
console.log('  - checkSW()    : Vérifier le statut');
console.log('  - updateSW()   : Forcer la vérification des mises à jour');
console.log('  - activateSW() : Activer le SW en attente');
console.log('  - clearSW()    : Tout nettoyer\n');