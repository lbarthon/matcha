const register = require('./register');
const login = require('./login');
const update = require('./update');
const logout = require('./logout');
const utils = require('./utils');
const reset_ask = require('./reset_ask');
const get_infos = require('./get_infos');
const confirm = require('./confirm');
const ban = require('./ban');
const resetpw = require('./resetpw');

module.exports = {
    register     : register,
    login        : login,
    update       : update,
    logout       : logout,
    isLogged     : utils.isLogged,
    reset_ask    : reset_ask,
    get_infos    : get_infos,
    confirm      : confirm,
    ban          : ban,
    resetpw      : resetpw,
}
