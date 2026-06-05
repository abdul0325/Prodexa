/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { PrismaService }
    from 'src/prisma/prisma.service';

interface HealthMetrics {
  totalCommits: number;
  totalPullRequests: number;
  mergedPullRequests: number;
  activeContributors: number;
  commitVelocity: number;
  averagePRMergeTime: number | null;
  daysSinceStart: number;
}

interface HealthScoreBreakdown {
  velocityScore: number;
  collaborationScore: number;
  consistencyScore: number;
  qualityScore: number;
  riskScore: number;
  finalHealthScore: number;
}

@Injectable()
export class HealthCalculationService {

    constructor(
        private readonly prisma:
            PrismaService,
    ) { }

    async calculateEngineeringHealth(
        repositoryId: string,
        metrics: HealthMetrics,
    ): Promise<HealthScoreBreakdown> {

        const {
            totalCommits,
            totalPullRequests,
            mergedPullRequests,
            activeContributors,
            commitVelocity,
            averagePRMergeTime,
            daysSinceStart,
        } = metrics;

        // 1. DELIVERY VELOCITY (25%)
        // Signals: commit frequency, PR throughput, merge rate
        const velocityScore = this.calculateVelocityScore(
            totalCommits,
            totalPullRequests,
            mergedPullRequests,
            commitVelocity,
            daysSinceStart,
        );

        // 2. COLLABORATION STABILITY (20%)
        // Signals: contributor distribution, review participation
        const collaborationScore = this.calculateCollaborationScore(
            activeContributors,
            totalPullRequests,
            totalCommits,
        );

        // 3. CONSISTENCY (15%)
        // Signals: activity continuity, predictable cadence
        const consistencyScore = this.calculateConsistencyScore(
            daysSinceStart,
            commitVelocity,
        );

        // 4. CODE QUALITY (15%)
        // Signals: PR merge time, merge rate
        const qualityScore = this.calculateQualityScore(
            averagePRMergeTime,
            mergedPullRequests,
            totalPullRequests,
        );

        // 5. ENGINEERING RISK (25%)
        // Signals: stale PRs, low merge rate, high merge time
        const riskScore = this.calculateRiskScore(
            averagePRMergeTime,
            mergedPullRequests,
            totalPullRequests,
            commitVelocity,
        );

        // FINAL HEALTH SCORE
        // Positive signals - Risk penalty
        const positiveSignals =
            (velocityScore * 0.25) +
            (collaborationScore * 0.20) +
            (consistencyScore * 0.15) +
            (qualityScore * 0.15);

        const riskPenalty = riskScore * 0.25;

        let finalHealthScore = Math.max(0, Math.min(100, positiveSignals - riskPenalty));

        return {
            velocityScore,
            collaborationScore,
            consistencyScore,
            qualityScore,
            riskScore,
            finalHealthScore,
        };
    }

    private calculateVelocityScore(
        totalCommits: number,
        totalPullRequests: number,
        mergedPullRequests: number,
        commitVelocity: number,
        daysSinceStart: number,
    ): number {

        if (daysSinceStart === 0) return 50; // Neutral for new projects

        // Commit frequency (commits per day)
        const commitsPerDay = totalCommits / Math.max(daysSinceStart, 1);
        
        // PR throughput (PRs per day)
        const prsPerDay = totalPullRequests / Math.max(daysSinceStart, 1);
        
        // Merge rate (percentage of PRs merged)
        const mergeRate = totalPullRequests > 0 
            ? (mergedPullRequests / totalPullRequests) * 100 
            : 0;

        // Normalize and weight
        const commitScore = Math.min(100, commitsPerDay * 10);
        const prScore = Math.min(100, prsPerDay * 20);
        const mergeScore = mergeRate;

        return (commitScore * 0.4) + (prScore * 0.3) + (mergeScore * 0.3);
    }

    private calculateCollaborationScore(
        activeContributors: number,
        totalPullRequests: number,
        totalCommits: number,
    ): number {

        if (activeContributors === 0) return 0;

        // Contributor distribution (avoid single-point failure)
        const contributorScore = activeContributors >= 3 && activeContributors <= 10
            ? 100
            : activeContributors < 3
            ? activeContributors * 33
            : Math.max(50, 100 - (activeContributors - 10) * 5);

        // Review participation (PRs per contributor)
        const prsPerContributor = totalPullRequests / activeContributors;
        const prScore = Math.min(100, prsPerContributor * 10);

        return (contributorScore * 0.6) + (prScore * 0.4);
    }

    private calculateConsistencyScore(
        daysSinceStart: number,
        commitVelocity: number,
    ): number {

        if (daysSinceStart < 7) return 50;

        // Consistency based on stable commit velocity
        const velocityScore = commitVelocity >= 5 && commitVelocity <= 50
            ? 100
            : commitVelocity < 5
            ? commitVelocity * 20
            : Math.max(50, 100 - (commitVelocity - 50) * 2);

        // Activity continuity (bonus for consistent activity)
        const continuityScore = daysSinceStart >= 30 ? 100 : daysSinceStart * 3.33;

        return (velocityScore * 0.7) + (continuityScore * 0.3);
    }

    private calculateQualityScore(
        averagePRMergeTime: number | null,
        mergedPullRequests: number,
        totalPullRequests: number,
    ): number {

        if (totalPullRequests === 0) return 50;

        // Merge rate (higher is better)
        const mergeRate = (mergedPullRequests / totalPullRequests) * 100;

        // PR merge time (lower is better, in hours)
        const mergeTimeScore = averagePRMergeTime !== null
            ? Math.max(0, 100 - (averagePRMergeTime / 24) * 50)
            : 50;

        return (mergeRate * 0.6) + (mergeTimeScore * 0.4);
    }

    private calculateRiskScore(
        averagePRMergeTime: number | null,
        mergedPullRequests: number,
        totalPullRequests: number,
        commitVelocity: number,
    ): number {

        let riskScore = 0;

        // Risk 1: Low merge rate (stale PRs)
        const mergeRate = totalPullRequests > 0 
            ? (mergedPullRequests / totalPullRequests) 
            : 1;
        
        if (mergeRate < 0.5) {
            riskScore += (0.5 - mergeRate) * 100;
        }

        // Risk 2: High merge time (slow reviews)
        if (averagePRMergeTime !== null && averagePRMergeTime > 48) {
            riskScore += Math.min(50, (averagePRMergeTime - 48) / 24 * 25);
        }

        // Risk 3: Extremely low or high velocity (unstable)
        if (commitVelocity < 1) {
            riskScore += 30;
        } else if (commitVelocity > 100) {
            riskScore += 20;
        }

        return Math.min(100, riskScore);
    }
}
