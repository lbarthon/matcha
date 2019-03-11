const express = require('express');
const router = express.Router();
//const userUtils = require('../../user/utils');
const message = require('./message');

router.post('/', (req, res) => {
    message.create(req.body.roomId, req.body.message, req.session.uid, req.body.toId)
    .then(() => {
        res.status(200).json({ 'success' : true });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.get('/:id', (req, res) => {
    message.get(req.params.id, req.session.uid)
    .then((resolve) => {
        res.status(200).json({ 'success' : resolve });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.get('/read/:roomId', (req, res) => {
    message.read(req.params.roomId, req.session.uid)
    .then((resolve) => {
        res.status(200).json({ 'success' : resolve });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});


module.exports = router;
