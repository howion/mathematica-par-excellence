-- DropIndex
DROP INDEX `Branch_code_key` ON `Branch`;

-- AlterTable
ALTER TABLE `Branch` ALTER COLUMN `code` DROP DEFAULT;
