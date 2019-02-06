var express = require('express')
var router = express.Router()
var user = require('./user/user.js')
var db_tools = require('./database.js');
var ret = {};

db_tools.connect();

router.use(function timeLog (req, res, next) {
    console.log('Handling request on ' + req.originalUrl + ' -- Actual time:',
        new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));
    next();
})

router.post('/register', function (req, res) {
    user.register(req.body)
    .then(() => ret["success"] = "Compte créé avec succès!")
    .catch(err => ret["error"] = err.message);
    res.status(200).send(JSON.stringify(ret));
})

module.exports = router;
