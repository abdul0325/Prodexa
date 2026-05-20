const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('prodexa_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Projects ───────────────────────────────
export const api = {
  projects: {
    list: () => request<any[]>('/projects'),
    create: (data: { name: string; repoUrl: string; ownerName: string }) =>
      request('/projects', { method: 'POST', body: JSON.stringify(data) }),
    analyze: (id: string) =>
      request(`/projects/${id}/analyze`, { method: 'POST' }),
    health: (id: string) => request<any>(`/projects/${id}/health`),
    leaderboard: (id: string) => request<any>(`/projects/${id}/leaderboard`),
    risk: (id: string) => request<any>(`/projects/${id}/risk`),
    summary: (id: string) => request<any>(`/projects/${id}/summary`),
  },

  // ─── Dashboard ──────────────────────────────
  dashboard: {
    get: (id: string) => request<any>(`/dashboard/project/${id}`),
    activity: (id: string) => request<any[]>(`/dashboard/project/${id}/activity`),
  },

  // ─── ML ─────────────────────────────────────
  ml: {
    analyze: (id: string) => request<any>(`/ml/project/${id}/analyze`, { method: 'POST' }),
    health: () => request<any>('/ml/health'),
  },

  // ─── Notifications ──────────────────────────
  notifications: {
    list: (unreadOnly = false) =>
      request<any[]>(`/notifications${unreadOnly ? '?unread=true' : ''}`),
    unreadCount: () => request<{ unreadCount: number }>('/notifications/unread-count'),
    markRead: (id: string) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
    markAllRead: () => request('/notifications/read-all', { method: 'PATCH' }),
    delete: (id: string) => request(`/notifications/${id}`, { method: 'DELETE' }),
  },

  // ─── Admin ──────────────────────────────────
  admin: {
    stats: () => request<any>('/admin/stats'),
    users: () => request<any[]>('/admin/users'),
    updateRole: (id: string, role: string) =>
      request(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
    updateStatus: (id: string, isActive: boolean) =>
      request(`/admin/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ isActive }) }),
    deleteUser: (id: string) => request(`/admin/users/${id}`, { method: 'DELETE' }),
    projects: () => request<any[]>('/admin/projects'),
    updateProjectStatus: (id: string, status: string) =>
      request(`/admin/projects/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    deleteProject: (id: string) => request(`/admin/projects/${id}`, { method: 'DELETE' }),
    auditLogs: () => request<any>('/admin/audit-logs'),
  },
};

export function saveToken(token: string) {
  localStorage.setItem('prodexa_token', token);
}

export function clearToken() {
  localStorage.removeItem('prodexa_token');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export const getAnalyticsOverview =
  async () => {

    const response = await fetch(
      'http://localhost:3001/analytics/overview'
    );

    return response.json();
  };

export const getPRInsights =
  async () => {

    const response = await fetch(
      'http://localhost:3001/analytics/pr-insights'
    );

    return response.json();
  };

export const getCommitActivity =
  async () => {

    const response = await fetch(
      'http://localhost:3001/analytics/commit-activity'
    );

    return response.json();
  };

export const getKPIs =
  async () => {

    const response = await fetch(
      'http://localhost:3001/analytics/kpis'
    );

    return response.json();
  };

export const getEngineeringHealth =
  async () => {

    const response = await fetch(
      'http://localhost:3001/analytics/engineering-health'
    );

    return response.json();
  };

export const getRiskDetection =
  async () => {

    const response = await fetch(
      'http://localhost:3001/analytics/risk-detection'
    );

    return response.json();
  };

export const getAIInsights =
  async () => {

    const response = await fetch(
      'http://localhost:3001/analytics/ai-insights'
    );

    return response.json();
  };

export async function fetchAIInsights(
  projectId: string,
) {

  const response = await fetch(
    `http://localhost:3001/analytics/${projectId}/ai-insights`,
    {
      cache: 'no-store',
    }
  );

  return response.json();
}

export async function fetchRiskDetection(projectId: string) {

  const response = await fetch(
    `http://localhost:3001/analytics/${projectId}/risk-detection`,
    {
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch risk detection');
  }

  return response.json();
}

export async function fetchEngineeringHealth(projectId: string,) {

  const response = await fetch(
    `http://localhost:3001/analytics/${projectId}/engineering-health`,
    {
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch engineering health');
  }

  return response.json();
}


export async function fetchProjectTrends(
  projectId: string,
) {

  const response = await fetch(
    `http://localhost:3001/analytics/${projectId}/trends`,
    {
      cache: 'no-store',
    },
  );

  if (!response.ok) {

    throw new Error(
      'Failed to fetch trends',
    );
  }

  return response.json();
}

export async function fetchProjectDeltas(
  projectId: string,
) {

  const response = await fetch(
    `http://localhost:3001/analytics/${projectId}/deltas`,
    {
      cache: 'no-store',
    },
  );

  if (!response.ok) {

    throw new Error(
      'Failed to fetch deltas',
    );
  }

  return response.json();
}

export async function fetchForecast(
  projectId: string,
) {

  const response = await fetch(
    `http://localhost:3001/analytics/${projectId}/forecast`,
    {
      cache: 'no-store',
    },
  );

  if (!response.ok) {

    throw new Error(
      'Failed to fetch forecast',
    );
  }

  return response.json();
}

export async function fetchExecutiveSummary(
  projectId: string,
) {

  const response = await fetch(
    `http://localhost:3001/analytics/${projectId}/executive-summary`,
    {
      cache: 'no-store',
    },
  );

  if (!response.ok) {

    throw new Error(
      'Failed to fetch executive summary',
    );
  }

  return response.json();
}