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
                reject(new Error("register.alert.username_null"));
            } else if (infos.password == '') {
                reject(new Error("register.alert.password_null"));
            } else if (!String(infos.password).match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[^\w])(?=.{8,})/)) {
                reject(new Error("register.alert.password_regex"));
            } else if (infos.gender == '' || infos.lookingFor == '') {
                reject(new Error("register.alert.genders_null"));
            } else if (infos.repassword != infos.password) {
                reject(new Error("register.alert.password_diff"));
            } else if (!String(infos.email).match(/[\w]+\@[\w]+\.[\.\w]+/i)) {
                reject(new Error("register.alert.email_invalid"));
            } else {
                utils.getIdFromEmail(infos.email).then(() => {
                    reject(new Error("register.alert.email_took"));
                }).catch(() => {
                    utils.getIdFromUsername(infos.name).then(() => {
                        reject(new Error("register.alert.username_took"));
                    }).catch(() => {
                        hash.create(infos.password).then(hashed => {
                            infos.password = hashed;
                            var conf_link = randomstring.generate(80);
                            conn.query("INSERT INTO users (username, email, pwd, \
                                sex, wanted, conf_link) VALUES (?,?,?,?,?,?)",
                                [infos.username, infos.email, infos.password, infos.genre, infos.lookingFor, conf_link], err => {
                                if (err) {
                                    reject(new Error("sql.alert.query"));
                                } else {
                                    // TODO -- SEND MAILS
                                    resolve();
                                }
                            })
                        }).catch(reject);
                    });
                });
            }
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = {
    register : register
}
