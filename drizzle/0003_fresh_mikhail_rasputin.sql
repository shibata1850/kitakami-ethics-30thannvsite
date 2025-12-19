CREATE TABLE `seminars` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`time` varchar(20) NOT NULL,
	`speaker` varchar(200) NOT NULL,
	`theme` varchar(300) NOT NULL,
	`venue` varchar(300) NOT NULL,
	`description` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `seminars_id` PRIMARY KEY(`id`)
);
