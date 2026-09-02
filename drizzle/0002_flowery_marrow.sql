CREATE TABLE `staff_credentials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`email` varchar(320) NOT NULL,
	`password_hash` varchar(512) NOT NULL,
	`failed_login_count` int NOT NULL DEFAULT 0,
	`locked_until` timestamp,
	`password_changed_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `staff_credentials_id` PRIMARY KEY(`id`),
	CONSTRAINT `staff_credentials_user_id_unique` UNIQUE(`user_id`),
	CONSTRAINT `staff_credentials_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `staff_credentials` ADD CONSTRAINT `staff_credentials_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;