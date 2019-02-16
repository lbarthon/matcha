const express = require('express');
const router = express.Router();
const user = require('./user/user');
const db_tools = require('./database');
const pictures_routes = require('./user/pictures/routes');
const lang_routes = require('./lang/routes');

db_tools.connect();

router.use((req, res, next) => {
    if (req.is('application/x-www-form-urlencoded') == null && req.method == "POST") {
        res.status(404).send("<h1 style='text-align:center;'>Error 404 - Page not found</h1>")
    } else {
        next();
    }
});

router.use('/pictures', pictures_routes);
router.use('/lang', lang_routes);

router.post('/register', (req, res) => {
    user.register(req.body)
    .then(() => {
        res.status(200).json({ 'success' : 'register.alert.success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.post('/login', (req, res) => {
    user.login(req)
    .then((arr) => {
        req.session.username = arr[0];
        req.session.uid = arr[1];
        req.session.save();
        res.status(200).json({ 'success' : 'login.alert.success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.post('/update', (req, res) => {
    user.update(req.body, req.session.uid)
    .then(() => {
        res.status(200).json({ 'success' : 'alert.update_success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.get('/logout', (req, res) => {
    user.logout(req)
    .then(() => {
        res.status(200).json({ 'success' : 'alert.logout_success' });
    })
    .catch(() => {
        res.status(200).json({ 'error' : 'alert.logout_error' });
    });
});

router.get('/logged', (req, res) => {
    user.isLogged(req)
    .then((username) => {
        res.status(200).json({ 'response' : username });
    })
    .catch(() => {
        res.status(200).json({ 'response' : false });
    });
});

router.post('/reset/ask', (req, res) => {
    user.reset_ask(req)
    .then(() => {
        res.status(200).json({ 'response' : 'alert.reset_ask_success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

module.exports = router;
