import { ManagerOverview } from "@/types/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL!;

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('prodexa_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    cache: 'no-store',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {

    if (res.status === 401) {

      clearToken();

      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }

    const err =
      await res.json().catch(() => ({
        message: 'Request failed',
      }));

    throw new Error(
      err.message || `HTTP ${res.status}`
    );
  }

  return res.json();
}

// ─── Projects ───────────────────────────────
export const api = {
  manager: {
    overview: () =>
      request<ManagerOverview>(
        '/manager/overview',
      ),
  },
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

  // ─── Admin frontend/lib/api.ts ──────────────────────────────────
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

export function getUserRole() {

  if (
    typeof window === 'undefined'
  ) {

    return null;
  }

  const token =
    localStorage.getItem(
      'prodexa_token',
    );

  if (!token) {

    return null;
  }

  try {

    const payload =
      JSON.parse(
        atob(
          token.split('.')[1],
        ),
      );

    console.log(payload);
    return payload.role;

  } catch {

    return null;
  }
}
export const getAnalyticsOverview =
  async () => {

    return request(
      '/analytics/overview'
    );
  };

export const getPRInsights =
  async () => {

    return request(
      '/analytics/pr-insights'
    );
  };

export const getCommitActivity =
  async () => {

    return request(
      '/analytics/commit-activity'
    );
  };

export const getKPIs =
  async () => {

    return request(
      '/analytics/kpis'
    );
  };

export const getEngineeringHealth =
  async () => {

    return request(
      '/analytics/engineering-health'
    );
  };

export const getRiskDetection =
  async () => {

    return request(
      '/analytics/risk-detection'
    );
  };

export const getAIInsights =
  async () => {

    return request(
      '/analytics/ai-insights'
    );
  };

export async function fetchAIInsights(
  projectId: string,
) {
  return request(
    `/analytics/${projectId}/ai-insights`
  );
}

export async function fetchRiskDetection(
  projectId: string,
) {
  return request(
    `/analytics/${projectId}/risk-detection`
  );
}

export async function fetchEngineeringHealth(
  projectId: string,
) {
  return request(
    `/analytics/${projectId}/engineering-health`
  );
}

export async function fetchProjectTrends(
  projectId: string,
) {
  return request(
    `/analytics/${projectId}/trends`
  );
}

export async function fetchProjectDeltas(
  projectId: string,
) {
  return request(
    `/analytics/${projectId}/deltas`
  );
}

export async function fetchForecast(
  projectId: string,
) {
  return request(
    `/analytics/${projectId}/forecast`
  );
}

export async function fetchExecutiveSummary(
  projectId: string,
) {
  return request(
    `/analytics/${projectId}/executive-summary`
  );
}

export async function fetchProjectLeaderboard(
  projectId: string,
) {
  return request(
    `/projects/${projectId}/leaderboard`
  );
}

export async function fetchProjectRisk(
  projectId: string,
) {
  return request(
    `/projects/${projectId}/risk`
  );
}