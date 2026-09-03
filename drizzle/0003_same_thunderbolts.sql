ALTER TABLE `bookings` ADD `scope_selections` json;--> statement-breakpoint
ALTER TABLE `bookings` ADD `estimate_requires_review` boolean DEFAULT false NOT NULL;