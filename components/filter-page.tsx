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
import sites from "@/lib/sample-sites"
import { Slider } from "@/components/ui/slider"
import {
  ChevronLeft,
  ChevronRight,
  FileStack,
  Fingerprint,
  Cpu,
  ReceiptText,
  History,
  CircleEllipsis,
} from "lucide-react"

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

type Site = {
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
    trafficTrend: Trend
    targetCountryTraffic: { country: string; percent: number }[]
  }
  publishing: {
    price: number
    priceWithContent: number
    wordLimit: number
    tatDays: number
    backlinkNature: BacklinkNature
    backlinksAllowed: number
    linkPlacement: LinkPlacement
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

const defaultFilters: Filters = {
  websiteUrl: "",
  websiteName: "",
  niche: "",
  category: "",
  language: "",
  country: "",
}

const styles = {
  // Primary: yellow; Neutrals: black & gray; Text: white
  surface: "bg-neutral-950 text-white",
  panel: "bg-neutral-900 text-white border border-neutral-800",
  field:
    "bg-neutral-800 text-white placeholder:text-neutral-400 border border-neutral-700 focus-visible:ring-2 focus-visible:ring-yellow-500",
  select: "bg-neutral-800 text-white border border-neutral-700",
  menu: "bg-neutral-900 text-white border border-neutral-700",
  chip: "bg-yellow-500 text-black",
}

export default function FilterPage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [graphFile, setGraphFile] = useState<File | null>(null)
  const [animKey, setAnimKey] = useState(0)
  const [sortBy, setSortBy] = useState<
    | "relevance"
    | "priceLow"
    | "priceHigh"
    | "authorityHigh"
    | "nameAsc"
    | "nameDesc"
    | "spamLow"
    | "spamHigh"
    | "trendInc"
    | "trendDec"
    | "permanenceHigh"
    | "permanenceLow"
  >("relevance")
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const sectionDefs = [
    { key: "basic", label: "Basic Information", icon: <FileStack /> },
    { key: "authority", label: "Authority & SEO Metrics", icon: <Fingerprint /> },
    { key: "traffic", label: "Traffic & Performance", icon: <Cpu /> },
    { key: "publishing", label: "Publishing Details", icon: <ReceiptText /> },
    { key: "quality", label: "Quality & History", icon: <History /> },
    { key: "additional", label: "Additional Info", icon: <CircleEllipsis /> },
  ] as const
  type SectionKey = (typeof sectionDefs)[number]["key"]
  const [activeSection, setActiveSection] = useState<SectionKey>("basic")
  const stripRef = useRef<HTMLDivElement | null>(null)

  const bounds = useMemo(() => {
    const init = {
      price: { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
      spam: { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
      tat: { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
      permanenceMonths: { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
    }
    for (const s of sites) {
      init.price.min = Math.min(init.price.min, s.publishing.price)
      init.price.max = Math.max(init.price.max, s.publishing.price)
      init.spam.min = Math.min(init.spam.min, s.spamScore)
      init.spam.max = Math.max(init.spam.max, s.spamScore)
      init.tat.min = Math.min(init.tat.min, s.publishing.tatDays)
      init.tat.max = Math.max(init.tat.max, s.publishing.tatDays)
      const pMonths = s.publishing.permanence === "lifetime" ? 9999 : 12
      init.permanenceMonths.min = Math.min(init.permanenceMonths.min, pMonths)
      init.permanenceMonths.max = Math.max(init.permanenceMonths.max, pMonths)
    }
    // handle Infinity if dataset empty
    const clamp = (x: number, fallback: number) => (Number.isFinite(x) ? x : fallback)
    return {
      price: { min: clamp(init.price.min, 0), max: clamp(init.price.max, 1000) },
      spam: { min: clamp(init.spam.min, 0), max: clamp(init.spam.max, 100) },
      tat: { min: clamp(init.tat.min, 0), max: clamp(init.tat.max, 30) },
      permanenceMonths: {
        min: clamp(init.permanenceMonths.min, 12),
        max: clamp(init.permanenceMonths.max, 9999),
      },
    }
  }, [])

  const results = useMemo(() => applyFilters(sites, filters), [filters])
  const sortedResults = useMemo(() => {
    const nameSort = (a: Site, b: Site) => a.name.localeCompare(b.name)
    const spam = (x: Site) => x.spamScore
    const permMonths = (x: Site) => (x.publishing.permanence === "lifetime" ? 9999 : 12)
    const trendRank = (x: Site) =>
      x.toolScores.trafficTrend === "increasing" ? 2 : x.toolScores.trafficTrend === "stable" ? 1 : 0

    if (sortBy === "priceLow") return [...results].sort((a, b) => a.publishing.price - b.publishing.price)
    if (sortBy === "priceHigh") return [...results].sort((a, b) => b.publishing.price - a.publishing.price)
    if (sortBy === "authorityHigh") return [...results].sort((a, b) => b.da + b.dr + b.pa - (a.da + a.dr + a.pa))
    if (sortBy === "nameAsc") return [...results].sort(nameSort)
    if (sortBy === "nameDesc") return [...results].sort((a, b) => -nameSort(a, b))
    if (sortBy === "spamLow") return [...results].sort((a, b) => spam(a) - spam(b))
    if (sortBy === "spamHigh") return [...results].sort((a, b) => spam(b) - spam(a))
    if (sortBy === "trendInc") return [...results].sort((a, b) => trendRank(b) - trendRank(a)) // increasing first
    if (sortBy === "trendDec") return [...results].sort((a, b) => trendRank(a) - trendRank(b)) // decreasing first
    if (sortBy === "permanenceHigh") return [...results].sort((a, b) => permMonths(b) - permMonths(a))
    if (sortBy === "permanenceLow") return [...results].sort((a, b) => permMonths(a) - permMonths(b))
    return results
  }, [results, sortBy])

  const setNum = (k: keyof Filters, v: string) => setFilters((f) => ({ ...f, [k]: v === "" ? undefined : Number(v) }))
  const setStr = (k: keyof Filters, v: string) => setFilters((f) => ({ ...f, [k]: v }))

  const reset = () => {
    setFilters(defaultFilters)
    setGraphFile(null)
  }

  useEffect(() => {
    setAnimKey((k) => k + 1)
  }, [JSON.stringify(filters)])

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
    add("semrushAuthorityMin", `Semrush AS ≥ ${filters.semrushAuthorityMin}`, filters.semrushAuthorityMin)
    add(
      "semrushOverallTrafficMin",
      `Semrush OT ≥ ${filters.semrushOverallTrafficMin}`,
      filters.semrushOverallTrafficMin,
    )
    add(
      "semrushOrganicTrafficMin",
      `Semrush OrgT ≤ ${filters.semrushOrganicTrafficMin}`,
      filters.semrushOrganicTrafficMin,
    )
    add("targetCountry", `Target Country: ${filters.targetCountry}`, filters.targetCountry)
    add("targetCountryPctMin", `Target Country % ≥ ${filters.targetCountryPctMin}%`, filters.targetCountryPctMin)
    add("trend", `Trend: ${filters.trend}`, filters.trend)
    add("priceMin", `$ ≥ ${filters.priceMin}`, filters.priceMin)
    add("priceMax", `$ ≤ ${filters.priceMax}`, filters.priceMax)
    add("priceWithContentMin", `Price+Content ≥ ${filters.priceWithContentMin}`, filters.priceWithContentMin)
    add("priceWithContentMax", `Price+Content ≤ ${filters.priceWithContentMax}`, filters.priceWithContentMax)
    add("wordLimitMin", `Word Limit: ${filters.wordLimitMin}`, filters.wordLimitMin)
    add("wordLimitMax", `Word Limit: ${filters.wordLimitMax}`, filters.wordLimitMax)
    add("tatDaysMin", `TAT ≥ ${filters.tatDaysMin}d`, filters.tatDaysMin)
    add("tatDaysMax", `TAT ≤ ${filters.tatDaysMax}d`, filters.tatDaysMax)
    add("permanenceMinMonths", `Perm. ≥ ${filters.permanenceMinMonths}m`, filters.permanenceMinMonths)
    add("permanenceMaxMonths", `Perm. ≤ ${filters.permanenceMaxMonths}m`, filters.permanenceMaxMonths)
    add("backlinkNature", `Backlink: ${filters.backlinkNature}`, filters.backlinkNature)
    add("backlinksAllowedMin", `Backlink ≥ ${filters.backlinksAllowedMin}`, filters.backlinksAllowedMin)
    add("linkPlacement", `Placement: ${filters.linkPlacement}`, filters.linkPlacement)
    add("permanence", `Perm: ${filters.permanence}`, filters.permanence)
    add("sampleUrl", `Sample URL: ${filters.sampleUrl}`, filters.sampleUrl)
    add("remarkIncludes", `Remark: ${filters.remarkIncludes}`, filters.remarkIncludes)
    add("lastPublishedAfter", `Last Published After: ${filters.lastPublishedAfter}`, filters.lastPublishedAfter)
    add("outboundLinkLimitMax", `Outbound Links ≤ ${filters.outboundLinkLimitMax}`, filters.outboundLinkLimitMax)
    add("guidelinesUrlIncludes", `Guidelines: ${filters.guidelinesUrlIncludes}`, filters.guidelinesUrlIncludes)
    add("disclaimerIncludes", `Disclaimer: ${filters.disclaimerIncludes}`, filters.disclaimerIncludes)
    add("availability", `Available only`, filters.availability)
    return chips
  }, [filters])

  const renderActiveSection = () => {
    switch (activeSection) {
      case "basic":
        return (
          <div className="space-y-3">
            <Field label="Website URL">
              <Input
                className={styles.field}
                placeholder="https://example.com"
                value={filters.websiteUrl}
                onChange={(e) => setStr("websiteUrl", e.target.value)}
              />
            </Field>
            <p className="text-xs text-neutral-400">Tip: You can paste domain or a partial path.</p>
            <Field label="Website Name (Brand Name)">
              <Input
                className={styles.field}
                placeholder="Brand name"
                value={filters.websiteName}
                onChange={(e) => setStr("websiteName", e.target.value)}
              />
            </Field>
            <Field label="Niche of the Website">
              <Input
                className={styles.field}
                placeholder="e.g., Tech, Travel"
                value={filters.niche}
                onChange={(e) => setStr("niche", e.target.value)}
              />
            </Field>
            <Field label="Category (based on what client is looking for)">
              <Input
                className={styles.field}
                placeholder="e.g., Guest Post"
                value={filters.category}
                onChange={(e) => setStr("category", e.target.value)}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Website Language">
                <Input
                  className={styles.field}
                  placeholder="e.g., English"
                  value={filters.language}
                  onChange={(e) => setStr("language", e.target.value)}
                />
              </Field>
              <Field label="Website Country / Target Country">
                <Input
                  className={styles.field}
                  placeholder="e.g., US"
                  value={filters.country}
                  onChange={(e) => setStr("country", e.target.value)}
                />
              </Field>
            </div>
          </div>
        )
      case "authority":
        return (
          <div className="space-y-3">
            <RangeRow
              label="Domain Authority (DA)"
              min={filters.daMin}
              max={filters.daMax}
              onMin={(v) => setNum("daMin", v)}
              onMax={(v) => setNum("daMax", v)}
            />
            <RangeRow
              label="Page Authority (PA)"
              min={filters.paMin}
              max={filters.paMax}
              onMin={(v) => setNum("paMin", v)}
              onMax={(v) => setNum("paMax", v)}
            />
            <RangeRow
              label="Domain Rating (DR)"
              min={filters.drMin}
              max={filters.drMax}
              onMin={(v) => setNum("drMin", v)}
              onMax={(v) => setNum("drMax", v)}
            />
            <RangeRow
              label="Spam Score (%)"
              min={filters.spamMin}
              max={filters.spamMax}
              onMin={(v) => setNum("spamMin", v)}
              onMax={(v) => setNum("spamMax", v)}
            />
            <Field label="Choose SEO Tool">
              <Select
                value={filters.tool}
                onValueChange={(val) => setFilters((f) => ({ ...f, tool: val as Filters["tool"] }))}
              >
                <SelectTrigger className={styles.select}>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent className={styles.menu}>
                  <SelectItem value="Semrush">Semrush</SelectItem>
                  <SelectItem value="Ahrefs">Ahrefs</SelectItem>
                  <SelectItem value="SimilarWeb">SimilarWeb</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        )
      case "traffic":
        return (
          <div className="space-y-3">
            <Field label="Semrush Authority Score (min)">
              <Input
                className={styles.field}
                type="number"
                value={filters.semrushAuthorityMin ?? ""}
                onChange={(e) => setNum("semrushAuthorityMin", e.target.value)}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Semrush Overall Traffic (min)">
                <Input
                  className={styles.field}
                  type="number"
                  value={filters.semrushOverallTrafficMin ?? ""}
                  onChange={(e) => setNum("semrushOverallTrafficMin", e.target.value)}
                />
              </Field>
              <Field label="Semrush Organic Traffic (min)">
                <Input
                  className={styles.field}
                  type="number"
                  value={filters.semrushOrganicTrafficMin ?? ""}
                  onChange={(e) => setNum("semrushOrganicTrafficMin", e.target.value)}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Target Country">
                <Input
                  className={styles.field}
                  placeholder="e.g., US"
                  value={filters.targetCountry ?? ""}
                  onChange={(e) => setStr("targetCountry", e.target.value)}
                />
              </Field>
              <Field label="Target Country Traffic % (min)">
                <Input
                  className={styles.field}
                  type="number"
                  min={0}
                  max={100}
                  value={filters.targetCountryPctMin ?? ""}
                  onChange={(e) => setNum("targetCountryPctMin", e.target.value)}
                />
              </Field>
            </div>
            <Field label="Traffic Trend">
              <Select value={filters.trend} onValueChange={(val) => setFilters((f) => ({ ...f, trend: val as Trend }))}>
                <SelectTrigger className={styles.select}>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent className={styles.menu}>
                  <SelectItem value="increasing">Increasing</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                  <SelectItem value="decreasing">Decreasing</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Semrush Traffic Graph Screenshot (optional)">
              <Input
                type="file"
                accept="image/*"
                className={styles.field}
                onChange={(e) => setGraphFile(e.target.files?.[0] ?? null)}
              />
              {graphFile && <p className="text-xs text-neutral-300 mt-1">{graphFile.name}</p>}
            </Field>
          </div>
        )
      case "publishing":
        return (
          <div className="space-y-4">
            <RangeSliderRow
              label="Publishing Price Range"
              minBound={bounds.price.min}
              maxBound={bounds.price.max}
              step={10}
              valueMin={filters.priceMin}
              valueMax={filters.priceMax}
              onChange={(min, max) => {
                setFilters((f) => ({ ...f, priceMin: min, priceMax: max }))
              }}
              fieldClass={styles.field}
            />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price with Content (min)">
                <Input
                  className={styles.field}
                  type="number"
                  value={filters.priceWithContentMin ?? ""}
                  onChange={(e) => setNum("priceWithContentMin", e.target.value)}
                />
              </Field>
              <Field label="Price with Content (max)">
                <Input
                  className={styles.field}
                  type="number"
                  value={filters.priceWithContentMax ?? ""}
                  onChange={(e) => setNum("priceWithContentMax", e.target.value)}
                />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Content Word Limit (min)">
                <Input
                  className={styles.field}
                  type="number"
                  value={filters.wordLimitMin ?? ""}
                  onChange={(e) => setNum("wordLimitMin", e.target.value)}
                />
              </Field>
              <Field label="Content Word Limit (max)">
                <Input
                  className={styles.field}
                  type="number"
                  value={filters.wordLimitMax ?? ""}
                  onChange={(e) => setNum("wordLimitMax", e.target.value)}
                />
              </Field>
              <Field label="TAT (min days)">
                <Input
                  className={styles.field}
                  type="number"
                  value={filters.tatDaysMin ?? ""}
                  onChange={(e) => setNum("tatDaysMin", e.target.value)}
                />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="TAT (max days)">
                <Input
                  className={styles.field}
                  type="number"
                  value={filters.tatDaysMax ?? ""}
                  onChange={(e) => setNum("tatDaysMax", e.target.value)}
                />
              </Field>
              <Field label="Permanence min (months, lifetime=9999)">
                <Input
                  className={styles.field}
                  type="number"
                  value={filters.permanenceMinMonths ?? ""}
                  onChange={(e) => setNum("permanenceMinMonths", e.target.value)}
                />
              </Field>
              <Field label="Permanence max (months)">
                <Input
                  className={styles.field}
                  type="number"
                  value={filters.permanenceMaxMonths ?? ""}
                  onChange={(e) => setNum("permanenceMaxMonths", e.target.value)}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Backlink Nature">
                <Select
                  value={filters.backlinkNature}
                  onValueChange={(val) => setFilters((f) => ({ ...f, backlinkNature: val as BacklinkNature }))}
                >
                  <SelectTrigger className={styles.select}>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent className={styles.menu}>
                    <SelectItem value="do-follow">Do-Follow</SelectItem>
                    <SelectItem value="no-follow">No-Follow</SelectItem>
                    <SelectItem value="sponsored">Sponsored</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Number of Backlinks Allowed (min)">
                <Input
                  className={styles.field}
                  type="number"
                  value={filters.backlinksAllowedMin ?? ""}
                  onChange={(e) => setNum("backlinksAllowedMin", e.target.value)}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Link Placement">
                <Select
                  value={filters.linkPlacement}
                  onValueChange={(val) => setFilters((f) => ({ ...f, linkPlacement: val as LinkPlacement }))}
                >
                  <SelectTrigger className={styles.select}>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent className={styles.menu}>
                    <SelectItem value="in-content">In-content</SelectItem>
                    <SelectItem value="author-bio">Author Bio</SelectItem>
                    <SelectItem value="footer">Footer</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Permanent or Time-bound">
                <Select
                  value={filters.permanence}
                  onValueChange={(val) => setFilters((f) => ({ ...f, permanence: val as "lifetime" | "12-months" }))}
                >
                  <SelectTrigger className={styles.select}>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent className={styles.menu}>
                    <SelectItem value="lifetime">Lifetime</SelectItem>
                    <SelectItem value="12-months">12 months</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>
        )
      case "quality":
        return (
          <div className="space-y-3">
            <Field label="Sample URL contains">
              <Input
                className={styles.field}
                placeholder="path/keyword"
                value={filters.sampleUrl ?? ""}
                onChange={(e) => setStr("sampleUrl", e.target.value)}
              />
            </Field>
            <Field label='Website Remark includes (e.g., "Accepts casino")'>
              <Input
                className={styles.field}
                placeholder="keyword"
                value={filters.remarkIncludes ?? ""}
                onChange={(e) => setStr("remarkIncludes", e.target.value)}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Last Published Post Date (after)">
                <Input
                  className={styles.field}
                  type="date"
                  value={filters.lastPublishedAfter ?? ""}
                  onChange={(e) => setStr("lastPublishedAfter", e.target.value)}
                />
              </Field>
              <Field label="Outbound Link Limit (max)">
                <Input
                  className={styles.field}
                  type="number"
                  value={filters.outboundLinkLimitMax ?? ""}
                  onChange={(e) => setNum("outboundLinkLimitMax", e.target.value)}
                />
              </Field>
            </div>
            <Field label="Content Guidelines URL includes">
              <Input
                className={styles.field}
                placeholder="keyword"
                value={filters.guidelinesUrlIncludes ?? ""}
                onChange={(e) => setStr("guidelinesUrlIncludes", e.target.value)}
              />
            </Field>
          </div>
        )
      case "additional":
        return (
          <div className="space-y-3">
            <Field label="Disclaimer includes">
              <Input
                className={styles.field}
                placeholder="keyword"
                value={filters.disclaimerIncludes ?? ""}
                onChange={(e) => setStr("disclaimerIncludes", e.target.value)}
              />
            </Field>
            <div className="flex items-center justify-between rounded-md p-3 border border-neutral-800 bg-neutral-900/40">
              <div>
                <Label className="text-sm">Availability (Yes/No)</Label>
                <p className="text-xs text-neutral-300">Show only publishers marked as available</p>
              </div>
              <Switch
                checked={filters.availability ?? false}
                onCheckedChange={(v) => setFilters((f) => ({ ...f, availability: v }))}
                className="data-[state=checked]:bg-yellow-500"
              />
            </div>
          </div>
        )
    }
  }

  return (
    <div className={cn(styles.surface, "min-h-[100dvh] animate-in fade-in-0 slide-in-from-bottom-2 duration-300")}>
      <div className="mx-auto max-w-9xl px-4 py-6 space-y-6">
        {/* Top carousel of filter sections - modern card style */}
        <div className="relative flex flex-col items-center">
          <button
            type="button"
            aria-label="Previous section"
            onClick={() =>
              setActiveSection((prev) => {
                const idx = sectionDefs.findIndex((s) => s.key === prev)
                return sectionDefs[(idx - 1 + sectionDefs.length) % sectionDefs.length].key
              })
            }
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-14 h-14 flex items-center justify-center rounded-full bg-neutral-900 shadow-md border border-neutral-200 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-ring/60 anim-card-in"
          >
            <ChevronLeft className="h-6 w-6 text-neutral-500" />
          </button>
          <div className="flex items-center justify-center w-full gap-0 min-h-[220px] py-6 anim-page-in">
            {sectionDefs.map((s, idx) => {
              const activeIdx = sectionDefs.findIndex((x) => x.key === activeSection)
              const offset = idx - activeIdx
              if (Math.abs(offset) > 2) return null
              const isActive = s.key === activeSection
              return (
                <div
                  key={s.key}
                  className={cn(
                    "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col items-center justify-center",
                    isActive
                      ? "z-20 scale-110 opacity-100 shadow-xl bg-neutral-900 border text-white border-neutral-500"
                      : "z-10 scale-95 opacity-50 bg-neutral/70 dark:bg-neutral/70 border text-white",
                    "rounded-md mx-[-32px] px-12 py-10 min-w-[320px] min-h-[180px] max-w-[340px] max-h-[200px]",
                    offset === -1 && "-translate-x-8",
                    offset === 1 && "translate-x-8",
                    offset === -2 && "-translate-x-16 blur-sm",
                    offset === 2 && "translate-x-16 blur-sm",
                    "cursor-pointer",
                  )}
                  style={{ boxShadow: isActive ? "0 8px 32px 0 rgba(0,0,0,0.10)" : undefined }}
                  onClick={() => setTimeout(() => setActiveSection(s.key), 120)}
                  tabIndex={0}
                >
                  <div className={cn("mb-4 p-4 border rounded", isActive ? "text-yellow-400" : "text-neutral-400")}>
                    {s.icon}
                  </div>
                  <div className={cn("text-2xl font-semibold text-center", isActive ? "text-white" : "text-white")}>
                    {s.label}
                  </div>
                  {/* Optionally, add a sublabel or count here */}
                </div>
              )
            })}
          </div>
          <button
            type="button"
            aria-label="Next section"
            onClick={() =>
              setActiveSection((prev) => {
                const idx = sectionDefs.findIndex((s) => s.key === prev)
                return sectionDefs[(idx + 1) % sectionDefs.length].key
              })
            }
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-14 h-14 flex items-center justify-center rounded-full bg-neutral-900 shadow-md border border-neutral-200 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-ring/60 anim-card-in"
          >
            <ChevronRight className="h-6 w-6 text-neutral-500" />
          </button>
        </div>

        {/* Active section content card + controls */}
        <Card className={cn(styles.panel, "animate-in fade-in-0 duration-300")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{sectionDefs.find((x) => x.key === activeSection)?.label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderActiveSection()}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={reset}
                className="h-9 rounded-full px-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white"
              >
                Reset
              </Button>
              <Button className={cn("h-9 rounded-full px-5 font-medium", styles.chip)}>
                {`View ${sortedResults.length} result${sortedResults.length === 1 ? "" : "s"}`}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results toolbar and grid */}
        <section className="space-y-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">
                {sortedResults.length} {sortedResults.length === 1 ? "Result" : "Results"}
              </h2>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-neutral-300">Sort</Label>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                  <SelectTrigger className={cn(styles.select, "h-8 w-56")}>
                    <SelectValue placeholder="Relevance" />
                  </SelectTrigger>
                  <SelectContent className={styles.menu}>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="nameAsc">Name: A → Z</SelectItem>
                    <SelectItem value="nameDesc">Name: Z → A</SelectItem>
                    <SelectItem value="priceLow">Price: Low → High</SelectItem>
                    <SelectItem value="priceHigh">Price: High → Low</SelectItem>
                    <SelectItem value="authorityHigh">Authority: High</SelectItem>
                    <SelectItem value="spamLow">Spam: Low → High</SelectItem>
                    <SelectItem value="spamHigh">Spam: High → Low</SelectItem>
                    <SelectItem value="trendInc">Traffic Trend: Increasing</SelectItem>
                    <SelectItem value="trendDec">Traffic Trend: Decreasing</SelectItem>
                    <SelectItem value="permanenceHigh">Permanence: High → Low</SelectItem>
                    <SelectItem value="permanenceLow">Permanence: Low → High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {activeChips.length > 0 && (
              <div className="flex flex-wrap gap-2 cursor-pointer">
                {activeChips.map((c) => (
                  <button
                    key={c.label}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-3 py-2 text-s border border-neutral-700 bg-neutral-900/40 hover:bg-neutral-800 transition-colors cursor-pointer",
                    )}
                    aria-label={`Remove ${c.label}`}
                  >
                    <span>{c.label}</span>
                    <span
                      onClick={() => {
                        setFilters((f) => {
                          // Reset logic for all types
                          const val = f[c.key]
                          let reset: any = ""
                          if (typeof val === "boolean") reset = undefined
                          else if (typeof val === "number") reset = undefined
                          else reset = ""
                          return { ...f, [c.key]: reset }
                        })
                      }}
                      className={cn("rounded-full px-2 font-medium hover:bg-red-500 transition-colors", styles.chip)}
                    >
                      ×
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Table results (replaces previous cards grid) */}
          <div key={animKey} className="animate-in fade-in-0 duration-300">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Niche</TableHead>
                  <TableHead>Country/Lang</TableHead>
                  <TableHead>Authority (DA/PA/DR)</TableHead>
                  <TableHead>Spam</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Permanence</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="stagger-children">
                {sortedResults.map((site, index) => (
                  <TableRow
                    key={site.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setSelectedSite(site)
                      setDetailsOpen(true)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedSite(site)
                        setDetailsOpen(true)
                      }
                    }}
                    className={cn("cursor-pointer anim-card-in", index % 2 === 0 ? "delay-100" : "delay-200")}
                  >
                    <TableCell className="max-w-[320px]">
                      <div className="font-medium">
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-yellow-500/60 underline-offset-4"
                        >
                          {site.name}
                        </a>
                      </div>
                      <div className="text-xs text-muted-foreground">{site.url.replace(/^https?:\/\//, "")}</div>
                    </TableCell>
                    <TableCell>{site.niche}</TableCell>
                    <TableCell>
                      <span className="text-sm">{site.country}</span>
                      <span className="text-xs text-muted-foreground ml-1">• {site.language}</span>
                    </TableCell>
                    <TableCell>{`${site.da}/${site.pa}/${site.dr}`}</TableCell>
                    <TableCell>
                      <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", styles.chip)}>
                        {site.spamScore}%
                      </span>
                    </TableCell>
                    <TableCell>${site.publishing.price.toLocaleString?.() ?? site.publishing.price}</TableCell>
                    <TableCell>
                      {typeof site.publishing.permanence === "string"
                        ? site.publishing.permanence
                        : `${site.publishing.permanence} mo`}
                    </TableCell>
                    <TableCell>
                      <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium capitalize", styles.chip)}>
                        {site.toolScores.trafficTrend}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent
          // 80–90% width, ~60% height, scrollable content, subtle animation already provided by component
          className="sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] max-h-[60vh] overflow-y-auto p-0"
          showCloseButton
        >
          <DialogHeader className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-5">
            <DialogTitle className="text-balance">{selectedSite?.name || "Details"}</DialogTitle>
            <DialogDescription className="truncate">{selectedSite?.url}</DialogDescription>
          </DialogHeader>

          {/* Details body */}
          <div className="p-5">
            {selectedSite ? (
              <SiteDetails site={selectedSite} />
            ) : (
              <p className="text-muted-foreground text-sm">Select a result to see details.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function RangeSliderRow({
  label,
  minBound,
  maxBound,
  step = 1,
  valueMin,
  valueMax,
  onChange,
  fieldClass,
}: {
  label: string
  minBound: number
  maxBound: number
  step?: number
  valueMin?: number
  valueMax?: number
  onChange: (min: number | undefined, max: number | undefined) => void
  fieldClass?: string
}) {
  const [local, setLocal] = useState<[number, number]>([valueMin ?? minBound, valueMax ?? maxBound])
  useEffect(() => {
    setLocal([valueMin ?? minBound, valueMax ?? maxBound])
  }, [valueMin, valueMax, minBound, maxBound])

  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <Slider
        value={local}
        onValueChange={(v) => setLocal([v[0]!, v[1]!])}
        onValueCommit={(v) => onChange(v[0] === minBound ? undefined : v[0], v[1] === maxBound ? undefined : v[1])}
        min={minBound}
        max={maxBound}
        step={step}
        className="w-full"
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          className={fieldClass}
          placeholder={`${minBound}`}
          type="number"
          value={valueMin ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value), valueMax)}
        />
        <Input
          className={fieldClass}
          placeholder={`${maxBound}`}
          type="number"
          value={valueMax ?? ""}
          onChange={(e) => onChange(valueMin, e.target.value === "" ? undefined : Number(e.target.value))}
        />
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  )
}

function RangeRow({
  label,
  min,
  max,
  onMin,
  onMax,
}: {
  label: string
  min?: number
  max?: number
  onMin: (v: string) => void
  onMax: (v: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      <div className="grid grid-cols-2 gap-3">
        <Input
          className={styles.field}
          placeholder="Min"
          type="number"
          value={min ?? ""}
          onChange={(e) => onMin(e.target.value)}
        />
        <Input
          className={styles.field}
          placeholder="Max"
          type="number"
          value={max ?? ""}
          onChange={(e) => onMax(e.target.value)}
        />
      </div>
    </div>
  )
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-900/40 px-2 py-1">
      <span className="text-neutral-300">{k}</span>
      <span className="font-medium text-white">{v}</span>
    </div>
  )
}

function SiteDetails({ site }: { site: Site }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{site.name}</h3>
        <Badge>
          {site.country} • {site.language}
        </Badge>
      </div>
      <Separator />
      <div className="space-y-2">
        <KV k="Website URL" v={site.url} />
        <KV k="Niche" v={site.niche} />
        <KV k="Category" v={site.category} />
        <KV k="DA/PA/DR" v={`${site.da}/${site.pa}/${site.dr}`} />
        <KV k="Spam Score" v={`${site.spamScore}%`} />
        <KV k="Semrush Authority Score" v={`${site.toolScores.semrushAuthority}`} />
        <KV k="Semrush Overall Traffic" v={`${site.toolScores.semrushOverallTraffic.toLocaleString()}`} />
        <KV k="Semrush Organic Traffic" v={`${site.toolScores.semrushOrganicTraffic.toLocaleString()}`} />
        <KV k="Publishing Price" v={`$${site.publishing.price}`} />
        <KV k="Price with Content" v={`$${site.publishing.priceWithContent}`} />
        <KV k="Backlink Nature" v={site.publishing.backlinkNature} />
        <KV k="Link Placement" v={site.publishing.linkPlacement} />
        <KV k="Permanence" v={site.publishing.permanence} />
        <KV k="Traffic Trend" v={site.toolScores.trafficTrend} />
        <KV k="Sample URL" v={site.quality.sampleUrl ?? ""} />
        <KV k="Remark" v={site.quality.remark ?? ""} />
        <KV k="Last Published Post Date" v={site.quality.lastPublished ?? ""} />
        <KV k="Outbound Link Limit" v={`${site.quality.outboundLinkLimit}`} />
        <KV k="Content Guidelines URL" v={site.quality.guidelinesUrl ?? ""} />
        <KV k="Disclaimer" v={site.additional.disclaimer ?? ""} />
        <KV k="Availability" v={site.additional.availability ? "Yes" : "No"} />
      </div>
    </div>
  )
}

function applyFilters(list: Site[], f: Filters) {
  const after = f.lastPublishedAfter ? new Date(f.lastPublishedAfter) : undefined
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

    if (f.semrushAuthorityMin !== undefined && s.toolScores.semrushAuthority < f.semrushAuthorityMin) return false
    if (f.semrushOverallTrafficMin !== undefined && s.toolScores.semrushOverallTraffic < f.semrushOverallTrafficMin)
      return false
    if (f.semrushOrganicTrafficMin !== undefined && s.toolScores.semrushOrganicTraffic < f.semrushOrganicTrafficMin)
      return false
    if (f.trend && s.toolScores.trafficTrend !== f.trend) return false
    if (f.targetCountry) {
      const t = s.toolScores.targetCountryTraffic.find(
        (x) =>
          x.country.toLowerCase() === f.targetCountry!.toLowerCase() &&
          (f.targetCountryPctMin === undefined || x.percent >= f.targetCountryPctMin!),
      )
      if (!t) return false
    }

    if (f.priceMin !== undefined && s.publishing.price < f.priceMin) return false
    if (f.priceMax !== undefined && s.publishing.price > f.priceMax) return false
    if (f.priceWithContentMin !== undefined && s.publishing.priceWithContent < f.priceWithContentMin) return false
    if (f.priceWithContentMax !== undefined && s.publishing.priceWithContent > f.priceWithContentMax) return false
    if (f.wordLimitMin !== undefined && s.publishing.wordLimit < f.wordLimitMin) return false
    if (f.wordLimitMax !== undefined && s.publishing.wordLimit > f.wordLimitMax) return false

    if (f.tatDaysMin !== undefined && s.publishing.tatDays < f.tatDaysMin) return false
    if (f.tatDaysMax !== undefined && s.publishing.tatDays > f.tatDaysMax) return false

    if (f.backlinkNature && s.publishing.backlinkNature !== f.backlinkNature) return false
    if (f.backlinksAllowedMin !== undefined && s.publishing.backlinksAllowed < f.backlinksAllowedMin) return false
    if (f.linkPlacement && s.publishing.linkPlacement !== f.linkPlacement) return false
    if (f.permanence && s.publishing.permanence !== f.permanence) return false

    const pMonths = s.publishing.permanence === "lifetime" ? 9999 : 12
    if (f.permanenceMinMonths !== undefined && pMonths < f.permanenceMinMonths) return false
    if (f.permanenceMaxMonths !== undefined && pMonths > f.permanenceMaxMonths) return false

    if (f.sampleUrl && !(s.quality.sampleUrl || "").toLowerCase().includes(f.sampleUrl.toLowerCase())) return false
    if (f.remarkIncludes && !(s.quality.remark || "").toLowerCase().includes(f.remarkIncludes.toLowerCase()))
      return false
    if (after && new Date(s.quality.lastPublished) < after) return false
    if (f.outboundLinkLimitMax !== undefined && s.quality.outboundLinkLimit > f.outboundLinkLimitMax) return false
    if (
      f.guidelinesUrlIncludes &&
      !(s.quality.guidelinesUrl || "").toLowerCase().includes(f.guidelinesUrlIncludes.toLowerCase())
    )
      return false

    if (
      f.disclaimerIncludes &&
      !(s.additional.disclaimer || "").toLowerCase().includes(f.disclaimerIncludes.toLowerCase())
    )
      return false
    if (typeof f.availability === "boolean" && s.additional.availability !== f.availability) return false

    return true
  })
}
