// ==========================================
// MIORA AI ASSISTANT - VERSION 2.1 FIXED
// Mijoro Boutique Integration
// ==========================================

console.log('🚀 [Miora] Starting initialization...');

// ==========================================
// 1. GLOBAL UTILITIES (VOALOHANY)
// ==========================================
(function initGlobalUtils() {
  'use strict';
  
  console.log('[Miora Utils] 🔧 Initializing...');
  
  // ✅ VAOVAO: Smart query detection with cleaning
window.detectQueryType = function(message) {
  const msg = message.toLowerCase().trim();
  
  console.log('[Detect] 📥 Raw message:', message);
  
  // ========================================
  // ✅ PRE-FILTER - Conversational Questions
  // ========================================
  // ========================================
// ✅ PRE-FILTER - Conversational Questions (ENHANCED)
// ========================================
const conversationalPatterns = [
  // About AI capabilities
  /\b(?:afaka|mahay|capable|can you|pouvez[- ]vous|able to)\s+(?:miteny|parler|speak|manao|faire|do)\b/i,
  
  // Greetings
  /^(?:salama|bonjour|hello|hi|hey|good morning|good evening|bonsoir|manao\s+ahoana)/i,
  
  // How are you
  /\b(?:manao ahoana|comment (?:vas|allez)|how are you|ça va|tsara ve)\b/i,
  
  // Who/What are you
  /\b(?:ianao|vous|you)\s+(?:iza|qui|who|inona|quoi|what)\b/i,
  /^(?:what|qui|iza|inona)\s+(?:is|are|es|no)\s+(?:miora|your|ton|votre)/i,
  
  // ✅ VAOVAO: Questions about Mijoro Boutique itself
  /\b(?:momba|à propos|about|concernant)\s+(?:ny\s+)?(?:mijoro\s*boutique|boutique|shop|magasin)\b/i,
  /\b(?:inona|quoi|what)\s+(?:no\s+)?(?:mijoro\s*boutique|la\s+boutique|the\s+shop)\b/i,
  /\b(?:mahalala|connaître|know)\s+.*(?:mijoro|boutique)\b/i,
  /\b(?:lazao|dis|tell).*(?:momba|à propos|about).*(?:mijoro|boutique)\b/i,
  
  // ✅ VAOVAO: About founder
  /\b(?:iza|qui|who)\s+(?:no\s+)?(?:namorona|a créé|created|fondateur|founder)\b/i,
  /\b(?:nahoana|pourquoi|why).*(?:mijoro|nom|name|anarana)\b/i,
  
  // ✅ VAOVAO: Job opportunities
  /\b(?:mandray|recrute|hiring|recherche).*(?:mpiasa|employés|workers|personnel)\b/i,
  /\b(?:asa|travail|job|emploi|mitady\s+asa)\b/i,
  
  // ✅ VAOVAO: Training questions
  /\b(?:fampiofanana|formation|training|cours)\b/i,
  /\b(?:mampanao|propose|offer).*(?:fampiofanana|formation|training)\b/i,
  
  // ✅ VAOVAO: Ordering process (not specific product)
  /\b(?:afaka|peut|can).*(?:manao\s+commande|commander|order|manafatra)\b/i,
  /^(?:manao|commander|order).*(?:commande|order)\s*ve\??$/i,
  
  // Help/Information about AI
  /\b(?:afaka|peut|can)\s+(?:manampy|aider|help|manao|faire|do)\b/i,
  /\b(?:inona|quoi|what)\s+(?:no|est|is)\s+(?:ataonao|votre|your)\b/i,
  
  // General conversation
  /^(?:ok|okay|d'accord|eny|yes|no|tsia|non|merci|misaotra|thanks?)\s*$/i,
  
  // Questions about Miora itself
  /\b(?:miora|assistant|chatbot|ai|intelligence)\b.*\b(?:ianao|vous|you|ton|votre|your)\b/i,
  
  // Contact questions (not product search)
  /\b(?:contact|fifandraisana|communication|joindre|mahazo|appeler|call)\b/i,
  /\b(?:whatsapp|email|téléphone|telephone|finday|numero|number|numéro)\b/i,
  
  // General questions without specific product intent
  /^(?:inona|quoi|what|ahoana|comment|how|oviana|quand|when|taiza|où|where|nahoana|pourquoi|why)\s+(?!.*(?:produit|product|zavatra|ebook|video|app|vêtement|vetement|akanjo))/i
];
  
  // Check if message matches conversational patterns
  for (const pattern of conversationalPatterns) {
    if (pattern.test(msg)) {
      console.log('[Detect] 💬 Conversational question detected, using AI');
      return null; // Let AI handle it
    }
  }
  
  // ========================================
  // PRODUCT SEARCH (intelligent with cleaning)
  // ========================================
  if (/mitady|cherche|search|find|misy|inona|ve|mahakasika|momba|tadiao|hitady/i.test(msg)) {
    // Extract search query intelligently
    const patterns = [
      { regex: /mitady\s+(.+?)(?:\s+ve|\s+ao|$)/i, name: 'mitady' },
      { regex: /cherche\s+(.+?)(?:\s+dans|$)/i, name: 'cherche' },
      { regex: /search\s+(?:for\s+)?(.+?)(?:\s+in|$)/i, name: 'search' },
      { regex: /find\s+(?:me\s+)?(.+?)(?:\s+for|$)/i, name: 'find' },
      { regex: /misy\s+(.+?)\s+ve/i, name: 'misy' },
      { regex: /inona\s+(?:ny|ireo)\s+(.+?)(?:\s+ve|$)/i, name: 'inona' },
      { regex: /mahakasika\s+(?:ny\s+)?(.+?)(?:\s+ve|$)/i, name: 'mahakasika' },
      { regex: /momba\s+(?:ny\s+)?(.+?)(?:\s+ve|$)/i, name: 'momba' }
    ];
    
    for (const pattern of patterns) {
      const match = msg.match(pattern.regex);
      if (match) {
        let query = match[1].trim();
        
        // ✅ SMART CLEANING
        query = query
          .replace(/\?+$/g, '') // Remove trailing ?
          .replace(/\s+(?:ao|ve|dans|in|for|amin'nareo|amin)\s*$/i, '') // Remove location suffixes
          .replace(/^(?:ny|ireo|ilay|le|la|les|the)\s+/i, '') // Remove articles
          .replace(/\s+(?:rehetra|tous|all|daholo)\s*$/i, '') // Remove "all"
          .trim();
        
        if (query.length >= 2) {
          console.log('[Detect] 🎯 Clean search query:', query);
          return { type: 'search', query: query };
        }
      }
    }
    
    // Fallback: extract keywords
    const keywords = msg
      .replace(/(mitady|cherche|search|find|misy|inona|mahakasika|momba|ve|ao|dans|in|for|amin'nareo)/gi, '')
      .trim();
    
    if (keywords.length >= 2) {
      console.log('[Detect] 🎯 Fallback search:', keywords);
      return { type: 'search', query: keywords };
    }
  }
  // ========================================
  // NOUVEAUTÉS / RECENT PRODUCTS
  // ========================================
  if (/(?:produit|zavatra|product).*(?:vaovao|nouveau|nouveauté|new|recent|farany|latest)|(?:vaovao|nouveau|new).*(?:produit|product)|(?:misy|y\s+a-t-il|are\s+there).*(?:vaovao|nouveau|new)|(?:nivoaka|sorti|released).*(?:farany|dernier|last)|(?:inona|quoi|what).*(?:nivoaka|sorti|released)|nouveauté/i.test(msg)) {
    console.log('[Detect] 🆕 New/recent products query');
    return { type: 'nouveaute', query: 'nouveaux produits' };
  }
  
  // ========================================
  // PRIX - CHEAP PRODUCTS
  // ========================================
  if (/(?:mora|pas\s+cher|cheap|low\s+cost|bon\s+marché|abordable|affordable).*(?:vidy|prix|price|cost)|(?:produit|zavatra|product).*(?:mora|cheap|pas\s+cher)|(?:misy|y\s+a-t-il|are\s+there).*(?:mora|cheap)|prix\s+(?:mora|moyen|bas|low)/i.test(msg)) {
    console.log('[Detect] 💰 Cheap products query');
    return { type: 'mora', query: 'produits bon marché' };
  }
  
  // ========================================
  // PRIX - EXPENSIVE PRODUCTS
  // ========================================
  if (/(?:lafo|cher|expensive|couteux|high\s+cost).*(?:vidy|prix|price|cost)|(?:produit|zavatra|product).*(?:lafo|cher|expensive)|(?:misy|y\s+a-t-il|are\s+there).*(?:lafo|cher)|prix\s+(?:lafo|élevé|high)/i.test(msg)) {
    console.log('[Detect] 💎 Expensive products query');
    return { type: 'lafo', query: 'produits chers' };
  }
  
  // ========================================
  // PROMOTIONS
  // ========================================
  if (/promotion|promo|fihainambidy|fihenam[-\s]?bidy|réduction|discount|solde|sale|special\s+(?:offer|price)/i.test(msg)) {
    console.log('[Detect] 🎉 Promotion query');
    return { type: 'promo', query: 'promotions' };
  }
// ========================================
// FREE PRODUCTS (ENHANCED - ALL PATTERNS)
// ========================================
// ✅ MALAGASY patterns
const mgFreePatterns = [
  /\b(?:mitady|tadidio|hitady)\s+.*(?:maimaim[-\s]?poana|poana)/i, // mitady maimaim-poana
  /\b(?:misy|inona|ahoana)\s+.*(?:maimaim[-\s]?poana|poana)/i, // misy maimaim-poana ve
  /\b(?:inona\s+(?:avy\s+)?(?:ny|ireo))\s+.*(?:maimaim[-\s]?poana|poana)/i, // inona avy ireo maimaim-poana
  /\b(?:asehoy|lazao)\s+.*(?:maimaim[-\s]?poana|poana)/i, // asehoy maimaim-poana
  /\bvokatra\s+(?:maimaim[-\s]?poana|poana)/i, // vokatra maimaim-poana
  /\b(?:produit|zavatra)\s+(?:maimaim[-\s]?poana|poana)/i, // produit maimaim-poana
  /\b(?:maimaim[-\s]?poana|poana)\s+(?:rehetra|daholo)/i, // maimaim-poana rehetra
  /^(?:maimaim[-\s]?poana|poana)\s*(?:ve)?\s*\??$/i // maimaim-poana / maimaim-poana ve
];

// ✅ FRENCH patterns
const frFreePatterns = [
  /\b(?:cherche|trouve|voir)\s+.*(?:gratuit|maimaim[-\s]?poana)/i, // cherche gratuit
  /\b(?:y\s+a-t-il|existe|avez-vous)\s+.*(?:gratuit|maimaim[-\s]?poana)/i, // y a-t-il gratuit
  /\b(?:quels?|quoi|lesquels)\s+.*(?:gratuit|maimaim[-\s]?poana)/i, // quels produits gratuits
  /\b(?:montre|donne)\s+.*(?:gratuit|maimaim[-\s]?poana)/i, // montre gratuit
  /\bproduits?\s+(?:gratuit|maimaim[-\s]?poana)/i, // produits gratuits
  /\b(?:gratuit|maimaim[-\s]?poana)\s+(?:disponible|en stock)/i, // gratuit disponible
  /^(?:gratuit|maimaim[-\s]?poana)s?\s*\??$/i // gratuit / gratuits?
];

// ✅ ENGLISH patterns
const enFreePatterns = [
  /\b(?:search|find|looking for)\s+.*(?:free|maimaim[-\s]?poana)/i, // search free
  /\b(?:are there|do you have|any)\s+.*(?:free|maimaim[-\s]?poana)/i, // are there free
  /\b(?:what|which)\s+.*(?:free|maimaim[-\s]?poana)/i, // what free products
  /\b(?:show|give)\s+.*(?:free|maimaim[-\s]?poana)/i, // show free
  /\bproducts?\s+(?:free|maimaim[-\s]?poana)/i, // products free
  /\b(?:free|maimaim[-\s]?poana)\s+(?:products?|items?)/i, // free products
  /^(?:free|maimaim[-\s]?poana)\s*\??$/i // free / free?
];

// ✅ COMBINED check
const allFreePatterns = [...mgFreePatterns, ...frFreePatterns, ...enFreePatterns];

for (const pattern of allFreePatterns) {
  if (pattern.test(msg)) {
    console.log('[Detect] 🎁 Free products query detected:', msg);
    console.log('[Detect] 🎯 Matched pattern:', pattern);
    
    // ✅ Extract clean keyword based on language
    let cleanQuery = 'produits gratuits';
    
    if (/maimaim[-\s]?poana/i.test(msg)) {
      cleanQuery = 'maimaim-poana';
    } else if (/gratuit/i.test(msg)) {
      cleanQuery = 'gratuit';
    } else if (/free/i.test(msg)) {
      cleanQuery = 'free';
    } else if (/poana/i.test(msg)) {
      cleanQuery = 'poana';
    }
    
    console.log('[Detect] 🎁 Clean query:', cleanQuery);
    return { type: 'free', query: cleanQuery };
  }
}

// ✅ FALLBACK: Simple keyword match (original logic)
if (/maimaim[-\s]?poana|gratuit|free|poana|tsy.*vola|sans.*payer/i.test(msg)) {
  console.log('[Detect] 🎁 Free products (fallback)');
  return { type: 'free', query: 'produits gratuits' };
}
  
  // ========================================
  // CATEGORIES - NUMÉRIQUE
  // ========================================
  if (/(?:mitady\s+)?(?:ebook|e-book|livre.*numerique|boky.*elektronika)/i.test(msg)) {
    return { type: 'category', category: 'ebook', query: 'ebooks' };
  }
  
  if (/(?:mitady\s+)?(?:video|vidéo|horonan-tsary|film|tutoriel)/i.test(msg)) {
    return { type: 'category', category: 'video', query: 'vidéos' };
  }
  
  if (/(?:mitady\s+)?(?:app|application|jeu|jeux|game|lalao|aplikasiona)/i.test(msg)) {
    return { type: 'category', category: 'apps', query: 'applications' };
  }
  
  // ========================================
  // CATEGORIES - PHYSIQUE
  // ========================================
  if (/(?:mitady\s+)?(?:vêtement|vetement|akanjo|clothing|clothes|t-shirt|pantalon)/i.test(msg)) {
    return { type: 'category', category: 'vêtements', query: 'vêtements' };
  }
  
  if (/(?:mitady\s+)?(?:électronique|electronique|electronic|elektronika|gadget)/i.test(msg)) {
    return { type: 'category', category: 'électronique', query: 'électronique' };
  }
  
  if (/(?:mitady\s+)?(?:accessoire|accessories|kojakoja|montre|bijou|sac)/i.test(msg)) {
    return { type: 'category', category: 'accessoires', query: 'accessoires' };
  }
  
  if (/(?:mitady\s+)?(?:livre.*physique|boky.*physique|physical.*book)/i.test(msg)) {
    return { type: 'category', category: 'livres', query: 'livres physiques' };
  }
  
  if (/(?:mitady\s+)?(?:autre|others|hafa|décoration|cadeau)/i.test(msg)) {
    return { type: 'category', category: 'autres', query: 'autres produits' };
  }
  
  if (/produit.*(?:physique|tangible)|zavatra.*physique|physical.*product/i.test(msg)) {
    return { type: 'category', category: 'physique', query: 'produits physiques' };
  }
  
  if (/produit.*(?:numérique|numerique|digital)|zavatra.*numérique/i.test(msg)) {
    return { type: 'category', category: 'numérique', query: 'produits numériques' };
  }
  
  // ========================================
// IMAGE GENERATION
// ========================================
if (/(?:sary|sarin|image|photo|dessin|picture|draw|generate.*image|create.*image|manao.*sary|mamorona.*sary)/i.test(msg)) {
  console.log('[Detect] 🎨 Potential image generation request');
  
  // Extract prompt intelligently
  const patterns = [
    /manao\s+sary\s+(.+)/i,
    /mamorona\s+sary\s+(.+)/i,
    /sary\s+(.+)/i,
    /g[ée]n[ée]r(?:e|er)\s+(?:une\s+)?image\s+(?:de\s+)?(.+)/i,
    /cr[ée]er?\s+(?:une\s+)?image\s+(?:de\s+)?(.+)/i,
    /create\s+(?:an?\s+)?image\s+(?:of\s+)?(.+)/i,
    /generate\s+(?:an?\s+)?image\s+(?:of\s+)?(.+)/i,
    /draw\s+(?:me\s+)?(?:an?\s+)?(.+)/i,
    /picture\s+of\s+(.+)/i,
    /photo\s+(?:de\s+)?(.+)/i
  ];
  
  for (const pattern of patterns) {
    const match = msg.match(pattern);
    if (match) {
      let prompt = match[1].trim();
      
      // Clean prompt
      prompt = prompt
        .replace(/\?+$/g, '')
        .replace(/\s+(?:ve|svp|please|azafady)\s*$/i, '')
        .replace(/^(?:ny|ireo|ilay|le|la|les|the|a|an)\s+/i, '')
        .trim();
      
      if (prompt.length >= 3) {
        console.log('[Detect] 🎨 Image generation prompt:', prompt);
        return { type: 'image', prompt: prompt };
      }
    }
  }
}

console.log('[Detect] ❓ No specific query type detected');
return null;
};
})();

// ==========================================
// 2. SUPABASE CLIENT (DIRECT - SIMPLER)
// ==========================================
(function initSupabaseClient() {
  'use strict';
  
  console.log('[Miora Supabase] 🔗 Initializing...');
  
  // ✅ Anon key dia safe ho an'ny public (RLS protection)
  const SUPABASE_URL = 'https://zogohkfzplcuonkkfoov.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ29oa2Z6cGxjdW9ua2tmb292Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4Nzk0ODAsImV4cCI6MjA3NjQ1NTQ4MH0.AeQ5pbrwjCAOsh8DA7pl33B7hLWfaiYwGa36CaeXCsw';
  
  window.supabaseClient = {
    url: SUPABASE_URL,
    key: SUPABASE_ANON_KEY,
    
    async query(table, options = {}) {
      const { select = '*', limit, where, orderBy } = options;
      
      // ✅ Build REST API URL
      let url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}`;
      
      if (limit) url += `&limit=${limit}`;
      
      if (orderBy) {
        const [column, direction] = orderBy.split('.');
        url += `&order=${column}.${direction || 'desc'}`;
      }
      
      if (where) {
        Object.entries(where).forEach(([key, value]) => {
          url += `&${key}=eq.${value}`;
        });
      }
      
      try {
        console.log('[Supabase] 📡 Fetching:', url);
        
        const response = await fetch(url, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('[Supabase] ❌ Error:', response.status, errorText);
          throw new Error(`Supabase error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('[Supabase] ✅ Success:', data?.length || 0, 'items');
        
        return data || [];
        
      } catch (error) {
        console.error('[Supabase] ❌ Query error:', error);
        return [];
      }
    }
  };
  
  console.log('[Miora Supabase] ✅ Client ready');
})();
// ==========================================
// 3. PRODUCT SEARCH ENGINE (FIXED)
// ==========================================
(function initProductSearch() {
  'use strict';
  
  console.log('[Miora Products] 🔍 Initializing...');
  
async function searchProducts(query, limit = 10) { // ⬅️ 5 → 10
    try {
      console.log('[Search] 🔍 Smart Query:', query);
    
    if (!window.supabaseClient) {
      console.error('[Search] ❌ Supabase client not available');
      return [];
    }
    
    const data = await window.supabaseClient.query('products', {
      select: '*',
      limit: 200,
      orderBy: 'created_at.desc'
    });
    
    if (!data || data.length === 0) {
      console.warn('[Search] ⚠️ No products in database');
      return [];
    }
    
    // ✅ VAOVAO: Normalize query (remove accents, typos)
    const normalizeText = (text) => {
      return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[éèêë]/g, 'e')
        .replace(/[àâä]/g, 'a')
        .replace(/[îï]/g, 'i')
        .replace(/[ôö]/g, 'o')
        .replace(/[ùûü]/g, 'u')
        .trim();
    };
    
    const searchNormalized = normalizeText(query);
    const keywords = searchNormalized.split(/\s+/).filter(w => w.length >= 2);
    
    console.log('[Search] 🎯 Normalized keywords:', keywords);
    
    // ✅ VAOVAO: Enhanced synonyms with normalized versions
    const synonyms = {
      'motivation': ['motiv', 'enthousias', 'inspir', 'manentana', 'fanentana'],
      'discipline': ['disciplin', 'rigueur', 'fifeheza'],
      'ebook': ['livre', 'boky', 'book', 'livr', 'numerique'],
      'video': ['video', 'horonan', 'film', 'tutoriel'],
      'app': ['application', 'jeu', 'game', 'aplikasiona', 'lalao', 'logiciel'],
      'formation': ['formation', 'cours', 'training', 'fiofana', 'lesona'],
      'developpement': ['develop', 'fampandrosoa', 'growth'],
      'business': ['business', 'affaire', 'raharaha', 'commerce', 'entreprenariat']
    };
    
    const expandedKeywords = new Set(keywords);
    keywords.forEach(keyword => {
      Object.entries(synonyms).forEach(([base, syns]) => {
        // ✅ VAOVAO: Fuzzy matching (3+ chars)
        if (keyword.length >= 3) {
          if (base.includes(keyword.substring(0, 3)) || keyword.includes(base.substring(0, 3))) {
            expandedKeywords.add(base);
            syns.forEach(s => expandedKeywords.add(s));
          }
          syns.forEach(syn => {
            if (syn.includes(keyword.substring(0, 3)) || keyword.includes(syn.substring(0, 3))) {
              expandedKeywords.add(base);
              expandedKeywords.add(syn);
            }
          });
        }
      });
    });
    
    console.log('[Search] 🔄 Expanded keywords:', Array.from(expandedKeywords));
    
    // ✅ VAOVAO: Enhanced scoring with fuzzy matching
    const results = data.map(p => {
      let score = 0;
      
      const searchableFields = {
        title: normalizeText(p.title || ''),
        description: normalizeText(p.description || ''),
        subtitle: normalizeText(p.subtitle || ''),
        category: normalizeText(p.category || ''),
        product_type: normalizeText(p.product_type || ''),
        badge: normalizeText(p.badge || ''),
        tags: Array.isArray(p.tags) ?
          p.tags.map(t => normalizeText(t)).join(' ') :
          normalizeText(p.tags || '')
      };
      
      Array.from(expandedKeywords).forEach(keyword => {
        // Exact match (highest score)
        if (searchableFields.title.includes(keyword)) score += 15;
        if (searchableFields.badge.includes(keyword)) score += 12;
        if (searchableFields.tags.includes(keyword)) score += 10;
        if (searchableFields.category.includes(keyword)) score += 8;
        if (searchableFields.product_type.includes(keyword)) score += 8;
        if (searchableFields.subtitle.includes(keyword)) score += 6;
        if (searchableFields.description.includes(keyword)) score += 3;
        
        // ✅ VAOVAO: Fuzzy match (partial)
        if (keyword.length >= 3) {
          const partial = keyword.substring(0, 3);
          if (searchableFields.title.includes(partial)) score += 5;
          if (searchableFields.description.includes(partial)) score += 1;
        }
      });
      
      return { ...p, score };
    });
    
    const filtered = results
      .filter(p => p.score > 0)
      .sort((a, b) => {
        // ✅ VAOVAO: Secondary sort by price (free first)
        if (b.score === a.score) {
          return (a.is_free ? 0 : 1) - (b.is_free ? 0 : 1);
        }
        return b.score - a.score;
      });
    
    console.log('[Search] ✅ Found:', filtered.length, 'matching products');
    
    if (filtered.length > 0) {
      console.log('[Search] 🏆 Top 3:', filtered.slice(0, 3).map(p => `${p.title} (score: ${p.score})`));
    }
    
    return filtered.slice(0, limit);
    
  } catch (error) {
    console.error('[Search] ❌ Error:', error);
    return [];
  }
}

// ✅ GET FREE PRODUCTS
async function getFreeProducts(limit = 10) { // ⬅️ 5 → 10
  try {
   console.log('[Search] 🎁 Getting free products...'); //
    
    if (!window.supabaseClient) {
      console.error('[Search] ❌ Supabase client not available');
      return [];
    }
    
    const data = await window.supabaseClient.query('products', {
      select: '*',
      limit: 200
    });
    
    console.log('[Search] 📦 Received:', data?.length || 0, 'products');
    
    if (!data || data.length === 0) {
      return [];
    }
    
    const free = data.filter(p => {
  // ✅ VAOVAO: Multiple checks
  const price = Number(p.price) || 0;
  const isFree = p.is_free === true || p.is_free === 'true';
  const isZeroPrice = price === 0;
  
  // ✅ Check badge too
  const hasFreeTag = p.badge && /gratuit|free|poana|maimaim/i.test(p.badge);
  const hasFreeInTags = Array.isArray(p.tags) &&
    p.tags.some(tag => /gratuit|free|poana|maimaim/i.test(tag));
  
  const result = isFree || isZeroPrice || hasFreeTag || hasFreeInTags;
  
  if (result) {
    console.log('[Search] ✅ Free product found:', p.title,
      'price:', price, 'is_free:', p.is_free, 'badge:', p.badge);
  }
  
  return result;
});
    
    console.log('[Search] ✅ Found:', free.length, 'free products');
    return free.slice(0, limit);
    
  } catch (error) {
    console.error('[Search] ❌ Error:', error);
    return [];
  }
}

// ✅ GET BY CATEGORY
async function getByCategory(category, limit = 10) { // ⬅️ 5 → 10
    try {
      console.log('[Search] 📂 Category:', category);
    
    if (!window.supabaseClient) {
      console.error('[Search] ❌ Supabase client not available');
      return [];
    }
    
    const data = await window.supabaseClient.query('products', {
      select: '*',
      limit: 200
    });
    
    console.log('[Search] 📦 Received:', data?.length || 0, 'products');
    
    if (!data || data.length === 0) {
      return [];
    }
    
    const categoryLower = category.toLowerCase();
    
    const results = data.filter(p => {
      const cat = (p.category || '').toLowerCase();
      const prodType = (p.product_type || '').toLowerCase();
      return cat.includes(categoryLower) || prodType.includes(categoryLower);
    });
    
    console.log('[Search] ✅ Found:', results.length, 'in category');
    return results.slice(0, limit);
    
  } catch (error) {
    console.error('[Search] ❌ Error:', error);
    return [];
  }
}

// ✅ GET ALL PRODUCTS (for debugging)
async function getAllProducts(limit = 20) {
  try {
    console.log('[Search] 📋 Getting all products...');
    
    if (!window.supabaseClient) {
      console.error('[Search] ❌ Supabase client not available');
      return [];
    }
    
    const data = await window.supabaseClient.query('products', {
      select: '*',
      limit: limit,
      orderBy: 'created_at.desc'
    });
    
    console.log('[Search] 📦 Received:', data?.length || 0, 'products');
    return data || [];
    
  } catch (error) {
    console.error('[Search] ❌ Error:', error);
    return [];
  }
}

// ✅ EXPOSE GLOBALLY
window.MioraSearch = {
  search: searchProducts,
  getFree: getFreeProducts,
  getCategory: getByCategory,
  getAll: getAllProducts
};
  
  console.log('[Miora Products] ✅ Search engine ready');
  
  // TEST AUTOMATIQUE
  setTimeout(async () => {
        console.log('[Search] 🧪 Running automatic test...');
        try {
          const allProducts = await getAllProducts(10); // ⬅️ 5 → 10
      console.log('[Search] 🧪 Sample products:', allProducts.length);
      
      if (allProducts.length > 0) {
        console.log('[Search] 🧪 First product title:', allProducts[0].title);
        
        const firstWord = allProducts[0].title.split(' ')[0];
        console.log('[Search] 🧪 Testing search with:', firstWord);
        
        const searchResults = await searchProducts(firstWord);
        console.log('[Search] 🧪 Search results:', searchResults.length);
        
        if (searchResults.length > 0) {
          console.log('[Search] ✅ TEST PASSED: Search working!');
        } else {
          console.warn('[Search] ⚠️ TEST FAILED: Search not finding products');
        }
      } else {
        console.warn('[Search] ⚠️ No products in database');
      }
      
    } catch (err) {
      console.error('[Search] ❌ TEST ERROR:', err);
    }
  }, 2000);
  
})();
// ==========================================
// 3.5 PRODUCT CACHE SYSTEM
// ==========================================
(function initProductCache() {
  'use strict';
  
  console.log('[Miora Cache] 💾 Initializing...');
  
  // ✅ Cache variables
  let productCache = null;
  let cacheTime = 0;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  // ✅ Clear cache function
  window.mioraClearCache = function() {
    productCache = null;
    cacheTime = 0;
    console.log('[Cache] 🗑️ Cleared');
    if (typeof showNotification === 'function') {
      showNotification('🔄 Cache effacé', 'info', 2000);
    }
  };
  
  // ✅ Get cache info
  window.mioraGetCacheInfo = function() {
    if (!productCache) {
      return { cached: false, count: 0, age: 0 };
    }
    
    const age = Date.now() - cacheTime;
    const remaining = CACHE_DURATION - age;
    
    return {
      cached: true,
      count: productCache.length,
      age: Math.floor(age / 1000), // seconds
      remaining: Math.floor(remaining / 1000) // seconds
    };
  };
  
  // ✅ Override getAllProducts with cache
  const originalGetAllProducts = window.MioraSearch.getAll;
  
  window.MioraSearch.getAll = async function(limit = 20) {
    const now = Date.now();
    
    // Check cache validity
    if (productCache && (now - cacheTime < CACHE_DURATION)) {
      console.log('[Cache] ✅ Using cached products:', productCache.length, '→', limit);
      console.log('[Cache] ⏱️ Age:', Math.floor((now - cacheTime) / 1000), 'seconds');
      return productCache.slice(0, limit);
    }
    
    // Cache expired or empty - fetch fresh
    console.log('[Cache] 🔄 Fetching fresh data...');
    
    try {
      const data = await originalGetAllProducts.call(this, 200); // Fetch max
      
      if (data && data.length > 0) {
        productCache = data;
        cacheTime = now;
        console.log('[Cache] ✅ Cached:', data.length, 'products');
      }
      
      return data.slice(0, limit);
      
    } catch (error) {
      console.error('[Cache] ❌ Fetch error:', error);
      
      // Fallback to old cache if exists
      if (productCache) {
        console.log('[Cache] ⚠️ Using old cache as fallback');
        return productCache.slice(0, limit);
      }
      
      throw error;
    }
  };
  
  // ✅ Auto-clear cache after duration
  setInterval(() => {
    if (productCache && (Date.now() - cacheTime >= CACHE_DURATION)) {
      console.log('[Cache] ⏰ Auto-clearing expired cache');
      productCache = null;
      cacheTime = 0;
    }
  }, 60000); // Check every minute
  
  console.log('[Miora Cache] ✅ Ready (5min duration)');
  
})();

// ==========================================
// 4. MAIN MIORA AI ASSISTANT
// ==========================================
(function initMioraPro() {
  'use strict';

  console.log('[Miora Core] 🤖 Initializing...');

  // ========================================
  // CONFIGURATION
  // ========================================
  const config = {
    name: "Miora",
    apiKey: localStorage.getItem('miora-api-key') || '',
    apiUrl: "https://zogohkfzplcuonkkfoov.supabase.co/functions/v1/miora-ai",
    model: "llama-3.1-8b-instant",
    imageApiUrl: "https://image.pollinations.ai/prompt/",
    maxHistoryLength: 100,
    autoSave: true,
    voiceEnabled: true,
    typingSpeed: 20,
    autoReadResponses: false,
    autoSendVoice: true, 
    
    imageStyles: {
      realistic: "photorealistic, 8k, highly detailed, professional photography",
      cartoon: "cartoon style, vibrant colors, playful, illustration",
      minimalist: "minimalist design, clean lines, simple, modern",
      vintage: "vintage poster style, retro, aged paper texture",
      artistic: "artistic painting, impressionist style, canvas texture",
      professional: "professional design, corporate, clean, modern"
    },
    
    imageSizes: {
      square: { width: 1024, height: 1024, label: "Carré" },
      portrait: { width: 768, height: 1024, label: "Portrait" },
      landscape: { width: 1024, height: 768, label: "Paysage" },
      story: { width: 1080, height: 1920, label: "Story" },
      wide: { width: 1920, height: 1080, label: "Large" }
    },
    
    themes: {
      purple: { 
        name: "Purple Dream",
        primary: '#667eea', 
        secondary: '#764ba2',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      blue: { 
        name: "Ocean Blue",
        primary: '#3b82f6', 
        secondary: '#1e40af',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)'
      },
      green: { 
        name: "Forest Green",
        primary: '#10b981', 
        secondary: '#059669',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      },
      pink: { 
        name: "Rose Pink",
        primary: '#ec4899', 
        secondary: '#db2777',
        gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
      },
      orange: { 
        name: "Sunset Orange",
        primary: '#f97316', 
        secondary: '#ea580c',
        gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
      },
      dark: {
        name: "Dark Mode",
        primary: '#1f2937',
        secondary: '#111827',
        gradient: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
      }
    }
  };

  // ========================================
  // DOM ELEMENTS
  // ========================================
  // ✅ VAOVAO (tsy misy image upload):
const elements = {
  navBtn: document.getElementById('nav-miora'),
  chatWindow: document.getElementById('miora-chat'),
  closeBtn: document.getElementById('miora-close'),
  messagesDiv: document.getElementById('miora-messages'),
  inputField: document.getElementById('miora-input'),
  sendBtn: document.getElementById('miora-send'),
  quickActionsContainer: document.querySelector('.miora-quick-actions')
};

  // Validation
  if (!elements.navBtn || !elements.chatWindow || !elements.messagesDiv) {
    console.error('❌ Miora: Missing critical elements');
    return;
  }

  // ========================================
  // STATE
  // ========================================
  const state = {
  conversationHistory: [],
  currentLanguage: localStorage.getItem('miora-language') || 'mg', 
  currentTheme: localStorage.getItem('miora-theme') || 'purple',
  isDarkMode: localStorage.getItem('miora-dark-mode') === 'true',
  isTyping: false,
  isRecording: false, // ⬅️ VAOVAO: Track recording state
   currentAssistant: localStorage.getItem('miora-current-assistant') || 'miora',
  // ⬆️⬆️⬆️ FIN AJOUT ⬆️⬆️⬆️
  pinnedMessages: JSON.parse(localStorage.getItem('miora-pinned') || '[]'),
  favorites: JSON.parse(localStorage.getItem('miora-favorites') || '[]'),
  imageStyle: localStorage.getItem('miora-image-style') || 'professional',
  imageSize: localStorage.getItem('miora-image-size') || 'square',
  recognition: null,
  synthesis: window.speechSynthesis,
  stats: JSON.parse(localStorage.getItem('miora-stats') || '{"messagesCount":0,"startDate":"' + new Date().toISOString() + '","userMessages":0,"aiMessages":0}'),
  draftMessage: localStorage.getItem('miora-draft') || '',
  notificationsEnabled: localStorage.getItem('miora-notifications') !== 'false',
  soundEnabled: localStorage.getItem('miora-sound') !== 'false'
};


  // ========================================
  // UTILITY FUNCTIONS
  // ========================================
  
  // ========================================
// FIXED LANGUAGE DETECTION - PRIORITY ORDER
// ========================================
// ✅ VAOVAO: Add currentLanguage parameter
window.detectLanguage = function(text, currentLanguage = 'mg') {
  const msg = text.toLowerCase().trim();
  
  console.log('[Language] 🔍 Analyzing:', msg.substring(0, 50));
  
  // ✅ Use parameter instead of state.currentLanguage
  if (msg.length < 3) {
    console.log('[Language] ⏩ Too short, keeping:', currentLanguage);
    return currentLanguage;
  }
  
  // ========================================
  // STEP 1: ENGLISH DETECTION (PRIORITY)
  // ========================================
  const englishStrongIndicators = [
    'tell me', 'show me', 'give me', 'what is', 'how to',
    'where is', 'when did', 'why does', 'who is',
    'i want', 'i need', 'i would', 'can you', 'could you',
    'please help', 'thank you', 'hello there'
  ];
  
  for (const phrase of englishStrongIndicators) {
    if (msg.includes(phrase)) {
      console.log('[Language] 🇬🇧 STRONG English phrase:', phrase);
      return 'en';
    }
  }
  
  const englishKeywords = [
    'tell', 'about', 'what', 'how', 'where', 'when', 'why', 'who',
    'show', 'find', 'search', 'get', 'give', 'help', 'please',
    'the', 'this', 'that', 'these', 'those',
    'is', 'are', 'was', 'were', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'should', 'could',
    'hello', 'thanks', 'thank', 'yes', 'product', 'price'
  ];
  
  let enCount = 0;
  const words = msg.split(/\s+/);
  
  words.forEach(word => {
    if (englishKeywords.includes(word)) {
      enCount++;
    }
  });
  
  if (enCount >= 3) {
    console.log('[Language] 🇬🇧 English detected (', enCount, 'keywords)');
    return 'en';
  }
  
  // ========================================
  // STEP 2: FRENCH DETECTION
  // ========================================
  const frenchStrongIndicators = [
    'dis moi', 'montre moi', 'donne moi', 'qu\'est-ce',
    'comment faire', 'où est', 'quand est', 'pourquoi',
    's\'il te plaît', 's\'il vous plaît', 'merci beaucoup'
  ];
  
  for (const phrase of frenchStrongIndicators) {
    if (msg.includes(phrase)) {
      console.log('[Language] 🇫🇷 STRONG French phrase:', phrase);
      return 'fr';
    }
  }
  
  const frenchKeywords = [
    'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles',
    'le', 'la', 'les', 'un', 'une', 'des',
    'et', 'ou', 'mais', 'donc', 'pour', 'avec', 'dans', 'sur',
    'comment', 'quoi', 'quel', 'quelle', 'où',
    'cherche', 'trouve', 'montre', 'donne',
    'bonjour', 'salut', 'merci', 'oui', 'non',
    'produit', 'prix', 'gratuit', 'acheter'
  ];
  
  let frCount = 0;
  words.forEach(word => {
    if (frenchKeywords.includes(word)) {
      frCount++;
    }
  });
  
  if (frCount >= 3) {
    console.log('[Language] 🇫🇷 French detected (', frCount, 'keywords)');
    return 'fr';
  }
  
  // ========================================
  // STEP 3: MALAGASY DETECTION (LAST)
  // ========================================
  const malagasyStrongIndicators = [
    'lazao ahy', 'asehoy ahy', 'omeo ahy', 'inona no',
    'ahoana ny', 'taiza ny', 'rahoviana', 'nahoana',
    'azafady tompoko', 'misaotra betsaka', 'eny tompoko'
  ];
  
  for (const phrase of malagasyStrongIndicators) {
    if (msg.includes(phrase)) {
      console.log('[Language] 🇲🇬 STRONG Malagasy phrase:', phrase);
      return 'mg';
    }
  }
  
  const malagasyKeywords = [
    'aho', 'ianao', 'izy', 'isika', 'izahay', 'ianareo', 'izy ireo',
    'dia', 'ny', 'amin', 'fa', 'misy', 'tsy', 'mila', 'tiako',
    'ahoana', 'inona', 've', 'mitady', 'mahafantatra',
    'manao', 'mandeha', 'mihaino', 'mijery', 'mamaky',
    'salama', 'misaotra', 'azafady', 'eny', 'tsia',
    'zavatra', 'olona', 'toerana', 'fotoana'
  ];
  
  let mgCount = 0;
  words.forEach(word => {
    if (malagasyKeywords.includes(word)) {
      mgCount++;
    }
  });
  
  if (mgCount >= 3) {
    console.log('[Language] 🇲🇬 Malagasy detected (', mgCount, 'keywords)');
    return 'mg';
  }
  
  // ========================================
  // FALLBACK: KEEP CURRENT LANGUAGE
  // ========================================
  console.log('[Language] 🔄 Ambiguous, keeping:', currentLanguage);
  console.log('[Language] 📊 Scores - EN:', enCount, 'FR:', frCount, 'MG:', mgCount);
  
  return currentLanguage;
};
  function formatText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    let formatted = div.innerHTML;
    
    formatted = formatted.replace(/\n/g, '<br>');
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/`(.+?)`/g, '<code>$1</code>');
    formatted = formatted.replace(/^[•\-]\s+(.+)$/gm, '<li>$1</li>');
    
    if (formatted.includes('<li>')) {
      formatted = formatted.replace(/(<li>.+<\/li>)/s, '<ul>$1</ul>');
    }
    
    return formatted;
  }

  function playSound(type = 'success') {
    if (!state.soundEnabled) return;
    
    const sounds = {
      success: [523.25, 659.25],
      warning: [440, 349.23],
      error: [329.63, 261.63],
      message: [659.25, 783.99]
    };
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const frequencies = sounds[type] || sounds.success;
    
    frequencies.forEach((freq, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime + (i * 0.1));
      oscillator.stop(audioContext.currentTime + (i * 0.1) + 0.1);
    });
  }

  function showNotification(message, type = 'info', duration = 3000) {
    if (!state.notificationsEnabled) return;
    
    const notification = document.createElement('div');
    notification.className = `miora-notification miora-notification-${type}`;
    notification.textContent = message;
    
    const colors = {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: state.currentTheme ? config.themes[state.currentTheme].primary : '#3b82f6'
    };
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 14px 24px;
      background: ${colors[type]};
      color: white;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      z-index: 10000;
      font-weight: 600;
      font-size: 14px;
      animation: slideInRight 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    
    document.body.appendChild(notification);
    playSound(type);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }

  function updateStats(type) {
    state.stats.messagesCount = (state.stats.messagesCount || 0) + 1;
    state.stats.lastActivity = new Date().toISOString();
    
    if (type === 'user') {
      state.stats.userMessages = (state.stats.userMessages || 0) + 1;
    } else {
      state.stats.aiMessages = (state.stats.aiMessages || 0) + 1;
    }
    
    localStorage.setItem('miora-stats', JSON.stringify(state.stats));
  }

  function applyTheme(themeName) {
    const theme = config.themes[themeName];
    if (!theme) return;
    
    const root = document.documentElement;
    root.style.setProperty('--miora-primary', theme.primary);
    root.style.setProperty('--miora-secondary', theme.secondary);
    root.style.setProperty('--miora-gradient', theme.gradient);
    
    state.currentTheme = themeName;
    localStorage.setItem('miora-theme', themeName);
    
    showNotification(`🎨 Theme: ${theme.name}`, 'success', 2000);
  }

  function toggleDarkMode(enabled) {
    state.isDarkMode = enabled;
    localStorage.setItem('miora-dark-mode', enabled);
    
    if (enabled) {
      document.body.classList.add('miora-dark-mode');
      applyTheme('dark');
    } else {
      document.body.classList.remove('miora-dark-mode');
      applyTheme(state.currentTheme === 'dark' ? 'purple' : state.currentTheme);
    }
    
    showNotification(enabled ? '🌙 Dark Mode' : '☀️ Light Mode', 'info', 1500);
  }
// ========================================
  // ✅✅✅ DÉBUT AJOUT - ASSISTANT SWITCH ✅✅✅
  // ========================================
  
  // CREATE SWITCH UI
  function createAssistantSwitch() {
    const switchContainer = document.createElement('div');
    switchContainer.className = 'miora-assistant-switch';
    switchContainer.id = 'miora-assistant-switch';
    switchContainer.innerHTML = `
      <div class="assistant-switch-wrapper">
        <button class="assistant-option active" data-assistant="miora" title="Miora - Assistant Boutique">
          <img src="https://i.ibb.co/5xkSKtLt/IMG-20251116-WA0000.jpg" alt="Miora" class="assistant-avatar">
          <div class="assistant-info">
            <div class="assistant-name">Miora</div>
            <div class="assistant-role">Boutique</div>
          </div>
        </button>
        
        <button class="assistant-option" data-assistant="agent" title="Agent Miora - Assistant Général">
          <img src="https://i.ibb.co/fVfNcLv9/file-000000008188722fb075911ad3cee715.png" alt="Agent Miora" class="assistant-avatar">
          <div class="assistant-info">
            <div class="assistant-name">Agent Miora</div>
            <div class="assistant-role">Culture Générale</div>
          </div>
        </button>
      </div>
    `;
    
    return switchContainer;
  }
  
  // SWITCH FUNCTION
  function switchAssistant(assistantType) {
    console.log('[Assistant] 🔄 Switching to:', assistantType);
    
    state.currentAssistant = assistantType;
    localStorage.setItem('miora-current-assistant', assistantType);
    
    // Update UI
    document.querySelectorAll('.assistant-option').forEach(btn => {
      btn.classList.remove('active');
    });
    
    const selectedBtn = document.querySelector(`.assistant-option[data-assistant="${assistantType}"]`);
    if (selectedBtn) {
      selectedBtn.classList.add('active');
    }
    
    // Update avatar
    updateMessageAvatars(assistantType);
    
    // Show notification
    const names = {
      'miora': '🏪 Miora - Assistant Boutique',
      'agent': '🌍 Agent Miora - Culture Générale'
    };
    
    showNotification(names[assistantType] || 'Assistant changé', 'success', 2000);
    
    // Add system message
    const messages = {
      'mg': {
        'miora': '🏪 Tongasoa eto amin\'ny Miora 😁 🇲🇬! Afaka manampy anao momba ny Mijoro Boutique.',
        'agent': '🌍 Tongasoa eto amin\'ny Agent Miora🇲🇬! Afaka manampy anao amin\'ny zavatra rehetra.'
      },
      'fr': {
        'miora': '🏪 Bienvenue avec Miora! Je vous aide avec Mijoro Boutique.',
        'agent': '🌍 Bienvenue avec Agent Miora! Je peux vous aider avec tout.'
      },
      'en': {
        'miora': '🏪 Welcome to Miora! I help you with Mijoro Boutique.',
        'agent': '🌍 Welcome to Agent Miora! I can help you with anything.'
      }
    };
    
    const msg = messages[state.currentLanguage]?.[assistantType] || messages['mg'][assistantType];
    addMessage(msg, false, null, false);
  }
  
  function updateMessageAvatars(assistantType) {
    const avatarUrl = assistantType === 'miora' 
      ? 'https://i.ibb.co/5xkSKtLt/IMG-20251116-WA0000.jpg'
      : 'https://i.ibb.co/fVfNcLv9/file-000000008188722fb075911ad3cee715.png';
    
    window.currentAssistantAvatar = avatarUrl;
  }
  
  // EXPOSE GLOBALLY
  window.mioraSwitchAssistant = switchAssistant;
  
  function saveDraft() {
    const text = elements.inputField.value.trim();
    if (text) {
      state.draftMessage = text;
      localStorage.setItem('miora-draft', text);
    } else {
      localStorage.removeItem('miora-draft');
    }
  }

  function loadDraft() {
    if (state.draftMessage) {
      elements.inputField.value = state.draftMessage;
      showNotification('📝 Brouillon chargé', 'info', 2000);
    }
  }

  // ========================================
  // CONVERSATION MANAGEMENT
  // ========================================
  
  function saveConversation() {
  // ✅ DISABLED: No localStorage for history
  console.log('💾 [Session Only] Conversation saved in memory');
  // History dia mitoetra ao @ state.conversationHistory fotsiny
}

function loadConversation() {
  // ✅ DISABLED: No localStorage loading
  console.log('📂 [Session Only] Starting fresh conversation');
  // Tsy maka historique taloha intsony
}

  function exportConversation() {
    const data = {
      exportDate: new Date().toISOString(),
      language: state.currentLanguage,
      theme: state.currentTheme,
      messageCount: state.conversationHistory.length,
      statistics: state.stats,
      messages: state.conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        imageUrl: msg.imageUrl
      }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `miora-chat-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('✅ Conversation exportée!', 'success');
  }

  function clearHistory() {
    const confirmMsg = state.currentLanguage === 'mg' ? 
      'Hofafana ny conversation rehetra?' :
      state.currentLanguage === 'fr' ?
      'Effacer toute la conversation?' :
      'Clear all conversation history?';
    
    if (!confirm(confirmMsg)) return;
    
    state.conversationHistory = [];
    // ✅ No localStorage to remove
console.log('🗑️ History cleared from memory only');
    
    const messages = elements.messagesDiv.querySelectorAll('.miora-message:not(:first-child)');
    messages.forEach(msg => msg.remove());
    
    showNotification('🗑️ Historique effacé', 'info');
  }

  // ========================================
  // MESSAGE MANAGEMENT
  // ========================================
  
  function addMessage(text, isUser = false, imageUrl = null, animate = true, messageId = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `miora-message ${isUser ? 'miora-user' : 'miora-bot'}`;
    msgDiv.dataset.messageId = messageId || Date.now();
    
    const formattedText = isUser ? text : (animate ? '' : formatText(text));
    
    let imageHTML = '';
    if (imageUrl) {
      imageHTML = `
        <div class="miora-message-image">
          <img src="${imageUrl}" alt="Image" onclick="window.mioraViewImage('${imageUrl}')" loading="lazy">
        </div>
      `;
    }
    
  // ✅✅✅ REMPLACER CETTE PARTIE ✅✅✅
const currentAvatar = window.currentAssistantAvatar ||
  (state.currentAssistant === 'agent' ?
    'https://i.ibb.co/fVfNcLv9/file-000000008188722fb075911ad3cee715.png' :
    'https://i.ibb.co/5xkSKtLt/IMG-20251116-WA0000.jpg');

const avatarHTML = isUser ?
  '<i class="fa-solid fa-user"></i>' :
  `<img src="${currentAvatar}" alt="${state.currentAssistant === 'agent' ? 'Agent Miora' : 'Miora'}" class="miora-msg-avatar">`;
// ⬆️⬆️⬆️ FIN REMPLACEMENT ⬆️⬆️⬆️
    
    const isPinned = state.pinnedMessages.includes(msgDiv.dataset.messageId);
    const pinIcon = isPinned ? 'fa-solid fa-thumbtack' : 'fa-regular fa-thumbtack';
    
    msgDiv.innerHTML = `
      <div class="miora-message-avatar">
        ${avatarHTML}
      </div>
      <div class="miora-message-content">
        <div class="miora-message-text">${formattedText}</div>
        ${imageHTML}
        <div class="miora-message-actions">
          ${!isUser ? `
            <button class="msg-action-btn" onclick="window.mioraCopy(this)" title="Copier">
              <i class="fa-solid fa-copy"></i>
            </button>
            <button class="msg-action-btn" onclick="window.mioraSpeak(this)" title="Lire">
              <i class="fa-solid fa-volume-up"></i>
            </button>
          ` : ''}
          <button class="msg-action-btn" onclick="window.mioraPinMessage(this)" title="Épingler">
            <i class="${pinIcon}"></i>
          </button>
          <button class="msg-action-btn msg-delete-btn" onclick="window.mioraDeleteMessage(this)" title="Supprimer">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
    
    elements.messagesDiv.appendChild(msgDiv);
    elements.messagesDiv.scrollTop = elements.messagesDiv.scrollHeight;
    
    return msgDiv;
  }

  async function typeMessage(text, element, speed = config.typingSpeed) {
    return new Promise((resolve) => {
      let i = 0;
      element.innerHTML = '';state.isTyping = true;
      
      function type() {
        if (i < text.length) {
          if (text[i] === '<') {
            const tagEnd = text.indexOf('>', i);
            if (tagEnd !== -1) {
              element.innerHTML += text.substring(i, tagEnd + 1);
              i = tagEnd + 1;
            } else {
              element.innerHTML += text[i];
              i++;
            }
          } else {
            element.innerHTML += text[i];
            i++;
          }
          
          elements.messagesDiv.scrollTop = elements.messagesDiv.scrollHeight;
          setTimeout(type, speed);
        } else {
          state.isTyping = false;
          
          if (config.autoReadResponses && state.synthesis) {
            speakResponse(text);
          }
          
          resolve();
        }
      }
      
      type();
    });
  }

  function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'miora-message miora-bot miora-typing-msg';
    typingDiv.innerHTML = `
      <div class="miora-message-avatar">
        <img src="https://i.ibb.co/5xkSKtLt/IMG-20251116-WA0000.jpg" alt="Miora" class="miora-msg-avatar">
      </div>
      <div class="miora-message-content">
        <div class="miora-message-text">
          <span class="miora-typing">
            <span></span><span></span><span></span>
          </span>
        </div>
      </div>
    `;
    elements.messagesDiv.appendChild(typingDiv);
    elements.messagesDiv.scrollTop = elements.messagesDiv.scrollHeight;
    return typingDiv;
  }

  // ========================================
  // MESSAGE ACTIONS (Global Functions)
  // ========================================
  
  window.mioraCopy = function(btn) {
    const text = btn.closest('.miora-message-content')
      .querySelector('.miora-message-text').textContent;
    navigator.clipboard.writeText(text).then(() => {
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i>';
      setTimeout(() => {
        btn.innerHTML = originalHTML;
      }, 2000);
      showNotification('📋 Copié!', 'success', 1500);
    });
  };

  window.mioraSpeak = function(btn) {
    const text = btn.closest('.miora-message-content')
      .querySelector('.miora-message-text').textContent;
    speakResponse(text);
  };

  window.mioraPinMessage = function(btn) {
    const msgDiv = btn.closest('.miora-message');
    const messageId = msgDiv.dataset.messageId;
    const icon = btn.querySelector('i');
    
    if (state.pinnedMessages.includes(messageId)) {
      state.pinnedMessages = state.pinnedMessages.filter(id => id !== messageId);
      icon.className = 'fa-regular fa-thumbtack';
      showNotification('📌 Message désépinglé', 'info', 1500);
    } else {
      state.pinnedMessages.push(messageId);
      icon.className = 'fa-solid fa-thumbtack';
      showNotification('📌 Message épinglé', 'success', 1500);
    }
    
    localStorage.setItem('miora-pinned', JSON.stringify(state.pinnedMessages));
  };

  window.mioraDeleteMessage = function(btn) {
    if (!confirm('Supprimer ce message?')) return;
    
    const msgDiv = btn.closest('.miora-message');
    const messageId = msgDiv.dataset.messageId;
    
    state.conversationHistory = state.conversationHistory.filter(
      msg => msg.timestamp !== parseInt(messageId)
    );
    
    msgDiv.remove();
    saveConversation();
    showNotification('🗑️ Message supprimé', 'info', 1500);
  };

  window.mioraViewImage = function(url) {
    const overlay = document.createElement('div');
    overlay.className = 'miora-image-overlay';
    overlay.innerHTML = `
      <div class="miora-image-viewer">
        <button class="miora-image-close" onclick="this.closest('.miora-image-overlay').remove()">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <img src="${url}" alt="Full image">
        <div class="miora-image-actions">
          <a href="${url}" download class="miora-image-download">
            <i class="fa-solid fa-download"></i> Télécharger
          </a>
        </div>
      </div>
    `;
    overlay.onclick = (e) => {
      if (e.target === overlay) overlay.remove();
    };
    document.body.appendChild(overlay);
  };
