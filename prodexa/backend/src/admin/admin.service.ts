import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { UpdateUserRoleDto, UpdateUserStatusDto, UpdateProjectStatusDto, CreateUserByAdminDto } from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ─────────────────────────────────────────────
  // USER MANAGEMENT
  // ─────────────────────────────────────────────

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: { select: { projects: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        projects: {
          select: { id: true, name: true, status: true, createdAt: true },
        },
      },
    });

    if (!user) throw new NotFoundException(`User ${userId} not found`);
    return user;
  }

  async updateUserRole(userId: string, dto: UpdateUserRoleDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    return this.prisma.user.update({
      where: { id: userId },
      data: { role: dto.role },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async updateUserStatus(userId: string, dto: UpdateUserStatusDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: dto.isActive },
      select: { id: true, name: true, email: true, isActive: true },
    });
  }

  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    // Soft delete by deactivating instead of hard delete
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
      select: { id: true, name: true, isActive: true },
    });
  }

  // ─────────────────────────────────────────────
  // PROJECT MANAGEMENT
  // ─────────────────────────────────────────────

  async getAllProjects() {
    return this.prisma.project.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: {
          select: { developerActivities: true, metrics: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateProjectStatus(projectId: string, dto: UpdateProjectStatusDto) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException(`Project ${projectId} not found`);

    return this.prisma.project.update({
      where: { id: projectId },
      data: { status: dto.status },
      select: { id: true, name: true, status: true },
    });
  }

  async deleteProject(projectId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException(`Project ${projectId} not found`);

    // Cascade delete all related data
    await this.prisma.$transaction([
      this.prisma.developerActivity.deleteMany({ where: { projectId } }),
      this.prisma.projectActivity.deleteMany({ where: { projectId } }),
      this.prisma.prediction.deleteMany({ where: { projectId } }),
      this.prisma.notification.deleteMany({ where: { projectId } }),
      this.prisma.project.delete({ where: { id: projectId } }),
    ]);

    return { message: `Project ${projectId} deleted successfully` };
  }

  // ─────────────────────────────────────────────
  // AUDIT LOGS
  // ─────────────────────────────────────────────

  async getAuditLogs(limit = 50, offset = 0) {
    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.auditLog.count(),
    ]);

    return { logs, total, limit, offset };
  }

  async getAuditLogsByUser(userId: string) {
    return this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  // ─────────────────────────────────────────────
  // PLATFORM STATS (Admin Overview)
  // ─────────────────────────────────────────────

  async getPlatformStats() {
    const [totalUsers, activeUsers, totalProjects, activeProjects, totalAnalyses] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { isActive: true } }),
        this.prisma.project.count(),
        this.prisma.project.count({ where: { status: 'ACTIVE' } }),
        this.prisma.developerActivity.count(),
      ]);

    return {
      users: { total: totalUsers, active: activeUsers, inactive: totalUsers - activeUsers },
      projects: { total: totalProjects, active: activeProjects, inactive: totalProjects - activeProjects },
      totalAnalyses,
    };
  }
}
