const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const get_max_likes = (results) => {
    var max = 0;
    for (var index = 0; index < results.length; index++) {
        if (results[index]['count'] > max) {
            max = results[index]['count'];
        }
    }
    return max;
};

const get_uid_likes = (results, uid) => {
    for (var index = 0; index < results.length; index++) {
        if (results[index]['user'] == uid) {
            return results[index]['count'];
        }
    }
    return 0;
}

const get = (uid) => {
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.query("SELECT target_id AS user, COUNT(*) AS count FROM likes GROUP BY target_id", (err, results) => {
                if (err) {
                    reject(new Error("sql.alert.query"));
                } else {
                    var max = get_max_likes(results);
                    var actual = get_uid_likes(results, uid);
                    resolve((actual / max) * 10);
                }
            });
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = get;
