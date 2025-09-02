// API service for fetching publisher data
const API_BASE_URL = "https://agents.outreachdeal.com/webhook/dummy-data";

// API response type based on the terminal data structure
export type APISite = {
  id: number;
  website: string;
  niche: string;
  contentCategories: string;
  siteClassification: string;
  priceCategory: string;
  domainAuthority: number;
  pageAuthority: number;
  linkAttribute: string;
  ahrefTraffic: number;
  spamScore: number;
  domainRating: number;
  socialMediaPosting: boolean;
  costPrice: number;
  sellingPrice: number;
  discount: number;
  adultPrice: number;
  casinoAdultPrice: number;
  cbdPrice: number;
  linkInsertionCost: number;
  websiteRemark: string;
  webIP: string;
  webCountry: string;
  turnAroundTime: string;
  semrushTraffic: string;
  semrushFirstCountryName: string;
  semrushSecondCountryName: string;
  semrushFirstCountryTraffic: number;
  semrushSecondCountryTraffic: number;
  semrushThirdCountryName: string;
  semrushThirdCountryTraffic: number;
  semrushFourthCountryName: string;
  semrushFourthCountryTraffic: number;
  semrushFifthCountryName: string;
  semrushFifthCountryTraffic: number;
  similarwebTraffic: number;
  siteUpdateDate: string | null;
  websiteType: string;
  language: string;
  disclaimer: string;
  anchorText: boolean;
  bannerImagePrice: number;
  costPriceUpdateDate: string;
  pureCategory: string;
  availability: boolean;
  isIndexed: boolean;
  websiteStatus: string;
  websiteQuality: string | null;
  numberOfLinks: number | null;
  semrushUpdateDate: string;
  semrushOrganicTraffic: number;
  semrushOrganicTrafficLastUpdated: string;
  createdAt: string;
  vendorId: number;
  pocId: number;
  updatedAt: string;
  costPriceValidFrom: string | null;
  costPriceValidTo: string | null;
  domainAuthorityUpdateDate: string | null;
  sampleURL: string | null;
}

// Filter type for API requests
export type APIFilters = {
  domainAuthority?: { min?: number; max?: number };
  pageAuthority?: { min?: number; max?: number };
  domainRating?: { min?: number; max?: number };
  spamScore?: { min?: number; max?: number };
  costPrice?: { min?: number; max?: number };
  sellingPrice?: { min?: number; max?: number };
  semrushTraffic?: { min?: number; max?: number };
  semrushOrganicTraffic?: { min?: number; max?: number };
  niche?: string;
  contentCategories?: string;
  priceCategory?: string;
  linkAttribute?: string;
  availability?: boolean;
  language?: string;
  webCountry?: string;
  turnAroundTime?: string;
  websiteRemark?: string;
  limit?: number;
}

// Convert API filters to query string
function buildFilterQuery(filters: APIFilters): string {
  const conditions: string[] = [];
  
  if (filters.domainAuthority?.min !== undefined) {
    conditions.push(`"domainAuthority" >= ${filters.domainAuthority.min}`);
  }
  if (filters.domainAuthority?.max !== undefined) {
    conditions.push(`"domainAuthority" <= ${filters.domainAuthority.max}`);
  }
  
  if (filters.pageAuthority?.min !== undefined) {
    conditions.push(`"pageAuthority" >= ${filters.pageAuthority.min}`);
  }
  if (filters.pageAuthority?.max !== undefined) {
    conditions.push(`"pageAuthority" <= ${filters.pageAuthority.max}`);
  }
  
  if (filters.domainRating?.min !== undefined) {
    conditions.push(`"domainRating" >= ${filters.domainRating.min}`);
  }
  if (filters.domainRating?.max !== undefined) {
    conditions.push(`"domainRating" <= ${filters.domainRating.max}`);
  }
  
  if (filters.spamScore?.min !== undefined) {
    conditions.push(`"spamScore" >= ${filters.spamScore.min}`);
  }
  if (filters.spamScore?.max !== undefined) {
    conditions.push(`"spamScore" <= ${filters.spamScore.max}`);
  }
  
  if (filters.costPrice?.min !== undefined) {
    conditions.push(`"costPrice" >= ${filters.costPrice.min}`);
  }
  if (filters.costPrice?.max !== undefined) {
    conditions.push(`"costPrice" <= ${filters.costPrice.max}`);
  }
  
  if (filters.sellingPrice?.min !== undefined) {
    conditions.push(`"sellingPrice" >= ${filters.sellingPrice.min}`);
  }
  if (filters.sellingPrice?.max !== undefined) {
    conditions.push(`"sellingPrice" <= ${filters.sellingPrice.max}`);
  }
  
  if (filters.semrushTraffic?.min !== undefined) {
    conditions.push(`"semrushTraffic" >= ${filters.semrushTraffic.min}`);
  }
  if (filters.semrushTraffic?.max !== undefined) {
    conditions.push(`"semrushTraffic" <= ${filters.semrushTraffic.max}`);
  }
  
  if (filters.semrushOrganicTraffic?.min !== undefined) {
    conditions.push(`"semrushOrganicTraffic" >= ${filters.semrushOrganicTraffic.min}`);
  }
  if (filters.semrushOrganicTraffic?.max !== undefined) {
    conditions.push(`"semrushOrganicTraffic" <= ${filters.semrushOrganicTraffic.max}`);
  }
  
  if (filters.availability !== undefined) {
    conditions.push(`"availability" = ${filters.availability}`);
  }
  
  return conditions.join(" AND ");
}

