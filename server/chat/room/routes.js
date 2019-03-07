const express = require('express');
const router = express.Router();
const room = require('./room');

router.get('/', (req, res) => {
    room.get(req.session.uid)
    .then((resolve) => {
        res.status(200).json({ 'success' : resolve });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.get('/leave/:roomId', (req, res) => {
    room.leave(req.params.roomId, req.session.uid)
    .then((resolve) => {
        res.status(200).json({ 'success' : resolve });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

module.exports = router;
