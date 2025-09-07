"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TOP_INDIAN_CLIENTS, CLIENT_TESTIMONIALS } from "@/lib/enhanced-dashboard-data";
import { Star, TrendingUp, Users, Award } from "lucide-react";
import Image from "next/image";

export function TopIndianClients() {
  return (
    <div className="space-y-8">
      {/* Top Indian Clients Logo Grid */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Top Indian Clients</CardTitle>
          <p className="text-gray-600">Trusted by leading brands across India</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {TOP_INDIAN_CLIENTS.map((client, index) => (
              <div key={client.name} className="flex flex-col items-center space-y-2 group">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-900">{client.name}</p>
                  <p className="text-xs text-gray-500">{client.industry}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Client Testimonials with ROI Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Client Success Stories
          </CardTitle>
          <p className="text-gray-600">Real results from our top Indian clients</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CLIENT_TESTIMONIALS.map((testimonial, index) => (
              <div key={testimonial.client} className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Image
                      src={testimonial.logo}
                      alt={testimonial.client}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.client}</h4>
                    <p className="text-sm text-gray-600">{testimonial.industry}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 italic">"{testimonial.testimonial}"</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{testimonial.roi}</p>
                    <p className="text-xs text-gray-600">{testimonial.metric}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Success
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          {/* Success Stats Summary */}
          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center">
                <Users className="w-8 h-8 text-blue-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">1000+</p>
                <p className="text-sm text-gray-600">Happy Clients</p>
              </div>
              <div className="flex flex-col items-center">
                <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">98.5%</p>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
              <div className="flex flex-col items-center">
                <Award className="w-8 h-8 text-purple-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">450%</p>
                <p className="text-sm text-gray-600">Avg ROI</p>
              </div>
              <div className="flex flex-col items-center">
                <Star className="w-8 h-8 text-yellow-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">4.9/5</p>
                <p className="text-sm text-gray-600">Client Rating</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
