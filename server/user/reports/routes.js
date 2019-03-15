const express = require('express');
const router = express.Router();
const userUtils = require('../utils');
const reports = require('./reports');

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
    reports.get(req)
    .then(response => {
        res.status(200).json({ 'success' : response });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.post('/add', (req, res) => {
    reports.add(req)
    .then(() => {
        res.status(200).json({ 'success' : 'user.alert.report_success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.post('/del', (req, res) => {
    reports.del(req)
    .then(() => {
        res.status(200).json({ 'success' : 'admin.alert.report_delete_success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

module.exports = router;
