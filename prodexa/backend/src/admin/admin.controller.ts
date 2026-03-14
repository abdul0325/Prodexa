import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import {
  UpdateUserRoleDto,
  UpdateUserStatusDto,
  UpdateProjectStatusDto,
} from './dto/admin.dto';

// Both guards required: must be logged in AND must be ADMIN
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  // ─────────────────────────────────────────────
  // PLATFORM OVERVIEW
  // ─────────────────────────────────────────────

  /** GET /admin/stats — Platform overview */
  @Get('stats')
  getPlatformStats() {
    return this.adminService.getPlatformStats();
  }

  // ─────────────────────────────────────────────
  // USER MANAGEMENT
  // ─────────────────────────────────────────────

  /** GET /admin/users — List all users */
  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  /** GET /admin/users/:id — Get single user details */
  @Get('users/:id')
  getUserById(@Param('id') userId: string) {
    return this.adminService.getUserById(userId);
  }

  /** PATCH /admin/users/:id/role — Change user role */
  @Patch('users/:id/role')
  updateUserRole(@Param('id') userId: string, @Body() dto: UpdateUserRoleDto) {
    return this.adminService.updateUserRole(userId, dto);
  }

  /** PATCH /admin/users/:id/status — Activate or deactivate user */
  @Patch('users/:id/status')
  updateUserStatus(@Param('id') userId: string, @Body() dto: UpdateUserStatusDto) {
    return this.adminService.updateUserStatus(userId, dto);
  }

  /** DELETE /admin/users/:id — Soft delete (deactivate) user */
  @Delete('users/:id')
  deleteUser(@Param('id') userId: string) {
    return this.adminService.deleteUser(userId);
  }

  // ─────────────────────────────────────────────
  // PROJECT MANAGEMENT
  // ─────────────────────────────────────────────

  /** GET /admin/projects — List all projects across all users */
  @Get('projects')
  getAllProjects() {
    return this.adminService.getAllProjects();
  }

  /** PATCH /admin/projects/:id/status — Activate or deactivate a project */
  @Patch('projects/:id/status')
  updateProjectStatus(
    @Param('id') projectId: string,
    @Body() dto: UpdateProjectStatusDto,
  ) {
    return this.adminService.updateProjectStatus(projectId, dto);
  }

  /** DELETE /admin/projects/:id — Hard delete project + all its data */
  @Delete('projects/:id')
  deleteProject(@Param('id') projectId: string) {
    return this.adminService.deleteProject(projectId);
  }

  // ─────────────────────────────────────────────
  // AUDIT LOGS
  // ─────────────────────────────────────────────

  /** GET /admin/audit-logs — Paginated audit log */
  @Get('audit-logs')
  getAuditLogs(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.adminService.getAuditLogs(
      limit ? parseInt(limit) : 50,
      offset ? parseInt(offset) : 0,
    );
  }

  /** GET /admin/audit-logs/user/:id — Audit logs by specific user */
  @Get('audit-logs/user/:id')
  getAuditLogsByUser(@Param('id') userId: string) {
    return this.adminService.getAuditLogsByUser(userId);
  }
}
