export const siteData = {
  faq: [
    { keywords: ["refund", "cancel"], answer: "Refunds are available up to 24 hours before departure." },
    { keywords: ["language", "guide"], answer: "English and Chinese support are available." },
    { keywords: ["payment", "stripe"], answer: "Secure card payments are processed through Stripe at checkout." }
  ],
  dictionary: {
    en: {
      book_now: "Book now",
      view_ticket: "View ticket",
      featured_tickets: "Featured tickets",
      bundle_deals: "Bundle deals",
      cart: "Cart",
      checkout: "Checkout",
      support_title: "Travel assistant",
      support_fallback: "Please email support@wingdy.example for custom requests.",
      consent_title: "We use cookies to optimize booking and analytics.",
      consent_accept: "Accept cookies",
      consent_decline: "Later",
      tickets: "Tickets",
      packages: "Packages",
      collections: "Collections",
      policy: "Policy",
      hero_kicker: "Wingdy Escapes",
      hero_title: "Book extraordinary ticketed experiences with a calm, fast checkout.",
      hero_body: "Inspired by premium Nordic travel storefronts, built as a shareable static showcase for public review.",
      hero_secondary: "View policies",
      search_label: "Search experiences",
      featured_label: "Tickets",
      package_label: "Packages",
      collection_title: "All showcase products",
      collection_body: "This page is fully static but structured like a real product collection for public review.",
      policy_title: "Privacy, refunds, terms, and checkout preview",
      policy_body: "This page gives reviewers a realistic sense of the compliance section and booking CTA flow.",
      checkout_preview_title: "Static payment preview",
      checkout_preview_back: "Back to homepage",
      checkout_preview_continue: "Continue to payment"
    },
    zh: {
      book_now: "立即预订",
      view_ticket: "查看门票",
      featured_tickets: "热门门票",
      bundle_deals: "优惠套餐",
      cart: "购物车",
      checkout: "去结算",
      support_title: "旅行助手",
      support_fallback: "如需人工帮助，请发送邮件至 support@wingdy.example。",
      consent_title: "我们使用 Cookie 来优化预订体验和分析。",
      consent_accept: "接受 Cookie",
      consent_decline: "稍后再说",
      tickets: "门票",
      packages: "套餐",
      collections: "产品集合",
      policy: "政策",
      hero_kicker: "Wingdy 旅行精选",
      hero_title: "用更克制、更高级的方式预订目的地体验门票。",
      hero_body: "这个静态站用于公开展示视觉效果、产品组织方式和结算流程感受。",
      hero_secondary: "查看政策页",
      search_label: "搜索体验项目",
      featured_label: "门票",
      package_label: "套餐",
      collection_title: "全部展示产品",
      collection_body: "这是一个纯静态展示页，但结构已经接近真实可售卖的产品集合页。",
      policy_title: "隐私、退款、条款与结算预览",
      policy_body: "这个页面让外部查看者更容易理解合规说明和预订转化路径。",
      checkout_preview_title: "静态支付预览",
      checkout_preview_back: "返回首页",
      checkout_preview_continue: "继续支付"
    }
  },
  tickets: [
    {
      id: "blue-lagoon-comfort",
      type: "ticket",
      title: "Blue Lagoon Comfort",
      excerpt: "Entrance, silica mask, and towel included.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      tags: ["Hot", "Wellness"],
      price: 129,
      currency: "USD",
      region: "Reykjanes"
    },
    {
      id: "golden-circle-classic",
      type: "ticket",
      title: "Golden Circle Classic",
      excerpt: "Full-day highlights with comfort coach pickup.",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
      tags: ["Day tour", "Family"],
      price: 159,
      currency: "USD",
      region: "Southwest"
    },
    {
      id: "south-coast-waterfalls",
      type: "ticket",
      title: "South Coast Waterfalls",
      excerpt: "Black sand beaches and waterfall stops in one route.",
      image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
      tags: ["Scenic", "Coach"],
      price: 149,
      currency: "USD",
      region: "South Coast"
    }
  ],
  packages: [
    {
      id: "lagoon-lava-tunnel",
      type: "package",
      title: "Lagoon + Lava Tunnel",
      excerpt: "A high-conversion half-day bundle for short stays.",
      image: "https://images.unsplash.com/photo-1517821365201-7734f463f8b2?auto=format&fit=crop&w=1200&q=80",
      tags: ["Bundle", "Popular"],
      price: 219,
      currency: "USD",
      region: "Reykjanes"
    },
    {
      id: "golden-circle-premium-duo",
      type: "package",
      title: "Golden Circle Premium Duo",
      excerpt: "Guided route plus geothermal spa admission.",
      image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80",
      tags: ["Best seller", "Premium"],
      price: 249,
      currency: "USD",
      region: "Golden Circle"
    },
    {
      id: "northern-lights-escape",
      type: "package",
      title: "Northern Lights Escape",
      excerpt: "Evening departure with warm cocoa and photo stops.",
      image: "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1200&q=80",
      tags: ["Seasonal", "Evening"],
      price: 189,
      currency: "USD",
      region: "Greater Reykjavik"
    }
  ],
  policies: [
    {
      title: "Privacy Policy",
      content: "We only collect booking, contact, and payment-adjacent metadata required to complete your reservation and support you after purchase."
    },
    {
      title: "Refund Policy",
      content: "Most products can be refunded up to 24 hours before the experience starts unless the supplier listing states otherwise."
    },
    {
      title: "Terms & Conditions",
      content: "Bookings are fulfilled by local operators and are subject to inventory, weather, and safety constraints."
    }
  ]
};
