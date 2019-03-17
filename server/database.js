const mysql = require('mysql');
const Emitter = require('./emitter');
const host = '51.77.202.107';
const user = 'lbarthon';
const password = '12345678';
const database = 'Matcha';
var conn = null;

/**
 * Globally connects to db (for setup)
 * @param {*} callback 
 * @param {*} force 
 */
const connect_no_db = (callback, force) => {
    if (!conn || force) {
        conn = mysql.createConnection({
            host     : host,
            user     : user,
            password : password
        });
    }
    if (conn.state == "disconnected") {
        conn.connect(err => {
            Emitter.emit('dbConnectEvent', conn, err);
            if (callback) {
                callback(conn, err);
                return;
            }
        });
    }
    callback(conn);
}
/**
 * Connect to the db
 * @param {*} callback 
 * @param {*} force 
 */
const connect = (callback, force) => {
    if (!conn || force) {
        conn = mysql.createConnection({
            host     : host,
            user     : user,
            password : password,
            database : database
        });
    }
    if (conn.state == "disconnected") {
        conn.connect(err => {
            Emitter.emit('dbConnectEvent', conn, err);
            if (callback) {
                callback(conn, err);
            }
        });
    }
}
/**
 * Ends the database connection
 * @param {*} callback 
 */
const end = (callback) => {
    if (conn && conn.state == "authenticated") {
        conn.end(err => {
            Emitter.emit('dbCloseEvent', err);
            if (callback) {
                callback(conn, err);
            }
        });
    }
}

module.exports = {
    connect_no_db : connect_no_db,
    connect       : connect,
    end           : end,
    db_name       : database,
    db_host       : host,
    db_pwd        : password,
    db_user       : user
}
