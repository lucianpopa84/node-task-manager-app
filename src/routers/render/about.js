const express = require('express');
const router = new express.Router();

router.get('/about', (req, res) => {
    try {
        const isAuthUser = req.signedCookies.session !== undefined;
       
        res.render('about', {
            name: 'Lucian Popa',
            isAuthUser
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;