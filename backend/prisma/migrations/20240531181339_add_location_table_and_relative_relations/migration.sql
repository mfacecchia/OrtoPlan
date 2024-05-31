/*
  Warnings:

  - You are about to drop the column `location` on the `Plantation` table. All the data in the column will be lost.
  - You are about to drop the column `locationCAP` on the `Plantation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Plantation` DROP COLUMN `location`,
    DROP COLUMN `locationCAP`,
    ADD COLUMN `locationID` INTEGER NULL;

-- CreateTable
CREATE TABLE `Location` (
    `locationID` INTEGER NOT NULL AUTO_INCREMENT,
    `locationName` VARCHAR(191) NULL,
    `locationCAP` CHAR(5) NULL,
    `locationLat` DOUBLE NOT NULL,
    `locationLong` DOUBLE NOT NULL,

    PRIMARY KEY (`locationID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Plantation` ADD CONSTRAINT `Plantation_locationID_fkey` FOREIGN KEY (`locationID`) REFERENCES `Location`(`locationID`) ON DELETE SET NULL ON UPDATE CASCADE;
