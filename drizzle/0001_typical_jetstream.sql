CREATE TABLE `members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`companyName` varchar(200) NOT NULL,
	`title` varchar(200) NOT NULL,
	`message` text NOT NULL,
	`photoUrl` varchar(500),
	`category` varchar(50) NOT NULL,
	`committee` varchar(50),
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `members_id` PRIMARY KEY(`id`)
);
