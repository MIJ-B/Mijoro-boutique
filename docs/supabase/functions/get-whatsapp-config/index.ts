import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Config rehetra masqué eto
    const config = {
      phone: Deno.env.get('WHATSAPP_PHONE') || '261337829146',
      businessName: Deno.env.get('BUSINESS_NAME') || 'Mijoro Boutique',
      greeting: Deno.env.get('WHATSAPP_GREETING') || 'Salama',
      messageTemplate: {
        intro: Deno.env.get('MESSAGE_INTRO') || 'Commande avy amin\'ny {businessName}',
        outro: Deno.env.get('MESSAGE_OUTRO') || 'Misaotra!',
        itemFormat: Deno.env.get('ITEM_FORMAT') || '• {name} x{qty} — {price} AR',
        totalFormat: Deno.env.get('TOTAL_FORMAT') || 'Total: {total} AR'
      }
    }
    
    return new Response(
      JSON.stringify(config),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
