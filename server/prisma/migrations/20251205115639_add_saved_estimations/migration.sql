-- CreateTable
CREATE TABLE "saved_estimations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "year" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "mpg_avg" DOUBLE PRECISION NOT NULL,
    "engine_size_l" DOUBLE PRECISION NOT NULL,
    "hp" INTEGER NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "drivetrain" TEXT NOT NULL,
    "fuel_type" TEXT NOT NULL,
    "exterior_color" TEXT NOT NULL,
    "accidents_or_damage" INTEGER NOT NULL,
    "one_owner" INTEGER NOT NULL,
    "personal_use_only" INTEGER NOT NULL,
    "danish_market" INTEGER NOT NULL,
    "predicted_price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT,
    "original_price_usd" DOUBLE PRECISION,

    CONSTRAINT "saved_estimations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "saved_estimations" ADD CONSTRAINT "saved_estimations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
