/*
  Warnings:

  - You are about to alter the column `userID` on the `Plantation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(26)`.

*/
-- DropForeignKey
ALTER TABLE `Plantation` DROP FOREIGN KEY `Plantation_userID_fkey`;

-- AlterTable
ALTER TABLE `Plant_Treatment` MODIFY `treatmentTimesRecurrence` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `Plantation` MODIFY `userID` CHAR(26) NOT NULL;

-- AddForeignKey
ALTER TABLE `Plantation` ADD CONSTRAINT `Plantation_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;
