"use client"

import type { ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"

import { useEffect, useMemo, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  FileStack,
  Fingerprint,
  Cpu,
  ReceiptText,
  History,
  CircleEllipsis,
  Settings,
  X,
  Plus,
  Filter,
  Columns3,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react"
import { Site, fetchSitesWithFilters, transformAPISiteToSite, APIFilters, fetchCategoryRecommendations, CategoryRecommendation } from "@/lib/sample-sites"
import { useCart } from "@/contexts/cart-context"

// Site type is now imported from lib/sample-sites

// Mock data removed - now using API

// Mock data generation removed - now using API
type Trend = "increasing" | "decreasing" | "stable"
type BacklinkNature = "do-follow" | "no-follow" | "sponsored"
type LinkPlacement = "in-content" | "author-bio" | "footer"

// Static list of country names for selection and search
const COUNTRY_NAMES: string[] = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria",
  "Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan",
  "Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia",
  "Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo (Congo-Brazzaville)","Costa Rica",
  "Côte d’Ivoire","Croatia","Cuba","Cyprus","Czechia","Democratic Republic of the Congo","Denmark","Djibouti","Dominica","Dominican Republic",
  "Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland",
  "France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea",
  "Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq",
  "Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait",
  "Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg",
  "Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico",
  "Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru",
  "Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman",
  "Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar",
  "Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","São Tomé and Príncipe","Saudi Arabia",
  "Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa",
  "South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan",
  "Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan",
  "Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City",
  "Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
]

// Popular languages for dropdown
const POPULAR_LANGUAGES: string[] = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese", "Dutch", "Russian", "Chinese", "Japanese",
  "Korean", "Arabic", "Hindi", "Turkish", "Polish", "Swedish", "Norwegian", "Danish", "Finnish", "Greek",
  "Hebrew", "Thai", "Vietnamese", "Indonesian", "Malay", "Tagalog", "Czech", "Hungarian", "Romanian", "Bulgarian",
  "Croatian", "Serbian", "Slovak", "Slovenian", "Lithuanian", "Latvian", "Estonian", "Ukrainian", "Belarusian", "Georgian"
]

// Common niches for recommendations
const COMMON_NICHES: string[] = [
  "Technology", "Health & Fitness", "Finance", "Travel", "Food & Cooking", "Fashion", "Beauty", "Home & Garden",
  "Business", "Marketing", "Education", "Entertainment", "Sports", "Automotive", "Real Estate", "Parenting",
  "Pets", "DIY & Crafts", "Photography", "Art & Design", "Music", "Books & Literature", "Gaming", "Cryptocurrency",
  "Sustainability", "Mental Health", "Career Development", "Productivity", "Lifestyle", "Wedding", "Pregnancy",
  "Senior Living", "Teenagers", "Kids", "Outdoor Activities", "Hobbies", "Collectibles", "Antiques", "Vintage",
  "Minimalism", "Self-Improvement", "Spirituality", "Religion", "Politics", "News", "Science", "Environment",
  "Renewable Energy", "Green Living", "Organic", "Vegan", "Vegetarian", "Gluten-Free", "Keto", "Paleo",
  "Meditation", "Yoga", "Running", "Cycling", "Swimming", "Weightlifting", "CrossFit", "Pilates", "Dancing",
  "Singing", "Acting", "Theater", "Movies", "TV Shows", "Streaming", "Podcasts", "Blogging", "Vlogging",
  "Social Media", "Influencer Marketing", "E-commerce", "Dropshipping", "Affiliate Marketing", "SEO", "PPC",
  "Content Marketing", "Email Marketing", "Social Media Marketing", "Digital Marketing", "Web Development",
  "Mobile Apps", "Software", "AI & Machine Learning", "Data Science", "Cybersecurity", "Cloud Computing",
  "Blockchain", "NFTs", "Web3", "Metaverse", "Virtual Reality", "Augmented Reality", "IoT", "Robotics",
  "Automation", "Productivity Tools", "Project Management", "Remote Work", "Freelancing", "Entrepreneurship",
  "Startups", "Investing", "Trading", "Personal Finance", "Retirement Planning", "Insurance", "Taxes",
  "Real Estate Investing", "Stock Market", "Bonds", "Mutual Funds", "ETFs", "Forex", "Commodities", "Gold",
  "Silver", "Precious Metals", "Collectibles", "Art Investment", "Wine Investment", "Antique Investment"
]

type Filters = {
  niche: string
  language: string
  country: string
  daMin?: number
  daMax?: number
  paMin?: number
  paMax?: number
  drMin?: number
  drMax?: number
  spamMax?: number
  spamMin?: number
  tool?: "Semrush" | "Ahrefs"
  semrushAuthorityMin?: number
  semrushOverallTrafficMin?: number
  semrushOrganicTrafficMin?: number
  targetCountry?: string
  targetCountryPctMin?: number
  trend?: Trend
  priceMin?: number
  priceMax?: number
  tatDaysMax?: number
  tatDaysMin?: number
  permanenceMinMonths?: number
  permanenceMaxMonths?: number
  backlinkNature?: BacklinkNature
  backlinksAllowedMin?: number
  linkPlacement?: LinkPlacement
  permanence?: "lifetime" | "12-months"
  sampleUrl?: string
  remarkIncludes?: string
  lastPublishedAfter?: string
  outboundLinkLimitMax?: number
  guidelinesUrlIncludes?: string
  disclaimerIncludes?: string
  availability?: boolean
}

// Column definitions
type ColumnKey = 'name' | 'niche' | 'category' | 'countryLang' | 'authority' | 'spam' | 'price' | 'priceWithContent' | 'traffic' | 'organicTraffic' | 'semrushAuth' | 'trend' | 'wordLimit' | 'tat' | 'backlinkNature' | 'backlinksAllowed' | 'linkPlacement' | 'permanence' | 'lastPublished' | 'outboundLinks' | 'availability' | 'remark' | 'cart'

type ColumnConfig = {
  key: ColumnKey
  label: string
  width?: string
  category: 'basic' | 'authority' | 'pricing' | 'traffic' | 'publishing' | 'quality' | 'status' | 'actions'
}

const allColumns: ColumnConfig[] = [
  { key: 'name', label: 'Name', category: 'basic' },
  { key: 'niche', label: 'Niche', category: 'basic' },
  { key: 'category', label: 'Category', category: 'basic' },
  { key: 'countryLang', label: 'Country/Lang', category: 'basic' },
  { key: 'authority', label: 'Authority', category: 'authority' },
  { key: 'spam', label: 'Spam', category: 'authority' },
  { key: 'semrushAuth', label: 'Semrush Auth', category: 'authority' },
  { key: 'price', label: 'Price', category: 'pricing' },
  { key: 'priceWithContent', label: 'Price + Content', category: 'pricing' },
  { key: 'traffic', label: 'Overall Traffic', category: 'traffic' },
  { key: 'trend', label: 'Trend', category: 'traffic' },
  { key: 'wordLimit', label: 'Word Limit', category: 'publishing' },
  { key: 'tat', label: 'TAT Days', category: 'publishing' },
  { key: 'backlinkNature', label: 'Backlink Type', category: 'publishing' },
  { key: 'backlinksAllowed', label: 'Backlinks', category: 'publishing' },
  { key: 'linkPlacement', label: 'Link Placement', category: 'publishing' },
  { key: 'permanence', label: 'Permanence', category: 'publishing' },
  { key: 'lastPublished', label: 'Last Published', category: 'quality' },
  { key: 'outboundLinks', label: 'Outbound Limit', category: 'quality' },
  { key: 'remark', label: 'Remark', category: 'quality' },
  { key: 'availability', label: 'Available', category: 'status' },
  { key: 'cart', label: 'Cart', category: 'actions' }
]

const defaultFilters: Filters = {
  niche: "",
  language: "",
  country: "",
}

const defaultVisibleColumns: ColumnKey[] = ['name', 'niche', 'countryLang', 'authority', 'spam', 'price', 'trend', 'cart']

const styles = {
  surface: "bg-white dark:bg-gray-950 text-gray-900 dark:text-white",
  panel: "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800",
  field: "bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400 border border-gray-300 dark:border-gray-700 focus-visible:ring-2 focus-visible:ring-yellow-400",
  select: "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700",
  menu: "bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700",
  chip: "bg-yellow-400 text-gray-900",
}

type FilterPebble = {
  key: keyof Filters
  label: string
  icon: ReactNode
  category: "basic" | "authority" | "traffic" | "publishing" | "quality" | "additional"
  tooltip: string
}

