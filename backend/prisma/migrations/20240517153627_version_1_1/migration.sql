/*
  Warnings:

  - You are about to alter the column `userID` on the `Credentials` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(26)`.

*/
-- DropForeignKey
ALTER TABLE `Credentials` DROP FOREIGN KEY `Credentials_userID_fkey`;

-- AlterTable
ALTER TABLE `Credentials` MODIFY `userID` CHAR(26) NOT NULL;

-- AlterTable
ALTER TABLE `Plant_Treatment` MODIFY `treatmentTimesRecurrence` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `Credentials` ADD CONSTRAINT `Credentials_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;
