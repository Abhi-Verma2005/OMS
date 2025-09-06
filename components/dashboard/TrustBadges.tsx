"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Award, Zap, Users } from "lucide-react";

const trustElements = [
  {
    icon: Shield,
    title: "100% Success Rate",
    subtitle: "Every client achieved growth",
    color: "text-green-600"
  },
  {
    icon: Award,
    title: "Proven Results",
    subtitle: "Verified by 3rd party analytics",
    color: "text-blue-600"
  },
  {
    icon: Zap,
    title: "Fast Results",
    subtitle: "Average 5.3 months to success",
    color: "text-orange-600"
  },
  {
    icon: Users,
    title: "Trusted by Leaders",
    subtitle: "Mahindra, UpGrad, Proteantech",
    color: "text-purple-600"
  }
];

export function TrustBadges() {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustElements.map((element, index) => (
            <div key={element.title} className="flex items-center gap-3 group">
              <div className={`p-2 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors`}>
                <element.icon className={`w-5 h-5 ${element.color}`} />
              </div>
              <div>
                <p className="font-medium text-sm">{element.title}</p>
                <p className="text-xs text-gray-600">{element.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t text-center">
          <div className="flex justify-center gap-2 mb-2">
            <Badge variant="secondary">Automotive</Badge>
            <Badge variant="secondary">FinTech</Badge>
            <Badge variant="secondary">EdTech</Badge>
            <Badge variant="secondary">Healthcare</Badge>
          </div>
          <p className="text-sm text-gray-600">Industries we've successfully served</p>
        </div>
      </CardContent>
    </Card>
  );
}
