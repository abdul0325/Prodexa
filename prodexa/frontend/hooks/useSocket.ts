'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('prodexa_token');
    if (!token) return;

    const socket = io(`${SOCKET_URL}/realtime`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      setConnected(true);
      console.log('🔌 WebSocket connected');
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('🔌 WebSocket disconnected');
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  const subscribeToProject = useCallback((projectId: string) => {
    socketRef.current?.emit('subscribe:project', { projectId });
  }, []);

  const unsubscribeFromProject = useCallback((projectId: string) => {
    socketRef.current?.emit('unsubscribe:project', { projectId });
  }, []);

  const on = useCallback((event: string, handler: (...args: any[]) => void) => {
    socketRef.current?.on(event, handler);
    return () => socketRef.current?.off(event, handler);
  }, []);

  return { socket: socketRef.current, connected, subscribeToProject, unsubscribeFromProject, on };
}

// ─── Project-specific hook ───────────────────────────────────────

export function useProjectRealtime(projectId: string) {
  const { subscribeToProject, unsubscribeFromProject, on, connected } = useSocket();
  const [analysisStatus, setAnalysisStatus] = useState<string>('IDLE');
  const [analysisMessage, setAnalysisMessage] = useState<string>('');
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [healthStatus, setHealthStatus] = useState<string>('');
  const [liveDevActivity, setLiveDevActivity] = useState<any[]>([]);
  const [dashboardUpdated, setDashboardUpdated] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    subscribeToProject(projectId);

    const unsubs = [
      on('analysis:status', (data: any) => {
        if (data.projectId === projectId) {
          setAnalysisStatus(data.status);
          setAnalysisMessage(data.message || '');
          if (data.status === 'DONE') setDashboardUpdated(true);
        }
      }),

      on('health:update', (data: any) => {
        if (data.projectId === projectId) {
          setHealthScore(data.healthScore);
          setHealthStatus(data.status);
        }
      }),

      on('developer:activity', (data: any) => {
        if (data.projectId === projectId) {
          setLiveDevActivity(prev => {
            const exists = prev.find(d => d.developer === data.developer);
            if (exists) {
              return prev.map(d => d.developer === data.developer ? { ...d, ...data.data } : d);
            }
            return [...prev, { developer: data.developer, ...data.data }];
          });
        }
      }),

      on('dashboard:update', (data: any) => {
        if (data.projectId === projectId) {
          setDashboardUpdated(true);
        }
      }),
    ];

    return () => {
      unsubs.forEach(fn => fn?.());
      unsubscribeFromProject(projectId);
    };
  }, [projectId, connected]);

  return {
    analysisStatus,
    analysisMessage,
    healthScore,
    healthStatus,
    liveDevActivity,
    dashboardUpdated,
    resetDashboardUpdated: () => setDashboardUpdated(false),
  };
}

// ─── Notifications real-time hook ────────────────────────────────

export function useRealtimeNotifications(onNew: (notif: any) => void) {
  const { on, connected } = useSocket();

  useEffect(() => {
    const unsub = on('notification:new', (data: any) => {
      onNew(data.notification);
    });
    return unsub;
  }, [connected, onNew]);
}
