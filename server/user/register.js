const hash = require('./hash');
const emitter = require('../emitter');
const utils = require('./utils');
const randomstring = require('randomstring');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const register = (infos) => {
    utils.areInfosClean(infos, 'users');
    return new Promise((resolve, reject) => {
        if (conn) {
            if (infos.username == '') {
                reject(new Error("error.null.username"));
            } else if (infos.password == '') {
                reject(new Error("error.null.password"));
            } else if (!String(infos.password).match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[^\w])(?=.{8,})/)) {
                reject(new Error("register.password.regex"));
            } else if (infos.gender == '' || infos.lookingFor == '') {
                reject(new Error("error.null.genders"));
            } else if (infos.repassword != infos.password) {
                reject(new Error("register.repassword.diff"));
            } else if (!String(infos.email).match(/[\w]+\@[\w]+\.[\.\w]+/i)) {
                reject(new Error("register.invalid.email"));
            } else {
                utils.getIdFromEmail(infos.email).then(() => {
                    reject(new Error("register.email.took"));
                }).catch(() => {
                    utils.getIdFromUsername(infos.name).then(() => {
                        reject(new Error("register.username.took"));
                    }).catch(() => {
                        hash.create(infos.password).then(hashed => {
                            infos.password = hashed;
                            var conf_link = randomstring.generate(50);
                            conn.query("INSERT INTO users (username, email, pwd, \
                                sex, wanted, conf_link) VALUES (?,?,?,?,?,?)",
                                [infos.username, infos.email, infos.password, infos.genre, infos.lookingFor, conf_link], err => {
                                if (err) {
                                    reject(new Error("error.sql.query"));
                                } else {
                                    resolve();
                                }
                            })
                        }).catch(reject);
                    });
                });
            }
        } else {
            reject(new Error("error.sql.undefined"));
        }
    });
}

module.exports = {
    register : register
}
