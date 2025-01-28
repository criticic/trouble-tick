DROP INDEX "authenticator_credentialID_unique";--> statement-breakpoint
DROP INDEX "trackers_slug_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `events` ALTER COLUMN "timestamp" TO "timestamp" integer NOT NULL DEFAULT (datetime('now', 'UTC'));--> statement-breakpoint
CREATE UNIQUE INDEX `authenticator_credentialID_unique` ON `authenticator` (`credentialID`);--> statement-breakpoint
CREATE UNIQUE INDEX `trackers_slug_unique` ON `trackers` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);