import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting repository migration...');

  // Get all projects
  const projects = await prisma.project.findMany({
    where: {
      repositoryId: null,
    },
  });

  console.log(`Found ${projects.length} projects to migrate`);

  for (const project of projects) {
    try {
      // Parse repoUrl to extract repository info
      // Expected format: https://github.com/owner/repo
      const repoUrl = project.repoUrl;
      const urlParts = repoUrl.split('github.com/');

      if (urlParts.length < 2) {
        console.log(`Skipping project ${project.id} - invalid repoUrl: ${repoUrl}`);
        continue;
      }

      const fullName = urlParts[1].replace(/\.git$/, '');
      const [owner, repoName] = fullName.split('/');

      if (!owner || !repoName) {
        console.log(`Skipping project ${project.id} - could not parse owner/repo from: ${fullName}`);
        continue;
      }

      // Check if repository already exists
      let repository = await prisma.repository.findUnique({
        where: { fullName },
      });

      // Create repository if it doesn't exist
      if (!repository) {
        repository = await prisma.repository.create({
          data: {
            githubId: `${owner}-${repoName}`, // Temporary ID until we get real GitHub ID
            owner,
            repoName,
            fullName,
            url: repoUrl,
          },
        });
        console.log(`Created repository: ${fullName}`);
      }

      // Link project to repository
      await prisma.project.update({
        where: { id: project.id },
        data: { repositoryId: repository.id },
      });

      console.log(`Linked project ${project.id} to repository ${repository.id}`);
    } catch (error) {
      console.error(`Error migrating project ${project.id}:`, error);
    }
  }

  console.log('Repository migration completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
