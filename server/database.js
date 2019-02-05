const mysql = require("mysql");
const Emitter = require('./emitter.js');
var conn = null;
var host = '51.77.202.107';
var user = 'lbarthon';
var password = '12345678';
var database = 'Matcha';

function connect_no_db(callback, force) {
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
            }
        });
    }
}

function connect(callback, force) {
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

function end(callback) {
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
    connect_no_db: connect_no_db,
    connect: connect,
    end: end,
}
