"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CASE_STUDIES } from "@/lib/dashboard-data";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

export function CaseStudiesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = CASE_STUDIES[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % CASE_STUDIES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + CASE_STUDIES.length) % CASE_STUDIES.length);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Client Success Stories</h2>
          <p className="text-gray-600">Real results from real clients</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={prevSlide}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextSlide}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r ${current.color} opacity-5`} />
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${current.color} flex items-center justify-center text-white font-bold text-lg`}>
                {current.clientName[0]}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{current.clientName}</h3>
                <p className="text-sm text-gray-600">{current.industry}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-green-600">+{current.trafficGrowthPercent}%</p>
              <p className="text-sm text-gray-600">Traffic Growth</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-700">{current.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-lg font-semibold">{current.initialTraffic}</p>
              <p className="text-xs text-gray-600">Initial Traffic</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-lg font-semibold text-green-600">{current.finalTraffic}</p>
              <p className="text-xs text-gray-600">Final Traffic</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-lg font-semibold">{current.timeframe}</p>
              <p className="text-xs text-gray-600">Timeframe</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-lg font-semibold">{current.keywordsTop3.toLocaleString()}</p>
              <p className="text-xs text-gray-600">Top 3 Keywords</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="flex-1">
              Get Similar Results
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline">View Full Case Study</Button>
          </div>
        </CardContent>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 pb-6">
          {CASE_STUDIES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-gray-800" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
