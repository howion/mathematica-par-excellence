/*
  Warnings:

  - Made the column `parent_id` on table `Branch` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Branch` DROP FOREIGN KEY `Branch_parent_id_fkey`;

-- AlterTable
ALTER TABLE `Branch` MODIFY `parent_id` INTEGER UNSIGNED NOT NULL;

-- AddForeignKey
ALTER TABLE `Branch` ADD CONSTRAINT `Branch_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `Branch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
