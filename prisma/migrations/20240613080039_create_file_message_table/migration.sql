-- CreateTable
CREATE TABLE `FileMessage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `size` VARCHAR(191) NOT NULL,
    `message_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `FileMessage_message_id_key`(`message_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FileMessage` ADD CONSTRAINT `FileMessage_message_id_fkey` FOREIGN KEY (`message_id`) REFERENCES `Message`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
