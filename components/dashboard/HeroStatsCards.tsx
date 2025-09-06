"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DASHBOARD_METRICS } from "@/lib/dashboard-data";
import { TrendingUp, Users, Target, Award } from "lucide-react";

const stats = [
  {
    title: "Average Traffic Growth",
    value: DASHBOARD_METRICS.heroStats.avgTrafficGrowth,
    icon: TrendingUp,
    description: "Peak client achievement",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20"
  },
  {
    title: "Total Traffic Reached", 
    value: DASHBOARD_METRICS.heroStats.totalTrafficReach,
    icon: Users,
    description: "Monthly visitors generated",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20"
  },
  {
    title: "Keywords Ranked",
    value: DASHBOARD_METRICS.heroStats.keywordsRanked,
    icon: Target, 
    description: "Top 3 positions achieved",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20"
  },
  {
    title: "Clients Served",
    value: DASHBOARD_METRICS.heroStats.clientsServed,
    icon: Award,
    description: "Success stories created",
    color: "text-orange-500", 
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20"
  }
];

export function HeroStatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
      {stats.map((stat, index) => (
        <Card key={stat.title} className="card-modern hover-lift group anim-card-in relative overflow-hidden">
          <CardContent className="p-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${stat.bgColor} border ${stat.borderColor} mb-6 group-hover:scale-110 transition-all duration-300`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div className="space-y-3">
              <p className="text-3xl font-bold tracking-tight text-foreground group-hover:scale-105 transition-transform duration-300" 
                 style={{ animationDelay: `${index * 0.1}s` }}>
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{stat.title}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
