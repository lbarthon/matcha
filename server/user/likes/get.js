const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});
/**
 * Returns the number of likes that the most liked user has.
 * @param {*} results 
 */
const get_max_likes = (results) => {
    var max = 0;
    for (var index = 0; index < results.length; index++) {
        if (results[index]['count'] > max) {
            max = results[index]['count'];
        }
    }
    return max;
};
/**
 * Returns uid's likes.
 * @param {*} results 
 * @param {int} uid 
 */
const get_uid_likes = (results, uid) => {
    for (var index = 0; index < results.length; index++) {
        if (results[index]['user'] == uid) {
            return results[index]['count'];
        }
    }
    return 0;
}
/**
 * Returns the popularity of the uid taken in param.
 * @param {int} uid 
 */
const get = uid => {
    return new Promise((resolve, reject) => {
        if (conn) {
            if (uid == undefined || uid == '' || isNaN(uid)) {
                reject(new Error("alert.wrong_id"));
            } else {
                conn.query("SELECT target_id AS user, COUNT(*) AS count FROM likes GROUP BY target_id", (err, results) => {
                    if (err) {
                        reject(new Error("sql.alert.query"));
                    } else {
                        var max = get_max_likes(results);
                        var actual = get_uid_likes(results, uid);
                        if (max == 0) resolve(0);
                        else resolve((actual / max) * 10);
                    }
                });
            }
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = get;
