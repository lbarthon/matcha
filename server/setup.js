const db_tools = require('./database');
const fs = require('fs');

fs.readFile("./server/sql/dump.sql", (err, data) => {
    if (err) exit("Error reading file ./server/sql/dump.sql");
    var queries = String(data).split(";");
    db_tools.connect_no_db((conn, err) => {
        if (err) exit("Error connecting to database.");
        conn.query("CREATE DATABASE IF NOT EXISTS Matcha", err => {
            if (err) exit("Error creating database.");
            db_tools.connect((conn, err) => {
                if (err) exit("Error connecting to database.");
                var promises = queries.map(query => {
                    return new Promise((resolve, reject) => {
                        conn.query(query, err => {
                            if (err) return reject(err);
                            resolve();
                        });
                    });
                });
                Promise.all(promises)
                .then(() => exit("Setup ended correctly."))
                .catch(console.error)
                .finally(() => process.exit(0));
            }, true);
        });
    }, true);
});

const exit = (msg) => {
    console.log("Process terminating.\n" + msg);
    process.exit(0);
}
