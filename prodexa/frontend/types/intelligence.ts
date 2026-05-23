export interface AIInsightsResponse {
  totalInsights: number;
  insights: string[];
}

export interface RiskItem {
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  category: string;
  title: string;
  description: string;
  recommendation?: string;
}

export interface RiskDetectionResponse {
  deliveryRisk: string;
  signals: {
    noiseRatio: number;
    testingRatio: number;
    hotspotCount: number;
    avgRiskScore: number;
  };
  reasons: string[];
}

export interface EngineeringHealthResponse {
  score: number;
  status: string;
}