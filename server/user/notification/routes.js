const express = require('express');
const router = express.Router();
const userUtils = require('../utils');
const io = require('../../io').get();
const get = require('./get');
const read = require('./read');
const readAll = require('./read_all');

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
    get(req.session.uid, (err, results) => {
      if (err)
        res.status(200).json({ 'error' : err });
      else
        res.status(200).json({ 'success' : results });
    });
});

router.get('/read/:id', (req, res) => {
    read(req.session.uid, req.params.id, (err, results) => {
      if (err)
        res.status(200).json({ 'error' : err });
      else
        res.status(200).json({ 'success' : true });
    });
});

router.get('/read/', (req, res) => {
    readAll(req.session.uid, (err, results) => {
      if (err)
        res.status(200).json({ 'error' : err });
      else
        res.status(200).json({ 'success' : true });
    });
});

module.exports = router;
