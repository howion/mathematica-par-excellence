/*
  Warnings:

  - You are about to drop the column `user_verified` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Branch` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Mark` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Branch` ADD COLUMN `code` VARCHAR(255) NOT NULL DEFAULT 's',
    ADD COLUMN `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `update_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `User` DROP COLUMN `user_verified`;

-- CreateIndex
CREATE UNIQUE INDEX `Branch_code_key` ON `Branch`(`code`);

-- CreateIndex
CREATE UNIQUE INDEX `Mark_name_key` ON `Mark`(`name`);
