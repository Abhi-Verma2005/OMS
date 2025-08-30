"use client"

import type { ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { useEffect, useMemo, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
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
  Filter
} from "lucide-react"

// Import types and data from sample-sites
import type { Site } from "@/lib/sample-sites"
import sites from "@/lib/sample-sites"

type Trend = "increasing" | "decreasing" | "stable"
type BacklinkNature = "do-follow" | "no-follow" | "sponsored"
type LinkPlacement = "in-content" | "author-bio" | "footer"

type Filters = {
  websiteUrl: string
  websiteName: string
  niche: string
  category: string
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
  tool?: "Semrush" | "Ahrefs" | "SimilarWeb"
  semrushAuthorityMin?: number
  semrushOverallTrafficMin?: number
  semrushOrganicTrafficMin?: number
  targetCountry?: string
  targetCountryPctMin?: number
  trend?: Trend
  priceMin?: number
  priceMax?: number
  priceWithContentMin?: number
  priceWithContentMax?: number
  wordLimitMin?: number
  wordLimitMax?: number
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





const defaultFilters: Filters = {
  websiteUrl: "",
  websiteName: "",
  niche: "",
  category: "",
  language: "",
  country: "",
}

const styles = {
  surface: "bg-neutral-950 text-white",
  panel: "bg-neutral-900 text-white border border-neutral-800",
  field: "bg-neutral-800 text-white placeholder:text-neutral-400 border border-neutral-700 focus-visible:ring-2 focus-visible:ring-yellow-500",
  select: "bg-neutral-800 text-white border border-neutral-700",
  menu: "bg-neutral-900 text-white border border-neutral-700",
  chip: "bg-yellow-500 text-black",
}

type FilterPebble = {
  key: keyof Filters
  label: string
  icon: ReactNode
  category: "basic" | "authority" | "traffic" | "publishing" | "quality" | "additional"
}

const filterPebbles: FilterPebble[] = [
  // Basic
  { key: "websiteUrl", label: "Website URL", icon: <FileStack className="w-3 h-3" />, category: "basic" },
  { key: "websiteName", label: "Website Name", icon: <FileStack className="w-3 h-3" />, category: "basic" },
  { key: "niche", label: "Niche", icon: <FileStack className="w-3 h-3" />, category: "basic" },
  { key: "category", label: "Category", icon: <FileStack className="w-3 h-3" />, category: "basic" },
  { key: "language", label: "Language", icon: <FileStack className="w-3 h-3" />, category: "basic" },
  { key: "country", label: "Country", icon: <FileStack className="w-3 h-3" />, category: "basic" },
  
  // Authority
  { key: "daMin", label: "Domain Authority", icon: <Fingerprint className="w-3 h-3" />, category: "authority" },
  { key: "paMin", label: "Page Authority", icon: <Fingerprint className="w-3 h-3" />, category: "authority" },
  { key: "drMin", label: "Domain Rating", icon: <Fingerprint className="w-3 h-3" />, category: "authority" },
  { key: "spamMax", label: "Spam Score", icon: <Fingerprint className="w-3 h-3" />, category: "authority" },
  { key: "tool", label: "SEO Tool", icon: <Fingerprint className="w-3 h-3" />, category: "authority" },
  
  // Traffic
  { key: "semrushAuthorityMin", label: "Semrush Authority", icon: <Cpu className="w-3 h-3" />, category: "traffic" },
  { key: "semrushOverallTrafficMin", label: "Overall Traffic", icon: <Cpu className="w-3 h-3" />, category: "traffic" },
  { key: "semrushOrganicTrafficMin", label: "Organic Traffic", icon: <Cpu className="w-3 h-3" />, category: "traffic" },
  { key: "targetCountry", label: "Target Country", icon: <Cpu className="w-3 h-3" />, category: "traffic" },
  { key: "trend", label: "Traffic Trend", icon: <Cpu className="w-3 h-3" />, category: "traffic" },
  
  // Publishing
  { key: "priceMin", label: "Price Range", icon: <ReceiptText className="w-3 h-3" />, category: "publishing" },
  { key: "priceWithContentMin", label: "Price with Content", icon: <ReceiptText className="w-3 h-3" />, category: "publishing" },
  { key: "wordLimitMin", label: "Word Limit", icon: <ReceiptText className="w-3 h-3" />, category: "publishing" },
  { key: "tatDaysMax", label: "TAT Days", icon: <ReceiptText className="w-3 h-3" />, category: "publishing" },
  { key: "backlinkNature", label: "Backlink Nature", icon: <ReceiptText className="w-3 h-3" />, category: "publishing" },
  { key: "linkPlacement", label: "Link Placement", icon: <ReceiptText className="w-3 h-3" />, category: "publishing" },
  { key: "permanence", label: "Permanence", icon: <ReceiptText className="w-3 h-3" />, category: "publishing" },
  
  // Quality
  { key: "sampleUrl", label: "Sample URL", icon: <History className="w-3 h-3" />, category: "quality" },
  { key: "remarkIncludes", label: "Remark", icon: <History className="w-3 h-3" />, category: "quality" },
  { key: "lastPublishedAfter", label: "Last Published", icon: <History className="w-3 h-3" />, category: "quality" },
  { key: "outboundLinkLimitMax", label: "Outbound Links", icon: <History className="w-3 h-3" />, category: "quality" },
  { key: "guidelinesUrlIncludes", label: "Guidelines", icon: <History className="w-3 h-3" />, category: "quality" },
  
  // Additional
  { key: "disclaimerIncludes", label: "Disclaimer", icon: <CircleEllipsis className="w-3 h-3" />, category: "additional" },
  { key: "availability", label: "Availability", icon: <CircleEllipsis className="w-3 h-3" />, category: "additional" },
]

export default function CompactFilterPage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [sortBy, setSortBy] = useState<string>("relevance")
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [activeFilterKey, setActiveFilterKey] = useState<keyof Filters | null>(null)
  const [focusedCategory, setFocusedCategory] = useState<string>("basic")

  const results = useMemo(() => applyFilters(sites, filters), [filters])
  
  const setNum = (k: keyof Filters, v: string) => setFilters((f) => ({ ...f, [k]: v === "" ? undefined : Number(v) }))
  const setStr = (k: keyof Filters, v: string) => setFilters((f) => ({ ...f, [k]: v }))

  const reset = () => {
    setFilters(defaultFilters)
    setFocusedCategory("basic")
  }

  const activeChips = useMemo(() => {
    const chips: { key: keyof Filters; label: string }[] = []
    const add = (key: keyof Filters, label: string, value?: unknown) => {
      if (value !== undefined && value !== "" && value !== null) chips.push({ key, label })
    }
    add("websiteUrl", `URL: ${filters.websiteUrl}`, filters.websiteUrl)
    add("websiteName", `Name: ${filters.websiteName}`, filters.websiteName)
    add("niche", `Niche: ${filters.niche}`, filters.niche)
    add("category", `Category: ${filters.category}`, filters.category)
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
    add("priceMin", `$ ≥ ${filters.priceMin}`, filters.priceMin)
    add("priceMax", `$ ≤ ${filters.priceMax}`, filters.priceMax)
    add("trend", `Trend: ${filters.trend}`, filters.trend)
    add("availability", `Available only`, filters.availability)
    // Add more as needed...
    return chips
  }, [filters])

  const openFilterModal = (filterKey: keyof Filters) => {
    setActiveFilterKey(filterKey)
    setFilterModalOpen(true)
  }

  const renderFilterModal = () => {
    if (!activeFilterKey) return null
    
    const pebble = filterPebbles.find(p => p.key === activeFilterKey)
    if (!pebble) return null

    return (
      <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-neutral-900 text-white border-neutral-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {pebble.icon}
              {pebble.label}
            </DialogTitle>
            <DialogDescription className="text-neutral-400">
              Configure your {pebble.label.toLowerCase()} filter
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {renderFilterContent(activeFilterKey)}
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setFilterModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              className={styles.chip}
              onClick={() => setFilterModalOpen(false)}
            >
              Apply Filter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const renderFilterContent = (filterKey: keyof Filters) => {
    switch (filterKey) {
      case "websiteUrl":
      case "websiteName":
      case "niche":
      case "category":
      case "language":
      case "country":
      case "sampleUrl":
      case "remarkIncludes":
      case "guidelinesUrlIncludes":
      case "disclaimerIncludes":
      case "targetCountry":
        return (
          <Input
            className={styles.field}
            placeholder={`Enter ${filterKey.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
            value={filters[filterKey] as string || ""}
            onChange={(e) => setStr(filterKey, e.target.value)}
          />
        )
      
      case "daMin":
      case "daMax":
      case "paMin":
      case "paMax":
      case "drMin":
      case "drMax":
      case "spamMin":
      case "spamMax":
      case "priceMin":
      case "priceMax":
      case "semrushAuthorityMin":
      case "semrushOverallTrafficMin":
      case "semrushOrganicTrafficMin":
      case "targetCountryPctMin":
      case "priceWithContentMin":
      case "priceWithContentMax":
      case "wordLimitMin":
      case "wordLimitMax":
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
          />
        )
      
      case "tool":
        return (
          <Select
            value={filters.tool || ""}
            onValueChange={(val) => setFilters((f) => ({ ...f, tool: val as Filters["tool"] }))}
          >
            <SelectTrigger className={styles.select}>
              <SelectValue placeholder="Select SEO tool" />
            </SelectTrigger>
            <SelectContent className={styles.menu}>
              <SelectItem value="Semrush">Semrush</SelectItem>
              <SelectItem value="Ahrefs">Ahrefs</SelectItem>
              <SelectItem value="SimilarWeb">SimilarWeb</SelectItem>
            </SelectContent>
          </Select>
        )
      
      case "trend":
        return (
          <Select value={filters.trend || ""} onValueChange={(val) => setFilters((f) => ({ ...f, trend: val as Trend }))}>
            <SelectTrigger className={styles.select}>
              <SelectValue placeholder="Select traffic trend" />
            </SelectTrigger>
            <SelectContent className={styles.menu}>
              <SelectItem value="increasing">Increasing</SelectItem>
              <SelectItem value="stable">Stable</SelectItem>
              <SelectItem value="decreasing">Decreasing</SelectItem>
            </SelectContent>
          </Select>
        )
      
      case "backlinkNature":
        return (
          <Select
            value={filters.backlinkNature || ""}
            onValueChange={(val) => setFilters((f) => ({ ...f, backlinkNature: val as BacklinkNature }))}
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
        )
      
      case "linkPlacement":
        return (
          <Select
            value={filters.linkPlacement || ""}
            onValueChange={(val) => setFilters((f) => ({ ...f, linkPlacement: val as LinkPlacement }))}
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
        )
      
      case "permanence":
        return (
          <Select
            value={filters.permanence || ""}
            onValueChange={(val) => setFilters((f) => ({ ...f, permanence: val as "lifetime" | "12-months" }))}
          >
            <SelectTrigger className={styles.select}>
              <SelectValue placeholder="Select permanence" />
            </SelectTrigger>
            <SelectContent className={styles.menu}>
              <SelectItem value="lifetime">Lifetime</SelectItem>
              <SelectItem value="12-months">12 months</SelectItem>
            </SelectContent>
          </Select>
        )
      
      case "lastPublishedAfter":
        return (
          <Input
            className={styles.field}
            type="date"
            value={filters.lastPublishedAfter || ""}
            onChange={(e) => setStr("lastPublishedAfter", e.target.value)}
          />
        )
      
      case "availability":
        return (
          <div className="flex items-center justify-between rounded-md p-3 border border-neutral-800 bg-neutral-900/40">
            <div>
              <Label className="text-sm">Show only available publishers</Label>
            </div>
            <Switch
              checked={filters.availability ?? false}
              onCheckedChange={(v) => setFilters((f) => ({ ...f, availability: v }))}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>
        )
      
      default:
        return <div className="text-neutral-400">Filter configuration not available</div>
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

  const categoryKeys = Object.keys(groupedPebbles)

  const nextCategory = () => {
    const currentIndex = categoryKeys.indexOf(focusedCategory)
    const nextIndex = (currentIndex + 1) % categoryKeys.length
    setFocusedCategory(categoryKeys[nextIndex])
  }

  const prevCategory = () => {
    const currentIndex = categoryKeys.indexOf(focusedCategory)
    const prevIndex = currentIndex === 0 ? categoryKeys.length - 1 : currentIndex - 1
    setFocusedCategory(categoryKeys[prevIndex])
  }

  return (
    <div className={cn(styles.surface, "min-h-[100dvh]")}>
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white">
              Publisher Directory
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Discover high-quality publishers for your guest posting and link building campaigns
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-neutral-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Premium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Verified</span>
            </div>
          </div>
        </div>

        {/* Filters Section - Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Carousel - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card className={cn(styles.panel, "p-6 h-full")}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Filter className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Filter Categories</h2>
                    <p className="text-sm text-neutral-400">Select a category to view available filters</p>
                  </div>
                </div>
                <Button variant="secondary" onClick={reset} className="h-10 px-6">
                  Reset All
                </Button>
              </div>
              
              {/* Category Navigation */}
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={prevCategory}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors disabled:opacity-50"
                  disabled={categoryKeys.length <= 1}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex-1 mx-4">
                  <div className="text-center">
                    <div className="mb-4">
                      <h3 className="text-3xl font-black bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 bg-clip-text text-transparent">
                        {categoryLabels[focusedCategory as keyof typeof categoryLabels]}
                      </h3>
                    </div>
                    
                    {/* Enhanced dot indicators */}
                    <div className="flex items-center justify-center gap-3">
                      {categoryKeys.map((key, index) => (
                        <button
                          key={key}
                          onClick={() => setFocusedCategory(key)}
                          className={cn(
                            "transition-all duration-300 ease-out",
                            key === focusedCategory 
                              ? "scale-125" 
                              : "scale-100 hover:scale-110"
                          )}
                        >
                          <div className={cn(
                            "w-3 h-3 rounded-full transition-all duration-300",
                            key === focusedCategory 
                              ? "bg-gradient-to-r from-yellow-400 to-yellow-300 w-6 shadow-lg shadow-yellow-500/50" 
                              : "bg-neutral-600 hover:bg-neutral-500 hover:shadow-md"
                          )} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={nextCategory}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors disabled:opacity-50"
                  disabled={categoryKeys.length <= 1}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Focused Category Filters */}
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  {groupedPebbles[focusedCategory]?.map((pebble) => {
                    const hasValue = filters[pebble.key] !== undefined && 
                                   filters[pebble.key] !== "" && 
                                   filters[pebble.key] !== null
                    
                    return (
                      <button
                        key={pebble.key}
                        onClick={() => openFilterModal(pebble.key)}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border transition-all duration-200 hover:scale-105",
                          hasValue 
                            ? "bg-yellow-500 text-black border-yellow-500 shadow-lg shadow-yellow-500/25" 
                            : "bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 hover:shadow-md"
                        )}
                      >
                        {pebble.icon}
                        <span>{pebble.label}</span>
                        {hasValue && <Plus className="w-4 h-4 rotate-45" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Active Filters - Takes 1 column */}
          <div className="lg:col-span-1">
            <Card className={cn(styles.panel, "p-6 h-full")}>
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-yellow-500" />
                <h3 className="text-lg font-semibold">Active Filters</h3>
              </div>
              
                             {activeChips.length > 0 ? (
                 <div className="space-y-3">
                   {activeChips.map((chip) => (
                     <div
                       key={chip.label}
                       className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg border border-neutral-700 hover:bg-neutral-700 transition-colors cursor-pointer group"
                       onClick={() => openFilterModal(chip.key)}
                     >
                       <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">{chip.label}</span>
                       <button
                         onClick={(e) => {
                           e.stopPropagation() // Prevent modal from opening when clicking remove
                           setFilters((f) => {
                             const val = f[chip.key]
                             let reset: any = ""
                             if (typeof val === "boolean") reset = undefined
                             else if (typeof val === "number") reset = undefined
                             else reset = ""
                             return { ...f, [chip.key]: reset }
                           })
                         }}
                         className="rounded-full p-1 hover:bg-red-500 hover:text-white transition-colors"
                       >
                         <X className="w-3 h-3" />
                       </button>
                     </div>
                   ))}
                 </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-neutral-500 mb-2">
                    <Filter className="w-8 h-8 mx-auto" />
                  </div>
                  <p className="text-sm text-neutral-400">No active filters</p>
                  <p className="text-xs text-neutral-500">Select filters from the categories above</p>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Results Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-white">
                {results.length} {results.length === 1 ? "Publisher" : "Publishers"} Found
              </h2>
              <p className="text-sm text-neutral-400">
                Showing results based on your current filters
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Label className="text-sm text-neutral-300">Sort by</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className={cn(styles.select, "h-10 w-52")}>
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

          {/* Results Table */}
          <div className="rounded-xl border border-neutral-800 overflow-hidden bg-neutral-900/50">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800 bg-neutral-800/50">
                  <TableHead className="text-neutral-300 font-semibold">Name</TableHead>
                  <TableHead className="text-neutral-300 font-semibold">Niche</TableHead>
                  <TableHead className="text-neutral-300 font-semibold">Country/Lang</TableHead>
                  <TableHead className="text-neutral-300 font-semibold">Authority</TableHead>
                  <TableHead className="text-neutral-300 font-semibold">Spam</TableHead>
                  <TableHead className="text-neutral-300 font-semibold">Price</TableHead>
                  <TableHead className="text-neutral-300 font-semibold">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((site) => (
                  <TableRow
                    key={site.id}
                    className="border-neutral-800 hover:bg-neutral-800/30 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedSite(site)
                      setDetailsOpen(true)
                    }}
                  >
                    <TableCell>
                      <div className="font-medium">
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-yellow-400 hover:text-yellow-300 underline underline-offset-2"
                        >
                          {site.name}
                        </a>
                      </div>
                      <div className="text-xs text-neutral-400">
                        {site.url.replace(/^https?:\/\//, "")}
                      </div>
                    </TableCell>
                    <TableCell className="text-neutral-300">{site.niche}</TableCell>
                    <TableCell className="text-neutral-300">
                      <span>{site.country}</span>
                      <span className="text-neutral-500 mx-1">•</span>
                      <span className="text-xs">{site.language}</span>
                    </TableCell>
                    <TableCell className="text-neutral-300">
                      {`${site.da}/${site.pa}/${site.dr}`}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={styles.chip}>
                        {site.spamScore}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-neutral-300">
                      ${site.publishing.price.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize text-xs">
                        {site.toolScores.trafficTrend}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>

      {/* Filter Modal */}
      {renderFilterModal()}

      {/* Site Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] max-h-[70vh] overflow-y-auto bg-neutral-900 text-white border-neutral-700">
          <DialogHeader className="sticky top-0 z-10 bg-neutral-900/95 backdrop-blur border-b border-neutral-800 pb-4">
            <DialogTitle className="text-xl">{selectedSite?.name}</DialogTitle>
            <DialogDescription className="text-neutral-400">
              {selectedSite?.url}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {selectedSite ? (
              <SiteDetails site={selectedSite} />
            ) : (
              <p className="text-neutral-400">No site selected</p>
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoCard title="Basic Information">
          <InfoItem label="URL" value={site.url} />
          <InfoItem label="Niche" value={site.niche} />
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
          <InfoItem label="Price" value={`${site.publishing.price}`} />
          <InfoItem label="Price with Content" value={`${site.publishing.priceWithContent}`} />
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
    </div>
  )
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="bg-neutral-800 border-neutral-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-neutral-300">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {children}
      </CardContent>
    </Card>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-xs text-neutral-400 flex-shrink-0">{label}</span>
      <span className="text-xs text-white text-right ml-2 break-words">{value}</span>
    </div>
  )
}

// Filter function - simplified for demo
function applyFilters(list: Site[], f: Filters) {
  return list.filter((s) => {
    const inStr = (a: string, b: string) => a.toLowerCase().includes(b.toLowerCase())
    if (f.websiteUrl && !inStr(s.url, f.websiteUrl)) return false
    if (f.websiteName && !inStr(s.name, f.websiteName)) return false
    if (f.niche && !inStr(s.niche, f.niche)) return false
    if (f.category && !inStr(s.category, f.category)) return false
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
    if (f.priceMin !== undefined && s.publishing.price < f.priceMin) return false
    if (f.priceMax !== undefined && s.publishing.price > f.priceMax) return false
    if (f.trend && s.toolScores.trafficTrend !== f.trend) return false
    if (typeof f.availability === "boolean" && s.additional.availability !== f.availability) return false
    return true
  })
}