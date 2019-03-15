const express = require('express');
const router = express.Router();
const pictures = require('./pictures');
const userUtils = require('../utils');

router.use((req, res, next) => {
    if (req.session.username == undefined || req.session.uid == undefined) {
        res.status(200).json({ 'error' : 'alert.not_logged' });
    } else {
        userUtils.isLogged(req)
        .then(() => { next() })
        .catch(() => { res.status(200).json({ 'error' : 'alert.not_logged' }); });
    }
});

router.get('/get', (req, res) => {
    pictures.get(req.session.uid)
    .then(resolve => {
        res.status(200).json({ 'success' : resolve });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.get('/get/:id', (req, res) => {
    pictures.get(req.params.id)
    .then(resolve => {
        res.status(200).json({ 'success' : resolve });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.post('/add', (req, res) => {
    pictures.add(req, res)
    .then(() => {
        res.status(200).json({ 'success' : 'upload.alert.add_success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.post('/remove', (req, res) => {
    pictures.remove(req.body, req.session.uid)
    .then(() => {
        res.status(200).json({ 'success' : 'upload.alert.remove_success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.post('/main/set', (req, res) => {
    pictures.set_main(req.body, req.session.uid)
    .then(() => {
        res.status(200).json({ 'success' : 'upload.alert.set_main_success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

module.exports = router;
