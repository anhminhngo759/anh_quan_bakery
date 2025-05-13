-- Tạo bảng news để lưu trữ tin tức
CREATE TABLE IF NOT EXISTS `news` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `summary` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `image` VARCHAR(255),
  `author_id` INT NOT NULL,
  `is_published` BOOLEAN NOT NULL DEFAULT FALSE,
  `published_at` DATETIME,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `slug_UNIQUE` (`slug` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 