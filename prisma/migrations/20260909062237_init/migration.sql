/*
  Warnings:

  - You are about to drop the column `placesId` on the `placeimage` table. All the data in the column will be lost.
  - You are about to drop the `places` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `placeimage` DROP FOREIGN KEY `PlaceImage_placesId_fkey`;

-- DropForeignKey
ALTER TABLE `places` DROP FOREIGN KEY `Places_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `places` DROP FOREIGN KEY `Places_user_id_fkey`;

-- DropIndex
DROP INDEX `PlaceImage_placesId_fkey` ON `placeimage`;

-- AlterTable
ALTER TABLE `placeimage` DROP COLUMN `placesId`,
    ADD COLUMN `placeId` INTEGER NULL;

-- DropTable
DROP TABLE `places`;

-- CreateTable
CREATE TABLE `Place` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `area` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `category_id` INTEGER NOT NULL,
    `user_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Place` ADD CONSTRAINT `Place_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Place` ADD CONSTRAINT `Place_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`u_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlaceImage` ADD CONSTRAINT `PlaceImage_placeId_fkey` FOREIGN KEY (`placeId`) REFERENCES `Place`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
