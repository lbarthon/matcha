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
 * Function that sends a mail to reset user's password.
 * @param {*} req
 */
const reset_ask = req => {
    return new Promise((resolve, reject) => {
        if (conn) {
            var infos = req.body;
            if (!String(infos.email).match(/[\w]+\@[\w]+\.[\.\w]+/i)) {
                reject(new Error("register.alert.email_invalid"));
            } else {
                utils.getIdFromEmail(infos.email)
                .then(uid => {
                    var conf_link = randomstring.generate(80);
                    conn.query("INSERT INTO resetpw (link, user_id) VALUES (?,?)",
                            [conf_link, uid], (err) => {
                        if (err) {
                            reject(new Error("sql.alert.query"));
                        } else {
                            let mailOptions = {
                                from: 'no-reply@barthonet.ovh',
                                to: infos.email,
                                subject: "Matcha - Password reset",
                                text: "Hey, reset your password here !\n\n\t" + req.protocol + "://" + req.get('host') + "/resetpw/" + conf_link + " !\n\nSee you soon  on matcha!",
                                html: "<p>Hey, reset your password here !<br><br><a href='" + req.protocol + "://" + req.get('host') + "/resetpw/" + conf_link + "'>Click me</a><br><br>See you soon on matcha!</p>"
                            };
                            transporter.sendMail(mailOptions)
                            resolve();
                        }
                    })
                })
                .catch(reject);
            }

        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = reset_ask;
