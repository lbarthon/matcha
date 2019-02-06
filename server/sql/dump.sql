CREATE TABLE users(
id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL,
pwd VARCHAR(128) NOT NULL,
first VARCHAR(128) NOT NULL,
sex VARCHAR(10) NOT NULL,
wanted VARCHAR(10) NOT NULL,
conf_link VARCHAR(255),
confirmed BIT DEFAULT 0
);

-- 
-- Add other requests here. Requests must end with a ;
-- 
