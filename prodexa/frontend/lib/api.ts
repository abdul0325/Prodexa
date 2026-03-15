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
