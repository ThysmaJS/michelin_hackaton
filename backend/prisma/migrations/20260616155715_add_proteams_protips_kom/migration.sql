-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "komContext" TEXT,
ADD COLUMN     "komHolder" TEXT,
ADD COLUMN     "komTime" TEXT,
ADD COLUMN     "komTyre" TEXT,
ADD COLUMN     "komYear" INTEGER;

-- AlterTable
ALTER TABLE "TyreProduct" ADD COLUMN     "proTeams" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "proTips" TEXT[] DEFAULT ARRAY[]::TEXT[];
