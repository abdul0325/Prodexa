-- AlterTable
ALTER TABLE "ProjectActivity" ADD COLUMN     "productivityScore" INTEGER,
ALTER COLUMN "activityTimestamp" SET DEFAULT CURRENT_TIMESTAMP;
