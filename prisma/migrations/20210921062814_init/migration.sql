/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Branch` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Branch` ALTER COLUMN `update_time` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `Branch_code_key` ON `Branch`(`code`);
