const express = require('express');
const router = express.Router();
const randomstring = require('randomstring');
const db_tools = require('./database');
const user_pictures_routes = require('./user/pictures/routes');
const lang_routes = require('./lang/routes');
const user_routes = require('./user/routes');
const tags_routes = require('./tags/routes');
const chat_routes = require('./chat/routes');
const likes_routes = require('./user/likes/routes');
const report_routes = require('./user/reports/routes');

/**
 * Drops queries 
 */
router.use((req, res, next) => {
    if (!req.is('application/x-www-form-urlencoded') && !req.is('multipart/form-data') && req.method == "POST") {
        res.sendFile(path.join(__dirname, 'public/index.html'));
    } else {
        var header_csrf = req.get('CSRF-Token');
        if (header_csrf == req.session.csrf) {
            next();
        } else if (req.session.csrf != undefined) {
            // res.status(404);
            // EN COMM LE TEMPS QUE TU METTES EN PLACE
            console.log("LI CSRF ILÉ PA BON SUR CETTE REQUÊTE");
            next();
        }
    }
});

router.use('/lang', lang_routes);
router.use('/', user_routes);
router.use('/pictures', user_pictures_routes);
router.use('/tags', tags_routes);
router.use('/chat', chat_routes);
router.use('/likes', likes_routes);
router.use('/report', report_routes);

db_tools.connect();

module.exports = router;
