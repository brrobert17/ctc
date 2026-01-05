BEGIN;

CREATE TABLE IF NOT EXISTS "BodyType" (
    "id" SERIAL NOT NULL,
    "body_type" TEXT,
    CONSTRAINT "BodyType_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "CarFeature" (
    "car_id" INTEGER NOT NULL,
    "feature_id" INTEGER NOT NULL,
    CONSTRAINT "CarFeature_pkey" PRIMARY KEY ("car_id","feature_id")
);

CREATE TABLE IF NOT EXISTS "CarImage" (
    "id" SERIAL NOT NULL,
    "car_id" INTEGER,
    "image_url" TEXT,
    "image_id" INTEGER,
    CONSTRAINT "CarImage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "CarLocation" (
    "id" SERIAL NOT NULL,
    "car_location" TEXT,
    CONSTRAINT "CarLocation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Car" (
    "id" SERIAL NOT NULL,
    "make_id" INTEGER,
    "model_id" INTEGER,
    "fuel_type_id" INTEGER,
    "body_type_id" INTEGER,
    "color_id" INTEGER,
    "transmission_type_id" INTEGER,
    "drivetrain_id" INTEGER,
    "listing_type_id" INTEGER,
    "category_id" INTEGER,
    "interior_color_id" INTEGER,
    "car_location_id" INTEGER,
    "source_id" INTEGER,
    "source" TEXT,
    "source_listing_id" INTEGER,
    "name" TEXT,
    "price" INTEGER,
    "description" TEXT,
    "url" TEXT,
    "first_registration" TEXT,
    "mileage" INTEGER,
    "model_year" INTEGER,
    "engine_displacement" TEXT,
    "power" TEXT,
    "top_speed" TEXT,
    "acceleration" TEXT,
    "fuel_consumption" TEXT,
    "co2_emission" TEXT,
    "euro_standard" TEXT,
    "weight" TEXT,
    "towing_weight" TEXT,
    "doors" INTEGER,
    "seats" INTEGER,
    "periodic_tax" TEXT,
    "vin" TEXT,
    "trunk_size" TEXT,
    "width" TEXT,
    "battery_capacity" TEXT,
    "range" TEXT,
    "energy_consumption" TEXT,
    "dc_charging_time_10_80_percent" TEXT,
    "fast_charging_dc" TEXT,
    "home_charging_ac" TEXT,
    "next_inspection_date" TEXT,
    "latest_inspection_date" TEXT,
    "number_of_gears" INTEGER,
    "number_of_owners" INTEGER,
    "new_price" TEXT,
    "manufactured" TEXT,
    "color_description" TEXT,
    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Category" (
    "id" SERIAL NOT NULL,
    "category" TEXT,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Color" (
    "id" SERIAL NOT NULL,
    "color" TEXT,
    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "DriveTrain" (
    "id" SERIAL NOT NULL,
    "drivetrain" TEXT,
    CONSTRAINT "DriveTrain_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Feature" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "FuelType" (
    "id" SERIAL NOT NULL,
    "fuel_type" TEXT,
    CONSTRAINT "FuelType_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "InteriorColor" (
    "id" SERIAL NOT NULL,
    "interior_color" TEXT,
    CONSTRAINT "InteriorColor_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ListingType" (
    "id" SERIAL NOT NULL,
    "listing_type" TEXT,
    CONSTRAINT "ListingType_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Make" (
    "id" SERIAL NOT NULL,
    "make" TEXT,
    CONSTRAINT "Make_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Model" (
    "id" SERIAL NOT NULL,
    "make_id" INTEGER,
    "model" TEXT,
    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Source" (
    "id" SERIAL NOT NULL,
    "source" TEXT,
    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "TransmissionType" (
    "id" SERIAL NOT NULL,
    "transmission_type" TEXT,
    CONSTRAINT "TransmissionType_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "CarFeature" ADD CONSTRAINT IF NOT EXISTS "CarFeature_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "CarFeature" ADD CONSTRAINT IF NOT EXISTS "CarFeature_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "Feature"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "CarImage" ADD CONSTRAINT IF NOT EXISTS "CarImage_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "Car" ADD CONSTRAINT IF NOT EXISTS "Car_body_type_id_fkey" FOREIGN KEY ("body_type_id") REFERENCES "BodyType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "Car" ADD CONSTRAINT IF NOT EXISTS "Car_car_location_id_fkey" FOREIGN KEY ("car_location_id") REFERENCES "CarLocation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "Car" ADD CONSTRAINT IF NOT EXISTS "Car_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "Car" ADD CONSTRAINT IF NOT EXISTS "Car_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "Color"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "Car" ADD CONSTRAINT IF NOT EXISTS "Car_drivetrain_id_fkey" FOREIGN KEY ("drivetrain_id") REFERENCES "DriveTrain"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "Car" ADD CONSTRAINT IF NOT EXISTS "Car_fuel_type_id_fkey" FOREIGN KEY ("fuel_type_id") REFERENCES "FuelType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "Car" ADD CONSTRAINT IF NOT EXISTS "Car_interior_color_id_fkey" FOREIGN KEY ("interior_color_id") REFERENCES "InteriorColor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "Car" ADD CONSTRAINT IF NOT EXISTS "Car_listing_type_id_fkey" FOREIGN KEY ("listing_type_id") REFERENCES "ListingType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "Car" ADD CONSTRAINT IF NOT EXISTS "Car_make_id_fkey" FOREIGN KEY ("make_id") REFERENCES "Make"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "Car" ADD CONSTRAINT IF NOT EXISTS "Car_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "Model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "Car" ADD CONSTRAINT IF NOT EXISTS "Car_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "Source"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "Car" ADD CONSTRAINT IF NOT EXISTS "Car_transmission_type_id_fkey" FOREIGN KEY ("transmission_type_id") REFERENCES "TransmissionType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "Model" ADD CONSTRAINT IF NOT EXISTS "Model_make_id_fkey" FOREIGN KEY ("make_id") REFERENCES "Make"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Car" ADD CONSTRAINT IF NOT EXISTS "Car_source_source_listing_id_key" UNIQUE ("source", "source_listing_id");

ALTER TABLE "Make" ADD CONSTRAINT IF NOT EXISTS "Make_make_key" UNIQUE ("make");
ALTER TABLE "FuelType" ADD CONSTRAINT IF NOT EXISTS "FuelType_fuel_type_key" UNIQUE ("fuel_type");
ALTER TABLE "BodyType" ADD CONSTRAINT IF NOT EXISTS "BodyType_body_type_key" UNIQUE ("body_type");
ALTER TABLE "TransmissionType" ADD CONSTRAINT IF NOT EXISTS "TransmissionType_transmission_type_key" UNIQUE ("transmission_type");
ALTER TABLE "DriveTrain" ADD CONSTRAINT IF NOT EXISTS "DriveTrain_drivetrain_key" UNIQUE ("drivetrain");
ALTER TABLE "Color" ADD CONSTRAINT IF NOT EXISTS "Color_color_key" UNIQUE ("color");
ALTER TABLE "Category" ADD CONSTRAINT IF NOT EXISTS "Category_category_key" UNIQUE ("category");
ALTER TABLE "CarLocation" ADD CONSTRAINT IF NOT EXISTS "CarLocation_car_location_key" UNIQUE ("car_location");
ALTER TABLE "Source" ADD CONSTRAINT IF NOT EXISTS "Source_source_key" UNIQUE ("source");
ALTER TABLE "Feature" ADD CONSTRAINT IF NOT EXISTS "Feature_name_key" UNIQUE ("name");
ALTER TABLE "Model" ADD CONSTRAINT IF NOT EXISTS "Model_make_id_model_key" UNIQUE ("make_id", "model");
