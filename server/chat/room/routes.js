const express = require('express');
const router = express.Router();
//const userUtils = require('../user/utils');
const room = require('./room');

router.get('/room', (req, res) => {
    room.get(req.session.uid)
    .then((response) => {
        res.status(200).json({ 'success' : res });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

module.exports = router;
