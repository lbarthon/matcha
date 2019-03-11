const express = require('express');
const router = express.Router();
const userUtils = require('../user/utils');
const message_routes = require('./message/routes');
const room_routes = require('./room/routes');

router.use((req, res, next) => {
    if (req.session.username == undefined || req.session.uid == undefined) {
        res.status(200).json({ 'error' : 'alert.not_logged' });
    } else {
        userUtils.isLogged(req)
        .then(() => { next() })
        .catch(() => { res.status(200).json({ 'error' : 'alert.not_logged' }); });
    }
});

router.use('/message', message_routes);
router.use('/room', room_routes);

module.exports = router;
