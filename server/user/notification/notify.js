const Types = require('./types');
const emitter = require('../../emitter');
var conn = null;
const io = require('../../io').get();

emitter.on('dbConnectEvent', (new_conn, err) => {
    if (!err) conn = new_conn;
});
/**
 * Send a notification of type to the user.
 * @param {string} type
 * @param {int} sender
 * @param {int} reciever
 */
const notify = (type, sender, reciever) => {
    switch (type) {
        case Types.LIKE:
            // Todo
            break;
        case Types.VISIT:
            // Todo
            break;
        case Types.MESSAGE:
            // Todo
            break;
        case Types.LIKE_BACK:
            // Todo
            break;
        case Types.MATCH_DISLIKE:
            // Todo
            break;
        default:
            console.log("Notify error : invalid type");
            break;
    }
    io.sockets.in(reciever).emit('new_notification');
}

module.exports = notify;
