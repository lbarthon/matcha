const express = require('express');
const router = express.Router();
const user = require('./user');
const notify = require('./notification/notify');

router.post('/register', (req, res) => {
    user.register(req)
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
        req.session.perm_level = arr[2] == 1 ? 1 : 0;
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
        res.status(200).json({ 'success' : 'update.alert.success' });
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
    user.isLogged(req, true)
    .then(resolve => {
        res.status(200).json({ 'success' : resolve });
    })
    .catch(response => {
        res.status(200).json({ 'success' : response });
    });
});

router.get('/user/current', (req, res) => {
    user.get_infos(req.session.uid)
    .then((resolve) => {
        res.status(200).json({ 'success' : resolve });
    })
    .catch((err) => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.post('/confirm', (req, res) => {
    user.confirm(req)
    .then(() => {
        res.status(200).json({ 'success' : 'confirm.alert.success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    })
});

router.post('/reset', (req, res) => {
    user.resetpw(req)
    .then(() => {
        res.status(200).json({ 'success' : 'resetpw.alert.success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    })
});

router.get('/user/:id', (req, res) => {
    user.get_infos(req.params.id, req.session.uid)
    .then((resolve) => {
        notify('visit', req.session.uid, req.params.id);
        res.status(200).json({ 'success' : resolve });
    })
    .catch((err) => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.post('/reset/ask', (req, res) => {
    user.reset_ask(req)
    .then(() => {
        res.status(200).json({ 'success' : 'resetpw.alert.ask.success' });
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
});

router.post('/ban', (req, res) => {
    user.ban(req)
    .then(ret => {
        if (ret) {
            res.status(200).json({ 'success' : 'alert.report_ban_success' });
        } else {
            res.status(200).json({ 'error' : 'alert.report_ban_already' });
        }
    })
    .catch(err => {
        res.status(200).json({ 'error' : err.message });
    });
})

module.exports = router;
