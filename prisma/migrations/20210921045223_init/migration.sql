-- DropForeignKey
ALTER TABLE `Branch` DROP FOREIGN KEY `Branch_parent_id_fkey`;

-- AlterTable
ALTER TABLE `Branch` MODIFY `parent_id` INTEGER UNSIGNED;

-- AddForeignKey
ALTER TABLE `Branch` ADD CONSTRAINT `Branch_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
