/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/prisma/auth/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import {
  UpdateUserRoleDto,
  UpdateUserStatusDto,
  UpdateProjectStatusDto,
} from './dto/admin.dto';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) { }

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
  updateUserRole(
    @Req() req,
    @Param('id') userId: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.adminService.updateUserRole(
      req.user.userId,
      userId,
      dto,
    );
  }

  /** PATCH /admin/users/:id/status — Activate or deactivate user */
  @Patch('users/:id/status')
  updateUserStatus(
    @Req() req,
    @Param('id') userId: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.adminService.updateUserStatus(
      req.user.userId,
      userId,
      dto,
    );
  }

  /** DELETE /admin/users/:id — Soft delete (deactivate) user */
  @Delete('users/:id')
  deleteUser(
    @Req() req,
    @Param('id') userId: string,
  ) {
    return this.adminService.deleteUser(
      req.user.userId,
      userId,
    );
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
    @Req() req,
    @Param('id') projectId: string,
    @Body() dto: UpdateProjectStatusDto,
  ) {
    return this.adminService.updateProjectStatus(
      req.user.userId,
      projectId,
      dto,
    );
  }

  /** DELETE /admin/projects/:id — Hard delete project + all its data */
  @Delete('projects/:id')
  deleteProject(
    @Req() req,
    @Param('id') projectId: string,
  ) {
    console.log('REQ USER:', req.user);
    return this.adminService.deleteProject(
      req.user.userId,
      projectId,
    );
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
