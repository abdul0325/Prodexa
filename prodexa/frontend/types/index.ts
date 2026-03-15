// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER';
  isActive: boolean;
  createdAt: string;
}

// ─────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────
export interface Project {
  id: string;
  name: string;
  repoUrl: string;
  ownerName: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  userId: string;
}

export interface CreateProjectDto {
  name: string;
  repoUrl: string;
  ownerName: string;
}

// ─────────────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────────────
export interface ProjectHealth {
  projectId: string;
  healthScore: number;
  status: 'Excellent' | 'Healthy' | 'Moderate' | 'Risky';
  metrics: {
    totalCommits: number;
    totalPRs: number;
    totalIssues: number;
    activeDevelopers: number;
  };
}

export interface Developer {
  developerLogin: string;
  commits: number;
  prs: number;
  issues: number;
  productivityScore: number;
  predictedScore?: number;
}

export interface DeveloperRisk {
  developer: string;
  lastActive: string;
  daysSinceLastCommit: number;
  risk: 'Active' | 'Inactive';
}

export interface DashboardData {
  projectId: string;
  healthScore: number;
  healthStatus: string;
  metrics: {
    totalCommits: number;
    totalPRs: number;
    totalIssues: number;
  };
  leaderboard: {
    totals: { totalCommits: number; totalPRs: number; totalIssues: number };
    developers: Developer[];
  };
  developerRisk: DeveloperRisk[];
}

export interface ActivityPoint {
  activityTimestamp: string;
  commitFrequency: number;
  pullRequestCount: number;
  issueCount: number;
}

// ─────────────────────────────────────────────
// ML PREDICTIONS
// ─────────────────────────────────────────────
export interface MLPrediction {
  projectId: string;
  projectScore: number;
  deliveryRisk: 'Low' | 'Medium' | 'High';
  workloadForecast: number;
  teamHealthStatus: 'Excellent' | 'Good' | 'Moderate' | 'Risky';
  developers: {
    developerLogin: string;
    commits: number;
    pullRequestCount: number;
    issueCount: number;
    currentScore: number;
    predictedScore: number;
    trend: 'improving' | 'stable' | 'declining';
    riskLevel: 'Low' | 'Medium' | 'High';
  }[];
  generatedAt: string;
}

// ─────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────
export interface Notification {
  id: string;
  type: 'PRODUCTIVITY_DROP' | 'HIGH_DELIVERY_RISK' | 'INACTIVE_DEVELOPER' | 'ANALYSIS_COMPLETE' | 'SYSTEM_ALERT';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  project?: { id: string; name: string };
}

// ─────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────
export interface AdminStats {
  users: { total: number; active: number; inactive: number };
  projects: { total: number; active: number; inactive: number };
  totalAnalyses: number;
}

export interface AuditLog {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
}
