/*
  Warnings:

  - You are about to drop the column `path` on the `Blob` table. All the data in the column will be lost.
  - You are about to alter the column `code` on the `Blob` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `VarChar(255)`.
  - A unique constraint covering the columns `[code]` on the table `Blob` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Blob.path_unique` ON `Blob`;

-- AlterTable
ALTER TABLE `Blob` DROP COLUMN `path`,
    MODIFY `code` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Blob.code_unique` ON `Blob`(`code`);
