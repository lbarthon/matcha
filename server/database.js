const mysql = require("mysql");
const Emitter = require('./emitter.js');
var conn = mysql.createConnection({
    host     : '51.77.202.107',
    port     : '3306',
    user     : 'lbarthon',
    password : '12345678'
});

function connect() {
    if (conn.state == "disconnected") {
        conn.connect(err => {
            if (err) throw err;
            Emitter.emit('dbConnectEvent');
        });
    }
}

function end() {
    if (conn.state == "authenticated") {
        conn.end(err => {
            if (err) throw err;
            Emitter.emit('dbCloseEvent');
        });
    }
}

module.exports = {
    connect: connect,
    end: end,
    conn: conn
}
