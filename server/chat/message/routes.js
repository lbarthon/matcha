const express = require('express');
const router = express.Router();
//const userUtils = require('../../user/utils');
const message = require('./message');

router.post('/message', (req, res) => {
    message.create(req)
    .then(() => {
        res.status(200).json({ 'success' : 'tag.update.success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.get('/message', (req, res) => {
    message.get(req)
    .then((response) => {
        res.status(200).json({ 'success' : res });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

module.exports = router;
