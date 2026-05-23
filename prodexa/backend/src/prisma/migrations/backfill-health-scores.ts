import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting health score backfill...');

  // Get all projects
  const projects = await prisma.project.findMany({
    where: {
      repositoryId: { not: null },
    },
    include: {
      repository: true,
    },
  });

  console.log(`Found ${projects.length} projects with repositories`);

  for (const project of projects) {
    console.log(`Processing project: ${project.name}`);

    // Get all daily metrics snapshots for this project
    const snapshots = await prisma.dailyMetricsSnapshot.findMany({
      where: {
        projectId: project.id,
      },
      orderBy: {
        date: 'asc',
      },
    });

    console.log(`Found ${snapshots.length} snapshots for project ${project.name}`);

    for (const snapshot of snapshots) {
      try {
        // Calculate health score using simplified formula
        const healthScore = calculateSimpleHealthScore({
          totalCommits: snapshot.totalCommits,
          totalPullRequests: snapshot.totalPullRequests,
          mergedPullRequests: snapshot.mergedPullRequests,
          activeContributors: snapshot.activeContributors,
          commitVelocity: snapshot.commitVelocity || 0,
          averagePRMergeTime: snapshot.averagePRMergeTime,
          daysSinceStart: snapshot.daysSinceStart,
        });

        // Update the snapshot with the calculated health score
        await prisma.dailyMetricsSnapshot.update({
          where: {
            id: snapshot.id,
          },
          data: {
            healthScore,
          },
        });

        console.log(
          `Updated snapshot ${snapshot.date.toISOString()} with health score: ${healthScore.toFixed(2)}`,
        );
      } catch (error) {
        console.error(`Error processing snapshot ${snapshot.id}:`, error);
      }
    }
  }

  console.log('Health score backfill completed');
}

function calculateSimpleHealthScore(metrics: {
  totalCommits: number;
  totalPullRequests: number;
  mergedPullRequests: number;
  activeContributors: number;
  commitVelocity: number;
  averagePRMergeTime: number | null;
  daysSinceStart: number;
}): number {
  const {
    totalCommits,
    totalPullRequests,
    mergedPullRequests,
    activeContributors,
    commitVelocity,
    averagePRMergeTime,
    daysSinceStart,
  } = metrics;

  // 1. Velocity Score (25%)
  const commitsPerDay = daysSinceStart > 0 ? totalCommits / daysSinceStart : 0;
  const prsPerDay = daysSinceStart > 0 ? totalPullRequests / daysSinceStart : 0;
  const mergeRate = totalPullRequests > 0 ? (mergedPullRequests / totalPullRequests) * 100 : 0;

  const commitScore = Math.min(100, commitsPerDay * 10);
  const prScore = Math.min(100, prsPerDay * 20);
  const mergeScore = mergeRate;
  const velocityScore = (commitScore * 0.4) + (prScore * 0.3) + (mergeScore * 0.3);

  // 2. Collaboration Score (20%)
  const contributorScore = activeContributors >= 3 && activeContributors <= 10
    ? 100
    : activeContributors < 3
    ? activeContributors * 33
    : Math.max(50, 100 - (activeContributors - 10) * 5);

  const prsPerContributor = activeContributors > 0 ? totalPullRequests / activeContributors : 0;
  const prContributorScore = Math.min(100, prsPerContributor * 10);
  const collaborationScore = (contributorScore * 0.6) + (prContributorScore * 0.4);

  // 3. Consistency Score (15%)
  const velocityConsistencyScore = commitVelocity >= 5 && commitVelocity <= 50
    ? 100
    : commitVelocity < 5
    ? commitVelocity * 20
    : Math.max(50, 100 - (commitVelocity - 50) * 2);

  const continuityScore = daysSinceStart >= 30 ? 100 : daysSinceStart * 3.33;
  const consistencyScore = (velocityConsistencyScore * 0.7) + (continuityScore * 0.3);

  // 4. Quality Score (15%)
  const qualityMergeRate = totalPullRequests > 0 ? (mergedPullRequests / totalPullRequests) * 100 : 0;
  const mergeTimeScore = averagePRMergeTime !== null
    ? Math.max(0, 100 - (averagePRMergeTime / 24) * 50)
    : 50;
  const qualityScore = (qualityMergeRate * 0.6) + (mergeTimeScore * 0.4);

  // 5. Risk Score (25%)
  let riskScore = 0;
  const actualMergeRate = totalPullRequests > 0 ? mergedPullRequests / totalPullRequests : 1;

  if (actualMergeRate < 0.5) {
    riskScore += (0.5 - actualMergeRate) * 100;
  }

  if (averagePRMergeTime !== null && averagePRMergeTime > 48) {
    riskScore += Math.min(50, (averagePRMergeTime - 48) / 24 * 25);
  }

  if (commitVelocity < 1) {
    riskScore += 30;
  } else if (commitVelocity > 100) {
    riskScore += 20;
  }

  riskScore = Math.min(100, riskScore);

  // Final Health Score
  const positiveSignals = (velocityScore * 0.25) + (collaborationScore * 0.20) + (consistencyScore * 0.15) + (qualityScore * 0.15);
  const riskPenalty = riskScore * 0.25;
  const finalHealthScore = Math.max(0, Math.min(100, positiveSignals - riskPenalty));

  return finalHealthScore;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