// ========================================
// PRODUCT COMPARISON FEATURE
// ========================================
(function initProductComparison() {
  console.log('[Comparison] 📊 Initializing...');
  
  window.mioraComparisonList = [];
  
  window.mioraAddToComparison = function(productId, productData) {
    // Check if already in comparison
    if (window.mioraComparisonList.find(p => p.id === productId)) {
      showNotification('⚠️ Efa ao anaty comparison', 'warning', 2000);
      return;
    }
    
    // Max 3 products
    if (window.mioraComparisonList.length >= 3) {
      showNotification('⚠️ Max 3 produit no azo ampitahaina', 'warning', 2000);
      return;
    }
    
    window.mioraComparisonList.push({
      id: productId,
      ...productData
    });
    
    showNotification(`✅ Ampidirina ao amin'ny comparison (${window.mioraComparisonList.length}/3)`, 'success', 2000);
    
    // Show comparison button if 2+ products
    if (window.mioraComparisonList.length >= 2) {
      showComparisonButton();
    }
  };
  
  window.mioraShowComparison = function() {
    if (window.mioraComparisonList.length < 2) {
      showNotification('⚠️ Mila 2 produit farafahakeliny', 'warning');
      return;
    }
    
    const msgDiv = window.mioraAddMessage('', false);
    const textDiv = msgDiv.querySelector('.miora-message-text');
    
    let html = `<div style="color:#fff;">`;
    
    html += `<div style="padding:14px; background:linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius:10px; margin-bottom:16px; text-align:center;">
      <div style="font-size:16px; font-weight:700;">📊 Fampitahana Produit</div>
    </div>`;
    
    // Comparison table
    html += `<div style="overflow-x:auto;">
      <table style="width:100%; border-collapse: collapse;">
        <thead>
          <tr style="background:rgba(139,92,246,0.2);">
            <th style="padding:10px; text-align:left; border:1px solid rgba(148,163,184,0.2);">Critères</th>`;
    
    window.mioraComparisonList.forEach(p => {
      html += `<th style="padding:10px; text-align:center; border:1px solid rgba(148,163,184,0.2);">${p.title}</th>`;
    });
    
    html += `</tr></thead><tbody>`;
    
    // Price row
    html += `<tr><td style="padding:10px; border:1px solid rgba(148,163,184,0.2); font-weight:600;">💰 Prix</td>`;
    window.mioraComparisonList.forEach(p => {
      const price = p.price > 0 ? `${Number(p.price).toLocaleString()} AR` : 'MAIMAIM-POANA';
      const color = p.price > 0 ? '#10b981' : '#f59e0b';
      html += `<td style="padding:10px; border:1px solid rgba(148,163,184,0.2); text-align:center; color:${color}; font-weight:700;">${price}</td>`;
    });
    html += `</tr>`;
    
    // Category row
    html += `<tr><td style="padding:10px; border:1px solid rgba(148,163,184,0.2); font-weight:600;">🏷️ Catégorie</td>`;
    window.mioraComparisonList.forEach(p => {
      html += `<td style="padding:10px; border:1px solid rgba(148,163,184,0.2); text-align:center;">${p.category || '-'}</td>`;
    });
    html += `</tr>`;
    
    // Badge row
    html += `<tr><td style="padding:10px; border:1px solid rgba(148,163,184,0.2); font-weight:600;">⭐ Badge</td>`;
    window.mioraComparisonList.forEach(p => {
      html += `<td style="padding:10px; border:1px solid rgba(148,163,184,0.2); text-align:center;">${p.badge || '-'}</td>`;
    });
    html += `</tr>`;
    
    html += `</tbody></table></div>`;
    
    // Actions
    html += `<div style="margin-top:16px; display:flex; gap:8px;">
      <button onclick="window.mioraClearComparison()" style="flex:1; padding:10px; background:rgba(239,68,68,0.2); color:#fca5a5; border:1px solid #ef4444; border-radius:8px; cursor:pointer;">
        🗑️ Fafao
      </button>
    </div>`;
    
    html += `</div>`;
    
    textDiv.innerHTML = html;
  };
  
  window.mioraClearComparison = function() {
    window.mioraComparisonList = [];
    hideComparisonButton();
    showNotification('🗑️ Comparison fafana', 'info', 1500);
  };
  
  function showComparisonButton() {
    let btn = document.getElementById('miora-comparison-float-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'miora-comparison-float-btn';
      btn.style.cssText = `
        position: fixed;
        bottom: 120px;
        right: 20px;
        background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 20px;
        font-weight: 700;
        font-size: 14px;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 8px 24px rgba(139,92,246,0.4);
        display: flex;
        align-items: center;
        gap: 8px;
        animation: slideInRight 0.3s ease;
      `;
      btn.innerHTML = `📊 Ampitahao (${window.mioraComparisonList.length})`;
      btn.onclick = window.mioraShowComparison;
      document.body.appendChild(btn);
    } else {
      btn.innerHTML = `📊 Ampitahao (${window.mioraComparisonList.length})`;
      btn.style.display = 'flex';
    }
  }
  
  function hideComparisonButton() {
    const btn = document.getElementById('miora-comparison-float-btn');
    if (btn) btn.style.display = 'none';
  }
  
  console.log('[Comparison] ✅ Ready');
})();
  // ========================================
  // VOICE FUNCTIONS
  // ========================================
  // ========================================
