// API data types based on the actual API response
export interface APISite {
  id: number
  website: string
  niche: string
  contentCategories: string
  siteClassification: string
  priceCategory: string
  domainAuthority: number
  pageAuthority: number
  linkAttribute: string
  ahrefTraffic: number
  spamScore: number
  domainRating: number
  socialMediaPosting: boolean
  costPrice: number
  sellingPrice: number
  discount: number
  adultPrice: number
  casinoAdultPrice: number
  cbdPrice: number
  linkInsertionCost: number
  websiteRemark: string
  webIP: string
  webCountry: string
  turnAroundTime: string
  semrushTraffic: string
  semrushFirstCountryName: string
  semrushSecondCountryName: string
  semrushFirstCountryTraffic: number
  semrushSecondCountryTraffic: number
  semrushThirdCountryName: string
  semrushThirdCountryTraffic: number
  semrushFourthCountryName: string
  semrushFourthCountryTraffic: number
  semrushFifthCountryName: string
  semrushFifthCountryTraffic: number
  similarwebTraffic: number
  siteUpdateDate: string | null
  websiteType: string
  language: string
  disclaimer: string
  anchorText: boolean
  bannerImagePrice: number
  costPriceUpdateDate: string
  pureCategory: string
  availability: boolean
  isIndexed: boolean
  websiteStatus: string
  websiteQuality: string | null
  numberOfLinks: number | null
  semrushUpdateDate: string
  semrushOrganicTraffic: number
  semrushOrganicTrafficLastUpdated: string
  createdAt: string
  vendorId: number
  pocId: number
  updatedAt: string
  costPriceValidFrom: string | null
  costPriceValidTo: string | null
  domainAuthorityUpdateDate: string | null
  sampleURL: string | null
}

// Site type for the filter page (transformed from API data)
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

export interface APIFilters {
  domainAuthority?: { min?: number; max?: number }
  pageAuthority?: { min?: number; max?: number }
  domainRating?: { min?: number; max?: number }
  spamScore?: { min?: number; max?: number }
  costPrice?: { min?: number; max?: number }
  sellingPrice?: { min?: number; max?: number }
  semrushTraffic?: { min?: number; max?: number }
  semrushOrganicTraffic?: { min?: number; max?: number }
  niche?: string
  contentCategories?: string
  priceCategory?: string
  linkAttribute?: string
  availability?: boolean
  websiteStatus?: string
  language?: string
  webCountry?: string
  turnAroundTime?: string
  websiteRemark?: string
  // Optional: server-side filtering by website name (if supported by API)
  website?: string
  limit?: number
}

export interface APIResponse {
  json: APISite
  pairedItem: {
    item: number
  }
}

// API functions
const API_BASE_URL = 'https://agents.outreachdeal.com/webhook/dummy-data'
const CATEGORIES_API_URL = 'https://agents.outreachdeal.com/webhook/fetch-categories'

// Category recommendations API
export interface CategoryRecommendation {
  category: string
  count?: number
  relevance?: number
}

export async function fetchCategoryRecommendations(query: string): Promise<CategoryRecommendation[]> {
  if (!query || query.trim().length < 2) {
    return []
  }

  try {
    console.log('Fetching category recommendations for:', query)
    
    const response = await fetch(CATEGORIES_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query.trim(),
        limit: 10
      }),
    })

    console.log('Categories API response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Categories API Error Response:', errorText)
      
      if (response.status === 404) {
        throw new Error(`Categories API endpoint not found: ${CATEGORIES_API_URL}`)
      }
      
      throw new Error(`Categories API request failed: ${response.status} ${response.statusText}`)
    }

    const responseText = await response.text()
    if (!responseText || responseText.trim() === '') {
      console.warn('Categories API returned empty body.')
      return []
    }

    let data: any
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error('Failed to parse categories API response as JSON. Raw response:', responseText)
      throw new Error('Unexpected categories API response: not valid JSON')
    }

    console.log('Categories API Response data:', data)
    
    // Handle different possible response formats
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        category: item.category || item.name || item,
        count: item.count,
        relevance: item.relevance
      }))
    }
    
    // If it's an object with categories array
    if (data && typeof data === 'object' && Array.isArray(data.categories)) {
      return data.categories.map((item: any) => ({
        category: item.category || item.name || item,
        count: item.count,
        relevance: item.relevance
      }))
    }
    
    // If it's a single category string
    if (typeof data === 'string') {
      return [{ category: data }]
    }
    
    return []
  } catch (error) {
    console.error('Error fetching category recommendations:', error)
    
    // If it's a network error, provide a helpful message
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the categories API.')
    }
    
    throw error
  }
}

// Test function to debug webhook issues
// testWebhookConnection removed (debug-only)

