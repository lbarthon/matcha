const emitter = require('../../emitter');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pic_path = './public/pictures/user/';

const timestamp = Date.now();

const storage = multer.diskStorage({
    destination: pic_path,
    filename: (req, file, callback) => {
        callback(null, "Picture-" + timestamp + file.originalname);
    }
});

const upload = multer({
    storage: storage
}).single("file");

var conn = null;
emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const add = (req, res) => {
    return new Promise((resolve, reject) => {
        if (conn) {
            upload(req, res, err => {
                var file = req.file;
                if (err) {
                    reject(new Error("picture_error_write"))
                } else if (!file) {
                    reject(new Error("picture_add_no_file"));
                } else {
                    var uid = req.session.uid;
                    var filename = "Picture-" + timestamp + file.originalname;
                    var main = 0;
                    conn.query("SELECT * FROM pictures WHERE user_id=?",
                            [uid], (err, result) => {
                        if (err) {
                            reject(new Error("sql.alert.query"));
                        } else if (result.length == 0) {
                            main = 1;
                        }
                        conn.query("INSERT INTO pictures (user_id, picture, main) VALUES (?,?,?)",
                                [uid, filename, main], err => {
                            if (err) {
                                fs.unlink('../../../' + pic_path + filename);
                                reject(new Error("sql.alert.query"));
                            } else {
                                resolve();
                            }
                        });
                    });
                }
            });
        } else {
            reject(new Error("error_sql_undefined"));
        }
    });
}

module.exports = {
    add : add
}
