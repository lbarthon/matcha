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

router.get('/register', function (req, res) {
    user.register(req.body)
    .then(() => console.log("success"))
    .catch(err => console.log(err.message));
})

module.exports = router;
