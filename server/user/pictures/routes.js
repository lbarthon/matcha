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

// TODO -- TEST & DEBUG

// router.post('/add', (req, res) => {
//     pictures.add(req.body, req.session.uid)
//     .then(() => {
//         res.status(200).json({ 'success' : 'picture.add.success' });
//     })
//     .catch(err => {
//         res.status(200).json({ 'error' : err.message });
//     });
// });

// router.post('/remove', (req, res) => {
//     pictures.add(req.body, req.session.uid)
//     .then(() => {
//         res.status(200).json({ 'success' : 'picture.remove.success' });
//     })
//     .catch(err => {
//         res.status(200).json({ 'error' : err.message });
//     });
// });

// router.post('/set_main', (req, res) => {
//     pictures.set_main(req.body, req.session.uid)
//     .then(() => {
//         res.status(200).json({ 'success' : 'picture.set_main.success' });
//     })
//     .catch(err => {
//         res.status(200).json({ 'error' : err.message });
//     });
// });


module.exports = router;
