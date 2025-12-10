-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "danish_market" INTEGER,
ADD COLUMN     "estimated_price" DOUBLE PRECISION;

-- Set all existing cars to danish_market = 1
UPDATE "Car" SET "danish_market" = 1 WHERE "danish_market" IS NULL;
