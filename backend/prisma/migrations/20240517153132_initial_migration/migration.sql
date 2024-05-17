-- CreateTable
CREATE TABLE `User` (
    `userID` CHAR(26) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `surname` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`userID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Credentials` (
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `githubID` VARCHAR(191) NULL,
    `googleID` VARCHAR(191) NULL,
    `userID` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Credentials_userID_key`(`userID`),
    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Plantation` (
    `plantationID` INTEGER NOT NULL AUTO_INCREMENT,
    `location` VARCHAR(191) NULL,
    `userID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`plantationID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Plant` (
    `plantID` INTEGER NOT NULL AUTO_INCREMENT,
    `plantName` VARCHAR(191) NOT NULL,
    `plantFamily` VARCHAR(191) NULL,
    `plantDescription` VARCHAR(191) NULL,
    `suggestedTemperature` INTEGER NULL,
    `scientificName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`plantID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Treatment` (
    `treatmentID` INTEGER NOT NULL AUTO_INCREMENT,
    `treatmentType` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`treatmentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Plant_Treatment` (
    `plantTreatmentID` INTEGER NOT NULL AUTO_INCREMENT,
    `treatmentNotes` VARCHAR(191) NULL,
    `treatmentDate` DATETIME(3) NOT NULL,
    `treatmentTimesRecurrence` INTEGER NOT NULL DEFAULT 1,
    `treatmentDaysRecurrence` INTEGER NULL,
    `treatmentID` INTEGER NOT NULL,
    `plantID` INTEGER NOT NULL,

    PRIMARY KEY (`plantTreatmentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Plantation_Plant` (
    `plantationPlantID` INTEGER NOT NULL AUTO_INCREMENT,
    `plantationID` INTEGER NOT NULL,
    `plantID` INTEGER NOT NULL,

    PRIMARY KEY (`plantationPlantID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Credentials` ADD CONSTRAINT `Credentials_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plantation` ADD CONSTRAINT `Plantation_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plant_Treatment` ADD CONSTRAINT `Plant_Treatment_treatmentID_fkey` FOREIGN KEY (`treatmentID`) REFERENCES `Treatment`(`treatmentID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plant_Treatment` ADD CONSTRAINT `Plant_Treatment_plantID_fkey` FOREIGN KEY (`plantID`) REFERENCES `Plant`(`plantID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plantation_Plant` ADD CONSTRAINT `Plantation_Plant_plantationID_fkey` FOREIGN KEY (`plantationID`) REFERENCES `Plantation`(`plantationID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plantation_Plant` ADD CONSTRAINT `Plantation_Plant_plantID_fkey` FOREIGN KEY (`plantID`) REFERENCES `Plant`(`plantID`) ON DELETE CASCADE ON UPDATE CASCADE;
