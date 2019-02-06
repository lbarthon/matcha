var hash = require('./hash.js');
var emitter = require('../emitter.js')
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

function register(infos) {
  console.log(infos);
    return new Promise((resolve, reject) => {
        if (infos.repassword != infos.password) {
            return reject(new Error("Passwords does not match!"));
        }
        if (!String(infos.email).match(/[a-z\d]+\@[a-z\d]+\.[a-z]+/i)) {
            return reject(new Error("Email isn't valid"));
        }
        hash.create(infos.password).then((hashed) => {
            infos.password = hashed;
        }).catch(reject(new Error("Error hashing the password.")))
        // TODO -- More checks
        conn.query("INSERT USER", err => {
            if (err) reject(new Error("Error querying database."))
        })
        resolve();
    });
}

module.exports = {
    register : register
}
