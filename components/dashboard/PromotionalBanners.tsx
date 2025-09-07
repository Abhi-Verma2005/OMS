"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Clock, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export function PromotionalBanners() {
  return (
    <div className="space-y-6">
      {/* 40K+ Sites Badge */}
      <Card className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">40K+ Premium Sites Available</h3>
                <p className="text-white/90">Access India's largest publisher network</p>
              </div>
            </div>
            <Badge className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
              40,000+ Sites
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Limited Offer Banner */}
      <Card className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Limited Time Offer</h3>
                <p className="text-white/90">Get 20% off your first campaign - Limited spots available!</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-white/80">Offer ends in</p>
                <p className="text-lg font-bold">48 hours</p>
              </div>
              <Button 
                className="bg-white text-amber-600 hover:bg-white/90 font-semibold"
                asChild
              >
                <Link href="/data">
                  Claim Offer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ExploreSitesCTA() {
  return (
    <Card className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Explore More Sites</h3>
              <p className="text-white/90">Discover 40K+ premium publishers across all niches</p>
            </div>
          </div>
          <Button 
            className="bg-white text-amber-600 hover:bg-white/90 font-semibold"
            asChild
          >
            <Link href="/data">
              Browse Sites
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
