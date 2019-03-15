const emitter = require('../../emitter');
const multer = require('multer');
const fs = require('fs');
const pic_path = './public/pictures/user/';
const timestamp = Date.now();

/**
 * Shortens the name of the picture if it's greater than 200 chars, so it fits in the db.
 * @param {string} name
 */
const niceName = name => {
    var split = name.split(".");
    return name.slice(0, 200) + "." + split[split.length - 1];
};

const storage = multer.diskStorage({
    destination: pic_path,
    filename: (req, file, callback) => {
        callback(null, "Picture-" + timestamp + '-' + niceName(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).single("file");

var conn = null;
emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

/**
 * Adds a picture to the session user profile.
 * @param {*} req
 * @param {*} res
 */
const add = (req, res) => {
    return new Promise((resolve, reject) => {
        if (conn) {
            upload(req, res, err => {
                var file = req.file;
                if (err) {
                    reject(new Error("upload.alert.write"))
                } else if (!file) {
                    reject(new Error("upload.alert.no_file"));
                } else {
                  console.log(file);
                    var uid = req.session.uid;
                    var filename = "Picture-" + timestamp + '-' + niceName(file.originalname);
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
            reject(new Error("sql.alert.undefined"));
        }
    });
}

module.exports = {
    add : add
}
