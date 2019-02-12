const express = require('express');
const router = express.Router();
const user = require('./user/user');
const db_tools = require('./database');


db_tools.connect();

router.use((req, res, next) => {
    if (req.is('application/x-www-form-urlencoded') != null) {
        console.log('Handling request on ', req.originalUrl, ' -- Actual time:',
            new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));
        next();
    } else {
        res.status(404).send('<h1 style="text-align: center>Error 404 - Page not found</h1>"')
    }
});

router.post('/register', (req, res) => {
    user.register(req.body)
    .then(() => {
        res.status(200).json({ 'success' : 'register.success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.post('/login', (req, res) => {
    user.login(req.body)
    .then((arr) => {
        req.session.username = arr[0];
        req.session.uid = arr[1];
        req.session.save();
        res.status(200).json({ 'success' : 'login.success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.post('/update', (req, res) => {
    user.update(req.body)
    .then(() => {
        res.status(200).json({ 'success' : 'update.success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.post('/logout', (req, res) => {
    user.logout(req)
    .then(() => {
        res.status(200).json({ 'success' : 'logout.success' });
    })
    .catch(() => {
        res.status(200).json({ 'error' : 'logout.error' });
    });
});

router.post('/logged', (req, res) => {
    user.isLogged(req)
    .then((username) => {
        res.status(200).json({ 'response' : username });
    })
    .catch(() => {
        res.status(200).json({ 'response' : false });
    });
});

module.exports = router;
