export interface CaseStudy {
  id: string;
  clientName: string;
  industry: string;
  trafficGrowthPercent: number;
  initialTraffic: string;
  finalTraffic: string;
  timeframe: string;
  keywordsTop3: number;
  domainRatingGrowth?: number;
  backlinksPerMonth?: number;
  description: string;
  color: string; // For visual theming
}

export interface DashboardMetrics {
  heroStats: {
    avgTrafficGrowth: string;
    totalTrafficReach: string;
    keywordsRanked: string;
    clientsServed: string;
  };
  aggregateData: {
    totalTrafficGenerated: number;
    avgGrowthTime: string;
    successRate: string;
    industriesServed: number;
  };
}

// Real case study data from EMIAC
export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "proteantech",
    clientName: "Proteantech",
    industry: "FinTech",
    trafficGrowthPercent: 933,
    initialTraffic: "1.45L",
    finalTraffic: "15.2L",
    timeframe: "6 months",
    keywordsTop3: 796,
    domainRatingGrowth: 11,
    description: "Financial technology platform achieved massive organic growth",
    color: "from-blue-500 to-cyan-600"
  },
  {
    id: "mahindra",
    clientName: "Mahindra Auto",
    industry: "Automotive",
    trafficGrowthPercent: 78.09,
    initialTraffic: "18.17L",
    finalTraffic: "32.37L",
    timeframe: "5 months",
    keywordsTop3: 3000,
    backlinksPerMonth: 75,
    description: "Leading automotive brand dominated search rankings",
    color: "from-red-500 to-orange-600"
  },
  {
    id: "upgrad",
    clientName: "UpGrad",
    industry: "EdTech",
    trafficGrowthPercent: 51.86,
    initialTraffic: "5.84L",
    finalTraffic: "8.87L", 
    timeframe: "5 months",
    keywordsTop3: 3000,
    backlinksPerMonth: 60,
    description: "Educational platform expanded digital reach significantly",
    color: "from-purple-500 to-pink-600"
  }
];

export const DASHBOARD_METRICS: DashboardMetrics = {
  heroStats: {
    avgTrafficGrowth: "933%",
    totalTrafficReach: "56.44L+",
    keywordsRanked: "6,796+",
    clientsServed: "50+"
  },
  aggregateData: {
    totalTrafficGenerated: 5644000,
    avgGrowthTime: "5.3 months",
    successRate: "100%",
    industriesServed: 12
  }
};

// Chart data for visualizations
export const GROWTH_CHART_DATA = [
  { month: "Month 1", proteantech: 145, mahindra: 1817, upgrad: 584 },
  { month: "Month 2", proteantech: 250, mahindra: 2100, upgrad: 650 },
  { month: "Month 3", proteantech: 420, mahindra: 2450, upgrad: 720 },
  { month: "Month 4", proteantech: 680, mahindra: 2800, upgrad: 780 },
  { month: "Month 5", proteantech: 1100, mahindra: 3237, upgrad: 887 },
  { month: "Month 6", proteantech: 1520, mahindra: 3237, upgrad: 887 }
];
