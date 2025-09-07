"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ENHANCED_HERO_STATS } from "@/lib/enhanced-dashboard-data";
import { 
  Building2, 
  Globe, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Star,
  Target 
} from "lucide-react";

// Add custom styles for enhanced animations
const cardStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
  }
  
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.1); }
    50% { box-shadow: 0 0 40px rgba(251, 191, 36, 0.2); }
  }
  
  .enhanced-card {
    animation: float 6s ease-in-out infinite;
  }
  
  .enhanced-card:hover {
    animation: pulse-glow 2s ease-in-out infinite;
  }
  
  .enhanced-card:nth-child(1) { animation-delay: 0s; }
  .enhanced-card:nth-child(2) { animation-delay: 0.5s; }
  .enhanced-card:nth-child(3) { animation-delay: 1s; }
  .enhanced-card:nth-child(4) { animation-delay: 1.5s; }
`;

const businessStats = [
  // What We Have Section
  {
    section: "What We Have",
    stats: [
      {
        title: "Total Publishers",
        value: "40K+",
        icon: Building2,
        description: "High-quality publishers in our network",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        trend: "Premium Network"
      },
      {
        title: "Total Sites",
        value: "40K+",
        icon: Globe,
        description: "Verified websites across all niches",
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        trend: "Premium Network"
      },
      {
        title: "Categories",
        value: ENHANCED_HERO_STATS.businessInventory.categories,
        icon: Target,
        description: "Industry categories covered",
        color: "text-yellow-700",
        bgColor: "bg-yellow-100",
        trend: "Complete coverage"
      },
      {
        title: "Average Quality",
        value: ENHANCED_HERO_STATS.businessInventory.avgQuality,
        icon: Star,
        description: "Average Domain Authority",
        color: "text-amber-700",
        bgColor: "bg-amber-100",
        trend: "Premium quality"
      }
    ]
  },
  // Whom We Served Section  
  {
    section: "Whom We Served",
    stats: [
      {
        title: "Total Orders",
        value: ENHANCED_HERO_STATS.businessPerformance.totalOrders,
        icon: ShoppingCart,
        description: "Successful campaigns delivered",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        trend: "+23% this month"
      },
      {
        title: "Happy Clients",
        value: "1000+",
        icon: Users,
        description: "Businesses we've helped grow",
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        trend: "98.5% satisfaction"
      },
      {
        title: "Revenue Generated",
        value: ENHANCED_HERO_STATS.businessPerformance.totalRevenue,
        icon: DollarSign,
        description: "Total business value created",
        color: "text-yellow-700",
        bgColor: "bg-yellow-100",
        trend: "+34% growth"
      },
      {
        title: "Success Rate",
        value: ENHANCED_HERO_STATS.businessPerformance.successRate,
        icon: TrendingUp,
        description: "Campaigns achieving goals",
        color: "text-amber-700",
        bgColor: "bg-amber-100",
        trend: "Industry leading"
      }
    ]
  }
];

export function BusinessOverviewCards() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cardStyles }} />
      <div className="space-y-8">
      {businessStats.map((section, sectionIndex) => (
        <div key={section.section} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className={`w-2 h-10 rounded-full shadow-lg ${sectionIndex === 0 ? 'bg-gradient-to-b from-yellow-500 to-yellow-600' : 'bg-gradient-to-b from-amber-500 to-amber-600'}`} />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{section.section}</h2>
              <div className={`w-16 h-1 rounded-full ${sectionIndex === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 'bg-gradient-to-r from-amber-400 to-amber-500'}`} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {section.stats.map((stat, index) => (
              <Card 
                key={stat.title} 
                className="enhanced-card relative overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] border-0 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Animated border */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ padding: '1px' }}>
                  <div className="w-full h-full bg-white rounded-lg" />
                </div>
                
                <CardContent className="relative p-8">
                  {/* Icon with enhanced styling */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${stat.bgColor} mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                    <stat.icon className={`w-8 h-8 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  
                  <div className="space-y-3">
                    {/* Main value with enhanced typography */}
                    <div className="relative">
                      <p 
                        className="text-4xl font-black tracking-tight text-gray-900 group-hover:text-yellow-700 transition-colors duration-300" 
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {stat.value}
                      </p>
                      {/* Subtle glow effect */}
                      <div className="absolute inset-0 text-4xl font-black tracking-tight text-yellow-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {stat.value}
                      </div>
                    </div>
                    
                    {/* Title with better spacing */}
                    <p className="text-lg font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                      {stat.title}
                    </p>
                    
                    {/* Description with improved readability */}
                    <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {stat.description}
                    </p>
                    
                    {/* Enhanced trend badge */}
                    <div className="pt-3">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all duration-300 group-hover:scale-105 ${
                        stat.trend.includes('+') 
                          ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300/50' 
                          : 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-300/50'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          stat.trend.includes('+') ? 'bg-yellow-500' : 'bg-amber-500'
                        }`} />
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                  
                  {/* Subtle corner accent */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
      </div>
    </>
  );
}
