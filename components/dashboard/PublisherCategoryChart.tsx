"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { PUBLISHER_CATEGORIES } from "@/lib/enhanced-dashboard-data";

export function PublisherCategoryChart() {
  const COLORS = ['#3B82F6', '#10B981', '#EF4444', '#8B5CF6', '#F59E0B', '#EC4899', '#6B7280', '#6366F1'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Bar Chart - Publishers by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Publishers by Category</CardTitle>
          <p className="text-sm text-gray-600">Distribution across industry verticals</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PUBLISHER_CATEGORIES.slice(0, 6)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    `${value} publishers`,
                    'Count'
                  ]}
                />
                <Bar 
                  dataKey="count" 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart - Quality Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Distribution</CardTitle>
          <p className="text-sm text-gray-600">Average Domain Authority by category</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PUBLISHER_CATEGORIES.slice(0, 6)}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="avgDA"
                  label={({ name, avgDA }) => `${name}: ${avgDA} DA`}
                >
                  {PUBLISHER_CATEGORIES.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value} DA`, 'Average DA']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
