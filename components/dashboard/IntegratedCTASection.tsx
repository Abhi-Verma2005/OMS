"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, ShoppingCart, Calendar, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function IntegratedCTASection() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleNavigation = async (path: string, buttonId: string) => {
    setIsLoading(buttonId);
    
    // Add slight delay for better UX
    setTimeout(() => {
      router.push(path);
      setIsLoading(null);
    }, 300);
  };

  const ctaOptions = [
    {
      id: "browse",
      title: "Browse Publishers",
      description: "Explore 2,847+ high-quality publishers",
      icon: Search,
      path: "/data", // Your actual publisher listing page
      variant: "default" as const,
      stats: "24 categories • 65 avg DA"
    },
    {
      id: "cart",
      title: "View Cart",
      description: "Complete your publisher selection",
      icon: ShoppingCart,
      path: "/cart", // Your cart page
      variant: "outline" as const,
      stats: "Quick checkout • Instant delivery"
    },
    {
      id: "consultation",
      title: "Book Consultation",
      description: "Get personalized recommendations",
      icon: Calendar,
      path: "/profile", // Your consultation booking page
      variant: "outline" as const,
      stats: "Free 30-min session • Expert advice"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Success Achievement Banner */}
      <Card className="bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-black/10" />
        <CardContent className="relative p-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-200" />
            <Badge className="bg-white/20 text-white border-white/30">
              98.5% Success Rate
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              2,500+ Orders Delivered
            </Badge>
          </div>
          
          <h2 className="text-3xl font-bold mb-2">
            Join 1,000+ Successful Clients
          </h2>
          <p className="text-white/90 mb-6 text-lg">
            From startups to enterprises like Mahindra & UpGrad - achieve measurable results with our proven publisher network
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-yellow-200">680%</p>
              <p className="text-white/80 text-sm">Peak Growth Achieved</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-200">4.2 months</p>
              <p className="text-white/80 text-sm">Average Time to Success</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-200">$4.5M+</p>
              <p className="text-white/80 text-sm">Client Revenue Generated</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ctaOptions.map((option) => (
          <Card key={option.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-yellow-50 group-hover:bg-yellow-100 transition-colors">
                  <option.icon className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{option.title}</h3>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{option.description}</p>
              <p className="text-xs text-gray-500 mb-4">{option.stats}</p>
              
              <Button
                variant={option.variant}
                className="w-full group"
                onClick={() => handleNavigation(option.path, option.id)}
                disabled={isLoading === option.id}
              >
                {isLoading === option.id ? (
                  "Loading..."
                ) : (
                  <>
                    {option.title}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats Footer */}
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span>🚀 <strong>267</strong> campaigns this month</span>
              <span>⚡ <strong>4.2 days</strong> average delivery</span>
              <span>💎 <strong>156</strong> repeat clients</span>
              <span>🎯 <strong>24/7</strong> support available</span>
            </div>
            
            <div className="flex gap-2">
              <Badge variant="outline">Live Support</Badge>
              <Badge variant="outline">Money Back Guarantee</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
