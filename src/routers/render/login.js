const express = require('express');
const router = new express.Router();
const redirectHome = require('../../middleware/redirectHome');

router.get('/users/login', redirectHome, async (req, res) => {
    try {
        const isAuthUser = req.signedCookies.session !== undefined;

        res.render('login', {
            name: 'Lucian Popa',
            isAuthUser
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/users/login/400', redirectHome, async (req, res) => {
    try {
        const isAuthUser = req.signedCookies.session !== undefined;

        res.render('badlogin', {
            name: 'Lucian Popa',
            isAuthUser
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;