export interface ManagerOverview {

  kpis: {

    totalProjects: number;

    healthyProjects: number;

    mediumRiskProjects: number;

    highRiskProjects: number;

    totalDevelopers: number;
  };

  projects: {

    id: string;

    name: string;

    healthScore: number;

    risk: string;

    developersCount: number;

    status: string;

  }[];

  developers: {

    developerLogin: string;

    projectsCount: number;

    totalCommits: number;

    averageProductivity: number;

  }[];

  risks: {

    type: string;

    title: string;

    message: string;

  }[];
}