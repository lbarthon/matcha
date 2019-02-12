const emitter = require('../../emitter');
const fs = require('fs');
const randomstring = require('randomstring');
var conn = null;

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const add = (infos, uid) => {
    return new Promise((resolve, reject) => {
        if (conn) {
            var b64str = infos.picture;
            var pic = Buffer.from(b64str, 'base64');
            var name = randomstring.generate(100) + '.png';
            var main = (infos.main == 1 || 0);
            fs.writeFile('../../../public/pictures/users/' + name, pic, err => {
                if (err) {
                    reject(new Error("picture.error.write"))
                } else {
                    conn.query("INSERT INTO pictures (main, user_id, picture) VALUES (?,?,?)",
                            [main, uid, name], err => {
                        if (err) {
                            reject(new Error("picture.error.insert"));
                        } else {
                            resolve();
                        }
                    });
                }
            });
        } else {
            reject(new Error("error.sql.undefined"));
        }
    });
}

module.exports = {
    add : add
}
