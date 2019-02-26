CREATE TABLE users(
id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(255) NOT NULL UNIQUE,
email VARCHAR(255) NOT NULL UNIQUE,
pwd VARCHAR(128) NOT NULL,
`name` VARCHAR(128) NOT NULL,
sex VARCHAR(10) NOT NULL,
wanted VARCHAR(10) NOT NULL,
conf_link VARCHAR(255),
confirmed BIT DEFAULT 0,
perm_level BIT DEFAULT 0,
create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
update_time TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE resetpw (
`date` VARCHAR(20) NOT NULL,
link VARCHAR(255) NOT NULL,
`user_id` INT(10) UNSIGNED NOT NULL,
create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (`user_id`) REFERENCES users(id)
);

CREATE TABLE pictures (
id INT(12) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
main BOOLEAN DEFAULT FALSE,
`user_id` INT(10) UNSIGNED NOT NULL,
picture VARCHAR(255) NOT NULL,
FOREIGN KEY (`user_id`) REFERENCES users(id)
);

-- 
-- Add other requests here. Requests must end with a ;
-- 
