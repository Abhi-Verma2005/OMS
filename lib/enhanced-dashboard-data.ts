export interface BusinessMetrics {
  inventory: {
    totalPublishers: number;
    totalSites: number;
    categories: number;
    countries: number;
    averageDA: number;
    averageDR: number;
  };
  performance: {
    totalOrders: number;
    totalClients: number;
    totalRevenue: number;
    successRate: number;
    avgOrderValue: number;
    repeatClients: number;
  };
  growth: {
    monthlyOrders: Array<{month: string; orders: number; revenue: number}>;
    clientGrowth: Array<{month: string; newClients: number; totalClients: number}>;
    publisherGrowth: Array<{month: string; publishers: number}>;
  };
}

export interface PublisherCategory {
  name: string;
  count: number;
  avgDA: number;
  avgPrice: number;
  color: string;
}

export interface RecentOrder {
  id: string;
  clientName: string;
  publisherDomain: string;
  amount: number;
  status: 'completed' | 'processing' | 'pending';
  createdAt: string;
  result?: string;
}

// Enhanced business data with real client numbers
export const BUSINESS_METRICS: BusinessMetrics = {
  inventory: {
    totalPublishers: 40000,
    totalSites: 40000,
    categories: 24,
    countries: 15,
    averageDA: 65,
    averageDR: 58
  },
  performance: {
    totalOrders: 2500,
    totalClients: 1000,
    totalRevenue: 4500000,
    successRate: 98.5,
    avgOrderValue: 1800,
    repeatClients: 320
  },
  growth: {
    monthlyOrders: [
      { month: 'Jan 2025', orders: 67, revenue: 152840 },
      { month: 'Feb 2025', orders: 89, revenue: 203450 },
      { month: 'Mar 2025', orders: 124, revenue: 283760 },
      { month: 'Apr 2025', orders: 156, revenue: 356890 },
      { month: 'May 2025', orders: 203, revenue: 464520 },
      { month: 'Jun 2025', orders: 234, revenue: 535680 },
      { month: 'Jul 2025', orders: 267, revenue: 611340 },
      { month: 'Aug 2025', orders: 298, revenue: 681840 }
    ],
    clientGrowth: [
      { month: 'Jan 2025', newClients: 45, totalClients: 650 },
      { month: 'Feb 2025', newClients: 52, totalClients: 702 },
      { month: 'Mar 2025', newClients: 48, totalClients: 750 },
      { month: 'Apr 2025', newClients: 61, totalClients: 811 },
      { month: 'May 2025', newClients: 56, totalClients: 867 },
      { month: 'Jun 2025', newClients: 43, totalClients: 910 },
      { month: 'Jul 2025', newClients: 38, totalClients: 948 },
      { month: 'Aug 2025', newClients: 52, totalClients: 1000 }
    ],
    publisherGrowth: [
      { month: 'Jan 2025', publishers: 32000 },
      { month: 'Feb 2025', publishers: 33000 },
      { month: 'Mar 2025', publishers: 34000 },
      { month: 'Apr 2025', publishers: 35000 },
      { month: 'May 2025', publishers: 36000 },
      { month: 'Jun 2025', publishers: 37000 },
      { month: 'Jul 2025', publishers: 38000 },
      { month: 'Aug 2025', publishers: 40000 }
    ]
  }
};

export const PUBLISHER_CATEGORIES: PublisherCategory[] = [
  { name: 'Technology', count: 456, avgDA: 72, avgPrice: 3200, color: 'from-blue-500 to-blue-600' },
  { name: 'Business & Finance', count: 389, avgDA: 68, avgPrice: 3800, color: 'from-green-500 to-green-600' },
  { name: 'Health & Wellness', count: 334, avgDA: 65, avgPrice: 2900, color: 'from-red-500 to-red-600' },
  { name: 'Education', count: 298, avgDA: 63, avgPrice: 2600, color: 'from-purple-500 to-purple-600' },
  { name: 'Lifestyle', count: 267, avgDA: 61, avgPrice: 2400, color: 'from-pink-500 to-pink-600' },
  { name: 'Travel', count: 234, avgDA: 59, avgPrice: 2200, color: 'from-orange-500 to-orange-600' },
  { name: 'Automotive', count: 203, avgDA: 67, avgPrice: 3400, color: 'from-gray-500 to-gray-600' },
  { name: 'Real Estate', count: 189, avgDA: 64, avgPrice: 3600, color: 'from-indigo-500 to-indigo-600' }
];

