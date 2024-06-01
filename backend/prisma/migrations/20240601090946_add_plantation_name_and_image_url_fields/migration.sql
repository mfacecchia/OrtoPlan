/*
  Warnings:

  - Added the required column `plantationName` to the `Plantation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Plantation` ADD COLUMN `imageURL` VARCHAR(500) NOT NULL DEFAULT 'plantation.webp',
    ADD COLUMN `plantationName` VARCHAR(191) NOT NULL;
