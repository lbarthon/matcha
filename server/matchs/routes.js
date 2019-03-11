const express = require('express');
const router = express.Router();
const userUtils = require('../user/utils');
const matchs = require('./matchs');

router.use((req, res, next) => {
    if (req.session.username == undefined || req.session.uid == undefined) {
        res.status(200).json({ 'error' : 'alert.not_logged' });
    } else {
        userUtils.isLogged(req)
        .then(() => { next() })
        .catch(() => { res.status(200).json({ 'error' : 'alert.not_logged' }); });
    }
});

router.get('/', (req, res) => {
    matchs(req)
    .then(response => {
        res.status(200).json({ 'success' : response });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

module.exports = router;