const filterPebbles: FilterPebble[] = [
  // Basic
  { key: "niche", label: "Niche", icon: <FileStack className="w-3 h-3" />, category: "basic", tooltip: "Filter by website topic (Technology, Health, Finance, etc.)" },
  { key: "language", label: "Language", icon: <FileStack className="w-3 h-3" />, category: "basic", tooltip: "Filter by website language (English, Spanish, French, etc.)" },
  { key: "country", label: "Country", icon: <FileStack className="w-3 h-3" />, category: "basic", tooltip: "Filter by website country for geo-targeted content" },
  
  // Authority
  { key: "daMin", label: "Domain Authority", icon: <Fingerprint className="w-3 h-3" />, category: "authority", tooltip: "Minimum Domain Authority score (higher = more authoritative)" },
  { key: "paMin", label: "Page Authority", icon: <Fingerprint className="w-3 h-3" />, category: "authority", tooltip: "Minimum Page Authority score for ranking potential" },
  { key: "drMin", label: "Domain Rating", icon: <Fingerprint className="w-3 h-3" />, category: "authority", tooltip: "Minimum Domain Rating from Ahrefs (higher = stronger backlinks)" },
  { key: "spamMax", label: "Spam Score", icon: <Fingerprint className="w-3 h-3" />, category: "authority", tooltip: "Maximum Spam Score (lower = cleaner websites)" },
  { key: "tool", label: "SEO Tool", icon: <Fingerprint className="w-3 h-3" />, category: "authority", tooltip: "Choose SEO tool for metrics (Moz, Ahrefs, etc.)" },
  
  // Traffic
  { key: "semrushAuthorityMin", label: "Semrush Authority", icon: <Cpu className="w-3 h-3" />, category: "traffic", tooltip: "Minimum Semrush Authority score" },
  { key: "semrushOverallTrafficMin", label: "Overall Traffic", icon: <Cpu className="w-3 h-3" />, category: "traffic", tooltip: "Minimum monthly overall traffic" },
  { key: "semrushOrganicTrafficMin", label: "Organic Traffic", icon: <Cpu className="w-3 h-3" />, category: "traffic", tooltip: "Minimum monthly organic search traffic" },
  { key: "trend", label: "Traffic Trend", icon: <Cpu className="w-3 h-3" />, category: "traffic", tooltip: "Traffic trend: increasing, decreasing, or stable" },
  
  // Publishing
  { key: "priceMin", label: "Price Range", icon: <ReceiptText className="w-3 h-3" />, category: "publishing", tooltip: "Minimum price for guest posts or sponsored content" },
  { key: "tatDaysMax", label: "TAT Days", icon: <ReceiptText className="w-3 h-3" />, category: "publishing", tooltip: "Maximum Turnaround Time in days" },
  { key: "backlinkNature", label: "Backlink Nature", icon: <ReceiptText className="w-3 h-3" />, category: "publishing", tooltip: "Backlink type: Do-follow, No-follow, or Sponsored" },
  { key: "linkPlacement", label: "Link Placement", icon: <ReceiptText className="w-3 h-3" />, category: "publishing", tooltip: "Where links are placed: In-content, Author bio, or Footer" },
  { key: "permanence", label: "Permanence", icon: <ReceiptText className="w-3 h-3" />, category: "publishing", tooltip: "How long links should remain on the website" },
  
]

