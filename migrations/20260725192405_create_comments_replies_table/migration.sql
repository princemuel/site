CREATE TABLE `comments` (
	`id` integer PRIMARY KEY,
	`content` text NOT NULL,
	`post_id` integer NOT NULL,
	`actor_id` integer NOT NULL,
	`parent_id` integer,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text,
	CONSTRAINT `fk_comments_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_comments_actor_id_actors_id_fk` FOREIGN KEY (`actor_id`) REFERENCES `actors`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_comments_parent_id_comments_id_fk` FOREIGN KEY (`parent_id`) REFERENCES `comments`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX `comments_post_id_created_at_idx` ON `comments` (`post_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `comments_actor_id_idx` ON `comments` (`actor_id`);--> statement-breakpoint
CREATE INDEX `comments_parent_id_created_at_idx` ON `comments` (`parent_id`,`created_at`);