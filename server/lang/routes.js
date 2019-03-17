const express = require('express');
const router = express.Router();
const langs = ['fr', 'en'];
/**
 * Returns user's lang
 */
router.get('/get', (req, res) => {
    var lang = (req.session.lang || "fr");
    res.status(200).json({ 'success' : lang });
})
/**
 * Sets user's lang.
 * Lang must be in langs array in this file.
 */
router.post('/set', (req, res) => {
    if (langs.includes(req.body.lang))
        req.session.lang = req.body.lang;
    var lang = (req.session.lang || "fr");
    res.status(200).json({ 'success' : lang });
})

module.exports = router;
