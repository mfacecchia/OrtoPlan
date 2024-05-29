/*
  Warnings:

  - You are about to alter the column `userID` on the `Credentials` table. The data in that column could be lost. The data in that column will be cast from `Char(26)` to `Int`.
  - You are about to alter the column `userID` on the `Notification` table. The data in that column could be lost. The data in that column will be cast from `Char(26)` to `Int`.
  - The primary key for the `PlannedTreatment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `userID` on the `PlannedTreatment` table. The data in that column could be lost. The data in that column will be cast from `Char(26)` to `Int`.
  - You are about to alter the column `userID` on the `Plantation` table. The data in that column could be lost. The data in that column will be cast from `Char(26)` to `Int`.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `userID` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Char(26)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `Credentials` DROP FOREIGN KEY `Credentials_userID_fkey`;

-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_userID_fkey`;

-- DropForeignKey
ALTER TABLE `PlannedTreatment` DROP FOREIGN KEY `PlannedTreatment_userID_fkey`;

-- DropForeignKey
ALTER TABLE `Plantation` DROP FOREIGN KEY `Plantation_userID_fkey`;

-- AlterTable
ALTER TABLE `Credentials` MODIFY `userID` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Notification` MODIFY `userID` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `PlannedTreatment` DROP PRIMARY KEY,
    MODIFY `userID` INTEGER NOT NULL,
    ADD PRIMARY KEY (`userID`, `plantID`);

-- AlterTable
ALTER TABLE `Plantation` MODIFY `userID` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    MODIFY `userID` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`userID`);

-- AddForeignKey
ALTER TABLE `Credentials` ADD CONSTRAINT `Credentials_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plantation` ADD CONSTRAINT `Plantation_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlannedTreatment` ADD CONSTRAINT `PlannedTreatment_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;
