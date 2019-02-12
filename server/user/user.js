const register = require('./register');
const login = require('./login');
const update = require('./update');
const utils = require('./utils');

module.exports = {
    register : register.register,
    login    : login.login,
    update   : update.update,
    isLogged : utils.isLogged
}
