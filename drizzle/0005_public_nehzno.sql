CREATE TABLE `contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('contact','seminar_application') NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`companyName` varchar(200),
	`message` text NOT NULL,
	`status` enum('pending','in_progress','completed') NOT NULL DEFAULT 'pending',
	`reply` text,
	`repliedAt` timestamp,
	`repliedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
