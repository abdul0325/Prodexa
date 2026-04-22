import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/realtime',
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RealtimeGateway.name);

  // Track which user is on which socket
  private userSockets = new Map<string, string[]>(); // userId → socketIds[]

  constructor(private jwtService: JwtService) {}

  // ─────────────────────────────────────────────
  // CONNECTION LIFECYCLE
  // ─────────────────────────────────────────────

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      client.data.userId = payload.sub;
      client.data.email = payload.email;

      // Track socket for this user
      const existing = this.userSockets.get(payload.sub) || [];
      this.userSockets.set(payload.sub, [...existing, client.id]);

      // Join user-specific room
      client.join(`user:${payload.sub}`);

      this.logger.log(`Client connected: ${client.id} (user: ${payload.email})`);

    } catch (e) {
      this.logger.warn(`Unauthorized connection attempt: ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId;
    if (userId) {
      const sockets = this.userSockets.get(userId) || [];
      this.userSockets.set(userId, sockets.filter(id => id !== client.id));
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // ─────────────────────────────────────────────
  // CLIENT EVENTS (subscribe to project room)
  // ─────────────────────────────────────────────

  @SubscribeMessage('subscribe:project')
  handleSubscribeProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { projectId: string },
  ) {
    client.join(`project:${data.projectId}`);
    this.logger.log(`Socket ${client.id} subscribed to project:${data.projectId}`);
    return { event: 'subscribed', projectId: data.projectId };
  }

  @SubscribeMessage('unsubscribe:project')
  handleUnsubscribeProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { projectId: string },
  ) {
    client.leave(`project:${data.projectId}`);
    return { event: 'unsubscribed', projectId: data.projectId };
  }

  // ─────────────────────────────────────────────
  // SERVER EMIT METHODS (called from services)
  // ─────────────────────────────────────────────

  /** Emit analysis status update to everyone watching a project */
  emitAnalysisStatus(projectId: string, status: string, message?: string) {
    this.server.to(`project:${projectId}`).emit('analysis:status', {
      projectId,
      status,        // QUEUED | ANALYZING | DONE | FAILED
      message,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Emitted analysis:status → project:${projectId} [${status}]`);
  }

  /** Emit dashboard update when analysis completes */
  emitDashboardUpdate(projectId: string, data: any) {
    this.server.to(`project:${projectId}`).emit('dashboard:update', {
      projectId,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  /** Emit new notification to a specific user */
  emitNotification(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification:new', {
      notification,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Emitted notification → user:${userId}`);
  }

  /** Emit live developer activity during analysis */
  emitDeveloperActivity(projectId: string, developer: string, data: any) {
    this.server.to(`project:${projectId}`).emit('developer:activity', {
      projectId,
      developer,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  /** Emit health score update */
  emitHealthUpdate(projectId: string, healthScore: number, status: string) {
    this.server.to(`project:${projectId}`).emit('health:update', {
      projectId,
      healthScore,
      status,
      timestamp: new Date().toISOString(),
    });
  }
}
