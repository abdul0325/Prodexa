/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UpdateUserRoleDto,
  UpdateUserStatusDto,
  UpdateProjectStatusDto,
} from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) { }
  private async createAuditLog(
    userId: string,
    action: string,
    targetType: string,
    targetId: string,
    metadata?: any,
  ) {
    return this.prisma.auditLog.create({
      data: {
        userId,
        action,
        targetType,
        targetId,
        metadata,
      },
    });
  }
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

  async updateUserRole(
    adminId: string,
    userId: string,
    dto: UpdateUserRoleDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: dto.role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    await this.createAuditLog(
      adminId,
      'USER_ROLE_CHANGED',
      'USER',
      userId,
      {
        userName: updatedUser.name,
        newRole: dto.role,
      },
    );

    return updatedUser;
  }

async updateUserStatus(
  adminId: string,
  userId: string,
  dto: UpdateUserStatusDto,
) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundException(`User ${userId} not found`);
  }

  const updatedUser = await this.prisma.user.update({
    where: { id: userId },
    data: { isActive: dto.isActive },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
    },
  });

  await this.createAuditLog(
    adminId,
    dto.isActive
      ? 'USER_ACTIVATED'
      : 'USER_DEACTIVATED',
    'USER',
    userId,
    {
      userName: updatedUser.name,
    },
  );

  return updatedUser;
}

  async deleteUser(adminId: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    // Soft delete by deactivating instead of hard delete
    const deletedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
      select: { id: true, name: true, isActive: true },
    });

    await this.createAuditLog(
      adminId,
      'USER_DELETED',
      'USER',
      userId,
      {
        userName: deletedUser.name,
      },
    );

    return deletedUser;
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

  async updateProjectStatus(
    adminId: string,
    projectId: string,
    dto: UpdateProjectStatusDto,
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new NotFoundException(`Project ${projectId} not found`);

    const updatedProject = await this.prisma.project.update({
      where: { id: projectId },
      data: { status: dto.status },
      select: { id: true, name: true, status: true },
    });

    await this.createAuditLog(
      adminId,
      'PROJECT_STATUS_CHANGED',
      'PROJECT',
      projectId,
      {
        projectName: updatedProject.name,
        status: dto.status,
      },
    );

    return updatedProject;
  }

  async deleteProject(adminId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new NotFoundException(`Project ${projectId} not found`);

    // Cascade delete all related data
    await this.prisma.$transaction([
      this.prisma.developerActivity.deleteMany({ where: { projectId } }),
      this.prisma.projectActivity.deleteMany({ where: { projectId } }),
      this.prisma.prediction.deleteMany({ where: { projectId } }),
      this.prisma.notification.deleteMany({ where: { projectId } }),
      this.prisma.project.delete({ where: { id: projectId } }),
    ]);
    console.log('ADMIN ID:', adminId);
    await this.createAuditLog(
      adminId,
      'PROJECT_DELETED',
      'PROJECT',
      projectId,
      {
        projectName: project.name,
      },
    );
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
    const [
      totalUsers,
      activeUsers,
      totalProjects,
      activeProjects,
      totalAnalyses,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.project.count(),
      this.prisma.project.count({ where: { status: 'ACTIVE' } }),
      this.prisma.developerActivity.count(),
    ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
      },
      projects: {
        total: totalProjects,
        active: activeProjects,
        inactive: totalProjects - activeProjects,
      },
      totalAnalyses,
    };
  }
}
