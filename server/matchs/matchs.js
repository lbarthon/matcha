const emitter = require('../emitter');
const get_pop = require('../user/likes/get');
const userUtils = require('../user/utils');
const separator = "#nice|sep#";
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});
/**
 * Basically returns the array of all matches. Sorted in front.
 * @param {*} req 
 */
const matchs = req => {
    return new Promise((resolve, reject) => {
        if (conn) {
            var uid = req.session.uid;
            userUtils.isComplete(uid)
            .then(user => {
                var sex = user.sex;
                var wanted = user.wanted;
                var cond = wanted === 'bisexual' ? 1 : {sex: wanted};
                conn.query("SELECT GROUP_CONCAT(tags.tag SEPARATOR '" + separator + "') AS tags, users.id, \
                    users.username, users.birthdate, users.location, pictures.picture FROM users \
                    INNER JOIN tags ON users.id = tags.user_id \
                    INNER JOIN pictures ON users.id = pictures.user_id AND pictures.main=1 \
                    LEFT JOIN blocked ON users.id = blocked.target_id \
                    WHERE ? AND ? AND ? AND (? OR ?) AND ? AND users.id <> ? AND blocked.target_id IS NULL GROUP BY users.id",
                    [{'users.confirmed': 1}, {'users.perm_level': 0}, cond, {wanted: sex}, {wanted: 'bisexual'}, {'users.banned': 0}, uid], (err, results) => {
                    if (err) {
                        reject(new Error("sql.alert.query"));
                    } else {
                        var promises = results.map(value => {
                            value.tags = value.tags.split(separator);
                            return get_pop(value.id)
                            .then(val => {
                                value.popularity = val;
                                return value;
                            })
                            .catch(() => {
                                value.popularity = "error";
                                return value;
                            });
                        });
                        Promise.all(promises)
                        .then(resolve)
                        .catch(() => {
                            reject(new Error("match.alert.load_error"));
                        });
                    }
                })
            })
            .catch(reject);
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = matchs;