const emitter = require('../../emitter');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

/**
 * Adds a report. Takes in body those params :
 * req.body.target = target id
 * req.body.text = report text
 * @param {*} req
 */
const add = req => {
    var infos = req.body;
    var uid = req.session.uid;
    return new Promise((resolve, reject) => {
        if (conn) {
            if (infos.target == undefined || infos.target == '' || isNaN(infos.target)) {
                reject(new Error("error_wrong_id"));
            } else if (infos.text == undefined || infos.text == '') {
                reject(new Error("user.alert.report_text"));
            } else {
                conn.query("INSERT INTO reports (user_id, target_id, report) VALUES (?,?,?)", [uid, infos.target, infos.text], err => {
                    if (err) {
                        reject(new Error("sql.alert.query"));
                    } else {
                        resolve();
                    }
                });
            }
        } else {
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = add;
