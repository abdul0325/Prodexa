import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private prisma: PrismaService) {}

  // ─────────────────────────────────────────────
  // CREATE NOTIFICATIONS (called internally by other services)
  // ─────────────────────────────────────────────

  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    projectId?: string,
  ) {
    try {
      return await this.prisma.notification.create({
        data: { userId, type, title, message, projectId },
      });
    } catch (err) {
      // Never crash the calling service if notification fails
      this.logger.error('Failed to create notification', err);
    }
  }

  // ─────────────────────────────────────────────
  // SMART ALERTS — called after analysis completes
  // ─────────────────────────────────────────────

  async checkAndNotify(projectId: string, userId: string) {
    const [devActivities, latestPrediction] = await Promise.all([
      this.prisma.developerActivity.findMany({ where: { projectId } }),
      this.prisma.prediction.findFirst({
        where: { projectId },
        orderBy: { generatedAt: 'desc' },
      }),
    ]);

    const notifications: Promise<any>[] = [];

    // Alert 1: Productivity drop below 30
    if (latestPrediction && latestPrediction.productivityScore < 30) {
      notifications.push(
        this.createNotification(
          userId,
          NotificationType.PRODUCTIVITY_DROP,
          '⚠️ Low Productivity Detected',
          `Project productivity score dropped to ${latestPrediction.productivityScore.toFixed(1)}. Immediate attention recommended.`,
          projectId,
        ),
      );
    }

    // Alert 2: High delivery risk
    if (latestPrediction?.deliveryRisk === 'High') {
      notifications.push(
        this.createNotification(
          userId,
          NotificationType.HIGH_DELIVERY_RISK,
          '🚨 High Delivery Risk',
          'Your project has been flagged as high delivery risk based on recent activity patterns.',
          projectId,
        ),
      );
    }

    // Alert 3: Inactive developers (no activity in 7+ days)
    const now = new Date();
    const inactiveDevelopers = devActivities.filter((dev) => {
      const daysSince = Math.floor(
        (now.getTime() - dev.activityTimestamp.getTime()) / (1000 * 60 * 60 * 24),
      );
      return daysSince >= 7;
    });

    if (inactiveDevelopers.length > 0) {
      const logins = inactiveDevelopers.map((d) => d.developerLogin).join(', ');
      notifications.push(
        this.createNotification(
          userId,
          NotificationType.INACTIVE_DEVELOPER,
          `👤 ${inactiveDevelopers.length} Inactive Developer(s)`,
          `The following developers have had no activity in 7+ days: ${logins}`,
          projectId,
        ),
      );
    }

    // Alert 4: Analysis complete
    notifications.push(
      this.createNotification(
        userId,
        NotificationType.ANALYSIS_COMPLETE,
        '✅ Analysis Complete',
        'Project analysis has finished. Your dashboard has been updated with the latest insights.',
        projectId,
      ),
    );

    await Promise.allSettled(notifications);
    this.logger.log(`Sent ${notifications.length} notifications for project ${projectId}`);
  }

  // ─────────────────────────────────────────────
  // USER-FACING NOTIFICATION ENDPOINTS
  // ─────────────────────────────────────────────

  async getUserNotifications(userId: string, unreadOnly = false) {
    return this.prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly ? { isRead: false } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        project: { select: { id: true, name: true } },
      },
    });
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { unreadCount: count };
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) throw new NotFoundException('Notification not found');

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { message: 'All notifications marked as read' };
  }

  async deleteNotification(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) throw new NotFoundException('Notification not found');

    await this.prisma.notification.delete({ where: { id: notificationId } });
    return { message: 'Notification deleted' };
  }
}
