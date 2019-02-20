const add = require('./add');
const remove = require('./remove');
const set_main = require('./set_main');
const get = require('./get');

module.exports = {
    add      : add.add,
    get      : get.get,
    remove   : remove.remove,
    set_main : set_main.set_main,
}
