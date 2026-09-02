CREATE TABLE `booking_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`booking_id` int NOT NULL,
	`actor` enum('customer','system','staff') NOT NULL DEFAULT 'system',
	`title` varchar(180) NOT NULL,
	`detail` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `booking_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`booking_code` varchar(32) NOT NULL,
	`customer_id` int NOT NULL,
	`service` varchar(120) NOT NULL,
	`title` varchar(180) NOT NULL,
	`customer_request` text NOT NULL,
	`status` enum('requested','scheduled','in_progress','completed','cancelled') NOT NULL DEFAULT 'requested',
	`payment_status` enum('pending','authorized','paid','refunded') NOT NULL DEFAULT 'pending',
	`scheduled_for` timestamp,
	`time_window` varchar(80),
	`address` text,
	`quoted_cents` int NOT NULL,
	`provider_name` varchar(160),
	`provider_eta` varchar(80),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`),
	CONSTRAINT `bookings_booking_code_unique` UNIQUE(`booking_code`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
ALTER TABLE `booking_events` ADD CONSTRAINT `booking_events_booking_id_bookings_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_customer_id_users_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;