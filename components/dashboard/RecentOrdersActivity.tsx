"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RECENT_ORDERS } from "@/lib/enhanced-dashboard-data";
import { ExternalLink, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export function RecentOrdersActivity() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800',
      processing: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800'
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Order Activity</CardTitle>
          <p className="text-sm text-gray-600">Latest campaigns and their results</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/orders">
            View All Orders
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {RECENT_ORDERS.map((order) => (
            <div 
              key={order.id} 
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <Badge className={getStatusBadge(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900">{order.clientName}</p>
                    <span className="text-gray-400">•</span>
                    <p className="text-sm text-blue-600 font-medium">{order.publisherDomain}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>Order #{order.id}</span>
                    <span>${order.amount.toLocaleString()}</span>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>
                
                {order.result && (
                  <div className="text-right">
                    <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                      {order.result}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Showing 5 of 1,247 total orders</span>
            <div className="flex gap-4">
              <span>• <strong>89%</strong> completed this month</span>
              <span>• <strong>$156K</strong> total value</span>
              <span>• <strong>4.2 days</strong> avg completion</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
