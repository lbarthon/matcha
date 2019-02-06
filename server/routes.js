var express = require('express')
var router = express.Router()

router.use(function timeLog (req, res, next) {
    console.log('Handling request on ' + req.originalUrl + ' -- Actual time:', 
        new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));
    next();
})

router.post('/register', function (req, res) {
    // req.body.blabla => recup la valeur blabla
})

module.exports = router;
