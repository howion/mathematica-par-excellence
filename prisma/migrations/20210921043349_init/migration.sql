/*
  Warnings:

  - You are about to drop the column `class_id` on the `Blob` table. All the data in the column will be lost.
  - You are about to drop the column `marks` on the `Blob` table. All the data in the column will be lost.
  - You are about to alter the column `kind` on the `Blob` table. The data in that column could be lost. The data in that column will be cast from `UnsignedTinyInt` to `Enum("Blob_kind")`.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `branch_id` to the `Blob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initiator_id` to the `Blob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secret` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `update_time` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Blob` DROP COLUMN `class_id`,
    DROP COLUMN `marks`,
    ADD COLUMN `branch_id` INTEGER UNSIGNED NOT NULL,
    ADD COLUMN `initiator_id` INTEGER UNSIGNED NOT NULL,
    MODIFY `kind` ENUM('AXIOM', 'DEFINITION', 'THEOREM') NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `avatar` VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN `bio` VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `email` VARCHAR(255) NOT NULL,
    ADD COLUMN `email_verified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `name` VARCHAR(255) NOT NULL,
    ADD COLUMN `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    ADD COLUMN `secret` VARCHAR(255) NOT NULL,
    ADD COLUMN `surname` VARCHAR(255) NOT NULL,
    ADD COLUMN `update_time` DATETIME(3) NOT NULL,
    ADD COLUMN `user_verified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `username` VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE `Activity` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `type` ENUM('BLOB_UPDATE', 'BLOB_CREATE', 'BLOB_DELETE', 'ACCOUNT_UPDATE', 'ACCOUNT_CREATE', 'ACCOUNT_DELETE') NOT NULL,
    `extra` JSON NOT NULL,
    `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mark` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_time` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Branch` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `parent_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BlobToMark` (
    `A` INTEGER UNSIGNED NOT NULL,
    `B` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `_BlobToMark_AB_unique`(`A`, `B`),
    INDEX `_BlobToMark_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Branch` ADD CONSTRAINT `Branch_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `Branch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Blob` ADD CONSTRAINT `Blob_initiator_id_fkey` FOREIGN KEY (`initiator_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Blob` ADD CONSTRAINT `Blob_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `Branch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BlobToMark` ADD FOREIGN KEY (`A`) REFERENCES `Blob`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BlobToMark` ADD FOREIGN KEY (`B`) REFERENCES `Mark`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Blob` RENAME INDEX `Blob.code_unique` TO `Blob_code_key`;
