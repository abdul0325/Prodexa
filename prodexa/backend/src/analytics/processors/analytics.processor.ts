/* eslint-disable prettier/prettier */
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { DeveloperAnalyticsService } from 'src/developer-analytics/developer-analytics.service';
import { IntelligenceService } from 'src/intelligence/intelligence.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsService } from 'src/prisma/notifications/notifications.service';
import { RealtimeGateway } from 'src/gateway/realtime.gateway';
import { parseRepoUrl } from 'src/github/utils/parse-repo.util';
import { CommitService } from '../services/commit.service';
import { MLService } from 'src/ml/ml.service';

@Processor('analytics')
export class AnalyticsProcessor extends WorkerHost {
  private readonly logger = new Logger(AnalyticsProcessor.name);

  constructor(
    private devService: DeveloperAnalyticsService,
    private intelligenceService: IntelligenceService,
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private gateway: RealtimeGateway,
    private commitService: CommitService,
    private mlService: MLService,
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
        // ── Step 1: Mark as ANALYZING ──────────────────────────
        await this.updateStatus(projectId, 'ANALYZING');
        this.gateway.emitAnalysisStatus(
          projectId,
          'ANALYZING',
          'Fetching GitHub data...',
        );
        this.logger.log(`[${projectId}] Analysis started`);

        // ── Step 2: Fetch & analyze contributors ───────────────
        this.gateway.emitAnalysisStatus(
          projectId,
          'ANALYZING',
          'Analyzing developer activity...',
        );

        let devActivities;
        if (githubToken) {
          devActivities = await this.devService.analyzeDevelopers(
            projectId,
            githubToken,
            since,
          );
        } else {
          devActivities =
            await this.devService.analyzeProjectContributors(projectId);
        }

        // Emit live developer activity as each dev is processed
        for (const dev of devActivities || []) {
          this.gateway.emitDeveloperActivity(projectId, dev.developerLogin, {
            commits: dev.commits,
            pullRequestCount: dev.pullRequestCount,
            issueCount: dev.issueCount,
            productivityScore: dev.productivityScore,
          });
        }

        // ── Step 3: Generate intelligence ──────────────────────
        this.gateway.emitAnalysisStatus(
          projectId,
          'ANALYZING',
          'Generating intelligence...',
        );
        await this.intelligenceService.getProjectIntelligence(projectId);
        const prediction =
          await this.mlService.analyzeProject(
            projectId,
          );
        // ── Step 4: Predict per-developer scores ───────────────
        this.gateway.emitAnalysisStatus(
          projectId,
          'ANALYZING',
          'Running predictions...',
        );
        const developerActivities =
          await this.prisma.developerActivity.findMany({
            where: { projectId },
          });

        for (const dev of developerActivities) {
          await this.devService.predictDeveloper(dev.developerLogin, projectId);
        }

        // ── Step 5: Get final health score ─────────────────────
        const health = {
          healthScore:
            prediction.projectScore,

          status:
            prediction.teamHealthStatus,

          deliveryRisk:
            prediction.deliveryRisk,
        };

        // ── Step 6: Update project status + sync time ──────────
        const latestCommit =
          await this.commitService.getLatestCommit(
            projectId,
          );

        await this.prisma.project.update({
          where: { id: projectId },
          data: {
            analysisStatus: 'DONE',

            lastSyncedAt: new Date(),

            lastAnalyzedCommitSha:
              latestCommit?.sha,

            cacheExpiresAt:
              new Date(Date.now() + 30 * 60 * 1000),

            lastError: null,

            repoOwner:
              parseRepoUrl(project.repoUrl).owner,

            repoName:
              parseRepoUrl(project.repoUrl).repo,
          },
        });

        // ── Step 7: Fire notifications ─────────────────────────
        await this.notificationsService.checkAndNotify(
          projectId,
          project.userId,
        );

        // ── Step 8: Emit completion events ─────────────────────
        this.gateway.emitAnalysisStatus(
          projectId,
          'DONE',
          'Analysis complete!',
        );
        const healthScore = health.healthScore ?? 0;
        const healthStatus = health.status ?? 'Unknown';
        this.gateway.emitHealthUpdate(
          projectId,
          prediction.projectScore,
          prediction.teamHealthStatus,
        );
        this.gateway.emitDashboardUpdate(projectId, {
          healthScore: prediction.projectScore,
          status: prediction.teamHealthStatus,
          deliveryRisk: prediction.deliveryRisk,
          confidence: prediction.forecastConfidence,
        });
        this.gateway.emitNotification(project.userId, {
          type: 'ANALYSIS_COMPLETE',
          title: '✅ Analysis Complete',
          message:
            `${project.name} analysis finished. ` +
            `Health Score: ${prediction.projectScore}/100 · ` +
            `Risk: ${prediction.deliveryRisk}`
        });

        this.logger.log(
          `[${projectId}] Analysis complete — Health: ${health.healthScore}`,
        );

        return {
          message: 'Analysis complete',
          projectId,
          healthScore: health.healthScore,
        };
      } catch (error: any) {
        // ── Handle failure ─────────────────────────────────────
        this.logger.error(`[${projectId}] Analysis failed: ${error.message}`);

        await this.prisma.project.update({
          where: { id: projectId },
          data: {
            analysisStatus: 'FAILED',
            lastError: error.message,
          },
        });

        this.gateway.emitAnalysisStatus(projectId, 'FAILED', error.message);
        throw error; // re-throw so BullMQ marks job as failed
      }
    }
  }

  private async updateStatus(projectId: string, status: string) {
    await this.prisma.project.update({
      where: { id: projectId },
      data: { analysisStatus: status as any },
    });
  }
}
