import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DeveloperAnalyticsService } from '../developer-analytics/developer-analytics.service';
import { IntelligenceService } from 'src/intelligence/intelligence.service';
import { Process } from '@nestjs/bull';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Processor('analytics')
export class AnalyticsProcessor extends WorkerHost {
  constructor(private devService: DeveloperAnalyticsService,
    private intelligenceService: IntelligenceService,
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {
    super();
  }

  async process(job: Job<any>) {

    if (job.name === 'analyzeProject') {
      const { projectId, githubToken, since } = job.data;


      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
        include: { user: true },
      });


      if (!project) throw new Error(`Project ${projectId} not found`);

      try {
        if (githubToken) {
          await this.devService.analyzeDevelopers(projectId, githubToken, since);
        } else {
          await this.devService.analyzeProjectContributors(projectId);
        }
      } catch (err) {
        console.error('❌ Analysis failed:', err.message);
      }

      try {
        await this.intelligenceService.getProjectIntelligence(projectId);
      } catch (err) {
        console.error('❌ Intelligence failed:', err.message);
      }

      try {
        const developerActivities = await this.prisma.developerActivity.findMany({
          where: { projectId },
        });

        for (const dev of developerActivities) {
          await this.devService.predictDeveloper(dev.developerLogin, projectId);
        }
      } catch (err) {
        console.error('❌ Predict developer failed:', err.message);
      }

      try {
        await this.notificationsService.checkAndNotify(projectId, project.userId);
      } catch (err) {
        console.error('❌ Notifications failed:', err.message);
      }

      return { message: 'Done' };
    }
  }

  @Process('analyze-project')
  async handleProjectAnalysis(job: any) {

    const { projectId } = job.data;

    await this.devService.analyzeProjectContributors(projectId);

    await this.intelligenceService.getProjectIntelligence(projectId);

  }
}