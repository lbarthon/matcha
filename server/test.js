var db_tools = require('./database.js');
var Emitter = require('./emitter.js');

db_tools.connect();

Emitter.on('dbConnectEvent', () => {
    db_tools.conn.query("CREATE DATABASE IF NOT EXISTS Matcha", function (err) {
        if (err) throw err;
    });
    console.log(db_tools.conn.state);
})

console.log("1" + db_tools.conn.state);
