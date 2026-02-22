-- CreateTable
CREATE TABLE "DeveloperActivity" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "developerLogin" TEXT NOT NULL,
    "commits" INTEGER NOT NULL,
    "pullRequestCount" INTEGER NOT NULL,
    "issueCount" INTEGER NOT NULL,
    "productivityScore" INTEGER NOT NULL,
    "activityTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeveloperActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DeveloperActivity_projectId_developerLogin_idx" ON "DeveloperActivity"("projectId", "developerLogin");

-- AddForeignKey
ALTER TABLE "DeveloperActivity" ADD CONSTRAINT "DeveloperActivity_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
