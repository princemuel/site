CREATE TABLE `actors` (
	`id` integer PRIMARY KEY,
	`name` text,
	`handle` text NOT NULL UNIQUE,
	`image` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
