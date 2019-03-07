const utils = require('./utils');
/**
 * Function that logouts the current user.
 * @param {*} req 
 */
const logout = req => {
    return new Promise((resolve, reject) => {
        utils.isLogged(req)
        .then(() => {
            req.session.username = undefined;
            req.session.uid = undefined;
            resolve();
        })
        .catch(() => {
            reject()
        });
    });
}

module.exports = {
    logout : logout
}