// Fetch data from API
export async function fetchPublisherData(filters: APIFilters = {}): Promise<APISite[]> {
  try {
    const filterQuery = buildFilterQuery(filters);
    const payload = {
      filters: filterQuery,
      limit: filters.limit || 100
    };

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle the response structure - extract the actual sites array
    if (data && Array.isArray(data)) {
      return data.map((item: any) => item.json || item);
    } else if (data && Array.isArray(data.data)) {
      return data.data.map((item: any) => item.json || item);
    } else {
      console.warn("Unexpected API response structure:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching publisher data:", error);
    // Return empty array on error
    return [];
  }
}

// Mock data fallback for development/testing
export const mockSites: APISite[] = [
  {
    id: 28017,
    website: "www.bhtnews.com",
    niche: "multi",
    contentCategories: "BUSINESS,HEALTH,TECHNOLOGY",
    siteClassification: "Normal",
    priceCategory: "Paid",
    domainAuthority: 54,
    pageAuthority: 26,
    linkAttribute: "DoFollow",
    ahrefTraffic: 10,
    spamScore: 2,
    domainRating: 41,
    socialMediaPosting: true,
    costPrice: 25,
    sellingPrice: 75,
    discount: 0,
    adultPrice: 0,
    casinoAdultPrice: 0,
    cbdPrice: 0,
    linkInsertionCost: 25,
    websiteRemark: "Banner image price, $50/month, How many Do-follow links will you allow- One, We don't accept niches like: porn, sex, dating, betting, gambling, lottery, insurance, debt, loan, pharmacy, music, CBD, vaping, smoking, or any illegal stuff.",
    webIP: "188.114.97.2",
    webCountry: "",
    turnAroundTime: "1-2 DAYS",
    semrushTraffic: "128",
    semrushFirstCountryName: "UK 47",
    semrushSecondCountryName: "US 29",
    semrushFirstCountryTraffic: 24,
    semrushSecondCountryTraffic: 108,
    semrushThirdCountryName: "RUSSIA 24",
    semrushThirdCountryTraffic: 6,
    semrushFourthCountryName: "",
    semrushFourthCountryTraffic: 0,
    semrushFifthCountryName: "",
    semrushFifthCountryTraffic: 20240709,
    similarwebTraffic: 5000,
    siteUpdateDate: null,
    websiteType: "Default",
    language: "",
    disclaimer: "",
    anchorText: false,
    bannerImagePrice: 50,
    costPriceUpdateDate: "2024-01-01T00:00:00.000Z",
    pureCategory: "",
    availability: true,
    isIndexed: false,
    websiteStatus: "Normal",
    websiteQuality: null,
    numberOfLinks: null,
    semrushUpdateDate: "2025-08-05T00:00:00.000Z",
    semrushOrganicTraffic: 0,
    semrushOrganicTrafficLastUpdated: "2025-04-11T13:54:02.658Z",
    createdAt: "2025-04-11T13:54:02.658Z",
    vendorId: 4676,
    pocId: 2,
    updatedAt: "2025-04-11T13:54:02.658Z",
    costPriceValidFrom: null,
    costPriceValidTo: null,
    domainAuthorityUpdateDate: null,
    sampleURL: null
  }
];

// Utility function to get unique values for filter options
export function getUniqueValues(sites: APISite[], field: keyof APISite): string[] {
  const values = sites
    .map(site => site[field])
    .filter((value): value is string => typeof value === 'string' && value.trim() !== '')
    .map(value => value.trim());
  
  return [...new Set(values)].sort();
}

// Utility function to get unique niches
export function getUniqueNiches(sites: APISite[]): string[] {
  return getUniqueValues(sites, 'niche');
}

// Utility function to get unique content categories
export function getUniqueContentCategories(sites: APISite[]): string[] {
  const allCategories = sites
    .map(site => site.contentCategories)
    .filter(cat => cat && cat.trim() !== '')
    .flatMap(cat => cat.split(',').map(c => c.trim()))
    .filter(cat => cat !== '');
  
  return [...new Set(allCategories)].sort();
}

// Utility function to get unique countries
export function getUniqueCountries(sites: APISite[]): string[] {
  return getUniqueValues(sites, 'webCountry');
}

// Utility function to get unique languages
export function getUniqueLanguages(sites: APISite[]): string[] {
  return getUniqueValues(sites, 'language');
}
