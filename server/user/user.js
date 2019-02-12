const register = require('./register');
const login = require('./login');
const update = require('./update');
const logout = require('./logout');
const utils = require('./utils');

module.exports = {
    register : register.register,
    login    : login.login,
    update   : update.update,
    logout   : logout.logout,
    isLogged : utils.isLogged
}
