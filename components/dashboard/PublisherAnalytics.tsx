"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PUBLISHER_CATEGORIES } from "@/lib/enhanced-dashboard-data";
import { TrendingUp, Globe, Star, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";

export function PublisherAnalytics() {
  const topPerformingCategories = PUBLISHER_CATEGORIES
    .sort((a, b) => (b.avgDA * b.count) - (a.avgDA * a.count))
    .slice(0, 4);

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Publisher Analytics</CardTitle>
          <p className="text-sm text-gray-600">Performance insights across our network</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/data">
            View Full Analytics
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 mb-3">Top Performing Categories</h4>
            {topPerformingCategories.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${category.color}`} />
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-xs text-gray-600">{category.count} publishers available</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{category.avgDA} DA</p>
                    <p className="text-xs text-gray-600">Avg Quality</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-600">${category.avgPrice}</p>
                    <p className="text-xs text-gray-600">Avg Price</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    #{index + 1}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Network Health Metrics */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 mb-3">Network Health</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-900">Global Reach</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">15</p>
                <p className="text-xs text-blue-700">Countries Covered</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-green-900">Quality Score</span>
                </div>
                <p className="text-2xl font-bold text-green-600">65</p>
                <p className="text-xs text-green-700">Average DA</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-medium text-purple-900">Growth Rate</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">+12%</p>
                <p className="text-xs text-purple-700">Monthly Addition</p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-medium text-orange-900">Avg ROI</span>
                </div>
                <p className="text-2xl font-bold text-orange-600">354%</p>
                <p className="text-xs text-orange-700">Client Returns</p>
              </div>
            </div>

            <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Quality Guarantee:</strong> All publishers verified with minimum 40+ DA
              </p>
              <Badge className="bg-green-100 text-green-800">
                ✓ 100% Spam-Free Network
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
