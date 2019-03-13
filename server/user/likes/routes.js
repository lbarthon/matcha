const express = require('express');
const router = express.Router();
const userUtils = require('../utils');
const likes = require('./likes');

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
    likes.add(req)
    .then(() => {
        res.status(200).json({ 'success' : 'likes.add.success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.post('/remove', (req, res) => {
    likes.remove(req)
    .then(() => {
        res.status(200).json({ 'success' : 'likes.remove.success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.get('/get/:id', (req, res) => {
    likes.get(req.params.id)
    .then(resolve => {
        res.status(200).json({ 'success' : resolve });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.get('/match/:id', (req, res) => {
    likes.match(req.session.uid, req.params.id)
    .then(resolve => {
        res.status(200).json({ 'success' : resolve });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
})

router.get('/has_like/:id', (req, res) => {
    likes.has_like(req.session.uid, req.params.id)
    .then(resolve => {
        res.status(200).json({ 'success' : resolve });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
})

router.get('/has_like_reverse/:id', (req, res) => {
    likes.has_like(req.params.id, req.session.uid)
    .then(resolve => {
        res.status(200).json({ 'success' : resolve });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
})

module.exports = router;
