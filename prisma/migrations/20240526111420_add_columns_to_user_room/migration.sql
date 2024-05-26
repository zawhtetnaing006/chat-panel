/*
  Warnings:

  - You are about to drop the column `updated_at` on the `UserRoom` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `UserRoom` DROP COLUMN `updated_at`,
    ADD COLUMN `last_checked_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `unread_message_count` INTEGER NOT NULL DEFAULT 0;
