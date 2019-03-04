CREATE TABLE users(
id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(255) NOT NULL,
lastname VARCHAR(128) NOT NULL,
firstname VARCHAR(128) NOT NULL,
birthdate VARCHAR(128) NOT NULL,
email VARCHAR(255) NOT NULL,
pwd VARCHAR(128) NOT NULL,
sex VARCHAR(10) NOT NULL,
wanted VARCHAR(10) NOT NULL,
`description` TEXT,
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

CREATE TABLE likes (
`user_id` INT(10) UNSIGNED NOT NULL,
`target_id` INT(10) UNSIGNED NOT NULL,
FOREIGN KEY (`user_id`) REFERENCES users(id),
FOREIGN KEY (`target_id`) REFERENCES users(id)
);

CREATE TABLE reports (
`user_id` INT(10) UNSIGNED NOT NULL,
`target_id` INT(10) UNSIGNED NOT NULL,
report TEXT NOT NULL,
FOREIGN KEY (`user_id`) REFERENCES users(id),
FOREIGN KEY (`target_id`) REFERENCES users(id)
);

CREATE TABLE blocked (
`user_id` INT(10) UNSIGNED NOT NULL,
`target_id` INT(10) UNSIGNED NOT NULL,
FOREIGN KEY (`user_id`) REFERENCES users(id),
FOREIGN KEY (`target_id`) REFERENCES users(id)
);

CREATE TABLE pictures (
id INT(12) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
main BOOLEAN DEFAULT FALSE,
`user_id` INT(10) UNSIGNED NOT NULL,
picture VARCHAR(255) NOT NULL,
create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (`user_id`) REFERENCES users(id)
);

CREATE TABLE tags (
`tag` VARCHAR(255) NOT NULL,
`user_id` INT(10) UNSIGNED NOT NULL,
create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (`user_id`) REFERENCES users(id)
);

CREATE TABLE chat_rooms (
`id_user1` INT(10) UNSIGNED NOT NULL,
`id_user2` INT(10) UNSIGNED NOT NULL,
create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (`id_u1`) REFERENCES users(id),
FOREIGN KEY (`id_u2`) REFERENCES users(id)
)

CREATE TABLE chat_messages (
`id_room` INT(10) UNSIGNED NOT NULL,
`id_from` INT(10) UNSIGNED NOT NULL,
`read` BIT DEFAULT 0,
`message` TEXT,
create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (`id_room`) REFERENCES rooms(id),
FOREIGN KEY (`id_from`) REFERENCES users(id)
)

INSERT INTO users (username, lastname, firstname, birthdate, email, pwd, sex, wanted, confirmed, perm_level)
VALUES ('admin', 'admin', 'admin', '01/01/1970', 'admin@admin.admin', '$2b$10$U9LU5mrIydb0MII79M0tbOXttYx1/oo.1UUBgKT2Y9a2U7VfYNx5a', 'Male', 'Female', 1, 1);

--
-- Add other requests here. Requests must end with a ;
--
