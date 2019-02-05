var db_tools = require('./database.js');
var queries = [
    "CREATE TABLE users(\
    id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,\
    username VARCHAR(255) NOT NULL,\
    email VARCHAR(255) NOT NULL,\
    pwd VARCHAR(128) NOT NULL,\
    first VARCHAR(128) NOT NULL,\
    sex VARCHAR(10) NOT NULL,\
    wanted VARCHAR(10) NOT NULL,\
    conf_link VARCHAR(255),\
    confirmed BIT DEFAULT 0\
    )"
];

db_tools.connect_no_db((conn, err) => {
    if (err) exit("Error connecting to database.");
    conn.query("CREATE DATABASE IF NOT EXISTS Matcha", err => {
        if (err) exit("Error creating database.");
        db_tools.connect((conn, err) => {
            if (err) exit("Error connecting to database.");
            var promises = queries.map((query) => {
                return new Promise((resolve, reject) => {
                    conn.query(query, err => {
                        if (err) return reject(err);
                        resolve();
                    });
                });
            });
            Promise.all(promises)
            .then(() => exit("Setup ended correctly."))
            .catch(err => console.error(err))
            .finally(() => process.exit(1));
        }, true);
    });
}, true);

function exit(msg) {
    console.log("Process terminating.\n" + msg);
    process.exit(0);
}