// VOICE RECORDING ENHANCED - FENO
// ========================================
function setupVoiceRecognition() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    console.warn('⚠️ Speech recognition not supported');
    return;
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  state.recognition = new SpeechRecognition();
  
  // ✅ VAOVAO: Enhanced settings with error recovery
  state.recognition.continuous = true;
  state.recognition.interimResults = true;
  state.recognition.maxAlternatives = 3;
  
  const languageMap = {
    'mg': 'mg-MG',
    'fr': 'fr-FR',
    'en': 'en-US'
  };
  state.recognition.lang = languageMap[state.currentLanguage] || 'mg-MG';
  
  let restartTimeout;
  let isManualStop = false;
  
  state.recognition.onstart = () => {
    console.log('🎤 Voice recording started');
    isManualStop = false;
    const micBtn = document.getElementById('miora-mic-btn');
    if (micBtn) {
      micBtn.classList.add('listening', 'pulsing');
      micBtn.innerHTML = '<i class="fa-solid fa-stop"></i>';
      micBtn.setAttribute('aria-label', 'Arrêter l\'enregistrement vocal');
      micBtn.style.animation = 'pulse 1.5s infinite';
    }
    showRecordingIndicator();
    showNotification('🎤 Mihaino...', 'info', 2000);
  };
  
  state.recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }
    
    if (interimTranscript) {
      elements.inputField.value = finalTranscript + interimTranscript;
      elements.inputField.style.color = '#94a3b8';
    }
    
    if (finalTranscript) {
      elements.inputField.value = (elements.inputField.value + finalTranscript).trim();
      elements.inputField.style.color = '#fff';
      console.log('🎤 Final transcript:', finalTranscript);
    }
  };
  
  // ✅ VAOVAO: Enhanced error handling with retry
  state.recognition.onerror = (event) => {
    console.error('🎤 Recognition error:', event.error);
    const micBtn = document.getElementById('miora-mic-btn');
    if (micBtn) {
      micBtn.classList.remove('listening', 'pulsing');
      micBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
      micBtn.setAttribute('aria-label', 'Commencer l\'enregistrement vocal');
      micBtn.style.animation = '';
    }
    hideRecordingIndicator();
    
    // ✅ RETRY LOGIC for recoverable errors
    if (['no-speech', 'audio-capture'].includes(event.error) && !isManualStop) {
      clearTimeout(restartTimeout);
      restartTimeout = setTimeout(() => {
        console.log('🔄 Retrying voice recognition...');
        try {
          state.recognition.start();
        } catch (err) {
          console.error('❌ Retry failed:', err);
        }
      }, 1000);
      
      showNotification('🔄 Manandrana indray...', 'warning', 2000);
    } else {
      const errorMessages = {
        'not-allowed': { mg: '⚠️ Tsy manome alàlana ny mikro', fr: '⚠️ Microphone non autorisé', en: '⚠️ Microphone not allowed' },
        'network': { mg: '⚠️ Olana connexion', fr: '⚠️ Erreur réseau', en: '⚠️ Network error' },
        'aborted': { mg: '🛑 Tapaka', fr: '🛑 Interrompu', en: '🛑 Aborted' }
      };
      
      const msg = errorMessages[event.error] || { mg: '⚠️ Tsy afaka mihaino', fr: '⚠️ Erreur microphone', en: '⚠️ Microphone error' };
      showNotification(msg[state.currentLanguage] || msg.fr, 'error');
    }
  };
  
  state.recognition.onend = () => {
    clearTimeout(restartTimeout);
    const micBtn = document.getElementById('miora-mic-btn');
    if (micBtn) {
      micBtn.classList.remove('listening', 'pulsing');
      micBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
      micBtn.setAttribute('aria-label', 'Commencer l\'enregistrement vocal');
      micBtn.style.animation = '';
    }
    hideRecordingIndicator();
    
    const text = elements.inputField.value.trim();
    if (text && config.autoSendVoice && !isManualStop) {
      setTimeout(() => sendMessage(), 500);
    }
  };
  
  // ✅ VAOVAO: Manual stop tracking
  window.mioraStopVoice = function() {
    isManualStop = true;
    if (state.recognition) {
      state.recognition.stop();
    }
  };
}

