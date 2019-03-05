const EventEmitter = require('events');
const Emitter = new EventEmitter();
Emitter.setMaxListeners(0);
module.exports = Emitter;
