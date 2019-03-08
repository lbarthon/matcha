const emitter = require('../emitter');
const get_pop = require('../user/likes/get');
const separator = "#nice|sep#";
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const matchs = req => {
    return new Promise((resolve, reject) => {
        if (conn) {
            var uid = req.session.uid;
            conn.query("SELECT GROUP_CONCAT(tags.tag SEPARATOR '" + separator + "') AS tags, users.* \
                FROM users INNER JOIN tags ON users.id = tags.user_id WHERE id=?",
                [uid], (err, result) => {
                if (err) {
                    reject(new Error("sql.alert.query"));
                } else {
                    var user = result[0];
                    var sex = user.sex;
                    var wanted = user.wanted;
                    conn.query("SELECT GROUP_CONCAT(tags.tag SEPARATOR '" + separator + "') AS tags, users.id, \
                        users.username, users.birthdate, users.location, users.description FROM users \
                        INNER JOIN tags ON users.id = tags.user_id \
                        WHERE ? AND ? AND ? AND ? GROUP BY users.id",
                        [{'users.confirmed': 1}, {'users.perm_level': 0}, {sex: wanted}, {wanted: sex}], (err, results) => {
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
                            Promise.all(promises).then(resolve);
                        }
                    })
                }
            });
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = matchs;