const express = require('express');
const router = express.Router();
const userUtils = require('../user/utils');
const tags = require('./tags');

router.use((req, res, next) => {
    if (req.session.username == undefined || req.session.uid == undefined) {
        res.status(200).json({ 'error' : 'error_not_logged' });
    } else {
        userUtils.isLogged(req)
        .then(() => { next() })
        .catch(() => { res.status(200).json({ 'error' : 'error_not_logged' }); });
    }
});

router.post('/add', (req, res) => {
    tags.add(req)
    .then(() => {
        res.status(200).json({ 'success' : 'tag.add.success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.post('/remove', (req, res) => {
    tags.remove(req)
    .then(() => {
        res.status(200).json({ 'success' : 'tag.remove.success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.get('/list', (req, res) => {
    tags.list()
    .then(response => {
        res.status(200).json({ 'success' : response });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.get('/get', (req, res) => {
    tags.get(req.session.uid)
    .then(response => {
        res.status(200).json({ 'success' : response });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.get('/get/:id', (req, res) => {
    tags.get(req.params.id)
    .then(response => {
        res.status(200).json({ 'success' : response });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

module.exports = router;
