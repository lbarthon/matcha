const register = require('./register');
const login = require('./login');
const update = require('./update');
const logout = require('./logout');
const utils = require('./utils');
const reset_ask = require('./reset_ask');
const get_infos = require('./get_infos');

module.exports = {
    register     : register.register,
    login        : login.login,
    update       : update.update,
    logout       : logout.logout,
    isLogged     : utils.isLogged,
    reset_ask    : reset_ask.reset_ask,
    get_infos    : get_infos.get_infos,
    get_infos_id : get_infos.get_infos_id
}
