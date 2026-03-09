-- AlterTable
ALTER TABLE "Competition" ADD COLUMN     "distributionStatus" TEXT;

-- AlterTable
ALTER TABLE "CompetitionJudge" ADD COLUMN     "hasStartedJudging" BOOLEAN NOT NULL DEFAULT false;
