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

router.post('/register', function (req, res) {
    var rep;
    user.register(req.body)
    .then(() => {
      rep = "kgefhjksad";
    })
    .catch(err => {
      rep = err.message;
    });
    res.status(200).send(rep);
})

module.exports = router;
