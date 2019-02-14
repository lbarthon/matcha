const register = require('./register');
const login = require('./login');
const update = require('./update');
const logout = require('./logout');
const utils = require('./utils');
const reset_ask = require('./reset_ask');

module.exports = {
    register  : register.register,
    login     : login.login,
    update    : update.update,
    logout    : logout.logout,
    isLogged  : utils.isLogged,
    reset_ask : reset_ask.reset_ask
}