// ✅ VAOVAO: Enhanced toggle with manual stop
function toggleVoiceRecognition() {
  if (!state.recognition) {
    const messages = {
      'mg': '⚠️ Tsy misy reconnaissance vocale',
      'fr': '⚠️ Reconnaissance vocale indisponible',
      'en': '⚠️ Voice recognition unavailable'
    };
    showNotification(messages[state.currentLanguage] || messages.fr, 'warning');
    return;
  }
  
  const micBtn = document.getElementById('miora-mic-btn');
  if (micBtn && micBtn.classList.contains('listening')) {
    window.mioraStopVoice();
    const messages = {
      'mg': '🛑 Tapitra ny recording',
      'fr': '🛑 Enregistrement arrêté',
      'en': '🛑 Recording stopped'
    };
    showNotification(messages[state.currentLanguage] || messages.fr, 'success', 1500);
  } else {
    try {
      state.recognition.start();
    } catch (err) {
      console.error('❌ Failed to start:', err);
      showNotification('⚠️ Tsy afaka manomboka', 'error');
    }
  }
}

  // ========================================
  // AI API CALL (SIMPLIFIED - FOR NON-PRODUCT QUERIES ONLY)
  // ========================================
  
  async function callAI(userMessage, addToHistory = true) {
  try {
    // ✅ FIX: Get current language safely FIRST
    let currentLanguage = 'mg';
    try {
      currentLanguage = state?.currentLanguage || localStorage.getItem('miora-language') || 'mg';
    } catch (err) {
      console.warn('[AI] Language access error:', err);
      currentLanguage = 'mg';
    }
    
    console.log('[AI] 🌐 Using language:', currentLanguage);
    
    // Detect language
    const detectedLang = window.detectLanguage(userMessage, currentLanguage);
    if (detectedLang !== currentLanguage) {
      try {
        state.currentLanguage = detectedLang;
        localStorage.setItem('miora-language', detectedLang);
        currentLanguage = detectedLang;
        console.log('🌐 Language switched to:', currentLanguage);
      } catch (err) {
        console.warn('[AI] Failed to switch language:', err);
      }
    }
    
    if (addToHistory) {
      state.conversationHistory.push({
        role: "user",
        content: userMessage,
        timestamp: Date.now()
      });
    }
    
    // Trim history if too long
    if (state.conversationHistory.length > config.maxHistoryLength) {
      state.conversationHistory = state.conversationHistory.slice(-config.maxHistoryLength);
    }
    
    // ✅ Get current assistant safely
    let currentAssistant = 'miora';
    try {
      currentAssistant = state?.currentAssistant || localStorage.getItem('miora-current-assistant') || 'miora';
    } catch (err) {
      console.warn('[AI] Assistant access error:', err);
      currentAssistant = 'miora';
    }
    
    console.log('[AI] 👤 Using assistant:', currentAssistant);
    
    // ✅ Build system prompt with safe language access
    const assistantPrompts = {
      'miora': {
        'mg': `Ianao dia **Miora**, assistante IA ofisialy an'ny **Mijoro Boutique** 🇲🇬

🏪 **MOMBA NY MIJORO BOUTIQUE**
- Boutique en ligne malagasy nanomboka tamin'ny 2025
- **Produits numériques:** eBooks 📚, vidéos 🎬, apps/jeux 📱, formations 🎓
- **Produits physiques:** akanjo 👕, elektronika ⚡, kojakoja ⌚, boky 📖

📞 **FIFANDRAISANA (IMPORTANTE!)**
- **WhatsApp:** 0333106055 / +261 33 31 06 055 (PRIORITAIRE!)
- **Email:** mioraandriamiadana@gmail.com
- ⚠️ **Ho an'ny commande:** WhatsApp fotsiny no azo antoka!

🛒 **FOMBA FIVIDIANANA**

**1️⃣ Quick Order Section**
- Ao @ homepage: "Commande Express"  
      
- 8 produits vedette
- "Ajouter au panier" → maintso

**2️⃣ Panier - Ambany ankavanana**
- Icône  🛒 @ coin ambany ankavanana
- Click → panier drawer misokatra
- Hitanao ny produits rehetra

**3️⃣ Commander via WhatsApp**
- Ao @ panier: "Commander via WhatsApp"
- WhatsApp misokatra automatiquement
- Message pré-rempli (liste + prix)
- Alefaso → valiny haingana!

**4️⃣ Recherche**
- Barre de recherche ao @ top
- Filtres par catégorie
- Résultats instantanés

💬 **NY ASANAO**

**⚠️ RÈGLE: Manondro PRODUIT SEARCH na CONVERSATION**

**CONVERSATION (valio ianao):**

**1️⃣ Momba ny Boutique:**
- "Lazao ahy ny momba Mijoro Boutique" → Boutique en ligne malagasy, produits digital + physiques, WhatsApp: 0333106055
- "Mahalala ny momba Mijoro Boutique ve?" → Eny! Boutique vaovao 2025, varimbazaha + physique, contact: 0333106055 / mioraandriamiadana@gmail.com
- "Inona no Mijoro Boutique?" → Boutique officielle vente digital + physique, tsara indrindra @ Madagascar

**2️⃣ Founder & Histoire:**
- "Iza no namorona Mijoro Boutique?" → **ANDRIAMIADANARISON Miora** no namorona
- "Nahoana no antsoina hoe Mijoro?" → Tsy voahofana amin'io fanontaniana io aho, tsara kokoa manontany an'i Miora @ WhatsApp: 0333106055

**3️⃣ Asa sy Fampiofanana:**
- "Mandray mpiasa ve?" → Ny asa tsy sarotra fa TSARA KOKOA manontany an'i Miora @ WhatsApp (0333106055/0337829146), izy no afaka manapaka
- "Mampanao fampiofanana ve?" → Tsy afaka mamaly anizay aho fa afaka manontany @ WhatsApp (0333106055), FA KOSA misy produits formation ato @ boutique!

**4️⃣ Fividianana / Commande:**
- "Afaka manao commande ve?" → ENY AFAKA! 
  **Raha produit EFA AO @ shop:**
    - Quick Order: Mijery → Ajouter au panier (maintso) → Commander via WhatsApp
    - Shop: Recherche → Potsero produit → WhatsApp direct
  **Raha TSY AO:**
    - Manontany @ WhatsApp: 0333106055 / 0337829146

**5️⃣ Contact & Info:**
- WhatsApp: 0333106055 (PRIORITAIRE!)
- Email: mioraandriamiadana@gmail.com
- "Manao ahoana?" → Tsara aho misaotra! Inona azoko ampy anao?
- "Salama" → Tongasoa! Inona tadiavinao @ boutique?

**6️⃣ Vaovao ny boutique:**
- "Inona ny vaovao?" → Lazao: Produits nouveaux (60 jours), promos, categories populaires
- "Misy vaovao ve?" → ENY! Misy produits vaovao, mitadidiava fotsiny @ boutique

**PRODUCT SEARCH (aza mamaly - engine mikarakara):**
- "Mitady ebook" → Engine
- "Misy video ve?" → Engine
- "Maimaim-poana" → Engine
- "Mora vidy" → Engine (< 5000 AR)
- "Lafo vidy" → Engine (> 20000 AR)
- "Promotion" → Engine (badge promo)
- "Nouveauté" → Engine (< 60 jours)

**Fomba:** Mpinamana 😊, mazava, professionnel

⚠️ **TSY HADINO:**
- WhatsApp = 0333106055 (IMPORTANTE!)
- Panier = ambany ankavanana (🛒)
- Founder = ANDRIAMIADANARISON Miora
- BALANCE: Conversation vs Search

Valio amin'ny **Malagasy**.`,
        
        'fr': `Tu es **Miora**, assistante IA de **Mijoro Boutique** 🇫🇷

🏪 **MIJORO BOUTIQUE**
- Boutique malgache depuis 2025
- **Numériques:** eBooks 📚, vidéos 🎬, apps 📱, formations 🎓
- **Physiques:** vêtements 👕, électronique ⚡, accessoires ⌚, livres 📖

📞 **CONTACT**
- **WhatsApp:** 0333106055 / +261 33 31 06 055 (PRIORITAIRE!)
- **Email:** mioraandriamiadana@gmail.com

🛒 **ACHETER**

**1️⃣ Quick Order**
- Homepage: "Commande Express"
- 8 produits vedettes
- "Ajouter au panier" → vert

**2️⃣ Panier - Bas droite**
- Icône 🛒 coin inférieur droit
- Click → panier s'ouvre
- Voir produits ajoutés

**3️⃣ Commander WhatsApp**
- Panier: "Commander via WhatsApp"
- WhatsApp s'ouvre auto
- Message pré-rempli
- Envoyez → réponse rapide!

**4️⃣ Recherche**
- Barre en haut
- Filtres catégories
- Résultats instantanés

💬 **RÔLE**

**⚠️ RÈGLE: CONVERSATION vs RECHERCHE**

**CONVERSATION (toi réponds):**
- "Quoi de neuf?" → Nouveaux produits, promos
- "Comment vas-tu?" → Réponds amicalement
- "Comment acheter?" → Explique 4 étapes
- "Contact?" → WhatsApp: 0333106055 + email
- "Bonjour" → Bienvenue, demande besoins
- "Utiliser site?" → Explique features

**RECHERCHE (moteur gère):**
- "Cherche ebook" → Moteur
- "Vidéos?" → Moteur
- "Gratuits" → Moteur

**Si "Quoi de neuf?":**
- Nouveaux produits
- Catégories populaires
- Produits gratuits
- Nouveautés boutique

**Style:** Amical 😊, clair, pro

⚠️ **RAPPEL:**
- WhatsApp = 0333106055
- Panier = bas droite (🛒)
- BALANCE: Conversation vs Recherche

Réponds en **Français**.`,
        
        'en': `You are **Miora**, AI assistant at **Mijoro Boutique** 🇬🇧

🏪 **MIJORO BOUTIQUE**
- Malagasy boutique since 2025
- **Digital:** eBooks 📚, videos 🎬, apps 📱, training 🎓
- **Physical:** clothing 👕, electronics ⚡, accessories ⌚, books 📖

📞 **CONTACT**
- **WhatsApp:** 0333106055 / +261 33 31 06 055 (PRIORITY!)
- **Email:** mioraandriamiadana@gmail.com

🛒 **BUY**

**1️⃣ Quick Order**
- Homepage: "Express Order"
- 8 featured products
- "Add to cart" → green

**2️⃣ Cart - Bottom right**
- 🛒 icon lower right
- Click → cart opens
- See added products

**3️⃣ Order WhatsApp**
- Cart: "Order via WhatsApp"
- WhatsApp opens auto
- Pre-filled message
- Send → fast response!

**4️⃣ Search**
- Bar at top
- Category filters
- Instant results

💬 **ROLE**

**⚠️ RULE: CONVERSATION vs SEARCH**

**CONVERSATION (you respond):**
- "What's new?" → New products, promos
- "How are you?" → Respond friendly
- "How to buy?" → Explain 4 steps
- "Contact?" → WhatsApp: 0333106055 + email
- "Hello" → Welcome, ask needs
- "Use site?" → Explain features

**SEARCH (engine handles):**
- "Search ebook" → Engine
- "Videos?" → Engine
- "Free?" → Engine

**If "What's new?":**
- New products
- Popular categories
- Free products
- Boutique updates

**Style:** Friendly 😊, clear, pro

⚠️ **REMEMBER:**
- WhatsApp = 0333106055
- Cart = bottom right (🛒)
- BALANCE: Conversation vs Search

Respond in **English**.`
      },
      
      'agent': {
        'mg': `Ianao dia **Agent Miora**, AI assistant mahay zavatra rehetra 🌍

🎯 **NY ASANAO**
- Manampy amin'ny **culture générale** (tantara, siansa, kolontsaina...)
- **Marketing & Business** (stratégie, copywriting, branding...)
- **Prompt Engineering** (AI prompts, optimization...)
- **Multilingual** (Malagasy, Français, English, español...)
- **Creative Tasks** (écriture, design concepts, idées...)
- **Technical Help** (code, web, apps...)
- **Education** (fianarana, fanazavana...)

💬 **FOMBA**
- Mpinamana 😊, mazava, professionnel
- Manome fanazavana lalina sy mazava
- Manome ohatra raha ilaina
- Misokatra amin'ny resaka rehetra
- Manaraka fiteny tadiavin'ny user

⚠️ **TSY HADINO:**
-Raha manontany momba **Mijoro Boutique sy produits mijoro boutique**: lazao fa Miora boutique assistant no mahay kokoa → miverina @ "Miora (Boutique AI)"
- Raha question **générale** (siantifika, technologie, histoire, creativity...): valio tsara

- Focus @ fanampiana sy fanazavana
- Mandray fiteny rehetra (Malagasy, Français, English...)
- Hanampy @ zavatra rehetra (marketing, prompt, culture...)

💡 **EXPERTISE:**
- **Marketing:** Stratégie digitale, copywriting, SEO, social media
- **Prompt Engineering:** Optimisation prompts AI, techniques avancées
- **Culture:** Histoire, sciences, arts, littérature
- **Business:** Entrepreneuriat, gestion, développement
- **Tech:** Code, web dev, apps, AI tools

Valio amin'ny **Malagasy**.`,
        
        'fr': `Tu es **Agent Miora**, assistant IA polyvalent 🌍

🎯 **TON RÔLE**
- Aide avec la **culture générale** (histoire, sciences, culture...)
- **Marketing & Business** (stratégie, copywriting, branding...)
- **Prompt Engineering** (prompts IA, optimisation...)
- **Multilingue** (Malagasy, Français, Anglais, Espagnol...)
- **Tâches Créatives** (écriture, concepts design, idées...)
- **Aide Technique** (code, web, apps...)
- **Éducation** (apprentissage, explications...)

💬 **STYLE**
- Amical 😊, clair, professionnel
- Explications approfondies et claires
- Exemples si nécessaire
- Ouvert à tous sujets
- Adapte la langue selon l'utilisateur

⚠️ **IMPORTANTE:**
- Si on demande **à propos de mijoro boutique ou produits Mijoro Boutique**: dis que Miora boutique est spécialisé → retourner à "Miora (Boutique AI)"
- Si question **générale** (science, tech, histoire, créativité...): réponds bien

- Focus sur l'aide et l'explication
- Accepte toutes langues (Malagasy, Français, English...)
- Aide sur tout sujet (marketing, prompts, culture...)

💡 **EXPERTISE:**
- **Marketing:** Stratégie digitale, copywriting, SEO, réseaux sociaux
- **Prompt Engineering:** Optimisation prompts IA, techniques avancées
- **Culture:** Histoire, sciences, arts, littérature
- **Business:** Entrepreneuriat, gestion, développement
- **Tech:** Code, web dev, apps, outils IA

Réponds en **Français**.`,
        
        'en': `You are **Agent Miora**, versatile AI assistant 🌍

🎯 **YOUR ROLE**
- Help with **general knowledge** (history, science, culture...)
- **Marketing & Business** (strategy, copywriting, branding...)
- **Prompt Engineering** (AI prompts, optimization...)
- **Multilingual** (Malagasy, French, English, Spanish...)
- **Creative Tasks** (writing, design concepts, ideas...)
- **Technical Help** (code, web, apps...)
- **Education** (learning, explanations...)

💬 **STYLE**
- Friendly 😊, clear, professional
- In-depth and clear explanations
- Examples when needed
- Open to all topics
- Adapt language to user

⚠️ **IMPORTANT:**
- If asked about **Mijoro Boutique or Mijoro boutique products**: say Miora boutique is specialized → switch back to "Miora (Boutique AI)"
- If **general question** (science, tech, history, creativity...): answer well

- Focus on help and explanation
- Accept all languages (Malagasy, French, English...)
- Help with anything (marketing, prompts, culture...)

💡 **EXPERTISE:**
- **Marketing:** Digital strategy, copywriting, SEO, social media
- **Prompt Engineering:** AI prompt optimization, advanced techniques
- **Culture:** History, sciences, arts, literature
- **Business:** Entrepreneurship, management, development
- **Tech:** Code, web dev, apps, AI tools

Respond in **English**.`
      }
    };

    const SYSTEM_PROMPT = assistantPrompts[currentAssistant]?.[currentLanguage] || 
                          assistantPrompts['miora']?.[currentLanguage] ||
                          assistantPrompts['miora']['mg'];
    
    // Call Edge Function
    const response = await fetch(config.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: SYSTEM_PROMPT + "\n\nUtilisateur: " + userMessage,
        userId: "user-" + Date.now()
      })
    });
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ Non-JSON response:', text.substring(0, 200));
      throw new Error('Edge Function returned non-JSON response');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Edge Function Error ${response.status}: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Edge Function response:', data);
    
    let aiResponse;
    if (data.success && data.message) {
      aiResponse = data.message;
    } else if (data.error) {
      throw new Error(data.error);
    } else {
      throw new Error('Format de réponse invalide');
    }
    
    if (addToHistory) {
      state.conversationHistory.push({
        role: "assistant",
        content: aiResponse,
        timestamp: Date.now()
      });
      
      saveConversation();
      updateStats('ai');
    }
    
    return aiResponse;
    
  } catch (error) {
    console.error('❌ Miora AI Error:', error);
    
    let errorMsg = '⚠️ ';
    if (error.message.includes('HTML page')) {
      errorMsg += 'Erreur de déploiement Edge Function.';
    } else if (error.message.includes('CORS')) {
      errorMsg += 'Erreur CORS.';
    } else {
      errorMsg += `Erreur: ${error.message}`;
    }
    
    showNotification(errorMsg, 'error');
    return errorMsg;
  }
}
// ========================================
// IMAGE GENERATION (POLLINATIONS AI)
// ========================================
async function generateImage(prompt, style = 'professional', size = 'square') {
  try {
    console.log('[Image] 🎨 Generating:', prompt);
    
    // Get size dimensions
    const dimensions = config.imageSizes[size] || config.imageSizes.square;
    
    // Build enhanced prompt with style
    const stylePrompt = config.imageStyles[style] || config.imageStyles.professional;
    const fullPrompt = `${prompt}, ${stylePrompt}`;
    
    // Encode prompt for URL
    const encodedPrompt = encodeURIComponent(fullPrompt);
    
    // Build Pollinations URL
    const imageUrl = `${config.imageApiUrl}${encodedPrompt}?width=${dimensions.width}&height=${dimensions.height}&seed=${Date.now()}&nologo=true&enhance=true`;
    
    console.log('[Image] 🖼️ URL:', imageUrl);
    
    // Test if image loads
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        console.log('[Image] ✅ Generated successfully');
        resolve(imageUrl);
      };
      
      img.onerror = () => {
        console.error('[Image] ❌ Failed to load');
        reject(new Error('Image generation failed'));
      };
      
      // Set timeout (30 seconds max)
      setTimeout(() => {
        reject(new Error('Image generation timeout'));
      }, 30000);
      
      img.src = imageUrl;
    });
    
  } catch (error) {
    console.error('[Image] ❌ Error:', error);
    throw error;
  }
}

