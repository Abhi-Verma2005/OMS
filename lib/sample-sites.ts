export type Site = {
  id: string
  url: string
  name: string
  niche: string
  category: string
  language: string
  country: string
  da: number
  pa: number
  dr: number
  spamScore: number
  toolScores: {
    semrushAuthority: number
    semrushOverallTraffic: number
    semrushOrganicTraffic: number
    trafficTrend: "increasing" | "decreasing" | "stable"
    targetCountryTraffic: { country: string; percent: number }[]
    topCountries: { country: string; percent: number }[]
  }
  publishing: {
    price: number
    priceWithContent: number
    wordLimit: number
    tatDays: number
    backlinkNature: "do-follow" | "no-follow" | "sponsored"
    backlinksAllowed: number
    linkPlacement: "in-content" | "author-bio" | "footer"
    permanence: "lifetime" | "12-months"
  }
  quality: {
    sampleUrl?: string
    remark?: string
    lastPublished: string
    outboundLinkLimit: number
    guidelinesUrl?: string
  }
  additional: {
    disclaimer?: string
    availability: boolean
  }
}

const baseSites: Site[] = [
  {
    id: "1",
    url: "https://techdaily.example",
    name: "Tech Daily",
    niche: "Technology",
    category: "Guest Post",
    language: "English",
    country: "US",
    da: 55,
    pa: 48,
    dr: 62,
    spamScore: 3,
    toolScores: {
      semrushAuthority: 38,
      semrushOverallTraffic: 210000,
      semrushOrganicTraffic: 160000,
      trafficTrend: "increasing",
      targetCountryTraffic: [{ country: "US", percent: 62 }],
      topCountries: [
        { country: "US", percent: 62 },
        { country: "CA", percent: 8 },
        { country: "UK", percent: 7 },
        { country: "IN", percent: 6 },
        { country: "AU", percent: 5 },
      ],
    },
    publishing: {
      price: 180,
      priceWithContent: 260,
      wordLimit: 1200,
      tatDays: 5,
      backlinkNature: "do-follow",
      backlinksAllowed: 2,
      linkPlacement: "in-content",
      permanence: "lifetime",
    },
    quality: {
      sampleUrl: "https://techdaily.example/sample-guest-post",
      remark: "No adult, no casino",
      lastPublished: "2025-08-20",
      outboundLinkLimit: 2,
      guidelinesUrl: "https://techdaily.example/guidelines",
    },
    additional: {
      disclaimer: "Prices may change without notice",
      availability: true,
    },
  },
  {
    id: "2",
    url: "https://wanderlog.example",
    name: "Wander Log",
    niche: "Travel",
    category: "Sponsorship",
    language: "English",
    country: "UK",
    da: 42,
    pa: 44,
    dr: 50,
    spamScore: 2,
    toolScores: {
      semrushAuthority: 32,
      semrushOverallTraffic: 90000,
      semrushOrganicTraffic: 60000,
      trafficTrend: "stable",
      targetCountryTraffic: [{ country: "UK", percent: 40 }],
      topCountries: [
        { country: "UK", percent: 40 },
        { country: "US", percent: 25 },
        { country: "DE", percent: 10 },
        { country: "FR", percent: 9 },
        { country: "ES", percent: 6 },
      ],
    },
    publishing: {
      price: 150,
      priceWithContent: 220,
      wordLimit: 1000,
      tatDays: 7,
      backlinkNature: "sponsored",
      backlinksAllowed: 1,
      linkPlacement: "in-content",
      permanence: "12-months",
    },
    quality: {
      sampleUrl: "https://wanderlog.example/sample",
      remark: "Accepts casino niche",
      lastPublished: "2025-08-10",
      outboundLinkLimit: 3,
      guidelinesUrl: "",
    },
    additional: {
      disclaimer: "",
      availability: false,
    },
  },
  {
    id: "3",
    url: "https://healthyhub.example",
    name: "Healthy Hub",
    niche: "Health",
    category: "Guest Post",
    language: "English",
    country: "IN",
    da: 35,
    pa: 33,
    dr: 40,
    spamScore: 6,
    toolScores: {
      semrushAuthority: 24,
      semrushOverallTraffic: 50000,
      semrushOrganicTraffic: 40000,
      trafficTrend: "decreasing",
      targetCountryTraffic: [{ country: "IN", percent: 55 }],
      topCountries: [
        { country: "IN", percent: 55 },
        { country: "US", percent: 15 },
        { country: "UK", percent: 8 },
        { country: "AU", percent: 5 },
        { country: "CA", percent: 5 },
      ],
    },
    publishing: {
      price: 80,
      priceWithContent: 140,
      wordLimit: 900,
      tatDays: 3,
      backlinkNature: "do-follow",
      backlinksAllowed: 2,
      linkPlacement: "author-bio",
      permanence: "lifetime",
    },
    quality: {
      sampleUrl: "",
      remark: "No CBD",
      lastPublished: "2025-07-15",
      outboundLinkLimit: 4,
      guidelinesUrl: "",
    },
    additional: {
      disclaimer: "Prices may change",
      availability: true,
    },
  },
  {
    id: "4",
    url: "https://bizinsider.example",
    name: "Biz Insider Pro",
    niche: "Business",
    category: "Guest Post",
    language: "English",
    country: "US",
    da: 60,
    pa: 55,
    dr: 68,
    spamScore: 4,
    toolScores: {
      semrushAuthority: 42,
      semrushOverallTraffic: 300000,
      semrushOrganicTraffic: 220000,
      trafficTrend: "increasing",
      targetCountryTraffic: [{ country: "US", percent: 70 }],
      topCountries: [
        { country: "US", percent: 70 },
        { country: "CA", percent: 7 },
        { country: "UK", percent: 7 },
        { country: "AU", percent: 6 },
        { country: "IN", percent: 4 },
      ],
    },
    publishing: {
      price: 320,
      priceWithContent: 420,
      wordLimit: 1500,
      tatDays: 10,
      backlinkNature: "do-follow",
      backlinksAllowed: 2,
      linkPlacement: "in-content",
      permanence: "lifetime",
    },
    quality: {
      sampleUrl: "https://bizinsider.example/sample",
      remark: "",
      lastPublished: "2025-08-22",
      outboundLinkLimit: 2,
      guidelinesUrl: "https://bizinsider.example/guides",
    },
    additional: {
      disclaimer: "",
      availability: true,
    },
  },
  {
    id: "5",
    url: "https://greengarden.example",
    name: "Green Garden",
    niche: "Lifestyle",
    category: "Guest Post",
    language: "Spanish",
    country: "ES",
    da: 28,
    pa: 30,
    dr: 29,
    spamScore: 1,
    toolScores: {
      semrushAuthority: 18,
      semrushOverallTraffic: 15000,
      semrushOrganicTraffic: 12000,
      trafficTrend: "stable",
      targetCountryTraffic: [{ country: "ES", percent: 65 }],
      topCountries: [
        { country: "ES", percent: 65 },
        { country: "MX", percent: 12 },
        { country: "AR", percent: 8 },
        { country: "US", percent: 5 },
        { country: "CL", percent: 4 },
      ],
    },
    publishing: {
      price: 50,
      priceWithContent: 95,
      wordLimit: 800,
      tatDays: 2,
      backlinkNature: "no-follow",
      backlinksAllowed: 1,
      linkPlacement: "footer",
      permanence: "12-months",
    },
    quality: {
      sampleUrl: "",
      remark: "No adult",
      lastPublished: "2025-06-30",
      outboundLinkLimit: 5,
      guidelinesUrl: "",
    },
    additional: {
      disclaimer: "",
      availability: true,
    },
  },
]

