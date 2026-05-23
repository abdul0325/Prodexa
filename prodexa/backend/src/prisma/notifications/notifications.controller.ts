import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/prisma/auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { User } from 'src/common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  /** GET /notifications — Get all notifications  for current user */
  @Get()
  getUserNotifications(
    @User('userId') userId: string,
    @Query('unread') unread?: string,
  ) {
    return this.notificationsService.getUserNotifications(
      userId,
      unread === 'true',
    );
  }

  /** GET /notifications/unread-count — Get unread notification count */
  @Get('unread-count')
  getUnreadCount(@User('userId') userId: string) {
    return this.notificationsService.getUnreadCount(userId);
  }

  /** PATCH /notifications/:id/read — Mark single notification as read */
  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @User('userId') userId: string) {
    return this.notificationsService.markAsRead(id, userId);
  }

  /** PATCH /notifications/read-all — Mark all notifications as read */
  @Patch('read-all')
  markAllAsRead(@User('userId') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  /** DELETE /notifications/:id — Delete a notification */
  @Delete(':id')
  deleteNotification(@Param('id') id: string, @User('userId') userId: string) {
    return this.notificationsService.deleteNotification(id, userId);
  }
}
