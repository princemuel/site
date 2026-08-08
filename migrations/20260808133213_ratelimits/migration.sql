CREATE TABLE `ratelimits` (
	`key` text PRIMARY KEY,
	`count` integer NOT NULL,
	`reset_at` text NOT NULL
);
