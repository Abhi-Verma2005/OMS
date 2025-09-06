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
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    title: "Total Traffic Reached", 
    value: DASHBOARD_METRICS.heroStats.totalTrafficReach,
    icon: Users,
    description: "Monthly visitors generated",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "Keywords Ranked",
    value: DASHBOARD_METRICS.heroStats.keywordsRanked,
    icon: Target, 
    description: "Top 3 positions achieved",
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    title: "Clients Served",
    value: DASHBOARD_METRICS.heroStats.clientsServed,
    icon: Award,
    description: "Success stories created",
    color: "text-orange-600", 
    bgColor: "bg-orange-50"
  }
];

export function HeroStatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={stat.title} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${stat.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold tracking-tight animate-fade-in-up" 
                 style={{ animationDelay: `${index * 0.1}s` }}>
                {stat.value}
              </p>
              <p className="text-sm font-medium text-gray-900">{stat.title}</p>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
