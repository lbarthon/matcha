const emitter = require('../../emitter');
const multer = require("multer");
const path = require("path");
const pic_path = './public/pictures/user/';

const storage = multer.diskStorage({
    destination: pic_path,
    filename: function(req, file, callback) {
        callback(null, "Picture-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).single("user_pic");

var conn = null;
emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});

const add = (req, res) => {
    return new Promise((resolve, reject) => {
        // TODO -- DEBUG ÇA DOIT Être éclaté
        console.log(req.file);
        if (!req.file) {
            reject(new Error("picture_add_no_file"));
        } else if (conn) {
            var uid = req.session.uid;
            var filename = "Picture-" + Date.now() + path.extname(file.originalname);
            upload(req, res, err => {
                if (err) {
                    reject(new Error("picture_error_write"))
                } else {
                    conn.query("INSERT INTO pictures (user_id, picture) VALUES (?,?)",
                            [uid, filename], err => {
                        if (err) {
                            // Ptet erreur mais faut le faire -- Si erreur sql delete le fichier
                            unlink(pic_path + filename);
                            reject(new Error("picture_error_insert"));
                        } else {
                            resolve();
                        }
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
