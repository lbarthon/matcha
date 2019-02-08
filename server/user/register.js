var hash = require('./hash.js');
var emitter = require('../emitter.js');
var randomstring = require('randomstring');
var utils = require('./utils.js');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

function register(infos) {
    return new Promise((resolve, reject) => {
        if (infos.name == '') {
            eject(new Error("username can't be null!"));
        } else if (infos.password == '') {
            reject(new Error("Password can't be null!"));
        } else if (!String(infos.password).match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[^\w])(?=.{8,})/)) {
            reject(new Error("Password must contain a lowercase letter, an uppercase letter, a digit and a special char!"));
        } else if (infos.gender == '' || infos.lookingFor == '') {
            reject(new Error("Genders must be defined!"));
        } else if (infos.repassword != infos.password) {
            reject(new Error("Passwords does not match!"));
        } else if (!String(infos.email).match(/[\w]+\@[\w]+\.[\.\w]+/i)) {
            reject(new Error("Email isn't valid!"));
        } else {
            utils.getIdFromEmail(infos.email).then(() => {
                reject(new Error("A user already has this email!"));
            }).catch(() => {
                utils.getIdFromUsername(infos.name).then(() => {
                    reject(new Error("A user already has this username!"));
                }).catch(() => {
                    hash.create(infos.password).then(hashed => {
                        infos.password = hashed;
                        var conf_link = randomstring.generate(50);
                        conn.query("INSERT INTO users (username, email, pwd, \
                            sex, wanted, conf_link) VALUES (?,?,?,?,?,?)",
                            [infos.name, infos.email, infos.password, infos.genre, infos.lookingFor, conf_link], err => {
                            if (err) {
                                reject(new Error("Error registering your user."));
                            } else {
                                resolve();
                            }
                        })
                    }).catch(reject);
                });
            });
        }
    });
}

module.exports = {
    register : register
}
