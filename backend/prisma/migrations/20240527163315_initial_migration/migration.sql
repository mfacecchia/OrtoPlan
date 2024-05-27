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
    `userID` CHAR(26) NOT NULL,

    UNIQUE INDEX `Credentials_userID_key`(`userID`),
    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `notificationID` INTEGER NOT NULL AUTO_INCREMENT,
    `message` VARCHAR(191) NOT NULL,
    `notificationType` VARCHAR(191) NOT NULL,
    `notificationIcon` VARCHAR(191) NOT NULL DEFAULT 'warning_green.svg',
    `userID` CHAR(26) NOT NULL,

    PRIMARY KEY (`notificationID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Plantation` (
    `plantationID` INTEGER NOT NULL AUTO_INCREMENT,
    `location` VARCHAR(191) NULL,
    `locationCAP` CHAR(5) NULL,
    `userID` CHAR(26) NOT NULL,

    PRIMARY KEY (`plantationID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Weather` (
    `forecastID` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `date` date NOT NULL,
    `rainMm` DOUBLE NOT NULL,
    `rainProbability` DOUBLE NOT NULL,
    `maxTemp` DOUBLE NOT NULL,
    `minTemp` DOUBLE NOT NULL,
    `windSpeed` DOUBLE NOT NULL,
    `windDirection` VARCHAR(191) NOT NULL,
    `sunrise` time NOT NULL,
    `sundown` time NOT NULL,
    `weatherIcon` VARCHAR(191) NOT NULL,
    `plantationID` INTEGER NOT NULL,

    PRIMARY KEY (`forecastID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Plant` (
    `plantID` INTEGER NOT NULL AUTO_INCREMENT,
    `plantName` VARCHAR(191) NOT NULL,
    `plantFamily` VARCHAR(191) NULL,
    `plantDescription` VARCHAR(191) NULL,
    `scientificName` VARCHAR(191) NOT NULL,
    `imageURL` VARCHAR(191) NOT NULL DEFAULT 'plant.webp',

    PRIMARY KEY (`plantID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlannedTreatment` (
    `userID` CHAR(26) NOT NULL,
    `plantID` INTEGER NOT NULL,
    `treatmentType` VARCHAR(191) NOT NULL,
    `notes` VARCHAR(300) NOT NULL,
    `treatmentDate` date NOT NULL,
    `treatmentRecurrence` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`userID`, `plantID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Plantation_Plant` (
    `plantationID` INTEGER NOT NULL,
    `plantID` INTEGER NOT NULL,

    PRIMARY KEY (`plantationID`, `plantID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Credentials` ADD CONSTRAINT `Credentials_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plantation` ADD CONSTRAINT `Plantation_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Weather` ADD CONSTRAINT `Weather_plantationID_fkey` FOREIGN KEY (`plantationID`) REFERENCES `Plantation`(`plantationID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlannedTreatment` ADD CONSTRAINT `PlannedTreatment_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlannedTreatment` ADD CONSTRAINT `PlannedTreatment_plantID_fkey` FOREIGN KEY (`plantID`) REFERENCES `Plant`(`plantID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plantation_Plant` ADD CONSTRAINT `Plantation_Plant_plantationID_fkey` FOREIGN KEY (`plantationID`) REFERENCES `Plantation`(`plantationID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plantation_Plant` ADD CONSTRAINT `Plantation_Plant_plantID_fkey` FOREIGN KEY (`plantID`) REFERENCES `Plant`(`plantID`) ON DELETE CASCADE ON UPDATE CASCADE;
