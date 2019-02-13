const express = require('express');
const router = express.Router();

router.post('get', (req, res) => {
    lang = (req.session.lang || "fr");
    res.send(200).json({ "lang" : lang });
})

router.post('get', (req, res) => {
    req.session.lang = req.body.lang;
    lang = (req.session.lang || "fr");
    res.send(200).json({ "lang" : lang });
})

module.exports = router;
