/*
  Warnings:

  - Added the required column `reason` to the `CarRent` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CarRent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "carId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    CONSTRAINT "CarRent_carId_fkey" FOREIGN KEY ("carId") REFERENCES "plate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CarRent_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CarRent" ("carId", "driverId", "endDate", "id", "startDate") SELECT "carId", "driverId", "endDate", "id", "startDate" FROM "CarRent";
DROP TABLE "CarRent";
ALTER TABLE "new_CarRent" RENAME TO "CarRent";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
