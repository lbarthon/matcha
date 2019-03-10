let io;

const init = server => {
    io = require('socket.io');
    io = io(server);
    return io;
};

const get = () => {
    return io;
};

module.exports = {
  init: init,
  get: get
}
