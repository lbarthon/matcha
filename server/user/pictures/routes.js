const express = require('express');
const router = express.Router();
const pictures = require('./pictures');

router.use((req, res, next) => {
    if (req.session.username == undefined || req.session.uid == undefined) {
        res.status(200).json({ 'error' : 'error_not_logged' });
    } else {
        next();
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
    .then(() => {
        res.status(200).json({ 'success' : 'picture.get.success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.post('/add', (req, res) => {
    pictures.add(req, res)
    .then(() => {
        res.status(200).json({ 'success' : 'picture.add.success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.post('/remove', (req, res) => {
    pictures.remove(req.body, req.session.uid)
    .then(() => {
        res.status(200).json({ 'success' : 'picture.remove.success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.post('/main/set', (req, res) => {
    pictures.set_main(req.body, req.session.uid)
    .then(() => {
        res.status(200).json({ 'success' : 'picture.set_main.success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

module.exports = router;
