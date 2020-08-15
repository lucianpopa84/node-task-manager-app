const express = require('express');
const router = new express.Router();
const redirectLogin = require('../../middleware/redirectLogin');

router.get('/', redirectLogin, async (req, res) => {
    try {
        res.redirect('/tasks?limit=10');
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;