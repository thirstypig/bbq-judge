/*
  Warnings:

  - The `distributionStatus` column on the `Competition` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DistributionStatus" AS ENUM ('DRAFT', 'APPROVED');

-- AlterTable
ALTER TABLE "Competition" DROP COLUMN "distributionStatus",
ADD COLUMN     "distributionStatus" "DistributionStatus";

-- CreateIndex
CREATE INDEX "AuditLog_competitionId_action_entityType_idx" ON "AuditLog"("competitionId", "action", "entityType");
