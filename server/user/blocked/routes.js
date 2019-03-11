const express = require('express');
const router = express.Router();
const userUtils = require('../utils');
const blocked = require('./blocked');

router.use((req, res, next) => {
    if (req.session.username == undefined || req.session.uid == undefined) {
        res.status(200).json({ 'error' : 'alert.not_logged' });
    } else {
        userUtils.isLogged(req)
        .then(() => { next() })
        .catch(() => { res.status(200).json({ 'error' : 'alert.not_logged' }); });
    }
});

router.post('/add', (req, res) => {
    blocked.add(req)
    .then(() => {
        res.status(200).json({ 'success' : 'blocked.add.success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.post('/remove', (req, res) => {
    blocked.remove(req)
    .then(() => {
        res.status(200).json({ 'success' : 'blocked.remove.success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.get('/has_blocked/:id', (req, res) => {
    blocked.has_blocked(req.session.uid, req.params.id)
    .then(resolve => {
        res.status(200).json({ 'success' : resolve });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
})

module.exports = router;
