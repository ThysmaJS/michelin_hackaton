-- CreateEnum
CREATE TYPE "Terrain" AS ENUM ('route', 'gravel', 'city', 'mtb');

-- CreateTable
CREATE TABLE "TyreProduct" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brand" TEXT NOT NULL DEFAULT 'MICHELIN',
    "name" TEXT NOT NULL,
    "webRangeName" TEXT,
    "rangeInternal" TEXT,
    "tag" TEXT,
    "usage" TEXT,
    "productType" TEXT,
    "cycleType" TEXT,
    "segment" TEXT,
    "terrain" "Terrain" NOT NULL,
    "uses" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "terrainTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "rubber" TEXT,
    "rubberTechnologies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "casingTechnologies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "treadTechnologies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "reinforcementTechnologies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "eBikeTechnologies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tubeless" BOOLEAN NOT NULL DEFAULT false,
    "reinforced" BOOLEAN NOT NULL DEFAULT false,
    "grip" INTEGER NOT NULL,
    "rendement" INTEGER NOT NULL,
    "endurance" INTEGER NOT NULL,
    "legerete" INTEGER NOT NULL,
    "weightG" INTEGER,
    "watts" INTEGER,
    "priceEur" DOUBLE PRECISION,
    "isMichelin" BOOLEAN NOT NULL DEFAULT true,
    "discontinued" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TyreProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TyreVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "globalId" TEXT,
    "cai" TEXT NOT NULL,
    "ean" TEXT,
    "mspn" TEXT,
    "upc" TEXT,
    "designation" TEXT,
    "webDesignation" TEXT,
    "widthEtrto" TEXT,
    "diameterEtrto" TEXT,
    "webWidthMm" TEXT,
    "webDiameterMm" TEXT,
    "weightG" INTEGER,
    "minPressureBar" DOUBLE PRECISION,
    "maxPressureBar" DOUBLE PRECISION,
    "minPressurePsi" INTEGER,
    "maxPressurePsi" INTEGER,
    "bead" TEXT,
    "sealing" TEXT,
    "rimType" TEXT,
    "tpi" TEXT,
    "fitting" TEXT,
    "sidewallColor" TEXT,
    "treadPatternColor" TEXT,
    "shoulderColor" TEXT,
    "borderColor" TEXT,
    "labelType" TEXT,
    "marketPerimeter" TEXT,
    "discontinuedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TyreVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TyreRace" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TyreRace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BikeBrand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BikeBrand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BikeModel" (
    "id" TEXT NOT NULL,
    "brandId" TEXT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isGeneric" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BikeModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "terrain" "Terrain" NOT NULL,
    "loc" TEXT NOT NULL,
    "distance" TEXT NOT NULL,
    "surface" TEXT NOT NULL,
    "stars" TEXT NOT NULL,
    "blurb" TEXT NOT NULL,
    "elevation" TEXT,
    "difficulty" TEXT,
    "season" TEXT,
    "tyreReason" TEXT,
    "recommendedTyreId" TEXT,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteSegment" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "km" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "RouteSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteWaypoint" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RouteWaypoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Retailer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "distance" TEXT NOT NULL,
    "stock" BOOLEAN NOT NULL DEFAULT true,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "regionKey" TEXT,

    CONSTRAINT "Retailer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostalDepartment" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "regionKey" TEXT NOT NULL,

    CONSTRAINT "PostalDepartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Frequency" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Frequency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteType" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "RouteType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentTyreOption" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "CurrentTyreOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Metric" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Metric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WizardStep" (
    "id" TEXT NOT NULL,
    "block" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "hint" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "WizardStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroStat" (
    "id" TEXT NOT NULL,
    "num" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "HeroStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FooterColumn" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "FooterColumn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FooterLink" (
    "id" TEXT NOT NULL,
    "columnId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "FooterLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteLink" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "SiteLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TyreProduct_slug_key" ON "TyreProduct"("slug");

-- CreateIndex
CREATE INDEX "TyreProduct_terrain_idx" ON "TyreProduct"("terrain");

-- CreateIndex
CREATE INDEX "TyreProduct_isMichelin_idx" ON "TyreProduct"("isMichelin");

-- CreateIndex
CREATE UNIQUE INDEX "TyreVariant_cai_key" ON "TyreVariant"("cai");

-- CreateIndex
CREATE UNIQUE INDEX "TyreVariant_ean_key" ON "TyreVariant"("ean");

-- CreateIndex
CREATE INDEX "TyreVariant_productId_idx" ON "TyreVariant"("productId");

-- CreateIndex
CREATE INDEX "TyreRace_productId_idx" ON "TyreRace"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "BikeBrand_name_key" ON "BikeBrand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BikeBrand_slug_key" ON "BikeBrand"("slug");

-- CreateIndex
CREATE INDEX "BikeModel_brandId_idx" ON "BikeModel"("brandId");

-- CreateIndex
CREATE UNIQUE INDEX "BikeModel_brandId_name_key" ON "BikeModel"("brandId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Region_key_key" ON "Region"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Route_title_key" ON "Route"("title");

-- CreateIndex
CREATE INDEX "Route_regionId_idx" ON "Route"("regionId");

-- CreateIndex
CREATE INDEX "RouteSegment_routeId_idx" ON "RouteSegment"("routeId");

-- CreateIndex
CREATE INDEX "RouteWaypoint_routeId_idx" ON "RouteWaypoint"("routeId");

-- CreateIndex
CREATE INDEX "Retailer_regionKey_idx" ON "Retailer"("regionKey");

-- CreateIndex
CREATE UNIQUE INDEX "PostalDepartment_code_key" ON "PostalDepartment"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Frequency_code_key" ON "Frequency"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RouteType_code_key" ON "RouteType"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Metric_key_key" ON "Metric"("key");

-- CreateIndex
CREATE INDEX "FooterLink_columnId_idx" ON "FooterLink"("columnId");

-- CreateIndex
CREATE INDEX "SiteLink_type_idx" ON "SiteLink"("type");

-- AddForeignKey
ALTER TABLE "TyreVariant" ADD CONSTRAINT "TyreVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "TyreProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TyreRace" ADD CONSTRAINT "TyreRace_productId_fkey" FOREIGN KEY ("productId") REFERENCES "TyreProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BikeModel" ADD CONSTRAINT "BikeModel_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "BikeBrand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_recommendedTyreId_fkey" FOREIGN KEY ("recommendedTyreId") REFERENCES "TyreProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteSegment" ADD CONSTRAINT "RouteSegment_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteWaypoint" ADD CONSTRAINT "RouteWaypoint_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FooterLink" ADD CONSTRAINT "FooterLink_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "FooterColumn"("id") ON DELETE CASCADE ON UPDATE CASCADE;
