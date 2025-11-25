import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");

// Supabase client
const SUPABASE_URL = Deno.env.get("URL_SUPABASE") || "";
const SUPABASE_SERVICE_KEY = Deno.env.get("ROLE_KEY") || "";
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
};

// Utility: sanitize user-provided search text
function sanitizeText(input: string) {
  if (!input) return "";
  // remove quotes/newlines and trim
  return input.replace(/["'`\\]/g, '').replace(/\s+/g, ' ').trim();
}

// Search products in Supabase (safe-ish)
async function searchProducts(query: string, limit: number = 5) {
  try {
    const safeQuery = sanitizeText(query);
    console.log('[Miora Search] 🔍 Searching products:', safeQuery);

    if (!safeQuery) return [];

    // select useful fields only
    const { data, error } = await supabase
      .from('products')
      .select('id,title,price,description,is_free,category,stock,slug')
      .or(`title.ilike.%${safeQuery}%,description.ilike.%${safeQuery}%`)
      .limit(limit);

    if (error) {
      console.error('[Miora Search] ❌ Error:', error);
      return [];
    }

    console.log('[Miora Search] ✅ Found:', data?.length || 0);
    return data || [];

  } catch (err) {
    console.error('[Miora Search] ❌ Exception:', err);
    return [];
  }
}

// Get free products (price = 0 OR is_free = true)
async function getFreeProducts(limit: number = 5) {
  try {
    console.log('[Miora Search] 🎁 Getting free products');

    // Use OR to match price eq 0 or is_free true
    const { data, error } = await supabase
      .from('products')
      .select('id,title,price,description,is_free,category,stock,slug')
      .or('(price.eq.0,is_free.eq.true)')
      .limit(limit);

    if (error) {
      console.error('[Miora Search] ❌ Error:', error);
      return [];
    }

    console.log('[Miora Search] ✅ Found:', data?.length || 0, 'free products');
    return data || [];

  } catch (err) {
    console.error('[Miora Search] ❌ Exception:', err);
    return [];
  }
}

// Get products by category
async function getProductsByCategory(category: string, limit: number = 5) {
  try {
    const safeCat = sanitizeText(category);
    console.log('[Miora Search] 📂 Getting category:', safeCat);

    if (!safeCat) return [];

    const { data, error } = await supabase
      .from('products')
      .select('id,title,price,description,is_free,category,stock,slug')
      .ilike('category', `%${safeCat}%`)
      .limit(limit);

    if (error) {
      console.error('[Miora Search] ❌ Error:', error);
      return [];
    }

    console.log('[Miora Search] ✅ Found:', data?.length || 0);
    return data || [];

  } catch (err) {
    console.error('[Miora Search] ❌ Exception:', err);
    return [];
  }
}

// ✅ REMOVED: Product detection - Agent Miora is general purpose only
// No product search, no categories, no e-commerce features
// All queries go directly to AI model

// ✅ REMOVED: normalizeProducts - Agent Miora doesn't handle products

// Build human-friendly message while keeping consistency
// ✅ REMOVED: buildHumanMessage - Agent Miora uses AI responses only

  // ✅ REMOVED: buildHumanMessage - Agent Miora uses AI responses only

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const url = new URL(req.url);

  // Health check
  if (url.pathname === "/" || url.pathname === "" || req.method === 'GET') {
 return new Response(
  JSON.stringify({
    status: "online",
    message: "Agent Miora AI Running",
    version: "3.0",
    mode: "general-purpose",
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    features: ["ai-chat", "multilingual", "general-knowledge", "no-products"]
  }),
  { headers: { ...corsHeaders, "Content-Type": "application/json" } }
);
  }

  if (req.method === "POST") {
    try {
      let requestBody;
      try {
        requestBody = await req.json();
      } catch (e) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid JSON" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { message, userId, searchContext } = requestBody;

      if (!message || typeof message !== "string") {
        return new Response(
          JSON.stringify({ success: false, error: "message ilaina" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (message.length > 50000) {
        return new Response(
          JSON.stringify({ success: false, error: "Message lava loatra (max 50000 chars)" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
// ✅ AGENT MIORA: No product search - direct to AI
console.log('[Agent Miora] 🤖 Processing message:', message);

// Groq AI call (only option)
if (!GROQ_API_KEY) {
  console.warn("⚠️ GROQ_API_KEY not set");
  return new Response(
    JSON.stringify({
      success: false,
      error: "Agent Miora nécessite une clé API Groq",
      message: "Configuration requise pour utiliser Agent Miora."
    }),
    { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

      // PRIORITÉ 3: Groq AI fallback (only if key available)
      if (!GROQ_API_KEY) {
        console.warn("⚠️ GROQ_API_KEY not set; skipping Groq fallback. Returning suggestion message.");
        // Provide helpful suggestion so frontend user is guided
        return new Response(
          JSON.stringify({
            success: true,
            message: "Tsy nahita vokatra tao amin'ny catalogue izahay amin'izao fotoana izao. Azafady andramo: mitady [nom produit], maimaim-poana (gratuit), ebook, video, apps",
            products: [],
            model: "no-groq-key",
            note: "Set GROQ_API_KEY to enable AI fallback responses."
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("🔗 Calling Groq API...");

      const groqRes = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages: [
           {
  role: "system",
  content: `You are Agent Miora, a versatile AI assistant who helps with everything. You speak Malagasy, French, and English fluently.

🎯 YOUR ROLE:
- Help with general knowledge (history, science, culture, education)
- Marketing & Business (strategy, copywriting, branding, entrepreneurship)
- Prompt Engineering (AI prompts, optimization, techniques)
- Multilingual support (Malagasy, Français, English, Español)
- Creative tasks (writing, design concepts, ideas, content creation)
- Technical help (code, web development, apps, debugging)
- Education & learning (explanations, tutorials, study help)

💬 STYLE:
- Friendly, clear, and professional
- Provide in-depth explanations when needed
- Use examples to illustrate concepts
- Adapt language to user's preference
- Be open to all topics and questions

🌐 LANGUAGE DETECTION:
- Detect user's language automatically
- Respond in the same language they use
- Support code-switching if they mix languages

⚠️ IMPORTANT RULES:
- You are NOT specialized in any specific e-commerce or boutique
- If asked about specific products or shopping, explain you're a general assistant
- Focus on knowledge, education, and helping with tasks
- Be helpful, accurate, and comprehensive

Always respond naturally in the user's language (Malagasy, French, or English).`
},
              { role: "user", content: message },
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        }
      );

      if (!groqRes.ok) {
        const errorText = await groqRes.text();
        console.error("❌ Groq error:", groqRes.status, errorText);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Groq API error",
            status: groqRes.status,
            details: errorText,
          }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await groqRes.json();
      const reply = data?.choices?.[0]?.message?.content || "No response";

      // Try parsing structured JSON if the model returned it
      let parsed = null;
      try {
        parsed = JSON.parse(reply);
      } catch (_) {
        // not JSON - keep raw reply
      }

      // ✅ AGENT MIORA: Simple response (no products)
return new Response(
  JSON.stringify({
    success: true,
    message: reply,
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    assistant: "agent-miora",
    mode: "general-purpose"
  }),
  { headers: { ...corsHeaders, "Content-Type": "application/json" } }
);

    } catch (err) {
      console.error("❌ Server error:", err);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Server error",
          details: err?.message || String(err),
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }

  return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
});