CREATE TABLE `officers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`companyName` varchar(200) NOT NULL,
	`position` varchar(100) NOT NULL,
	`committee` varchar(50),
	`message` text,
	`photoUrl` varchar(500),
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `officers_id` PRIMARY KEY(`id`)
);
