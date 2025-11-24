import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ✅ VAPID Keys
const VAPID_PUBLIC_KEY = "BL8QmGLYoAXQnhXStyuriTFZF_hsIMkHpuxwmRUaCVVRWuyRN5cICB8smSeorTEGQ-3welHD9lFHDma7b--l5Ic";
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY");

// ✅ Icônes et images par défaut
const DEFAULT_BADGE = "https://mijoroboutique.netlify.app/icons/android-launchericon-96-96.png";
const DEFAULT_ICON = "https://mijoroboutique.netlify.app/icons/android-launchericon-192-192.png";
const FALLBACK_IMAGE = "https://i.ibb.co/kVQxwznY/IMG-20251104-074641.jpg";

if (!VAPID_PRIVATE_KEY) {
  console.error('❌ VAPID_PRIVATE_KEY is not set in environment variables');
  throw new Error('VAPID_PRIVATE_KEY manquante');
}

serve(async (req) => {
  // ==========================================
  // CORS Preflight
  // ==========================================
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // ==========================================
  // ⚠️ NO AUTH CHECK (Development/Test Mode)
  // ==========================================
  console.log('[Send Push] ⚠️ Running without authentication check');

  try {
    console.log('[Send Push] 📨 ===== REQUEST START =====');
    console.log('[Send Push] Method:', req.method);
    console.log('[Send Push] URL:', req.url);
    
    // ==========================================
    // PARSE REQUEST BODY
    // ==========================================
    const body = await req.json();
    const {
      productId,
      productTitle,
      productPrice,
      productType,
      thumbnail,
      productImage,
      thumbnail_url
    } = body;
    
    console.log('[Send Push] 📦 Body received:', JSON.stringify(body, null, 2));
    
    // ==========================================
    // VALIDATION
    // ==========================================
    if (!productTitle || productTitle.trim() === '') {
      throw new Error('Missing or empty productTitle');
    }
    
    if (!productId) {
      throw new Error('Missing productId');
    }
    
    if (productPrice === undefined || productPrice === null) {
      throw new Error('Missing productPrice');
    }
    
    // ==========================================
    // IMAGE SELECTION (Priority: productImage > thumbnail > thumbnail_url > fallback)
    // ==========================================
    let imageUrl = FALLBACK_IMAGE;
    let imageSource = 'fallback';
    
    if (productImage && productImage.startsWith('http')) {
      imageUrl = productImage;
      imageSource = 'productImage';
    } else if (thumbnail && thumbnail.startsWith('http')) {
      imageUrl = thumbnail;
      imageSource = 'thumbnail';
    } else if (thumbnail_url && thumbnail_url.startsWith('http')) {
      imageUrl = thumbnail_url;
      imageSource = 'thumbnail_url';
    }
    
    console.log('[Send Push] 🖼️ Image selection:');
    console.log('[Send Push]   Source:', imageSource);
    console.log('[Send Push]   URL:', imageUrl);
    console.log('[Send Push]   Custom:', imageUrl !== FALLBACK_IMAGE ? '✅' : '❌');
    
    // ==========================================
    // SETUP WEB-PUSH
    // ==========================================
    webpush.setVapidDetails(
      'mailto:joroandriamanirisoa13@gmail.com',
      VAPID_PUBLIC_KEY,
      VAPID_PRIVATE_KEY
    );
    
    // ==========================================
    // CONNECT TO SUPABASE
    // ==========================================
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials in environment');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // ==========================================
    // FETCH ACTIVE SUBSCRIPTIONS
    // ==========================================
    console.log('[Send Push] 📡 Fetching subscriptions...');
    
    const { data: subscriptions, error: fetchError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('is_active', true);
    
    if (fetchError) {
      console.error('[Send Push] ❌ Fetch error:', fetchError);
      throw fetchError;
    }
    
    console.log('[Send Push] 👥 Found', subscriptions?.length || 0, 'active subscribers');
    
    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          sent: 0, 
          total: 0,
          message: 'No active subscribers' 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        }
      );
    }
    
    // ==========================================
    // BUILD NOTIFICATION PAYLOAD
    // ==========================================
    const type = productType || 'numeric';
    const emoji = type === 'physical' ? '📦' : '💻';
    const priceText = productPrice > 0 
      ? `${productPrice.toLocaleString('fr-FR')} AR` 
      : 'Gratuit';
    
    const notificationPayload = {
      title: `${emoji} Nouveau produit!`,
      body: `${productTitle}\n💰 ${priceText}`,
      
      // ✅ IMAGES
      image: imageUrl,              // Grande image (600x400px)
      icon: DEFAULT_ICON,           // Logo Mijoro fixe (192x192px)
      badge: DEFAULT_BADGE,         // Badge app (96x96px) - Logo Mijoro
      
      // ✅ METADATA
      tag: 'new-product-' + productId,
      requireInteraction: true,
      vibrate: [200, 100, 200],
      renotify: true,
      silent: false,
      
      // ✅ DATA
      data: {
        productId: productId,
        productType: type,
        productTitle: productTitle,
        productPrice: productPrice,
        productImage: imageUrl,
        url: `https://mijoroboutique.netlify.app/?product=${productId}#shop`,
        timestamp: Date.now()
      },
      
      // ✅ ACTIONS
      actions: [
        { 
          action: 'view', 
          title: '👀 Voir',
          icon: DEFAULT_ICON
        },
        { 
          action: 'dismiss', 
          title: '✖ Fermer'
        }
      ]
    };
    
    console.log('[Send Push] 📢 Notification payload:');
    console.log('[Send Push]   Title:', notificationPayload.title);
    console.log('[Send Push]   Body:', notificationPayload.body);
    console.log('[Send Push]   Image:', imageUrl);
    console.log('[Send Push]   Badge:', DEFAULT_BADGE);
    
    // ==========================================
    // SEND NOTIFICATIONS
    // ==========================================
    console.log('[Send Push] 📤 Sending notifications...');
    
    let sent = 0;
    let failed = 0;
    let deactivated = 0;
    
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              auth: sub.auth,
              p256dh: sub.p256dh
            }
          };
          
          await webpush.sendNotification(
            pushSubscription,
            JSON.stringify(notificationPayload),
            {
              TTL: 86400,        // 24 heures
              urgency: 'high',
              topic: 'new-product'
            }
          );
          
          sent++;
          console.log('[Send Push] ✅ Sent to:', sub.endpoint.substring(0, 60) + '...');
          
          // Update last_notification_at
          await supabase
            .from('push_subscriptions')
            .update({ 
              last_notification_at: new Date().toISOString(),
              notifications_sent: (sub.notifications_sent || 0) + 1
            })
            .eq('endpoint', sub.endpoint);
          
          return { success: true, endpoint: sub.endpoint };
          
        } catch (err: any) {
          failed++;
          console.error('[Send Push] ❌ Failed:', sub.endpoint.substring(0, 60), err.message);
          
          // Deactivate on permanent errors
          if (err.statusCode === 404 || err.statusCode === 410 || err.statusCode === 401) {
            try {
              await supabase
                .from('push_subscriptions')
                .update({ is_active: false })
                .eq('endpoint', sub.endpoint);
              
              deactivated++;
              console.log('[Send Push] 🗑️ Deactivated invalid subscription');
            } catch (deactivateErr) {
              console.error('[Send Push] Failed to deactivate:', deactivateErr);
            }
          }
          
          return { 
            success: false, 
            endpoint: sub.endpoint, 
            error: err.message,
            statusCode: err.statusCode 
          };
        }
      })
    );
    
    // ==========================================
    // SUMMARY
    // ==========================================
    console.log('[Send Push] 📊 ===== SUMMARY =====');
    console.log('[Send Push] ✅ Sent:', sent, '/', subscriptions.length);
    console.log('[Send Push] ❌ Failed:', failed);
    console.log('[Send Push] 🗑️ Deactivated:', deactivated);
    console.log('[Send Push] 🖼️ Image:', imageUrl);
    console.log('[Send Push] ✨ Custom:', imageUrl !== FALLBACK_IMAGE ? 'YES' : 'NO');
    console.log('[Send Push] 📦 Type:', type);
    console.log('[Send Push] 💰 Price:', priceText);
    console.log('[Send Push] ===== END =====');
    
    // ==========================================
    // RESPONSE
    // ==========================================
    return new Response(
      JSON.stringify({
        success: true,
        sent: sent,
        failed: failed,
        deactivated: deactivated,
        total: subscriptions.length,
        
        product: {
          id: productId,
          title: productTitle,
          price: productPrice,
          type: type,
          emoji: emoji
        },
        
        notification: {
          image: imageUrl,
          imageSource: imageSource,
          usedCustomImage: imageUrl !== FALLBACK_IMAGE,
          badge: DEFAULT_BADGE
        },
        
        message: `${emoji} Envoyé à ${sent}/${subscriptions.length} abonné(s)`,
        
        details: results.map(r => ({
          status: r.status,
          value: r.status === 'fulfilled' ? r.value : r.reason
        }))
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
    
  } catch (error: any) {
    console.error('[Send Push] 💥 ===== CRITICAL ERROR =====');
    console.error('[Send Push] Message:', error.message);
    console.error('[Send Push] Stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});