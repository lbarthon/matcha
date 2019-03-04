const express = require('express');
const router = express.Router();
const db_tools = require('./database');
const user_pictures_routes = require('./user/pictures/routes');
const lang_routes = require('./lang/routes');
const user_routes = require('./user/routes');
const tags_routes = require('./tags/routes');
const chat_routes = require('./chat/routes');
const likes_routes = require('./user/likes/routes');

/*
router.use((req, res, next) => {
    if ((req.is('application/x-www-form-urlencoded') == null && req.method == "POST") || (!req.xhr)) {
        res.status(404).send("<h1 style='text-align:center;'>Error 404 - Page not found</h1>")
    } else {
        next();
    }
});
*/

router.use('/lang', lang_routes);
router.use('/', user_routes);
router.use('/pictures', user_pictures_routes);
router.use('/tags', tags_routes);
router.use('/chat', chat_routes);
router.use('/likes', likes_routes);

db_tools.connect();

module.exports = router;
