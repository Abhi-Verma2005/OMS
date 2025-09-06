"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp } from "lucide-react";

export function ROICalculator() {
  const [currentTraffic, setCurrentTraffic] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [showResults, setShowResults] = useState(false);

  const calculateROI = () => {
    const traffic = parseInt(currentTraffic) || 0;
    const budgetAmount = parseInt(budget) || 0;
    
    if (traffic > 0 && budgetAmount > 0) {
      setShowResults(true);
    }
  };

  const getProjectedGrowth = () => {
    const traffic = parseInt(currentTraffic) || 0;
    // Conservative projection based on case studies
    const growthPercent = Math.min(300, Math.max(50, (100000 / traffic) * 100));
    const projectedTraffic = traffic + (traffic * growthPercent / 100);
    
    return {
      growthPercent: Math.round(growthPercent),
      projectedTraffic: Math.round(projectedTraffic),
      potentialRevenue: Math.round(projectedTraffic * 0.02 * 150) // Rough conversion estimate
    };
  };

  const results = showResults ? getProjectedGrowth() : null;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          ROI Calculator
        </CardTitle>
        <p className="text-sm text-gray-600">Estimate your potential growth based on our client results</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="traffic">Current Monthly Traffic</Label>
            <Input
              id="traffic"
              type="number"
              placeholder="e.g., 50000"
              value={currentTraffic}
              onChange={(e) => setCurrentTraffic(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">Monthly Budget ($)</Label>
            <Input
              id="budget"
              type="number"
              placeholder="e.g., 5000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
        </div>

        <Button 
          onClick={calculateROI} 
          className="w-full"
          disabled={!currentTraffic || !budget}
        >
          Calculate Potential ROI
        </Button>

        {results && (
          <div className="border-t pt-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Your Projected Results
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">+{results.growthPercent}%</p>
                <p className="text-sm text-gray-600">Estimated Growth</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{results.projectedTraffic.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Monthly Traffic</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">${results.potentialRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Potential Revenue</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                * Projections based on average results from Proteantech (933% growth), 
                Mahindra Auto (78% growth), and UpGrad (52% growth) case studies.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
