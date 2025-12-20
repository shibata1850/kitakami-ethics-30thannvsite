CREATE TABLE `eventRsvps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`attendance` enum('attend','decline') NOT NULL,
	`affiliation` varchar(100) NOT NULL,
	`position` varchar(100),
	`lastName` varchar(50) NOT NULL,
	`firstName` varchar(50) NOT NULL,
	`email` varchar(320) NOT NULL,
	`message` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `eventRsvps_id` PRIMARY KEY(`id`)
);
