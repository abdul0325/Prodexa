/*
  Warnings:

  - A unique constraint covering the columns `[developerLogin,projectId]` on the table `DeveloperActivity` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "DeveloperActivity_projectId_developerLogin_idx";

-- AlterTable
ALTER TABLE "DeveloperActivity" ALTER COLUMN "commits" SET DEFAULT 0,
ALTER COLUMN "pullRequestCount" SET DEFAULT 0,
ALTER COLUMN "issueCount" SET DEFAULT 0,
ALTER COLUMN "productivityScore" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "DeveloperActivity_developerLogin_projectId_key" ON "DeveloperActivity"("developerLogin", "projectId");
