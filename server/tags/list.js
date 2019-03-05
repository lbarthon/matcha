const emitter = require('../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

/**
 * Return the list of all used tags.
 */
const list = () => {
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.query("SELECT DISTINCT tag FROM tags", (err, results) => {
                if (err) {
                    reject(new Error("sql.alert.query"));
                } else if (results.length > 0) {
                    resolve(results);
                } else {
                    reject(new Error("tag.list.none"));
                }
            });
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = list;