// Expose globally
window.mioraGenerateImage = generateImage;
  // ========================================
  // SEND MESSAGE
  // ========================================
  async function sendMessage() {
  const text = elements.inputField.value.trim();
  if (!text) return;  // ⬅️ VAOVAO: Tsy misy image check intsony
  if (state.isTyping) return;

  // Stop any speech
  if (state.synthesis) state.synthesis.cancel();

  // Clear draft
  localStorage.removeItem('miora-draft');
  state.draftMessage = '';

  // Update stats
  updateStats('user');

  // Add user message
  const msgId = Date.now();
  addMessage(text, true, null, false, msgId);  // ⬅️ VAOVAO: null ho an'ny imageUrl

  // Save to history
  state.conversationHistory.push({
    role: 'user',
    content: text,
    timestamp: msgId
    // ⬅️ TSY MISY imageUrl intsony
  });

  elements.inputField.value = '';
  elements.inputField.style.color = '#fff'; // ⬅️ RESET color

  elements.sendBtn.disabled = true;

  // Show typing
  const typingMsg = showTyping();
  
  const aiResponse = await window.mioraCallAI(text);
  
  typingMsg.remove();

  if (aiResponse) {
    const msgDiv = addMessage('', false, null, true);
    const textDiv = msgDiv.querySelector('.miora-message-text');
    await typeMessage(formatText(aiResponse), textDiv);
  }
elements.sendBtn.disabled = false;
  elements.inputField.focus();
}

  // ========================================
  // QUICK ACTIONS
  // ========================================
  function renderQuickActions() {
    if (!elements.quickActionsContainer) return;

    elements.quickActionsContainer.innerHTML = quickActions.map(action => {
      const label = state.currentLanguage === 'mg' ? action.labelMg :
                   state.currentLanguage === 'fr' ? action.labelFr : action.label;
      return `
        <button class="miora-quick-btn" data-prompt="${action.prompt}" title="${label}">
          <span class="quick-icon">${action.icon}</span>
          <span class="quick-label">${label}</span>
        </button>
      `;
    }).join('');

    elements.quickActionsContainer.querySelectorAll('.miora-quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        elements.inputField.value = btn.dataset.prompt;
        sendMessage();
      });
    });
  }

  // ========================================
  // SETTINGS PANEL
  // ========================================
  function createSettingsPanel() {
    const settingsPanel = document.createElement('div');
    settingsPanel.id = 'miora-settings-panel';
    settingsPanel.className = 'miora-settings-panel';
    
    settingsPanel.innerHTML = `
      <div class="miora-settings-overlay" onclick="window.mioraCloseSettings()"></div>
      <div class="miora-settings-content">
        <div class="miora-settings-header">
          <h3>⚙️ Paramètres</h3>
          <button class="miora-settings-close" onclick="window.mioraCloseSettings()">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <div class="miora-settings-body">
        <!-- Language Selection -->
<div class="setting-section">
  <h4>🌐 Langue / Fiteny / Language</h4>
  <div class="language-selector" style="display:flex; gap:10px;">
    <button class="language-btn ${state.currentLanguage === 'mg' ? 'active' : ''}" 
            data-lang="mg"
            style="flex:1; padding:12px; background:${state.currentLanguage === 'mg' ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(148,163,184,0.2)'}; color:#fff; border:${state.currentLanguage === 'mg' ? '2px solid #10b981' : '1px solid rgba(148,163,184,0.3)'}; border-radius:10px; font-weight:600; cursor:pointer; transition:all 0.3s;"
            onclick="window.mioraSwitchLanguage('mg')">
      🇲🇬 Malagasy
    </button>
    <button class="language-btn ${state.currentLanguage === 'fr' ? 'active' : ''}" 
            data-lang="fr"
            style="flex:1; padding:12px; background:${state.currentLanguage === 'fr' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(148,163,184,0.2)'}; color:#fff; border:${state.currentLanguage === 'fr' ? '2px solid #3b82f6' : '1px solid rgba(148,163,184,0.3)'}; border-radius:10px; font-weight:600; cursor:pointer; transition:all 0.3s;"
            onclick="window.mioraSwitchLanguage('fr')">
      🇫🇷 Français
    </button>
    <button class="language-btn ${state.currentLanguage === 'en' ? 'active' : ''}" 
            data-lang="en"
            style="flex:1; padding:12px; background:${state.currentLanguage === 'en' ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'rgba(148,163,184,0.2)'}; color:#fff; border:${state.currentLanguage === 'en' ? '2px solid #8b5cf6' : '1px solid rgba(148,163,184,0.3)'}; border-radius:10px; font-weight:600; cursor:pointer; transition:all 0.3s;"
            onclick="window.mioraSwitchLanguage('en')">
      🇬🇧 English
    </button>
  </div>
</div>
          <!-- Theme Selection -->
          <div class="setting-section">
            <h4>🎨 Thème</h4>
            <div class="theme-grid">
              ${Object.keys(config.themes).map(themeName => {
                const theme = config.themes[themeName];
                const isActive = state.currentTheme === themeName;
                return `
                  <button class="theme-option ${isActive ? 'active' : ''}" 
                          data-theme="${themeName}"
                          style="background: ${theme.gradient}">
                    <span>${theme.name}</span>
                    ${isActive ? '<i class="fa-solid fa-check"></i>' : ''}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
          
          <!-- Dark Mode Toggle -->
          <div class="setting-section">
            <h4>🌙 Mode Sombre</h4>
            <div class="setting-item">
              <label>
                <input type="checkbox" id="miora-dark-mode-toggle" 
                       ${state.isDarkMode ? 'checked' : ''}
                       onchange="window.mioraToggleDarkMode(this.checked)">
                Activer le mode sombre
              </label>
            </div>
          </div>
          
          <!-- Voice Settings -->
          <div class="setting-section">
            <h4>🎤 Voix</h4>
            <div class="setting-item">
              <label>
                <input type="checkbox" id="miora-voice-enabled" 
                       ${config.voiceEnabled ? 'checked' : ''}
                       onchange="window.mioraToggleVoice(this.checked)">
                Activer la reconnaissance vocale
              </label>
            </div>
            <div class="setting-item">
              <label>
                <input type="checkbox" id="miora-auto-read" 
                       ${config.autoReadResponses ? 'checked' : ''}
                       onchange="window.mioraToggleAutoRead(this.checked)">
                Lecture automatique des réponses
              </label>
            </div>
          </div>
          
          <!-- Notifications -->
          <div class="setting-section">
            <h4>🔔 Notifications</h4>
            <div class="setting-item">
              <label>
                <input type="checkbox" id="miora-notifications" 
                       ${state.notificationsEnabled ? 'checked' : ''}
                       onchange="window.mioraToggleNotifications(this.checked)">
                Activer les notifications
              </label>
            </div>
            <div class="setting-item">
              <label>
                <input type="checkbox" id="miora-sound" 
                       ${state.soundEnabled ? 'checked' : ''}
                       onchange="window.mioraToggleSound(this.checked)">
                Activer les sons
              </label>
            </div>
          </div>
          
          <!-- Statistics -->
          <div class="setting-section">
            <h4>📊 Statistiques</h4>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">${state.stats.messagesCount || 0}</div>
                <div class="stat-label">Messages totaux</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${state.stats.userMessages || 0}</div>
                <div class="stat-label">Vos messages</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${state.stats.aiMessages || 0}</div>
                <div class="stat-label">Réponses IA</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${state.pinnedMessages.length}</div>
                <div class="stat-label">Épinglés</div>
              </div>
            </div>
          </div>
          
<!-- Actions -->
<div class="setting-section">
            <h4>🔧 Actions</h4>
            <button class="setting-action-btn" onclick="window.mioraResetSettings()">
              <i class="fa-solid fa-rotate-left"></i> Réinitialiser
            </button>
            <button class="setting-action-btn" onclick="window.mioraExportConversation()">
              <i class="fa-solid fa-download"></i> Exporter conversation
            </button>
            <button class="setting-action-btn" onclick="
              const info = window.mioraGetCacheInfo();
              if (info.cached) {
                alert('💾 Cache: ' + info.count + ' produits\\n⏱️ Âge: ' + info.age + 's\\n⏳ Restant: ' + info.remaining + 's');
              } else {
                alert('📭 Aucun cache');
              }
            ">
              <i class="fa-solid fa-database"></i> Info Cache
            </button>
            <button class="setting-action-btn" onclick="window.mioraClearCache()">
              <i class="fa-solid fa-trash"></i> Vider Cache
            </button>
          </div>
        
        <div class="miora-settings-footer">
          <small>Miora AI Assistant v2.1 Fixed</small>
        </div>
      </div>
    `;

    document.body.appendChild(settingsPanel);
    
    // Add event listener for theme buttons
    settingsPanel.querySelectorAll('.theme-option').forEach(btn => {
      btn.addEventListener('click', function() {
        const themeName = this.dataset.theme;
        window.mioraSelectTheme(themeName);
      });
    });
  }

  // Settings functions
  window.mioraOpenSettings = function() {
    let panel = document.getElementById('miora-settings-panel');
    if (!panel) {
      createSettingsPanel();
      panel = document.getElementById('miora-settings-panel');
    }
    panel.classList.add('show');
  };

  window.mioraCloseSettings = function() {
    const panel = document.getElementById('miora-settings-panel');
    if (panel) panel.classList.remove('show');
  };

  window.mioraSelectTheme = function(themeName) {
    applyTheme(themeName);
    
    // Update UI
    document.querySelectorAll('.theme-option').forEach(btn => {
      btn.classList.remove('active');
      const icon = btn.querySelector('i');
      if (icon) icon.remove();
    });

    const selectedBtn = document.querySelector(`.theme-option[data-theme="${themeName}"]`);
    if (selectedBtn) {
      selectedBtn.classList.add('active');
      const checkIcon = document.createElement('i');
      checkIcon.className = 'fa-solid fa-check';
      selectedBtn.appendChild(checkIcon);
    }
  };

  window.mioraToggleVoice = function(enabled) {
    config.voiceEnabled = enabled;
    localStorage.setItem('miora-voice-enabled', enabled);
    showNotification(enabled ? '🎤 Voix activée' : '🔇 Voix désactivée', 'info', 1500);
  };

  window.mioraToggleAutoRead = function(enabled) {
    config.autoReadResponses = enabled;
    localStorage.setItem('miora-auto-read', enabled);
    showNotification(enabled ? '🔊 Lecture auto activée' : '🔇 Lecture auto désactivée', 'info', 1500);
  };

  window.mioraToggleDarkMode = function(enabled) {
    toggleDarkMode(enabled);
  };

  window.mioraToggleNotifications = function(enabled) {
    state.notificationsEnabled = enabled;
    localStorage.setItem('miora-notifications', enabled);
    showNotification(enabled ? '🔔 Notifications activées' : '🔕 Notifications désactivées', 'info', 1500);
  };

  window.mioraToggleSound = function(enabled) {
    state.soundEnabled = enabled;
    localStorage.setItem('miora-sound', enabled);
    if (enabled) playSound('success');
  };

  window.mioraResetSettings = function() {
    if (!confirm('Réinitialiser tous les paramètres?')) return;

    localStorage.removeItem('miora-theme');
    localStorage.removeItem('miora-language');
    localStorage.removeItem('miora-voice-enabled');
    localStorage.removeItem('miora-auto-read');
    localStorage.removeItem('miora-dark-mode');
    localStorage.removeItem('miora-notifications');
    localStorage.removeItem('miora-sound');

    showNotification('✅ Paramètres réinitialisés', 'success');
    setTimeout(() => location.reload(), 1500);
  };

  window.mioraExportConversation = function() {
    exportConversation();
  };
window.mioraSwitchLanguage = function(lang) {
  state.currentLanguage = lang;
  localStorage.setItem('miora-language', lang);
  
  // Update recognition language
  if (state.recognition) {
    const languageMap = {
      'mg': 'mg-MG',
      'fr': 'fr-FR',
      'en': 'en-US'
    };
    state.recognition.lang = languageMap[lang];
  }
  

  
  
  // Update UI
  document.querySelectorAll('.language-btn').forEach(btn => {
    const btnLang = btn.dataset.lang;
    if (btnLang === lang) {
      btn.classList.add('active');
      btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      btn.style.border = '2px solid #10b981';
    } else {
      btn.classList.remove('active');
      btn.style.background = 'rgba(148,163,184,0.2)';
      btn.style.border = '1px solid rgba(148,163,184,0.3)';
    }
  });
  
  const messages = {
    'mg': '🇲🇬 Miova ho Malagasy',
    'fr': '🇫🇷 Changé en Français',
    'en': '🇬🇧 Switched to English'
  };
  
  showNotification(messages[lang], 'success', 2000);
};
  // ========================================
  // ADDITIONAL UI ELEMENTS
  // ========================================
  function createAdditionalUI() {
    const header = elements.chatWindow.querySelector('.miora-header');
    if (!header) return;
// ✅✅✅ AJOUTER ICI ✅✅✅
    // Add assistant switch
    const switchUI = createAssistantSwitch();
    header.insertAdjacentElement('afterend', switchUI);
    
    // Add click handlers
    switchUI.querySelectorAll('.assistant-option').forEach(btn => {
      btn.addEventListener('click', function() {
        const assistantType = this.dataset.assistant;
        window.mioraSwitchAssistant(assistantType);
      });
    });
    // Settings Button
    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'miora-header-btn';
    settingsBtn.innerHTML = '<i class="fa-solid fa-gear"></i>';
    settingsBtn.title = 'Paramètres';
    settingsBtn.onclick = window.mioraOpenSettings;

    // Export Button
    const exportBtn = document.createElement('button');
    exportBtn.className = 'miora-header-btn';
    exportBtn.innerHTML = '<i class="fa-solid fa-download"></i>';
    exportBtn.title = 'Exporter';
    exportBtn.onclick = exportConversation;

    // Clear Button
    const clearBtn = document.createElement('button');
    clearBtn.className = 'miora-header-btn miora-clear-btn';
    clearBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    clearBtn.title = 'Effacer';
    clearBtn.onclick = clearHistory;

    // Insert before close button
    const closeBtn = header.querySelector('.miora-close');
    header.insertBefore(settingsBtn, closeBtn);
    header.insertBefore(exportBtn, closeBtn);
    header.insertBefore(clearBtn, closeBtn);

    // Mic Button
    if (config.voiceEnabled) {
      const inputArea = elements.chatWindow.querySelector('.miora-input-area');
      if (inputArea) {
        const micBtn = document.createElement('button');
        micBtn.className = 'miora-mic-btn';
        micBtn.id = 'miora-mic-btn';
        micBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
        micBtn.title = 'Commande vocale';
        micBtn.onclick = toggleVoiceRecognition;
        
        inputArea.insertBefore(micBtn, inputArea.children[1]);
      }
    }
  }

  // ========================================
  // CHAT WINDOW TOGGLE
  // ========================================
  function toggleChat(open) {
    if (open) {
      elements.chatWindow.setAttribute('aria-hidden', 'false');
      elements.navBtn.classList.add('active');
      elements.inputField.focus();
      
      // ✅ REMOVED: No need to load from localStorage
// Conversation dia manomboka foana @ vaovao isaky ny session
      
      // Load draft if exists
      if (state.draftMessage) {
        loadDraft();
      }
      
      // Apply saved theme
      if (state.isDarkMode) {
        toggleDarkMode(true);
      } else {
        applyTheme(state.currentTheme);
      }
    } else {
      elements.chatWindow.setAttribute('aria-hidden', 'true');
      elements.navBtn.classList.remove('active');
      
      // Stop speech
      if (state.synthesis) state.synthesis.cancel();
      
      // Save draft
      saveDraft();
    }
  }

  // ========================================
  // EVENT LISTENERS
  // ========================================
  
  // Toggle chat
  elements.navBtn.addEventListener('click', () => {
    const isOpen = elements.chatWindow.getAttribute('aria-hidden') === 'false';
    toggleChat(!isOpen);
  });

  elements.closeBtn.addEventListener('click', () => toggleChat(false));

  // Send message
  elements.sendBtn.addEventListener('click', sendMessage);

  // Enter to send
  // ========================================
// KEYBOARD NAVIGATION (ENHANCED)
// ========================================

// ========================================
// TEXTAREA AUTO-RESIZE + ENTER TO SEND
// ========================================

// Auto-resize textarea
elements.inputField.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});

// Enter to send (Shift+Enter for new line)
elements.inputField.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Reset height after sending
const originalSendMessage = sendMessage;
sendMessage = function() {
  originalSendMessage.call(this);
  if (elements.inputField) {
    elements.inputField.style.height = 'auto';
  }
};

// Add ARIA attributes to input
elements.inputField.setAttribute('aria-label', 'Tapez votre message pour Miora');
elements.inputField.setAttribute('aria-describedby', 'miora-input-hint');
elements.inputField.setAttribute('role', 'textbox');
elements.inputField.setAttribute('aria-multiline', 'false');

// Add hint element (invisible but read by screen readers)
const hintDiv = document.createElement('div');
hintDiv.id = 'miora-input-hint';
hintDiv.className = 'sr-only'; // Screen reader only
hintDiv.textContent = 'Appuyez sur Entrée pour envoyer votre message, ou utilisez le bouton Envoyer';
hintDiv.style.cssText = 'position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;';
elements.inputField.parentNode.insertBefore(hintDiv, elements.inputField);

// Make send button accessible
elements.sendBtn.setAttribute('aria-label', 'Envoyer le message');
elements.sendBtn.setAttribute('role', 'button');
elements.sendBtn.setAttribute('tabindex', '0');

// Keyboard support for send button
elements.sendBtn.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    sendMessage();
  }
});

  // Auto-save draft while typing
  let draftTimeout;
  elements.inputField.addEventListener('input', () => {
    clearTimeout(draftTimeout);
    draftTimeout = setTimeout(() => {
      saveDraft();
    }, 1000);
  });



  // ========================================
  // EXPOSE FUNCTIONS GLOBALLY
  // ========================================
  window.mioraAddMessage = addMessage;
  window.mioraTypeMessage = typeMessage;
  window.mioraFormatText = formatText;
  window.mioraSaveConversation = saveConversation;
  window.mioraCallAI = callAI; // ✅ Will be overridden by Smart Handler

  // ========================================
  // INITIALIZATION
  // ========================================
  console.log('[Miora Core] 🚀 Initializing...');

  // Setup voice
  setupVoiceRecognition();
// Initialize assistant avatar
  if (state.currentAssistant === 'agent') {
    window.currentAssistantAvatar = 'https://i.ibb.co/fVfNcLv9/file-000000008188722fb075911ad3cee715.png';
  } else {
    window.currentAssistantAvatar = 'https://i.ibb.co/5xkSKtLt/IMG-20251116-WA0000.jpg';
  }
  console.log('[Miora] 👤 Current assistant:', state.currentAssistant);
  // ⬆️⬆️⬆️ FIN AJOUT ⬆️⬆️⬆️

  // Create UI
  createAdditionalUI();

  // Apply theme
  if (state.isDarkMode) {
    toggleDarkMode(true);
  } else {
    applyTheme(state.currentTheme);
  }
// ✅ VAOVAO: Agent Miora Welcome
function addAgentWelcome() {
  const agentMessages = document.getElementById('agent-messages');
  if (!agentMessages) return;
  
  const welcomeMessages = {
    'mg': `🌍 **Tongasoa eto amin'ny Agent Miora** 👋 🇲🇬

Afaka manampy anao aho amin'ny zavatra rehetra:
• 📚 **Culture générale** (tantara, siansa, kolontsaina...)
• 💼 **Marketing & Business** (stratégie, copywriting...)
• 🤖 **Prompt Engineering** (AI prompts, optimization...)
• 🌐 **Multilingual** (Malagasy, Français, English...)
• ✍️ **Creative Tasks** (écriture, design, idées...)
• 💻 **Technical Help** (code, web, apps...)

💡 **Ohatra:**
- "Manazava ahy ny photosynthèse"
- "Prompt tsara ho an'ny image AI"
- "Copywriting ho an'ny produit Instagram"
- "Comment fonctionne le blockchain?"

⚠️ **Fa raha te-hahalala ny momba ny Mijoro Boutique ianao na hitady vokatra dia afaka mamaly tsara izay ilainao i Miora** 😊

**Inona no afaka ampiako anao androany?** 🚀`,
    
    'fr': `🌍 **Bienvenue avec Agent Miora** 👋 🇫🇷

Je peux vous aider avec tout:
• 📚 **Culture générale** (histoire, sciences, culture...)
• 💼 **Marketing & Business** (stratégie, copywriting...)
• 🤖 **Prompt Engineering** (prompts IA, optimisation...)
• 🌐 **Multilingue** (Malagasy, Français, Anglais...)
• ✍️ **Créativité** (écriture, design, idées...)
• 💻 **Technique** (code, web, apps...)

💡 **Exemples:**
- "Explique-moi la photosynthèse"
- "Bon prompt pour image IA"
- "Copywriting pour produit Instagram"
- "Comment fonctionne la blockchain?"

⚠️ **Mais si vous cherchez des infos sur Mijoro Boutique ou des produits, Miora pourra mieux vous aider** 😊

**Comment puis-je vous aider aujourd'hui?** 🚀`,
    
    'en': `🌍 **Welcome to Agent Miora** 👋 🇬🇧

I can help you with everything:
• 📚 **General knowledge** (history, science, culture...)
• 💼 **Marketing & Business** (strategy, copywriting...)
• 🤖 **Prompt Engineering** (AI prompts, optimization...)
• 🌐 **Multilingual** (Malagasy, French, English...)
• ✍️ **Creative** (writing, design, ideas...)
• 💻 **Technical** (code, web, apps...)

💡 **Examples:**
- "Explain photosynthesis"
- "Good prompt for AI image"
- "Copywriting for Instagram product"
- "How does blockchain work?"

⚠️ **But if you need info about Mijoro Boutique or products, Miora can help you better** 😊

**What can I help you with today?** 🚀`
  };
  
  const currentLang = localStorage.getItem('miora-language') || 'mg';
  const welcomeMsg = welcomeMessages[currentLang] || welcomeMessages.mg;
  
  const msgDiv = document.createElement('div');
  msgDiv.className = 'miora-message miora-bot';
  msgDiv.innerHTML = `
    <div class="miora-message-avatar">
      <img src="https://i.ibb.co/DgbXkmNh/file-00000000f1bc720cb2d18989240fb66e.png" alt="Agent Miora" class="miora-msg-avatar">
    </div>
    <div class="miora-message-content">
      <div class="miora-message-text">${formatText(welcomeMsg)}</div>
    </div>
  `;
  
  agentMessages.appendChild(msgDiv);
}




  console.log('[Miora Core] ✅ Fully initialized!');
  console.log('[Miora Core] 📊 Stats:', state.stats);
  console.log('[Miora Core] 🎨 Theme:', state.currentTheme);
  console.log('[Miora Core] 🌐 Language:', state.currentLanguage);

  // Show notification on load
  showNotification('✨ Miora prêt!', 'success', 2000);

})();

