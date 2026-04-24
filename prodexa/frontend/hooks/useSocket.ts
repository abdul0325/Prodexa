'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Singleton socket instance
let globalSocket: Socket | null = null;

export function useSocket() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('prodexa_token');
    if (!token) return;

    if (!globalSocket) {
      globalSocket = io(`${SOCKET_URL}/realtime`, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });
    }

    const socket = globalSocket;

    function onConnect() { setConnected(true); }
    function onDisconnect() { setConnected(false); }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    if (socket.connected) setConnected(true);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  const subscribeToProject = useCallback((projectId: string) => {
    globalSocket?.emit('subscribe:project', { projectId });
  }, []);

  const unsubscribeFromProject = useCallback((projectId: string) => {
    globalSocket?.emit('unsubscribe:project', { projectId });
  }, []);

  const on = useCallback((event: string, handler: (...args: any[]) => void) => {
    globalSocket?.on(event, handler);
    return () => { globalSocket?.off(event, handler); };
  }, []);

  return { connected, subscribeToProject, unsubscribeFromProject, on };
}

// ─── Project-specific real-time hook ────────────────────────────
export function useProjectRealtime(projectId: string) {
  const { subscribeToProject, unsubscribeFromProject, on, connected } = useSocket();
  const [analysisStatus, setAnalysisStatus] = useState<string>('IDLE');
  const [analysisMessage, setAnalysisMessage] = useState<string>('');
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [healthStatus, setHealthStatus] = useState<string>('');
  const [liveDevs, setLiveDevs] = useState<Record<string, any>>({});
  const [dashboardUpdated, setDashboardUpdated] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    subscribeToProject(projectId);

    const unsubs = [
      on('analysis:status', (data: any) => {
        if (data.projectId !== projectId) return;
        setAnalysisStatus(data.status);
        setAnalysisMessage(data.message || '');
        if (data.status === 'DONE') {
          setDashboardUpdated(true);
          setTimeout(() => setAnalysisStatus('IDLE'), 5000);
        }
      }),

      on('health:update', (data: any) => {
        if (data.projectId !== projectId) return;
        setHealthScore(data.healthScore);
        setHealthStatus(data.status);
      }),

      on('developer:activity', (data: any) => {
        if (data.projectId !== projectId) return;
        setLiveDevs(prev => ({
          ...prev,
          [data.developer]: { developer: data.developer, ...data.data },
        }));
      }),

      on('dashboard:update', (data: any) => {
        if (data.projectId !== projectId) return;
        setDashboardUpdated(true);
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
    liveDevs: Object.values(liveDevs),
    dashboardUpdated,
    resetDashboardUpdated: () => setDashboardUpdated(false),
  };
}

// ─── Notifications real-time hook ────────────────────────────────
export function useRealtimeNotifications(onNew: (notif: any) => void) {
  const { on } = useSocket();

  useEffect(() => {
    const unsub = on('notification:new', (data: any) => {
      onNew(data.notification);
    });
    return unsub;
  }, [onNew]);
}
