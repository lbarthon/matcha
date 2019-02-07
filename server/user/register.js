var hash = require('./hash.js');
var emitter = require('../emitter.js');
var randomstring = require('randomstring');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

function register(infos) {
  console.log(infos);
    return new Promise((resolve, reject) => {
        if (infos.name == '') {
            return reject(new Error("Name is null!"));
        } else if (infos.repassword != infos.password) {
            return reject(new Error("Passwords does not match!"));
        } else if (!String(infos.email).match(/[\w]+\@[\w]+\.[\.\w]+/i)) {
            return reject(new Error("Email isn't valid!"));
        } else {
            hash.create(infos.password).then((hashed) => {
                infos.password = hashed;
                var conf_link = randomstring.generate(50);
                conn.query("INSERT INTO users (username, email, pwd, \
                    sex, wanted, conf_link) VALUES (?,?,?,?,?,?)",
                    [infos.name, infos.email, infos.password, "m", "f", conf_link], err => {
                    if (err) {
                        console.error(err);
                        reject(new Error("Error querying database."));
                    }
                    resolve();
                })
            }).catch(
                err => reject(err)
            );
        }
    });
}

module.exports = {
    register : register
}
