var express = require('express')
var router = express.Router()
var user = require('./user/user.js')
var db_tools = require('./database.js');

db_tools.connect();

router.use(function timeLog (req, res, next) {
    console.log('Handling request on ' + req.originalUrl + ' -- Actual time:',
        new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));
    next();
})

router.post('/register', (req, res) => {
    user.register(req.body)
    .then(() => {
        var ret = ["success", "Compte créé avec succès!"];
        res.status(200).send(JSON.stringify(ret));
    })
    .catch(err => {
        var ret = ["error", err.message];
        res.status(200).send(JSON.stringify(ret));
    });
})

router.post('/login', (req, res) => {
    user.login(req.body)
    .then(() => {
        var ret = ["success", "Login successfully!"];
        res.status(200).send(JSON.stringify(ret));
    })
    .catch(err => {
        var ret = ["error", err.message];
        res.status(200).send(JSON.stringify(ret));
    });
})

module.exports = router;
