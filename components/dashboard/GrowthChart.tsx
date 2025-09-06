"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { GROWTH_CHART_DATA } from "@/lib/dashboard-data";

export function GrowthChart() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Traffic Growth Timeline</CardTitle>
        <p className="text-sm text-gray-600">Monthly traffic progression for our clients</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={GROWTH_CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => [`${value}K`, 'Traffic']}
                labelStyle={{ color: '#374151' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="proteantech" 
                stroke="#3B82F6" 
                strokeWidth={3}
                name="Proteantech"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="mahindra" 
                stroke="#EF4444" 
                strokeWidth={3}
                name="Mahindra Auto"
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="upgrad" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                name="UpGrad"
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