export default function CompactFilterPage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [sortBy, setSortBy] = useState<string>("relevance")
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [activeFilterKey, setActiveFilterKey] = useState<keyof Filters | null>(null)
  const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>(defaultVisibleColumns)
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { addItem, isItemInCart } = useCart()
  const [lastFetched, setLastFetched] = useState<Date | null>(null)
  const [views, setViews] = useState<Array<{ id: string; name: string; filters: any }>>([])
  const [viewName, setViewName] = useState<string>("")
  const [savingView, setSavingView] = useState<boolean>(false)
  const [applyingViewId, setApplyingViewId] = useState<string>("")
  type RowLevel = 1 | 2 | 3 | 4 | 'custom'
  const [rowLevel, setRowLevel] = useState<RowLevel>(2)
  const [allCountries, setAllCountries] = useState<string[]>(COUNTRY_NAMES)
  const [countrySearch, setCountrySearch] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [nicheSearch, setNicheSearch] = useState<string>("")
  const [showNicheSuggestions, setShowNicheSuggestions] = useState<boolean>(false)
  const [categoryRecommendations, setCategoryRecommendations] = useState<CategoryRecommendation[]>([])
  const [loadingCategories, setLoadingCategories] = useState<boolean>(false)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  

  // Row presets: progressively reveal more data
  const rowLevelPresets: Record<Exclude<RowLevel, 'custom'>, ColumnKey[]> = {
    1: ['name', 'niche', 'price', 'cart'],
    2: defaultVisibleColumns,
    3: ['name', 'niche', 'countryLang', 'authority', 'spam', 'price', 'priceWithContent', 'trend', 'wordLimit', 'tat', 'backlinksAllowed', 'linkPlacement', 'cart'],
    4: allColumns.map((c) => c.key),
  }

  const rowPaddingByLevel: Record<Exclude<RowLevel, 'custom'>, string> = {
    1: 'py-1',
    2: 'py-2',
    3: 'py-3',
    4: 'py-4',
  }

  const applyRowLevel = (lvl: Exclude<RowLevel, 'custom'>) => {
    if (!loading) {
      setRowLevel(lvl)
      setVisibleColumns(rowLevelPresets[lvl])
    }
  }

  // Convert filters to API format
  const convertFiltersToAPI = (f: Filters): APIFilters => {
    const apiFilters: APIFilters = {}
    
    if (f.daMin !== undefined) apiFilters.domainAuthority = { ...apiFilters.domainAuthority, min: f.daMin }
    if (f.daMax !== undefined) apiFilters.domainAuthority = { ...apiFilters.domainAuthority, max: f.daMax }
    if (f.paMin !== undefined) apiFilters.pageAuthority = { ...apiFilters.pageAuthority, min: f.paMin }
    if (f.paMax !== undefined) apiFilters.pageAuthority = { ...apiFilters.pageAuthority, max: f.paMax }
    if (f.drMin !== undefined) apiFilters.domainRating = { ...apiFilters.domainRating, min: f.drMin }
    if (f.drMax !== undefined) apiFilters.domainRating = { ...apiFilters.domainRating, max: f.drMax }
    if (f.spamMin !== undefined) apiFilters.spamScore = { ...apiFilters.spamScore, min: f.spamMin }
    if (f.spamMax !== undefined) apiFilters.spamScore = { ...apiFilters.spamScore, max: f.spamMax }
    if (f.priceMin !== undefined) apiFilters.costPrice = { ...apiFilters.costPrice, min: f.priceMin }
    if (f.priceMax !== undefined) apiFilters.costPrice = { ...apiFilters.costPrice, max: f.priceMax }
    if (f.semrushOverallTrafficMin !== undefined) apiFilters.semrushTraffic = { ...apiFilters.semrushTraffic, min: f.semrushOverallTrafficMin }
    if (f.semrushOrganicTrafficMin !== undefined) apiFilters.semrushOrganicTraffic = { ...apiFilters.semrushOrganicTraffic, min: f.semrushOrganicTrafficMin }
    if (f.niche) apiFilters.niche = f.niche
    if (f.language) apiFilters.language = f.language
    if (f.country) apiFilters.webCountry = f.country
    if (f.backlinkNature) apiFilters.linkAttribute = f.backlinkNature
    if (f.availability !== undefined) apiFilters.availability = f.availability
    if (f.remarkIncludes) apiFilters.websiteRemark = f.remarkIncludes
    if (searchQuery.trim()) apiFilters.website = searchQuery.trim()
    
    return apiFilters
  }

  

  // Fetch data from API
  const fetchData = async (apiFilters: APIFilters = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const apiSites = await fetchSitesWithFilters(apiFilters)
      const transformedSites = apiSites.map(transformAPISiteToSite)
      setSites(transformedSites)
      setLastFetched(new Date())
    } catch (error) {
      console.error('Error fetching data:', error)
      
      // Provide a more helpful error message
      let errorMessage = 'Failed to fetch data. Please try again.'
      
      if (error instanceof Error) {
        if (error.message.includes('API endpoint not found')) {
          errorMessage = 'API endpoint not available. Please check the configuration.'
        } else if (error.message.includes('Network error')) {
          errorMessage = 'Network error: Unable to connect to the API. Please check your internet connection.'
        } else if (error.message.includes('404')) {
          errorMessage = 'API endpoint not found. The service may be temporarily unavailable.'
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
      setSites([])
    } finally {
      setLoading(false)
    }
  }

  

  // Load initial data
  useEffect(() => {
    fetchData()
  }, [])

  // Load saved views
  useEffect(() => {
    const loadViews = async () => {
      try {
        const res = await fetch('/api/views', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        setViews(data.views ?? [])
      } catch (e) {
        // ignore silently
      }
    }
    loadViews()
  }, [])

  // Debounced category recommendations fetch
  useEffect(() => {
    if (!nicheSearch || nicheSearch.trim().length < 2) {
      setCategoryRecommendations([])
      setCategoryError(null)
      return
    }

    const timeoutId = setTimeout(async () => {
      setLoadingCategories(true)
      setCategoryError(null)
      
      try {
        const recommendations = await fetchCategoryRecommendations(nicheSearch)
        setCategoryRecommendations(recommendations)
      } catch (error) {
        console.error('Error fetching category recommendations:', error)
        setCategoryError(error instanceof Error ? error.message : 'Failed to fetch recommendations')
        setCategoryRecommendations([])
      } finally {
        setLoadingCategories(false)
      }
    }, 300) // 300ms delay for category search

    return () => clearTimeout(timeoutId)
  }, [nicheSearch])

  // Debounced filter update to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const apiFilters = convertFiltersToAPI(filters)
      fetchData(apiFilters)
    }, 500) // 500ms delay

    return () => clearTimeout(timeoutId)
  }, [filters])

  // Debounced search query update to query API as user types
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const apiFilters = convertFiltersToAPI(filters)
      fetchData(apiFilters)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const results = useMemo(() => {
    const filtered = applyFilters(sites, filters)
    const q = searchQuery.trim().toLowerCase()
    if (!q) return filtered
    return filtered.filter((s) =>
      s.name.toLowerCase().includes(q) || s.url.toLowerCase().includes(q)
    )
  }, [sites, filters, searchQuery])

  // Initialize search from URL (?q=...)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q') || ''
    if (q) setSearchQuery(q)
  }, [])

  // Persist search to URL without navigation
  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    if (searchQuery.trim()) {
      url.searchParams.set('q', searchQuery.trim())
    } else {
      url.searchParams.delete('q')
    }
    window.history.replaceState({}, '', url.toString())
  }, [searchQuery])
  
  const availableCountries = useMemo(() => {
    const set = new Set<string>()
    for (const s of sites) {
      const c = s.country?.trim()
      if (c && c.toLowerCase() !== 'not specified') set.add(c)
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [sites])

  // Static countries are already set; no need for Intl lookup

  const priceBounds = useMemo(() => {
    if (!sites.length) return { min: 0, max: 1000 }
    let min = Number.POSITIVE_INFINITY
    let max = 0
    for (const s of sites) {
      const p = s.publishing.price || 0
      if (p < min) min = p
      if (p > max) max = p
    }
    if (!isFinite(min)) min = 0
    if (max < min) max = min
    return { min, max }
  }, [sites])
  
  const daBounds = useMemo(() => {
    if (!sites.length) return { min: 0, max: 100 }
    let min = Number.POSITIVE_INFINITY
    let max = 0
    for (const s of sites) {
      const v = s.da || 0
      if (v < min) min = v
      if (v > max) max = v
    }
    if (!isFinite(min)) min = 0
    if (max < min) max = min
    return { min, max }
  }, [sites])

  const paBounds = useMemo(() => {
    if (!sites.length) return { min: 0, max: 100 }
    let min = Number.POSITIVE_INFINITY
    let max = 0
    for (const s of sites) {
      const v = s.pa || 0
      if (v < min) min = v
      if (v > max) max = v
    }
    if (!isFinite(min)) min = 0
    if (max < min) max = min
    return { min, max }
  }, [sites])

  const drBounds = useMemo(() => {
    if (!sites.length) return { min: 0, max: 100 }
    let min = Number.POSITIVE_INFINITY
    let max = 0
    for (const s of sites) {
      const v = s.dr || 0
      if (v < min) min = v
      if (v > max) max = v
    }
    if (!isFinite(min)) min = 0
    if (max < min) max = min
    return { min, max }
  }, [sites])

  const spamBounds = useMemo(() => {
    if (!sites.length) return { min: 0, max: 100 }
    let min = Number.POSITIVE_INFINITY
    let max = 0
    for (const s of sites) {
      const v = s.spamScore || 0
      if (v < min) min = v
      if (v > max) max = v
    }
    if (!isFinite(min)) min = 0
    if (max < min) max = min
    return { min, max }
  }, [sites])
  

  
  const setNum = (k: keyof Filters, v: string) => {
    if (!loading) {
      setFilters((f) => ({ ...f, [k]: v === "" ? undefined : Number(v) }))
    }
  }
  const setStr = (k: keyof Filters, v: string) => {
    if (!loading) {
      setFilters((f) => ({ ...f, [k]: v }))
    }
  }

  const reset = () => {
    if (!loading) {
      setFilters(defaultFilters)
    }
  }

  // Save current filters as a view
  const saveCurrentView = async () => {
    if (savingView) return
    const name = viewName.trim()
    if (!name) return
    setSavingView(true)
    try {
      const res = await fetch('/api/views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, filters }),
      })
      if (res.ok) {
        const data = await res.json()
        // refresh list
        setViews((prev) => {
          const others = prev.filter(v => !(v.name === data.view.name))
          return [data.view, ...others]
        })
        setViewName("")
      }
    } finally {
      setSavingView(false)
    }
  }

  // Apply a saved view by id
  const applyViewById = (id: string) => {
    const v = views.find(v => v.id === id)
    if (!v) return
    setApplyingViewId(id)
    // Only apply known filter keys; ignore extras
    const next: Filters = { ...defaultFilters, ...v.filters }
    setFilters(next)
    setTimeout(() => setApplyingViewId(""), 300)
  }

  // Delete a saved view
  const deleteViewById = async (id: string) => {
    try {
      const res = await fetch(`/api/views/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setViews(prev => prev.filter(v => v.id !== id))
        if (applyingViewId === id) setApplyingViewId("")
      }
    } catch {}
  }

  const toggleColumn = (columnKey: ColumnKey) => {
    if (!loading) {
      setVisibleColumns(prev => 
        prev.includes(columnKey)
          ? prev.filter(key => key !== columnKey)
          : [...prev, columnKey]
      )
      setRowLevel('custom')
    }
  }

  const resetColumns = () => {
    if (!loading) {
      setVisibleColumns(defaultVisibleColumns)
      setRowLevel(2)
    }
  }

  const showAllColumns = () => {
    if (!loading) {
      setVisibleColumns(allColumns.map(col => col.key))
      setRowLevel(4)
    }
  }

  const getColumnsByCategory = () => {
    const categories: Record<string, ColumnConfig[]> = {}
    allColumns.forEach(col => {
      if (!categories[col.category]) categories[col.category] = []
      categories[col.category].push(col)
    })
    return categories
  }

  const activeChips = useMemo(() => {
    const chips: { key: keyof Filters; label: string; value: string }[] = []
    const add = (key: keyof Filters, label: string, value?: unknown) => {
      if (value !== undefined && value !== "" && value !== null) {
        chips.push({ key, label, value: String(value) })
      }
    }
    // Website URL/Name removed
    add("niche", `Niche: ${filters.niche}`, filters.niche)
    add("language", `Lang: ${filters.language}`, filters.language)
    add("country", `Country: ${filters.country}`, filters.country)
    add("daMin", `DA ≥ ${filters.daMin}`, filters.daMin)
    add("daMax", `DA ≤ ${filters.daMax}`, filters.daMax)
    add("paMin", `PA ≥ ${filters.paMin}`, filters.paMin)
    add("paMax", `PA ≤ ${filters.paMax}`, filters.paMax)
    add("drMin", `DR ≥ ${filters.drMin}`, filters.drMin)
    add("drMax", `DR ≤ ${filters.drMax}`, filters.drMax)
    add("spamMax", `Spam ≤ ${filters.spamMax}%`, filters.spamMax)
    add("spamMin", `Spam ≥ ${filters.spamMin}%`, filters.spamMin)
    add("tool", `Tool: ${filters.tool}`, filters.tool)
    add("semrushAuthorityMin", `Semrush Auth ≥ ${filters.semrushAuthorityMin}`, filters.semrushAuthorityMin)
    add("semrushOverallTrafficMin", `Traffic ≥ ${filters.semrushOverallTrafficMin?.toLocaleString()}`, filters.semrushOverallTrafficMin)
    add("semrushOrganicTrafficMin", `Organic ≥ ${filters.semrushOrganicTrafficMin?.toLocaleString()}`, filters.semrushOrganicTrafficMin)
    // targetCountry removed
    // targetCountryPctMin retained only if needed elsewhere
    add("trend", `Trend: ${filters.trend}`, filters.trend)
    add("priceMin", `$ ≥ ${filters.priceMin}`, filters.priceMin)
    add("priceMax", `$ ≤ ${filters.priceMax}`, filters.priceMax)
    add("tatDaysMin", `TAT ≥ ${filters.tatDaysMin}`, filters.tatDaysMin)
    add("tatDaysMax", `TAT ≤ ${filters.tatDaysMax}`, filters.tatDaysMax)
    add("permanenceMinMonths", `Permanence ≥ ${filters.permanenceMinMonths}`, filters.permanenceMinMonths)
    add("permanenceMaxMonths", `Permanence ≤ ${filters.permanenceMaxMonths}`, filters.permanenceMaxMonths)
    add("backlinkNature", `Backlink: ${filters.backlinkNature}`, filters.backlinkNature)
    add("backlinksAllowedMin", `Backlinks ≥ ${filters.backlinksAllowedMin}`, filters.backlinksAllowedMin)
    add("linkPlacement", `Placement: ${filters.linkPlacement}`, filters.linkPlacement)
    add("permanence", `Permanence: ${filters.permanence}`, filters.permanence)
    add("sampleUrl", `Sample: ${filters.sampleUrl}`, filters.sampleUrl)
    add("remarkIncludes", `Remark: ${filters.remarkIncludes}`, filters.remarkIncludes)
    add("lastPublishedAfter", `Published after ${filters.lastPublishedAfter}`, filters.lastPublishedAfter)
    add("outboundLinkLimitMax", `Outbound ≤ ${filters.outboundLinkLimitMax}`, filters.outboundLinkLimitMax)
    add("guidelinesUrlIncludes", `Guidelines: ${filters.guidelinesUrlIncludes}`, filters.guidelinesUrlIncludes)
    add("disclaimerIncludes", `Disclaimer: ${filters.disclaimerIncludes}`, filters.disclaimerIncludes)
    add("availability", `Available only`, filters.availability)
    return chips
  }, [filters])

  const openFilterModal = (filterKey: keyof Filters) => {
    if (!loading) {
      if (filterKey === 'country') {
        setCountrySearch("")
      }
      setActiveFilterKey(filterKey)
      setFilterModalOpen(true)
    }
  }

  const renderColumnCell = (site: Site, columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'name':
        return (
          <div className="font-medium">
            <a
              href={site.url}
              target="_blank"
              rel="noreferrer"
              className="text-yellow-400 hover:text-yellow-300 underline underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {site.name}
            </a>
            {rowLevel !== 'custom' && rowLevel >= 2 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {site.url.replace(/^https?:\/\//, "")}
              </div>
            ) : null}
            {rowLevel !== 'custom' && rowLevel >= 3 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">Category:</span> {site.category}
              </div>
            ) : null}
            {rowLevel !== 'custom' && rowLevel >= 4 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">Language:</span> {site.language}
              </div>
            ) : null}
          </div>
        )
      case 'niche':
        return (
          <div>
            <div className="flex flex-wrap gap-1.5">
              {site.niche
                .split(',')
                .map((n) => n.trim())
                .filter(Boolean)
                .map((n, index) => (
                  <Badge
                    key={`${n}-${index}`}
                    variant="secondary"
                    className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-yellow-400/15 text-yellow-700 border border-yellow-400/30 dark:bg-yellow-400/10 dark:text-yellow-300 dark:border-yellow-400/20"
                  >
                    {n}
                  </Badge>
                ))}
            </div>
            {rowLevel !== 'custom' && rowLevel >= 3 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">Type:</span> {site.category}
              </div>
            ) : null}
            {rowLevel !== 'custom' && rowLevel >= 4 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">Country:</span> {site.country}
              </div>
            ) : null}
          </div>
        )
      case 'countryLang':
        return (
          <div>
            <span className="text-gray-700 dark:text-gray-300">
              <span>{site.country}</span>
              <span className="text-gray-400 dark:text-gray-500 mx-1">•</span>
              <span className="text-xs">{site.language}</span>
            </span>
            {rowLevel !== 'custom' && rowLevel >= 3 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">Region:</span> {site.country}
              </div>
            ) : null}
            {rowLevel !== 'custom' && rowLevel >= 4 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">Locale:</span> {site.language}
              </div>
            ) : null}
          </div>
        )
      case 'authority':
        return (
          <div>
            <span className="text-gray-700 dark:text-gray-300">{`${site.da}/${site.pa}/${site.dr}`}</span>
            {rowLevel !== 'custom' && rowLevel >= 3 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">DA:</span> {site.da}
              </div>
            ) : null}
            {rowLevel !== 'custom' && rowLevel >= 4 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">PA:</span> {site.pa} | <span className="text-gray-400 dark:text-gray-500">DR:</span> {site.dr}
              </div>
            ) : null}
          </div>
        )
      case 'spam':
        return (
          <div>
            <Badge variant="secondary" className={styles.chip}>
              {site.spamScore}%
            </Badge>
            {rowLevel !== 'custom' && rowLevel >= 3 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">Score:</span> {site.spamScore}/10
              </div>
            ) : null}
            {rowLevel !== 'custom' && rowLevel >= 4 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">Risk:</span> {site.spamScore <= 3 ? 'Low' : site.spamScore <= 6 ? 'Medium' : 'High'}
              </div>
            ) : null}
          </div>
        )
      case 'price':
        return (
          <div>
            <span className="text-gray-700 dark:text-gray-300">${site.publishing.price.toLocaleString()}</span>
            {rowLevel !== 'custom' && rowLevel >= 3 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">Base:</span> ${site.publishing.price}
              </div>
            ) : null}
            {rowLevel !== 'custom' && rowLevel >= 4 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">With Content:</span> ${site.publishing.priceWithContent}
              </div>
            ) : null}
          </div>
        )
      case 'priceWithContent':
        return (
          <div>
            <span className="text-gray-700 dark:text-gray-300">${site.publishing.priceWithContent.toLocaleString()}</span>
            {rowLevel !== 'custom' && rowLevel >= 3 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">Base:</span> ${site.publishing.price}
              </div>
            ) : null}
            {rowLevel !== 'custom' && rowLevel >= 4 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">Difference:</span> +${site.publishing.priceWithContent - site.publishing.price}
              </div>
            ) : null}
          </div>
        )
      case 'traffic':
        return (
          <div className="text-gray-700 dark:text-gray-300 text-sm">
            <div>{(site.toolScores.semrushOverallTraffic / 1000000).toFixed(1)}M</div>
            {rowLevel !== 'custom' && rowLevel >= 2 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400">overall</div>
            ) : null}
            {rowLevel !== 'custom' && rowLevel >= 3 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">Organic:</span> {(site.toolScores.semrushOrganicTraffic / 1000000).toFixed(1)}M
              </div>
            ) : null}
            {rowLevel !== 'custom' && rowLevel >= 4 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">Authority:</span> {site.toolScores.semrushAuthority}
              </div>
            ) : null}
          </div>
        )
      case 'trend':
        return (
          <div>
            <Badge variant="outline" className="capitalize text-xs">
              {site.toolScores.trafficTrend}
            </Badge>
            {rowLevel !== 'custom' && rowLevel >= 3 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">Status:</span> {site.toolScores.trafficTrend}
              </div>
            ) : null}
            {rowLevel !== 'custom' && rowLevel >= 4 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">Change:</span> {site.toolScores.trafficTrend === 'increasing' ? '↗' : site.toolScores.trafficTrend === 'decreasing' ? '↘' : '→'}
              </div>
            ) : null}
          </div>
        )
      case 'wordLimit':
        return (
          <div>
            <span className="text-gray-700 dark:text-gray-300">{site.publishing.wordLimit}</span>
            {rowLevel !== 'custom' && rowLevel >= 3 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">Min:</span> {site.publishing.wordLimit}
              </div>
            ) : null}
            {rowLevel !== 'custom' && rowLevel >= 4 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">TAT:</span> {site.publishing.tatDays}d
              </div>
            ) : null}
          </div>
        )
      case 'tat':
        return (
          <div>
            <span className="text-gray-700 dark:text-gray-300">{site.publishing.tatDays}d</span>
            {rowLevel !== 'custom' && rowLevel >= 3 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">Days:</span> {site.publishing.tatDays}
              </div>
            ) : null}
            {rowLevel !== 'custom' && rowLevel >= 4 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">Word Limit:</span> {site.publishing.wordLimit}
              </div>
            ) : null}
          </div>
        )
      case 'linkPlacement':
        return (
          <div>
            <Badge variant="outline" className="text-xs capitalize">
              {site.publishing.linkPlacement.replace('-', ' ')}
            </Badge>
            {rowLevel !== 'custom' && rowLevel >= 3 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">Type:</span> {site.publishing.linkPlacement.replace('-', ' ')}
              </div>
            ) : null}
            {rowLevel !== 'custom' && rowLevel >= 4 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">Nature:</span> {site.publishing.backlinkNature}
              </div>
            ) : null}
          </div>
        )
      case 'permanence':
        return (
          <div>
            <Badge variant="outline" className="text-xs">
              {site.publishing.permanence === 'lifetime' ? 'Lifetime' : '12m'}
            </Badge>
            {rowLevel !== 'custom' && rowLevel >= 3 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">Duration:</span> {site.publishing.permanence === 'lifetime' ? 'Lifetime' : '12 months'}
              </div>
            ) : null}
            {rowLevel !== 'custom' && rowLevel >= 4 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">Backlinks:</span> {site.publishing.backlinksAllowed}
              </div>
            ) : null}
          </div>
        )
      case 'availability':
        return (
          <div>
            <div className="flex items-center justify-center">
              {site.additional.availability ? (
                <div className="w-2 h-2 bg-[#FDC800] rounded-full" title="Available" />
              ) : (
                <div className="text-xs text-red-400">Unavailable</div>
              )}
            </div>
            {rowLevel !== 'custom' && rowLevel >= 3 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">Status:</span> {site.additional.availability ? 'Available' : 'Unavailable'}
              </div>
            ) : null}
            {rowLevel !== 'custom' && rowLevel >= 4 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-gray-400 dark:text-gray-500">Last Published:</span> {site.quality.lastPublished}
              </div>
            ) : null}
          </div>
        )
      case 'cart':
        return (
          <div className="flex items-center justify-center">
            <Button
              size="sm"
              variant={isItemInCart(site.id) ? "default" : "outline"}
              onClick={(e) => {
                e.stopPropagation()
                addItem(site)
              }}
              className={cn(
                "h-8 px-3 text-xs font-medium transition-all duration-200",
                isItemInCart(site.id) 
                  ? "bg-[#FDC800] hover:bg-[#F2C86C] text-black border-[#FDC800]" 
                  : "border-[#F2C86C] text-[#986220] hover:border-[#FDC800] hover:bg-[#FEFCE9] hover:text-[#986220]"
              )}
            >
              {isItemInCart(site.id) ? "In Cart" : "Add to Cart"}
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  const renderFilterModal = () => {
    if (!activeFilterKey) return null
    
    const pebble = filterPebbles.find(p => p.key === activeFilterKey)
    if (!pebble) return null

    const currentValue = filters[activeFilterKey]
    const hasValue = currentValue !== undefined && currentValue !== "" && currentValue !== null

    return (
      <Dialog open={filterModalOpen} onOpenChange={(open) => !loading && setFilterModalOpen(open)}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {pebble.icon}
              {pebble.label}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {hasValue 
                ? `Edit your ${pebble.label.toLowerCase()} filter` 
                : `Configure your ${pebble.label.toLowerCase()} filter`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {renderFilterContent(activeFilterKey)}
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setFilterModalOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button 
              className={styles.chip}
              onClick={() => setFilterModalOpen(false)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin mr-1" />
                  Loading...
                </>
              ) : (
                hasValue ? "Update Filter" : "Apply Filter"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const renderFilterContent = (filterKey: keyof Filters) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !loading) {
        setFilterModalOpen(false)
      }
    }

    switch (filterKey) {
      case "country":
        return (
          <div onKeyDown={handleKeyDown}>
            <Select
              value={filters.country || ""}
              onValueChange={(val) => {
                if (loading) return
                const next = val === "__ALL__" ? "" : val
                setFilters((f) => ({ ...f, country: next }))
              }}
              disabled={loading}
            >
              <SelectTrigger className={styles.select}>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className={cn(styles.menu, "p-0 max-h-72 overflow-hidden") }>
                <div className="sticky top-0 z-10 bg-white dark:bg-neutral-900 p-2 border-b border-slate-200 dark:border-neutral-800">
                  <Input
                    className={styles.field}
                    placeholder="Search countries"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                  />
                </div>
                <SelectItem value="__ALL__">All countries</SelectItem>
                {(() => {
                  const list = (allCountries.length ? allCountries : availableCountries)
                    .filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()))
                  if (list.length === 0) {
                    return (
                      <div className="px-3 py-2 text-sm text-slate-500 dark:text-neutral-400">No countries found</div>
                    )
                  }
                  return list.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))
                })()}
              </SelectContent>
            </Select>
          </div>
        )

      case "priceMin": {
        const minVal = filters.priceMin ?? priceBounds.min
        const maxVal = filters.priceMax ?? priceBounds.max
        const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))
        return (
          <div className="space-y-3" onKeyDown={handleKeyDown}>
            <div className="text-sm text-slate-600 dark:text-neutral-300">Select price range</div>
            <div className="px-1">
              <Slider
                min={priceBounds.min}
                max={priceBounds.max}
                value={[minVal, maxVal]}
                onValueChange={([lo, hi]) => {
                  if (loading) return
                  setFilters((f) => ({ ...f, priceMin: lo, priceMax: hi }))
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                className={styles.field}
                type="number"
                placeholder="Min"
                value={minVal}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (Number.isNaN(v)) return
                  const clamped = clamp(v, priceBounds.min, (filters.priceMax ?? priceBounds.max))
                  setFilters((f) => ({ ...f, priceMin: clamped }))
                }}
                disabled={loading}
              />
              <Input
                className={styles.field}
                type="number"
                placeholder="Max"
                value={maxVal}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (Number.isNaN(v)) return
                  const clamped = clamp(v, (filters.priceMin ?? priceBounds.min), priceBounds.max)
                  setFilters((f) => ({ ...f, priceMax: clamped }))
                }}
                disabled={loading}
              />
            </div>
          </div>
        )
      }

      case "daMin":
      case "daMax": {
        const minVal = filters.daMin ?? daBounds.min
        const maxVal = filters.daMax ?? daBounds.max
        const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))
        return (
          <div className="space-y-3" onKeyDown={handleKeyDown}>
            <div className="text-sm text-slate-600 dark:text-neutral-300">Select domain authority range</div>
            <div className="px-1">
              <Slider
                min={daBounds.min}
                max={daBounds.max}
                value={[minVal, maxVal]}
                onValueChange={([lo, hi]) => {
                  if (loading) return
                  setFilters((f) => ({ ...f, daMin: lo, daMax: hi }))
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                className={styles.field}
                type="number"
                placeholder="Min"
                value={minVal}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (Number.isNaN(v)) return
                  const clamped = clamp(v, daBounds.min, (filters.daMax ?? daBounds.max))
                  setFilters((f) => ({ ...f, daMin: clamped }))
                }}
                disabled={loading}
              />
              <Input
                className={styles.field}
                type="number"
                placeholder="Max"
                value={maxVal}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (Number.isNaN(v)) return
                  const clamped = clamp(v, (filters.daMin ?? daBounds.min), daBounds.max)
                  setFilters((f) => ({ ...f, daMax: clamped }))
                }}
                disabled={loading}
              />
            </div>
          </div>
        )
      }

      case "paMin":
      case "paMax": {
        const minVal = filters.paMin ?? paBounds.min
        const maxVal = filters.paMax ?? paBounds.max
        const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))
        return (
          <div className="space-y-3" onKeyDown={handleKeyDown}>
            <div className="text-sm text-slate-600 dark:text-neutral-300">Select page authority range</div>
            <div className="px-1">
              <Slider
                min={paBounds.min}
                max={paBounds.max}
                value={[minVal, maxVal]}
                onValueChange={([lo, hi]) => {
                  if (loading) return
                  setFilters((f) => ({ ...f, paMin: lo, paMax: hi }))
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                className={styles.field}
                type="number"
                placeholder="Min"
                value={minVal}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (Number.isNaN(v)) return
                  const clamped = clamp(v, paBounds.min, (filters.paMax ?? paBounds.max))
                  setFilters((f) => ({ ...f, paMin: clamped }))
                }}
                disabled={loading}
              />
              <Input
                className={styles.field}
                type="number"
                placeholder="Max"
                value={maxVal}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (Number.isNaN(v)) return
                  const clamped = clamp(v, (filters.paMin ?? paBounds.min), paBounds.max)
                  setFilters((f) => ({ ...f, paMax: clamped }))
                }}
                disabled={loading}
              />
            </div>
          </div>
        )
      }

      case "drMin":
      case "drMax": {
        const minVal = filters.drMin ?? drBounds.min
        const maxVal = filters.drMax ?? drBounds.max
        const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))
        return (
          <div className="space-y-3" onKeyDown={handleKeyDown}>
            <div className="text-sm text-slate-600 dark:text-neutral-300">Select domain rating range</div>
            <div className="px-1">
              <Slider
                min={drBounds.min}
                max={drBounds.max}
                value={[minVal, maxVal]}
                onValueChange={([lo, hi]) => {
                  if (loading) return
                  setFilters((f) => ({ ...f, drMin: lo, drMax: hi }))
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                className={styles.field}
                type="number"
                placeholder="Min"
                value={minVal}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (Number.isNaN(v)) return
                  const clamped = clamp(v, drBounds.min, (filters.drMax ?? drBounds.max))
                  setFilters((f) => ({ ...f, drMin: clamped }))
                }}
                disabled={loading}
              />
              <Input
                className={styles.field}
                type="number"
                placeholder="Max"
                value={maxVal}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (Number.isNaN(v)) return
                  const clamped = clamp(v, (filters.drMin ?? drBounds.min), drBounds.max)
                  setFilters((f) => ({ ...f, drMax: clamped }))
                }}
                disabled={loading}
              />
            </div>
          </div>
        )
      }

      case "spamMin":
      case "spamMax": {
        const minVal = filters.spamMin ?? spamBounds.min
        const maxVal = filters.spamMax ?? spamBounds.max
        const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))
        return (
          <div className="space-y-3" onKeyDown={handleKeyDown}>
            <div className="text-sm text-slate-600 dark:text-neutral-300">Select spam score range</div>
            <div className="px-1">
              <Slider
                min={spamBounds.min}
                max={spamBounds.max}
                value={[minVal, maxVal]}
                onValueChange={([lo, hi]) => {
                  if (loading) return
                  setFilters((f) => ({ ...f, spamMin: lo, spamMax: hi }))
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                className={styles.field}
                type="number"
                placeholder="Min"
                value={minVal}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (Number.isNaN(v)) return
                  const clamped = clamp(v, spamBounds.min, (filters.spamMax ?? spamBounds.max))
                  setFilters((f) => ({ ...f, spamMin: clamped }))
                }}
                disabled={loading}
              />
              <Input
                className={styles.field}
                type="number"
                placeholder="Max"
                value={maxVal}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (Number.isNaN(v)) return
                  const clamped = clamp(v, (filters.spamMin ?? spamBounds.min), spamBounds.max)
                  setFilters((f) => ({ ...f, spamMax: clamped }))
                }}
                disabled={loading}
              />
            </div>
          </div>
        )
      }


      case "language":
        return (
          <div onKeyDown={handleKeyDown}>
            <Select
              value={filters.language || ""}
              onValueChange={(val) => {
                if (loading) return
                const next = val === "__ALL__" ? "" : val
                setFilters((f) => ({ ...f, language: next }))
              }}
              disabled={loading}
            >
              <SelectTrigger className={styles.select}>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className={cn(styles.menu, "p-0 max-h-72 overflow-hidden")}>
                <div className="sticky top-0 z-10 bg-white dark:bg-neutral-900 p-2 border-b border-slate-200 dark:border-neutral-800">
                  <Input
                    className={styles.field}
                    placeholder="Search languages"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                  />
                </div>
                <SelectItem value="__ALL__">All languages</SelectItem>
                {(() => {
                  const list = POPULAR_LANGUAGES
                    .filter(l => l.toLowerCase().includes(countrySearch.toLowerCase()))
                  if (list.length === 0) {
                    return (
                      <div className="px-3 py-2 text-sm text-slate-500 dark:text-neutral-400">No languages found</div>
                    )
                  }
                  return list.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))
                })()}
              </SelectContent>
            </Select>
          </div>
        )
      
      case "niche":
        return (
          <div className="space-y-2" onKeyDown={handleKeyDown}>
            <div className="relative">
              <Input
                className={styles.field}
                placeholder="Enter niche or select from suggestions"
                value={filters.niche || ""}
                onChange={(e) => {
                  setStr("niche", e.target.value)
                  setNicheSearch(e.target.value)
                  setShowNicheSuggestions(e.target.value.length > 0)
                }}
                onFocus={() => setShowNicheSuggestions(true)}
                onBlur={() => setTimeout(() => setShowNicheSuggestions(false), 200)}
                disabled={loading}
              />
              {showNicheSuggestions && nicheSearch && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {loadingCategories ? (
                    <div className="flex items-center justify-center px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Loading recommendations...
                    </div>
                  ) : categoryError ? (
                    <div className="px-3 py-2 text-sm text-red-500 dark:text-red-400">
                      Error: {categoryError}
                    </div>
                  ) : categoryRecommendations.length > 0 ? (
                    categoryRecommendations.map((recommendation) => (
                      <button
                        key={recommendation.category}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white flex items-center justify-between"
                        onClick={() => {
                          setStr("niche", recommendation.category)
                          setNicheSearch(recommendation.category)
                          setShowNicheSuggestions(false)
                        }}
                      >
                        <span>{recommendation.category}</span>
                        {recommendation.count && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            ({recommendation.count})
                          </span>
                        )}
                      </button>
                    ))
                  ) : nicheSearch.length >= 2 ? (
                    <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                      No recommendations found for "{nicheSearch}"
                    </div>
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                      Type at least 2 characters to see recommendations
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Start typing to see AI-powered niche recommendations
            </div>
          </div>
        )
      
      case "sampleUrl":
      case "remarkIncludes":
      case "guidelinesUrlIncludes":
      case "disclaimerIncludes":
        return (
          <Input
            className={styles.field}
            placeholder={`Enter ${filterKey.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
            value={filters[filterKey] as string || ""}
            onChange={(e) => setStr(filterKey, e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
        )
      
      
      case "priceMax":
      case "semrushAuthorityMin":
      case "semrushOverallTrafficMin":
      case "semrushOrganicTrafficMin":
      case "targetCountryPctMin":
      case "tatDaysMin":
      case "tatDaysMax":
      case "permanenceMinMonths":
      case "permanenceMaxMonths":
      case "backlinksAllowedMin":
      case "outboundLinkLimitMax":
        return (
          <Input
            className={styles.field}
            type="number"
            placeholder={`Enter ${filterKey.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
            value={filters[filterKey] as number || ""}
            onChange={(e) => setNum(filterKey, e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
        )
      
      case "tool":
        return (
          <div onKeyDown={handleKeyDown}>
            <Select
              value={filters.tool || ""}
              onValueChange={(val) => !loading && setFilters((f) => ({ ...f, tool: val as Filters["tool"] }))}
              disabled={loading}
            >
              <SelectTrigger className={styles.select}>
                <SelectValue placeholder="Select SEO tool" />
              </SelectTrigger>
              <SelectContent className={styles.menu}>
                <SelectItem value="Semrush">Semrush</SelectItem>
                <SelectItem value="Ahrefs">Ahrefs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )
      
      case "trend":
        return (
          <div onKeyDown={handleKeyDown}>
            <Select 
              value={filters.trend || ""} 
              onValueChange={(val) => !loading && setFilters((f) => ({ ...f, trend: val as Trend }))}
              disabled={loading}
            >
              <SelectTrigger className={styles.select}>
                <SelectValue placeholder="Select traffic trend" />
              </SelectTrigger>
              <SelectContent className={styles.menu}>
                <SelectItem value="increasing">Increasing</SelectItem>
                <SelectItem value="stable">Stable</SelectItem>
                <SelectItem value="decreasing">Decreasing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )
      
      case "backlinkNature":
        return (
          <div onKeyDown={handleKeyDown}>
            <Select
              value={filters.backlinkNature || ""}
              onValueChange={(val) => !loading && setFilters((f) => ({ ...f, backlinkNature: val as BacklinkNature }))}
              disabled={loading}
            >
              <SelectTrigger className={styles.select}>
                <SelectValue placeholder="Select backlink nature" />
              </SelectTrigger>
              <SelectContent className={styles.menu}>
                <SelectItem value="do-follow">Do-Follow</SelectItem>
                <SelectItem value="no-follow">No-Follow</SelectItem>
                <SelectItem value="sponsored">Sponsored</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )
      
      case "linkPlacement":
        return (
          <div onKeyDown={handleKeyDown}>
            <Select
              value={filters.linkPlacement || ""}
              onValueChange={(val) => !loading && setFilters((f) => ({ ...f, linkPlacement: val as LinkPlacement }))}
              disabled={loading}
            >
              <SelectTrigger className={styles.select}>
                <SelectValue placeholder="Select link placement" />
              </SelectTrigger>
              <SelectContent className={styles.menu}>
                <SelectItem value="in-content">In-content</SelectItem>
                <SelectItem value="author-bio">Author Bio</SelectItem>
                <SelectItem value="footer">Footer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )
      
      case "permanence":
        return (
          <div onKeyDown={handleKeyDown}>
            <Select
              value={filters.permanence || ""}
              onValueChange={(val) => !loading && setFilters((f) => ({ ...f, permanence: val as "lifetime" | "12-months" }))}
              disabled={loading}
            >
              <SelectTrigger className={styles.select}>
                <SelectValue placeholder="Select permanence" />
              </SelectTrigger>
              <SelectContent className={styles.menu}>
                <SelectItem value="lifetime">Lifetime</SelectItem>
                <SelectItem value="12-months">12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )
      
      case "lastPublishedAfter":
        return (
          <Input
            className={styles.field}
            type="date"
            value={filters.lastPublishedAfter || ""}
            onChange={(e) => setStr("lastPublishedAfter", e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
        )
      
      case "availability":
        return (
          <div className="flex items-center justify-between rounded-md p-3 border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/40" onKeyDown={handleKeyDown}>
            <div>
              <Label className="text-sm text-slate-900 dark:text-white">Show only available publishers</Label>
            </div>
            <Switch
              checked={filters.availability ?? false}
              onCheckedChange={(v) => !loading && setFilters((f) => ({ ...f, availability: v }))}
              disabled={loading}
              className="data-[state=checked]:bg-yellow-400"
            />
          </div>
        )
      
      default:
        return <div className="text-slate-600 dark:text-neutral-400">Filter configuration not available</div>
    }
  }

  const groupedPebbles = useMemo(() => {
    const groups: Record<string, FilterPebble[]> = {}
    filterPebbles.forEach(pebble => {
      if (!groups[pebble.category]) groups[pebble.category] = []
      groups[pebble.category].push(pebble)
    })
    return groups
  }, [])

  const categoryIcons = {
    basic: <FileStack className="w-4 h-4" />,
    authority: <Fingerprint className="w-4 h-4" />,
    traffic: <Cpu className="w-4 h-4" />,
    publishing: <ReceiptText className="w-4 h-4" />,
    quality: <History className="w-4 h-4" />,
    additional: <CircleEllipsis className="w-4 h-4" />
  }

  const categoryLabels = {
    basic: "Basic Info",
    authority: "Authority & SEO",
    traffic: "Traffic & Performance", 
    publishing: "Publishing Details",
    quality: "Quality & History",
    additional: "Additional Info"
  }
  const levelLabels: Record<Exclude<RowLevel, 'custom'>, string> = { 1: 'Short', 2: 'Medium', 3: 'Tall', 4: 'Extra Tall' }

  return (
    <div className={cn(styles.surface, "min-h-[100dvh]")}>
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        
        {/* Compact Filter Pebbles Section */}
        <Card className={cn(styles.panel, "p-4")}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>
            <div className="flex items-center gap-2">
              {/* Saved Views Controls */}
              <div className="hidden md:flex items-center gap-2">
                <Select
                  value={applyingViewId}
                  onValueChange={(val) => applyViewById(val)}
                  disabled={loading}
                >
                  <SelectTrigger className={cn(styles.select, "h-7 w-48 text-xs")}> 
                    <SelectValue placeholder={views.length ? "Apply saved view" : "No saved views"} />
                  </SelectTrigger>
                  <SelectContent className={styles.menu}>
                    {views.map(v => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {applyingViewId && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => deleteViewById(applyingViewId)}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Input
                  className={cn(styles.field, "h-7 text-xs w-36")}
                  placeholder="Save as view..."
                  value={viewName}
                  onChange={(e) => setViewName(e.target.value)}
                  disabled={loading || savingView}
                />
                <Button 
                  variant="secondary" 
                  onClick={saveCurrentView} 
                  disabled={loading || savingView || !viewName.trim()}
                  className="h-7 text-xs"
                >
                  {savingView ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
                </Button>
              </div>
              <Button 
                variant="outline" 
                onClick={() => fetchData(convertFiltersToAPI(filters))} 
                disabled={loading}
                className="h-7 text-xs"
              >
                {loading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                Refresh
              </Button>
              <Button variant="secondary" onClick={reset} className="h-7 text-xs">
                Reset All
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            {Object.entries(groupedPebbles).map(([category, pebbles]) => (
              <div key={category} className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  {categoryIcons[category as keyof typeof categoryIcons]}
                  <span className="font-medium">
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {pebbles.map((pebble) => {
                    const hasValue = filters[pebble.key] !== undefined && 
                                   filters[pebble.key] !== "" && 
                                   filters[pebble.key] !== null
                    
                    return (
                      <div key={pebble.key} className="relative group">
                        <button
                          onClick={() => openFilterModal(pebble.key)}
                          disabled={loading}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border transition-all duration-200 hover:scale-105",
                            hasValue 
                              ? "bg-yellow-400 text-gray-900 border-yellow-400 shadow-md" 
                              : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-600",
                            loading && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {pebble.icon}
                          <span>{pebble.label}</span>
                          {hasValue && <Plus className="w-3 h-3 rotate-45" />}
                          {loading && <Loader2 className="w-3 h-3 animate-spin ml-1" />}
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 w-64 shadow-lg">
                          <div className="font-medium mb-1">{pebble.label}</div>
                          <div className="text-gray-300 text-xs leading-relaxed">{pebble.tooltip}</div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Active Filters Chips */}
        {activeChips.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <Filter className="w-4 h-4" />
                <span className="font-medium">Active Filters ({activeChips.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Input
                    className={cn(styles.field, "h-8 pr-8 text-xs w-60")}
                    placeholder="Search by website name or URL"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={loading}
                  />
                  {searchQuery && (
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={reset}
                  disabled={loading}
                  className="h-7 text-xs border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {loading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                  Clear All
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeChips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => openFilterModal(chip.key)}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs bg-yellow-400 text-gray-900 border border-yellow-400 hover:bg-yellow-300 transition-all duration-200 hover:scale-105 cursor-pointer group shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  title={`Click to edit ${chip.label}`}
                >
                  <span className="font-medium">{chip.label}</span>
                  <span 
                    onClick={(e) => {
                      e.stopPropagation()
                      if (loading) return
                      setFilters((f) => {
                        const val = f[chip.key]
                        let reset: any = ""
                        if (typeof val === "boolean") reset = undefined
                        else if (typeof val === "number") reset = undefined
                        else reset = ""
                        return { ...f, [chip.key]: reset }
                      })
                    }}
                    role="button"
                    aria-label="Remove filter"
                    className="rounded-full p-0.5 hover:bg-red-500 hover:text-white transition-colors opacity-70 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove filter"
                  >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Section */}
        <section className="space-y-4">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
                <span className="font-medium">Error</span>
              </div>
              <p className="text-red-700 dark:text-red-300 mt-1">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchData(convertFiltersToAPI(filters))}
                className="mt-2 border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
              >
                Try Again
              </Button>
            </div>
          )}
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading...
                  </div>
                ) : (
                  `${results.length} ${results.length === 1 ? "Result" : "Results"}`
                )}
              </h2>
              {lastFetched && !loading && (
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Last updated: {lastFetched.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Row height/detail control */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={loading}
                    className="h-7 border-slate-300 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800 disabled:opacity-50"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {rowLevel === 'custom' ? 'Rows: Custom' : `Rows: ${levelLabels[rowLevel]}`}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-700" align="end">
                  <div className="space-y-1">
                    {([1,2,3,4] as const).map((lvl) => (
                      <button
                        key={lvl}
                        className={cn(
                          'w-full text-left px-3 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-neutral-800 text-sm text-slate-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed',
                          rowLevel === lvl && 'bg-slate-100 dark:bg-neutral-800'
                        )}
                        onClick={() => applyRowLevel(lvl)}
                        disabled={loading}
                      >
                        {levelLabels[lvl]}
                        <span className="ml-2 text-xs text-slate-500 dark:text-neutral-400">{rowLevelPresets[lvl].length} fields</span>
                      </button>
                    ))}
                    {rowLevel === 'custom' ? (
                      <div className="text-xs text-slate-500 dark:text-neutral-500 px-3 pt-2">Custom: adjusted via column toggles</div>
                    ) : null}
                  </div>
                </PopoverContent>
              </Popover>
              {/* Column Visibility Control */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={loading}
                    className="h-8 border-slate-300 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800 disabled:opacity-50"
                  >
                    <Columns3 className="w-4 h-4 mr-2" />
                    Columns ({visibleColumns.length})
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-700" align="end">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-slate-900 dark:text-white">Manage Columns</h4>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={resetColumns}
                          disabled={loading}
                          className="h-6 text-xs text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-50"
                        >
                          Reset
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={showAllColumns}
                          disabled={loading}
                          className="h-6 text-xs text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-50"
                        >
                          Show All
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2.5 max-h-80 overflow-y-auto">
                      {Object.entries(getColumnsByCategory()).map(([category, columns]) => (
                        <div key={category} className="space-y-1.5">
                          <div className="text-xs font-medium text-slate-500 dark:text-neutral-400 uppercase tracking-wide">
                            {category.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="space-y-1">
                            {columns.map((column) => (
                              <div 
                                key={column.key} 
                                className="flex items-center space-x-2 p-1 rounded hover:bg-slate-100 dark:hover:bg-neutral-800/50"
                              >
                                <Checkbox
                                  id={column.key}
                                  checked={visibleColumns.includes(column.key)}
                                  onCheckedChange={() => toggleColumn(column.key)}
                                  disabled={loading}
                                  className="data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400 disabled:opacity-50"
                                />
                                <label 
                                  htmlFor={column.key}
                                  className="text-sm text-slate-700 dark:text-neutral-300 cursor-pointer flex-1"
                                >
                                  {column.label}
                                </label>
                                {visibleColumns.includes(column.key) ? (
                                  <Eye className="w-3 h-3 text-green-500" />
                                ) : (
                                  <EyeOff className="w-3 h-3 text-slate-400 dark:text-neutral-500" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              {/* Sort Control */}
              <div className="flex items-center gap-2">
                <Label className="text-sm text-slate-600 dark:text-neutral-300">Sort by</Label>
                <Select 
                value={sortBy} 
                onValueChange={(value) => !loading && setSortBy(value)} 
                disabled={loading}
              >
                  <SelectTrigger className={cn(styles.select, "h-8 w-48")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={styles.menu}>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="nameAsc">Name: A → Z</SelectItem>
                    <SelectItem value="priceLow">Price: Low → High</SelectItem>
                    <SelectItem value="authorityHigh">Authority: High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Loading data...</span>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow className="border-gray-200 dark:border-gray-800">
                      {visibleColumns.map(columnKey => {
                        const column = allColumns.find(col => col.key === columnKey)
                        return (
                          <TableHead key={columnKey} className="text-gray-600 dark:text-gray-300 whitespace-nowrap text-xs sm:text-sm">
                            {column?.label}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={visibleColumns.length} className="text-center py-8 text-gray-500 dark:text-gray-400">
                          No results found. Try adjusting your filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      results.map((site) => (
                        <TableRow
                          key={site.id}
                          className={cn(
                            "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer",
                            rowLevel !== 'custom' ? rowPaddingByLevel[rowLevel] : '',
                            loading && "opacity-50 cursor-not-allowed"
                          )}
                          onClick={() => {
                            if (!loading) {
                              setSelectedSite(site)
                              setDetailsOpen(true)
                            }
                          }}
                        >
                          {visibleColumns.map(columnKey => {
                            const isNiche = columnKey === 'niche'
                            return (
                              <TableCell 
                                key={columnKey} 
                                className={cn(
                                  isNiche ? 'max-w-[200px] sm:max-w-[320px] whitespace-normal break-words' : 'whitespace-nowrap',
                                  rowLevel !== 'custom' ? rowPaddingByLevel[rowLevel] : '',
                                  'text-xs sm:text-sm'
                                )}
                              >
                                {renderColumnCell(site, columnKey)}
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          
          {/* Column visibility info */}
          {visibleColumns.length !== allColumns.length && (
            <div className="text-xs text-gray-500 dark:text-gray-500 text-center">
              Showing {visibleColumns.length} of {allColumns.length} available columns
            </div>
          )}
        </section>
      </div>

      {/* Filter Modal */}
      {renderFilterModal()}

      {/* Site Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={(open) => !loading && setDetailsOpen(open)}>
        <DialogContent className="w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] max-h-[95vh] flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 p-0">
          {/* Fixed Header */}
          <DialogHeader className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg sm:text-xl font-semibold truncate">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading...
                    </div>
                  ) : (
                    selectedSite?.name
                  )}
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1 truncate">
                  {selectedSite?.url}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Loading site details...</span>
                </div>
              </div>
            ) : selectedSite ? (
              <SiteDetails site={selectedSite} />
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No site selected</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Helper Components
function SiteDetails({ site }: { site: Site }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoCard title="Basic Information">
          <InfoItem label="URL" value={site.url} />
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-500 dark:text-neutral-400 flex-shrink-0">Niche</span>
            <div className="flex flex-wrap gap-1.5 justify-end ml-2">
              {site.niche
                .split(',')
                .map((n) => n.trim())
                .filter(Boolean)
                .map((n, index) => (
                  <Badge
                    key={`${n}-${index}`}
                    variant="secondary"
                    className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-yellow-400/15 text-yellow-700 border border-yellow-400/30 dark:bg-yellow-400/10 dark:text-yellow-300 dark:border-yellow-400/20"
                  >
                    {n}
                  </Badge>
                ))}
            </div>
          </div>
          <InfoItem label="Category" value={site.category} />
          <InfoItem label="Language" value={site.language} />
          <InfoItem label="Country" value={site.country} />
        </InfoCard>

        <InfoCard title="Authority Metrics">
          <InfoItem label="Domain Authority" value={`${site.da}`} />
          <InfoItem label="Page Authority" value={`${site.pa}`} />
          <InfoItem label="Domain Rating" value={`${site.dr}`} />
          <InfoItem label="Spam Score" value={`${site.spamScore}%`} />
        </InfoCard>

        <InfoCard title="Traffic Data">
          <InfoItem label="Semrush Authority" value={`${site.toolScores.semrushAuthority}`} />
          <InfoItem label="Overall Traffic" value={site.toolScores.semrushOverallTraffic.toLocaleString()} />
          <InfoItem label="Organic Traffic" value={site.toolScores.semrushOrganicTraffic.toLocaleString()} />
          <InfoItem label="Traffic Trend" value={site.toolScores.trafficTrend} />
        </InfoCard>

        <InfoCard title="Publishing Details">
          <InfoItem label="Price" value={`${site.publishing.price.toLocaleString()}`} />
          <InfoItem label="Price with Content" value={`${site.publishing.priceWithContent.toLocaleString()}`} />
          <InfoItem label="Word Limit" value={`${site.publishing.wordLimit}`} />
          <InfoItem label="TAT Days" value={`${site.publishing.tatDays}`} />
          <InfoItem label="Backlink Nature" value={site.publishing.backlinkNature} />
          <InfoItem label="Link Placement" value={site.publishing.linkPlacement} />
          <InfoItem label="Permanence" value={site.publishing.permanence} />
        </InfoCard>

        <InfoCard title="Quality Metrics">
          <InfoItem label="Sample URL" value={site.quality.sampleUrl || "N/A"} />
          <InfoItem label="Last Published" value={site.quality.lastPublished} />
          <InfoItem label="Outbound Link Limit" value={`${site.quality.outboundLinkLimit}`} />
          <InfoItem label="Guidelines URL" value={site.quality.guidelinesUrl || "N/A"} />
        </InfoCard>

        <InfoCard title="Additional Info">
          <InfoItem label="Disclaimer" value={site.additional.disclaimer || "N/A"} />
          <InfoItem label="Availability" value={site.additional.availability ? "Available" : "Not Available"} />
          <InfoItem label="Remark" value={site.quality.remark || "N/A"} />
        </InfoCard>
      </div>
      <div className="flex items-center justify-center sm:justify-end">
        <Button
          className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 w-full sm:w-auto"
          onClick={() => {
            const params = new URLSearchParams()
            params.set('siteId', site.id)
            params.set('siteName', site.name)
            params.set('priceCents', String(Math.round(site.publishing.price * 100)))
            // if user toggles with-content pricing elsewhere, we can forward it; default 0
            // params.set('withContent', '1')
            window.location.href = `/checkout?${params.toString()}`
          }}
        >
          Order This Site
        </Button>
      </div>
    </div>
  )
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {children}
      </CardContent>
    </Card>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0">
      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">{label}</span>
      <span className="text-xs text-gray-900 dark:text-white sm:text-right break-words">{value}</span>
    </div>
  )
}

// Filter function - works with the Site type
function applyFilters(list: Site[], f: Filters) {
  return list.filter((s) => {
    const inStr = (a: string, b: string) => a.toLowerCase().includes(b.toLowerCase())
    if (f.niche && !inStr(s.niche, f.niche)) return false
    if (f.language && s.language.toLowerCase() !== f.language.toLowerCase()) return false
    if (f.country && s.country.toLowerCase() !== f.country.toLowerCase()) return false
    if (f.daMin !== undefined && s.da < f.daMin) return false
    if (f.daMax !== undefined && s.da > f.daMax) return false
    if (f.paMin !== undefined && s.pa < f.paMin) return false
    if (f.paMax !== undefined && s.pa > f.paMax) return false
    if (f.drMin !== undefined && s.dr < f.drMin) return false
    if (f.drMax !== undefined && s.dr > f.drMax) return false
    if (f.spamMin !== undefined && s.spamScore < f.spamMin) return false
    if (f.spamMax !== undefined && s.spamScore > f.spamMax) return false
    if (f.semrushAuthorityMin !== undefined && s.toolScores.semrushAuthority < f.semrushAuthorityMin) return false
    if (f.semrushOverallTrafficMin !== undefined && s.toolScores.semrushOverallTraffic < f.semrushOverallTrafficMin) return false
    if (f.semrushOrganicTrafficMin !== undefined && s.toolScores.semrushOrganicTraffic < f.semrushOrganicTrafficMin) return false
    if (f.priceMin !== undefined && s.publishing.price < f.priceMin) return false
    if (f.priceMax !== undefined && s.publishing.price > f.priceMax) return false
    if (f.tatDaysMin !== undefined && s.publishing.tatDays < f.tatDaysMin) return false
    if (f.tatDaysMax !== undefined && s.publishing.tatDays > f.tatDaysMax) return false
    if (f.backlinksAllowedMin !== undefined && s.publishing.backlinksAllowed < f.backlinksAllowedMin) return false
    if (f.outboundLinkLimitMax !== undefined && s.quality.outboundLinkLimit > f.outboundLinkLimitMax) return false
    if (f.trend && s.toolScores.trafficTrend !== f.trend) return false
    if (f.backlinkNature && s.publishing.backlinkNature !== f.backlinkNature) return false
    if (f.linkPlacement && s.publishing.linkPlacement !== f.linkPlacement) return false
    if (f.permanence && s.publishing.permanence !== f.permanence) return false
    if (f.sampleUrl && s.quality.sampleUrl && !inStr(s.quality.sampleUrl, f.sampleUrl)) return false
    if (f.remarkIncludes && s.quality.remark && !inStr(s.quality.remark, f.remarkIncludes)) return false
    if (f.guidelinesUrlIncludes && s.quality.guidelinesUrl && !inStr(s.quality.guidelinesUrl, f.guidelinesUrlIncludes)) return false
    if (f.disclaimerIncludes && s.additional.disclaimer && !inStr(s.additional.disclaimer, f.disclaimerIncludes)) return false
    if (f.lastPublishedAfter && new Date(s.quality.lastPublished) < new Date(f.lastPublishedAfter)) return false
    if (typeof f.availability === "boolean" && s.additional.availability !== f.availability) return false
    return true
  })
}