// ==========================================
// 5. SMART QUERY HANDLER (FIXED - WITH IMAGES + CART)
// ==========================================
(function initSmartHandler() {
  'use strict';
  
  console.log('[Miora Handler] 🧠 Initializing...');
  // ==========================================
// SMART SUGGESTIONS ENGINE
// ==========================================

async function generateSmartSuggestions(failedQuery) {
  console.log('[Suggestions] 🧠 Analyzing:', failedQuery);
  
  try {
    // Get all products for analysis
    const allProducts = await window.MioraSearch.getAll(50);
    
    if (!allProducts || allProducts.length === 0) {
      return { similar: [], trending: [], categories: [] };
    }
    
    const queryLower = failedQuery.toLowerCase();
    const keywords = queryLower.split(/\s+/).filter(w => w.length >= 2);
    
    // ========================================
    // 1. FIND SIMILAR (partial match)
    // ========================================
    const similar = allProducts
      .map(p => {
        let score = 0;
        const searchText = `${p.title} ${p.description || ''} ${p.category || ''}`.toLowerCase();
        
        keywords.forEach(keyword => {
          // Fuzzy matching
          if (searchText.includes(keyword.substring(0, 3))) score += 1;
          if (p.category && p.category.toLowerCase().includes(keyword.substring(0, 3))) score += 2;
        });
        
        return { ...p, score };
      })
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    
    console.log('[Suggestions] 💡 Similar products:', similar.length);
    
    // ========================================
    // 2. GET TRENDING (recent + popular)
    // ========================================
    const trending = allProducts
      .filter(p => {
        // Prioritize: free, recent, or with badges
        return p.is_free === true || 
               p.badge || 
               (p.created_at && new Date(p.created_at) > new Date(Date.now() - 30*24*60*60*1000));
      })
      .slice(0, 5);
    
    console.log('[Suggestions] 🔥 Trending products:', trending.length);
    
    // ========================================
    // 3. SUGGEST CATEGORIES
    // ========================================
    const categoryMap = {
      'motivation': { icon: '💪', name: 'Motivation', query: 'motivation' },
      'ebook': { icon: '📚', name: 'eBooks', query: 'ebook' },
      'video': { icon: '🎬', name: 'Vidéos', query: 'video' },
      'app': { icon: '📱', name: 'Applications', query: 'app' },
      'formation': { icon: '🎓', name: 'Formations', query: 'formation' },
      'business': { icon: '💼', name: 'Business', query: 'business' },
      'développement': { icon: '🚀', name: 'Développement', query: 'développement' }
    };
    
    // Detect relevant categories from query
    const categories = [];
    Object.entries(categoryMap).forEach(([key, value]) => {
      if (queryLower.includes(key.substring(0, 4))) {
        categories.push(value);
      }
    });
    
    // If no match, suggest popular categories
    if (categories.length === 0) {
      categories.push(
        categoryMap.ebook,
        categoryMap.video,
        categoryMap.app
      );
    }
    
    console.log('[Suggestions] 📂 Suggested categories:', categories.length);
    
    return {
      similar,
      trending,
      categories: categories.slice(0, 4)
    };
    
  } catch (error) {
    console.error('[Suggestions] ❌ Error:', error);
    return { similar: [], trending: [], categories: [] };
  }
}// ==========================================
// PRODUCT DETAILS MODAL
// ==========================================
window.mioraShowProductModal = function(productId, productData) {
  console.log('[Modal] 📦 Opening:', productId);
  
  // Parse if string
  if (typeof productData === 'string') {
    try {
      productData = JSON.parse(productData);
    } catch (err) {
      console.error('[Modal] ❌ Parse error:', err);
      return;
    }
  }
  
  const p = productData;
  
  // Build image URL
  let imageUrl = 'https://via.placeholder.com/400x300?text=No+Image';
  if (p.thumbnail_url) {
    if (p.thumbnail_url.startsWith('http')) {
      imageUrl = p.thumbnail_url;
    } else {
      const cleanPath = p.thumbnail_url.startsWith('images/') || p.thumbnail_url.startsWith('gallery/') ?
        p.thumbnail_url : `images/${p.thumbnail_url}`;
      imageUrl = `https://zogohkfzplcuonkkfoov.supabase.co/storage/v1/object/public/products/${cleanPath}`;
    }
  }
  
  // Detect badge
  let badgeHTML = '';
  if (p.is_free === true || p.price === 0) {
    badgeHTML = `<div style="display:inline-block; padding:6px 14px; background:#f59e0b; color:#fff; border-radius:8px; font-size:13px; font-weight:700; margin-bottom:10px;">✨ GRATUIT</div>`;
  } else if (p.badge) {
    badgeHTML = `<div style="display:inline-block; padding:6px 14px; background:#3b82f6; color:#fff; border-radius:8px; font-size:13px; font-weight:700; margin-bottom:10px;">⭐ ${p.badge.toUpperCase()}</div>`;
  } else if (p.price > 0) {
    badgeHTML = `<div style="display:inline-block; padding:6px 14px; background:#10b981; color:#fff; border-radius:8px; font-size:13px; font-weight:700; margin-bottom:10px;">💵 PAYANT</div>`;
  }
  
  // Detect if new (created within 30 days)
  const isNew = p.created_at && new Date(p.created_at) > new Date(Date.now() - 30*24*60*60*1000);
  if (isNew) {
    badgeHTML += `<div style="display:inline-block; padding:6px 14px; background:#ec4899; color:#fff; border-radius:8px; font-size:13px; font-weight:700; margin-left:8px; margin-bottom:10px;">🆕 NOUVEAU</div>`;
  }
  
  const price = p.price > 0 ? `${Number(p.price).toLocaleString()} AR` : '✨ MAIMAIM-POANA';
  const priceColor = p.price > 0 ? '#10b981' : '#f59e0b';
  
  // WhatsApp link
  const whatsappNumber = "261333106055";
  const productName = encodeURIComponent(p.title);
  const productPrice = p.price > 0 ? `${Number(p.price).toLocaleString()} AR` : 'MAIMAIM-POANA';
  const whatsappMessage = encodeURIComponent(
    `Salama! 👋\n\nTe-hanafatra aho:\n\n📦 *${p.title}*\n💰 Prix: ${productPrice}\n🆔 ID: ${p.id}\n\nMisaotra! 😊`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'miora-product-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.85);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeIn 0.3s ease;
  `;
  
  modal.innerHTML = `
    <div style="background:#1e293b; border-radius:16px; max-width:600px; width:100%; max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,0.5); animation: slideUp 0.3s ease;">
      <div style="position:relative;">
        <button onclick="this.closest('.miora-product-modal').remove()" 
          style="position:absolute; top:15px; right:15px; background:rgba(0,0,0,0.7); color:#fff; border:none; border-radius:50%; width:40px; height:40px; font-size:20px; cursor:pointer; z-index:10; transition:all 0.2s;"
          onmouseover="this.style.background='rgba(239,68,68,0.9)'; this.style.transform='rotate(90deg)'"
          onmouseout="this.style.background='rgba(0,0,0,0.7)'; this.style.transform='rotate(0)'"
          aria-label="Fermer">
          ✕
        </button>
        <img src="${imageUrl}" alt="${p.title}" 
          style="width:100%; height:300px; object-fit:cover; border-radius:16px 16px 0 0;"
          onerror="this.src='https://via.placeholder.com/600x300?text=Image+Indisponible'">
      </div>
      
      <div style="padding:24px; color:#fff;">
        ${badgeHTML}
        
        <h2 style="font-size:22px; font-weight:700; margin-bottom:12px; line-height:1.3;">${p.title}</h2>
        
        <div style="font-size:20px; font-weight:700; color:${priceColor}; margin-bottom:16px;">
          💰 ${price}
        </div>
        
        ${p.subtitle ? `<div style="font-size:15px; color:#94a3b8; margin-bottom:12px; font-weight:600;">${p.subtitle}</div>` : ''}
        
        ${p.description ? `<div style="color:#cbd5e1; font-size:14px; line-height:1.7; margin-bottom:16px;">${p.description}</div>` : ''}
        
        ${p.category ? `<div style="margin-bottom:12px;">
          <span style="display:inline-block; padding:6px 12px; background:rgba(96,165,250,0.2); color:#60a5fa; border-radius:6px; font-size:12px; font-weight:600;">
            🏷️ ${p.category}
          </span>
        </div>` : ''}
        
        ${p.product_type ? `<div style="margin-bottom:16px;">
          <span style="display:inline-block; padding:6px 12px; background:rgba(139,92,246,0.2); color:#a78bfa; border-radius:6px; font-size:12px; font-weight:600;">
            📦 ${p.product_type}
          </span>
        </div>` : ''}
        
        ${isNew ? `<div style="padding:12px; background:rgba(236,72,153,0.1); border-left:3px solid #ec4899; border-radius:6px; margin-bottom:16px;">
          <div style="color:#f9a8d4; font-size:13px; font-weight:600;">🆕 Produit ajouté le ${new Date(p.created_at).toLocaleDateString('fr-FR')}</div>
        </div>` : ''}
        
        <a href="${whatsappUrl}" 
          target="_blank"
          rel="noopener noreferrer"
          style="display:block; padding:14px; background:linear-gradient(135deg, #25D366, #128C7E); color:white; text-align:center; border-radius:10px; font-weight:700; font-size:15px; text-decoration:none; transition:all 0.2s; margin-top:20px;"
          onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 20px rgba(37,211,102,0.4)'"
          onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'">
          📞 Commander via WhatsApp
        </a>
      </div>
    </div>
  `;
  
  // Add CSS animations if not exists
  if (!document.getElementById('miora-modal-animations')) {
    const style = document.createElement('style');
    style.id = 'miora-modal-animations';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { transform: translateY(50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Close on overlay click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  document.body.appendChild(modal);
  console.log('[Modal] ✅ Opened');
};
  function waitReady() {
  return new Promise((resolve) => {
    let attempts = 0;
    const check = setInterval(() => {
      attempts++;
      
      if (typeof window.mioraCallAI === 'function' &&
        typeof window.mioraAddMessage === 'function' &&
        window.MioraSearch &&
        window.detectQueryType) {
        clearInterval(check);
        console.log('[Miora Handler] ✅ Dependencies ready');
        resolve(true);
      } else if (attempts >= 100) {
        clearInterval(check);
        console.error('[Miora Handler] ❌ Timeout');
        resolve(false);
      }
    }, 100);
  });
}
  
  // ✅ FUNCTION: Add to cart
  // ==========================================
// CART SYSTEM - SYNCHRONIZED
// ==========================================
window.mioraAddToCart = function(productId, productTitle, productPrice) {
  console.log('[Cart] 🛒 Adding:', productTitle, productPrice);
  
  try {
    let cart = JSON.parse(localStorage.getItem('mijoro-cart') || '[]');
    
    const existingIndex = cart.findIndex(item => item.id === productId);
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
      showNotification(`✅ "${productTitle}" x${cart[existingIndex].quantity}`, 'success', 2000);
    } else {
      cart.push({
        id: productId,
        title: productTitle,
        price: productPrice,
        quantity: 1,
        addedAt: Date.now()
      });
      showNotification(`✅ "${productTitle}" ajouté au panier!`, 'success', 2000);
    }
    
    localStorage.setItem('mijoro-cart', JSON.stringify(cart));
    
    // ✅ VAOVAO: Update cart count visually
    updateCartUI(cart);
    
    // ✅ VAOVAO: Trigger custom event for main cart system
    window.dispatchEvent(new CustomEvent('miora-cart-updated', {
      detail: { cart, productId, action: 'add' }
    }));
    
    // ✅ VAOVAO: Call global cart function if exists
    if (typeof window.addToCart === 'function') {
      window.addToCart(productId);
    }
    
    if (typeof window.updateCartCount === 'function') {
      window.updateCartCount();
    }
    
    // ✅ VAOVAO: Animate cart icon
    animateCartIcon();
    
  } catch (error) {
    console.error('[Cart] ❌ Error:', error);
    showNotification('❌ Erreur lors de l\'ajout', 'error');
  }
};

// ✅ VAOVAO: Update cart UI
function updateCartUI(cart) {
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
  // Update cart badge
  let badge = document.querySelector('.cart-badge, .miora-cart-badge');
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'miora-cart-badge';
    badge.style.cssText = `
      position: absolute;
      top: -8px;
      right: -8px;
      background: #ef4444;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    `;
    
    const cartIcon = document.querySelector('[href*="cart"], .cart-icon, #cart-btn');
    if (cartIcon) {
      cartIcon.style.position = 'relative';
      cartIcon.appendChild(badge);
    }
  }
  
  badge.textContent = totalItems > 99 ? '99+' : totalItems;
  badge.style.display = totalItems > 0 ? 'flex' : 'none';
}

// ✅ VAOVAO: Animate cart icon
function animateCartIcon() {
  const cartIcon = document.querySelector('[href*="cart"], .cart-icon, #cart-btn');
  if (cartIcon) {
    cartIcon.style.animation = 'none';
    setTimeout(() => {
      cartIcon.style.animation = 'cartBounce 0.5s ease';
    }, 10);
  }
}

// ✅ VAOVAO: Add CSS animation
if (!document.getElementById('miora-cart-styles')) {
  const style = document.createElement('style');
  style.id = 'miora-cart-styles';
  style.textContent = `
    @keyframes cartBounce {
      0%, 100% { transform: scale(1); }
      25% { transform: scale(1.15); }
      50% { transform: scale(0.95); }
      75% { transform: scale(1.05); }
    }
  `;
  document.head.appendChild(style);
}

// ✅ VAOVAO: Initialize cart on load
(function initCart() {
  try {
    const cart = JSON.parse(localStorage.getItem('mijoro-cart') || '[]');
    if (cart.length > 0) {
      updateCartUI(cart);
    }
  } catch (err) {
    console.error('[Cart] Init error:', err);
  }
})();
  
  // ✅ FUNCTION: View product details
  window.mioraViewProduct = function(productId) {
    console.log('[Product] Viewing:', productId);
    
    // Redirect to product page
    window.location.href = `/product.html?id=${productId}`;
  };
  
  // ✅ Expose notification function
  window.mioraShowNotification = function(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `miora-cart-notification miora-notification-${type}`;
    notification.textContent = message;
    
    const colors = {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    };
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      background: ${colors[type]};
      color: white;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      z-index: 10001;
      font-weight: 600;
      font-size: 15px;
      animation: slideInRight 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, duration);
  };
  
  waitReady().then(async (ready) => {
        if (!ready) {
          console.error('[Miora Handler] ❌ Cannot initialize');
          return;
        }
        
        console.log('[Miora Handler] 🔧 Patching callAI...');
        
        const originalCallAI = window.mioraCallAI;
        
        window.mioraCallAI = async function(userMessage, addToHistory = true) {
              console.log('[Handler] 📨 Processing query:', userMessage);
              
              // ✅ FIX: Get assistant safely from localStorage
              let currentAssistant = 'miora';
              try {
                currentAssistant = localStorage.getItem('miora-current-assistant') || 'miora';
              } catch (err) {
                console.warn('[Handler] ⚠️ localStorage access error:', err);
              }
              console.log('[Handler] 👤 Current assistant:', currentAssistant);
              
       // ✅ VAOVAO: Agent Miora with Mijoro Boutique detection
if (currentAssistant === 'agent') {
  console.log('[Handler] 🌍 Agent Miora - Checking query...');
  
  // ✅ FIX: Get language safely BEFORE using it
  let currentLanguage = 'mg';
  try {
    currentLanguage = localStorage.getItem('miora-language') || 'mg';
  } catch (err) {
    console.warn('[Handler] Language access error:', err);
    currentLanguage = 'mg';
  }
  
  console.log('[Handler] 🌐 Using language:', currentLanguage);
  
  // Check if asking about Mijoro Boutique or products
  const isMijoroQuery = /mijoro\s*boutique|produits?\s+mijoro|boutique\s+mijoro|zavatra\s+ao\s+@\s*mijoro|produits?\s/i.test(userMessage);
  
  if (isMijoroQuery) {
    console.log('[Handler] 🏪 Mijoro Boutique query detected - Redirecting to Miora');
    
    const redirectMessages = {
      'mg': `🏪 **Momba ny Mijoro Boutique sy ny produits-ny aho kosa...**

Tsy mahafehy tsara ny momban'ny boutique sy ny produits aho fa **Miora no spécialiste** momba izany! 😊

🔄 **Tsara raha manantona an'i Miora ianao:**
1. Tsindrio "Miora (Boutique AI)" etsy ambony
2. Manontania azy momba ny produits, prix, commande...
3. Mahay kokoa izy noho izaho momba izany!

💡 **Izaho kosa afaka manampy anao amin'ny:**
- Culture générale 📚
- Marketing & Business 💼
- Prompt Engineering 🤖
- Creative tasks ✍️
- Technical help 💻

**Mila fanampiana amin'ny zavatra hafa ve ianao?** 😊`,
      
      'fr': `🏪 **Concernant Mijoro Boutique et ses produits...**

Je ne maîtrise pas bien les détails de la boutique et des produits, mais **Miora est la spécialiste** de ça! 😊

🔄 **Je vous recommande de contacter Miora:**
1. Cliquez sur "Miora (Boutique AI)" en haut
2. Posez-lui vos questions sur les produits, prix, commandes...
3. Elle connaît bien mieux que moi!

💡 **Moi je peux vous aider avec:**
- Culture générale 📚
- Marketing & Business 💼
- Prompt Engineering 🤖
- Tâches créatives ✍️
- Aide technique 💻

**Besoin d'aide sur autre chose?** 😊`,
      
      'en': `🏪 **About Mijoro Boutique and its products...**

I don't know the boutique and products details well, but **Miora is the specialist** for that! 😊

🔄 **I recommend contacting Miora:**
1. Click "Miora (Boutique AI)" above
2. Ask her about products, prices, orders...
3. She knows much better than me!

💡 **I can help you with:**
- General knowledge 📚
- Marketing & Business 💼
- Prompt Engineering 🤖
- Creative tasks ✍️
- Technical help 💻

**Need help with something else?** 😊`
    };
    
    const msg = redirectMessages[currentLanguage] || redirectMessages['mg'];
    
    // Don't add to history, just display
    return msg;
  }
  
  console.log('[Handler] 🌍 General query - Using AI directly');
  return await originalCallAI.call(this, userMessage, addToHistory);
}              
              // ✅ FIX: Get language safely
              let currentLanguage = 'mg';
              try {
                currentLanguage = localStorage.getItem('miora-language') || 'mg';
              } catch (err) {
                console.warn('[Handler] ⚠️ localStorage access error:', err);
              }
              console.log('[Handler] 🌐 Current language:', currentLanguage);
              
              // Detect query type
              const detection = window.detectQueryType(userMessage);
// ========================================
// IMAGE GENERATION HANDLER (AGENT MIORA ONLY)
// ========================================
if (detection && detection.type === 'image' && detection.prompt) {
  console.log('[Handler] 🎨 Image generation requested:', detection.prompt);
  
  // ✅ CHECK: Only Agent Miora can generate images
  if (currentAssistant !== 'agent') {
    console.log('[Handler] ⚠️ Image generation only available with Agent Miora');
    
    const redirectMessages = {
      'mg': `🎨 **Momba ny sary...**

Ny **Agent Miora** ihany no afaka mamorona sary! 😊

🔄 **Miverina any @ Agent Miora:**
1. Tsindrio "Agent Miora (Culture Générale)" etsy ambony
2. Manontania azy indray: "${detection.prompt}"
3. Hamorona sary tsara izy!

💡 **Izaho kosa (Miora Boutique) afaka manampy anao amin'ny:**
- 🔍 Mitady produit
- 🎁 Mahita produits gratuits
- 🛒 Fividianana sy commande
- 📞 Contact & info boutique

**Mila zavatra hafa ve ianao?** 😊`,
      
      'fr': `🎨 **Concernant la génération d'images...**

Seul **Agent Miora** peut générer des images! 😊

🔄 **Retournez vers Agent Miora:**
1. Cliquez sur "Agent Miora (Culture Générale)" en haut
2. Redemandez-lui: "${detection.prompt}"
3. Il créera une belle image pour vous!

💡 **Moi (Miora Boutique) je peux vous aider avec:**
- 🔍 Recherche de produits
- 🎁 Produits gratuits
- 🛒 Commandes & achats
- 📞 Contact & info boutique

**Besoin d'autre chose?** 😊`,
      
      'en': `🎨 **About image generation...**

Only **Agent Miora** can generate images! 😊

🔄 **Switch to Agent Miora:**
1. Click "Agent Miora (General Culture)" above
2. Ask him again: "${detection.prompt}"
3. He'll create a nice image for you!

💡 **I (Miora Boutique) can help you with:**
- 🔍 Product search
- 🎁 Free products
- 🛒 Orders & purchases
- 📞 Contact & boutique info

**Need something else?** 😊`
    };
    
    const msg = redirectMessages[currentLanguage] || redirectMessages['mg'];
    
    // Display redirect message (don't add to history)
    const msgDiv = window.mioraAddMessage('', false);
    const textDiv = msgDiv.querySelector('.miora-message-text');
    
    textDiv.innerHTML = `
      <div style="color:#fff; padding:16px; background:rgba(245,158,11,0.1); border-radius:10px; border-left:4px solid #f59e0b;">
        <div style="white-space:pre-line;">${msg.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</div>
      </div>
    `;
    
    return null; // Stop processing
  }
  
  // ✅ CONTINUE: Agent Miora can generate
  console.log('[Handler] ✅ Agent Miora confirmed - proceeding with image generation');
  
  try {
    // Show loading message
    const msgDiv = window.mioraAddMessage('', false);
    const textDiv = msgDiv.querySelector('.miora-message-text');
    
    textDiv.innerHTML = `
      <div style="color:#fff; padding:16px; background:rgba(139,92,246,0.1); border-radius:10px; border-left:4px solid #8b5cf6;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="font-size:32px; animation: spin 2s linear infinite;">🎨</div>
          <div>
            <div style="font-size:15px; font-weight:700; margin-bottom:4px;">Mamorona sary...</div>
            <div style="font-size:12px; opacity:0.8;">"${detection.prompt}"</div>
          </div>
        </div>
      </div>
      <style>
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
    `;
    
    // Generate image
    const imageUrl = await window.mioraGenerateImage(
      detection.prompt,
      state.imageStyle || 'professional',
      state.imageSize || 'square'
    );
    
    // Update message with result
    const successMessages = {
      'mg': '🎨 Sary voaforona',
      'fr': '🎨 Image générée',
      'en': '🎨 Image generated'
    };
    
    textDiv.innerHTML = `
      <div style="color:#fff;">
        <div style="padding:12px; background:linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius:10px; margin-bottom:12px; text-align:center;">
          <div style="font-size:16px; font-weight:700;">${successMessages[currentLanguage] || successMessages['mg']}</div>
          <div style="font-size:13px; opacity:0.9; margin-top:4px;">📝 "${detection.prompt}"</div>
        </div>
        
        <div style="position:relative; border-radius:10px; overflow:hidden; margin-bottom:12px; box-shadow:0 4px 12px rgba(0,0,0,0.3);">
          <img src="${imageUrl}" alt="${detection.prompt}" 
            style="width:100%; height:auto; display:block; cursor:pointer; transition:transform 0.3s;"
            onclick="window.mioraViewImage('${imageUrl}')"
            onmouseover="this.style.transform='scale(1.02)'"
            onmouseout="this.style.transform='scale(1)'"
            loading="lazy">
        </div>
        
        <div style="display:flex; gap:8px;">
          <a href="${imageUrl}" download="agent-miora-${Date.now()}.png" 
            style="flex:1; padding:10px; background:rgba(16,185,129,0.2); color:#6ee7b7; border:1px solid #10b981; border-radius:8px; text-align:center; text-decoration:none; font-weight:600; font-size:13px; transition:all 0.2s;"
            onmouseover="this.style.background='rgba(16,185,129,0.3)'"
            onmouseout="this.style.background='rgba(16,185,129,0.2)'">
            💾 Download
          </a>
          <button onclick="
            const prompt = '${detection.prompt.replace(/'/g, "\\'")}';
            const lang = '${currentLanguage}';
            const msgs = {mg:'🔄 Mamorona indray...', fr:'🔄 Régénération...', en:'🔄 Regenerating...'};
            this.textContent = msgs[lang] || msgs.mg;
            this.disabled = true;
            window.mioraGenerateImage(prompt, '${state.imageStyle || 'professional'}', '${state.imageSize || 'square'}')
              .then(url => {
                this.closest('.miora-message-content').querySelector('img').src = url;
                this.closest('.miora-message-content').querySelector('a').href = url;
                this.textContent = '✅ Vita!';
                setTimeout(() => { this.textContent = '🔄 Regenerate'; this.disabled = false; }, 2000);
              })
              .catch(err => {
                this.textContent = '❌ Tsy afaka';
                setTimeout(() => { this.textContent = '🔄 Regenerate'; this.disabled = false; }, 2000);
              });
          "
            style="flex:1; padding:10px; background:rgba(139,92,246,0.2); color:#a78bfa; border:1px solid #8b5cf6; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer; transition:all 0.2s;"
            onmouseover="if(!this.disabled) this.style.background='rgba(139,92,246,0.3)'"
            onmouseout="this.style.background='rgba(139,92,246,0.2)'">
            🔄 Regenerate
          </button>
        </div>
        
        <div style="margin-top:12px; padding:10px; background:rgba(59,130,246,0.1); border-radius:8px; text-align:center; border:1px dashed rgba(59,130,246,0.3);">
          <div style="color:#60a5fa; font-size:11px;">
            💡 Powered by <strong>Pollinations AI</strong> via <strong>Agent Miora</strong> • Style: ${state.imageStyle || 'professional'} • Size: ${state.imageSize || 'square'}
          </div>
        </div>
      </div>
    `;
    
    console.log('[Handler] ✅ Image generated successfully by Agent Miora');
    return null; // Stop AI processing
    
  } catch (error) {
    console.error('[Handler] ❌ Image generation error:', error);
    
    const errorMessages = {
      'mg': '⚠️ Tsy afaka mamorona sary. Manandrama indray.',
      'fr': '⚠️ Impossible de générer l\'image. Réessayez.',
      'en': '⚠️ Failed to generate image. Try again.'
    };
    
    const msgDiv = window.mioraAddMessage('', false);
    const textDiv = msgDiv.querySelector('.miora-message-text');
    
    textDiv.innerHTML = `
      <div style="padding:16px; background:rgba(239,68,68,0.1); border-radius:10px; border-left:4px solid #ef4444; color:#fca5a5;">
        <div style="font-size:15px; font-weight:700; margin-bottom:8px;">${errorMessages[currentLanguage] || errorMessages['mg']}</div>
        <div style="font-size:12px; opacity:0.8;">Error: ${error.message}</div>
        <button onclick="document.getElementById('miora-input').value='${detection.prompt}'; document.getElementById('miora-send').click();"
          style="margin-top:12px; padding:8px 16px; background:rgba(239,68,68,0.2); color:#fca5a5; border:1px solid #ef4444; border-radius:6px; cursor:pointer; font-weight:600; font-size:12px;">
          🔄 Retry
        </button>
      </div>
    `;
    
    return null; // Stop AI processing
  }
}
      if (detection) {
        console.log('[Handler] 🎯 Detected:', detection.type, detection.query || '');
        
        let products = [];
        
      try {
  // ✅ VAOVAO: Enhanced query handling with price filters
  if (detection.type === 'search' && detection.query) {
    console.log('[Handler] 🔍 Searching for:', detection.query);
    products = await window.MioraSearch.search(detection.query);
    
  } else if (detection.type === 'free') {
    console.log('[Handler] 🎁 Getting free products');
    products = await window.MioraSearch.getFree();
    
} else if (detection.type === 'nouveaute') {
  console.log('[Handler] 🆕 Getting recent products (7 days)');
  const allProducts = await window.MioraSearch.getAll(50);
  // ✅ VAOVAO: Filter - Created within last 7 days ONLY
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  products = allProducts.filter(p => {
    return p.created_at && new Date(p.created_at) > sevenDaysAgo;
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10);
  } else if (detection.type === 'mora') {
    console.log('[Handler] 💰 Getting cheap products');
    const allProducts = await window.MioraSearch.getAll(100);
    // Filter: Price < 5000 AR
    products = allProducts.filter(p => {
      return p.price > 0 && p.price < 5000;
    }).sort((a, b) => a.price - b.price).slice(0, 10);
    
  } else if (detection.type === 'lafo') {
    console.log('[Handler] 💎 Getting expensive products');
    const allProducts = await window.MioraSearch.getAll(100);
    // Filter: Price > 20000 AR
    products = allProducts.filter(p => {
      return p.price >= 20000;
    }).sort((a, b) => b.price - a.price).slice(0, 10);
    
  } else if (detection.type === 'promo') {
    console.log('[Handler] 🎉 Getting promotions');
    const allProducts = await window.MioraSearch.getAll(100);
    // Filter: Has "promo", "promotion", or "réduction" badge/tag
    products = allProducts.filter(p => {
      const badge = (p.badge || '').toLowerCase();
      const tags = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : '';
      return badge.includes('promo') || badge.includes('réduction') ||
        tags.includes('promo') || tags.includes('réduction');
    }).slice(0, 10);
    
  } else if (detection.type === 'category' && detection.category) {
    console.log('[Handler] 📂 Getting category:', detection.category);
    products = await window.MioraSearch.getCategory(detection.category);
  }
          
          console.log('[Handler] 📊 Results:', products.length, 'products');
          
          // Display results if found
          // ========================================
          // ✅ CONTEXT-AWARE SUGGESTIONS
          // ========================================
          
          // Check if query is too broad (asking for category overview)
          // ✅ IMPROVED: Detect broad queries
const isBroadQuery = /produits?\s+(numérique|physique|digital|physical|rehetra|tous|all)|categor(?:ie|y)|types?\s+de\s+produit|inona\s+(?:avy\s+)?(?:ny\s+)?produits?|quels?\s+produits?|what\s+products?/i.test(userMessage);
          // ✅ Get current language safely
let msgLanguage = 'mg';
try {
  msgLanguage = localStorage.getItem('miora-language') || 'mg';
} catch (err) {
  msgLanguage = 'mg';
}
          if (isBroadQuery && (!products || products.length === 0)) {
            console.log('[Handler] 💡 Broad query detected - showing category suggestions');
            
            const msgDiv = window.mioraAddMessage('', false);
            const textDiv = msgDiv.querySelector('.miora-message-text');
            
            // ✅ IMPROVED: Detect type with priority
const isDigital = /numérique|numerique|digital|ebook|video|app|jeu|jeux|game/i.test(userMessage);
const isPhysical = /physique|physical|vêtement|vetement|electronique|accessoire|livre.*physique|montre/i.test(userMessage);
const isGeneral = /rehetra|tous|all|generale?|misy|disponible|avy/i.test(userMessage) || (!isDigital && !isPhysical);
            
            let html = `<div style="color:#fff; font-family: system-ui, -apple-system, sans-serif;">`;
            
          if (isDigital && !isPhysical && !isGeneral) {
              // ========================================
              // DIGITAL PRODUCTS CATEGORIES
              // ========================================
              html += `<div style="font-size:16px; font-weight:700; margin-bottom:15px; padding:12px; background:linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius:10px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                💻 Produits Numériques
              </div>`;
              
              html += `<div style="color:#94a3b8; font-size:14px; line-height:1.6; margin-bottom:16px;">
                Inona ny <strong>catégorie</strong> tadiavinao amin'ny produits numériques?
              </div>`;
              
              // Category cards
              const digitalCategories = [
                { icon: '📚', name: 'eBooks', mg: 'Boky elektronika', description: 'Livres numériques, formations PDF', query: 'ebook' },
                { icon: '🎬', name: 'Vidéos', mg: 'Horonan-tsary', description: 'Cours vidéo, tutoriels', query: 'video' },
                { icon: '📱', name: 'Applications', mg: 'Aplikasiona', description: 'Apps Android/iOS', query: 'app' },
                { icon: '🎮', name: 'Jeux', mg: 'Lalao', description: 'Jeux mobiles et PC', query: 'jeu' }
              ];
              
              html += `<div style="display:grid; gap:10px; margin-bottom:16px;">`;
              
              digitalCategories.forEach(cat => {
                html += `<div style="padding:14px; background:rgba(139,92,246,0.1); border:1px solid rgba(139,92,246,0.3); border-radius:10px; cursor:pointer; transition:all 0.3s;" 
                  onclick="document.getElementById('miora-input').value='${cat.query}'; document.getElementById('miora-send').click();"
                  onmouseover="this.style.background='rgba(139,92,246,0.2)'; this.style.transform='translateX(5px)'"
                  onmouseout="this.style.background='rgba(139,92,246,0.1)'; this.style.transform='translateX(0)'">
                  <div style="display:flex; align-items:center; gap:12px;">
                    <div style="font-size:32px;">${cat.icon}</div>
                    <div style="flex:1;">
                      <div style="font-weight:700; font-size:15px; color:#fff; margin-bottom:4px;">
                        ${cat.name} <span style="font-size:12px; color:#a78bfa; font-weight:400;">(${cat.mg})</span>
                      </div>
                      <div style="font-size:12px; color:#94a3b8;">${cat.description}</div>
                    </div>
                    <div style="color:#a78bfa; font-size:18px;">→</div>
                  </div>
                </div>`;
              });
              
              html += `</div>`;
              
              // Or search
              html += `<div style="padding:12px; background:rgba(59,130,246,0.1); border-radius:8px; text-align:center; border:1px dashed rgba(59,130,246,0.3);">
                <div style="color:#60a5fa; font-size:13px; margin-bottom:8px;">💡 <strong>Na mitady zavatra manokana?</strong></div>
                <div style="color:#94a3b8; font-size:12px;">
                  Ohatra: "mitady formation développement personnel" na "cherche ebook motivation"
                </div>
              </div>`;
              
          } else if (isPhysical && !isDigital && !isGeneral) {
              // ========================================
              // PHYSICAL PRODUCTS CATEGORIES
              // ========================================
              html += `<div style="font-size:16px; font-weight:700; margin-bottom:15px; padding:12px; background:linear-gradient(135deg, #10b981, #059669); border-radius:10px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                📦 Produits Physiques
              </div>`;
              
              html += `<div style="color:#94a3b8; font-size:14px; line-height:1.6; margin-bottom:16px;">
                Inona ny <strong>catégorie</strong> tadiavinao amin'ny produits physiques?
              </div>`;
              
              // Category cards
              const physicalCategories = [
                { icon: '👕', name: 'Vêtements', mg: 'Akanjo', description: 'T-shirts, pantalons, robes...', query: 'vêtements' },
                { icon: '⚡', name: 'Électronique', mg: 'Elektronika', description: 'Gadgets, accessoires tech', query: 'électronique' },
                { icon: '⌚', name: 'Accessoires', mg: 'Kojakoja', description: 'Montres, bijoux, sacs...', query: 'accessoires' },
                { icon: '📖', name: 'Livres', mg: 'Boky', description: 'Livres physiques imprimés', query: 'livres' },
                { icon: '🎁', name: 'Autres', mg: 'Hafa', description: 'Décorations, cadeaux...', query: 'autres' }
              ];
              
              html += `<div style="display:grid; gap:10px; margin-bottom:16px;">`;
              
              physicalCategories.forEach(cat => {
                html += `<div style="padding:14px; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:10px; cursor:pointer; transition:all 0.3s;" 
                  onclick="document.getElementById('miora-input').value='${cat.query}'; document.getElementById('miora-send').click();"
                  onmouseover="this.style.background='rgba(16,185,129,0.2)'; this.style.transform='translateX(5px)'"
                  onmouseout="this.style.background='rgba(16,185,129,0.1)'; this.style.transform='translateX(0)'">
                  <div style="display:flex; align-items:center; gap:12px;">
                    <div style="font-size:32px;">${cat.icon}</div>
                    <div style="flex:1;">
                      <div style="font-weight:700; font-size:15px; color:#fff; margin-bottom:4px;">
                        ${cat.name} <span style="font-size:12px; color:#6ee7b7; font-weight:400;">(${cat.mg})</span>
                      </div>
                      <div style="font-size:12px; color:#94a3b8;">${cat.description}</div>
                    </div>
                    <div style="color:#6ee7b7; font-size:18px;">→</div>
                  </div>
                </div>`;
              });
              
              html += `</div>`;
              
              // Or search
              html += `<div style="padding:12px; background:rgba(59,130,246,0.1); border-radius:8px; text-align:center; border:1px dashed rgba(59,130,246,0.3);">
                <div style="color:#60a5fa; font-size:13px; margin-bottom:8px;">💡 <strong>Na mitady zavatra manokana?</strong></div>
                <div style="color:#94a3b8; font-size:12px;">
                  Ohatra: "mitady t-shirt" na "cherche montre"
                </div>
              </div>`;
              
            } else {
              // ========================================
              // GENERAL OVERVIEW (both digital + physical)
              // ========================================
              html += `<div style="font-size:16px; font-weight:700; margin-bottom:15px; padding:12px; background:linear-gradient(135deg, #3b82f6, #2563eb); border-radius:10px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                🏪 Nos Catégories de Produits
              </div>`;
              
              html += `<div style="color:#94a3b8; font-size:14px; line-height:1.6; margin-bottom:16px;">
                Inona no <strong>type de produit</strong> tadiavinao?
              </div>`;
              
              // Main type selector
              html += `<div style="display:grid; gap:12px; margin-bottom:20px;">`;
              
              // Digital products button
              html += `<div style="padding:16px; background:rgba(139,92,246,0.15); border:2px solid rgba(139,92,246,0.4); border-radius:12px; cursor:pointer; transition:all 0.3s;" 
                onclick="document.getElementById('miora-input').value='produits numériques'; document.getElementById('miora-send').click();"
                onmouseover="this.style.background='rgba(139,92,246,0.25)'; this.style.borderColor='rgba(139,92,246,0.6)'; this.style.transform='scale(1.02)'"
                onmouseout="this.style.background='rgba(139,92,246,0.15)'; this.style.borderColor='rgba(139,92,246,0.4)'; this.style.transform='scale(1)'">
                <div style="display:flex; align-items:center; gap:14px;">
                  <div style="font-size:40px;">💻</div>
                  <div style="flex:1;">
                    <div style="font-weight:700; font-size:16px; color:#fff; margin-bottom:6px;">
                      Produits Numériques <span style="font-size:13px; color:#a78bfa; font-weight:400;">(Zavatra Numérika)</span>
                    </div>
                    <div style="font-size:12px; color:#94a3b8; line-height:1.5;">
                      📚 eBooks • 🎬 Vidéos • 📱 Apps • 🎮 Jeux
                    </div>
                  </div>
                  <div style="color:#a78bfa; font-size:24px; font-weight:700;">→</div>
                </div>
              </div>`;
              
              // Physical products button
              html += `<div style="padding:16px; background:rgba(16,185,129,0.15); border:2px solid rgba(16,185,129,0.4); border-radius:12px; cursor:pointer; transition:all 0.3s;" 
                onclick="document.getElementById('miora-input').value='produits physiques'; document.getElementById('miora-send').click();"
                onmouseover="this.style.background='rgba(16,185,129,0.25)'; this.style.borderColor='rgba(16,185,129,0.6)'; this.style.transform='scale(1.02)'"
                onmouseout="this.style.background='rgba(16,185,129,0.15)'; this.style.borderColor='rgba(16,185,129,0.4)'; this.style.transform='scale(1)'">
                <div style="display:flex; align-items:center; gap:14px;">
                  <div style="font-size:40px;">📦</div>
                  <div style="flex:1;">
                    <div style="font-weight:700; font-size:16px; color:#fff; margin-bottom:6px;">
                      Produits Physiques <span style="font-size:13px; color:#6ee7b7; font-weight:400;">(Zavatra Physique)</span>
                    </div>
                    <div style="font-size:12px; color:#94a3b8; line-height:1.5;">
                      👕 Vêtements • ⚡ Électronique • ⌚ Accessoires • 📖 Livres
                    </div>
                  </div>
                  <div style="color:#6ee7b7; font-size:24px; font-weight:700;">→</div>
                </div>
              </div>`;
              
              html += `</div>`;
              
              // Quick actions
              html += `<div style="padding:14px; background:rgba(245,158,11,0.1); border-radius:10px; border-left:4px solid #f59e0b;">
                <div style="color:#fbbf24; font-size:14px; font-weight:700; margin-bottom:8px;">⚡ Actions rapides</div>
                <div style="display:flex; flex-wrap:wrap; gap:8px;">
                  <button onclick="document.getElementById('miora-input').value='maimaim-poana'; document.getElementById('miora-send').click();" 
                    style="padding:8px 14px; background:rgba(16,185,129,0.2); color:#6ee7b7; border:1px solid rgba(16,185,129,0.4); border-radius:8px; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.2s;"
                    onmouseover="this.style.background='rgba(16,185,129,0.3)'"
                    onmouseout="this.style.background='rgba(16,185,129,0.2)'">
                    🎁 Produits Gratuits
                  </button>
                  <button onclick="document.getElementById('miora-input').value='nouveautés'; document.getElementById('miora-send').click();" 
                    style="padding:8px 14px; background:rgba(59,130,246,0.2); color:#60a5fa; border:1px solid rgba(59,130,246,0.4); border-radius:8px; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.2s;"
                    onmouseover="this.style.background='rgba(59,130,246,0.3)'"
                    onmouseout="this.style.background='rgba(59,130,246,0.2)'">
                    ✨ Nouveautés
                  </button>
                </div>
              </div>`;
            }
            
            html += `</div>`;
            
            textDiv.innerHTML = html;
            
            console.log('[Handler] ✅ Category suggestions displayed');
            return null; // Stop processing
          }
          if (products && products.length > 0) {
            console.log('[Handler] ✅ Displaying products with images + cart buttons');
            
            const msgDiv = window.mioraAddMessage('', false);
            const textDiv = msgDiv.querySelector('.miora-message-text');
            
            // Build better HTML display WITH IMAGES
            let html = `<div style="color:#fff; font-family: system-ui, -apple-system, sans-serif;">`;
            
           // ✅ SMART HEADERS with query display
const headers = {
  search: `🔍 Résultats pour "<strong>${detection.query}</strong>"`,
  free: detection.query ? 
    `🎁 Produits Gratuits <span style="color:#fbbf24; font-size:14px; font-weight:400;">(${detection.query})</span>` : 
    `🎁 Produits Gratuits`,
  nouveaute: `🆕 Produits Nouveaux <span style="opacity:0.9; font-size:14px;">(60 derniers jours)</span>`,
  mora: `💰 Produits Bon Marché <span style="opacity:0.9; font-size:14px;">(&lt; 5000 AR)</span>`,
  lafo: `💎 Produits Premium <span style="opacity:0.9; font-size:14px;">(&gt; 20000 AR)</span>`,
  promo: `🎉 Promotions & Réductions`,
  category: detection.query ?
    `📦 ${detection.query.charAt(0).toUpperCase() + detection.query.slice(1)}` :
    `📦 Catégorie: <strong>${detection.category}</strong>`
};
            
            const colors = {
              search: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              free: 'linear-gradient(135deg, #10b981, #059669)',
              category: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
            };
            
            html += `<div style="font-size:16px; font-weight:700; margin-bottom:15px; padding:12px; background:${colors[detection.type]}; border-radius:10px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
              ${headers[detection.type]} <span style="opacity:0.9; font-size:14px;">(${products.length})</span>
            </div>`;
            
            // Products grid WITH IMAGES
            products.forEach((p, i) => {
              const price = p.price > 0 ? `${Number(p.price).toLocaleString()} AR` : '✨ MAIMAIM-POANA';
              const priceColor = p.price > 0 ? '#10b981' : '#f59e0b';
              
      // ✅ FIX: Use correct column name + construct URL
let imageUrl = 'https://via.placeholder.com/300x200?text=No+Image';

if (p.thumbnail_url) {
  if (p.thumbnail_url.startsWith('http')) {
    imageUrl = p.thumbnail_url;
  } else {
    const cleanPath = p.thumbnail_url.startsWith('images/') || p.thumbnail_url.startsWith('gallery/') ?
      p.thumbnail_url :
      `images/${p.thumbnail_url}`;
    
    imageUrl = `https://zogohkfzplcuonkkfoov.supabase.co/storage/v1/object/public/products/${cleanPath}`;
  }
} else if (p.preview_url) {
  imageUrl = p.preview_url.startsWith('http') ?
    p.preview_url :
    `https://zogohkfzplcuonkkfoov.supabase.co/storage/v1/object/public/products/images/${p.preview_url}`;
}

console.log('[Display] 🖼️', p.title, '→', imageUrl);

// ✅ Gallery handling
let galleryImages = [];

if (p.gallery) {
  if (typeof p.gallery === 'string') {
    galleryImages = p.gallery.split(',').map(img => img.trim()).filter(Boolean);
  } else if (Array.isArray(p.gallery)) {
    galleryImages = p.gallery.filter(Boolean);
  }
}

if (imageUrl && !imageUrl.includes('placeholder')) {
  galleryImages.unshift(imageUrl);
}

console.log('[Display] 🖼️ Gallery:', galleryImages.length, 'images');

// ✅ VAOVAO: Enhanced badge & price detection
const isFree = p.is_free === true || p.price === 0;
const isNew = p.created_at && new Date(p.created_at) > new Date(Date.now() - 60 * 24 * 60 * 60 * 1000); // ⬅️ 30 → 60 jours
const isPromo = p.badge && /promo|promotion|réduction/i.test(p.badge);
const isCheap = p.price > 0 && p.price < 5000;
const isExpensive = p.price >= 20000;

let mainBadgeHTML = '';
let newBadgeHTML = '';

// Detect main badge
if (isFree) {
  mainBadgeHTML = `<div style="background:#f59e0b; color:#fff; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; box-shadow:0 2px 6px rgba(0,0,0,0.3);">✨ GRATUIT</div>`;
} else if (p.badge) {
  const badgeColors = {
    'vip': '#8b5cf6',
    'promotion': '#ec4899',
    'populaire': '#3b82f6',
    'nouveau': '#10b981'
  };
  const badgeLower = p.badge.toLowerCase();
  const badgeColor = badgeColors[badgeLower] || '#3b82f6';
  mainBadgeHTML = `<div style="background:${badgeColor}; color:#fff; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; box-shadow:0 2px 6px rgba(0,0,0,0.3);">⭐ ${p.badge.toUpperCase()}</div>`;
} else if (p.price > 0) {
  mainBadgeHTML = `<div style="background:#10b981; color:#fff; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; box-shadow:0 2px 6px rgba(0,0,0,0.3);">💵 PAYANT</div>`;
}

// Detect if new
if (isNew) {
  newBadgeHTML = `<div style="background:#ec4899; color:#fff; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; margin-top:4px; box-shadow:0 2px 6px rgba(0,0,0,0.3);">🆕 NOUVEAU</div>`;
}

html += `<div style="margin-bottom:16px; padding:0; background:rgba(30,41,59,0.4); border-radius:12px; overflow:hidden; border:1px solid rgba(148,163,184,0.2); transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">`;

// ========================================
// IMAGE GALLERY SLIDER
// ========================================
if (galleryImages.length > 0) {
  html += `<div style="position:relative; width:100%; height:200px; background:#1e293b; overflow:hidden;">`;
  
  html += `<div id="gallery-${p.id}" style="display:flex; height:100%; overflow-x:auto; scroll-behavior:smooth; scrollbar-width:none; -ms-overflow-style:none;">`;
  
  galleryImages.forEach((img, idx) => {
    let fullImgUrl = img;
    if (!img.startsWith('http')) {
      const imgPath = img.startsWith('gallery/') || img.startsWith('images/') ?
        img :
        `gallery/${img}`;
      fullImgUrl = `https://zogohkfzplcuonkkfoov.supabase.co/storage/v1/object/public/products/${imgPath}`;
    }
    
// ✅ VAOVAO (lazy loading + observer):
html += `<img 
  data-src="${fullImgUrl}" 
  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect fill='%231e293b' width='300' height='200'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%2364748b' font-size='14'%3EChargement...%3C/text%3E%3C/svg%3E"
  alt="Image ${idx + 1} de ${p.title} - Photo de produit"
  class="miora-lazy-image"
  role="img"
  aria-label="Photo ${idx + 1} sur ${galleryImages.length} de ${p.title}"
  tabindex="0"
  style="min-width:100%; height:100%; object-fit:cover; cursor:pointer; transition: opacity 0.3s;"
  onerror="this.src='https://via.placeholder.com/300x200?text=Image+${idx+1}'; this.alt='Image indisponible'"
  loading="lazy"
  onclick="window.mioraViewImage('${fullImgUrl}')"
  onkeypress="if(event.key==='Enter'){window.mioraViewImage('${fullImgUrl}');event.preventDefault();}">`;
  });
  
  html += `</div>`;
  
  if (galleryImages.length > 1) {
    html += `<div style="position:absolute; bottom:10px; left:50%; transform:translateX(-50%); display:flex; gap:6px; padding:6px 10px; background:rgba(0,0,0,0.5); border-radius:20px; z-index:10;">`;
    galleryImages.forEach((_, idx) => {
      html += `<div style="width:8px; height:8px; border-radius:50%; background:${idx === 0 ? '#fff' : 'rgba(255,255,255,0.4)'}; cursor:pointer; transition:all 0.3s;" onclick="document.getElementById('gallery-${p.id}').scrollLeft=${idx}*document.getElementById('gallery-${p.id}').offsetWidth" onmouseover="this.style.transform='scale(1.3)'" onmouseout="this.style.transform='scale(1)'"></div>`;
    });
    html += `</div>`;
  }
  
  html += `<div style="position:absolute; top:10px; right:10px; display:flex; flex-direction:column; gap:6px; align-items:flex-end;">`;
  
  html += `${mainBadgeHTML}`;
  html += `${newBadgeHTML}`;


  if (galleryImages.length > 1) {
    html += `<div style="background:rgba(0,0,0,0.7); color:#fff; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:600;">📸 ${galleryImages.length}</div>`;
  }
  
  html += `</div>`;
  html += `</div>`;
  
} else {
  html += `<div style="position:relative; width:100%; height:180px; background:#1e293b; display:flex; align-items:center; justify-content:center;">
                  <div style="color:#64748b; font-size:14px;">📷 Pas d'image</div>
                </div>`;
}
              
              // Product info
              html += `<div style="padding:14px;">`;
              
              // Title
              html += `<div style="font-weight:700; font-size:15px; margin-bottom:8px; color:#fff; line-height:1.4;">${p.title}</div>`;
              
              // Price
              html += `<div style="color:${priceColor}; font-weight:700; margin-bottom:10px; font-size:16px;">💰 ${price}</div>`;
              
              // Description (short)
              if (p.description || p.description_short) {
                const desc = (p.description || p.description_short).substring(0, 100);
                html += `<div style="color:#94a3b8; font-size:13px; line-height:1.5; margin-bottom:12px;">${desc}${desc.length >= 100 ? '...' : ''}</div>`;
              }
              
              // Category badge
              if (p.category) {
                html += `<div style="display:inline-block; padding:4px 10px; background:rgba(96,165,250,0.2); border-radius:6px; color:#60a5fa; font-size:11px; font-weight:600; margin-bottom:12px;">🏷️ ${p.category}</div>`;
              }
              
              // ========================================
// ACTION BUTTONS (ACCESSIBLE)
// ========================================
html += `<div style="display:flex; gap:8px; margin-top:12px;" role="group" aria-label="Actions pour ${p.title}">`;

// ✅ VAOVAO: WhatsApp Order Button
if (p.price >= 0) {
  const whatsappNumber = "261333106055"; // ⬅️ 0333106055
  const productName = encodeURIComponent(p.title);
  const productPrice = p.price > 0 ? `${Number(p.price).toLocaleString()} AR` : 'MAIMAIM-POANA';
  const whatsappMessage = encodeURIComponent(
    `Salama! 👋\n\nTe-hanafatra aho:\n\n📦 *${p.title}*\n💰 Prix: ${productPrice}\n🆔 ID: ${p.id}\n\nMisaotra! 😊`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  
  html += `<a 
    href="${whatsappUrl}" 
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Commander ${p.title} via WhatsApp"
    role="button"
    tabindex="0"
    style="flex:1; padding:10px 16px; background:linear-gradient(135deg, #25D366, #128C7E); color:white; border:none; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer; transition:all 0.2s; text-decoration:none; text-align:center; display:block;"
    onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 4px 12px rgba(37,211,102,0.4)'"
    onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'"
    onfocus="this.style.outline='2px solid #25D366'; this.style.outlineOffset='2px'"
    onblur="this.style.outline='none'">
    📞 Commander via WhatsApp
  </a>`;
}



// ✅ VAOVAO: Button "Voir détails" removed - WhatsApp only

html += `</div>`; // Close buttons (WhatsApp fotsiny)
              html += `</div>`; // Close product info
              html += `</div>`; // Close product card
            });
            
            // Footer
            html += `<div style="margin-top:20px; padding:14px; background:rgba(148,163,184,0.1); border-radius:10px; text-align:center; border:1px dashed rgba(148,163,184,0.3);">
              <div style="color:#94a3b8; font-size:13px; margin-bottom:8px;">💡 <strong>Mila fanampiana bebe kokoa?</strong></div>
              <div style="color:#64748b; font-size:12px; line-height:1.6;">
                Manontanya ahy momba ny produit, vidiny, na fomba fividianana!<br>
                Tsindrio "Ajouter au panier" mba handefasana commande via WhatsApp.
              </div>
            </div>`;
            
            html += `</div>`;
            
            textDiv.innerHTML = html;
            
            console.log('[Handler] ✅ Display complete with images + cart buttons');
            
            // ✅ IMPORTANT: Return null to prevent AI call
            return null;
            
          } else {
  // ========================================
  // NO PRODUCTS FOUND - SMART SUGGESTIONS
  // ========================================
  console.log('[Handler] ⚠️ No products found - generating suggestions');
  
  const msgDiv = window.mioraAddMessage('', false);
  const textDiv = msgDiv.querySelector('.miora-message-text');
  
  // ✅ SMART: Analyze failed query for suggestions
  const suggestions = await generateSmartSuggestions(detection.query || userMessage);
  
  let html = `<div style="color:#fff; font-family: system-ui, -apple-system, sans-serif;">`;
  
  // Header
  html += `<div style="padding:16px; background:rgba(245,158,11,0.15); border-radius:12px; border-left:4px solid #f59e0b; margin-bottom:16px;">
    <div style="font-size:16px; font-weight:700; color:#fbbf24; margin-bottom:8px;">
      🔍 Tsy nahita produit${detection.query ? ` momba "<strong>${detection.query}</strong>"` : ''}
    </div>
    <div style="color:#94a3b8; font-size:13px; line-height:1.6;">
      Fa misy suggestions ho anao...
    </div>
  </div>`;
  // ✅ NO MORE state.currentLanguage references below!
// All messages are hardcoded or use currentLanguage variable

  // ========================================
  // SECTION 1: Similar Products
  // ========================================
  if (suggestions.similar && suggestions.similar.length > 0) {
    html += `<div style="margin-bottom:20px;">
      <div style="font-size:15px; font-weight:700; color:#10b981; margin-bottom:12px;">
        💡 Zavatra mety tianao:
      </div>
      <div style="display:grid; gap:10px;">`;
    
    suggestions.similar.forEach(prod => {
      const price = prod.price > 0 ? `${Number(prod.price).toLocaleString()} AR` : '✨ MAIMAIM-POANA';
      html += `<div style="padding:12px; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:10px; cursor:pointer; transition:all 0.3s;"
        onclick="document.getElementById('miora-input').value='${prod.title}'; document.getElementById('miora-send').click();"
        onmouseover="this.style.background='rgba(16,185,129,0.2)'; this.style.transform='translateX(5px)'"
        onmouseout="this.style.background='rgba(16,185,129,0.1)'; this.style.transform='translateX(0)'">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="flex:1;">
            <div style="font-weight:700; font-size:14px; color:#fff; margin-bottom:4px;">${prod.title}</div>
            <div style="color:#6ee7b7; font-size:13px; font-weight:600;">${price}</div>
          </div>
          <div style="color:#6ee7b7; font-size:18px;">→</div>
        </div>
      </div>`;
    });
    
    html += `</div></div>`;
  }
  
  // ========================================
  // SECTION 2: Trending Products
  // ========================================
  if (suggestions.trending && suggestions.trending.length > 0) {
    html += `<div style="margin-bottom:20px;">
      <div style="font-size:15px; font-weight:700; color:#f59e0b; margin-bottom:12px;">
        🔥 Malaza ankehitriny:
      </div>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">`;
    
    suggestions.trending.forEach(prod => {
      html += `<button 
        onclick="document.getElementById('miora-input').value='${prod.title}'; document.getElementById('miora-send').click();"
        style="padding:8px 14px; background:rgba(245,158,11,0.2); color:#fbbf24; border:1px solid rgba(245,158,11,0.4); border-radius:8px; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.2s;"
        onmouseover="this.style.background='rgba(245,158,11,0.3)'"
        onmouseout="this.style.background='rgba(245,158,11,0.2)'">
        ${prod.title}
      </button>`;
    });
    
    html += `</div></div>`;
  }
  
  // ========================================
  // SECTION 3: Category Suggestions
  // ========================================
  if (suggestions.categories && suggestions.categories.length > 0) {
    html += `<div style="margin-bottom:16px;">
      <div style="font-size:15px; font-weight:700; color:#3b82f6; margin-bottom:12px;">
        📂 Hijery ireo catégories ireto?
      </div>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">`;
    
    suggestions.categories.forEach(cat => {
      html += `<button 
        onclick="document.getElementById('miora-input').value='${cat.query}'; document.getElementById('miora-send').click();"
        style="padding:8px 14px; background:rgba(59,130,246,0.2); color:#60a5fa; border:1px solid rgba(59,130,246,0.4); border-radius:8px; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.2s;"
        onmouseover="this.style.background='rgba(59,130,246,0.3)'"
        onmouseout="this.style.background='rgba(59,130,246,0.2)'">
        ${cat.icon} ${cat.name}
      </button>`;
    });
    
    html += `</div></div>`;
  }
  
  // ========================================
  // SECTION 4: Help
  // ========================================
  html += `<div style="margin-top:16px; padding:12px; background:rgba(59,130,246,0.1); border-radius:10px; text-align:center; border:1px dashed rgba(59,130,246,0.3);">
    <div style="color:#60a5fa; font-size:13px; margin-bottom:6px;">
      💬 <strong>Mila fanampiana?</strong>
    </div>
    <div style="color:#94a3b8; font-size:12px; line-height:1.6;">
      Afaka miresaka amin'i Miora ianao momba ny zavatra tadiavinao!<br>
      Exemple: "Mila ebook momba ny motivation" na "Cherche formation business"
    </div>
  </div>`;
  
  html += `</div>`;
  
  textDiv.innerHTML = html;
  
  console.log('[Handler] ✅ Smart suggestions displayed');
  
  // ✅ IMPORTANT: Return null to prevent AI call
  return null;
}
          
        } catch (error) {
          console.error('[Handler] ❌ Error:', error);
          
          const msgDiv = window.mioraAddMessage('', false);
          const textDiv = msgDiv.querySelector('.miora-message-text');
          
          textDiv.innerHTML = `<div style="padding:15px; background:rgba(239,68,68,0.1); border-radius:10px; border-left:4px solid #ef4444; color:#fca5a5;">
            ⚠️ Nisy olana: ${error.message}
          </div>`;
          
          // ✅ IMPORTANT: Return null to prevent AI call even on error
          return null;
        }
      }
      
      // ✅ Fallback to AI for non-product queries
      console.log('[Handler] 🤖 Using AI (no product query detected)');
      return await originalCallAI.call(this, userMessage, addToHistory);
    };
    
    console.log('[Miora Handler] ✅ Patched successfully');
    console.log('[Miora Handler] 🎯 Product queries → Client-side with images + cart');
    console.log('[Miora Handler] 🤖 Other queries → AI Edge Function');
  });
  
})();
// ========================================
// LAZY LOADING OBSERVER
// ========================================
(function initLazyLoading() {
  console.log('[Lazy Load] 🖼️ Initializing...');
  
  let imageObserver = null;
  let messagesObserver = null;
  
  // ✅ VAOVAO: Create observer only once
function createImageObserver() {
  if (imageObserver) return imageObserver;
  
  imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        
        if (src) {
          console.log('[Lazy Load] 📥 Loading:', src.substring(0, 50) + '...');
          
          img.style.opacity = '0';
          img.style.transition = 'opacity 0.3s ease';
          
          // ✅ VAOVAO: Timeout protection (10 seconds max)
          const loadTimeout = setTimeout(() => {
            console.warn('[Lazy Load] ⏱️ Timeout for:', src.substring(0, 50));
            img.src = 'https://via.placeholder.com/300x200?text=Timeout';
            img.style.opacity = '0.6';
            img.removeAttribute('data-src');
          }, 10000);
          
          // ✅ Preload image
          const tempImg = new Image();
          
          tempImg.onload = () => {
            clearTimeout(loadTimeout); // ⬅️ Cancel timeout
            img.src = src;
            img.style.opacity = '1';
            img.removeAttribute('data-src');
            console.log('[Lazy Load] ✅ Loaded successfully');
          };
          
          tempImg.onerror = () => {
            clearTimeout(loadTimeout); // ⬅️ Cancel timeout
            console.error('[Lazy Load] ❌ Failed:', src);
            img.src = 'https://via.placeholder.com/300x200?text=Image+Error';
            img.style.opacity = '0.5';
            img.removeAttribute('data-src');
          };
          
          // ✅ VAOVAO: Try loading with retry logic
          let retryCount = 0;
          const maxRetries = 2;
          
          const tryLoad = () => {
            tempImg.src = src + (retryCount > 0 ? `?retry=${retryCount}` : '');
          };
          
          tempImg.onerror = () => {
            clearTimeout(loadTimeout);
            
            if (retryCount < maxRetries) {
              retryCount++;
              console.log(`[Lazy Load] 🔄 Retry ${retryCount}/${maxRetries}:`, src.substring(0, 50));
              setTimeout(tryLoad, 1000 * retryCount); // Wait 1s, 2s...
            } else {
              console.error('[Lazy Load] ❌ Failed after retries:', src);
              img.src = 'https://via.placeholder.com/300x200?text=Image+Error';
              img.style.opacity = '0.5';
              img.removeAttribute('data-src');
            }
          };
          
          tryLoad(); // Start loading
          
          imageObserver.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px', // ⬅️ Reduced from 100px (more aggressive)
    threshold: 0.1 // ⬅️ Increased from 0.01 (better detection)
  });
  
  return imageObserver;
}
  function observeImages() {
    const observer = createImageObserver();
    const images = document.querySelectorAll('.miora-lazy-image[data-src]');
    console.log('[Lazy Load] 👁️ Observing:', images.length, 'images');
    images.forEach(img => observer.observe(img));
  }
  
  observeImages();
  
  // ✅ VAOVAO: Debounced observe
  let observeTimeout;
  function debouncedObserve() {
    clearTimeout(observeTimeout);
    observeTimeout = setTimeout(observeImages, 150);
  }
  
  const messagesDiv = document.getElementById('miora-messages');
  if (messagesDiv) {
    if (messagesObserver) messagesObserver.disconnect();
    
    messagesObserver = new MutationObserver(debouncedObserve);
    messagesObserver.observe(messagesDiv, {
      childList: true,
      subtree: true
    });
  }
  
  // ✅ VAOVAO: Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (imageObserver) {
      imageObserver.disconnect();
      imageObserver = null;
    }
    if (messagesObserver) {
      messagesObserver.disconnect();
      messagesObserver = null;
    }
    console.log('[Lazy Load] 🧹 Cleanup done');
  });
  
  console.log('[Lazy Load] ✅ Ready');
})();
// ==========================================
// END OF MIORA AI ASSISTANT
// ==========================================

