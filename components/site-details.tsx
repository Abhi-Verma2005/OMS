"use client"

import type * as React from "react"
import type { Site } from "@/lib/sample-sites"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function SiteDetails({ site }: { site: Site }) {
  const stat = (label: string, value: React.ReactNode) => (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs uppercase tracking-wide">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )

  const Bar = ({ label, percent }: { label: string; percent: number }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{percent}%</span>
      </div>
      <div className="bg-muted h-2 w-full rounded-full">
        <div
          className="bg-primary h-2 rounded-full transition-[width] duration-500"
          style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-6 anim-fade-in">
      {/* Top meta */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{site.niche}</Badge>
        <Badge variant="outline">{site.category}</Badge>
        <Badge variant="secondary">{site.language}</Badge>
        <Badge variant="outline">{site.country}</Badge>
        {site.additional.availability ? (
          <Badge className="bg-green-600/15 text-green-700 dark:text-green-400">Available</Badge>
        ) : (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400">Unavailable</Badge>
        )}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stat("DA", site.da)}
        {stat("PA", site.pa)}
        {stat("DR", site.dr)}
        {stat("Spam score", `${site.spamScore}/10`)}
      </div>

      <Separator />

      {/* Tool scores */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Traffic</h4>
          {stat("SEMrush authority", site.toolScores.semrushAuthority)}
          {stat("Overall traffic", site.toolScores.semrushOverallTraffic.toLocaleString())}
          {stat("Organic traffic", site.toolScores.semrushOrganicTraffic.toLocaleString())}
          {stat("Trend", site.toolScores.trafficTrend)}
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Top countries</h4>
          <div className="space-y-2">
            {site.toolScores.topCountries.slice(0, 5).map((c) => (
              <Bar key={c.country} label={c.country} percent={c.percent} />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Target traffic</h4>
          <div className="space-y-2">
            {site.toolScores.targetCountryTraffic.map((c) => (
              <Bar key={c.country} label={c.country} percent={c.percent} />
            ))}
          </div>
        </div>
      </div>

      <Separator />

      {/* Publishing */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Pricing</h4>
          {stat("Post price", `$${site.publishing.price}`)}
          {stat("With content", `$${site.publishing.priceWithContent}`)}
          {stat("Word limit", site.publishing.wordLimit)}
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Links</h4>
          {stat("Backlink nature", site.publishing.backlinkNature)}
          {stat("Backlinks allowed", site.publishing.backlinksAllowed)}
          {stat("Placement", site.publishing.linkPlacement)}
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Publishing rules</h4>
          {stat("TAT (days)", site.publishing.tatDays)}
          {stat("Permanence", site.publishing.permanence)}
          {site.quality.outboundLinkLimit ? stat("Outbound link limit", site.quality.outboundLinkLimit) : null}
        </div>
      </div>

      <Separator />

      {/* Quality and links */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Quality & Notes</h4>
          <ul className="text-sm leading-relaxed text-muted-foreground list-disc pl-5">
            {site.quality.remark ? <li>{site.quality.remark}</li> : null}
            {site.additional.disclaimer ? <li>{site.additional.disclaimer}</li> : null}
            <li>Last published: {site.quality.lastPublished}</li>
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">References</h4>
          <div className="flex flex-wrap gap-2">
            {site.quality.sampleUrl ? (
              <a
                className="underline underline-offset-4 text-sm"
                href={site.quality.sampleUrl}
                target="_blank"
                rel="noreferrer"
              >
                Sample post
              </a>
            ) : null}
            {site.quality.guidelinesUrl ? (
              <a
                className="underline underline-offset-4 text-sm"
                href={site.quality.guidelinesUrl}
                target="_blank"
                rel="noreferrer"
              >
                Guidelines
              </a>
            ) : null}
            <a className="underline underline-offset-4 text-sm" href={site.url} target="_blank" rel="noreferrer">
              Website
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
