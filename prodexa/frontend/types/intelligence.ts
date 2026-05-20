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
  totalRisks: number;
  risks: RiskItem[];
}

export interface EngineeringHealthResponse {
  score: number;
  status: string;
}