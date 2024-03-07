-- CreateTable
CREATE TABLE "plate" (
    "id" SERIAL NOT NULL,
    "color" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "plate" TEXT NOT NULL,

    CONSTRAINT "plate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarRent" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "carId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "CarRent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plate_plate_key" ON "plate"("plate");

-- AddForeignKey
ALTER TABLE "CarRent" ADD CONSTRAINT "CarRent_carId_fkey" FOREIGN KEY ("carId") REFERENCES "plate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarRent" ADD CONSTRAINT "CarRent_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
