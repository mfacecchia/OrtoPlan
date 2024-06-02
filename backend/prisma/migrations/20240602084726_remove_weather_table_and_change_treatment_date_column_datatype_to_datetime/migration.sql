/*
  Warnings:

  - You are about to drop the `Weather` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Weather` DROP FOREIGN KEY `Weather_plantationID_fkey`;

-- AlterTable
ALTER TABLE `PlannedTreatment` MODIFY `treatmentDate` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `Weather`;
