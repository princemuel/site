CREATE TABLE `books` (
	`id` text PRIMARY KEY,
	`external_id` text NOT NULL UNIQUE,
	`payload_date` text,
	`pages` integer NOT NULL,
	`authors` text,
	CONSTRAINT `fk_books_id_media_entries_id_fk` FOREIGN KEY (`id`) REFERENCES `media_entries`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `comics` (
	`id` text PRIMARY KEY,
	`external_id` text NOT NULL UNIQUE,
	`payload_date` text,
	`issue_count` integer NOT NULL,
	`publisher` text,
	`illustrators` text,
	CONSTRAINT `fk_comics_id_media_entries_id_fk` FOREIGN KEY (`id`) REFERENCES `media_entries`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `films` (
	`id` text PRIMARY KEY,
	`external_id` text NOT NULL UNIQUE,
	`runtime` integer,
	`companies` text,
	CONSTRAINT `fk_films_id_media_entries_id_fk` FOREIGN KEY (`id`) REFERENCES `media_entries`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `games` (
	`id` text PRIMARY KEY,
	`external_id` text NOT NULL UNIQUE,
	`payload_date` text,
	`platforms` text,
	CONSTRAINT `fk_games_id_media_entries_id_fk` FOREIGN KEY (`id`) REFERENCES `media_entries`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `genres` (
	`id` integer PRIMARY KEY,
	`name` text NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE `media_entries` (
	`id` text PRIMARY KEY,
	`slug` text NOT NULL UNIQUE,
	`title` text NOT NULL,
	`status` text DEFAULT 'planned' NOT NULL,
	`medium` text NOT NULL,
	`cover_url` text NOT NULL,
	`cover_thumb` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `media_entry_genres` (
	`entry_id` text NOT NULL,
	`genre_id` integer NOT NULL,
	CONSTRAINT `media_entry_genres_pk` PRIMARY KEY(`entry_id`, `genre_id`),
	CONSTRAINT `fk_media_entry_genres_entry_id_media_entries_id_fk` FOREIGN KEY (`entry_id`) REFERENCES `media_entries`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_media_entry_genres_genre_id_genres_id_fk` FOREIGN KEY (`genre_id`) REFERENCES `genres`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `music` (
	`id` text PRIMARY KEY,
	`payload_date` text,
	`location` text,
	`artists` text,
	CONSTRAINT `fk_music_id_media_entries_id_fk` FOREIGN KEY (`id`) REFERENCES `media_entries`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `podcasts` (
	`id` text PRIMARY KEY,
	`payload_date` text,
	`permalink` text,
	`network` text,
	`episodes` integer,
	CONSTRAINT `fk_podcasts_id_media_entries_id_fk` FOREIGN KEY (`id`) REFERENCES `media_entries`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `screenplays` (
	`id` text PRIMARY KEY,
	`payload_date` text,
	`based_on` text,
	`authors` text,
	CONSTRAINT `fk_screenplays_id_media_entries_id_fk` FOREIGN KEY (`id`) REFERENCES `media_entries`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_screenplays_based_on_media_entries_id_fk` FOREIGN KEY (`based_on`) REFERENCES `media_entries`(`id`)
);
--> statement-breakpoint
CREATE TABLE `shows` (
	`id` text PRIMARY KEY,
	`external_id` text NOT NULL UNIQUE,
	`payload_date` text,
	`seasons` integer DEFAULT 1 NOT NULL,
	`episodes` integer DEFAULT 1 NOT NULL,
	CONSTRAINT `fk_shows_id_media_entries_id_fk` FOREIGN KEY (`id`) REFERENCES `media_entries`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `theater` (
	`id` text PRIMARY KEY,
	`payload_date` text,
	`location` text,
	`playwright` text,
	CONSTRAINT `fk_theater_id_media_entries_id_fk` FOREIGN KEY (`id`) REFERENCES `media_entries`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX `media_entries_medium_idx` ON `media_entries` (`medium`);--> statement-breakpoint
CREATE INDEX `media_entries_status_idx` ON `media_entries` (`status`);--> statement-breakpoint
CREATE INDEX `media_entry_genre_idx` ON `media_entry_genres` (`genre_id`);