console.log('✅ [Miora] All modules loaded successfully!');
console.log('📦 [Miora] Available modules:');
console.log('   - Global Utils');
console.log('   - Supabase Client');
console.log('   - Product Search');
console.log('   - Main Assistant');
console.log('   - Smart Handler (FIXED + IMAGES + CART)');
console.log('🎉 [Miora] System ready!');// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================
window.addEventListener('error', function(event) {
  console.error('🚨 [Global Error]:', event.error);
  
  // Check if it's related to Miora
  if (event.error && event.error.stack && event.error.stack.includes('miora')) {
    console.error('🚨 [Miora Error Stack]:', event.error.stack);
    
    // Show user-friendly notification
    if (typeof showNotification === 'function') {
      showNotification('⚠️ Une erreur s\'est produite. Rechargez la page.', 'error', 5000);
    }
  }
});

window.addEventListener('unhandledrejection', function(event) {
  console.error('🚨 [Unhandled Promise]:', event.reason);
  
  if (event.reason && event.reason.message && event.reason.message.includes('state')) {
    console.error('🚨 [State Error]:', event.reason);
    
    // Try to recover
    try {
      const lang = localStorage.getItem('miora-language') || 'mg';
      console.log('🔄 [Recovery] Using language:', lang);
    } catch (err) {
      console.error('❌ [Recovery Failed]:', err);
    }
  }
});

console.log('✅ [Miora] Error handlers installed');