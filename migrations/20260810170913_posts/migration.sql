CREATE TABLE `posts` (
	`id` integer PRIMARY KEY,
	`slug` text NOT NULL UNIQUE,
	`title` text NOT NULL,
	`handle` text NOT NULL UNIQUE,
	`image` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE INDEX `post_created_at_idx` ON `posts` (`created_at`);