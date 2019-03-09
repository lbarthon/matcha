const hash = require('./hash');
const emitter = require('../emitter');
const utils = require('./utils');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
var conn = null;

var transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail'
});

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});
/**
 * Function that registers a new user.
 * @param {req.body} infos 
 */
const register = req => {
    var infos = req.body;
    utils.areInfosClean(infos, 'users');
    return new Promise((resolve, reject) => {
        if (conn) {
            if (infos.firstname == '' || infos.lastname == '') {
                reject(new Error("register.alert.name_null"))
            } else if (infos.username == '') {
                reject(new Error("register.alert.username_null"));
            } else if (infos.password == '') {
                reject(new Error("register.alert.password_null"));
            } else if (!String(infos.pwd).match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[^\w])(?=.{8,})/)) {
                reject(new Error("register.alert.password_regex"));
            } else if (infos.gender == '' || infos.lookingFor == '') {
                reject(new Error("register.alert.genders_null"));
            } else if (infos.repassword != infos.pwd) {
                reject(new Error("register.alert.password_diff"));
            } else if (infos.birthdate == '') {
                reject(new Error("register.alert.birthdate_null"));
            } else if (!String(infos.email).match(/[\w]+\@[\w]+\.[\.\w]+/i)) {
                reject(new Error("register.alert.email_invalid"));
            } else if (!String(infos.location).match(/[\-\d\.]+\;[\-\d\.]+/)) {
                reject(new Error("register.alert.location_invalid"));
            } else {
                utils.getIdFromEmail(infos.email).then(() => {
                    reject(new Error("register.alert.email_took"));
                }).catch(() => {
                    utils.getIdFromUsername(infos.username).then(() => {
                        reject(new Error("register.alert.username_took"));
                    }).catch(() => {
                        hash.create(infos.pwd).then(hashed => {
                            infos.pwd = hashed;
                            var conf_link = randomstring.generate(80);
                            conn.query("INSERT INTO users (username, email, pwd, firstname, lastname,\
                                    sex, wanted, conf_link, birthdate, description, location) \
                                    VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                                    [infos.username, infos.email, infos.pwd, infos.firstname, infos.lastname, infos.sex, infos.wanted,
                                        conf_link, infos.birthdate, infos.description, infos.location], err => {
                                if (err) {
                                    reject(new Error("sql.alert.query"));
                                } else {
                                    let mailOptions = {
                                        from: 'no-reply@barthonet.ovh',
                                        to: infos.email,
                                        subject: "Matcha - Confirm your email",
                                        text: "Hey, confirm your account here !\n\n\t" + req.protocol + "://" + req.get('host') + "/confirm/" + conf_link + " !\n\nSee you soon on matcha!",
                                        html: "<p>Hey, confirm your account here !<br><br>\t" + req.protocol + "://" + req.get('host') + "/confirm/" + conf_link + " !<br><br>See you soon on matcha!</p>"
                                    };
                                    transporter.sendMail(mailOptions)
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

module.exports = register;