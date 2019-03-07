const express = require('express');
const router = express.Router();
const user = require('./user');

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
    user.update(req, req.session.uid)
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
    .then((resolve) => {
        res.status(200).json({ 'success' : resolve });
    })
    .catch(() => {
        res.status(200).json({ 'success' : resolve });
    });
});

router.get('/user/current', (req, res) => {
    user.get_infos(req)
    .then((resolve) => {
        res.status(200).json({ 'success' : resolve });
    })
    .catch((err) => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.get('/user/:id', (req, res) => {
    user.get_infos_id(req.params.id)
    .then((resolve) => {
        res.status(200).json({ 'success' : resolve });
    })
    .catch((err) => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.post('/reset/ask', (req, res) => {
    user.reset_ask(req)
    .then(() => {
        res.status(200).json({ 'success' : 'alert.reset_ask_success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

module.exports = router;