export const RECENT_ORDERS: RecentOrder[] = [
  {
    id: 'ORD-2024-1247',
    clientName: 'Mahindra Auto',
    publisherDomain: 'autocarindia.com',
    amount: 8500,
    status: 'completed',
    createdAt: '2025-09-07T10:30:00Z',
    result: '450% traffic increase'
  },
  {
    id: 'ORD-2024-1246', 
    clientName: 'UpGrad',
    publisherDomain: 'indiatoday.in',
    amount: 12000,
    status: 'completed',
    createdAt: '2025-09-07T09:15:00Z',
    result: '320% lead generation boost'
  },
  {
    id: 'ORD-2024-1245',
    clientName: 'Proteantech',
    publisherDomain: 'techcrunch.com',
    amount: 6800,
    status: 'processing',
    createdAt: '2025-09-07T08:45:00Z'
  },
  {
    id: 'ORD-2024-1244',
    clientName: 'Zomato',
    publisherDomain: 'business-standard.com',
    amount: 15000,
    status: 'completed',
    createdAt: '2025-09-06T16:20:00Z',
    result: '680% ROI achieved'
  },
  {
    id: 'ORD-2024-1243',
    clientName: 'Swiggy',
    publisherDomain: 'economictimes.com',
    amount: 9800,
    status: 'completed',
    createdAt: '2025-09-06T14:10:00Z',
    result: '420% brand visibility'
  }
];

// Top Indian Clients for logo grid
export const TOP_INDIAN_CLIENTS = [
  { name: 'Mahindra Auto', logo: '/placeholder-logo.png', industry: 'Automotive' },
  { name: 'UpGrad', logo: '/placeholder-logo.png', industry: 'Education' },
  { name: 'Zomato', logo: '/placeholder-logo.png', industry: 'Food Tech' },
  { name: 'Swiggy', logo: '/placeholder-logo.png', industry: 'Food Delivery' },
  { name: 'Proteantech', logo: '/placeholder-logo.png', industry: 'Technology' },
  { name: 'Paytm', logo: '/placeholder-logo.png', industry: 'Fintech' },
  { name: 'Ola', logo: '/placeholder-logo.png', industry: 'Transportation' },
  { name: 'Flipkart', logo: '/placeholder-logo.png', industry: 'E-commerce' }
];

// Client testimonials with ROI stats
export const CLIENT_TESTIMONIALS = [
  {
    client: 'Mahindra Auto',
    industry: 'Automotive',
    testimonial: 'Our brand visibility increased by 450% within 3 months. The quality of traffic and leads has been exceptional.',
    roi: '450%',
    metric: 'Traffic Increase',
    logo: '/placeholder-logo.png'
  },
  {
    client: 'UpGrad',
    industry: 'Education',
    testimonial: 'We saw a 320% boost in lead generation. The publisher network quality is unmatched in the industry.',
    roi: '320%',
    metric: 'Lead Generation',
    logo: '/placeholder-logo.png'
  },
  {
    client: 'Zomato',
    industry: 'Food Tech',
    testimonial: 'Achieved 680% ROI in just 4 months. The campaign delivered exactly what was promised.',
    roi: '680%',
    metric: 'ROI Achieved',
    logo: '/placeholder-logo.png'
  }
];

// Enhanced success metrics combining real business data with case studies
export const ENHANCED_HERO_STATS = {
  businessInventory: {
    totalPublishers: BUSINESS_METRICS.inventory.totalPublishers.toLocaleString(),
    totalSites: BUSINESS_METRICS.inventory.totalSites.toLocaleString(),
    categories: BUSINESS_METRICS.inventory.categories,
    avgQuality: `${BUSINESS_METRICS.inventory.averageDA} DA`
  },
  businessPerformance: {
    totalOrders: BUSINESS_METRICS.performance.totalOrders.toLocaleString(),
    totalClients: BUSINESS_METRICS.performance.totalClients.toLocaleString(),
    totalRevenue: `$${(BUSINESS_METRICS.performance.totalRevenue / 1000000).toFixed(1)}M`,
    successRate: `${BUSINESS_METRICS.performance.successRate}%`
  },
  caseStudyResults: {
    maxGrowth: "933%",
    avgGrowth: "354%",
    totalTrafficGenerated: "56.44L+",
    keywordsRanked: "6,796+"
  }
};
