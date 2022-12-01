-- CreateTable
CREATE TABLE `Todo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `local` VARCHAR(8) NOT NULL,
    `timezone` VARCHAR(16) NOT NULL,
    `finish_date` DATETIME(3) NOT NULL,
    `finish_date_obj` JSON NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `is_finish` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
