const express = require('express');
const router = express.Router();

router.get('/get', (req, res) => {
    lang = (req.session.lang || "fr");
    res.status(200).json({ "lang" : lang });
})

router.post('/set', (req, res) => {
    req.session.lang = req.body.lang;
    lang = (req.session.lang || "fr");
    res.status(200).json({ "lang" : lang });
})

module.exports = router;