function generateMockSites(startId: number, count: number): Site[] {
  const niches = [
    "Technology",
    "Travel",
    "Health",
    "Business",
    "Finance",
    "Lifestyle",
    "Food",
    "Education",
    "Pets",
    "Gaming",
    "Automotive",
    "Real Estate",
    "Fashion",
    "Parenting",
    "Sports",
    "News",
  ]
  const categories = ["Guest Post", "Sponsorship", "Review"]
  const countries = ["US", "UK", "CA", "AU", "IN", "DE", "FR", "ES", "IT", "BR", "NL", "SE", "JP"]
  const languages = ["English", "Spanish", "French", "German", "Portuguese", "Hindi", "Japanese"]
  const backlinkNatures: Site["publishing"]["backlinkNature"][] = ["do-follow", "no-follow", "sponsored"]
  const placements: Site["publishing"]["linkPlacement"][] = ["in-content", "author-bio", "footer"]
  const trends: Site["toolScores"]["trafficTrend"][] = ["increasing", "stable", "decreasing"]
  const remarks = [
    "No adult, no CBD",
    "Accepts fintech and SaaS",
    "No gambling/casino",
    "Family-friendly only",
    "Strict editorial review",
    "Sponsored tags on brand mentions",
    "Images required",
    "No AI-generated content",
    "Affiliate links allowed (1 max)",
  ]
  const disclaimers = ["Prices may change", "Bulk discount available", "Limited slots this month", "Seasonal pricing"]

  const items: Site[] = []
  for (let i = 0; i < count; i++) {
    const id = (startId + i).toString()
    const niche = niches[i % niches.length]
    const country = countries[i % countries.length]
    const language = languages[i % languages.length]
    const category = categories[i % categories.length]
    const trend = trends[i % trends.length]
    const base = 25 + ((i * 7) % 50) // 25..74
    const da = base
    const pa = Math.max(20, base - 5)
    const dr = Math.min(80, base + 10)
    const spamScore = (i * 3) % 10
    const price = 40 + ((i * 15) % 450) // 40..490
    const priceWithContent = Math.round(price * 1.4)
    const wordLimit = 800 + ((i * 50) % 900) // 800..1700
    const tatDays = 2 + (i % 12)
    const backlinkNature = backlinkNatures[i % backlinkNatures.length]
    const backlinksAllowed = 1 + (i % 3)
    const placement = placements[i % placements.length]
    const permanence: Site["publishing"]["permanence"] = i % 3 === 0 ? "12-months" : "lifetime"
    const semrushAuthority = 15 + ((i * 5) % 60)
    const overallTraffic = 10000 + (i % 20) * 20000
    const organicTraffic = Math.round(overallTraffic * (0.6 + (i % 5) * 0.05))

    items.push({
      id,
      url: `https://${niche.toLowerCase().replace(/\\s+/g, "-")}-${id}.example`,
      name: `${niche} Site ${id}`,
      niche,
      category,
      language,
      country,
      da,
      pa,
      dr,
      spamScore,
      toolScores: {
        semrushAuthority,
        semrushOverallTraffic: overallTraffic,
        semrushOrganicTraffic: organicTraffic,
        trafficTrend: trend,
        targetCountryTraffic: [{ country, percent: 40 + (i % 30) }],
        topCountries: [
          { country, percent: 40 + (i % 30) },
          { country: "US", percent: 10 + (i % 10) },
          { country: "UK", percent: 8 + (i % 8) },
          { country: "IN", percent: 6 + (i % 6) },
          { country: "CA", percent: 5 + (i % 5) },
        ],
      },
      publishing: {
        price,
        priceWithContent,
        wordLimit,
        tatDays,
        backlinkNature,
        backlinksAllowed,
        linkPlacement: placement,
        permanence,
      },
      quality: {
        sampleUrl: i % 3 === 0 ? `https://${niche.toLowerCase()}-${id}.example/sample` : "",
        remark: remarks[i % remarks.length],
        lastPublished: `2025-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
        outboundLinkLimit: 2 + (i % 5),
        guidelinesUrl: i % 2 === 0 ? `https://${niche.toLowerCase()}-${id}.example/guidelines` : "",
      },
      additional: {
        disclaimer: disclaimers[i % disclaimers.length],
        availability: i % 4 !== 0,
      },
    })
  }
  return items
}

// combine base + generated to reach ~39 items total
const sites: Site[] = [...baseSites, ...generateMockSites(6, 34)]

export default sites