export async function fetchSitesWithFilters(filters: APIFilters = {}): Promise<APISite[]> {
  try {
    console.log('Making API request to:', API_BASE_URL)
    // Build structured payload (as used in the successful test script)
    const requestPayload: Record<string, unknown> = {
      limit: filters.limit || 100,
    }
    // Copy supported filter objects/fields through as-is
    const passthroughKeys: (keyof APIFilters)[] = [
      'domainAuthority',
      'pageAuthority',
      'domainRating',
      'spamScore',
      'costPrice',
      'sellingPrice',
      'semrushTraffic',
      'semrushOrganicTraffic',
      'niche',
      'contentCategories',
      'priceCategory',
      'linkAttribute',
      'availability',
      'websiteStatus',
      'language',
      'webCountry',
      'turnAroundTime',
      'websiteRemark',
      'website',
    ]
    for (const key of passthroughKeys) {
      const value = (filters as any)[key]
      if (value !== undefined && value !== '' && value !== null) {
        ;(requestPayload as any)[key] = value
      }
    }
    console.log('Structured request payload:', requestPayload)
    
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    })

    console.log('Response status:', response.status, response.statusText)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', errorText)
      
      if (response.status === 404) {
        // Check for the specific webhook error message
        if (errorText.includes('webhook is not registered for GET requests')) {
          console.error('🚨 WEBHOOK ERROR: GET request detected when only POST is supported')
          console.error('🔍 This usually means:')
          console.error('   1. Browser is making a preflight OPTIONS request')
          console.error('   2. Some middleware is converting POST to GET')
          console.error('   3. Direct URL access in browser (GET request)')
          throw new Error(`Webhook endpoint error: This endpoint only supports POST requests, but a GET request was made. Please check your request method.`)
        }
        
        throw new Error(`API endpoint not found. Please check the URL: ${API_BASE_URL}`)
      }
      
      throw new Error(`API request failed: ${response.status} ${response.statusText}. Response: ${errorText}`)
    }

    // Read as text first to guard against empty/non-JSON bodies
    const responseText = await response.text()
    if (!responseText || responseText.trim() === '') {
      console.warn('API returned empty body. Returning empty list.')
      return []
    }
    let data: any
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error('Failed to parse API response as JSON. Raw response:', responseText)
      throw new Error('Unexpected API response: not valid JSON')
    }
    console.log('API Response data:', data)
    
    // Handle the array structure from the API
    if (Array.isArray(data)) {
      return data.map((item: APIResponse) => item.json)
    }
    
    // If it's a single object, wrap it in an array
    if (data && typeof data === 'object') {
      return [data.json || data]
    }
    
    return []
  } catch (error) {
    console.error('Error fetching sites:', error)
    
    // If it's a network error, provide a helpful message
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the API. Please check your internet connection.')
    }
    
    throw error
  }
}

// Transform API data to the format expected by the filter page
export function transformAPISiteToSite(apiSite: APISite): Site {
  return {
    id: apiSite.id.toString(),
    url: `https://${apiSite.website}`,
    name: apiSite.website,
    niche: apiSite.niche || 'Not Specified',
    category: apiSite.priceCategory || 'Not Specified',
    language: apiSite.language || 'Not Specified',
    country: apiSite.webCountry || 'Not Specified',
    da: apiSite.domainAuthority || 0,
    pa: apiSite.pageAuthority || 0,
    dr: apiSite.domainRating || 0,
    spamScore: apiSite.spamScore || 0,
    toolScores: {
      semrushAuthority: 0, // Not available in API
      semrushOverallTraffic: parseInt(apiSite.semrushTraffic) || 0,
      semrushOrganicTraffic: apiSite.semrushOrganicTraffic || 0,
      trafficTrend: 'stable' as const, // Not available in API
      targetCountryTraffic: apiSite.semrushFirstCountryName ? [
        { country: apiSite.semrushFirstCountryName, percent: 100 }
      ] : [],
      topCountries: [
        ...(apiSite.semrushFirstCountryName ? [{ country: apiSite.semrushFirstCountryName, percent: apiSite.semrushFirstCountryTraffic || 0 }] : []),
        ...(apiSite.semrushSecondCountryName ? [{ country: apiSite.semrushSecondCountryName, percent: apiSite.semrushSecondCountryTraffic || 0 }] : []),
        ...(apiSite.semrushThirdCountryName ? [{ country: apiSite.semrushThirdCountryName, percent: apiSite.semrushThirdCountryTraffic || 0 }] : []),
      ].filter(c => c.percent > 0)
    },
    publishing: {
      price: apiSite.costPrice || 0,
      
      priceWithContent: apiSite.sellingPrice || 0,
      wordLimit: 1000, // Not available in API
      tatDays: parseInt(apiSite.turnAroundTime) || 0,
      backlinkNature: (apiSite.linkAttribute?.toLowerCase() || 'do-follow') as 'do-follow' | 'no-follow' | 'sponsored',
      backlinksAllowed: apiSite.numberOfLinks || 1,
      linkPlacement: 'in-content' as const, // Not available in API
      permanence: 'lifetime' as const, // Not available in API
    },
    quality: {
      sampleUrl: apiSite.sampleURL || '',
      remark: apiSite.websiteRemark || '',
      lastPublished: apiSite.updatedAt ? new Date(apiSite.updatedAt).toISOString().split('T')[0] : 'Unknown',
      outboundLinkLimit: 3, // Not available in API
      guidelinesUrl: '', // Not available in API
    },
    additional: {
      disclaimer: apiSite.disclaimer || '',
      availability: apiSite.availability || false,
    },
  }
}

// Legacy mock data for fallback
export const baseSites = [
  // ... existing mock data can be kept for development/testing
]
