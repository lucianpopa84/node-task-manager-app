const express = require('express');
const router = new express.Router();
const redirectHome = require('../../middleware/redirectHome');

router.get('/users/signup', redirectHome, async (req, res) => {
    try {
        const isAuthUser = req.signedCookies.session !== undefined;

        res.render('signup', {
            name: 'Lucian Popa',
            isAuthUser
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/users/signup/400', redirectHome, async (req, res) => {
    try {
        const isAuthUser = req.signedCookies.session !== undefined;

        res.render('badsignup', {
            name: 'Lucian Popa',
            isAuthUser
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;