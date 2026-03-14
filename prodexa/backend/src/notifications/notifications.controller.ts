import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  /** GET /notifications — Get all notifications for current user */
  @Get()
  getUserNotifications(@Req() req, @Query('unread') unread?: string) {
    return this.notificationsService.getUserNotifications(
      req.user.userId,
      unread === 'true',
    );
  }

  /** GET /notifications/unread-count — Get unread notification count */
  @Get('unread-count')
  getUnreadCount(@Req() req) {
    return this.notificationsService.getUnreadCount(req.user.userId);
  }

  /** PATCH /notifications/:id/read — Mark single notification as read */
  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Req() req) {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }

  /** PATCH /notifications/read-all — Mark all notifications as read */
  @Patch('read-all')
  markAllAsRead(@Req() req) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  /** DELETE /notifications/:id — Delete a notification */
  @Delete(':id')
  deleteNotification(@Param('id') id: string, @Req() req) {
    return this.notificationsService.deleteNotification(id, req.user.userId);
  }
}
